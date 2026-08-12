// Task 3 acceptance test — empirically proves MOD (&H105F) and the corrected
// FP_DIV (&H0646, replacing the wrong &H16BD integer-division helper) both
// compute correct results through the real ROM, not just that the right
// constant got wired to the call site.
//
// As in the Task 2b/2c tests, numeric literals are avoided everywhere:
// constant loading (`emitNumberLiteral`) is still the broken 2-byte-integer
// stub that Task 4 will replace. Valid 9-byte BCD operands are injected
// straight into the variables' storage instead, so what is under test is
// purely whether the ROM call at the wired address produces the right
// answer.

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

describe('Task 3: MOD operator (&H105F)', () => {
  it('computes C = A MOD B (7 MOD 3 = 1)', () => {
    const run = compileAndRun('10 C=A MOD B\n20 END\n', { VAR_A: 7, VAR_B: 3 });
    expectResult(run, 'VAR_C', 1, '7 MOD 3');
  }, 60_000);

  it('computes C = A MOD B (12 MOD 4 = 0, exact division)', () => {
    const run = compileAndRun('10 C=A MOD B\n20 END\n', { VAR_A: 12, VAR_B: 4 });
    expectResult(run, 'VAR_C', 0, '12 MOD 4');
  }, 60_000);

  it('computes C = A MOD B (10 MOD 3 = 1)', () => {
    const run = compileAndRun('10 C=A MOD B\n20 END\n', { VAR_A: 10, VAR_B: 3 });
    expectResult(run, 'VAR_C', 1, '10 MOD 3');
  }, 60_000);
});

describe('Task 3: corrected FP_DIV (&H0646)', () => {
  it('computes C = A/B (12/4 = 3)', () => {
    const run = compileAndRun('10 C=A/B\n20 END\n', { VAR_A: 12, VAR_B: 4 });
    expectResult(run, 'VAR_C', 3, '12/4');
  }, 60_000);

  it('computes C = A/B (7/2 = 3.5)', () => {
    const run = compileAndRun('10 C=A/B\n20 END\n', { VAR_A: 7, VAR_B: 2 });
    expectResult(run, 'VAR_C', 3.5, '7/2');
  }, 60_000);

  it('computes C = A/B (10/4 = 2.5)', () => {
    const run = compileAndRun('10 C=A/B\n20 END\n', { VAR_A: 10, VAR_B: 4 });
    expectResult(run, 'VAR_C', 2.5, '10/4');
  }, 60_000);
});
