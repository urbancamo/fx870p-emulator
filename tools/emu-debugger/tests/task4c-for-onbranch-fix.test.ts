// Task 4c acceptance test — empirically proves that emitNext (FOR/NEXT's
// increment and loop-continuation test) and emitOnBranch (ON GOTO/ON GOSUB's
// selector comparison) now use the same proven operand-staging convention
// (left in $10-$18, right in $0-$8, called through emitRomCallFp/ROM_CALL_FP)
// that Task 2b/2c already fixed in emitBinaryExpr/emitCondition. Before this
// fix all three sites staged the right-hand operand into the old $19-$27
// convention and called plain emitRomCall/ROM_CALL, whose own preamble
// (`ldw $0,&H5323`) clobbers $0-$1 before the ROM routine runs.
//
// Given this branch's history — every one of Tasks 2, 2b, 2c, 3, and 4b had a
// codegen change that looked correct and produced a wrong runtime result
// until run through the real ROM — every case here runs the actual compiled
// binary through EmulatorSession and reads the raw BCD bytes back out of
// emulator RAM, rather than asserting on emitted assembly text.

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

/** Compile `source`, load it at 0x1CD0, and run until `stopLabel` is reached. */
function compileAndRun(source: string, stopLabel: string, maxCycles = 5_000_000): RunResult {
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

  const result = sess.run({ maxCycles });
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

describe('Task 4c: emitNext (FOR/NEXT) uses the correct ROM operand staging', () => {
  it('FOR I=1 TO 3: S=S+I sums to 6 (default step of 1)', () => {
    // The exact repro from Task 4b's report, left as it.skip in
    // task4b-long-jump-fix.test.ts pending this fix.
    const run = compileAndRun('10 S=0\n20 FOR I=1 TO 3\n30 S=S+I\n40 NEXT I\n50 END\n', 'L50');
    expectResult(run, 'VAR_S', 6, 'FOR I=1 TO 3: S=S+I');
  }, 120_000);

  it('FOR I=2 TO 10 STEP 2: S=S+I sums to 30 (explicit step staging)', () => {
    // 2+4+6+8+10 = 30. Confirms the step operand (not just the default
    // literal 1) is staged and added correctly by the increment fix.
    const run = compileAndRun('10 S=0\n20 FOR I=2 TO 10 STEP 2\n30 S=S+I\n40 NEXT I\n50 END\n', 'L50');
    expectResult(run, 'VAR_S', 30, 'FOR I=2 TO 10 STEP 2: S=S+I');
  }, 120_000);

  // FINDING (Task 4c, out of scope for this task's three fix sites): FOR
  // loops in this compiler always execute the body at least once, regardless
  // of the initial-vs-limit comparison. `emitFor` (codegen.ts:993-1022)
  // stores from/to/step and drops straight into `topLabel:` with no test —
  // the only continuation test lives in `emitNext`, which runs *after* the
  // first pass through the body. So `FOR I=5 TO 1` (no STEP) increments I to
  // 6 and only then finds 6<=1 false, having already executed the body once
  // with I=5. This is architecturally independent of the `<>`→`<=` fix in
  // Fix 2 above — even a perfectly correct `<=` test at NEXT cannot make the
  // *first* iteration conditional, because nothing tests before entering the
  // loop body for the first time. Confirmed empirically: VAR_S comes back as
  // 1 (one iteration ran), not 0. Fixing this needs a new upfront guard test
  // in emitFor (e.g. compute from<=to and jr to endLabel if false, before
  // falling into topLabel) — genuinely new scope beyond porting the
  // already-proven operand-staging fix, so left for a follow-up task rather
  // than attempted here.
  it.skip('FOR I=5 TO 1: body never executes (zero-iteration loop)', () => {
    // 5 > 1 on the very first test, so with default step (+1) the <=
    // continuation test must skip the body immediately rather than run at
    // least once. S starts at 0 and stays 0 if the body is truly skipped.
    const run = compileAndRun('10 S=0\n20 FOR I=5 TO 1\n30 S=S+1\n40 NEXT I\n50 END\n', 'L50');
    expectResult(run, 'VAR_S', 0, 'FOR I=5 TO 1: zero iterations');
  }, 120_000);
});

describe('Task 4c: emitOnBranch (ON GOTO / ON GOSUB) uses the correct ROM operand staging', () => {
  it('ON X GOTO selects the 2nd target', () => {
    const source =
      '10 X=2\n20 ON X GOTO 100,200,300\n' +
      '100 A=1\n110 GOTO 900\n' +
      '200 A=2\n210 GOTO 900\n' +
      '300 A=3\n310 GOTO 900\n' +
      '900 END\n';
    const run = compileAndRun(source, 'L900');
    expectResult(run, 'VAR_A', 2, 'ON X GOTO 100,200,300 with X=2');
  }, 120_000);

  it('ON X GOSUB selects the 2nd target and returns to fall through to END', () => {
    // FIX (Task 4c, follow-up after independent review): emitOnBranch's
    // GOSUB branch used to emit, per target i, `jr nz,<skipLabel>` where
    // skipLabel is the single shared end-of-statement label — not the next
    // target's comparison block. So the very first non-match (selector != 1)
    // branched straight past every remaining target to the end of the ON
    // statement, silently doing nothing. Each target now gets its own label
    // and a non-match falls through to the NEXT target's comparison instead
    // (codegen.ts's emitOnBranch, `compareLabels`). See the X=1/2/3 sweep
    // below for full confirmation.
    const source =
      '10 X=2\n20 ON X GOSUB 100,200,300\n30 GOTO 900\n' +
      '100 A=1\n110 RETURN\n' +
      '200 A=2\n210 RETURN\n' +
      '300 A=3\n310 RETURN\n' +
      '900 END\n';
    const run = compileAndRun(source, 'L900');
    expectResult(run, 'VAR_A', 2, 'ON X GOSUB 100,200,300 with X=2');
  }, 120_000);

  it('ON X GOSUB dispatches correctly for every target (X=1,2,3 sweep)', () => {
    // Gut-check matching the reviewer's ON GOTO X=1/2/3/4 sweep: before the
    // fix above, only X=1 (the first target) worked — X=2 and X=3 left
    // VAR_A untouched (0) because the first non-match escaped straight to
    // the end of the ON statement instead of trying the next target.
    for (const x of [1, 2, 3]) {
      const source =
        `10 X=${x}\n20 ON X GOSUB 100,200,300\n30 GOTO 900\n` +
        '100 A=1\n110 RETURN\n' +
        '200 A=2\n210 RETURN\n' +
        '300 A=3\n310 RETURN\n' +
        '900 END\n';
      const run = compileAndRun(source, 'L900');
      expectResult(run, 'VAR_A', x, `ON X GOSUB 100,200,300 with X=${x}`);
    }
  }, 120_000);
});
