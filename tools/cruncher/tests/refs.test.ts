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
