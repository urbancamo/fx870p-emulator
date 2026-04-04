// tools/compiler/tests/codegen.test.ts
import { describe, it, expect } from 'vitest';
import { generate } from '../codegen.js';
import { parse } from '../parser.js';
import type { AsmLine } from '../asm-types.js';

function getAsm(basic: string): AsmLine[] {
  return generate(parse(basic)).lines;
}

function mnemonics(basic: string): string[] {
  return getAsm(basic)
    .filter(l => l.mnemonic && !['ORG', 'EQU', 'DS', 'db'].includes(l.mnemonic))
    .map(l => `${l.mnemonic} ${l.operands ?? ''}`.trim());
}

function labels(basic: string): string[] {
  return getAsm(basic).filter(l => l.label).map(l => l.label!);
}

describe('codegen - core', () => {
  it('emits ORG &H0000', () => {
    const lines = getAsm('10 END');
    expect(lines[0]!.mnemonic).toBe('ORG');
    expect(lines[0]!.operands).toBe('&H0000');
  });

  it('emits labels for BASIC line numbers', () => {
    expect(labels('10 CLS\n20 END')).toContain('L10');
    expect(labels('10 CLS\n20 END')).toContain('L20');
  });

  it('emits BASIC source annotations', () => {
    const lines = getAsm('10 CLS');
    const annotation = lines.find(l => l.basicLine?.num === 10);
    expect(annotation).toBeDefined();
    expect(annotation!.basicLine!.source).toContain('CLS');
  });

  it('emits ROM_CALL wrapper', () => {
    const lines = getAsm('10 CLS');
    expect(labels('10 CLS')).toContain('ROM_CALL');
    const romCallLine = lines.find(l => l.label === 'ROM_CALL');
    expect(romCallLine).toBeDefined();
  });

  it('generates CLS as ROM call', () => {
    const asm = mnemonics('10 CLS');
    expect(asm.some(l => l.includes('&H2ADF'))).toBe(true);
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates BEEP as ROM call', () => {
    const asm = mnemonics('10 BEEP');
    expect(asm.some(l => l.includes('&H33B3'))).toBe(true);
  });

  it('generates GOTO as JP', () => {
    const asm = mnemonics('10 GOTO 20\n20 END');
    expect(asm.some(l => l.startsWith('jp') && l.includes('L20'))).toBe(true);
  });

  it('generates GOSUB as CAL', () => {
    const asm = mnemonics('10 GOSUB 100\n100 RETURN');
    expect(asm.some(l => l.startsWith('cal') && l.includes('L100'))).toBe(true);
  });

  it('generates RETURN as RTN', () => {
    const asm = mnemonics('100 RETURN');
    expect(asm.some(l => l === 'rtn')).toBe(true);
  });

  it('generates END as RTN', () => {
    const asm = mnemonics('10 END');
    expect(asm.some(l => l === 'rtn')).toBe(true);
  });

  it('emits variable storage reservations', () => {
    const lines = getAsm('10 A=5');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    expect(dsLines.length).toBeGreaterThan(0);
    expect(dsLines.some(l => l.operands === '9')).toBe(true);
  });

  it('skips code for REM but includes annotation', () => {
    const lines = getAsm('10 REM hello');
    const annotation = lines.find(l => l.basicLine?.num === 10);
    expect(annotation).toBeDefined();
    // No actual instructions emitted for REM
    const codeMnemonics = lines.filter(l => l.mnemonic && !['ORG', 'DS', 'EQU'].includes(l.mnemonic) && l.label !== 'ROM_CALL');
    // Should just have the ROM_CALL wrapper, no actual code
  });

  it('handles multi-line program', () => {
    const lines = getAsm('10 CLS\n20 BEEP\n30 END');
    expect(labels('10 CLS\n20 BEEP\n30 END')).toEqual(
      expect.arrayContaining(['L10', 'L20', 'L30'])
    );
  });
});

describe('codegen - expressions', () => {
  it('generates numeric constant load', () => {
    const asm = mnemonics('10 A=42');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates variable load', () => {
    const asm = getAsm('10 A=5\n20 B=A');
    const mnems = asm.filter(l => l.mnemonic && l.mnemonic !== 'ORG' && l.mnemonic !== 'DS');
    expect(mnems.some(l => l.operands?.includes('VAR_A'))).toBe(true);
  });

  it('generates addition ROM call', () => {
    const asm = mnemonics('10 A=2+3');
    expect(asm.some(l => l.includes('&H05DA'))).toBe(true);
  });

  it('generates subtraction ROM call', () => {
    const asm = mnemonics('10 A=5-3');
    expect(asm.some(l => l.includes('&H05D4'))).toBe(true);
  });

  it('generates multiplication ROM call', () => {
    const asm = mnemonics('10 A=2*3');
    expect(asm.some(l => l.includes('&H0607'))).toBe(true);
  });

  it('generates division ROM call', () => {
    const asm = mnemonics('10 A=6/3');
    expect(asm.some(l => l.includes('&H16BD'))).toBe(true);
  });

  it('generates PRINT with expression', () => {
    const asm = mnemonics('10 PRINT 42');
    expect(asm.some(l => l.includes('&H3EF1'))).toBe(true);
  });

  it('generates INPUT', () => {
    const asm = mnemonics('10 INPUT A');
    expect(asm.some(l => l.includes('&H3DEE'))).toBe(true);
  });

  it('generates FOR/NEXT loop structure', () => {
    const allLabels = labels('10 FOR I=1 TO 5\n20 NEXT I');
    expect(allLabels.some(l => l.includes('FOR'))).toBe(true);
  });

  it('generates IF/THEN conditional jump', () => {
    const asm = mnemonics('10 IF A>5 THEN 20\n20 END');
    // Should have a conditional jump
    expect(asm.some(l => l.startsWith('jr') || l.startsWith('jp'))).toBe(true);
  });

  it('generates PRINT with string and semicolon', () => {
    const asm = mnemonics('10 PRINT "Hello";');
    expect(asm.length).toBeGreaterThan(0);
  });
});

describe('codegen - expressions (detailed)', () => {
  it('generates push/pop pattern for binary operations', () => {
    const asm = mnemonics('10 A=2+3');
    // Should push left operand, evaluate right, pop, then call ROM
    expect(asm.some(l => l.includes('phsm'))).toBe(true);
    expect(asm.some(l => l.includes('ppsm'))).toBe(true);
  });

  it('generates variable store after LET expression', () => {
    const asm = getAsm('10 A=42');
    const mnems = asm.filter(l => l.mnemonic);
    expect(mnems.some(l => l.mnemonic === 'stm' && l.operands?.includes('VAR_A'))).toBe(true);
  });

  it('generates OUTCR after PRINT without trailing separator', () => {
    const asm = mnemonics('10 PRINT 42');
    // Should end with OUTCR call
    expect(asm.some(l => l.includes('&H2AE8'))).toBe(true);
  });

  it('suppresses OUTCR when PRINT has trailing semicolon', () => {
    const asm = mnemonics('10 PRINT 42;');
    // Should NOT have OUTCR
    expect(asm.some(l => l.includes('&H2AE8'))).toBe(false);
  });

  it('generates string literal in data section', () => {
    const lines = getAsm('10 PRINT "Hello"');
    const dbLines = lines.filter(l => l.mnemonic === 'db');
    expect(dbLines.length).toBeGreaterThan(0);
    expect(dbLines.some(l => l.operands?.includes('Hello'))).toBe(true);
  });

  it('generates FOR loop with limit and step variables', () => {
    const lines = getAsm('10 FOR I=1 TO 5\n20 NEXT I');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    // Should allocate VAR_I plus limit and step temp vars
    expect(dsLines.length).toBeGreaterThanOrEqual(3);
  });

  it('generates INPUT with prompt string', () => {
    const lines = getAsm('10 INPUT "Name?";A');
    const dbLines = lines.filter(l => l.mnemonic === 'db');
    expect(dbLines.some(l => l.operands?.includes('Name?'))).toBe(true);
  });

  it('generates IF/THEN/ELSE with both branches', () => {
    const asm = mnemonics('10 IF A>0 THEN PRINT "pos" ELSE PRINT "neg"');
    // Should have conditional and unconditional jumps
    const jumps = asm.filter(l => l.startsWith('jr'));
    expect(jumps.length).toBeGreaterThanOrEqual(2);
  });

  it('generates unary negation', () => {
    const asm = mnemonics('10 A=-5');
    // Should negate via XOR on sign byte
    expect(asm.some(l => l.includes('xrm'))).toBe(true);
  });

  it('allocates variables only once for repeated references', () => {
    const lines = getAsm('10 A=1\n20 B=A\n30 A=B');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    // Should have exactly 2 variables: A and B
    expect(dsLines.length).toBe(2);
  });
});
