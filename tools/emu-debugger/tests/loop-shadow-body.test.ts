// Task 5 acceptance test — proves shadow-aware in-body operand resolution works
// on the real CPU.
//
// Three separate things are pinned here, each able to fail independently:
//
//   1. The SIGNED-OVERFLOW detector for the native `sbw`. Task 4 verified the
//      one for `adw`; subtraction's rule is the OTHER way round (overflow needs
//      operands of DIFFERENT sign), so nothing transfers and it is measured
//      here rather than reasoned about.
//
//   2. The six relational operators' CONDITION CODES on the biased native
//      compare. Task 4 verified `<=` only, as one fused test; `=`, `<>`, `<`,
//      `>`, `>=` each map to a different `jr` and are measured over the same
//      sign-crossing matrix.
//
//   3. The whole feature END TO END, by reading real BCD bytes and real shadow
//      slots out of emulator RAM after a compiled program has run — including
//      the case the plan's Global Constraints call out as the dangerous one:
//      a native overflow inside an ACTIVE shadow, where reloading VAR_K's
//      (stale by design) memory would give a different, wrong answer.
//
// The probe harness is the one loop-shadow-next.test.ts introduced, copied
// rather than imported: importing another test file would run its suites too.

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
 * the RESULTS buffer it wrote. See loop-shadow-next.test.ts for the full
 * rationale; `10 B=A / 20 END` is the smallest host program with a well-defined
 * splice point and a label to break on.
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
// 1. Signed-overflow detection on a native `sbw`
// ---------------------------------------------------------------------------
//
// Subtraction overflows only when the operands have DIFFERENT signs and the
// result takes the sign of the subtrahend -- the mirror image of the add rule
// Task 4 verified, so `jr z` and `jr nz` swap places on the first test.

const SUB_OVERFLOW_CASES: Array<[number, number]> = [
  [0, 0], [1, 1], [0, 1], [1, -1], [-1, 1],
  [32767, -1], [32767, -2], [32766, -1],       // positive - negative -> too big
  [-32768, 1], [-32767, 1], [-32768, 2],       // negative - positive -> too small
  [-1, 32767], [1, -32768], [-32768, -1],      // sign-crossing corners
  [30000, -30000], [-30000, 30000],
  [32767, 1], [-32768, -2], [100, 50], [-100, -50],
];

describe('signed-overflow detection on a native int16 subtract', () => {
  it('flags exactly the subtractions whose true difference leaves int16 range', () => {
    const spliced: AsmLine[] = [];
    SUB_OVERFLOW_CASES.forEach(([left, right], i) => {
      const noOvf = `SUB_N${i}`;
      const ovf   = `SUB_Y${i}`;
      const done  = `SUB_D${i}`;
      spliced.push(
        { mnemonic: 'ldw', operands: `$4,${w(right)}` },
        { mnemonic: 'ldw', operands: `$0,${w(left)}` },
        // --- the sequence emitShadowAwareBinaryExpr emits for `-` ---
        { mnemonic: 'ld',  operands: '$8,$1' },
        { mnemonic: 'ld',  operands: '$9,$1' },
        { mnemonic: 'sbw', operands: '$0,$4' },
        { mnemonic: 'xr',  operands: '$8,$5' },
        { mnemonic: 'xr',  operands: '$9,$1' },
        { mnemonic: 'anc', operands: '$8,&H80' },
        { mnemonic: 'jr',  operands: `z,${noOvf}` },   // SAME signs -> cannot overflow
        { mnemonic: 'anc', operands: '$9,&H80' },
        { mnemonic: 'jr',  operands: `nz,${ovf}` },
        { label: noOvf, mnemonic: 'ld', operands: '$4,&H00' },
        { mnemonic: 'jr', operands: done },
        { label: ovf, mnemonic: 'ld', operands: '$4,&H01' },
        { label: done },
        ...record(i),
      );
    });

    const got = runProbe(spliced, SUB_OVERFLOW_CASES.length);
    const decoded = SUB_OVERFLOW_CASES.map(([l, r], i) => `${l}-${r} -> ${got[i]}`);
    const want = SUB_OVERFLOW_CASES.map(([l, r]) => {
      const d = l - r;
      return `${l}-${r} -> ${d > 32767 || d < -32768 ? 1 : 0}`;
    });
    expect(decoded).toEqual(want);
  }, 60_000);
});

// ---------------------------------------------------------------------------
// 2. The six relational operators on the biased native compare
// ---------------------------------------------------------------------------

const CMP_CASES: Array<[number, number]> = [
  [0, 0], [1, 0], [0, 1],
  [5, 10], [10, 10], [11, 10],
  [-1, 0], [0, -1], [-1, -1], [-2, -1], [-1, -2],
  [-1, 1], [1, -1], [-32768, 32767], [32767, -32768],
  [32766, 32767], [32767, 32767], [-32768, -32768],
  [-100, 100], [100, -100], [-30000, 30000], [30000, -30000],
];

/**
 * The branch sequence emitNativeComparisonBranch emits, mirrored here. Falls
 * through when the relation HOLDS and branches to `falseLbl` when it does not,
 * which is emitCondition's own contract.
 */
function compareBranches(op: string, falseLbl: string, trueLbl: string): AsmLine[] {
  switch (op) {
    case '=':  return [{ mnemonic: 'jr', operands: `nz,${falseLbl}` }];
    case '<>': return [{ mnemonic: 'jr', operands: `z,${falseLbl}` }];
    case '<':  return [{ mnemonic: 'jr', operands: `nc,${falseLbl}` }];
    case '>=': return [{ mnemonic: 'jr', operands: `c,${falseLbl}` }];
    case '>':  return [
      { mnemonic: 'jr', operands: `c,${falseLbl}` },
      { mnemonic: 'jr', operands: `z,${falseLbl}` },
    ];
    case '<=': return [
      { mnemonic: 'jr', operands: `c,${trueLbl}` },
      { mnemonic: 'jr', operands: `z,${trueLbl}` },
      { mnemonic: 'jr', operands: falseLbl },
      { label: trueLbl },
    ];
    default: throw new Error(`unhandled op ${op}`);
  }
}

const RELATIONS: Record<string, (a: number, bb: number) => boolean> = {
  '=':  (a, x) => a === x,
  '<>': (a, x) => a !== x,
  '<':  (a, x) => a < x,
  '>':  (a, x) => a > x,
  '<=': (a, x) => a <= x,
  '>=': (a, x) => a >= x,
};

describe('native signed 16-bit relational operators on the real CPU', () => {
  for (const op of Object.keys(RELATIONS)) {
    it(`matches JavaScript for \`${op}\` across the sign-crossing matrix`, () => {
      const spliced: AsmLine[] = [];
      CMP_CASES.forEach(([left, right], i) => {
        const falseLbl = `CMPF_${i}`;
        const trueLbl  = `CMPT_${i}`;
        spliced.push(
          { mnemonic: 'ldw',  operands: `$6,${w(right)}` },
          { mnemonic: 'ldw',  operands: `$0,${w(left)}` },
          // --- the biased signed compare Task 4 verified ---
          { mnemonic: 'ldw',  operands: '$8,$0' },
          { mnemonic: 'xr',   operands: '$9,&H80' },
          { mnemonic: 'xr',   operands: '$7,&H80' },
          { mnemonic: 'sbcw', operands: '$8,$6' },
          { mnemonic: 'ld',   operands: '$4,&H00' }, // ld_42 sets no flags
          ...compareBranches(op, falseLbl, trueLbl),
          { mnemonic: 'ld',   operands: '$4,&H01' }, // fell through => relation holds
          { label: falseLbl },
          ...record(i),
        );
      });

      const got = runProbe(spliced, CMP_CASES.length);
      const decoded = CMP_CASES.map(([l, r], i) => `${l}${op}${r} -> ${got[i]}`);
      const want = CMP_CASES.map(([l, r]) => `${l}${op}${r} -> ${RELATIONS[op]!(l, r) ? 1 : 0}`);
      expect(decoded).toEqual(want);
    }, 60_000);
  }
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

describe('shadow-aware in-body operands, end to end on the real CPU', () => {
  it('evaluates `IF K+K>N` correctly on every iteration of a 100-iteration loop', () => {
    const run = runLoop(
      '10 N=100\n20 S=0\n30 FOR K=1 TO N\n40 IF K+K>N THEN GOTO 60\n50 S=S+1\n60 NEXT K\n70 END\n',
      'L70',
    );
    expect(run.reason).toBe('breakpoint');
    // 2K <= 100 holds for K = 1..50 and fails for K = 51..100. Getting any
    // single iteration wrong moves this count.
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(50)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(101)));
    // SHADOW_K_ACT = 1 proves the NATIVE branch is what the body took: the
    // not-active branch is only reachable with this flag at 0.
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
    expect(run.int16('SHADOW_K_CNT')).toBe(101);
  }, 180_000);

  it('gives the right counter value in the body on every single iteration', () => {
    // Two accumulators over the same loop: T sums K unconditionally (so a
    // counter that is right only at the boundary shows up immediately), S sums
    // K only while 2K <= N (so the predicate is checked per iteration too).
    const run = runLoop(
      '10 N=10\n20 S=0\n30 T=0\n40 FOR K=1 TO N\n50 T=T+K\n60 IF K+K>N THEN GOTO 80\n'
      + '70 S=S+K\n80 NEXT K\n90 END\n',
      'L90',
    );
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(55)));  // 1+..+10
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(15)));  // 1+..+5
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
  }, 120_000);

  it('handles a native `-` with the counter on either side', () => {
    const run = runLoop(
      '10 A=0\n20 B=0\n30 FOR K=1 TO 5\n40 A=A+(K-1)\n50 B=B+(10-K)\n60 NEXT K\n70 END\n',
      'L70',
    );
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('A'))).toBe(hex(numberToBcd9(0 + 1 + 2 + 3 + 4)));   // K-1, counter left
    expect(hex(run.bcd('B'))).toBe(hex(numberToBcd9(9 + 8 + 7 + 6 + 5)));   // 10-K, counter right
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
  }, 120_000);

  it('compares the counter natively, with the counter on either side', () => {
    const gt = runLoop(
      '10 S=0\n20 FOR K=1 TO 6\n30 IF K>3 THEN GOTO 50\n40 S=S+K\n50 NEXT K\n60 END\n', 'L60',
    );
    expect(gt.reason).toBe('breakpoint');
    expect(hex(gt.bcd('S'))).toBe(hex(numberToBcd9(1 + 2 + 3)));
    expect(gt.byte('SHADOW_K_ACT')).toBe(1);

    // The mirrored form exercises the operand swap in emitShadowNativeOperands.
    const lt = runLoop(
      '10 S=0\n20 FOR K=1 TO 6\n30 IF 3<K THEN GOTO 50\n40 S=S+K\n50 NEXT K\n60 END\n', 'L60',
    );
    expect(lt.reason).toBe('breakpoint');
    expect(hex(lt.bcd('S'))).toBe(hex(numberToBcd9(1 + 2 + 3)));
  }, 120_000);

  // -- the three ways the native path has to hand back to BCD -----------------

  it('SHADOW_ACTIVE = 0: the body falls back to BCD and never reads the slot', () => {
    // 40000 is an integer literal, so the loop is statically shadow-eligible;
    // only BCD_TO_INT16's runtime status catches the magnitude. emitFor stores
    // the FAILED decode into the slot before testing that status, so the slot
    // holds garbage here -- a body that read it would produce a wildly wrong S,
    // not a subtly wrong one.
    const run = runLoop(
      '10 S=0\n20 FOR K=40000 TO 40005\n30 S=S+K\n40 NEXT K\n50 END\n', 'L50',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(0);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(40000 + 40001 + 40002 + 40003 + 40004 + 40005)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(40006)));
  }, 120_000);

  it('an arithmetic shape the heuristic excludes still computes correctly', () => {
    // `S=S+K` has a VARIABLE other operand, so emitBinaryExpr deliberately
    // leaves it on the BCD path (decoding S costs more than the ROM `+` it
    // would replace -- measured). That read of VAR_K is what sets
    // bcdCounterRead, so NEXT keeps the counter current every iteration; a
    // broken sync would give 100000+1+1+1 = 100003 instead.
    const run = runLoop(
      '10 S=100000\n20 FOR K=1 TO 3\n30 S=S+K\n40 NEXT K\n50 END\n', 'L50',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(1);          // shadowing really was on
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(100006)));
    expect(hex(run.bcd('S'))).not.toBe(hex(numberToBcd9(100003))); // the stale-VAR_K answer
  }, 120_000);

  it('the native op overflows int16: falls back with a CURRENT counter', () => {
    // K+K leaves int16 range once K > 16383. The loop itself stays in range, so
    // SHADOW_ACTIVE is 1 throughout and VAR_K is stale by design -- recovering
    // the overflowed `K+K` from VAR_K would use the loop's initial 16380 for
    // both overflowing iterations.
    //
    //   correct : 2*(16380+16381+16382+16383+16384+16385) = 196590
    //   stale   : 196590 - (32768-32760) - (32770-32760)  = 196572
    const run = runLoop(
      '10 S=0\n20 FOR K=16380 TO 16385\n30 S=S+(K+K)\n40 NEXT K\n50 END\n', 'L50',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(196590)));
    expect(hex(run.bcd('S'))).not.toBe(hex(numberToBcd9(196572))); // the stale-VAR_K answer
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(16386)));
  }, 120_000);

  it('keeps VAR_K current when the OTHER operand reads the counter through BCD', () => {
    // `K > (K*2)`: the left K is served from the slot, but `*` has no native
    // form here, so the right-hand K is a real BCD read of VAR_K -- emitted
    // inside the ACTIVE branch. Its `bcdCounterRead` hook must still fire (only
    // the not-active branch's reads are exempt), or NEXT skips the per-iteration
    // sync and every iteration compares against the loop's INITIAL counter.
    //
    //   correct        : K > 2K is false for all K=1..4         -> S = 4
    //   over-suppressed: 2*1 = 2, so K > 2 holds for K = 3, 4   -> S = 2
    const run = runLoop(
      '10 S=0\n20 FOR K=1 TO 4\n30 IF K>(K*2) THEN GOTO 50\n40 S=S+1\n50 NEXT K\n60 END\n', 'L60',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(4)));
    expect(hex(run.bcd('S'))).not.toBe(hex(numberToBcd9(2)));
  }, 120_000);

  it('the non-decodable operand path also works for a comparison', () => {
    const run = runLoop(
      '10 L=100000\n20 S=0\n30 FOR K=1 TO 4\n40 IF K>L THEN GOTO 60\n50 S=S+K\n60 NEXT K\n70 END\n',
      'L70',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(1 + 2 + 3 + 4))); // K > 100000 never holds
  }, 120_000);

  // -- nesting, in both directions -------------------------------------------

  it('resolves an OUTER shadowed counter from inside an inner DISQUALIFIED loop', () => {
    // `T=J` consumes J as a bare BCD value, disqualifying J's loop; K's loop is
    // untouched by that and its counter is still served from its slot inside
    // J's body.
    const run = runLoop(
      '10 S=0\n20 T=0\n30 FOR K=1 TO 4\n40 FOR J=1 TO 2\n50 T=J\n60 S=S+(K+K)\n'
      + '70 NEXT J\n80 NEXT K\n90 END\n',
      'L90',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.has('SHADOW_K_CNT')).toBe(true);
    expect(run.has('SHADOW_J_CNT')).toBe(false);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(2 * 2 * (1 + 2 + 3 + 4)))); // 2 inner passes x 2K
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(5)));
    expect(hex(run.bcd('J'))).toBe(hex(numberToBcd9(3)));
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(2)));
  }, 120_000);

  it('runs an inner SHADOWED loop inside an outer DISQUALIFIED one', () => {
    const run = runLoop(
      '10 S=0\n20 T=0\n30 FOR K=1 TO 3\n40 T=K\n50 FOR J=1 TO 2\n60 S=S+(J+J)\n'
      + '70 NEXT J\n80 NEXT K\n90 END\n',
      'L90',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.has('SHADOW_J_CNT')).toBe(true);
    expect(run.has('SHADOW_K_CNT')).toBe(false);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(3 * 2 * (1 + 2))));
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(3)));   // outer counter, plain BCD
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(4)));
    expect(hex(run.bcd('J'))).toBe(hex(numberToBcd9(3)));
  }, 120_000);

  // -- GOSUB ------------------------------------------------------------------

  it('keeps a shadowed loop inside a GOSUB\'d subroutine working across the call', () => {
    // The brief asked for "a GOSUB from inside a shadowed loop's body, proving
    // the slots survive the call". That construction cannot show it any more:
    // Task 4's fix takes a loop whose body GOSUBs OFF the fast path entirely
    // (the callee may write the counter), so there would be no live slot left
    // to survive anything. This is the equivalent that still has live slots
    // across a `cal`/`rtn` boundary -- the loop is INSIDE the subroutine, and
    // the caller does its own BCD arithmetic on both sides of the call.
    //
    // Post-Task-6b-review: the entry GOSUB's target (100) is deliberately a
    // no-op line BEFORE the FOR line (105), not the FOR line itself --
    // landing exactly on the FOR line would trip
    // loop-shadow-eligibility.ts's hasExternalJumpIntoSpan (GOSUB is one of
    // the edge kinds it tracks, alongside GOTO) and disqualify the loop
    // outright, which would defeat this test's whole point.
    const run = runLoop(
      '10 S=0\n20 A=7\n30 GOSUB 100\n40 B=A+S\n50 END\n'
      + '100 T=0\n105 FOR K=1 TO 5\n110 S=S+(K+K)\n120 NEXT K\n130 RETURN\n',
      'L50',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(30)));
    expect(hex(run.bcd('B'))).toBe(hex(numberToBcd9(37)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(6)));
  }, 120_000);

  it('still gets the right answer when a body GOSUB unshadows the loop', () => {
    // The other half of the same story: a GOSUB in the body forces the runtime
    // flag to 0, so the body's shadow-aware block takes its not-active branch
    // and reads VAR_K -- which the (unmodified) BCD tail keeps current.
    const run = runLoop(
      '10 S=0\n20 T=0\n30 FOR K=1 TO 5\n40 S=S+K\n50 GOSUB 100\n60 NEXT K\n70 END\n'
      + '100 T=T+1\n110 RETURN\n',
      'L70',
    );
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(0);
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(15)));
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(5)));
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(6)));
  }, 120_000);
});
