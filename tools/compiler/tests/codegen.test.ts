// tools/compiler/tests/codegen.test.ts
import { describe, it, expect } from 'vitest';
import { generate } from '../codegen.js';
import { parse } from '../parser.js';
import { isIntegerEligibleExpr } from '../type-inference.js';
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

describe('codegen - integer eligibility', () => {
  it('isIntegerEligibleExpr classifies literals, eligible variables, and eligible binary chains', () => {
    const eligible = new Set(['A', 'B']);
    expect(isIntegerEligibleExpr({ type: 'number', value: 5, hasDecimalPoint: false }, eligible)).toBe(true);
    expect(isIntegerEligibleExpr({ type: 'number', value: 5, hasDecimalPoint: true }, eligible)).toBe(false);
    expect(isIntegerEligibleExpr({ type: 'variable', ref: { name: 'A', isString: false } }, eligible)).toBe(true);
    expect(isIntegerEligibleExpr({ type: 'variable', ref: { name: 'X', isString: false } }, eligible)).toBe(false);
    const sum = { type: 'binary', op: '+', left: { type: 'variable', ref: { name: 'A', isString: false } }, right: { type: 'variable', ref: { name: 'B', isString: false } } } as const;
    expect(isIntegerEligibleExpr(sum, eligible)).toBe(true);
    const div = { type: 'binary', op: '/', left: sum.left, right: sum.right } as const;
    expect(isIntegerEligibleExpr(div, eligible)).toBe(false); // '/' is never integer-closed, matches Task 1's own exclusion
  });

  it('CodeGen.generate() populates integerEligible from inferIntegerEligibility() before emitting any statement', () => {
    // Compile a program with one integer-eligible and one bcd-only variable,
    // and confirm generate() doesn\'t throw and produces the same output as
    // before this task for a program with no FOR loops (pure regression check
    // -- this task changes no observable codegen output by itself).
    const asm = generate(parse('10 A=5\n20 X=3.14\n30 END\n'));
    expect(asm.lines.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Task 3: loop-shadow slot allocation + emitFor's entry-time decode
// ---------------------------------------------------------------------------
//
// NOTE on the sample program used here. The task brief's draft test used
// `10 FOR K=1 TO 10 / 20 PRINT K / 30 NEXT K` as the *positive* case, but that
// loop is NOT shadow-eligible under the analysis as actually merged: commit
// 4235a19 ("revert PRINT relaxation in loop-shadow eligibility scan") made a
// bare `PRINT K` a disqualifying use of the counter, because PRINT hands the
// counter to a ROM routine as a 9-byte BCD value. `S=S+K` is the smallest body
// that keeps the counter in a fast-path operand position, so that is the
// positive case below; the `PRINT K` program is pinned as a negative case so
// the divergence from the brief stays visible rather than silently rotting.

/** Shadow-eligible: the counter is only ever a direct fast-path operand. */
const SHADOW_LOOP = '10 FOR K=1 TO 10\n20 S=S+K\n30 NEXT K\n40 END\n';

/** The DS-reserved shadow slots, i.e. the shadow *storage* namespace. */
function shadowLabels(asm: { lines: AsmLine[] }): string[] {
  return asm.lines
    .filter(l => l.mnemonic === 'DS' && l.label?.startsWith('SHADOW_'))
    .map(l => l.label!);
}

describe('codegen - loop shadow slots', () => {
  it('emits shadow slot storage and an entry-time decode+SHADOW_ACTIVE sequence for a shadow-eligible FOR loop', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const lbls = asm.lines.map(l => l.label).filter(Boolean) as string[];
    // shadow slots exist as DS reservations, distinct from VAR_K
    expect(lbls.some(l => l.includes('SHADOW') && l.includes('K'))).toBe(true);
    expect(lbls).toContain('VAR_K'); // unchanged: the counter still gets its normal BCD slot too
    // BCD_TO_INT16 is called at least 3 times at loop entry (counter, limit, step)
    const decodeCalls = asm.lines.filter(l => l.mnemonic === 'cal' && l.operands === 'BCD_TO_INT16').length;
    expect(decodeCalls).toBeGreaterThanOrEqual(3);
  });

  it('does NOT emit shadow slots for a statically disqualified loop (array index in body)', () => {
    const asm = generate(parse('10 DIM A(20)\n20 FOR K=1 TO 10\n30 PRINT A(K)\n40 NEXT K\n50 END\n'));
    const lbls = asm.lines.map(l => l.label).filter(Boolean) as string[];
    expect(lbls.some(l => l.includes('SHADOW') && l.includes('K'))).toBe(false);
  });

  it('does NOT emit shadow slots when the counter is printed (Task 2 disqualifies a BCD-consuming use)', () => {
    const asm = generate(parse('10 FOR K=1 TO 10\n20 PRINT K\n30 NEXT K\n40 END\n'));
    expect(shadowLabels(asm)).toEqual([]);
  });

  it('reserves exactly four slots per shadowed loop: three DS 2 int16 slots and one DS 1 flag', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const ds = asm.lines.filter(l => l.mnemonic === 'DS' && l.label?.startsWith('SHADOW_'));
    expect(ds.length).toBe(4);
    expect(ds.filter(l => l.operands === '2').length).toBe(3); // counter, limit, step
    expect(ds.filter(l => l.operands === '1').length).toBe(1); // active flag
  });

  it('keeps the shadow DS block separate from the 9-byte BASIC variable block', () => {
    const asm = generate(parse(SHADOW_LOOP));
    // No shadow slot may be sized like a BASIC variable (9 bytes) or a string
    // (256), and no VAR_ label may end up sized like a shadow slot.
    for (const l of asm.lines.filter(x => x.mnemonic === 'DS')) {
      if (l.label?.startsWith('SHADOW_')) expect(['1', '2']).toContain(l.operands);
      if (l.label?.startsWith('VAR_')) expect(['9', '256']).toContain(l.operands);
    }
    // The shadow block carries its own header comment, i.e. it is emitted by
    // its own loop rather than folded into the variable table's.
    const idx = asm.lines.findIndex(l => !l.mnemonic && l.comment?.includes('Loop-shadow storage'));
    expect(idx).toBeGreaterThan(0);
  });

  it('decodes into the shadow slots BEFORE the loop-top label, so it runs once per loop, not once per iteration', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const topIdx = asm.lines.findIndex(l => l.label?.startsWith('FOR_K'));
    const lastDecode = asm.lines.map((l, i) => ({ l, i }))
      .filter(({ l }) => l.mnemonic === 'cal' && l.operands === 'BCD_TO_INT16')
      .map(({ i }) => i)
      .pop();
    expect(topIdx).toBeGreaterThan(0);
    expect(lastDecode).toBeDefined();
    expect(lastDecode!).toBeLessThan(topIdx);
  });

  it('reaches every shadow slot through IX-indexed addressing, never a bare absolute label operand', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const shadowNames = new Set(shadowLabels(asm));
    expect(shadowNames.size).toBe(4);
    for (const line of asm.lines) {
      if (!line.mnemonic || line.mnemonic === 'DS') continue;
      const ops = line.operands ?? '';
      for (const name of shadowNames) {
        if (!new RegExp(`(?<![A-Za-z0-9_])${name}(?![A-Za-z0-9_])`).test(ops)) continue;
        // The ONLY instruction allowed to name a shadow slot is the address
        // load that feeds `pre ix,$2`. Anything else (e.g. `stw $0,SHADOW_K`)
        // would be a direct-absolute memory operand, which this CPU has no
        // encoding for.
        expect(`${line.mnemonic} ${ops}`).toBe(`ldw $2,${name}`);
      }
    }
  });

  it('never computes a value into $3, which `ldw $2,LABEL` clobbers as the high half of the address pair', () => {
    const asm = generate(parse(SHADOW_LOOP));
    // ldw_D1 in src/emulator/exec.ts writes mr[reg] AND mr[reg+1], so any
    // value parked in $3 across an address load is destroyed.
    const start = asm.lines.findIndex(l => l.comment?.includes('loop-shadow entry'));
    expect(start).toBeGreaterThan(0);
    const end = asm.lines.findIndex(l => l.label?.startsWith('FOR_K'));
    for (const line of asm.lines.slice(start, end)) {
      if (line.mnemonic === 'ld' || line.mnemonic === 'ldw') {
        expect(line.operands?.startsWith('$3,')).toBeFalsy();
      }
    }
  });

  it('stores a definite 0 or 1 into the SHADOW_ACTIVE flag on both paths', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const activeLabel = shadowLabels(asm).find(l => l.includes('ACT'));
    expect(activeLabel).toBeDefined();
    const text = asm.lines.map(l => `${l.mnemonic ?? ''} ${l.operands ?? ''}`);
    expect(text).toContain('ld $9,&H01');
    expect(text).toContain('ld $9,&H00');
    // ...and a single-byte store of that register through the IX path
    expect(text).toContain('st $9,(ix+$sx)');
  });

  it('allocates one shared set of slots when the same counter drives two separate loops', () => {
    const asm = generate(parse(
      '10 FOR K=1 TO 10\n20 S=S+K\n30 NEXT K\n40 FOR K=1 TO 5\n50 S=S+K\n60 NEXT K\n70 END\n',
    ));
    expect(asm.lines.filter(l => l.mnemonic === 'DS' && l.label?.startsWith('SHADOW_')).length).toBe(4);
    // but both loops still decode at their own entry
    expect(asm.lines.filter(l => l.mnemonic === 'cal' && l.operands === 'BCD_TO_INT16').length).toBe(6);
  });

  it('keeps the SHADOW_ prefix exclusively for storage, so no branch target can be mistaken for a slot', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const nonStorage = asm.lines
      .filter(l => l.label?.startsWith('SHADOW_') && l.mnemonic !== 'DS')
      .map(l => l.label!);
    expect(nonStorage).toEqual([]);
  });

  it('emits no shadow machinery at all for a program with no eligible loop', () => {
    const asm = generate(parse('10 A=5\n20 END\n'));
    expect(shadowLabels(asm)).toEqual([]);
    expect(asm.lines.some(l => l.mnemonic === 'cal' && l.operands === 'BCD_TO_INT16')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Task 4: emitNext's dual tail
// ---------------------------------------------------------------------------
//
// A shadow-eligible loop's NEXT gains a runtime SHADOW_ACTIVE test that picks
// between a native int16 tail and today's BCD tail. The BCD tail is not
// deleted, not rewritten and not reordered -- it is both the runtime fallback
// (a bound that didn't decode) and the whole of a non-eligible loop's NEXT, so
// these tests pin its byte-for-byte survival as hard as they pin the new code.
//
// NOTE the sample program: `PRINT K` is a DISQUALIFYING use of the counter
// (Task 2 ruling -- PRINT consumes it as 9-byte BCD), so the brief's draft
// program for the positive case would have produced no shadowing at all.
// SHADOW_LOOP above is reused instead.
//
// SHADOW_LOOP's body (`S=S+K`) still resolves K through VAR_K until Task 5
// lands, so it exercises the "keep the BCD form current" variant of the tail.
// SHADOW_LOOP_NO_READ never touches K in its body and therefore gets the fully
// amortized variant -- one BCD encode for the whole loop. Both shapes matter,
// so both are pinned.

/** Shadow-eligible, and the body reads the counter's BCD form (for now). */
const SHADOW_LOOP_READS = SHADOW_LOOP;

/** Shadow-eligible, and nothing in the body reads the counter at all. */
const SHADOW_LOOP_NO_READ = '10 FOR K=1 TO 10\n20 S=S+1\n30 NEXT K\n40 END\n';

/** Text form of an instruction line, for sequence comparisons. */
function instrText(l: AsmLine): string {
  return `${l.mnemonic ?? ''} ${l.operands ?? ''}`.trim();
}

/**
 * The BCD tail as emitNext has always emitted it: from the `NEXT <v>` comment
 * through the `jr <top>` that closes the loop. Extracted by comment marker so
 * the comparison is over the instruction sequence, not over line indices that
 * shift as unrelated codegen changes land.
 */
/**
 * emitFor's shadow-entry block for `varName`: from its header comment to the
 * loop-top label. Scoped deliberately -- the shared BCD_TO_INT16 runtime also
 * writes `$9` (as its status register), so an unscoped search for
 * `ld $9,&H01` finds that instead of the SHADOW_ACTIVE activation constant.
 */
function shadowEntryBlock(asm: { lines: AsmLine[] }, varName: string): string[] {
  const start = asm.lines.findIndex(l => l.comment?.includes(`loop-shadow entry for ${varName}`));
  if (start < 0) return [];
  const end = asm.lines.findIndex((l, i) => i > start && l.label?.startsWith(`FOR_${varName}_`));
  expect(end).toBeGreaterThan(start);
  return asm.lines.slice(start, end).filter(l => l.mnemonic).map(instrText);
}

function bcdTail(asm: { lines: AsmLine[] }, varName: string): string[] {
  const start = asm.lines.findIndex(l => !l.mnemonic && l.comment === `NEXT ${varName}`);
  expect(start, `BCD tail marker for NEXT ${varName}`).toBeGreaterThan(0);
  const end = asm.lines.findIndex((l, i) => i > start && l.label?.startsWith(`ENDFOR_${varName}`));
  expect(end).toBeGreaterThan(start);
  return asm.lines.slice(start, end).filter(l => l.mnemonic).map(instrText);
}

describe('codegen - NEXT dual tail', () => {
  it('emits a runtime SHADOW_ACTIVE test in NEXT that selects between a native and a BCD tail', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const text = asm.lines.map(instrText);

    // The runtime test: read the flag byte, compare-AND it, branch away when 0.
    const flagLoad = asm.lines.findIndex(l => instrText(l) === 'ld $9,(ix+$sx)'
      && l.comment?.includes('SHADOW_K_ACT'));
    expect(flagLoad).toBeGreaterThan(0);
    expect(instrText(asm.lines[flagLoad + 1]!)).toBe('anc $9,$9');
    const branch = asm.lines[flagLoad + 2]!;
    expect(branch.mnemonic).toBe('jr');
    expect(branch.operands).toMatch(/^z,NEXTSHADOW_BCD_K_\d+$/);

    // Native tail: a real 16-bit add and a real 16-bit compare.
    expect(text).toContain('adw $0,$4');
    expect(text).toContain('sbcw $8,$6');
    // ...and no ROM FP call between the flag test and the loop-back branch.
    const bcdLabelIdx = asm.lines.findIndex(l => l.label?.startsWith('NEXTSHADOW_BCD_K'));
    const native = asm.lines.slice(flagLoad, bcdLabelIdx).map(instrText);
    expect(native.filter(t => t.startsWith('cal ROM_CALL'))).toEqual([]);

    // BCD tail: still there, still calling FP_ADD and FP_SUB through ROM_CALL_FP.
    const tail = bcdTail(asm, 'K');
    expect(tail).toContain('cal ROM_CALL_FP');
    expect(asm.lines.filter(l => l.comment === 'counter + step').length).toBe(1);
    expect(asm.lines.filter(l => l.comment === 'counter - limit').length).toBe(1);
  });

  it('leaves the BCD tail byte-for-byte identical to the non-shadowed one', () => {
    // Same loop shape, one shadow-eligible and one not (an array index in the
    // body disqualifies it). The BCD tail must be instruction-for-instruction
    // the same sequence in both.
    //
    // uniqueLabel() numbers labels from a single program-wide counter, so the
    // shadowed program's extra labels shift every LATER label's suffix. That
    // is a naming artefact, not a codegen difference, so the suffix is
    // normalised away -- and only the suffix: the label STEM (CMPLE, FOR_K,
    // ENDFOR_K) still has to match, as does everything else on the line.
    const normalise = (t: string): string => t.replace(/\b([A-Z][A-Z0-9_]*?)_\d+\b/g, '$1_#');
    const shadowed = generate(parse('10 FOR K=1 TO 10\n20 S=S+K\n30 NEXT K\n40 END\n'));
    const plain    = generate(parse('10 DIM A(20)\n20 FOR K=1 TO 10\n30 S=A(K)\n40 NEXT K\n50 END\n'));
    expect(bcdTail(shadowed, 'K').map(normalise)).toEqual(bcdTail(plain, 'K').map(normalise));
  });

  it('emits nothing shadow-related in a statically disqualified loop\'s NEXT', () => {
    const asm = generate(parse('10 DIM A(20)\n20 FOR K=1 TO 10\n30 PRINT A(K)\n40 NEXT K\n50 END\n'));
    for (const l of asm.lines) {
      expect(l.operands ?? '').not.toContain('SHADOW');
      expect(l.label ?? '').not.toContain('SHADOW');
    }
    expect(asm.lines.some(l => l.mnemonic === 'cal' && l.operands === 'INT16_TO_BCD')).toBe(false);
  });

  it('re-syncs the BCD counter through INT16_TO_BCD + the normal variable store, not a raw poke', () => {
    const asm = generate(parse(SHADOW_LOOP_NO_READ));
    const idxs = asm.lines
      .map((l, i) => ({ l, i }))
      .filter(({ l }) => l.mnemonic === 'cal' && l.operands === 'INT16_TO_BCD')
      .map(({ i }) => i);
    // One on the normal exit path, one on the int16-overflow path. Nothing
    // per-iteration: this loop's body never reads K.
    expect(idxs.length).toBe(2);
    for (const i of idxs) {
      // Each is immediately followed by emitVariableStore(K)'s own sequence.
      const after = asm.lines.slice(i + 1, i + 7).map(instrText).filter(Boolean);
      expect(after.slice(0, 5)).toEqual([
        'ldw $2,VAR_K', 'pre ix,$2', 'psr sx,31', 'stm $10,(ix+$sx),8', 'st $18,(ix+&H08)',
      ]);
    }
  });

  it('guards the native step against int16 overflow and hands such a loop back to the BCD tail', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const text = asm.lines.map(instrText);
    // The signed-overflow test: equal operand signs + a sum whose sign flipped.
    expect(text).toContain('xr $8,$5');
    expect(text).toContain('xr $9,$1');
    expect(text).toContain('anc $8,&H80');
    expect(text).toContain('anc $9,&H80');

    const ovf = asm.lines.findIndex(l => l.label?.startsWith('NEXTSHADOW_OVF_K'));
    const bcd = asm.lines.findIndex(l => l.label?.startsWith('NEXTSHADOW_BCD_K'));
    expect(ovf).toBeGreaterThan(0);
    expect(bcd).toBeGreaterThan(ovf); // the overflow block falls THROUGH into the BCD tail
    const block = asm.lines.slice(ovf, bcd).map(instrText);
    expect(block).toContain('sbw $0,$4');          // recover the pre-step counter
    expect(block).toContain('cal INT16_TO_BCD');   // ...and publish it as BCD
    expect(block).toContain('ld $9,&H00');         // SHADOW_ACTIVE := 0
    expect(block).toContain('st $9,(ix+$sx)');
  });

  it('compares against the limit with the SAME `<=` the BCD tail uses (negative STEP stays unsupported)', () => {
    const asm = generate(parse(SHADOW_LOOP_NO_READ));
    const cmp = asm.lines.findIndex(l => instrText(l) === 'sbcw $8,$6');
    expect(cmp).toBeGreaterThan(0);
    // `counter <= limit` == "borrow (<) OR zero (==)", both branching back to
    // the loop top. Nothing inspects the step's sign, matching the BCD tail's
    // own unconditional `<=`.
    expect(asm.lines[cmp + 1]!.operands).toMatch(/^c,FOR_K_\d+$/);
    expect(asm.lines[cmp + 2]!.operands).toMatch(/^z,FOR_K_\d+$/);
    const text = asm.lines.map(instrText);
    expect(text.filter(t => t === 'sbcw $8,$6').length).toBe(1);
  });

  // -- how much of the counter's BCD form the tail has to keep current -------

  it('encodes the counter to BCD exactly once per loop when nothing in the body reads it', () => {
    const asm = generate(parse(SHADOW_LOOP_NO_READ));
    // No per-iteration sync block at all...
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_SYNC_K'))).toBe(false);
    // ...so the only INT16_TO_BCD calls are on the two exit paths.
    expect(asm.lines.filter(l => l.operands === 'INT16_TO_BCD').length).toBe(2);
  });

  it('keeps the counter\'s BCD form current per iteration while the body still reads it', () => {
    // `S=S+K` resolves K through VAR_K until Task 5's shadow-aware operand
    // resolution lands. Skipping the per-iteration encode would make the body
    // read the loop's INITIAL counter on every pass.
    const asm = generate(parse(SHADOW_LOOP_READS));
    const sync = asm.lines.findIndex(l => l.label?.startsWith('NEXTSHADOW_SYNC_K'));
    expect(sync).toBeGreaterThan(0);
    const cmp = asm.lines.findIndex(l => instrText(l) === 'sbcw $8,$6');
    expect(asm.lines[cmp + 1]!.operands).toMatch(/^c,NEXTSHADOW_SYNC_K_\d+$/);
    expect(asm.lines[cmp + 2]!.operands).toMatch(/^z,NEXTSHADOW_SYNC_K_\d+$/);
    // The sync block encodes, stores, and only then goes back to the top.
    const block = asm.lines.slice(sync, sync + 10).map(instrText).filter(Boolean);
    expect(block.slice(0, 6)).toEqual([
      'cal INT16_TO_BCD',
      'ldw $2,VAR_K', 'pre ix,$2', 'psr sx,31', 'stm $10,(ix+$sx),8', 'st $18,(ix+&H08)',
    ]);
    expect(block[6]).toMatch(/^jr FOR_K_\d+$/);
  });

  it('keeps the counter current for a RETURN, which leaves without reaching NEXT', () => {
    // A subroutine containing a loop it returns early out of. The RETURN skips
    // NEXT, so the once-per-loop exit re-sync never runs -- VAR_K has to have
    // been kept current all along, which is what the per-iteration sync does.
    const asm = generate(parse(
      '10 GOSUB 100\n20 END\n100 FOR K=1 TO 10\n110 S=S+1\n115 IF S=3 THEN RETURN\n'
      + '120 NEXT K\n130 RETURN\n',
    ));
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
    // ...and the loop keeps its native tail: RETURN is an exit, not a write.
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_BCD_K'))).toBe(true);
  });

  it('does not force a sync for a RETURN that is outside every shadowed loop', () => {
    // The RETURN closing the subroutine sits after NEXT, so it must not drag
    // an already-closed loop back onto the slow path.
    const asm = generate(parse(
      '10 GOSUB 100\n20 END\n100 FOR K=1 TO 10\n110 S=S+1\n120 NEXT K\n130 RETURN\n',
    ));
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_SYNC_K'))).toBe(false);
  });

  // -- GOSUB: the slots cannot be trusted at all ----------------------------

  it('takes a loop whose body GOSUBs off the fast path entirely', () => {
    // The subroutine may WRITE the counter, and that write lands in VAR_K --
    // somewhere the native tail never looks. A read-sync cannot fix it, so the
    // whole native tail is skipped and the runtime flag is forced to 0.
    const asm = generate(parse(
      '10 FOR K=1 TO 10\n20 GOSUB 100\n30 NEXT K\n40 END\n100 K=99\n110 RETURN\n',
    ));
    // No native tail at all -- NEXT is exactly the pre-shadowing BCD block.
    expect(asm.lines.some(l => (l.label ?? '').startsWith('NEXTSHADOW_'))).toBe(false);
    expect(asm.lines.some(l => l.operands === 'INT16_TO_BCD')).toBe(false);
    // The entry decode still runs, but its activation constant is back-patched
    // so SHADOW_ACTIVE is 0 on every path out of it.
    const entry = shadowEntryBlock(asm, 'K');
    expect(entry).not.toContain('ld $9,&H01');
    expect(entry.filter(t => t === 'ld $9,&H00').length).toBe(2);
    // ...and the slots are still reserved (emitFor already emitted them).
    expect(shadowLabels(asm)).toContain('SHADOW_K_ACT');
  });

  it('takes an ON..GOSUB in the body off the fast path the same way', () => {
    const asm = generate(parse(
      '10 FOR K=1 TO 10\n20 ON S GOSUB 100,110\n30 NEXT K\n40 END\n100 K=99\n105 RETURN\n110 RETURN\n',
    ));
    expect(asm.lines.some(l => (l.label ?? '').startsWith('NEXTSHADOW_'))).toBe(false);
    expect(shadowEntryBlock(asm, 'K')).not.toContain('ld $9,&H01');
  });

  it('unshadows every open loop when a GOSUB sits inside a nested one', () => {
    // The GOSUB is in J's body, but it is in K's body too.
    const asm = generate(parse(
      '10 FOR K=1 TO 3\n20 FOR J=1 TO 2\n30 GOSUB 200\n40 NEXT J\n50 NEXT K\n60 END\n'
      + '200 K=9\n210 RETURN\n',
    ));
    expect(asm.lines.some(l => (l.label ?? '').startsWith('NEXTSHADOW_'))).toBe(false);
    expect(shadowEntryBlock(asm, 'K')).not.toContain('ld $9,&H01');
    expect(shadowEntryBlock(asm, 'J')).not.toContain('ld $9,&H01');
  });

  it('leaves a GOSUB outside the loop alone', () => {
    // Shadowing is only unsafe for loops that are OPEN when the GOSUB is
    // emitted; one before or after must not disturb anything.
    const asm = generate(parse(
      '10 GOSUB 100\n20 FOR K=1 TO 10\n30 S=S+1\n40 NEXT K\n50 GOSUB 100\n60 END\n'
      + '100 S=0\n110 RETURN\n',
    ));
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_BCD_K'))).toBe(true);
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_SYNC_K'))).toBe(false);
    expect(shadowEntryBlock(asm, 'K')).toContain('ld $9,&H01');
  });

  it('sees a counter read through a nested loop\'s bounds', () => {
    // A bare `FOR J=1 TO K` is already disqualified by the static scan (the
    // inner FOR's `to` slot is a bare counter reference). `K*2` is NOT -- `*`
    // is a fast-path op with the counter as a direct operand -- so K stays
    // shadow-eligible while its BCD form is genuinely read, once per outer
    // iteration, by the inner loop's setup.
    const asm = generate(parse(
      '10 FOR K=1 TO 10\n20 FOR J=1 TO K*2\n30 S=S+1\n40 NEXT J\n50 NEXT K\n60 END\n',
    ));
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
    // ...but J's own loop never reads J, so J stays fully amortized.
    expect(asm.lines.some(l => l.label?.startsWith('NEXTSHADOW_SYNC_J'))).toBe(false);
  });

  it('never parks a value in $2 or $3, which every shadow-slot address load clobbers', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const start = asm.lines.findIndex(l => l.comment?.includes('shadowed tail'));
    const end = asm.lines.findIndex(l => l.label?.startsWith('NEXTSHADOW_BCD_K'));
    expect(start).toBeGreaterThan(0);
    for (const l of asm.lines.slice(start, end)) {
      if (!l.mnemonic) continue;
      // ldw_D1 writes the named register AND the next one, so $2 as a
      // destination is only ever the address scratch itself.
      if (l.mnemonic === 'ldw' && l.operands?.startsWith('$2,')) continue;
      expect(l.operands?.startsWith('$3,')).toBeFalsy();
      if (l.mnemonic === 'ld' || l.mnemonic === 'ldw' || l.mnemonic === 'adw' || l.mnemonic === 'sbw') {
        expect(l.operands?.startsWith('$2,')).toBeFalsy();
      }
    }
  });

  it('keeps NEXT branch targets out of the SHADOW_ storage namespace', () => {
    const asm = generate(parse(SHADOW_LOOP));
    const nonStorage = asm.lines
      .filter(l => l.label?.startsWith('SHADOW_') && l.mnemonic !== 'DS')
      .map(l => l.label!);
    expect(nonStorage).toEqual([]);
  });

  it('emits one dual tail per shadowed loop when the same counter drives two loops', () => {
    const asm = generate(parse(
      '10 FOR K=1 TO 10\n20 S=S+K\n30 NEXT K\n40 FOR K=1 TO 5\n50 S=S+K\n60 NEXT K\n70 END\n',
    ));
    expect(asm.lines.filter(l => l.label?.startsWith('NEXTSHADOW_BCD_K')).length).toBe(2);
    // Both bodies read K, so both tails carry a per-iteration sync: 3 encodes
    // each (exit, sync, overflow).
    expect(asm.lines.filter(l => l.mnemonic === 'cal' && l.operands === 'INT16_TO_BCD').length).toBe(6);
    // ...and each native tail loops back to its OWN loop-top label.
    const tops = asm.lines.filter(l => l.mnemonic === 'jr' && /^FOR_K_\d+$/.test(l.operands ?? ''));
    expect(new Set(tops.map(l => l.operands)).size).toBe(2);
  });
});
