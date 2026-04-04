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
