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
