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

  it('condition 4: disqualified when a GOTO in the body jumps past NEXT', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 IF K=5 THEN GOTO 100\n30 NEXT K\n40 END\n100 PRINT "done"\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4: eligible when a GOTO inside the body only jumps within the loop span', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 IF K=5 THEN GOTO 25\n25 PRINT "x"\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 4: GOSUB out of the loop body does NOT disqualify (it returns)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 GOSUB 100\n30 NEXT K\n40 END\n100 PRINT "hi"\n110 RETURN\n');
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
