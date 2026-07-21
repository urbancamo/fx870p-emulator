import { CrunchLine, codeSegments } from './scan.js';
import { targetSet } from './refs.js';
import { programBytes } from './bytes.js';

export interface CrunchOptions {
  level: 1 | 2;
  keepComments: boolean;
  noMerge: boolean;
  noSpaces: boolean;
  noRewrites: boolean;
}

export function defaultOptions(): CrunchOptions {
  return { level: 1, keepComments: false, noMerge: false, noSpaces: false, noRewrites: false };
}

export interface PassResult { name: string; lines: CrunchLine[]; bytes: number }

// Apply fn to the code segments of a statement, preserving strings verbatim.
export function mapCode(stmt: string, fn: (code: string) => string): string {
  return codeSegments(stmt).map(s => (s.code ? fn(s.text) : s.text)).join('');
}

export function passComments(lines: CrunchLine[], opts: CrunchOptions): CrunchLine[] {
  const targets = targetSet(lines);
  const out: CrunchLine[] = [];
  for (const line of lines) {
    const l: CrunchLine = { ...line, stmts: [...line.stmts], notes: [...line.notes] };
    if (l.comment && !opts.keepComments) {
      if (l.stmts.length > 0) {
        l.comment = null;
        l.notes.push('comment stripped');
      } else if (targets.has(l.num)) {
        l.comment = null;
        l.notes.push('kept empty: jump target');
      } else {
        continue; // delete comment-only, unreferenced line
      }
    } else if (l.comment && opts.keepComments && l.comment.marker === 'REM') {
      l.notes.push("REM converted to '");
      l.comment = { marker: "'", text: l.comment.text };
    }
    out.push(l);
  }
  return out;
}

export function passRewrites(lines: CrunchLine[], opts: CrunchOptions): CrunchLine[] {
  if (opts.noRewrites) return lines;
  return lines.map(line => {
    const stmts = line.stmts.map(stmt => {
      let s = mapCode(stmt, c => c.replace(/\b(THEN|ELSE)\s+GOTO\s*(?=\d)/gi,
        (_, kw: string) => kw.toUpperCase() + ' '));
      s = mapCode(s, c => c.replace(/(^|:)\s*LET\b\s*/gi, '$1'));
      s = mapCode(s, c => c.replace(/\b(THEN|ELSE)\s+LET\b\s*/gi,
        (_, kw: string) => kw.toUpperCase() + ' '));
      return s;
    });
    const changed = stmts.some((s, i) => s !== line.stmts[i]);
    return changed
      ? { ...line, stmts, notes: [...line.notes, 'rewrites applied'] }
      : line;
  });
}

// passSpaces / passMerge appended in Task 4; passLevel2 in Task 5.
// runPipeline appended in Task 4 once all level-1 passes exist.
