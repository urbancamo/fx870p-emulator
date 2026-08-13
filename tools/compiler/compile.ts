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
import { generateHexPayload } from './loader.js';
import type { AsmLine, AsmLineResult } from './asm-types.js';

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
// The assembler already knows every line's final address and bytes — including
// any `jr` it had to relax into a 3-byte `jp` — so the listing simply reads
// them back off `AssemblerOutput.lineResults`. (This used to re-derive the
// whole layout independently, which silently drifted from the real binary the
// moment branch relaxation changed an instruction's size.)

function buildListingLines(
  asmLines: AsmLine[],
  lineResults: AsmLineResult[],
): ListingLine[] {
  const byIndex = new Map(lineResults.map(r => [r.index, r]));
  const result: ListingLine[] = [];

  for (let i = 0; i < asmLines.length; i++) {
    const line = asmLines[i]!;
    const mnem = line.mnemonic?.trim() ?? '';
    const mnemLower = mnem.toLowerCase();

    // BASIC annotation lines
    if (line.basicLine !== undefined) {
      result.push({
        address: -1, bytes: [], label: '', mnemonic: '', operands: '', comment: '',
        basicLine: line.basicLine,
      });
      continue;
    }

    // ORG / EQU directives — no bytes emitted
    if (mnemLower === 'org' || mnemLower === 'equ') continue;

    const emitted = byIndex.get(i);

    // Comment-only line (no mnemonic, no label)
    if (!mnem && !line.label) {
      result.push({
        address: -1, bytes: [], label: '', mnemonic: '', operands: '',
        comment: line.comment ?? '',
      });
      continue;
    }

    const comment = emitted?.relaxed
      ? `${line.comment ? line.comment + ' ' : ''}[jr relaxed to jp]`
      : line.comment ?? '';

    result.push({
      address: emitted?.address ?? -1,
      bytes: emitted?.bytes ?? [],
      label: line.label ?? '',
      mnemonic: emitted?.mnemonic || mnem,
      operands: line.operands?.trim() ?? '',
      comment,
    });
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

  // 5. Build listing lines from what the assembler actually emitted
  const listingLines = buildListingLines(asmProgram.lines, assembled.lineResults);

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

  // 7. Write output files to build/compiler/
  //    (The loader is generic and lives in the BASIC library as MLLOADER.BAS
  //    — no need to emit it per compile.)
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const binPath = outPath(inputPath, '.bin');
  const hexPath = outPath(inputPath, '.hex');
  const lstPath = outPath(inputPath, '.lst');
  const symPath = outPath(inputPath, '.sym');

  writeFileSync(binPath, assembled.binary);
  writeFileSync(hexPath, generateHexPayload(assembled.binary), 'utf8');
  writeFileSync(lstPath, listing,  'utf8');
  writeFileSync(symPath, JSON.stringify(assembled.symbols, null, 2) + '\n', 'utf8');

  // 8. Print summary
  const { codeSize, dataSize, variableSize } = assembled;
  const usedBytes = codeSize + dataSize + variableSize;
  const available = WARN_THRESHOLD;
  const usedPct   = Math.round((usedBytes / available) * 100);

  const outFiles = [
    basename(binPath),
    basename(hexPath),
    basename(lstPath),
    basename(symPath),
  ].join(', ');

  console.log(`Compiled: ${sourceFile} → ${usedBytes} bytes`);
  console.log(`  Code: ${codeSize} bytes  Data: ${dataSize} bytes  Variables: ${variableSize} bytes`);
  console.log(`  Available: ${available} bytes  Used: ${usedPct}%`);
  console.log(`  Output: ${outFiles}`);
  console.log('');
  console.log('To run on the emulator:');
  console.log('  1. Open LIB, load MLLOADER.BAS into P0');
  console.log('  2. Type RUN and press EXE');
  console.log(`  3. Use the emulator's COM0 SEND button to send ${basename(hexPath)}`);

  if (usedBytes > available) {
    console.warn(`WARNING: output exceeds ${available} bytes (${usedBytes - available} bytes over)`);
  }
}

main();
