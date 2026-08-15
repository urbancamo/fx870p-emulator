import { describe, it, expect } from 'vitest';
import { parse } from '../parser.js';
import { inferIntegerEligibility } from '../type-inference.js';

describe('inferIntegerEligibility', () => {
  it('classifies a variable assigned only integer literals as eligible', () => {
    const ast = parse('10 A=5\n20 A=10\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(true);
  });

  it('classifies a variable ever assigned a decimal literal as bcd-only', () => {
    const ast = parse('10 A=5\n20 A=3.14\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies a variable built from +/-/*/MOD// of eligible sources as eligible', () => {
    const ast = parse('10 A=5\n20 B=A+3\n30 C=B-1\n40 D=C*2\n50 E=D MOD 4\n60 F=D/2\n');
    const eligible = inferIntegerEligibility(ast);
    expect(eligible.has('A')).toBe(true);
    expect(eligible.has('B')).toBe(true);
    expect(eligible.has('C')).toBe(true);
    expect(eligible.has('D')).toBe(true);
    expect(eligible.has('E')).toBe(true);
    expect(eligible.has('F')).toBe(true);
  });

  it('classifies a variable built from an expression touching a bcd-only variable as bcd-only', () => {
    const ast = parse('10 A=5\n20 X=3.14\n30 A=A+X\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies any variable ever targeted by INPUT as bcd-only, unconditionally', () => {
    const ast = parse('10 A=5\n20 INPUT A\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies a FOR loop counter, limit, and step as eligible when all are integer expressions', () => {
    const ast = parse('10 FOR I=1 TO 10 STEP 2\n20 NEXT I\n');
    expect(inferIntegerEligibility(ast).has('I')).toBe(true);
  });

  it('classifies a FOR loop counter as bcd-only when the limit is a decimal', () => {
    const ast = parse('10 FOR I=1 TO 10.5\n20 NEXT I\n');
    expect(inferIntegerEligibility(ast).has('I')).toBe(false);
  });

  it('is whole-variable, whole-program: one bad assignment poisons every use, including earlier integer-looking ones', () => {
    const ast = parse('10 A=5\n20 PRINT A\n30 A=1.5\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('a variable assigned inside a GOSUB target reachable from multiple call sites is classified from every assignment, not just the first', () => {
    const ast = parse('10 GOSUB 100\n20 GOSUB 200\n30 END\n100 A=5\n110 RETURN\n200 A=3.14\n210 RETURN\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies a variable never assigned a decimal-point literal even when its value happens to be whole, based on the literal text not the numeric value', () => {
    const ast = parse('10 A=5.0\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });
});
