// tools/compiler/assembler.ts
// Two-pass HD61700 assembler with branch relaxation: AsmLine[] → AssemblerOutput
//
// `jr`/`jr cc,label` encode the branch target as a single imm7 byte and can
// only reach ±127 bytes. Rather than let an over-long branch silently wrap to
// a wrong address, the assembler *relaxes* it into the same-semantics 3-byte
// absolute `jp`/`jp cc,label` (identical condition-code encoding — both
// opcode families dispatch into the same `testCC()` in src/emulator/exec.ts,
// which reads `opcode[0] & 7`; 0xB0-0xB6 and 0x30-0x36 share those low bits).
//
// Because relaxing one branch grows the program by a byte, it can push other
// branches across the same threshold, so layout + range-check iterate to a
// fixed point before the final emit. See `assemble()` for the loop.

import { encodeInstruction, isImm7RangeError } from './opcodes.js';
import type { AsmLine, AssemblerOutput, AsmLineResult, SymbolEntry } from './asm-types.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseHexOrDec(s: string): number {
  s = s.trim();
  if (s.startsWith('&H') || s.startsWith('&h')) return parseInt(s.slice(2), 16);
  if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s.slice(2), 16);
  return parseInt(s, 10);
}

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
  if (m === 'org' || m === 'equ') return 0;
  // For db, don't stub operands — they contain string literals whose length
  // determines the byte count; stubbing would mangle the strings.
  // (dw always produces 2 bytes so stubbing is fine for it.)
  let stubbed: string;
  if (m === 'db') {
    stubbed = operands;
  } else if (m === 'jr') {
    // A `jr`'s size never depends on its target, but encodeImm7 now *throws*
    // when the target is unreachable — so force the target to a trivially
    // in-range placeholder rather than letting a literal operand (e.g.
    // `jr &H1E23`) blow up and fall into the catch below as size 0.
    stubbed = stubJrTarget(operands);
  } else {
    stubbed = stubUnresolved(operands);
  }
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
  // Replace label-like identifiers not preceded by & (to avoid mangling &H hex literals)
  // and not starting with $ (register names)
  return operands.replace(/(?<!&)\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (match) => {
    if (knownTokens.has(match.toLowerCase())) return match;
    return '&H0000';
  });
}

// Rewrite `jr LABEL` / `jr cc,LABEL` so the target is &H0000 — reachable from
// the pc=0 used for sizing, whatever the real operand was.
function stubJrTarget(operands: string): string {
  if (!operands) return operands;
  const comma = operands.lastIndexOf(',');
  return comma < 0 ? '&H0000' : `${operands.slice(0, comma)},&H0000`;
}

// ─── Layout (pass 1) ──────────────────────────────────────────────────────────

interface Layout {
  symbols: Map<string, number>;
  equNames: Set<string>;
  /** Address of each line's first emitted byte, parallel to `lines`. */
  addrs: number[];
}

/**
 * Walk the lines assigning addresses. `relaxed` holds the indices of `jr`
 * lines that have already been decided to become 3-byte `jp`s, so they are
 * sized accordingly.
 */
function layout(lines: AsmLine[], relaxed: ReadonlySet<number>): Layout {
  const symbols = new Map<string, number>();
  const equNames = new Set<string>();
  const addrs = new Array<number>(lines.length).fill(0);

  let pc = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();
    const operands = line.operands?.trim() ?? '';

    if (mnemLower === 'org') {
      pc = parseHexOrDec(operands);
      addrs[i] = pc;
      // Label on an ORG line points to the new origin
      if (line.label) symbols.set(line.label, pc);
      continue;
    }

    addrs[i] = pc;

    if (mnemLower === 'equ') {
      // EQU: associate the label with a constant value
      if (line.label) {
        symbols.set(line.label, parseHexOrDec(operands));
        equNames.add(line.label);
      }
      continue;
    }

    // Record label address before computing instruction size
    if (line.label) symbols.set(line.label, pc);

    if (!mnem) continue; // label-only or comment-only line

    if (mnemLower === 'ds') {
      const count = parseInt(operands, 10);
      pc += isNaN(count) ? 0 : count;
    } else {
      pc += estimateSize(emittedMnemonic(mnemLower, i, relaxed), operands);
    }
  }

  return { symbols, equNames, addrs };
}

/** The mnemonic actually emitted for line `i` — `jr` becomes `jp` once relaxed. */
function emittedMnemonic(mnemLower: string, i: number, relaxed: ReadonlySet<number>): string {
  return mnemLower === 'jr' && relaxed.has(i) ? 'jp' : mnemLower;
}

/**
 * Find `jr` lines whose true distance no longer fits in one imm7 byte, using
 * the encoder itself as the range oracle so the check can never drift from
 * what pass 2 will actually do.
 */
function findOverlongBranches(
  lines: AsmLine[],
  lay: Layout,
  relaxed: ReadonlySet<number>,
): number[] {
  const found: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (relaxed.has(i)) continue;
    const line = lines[i]!;
    if ((line.mnemonic?.trim().toLowerCase() ?? '') !== 'jr') continue;
    const resolved = resolveOperands(line.operands?.trim() ?? '', lay.symbols);
    try {
      encodeInstruction('jr', resolved, lay.addrs[i]!);
    } catch (e) {
      // Any other encoding failure is reported properly by the emit pass.
      if (isImm7RangeError(e)) found.push(i);
    }
  }
  return found;
}

// ─── Main assembler ───────────────────────────────────────────────────────────

export function assemble(lines: AsmLine[]): AssemblerOutput {
  // ── Branch relaxation: iterate layout + range-check to a fixed point ───────
  //
  // `relaxed` only ever grows, and it is bounded by the number of `jr` lines,
  // so each non-converging iteration strictly shrinks the remaining candidate
  // set. After at most `jrCount` upgrades every `jr` is a `jp` and the next
  // check must come back empty — hence `jrCount + 1` iterations always
  // suffice. The loop cannot oscillate: a relaxed branch is never un-relaxed.
  const jrCount = lines.filter(l => (l.mnemonic?.trim().toLowerCase() ?? '') === 'jr').length;
  const maxIterations = jrCount + 2;

  const relaxed = new Set<number>();
  let lay = layout(lines, relaxed);
  let iterations = 1;
  let converged = false;

  for (; iterations <= maxIterations; iterations++) {
    const overlong = findOverlongBranches(lines, lay, relaxed);
    if (overlong.length === 0) { converged = true; break; }
    for (const i of overlong) relaxed.add(i);
    lay = layout(lines, relaxed);
  }

  if (!converged) {
    throw new Error(
      `Assembler error: branch relaxation failed to converge after ${maxIterations} iterations ` +
      `(${relaxed.size}/${jrCount} branches relaxed). This should be impossible — please report it.`,
    );
  }

  const symbolMap = lay.symbols;

  // ── Pass 2: emit binary ────────────────────────────────────────────────────
  const chunks: Uint8Array[] = [];
  const lineResults: AsmLineResult[] = [];
  let codeSize = 0;
  let dataSize = 0;
  let variableSize = 0;
  const symbolEntries: SymbolEntry[] = [];
  const listingLines: string[] = [];

  let pc = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();
    const operands = line.operands?.trim() ?? '';

    if (mnemLower === 'org') {
      pc = parseHexOrDec(operands);
      listingLines.push(`               ORG  ${operands}`);
      lineResults.push({ index: i, address: pc, bytes: [], mnemonic: mnem, operands });
      continue;
    }

    if (mnemLower === 'equ') {
      if (line.label) {
        listingLines.push(`               ${line.label}  EQU  ${operands}`);
      }
      lineResults.push({ index: i, address: pc, bytes: [], mnemonic: mnem, operands });
      continue;
    }

    // Layout and emit must agree byte-for-byte, or every label address is a
    // lie. Catch a divergence here instead of shipping a subtly wrong binary.
    if (pc !== lay.addrs[i]) {
      throw new Error(
        `Assembler internal error at line ${i} [${mnem} ${operands}]: ` +
        `layout predicted &H${hex4(lay.addrs[i]!)} but emit reached &H${hex4(pc)}`,
      );
    }

    if (!mnem) {
      // Label-only or comment-only
      if (line.label) {
        listingLines.push(`${hex4(pc)}:              ${line.label}:`);
      } else if (line.comment) {
        listingLines.push(`               ; ${line.comment}`);
      }
      lineResults.push({ index: i, address: pc, bytes: [], mnemonic: '', operands: '' });
      continue;
    }

    // Resolve labels in operand string
    const resolvedOps = resolveOperands(operands, symbolMap);

    const lineAddr = pc;

    if (mnemLower === 'ds') {
      const count = parseInt(operands, 10);
      const n = isNaN(count) ? 0 : count;
      chunks.push(new Uint8Array(n));
      variableSize += n;
      pc += n;
      listingLines.push(`${hex4(lineAddr)}: ${hex4(n)}       ${mnem}  ${operands}`);
      lineResults.push({ index: i, address: lineAddr, bytes: [], mnemonic: mnem, operands });
      continue;
    }

    const emitMnem = emittedMnemonic(mnemLower, i, relaxed);
    let bytes: Uint8Array;
    try {
      bytes = encodeInstruction(emitMnem, resolvedOps, pc);
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

    const shown = emitMnem === mnemLower ? mnem : emitMnem;
    const relaxNote = emitMnem === mnemLower ? '' : '   ; relaxed from jr (target out of imm7 range)';
    const hexBytes = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
    const label = line.label ? `${line.label}: ` : '';
    listingLines.push(`${hex4(lineAddr)}: ${hexBytes.padEnd(12)} ${label}${shown}  ${resolvedOps}${relaxNote}`);
    lineResults.push({
      index: i,
      address: lineAddr,
      bytes: Array.from(bytes),
      mnemonic: shown,
      operands: resolvedOps,
      relaxed: emitMnem !== mnemLower,
    });
  }

  // ── Build symbol list ──────────────────────────────────────────────────────
  const dsLabels = new Set(
    lines
      .filter(l => l.label && (l.mnemonic?.trim().toLowerCase() ?? '') === 'ds')
      .map(l => l.label!),
  );

  for (const [name, address] of symbolMap) {
    let type: SymbolEntry['type'];
    if (lay.equNames.has(name)) {
      // Determine type based on what's at that address — treat EQU as data reference
      type = 'data';
    } else if (dsLabels.has(name)) {
      type = 'variable';
    } else {
      type = 'code';
    }
    symbolEntries.push({ name, address, type });
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
    lineResults,
    relaxedBranches: relaxed.size,
    relaxationIterations: iterations,
  };
}

function hex4(n: number): string {
  return n.toString(16).toUpperCase().padStart(4, '0');
}
