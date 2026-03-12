// src/emulator/detokenize.ts
//
// BASIC program detokenizer for the FX-870P / VX-4.
//
// The calculator stores up to 10 BASIC programs (P0–P9) in RAM.
// Each program is a sequence of tokenized lines terminated by a zero byte.
//
// ── Memory layout ──────────────────────────────────────────────────────────
//
// File Address Table at RAM 0x18A7 (physical 0x118A7):
//   11 consecutive 16-bit LE pointers (one per file boundary).
//   P(n) occupies RAM from pointer[n] to pointer[n+1].
//   Each pointer is a 16-bit logical RAM address (add 0x10000 for physical).
//
// ── BASIC line format ──────────────────────────────────────────────────────
//
// Each line in a program file:
//   Byte 0   : record length N (does NOT count itself)
//   Byte 1-2 : line number (16-bit LE)
//   Byte 3..N: tokenized body
//   Byte N   : 0x00 terminator (included in N)
//
// The tokenized body uses these encodings:
//   0x00        end of line (implicit from length)
//   0x01        colon ':'  (statement separator)
//                — but if followed by 0x07 0x48, suppress the colon (hidden ELSE)
//   0x02        apostrophe "'" (REM shorthand)
//   0x03        binary line-number reference (next 2 bytes = 16-bit LE line number)
//   0x04–0x07   keyword prefix — next byte is keyword code (0x47–0xC7)
//   0x20–0x7F   literal ASCII character
//   other       emitted as [XX] hex escape

import { readRamByte } from './emulator.js';
import { casioToUnicode } from './casio-ascii.js';
import {
  PREFIXES, HYPER_MAP,
  RAM_BASE, FILE_TABLE, NUM_SLOTS,
} from './basic-tokens.js';

// Re-export constants and types so existing imports still work
export { RAM_BASE, FILE_TABLE, NUM_SLOTS } from './basic-tokens.js';
export { PREFIX4, PREFIX5, PREFIX6, PREFIX7, PREFIXES } from './basic-tokens.js';

// ── RAM helpers ────────────────────────────────────────────────────────────

export function readWord(physAddr: number): number {
  return readRamByte(physAddr) | (readRamByte(physAddr + 1) << 8);
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface BasicLine {
  num: number;   // line number (1–65535)
  text: string;  // detokenized source text
}

export interface BasicProgram {
  slot: number;       // 0–9 for P0–P9
  lines: BasicLine[];
}

/** Read all non-empty BASIC program slots from RAM. */
export function readBasicPrograms(): BasicProgram[] {
  const programs: BasicProgram[] = [];
  for (let slot = 0; slot < NUM_SLOTS; slot++) {
    const start = readWord(FILE_TABLE + slot * 2);
    const end   = readWord(FILE_TABLE + (slot + 1) * 2);
    if (start === 0 || end === 0 || end <= start) continue;
    const physStart = RAM_BASE + start;
    const physEnd   = RAM_BASE + end;
    const lines = readProgramLines(physStart, physEnd);
    if (lines.length > 0) {
      programs.push({ slot, lines });
    }
  }
  return programs;
}

/** Debug: dump the file address table and first N bytes of each slot. */
export function debugFileTable(): string {
  const lines: string[] = [];
  lines.push('File Address Table at 0x18A7:');
  for (let i = 0; i <= NUM_SLOTS; i++) {
    const ptr = readWord(FILE_TABLE + i * 2);
    lines.push(`  [${i}] = 0x${ptr.toString(16).padStart(4, '0')}`);
  }
  for (let slot = 0; slot < NUM_SLOTS; slot++) {
    const start = readWord(FILE_TABLE + slot * 2);
    const end   = readWord(FILE_TABLE + (slot + 1) * 2);
    if (start === 0 || end === 0 || end <= start) continue;
    const physStart = RAM_BASE + start;
    const len = Math.min(end - start, 64);
    const bytes: string[] = [];
    for (let j = 0; j < len; j++) {
      bytes.push(readRamByte(physStart + j).toString(16).padStart(2, '0'));
    }
    lines.push(`P${slot} [0x${start.toString(16)}-0x${end.toString(16)}] first ${len} bytes:`);
    lines.push('  ' + bytes.join(' '));
  }
  return lines.join('\n');
}

// ── Line reader ────────────────────────────────────────────────────────────

function readProgramLines(physStart: number, physEnd: number): BasicLine[] {
  const lines: BasicLine[] = [];
  let addr = physStart;
  const limit = 2000;
  while (addr < physEnd && lines.length < limit) {
    const recLen = readRamByte(addr);
    if (recLen === 0x00 || recLen === 0xFF) break;
    if (recLen < 3) break;
    const lineNum = readRamByte(addr + 1) | (readRamByte(addr + 2) << 8);
    const bodyLen = recLen - 3;
    if (bodyLen > 0) {
      const text = detokenizeBody(addr + 3, bodyLen).replace(/^ /, '');
      lines.push({ num: lineNum, text });
    }
    addr += 1 + recLen;
  }
  return lines;
}

// ── Detokenizer ────────────────────────────────────────────────────────────

function detokenizeBody(physAddr: number, length: number): string {
  let out = '';
  let i = 0;
  while (i < length) {
    const b = readRamByte(physAddr + i);
    i++;
    if (b === 0x00) {
      break;
    } else if (b === 0x01) {
      if (i + 1 < length) {
        const peek0 = readRamByte(physAddr + i);
        const peek1 = readRamByte(physAddr + i + 1);
        if (peek0 === 0x07 && peek1 === 0x48) {
          continue;
        }
      }
      out += ':';
    } else if (b === 0x02) {
      out += "'";
    } else if (b === 0x03) {
      if (i + 1 < length) {
        const ref = readRamByte(physAddr + i) | (readRamByte(physAddr + i + 1) << 8);
        i += 2;
        out += ref.toString();
      }
    } else if (b >= 0x04 && b <= 0x07) {
      if (i < length) {
        const code = readRamByte(physAddr + i);
        i++;
        out += lookupKeyword(b, code);
      }
    } else if (b >= 0x20) {
      out += casioToUnicode(b);
    } else {
      out += `[${b.toString(16).padStart(2, '0').toUpperCase()}]`;
    }
  }
  return out;
}

function lookupKeyword(prefix: number, code: number): string {
  if (prefix === 0x05 && code >= 0x71 && code <= 0x76) {
    return 'HYP ' + (HYPER_MAP[code] ?? '???');
  }
  const table = PREFIXES[prefix - 0x04];
  if (!table) return '???';
  const idx = code - 0x47;
  if (idx < 0 || idx >= table.length) return '???';
  return table[idx] || '???';
}
