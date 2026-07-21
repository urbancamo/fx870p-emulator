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
