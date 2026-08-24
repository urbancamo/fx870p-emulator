import { describe, it, expect } from 'vitest';
import { parse } from '../parser.js';
import { inferIntegerEligibility } from '../type-inference.js';
import { analyzeLoopShadowEligibility } from '../loop-shadow-eligibility.js';
import type { ForStatement } from '../ast.js';

function analyze(source: string) {
  const program = parse(source);
  const integerEligible = inferIntegerEligibility(program);
  const result = analyzeLoopShadowEligibility(program, integerEligible);
  // Find the (first, or only) ForStatement in program order for convenience.
  const forStmts: ForStatement[] = [];
  for (const [, stmts] of program.lines) for (const s of stmts) if (s.type === 'for') forStmts.push(s);
  return { result, forStmts };
}

describe('analyzeLoopShadowEligibility', () => {
  it('eligible: a simple integer counter/limit/step loop with no body hazards', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 PRINT "hi"\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('eligible: PRIMES.BAS-shaped loop with a runtime (non-literal) limit and an in-body comparison referencing the counter', () => {
    const { result, forStmts } = analyze(
      '10 N=100\n20 FOR K=2 TO N-1\n30 IF N MOD K = 0 THEN GOTO 50\n50 NEXT K\n60 END\n'
    );
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 1: disqualified when the limit is not integer-eligible', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10.5\n20 NEXT K\n30 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 2: disqualified when the body writes to the counter outside NEXT', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 K=K+5\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 2: disqualified when a nested loop reuses the same counter name', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 FOR K=1 TO 3\n30 NEXT K\n40 NEXT K\n50 END\n');
    // forStmts[0] is the OUTER loop (encountered first in program order)
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is used bare (not as a direct operand of a fast-path op)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 X=K\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is used as an array index', () => {
    const { result, forStmts } = analyze('10 DIM A(20)\n20 FOR K=1 TO 10\n30 PRINT A(K)\n40 NEXT K\n50 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is used as an array index in an INPUT target', () => {
    const { result, forStmts } = analyze('10 DIM A(20)\n20 FOR K=1 TO 10\n30 INPUT A(K)\n40 NEXT K\n50 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is used as an array index in a READ target', () => {
    const { result, forStmts } = analyze(
      '10 DIM A(20)\n20 FOR K=1 TO 10\n30 READ A(K)\n40 NEXT K\n50 END\n60 DATA 1,2,3,4,5,6,7,8,9,10\n'
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is combined via a non-fast-path op (integer divide)', () => {
    const { result, forStmts } = analyze('10 FOR K=2 TO 10\n20 X=100/K\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: eligible when the counter appears nested inside a fast-path expression', () => {
    const { result, forStmts } = analyze('10 N=100\n20 FOR K=1 TO 10\n30 IF (K+1)*2>N THEN GOTO 50\n50 NEXT K\n60 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 3: disqualified when the counter\'s sibling operand is not integer-eligible', () => {
    const { result, forStmts } = analyze('10 X=3.14\n20 FOR K=1 TO 10\n30 Y=K+X\n40 NEXT K\n50 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('a GOTO in the body that jumps past NEXT no longer disqualifies the loop -- codegen forces a sync instead', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 IF K=5 THEN GOTO 100\n30 NEXT K\n40 END\n100 PRINT "done"\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('eligible when a GOTO inside the body only jumps within the loop span', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 IF K=5 THEN GOTO 25\n25 PRINT "x"\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('an ON GOTO in the body with a target outside the loop span no longer disqualifies the loop either', () => {
    const { result, forStmts } = analyze(
      '10 FOR K=1 TO 10\n20 ON S GOTO 100,30\n30 NEXT K\n40 END\n100 PRINT "done"\n',
    );
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 4\': disqualified by a "continue" idiom that GOTOes out, writes the counter, then GOTOes back into the span', () => {
    // The exact hazard markShadowCounterMustBeCurrent cannot fix: `100 K=8`
    // writes the counter from OUTSIDE the tracked body, and `110 GOTO 50`
    // (line 50 is the loop's own NEXT) resumes the native tail mid-loop as
    // if that write never happened. Reproduced live on the emulator in
    // tools/emu-debugger/tests/loop-shadow-goto.test.ts.
    const { result, forStmts } = analyze(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN GOTO 100\n50 NEXT K\n'
      + '60 GOTO 200\n100 K=8\n110 GOTO 50\n200 T=S\n210 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified by the same "continue" idiom even when the write happens inside a GOSUB\'d subroutine', () => {
    // The check is agnostic to WHAT wrote the counter, or how -- only to
    // whether an external GOTO's target lands inside the span. A GOSUB'd
    // subroutine that writes K, followed by a GOTO from after the GOSUB call
    // site back into the span, reproduces the identical hazard.
    const { result, forStmts } = analyze(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN GOTO 100\n50 NEXT K\n'
      + '60 GOTO 200\n100 GOSUB 300\n110 GOTO 50\n200 T=S\n210 END\n300 K=8\n310 RETURN\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified by the same "continue" idiom when the write comes from a re-seeding nested FOR', () => {
    // A nested `FOR K=...` reached only via an external GOTO (not textually
    // inside the outer loop's own span, so condition 2's nested-FOR check
    // never sees it) re-seeds VAR_K the same way a direct assignment would.
    const { result, forStmts } = analyze(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN GOTO 100\n50 NEXT K\n'
      + '60 GOTO 200\n100 FOR K=1 TO 3\n105 NEXT K\n110 GOTO 50\n200 T=S\n210 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified when an external GOTO lands exactly on the NEXT line', () => {
    const { result, forStmts } = analyze(
      '10 FOR K=1 TO 10\n20 PRINT "hi"\n30 NEXT K\n40 END\n50 GOTO 30\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified when an external GOTO lands exactly on the FOR line (span boundary is inclusive)', () => {
    const { result, forStmts } = analyze(
      '10 GOTO 30\n20 END\n30 FOR K=1 TO 10\n40 PRINT "hi"\n50 NEXT K\n60 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified by an external ON GOTO whose target lands inside the span', () => {
    const { result, forStmts } = analyze(
      '10 FOR K=1 TO 10\n20 PRINT "hi"\n30 NEXT K\n40 END\n50 ON S GOTO 60,20\n60 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': NOT disqualified by a GOTO whose source AND target are both outside the span', () => {
    const { result, forStmts } = analyze(
      '10 GOTO 100\n20 FOR K=1 TO 10\n30 PRINT "hi"\n40 NEXT K\n50 END\n100 PRINT "unrelated"\n110 GOTO 100\n',
    );
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 4\': disqualified by the reviewer\'s GOSUB-into-span "continue" idiom (same repro as GOTO, GOSUB instead)', () => {
    // "a call always returns to its own call site" is true in general, but
    // NOT when the call target is a line inside a live shadowed loop's
    // span: the loop's own NEXT is what transfers control next, so the
    // CAL's return address is simply orphaned. Reproduced live on the
    // emulator in tools/emu-debugger/tests/loop-shadow-goto.test.ts.
    const { result, forStmts } = analyze(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN GOTO 100\n50 NEXT K\n'
      + '60 GOTO 200\n100 K=8\n110 GOSUB 50\n120 GOTO 200\n200 T=S\n210 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified by the same idiom via ON...GOSUB', () => {
    const { result, forStmts } = analyze(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN GOTO 100\n50 NEXT K\n'
      + '60 GOTO 200\n100 K=8\n110 ON 1 GOSUB 50\n120 GOTO 200\n200 T=S\n210 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': disqualified by the same idiom via RESUME <line> (emits a raw jp, same as GOTO)', () => {
    const { result, forStmts } = analyze(
      '10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 IF S=3 THEN GOTO 100\n50 NEXT K\n'
      + '60 GOTO 200\n100 K=8\n110 RESUME 50\n120 GOTO 200\n200 T=S\n210 END\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4\': RESUME NEXT and a bare RESUME (no line target) do not disqualify anything', () => {
    const { result, forStmts } = analyze(
      '10 FOR K=1 TO 10\n20 S=S+1\n30 NEXT K\n40 END\n50 RESUME NEXT\n60 RESUME\n',
    );
    expect(result.get(forStmts[0])).toBe(true);
  });

  // -- condition 5: a GOSUB / ON..GOSUB anywhere in the body -----------------
  //
  // The subroutine is emitted outside the loop, so this pass can see neither
  // what it reads nor what it WRITES. It used to be handled at codegen time
  // by back-patching the loop's runtime SHADOW_ACTIVE flag to 0 -- correct,
  // but the loop still paid emitFor's three-BCD_TO_INT16 entry decode on every
  // entry for a fast path it could never take (a measured +12.7%..+18%). It is
  // a static disqualifier now, so no slots and no entry decode are emitted at
  // all.

  it('condition 5: GOSUB in the loop body disqualifies, even with its target outside the span', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 GOSUB 100\n30 NEXT K\n40 END\n100 PRINT "hi"\n110 RETURN\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 5: ON...GOSUB in the loop body disqualifies the same way', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 ON 1 GOSUB 100\n30 NEXT K\n40 END\n100 PRINT "hi"\n110 RETURN\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 5: a GOSUB inside a NESTED loop disqualifies the inner AND the outer loop', () => {
    // walkProgram appends every visited statement to every currently-open
    // loop's body, so the GOSUB on line 30 is in J's body and in K's.
    const { result, forStmts } = analyze(
      '10 FOR K=1 TO 10\n20 FOR J=1 TO 5\n30 GOSUB 200\n40 NEXT J\n50 NEXT K\n60 END\n'
      + '200 S=1\n210 RETURN\n',
    );
    const outer = forStmts.find(f => f.variable.name === 'K')!;
    const inner = forStmts.find(f => f.variable.name === 'J')!;
    expect(result.get(outer)).toBe(false);
    expect(result.get(inner)).toBe(false);
  });

  it('condition 5: a GOSUB inside an IF branch in the body still counts as in-body', () => {
    const { result, forStmts } = analyze(
      '10 FOR K=1 TO 10\n20 IF S=3 THEN GOSUB 100\n30 NEXT K\n40 END\n100 S=0\n110 RETURN\n',
    );
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 5: a GOSUB OUTSIDE every loop body does not disqualify anything', () => {
    // The complement of condition 5, and also a guard against condition 4'
    // (hasExternalJumpIntoSpan) over-firing: the GOSUB's target sits well
    // clear of the loop's [FOR, NEXT] span, and the call site is outside it.
    const { result, forStmts } = analyze(
      '10 GOSUB 100\n20 FOR K=1 TO 10\n30 S=S+1\n40 NEXT K\n50 GOSUB 100\n60 END\n'
      + '100 S=0\n110 RETURN\n',
    );
    expect(result.get(forStmts[0])).toBe(true);
  });

  // -- condition 6: a literal-bound loop too short to amortize the entry cost -

  it('condition 6: a 1-iteration literal-bound loop is disqualified (entry decode never amortizes)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 1\n20 S=S+1\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 6: a 2-iteration literal-bound loop is disqualified (measured +2.4% cycles)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 2\n20 S=S+1\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 6: 3 iterations is the break-even point and stays eligible', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 3\n20 S=S+1\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 6: STEP is taken into account (1 TO 10 STEP 5 is only 2 iterations)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10 STEP 5\n20 S=S+1\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 6: STEP 4 over 1 TO 10 is 3 iterations and stays eligible', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10 STEP 4\n20 S=S+1\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 6: a zero-trip literal-bound loop (TO below FROM) is disqualified too', () => {
    const { result, forStmts } = analyze('10 FOR K=5 TO 1\n20 S=S+1\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 6: does not apply when any bound is a runtime expression', () => {
    // N is unknown at compile time, so the trip count is unknowable and the
    // loop's eligibility is decided by the other conditions -- even though it
    // may well run only once.
    const { result, forStmts } = analyze('10 N=1\n20 FOR K=1 TO N\n30 S=S+1\n40 NEXT K\n50 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('nested loops are evaluated independently: outer eligible, inner disqualified by an array index', () => {
    const { result, forStmts } = analyze(
      '10 DIM A(20)\n20 FOR K=1 TO 10\n30 FOR J=1 TO 5\n40 PRINT A(J)\n50 NEXT J\n60 NEXT K\n70 END\n'
    );
    const outer = forStmts.find(f => f.variable.name === 'K')!;
    const inner = forStmts.find(f => f.variable.name === 'J')!;
    expect(result.get(outer)).toBe(true);
    expect(result.get(inner)).toBe(false);
  });

  it('a bare INPUT-sourced variable used as TO makes the counter ineligible (condition 1, via Task 1)', () => {
    const { result, forStmts } = analyze('10 INPUT N\n20 FOR K=1 TO N\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });
});
