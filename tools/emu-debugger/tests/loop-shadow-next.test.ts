// Task 4 acceptance test — proves NEXT's shadowed tail works on the real CPU.
//
// Three separate things are pinned here, because each can fail independently:
//
//   1. The NATIVE SIGNED COMPARISON's condition codes. adwSbw_88 in
//      src/emulator/exec.ts is an unsigned unit -- C comes from
//      `(y >>> 0) > 0xFFFF` and setFlagsW sets Z_bit when the result is
//      NON-zero. There is no sign flag and no overflow flag. Nothing about
//      emitComparisonBranch's `<=` (a BCD *byte* test on an FP_SUB result)
//      transfers, so the bias-then-`sbcw` sequence is measured directly over a
//      matrix that crosses zero, the int16 ends, and the unsigned/signed
//      disagreement region -- not inferred from the mnemonic.
//
//   2. The SIGNED-OVERFLOW detector. `FOR K=1 TO 32767` steps its counter to
//      32768, which int16 cannot hold; the add's own C flag does not fire
//      there (0x7FFF + 1 produces no unsigned carry), so without a separate
//      test the native tail would wrap to -32768 and loop forever.
//
//   3. The whole tail END TO END, by reading VAR_K's real BCD bytes and the
//      real shadow slots out of emulator RAM after a compiled program has run.
//
// The first two run as one spliced program each (a matrix per run) rather than
// one program per case: an EmulatorSession run costs far more than the handful
// of instructions being measured.

import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { numberToBcd9 } from '../../compiler/bcd.js';
import type { AsmLine } from '../../compiler/asm-types.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv } from '../../../src/emulator/def.js';

const ORIGIN = 0x1CD0;

function hex(bytes: Uint8Array | number[]): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

/** `&H` literal for a 16-bit value, negatives folded into two's complement. */
function w(n: number): string {
  return '&H' + (((n < 0 ? n + 0x10000 : n) & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'));
}

function b(n: number): string {
  return '&H' + (n & 0xFF).toString(16).toUpperCase().padStart(2, '0');
}

/**
 * Run a spliced instruction sequence inside a real compiled program and return
 * the RESULTS buffer it wrote.
 *
 * `10 B=A / 20 END` is the smallest host program with a well-defined splice
 * point (between the accumulator load and the store) and a label to break on.
 * A `db` buffer is appended so the sequence has somewhere to record one byte
 * per case; the spliced code reaches it exactly the way compiled code reaches
 * any variable, through `ldw $2,LABEL` + `pre ix,$2` (this CPU has no
 * direct-absolute memory operand -- see the emitShadow* doc comment in
 * codegen.ts).
 */
function runProbe(spliced: AsmLine[], resultCount: number): Uint8Array {
  const lines: AsmLine[] = generate(parse('10 B=A\n20 END\n')).lines;
  const loadEnd = lines.findIndex(l => l.mnemonic === 'ld' && l.operands === '$18,(ix+&H08)');
  expect(loadEnd, 'accumulator load tail not found in the compiled program').toBeGreaterThan(0);
  lines.splice(loadEnd + 1, 0, ...spliced);
  lines.push({
    label: 'PROBE_RESULTS',
    mnemonic: 'db',
    operands: new Array(resultCount).fill('&HEE').join(','), // 0xEE = "never written"
  });

  const assembled = assemble(lines);
  const addressOf = (name: string): number => {
    const entry = assembled.symbols.find(s => s.name === name);
    if (!entry) throw new Error(`symbol ${name} not found`);
    return entry.address;
  };

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(ORIGIN, assembled.binary);
  setUa(0x55);
  setDelayedUa(0x55);
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf('L20'));

  const result = sess.run({ maxCycles: 5_000_000 });
  expect(result.reason).toBe('breakpoint');
  return sess.getMemory(addressOf('PROBE_RESULTS'), resultCount);
}

/** Record the byte in `$4` into slot `i` of the probe buffer. */
function record(i: number): AsmLine[] {
  return [
    { mnemonic: 'ldw', operands: '$2,PROBE_RESULTS' },
    { mnemonic: 'pre', operands: 'ix,$2' },
    { mnemonic: 'st',  operands: `$4,(ix+${b(i)})` },
  ];
}

// ---------------------------------------------------------------------------
// 1. Native signed 16-bit `<=` — the exact sequence emitShadowedNextTail emits
// ---------------------------------------------------------------------------

/** Every pair that has ever tripped up a naive signed/unsigned compare. */
const COMPARE_CASES: Array<[number, number]> = [
  [0, 0], [1, 0], [0, 1],
  [5, 10], [10, 10], [11, 10],
  [-1, 0], [0, -1], [-1, -1], [-2, -1], [-1, -2],
  // sign-crossing: unsigned order says the opposite of signed order here
  [-1, 1], [1, -1], [-32768, 32767], [32767, -32768],
  // int16 ends
  [32766, 32767], [32767, 32767], [-32768, -32768], [-32767, -32768],
  // high-bit-set values that are NOT adjacent, to catch a half-applied bias
  [-100, 100], [100, -100], [-30000, 30000], [30000, -30000],
];

describe('native signed 16-bit <= (bias + sbcw) on the real CPU', () => {
  it('matches JavaScript signed <= across the sign-crossing matrix', () => {
    const spliced: AsmLine[] = [];
    COMPARE_CASES.forEach(([counter, limit], i) => {
      const trueLbl = `PRB_T${i}`;
      const doneLbl = `PRB_D${i}`;
      spliced.push(
        { mnemonic: 'ldw',  operands: `$6,${w(limit)}` },   // $6/$7 = limit
        { mnemonic: 'ldw',  operands: `$0,${w(counter)}` }, // $0/$1 = counter
        // --- verbatim from emitShadowedNextTail ---
        { mnemonic: 'ldw',  operands: '$8,$0' },
        { mnemonic: 'xr',   operands: '$9,&H80' },
        { mnemonic: 'xr',   operands: '$7,&H80' },
        { mnemonic: 'sbcw', operands: '$8,$6' },
        { mnemonic: 'ld',   operands: '$4,&H00' }, // ld_42 sets no flags
        { mnemonic: 'jr',   operands: `c,${trueLbl}` },
        { mnemonic: 'jr',   operands: `z,${trueLbl}` },
        { mnemonic: 'jr',   operands: doneLbl },
        { label: trueLbl, mnemonic: 'ld', operands: '$4,&H01' },
        { label: doneLbl },
        ...record(i),
      );
    });

    const got = runProbe(spliced, COMPARE_CASES.length);
    const decoded = COMPARE_CASES.map(([c, l], i) => `${c}<=${l} -> ${got[i]}`);
    const want = COMPARE_CASES.map(([c, l]) => `${c}<=${l} -> ${c <= l ? 1 : 0}`);
    expect(decoded).toEqual(want);
  }, 60_000);

  it('leaves the unbiased counter intact in $0/$1 for the exit re-sync', () => {
    // The compare biases a COPY ($8/$9). If it biased $0/$1 instead, the
    // INT16_TO_BCD on the exit path would encode counter ^ 0x8000.
    const spliced: AsmLine[] = [
      { mnemonic: 'ldw',  operands: `$6,${w(7)}` },
      { mnemonic: 'ldw',  operands: `$0,${w(-1234)}` },
      { mnemonic: 'ldw',  operands: '$8,$0' },
      { mnemonic: 'xr',   operands: '$9,&H80' },
      { mnemonic: 'xr',   operands: '$7,&H80' },
      { mnemonic: 'sbcw', operands: '$8,$6' },
      { mnemonic: 'ld',   operands: '$4,$0' },
      ...record(0),
      { mnemonic: 'ld',   operands: '$4,$1' },
      ...record(1),
    ];
    const got = runProbe(spliced, 2);
    expect(got[0]! | (got[1]! << 8)).toBe(-1234 + 0x10000);
  }, 60_000);
});

// ---------------------------------------------------------------------------
// 2. Signed-overflow detection on the native step
// ---------------------------------------------------------------------------

const OVERFLOW_CASES: Array<[number, number]> = [
  [0, 1], [1, 1], [-1, 1], [-1, -1],
  [32766, 1], [32767, 1],          // the FOR K=1 TO 32767 case
  [32767, 2], [32000, 1000],
  [-32768, -1], [-32767, -1],      // downward, for completeness
  [30000, 30000], [-30000, -30000],
  [32767, -1], [-32768, 1],        // opposite signs: can never overflow
];

describe('signed-overflow detection on the native step', () => {
  it('flags exactly the adds whose true sum leaves int16 range', () => {
    const spliced: AsmLine[] = [];
    OVERFLOW_CASES.forEach(([counter, step], i) => {
      const noOvf = `OVF_N${i}`;
      const ovf   = `OVF_Y${i}`;
      const done  = `OVF_D${i}`;
      spliced.push(
        { mnemonic: 'ldw', operands: `$4,${w(step)}` },
        { mnemonic: 'ldw', operands: `$0,${w(counter)}` },
        // --- verbatim from emitShadowedNextTail ---
        { mnemonic: 'ld',  operands: '$8,$1' },
        { mnemonic: 'ld',  operands: '$9,$1' },
        { mnemonic: 'adw', operands: '$0,$4' },
        { mnemonic: 'xr',  operands: '$8,$5' },
        { mnemonic: 'xr',  operands: '$9,$1' },
        { mnemonic: 'anc', operands: '$8,&H80' },
        { mnemonic: 'jr',  operands: `nz,${noOvf}` },
        { mnemonic: 'anc', operands: '$9,&H80' },
        { mnemonic: 'jr',  operands: `nz,${ovf}` },
        { label: noOvf, mnemonic: 'ld', operands: '$4,&H00' },
        { mnemonic: 'jr', operands: done },
        { label: ovf, mnemonic: 'ld', operands: '$4,&H01' },
        { label: done },
        ...record(i),
      );
    });

    const got = runProbe(spliced, OVERFLOW_CASES.length);
    const decoded = OVERFLOW_CASES.map(([c, s], i) => `${c}+${s} -> ${got[i]}`);
    const want = OVERFLOW_CASES.map(([c, s]) => {
      const sum = c + s;
      return `${c}+${s} -> ${sum > 32767 || sum < -32768 ? 1 : 0}`;
    });
    expect(decoded).toEqual(want);
  }, 60_000);

  it('recovers the pre-step counter exactly with `sbw $0,$4` after a wrapping add', () => {
    // The overflow path re-syncs BCD from the value BEFORE the step, which it
    // gets by undoing the add. Two's complement makes that exact even though
    // the add itself wrapped.
    const spliced: AsmLine[] = [
      { mnemonic: 'ldw', operands: `$4,${w(1)}` },
      { mnemonic: 'ldw', operands: `$0,${w(32767)}` },
      { mnemonic: 'adw', operands: '$0,$4' },   // -> 0x8000
      { mnemonic: 'sbw', operands: '$0,$4' },   // -> 0x7FFF again
      { mnemonic: 'ld',  operands: '$4,$0' },
      ...record(0),
      { mnemonic: 'ld',  operands: '$4,$1' },
      ...record(1),
    ];
    const got = runProbe(spliced, 2);
    expect(got[0]! | (got[1]! << 8)).toBe(32767);
  }, 60_000);
});

// ---------------------------------------------------------------------------
// 3. End to end — compile a whole BASIC program, run it, read real memory
// ---------------------------------------------------------------------------

interface LoopRun {
  reason: string;
  instructions: number;
  bcd(name: string): Uint8Array;
  int16(label: string): number;
  byte(label: string): number;
  has(label: string): boolean;
}

/**
 * Compile `basic`, run it to the label `breakAt`, and expose its memory.
 *
 * The accessors read LIVE emulator state, which is module-global: constructing
 * the next EmulatorSession invalidates them. Read everything you need from one
 * run before starting the next.
 */
function runLoop(basic: string, breakAt: string, maxCycles = 60_000_000): LoopRun {
  const assembled = assemble(generate(parse(basic)).lines);
  const addressOf = (name: string): number => {
    const entry = assembled.symbols.find(s => s.name === name);
    if (!entry) throw new Error(`symbol ${name} not found`);
    return entry.address;
  };

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(ORIGIN, assembled.binary);
  // MODE110 on hardware sets UA=0x55, which puts the fetch segment in Bank 1
  // RAM and makes `ua >> 4` (the IX data segment) point at RAM too.
  setUa(0x55);
  setDelayedUa(0x55);
  // Module-global emulator state: a previous session can leave ISERV latched,
  // which forces segment 0 on every fetch and runs ROM instead of this program.
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf(breakAt));

  const result = sess.run({ maxCycles });
  return {
    reason: result.reason,
    instructions: result.instructionsExecuted,
    bcd: (name) => sess.getMemory(addressOf(`VAR_${name}`), 9),
    int16: (label) => {
      const raw = sess.getMemory(addressOf(label), 2);
      const v = raw[0]! | (raw[1]! << 8);
      return v >= 0x8000 ? v - 0x10000 : v;
    },
    byte: (label) => sess.getMemory(addressOf(label), 1)[0]!,
    has: (label) => assembled.symbols.some(s => s.name === label),
  };
}

describe('shadowed NEXT, end to end on the real CPU', () => {
  it('runs a 100-iteration loop natively and re-syncs VAR_K once, at exit', () => {
    // The body never touches K, so this isolates NEXT's own tail: whatever K
    // ends up as came entirely from the native step + compare + exit re-sync.
    const run = runLoop('10 S=0\n20 FOR K=1 TO 100\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');

    // Loop ran exactly 100 times.
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(100)));
    // BASIC leaves the counter one step past the limit after a normal exit.
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(101)));

    // Proof the NATIVE tail is what ran: the BCD tail never touches the shadow
    // slots, so a shadow counter of 101 can only have come from `adw`/`stw`.
    expect(run.int16('SHADOW_K_CNT')).toBe(101);
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
  }, 120_000);

  it('honours an explicit STEP', () => {
    const run = runLoop('10 S=0\n20 FOR K=0 TO 20 STEP 2\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(11)));  // 0,2,...,20
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(22)));  // one step past
    expect(run.int16('SHADOW_K_CNT')).toBe(22);
  }, 120_000);

  it('runs a single-iteration loop (counter already equal to the limit)', () => {
    const run = runLoop('10 S=0\n20 FOR K=7 TO 7\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(1)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(8)));
  }, 120_000);

  it('handles a loop that crosses zero', () => {
    const run = runLoop('10 S=0\n20 FOR K=0-5 TO 5\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(11)));  // -5..5
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(6)));
    expect(run.int16('SHADOW_K_CNT')).toBe(6);
  }, 120_000);

  it('terminates at the top of int16 range instead of wrapping into an endless loop', () => {
    // 32767 + 1 does not fit. The native tail detects the signed overflow,
    // re-syncs VAR_K to the pre-step value, clears SHADOW_ACTIVE and lets the
    // BCD tail finish the job -- so the answer is the unlimited-range BCD one.
    const run = runLoop('10 S=0\n20 FOR K=32765 TO 32767\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(3)));      // 32765, 32766, 32767
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(32768))); // BCD range, not int16
    // The overflow handler turned shadowing off on its way out.
    expect(run.byte('SHADOW_K_ACT')).toBe(0);
  }, 120_000);

  it('falls back to the BCD tail when a bound did not decode at run time', () => {
    // 40000 is an integer literal, so the loop is statically shadow-eligible;
    // only BCD_TO_INT16's $9 status catches the magnitude, and only at run
    // time. Six iterations keeps the BCD path cheap enough to simulate.
    const run = runLoop('10 S=0\n20 FOR K=40000 TO 40005\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(0);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(6)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(40006)));
  }, 120_000);

  it('leaves a statically disqualified loop entirely on the BCD path', () => {
    // `PRINT K` consumes the counter as BCD, so Task 2's scan refuses to
    // shadow this loop at all -- no slots, no runtime test, no native tail.
    const run = runLoop('10 S=0\n20 FOR K=1 TO 5\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    const shadowedK = hex(run.bcd('K')); // read before the next session resets RAM

    const plain = runLoop('10 S=0\n20 FOR K=1 TO 5\n30 PRINT K\n40 NEXT K\n50 END\n', 'L50');
    expect(plain.has('SHADOW_K_CNT')).toBe(false);
    expect(plain.reason).toBe('breakpoint');
    expect(hex(plain.bcd('K'))).toBe(shadowedK); // same final counter either way
    expect(shadowedK).toBe(hex(numberToBcd9(6)));
  }, 120_000);

  it('closes two sequential loops driven by the same counter', () => {
    const run = runLoop(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 NEXT K\n50 FOR K=1 TO 4\n60 S=S+1\n70 NEXT K\n80 END\n',
      'L80',
    );
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(14)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(5)));  // second loop's exit value
    expect(run.int16('SHADOW_K_CNT')).toBe(5);
  }, 120_000);

  it('closes both loops of a `NEXT J,I`', () => {
    // emitNext loops over its variable list, so a shadowed loop's tail is
    // emitted once per name -- and the shadow bookkeeping has to close the
    // right loop each time.
    const run = runLoop(
      '10 S=0\n20 FOR I=1 TO 3\n30 FOR J=1 TO 4\n40 S=S+1\n50 NEXT J,I\n60 END\n', 'L60',
    );
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(12)));
    expect(hex(run.bcd('I'))).toBe(hex(numberToBcd9(4)));
    expect(hex(run.bcd('J'))).toBe(hex(numberToBcd9(5)));
  }, 120_000);

  it('closes the innermost loop for a bare NEXT', () => {
    const run = runLoop('10 S=0\n20 FOR I=1 TO 5\n30 S=S+1\n40 NEXT\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(5)));
    expect(hex(run.bcd('I'))).toBe(hex(numberToBcd9(6)));
  }, 120_000);

  it('costs materially fewer instructions per iteration than the BCD tail', () => {
    // Not a micro-benchmark, just proof the fast path is actually being taken:
    // the same loop shape, shadowed vs. statically disqualified, over the same
    // iteration count. The disqualified one keeps a ROM FP_ADD and an FP_SUB
    // per iteration; the shadowed one has neither.
    const fast = runLoop('10 S=0\n20 FOR K=1 TO 60\n30 S=S+1\n40 NEXT K\n50 END\n', 'L50');
    const slow = runLoop('10 S=0\n20 DIM A(2)\n21 FOR K=1 TO 60\n30 S=S+1\n35 A(1)=K\n40 NEXT K\n50 END\n', 'L50');
    expect(fast.reason).toBe('breakpoint');
    expect(slow.reason).toBe('breakpoint');
    expect(fast.instructions).toBeLessThan(slow.instructions);
  }, 180_000);
});

// ---------------------------------------------------------------------------
// 4. A shadowed loop whose body still reads the counter
// ---------------------------------------------------------------------------
//
// Full amortization means VAR_K is stale between the FOR and the NEXT. That is
// invisible for a body that never reads K -- every case above -- but NOT for
// one that does, and the static scan deliberately permits `S=S+K`, because
// Task 5 is meant to serve that read from the int16 slot rather than from
// VAR_K. Until Task 5 lands, the read still goes through VAR_K, so NEXT's
// native tail re-encodes the counter each iteration for exactly those loops
// (codegen.ts, OpenShadowLoop.bcdCounterRead).
//
// The task brief asserted this case would "still be CORRECT" with Task 4 alone
// and no such handling. It would not have been: without the per-iteration
// encode this program yields 100 (a hundred additions of the loop's initial
// K=1), and the pre-existing task4b/task4c acceptance tests, which use exactly
// this shape, fail.
describe('a shadowed loop whose body still reads the counter as BCD', () => {
  it('sums FOR K=1 TO 100 : S=S+K : NEXT K to 5050', () => {
    const run = runLoop('10 S=0\n20 FOR K=1 TO 100\n30 S=S+K\n40 NEXT K\n50 END\n', 'L50');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(5050)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(101)));
    expect(run.int16('SHADOW_K_CNT')).toBe(101); // still the native tail
  }, 120_000);

  it('keeps a GOSUB\'d subroutine\'s view of the counter correct', () => {
    // A GOSUB target is emitted outside the loop, so "does anything read
    // VAR_K?" cannot be answered by watching the body alone -- GOSUB is
    // treated as an unobservable read.
    const run = runLoop(
      '10 S=0\n20 FOR K=1 TO 10\n30 GOSUB 100\n40 NEXT K\n50 END\n100 S=S+K\n110 RETURN\n',
      'L50',
    );
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(55)));
  }, 120_000);

  it('is still cheaper per iteration than the BCD tail it replaced', () => {
    const shadowed = runLoop('10 S=0\n20 FOR K=1 TO 60\n30 S=S+K\n40 NEXT K\n50 END\n', 'L50');
    const plain = runLoop(
      '10 S=0\n20 DIM A(2)\n21 FOR K=1 TO 60\n30 S=S+K\n35 A(1)=1\n40 NEXT K\n50 END\n', 'L50',
    );
    expect(shadowed.reason).toBe('breakpoint');
    expect(plain.reason).toBe('breakpoint');
    expect(shadowed.instructions).toBeLessThan(plain.instructions);
  }, 180_000);
});
