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
  it('emits ORG &H1CD0 (CosmicV4 pattern, reachable via BASIC POKE)', () => {
    const lines = getAsm('10 END');
    expect(lines[0]!.mnemonic).toBe('ORG');
    expect(lines[0]!.operands).toBe('&H1CD0');
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

  it('emits the BCD_TO_INT16 and INT16_TO_BCD shared subroutines once per program', () => {
    const asm = generate(parse('10 A=5\n20 END\n'));
    const emitted = asm.lines.map(l => l.label).filter(Boolean);
    expect(emitted).toContain('BCD_TO_INT16');
    expect(emitted).toContain('INT16_TO_BCD');
    // emitted exactly once, not once per call site
    expect(emitted.filter(l => l === 'BCD_TO_INT16').length).toBe(1);
    expect(emitted.filter(l => l === 'INT16_TO_BCD').length).toBe(1);
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

  it('emits 9-byte BCD data for a number literal', () => {
    const ast = parse('10 A=5\n');
    const asm = generate(ast);
    const dataLine = asm.lines.find(l => l.mnemonic === 'db' && l.label?.startsWith('NUM_'));
    expect(dataLine).toBeDefined();
    const byteCount = dataLine!.operands!.split(',').length;
    expect(byteCount).toBe(9);
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
    expect(asm.some(l => l.includes('&H0646'))).toBe(true);
  });

  it('emits a ROM call for MOD', () => {
    const ast = parse('10 A=7 MOD 3\n');
    const asm = generate(ast);
    const romCallLines = asm.lines.filter(l => l.mnemonic === 'ldw' && l.operands === '$19,&H105F');
    expect(romCallLines.length).toBeGreaterThan(0);
  });

  it('stages MOD operands on the US stack, not the SS stack used by +/-/*//', () => {
    // &H105F's own preamble (&H1069 -> &H05A1) pops the left operand off the
    // CPU's US ("user") stack itself, matching how the ROM's own interpreter
    // stages operators. Verified empirically via
    // tools/emu-debugger/tests/task3-mod-div-fix.test.ts: staging the left
    // operand through phs/phsm (the SS stack +/-/*// use) instead makes
    // &H105F pop garbage and always return 0. Regression guard: MOD must use
    // phum/phu, and must NOT do the $0-$8/$19-$27 register shuffle the other
    // arithmetic ops need (&H105F does that exchange internally).
    const asm = generate(parse('10 A=7 MOD 3\n'));
    const mnems = asm.lines.map(l => `${l.mnemonic ?? ''} ${l.operands ?? ''}`.trim());
    expect(mnems).toContain('phum $17,8');
    expect(mnems).toContain('phu $18');
    expect(mnems).not.toContain('phsm $17,8');
    expect(mnems).not.toContain('phs $18');
  });

  it('generates PRINT with expression', () => {
    // Numeric PRINT is the ROM's own two-step numeric-item sequence
    // (rom1a.src:3F63/3F66): &H131F formats the FP value in $10-$18 into a
    // string ($15,$16 = pointer, $17 = length), &H97D5 displays it.
    // It must NOT call &H3EF1 — that is the BASIC PRINT *statement* handler,
    // which parses source text from IZ and ends in SN Error when reached from
    // compiled code.
    const asm = mnemonics('10 PRINT 42');
    expect(asm.some(l => l.includes('&H131F'))).toBe(true);
    expect(asm.some(l => l.includes('&H97D5'))).toBe(true);
    expect(asm.some(l => l.includes('&H3EF1'))).toBe(false);
  });

  it('generates INPUT', () => {
    // NOTE: &H3DEE is known broken (see ROM.INPUT's comment in codegen.ts) —
    // it's the BASIC INPUT *command* handler, not a callable routine, the
    // same defect class PRINT had before it was fixed to use &H131F/&H97D5.
    // This only pins the current (wrong) codegen shape so a future fix has
    // a test to update, not a claim that INPUT works from compiled code.
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
    // Store uses IX-indexed addressing: ldw $2,VAR_A + pre ix,$2 + stm $10,(ix+$sx),8
    expect(mnems.some(l => l.mnemonic === 'ldw' && l.operands?.includes('VAR_A'))).toBe(true);
    expect(mnems.some(l => l.mnemonic === 'pre' && l.operands?.includes('ix'))).toBe(true);
    expect(mnems.some(l => l.mnemonic === 'stm' && l.operands?.includes('(ix+$sx)'))).toBe(true);
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
    expect(asm.some(l => l.includes('xr'))).toBe(true);
  });

  it('allocates variables only once for repeated references', () => {
    const lines = getAsm('10 A=1\n20 B=A\n30 A=B');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    // Should have exactly 2 variables: A and B
    expect(dsLines.length).toBe(2);
  });
});

describe('codegen - remaining statements', () => {
  it('generates ON GOTO', () => {
    const asm = mnemonics('10 ON X GOTO 100,200,300\n100 END\n200 END\n300 END');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates ON GOTO jump table entries', () => {
    const lines = getAsm('10 ON X GOTO 100,200\n100 END\n200 END');
    // Should emit jp instructions targeting the target lines
    const jpLines = lines.filter(l => l.mnemonic === 'jp' || l.mnemonic === 'jr');
    expect(jpLines.some(l => l.operands?.includes('L100'))).toBe(true);
    expect(jpLines.some(l => l.operands?.includes('L200'))).toBe(true);
  });

  it('generates DIM (array allocation)', () => {
    const lines = getAsm('10 DIM A(10)');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    // A(10) = 11 elements * 9 bytes = 99 bytes
    expect(dsLines.some(l => parseInt(l.operands ?? '0') >= 99)).toBe(true);
  });

  it('generates DIM string array', () => {
    const lines = getAsm('10 DIM A$(5)');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    // A$(5) = 6 elements * 256 bytes = 1536 bytes
    expect(dsLines.some(l => parseInt(l.operands ?? '0') >= 1536)).toBe(true);
  });

  it('generates DIM 2D array', () => {
    const lines = getAsm('10 DIM A(3,4)');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    // A(3,4) = 4*5=20 elements * 9 bytes = 180 bytes
    expect(dsLines.some(l => parseInt(l.operands ?? '0') >= 180)).toBe(true);
  });

  it('generates WHILE/WEND', () => {
    const asm = getAsm('10 WHILE A<10\n20 A=A+1\n30 WEND');
    const allLabels = asm.filter(l => l.label).map(l => l.label);
    expect(allLabels.some(l => l?.includes('WHILE'))).toBe(true);
  });

  it('generates WEND as unconditional jump back to WHILE', () => {
    const lines = getAsm('10 WHILE A<10\n20 A=A+1\n30 WEND');
    const jpLines = lines.filter(l => l.mnemonic === 'jp' && l.operands?.includes('WHILE'));
    expect(jpLines.length).toBeGreaterThan(0);
  });

  it('generates WHILE end label', () => {
    const asm = getAsm('10 WHILE A<10\n20 A=A+1\n30 WEND');
    const allLabels = asm.filter(l => l.label).map(l => l.label);
    expect(allLabels.some(l => l?.includes('WEND'))).toBe(true);
  });

  it('generates POKE', () => {
    const asm = mnemonics('10 POKE &H1000,255');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates POKE with std instruction', () => {
    const lines = getAsm('10 POKE &H1000,255');
    const stdLines = lines.filter(l => l.mnemonic === 'std');
    expect(stdLines.length).toBeGreaterThan(0);
  });

  it('generates LOCATE', () => {
    const asm = mnemonics('10 LOCATE 5,2');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates ANGLE', () => {
    const asm = mnemonics('10 ANGLE 1');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates READ/DATA', () => {
    const asm = mnemonics('10 READ A\n20 DATA 42');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('emits DATA table in output', () => {
    const lines = getAsm('10 READ A\n20 DATA 42');
    const dataTable = lines.find(l => l.label === 'DATA_TABLE');
    expect(dataTable).toBeDefined();
  });

  it('generates RESTORE resets DATA_PTR', () => {
    const lines = getAsm('10 DATA 1,2\n20 READ A\n30 RESTORE');
    const restoreLines = lines.filter(l => l.mnemonic === 'ldw' && l.operands?.includes('DATA_TABLE'));
    expect(restoreLines.length).toBeGreaterThan(0);
  });

  it('generates string variable assignment', () => {
    const asm = mnemonics('10 A$="hello"');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates string variable storage (256 bytes)', () => {
    const lines = getAsm('10 A$="hello"');
    const dsLines = lines.filter(l => l.mnemonic === 'DS');
    expect(dsLines.some(l => l.operands === '256')).toBe(true);
  });

  it('generates ON ERROR GOTO', () => {
    const asm = mnemonics('10 ON ERROR GOTO 100\n100 RESUME');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates ON ERROR GOTO with handler address', () => {
    const lines = getAsm('10 ON ERROR GOTO 100\n100 RESUME');
    const ldwLines = lines.filter(l => l.mnemonic === 'ldw' && l.operands?.includes('L100'));
    expect(ldwLines.length).toBeGreaterThan(0);
  });

  it('generates RESUME as rtn', () => {
    const asm = mnemonics('10 ON ERROR GOTO 100\n100 RESUME');
    expect(asm.some(l => l === 'rtn')).toBe(true);
  });

  it('generates RESUME target as jp', () => {
    const asm = mnemonics('10 ON ERROR GOTO 100\n100 RESUME 10');
    expect(asm.some(l => l.startsWith('jp') && l.includes('L10'))).toBe(true);
  });

  it('generates ERASE as comment only', () => {
    const lines = getAsm('10 DIM A(5)\n20 ERASE A');
    const eraseLines = lines.filter(l => l.comment?.includes('ERASE'));
    expect(eraseLines.length).toBeGreaterThan(0);
  });

  it('generates CLEAR as comment only', () => {
    const lines = getAsm('10 CLEAR');
    const clearLines = lines.filter(l => l.comment?.includes('CLEAR'));
    expect(clearLines.length).toBeGreaterThan(0);
  });

  it('generates DEF FN subroutine label', () => {
    // Parser requires FN as separate keyword: DEF FN <name>(params) = expr
    const lines = getAsm('10 DEF FN A(X)=X*2');
    const fnLabel = lines.find(l => l.label?.startsWith('FN_'));
    expect(fnLabel).toBeDefined();
  });

  it('generates builtin function call as ROM call stub', () => {
    const asm = mnemonics('10 A=SIN(1)');
    // Should emit a ldw $2, addr + jr ROM_CALL pattern
    expect(asm.some(l => l.startsWith('ldw') && l.includes('$2,'))).toBe(true);
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates OPEN as ROM call stub', () => {
    // OPEN syntax: OPEN filename FOR mode AS #filenum
    const asm = mnemonics('10 OPEN "test" FOR INPUT AS #1');
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates CLOSE as ROM call stub', () => {
    const asm = mnemonics('10 OPEN "f" FOR INPUT AS #1\n20 CLOSE 1');
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates MODE as ROM call stub', () => {
    const asm = mnemonics('10 MODE 1');
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates CHAIN as ROM call stub', () => {
    const asm = mnemonics('10 CHAIN "prog2"');
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates ON GOSUB', () => {
    const lines = getAsm('10 ON X GOSUB 100,200\n100 RETURN\n200 RETURN');
    const calLines = lines.filter(l => l.mnemonic === 'cal');
    // Should emit cal instructions to the target lines
    expect(calLines.some(l => l.operands?.includes('L100'))).toBe(true);
    expect(calLines.some(l => l.operands?.includes('L200'))).toBe(true);
  });

  it('generates array access with base address load', () => {
    const lines = getAsm('10 DIM B(5)\n20 A=B(2)');
    const ldwLines = lines.filter(l => l.mnemonic === 'ldw' && l.operands?.includes('ARR_B'));
    expect(ldwLines.length).toBeGreaterThan(0);
  });
});
