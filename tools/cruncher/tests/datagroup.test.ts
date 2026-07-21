import { describe, it, expect } from 'vitest';
import { parseSource, emitLine } from '../scan.js';
import { passDataGroup, runPipeline, defaultOptions } from '../passes.js';

const opts = defaultOptions();

describe('passDataGroup', () => {
  it('coalesces consecutive DATA-only lines into one DATA statement', () => {
    const out = passDataGroup(parseSource('10 DATA 1,2\n20 DATA 3,4\n30 DATA 5\n'), opts);
    expect(out).toHaveLength(1);
    expect(out[0].stmts).toEqual(['DATA 1,2,3,4,5']);
    expect(out[0].origins).toEqual([10, 20, 30]);
  });
  it('preserves null items from bare DATA statements', () => {
    const out = passDataGroup(parseSource('10 DATA\n20 DATA X\n'), opts);
    expect(out[0].stmts).toEqual(['DATA ,X']);
  });
  it('never groups a RESTORE target into its predecessor', () => {
    const src = '5 RESTORE 20\n10 DATA 1\n20 DATA 2\n30 DATA 3\n';
    const out = passDataGroup(parseSource(src), opts);
    expect(out.map(l => l.num)).toEqual([5, 10, 20]);
    expect(out.find(l => l.num === 20)!.stmts).toEqual(['DATA 2,3']);
  });
  it('disables itself entirely when a computed RESTORE exists', () => {
    const src = '5 RESTORE (10*2)\n10 DATA 1\n20 DATA 2\n';
    const out = passDataGroup(parseSource(src), opts);
    expect(out.map(l => l.num)).toEqual([5, 10, 20]);
  });
  it('skips mixed lines and lines with comments', () => {
    const out = passDataGroup(parseSource("10 DATA 1\n20 A=1:DATA 2\n30 DATA 3 ' c\n40 DATA 4\n"), opts);
    expect(out.map(l => l.num)).toEqual([10, 20, 30, 40]);
  });
  it('respects the 255-byte record cap', () => {
    const item = 'A'.repeat(100);
    const out = passDataGroup(
      parseSource(`10 DATA ${item}\n20 DATA ${item}\n30 DATA ${item}\n`), opts);
    expect(out.length).toBeGreaterThan(1);
    for (const l of out) expect(emitLine(l).length).toBeLessThanOrEqual(255);
  });
  it('honours the noDataGroup option', () => {
    const out = passDataGroup(parseSource('10 DATA 1\n20 DATA 2\n'),
      { ...opts, noDataGroup: true });
    expect(out).toHaveLength(2);
  });
  it('runs inside the pipeline between spaces and merge', () => {
    const { snapshots } = runPipeline(parseSource('10 DATA 1\n20 DATA 2\n'), opts);
    const names = snapshots.map(s => s.name);
    expect(names.indexOf('DATA grouping')).toBeGreaterThan(names.indexOf('whitespace strip'));
    expect(names.indexOf('DATA grouping')).toBeLessThan(names.indexOf('line merging'));
  });
});
