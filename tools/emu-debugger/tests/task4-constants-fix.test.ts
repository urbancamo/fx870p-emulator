// Task 4 acceptance test — empirically proves emitNumberLiteral itself (not
// just the codegen shape) produces the right runtime value.
//
// Tasks 2b, 2c, and 3's emulator tests all deliberately avoided numeric
// literals in the BASIC source, because emitNumberLiteral was still the
// broken 2-byte-integer stub — they injected valid 9-byte BCD operands
// straight into variable storage instead, and tested only the
// operand-shuffling / comparison / MOD machinery around it.
//
// This test does the opposite: it compiles real literal-bearing BASIC
// source, runs it through the actual ROM, and reads the result variable's 9
// raw bytes back out of emulator RAM, comparing against numberToBcd9(expected)
// from the same bcd.ts module the compiler itself uses. No BCD bytes are
// injected into any variable here — the whole point is to prove
// emitNumberLiteral, wired up end-to-end, gets the encoding and the
// IX-indexed load right.
//
// Given this branch's history (Tasks 2, 2b, 2c, and 3 each had a
// codegen-level change that looked correct and produced a wrong runtime
// result until run through the real ROM), and given emitNumberLiteral is the
// single most-used piece of code in this whole compiler — virtually every
// BASIC statement touches a numeric literal — this test exists specifically
// to close that gap for constant loading.

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
 * Compile `source`, load it at 0x1CD0 (no operands injected — everything the
 * program needs comes from its own literals), and run until `stopLabel` is
 * reached.
 */
function compileAndRun(source: string, stopLabel = 'L20'): RunResult {
  const assembled = assemble(generate(parse(source)).lines);
  const addressOf = (name: string): number => {
    const entry = assembled.symbols.find(s => s.name === name);
    if (!entry) throw new Error(`symbol ${name} not found`);
    return entry.address;
  };

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(ORIGIN, assembled.binary);

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
  sess.addBreakpoint(addressOf(stopLabel)); // stop at END, before the wait-for-key

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

describe('Task 4: emitNumberLiteral produces correct 9-byte BCD at runtime', () => {
  it('A=5 (plain integer literal)', () => {
    const run = compileAndRun('10 A=5\n20 END\n');
    expectResult(run, 'VAR_A', 5, 'A=5');
  }, 60_000);

  it('A=0 (zero literal — different numberToBcd9 code path)', () => {
    const run = compileAndRun('10 A=0\n20 END\n');
    expectResult(run, 'VAR_A', 0, 'A=0');
  }, 60_000);

  it('A=3.5 (fractional literal)', () => {
    const run = compileAndRun('10 A=3.5\n20 END\n');
    expectResult(run, 'VAR_A', 3.5, 'A=3.5');
  }, 60_000);

  it('A=2+3 (literal loading through the arithmetic fix, entirely from source)', () => {
    // The first end-to-end test in this whole plan exercising
    // emitNumberLiteral and the arithmetic path (Tasks 2/2b) together, with
    // no injected bytes anywhere.
    const run = compileAndRun('10 A=2+3\n20 END\n');
    expectResult(run, 'VAR_A', 5, 'A=2+3');
  }, 60_000);

  it('IF 5>3 THEN A=1 (literals through the comparison fix)', () => {
    const run = compileAndRun('10 IF 5>3 THEN A=1\n20 END\n');
    expectResult(run, 'VAR_A', 1, 'IF 5>3 THEN A=1');
  }, 60_000);
});
