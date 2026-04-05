// tools/emu-debugger/session.ts
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { boot, writeBinaryToRam, readFromRam } from './harness-core.js';
import {
  captureSnapshot, restoreSnapshot, saveSnapshotToFile, loadSnapshotFromFile,
  snapshotExists,
} from './snapshot.js';
import type { Snapshot } from './snapshot.js';
import { BreakpointSet, WatchpointSet } from './breakpoints.js';
import type { WatchKind, ExitResult } from './exit-reasons.js';
import {
  pc as emuPc, ua, ib, flag, ix, iy, iz, sx, sy, sz, ss, us, mr,
  setPc,
} from '../../src/emulator/def.js';

export type SessionMode = 'snapshot' | 'boot' | 'raw';

export interface SessionOptions {
  mode: SessionMode;
  snapshotPath?: string;
}

export interface Registers {
  pc: number; ua: number; ib: number; flag: number;
  ix: number; iy: number; iz: number;
  sx: number; sy: number; sz: number;
  ss: number; us: number;
  mr: Uint8Array;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_SNAPSHOT_PATH = resolve(__dirname, 'snapshots/default.snap.json');

export class EmulatorSession {
  private mode: SessionMode;
  private snapshotPath: string;
  protected breakpoints = new BreakpointSet();
  protected watchpoints = new WatchpointSet();
  protected entryAddress = 0;
  protected entrySs = 0;
  protected loadedRegionEnd = 0;
  private initialSnapshot: Snapshot | null = null;

  constructor(options: SessionOptions) {
    this.mode = options.mode;
    this.snapshotPath = options.snapshotPath ?? DEFAULT_SNAPSHOT_PATH;
    this.initialize();
  }

  private initialize(): void {
    if (this.mode === 'raw') {
      boot();
      return;
    }
    if (this.mode === 'snapshot') {
      if (snapshotExists(this.snapshotPath)) {
        boot();
        const snap = loadSnapshotFromFile(this.snapshotPath);
        restoreSnapshot(snap);
      } else {
        boot();
        const snap = captureSnapshot();
        saveSnapshotToFile(this.snapshotPath, snap);
      }
    } else {
      boot();
    }
    this.initialSnapshot = captureSnapshot();
  }

  loadBinary(address: number, bytes: Uint8Array): void {
    writeBinaryToRam(address, bytes);
    this.loadedRegionEnd = Math.max(this.loadedRegionEnd, address + bytes.length);
  }

  setEntry(address: number): void {
    this.entryAddress = address & 0xFFFF;
    setPc(this.entryAddress);
    this.entrySs = ss;
  }

  addBreakpoint(pcAddr: number): void { this.breakpoints.add(pcAddr); }
  removeBreakpoint(pcAddr: number): void { this.breakpoints.remove(pcAddr); }
  clearBreakpoints(): void { this.breakpoints.clear(); }

  addWatchpoint(address: number, kind: WatchKind): void { this.watchpoints.add(address, kind); }
  removeWatchpoint(address: number, kind: WatchKind): void { this.watchpoints.remove(address, kind); }
  clearWatchpoints(): void { this.watchpoints.clear(); }

  getRegisters(): Registers {
    return {
      pc: emuPc, ua, ib, flag, ix, iy, iz, sx, sy, sz, ss, us,
      mr: new Uint8Array(mr),
    };
  }

  getMemory(address: number, length: number): Uint8Array {
    return readFromRam(address, length);
  }

  reset(): void {
    if (this.initialSnapshot) {
      restoreSnapshot(this.initialSnapshot);
    }
    this.breakpoints.clear();
    this.watchpoints.clear();
    this.loadedRegionEnd = 0;
  }

  // Stubs — filled in Task 9
  run(_options?: { maxCycles?: number; maxInstructions?: number; trace?: boolean }): ExitResult {
    throw new Error('run() not yet implemented');
  }
  step(): ExitResult {
    throw new Error('step() not yet implemented');
  }
  stop(): void {
    throw new Error('stop() not yet implemented');
  }
  getLcd(): { rows: string[]; raw: Uint8Array } {
    throw new Error('getLcd() not yet implemented');
  }
  getTrace(): unknown[] {
    throw new Error('getTrace() not yet implemented');
  }
  getInstructionCount(): number { return 0; }
  getCycleCount(): number { return 0; }
}
