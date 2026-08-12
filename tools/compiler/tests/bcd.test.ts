// tools/compiler/tests/bcd.test.ts
//
// Expected byte values are ground truth captured from the real ROM: the
// headless emulator ran each expression through the BASIC interpreter and the
// FP accumulator ($10-$18) / second operand ($0-$8) were dumped at the entry
// to FP_ADD (&H05DA). The capturing expression is noted against each case.

import { describe, it, expect } from 'vitest';
import { numberToBcd9 } from '../bcd.js';

const bytesOf = (v: number) => Array.from(numberToBcd9(v));

describe('numberToBcd9', () => {
  it('encodes zero as all-zero bytes', () => {
    expect(numberToBcd9(0)).toEqual(new Uint8Array(9));
  });

  it('encodes negative zero as all-zero bytes', () => {
    expect(numberToBcd9(-0)).toEqual(new Uint8Array(9));
  });

  // captured from "1+0"
  it('encodes 1', () => {
    expect(bytesOf(1)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01]);
  });

  // captured from "100+5" (second operand)
  it('encodes 5', () => {
    expect(bytesOf(5)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x00, 0x01]);
  });

  // captured from "100+7" (accumulator, keystroke-collapsed to 10)
  it('encodes 10', () => {
    expect(bytesOf(10)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x01]);
  });

  // captured from "100+5"
  it('encodes 100', () => {
    expect(bytesOf(100)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x01]);
  });

  // captured from "541+0"
  it('encodes 541 (multi-digit mantissa)', () => {
    expect(bytesOf(541)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x41, 0x05, 0x02, 0x01]);
  });

  // captured from "0.5+1.25"
  it('encodes 0.5 (negative exponent)', () => {
    expect(bytesOf(0.5)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x99, 0x00]);
  });

  // captured from "0.00001+0" (keystroke-collapsed to 0.01)
  it('encodes 0.01', () => {
    expect(bytesOf(0.01)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x98, 0x00]);
  });

  // captured from "0.5+1.25" (second operand)
  it('encodes 1.25 (fractional digits)', () => {
    expect(bytesOf(1.25)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x25, 0x01, 0x00, 0x01]);
  });

  // captured from "1.234567890123+0" — all 13 mantissa digits in use
  it('encodes a full 13-digit mantissa', () => {
    expect(bytesOf(1.234567890123))
      .toEqual([0x23, 0x01, 0x89, 0x67, 0x45, 0x23, 0x01, 0x00, 0x01]);
  });

  // captured from "9.999999999999+0"
  it('encodes 9.999999999999', () => {
    expect(bytesOf(9.999999999999))
      .toEqual([0x99, 0x99, 0x99, 0x99, 0x99, 0x99, 0x09, 0x00, 0x01]);
  });

  // captured from "12345678901234+0" — the 14th digit is dropped, not rounded
  it('truncates a literal with more than 13 significant digits', () => {
    expect(bytesOf(12345678901234))
      .toEqual([0x23, 0x01, 0x89, 0x67, 0x45, 0x23, 0x01, 0x13, 0x01]);
  });

  // captured from "3-2" (second operand, negated by FP_SUB before FP_ADD)
  it('encodes -2 with the sign digit added to the exponent-high byte', () => {
    expect(bytesOf(-2)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x06]);
  });

  // captured from "1-0.5" (second operand)
  it('encodes -0.5 (negative value, negative exponent)', () => {
    expect(bytesOf(-0.5)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x05, 0x99, 0x05]);
  });

  // captured from "0-32767" (second operand)
  it('encodes -32767', () => {
    expect(bytesOf(-32767)).toEqual([0x00, 0x00, 0x00, 0x00, 0x67, 0x27, 0x03, 0x04, 0x06]);
  });

  it('encodes a negative number identically to the positive one apart from the sign', () => {
    const pos = numberToBcd9(5);
    const neg = numberToBcd9(-5);
    expect(neg[8]).not.toBe(pos[8]);
    expect(neg[8]).toBe(pos[8] + 5);
    expect(Array.from(neg).slice(0, 8)).toEqual(Array.from(pos).slice(0, 8));
  });

  it('always returns exactly 9 bytes', () => {
    expect(numberToBcd9(0).length).toBe(9);
    expect(numberToBcd9(541).length).toBe(9);
    expect(numberToBcd9(-32767).length).toBe(9);
    expect(numberToBcd9(1e-99).length).toBe(9);
  });

  // Extrapolated from the confirmed bias rather than captured directly (the
  // exponent-entry key is not reachable through the test harness). Captured
  // exponents span both sides of the 100 boundary — 98, 99, 100, 101, 102,
  // 104, 113 — which pins the split between bytes[7] and bytes[8].
  it('encodes the extremes of the exponent range', () => {
    // 1E+99  -> biased exponent 199
    expect(bytesOf(1e99)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x99, 0x01]);
    // 1E-99  -> biased exponent 001
    expect(bytesOf(1e-99)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00]);
    // -1E-99 -> biased exponent 001, sign digit set
    expect(bytesOf(-1e-99)).toEqual([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x05]);
  });

  it('rejects values outside the calculator exponent range', () => {
    expect(() => numberToBcd9(1e100)).toThrow(RangeError);
    expect(() => numberToBcd9(-1e100)).toThrow(RangeError);
    expect(() => numberToBcd9(1e-100)).toThrow(RangeError);
  });

  it('rejects non-finite values', () => {
    expect(() => numberToBcd9(NaN)).toThrow(RangeError);
    expect(() => numberToBcd9(Infinity)).toThrow(RangeError);
    expect(() => numberToBcd9(-Infinity)).toThrow(RangeError);
  });
});
