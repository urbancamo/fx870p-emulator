// Line-reference graph. References are found in code segments only.
// GOTO/GOSUB accept a comma-separated list (the ON..GOTO/ON..GOSUB form);
// THEN/ELSE/RESTORE/RESUME/RUN take a single target.
import { CrunchLine, codeSegments } from './scan.js';

export interface LineRef { fromNum: number; target: number; kind: string }

const LIST_KEYWORDS = new Set(['GOTO', 'GOSUB']);
const SINGLE_KEYWORDS = new Set(['THEN', 'ELSE', 'RESTORE', 'RESUME', 'RUN']);

export function findRefs(lines: CrunchLine[]): LineRef[] {
  const out: LineRef[] = [];
  for (const line of lines) {
    for (const stmt of line.stmts) {
      for (const seg of codeSegments(stmt)) {
        if (!seg.code) continue;
        const t = seg.text;
        let i = 0;
        while (i < t.length) {
          if (!/[A-Za-z]/.test(t[i])) { i++; continue; }
          let j = i;
          while (j < t.length && /[A-Za-z0-9]/.test(t[j])) j++;
          const word = t.slice(i, j).toUpperCase();
          i = j;
          if (!LIST_KEYWORDS.has(word) && !SINGLE_KEYWORDS.has(word)) continue;
          // capture number(s) after the keyword
          let first = true;
          for (;;) {
            let k = i;
            while (k < t.length && t[k] === ' ') k++;
            if (!first) {
              if (t[k] !== ',') break;
              k++;
              while (k < t.length && t[k] === ' ') k++;
            }
            let d = k;
            while (d < t.length && /[0-9]/.test(t[d])) d++;
            if (d === k) {
              // Not a bare line number (e.g. "#3" program-area entry). GOTO/GOSUB
              // lists may mix these with line numbers, so skip over this entry's
              // characters (entries can't contain commas or colons) and keep
              // scanning for further comma-separated targets. Single-target
              // keywords have nothing to recover into, so they still stop here.
              if (!LIST_KEYWORDS.has(word)) break;
              let e = k;
              while (e < t.length && t[e] !== ',') e++;
              if (e === k) break;            // malformed empty entry - stop safely
              i = e;
              first = false;
              continue;
            }
            out.push({ fromNum: line.num, target: parseInt(t.slice(k, d), 10), kind: word });
            i = d;
            first = false;
            if (SINGLE_KEYWORDS.has(word)) break;
          }
        }
      }
    }
  }
  return out;
}

export function targetSet(lines: CrunchLine[]): Set<number> {
  return new Set(findRefs(lines).map(r => r.target));
}

export function findWarnings(lines: CrunchLine[]): string[] {
  const warnings: string[] = [];
  const nums = new Set(lines.map(l => l.num));
  for (const line of lines) {
    for (const stmt of line.stmts) {
      for (const seg of codeSegments(stmt)) {
        if (seg.code && /\bERL\b/i.test(seg.text)) {
          warnings.push(
            `line ${line.num}: ERL comparison couples logic to line numbers - left untouched`);
        }
        if (seg.code && /\bRESTORE\s*\(/i.test(seg.text)) {
          warnings.push(
            `line ${line.num}: computed RESTORE target - referenced line cannot be statically protected`);
        }
      }
    }
  }
  for (const r of findRefs(lines)) {
    if (!nums.has(r.target)) {
      warnings.push(`line ${r.fromNum}: ${r.kind} ${r.target} references a nonexistent line`);
    }
  }
  return warnings;
}
