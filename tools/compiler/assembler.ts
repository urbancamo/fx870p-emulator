// tools/compiler/assembler.ts
// Two-pass HD61700 assembler: AsmLine[] → AssemblerOutput

import { encodeInstruction } from './opcodes.js';
import type { AsmLine, AssemblerOutput, SymbolEntry } from './asm-types.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseHexOrDec(s: string): number {
  s = s.trim();
  if (s.startsWith('&H') || s.startsWith('&h')) return parseInt(s.slice(2), 16);
  if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s.slice(2), 16);
  return parseInt(s, 10);
}

// Pseudo-mnemonics that direct the assembler but emit no code themselves
const ASSEMBLER_DIRECTIVES = new Set(['org', 'equ']);

// Mnemonics that reserve space only (no actual data bytes needed in pass 2)
const VARIABLE_PSEUDO = new Set(['ds']);

// Mnemonics whose output bytes count as data, not code
const DATA_PSEUDO = new Set(['db', 'dw']);

// ─── Label resolution ─────────────────────────────────────────────────────────

// Replace symbol references in an operand string with &Hxxxx addresses.
// Works for both label addresses and EQU-defined constants.
function resolveOperands(operands: string, symbols: Map<string, number>): string {
  if (!operands) return operands;
  // Sort by length descending to avoid partial substitution (e.g. VAR vs VAR_A)
  const names = [...symbols.keys()].sort((a, b) => b.length - a.length);
  let result = operands;
  for (const name of names) {
    // Match whole token: not preceded/followed by alphanumeric or underscore
    const re = new RegExp(`(?<![A-Za-z0-9_])${escapeRegex(name)}(?![A-Za-z0-9_])`, 'g');
    result = result.replace(re, `&H${symbols.get(name)!.toString(16).toUpperCase().padStart(4, '0')}`);
  }
  return result;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Estimate instruction size in bytes by calling encodeInstruction with placeholder addresses
function estimateSize(mnemonic: string, operands: string): number {
  const m = mnemonic.toLowerCase();
  if (ASSEMBLER_DIRECTIVES.has(m)) return 0;
  // Replace any unresolved symbol-like tokens with &H0000 for size estimation
  const stubbed = stubUnresolved(operands);
  try {
    return encodeInstruction(m, stubbed, 0).length;
  } catch {
    return 0;
  }
}

// Replace unresolved label-like tokens (UPPER_CASE or mixed identifiers that are
// not numeric/hex literals, register names, condition codes, or string literals)
function stubUnresolved(operands: string): string {
  if (!operands) return operands;
  // Known non-label tokens (registers, condition codes, etc.)
  const knownTokens = new Set([
    'ix', 'iy', 'iz', 'us', 'ss', 'ky',
    'sx', 'sy', 'sz',
    'pe', 'pd', 'ib', 'ua', 'ia', 'ie', 'tm',
    'z', 'nc', 'lz', 'uz', 'nz', 'c', 'nlz',
  ]);
  // Replace label-like identifiers not starting with $ or & with &H0000
  return operands.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (match) => {
    if (knownTokens.has(match.toLowerCase())) return match;
    return '&H0000';
  });
}

// ─── Main assembler ───────────────────────────────────────────────────────────

export function assemble(lines: AsmLine[]): AssemblerOutput {
  // ── Pass 1: collect symbols and compute addresses ──────────────────────────
  const symbolMap = new Map<string, number>(); // name → address (or EQU value)
  const equSet = new Set<string>(); // names defined via EQU (not address labels)

  let pc = 0;

  for (const line of lines) {
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();
    const operands = line.operands?.trim() ?? '';

    if (mnemLower === 'org') {
      pc = parseHexOrDec(operands);
      // Label on an ORG line points to the new origin
      if (line.label) {
        symbolMap.set(line.label, pc);
      }
      continue;
    }

    if (mnemLower === 'equ') {
      // EQU: associate the label with a constant value
      if (line.label) {
        const val = parseHexOrDec(operands);
        symbolMap.set(line.label, val);
        equSet.add(line.label);
      }
      continue;
    }

    // Record label address before computing instruction size
    if (line.label) {
      symbolMap.set(line.label, pc);
    }

    if (!mnem) continue; // label-only or comment-only line

    if (mnemLower === 'ds') {
      // Reserve N bytes
      const count = parseInt(operands, 10);
      pc += isNaN(count) ? 0 : count;
    } else {
      pc += estimateSize(mnem, operands);
    }
  }

  // ── Pass 2: emit binary ────────────────────────────────────────────────────
  const chunks: Uint8Array[] = [];
  let codeSize = 0;
  let dataSize = 0;
  let variableSize = 0;
  const symbolEntries: SymbolEntry[] = [];
  const listingLines: string[] = [];

  pc = 0;

  for (const line of lines) {
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();
    const operands = line.operands?.trim() ?? '';

    if (mnemLower === 'org') {
      pc = parseHexOrDec(operands);
      listingLines.push(`               ORG  ${operands}`);
      continue;
    }

    if (mnemLower === 'equ') {
      if (line.label) {
        listingLines.push(`               ${line.label}  EQU  ${operands}`);
      }
      continue;
    }

    if (!mnem) {
      // Label-only or comment-only
      if (line.label) {
        listingLines.push(`${hex4(pc)}:              ${line.label}:`);
      } else if (line.comment) {
        listingLines.push(`               ; ${line.comment}`);
      }
      continue;
    }

    // Resolve labels in operand string
    const resolvedOps = resolveOperands(operands, symbolMap);

    const lineAddr = pc;

    if (mnemLower === 'ds') {
      const count = parseInt(operands, 10);
      const n = isNaN(count) ? 0 : count;
      const zeros = new Uint8Array(n);
      chunks.push(zeros);
      variableSize += n;
      pc += n;
      listingLines.push(`${hex4(lineAddr)}: ${hex4(n)}       ${mnem}  ${operands}`);
    } else {
      let bytes: Uint8Array;
      try {
        bytes = encodeInstruction(mnemLower, resolvedOps, pc);
      } catch (e) {
        throw new Error(`Assembler error at PC=${hex4(pc)} [${mnem} ${operands}]: ${(e as Error).message}`);
      }
      chunks.push(bytes);

      if (DATA_PSEUDO.has(mnemLower)) {
        dataSize += bytes.length;
      } else {
        codeSize += bytes.length;
      }
      pc += bytes.length;

      const hexBytes = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
      const label = line.label ? `${line.label}: ` : '';
      listingLines.push(`${hex4(lineAddr)}: ${hexBytes.padEnd(12)} ${label}${mnem}  ${resolvedOps}`);
    }
  }

  // ── Build symbol list ──────────────────────────────────────────────────────
  for (const [name, address] of symbolMap) {
    let type: SymbolEntry['type'];
    if (equSet.has(name)) {
      // Determine type based on what's at that address — treat EQU as data reference
      type = 'data';
    } else {
      // Simple heuristic: if any DS label, it's variable; otherwise code
      type = 'code';
    }
    symbolEntries.push({ name, address, type });
  }

  // Re-classify DS labels as 'variable'
  pc = 0;
  for (const line of lines) {
    const mnemLower = (line.mnemonic?.trim() ?? '').toLowerCase();
    const operands = line.operands?.trim() ?? '';

    if (mnemLower === 'org') { pc = parseHexOrDec(operands); continue; }
    if (mnemLower === 'equ') continue;
    if (!line.mnemonic) continue;

    if (line.label && mnemLower === 'ds') {
      const entry = symbolEntries.find(s => s.name === line.label);
      if (entry) entry.type = 'variable';
    }

    if (mnemLower === 'ds') {
      const n = parseInt(operands, 10);
      pc += isNaN(n) ? 0 : n;
    } else {
      pc += estimateSize(line.mnemonic!, operands);
    }
  }

  // ── Concatenate all binary chunks ─────────────────────────────────────────
  const totalLen = chunks.reduce((sum, c) => sum + c.length, 0);
  const binary = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    binary.set(chunk, offset);
    offset += chunk.length;
  }

  return {
    binary,
    symbols: symbolEntries,
    listing: listingLines.join('\n'),
    codeSize,
    dataSize,
    variableSize,
  };
}

function hex4(n: number): string {
  return n.toString(16).toUpperCase().padStart(4, '0');
}
