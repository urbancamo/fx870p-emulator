#!/usr/bin/env node
// compare-traces.mjs
// Usage: node tools/compare-traces.mjs [--stop N] [--skip-mr]
//
// Reads both trace files line-by-line and reports the first divergence.
// Both traces must be JSONL, one record per line.
//
// Options:
//   --stop N    stop after N divergences (default: 5)
//   --skip-mr   ignore mr[] differences (useful to focus on control flow)
//   --from PC   only start comparing once both traces reach this PC (hex)

import fs from 'node:fs';
import readline from 'node:readline';
import path from 'node:path';

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const stopAfter  = Number(args[args.indexOf('--stop')  + 1] ?? 5);
const skipMr     = args.includes('--skip-mr');
const fromPcArg  = args[args.indexOf('--from') + 1];
const fromPc     = fromPcArg !== undefined ? parseInt(fromPcArg, 16) : -1;

const root    = path.resolve(import.meta.dirname, '..');
const dFile   = path.join(root, 'reference/fx870_es/trace.jsonl');
const tsFile  = path.join(root, 'trace.jsonl');

// ── helpers ───────────────────────────────────────────────────────────────────
function lineReader(file) {
  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });
  const lines = [];
  let resolve, done = false;
  const queue = [];
  let waiting = null;

  rl.on('line', line => {
    if (waiting) { const w = waiting; waiting = null; w(line); }
    else queue.push(line);
  });
  rl.on('close', () => { done = true; if (waiting) { const w = waiting; waiting = null; w(null); } });

  return {
    next() {
      return new Promise(res => {
        if (queue.length > 0) res(queue.shift());
        else if (done) res(null);
        else waiting = res;
      });
    }
  };
}

function diffRecord(a, b) {
  const diffs = [];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (k === 'mr' && skipMr) continue;
    if (k === 'mr') {
      const av = a.mr, bv = b.mr;
      for (let i = 0; i < Math.max(av.length, bv.length); i++) {
        if (av[i] !== bv[i]) diffs.push(`mr[${i}]: delphi=${av[i]} ts=${bv[i]}`);
      }
    } else {
      if (a[k] !== b[k]) diffs.push(`${k}: delphi=${a[k]} ts=${b[k]}`);
    }
  }
  return diffs;
}

function hex(n, w=4) { return '0x' + (n??0).toString(16).padStart(w,'0'); }
function fmtRecord(r) {
  return `pc=${hex(r.pc)} cy=${r.cy} ua=${hex(r.ua,2)} ss=${hex(r.ss)} us=${hex(r.us)} ` +
    `sx=${r.sx} sy=${r.sy} sz=${r.sz} ix=${hex(r.ix)} ` +
    `fl=${hex(r.fl,2)} iserv=${r.iserv} ky=${hex(r.ky,4)}`;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Delphi trace : ${dFile}`);
  console.log(`TS trace     : ${tsFile}`);
  console.log(`Stop after   : ${stopAfter} divergences`);
  console.log(`Skip mr[]    : ${skipMr}`);
  if (fromPc >= 0) console.log(`From PC      : ${hex(fromPc)}`);
  console.log('');

  const dr = lineReader(dFile);
  const tr = lineReader(tsFile);

  let lineNum = 0;
  let divergences = 0;
  let skipping = fromPc >= 0;
  let dLine = null, tLine = null;

  while (true) {
    // advance both readers
    const [dl, tl] = await Promise.all([dr.next(), tr.next()]);
    if (dl === null || tl === null) {
      console.log(`\nEnd of file reached at line ${lineNum}.`);
      if (dl === null && tl !== null) console.log('  Delphi trace ended first.');
      if (tl === null && dl !== null) console.log('  TS trace ended first.');
      break;
    }
    lineNum++;

    let da, ta;
    try { da = JSON.parse(dl); } catch { console.log(`Line ${lineNum}: bad Delphi JSON`); continue; }
    try { ta = JSON.parse(tl); } catch { console.log(`Line ${lineNum}: bad TS JSON`); continue; }

    // --from: wait until both traces hit the target PC
    if (skipping) {
      if (da.pc === fromPc && ta.pc === fromPc) skipping = false;
      else continue;
    }

    const diffs = diffRecord(da, ta);
    if (diffs.length > 0) {
      divergences++;
      console.log(`─── Divergence #${divergences} at line ${lineNum} ───`);
      console.log(`  Delphi: ${fmtRecord(da)}`);
      console.log(`  TS    : ${fmtRecord(ta)}`);
      console.log(`  Diff  : ${diffs.join(', ')}`);
      console.log('');
      if (divergences >= stopAfter) {
        console.log(`Stopped after ${stopAfter} divergences.`);
        break;
      }
    }
  }

  if (divergences === 0) {
    console.log(`✓ Traces are identical for all ${lineNum} compared lines.`);
  } else {
    console.log(`Total divergences found: ${divergences} (stopped at ${stopAfter}).`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
