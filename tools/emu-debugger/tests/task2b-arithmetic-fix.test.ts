// Task 2b acceptance test — proves the operand-plumbing bugs are fixed by
// checking the exact 9-byte BCD result the compiled code leaves in memory.
//
//   Bug 1: `phsm $10,8` pushed mr[10] DOWN to mr[3] (phsm is descending), so
//          the matching `ppsm $19,8` recovered $3-$10 instead of $10-$17.
//   Bug 2: the shared ROM_CALL wrapper clobbers $0-$3, which is where the
//          arithmetic right-hand operand lives.
//   Bug 3: the assembler dropped the 0x60 "explicit source register" selector
//          on reg-to-reg `ldm`, turning `ldm $0,$10,8` into `ldm $0,($sx),8`.
//   Bug 4: `psr sx,8` does not mean "displacement +8" — SX names a register
//          and its CONTENTS are the displacement. It also destroyed the ROM's
//          global SX -> $31 convention that the FP routines depend on.
//
// The test deliberately avoids numeric literals in the BASIC source: constant
// loading (`emitNumberLiteral`) is still the broken 2-byte-integer stub that
// Task 4 will replace. Valid 9-byte BCD operands are injected straight into
// the variables' storage instead, so what is under test is purely the
// operand-shuffling machinery around the FP ROM call.

import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { numberToBcd9 } from '../../compiler/bcd.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv } from '../../../src/emulator/def.js';

const ORIGIN = 0x1CD0;

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
 * named variables, and run until the END label is reached.
 */
function compileAndRun(source: string, seed: Record<string, number>): RunResult {
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
  // The emulator is module-global state: a second EmulatorSession in the same
  // process comes back with ISERV still latched from the previous session's
  // boot. A non-zero ISERV makes fetchOpcode() force segment 0, so the CPU
  // would execute ROM bytes instead of the program just loaded into Bank 1
  // RAM. Entering a fresh program is by definition not inside an ISR.
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf('L20')); // stop at END, before the wait-for-key

  const result = sess.run({ maxCycles: 5_000_000 });
  return {
    reason: result.reason,
    pc: result.pc,
    instructions: result.instructionsExecuted,
    read: (label: string) => sess.getMemory(addressOf(label), 9),
  };
}

function expectResult(run: RunResult, label: string, expected: number, note: string): void {
  const got = run.read(label);
  const want = numberToBcd9(expected);
  console.log(`${note}: exit=${run.reason} pc=0x${run.pc.toString(16)} instr=${run.instructions}`);
  console.log(`  ${label} = ${hex(got)}`);
  console.log(`  want  = ${hex(want)}  (BCD ${expected})`);
  expect(run.reason).toBe('breakpoint');
  expect(hex(got)).toBe(hex(want));
}

describe('Task 2b: phsm range + FP-safe ROM call', () => {
  it('computes C = A + B (2 + 3 = 5)', () => {
    const run = compileAndRun('10 C=A+B\n20 END\n', { VAR_A: 2, VAR_B: 3 });
    expectResult(run, 'VAR_C', 5, 'A+B');
  }, 60_000);

  it('computes C = A - B (7 - 4 = 3)', () => {
    const run = compileAndRun('10 C=A-B\n20 END\n', { VAR_A: 7, VAR_B: 4 });
    expectResult(run, 'VAR_C', 3, 'A-B');
  }, 60_000);

  it('computes C = A * B (6 * 7 = 42)', () => {
    const run = compileAndRun('10 C=A*B\n20 END\n', { VAR_A: 6, VAR_B: 7 });
    expectResult(run, 'VAR_C', 42, 'A*B');
  }, 60_000);

  it('computes C = A + B with fractional operands (0.5 + 0.25 = 0.75)', () => {
    // Exercises a non-integer exponent/mantissa so a result that merely
    // *looks* plausible for small integers cannot pass by accident.
    const run = compileAndRun('10 C=A+B\n20 END\n', { VAR_A: 0.5, VAR_B: 0.25 });
    expectResult(run, 'VAR_C', 0.75, 'A+B (fractional)');
  }, 60_000);

  it('routes the comparison branch through the FP-safe wrapper (A>B -> A-B)', () => {
    // `C=(A>B)` reaches emitBinaryExpr's comparison branch, which calls
    // FP_SUB via emitRomCallFp and leaves the raw difference in the
    // accumulator (turning the flags into a 0/1 boolean is not implemented).
    // Checking that raw difference proves the comparison call gets its
    // operands intact, which is what this task changed.
    //
    // NOTE: BASIC `IF A>B THEN ...` does NOT come through here — it uses
    // emitCondition(), a separate path that still passes its operands in
    // $19-$27 and ignores the comparison operator entirely. That is a
    // distinct, still-open bug, out of scope for this task.
    const run = compileAndRun('10 C=(A>B)\n20 END\n', { VAR_A: 5, VAR_B: 3 });
    expectResult(run, 'VAR_C', 2, 'C=(A>B) with A=5,B=3');
  }, 60_000);
});
