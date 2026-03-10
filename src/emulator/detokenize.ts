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
//   Byte 0-1 : line number (16-bit LE). 0x00 at byte 0 = end-of-file.
//   Byte 2   : length of the tokenized body (N bytes following)
//   Byte 3.. : tokenized body (N bytes)
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
//
// ── Keyword token tables ───────────────────────────────────────────────────
//
// Extracted from ROM1 dispatch tables at 0x0FA9, 0x10AB, 0x11AD, 0x12AF.
// Each table maps code bytes 0x47–0xC7 to keyword strings.
// Source: reference/ROM Disassembly/fx870_r1/rom1c.src lines 371–509.
//
// Special case: prefix 0x05, codes 0x71–0x76 = hyperbolic functions.
// These are rendered as HYP + the corresponding trig keyword:
//   0x71=HYPSIN, 0x72=HYPCOS, 0x73=HYPTAN,
//   0x74=HYPASN, 0x75=HYPACS, 0x76=HYPATN
//
// (Discovered from ENLST routine at ROM1 0x5108–0x5121.)

import { readRamByte } from './emulator.js';

// ── Token tables ───────────────────────────────────────────────────────────
// Indexed by (code - 0x47). Empty string = unmapped token → rendered as "???".

const PREFIX4: string[] = [ // codes 0x47–0xC7
  '','','GOTO','GOSUB',                          // 47-4A
  'RETURN','RESUME','RESTORE','WRITE#',          // 4B-4E
  '','CONT','','SYSTEM',                         // 4F-52
  'PASS','','DELETE','',                          // 53-56
  'LIST','LLIST','LOAD','MERGE',                 // 57-5A
  '','RENUM','TRON','',                          // 5B-5E
  'TROFF','VERIFY','','',                        // 5F-62
  'POKE','','','',                               // 63-66
  '','','CHAIN','CLEAR',                         // 67-6A
  'NEW','SAVE','RUN','ANGLE',                    // 6B-6E
  'EDIT','BEEP','CLS','CLOSE',                   // 6F-72
  '','','','DEF',                                // 73-76
  '','DEFSEG','','',                             // 77-7A
  '','DIM','','',                                // 7B-7E
  '','DATA','FOR','NEXT',                        // 7F-82
  '','','ERASE','ERROR',                         // 83-86
  'END','','','',                                // 87-8A
  'FORMAT','','IF','KILL',                       // 8B-8E
  'LET','LINE','LOCATE','',                      // 8F-92
  '','','','NAME',                               // 93-96
  'OPEN','','OUT','ON',                          // 97-9A
  '','','','',                                   // 9B-9E
  'CALCJMP','','','',                            // 9F-A2
  'PRINT','LPRINT','PUT','',                     // A3-A6
  '','READ','REM','',                            // A7-AA
  '','SET','STAT','STOP',                        // AB-AE
  '','MODE','','VAR',                            // AF-B2
  '','','FILES','',                              // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

const PREFIX5: string[] = [
  '','','','',                                   // 47-4A
  '','','','',                                   // 4B-4E
  'ERL','ERR','CNT','SUMX',                      // 4F-52
  'SUMY','SUMX2','SUMY2','SUMXY',                // 53-56
  'MEANX','MEANY','SDX','SDY',                   // 57-5A
  'SDXN','SDYN','LRA','LRB',                     // 5B-5E
  'COR','PI','DSKF','',                          // 5F-62
  'CUR','','','',                                // 63-66
  'FACT','','EOX','EOY',                         // 67-6A
  'SIN','COS','TAN','ASN',                       // 6B-6E
  'ACS','ATN','','',                             // 6F-72
  '','','','',                                   // 73-76
  'LN','LOG','EXP','SQR',                        // 77-7A
  'ABS','SGN','INT','FIX',                       // 7B-7E
  'FRAC','','DEGR','DMS',                        // 7F-82
  '','','','PEEK',                               // 83-86
  '','','','EOF',                                // 87-8A
  '','','FRE','',                                // 8B-8E
  '','ROUND','','VALF',                          // 8F-92
  'RAN#','ASC','LEN','VAL',                      // 93-96
  '','','','',                                   // 97-9A
  'HYP','DEG','','',                             // 9B-9E
  '','','','',                                   // 9F-A2
  '','','','',                                   // A3-A6
  'REC','POL','','NPR',                          // A7-AA
  'NCR','HYP','','',                             // AB-AE
  '','','','',                                   // AF-B2
  '','','','',                                   // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

const PREFIX6: string[] = [
  '','','','',                                   // 47-4A
  '','','','',                                   // 4B-4E
  '','','','',                                   // 4F-52
  '','','','',                                   // 53-56
  '','','','',                                   // 57-5A
  '','','','',                                   // 5B-5E
  '','','','',                                   // 5F-62
  '','','','',                                   // 63-66
  '','','','',                                   // 67-6A
  '','','','',                                   // 6B-6E
  '','','','',                                   // 6F-72
  '','','','',                                   // 73-76
  '','','','',                                   // 77-7A
  '','','','',                                   // 7B-7E
  '','','','',                                   // 7F-82
  '','','','',                                   // 83-86
  '','','','',                                   // 87-8A
  '','','','',                                   // 8B-8E
  '','','','',                                   // 8F-92
  '','','','',                                   // 93-96
  'DMS$','','','',                               // 97-9A
  'INPUT','MID$','RIGHT$','LEFT$',               // 9B-9E
  '','CHR$','STR$','',                           // 9F-A2
  'HEX$','','','',                               // A3-A6
  '','INKEY$','','',                             // A7-AA
  '','','CALC$','',                              // AB-AE
  '','','','',                                   // AF-B2
  '','','','',                                   // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

const PREFIX7: string[] = [
  'THEN','ELSE','','',                           // 47-4A
  '','','','',                                   // 4B-4E
  '','','','',                                   // 4F-52
  '','','','',                                   // 53-56
  '','','','',                                   // 57-5A
  '','','','',                                   // 5B-5E
  '','','','',                                   // 5F-62
  '','','','',                                   // 63-66
  '','','','',                                   // 67-6A
  '','','','',                                   // 6B-6E
  '','','','',                                   // 6F-72
  '','','','',                                   // 73-76
  '','','','',                                   // 77-7A
  '','','','',                                   // 7B-7E
  '','','','',                                   // 7F-82
  '','','','',                                   // 83-86
  '','','','',                                   // 87-8A
  '','','','',                                   // 8B-8E
  '','','','',                                   // 8F-92
  '','','','',                                   // 93-96
  '','','','',                                   // 97-9A
  '','','','',                                   // 9B-9E
  '','','','',                                   // 9F-A2
  '','','','',                                   // A3-A6
  '','','','',                                   // A7-AA
  '','','','',                                   // AB-AE
  '','','','',                                   // AF-B2
  '','','','TAB',                                // B3-B6
  '','','','',                                   // B7-BA
  'ALL','AS','APPEND','',                        // BB-BE
  '','STEP','TO','USING',                        // BF-C2
  'NOT','AND','OR','XOR',                        // C3-C6
  'MOD',                                         // C7
];

const PREFIXES: string[][] = [PREFIX4, PREFIX5, PREFIX6, PREFIX7];

// Hyperbolic function codes (prefix 5, codes 0x71-0x76) map to trig keywords
const HYPER_MAP: Record<number, string> = {
  0x71: 'SIN', 0x72: 'COS', 0x73: 'TAN',
  0x74: 'ASN', 0x75: 'ACS', 0x76: 'ATN',
};

// ── RAM helpers ────────────────────────────────────────────────────────────

const RAM_BASE = 0x10000; // physical address offset for RAM0
const FILE_TABLE = 0x118A7; // physical address of file pointer table
const NUM_SLOTS = 10; // P0–P9

function readWord(physAddr: number): number {
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

// ── Line reader ────────────────────────────────────────────────────────────

function readProgramLines(physStart: number, physEnd: number): BasicLine[] {
  const lines: BasicLine[] = [];
  let addr = physStart;
  const limit = 2000; // safety limit on lines per program
  while (addr < physEnd && lines.length < limit) {
    const b0 = readRamByte(addr);
    if (b0 === 0x00 || b0 === 0x1A) break; // end of program
    // Line number: 16-bit LE at addr
    const lineNum = readRamByte(addr) | (readRamByte(addr + 1) << 8);
    // Body length at addr+2
    const bodyLen = readRamByte(addr + 2);
    if (bodyLen === 0) { addr += 3; continue; }
    // Detokenize the body bytes
    const text = detokenizeBody(addr + 3, bodyLen);
    lines.push({ num: lineNum, text });
    addr += 3 + bodyLen;
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
      break; // end of line
    } else if (b === 0x01) {
      // Colon (statement separator), but suppress if followed by ELSE
      if (i + 1 < length) {
        const peek0 = readRamByte(physAddr + i);
        const peek1 = readRamByte(physAddr + i + 1);
        if (peek0 === 0x07 && peek1 === 0x48) {
          // Hidden colon before ELSE — skip it
          continue;
        }
      }
      out += ':';
    } else if (b === 0x02) {
      out += "'"; // REM shorthand
    } else if (b === 0x03) {
      // Binary line number reference (e.g., GOTO target)
      if (i + 1 < length) {
        const ref = readRamByte(physAddr + i) | (readRamByte(physAddr + i + 1) << 8);
        i += 2;
        out += ref.toString();
      }
    } else if (b >= 0x04 && b <= 0x07) {
      // Keyword prefix
      if (i < length) {
        const code = readRamByte(physAddr + i);
        i++;
        out += lookupKeyword(b, code);
      }
    } else if (b >= 0x20 && b <= 0x7F) {
      out += String.fromCharCode(b);
    } else {
      // Unknown byte — show as hex escape
      out += `[${b.toString(16).padStart(2, '0').toUpperCase()}]`;
    }
  }
  return out;
}

function lookupKeyword(prefix: number, code: number): string {
  // Special case: hyperbolic functions (prefix 5, codes 0x71-0x76)
  if (prefix === 0x05 && code >= 0x71 && code <= 0x76) {
    return 'HYP ' + (HYPER_MAP[code] ?? '???');
  }
  const table = PREFIXES[prefix - 0x04];
  if (!table) return '???';
  const idx = code - 0x47;
  if (idx < 0 || idx >= table.length) return '???';
  return table[idx] || '???';
}
