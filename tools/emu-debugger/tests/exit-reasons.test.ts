import { describe, it, expect } from 'vitest';
import { formatExitResult } from '../exit-reasons.js';
import type { ExitResult } from '../exit-reasons.js';

describe('formatExitResult', () => {
  it('formats a breakpoint exit', () => {
    const r: ExitResult = {
      reason: 'breakpoint',
      cyclesExecuted: 1247,
      instructionsExecuted: 42,
      pc: 0x3EF1,
      breakpointHit: 0x3EF1,
    };
    const out = formatExitResult(r);
    expect(out).toContain('breakpoint at 0x3EF1');
    expect(out).toContain('1,247');
    expect(out).toContain('42');
  });

  it('formats a watchpoint exit', () => {
    const r: ExitResult = {
      reason: 'watchpoint',
      cyclesExecuted: 500,
      instructionsExecuted: 12,
      pc: 0x0050,
      watchpointHit: { address: 0x1000, kind: 'write', value: 0xAA, pc: 0x0050 },
    };
    const out = formatExitResult(r);
    expect(out).toContain('watchpoint write at 0x1000');
    expect(out).toContain('value=0xaa');
  });

  it('formats an illegal opcode exit', () => {
    const r: ExitResult = {
      reason: 'illegal',
      cyclesExecuted: 100,
      instructionsExecuted: 5,
      pc: 0x0020,
      illegalOpcode: 0x03,
    };
    const out = formatExitResult(r);
    expect(out).toContain('illegal opcode 0x03');
  });

  it('formats a plain reason', () => {
    const r: ExitResult = {
      reason: 'max-cycles',
      cyclesExecuted: 10_000_000,
      instructionsExecuted: 2_500_000,
      pc: 0x1234,
    };
    const out = formatExitResult(r);
    expect(out).toContain('max-cycles');
  });
});
