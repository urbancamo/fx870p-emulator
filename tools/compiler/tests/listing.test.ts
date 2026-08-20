// tools/compiler/tests/listing.test.ts
import { describe, it, expect } from 'vitest';
import { generate } from '../codegen.js';
import { parse } from '../parser.js';
import { assemble } from '../assembler.js';
import { formatListing } from '../listing.js';

describe('listing formatter - integer-eligibility and shadowed-loop classification', () => {
  it('lists integer-eligible/bcd-only variables and shadowed FOR loops', () => {
    // NOTE: the loop body deliberately uses `PRINT K+0` rather than a bare
    // `PRINT K`. The static loop-shadow-eligibility scan (Task 2, in
    // loop-shadow-eligibility.ts's violatesCounterUsage) conservatively
    // disqualifies any body statement where the counter appears outside a
    // whitelisted fast-path binary operator -- a bare `PRINT K` disqualifies
    // the loop from shadowing entirely, while `PRINT K+0` keeps it eligible.
    // This is a real gap in the current static analysis, not a test quirk;
    // see the Task 6 report for details.
    const asm = generate(parse('10 N=100\n20 X=3.14\n30 FOR K=1 TO N\n40 PRINT K+0\n50 NEXT K\n60 END\n'));
    const assembled = assemble(asm.lines);
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [],
      symbols: assembled.symbols,
      codeSize: assembled.codeSize,
      dataSize: assembled.dataSize,
      variableSize: assembled.variableSize,
      integerEligible: asm.integerEligible,
      shadowedLoops: asm.shadowedLoops,
    });
    expect(listing).toContain('Integer-Eligible Variables:');
    expect(listing).toContain('VAR_N');
    expect(listing).toContain('BCD-Only Variables:');
    expect(listing).toContain('VAR_X');
    expect(listing).toContain('Shadowed FOR Loops:');
    // Assert the specific "varName (line N)" entry, not just a loose
    // substring match -- 'K' alone would also match 'VAR_K' elsewhere.
    expect(listing).toContain('K (line 30)');

    // This program's loop actually gets shadowed (its body has no bare
    // counter read, no out-of-span GOTO, etc.), so the assembler's symbol
    // table contains SHADOW_K_CNT/LIM/STP/ACT (allocShadowSlots) alongside
    // VAR_K/VAR_N. Those shadow-storage slots are also `type: 'variable'`
    // in the symbol table, so a naive `type === 'variable'` filter would
    // misclassify them as BCD-only real variables. Confirm none of them
    // leak into the Integer-Eligible/BCD-Only classification section.
    expect(assembled.symbols.some(s => s.name.startsWith('SHADOW_'))).toBe(true); // sanity: they do exist
    const classificationSection = listing.slice(
      listing.indexOf('Integer-Eligible Variables:'),
      listing.indexOf('Shadowed FOR Loops:'),
    );
    expect(classificationSection).not.toContain('SHADOW_');
  });

  it('excludes SHADOW_ storage slots from the Integer-Eligible/BCD-Only sections', () => {
    // Direct reproduction of the reviewer's repro case.
    const asm = generate(parse('10 N=100\n20 FOR K=1 TO N\n30 PRINT K+0\n40 NEXT K\n50 END\n'));
    const assembled = assemble(asm.lines);
    const shadowSlotNames = ['SHADOW_K_CNT', 'SHADOW_K_LIM', 'SHADOW_K_STP', 'SHADOW_K_ACT'];
    // Sanity: the shadow slots really are present, and really are tagged
    // 'variable' by the assembler -- otherwise this test would pass for the
    // wrong reason (nothing to exclude).
    for (const name of shadowSlotNames) {
      expect(assembled.symbols).toContainEqual(expect.objectContaining({ name, type: 'variable' }));
    }
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [],
      symbols: assembled.symbols,
      codeSize: assembled.codeSize,
      dataSize: assembled.dataSize,
      variableSize: assembled.variableSize,
      integerEligible: asm.integerEligible,
      shadowedLoops: asm.shadowedLoops,
    });
    const classificationSection = listing.slice(
      listing.indexOf('Integer-Eligible Variables:'),
      listing.indexOf('Shadowed FOR Loops:'),
    );
    for (const name of shadowSlotNames) {
      expect(classificationSection).not.toContain(name);
    }
    // They should still be visible in the Symbol Table -- excluded from
    // classification, not dropped from the listing entirely.
    const symbolTableSection = listing.slice(listing.indexOf('Symbol Table:'), listing.indexOf('Integer-Eligible Variables:'));
    for (const name of shadowSlotNames) {
      expect(symbolTableSection).toContain(name);
    }
  });

  it('shows "(none)" when nothing is integer-eligible or shadowed', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [],
      symbols: [{ name: 'VAR_X', address: 0x50, type: 'variable' }],
      codeSize: 0,
      dataSize: 0,
      variableSize: 9,
      integerEligible: new Set(),
      shadowedLoops: [],
    });
    expect(listing).toContain('Integer-Eligible Variables:');
    expect(listing).toContain('BCD-Only Variables:');
    expect(listing).toContain('VAR_X');
    expect(listing).toContain('Shadowed FOR Loops:');
    expect(listing).toContain('(none)');
  });
});
