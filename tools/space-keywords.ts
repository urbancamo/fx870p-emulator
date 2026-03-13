#!/usr/bin/env tsx
// tools/space-keywords.ts
//
// Add spaces around BASIC keywords in .bas source files.
// The scientific library programs have keywords crammed together with no spaces
// (e.g. IFPEEK&HA000=10THENK1=32). This script inserts spaces to make them readable.
//
// Uses greedy longest-match keyword recognition (same as the ROM tokenizer)
// without word boundary checks, since the original files have no spaces.
//
// Usage: npx tsx tools/space-keywords.ts

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { PREFIX4, PREFIX5, PREFIX6, PREFIX7 } from '../src/emulator/basic-tokens.js';

// ── Build keyword list ───────────────────────────────────────────────────────

const allKw = new Set<string>();
for (const table of [PREFIX4, PREFIX5, PREFIX6, PREFIX7]) {
  for (const kw of table) if (kw) allKw.add(kw);
}
// Add compound hyperbolic keywords
for (const c of ['HYP SIN', 'HYP COS', 'HYP TAN', 'HYP ASN', 'HYP ACS', 'HYP ATN']) {
  allKw.add(c);
}
// Add compound keywords that must match before their prefixes
allKw.add('OUTPUT');

// Sort by length descending for greedy matching
const kwSorted = [...allKw].sort((a, b) => b.length - a.length);

// ── Spacing rules ────────────────────────────────────────────────────────────

// Characters that warrant a space AFTER a keyword
function needsSpaceAfter(ch: string): boolean {
  return /[A-Za-z0-9&"@.#]/.test(ch);
}

// Characters that warrant a space BEFORE a keyword
function needsSpaceBefore(ch: string): boolean {
  return /[A-Za-z0-9$#)]/.test(ch);
}

// ── Line processor ───────────────────────────────────────────────────────────

function processBody(body: string): string {
  const upper = body.toUpperCase();
  const out: string[] = [];
  let i = 0;
  let inStr = false;
  let inRem = false;

  while (i < body.length) {
    // After REM or apostrophe: rest of line is raw comment
    if (inRem) {
      out.push(body.substring(i));
      break;
    }

    // Inside a string literal: pass through until closing quote
    if (inStr) {
      out.push(body[i]);
      if (body[i] === '"') inStr = false;
      i++;
      continue;
    }

    // Opening quote
    if (body[i] === '"') {
      // Add space before quote if previous char warrants it
      if (out.length > 0) {
        const lc = out[out.length - 1].slice(-1);
        if (lc !== ' ' && /[A-Za-z0-9$#)]/.test(lc)) out.push(' ');
      }
      out.push('"');
      inStr = true;
      i++;
      continue;
    }

    // Apostrophe = REM shorthand
    if (body[i] === "'") {
      out.push(body.substring(i));
      break;
    }

    // Preserve existing spaces
    if (body[i] === ' ') {
      out.push(' ');
      i++;
      continue;
    }

    // Statement separator
    if (body[i] === ':') {
      out.push(':');
      i++;
      continue;
    }

    // Hex/octal/binary literals: &H..., &O..., &B...
    // Don't try to keyword-match inside numeric literals
    if (body[i] === '&' && i + 1 < body.length && /[HhOoBb]/.test(body[i + 1])) {
      out.push(body[i]);
      i++;
      out.push(body[i]);
      i++;
      while (i < body.length && /[0-9A-Fa-f]/.test(body[i])) {
        out.push(body[i]);
        i++;
      }
      continue;
    }

    // Try keyword match (greedy longest first)
    let matched = false;
    for (const kw of kwSorted) {
      if (i + kw.length > body.length) continue;
      if (upper.substring(i, i + kw.length) !== kw) continue;

      // Space before keyword if previous char is alphanumeric/$/#/)
      if (out.length > 0) {
        const lc = out[out.length - 1].slice(-1);
        if (lc !== ' ' && needsSpaceBefore(lc)) {
          out.push(' ');
        }
      }

      out.push(body.substring(i, i + kw.length));
      i += kw.length;

      // Space after keyword if next char is alphanumeric/&/"/etc.
      if (i < body.length && body[i] !== ' ' && needsSpaceAfter(body[i])) {
        out.push(' ');
      }

      if (kw === 'REM' || kw === 'DATA') inRem = true;
      matched = true;
      break;
    }

    if (!matched) {
      out.push(body[i]);
      i++;
    }
  }

  return out.join('');
}

// ── File processor ───────────────────────────────────────────────────────────

function processFile(filepath: string): void {
  const content = readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');
  const result = lines.map(line => {
    const trimmed = line.trimEnd();
    if (!trimmed) return '';
    const m = trimmed.match(/^(\d+)\s*(.*)/);
    if (!m) return trimmed;
    const [, num, body] = m;
    if (!body) return num;
    return `${num} ${processBody(body)}`;
  });
  writeFileSync(filepath, result.join('\n'));
}

// ── Main ─────────────────────────────────────────────────────────────────────

const dir = join(process.cwd(), 'public/basic/scientific-library');
const files = readdirSync(dir).filter(f => f.endsWith('.bas'));

for (const f of files) {
  console.log(`  ${f}`);
  processFile(join(dir, f));
}
console.log(`\nDone: ${files.length} files processed.`);
