// Task 6b acceptance test — proves a GOTO out of a shadowed loop's body forces
// the per-iteration BCD re-sync (markShadowCounterMustBeCurrent), the same
// remedy Task 4 already gave RETURN, on the real CPU (sections 1-2). Four
// rounds of post-implementation review then found the same underlying bug
// class reachable through further doors -- two on the INCOMING axis (control
// landing back inside a live span from outside), two on the OUTGOING axis
// (statement types that leave a loop's body without calling the sync hook):
//
//   - Section 3: a GOTO jumping back INTO a live loop's own span from
//     outside it, after writing the counter externally. Fixed by
//     loop-shadow-eligibility.ts's `hasExternalJumpIntoSpan` static guard.
//   - Section 4: the identical INCOMING hazard reached via a CALL
//     (GOSUB/ON...GOSUB/RESUME <line>) instead of a JUMP -- a call whose
//     TARGET lands inside the span orphans its own return address the same
//     way. Fixed by extending the same guard's edge collection.
//   - Section 5: the OUTGOING-direction gap in `emitResume` itself -- all
//     three RESUME forms leave a loop's body without reaching NEXT (same as
//     GOTO/RETURN), but `emitResume` never called
//     `markShadowCounterMustBeCurrent()`. Fixed by adding that one call.
//   - Section 6: the same OUTGOING gap in `case 'end':`, which handles
//     END/STOP/CONT and emits RETURN's own `rtn` while calling neither the
//     sync hook nor unshadowOpenLoops. Fixed by adding the same one call.
//
// See loop-shadow-eligibility.ts's `hasExternalJumpIntoSpan`/`collectJumps`
// and codegen.ts's `case 'goto':` / `case 'end':` / `emitOnBranch` /
// `emitResume`.
//
// The probe/runLoop harness is loop-shadow-next.test.ts's, copied rather than
// imported: importing another test file would run its suites too.

import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { numberToBcd9 } from '../../compiler/bcd.js';
import { EmulatorSession } from '../session.js';
import type { SymbolEntry } from '../../compiler/asm-types.js';
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
 * Where to stop: a label name, or a function picking an address out of the
 * assembled symbol table (for code `case 'end':` emits, which carries no
 * label of its own -- see `firstEndPause`).
 */
type BreakTarget = string | ((symbols: SymbolEntry[]) => number);

/**
 * Compile `basic`, run it to `breakAt`, and expose its memory. See
 * loop-shadow-next.test.ts for the full rationale -- MODE110's UA=0x55, the
 * module-global ISERV reset, and why accessors must be read before the next
 * EmulatorSession is constructed.
 */
function runLoop(basic: string, breakAt: BreakTarget, maxCycles = 60_000_000): LoopRun {
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
  sess.addBreakpoint(typeof breakAt === 'function' ? breakAt(assembled.symbols) : addressOf(breakAt));

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

// ---------------------------------------------------------------------------
// 3. The "continue" idiom: a jump BACK INTO a live iteration from outside
// ---------------------------------------------------------------------------
//
// Post-review finding: the RETURN/GOTO analogy this task started from is
// INCOMPLETE. RETURN's safety doesn't just depend on "the counter is
// refreshed at the start of every iteration" -- it also depends on RETURN
// permanently abandoning the loop (its GOSUB call site is outside the body,
// so control can never resume mid-loop afterwards). GOTO has no such
// guarantee: it can jump out, run other code that WRITES the counter, and
// then jump BACK IN via a second GOTO whose target sits inside the loop's
// own [FOR, NEXT] span -- with SHADOW_ACTIVE still 1 and the shadow slots
// still live. The write lands in VAR_K; the native tail keeps stepping the
// untouched int16 slot; the write is silently discarded. This is the same
// class of hazard `unshadowOpenLoops` already fixes for GOSUB, reached a
// different way, and `markShadowCounterMustBeCurrent` cannot fix it: its
// sync only runs at NEXT, which the re-entering jump can skip straight past.
//
// The fix is a STATIC pre-condition (loop-shadow-eligibility.ts's
// `hasExternalJumpIntoSpan`): a loop is disqualified from shadowing
// entirely whenever some GOTO/ON GOTO elsewhere in the program, with a
// source line outside the loop's [FOR, NEXT] span, targets a line inside
// it. `PRIMES.BAS` and `WUMPUS.BAS` were both checked against this rule and
// have no such jump, so neither loses its shadowing.
const CONTINUE_IDIOM =
  '10 S=0\n' +
  '20 FOR K=1 TO 10\n' +
  '30 S=S+1\n' +
  '40 IF S=3 THEN GOTO 100\n' +
  '50 NEXT K\n' +
  '60 GOTO 200\n' +
  '100 K=8\n' +           // writes the counter from OUTSIDE the tracked body
  '110 GOTO 50\n' +       // ...then re-enters the live loop at its own NEXT line
  '200 T=S\n' +
  '210 END\n';

describe('a "continue" idiom that GOTOes out, writes the counter, then GOTOes back into the span', () => {
  it('is disqualified from shadowing entirely -- no SHADOW_K_ACT, no NEXTSHADOW_ tail at all', () => {
    const labels = asmLabels(CONTINUE_IDIOM);
    expect(labels.some(l => l === 'SHADOW_K_ACT')).toBe(false);
    expect(labels.some(l => l.startsWith('NEXTSHADOW_'))).toBe(false);
  });

  it('produces the CORRECT answer (S=T=5), not the buggy S=T=10 a live shadow would give', () => {
    // Trace: K=1 (S=1), K=2 (S=2), K=3 (S=3) -> GOTO 100 -> K:=8 -> GOTO 50
    // (NEXT K) steps K to 9, 9<=10 so the loop continues for K=9 (S=4),
    // K=10 (S=5), then K=11 exits. Five iterations total. Before this fix,
    // a still-live shadow would silently discard the `K=8` write and keep
    // stepping its own stale int16 copy from 3 onward -- seven more
    // iterations (K=4..10) instead of two, landing on S=T=10.
    const run = runLoop(CONTINUE_IDIOM, 'L210');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(5)));
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(5)));
  }, 120_000);
});

// ---------------------------------------------------------------------------
// 4. The same hazard reached via a CALL instead of a JUMP
// ---------------------------------------------------------------------------
//
// Second-round review finding: `collectJumps`'s original exclusion of GOSUB
// rested on a false premise -- "a call always returns to its own call site,
// so it cannot resume control mid-loop". That is true in general, but NOT
// when the GOSUB's TARGET is a line inside a live shadowed loop's span. Once
// control reaches that line, the loop's own NEXT is what transfers control
// next (back to the loop top, or out past the exit) -- the original CAL's
// return address is simply orphaned, never used. Control persists inside the
// loop exactly as after a GOTO; it just arrived via `cal` instead of `jp`.
//
// This exposure was NEW as of the GOTO fix above, not pre-existing: reaching
// an external GOSUB while the loop was still live required a GOTO out
// first, which the OLD condition 4 disqualified outright before GOSUB ever
// got the chance to matter here.
//
// Same three programs as the GOTO idiom above, `GOTO 50` swapped for
// `GOSUB 50` / `ON 1 GOSUB 50` / `RESUME 50` -- all three land on the same
// NEXT line, inside the loop's own span, from a source line outside it.
function continueViaCall(callStmt: string): string {
  return (
    '10 S=0\n' +
    '20 FOR K=1 TO 10\n' +
    '30 S=S+1\n' +
    '40 IF S=3 THEN GOTO 100\n' +
    '50 NEXT K\n' +
    '60 GOTO 200\n' +
    '100 K=8\n' +
    `110 ${callStmt}\n` +
    '120 GOTO 200\n' +
    '200 T=S\n' +
    '210 END\n'
  );
}

describe.each([
  ['GOSUB', continueViaCall('GOSUB 50')],
  ['ON...GOSUB', continueViaCall('ON 1 GOSUB 50')],
  ['RESUME <line>', continueViaCall('RESUME 50')],
])('the same "continue" idiom via %s instead of GOTO', (_label, program) => {
  it('is disqualified from shadowing entirely -- no SHADOW_K_ACT, no NEXTSHADOW_ tail at all', () => {
    const labels = asmLabels(program);
    expect(labels.some(l => l === 'SHADOW_K_ACT')).toBe(false);
    expect(labels.some(l => l.startsWith('NEXTSHADOW_'))).toBe(false);
  });

  it('produces the CORRECT answer (S=T=5), not the buggy S=T=10 a live shadow would give', () => {
    const run = runLoop(program, 'L210');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(5)));
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(5)));
  }, 120_000);
});

// ---------------------------------------------------------------------------
// 5. The OUTGOING-direction gap: emitResume never called the sync hook
// ---------------------------------------------------------------------------
//
// Third-round review finding, on the opposite axis from sections 3-4 (which
// were both about an INCOMING edge landing back inside a live span).
// `RESUME <line>` was correctly given to `collectJumps` in round 2 (so an
// EXTERNAL RESUME landing inside a live loop's span disqualifies it, same as
// GOTO). But RESUME also needed the OUTGOING-direction fix -- the same one
// `case 'goto':`, `case 'return':`, and `emitOnBranch`'s `kind === 'goto'`
// handling already had -- and `emitResume` had none of the three hook call
// sites. All three RESUME forms leave a shadowed loop's body without
// reaching NEXT:
//
//   - `RESUME <line>` emits `jp` -- byte-for-byte the same transfer as
//     `case 'goto':`, which DOES call markShadowCounterMustBeCurrent().
//   - `RESUME NEXT` and a bare `RESUME` both emit `rtn` -- the same transfer
//     as `case 'return':`, which also DOES call it.
//
// So a shadowed loop exited via any RESUME form left without the
// per-iteration BCD sync, reading the counter's iteration-1 seed instead of
// its current value -- the identical failure mode as the RETURN case Task 4
// originally fixed, just for a statement type that fell through the cracks.
//
// Verified directly (not just argued) by temporarily commenting out the new
// `this.markShadowCounterMustBeCurrent()` call at the top of emitResume and
// re-running: RESUME NEXT and bare RESUME both read back T=1 (the loop's
// iteration-1 seed) instead of the correct T=3, while RETURN (same program,
// same GOSUB entry, already fixed since Task 4) correctly read T=3 -- and
// RESUME 200 read back T=1 while GOTO 200 (already fixed since this task's
// first round) correctly read T=3. Restored the fix before committing.

/** `RETURN`/`GOTO`/`RESUME`-equivalent early exit from inside a GOSUB'd
 * subroutine's own loop, landing OUTSIDE the loop (mirrors loop-shadow-next
 * .test.ts's own RETURN acceptance test). The entry GOSUB's target (100) is
 * deliberately a no-op line BEFORE the FOR line (105), not ON it -- see the
 * hasExternalJumpIntoSpan comment elsewhere in this file for why. */
function exitViaGosubSubroutine(exitStmt: string): string {
  return (
    '10 S=0\n' +
    '20 GOSUB 100\n' +
    '30 T=K\n' +
    '40 END\n' +
    '100 X=0\n' +
    '105 FOR K=1 TO 10\n' +
    '110 S=S+1\n' +
    `115 IF S=3 THEN ${exitStmt}\n` +
    '120 NEXT K\n' +
    '130 RETURN\n'
  );
}

describe.each([
  ['RETURN', exitViaGosubSubroutine('RETURN')],
  ['RESUME NEXT', exitViaGosubSubroutine('RESUME NEXT')],
  ['RESUME (bare)', exitViaGosubSubroutine('RESUME')],
])('a %s exiting a shadowed loop without reaching NEXT (outgoing direction)', (_label, program) => {
  it('keeps the loop on the fast path with a forced per-iteration sync', () => {
    const labels = asmLabels(program);
    expect(labels.some(l => l === 'SHADOW_K_ACT')).toBe(true);
    expect(labels.some(l => l.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
  });

  it('reports the counter\'s value at the moment of exit (3), not the loop\'s initial seed (1)', () => {
    const run = runLoop(program, 'L40');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(3)));  // three iterations ran
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(3)));  // ...and T=K agrees
  }, 120_000);
});

describe('a RESUME <line> exiting a shadowed loop past NEXT (outgoing direction, jp form)', () => {
  const program =
    '10 S=0\n' +
    '20 FOR K=1 TO 10\n' +
    '30 S=S+1\n' +
    '40 IF S=3 THEN RESUME 200\n' +
    '50 NEXT K\n' +
    '60 GOTO 210\n' +
    '200 T=K\n' +
    '210 END\n';

  it('keeps the loop on the fast path with a forced per-iteration sync', () => {
    const labels = asmLabels(program);
    expect(labels.some(l => l === 'SHADOW_K_ACT')).toBe(true);
    expect(labels.some(l => l.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
  });

  it('reports the counter\'s value at the moment of the jump (3), not the loop\'s initial seed (1)', () => {
    const run = runLoop(program, 'L210');
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(3)));
    expect(hex(run.bcd('T'))).toBe(hex(numberToBcd9(3)));
  }, 120_000);
});

// ---------------------------------------------------------------------------
// 6. END / STOP — the same OUTGOING gap in `case 'end':`
// ---------------------------------------------------------------------------
//
// Fourth review round. `case 'end':` (codegen.ts) handles END, STOP and CONT
// alike and emits a bare `rtn` — byte-for-byte the same transfer `case
// 'return':` emits, and `case 'return':` has called
// markShadowCounterMustBeCurrent() since Task 4. `case 'end':` called neither
// that hook nor the stronger unshadowOpenLoops(), so a shadowed loop exited
// via END/STOP left VAR_<v> at its iteration-1 seed — the identical
// stale-counter signature as sections 2 and 5.
//
// Verified directly (not just argued) by temporarily removing the new
// `this.markShadowCounterMustBeCurrent()` call from `case 'end':` and
// re-running: both programs below read back VAR_K = `00 00 00 00 00 00 01 00
// 01` (BCD 1, the loop's seed) while VAR_S correctly read 3 — proving three
// iterations really had run and the counter really was 3 at that instant.
// With the call restored, both read VAR_K = `00 00 00 00 00 00 03 00 01`.
//
// Why the breakpoint is an ADDRESS and not a label: the code `case 'end':`
// emits carries no label of its own, and running THROUGH it is impossible
// headlessly — emitPauseAtEnd's `cal KYIN` blocks forever waiting for a
// keypress the debugger cannot supply (see hello-at-1cd0.test.ts, which
// breaks at the same place for the same reason). `firstEndPause` therefore
// stops at the in-loop END's own pause done-label, the instant control
// reaches END and before the pause emits anything, which is exactly the
// moment VAR_K's staleness is observable. Nothing between the loop body and
// that point touches VAR_K.
//
// This measures the staleness itself rather than an answer computed FROM it.
// The reviewer's fuller repro (END inside a GOSUB'd subroutine, whose `rtn`
// then returns to the GOSUB's caller, which reads the stale counter into a
// result variable) reaches a wrong ANSWER, but only by relying on a separate,
// pre-existing bug in how this compiler's END returns to its caller instead
// of halting — that bug is out of scope here, and leaning on it would couple
// this regression test to behaviour nobody intends to keep.

/** Address of the FIRST pause-sequence done-label in the program. Both
 * programs below place their in-loop END/STOP before any other END and use no
 * PRINT, so the lowest `L_PRSD<n>` address is unambiguously the in-loop
 * exit's own pause. */
const firstEndPause = (symbols: SymbolEntry[]): number =>
  Math.min(...symbols.filter(s => s.name.startsWith('L_PRSD')).map(s => s.address));

describe.each([
  ['END', '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN END\n50 NEXT K\n60 END\n'],
  ['STOP', '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN STOP\n50 NEXT K\n60 END\n'],
])('a %s exiting a shadowed loop without reaching NEXT (outgoing direction)', (_label, program) => {
  it('keeps the loop on the fast path with a forced per-iteration sync', () => {
    const labels = asmLabels(program);
    expect(labels.some(l => l === 'SHADOW_K_ACT')).toBe(true);
    expect(labels.some(l => l.startsWith('NEXTSHADOW_SYNC_K'))).toBe(true);
    // ...and it keeps the native tail: END is an exit, not a write.
    expect(labels.some(l => l.startsWith('NEXTSHADOW_BCD_K'))).toBe(true);
  });

  it('leaves VAR_K at the counter\'s value on exit (3), not the loop\'s initial seed (1)', () => {
    const run = runLoop(program, firstEndPause);
    expect(run.reason).toBe('breakpoint');
    expect(hex(run.bcd('S'))).toBe(hex(numberToBcd9(3)));  // three iterations ran...
    expect(hex(run.bcd('K'))).toBe(hex(numberToBcd9(3)));  // ...so K really is 3 here
  }, 120_000);
});
