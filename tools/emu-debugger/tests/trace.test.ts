import { describe, it, expect } from 'vitest';
import { EmulatorSession } from '../session.js';
import { TraceBuffer } from '../trace.js';

describe('TraceBuffer', () => {
  it('respects cap', () => {
    const buf = new TraceBuffer(3);
    for (let i = 0; i < 10; i++) {
      buf.push({ pc: i, bytes: [0xCE], mnemonic: 'nop', cycles: 1 });
    }
    expect(buf.size()).toBe(3);
    expect(buf.atCap()).toBe(true);
  });

  it('returns all entries', () => {
    const buf = new TraceBuffer();
    buf.push({ pc: 0, bytes: [0xCE], mnemonic: 'nop', cycles: 1 });
    buf.push({ pc: 1, bytes: [0xF7], mnemonic: 'rtn', cycles: 2 });
    const all = buf.getAll();
    expect(all).toHaveLength(2);
    expect(all[0]!.pc).toBe(0);
    expect(all[1]!.pc).toBe(1);
  });

  it('clear empties the buffer', () => {
    const buf = new TraceBuffer();
    buf.push({ pc: 0, bytes: [0xCE], mnemonic: 'nop', cycles: 1 });
    buf.clear();
    expect(buf.size()).toBe(0);
  });
});

describe('EmulatorSession trace', () => {
  it('captures trace when trace=true', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, new Uint8Array([0xCE, 0xCE, 0xF7]));
    sess.setEntry(0x0000);
    sess.run({ maxInstructions: 10, trace: true });
    const trace = sess.getTrace();
    expect(trace.length).toBeGreaterThan(0);
    expect(trace[0]!.pc).toBe(0x0000);
  }, 30_000);

  it('returns empty trace when trace=false', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, new Uint8Array([0xCE, 0xF7]));
    sess.setEntry(0x0000);
    sess.run({ maxInstructions: 10 });
    expect(sess.getTrace()).toEqual([]);
  }, 30_000);
});
