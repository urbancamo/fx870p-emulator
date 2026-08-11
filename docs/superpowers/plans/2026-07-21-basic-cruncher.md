# BASIC Program Cruncher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TypeScript CLI (`tools/cruncher/`) that minimises the stored byte size of a Casio JIS BASIC program per the agreed design spec `docs/superpowers/specs/2026-07-21-basic-compressor-design.md`, emitting an optimized .BAS plus a 132-column VMS-style listing with per-pass statistics.

**Architecture:** Statement-level model (never a full AST): `scan.ts` parses lines into statements with string/comment awareness; `refs.ts` extracts the line-reference graph; passes transform the model; `src/emulator/tokenize.ts` is the byte oracle (exact stored bytes); `listing.ts` formats the report; `crunch.ts` is the CLI.

**Tech Stack:** TypeScript (repo conventions: ESM, `.js` import suffixes), vitest (config already includes `tools/**/*.test.ts`), no new dependencies. Run via `npx tsx`.

## Global Constraints

- Byte oracle: `tokenizeLine(num, text)` / `tokenizeProgram(lines)` from `src/emulator/tokenize.ts`; source parsing via its `parseListingText(text)`.
- Never renumber; never touch string literals, DATA payloads, or `ERL` comparisons.
- Referenced comment-only lines become **empty lines** (4 bytes), never deleted — a deliberate simplification of the spec's retarget option chosen for safety: no reference rewriting exists anywhere in the tool. Annotate `[kept empty: jump target]` in the listing. (The spec's "Retarget map" listing section is dropped accordingly.)
- Space stripping keeps ONE space between any `(word|number)` token and a following `(word|number)` token; all other spaces outside strings/DATA/comments are removed. This is the conservative portable rule from the spec.
- Merging: successor must not be a jump target; predecessor must have no `IF` statement, no comment, no trailing `DATA` statement, and must not end in `GOTO`/`RETURN`/`END`/`STOP`; result must tokenize (≤255-byte record) and be ≤255 source chars. `ON…GOTO/GOSUB` is NOT an unconditional end (falls through when out of range).
- Level 2 only: variable renaming and `NEXT` variable-stripping. New variable names: single letters `A`-`Z`, then letter+digit — never a name equal to (or beginning with) a reserved word; keys are full identifiers including `$` suffix.
- Commit after each green test cycle on `main`, conventional commits.
- Coding style: match repo (2-space indent, single quotes, existing emulator module conventions).

## File Structure

```
tools/cruncher/
├── scan.ts            # source → CrunchLine[] model; emit back to text
├── refs.ts            # line-reference extraction, target set, ERL warnings
├── bytes.ts           # byte oracle wrappers + program snapshots
├── passes.ts          # all transformation passes + pipeline driver
├── listing.ts         # 132-column listing formatter
├── crunch.ts          # CLI entry
└── tests/
    ├── scan.test.ts
    ├── refs.test.ts
    ├── passes.test.ts
    ├── level2.test.ts
    └── acceptance.test.ts
```

---

### Task 1: Scanner and line model

**Files:**
- Create: `tools/cruncher/scan.ts`
- Test: `tools/cruncher/tests/scan.test.ts`

**Interfaces:**
- Produces: `Comment { marker: 'REM' | "'"; text: string }`; `CrunchLine { num: number; stmts: string[]; comment: Comment | null; origins: number[]; notes: string[] }`; `parseSource(src: string): CrunchLine[]`; `splitBody(body: string): { stmts: string[]; comment: Comment | null }`; `headKeyword(stmt: string): string`; `codeSegments(s: string): { code: boolean; text: string }[]`; `emitLine(l: CrunchLine): string`; `emitProgram(lines: CrunchLine[]): string`. All later tasks consume these.

- [ ] **Step 1: Write the failing tests**

`tools/cruncher/tests/scan.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseSource, splitBody, headKeyword, codeSegments, emitLine, emitProgram } from '../scan.js';

describe('splitBody', () => {
  it('splits on colons outside strings', () => {
    expect(splitBody('A=1:B=2:PRINT A+B')).toEqual({
      stmts: ['A=1', 'B=2', 'PRINT A+B'], comment: null,
    });
  });
  it('keeps colons inside strings', () => {
    expect(splitBody('PRINT "A:B":C=1')).toEqual({
      stmts: ['PRINT "A:B"', 'C=1'], comment: null,
    });
  });
  it('apostrophe starts a comment anywhere outside strings', () => {
    expect(splitBody("PRINT A ' note")).toEqual({
      stmts: ['PRINT A'], comment: { marker: "'", text: ' note' },
    });
    expect(splitBody('PRINT "don' + "'" + 't"')).toEqual({
      stmts: ['PRINT "don' + "'" + 't"'], comment: null,
    });
  });
  it('REM at statement head swallows the rest of the line', () => {
    expect(splitBody('REM === INIT ===')).toEqual({
      stmts: [], comment: { marker: 'REM', text: ' === INIT ===' },
    });
    expect(splitBody('A=1: REM done')).toEqual({
      stmts: ['A=1'], comment: { marker: 'REM', text: ' done' },
    });
  });
  it('REM is not matched inside identifiers or mid-statement', () => {
    expect(splitBody('REMY=1')).toEqual({ stmts: ['REMY=1'], comment: null });
    expect(splitBody('PRINT REMY')).toEqual({ stmts: ['PRINT REMY'], comment: null });
  });
  it('drops empty statements from :: and trailing :', () => {
    expect(splitBody('A=1::B=2:').stmts).toEqual(['A=1', 'B=2']);
  });
  it('unterminated string runs to end of line', () => {
    expect(splitBody('PRINT "TEST').stmts).toEqual(['PRINT "TEST']);
  });
});

describe('headKeyword', () => {
  it('returns the uppercased leading word', () => {
    expect(headKeyword('goto 100')).toBe('GOTO');
    expect(headKeyword('  IF A=1 THEN 2')).toBe('IF');
    expect(headKeyword('=oops')).toBe('');
  });
});

describe('codeSegments', () => {
  it('alternates code and string segments', () => {
    expect(codeSegments('A="X":B="Y"')).toEqual([
      { code: true, text: 'A=' },
      { code: false, text: '"X"' },
      { code: true, text: ':B=' },
      { code: false, text: '"Y"' },
    ]);
  });
  it('handles unterminated strings', () => {
    expect(codeSegments('PRINT "TEST')).toEqual([
      { code: true, text: 'PRINT ' },
      { code: false, text: '"TEST' },
    ]);
  });
});

describe('parseSource / emit round trip', () => {
  it('parses numbered lines and re-emits equivalently', () => {
    const src = '10 A=1:B=2\n20 PRINT A \' sum\n30 REM gone\n';
    const lines = parseSource(src);
    expect(lines.map(l => l.num)).toEqual([10, 20, 30]);
    expect(lines[0].stmts).toEqual(['A=1', 'B=2']);
    expect(lines[1].comment).toEqual({ marker: "'", text: ' sum' });
    expect(lines[2].stmts).toEqual([]);
    // emit always uses the 1-byte apostrophe marker
    expect(emitLine(lines[1])).toBe("PRINT A' sum");
    expect(emitLine(lines[2])).toBe("' gone");
    expect(emitProgram([lines[0]])).toBe('10 A=1:B=2\n');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tools/cruncher/tests/scan.test.ts`
Expected: FAIL — cannot resolve `../scan.js`.

- [ ] **Step 3: Implement**

`tools/cruncher/scan.ts`:
```typescript
// Statement-level model of a Casio JIS BASIC program.
// String/comment aware but deliberately NOT a full parser: passes operate on
// statement text, and src/emulator/tokenize.ts is the byte-level authority.
import { parseListingText } from '../../src/emulator/tokenize.js';

export interface Comment { marker: 'REM' | "'"; text: string }

export interface CrunchLine {
  num: number;
  stmts: string[];          // statement texts; ':' separators implied
  comment: Comment | null;  // trailing comment (rest of line)
  origins: number[];        // original line numbers folded into this line
  notes: string[];          // listing annotations
}

export function headKeyword(stmt: string): string {
  const m = /^\s*([A-Za-z]+)/.exec(stmt);
  return m ? m[1].toUpperCase() : '';
}

export function splitBody(body: string): { stmts: string[]; comment: Comment | null } {
  const stmts: string[] = [];
  let cur = '';
  let inStr = false;
  let comment: Comment | null = null;
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    if (inStr) {
      cur += c;
      if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '"') { inStr = true; cur += c; i++; continue; }
    if (c === "'") { comment = { marker: "'", text: body.slice(i + 1) }; break; }
    if (c === ':') { stmts.push(cur.trim()); cur = ''; i++; continue; }
    if (cur.trim() === '' && /^[Rr][Ee][Mm]([^A-Za-z0-9]|$)/.test(body.slice(i))) {
      comment = { marker: 'REM', text: body.slice(i + 3) };
      break;
    }
    cur += c;
    i++;
  }
  if (cur.trim() !== '') stmts.push(cur.trim());
  return { stmts: stmts.filter(s => s !== ''), comment };
}

// Split a statement into alternating code / string-literal segments.
export function codeSegments(s: string): { code: boolean; text: string }[] {
  const out: { code: boolean; text: string }[] = [];
  let cur = '';
  let inStr = false;
  for (const c of s) {
    if (!inStr && c === '"') {
      if (cur !== '') out.push({ code: true, text: cur });
      cur = c;
      inStr = true;
    } else if (inStr && c === '"') {
      cur += c;
      out.push({ code: false, text: cur });
      cur = '';
      inStr = false;
    } else {
      cur += c;
    }
  }
  if (cur !== '') out.push({ code: !inStr, text: cur });
  return out;
}

export function parseSource(src: string): CrunchLine[] {
  return parseListingText(src).map(({ num, text }) => {
    const { stmts, comment } = splitBody(text);
    return { num, stmts, comment, origins: [num], notes: [] };
  });
}

export function emitLine(l: CrunchLine): string {
  let s = l.stmts.join(':');
  // "'" (1 byte) is legal trailing any statement, unlike REM which needs ':'.
  if (l.comment) s += "'" + l.comment.text;
  return s;
}

export function emitProgram(lines: CrunchLine[]): string {
  return lines.map(l => (`${l.num} ` + emitLine(l)).trimEnd()).join('\n') + '\n';
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npx vitest run tools/cruncher/tests/scan.test.ts`
Expected: PASS (all).

- [ ] **Step 5: Commit**

```bash
git add tools/cruncher/scan.ts tools/cruncher/tests/scan.test.ts
git commit -m "feat(cruncher): statement-level scanner and line model"
```

---

### Task 2: Reference graph

**Files:**
- Create: `tools/cruncher/refs.ts`
- Test: `tools/cruncher/tests/refs.test.ts`

**Interfaces:**
- Consumes: `CrunchLine`, `codeSegments` (Task 1).
- Produces: `LineRef { fromNum: number; target: number; kind: string }`; `findRefs(lines: CrunchLine[]): LineRef[]`; `targetSet(lines: CrunchLine[]): Set<number>`; `findWarnings(lines: CrunchLine[]): string[]`.

- [ ] **Step 1: Write the failing tests**

`tools/cruncher/tests/refs.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseSource } from '../scan.js';
import { findRefs, targetSet, findWarnings } from '../refs.js';

const refsOf = (src: string) =>
  findRefs(parseSource(src)).map(r => `${r.kind}:${r.target}`);

describe('findRefs', () => {
  it('finds GOTO/GOSUB/THEN/ELSE/RESTORE/RESUME/RUN targets', () => {
    expect(refsOf('10 GOTO 100\n')).toEqual(['GOTO:100']);
    expect(refsOf('10 GOSUB 1000\n')).toEqual(['GOSUB:1000']);
    expect(refsOf('10 IF A=0 THEN 300 ELSE 400\n')).toEqual(['THEN:300', 'ELSE:400']);
    expect(refsOf('10 RESTORE 500\n')).toEqual(['RESTORE:500']);
    expect(refsOf('10 RESUME 20\n')).toEqual(['RESUME:20']);
  });
  it('finds all targets of ON..GOTO / ON..GOSUB lists', () => {
    expect(refsOf('10 ON A GOTO 100,200,300\n')).toEqual(['GOTO:100', 'GOTO:200', 'GOTO:300']);
    expect(refsOf('10 ON A GOSUB 10, 20\n')).toEqual(['GOSUB:10', 'GOSUB:20']);
    expect(refsOf('10 ON ERROR GOTO 900\n')).toEqual(['GOTO:900']);
  });
  it('THEN followed by a statement is not a ref', () => {
    expect(refsOf('10 IF A THEN PRINT 5\n')).toEqual([]);
  });
  it('THEN GOTO n yields one ref, not two', () => {
    expect(refsOf('10 IF A THEN GOTO 130\n')).toEqual(['GOTO:130']);
  });
  it('ignores numbers inside strings', () => {
    expect(refsOf('10 PRINT "GOTO 999"\n')).toEqual([]);
  });
});

describe('targetSet / findWarnings', () => {
  it('collects the set of referenced line numbers', () => {
    const t = targetSet(parseSource('10 GOTO 30\n20 GOSUB 40\n30 A=1\n40 RETURN\n'));
    expect([...t].sort((a, b) => a - b)).toEqual([30, 40]);
  });
  it('warns on ERL comparisons and dangling references', () => {
    const w = findWarnings(parseSource('10 IF ERL=270 THEN 20\n20 GOTO 999\n'));
    expect(w.some(x => x.includes('ERL') && x.includes('10'))).toBe(true);
    expect(w.some(x => x.includes('999'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run tools/cruncher/tests/refs.test.ts` — expected FAIL (module missing).

- [ ] **Step 3: Implement**

`tools/cruncher/refs.ts`:
```typescript
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
            if (d === k) break;              // no number here
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
```

- [ ] **Step 4: Run tests** — `npx vitest run tools/cruncher/tests/refs.test.ts`, expected PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/cruncher/refs.ts tools/cruncher/tests/refs.test.ts
git commit -m "feat(cruncher): line-reference graph and warnings"
```

---

### Task 3: Byte oracle + level-1 passes (comments, rewrites)

**Files:**
- Create: `tools/cruncher/bytes.ts`, `tools/cruncher/passes.ts`
- Test: `tools/cruncher/tests/passes.test.ts`

**Interfaces:**
- Consumes: Tasks 1-2.
- Produces:
  - `bytes.ts`: `lineBytes(num: number, text: string): number`; `programBytes(lines: CrunchLine[]): number`.
  - `passes.ts`: `CrunchOptions { level: 1 | 2; keepComments: boolean; noMerge: boolean; noSpaces: boolean; noRewrites: boolean }`; `defaultOptions(): CrunchOptions`; `PassResult { name: string; lines: CrunchLine[]; bytes: number }`; `passComments`, `passRewrites` (this task), `passSpaces`, `passMerge` (Task 4), `passLevel2` (Task 5), each `(lines: CrunchLine[], opts: CrunchOptions) => CrunchLine[]`; `runPipeline(lines: CrunchLine[], opts: CrunchOptions): { lines: CrunchLine[]; snapshots: PassResult[] }`.

- [ ] **Step 1: Write the failing tests**

`tools/cruncher/tests/passes.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { tokenizeProgram } from '../../../src/emulator/tokenize.js';
import { parseSource, emitLine, emitProgram } from '../scan.js';
import { programBytes } from '../bytes.js';
import { passComments, passRewrites, defaultOptions } from '../passes.js';

describe('programBytes oracle', () => {
  it('matches tokenizeProgram exactly', () => {
    const lines = parseSource('10 PRINT "HELLO"\n20 GOTO 10\n');
    const stream = tokenizeProgram(lines.map(l => ({ num: l.num, text: emitLine(l) })));
    expect(programBytes(lines)).toBe(stream.length);
  });
});

describe('passComments', () => {
  const opts = defaultOptions();
  it('strips trailing comments and deletes unreferenced comment-only lines', () => {
    const out = passComments(parseSource("10 A=1 ' note\n20 REM gone\n30 B=2\n"), opts);
    expect(out.map(l => l.num)).toEqual([10, 30]);
    expect(out[0].comment).toBeNull();
  });
  it('keeps referenced comment-only lines as empty lines', () => {
    const out = passComments(parseSource('10 GOTO 30\n30 REM target\n40 A=1\n'), opts);
    const kept = out.find(l => l.num === 30)!;
    expect(kept.stmts).toEqual([]);
    expect(kept.comment).toBeNull();
    expect(kept.notes.join()).toContain('jump target');
  });
  it('keepComments retains text (emitted with 1-byte apostrophe)', () => {
    const out = passComments(parseSource('10 REM stay\n'), { ...opts, keepComments: true });
    expect(out).toHaveLength(1);
    expect(emitLine(out[0])).toBe("' stay");
  });
});

describe('passRewrites', () => {
  const opts = defaultOptions();
  it('rewrites THEN GOTO n / ELSE GOTO n to THEN n / ELSE n', () => {
    const out = passRewrites(parseSource('10 IF A THEN GOTO 130 ELSE GOTO 200\n'), opts);
    expect(out[0].stmts[0]).toBe('IF A THEN 130 ELSE 200');
  });
  it('never touches string literals', () => {
    const out = passRewrites(parseSource('10 PRINT "THEN GOTO 5"\n'), opts);
    expect(out[0].stmts[0]).toBe('PRINT "THEN GOTO 5"');
  });
  it('strips LET', () => {
    const out = passRewrites(parseSource('10 LET A=1:LET B=2\n'), opts);
    expect(out[0].stmts).toEqual(['A=1', 'B=2']);
  });
  it('does not strip LET-prefixed identifiers', () => {
    const out = passRewrites(parseSource('10 LETTER=1\n'), opts);
    expect(out[0].stmts).toEqual(['LETTER=1']);
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run tools/cruncher/tests/passes.test.ts`, expected FAIL.

- [ ] **Step 3: Implement**

`tools/cruncher/bytes.ts`:
```typescript
// Exact stored-byte accounting via the emulator's own tokenizer.
import { tokenizeLine } from '../../src/emulator/tokenize.js';
import { CrunchLine, emitLine } from './scan.js';

// Full record bytes for one line (length byte + line number + body + terminator).
export function lineBytes(num: number, text: string): number {
  return tokenizeLine(num, text).bytes.length;
}

// Whole-program stored size incl. the trailing end-of-program marker.
export function programBytes(lines: CrunchLine[]): number {
  let total = 1;
  for (const l of lines) total += lineBytes(l.num, emitLine(l));
  return total;
}
```
(If `TokenizedLine.bytes` turns out not to include the record length byte, the oracle
test in Step 1 fails by exactly `lines.length` — adjust `lineBytes` to
`bytes.length + 1` in that case. The test pins whichever is true.)

`tools/cruncher/passes.ts` (this task adds the framework + two passes; Tasks 4-5 append):
```typescript
import { CrunchLine, codeSegments, headKeyword } from './scan.js';
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
```
Note: `LET` strip uses `(^|:)` but statements never contain leading `:` after
splitBody — the `^` alternative is the live one; keep the character class anyway
for safety inside mapCode segments.

- [ ] **Step 4: Run tests** — `npx vitest run tools/cruncher/tests/passes.test.ts`, expected PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/cruncher/bytes.ts tools/cruncher/passes.ts tools/cruncher/tests/passes.test.ts
git commit -m "feat(cruncher): byte oracle, comment and rewrite passes"
```

---

### Task 4: Whitespace strip + line merge + pipeline

**Files:**
- Modify: `tools/cruncher/passes.ts` (append `passSpaces`, `passMerge`, `runPipeline`)
- Test: append to `tools/cruncher/tests/passes.test.ts`

**Interfaces:**
- Produces: `passSpaces`, `passMerge`, `runPipeline` as declared in Task 3's interface block.

- [ ] **Step 1: Append the failing tests**

Append to `tools/cruncher/tests/passes.test.ts`:
```typescript
import { passSpaces, passMerge, runPipeline } from '../passes.js';
import { lineBytes } from '../bytes.js';

describe('passSpaces', () => {
  const opts = defaultOptions();
  const one = (src: string) => passSpaces(parseSource(src), opts)[0].stmts.join(':');
  it('removes spaces around punctuation but keeps word-to-alnum gaps', () => {
    expect(one('10 A = 1 : B = 2\n')).toBe('A=1:B=2');
    expect(one('10 PRINT "X" ; A\n')).toBe('PRINT"X";A');
    expect(one('10 FOR I = 1 TO 9\n')).toBe('FOR I=1 TO 9');
    expect(one('10 IF E+S <= 10 THEN 1810\n')).toBe('IF E+S<=10 THEN 1810');
    expect(one('10 GOTO   100\n')).toBe('GOTO 100');
  });
  it('preserves strings and DATA payloads verbatim', () => {
    expect(one('10 PRINT "A  B"\n')).toBe('PRINT"A  B"');
    expect(one('10 DATA FRANK FORT, 35\n')).toBe('DATA FRANK FORT, 35');
  });
  it('collapses multiple word-gap spaces to one', () => {
    expect(one('10 FOR  I=1  TO  9\n')).toBe('FOR I=1 TO 9');
  });
});

describe('passMerge', () => {
  const opts = defaultOptions();
  const nums = (src: string) => passMerge(parseSource(src), opts).map(l => l.num);
  it('merges plain consecutive lines', () => {
    const out = passMerge(parseSource('10 A=1\n20 B=2\n30 C=3\n'), opts);
    expect(out).toHaveLength(1);
    expect(out[0].stmts).toEqual(['A=1', 'B=2', 'C=3']);
    expect(out[0].origins).toEqual([10, 20, 30]);
  });
  it('never merges a jump target into its predecessor', () => {
    expect(nums('10 A=1\n20 B=2\n30 GOTO 20\n')).toEqual([10, 30]); // 20 stays a line start... 
  });
  it('never merges after an IF line', () => {
    expect(nums('10 IF A THEN B=1\n20 C=2\n')).toEqual([10, 20]);
  });
  it('never merges after unconditional GOTO/RETURN/END/STOP', () => {
    expect(nums('10 GOTO 30\n20 A=1\n30 B=2\n')).toEqual([10, 20, 30]);
    expect(nums('10 RETURN\n20 A=1\n')).toEqual([10, 20]);
  });
  it('ON..GOTO falls through, so its line may absorb the next', () => {
    expect(nums('10 ON A GOTO 40,50\n20 B=2\n40 X=1\n50 Y=1\n')).toEqual([10, 40, 50]);
  });
  it('never merges after a trailing DATA statement', () => {
    expect(nums('10 DATA 1,2\n20 A=1\n')).toEqual([10, 20]);
  });
  it('respects the 255-byte record cap', () => {
    const big = 'X$="' + 'A'.repeat(120) + '"';
    const out = passMerge(parseSource(`10 ${big}\n20 ${big}\n30 ${big}\n`), opts);
    for (const l of out) expect(lineBytes(l.num, l.stmts.join(':')) ).toBeLessThanOrEqual(255);
    expect(out.length).toBeGreaterThan(1);
  });
});

describe('runPipeline', () => {
  it('runs all level-1 passes and reports monotone snapshots', () => {
    const src = "10 REM title\n20 A = 1\n30 LET B = 2 ' note\n40 IF A THEN GOTO 20\n";
    const { lines, snapshots } = runPipeline(parseSource(src), defaultOptions());
    expect(snapshots[0].name).toBe('source');
    for (let i = 1; i < snapshots.length; i++) {
      expect(snapshots[i].bytes).toBeLessThanOrEqual(snapshots[i - 1].bytes);
    }
    expect(lines.some(l => l.stmts.join(':').includes('THEN 20'))).toBe(true);
  });
});
```
(Fix the stray trailing spaces/ellipsis in the jump-target test comment when
transcribing — the assertion itself is exact.)

- [ ] **Step 2: Run to verify failure** — expected FAIL (functions not exported).

- [ ] **Step 3: Implement** (append to `tools/cruncher/passes.ts`)

```typescript
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
```
Import `lineBytes` at the top of `passes.ts` (`import { programBytes, lineBytes } from './bytes.js';`).
Until Task 5 exists, add a stub at the bottom so the pipeline compiles:
`export function passLevel2(lines: CrunchLine[], _opts: CrunchOptions): CrunchLine[] { return lines; }`
(Task 5 replaces it.)

- [ ] **Step 4: Run tests** — `npx vitest run tools/cruncher/tests/passes.test.ts`, expected PASS. Also run Tasks 1-2 suites (`npx vitest run tools/cruncher/`), expected PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/cruncher/passes.ts tools/cruncher/tests/passes.test.ts
git commit -m "feat(cruncher): whitespace strip, line merging, and pass pipeline"
```

---

### Task 5: Level-2 pass (variable renaming + NEXT stripping)

**Files:**
- Modify: `tools/cruncher/passes.ts` (replace the `passLevel2` stub)
- Test: `tools/cruncher/tests/level2.test.ts`

**Interfaces:**
- Produces: real `passLevel2(lines, opts)`; also exported for the listing: `lastRenameMap(): Map<string, string>` (old full identifier -> new full identifier, populated by the most recent `passLevel2` run).

- [ ] **Step 1: Write the failing tests**

`tools/cruncher/tests/level2.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { parseSource } from '../scan.js';
import { passLevel2, defaultOptions, lastRenameMap } from '../passes.js';

const l2 = (src: string) =>
  passLevel2(parseSource(src), { ...defaultOptions(), level: 2 as const });

describe('passLevel2 renaming', () => {
  it('renames multi-char variables to shortest free names, keyed with $', () => {
    const out = l2('10 SCORE=1:TOTAL=SCORE+1:PRINT NAME$\n');
    const s = out[0].stmts.join(':');
    expect(s).not.toMatch(/SCORE|TOTAL/);
    expect(s).toMatch(/[A-Z]=1:[A-Z]=[A-Z]\+1/);
    expect(s).toMatch(/PRINT [A-Z]\$/);
    expect([...lastRenameMap().keys()].sort()).toEqual(['NAME$', 'SCORE', 'TOTAL']);
  });
  it('never renames inside strings or keywords, never collides with used names', () => {
    const out = l2('10 A=1:COUNT=2:PRINT "COUNT"\n');
    const s = out[0].stmts.join(':');
    expect(s).toContain('"COUNT"');
    expect(s).toContain('A=1');
    const newName = lastRenameMap().get('COUNT')!;
    expect(newName).not.toBe('A');
    expect(newName).toMatch(/^[A-Z][0-9]?$/);
  });
  it('does not generate reserved-word names', () => {
    // Force exhaustion of many singles to see 2-char allocation stay clean
    const vars = Array.from({ length: 30 }, (_, i) => `LONGNAME${i}=1`).join(':');
    const out = l2(`10 ${vars}\n`);
    for (const nn of lastRenameMap().values()) {
      expect(['TO', 'IF', 'ON', 'OR', 'AS', 'PI', 'LN']).not.toContain(nn);
    }
    expect(out[0].stmts.join(':')).not.toMatch(/LONGNAME/);
  });
});

describe('passLevel2 NEXT stripping', () => {
  it('strips NEXT variables and expands comma chains to bare NEXTs', () => {
    const out = l2('10 FOR I=1 TO 3:FOR J=1 TO 3:NEXT J,I\n');
    expect(out[0].stmts).toEqual(['FOR I=1 TO 3', 'FOR J=1 TO 3', 'NEXT', 'NEXT']);
  });
  it('leaves bare NEXT alone', () => {
    const out = l2('10 FOR I=1 TO 3:NEXT\n');
    expect(out[0].stmts).toEqual(['FOR I=1 TO 3', 'NEXT']);
  });
});
```

- [ ] **Step 2: Run to verify failure** — expected FAIL (stub returns input unchanged / `lastRenameMap` missing).

- [ ] **Step 3: Implement** (replace the stub in `passes.ts`)

```typescript
// Reserved words that must never be produced as variable names, plus every
// keyword known to the tokenizer (imported table keys) as a safety net.
import { KEYWORDS } from '../../src/emulator/basic-tokens.js';
```
First inspect `src/emulator/basic-tokens.ts` for the exported table names (the
prefix tables PREFIX4..PREFIX7 are string arrays). Build the reserved set from
them rather than a hand list:
```typescript
import { PREFIX4, PREFIX5, PREFIX6, PREFIX7 } from '../../src/emulator/basic-tokens.js';

const RESERVED = new Set<string>(
  [...PREFIX4, ...PREFIX5, ...PREFIX6, ...PREFIX7]
    .filter((w): w is string => typeof w === 'string' && /^[A-Z]/.test(w))
    .map(w => w.toUpperCase()));

let renameMap = new Map<string, string>();
export function lastRenameMap(): Map<string, string> { return renameMap; }

const IDENT_RE = /[A-Za-z][A-Za-z0-9]*\$?/g;

export function passLevel2(lines: CrunchLine[], opts: CrunchOptions): CrunchLine[] {
  if (opts.level < 2) return lines;
  renameMap = new Map();

  // --- census of identifiers (code segments only, keywords excluded) ---
  const counts = new Map<string, number>();
  const inUse = new Set<string>();
  for (const line of lines) {
    for (const stmt of line.stmts) {
      for (const seg of codeSegments(stmt)) {
        if (!seg.code) continue;
        for (const m of seg.text.matchAll(IDENT_RE)) {
          const id = m[0].toUpperCase();
          const base = id.endsWith('$') ? id.slice(0, -1) : id;
          if (RESERVED.has(base)) continue;
          counts.set(id, (counts.get(id) ?? 0) + 1);
          inUse.add(base);
        }
      }
    }
  }

  // --- allocate shortest free names, biggest savings first ---
  const candidates = [...counts.entries()]
    .filter(([id]) => (id.endsWith('$') ? id.length - 1 : id.length) >= 2)
    .sort((a, b) => savings(b) - savings(a));
  function savings([id, n]: [string, number]): number {
    const baseLen = id.endsWith('$') ? id.length - 1 : id.length;
    return (baseLen - 1) * n;
  }
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
    let stmts = line.stmts.map(stmt => mapCode(stmt, code =>
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
```
Adjust the `PREFIX4..7` import to whatever `basic-tokens.ts` actually exports
(entries may be `{ text, code }` objects rather than strings — map accordingly;
the reserved-set test in Step 1 plus the existing suites will catch a mismatch).

- [ ] **Step 4: Run tests** — `npx vitest run tools/cruncher/`, expected all PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/cruncher/passes.ts tools/cruncher/tests/level2.test.ts
git commit -m "feat(cruncher): level-2 variable renaming and NEXT stripping"
```

---

### Task 6: Listing formatter, CLI, acceptance

**Files:**
- Create: `tools/cruncher/listing.ts`, `tools/cruncher/crunch.ts`
- Test: `tools/cruncher/tests/acceptance.test.ts`
- Modify: `package.json` (add `"crunch": "tsx tools/cruncher/crunch.ts"` to scripts)
- Modify: `CLAUDE.md` (short section under the existing tools docs: what `npm run crunch` does, flags, outputs)

**Interfaces:**
- Consumes: everything above.
- Produces: `buildListing(args: { sourceName: string; original: CrunchLine[]; result: CrunchLine[]; snapshots: PassResult[]; warnings: string[]; renames: Map<string, string>; opts: CrunchOptions; width?: number; now?: Date }): string`; CLI `npx tsx tools/cruncher/crunch.ts FILE.BAS [-o out] [-l lst] [--level 2] [--keep-comments] [--no-merge] [--no-spaces-strip] [--no-rewrites] [--width N]`.

- [ ] **Step 1: Write the failing acceptance tests**

`tools/cruncher/tests/acceptance.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { tokenizeProgram, parseListingText } from '../../../src/emulator/tokenize.js';
import { parseSource, emitProgram, emitLine } from '../scan.js';
import { findRefs } from '../refs.js';
import { runPipeline, defaultOptions } from '../passes.js';
import { programBytes } from '../bytes.js';
import { buildListing } from '../listing.js';

const PROGRAMS = ['STREK.BAS', 'SORCERER.BAS'];

for (const name of PROGRAMS) {
  describe(`acceptance: ${name}`, () => {
    const src = readFileSync(`public/basic/emulator/${name}`, 'latin1');
    const original = parseSource(src);
    const { lines, snapshots } = runPipeline(original, defaultOptions());

    it('output tokenizes cleanly and is smaller', () => {
      const before = programBytes(original);
      const after = programBytes(lines);
      expect(after).toBeLessThan(before);
      expect((before - after) / before).toBeGreaterThan(0.05); // >=5% reduction
      // whole-program tokenization must not throw
      expect(() => tokenizeProgram(lines.map(l => ({ num: l.num, text: emitLine(l) })))).not.toThrow();
    });

    it('reference graph closes: every cited line exists', () => {
      const nums = new Set(lines.map(l => l.num));
      for (const r of findRefs(lines)) expect(nums.has(r.target)).toBe(true);
    });

    it('emitted text re-parses to the same program', () => {
      const reparsed = parseListingText(emitProgram(lines));
      expect(reparsed.length).toBe(lines.length);
      expect(reparsed.map(l => l.num)).toEqual(lines.map(l => l.num));
    });

    it('listing renders within width with correct summary arithmetic', () => {
      const lst = buildListing({
        sourceName: name, original, result: lines, snapshots,
        warnings: [], renames: new Map(), opts: defaultOptions(),
        now: new Date('2026-07-21T12:00:00Z'),
      });
      for (const row of lst.split('\n')) expect(row.length).toBeLessThanOrEqual(132);
      expect(lst).toContain('Summary');
      const before = snapshots[0].bytes;
      const after = snapshots[snapshots.length - 1].bytes;
      expect(lst).toContain(String(before));
      expect(lst).toContain(String(after));
    });
  });
}
```

- [ ] **Step 2: Run to verify failure** — expected FAIL (`listing.js` missing).

- [ ] **Step 3: Implement `tools/cruncher/listing.ts`**

```typescript
// 132-column, form-feed paginated listing in the style of VMS compiler output.
import { CrunchLine, emitLine } from './scan.js';
import { PassResult, CrunchOptions } from './passes.js';

const PAGE_ROWS = 60;

interface Row { left: string; right: string }

function fit(s: string, w: number): string[] {
  if (s.length <= w) return [s];
  const out: string[] = [];
  for (let i = 0; i < s.length; i += w) out.push(s.slice(i, i + w));
  return out;
}

export function buildListing(args: {
  sourceName: string; original: CrunchLine[]; result: CrunchLine[];
  snapshots: PassResult[]; warnings: string[]; renames: Map<string, string>;
  opts: CrunchOptions; width?: number; now?: Date;
}): string {
  const width = args.width ?? 132;
  const col = Math.floor((width - 4) / 2) - 8;     // text width per side
  const now = args.now ?? new Date();
  const stamp = now.toISOString().slice(0, 16).replace('T', ' ');
  const passNames = args.snapshots.slice(1).map(s => s.name).join(', ');

  // index: original line number -> surviving line (as first origin) or merged host
  const survivors = new Map<number, CrunchLine>();
  const mergedInto = new Map<number, number>();
  for (const l of args.result) {
    survivors.set(l.origins[0], l);
    for (const o of l.origins.slice(1)) mergedInto.set(o, l.num);
  }

  const rows: Row[] = [];
  for (const ol of args.original) {
    const leftBase = `${String(ol.num).padStart(5)}  `;
    const leftText = fit(emitLine(ol), col);
    let rightText: string[];
    let rightBase: string;
    const host = survivors.get(ol.num);
    if (host) {
      rightBase = `${String(host.num).padStart(5)}  `;
      const note = host.notes.length ? `  <- ${host.notes.join('; ')}` : '';
      rightText = fit(emitLine(host) + note, col);
    } else if (mergedInto.has(ol.num)) {
      rightBase = '   ..  ';
      rightText = [`^ merged into ${mergedInto.get(ol.num)}`];
    } else {
      rightBase = '   --  ';
      rightText = ['[deleted]'];
    }
    const n = Math.max(leftText.length, rightText.length);
    for (let i = 0; i < n; i++) {
      rows.push({
        left: (i === 0 ? leftBase : '       ') + (leftText[i] ?? ''),
        right: (i === 0 ? rightBase : '       ') + (rightText[i] ?? ''),
      });
    }
  }

  // trailer sections
  const trailer: string[] = [''];
  if (args.renames.size) {
    trailer.push('Variable map', '------------');
    for (const [oldN, newN] of args.renames) trailer.push(`  ${oldN.padEnd(20)} -> ${newN}`);
    trailer.push('');
  }
  if (args.warnings.length) {
    trailer.push('Warnings', '--------');
    for (const w of args.warnings) trailer.push(`  ${w}`);
    trailer.push('');
  }
  trailer.push('Summary', '-------');
  trailer.push(`  ${'Pass'.padEnd(28)}${'Lines'.padStart(8)}${'Bytes'.padStart(10)}${'Saved'.padStart(9)}`);
  for (let i = 0; i < args.snapshots.length; i++) {
    const s = args.snapshots[i];
    const saved = i === 0 ? '' : String(args.snapshots[i - 1].bytes - s.bytes);
    trailer.push(`  ${s.name.padEnd(28)}${String(s.lines.length).padStart(8)}${String(s.bytes).padStart(10)}${saved.padStart(9)}`);
  }
  const before = args.snapshots[0].bytes;
  const after = args.snapshots[args.snapshots.length - 1].bytes;
  const pct = ((before - after) / before * 100).toFixed(1);
  trailer.push('');
  trailer.push(`  Reduction: ${before - after} bytes (${pct}%)  ${before} -> ${after} tokenized bytes`);

  // paginate
  const out: string[] = [];
  let page = 0;
  let rowOnPage = PAGE_ROWS; // force header on first row
  const emitHeader = () => {
    page++;
    if (page > 1) out.push('\f');
    out.push(
      `Casio BASIC Cruncher V1.0  ${args.sourceName.padEnd(40)} ${stamp}   Page ${String(page).padStart(3)}`);
    out.push(`Source -> Optimized   Level ${args.opts.level}  (${passNames})`);
    out.push('');
    rowOnPage = 3;
  };
  const push = (s: string) => {
    if (rowOnPage >= PAGE_ROWS) emitHeader();
    out.push(s.length > width ? s.slice(0, width) : s);
    rowOnPage++;
  };
  push(`  OLD  SOURCE${' '.repeat(col - 6)} |   NEW  OPTIMIZED`);
  for (const r of rows) push(`${r.left.padEnd(col + 8).slice(0, col + 8)}| ${r.right}`);
  for (const t of trailer) push(t);
  return out.join('\n') + '\n';
}
```

- [ ] **Step 4: Implement `tools/cruncher/crunch.ts`**

```typescript
// CLI: crunch a Casio JIS BASIC program to its minimal stored form.
//   npx tsx tools/cruncher/crunch.ts PROGRAM.BAS [-o out.bas] [-l out.lst]
//     [--level 1|2] [--keep-comments] [--no-merge] [--no-spaces-strip]
//     [--no-rewrites] [--width N]
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { parseSource, emitProgram } from './scan.js';
import { findWarnings } from './refs.js';
import { runPipeline, defaultOptions, lastRenameMap, CrunchOptions } from './passes.js';
import { buildListing } from './listing.js';

function usage(): never {
  console.error('usage: crunch.ts PROGRAM.BAS [-o out.bas] [-l out.lst] [--level 1|2]');
  console.error('       [--keep-comments] [--no-merge] [--no-spaces-strip] [--no-rewrites] [--width N]');
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
const original = parseSource(src);
const warnings = findWarnings(original);
const { lines, snapshots } = runPipeline(original, opts);

// verify: reference graph closes
const finalWarnings = [...warnings, ...findWarnings(lines).filter(w => w.includes('nonexistent'))];
const dangling = findWarnings(lines).filter(w => w.includes('nonexistent'));
if (dangling.length > 0) {
  console.error('ERROR: crunched program has dangling line references:');
  for (const d of dangling) console.error('  ' + d);
  process.exit(2);
}

writeFileSync(outFile, emitProgram(lines), 'latin1');
writeFileSync(lstFile, buildListing({
  sourceName: basename(input), original, result: lines, snapshots,
  warnings: finalWarnings, renames: lastRenameMap(), opts, width,
}), 'latin1');

const before = snapshots[0].bytes;
const after = snapshots[snapshots.length - 1].bytes;
console.log(`${basename(input)}: ${original.length} -> ${lines.length} lines, ` +
  `${before} -> ${after} bytes (${((before - after) / before * 100).toFixed(1)}% saved)`);
console.log(`wrote ${outFile}, ${lstFile}`);
for (const w of finalWarnings) console.log('warning: ' + w);
```
Also add to `package.json` scripts: `"crunch": "tsx tools/cruncher/crunch.ts"`, and
append a short `## BASIC Cruncher` section to `CLAUDE.md` (3-6 lines: purpose,
`npm run crunch -- PROGRAM.BAS`, flags, outputs `.min.BAS` + `.crunch.lst`,
pointer to the design spec path).

- [ ] **Step 5: Run the full suite + a real CLI run**

Run: `npx vitest run tools/cruncher/` — expected all PASS.
Run: `npx tsx tools/cruncher/crunch.ts public/basic/emulator/STREK.BAS -o /tmp/strek.min.BAS -l /tmp/strek.lst && head -40 /tmp/strek.lst`
Expected: summary line with a double-digit % saving; listing header + two-column body renders.

- [ ] **Step 6: Commit**

```bash
git add tools/cruncher/listing.ts tools/cruncher/crunch.ts tools/cruncher/tests/acceptance.test.ts package.json CLAUDE.md
git commit -m "feat(cruncher): 132-column listing, CLI entry, acceptance tests"
```

---

## Self-Review

- **Spec coverage:** byte oracle via emulator tokenizer ✔ (Task 3, identity-pinned); comment elimination with jump-target safety ✔ (empty-line simplification, documented in Global Constraints); THEN/ELSE GOTO + LET rewrites ✔; conservative space stripping ✔; merge with all five blockers + 255 caps ✔; level-2 rename + NEXT strip with reserved-name safety ✔; no renumbering anywhere ✔; VMS-style 132-col paginated listing with variable map/warnings/summary ✔; CLI flags per spec ✔ (`--no-spaces-strip` naming per spec); stats from actual tokenization ✔; acceptance on STREK + SORCERER ✔; ERL warnings ✔.
- **Placeholder scan:** all code complete; two places direct the implementer to verify an import shape against the actual module (`TokenizedLine.bytes` inclusion of the length byte; `basic-tokens.ts` export shape) — each is pinned by a test that fails loudly if the assumption is wrong, so they are verification notes, not placeholders.
- **Type consistency:** `CrunchLine`/`Comment`/`CrunchOptions`/`PassResult`/`LineRef` used consistently; `passLevel2` stub in Task 4 replaced in Task 5 with the same signature; `lastRenameMap` consumed by Task 6's CLI as declared in Task 5.
