// tools/compiler/compile.ts
// CLI entry point: full compiler pipeline for Casio FX-870P BASIC programs
//
// Usage:
//   npx tsx tools/compiler/compile.ts program.bas
//
// Outputs (same directory as input):
//   program.bin         — raw binary
//   program.lst         — 132-column listing
//   program.sym         — symbol table (JSON)
//   program.loader.bas  — BASIC loader for real hardware

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename, extname, join } from 'node:path';

import { parse } from './parser.js';
import { generate } from './codegen.js';
import { assemble } from './assembler.js';
import { formatListing } from './listing.js';
import type { ListingLine, ListingInput } from './listing.js';
import { generateLoader } from './loader.js';
import { encodeInstruction } from './opcodes.js';
import type { AsmLine } from './asm-types.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WARN_THRESHOLD = 4096;
const OUTPUT_DIR = resolve(import.meta.dirname ?? dirname(import.meta.url.replace('file://', '')), '../../build/compiler');

function outPath(inputFile: string, newExt: string): string {
  const base = basename(inputFile, extname(inputFile));
  return join(OUTPUT_DIR, base + newExt);
}

/** Format current date as "YYYY-MM-DD HH:MM" */
function nowString(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── ListingLine builder ─────────────────────────────────────────────────────
//
// Converts AsmLine[] + the assembled binary into ListingLine[] suitable for
// formatListing().  For each AsmLine we need the encoded bytes; instead of
// unpacking the concatenated binary we re-encode each instruction individually.

function buildListingLines(
  asmLines: AsmLine[],
  symbolMap: Map<string, number>,
): ListingLine[] {
  const result: ListingLine[] = [];
  let pc = 0;

  // Rebuild a local symbol map from the asm lines (ORG + labels) for resolving
  // operands when re-encoding.  This mirrors the assembler's pass-1 logic.
  const syms = new Map<string, number>(symbolMap);

  // Helpers matching assembler internals
  function parseHexOrDec(s: string): number {
    s = s.trim();
    if (s.startsWith('&H') || s.startsWith('&h')) return parseInt(s.slice(2), 16);
    if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s.slice(2), 16);
    return parseInt(s, 10);
  }

  function resolveOperands(operands: string): string {
    if (!operands) return operands;
    const names = [...syms.keys()].sort((a, b) => b.length - a.length);
    let result = operands;
    for (const name of names) {
      const re = new RegExp(
        `(?<![A-Za-z0-9_])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_])`,
        'g',
      );
      result = result.replace(
        re,
        `&H${syms.get(name)!.toString(16).toUpperCase().padStart(4, '0')}`,
      );
    }
    return result;
  }

  // Pass 1: collect symbol addresses (mirrors assembler pass 1)
  let scanPc = 0;
  for (const line of asmLines) {
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();
    const operands = line.operands?.trim() ?? '';

    if (mnemLower === 'org') {
      scanPc = parseHexOrDec(operands);
      if (line.label) syms.set(line.label, scanPc);
      continue;
    }
    if (mnemLower === 'equ') {
      if (line.label) syms.set(line.label, parseHexOrDec(operands));
      continue;
    }
    if (line.label) syms.set(line.label, scanPc);
    if (!mnem) continue;

    if (mnemLower === 'ds') {
      const n = parseInt(operands, 10);
      scanPc += isNaN(n) ? 0 : n;
    } else {
      try {
        // For db, don't stub operands — they contain string literals whose
        // length determines the byte count; stubbing would mangle the strings.
        const stubbed = mnemLower === 'db' ? operands : operands.replace(/(?<!&)\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (m) => {
          const known = new Set(['ix','iy','iz','us','ss','ky','sx','sy','sz',
            'pe','pd','ib','ua','ia','ie','tm','z','nc','lz','uz','nz','c','nlz']);
          return known.has(m.toLowerCase()) ? m : '&H0000';
        });
        scanPc += encodeInstruction(mnemLower, stubbed, 0).length;
      } catch {
        // skip unrecognised
      }
    }
  }

  // Pass 2: build listing lines
  for (const line of asmLines) {
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();
    const operands = line.operands?.trim() ?? '';

    // BASIC annotation lines
    if (line.basicLine !== undefined) {
      result.push({
        address: -1,
        bytes: [],
        label: '',
        mnemonic: '',
        operands: '',
        comment: '',
        basicLine: line.basicLine,
      });
      continue;
    }

    // ORG / EQU directives — skip (no bytes emitted)
    if (mnemLower === 'org') {
      pc = parseHexOrDec(operands);
      continue;
    }
    if (mnemLower === 'equ') continue;

    // Comment-only line (no mnemonic, no label)
    if (!mnem && !line.label) {
      result.push({
        address: -1,
        bytes: [],
        label: '',
        mnemonic: '',
        operands: '',
        comment: line.comment ?? '',
      });
      continue;
    }

    // Label-only line
    if (!mnem && line.label) {
      result.push({
        address: pc,
        bytes: [],
        label: line.label,
        mnemonic: '',
        operands: '',
        comment: line.comment ?? '',
      });
      continue;
    }

    const lineAddr = pc;
    const resolvedOps = resolveOperands(operands);

    if (mnemLower === 'ds') {
      const n = parseInt(operands, 10);
      const size = isNaN(n) ? 0 : n;
      result.push({
        address: lineAddr,
        bytes: [],          // DS reserves space; no bytes to show
        label: line.label ?? '',
        mnemonic: mnem,
        operands,
        comment: line.comment ?? '',
      });
      pc += size;
    } else {
      let bytes: number[] = [];
      try {
        bytes = Array.from(encodeInstruction(mnemLower, resolvedOps, lineAddr));
        pc += bytes.length;
      } catch {
        // emit with no bytes if encoding fails
      }
      result.push({
        address: lineAddr,
        bytes,
        label: line.label ?? '',
        mnemonic: mnem,
        operands,
        comment: line.comment ?? '',
      });
    }
  }

  return result;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: npx tsx tools/compiler/compile.ts <program.bas>');
    process.exit(1);
  }

  const inputPath = resolve(args[0]!);
  const sourceFile = basename(inputPath);

  // 1. Read source
  let source: string;
  try {
    source = readFileSync(inputPath, 'utf8');
  } catch (e) {
    console.error(`Error reading ${inputPath}: ${(e as Error).message}`);
    process.exit(1);
  }

  // 2. Parse
  const program = parse(source);

  // 3. Generate assembly
  const asmProgram = generate(program);

  // 4. Assemble to binary
  const assembled = assemble(asmProgram.lines);

  // 5. Build listing lines
  // Build a symbol map from the assembler output for operand resolution
  const symbolMap = new Map<string, number>(
    assembled.symbols.map(s => [s.name, s.address]),
  );
  const listingLines = buildListingLines(asmProgram.lines, symbolMap);

  // 6. Format listing
  const listingInput: ListingInput = {
    sourceFile,
    date: nowString(),
    lines: listingLines,
    symbols: assembled.symbols,
    codeSize: assembled.codeSize,
    dataSize: assembled.dataSize,
    variableSize: assembled.variableSize,
  };
  const listing = formatListing(listingInput);

  // 7. Generate loader
  const totalSize = assembled.binary.length;
  const loader = generateLoader({
    binary: assembled.binary,
    entryPoint: asmProgram.origin,
    sourceFile,
    totalSize,
  });

  // 8. Write output files to build/compiler/
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const binPath    = outPath(inputPath, '.bin');
  const lstPath    = outPath(inputPath, '.lst');
  const symPath    = outPath(inputPath, '.sym');
  const loaderPath = outPath(inputPath, '.loader.bas');

  writeFileSync(binPath,    assembled.binary);
  writeFileSync(lstPath,    listing,  'utf8');
  writeFileSync(symPath,    JSON.stringify(assembled.symbols, null, 2) + '\n', 'utf8');
  writeFileSync(loaderPath, loader,   'utf8');

  // 9. Print summary
  const { codeSize, dataSize, variableSize } = assembled;
  const usedBytes = codeSize + dataSize + variableSize;
  const available = WARN_THRESHOLD;
  const usedPct   = Math.round((usedBytes / available) * 100);

  const outFiles = [
    basename(binPath),
    basename(lstPath),
    basename(symPath),
    basename(loaderPath),
  ].join(', ');

  console.log(`Compiled: ${sourceFile} → ${usedBytes} bytes`);
  console.log(`  Code: ${codeSize} bytes  Data: ${dataSize} bytes  Variables: ${variableSize} bytes`);
  console.log(`  Available: ${available} bytes  Used: ${usedPct}%`);
  console.log(`  Output: ${outFiles}`);

  if (usedBytes > available) {
    console.warn(`WARNING: output exceeds ${available} bytes (${usedBytes - available} bytes over)`);
  }
}

main();
