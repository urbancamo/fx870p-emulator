import { CrunchLine, codeSegments, headKeyword } from './scan.js';
import { targetSet } from './refs.js';
import { programBytes, lineBytes } from './bytes.js';

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

const UNCOND_END = new Set(['GOTO', 'RETURN', 'END', 'STOP']);

function stripSpacesInCode(code: string): string {
  // Tokenize into words / numbers / other; drop spaces, then re-insert a single
  // space wherever a word|number token abuts a following word|number token
  // (conservative portable rule -- see design spec pass 4).
  const toks: { t: 'an' | 'other'; s: string }[] = [];
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    if (c === ' ') { i++; continue; }
    if (/[A-Za-z0-9.]/.test(c)) {
      let j = i;
      while (j < code.length && /[A-Za-z0-9.$#]/.test(code[j])) j++;
      toks.push({ t: 'an', s: code.slice(i, j) });
      i = j;
    } else {
      toks.push({ t: 'other', s: c });
      i++;
    }
  }
  let out = '';
  for (let k = 0; k < toks.length; k++) {
    if (k > 0 && toks[k - 1].t === 'an' && toks[k].t === 'an') out += ' ';
    out += toks[k].s;
  }
  return out;
}

export function passSpaces(lines: CrunchLine[], opts: CrunchOptions): CrunchLine[] {
  if (opts.noSpaces) return lines;
  return lines.map(line => {
    const stmts = line.stmts.map(stmt =>
      headKeyword(stmt) === 'DATA' ? stmt.trim() : mapCode(stmt, stripSpacesInCode));
    const changed = stmts.some((s, i) => s !== line.stmts[i]);
    return changed ? { ...line, stmts, notes: [...line.notes, 'spaces stripped'] } : line;
  });
}

function lineHasIf(l: CrunchLine): boolean {
  return l.stmts.some(s => headKeyword(s) === 'IF');
}

function lastStmtHead(l: CrunchLine): string {
  return l.stmts.length ? headKeyword(l.stmts[l.stmts.length - 1]) : '';
}

export function passMerge(lines: CrunchLine[], opts: CrunchOptions): CrunchLine[] {
  if (opts.noMerge) return lines;
  const targets = targetSet(lines);
  const out: CrunchLine[] = lines.map(l => ({ ...l, stmts: [...l.stmts], origins: [...l.origins], notes: [...l.notes] }));
  let i = 0;
  while (i < out.length - 1) {
    const pred = out[i];
    const next = out[i + 1];
    const blocked =
      targets.has(next.num) ||
      pred.stmts.length === 0 || next.stmts.length === 0 ||
      pred.comment !== null ||
      lineHasIf(pred) ||
      UNCOND_END.has(lastStmtHead(pred)) ||
      lastStmtHead(pred) === 'DATA';
    if (!blocked) {
      const candidate = [...pred.stmts, ...next.stmts].join(':') +
        (next.comment ? "'" + next.comment.text : '');
      let fits = candidate.length <= 255;
      if (fits) {
        try {
          fits = lineBytes(pred.num, candidate) <= 255;
        } catch {
          fits = false; // tokenizer throws on >255-byte records
        }
      }
      if (fits) {
        pred.stmts.push(...next.stmts);
        pred.comment = next.comment;
        pred.origins.push(...next.origins);
        pred.notes.push(`merged line ${next.num}`);
        out.splice(i + 1, 1);
        continue; // try to chain further merges into pred
      }
    }
    i++;
  }
  return out;
}

export function runPipeline(lines: CrunchLine[], opts: CrunchOptions):
    { lines: CrunchLine[]; snapshots: PassResult[] } {
  const snapshots: PassResult[] = [{ name: 'source', lines, bytes: programBytes(lines) }];
  const record = (name: string, l: CrunchLine[]) =>
    snapshots.push({ name, lines: l, bytes: programBytes(l) });

  let cur = passComments(lines, opts);
  record('comment elimination', cur);
  cur = passRewrites(cur, opts);
  record('micro-rewrites', cur);
  if (opts.level >= 2) {
    cur = passLevel2(cur, opts);
    record('level-2 (rename, NEXT)', cur);
  }
  cur = passSpaces(cur, opts);
  record('whitespace strip', cur);
  cur = passMerge(cur, opts);
  record('line merging', cur);
  return { lines: cur, snapshots };
}

// Pass-through stub; Task 5 replaces this with the real level-2 pass
// (variable renaming, NEXT-without-var, etc).
export function passLevel2(lines: CrunchLine[], _opts: CrunchOptions): CrunchLine[] {
  return lines;
}
