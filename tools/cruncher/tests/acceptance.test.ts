import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { tokenizeProgram, parseListingText } from '../../../src/emulator/tokenize.js';
import { parseSource, emitProgram, emitLine } from '../scan.js';
import { findRefs } from '../refs.js';
import { runPipeline, defaultOptions, lastRenameMap } from '../passes.js';
import { programBytes, trueSourceBytes } from '../bytes.js';
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

    it('reported byte count equals real re-tokenized file bytes', () => {
      // programBytes must reflect exactly what emitProgram writes to disk
      // (including the ':' placeholder body used for empty-body lines), not
      // an idealised emitLine() value that never appears in the file.
      const reparsed = parseListingText(emitProgram(lines));
      const stream = tokenizeProgram(reparsed);
      expect(programBytes(lines)).toBe(stream.length);
    });

    it('reported source baseline is the true raw file size, not the parsed model', () => {
      // The "before" figure crunch.ts reports must come from tokenizing the
      // RAW file text (Ctrl-Z EOF marker stripped), not programBytes(original)
      // -- the parsed model already normalizes comments/edge-spaces and so
      // under-reports the real on-disk source size.
      const eof = src.indexOf('\x1a');
      const clean = eof === -1 ? src : src.slice(0, eof);
      const expected = tokenizeProgram(parseListingText(clean)).length;
      expect(trueSourceBytes(src)).toBe(expected);
      if (name === 'STREK.BAS') expect(trueSourceBytes(src)).toBe(14548);
    });

    it('READ-visible DATA item stream is unchanged', () => {
      const items = (ls: import('../scan.js').CrunchLine[]) => {
        const out: string[] = [];
        for (const l of ls) {
          for (const s of l.stmts) {
            if (!/^DATA\b/i.test(s.trim())) continue;
            const payload = s.trim().replace(/^DATA ?/i, '');
            let cur = '';
            let inStr = false;
            for (const c of payload) {
              if (c === '"') inStr = !inStr;
              if (c === ',' && !inStr) { out.push(cur); cur = ''; }
              else cur += c;
            }
            out.push(cur);
          }
        }
        return out;
      };
      // Re-parse fresh rather than reusing the outer `original` -- removes
      // any doubt about whether an earlier pass's snapshot shares state.
      const fresh = parseSource(src);
      expect(items(lines)).toEqual(items(fresh));
    });
  });
}

describe('acceptance: reserved-base rename guard', () => {
  it('level 2 over STREK.BAS never mangles INPUT$', () => {
    const src = readFileSync('public/basic/emulator/STREK.BAS', 'latin1');
    const original = parseSource(src);
    const { lines } = runPipeline(original, { ...defaultOptions(), level: 2 });
    const emitted = emitProgram(lines);
    expect(emitted).toContain('INPUT$(');
    expect(lastRenameMap().has('INPUT$')).toBe(false);
    expect(/=[A-Z][0-9]?\$\(1\)/.test(emitted)).toBe(false);
  });
});

describe('acceptance: listing width clamp', () => {
  it('header rows and body rows never exceed the requested width', () => {
    const src = '10 PRINT "HELLO WORLD, THIS IS A REASONABLY LONG LINE OF BASIC CODE FOR TESTING"\n20 GOTO 10\n';
    const original = parseSource(src);
    const { lines, snapshots } = runPipeline(original, defaultOptions());
    const lst = buildListing({
      sourceName: 'SMALL.BAS', original, result: lines, snapshots,
      warnings: [], renames: new Map(), opts: defaultOptions(), width: 80,
      now: new Date('2026-07-21T12:00:00Z'),
    });
    for (const row of lst.split('\n')) expect(row.length).toBeLessThanOrEqual(80);
  });
});
