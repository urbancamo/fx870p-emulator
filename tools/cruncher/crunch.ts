// CLI: crunch a Casio JIS BASIC program to its minimal stored form.
//   npx tsx tools/cruncher/crunch.ts PROGRAM.BAS [-o out.bas] [-l out.lst]
//     [--level 1|2] [--keep-comments] [--no-merge] [--no-spaces-strip]
//     [--no-rewrites] [--no-data-group] [--width N]
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { parseSource, emitProgram } from './scan.js';
import { findWarnings } from './refs.js';
import { runPipeline, defaultOptions, lastRenameMap, CrunchOptions } from './passes.js';
import { buildListing } from './listing.js';
import { trueSourceBytes } from './bytes.js';

function usage(): never {
  console.error('usage: crunch.ts PROGRAM.BAS [-o out.bas] [-l out.lst] [--level 1|2]');
  console.error('       [--keep-comments] [--no-merge] [--no-spaces-strip] [--no-rewrites]');
  console.error('       [--no-data-group] [--width N]');
  process.exit(1);
}

const argv = process.argv.slice(2);
let input: string | null = null;
let outFile: string | null = null;
let lstFile: string | null = null;
let width = 132;
const opts: CrunchOptions = defaultOptions();
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '-o') outFile = argv[++i] ?? usage();
  else if (a === '-l') lstFile = argv[++i] ?? usage();
  else if (a === '--level') { const v = argv[++i]; if (v !== '1' && v !== '2') usage(); opts.level = Number(v) as 1 | 2; }
  else if (a === '--keep-comments') opts.keepComments = true;
  else if (a === '--no-merge') opts.noMerge = true;
  else if (a === '--no-spaces-strip') opts.noSpaces = true;
  else if (a === '--no-rewrites') opts.noRewrites = true;
  else if (a === '--no-data-group') opts.noDataGroup = true;
  else if (a === '--width') { width = Number(argv[++i]); if (!(width >= 80)) usage(); }
  else if (a.startsWith('-')) usage();
  else if (input === null) input = a;
  else usage();
}
if (input === null) usage();
const stem = input.replace(/\.bas$/i, '');
outFile = outFile ?? `${stem}.min.BAS`;
lstFile = lstFile ?? `${stem}.crunch.lst`;

const src = readFileSync(input, 'latin1');

try {
  const original = parseSource(src);
  const warnings = findWarnings(original);
  const { lines, snapshots } = runPipeline(original, opts);

  // snapshots[0].bytes (from runPipeline) reflects the PARSED model, which
  // under-reports the true original file size -- replace it with the true
  // raw-tokenized baseline so the CLI summary, listing summary, and
  // reduction % all report against the real "before" figure.
  snapshots[0] = { ...snapshots[0], bytes: trueSourceBytes(src) };

  // verify: reference graph closes
  const resultWarnings = findWarnings(lines);
  const dangling = resultWarnings.filter(w => w.includes('nonexistent'));
  const finalWarnings = [...warnings, ...dangling];
  if (dangling.length > 0) {
    console.error('ERROR: program contains dangling line references (present in the source):');
    for (const d of dangling) console.error('  ' + d);
    process.exit(2);
  }

  // Generate both output payloads fully before writing either file, so a
  // failure anywhere in the pipeline or listing generation (e.g. an
  // unmappable character the tokenizer rejects) never leaves a partial
  // output file on disk.
  const outContent = emitProgram(lines);
  const lstContent = buildListing({
    sourceName: basename(input), original, result: lines, snapshots,
    warnings: finalWarnings, renames: lastRenameMap(), opts, width,
  });

  writeFileSync(outFile, outContent, 'latin1');
  writeFileSync(lstFile, lstContent, 'latin1');

  const before = snapshots[0].bytes;
  const after = snapshots[snapshots.length - 1].bytes;
  console.log(`${basename(input)}: ${original.length} -> ${lines.length} lines, ` +
    `${before} -> ${after} bytes (${((before - after) / before * 100).toFixed(1)}% saved)`);
  console.log(`wrote ${outFile}, ${lstFile}`);
  for (const w of finalWarnings) console.log('warning: ' + w);
} catch (err) {
  // Keep failures (most commonly a source character the FX-870P charset
  // can't represent, tokenizeBody's "no Casio ASCII mapping" error) to a
  // single clean stderr line -- no stack trace, no partial output files.
  console.error(`fxcrunch: ${basename(input)}: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(2);
}
