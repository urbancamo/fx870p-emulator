import { describe, it, expect } from 'vitest';
import { boot } from '../../../tests/emu-harness.js';
import { captureSnapshot, restoreSnapshot, saveSnapshotToFile, loadSnapshotFromFile } from '../snapshot.js';
import { pc, setPc, mr } from '../../../src/emulator/def.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('snapshot', () => {
  it('captures and restores CPU state', () => {
    boot();
    const originalPc = pc;
    const snap = captureSnapshot();

    setPc(0x1234);
    expect(pc).toBe(0x1234);

    restoreSnapshot(snap);
    expect(pc).toBe(originalPc);
  }, 30_000);

  it('round-trips via file', () => {
    boot();
    const snap = captureSnapshot();
    const dir = mkdtempSync(join(tmpdir(), 'emudbg-'));
    const path = join(dir, 'test.snap.json');
    try {
      saveSnapshotToFile(path, snap);
      const loaded = loadSnapshotFromFile(path);
      expect(loaded.version).toBe(snap.version);
      expect(loaded.romHash).toBe(snap.romHash);
      expect(loaded.cpu.pc).toBe(snap.cpu.pc);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 30_000);

  it('restores mr[] registers', () => {
    boot();
    mr[5] = 0x42;
    const snap = captureSnapshot();
    mr[5] = 0x99;
    restoreSnapshot(snap);
    expect(mr[5]).toBe(0x42);
  }, 30_000);
});
