import { describe, it, expect } from 'vitest';
import { parseSource } from '../scan.js';
import { passLevel2, defaultOptions, lastRenameMap } from '../passes.js';

const l2 = (src: string) =>
  passLevel2(parseSource(src), { ...defaultOptions(), level: 2 as const });

describe('passLevel2 renaming', () => {
  it('renames multi-char variables to shortest free names, but leaves NAME$ untouched', () => {
    // NAME$ tokenizes as the bare keyword NAME followed by a stray '$' byte
    // (not a single identifier), so it must never be renamed -- see
    // isReservedToken's comment in passes.ts.
    const out = l2('10 SCORE=1:TOTAL=SCORE+1:PRINT NAME$\n');
    const s = out[0].stmts.join(':');
    expect(s).not.toMatch(/SCORE|TOTAL/);
    expect(s).toMatch(/[A-Z]=1:[A-Z]=[A-Z]\+1/);
    expect(s).toContain('PRINT NAME$');
    expect([...lastRenameMap().keys()].sort()).toEqual(['SCORE', 'TOTAL']);
    expect(lastRenameMap().has('NAME$')).toBe(false);
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

describe('passLevel2 corruption guards', () => {
  it('never touches scientific-notation literals', () => {
    const out = l2('10 WXYZ=1:W=INT((WXYZ MOD 1E4)/1E3)\n');
    const s = out[0].stmts.join(':');
    expect(s).toContain('1E4');
    expect(s).toContain('1E3');
    expect(s).not.toContain('WXYZ');
  });
  it('never renames DATA payload words', () => {
    const out = l2('10 SCORE=1:DATA FRANKFORT,35\n');
    expect(out[0].stmts[1]).toBe('DATA FRANKFORT,35');
    expect(out[0].stmts[0]).not.toContain('SCORE');
  });
  it('level-1 call clears the rename map', () => {
    l2('10 SCORE=1\n');
    passLevel2(parseSource('10 A=1\n'), defaultOptions());
    expect(lastRenameMap().size).toBe(0);
  });
});
