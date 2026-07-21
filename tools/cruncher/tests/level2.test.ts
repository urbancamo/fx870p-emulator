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
