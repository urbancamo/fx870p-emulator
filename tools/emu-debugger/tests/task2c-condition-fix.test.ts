// Task 2c acceptance test — proves IF/WHILE conditions honour the comparison
// operator the programmer actually wrote.
//
// Before this task `emitCondition` tested `isComparisonOp(op)` (a boolean) and
// then discarded the operator, and every caller hardcoded `jr z,<skip>`. Every
// relational operator therefore compiled to the same "branch away when the
// difference is zero" test, i.e. `=` ran its THEN branch when the operands
// differed and `<`/`>`/`<=`/`>=` were indistinguishable from `<>`. The same
// method also still staged its operands the pre-Task-2 way (right left behind
// in $19-$27 instead of $0-$8) and called FP_SUB through the plain ROM_CALL
// wrapper, which clobbers $0-$3.
//
// The fix classifies the FP_SUB difference with two non-destructive tests:
//   `orcm $10,$11,8`  — Z:   are all nine accumulator bytes zero?
//   `anc  $18,&H04`   — NEG: is bit 2 of the exponent/sign byte set?
// and combines them per operator (see emitComparisonBranch in codegen.ts).
//
// As in the Task 2b test, numeric literals are avoided everywhere: constant
// loading (`emitNumberLiteral`) is still the broken 2-byte-integer stub that
// Task 4 will replace, so a `THEN C=1` body would store seven bytes of
// leftover accumulator state alongside the 1. Operands are injected straight
// into variable storage as valid 9-byte BCD instead, and the THEN body copies
// a variable. The target variable is pre-seeded with a sentinel (9) that no
// THEN branch in this file can produce, so a "false" case is proved to have
// skipped rather than merely to have left memory looking untouched.

import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { numberToBcd9 } from '../../compiler/bcd.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv } from '../../../src/emulator/def.js';

const ORIGIN = 0x1CD0;

/** Value pre-loaded into C; no THEN branch here can produce it. */
const SENTINEL = 9;

function hex(bytes: Uint8Array | number[]): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

interface RunResult {
  reason: string;
  pc: number;
  instructions: number;
  read: (label: string) => Uint8Array;
}

/**
 * Compile `source`, load it at 0x1CD0, poke the given BCD values into the
 * named variables, and run until `stopLabel` is reached.
 */
function compileAndRun(
  source: string,
  seed: Record<string, number>,
  stopLabel: string,
): RunResult {
  const assembled = assemble(generate(parse(source)).lines);
  const addressOf = (name: string): number => {
    const entry = assembled.symbols.find(s => s.name === name);
    if (!entry) throw new Error(`symbol ${name} not found`);
    return entry.address;
  };

  const sess = new EmulatorSession({ mode: 'snapshot' });
  // The DS directives for variable storage are part of the binary (as zeros),
  // so the program image must be written before the operands are seeded.
  sess.loadBinary(ORIGIN, assembled.binary);
  for (const [label, value] of Object.entries(seed)) {
    sess.loadBinary(addressOf(label), numberToBcd9(value));
  }

  // MODE110 on hardware sets UA=0x55 so the fetch segment is Bank 1 RAM.
  setUa(0x55);
  setDelayedUa(0x55);
  // Module-global emulator state: a second EmulatorSession in the same process
  // comes back with ISERV still latched from the previous session's boot, and
  // a non-zero ISERV makes fetchOpcode() force segment 0 (ROM) instead of the
  // Bank 1 RAM the program was just written into.
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf(stopLabel)); // stop at END, before wait-for-key

  const result = sess.run({ maxCycles: 5_000_000 });
  return {
    reason: result.reason,
    pc: result.pc,
    instructions: result.instructionsExecuted,
    read: (label: string) => sess.getMemory(addressOf(label), 9),
  };
}

function expectVar(run: RunResult, label: string, expected: number, note: string): void {
  const got = run.read(label);
  const want = numberToBcd9(expected);
  console.log(`${note}: exit=${run.reason} pc=0x${run.pc.toString(16)} instr=${run.instructions}`);
  console.log(`  ${label} = ${hex(got)}`);
  console.log(`  want  = ${hex(want)}  (BCD ${expected})`);
  expect(run.reason).toBe('breakpoint');
  expect(hex(got)).toBe(hex(want));
}

/**
 * `10 IF A <op> B THEN C=A` / `20 END`, with C pre-set to the sentinel.
 *
 * `taken` says whether the THEN branch must run: if it does, C ends up equal
 * to A; if it does not, C must still hold the sentinel.
 */
function runIf(op: string, a: number, b: number, taken: boolean): void {
  const source = `10 IF A${op}B THEN C=A\n20 END\n`;
  const run = compileAndRun(source, { VAR_A: a, VAR_B: b, VAR_C: SENTINEL }, 'L20');
  expectVar(
    run,
    'VAR_C',
    taken ? a : SENTINEL,
    `IF ${a}${op}${b} (expect ${taken ? 'THEN taken' : 'THEN skipped'})`,
  );
}

describe('Task 2c: IF honours the comparison operator', () => {
  it('= is true only when the operands are equal', () => {
    runIf('=', 5, 5, true);
    runIf('=', 5, 3, false);
    runIf('=', 3, 5, false);
  }, 120_000);

  it('<> is true only when the operands differ', () => {
    runIf('<>', 5, 3, true);
    runIf('<>', 5, 5, false);
  }, 120_000);

  it('< is true only when left is strictly smaller', () => {
    runIf('<', 3, 5, true);
    runIf('<', 5, 3, false);
    runIf('<', 5, 5, false); // equal is not less-than
  }, 120_000);

  it('> is true only when left is strictly greater', () => {
    runIf('>', 5, 3, true);
    runIf('>', 3, 5, false);
    runIf('>', 5, 5, false); // equal is not greater-than
  }, 120_000);

  it('<= is true when left is smaller or equal', () => {
    runIf('<=', 3, 5, true);
    runIf('<=', 5, 5, true); // the case the zero-difference skip exists for
    runIf('<=', 5, 3, false);
  }, 120_000);

  it('>= is true when left is greater or equal', () => {
    runIf('>=', 5, 3, true);
    runIf('>=', 5, 5, true);
    runIf('>=', 3, 5, false);
  }, 120_000);

  it('reads the sign of the difference, not of the operands', () => {
    // Both operands negative: the difference is what decides, and its sign
    // byte is 5/6 rather than 0/1.
    runIf('<', -5, -3, true);
    runIf('<', -3, -5, false);
    runIf('>', -3, -5, true);
    runIf('>', -5, -3, false);
  }, 120_000);

  it('compares fractional operands', () => {
    // A difference small enough to need a negative exponent still has to be
    // classified purely by byte 8's sign bit.
    runIf('>', 0.5, 0.25, true);
    runIf('>', 0.25, 0.5, false);
    runIf('=', 0.5, 0.5, true);
  }, 120_000);
});

describe('Task 2c: PRIMES.BAS-shaped guard (arithmetic inside the condition)', () => {
  // Same shape as PRIMES.BAS line 120, `IF K+K>N THEN 200`: an expression on
  // the left of the comparison, so the `+` result has to survive into the
  // FP_SUB staging.
  function runSumIf(a: number, b: number, taken: boolean): void {
    const run = compileAndRun(
      '10 IF A+A>B THEN C=A\n20 END\n',
      { VAR_A: a, VAR_B: b, VAR_C: SENTINEL },
      'L20',
    );
    expectVar(run, 'VAR_C', taken ? a : SENTINEL, `IF ${a}+${a}>${b}`);
  }

  it('A+A>B just above the boundary', () => { runSumIf(3, 5, true); }, 120_000);
  it('A+A>B exactly at the boundary', () => { runSumIf(3, 6, false); }, 120_000);
  it('A+A>B just below the boundary', () => { runSumIf(3, 7, false); }, 120_000);
});

describe('Task 2c: WHILE loops on a real comparison', () => {
  it('iterates until the counter reaches the limit', () => {
    // D is the increment (a variable, not a literal, because
    // emitNumberLiteral is still the broken stub). A starts at 1 and B is 4,
    // so the body must run exactly three times and A must end equal to B.
    const run = compileAndRun(
      '10 WHILE A<B\n20 A=A+D\n30 WEND\n40 END\n',
      { VAR_A: 1, VAR_B: 4, VAR_D: 1 },
      'L40',
    );
    expectVar(run, 'VAR_A', 4, 'WHILE A<B: A=A+D from 1 to 4');
  }, 120_000);

  it('does not enter the body when the condition is false on entry', () => {
    const run = compileAndRun(
      '10 WHILE A<B\n20 A=A+D\n30 WEND\n40 END\n',
      { VAR_A: 4, VAR_B: 4, VAR_D: 1 },
      'L40',
    );
    expectVar(run, 'VAR_A', 4, 'WHILE 4<4: body must not run');
  }, 120_000);
});
