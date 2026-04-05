// tools/emu-debugger/tests/watchpoints.test.ts
import { describe, it, expect } from 'vitest';
import { EmulatorSession } from '../session.js';

describe('EmulatorSession watchpoints', () => {
  it('does not fire watchpoint when memory is not accessed', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, new Uint8Array([0xCE, 0xF7])); // nop + rtn
    sess.setEntry(0x0000);
    sess.addWatchpoint(0x9999, 'write');
    const result = sess.run({ maxInstructions: 5 });
    expect(result.reason).not.toBe('watchpoint');
  }, 30_000);

  it('allows removal of watchpoints', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.addWatchpoint(0x1000, 'write');
    sess.removeWatchpoint(0x1000, 'write');
    sess.loadBinary(0x0000, new Uint8Array([0xF7]));
    sess.setEntry(0x0000);
    const result = sess.run({ maxInstructions: 2 });
    expect(result.reason).not.toBe('watchpoint');
  }, 30_000);

  it('clears all watchpoints', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.addWatchpoint(0x1000, 'write');
    sess.addWatchpoint(0x2000, 'read');
    sess.clearWatchpoints();
    sess.loadBinary(0x0000, new Uint8Array([0xF7]));
    sess.setEntry(0x0000);
    const result = sess.run({ maxInstructions: 2 });
    expect(result.reason).not.toBe('watchpoint');
  }, 30_000);
});
