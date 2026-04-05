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
  setPcMonitor, setRamWriteMonitor, setRamReadMonitor, setIllegalOpcodeMonitor,
} from '../../src/emulator/def.js';
import { stepOnce } from './harness-core.js';
import { lcdmem } from '../../src/emulator/lcd.js';
import type { ExitReason, WatchpointHit } from './exit-reasons.js';

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

  private instructionCount = 0;
  private cycleCount = 0;
  private exitPending: { reason: ExitReason; bp?: number; wp?: WatchpointHit; illOp?: number } | null = null;
  private stopRequested = false;

  run(options: { maxCycles?: number; maxInstructions?: number; trace?: boolean } = {}): ExitResult {
    const maxCycles = options.maxCycles ?? 10_000_000;
    const maxInstructions = options.maxInstructions ?? Infinity;
    this.instructionCount = 0;
    this.cycleCount = 0;
    this.exitPending = null;
    this.stopRequested = false;

    setPcMonitor((curPc) => {
      if (this.breakpoints.has(curPc)) {
        this.exitPending = { reason: 'breakpoint', bp: curPc };
      }
    });
    setRamWriteMonitor((addr, val) => {
      const kind = this.watchpoints.check(addr, 'write');
      if (kind) {
        this.exitPending = { reason: 'watchpoint', wp: { address: addr, kind, value: val, pc: emuPc } };
      }
    });
    setRamReadMonitor((addr, val) => {
      const kind = this.watchpoints.check(addr, 'read');
      if (kind) {
        this.exitPending = { reason: 'watchpoint', wp: { address: addr, kind, value: val, pc: emuPc } };
      }
    });
    setIllegalOpcodeMonitor((op, _p) => {
      this.exitPending = { reason: 'illegal', illOp: op };
    });

    let reason: ExitReason = 'max-cycles';

    try {
      while (this.cycleCount < maxCycles && this.instructionCount < maxInstructions) {
        if (this.stopRequested) { reason = 'manual'; break; }
        const cyclesThisStep = stepOnce();
        this.cycleCount += cyclesThisStep;
        this.instructionCount++;

        if (this.exitPending) {
          reason = this.exitPending.reason;
          break;
        }

        // "returned" — stack level back to entry AND pc outside loaded region
        if (ss >= this.entrySs && emuPc >= this.loadedRegionEnd) {
          reason = 'returned';
          break;
        }
      }
      if (this.instructionCount >= maxInstructions && !this.exitPending) {
        reason = 'max-instructions';
      }
    } finally {
      setPcMonitor(null);
      setRamWriteMonitor(null);
      setRamReadMonitor(null);
      setIllegalOpcodeMonitor(null);
    }

    const result: ExitResult = {
      reason,
      cyclesExecuted: this.cycleCount,
      instructionsExecuted: this.instructionCount,
      pc: emuPc,
    };
    if (this.exitPending?.bp !== undefined) result.breakpointHit = this.exitPending.bp;
    if (this.exitPending?.wp !== undefined) result.watchpointHit = this.exitPending.wp;
    if (this.exitPending?.illOp !== undefined) result.illegalOpcode = this.exitPending.illOp;
    return result;
  }

  step(): ExitResult {
    return this.run({ maxInstructions: 1 });
  }

  stop(): void { this.stopRequested = true; }

  getLcd(): { rows: string[]; raw: Uint8Array } {
    // rows filled in Task 12
    return { rows: [], raw: new Uint8Array(lcdmem) };
  }

  getTrace(): unknown[] { return []; }  // filled in Task 11
  getInstructionCount(): number { return this.instructionCount; }
  getCycleCount(): number { return this.cycleCount; }
}
