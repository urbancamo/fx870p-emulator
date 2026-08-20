// Task 6b acceptance test — proves a GOTO out of a shadowed loop's body forces
// the per-iteration BCD re-sync (markShadowCounterMustBeCurrent), the same
// remedy Task 4 already gave RETURN, on the real CPU.
//
// See loop-shadow-eligibility.ts (condition 4 removed) and codegen.ts's
// `case 'goto':` / `emitOnBranch`.
//
// The probe/runLoop harness is loop-shadow-next.test.ts's, copied rather than
// imported: importing another test file would run its suites too.

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

interface LoopRun {
  reason: string;
  instructions: number;
  bcd(name: string): Uint8Array;
  byte(label: string): number;
  has(label: string): boolean;
}

/**
 * Compile `basic`, run it to the label `breakAt`, and expose its memory. See
 * loop-shadow-next.test.ts for the full rationale -- MODE110's UA=0x55, the
 * module-global ISERV reset, and why accessors must be read before the next
 * EmulatorSession is constructed.
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
  setUa(0x55);
  setDelayedUa(0x55);
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf(breakAt));

  const result = sess.run({ maxCycles });
  return {
    reason: result.reason,
    instructions: result.instructionsExecuted,
    bcd: (name) => sess.getMemory(addressOf(`VAR_${name}`), 9),
    byte: (label) => sess.getMemory(addressOf(label), 1)[0]!,
    has: (label) => assembled.symbols.some(s => s.name === label),
  };
}

function asmLabels(basic: string): string[] {
  return generate(parse(basic)).lines.map(l => l.label).filter(Boolean) as string[];
}

// ---------------------------------------------------------------------------
// 1. PRIMES.BAS-shaped, realistic end to end
// ---------------------------------------------------------------------------
//
// Deliberately mirrors PRIMES.BAS's own hot loop (`110 FOR K=2 TO N-1 / 120 IF
// K+K>N THEN 200 / 130 IF N MOD K=0 THEN 100 / 140 NEXT K`): two `IF ... THEN
// <linenum>` early exits, both jumping past NEXT. `K+K` is a direct fast-path
// operand read BEFORE the jump (Task 5); `T=K` at the landing site is a plain
// BCD read AFTER it, in code codegen has already popped off shadowStack by
// the time it compiles line 210 (it comes after NEXT in program order).
//
// Note this program's `N MOD K` condition ALSO forces `bcdCounterRead` on its
// own, via the pre-existing general "counter read the native path can't
// serve" hook (codegen.ts:701) -- `mod` isn't in NATIVE_BINARY_OPS. That
// mechanism predates this task and isn't what's being tested here; it means
// this program alone would still get the right answer even with the
// `case 'goto':` hook missing. It stays as the concrete, realistic proof that
// the actual target program compiles, stays shadowed, and terminates
// correctly (closing the gap Task 6 found) -- section 2 below is the isolated
// regression test that the GOTO-specific hook, and only it, is responsible
// for.
const TRIAL_DIVISION =
  '10 N=35\n' +
  '20 FOR K=2 TO N-1\n' +
  '30 IF K+K>N THEN 200\n' +
  '40 IF N MOD K=0 THEN 210\n' +
  '50 NEXT K\n' +
  '60 GOTO 220\n' +
  '200 T=0\n' +
  '205 GOTO 220\n' +
  '210 T=K\n' +
  '220 END\n';

describe('a GOTO out of a shadowed loop, end to end on the real CPU (PRIMES.BAS-shaped)', () => {
  it('reports the correct smallest factor of 35 (5, found on the 4th iteration)', () => {
    const run = runLoop(TRIAL_DIVISION, 'L220');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(5)));
    expect(hex(run.bcd('N'))).toBe(hex(numberToBcd9(35)));
  }, 120_000);

  it('keeps the loop on the fast path (SHADOW_K_ACT stays 1) rather than disqualifying it', () => {
    // Task 6b's whole point: a GOTO out of the loop no longer takes it off
    // the fast path entirely (that was condition 4's old, blunter remedy) --
    // it stays shadowed, just with a forced per-iteration sync.
    const run = runLoop(TRIAL_DIVISION, 'L220');
    expect(run.reason).toBe('breakpoint');
    expect(run.byte('SHADOW_K_ACT')).toBe(1);
  }, 120_000);

  it("still serves the pre-GOTO counter read (K+K) through Task 5's native int16 fast path", () => {
    // Compiled-assembly check, same technique Task 5's own tests use: a
    // BODYSHADOW_ label proves `K+K` was resolved through the shadow int16
    // slot rather than decoded from BCD, unaffected by the GOTO fix.
    const labels = asmLabels(TRIAL_DIVISION);
    expect(labels.some(l => l.startsWith('BODYSHADOW_BCD_K'))).toBe(true);
    expect(labels.some(l => l.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Isolated regression test -- the GOTO hook, and only it, matters here
// ---------------------------------------------------------------------------
//
// Unlike section 1, this body never reads K at all before the GOTO (the exit
// condition is driven by an unrelated counter S, exactly the shape
// loop-shadow-next.test.ts's own RETURN acceptance test uses) -- so nothing
// OTHER than `case 'goto':`'s markShadowCounterMustBeCurrent() call can be
// responsible for keeping VAR_K current. Manually confirmed by temporarily
// commenting out that one call: this program's assembly then carries NO
// NEXTSHADOW_SYNC_K block at all, and T comes back as 1 (the loop's
// iteration-1 seed, BCD hex `00 00 00 00 00 00 01 00 01`) instead of the
// correct 3 -- a different, checkably WRONG answer, not a hang.
const ISOLATED_GOTO =
  '10 S=0\n' +
  '20 FOR K=1 TO 10\n' +
  '30 S=S+1\n' +
  '40 IF S=3 THEN GOTO 200\n' +
  '50 NEXT K\n' +
  '60 GOTO 210\n' +
  '200 T=K\n' +
  '210 END\n';

describe('a GOTO out of a shadowed loop whose body never otherwise reads the counter', () => {
  it('still reports the counter\'s value at the moment of the jump (3), not the loop\'s initial seed (1)', () => {
    const run = runLoop(ISOLATED_GOTO, 'L210');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(3)));  // three iterations ran
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(3)));  // ...and T=K agrees
  }, 120_000);

  it('is the ONLY thing forcing the per-iteration sync (no other in-body counter read)', () => {
    // Confirms this program really does isolate the GOTO hook: nothing else
    // in the body (S=S+1, IF S=3) references K at all, so if
    // NEXTSHADOW_SYNC_K appears, `case 'goto':`'s hook is what put it there.
    expect(asmLabels(ISOLATED_GOTO).some(l => l.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
  });
});

describe('a GOTO that never touches a shadowed loop', () => {
  it('does not force a spurious sync', () => {
    const basic = '10 GOTO 100\n20 END\n100 S=0\n110 FOR K=1 TO 10\n120 S=S+1\n130 NEXT K\n140 GOTO 20\n';
    const run = runLoop(basic, 'L20');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(10)));
    expect(asmLabels(basic).some(l => l.startsWith('NEXTSHADOW_SYNC_K'))).toBe(false);
  }, 120_000);
});
