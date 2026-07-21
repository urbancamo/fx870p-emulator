import { describe, it, expect } from 'vitest';
import { tokenizeProgram } from '../../../src/emulator/tokenize.js';
import { parseSource, emitLine, emitProgram } from '../scan.js';
import { programBytes } from '../bytes.js';
import { passComments, passRewrites, defaultOptions } from '../passes.js';
import { passSpaces, passMerge, runPipeline } from '../passes.js';
import { lineBytes } from '../bytes.js';

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
  it('strips LET after THEN and ELSE', () => {
    const out = passRewrites(parseSource('10 IF A THEN LET B=1 ELSE LET C=2\n'), opts);
    expect(out[0].stmts[0]).toBe('IF A THEN B=1 ELSE C=2');
  });
});

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
    // Line 20 is a jump target (GOTO 20), so it must never be absorbed into
    // its predecessor (line 10) -- it stays a line start. Line 30 is not a
    // jump target, so it may still be absorbed forward into 20 (which keeps
    // its own number, so the "GOTO 20" reference stays valid).
    expect(nums('10 A=1\n20 B=2\n30 GOTO 20\n')).toEqual([10, 20]);
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
