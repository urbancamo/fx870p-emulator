import { CrunchLine, codeSegments, headKeyword } from './scan.js';
import { targetSet } from './refs.js';
import { programBytes, lineBytes } from './bytes.js';
import { PREFIX4, PREFIX5, PREFIX6, PREFIX7 } from '../../src/emulator/basic-tokens.js';

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

// Reserved words that must never be produced (or mistaken for) a variable
// name: every keyword the tokenizer recognizes, built from the ROM-derived
// prefix tables (PREFIX4..PREFIX7 are flat string arrays with '' for unmapped
// codes -- filter those out and skip anything that isn't a keyword name).
const RESERVED = new Set<string>(
  [...PREFIX4, ...PREFIX5, ...PREFIX6, ...PREFIX7]
    .filter((w): w is string => typeof w === 'string' && /^[A-Z]/.test(w))
    .map(w => w.toUpperCase()));

// Reserved-ness is checked against the FULL matched identifier (with its
// trailing '$' still attached, if any) -- never against the dollar-stripped
// base. That matters for two distinct reasons:
//  - Builtin string functions tokenize as a single unit that includes the
//    '$' (MID$, LEFT$, RIGHT$, CHR$, STR$, HEX$, INKEY$, CALC$, DMS$ are
//    listed in the prefix tables with the '$' already attached) -- a user
//    identifier only collides with these if the '$' matches too.
//  - Conversely, the real tokenizer (see matchKeyword's word-boundary check
//    in tokenize.ts) does NOT treat a trailing '$' as continuing a keyword
//    match for keywords that don't themselves end in '$': "NAME$" or "PI$"
//    tokenize as the bare keyword (NAME/PI) followed by a stray '$' byte,
//    NOT as a blocked identifier. So a base-only match (stripping the '$'
//    first) would wrongly treat e.g. "NAME$" as colliding with the NAME
//    statement keyword, when in this dialect it never did to begin with.
//
// A handful of keywords also tokenize with a trailing '#' (WRITE#, RAN#)
// that IDENT_RE never captures (it only ever captures a trailing '$', never
// '#', since no user variable can end in '#'). Without the extra `id + '#'`
// check, source text like "RAN#" or "WRITE#" would be seen as the bare
// identifiers RAN / WRITE, which aren't themselves in RESERVED (only
// "RAN#"/"WRITE#" are) -- silently renaming them would corrupt the keyword.
function isReservedToken(id: string): boolean {
  return RESERVED.has(id) || RESERVED.has(id + '#');
}

let renameMap = new Map<string, string>();
export function lastRenameMap(): Map<string, string> { return renameMap; }

// Excludes matches preceded by a digit or '.' so the exponent letter in
// scientific-notation literals (1E4, 1.5E3) is never mistaken for an
// identifier -- without the lookbehind, IDENT_RE would match "E4"/"E3" and
// rename the exponent right out of the constant.
const IDENT_RE = /(?<![0-9.])[A-Za-z][A-Za-z0-9]*\$?/g;

export function passLevel2(lines: CrunchLine[], opts: CrunchOptions): CrunchLine[] {
  renameMap = new Map();
  if (opts.level < 2) return lines;

  // --- census of identifiers (code segments only, keywords excluded) ---
  const counts = new Map<string, number>();
  const inUse = new Set<string>();
  for (const line of lines) {
    for (const stmt of line.stmts) {
      if (headKeyword(stmt) === 'DATA') continue; // DATA payloads aren't identifiers
      for (const seg of codeSegments(stmt)) {
        if (!seg.code) continue;
        for (const m of seg.text.matchAll(IDENT_RE)) {
          const id = m[0].toUpperCase();
          const base = id.endsWith('$') ? id.slice(0, -1) : id;
          if (isReservedToken(id)) continue;
          counts.set(id, (counts.get(id) ?? 0) + 1);
          inUse.add(base);
        }
      }
    }
  }

  // --- allocate shortest free names, biggest savings first ---
  function savings([id, n]: [string, number]): number {
    const baseLen = id.endsWith('$') ? id.length - 1 : id.length;
    return (baseLen - 1) * n;
  }
  const candidates = [...counts.entries()]
    .filter(([id]) => (id.endsWith('$') ? id.length - 1 : id.length) >= 2)
    .sort((a, b) => savings(b) - savings(a));
  const freeNames: string[] = [];
  for (let c = 65; c <= 90; c++) freeNames.push(String.fromCharCode(c));
  for (let c = 65; c <= 90; c++)
    for (let d = 48; d <= 57; d++)
      freeNames.push(String.fromCharCode(c) + String.fromCharCode(d));
  let fi = 0;
  const nextFree = (): string | null => {
    while (fi < freeNames.length) {
      const n = freeNames[fi++];
      if (!inUse.has(n) && !RESERVED.has(n)) return n;
    }
    return null;
  };
  for (const [id] of candidates) {
    const suffix = id.endsWith('$') ? '$' : '';
    const base = suffix ? id.slice(0, -1) : id;
    const nn = nextFree();
    if (nn === null || nn.length >= base.length) continue; // no byte win left
    renameMap.set(id, nn + suffix);
    inUse.add(nn);
  }

  // --- apply renames + NEXT stripping ---
  return lines.map(line => {
    let stmts = line.stmts.map(stmt => headKeyword(stmt) === 'DATA' ? stmt : mapCode(stmt, code =>
      code.replace(IDENT_RE, w => renameMap.get(w.toUpperCase()) ?? w)));
    const expanded: string[] = [];
    for (const stmt of stmts) {
      const m = /^NEXT\s+([A-Za-z][A-Za-z0-9]*\$?(\s*,\s*[A-Za-z][A-Za-z0-9]*\$?)*)$/i.exec(stmt);
      if (m) {
        const n = m[1].split(',').length;
        for (let k = 0; k < n; k++) expanded.push('NEXT');
      } else {
        expanded.push(stmt);
      }
    }
    stmts = expanded;
    const changed = stmts.length !== line.stmts.length ||
      stmts.some((s, i) => s !== line.stmts[i]);
    return changed ? { ...line, stmts, notes: [...line.notes, 'level-2 applied'] } : line;
  });
}
