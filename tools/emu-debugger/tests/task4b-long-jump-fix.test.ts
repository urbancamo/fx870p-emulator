// Task 4b acceptance test — proves that branches further than ±127 bytes now
// reach the right address on the real CPU, not just that the right bytes got
// emitted.
//
// `jr`/`jr cc` carry a single imm7 offset byte, reachable range -127..+127.
// Beyond that, encodeImm7 used to wrap silently: a backward overshoot became
// a plausible-looking *forward* jump. Task 4 didn't cause this (the encoder
// was always wrong), but it made it the common case — BCD constants are ~13
// bytes each instead of the old stub's ~3, so an ordinary loop body is now
// big enough to overflow.
//
// The assembler now relaxes such branches into the 3-byte absolute
// `jp`/`jp cc`, iterating layout to a fixed point because each relaxation
// shifts every later address by a byte. Byte-level coverage of the relaxation
// algorithm lives in tools/compiler/tests/assembler.test.ts; this file is the
// empirical half — on this branch, changes that produced the right-looking
// bytes have several times still produced the wrong runtime result.
//
// The runtime cases below use WHILE, whose forward loop-exit branch is a real
// `jr cc` that relaxation has to get right, and which Task 2c already proved
// works end-to-end. See the final describe block for why the reviewer's FOR
// repro is verified at byte level only.

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

/** Ten statements, each adding 1 to S — ~700 bytes of BCD-constant loads. */
function bigBody(): string {
  return [30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map(n => `${n} S=S+1\n`).join('');
}

interface RunResult {
  reason: string;
  pc: number;
  instructions: number;
  relaxedBranches: number;
  relaxationIterations: number;
  read: (label: string) => Uint8Array;
}

/** Compile `source`, load it at 0x1CD0, and run until `stopLabel` is reached. */
function compileAndRun(source: string, stopLabel: string): RunResult {
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
  // Module-global emulator state: a second EmulatorSession in the same process
  // comes back with ISERV still latched from the previous session's boot, and
  // a non-zero ISERV makes fetchOpcode() force segment 0 (ROM). Entering a
  // fresh program is by definition not inside an ISR.
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf(stopLabel)); // stop at END, before the wait-for-key

  const result = sess.run({ maxCycles: 20_000_000 });
  return {
    reason: result.reason,
    pc: result.pc,
    instructions: result.instructionsExecuted,
    relaxedBranches: assembled.relaxedBranches,
    relaxationIterations: assembled.relaxationIterations,
    read: (label: string) => sess.getMemory(addressOf(label), 9),
  };
}

function expectResult(run: RunResult, label: string, expected: number, note: string): void {
  const got = run.read(label);
  const want = numberToBcd9(expected);
  console.log(`${note}: exit=${run.reason} pc=0x${run.pc.toString(16)} instr=${run.instructions} ` +
              `relaxed=${run.relaxedBranches} iters=${run.relaxationIterations}`);
  console.log(`  ${label} = ${hex(got)}`);
  console.log(`  want  = ${hex(want)}  (BCD ${expected})`);
  // A mis-relaxed branch shows up here as `illegal` (landed mid-instruction),
  // `maxCycles` (looped forever), or a plain wrong value.
  expect(run.reason).toBe('breakpoint');
  expect(hex(got)).toBe(hex(want));
}

describe('Task 4b: a relaxed branch reaches the right address at runtime', () => {
  it('exits a WHILE loop whose exit branch had to be relaxed', () => {
    // The loop-exit `jr z,<past WEND>` spans a ~700-byte body, far outside
    // imm7 range, so the assembler relaxes it to `jp z,`. If the relaxation
    // computed the wrong absolute target, this either crashes or never
    // terminates. Body adds 10 per pass; 3 passes → S = 30, then S<30 fails.
    const run = compileAndRun(`10 S=0\n20 WHILE S<30\n${bigBody()}130 WEND\n140 END\n`, 'L140');
    expect(run.relaxedBranches).toBe(1);
    expectResult(run, 'VAR_S', 30, 'WHILE S<30 with a 10-statement body');
  }, 120_000);

  it('takes a relaxed exit branch immediately when the loop never runs', () => {
    // Same shape, but false on entry — so the relaxed branch is taken on the
    // very first test and must land exactly past WEND. An off-target landing
    // would run some of the body and leave S != 5.
    const run = compileAndRun(`10 S=5\n20 WHILE S<0\n${bigBody()}130 WEND\n140 END\n`, 'L140');
    expect(run.relaxedBranches).toBe(1);
    expectResult(run, 'VAR_S', 5, 'WHILE S<0 (never entered), big body skipped');
  }, 120_000);

  it('still runs a program where nothing needs relaxing', () => {
    // Regression guard for the common case: branches that fit must stay
    // compact 2-byte `jr`s and keep working exactly as before.
    const run = compileAndRun('10 S=0\n20 WHILE S<3\n30 S=S+1\n40 WEND\n50 END\n', 'L50');
    expect(run.relaxedBranches).toBe(0);
    expectResult(run, 'VAR_S', 3, 'small WHILE, all branches in range');
  }, 120_000);

  it('runs a long straight-line program after an IF', () => {
    const source =
      '10 S=0\n20 IF 5>3 THEN S=1\n' +
      '30 S=S+11\n' + '40 S=S+12\n' + '50 S=S+13\n' + '60 S=S+14\n' + '70 S=S+15\n' +
      '80 S=S+16\n' + '90 S=S+17\n' + '100 S=S+18\n' + '110 END\n';
    const run = compileAndRun(source, 'L110');
    expectResult(run, 'VAR_S', 1 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18, 'long body after IF');
  }, 120_000);
});

describe("Task 4b: the reviewer's FOR repro", () => {
  // `10 S=0 / 20 FOR I=1 TO 3 / 30 S=S+I / 40 NEXT I / 50 END` was the program
  // that surfaced this bug: NEXT's back-edge `jr nz,FOR_I_1` at 0x1E1B has a
  // true distance of -208, which wrapped to +80 and sent the CPU into the
  // middle of an instruction (exit `illegal` at PC=0x1E40).
  //
  // That branch is now correct — asserted below. The program used to still
  // not finish with S=6 because `emitNext` had two further defects that had
  // nothing to do with branch range: it staged operands using the old
  // pre-Task-2b convention and called plain `emitRomCall` instead of
  // `emitRomCallFp` (clobbering the operand), and its loop-continuation test
  // was a bare `jr nz,<top>` ("counter <> limit") instead of "counter <=
  // limit". Both were fixed in Task 4c (see codegen.ts's emitNext), which is
  // why the end-to-end case below now runs for real instead of being skipped.
  const REPRO = '10 S=0\n20 FOR I=1 TO 3\n30 S=S+I\n40 NEXT I\n50 END\n';

  it("relaxes NEXT's over-long back-edge to a jp aimed at the loop top", () => {
    const assembled = assemble(generate(parse(REPRO)).lines);
    const forTop = assembled.symbols.find(s => s.name === 'FOR_I_1')!.address;

    const relaxed = assembled.lineResults.filter(r => r.relaxed);
    expect(relaxed).toHaveLength(1);
    const site = relaxed[0]!;

    // Task 4c restructured NEXT's tail to end in emitComparisonBranch('<=', ...)
    // followed by an unconditional `jr,<top>` back-edge (codegen.ts:1078) —
    // the `<=` classification itself is a short forward jump that never needs
    // relaxing, so the over-long branch this test exercises is now that
    // unconditional back-edge. Unconditional `jr` is opcode 0xB7; its relaxed
    // absolute form is unconditional `jp`, opcode 0x37.
    expect(site.bytes[0]).toBe(0x37);
    expect(site.bytes[1]! | (site.bytes[2]! << 8)).toBe(forTop);

    // Cross-check lineResults against the actual emitted binary — the two
    // views (metadata vs. bytes) have to agree, and only this assertion
    // exercises the binary directly. `assembled.binary` is indexed from 0 at
    // ORG's operand (0x1CD0 here), not from address 0, so site.address (an
    // absolute address) needs that offset subtracted.
    const off = site.address - ORIGIN;
    expect(Array.from(assembled.binary.slice(off, off + 3)))
      .toEqual([0x37, forTop & 0xFF, (forTop >> 8) & 0xFF]);

    // And the corrupt encoding is gone: the pre-Task-4b code wrapped this
    // offset silently instead of relaxing, producing a 2-byte `jr` (0xB7) with
    // a bogus positive offset rather than a 3-byte absolute `jp`.
    expect(Array.from(assembled.binary.slice(off, off + 1))).not.toEqual([0xB7]);
  });

  it('completes with S=6', () => {
    const run = compileAndRun(REPRO, 'L50');
    expectResult(run, 'VAR_S', 6, 'FOR I=1 TO 3: S=S+I');
  }, 120_000);
});
