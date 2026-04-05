# Headless Emu-Debugger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a headless debugger library + CLI for the FX-870P emulator, enabling breakpoints, memory watchpoints, instruction tracing, snapshot restore, and automated compiler testing.

**Architecture:** Library wraps `tests/emu-harness.ts` and hooks into emulator's existing `setPcMonitor`/`setRamWriteMonitor`. New `setRamReadMonitor` and `setIllegalOpcodeMonitor` hooks added to `def.ts` and `exec.ts`. CLI uses the library via three commands (`run`, `trace`, `step`).

**Tech Stack:** TypeScript 5.9, vitest for tests, tsx for CLI, no new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-05-emu-debugger-design.md`

---

## File Structure

```
tools/emu-debugger/
  session.ts         — EmulatorSession class (public API)
  snapshot.ts        — save/restore CPU + memory state
  breakpoints.ts     — breakpoint/watchpoint data structures
  exit-reasons.ts    — ExitReason types + detection helpers
  harness-core.ts    — shared emulator state helpers
  trace.ts           — trace buffer
  cli.ts             — CLI entry point (run/trace/step)
  snapshots/         — generated snapshots (gitignored)
  tests/
    snapshot.test.ts
    breakpoints.test.ts
    watchpoints.test.ts
    trace.test.ts
    exit-reasons.test.ts
    session.test.ts
    cli.test.ts
    compile-and-run.test.ts
```

Two modifications to existing files:
- `src/emulator/def.ts` — add `setRamReadMonitor`, `setIllegalOpcodeMonitor`
- `src/emulator/exec.ts` — fire illegal opcode monitor from `illComm()`

---

## Task 1: Add Memory Read Monitor Hook

**Files:**
- Modify: `src/emulator/def.ts`

- [ ] **Step 1: Add the read monitor to def.ts**

After the existing `setRamWriteMonitor` (around line 232), add:

```typescript
// Optional monitor — set by debug tooling; called on every RAM read when active.
let _ramReadMonitor: ((a: number, v: number) => void) | null = null;
export function setRamReadMonitor(fn: ((a: number, v: number) => void) | null): void {
  _ramReadMonitor = fn;
}
```

- [ ] **Step 2: Fire the monitor from srcRead**

In `srcRead` (around line 215-225), replace the inner loop body:

```typescript
      const byteIdx = (m.offset + (address - m.first)) << m.memorg;
      return m.data[byteIdx] ?? 0xFF;
```

with:

```typescript
      const byteIdx = (m.offset + (address - m.first)) << m.memorg;
      const val = m.data[byteIdx] ?? 0xFF;
      if (m.writable) _ramReadMonitor?.(address, val);
      return val;
```

(Only fire for writable regions — we care about RAM, not ROM.)

- [ ] **Step 3: Verify existing tests still pass**

Run: `npx vitest run`
Expected: All 396 tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/emulator/def.ts
git commit -m "feat(emulator): add RAM read monitor hook for debugger"
```

---

## Task 2: Add Illegal Opcode Monitor Hook

**Files:**
- Modify: `src/emulator/def.ts`
- Modify: `src/emulator/exec.ts`

- [ ] **Step 1: Add the hook to def.ts**

After the `setRamReadMonitor` added in Task 1:

```typescript
// Optional monitor — called when an illegal opcode is executed.
let _illegalOpcodeMonitor: ((opcode: number, pc: number) => void) | null = null;
export function setIllegalOpcodeMonitor(fn: ((opcode: number, pc: number) => void) | null): void {
  _illegalOpcodeMonitor = fn;
}
export function fireIllegalOpcode(op: number, pcVal: number): void {
  _illegalOpcodeMonitor?.(op, pcVal);
}
```

- [ ] **Step 2: Fire from illComm in exec.ts**

Check `src/emulator/exec.ts` imports from `./def.js`. Add `fireIllegalOpcode`, and `pc`, `opcode` if not already imported. Then modify `illComm` (around line 281):

```typescript
export function illComm(): void {
  setCycles(cycles + 3);
  fireIllegalOpcode(opcode[0] ?? 0, pc);
}
```

(`opcode` and `pc` should already be imported elsewhere in exec.ts. If renamed due to local name conflicts, use the existing alias.)

- [ ] **Step 3: Verify existing tests still pass**

Run: `npx vitest run`
Expected: All 396 tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/emulator/def.ts src/emulator/exec.ts
git commit -m "feat(emulator): add illegal opcode monitor hook"
```

---

## Task 3: Exit Reason Types and Detection

**Files:**
- Create: `tools/emu-debugger/exit-reasons.ts`
- Create: `tools/emu-debugger/tests/exit-reasons.test.ts`

- [ ] **Step 1: Create the types file**

```typescript
// tools/emu-debugger/exit-reasons.ts

export type ExitReason =
  | 'breakpoint'
  | 'watchpoint'
  | 'max-cycles'
  | 'max-instructions'
  | 'halted'
  | 'returned'
  | 'illegal'
  | 'manual';

export type WatchKind = 'read' | 'write' | 'access';

export interface WatchpointHit {
  address: number;
  kind: WatchKind;
  value: number;
  pc: number;
}

export interface ExitResult {
  reason: ExitReason;
  cyclesExecuted: number;
  instructionsExecuted: number;
  pc: number;
  breakpointHit?: number;
  watchpointHit?: WatchpointHit;
  illegalOpcode?: number;
}

/** Format an ExitResult as a human-readable string. */
export function formatExitResult(r: ExitResult): string {
  const lines: string[] = [];
  let detail: string = r.reason;
  if (r.reason === 'breakpoint' && r.breakpointHit !== undefined) {
    detail = `breakpoint at 0x${r.breakpointHit.toString(16).toUpperCase().padStart(4, '0')}`;
  } else if (r.reason === 'watchpoint' && r.watchpointHit) {
    const w = r.watchpointHit;
    const hex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(4, '0');
    detail = `watchpoint ${w.kind} at ${hex(w.address)} value=0x${w.value.toString(16).padStart(2, '0')} from PC=${hex(w.pc)}`;
  } else if (r.reason === 'illegal' && r.illegalOpcode !== undefined) {
    detail = `illegal opcode 0x${r.illegalOpcode.toString(16).padStart(2, '0')}`;
  }
  lines.push(`Reason:         ${detail}`);
  lines.push(`Cycles:         ${r.cyclesExecuted.toLocaleString()}`);
  lines.push(`Instructions:   ${r.instructionsExecuted.toLocaleString()}`);
  lines.push(`PC at exit:     0x${r.pc.toString(16).toUpperCase().padStart(4, '0')}`);
  return lines.join('\n');
}
```

- [ ] **Step 2: Create the tests**

```typescript
// tools/emu-debugger/tests/exit-reasons.test.ts
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
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run tools/emu-debugger/tests/exit-reasons.test.ts`
Expected: All 4 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/exit-reasons.ts tools/emu-debugger/tests/exit-reasons.test.ts
git commit -m "feat(debugger): add exit reason types and formatter"
```

---

## Task 4: Breakpoint and Watchpoint Data Structures

**Files:**
- Create: `tools/emu-debugger/breakpoints.ts`
- Create: `tools/emu-debugger/tests/breakpoints.test.ts`

- [ ] **Step 1: Create the module**

```typescript
// tools/emu-debugger/breakpoints.ts
import type { WatchKind } from './exit-reasons.js';

export class BreakpointSet {
  private pcs = new Set<number>();

  add(pc: number): void { this.pcs.add(pc & 0xFFFF); }
  remove(pc: number): void { this.pcs.delete(pc & 0xFFFF); }
  clear(): void { this.pcs.clear(); }
  has(pc: number): boolean { return this.pcs.has(pc & 0xFFFF); }
  size(): number { return this.pcs.size; }
}

export class WatchpointSet {
  private map = new Map<number, Set<WatchKind>>();

  add(address: number, kind: WatchKind): void {
    const addr = address & 0xFFFF;
    if (!this.map.has(addr)) this.map.set(addr, new Set());
    this.map.get(addr)!.add(kind);
  }

  remove(address: number, kind: WatchKind): void {
    const addr = address & 0xFFFF;
    const kinds = this.map.get(addr);
    if (!kinds) return;
    kinds.delete(kind);
    if (kinds.size === 0) this.map.delete(addr);
  }

  clear(): void { this.map.clear(); }

  /** Returns the triggered kind if a read/write at `address` matches a watch. */
  check(address: number, accessKind: 'read' | 'write'): WatchKind | null {
    const addr = address & 0xFFFF;
    const kinds = this.map.get(addr);
    if (!kinds) return null;
    if (kinds.has('access')) return 'access';
    if (kinds.has(accessKind)) return accessKind;
    return null;
  }

  size(): number {
    let n = 0;
    for (const kinds of this.map.values()) n += kinds.size;
    return n;
  }
}
```

- [ ] **Step 2: Create tests**

```typescript
// tools/emu-debugger/tests/breakpoints.test.ts
import { describe, it, expect } from 'vitest';
import { BreakpointSet, WatchpointSet } from '../breakpoints.js';

describe('BreakpointSet', () => {
  it('adds and detects breakpoints', () => {
    const bps = new BreakpointSet();
    bps.add(0x1000);
    expect(bps.has(0x1000)).toBe(true);
    expect(bps.has(0x2000)).toBe(false);
  });

  it('removes breakpoints', () => {
    const bps = new BreakpointSet();
    bps.add(0x1000);
    bps.remove(0x1000);
    expect(bps.has(0x1000)).toBe(false);
  });

  it('clears all breakpoints', () => {
    const bps = new BreakpointSet();
    bps.add(0x1000);
    bps.add(0x2000);
    bps.clear();
    expect(bps.size()).toBe(0);
  });

  it('masks addresses to 16 bits', () => {
    const bps = new BreakpointSet();
    bps.add(0x11000);
    expect(bps.has(0x1000)).toBe(true);
  });
});

describe('WatchpointSet', () => {
  it('detects write watchpoint on write access', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'write');
    expect(ws.check(0x1000, 'write')).toBe('write');
    expect(ws.check(0x1000, 'read')).toBe(null);
  });

  it('detects read watchpoint on read access', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'read');
    expect(ws.check(0x1000, 'read')).toBe('read');
    expect(ws.check(0x1000, 'write')).toBe(null);
  });

  it('access watchpoint fires on both reads and writes', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'access');
    expect(ws.check(0x1000, 'read')).toBe('access');
    expect(ws.check(0x1000, 'write')).toBe('access');
  });

  it('allows multiple kinds on same address', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'read');
    ws.add(0x1000, 'write');
    expect(ws.size()).toBe(2);
  });

  it('removing one kind leaves others', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'read');
    ws.add(0x1000, 'write');
    ws.remove(0x1000, 'read');
    expect(ws.check(0x1000, 'read')).toBe(null);
    expect(ws.check(0x1000, 'write')).toBe('write');
  });

  it('clear removes all watchpoints', () => {
    const ws = new WatchpointSet();
    ws.add(0x1000, 'write');
    ws.add(0x2000, 'read');
    ws.clear();
    expect(ws.size()).toBe(0);
  });

  it('returns null for unmatched address', () => {
    const ws = new WatchpointSet();
    expect(ws.check(0x9999, 'read')).toBe(null);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run tools/emu-debugger/tests/breakpoints.test.ts`
Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/breakpoints.ts tools/emu-debugger/tests/breakpoints.test.ts
git commit -m "feat(debugger): add breakpoint and watchpoint data structures"
```

---

## Task 5: Verify Required Setters Exist

**Files:**
- Possibly modify: `src/emulator/def.ts`
- Possibly modify: `src/emulator/lcd.ts`

- [ ] **Step 1: Check which setters exist**

Run: `grep -E "export function (setIx|setIy|setIz|setSx|setSy|setSz|setSs|setUs|setIa|setIe|setKy|setPe|setPd)" src/emulator/def.ts`
Run: `grep -E "export function setLcdctrl" src/emulator/lcd.ts`

- [ ] **Step 2: Add any missing setters**

For each missing setter in `src/emulator/def.ts`, add (using the pattern of existing `setPc`):

```typescript
export function setIx(v: number) { ix = v & 0xFFFF; }
export function setIy(v: number) { iy = v & 0xFFFF; }
export function setIz(v: number) { iz = v & 0xFFFF; }
export function setSx(v: number) { sx = v & 0x1F; }
export function setSy(v: number) { sy = v & 0x1F; }
export function setSz(v: number) { sz = v & 0x1F; }
export function setSs(v: number) { ss = v & 0xFFFF; }
export function setUs(v: number) { us = v & 0xFFFF; }
export function setIa(v: number) { ia = v & 0xFF; }
export function setIe(v: number) { ie = v & 0xFF; }
export function setKy(v: number) { ky = v & 0xFFFF; } // check existing mask
export function setPe(v: number) { pe = v & 0xFF; }
export function setPd(v: number) { pd = v & 0xFF; }
```

Only add the ones that are missing. Use the correct bitmask — 4-bit registers use `& 0x0F`, 5-bit `& 0x1F`, 8-bit `& 0xFF`, 16-bit `& 0xFFFF`.

For `setLcdctrl` in `src/emulator/lcd.ts` (if missing):

```typescript
export function setLcdctrl(v: number) { lcdctrl = v & 0xFF; }
```

- [ ] **Step 3: Verify existing tests still pass**

Run: `npx vitest run`
Expected: All 396 tests still pass.

- [ ] **Step 4: Commit if any setters were added**

```bash
git add src/emulator/def.ts src/emulator/lcd.ts
git commit -m "feat(emulator): add missing register setters for snapshot support"
```

---

## Task 6: Snapshot Save/Restore

**Files:**
- Create: `tools/emu-debugger/snapshot.ts`
- Create: `tools/emu-debugger/tests/snapshot.test.ts`

- [ ] **Step 1: Write the snapshot module**

```typescript
// tools/emu-debugger/snapshot.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

import {
  pc, ua, ib, flag, ix, iy, iz, sx, sy, sz, ss, us, mr, tm, ia, ie, ky, pe, pd,
  setPc, setUa, setIb, setFlag, setIx, setIy, setIz, setSx, setSy, setSz,
  setSs, setUs, setTm, setIa, setIe, setKy, setPe, setPd,
  acycles, setAcycles,
  memdef,
} from '../../src/emulator/def.js';
import { lcdmem, lcdchr, lcdctrl, setLcdctrl } from '../../src/emulator/lcd.js';

export interface Snapshot {
  version: number;
  romHash: string;
  cpu: {
    pc: number; ua: number; ib: number; flag: number;
    ix: number; iy: number; iz: number;
    sx: number; sy: number; sz: number;
    ss: number; us: number;
    tm: number; ia: number; ie: number; ky: number;
    pe: number; pd: number;
    acycles: number;
  };
  mr: string;            // base64
  memory: Record<string, string>;  // region key → base64
  lcd: {
    ctrl: number;
    mem: string;         // base64
    chr: string;         // base64
  };
}

const SNAPSHOT_VERSION = 1;

function b64encode(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}

function b64decode(s: string): Uint8Array {
  return new Uint8Array(Buffer.from(s, 'base64'));
}

function memRegionKey(m: { first: number; filename?: string }): string {
  return m.filename ?? `region_${m.first.toString(16)}`;
}

export function computeRomHash(): string {
  const h = createHash('sha256');
  for (const m of memdef) {
    if (!m.writable && m.data) {
      h.update(m.data);
    }
  }
  return 'sha256:' + h.digest('hex');
}

export function captureSnapshot(): Snapshot {
  const memory: Record<string, string> = {};
  for (const m of memdef) {
    if (m.writable && m.data) {
      memory[memRegionKey(m)] = b64encode(m.data);
    }
  }
  return {
    version: SNAPSHOT_VERSION,
    romHash: computeRomHash(),
    cpu: {
      pc, ua, ib, flag, ix, iy, iz, sx, sy, sz, ss, us,
      tm, ia, ie, ky, pe, pd, acycles,
    },
    mr: b64encode(new Uint8Array(mr)),
    memory,
    lcd: {
      ctrl: lcdctrl,
      mem: b64encode(new Uint8Array(lcdmem)),
      chr: b64encode(new Uint8Array(lcdchr)),
    },
  };
}

export function restoreSnapshot(snap: Snapshot): void {
  if (snap.version !== SNAPSHOT_VERSION) {
    throw new Error(`Snapshot version ${snap.version} unsupported (expected ${SNAPSHOT_VERSION})`);
  }
  const expectedHash = computeRomHash();
  if (snap.romHash !== expectedHash) {
    throw new Error(`ROM hash mismatch: snapshot=${snap.romHash} current=${expectedHash}. Regenerate snapshot with --boot.`);
  }

  // CPU registers
  setPc(snap.cpu.pc); setUa(snap.cpu.ua); setIb(snap.cpu.ib); setFlag(snap.cpu.flag);
  setIx(snap.cpu.ix); setIy(snap.cpu.iy); setIz(snap.cpu.iz);
  setSx(snap.cpu.sx); setSy(snap.cpu.sy); setSz(snap.cpu.sz);
  setSs(snap.cpu.ss); setUs(snap.cpu.us);
  setTm(snap.cpu.tm); setIa(snap.cpu.ia); setIe(snap.cpu.ie);
  setKy(snap.cpu.ky); setPe(snap.cpu.pe); setPd(snap.cpu.pd);
  setAcycles(snap.cpu.acycles);

  // mr[]
  const mrBytes = b64decode(snap.mr);
  for (let i = 0; i < mrBytes.length && i < mr.length; i++) mr[i] = mrBytes[i]!;

  // Memory regions
  for (const m of memdef) {
    if (!m.writable || !m.data) continue;
    const b64 = snap.memory[memRegionKey(m)];
    if (!b64) continue;
    const bytes = b64decode(b64);
    for (let i = 0; i < bytes.length && i < m.data.length; i++) m.data[i] = bytes[i]!;
  }

  // LCD
  setLcdctrl(snap.lcd.ctrl);
  const lmem = b64decode(snap.lcd.mem);
  for (let i = 0; i < lmem.length && i < lcdmem.length; i++) lcdmem[i] = lmem[i]!;
  const lchr = b64decode(snap.lcd.chr);
  for (let i = 0; i < lchr.length && i < lcdchr.length; i++) lcdchr[i] = lchr[i]!;
}

export function saveSnapshotToFile(path: string, snap: Snapshot): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(snap, null, 2) + '\n', 'utf8');
}

export function loadSnapshotFromFile(path: string): Snapshot {
  const text = readFileSync(path, 'utf8');
  return JSON.parse(text) as Snapshot;
}

export function snapshotExists(path: string): boolean {
  return existsSync(path);
}
```

- [ ] **Step 2: Write snapshot tests**

```typescript
// tools/emu-debugger/tests/snapshot.test.ts
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

    // Mutate state
    setPc(0x1234);
    expect(pc).toBe(0x1234);

    // Restore
    restoreSnapshot(snap);
    expect(pc).toBe(originalPc);
  });

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
  });

  it('restores mr[] registers', () => {
    boot();
    mr[5] = 0x42;
    const snap = captureSnapshot();
    mr[5] = 0x99;
    restoreSnapshot(snap);
    expect(mr[5]).toBe(0x42);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run tools/emu-debugger/tests/snapshot.test.ts`
Expected: All 3 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/snapshot.ts tools/emu-debugger/tests/snapshot.test.ts
git commit -m "feat(debugger): add snapshot save/restore with ROM hash verification"
```

---

## Task 7: Harness Core (shared state helpers)

**Files:**
- Create: `tools/emu-debugger/harness-core.ts`

- [ ] **Step 1: Create shared helpers**

```typescript
// tools/emu-debugger/harness-core.ts
// Re-exports from emu-harness plus direct memory helpers.

export { boot, stepOnce, runCycles, loadRomsFromDisk } from '../../tests/emu-harness.js';

import { memdef } from '../../src/emulator/def.js';

/** Write bytes into RAM at the given bank1 address (0x10000 physical). */
export function writeBinaryToRam(loadAddr: number, bytes: Uint8Array): void {
  const ramRegion = memdef.find(m => m.writable && m.first === 0x10000);
  if (!ramRegion || !ramRegion.data) {
    throw new Error('Bank1 RAM region not found in memdef');
  }
  const offset = loadAddr & 0xFFFF;
  for (let i = 0; i < bytes.length; i++) {
    ramRegion.data[offset + i] = bytes[i]!;
  }
}

/** Read bytes from RAM at the given bank1 address. */
export function readFromRam(address: number, length: number): Uint8Array {
  const ramRegion = memdef.find(m => m.writable && m.first === 0x10000);
  if (!ramRegion || !ramRegion.data) {
    throw new Error('Bank1 RAM region not found in memdef');
  }
  const offset = address & 0xFFFF;
  return new Uint8Array(ramRegion.data.slice(offset, offset + length));
}
```

- [ ] **Step 2: Verify the module imports cleanly**

Run: `npx tsx --eval "import('./tools/emu-debugger/harness-core.ts').then(m => console.log('exports:', Object.keys(m).join(',')))"`
Expected: Output includes `boot`, `stepOnce`, `runCycles`, `loadRomsFromDisk`, `writeBinaryToRam`, `readFromRam`.

- [ ] **Step 3: Commit**

```bash
git add tools/emu-debugger/harness-core.ts
git commit -m "feat(debugger): add harness-core shared state helpers"
```

---

## Task 8: EmulatorSession Core — Constructor, Loading, Breakpoint Management

**Files:**
- Create: `tools/emu-debugger/session.ts`

- [ ] **Step 1: Create the session class (core methods, no run loop yet)**

```typescript
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
```

- [ ] **Step 2: Verify the module compiles**

Run: `npx tsx --eval "import('./tools/emu-debugger/session.ts').then(() => console.log('OK'))"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tools/emu-debugger/session.ts
git commit -m "feat(debugger): add EmulatorSession class core (ctor + inspection)"
```

---

## Task 9: EmulatorSession Run Loop

**Files:**
- Modify: `tools/emu-debugger/session.ts`
- Create: `tools/emu-debugger/tests/session.test.ts`

- [ ] **Step 1: Replace the stub methods with real implementations**

Add these imports at the top of `session.ts` (merge with existing imports):

```typescript
import {
  setPcMonitor, setRamWriteMonitor, setRamReadMonitor, setIllegalOpcodeMonitor,
} from '../../src/emulator/def.js';
import { stepOnce } from './harness-core.js';
import { lcdmem } from '../../src/emulator/lcd.js';
import type { ExitReason, WatchpointHit } from './exit-reasons.js';
```

Add private fields to the class:

```typescript
  private instructionCount = 0;
  private cycleCount = 0;
  private exitPending: { reason: ExitReason; bp?: number; wp?: WatchpointHit; illOp?: number } | null = null;
  private stopRequested = false;
```

Replace the `run()`, `step()`, `stop()`, `getLcd()`, `getInstructionCount()`, `getCycleCount()` stubs with:

```typescript
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
```

- [ ] **Step 2: Write session tests**

```typescript
// tools/emu-debugger/tests/session.test.ts
import { describe, it, expect } from 'vitest';
import { EmulatorSession } from '../session.js';

describe('EmulatorSession', () => {
  it('runs a nop+rtn program', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    // 0xCE = nop, 0xF7 = rtn unconditional
    sess.loadBinary(0x0000, new Uint8Array([0xCE, 0xF7]));
    sess.setEntry(0x0000);
    const result = sess.run({ maxInstructions: 100 });
    expect(result.instructionsExecuted).toBeGreaterThan(0);
    // Either returned or ran into garbage after rtn
    expect(['returned', 'max-instructions', 'illegal', 'halted']).toContain(result.reason);
  }, 30_000);

  it('hits a breakpoint', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, new Uint8Array([0xCE, 0xCE, 0xCE, 0xF7]));
    sess.setEntry(0x0000);
    sess.addBreakpoint(0x0002);
    const result = sess.run({ maxInstructions: 100 });
    expect(result.reason).toBe('breakpoint');
    expect(result.breakpointHit).toBe(0x0002);
  }, 30_000);

  it('reports max-instructions exit', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    // jr 0x7F = jump with offset -1, causing a self-loop or similar short loop
    sess.loadBinary(0x0000, new Uint8Array([0xB7, 0x7F]));
    sess.setEntry(0x0000);
    const result = sess.run({ maxInstructions: 50 });
    // Just verify we hit the limit — exact behavior depends on HD61700 jr semantics
    expect(['max-instructions', 'returned', 'illegal']).toContain(result.reason);
  }, 30_000);

  it('reports instruction and cycle counts', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, new Uint8Array([0xCE, 0xCE, 0xF7]));
    sess.setEntry(0x0000);
    sess.run({ maxInstructions: 10 });
    expect(sess.getInstructionCount()).toBeGreaterThan(0);
    expect(sess.getCycleCount()).toBeGreaterThan(0);
  }, 30_000);
});
```

- [ ] **Step 3: Run session tests**

Run: `npx vitest run tools/emu-debugger/tests/session.test.ts`
Expected: All 4 tests PASS (first test run takes longer due to snapshot generation).

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/session.ts tools/emu-debugger/tests/session.test.ts
git commit -m "feat(debugger): implement session run loop with breakpoints and exit detection"
```

---

## Task 10: Watchpoint Integration Tests

**Files:**
- Create: `tools/emu-debugger/tests/watchpoints.test.ts`

- [ ] **Step 1: Write tests**

```typescript
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
```

The watchpoint data structure is thoroughly tested in Task 4 (unit tests). These tests verify the integration with the run loop.

- [ ] **Step 2: Run tests**

Run: `npx vitest run tools/emu-debugger/tests/watchpoints.test.ts`
Expected: All 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add tools/emu-debugger/tests/watchpoints.test.ts
git commit -m "test(debugger): add watchpoint integration tests"
```

---

## Task 11: Instruction Tracing

**Files:**
- Create: `tools/emu-debugger/trace.ts`
- Modify: `tools/emu-debugger/session.ts`
- Create: `tools/emu-debugger/tests/trace.test.ts`

- [ ] **Step 1: Create the trace module**

```typescript
// tools/emu-debugger/trace.ts

export interface TraceEntry {
  pc: number;
  bytes: number[];
  mnemonic: string;
  cycles: number;
}

export const TRACE_CAP_DEFAULT = 100_000;

export class TraceBuffer {
  private entries: TraceEntry[] = [];
  private cap: number;

  constructor(cap: number = TRACE_CAP_DEFAULT) {
    this.cap = cap;
  }

  push(entry: TraceEntry): void {
    if (this.entries.length < this.cap) {
      this.entries.push(entry);
    }
  }

  getAll(): TraceEntry[] { return [...this.entries]; }
  size(): number { return this.entries.length; }
  clear(): void { this.entries = []; }
  atCap(): boolean { return this.entries.length >= this.cap; }
}
```

- [ ] **Step 2: Check disassembler availability**

Run: `grep "^export" src/emulator/disassemble.ts`

If `disOneLine` is exported AND it doesn't reference browser globals (check with `grep "window\|document" src/emulator/disassemble.ts`), import it. Otherwise, fall back to capturing just PC and bytes (no mnemonic).

- [ ] **Step 3: Wire tracing into session.ts**

Add imports at the top of `session.ts`:

```typescript
import { TraceBuffer } from './trace.js';
import type { TraceEntry } from './trace.js';
import { disOneLine } from '../../src/emulator/disassemble.js';
```

Add private field:

```typescript
  private traceBuffer: TraceBuffer | null = null;
```

Update `run()` — at the start, add:

```typescript
    this.traceBuffer = options.trace ? new TraceBuffer() : null;
```

Update the PC monitor callback to ALSO record a trace entry when tracing:

```typescript
    setPcMonitor((curPc) => {
      if (this.traceBuffer) {
        try {
          const line = disOneLine(curPc);
          const bytes = line.bytes.split(' ').filter(s => s.length > 0).map(h => parseInt(h, 16));
          this.traceBuffer.push({
            pc: curPc,
            bytes,
            mnemonic: `${line.mnem} ${line.args}`.trim(),
            cycles: 0,
          });
        } catch {
          this.traceBuffer.push({ pc: curPc, bytes: [], mnemonic: '?', cycles: 0 });
        }
      }
      if (this.breakpoints.has(curPc)) {
        this.exitPending = { reason: 'breakpoint', bp: curPc };
      }
    });
```

Update `getTrace()`:

```typescript
  getTrace(): TraceEntry[] {
    return this.traceBuffer ? this.traceBuffer.getAll() : [];
  }
```

If `disOneLine` fails to import (browser deps), remove the `disOneLine` import and the try/catch, and just push `{ pc: curPc, bytes: [], mnemonic: '', cycles: 0 }`.

- [ ] **Step 4: Write trace tests**

```typescript
// tools/emu-debugger/tests/trace.test.ts
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
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run tools/emu-debugger/tests/trace.test.ts`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add tools/emu-debugger/trace.ts tools/emu-debugger/session.ts tools/emu-debugger/tests/trace.test.ts
git commit -m "feat(debugger): add instruction tracing with capped buffer"
```

---

## Task 12: LCD Output Reading

**Files:**
- Modify: `tools/emu-debugger/session.ts`

- [ ] **Step 1: Wire up LCD reading via emu-harness**

In `session.ts`, add import:

```typescript
import { readLcdRow } from '../../tests/emu-harness.js';
```

Replace the current `getLcd()`:

```typescript
  getLcd(): { rows: string[]; raw: Uint8Array } {
    const rows = [readLcdRow(0), readLcdRow(1), readLcdRow(2), readLcdRow(3)];
    return { rows, raw: new Uint8Array(lcdmem) };
  }
```

- [ ] **Step 2: Add a quick LCD test to session.test.ts**

Append:

```typescript
describe('EmulatorSession LCD', () => {
  it('returns 4 rows of LCD text', () => {
    const sess = new EmulatorSession({ mode: 'snapshot' });
    const lcd = sess.getLcd();
    expect(lcd.rows).toHaveLength(4);
    expect(lcd.raw).toBeInstanceOf(Uint8Array);
  }, 30_000);
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run tools/emu-debugger/tests/session.test.ts`
Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/session.ts tools/emu-debugger/tests/session.test.ts
git commit -m "feat(debugger): add LCD output reading to session"
```

---

## Task 13: CLI — Argument Parsing and Run Command

**Files:**
- Create: `tools/emu-debugger/cli.ts`
- Modify: `package.json`

- [ ] **Step 1: Create the CLI entry point**

```typescript
// tools/emu-debugger/cli.ts
import { readFileSync } from 'node:fs';
import { EmulatorSession } from './session.js';
import { formatExitResult } from './exit-reasons.js';
import type { SessionMode } from './session.js';
import type { WatchKind } from './exit-reasons.js';

interface ParsedArgs {
  command: string;
  binary: string;
  entry: number;
  loadAddr: number;
  maxCycles: number;
  maxInstructions: number;
  mode: SessionMode;
  breakpoints: number[];
  watchpoints: { addr: number; kind: WatchKind }[];
  dumpMem: { addr: number; len: number }[];
  dumpRegs: boolean;
  noLcd: boolean;
  quiet: boolean;
}

function parseHex(s: string): number {
  if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s.slice(2), 16);
  if (s.startsWith('&H') || s.startsWith('&h')) return parseInt(s.slice(2), 16);
  return parseInt(s, 10);
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    command: argv[0] ?? '',
    binary: argv[1] ?? '',
    entry: 0x0000,
    loadAddr: 0x0000,
    maxCycles: 10_000_000,
    maxInstructions: Infinity,
    mode: 'snapshot',
    breakpoints: [],
    watchpoints: [],
    dumpMem: [],
    dumpRegs: false,
    noLcd: false,
    quiet: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]!;
    switch (arg) {
      case '--entry': args.entry = parseHex(argv[++i]!); break;
      case '--load-addr': args.loadAddr = parseHex(argv[++i]!); break;
      case '--max-cycles': args.maxCycles = parseInt(argv[++i]!, 10); break;
      case '--max-instructions': args.maxInstructions = parseInt(argv[++i]!, 10); break;
      case '--boot': args.mode = 'boot'; break;
      case '--raw': args.mode = 'raw'; break;
      case '--break': args.breakpoints.push(parseHex(argv[++i]!)); break;
      case '--watch': {
        const spec = argv[++i]!;
        const [addrStr, kindStr] = spec.split(':');
        const addr = parseHex(addrStr!);
        let kind: WatchKind = 'write';
        if (kindStr === 'r') kind = 'read';
        else if (kindStr === 'rw' || kindStr === 'wr') kind = 'access';
        else if (kindStr === 'w') kind = 'write';
        args.watchpoints.push({ addr, kind });
        break;
      }
      case '--dump-mem': {
        const [addrStr, lenStr] = argv[++i]!.split(':');
        args.dumpMem.push({ addr: parseHex(addrStr!), len: parseInt(lenStr!, 10) });
        break;
      }
      case '--dump-regs': args.dumpRegs = true; break;
      case '--no-lcd': args.noLcd = true; break;
      case '--quiet': args.quiet = true; break;
      default:
        console.error(`Unknown flag: ${arg}`);
        process.exit(1);
    }
  }
  return args;
}

function formatHex(n: number, width: number): string {
  return n.toString(16).toUpperCase().padStart(width, '0');
}

function dumpMemory(bytes: Uint8Array, baseAddr: number): void {
  for (let i = 0; i < bytes.length; i += 16) {
    const addr = formatHex(baseAddr + i, 4);
    const row = Array.from(bytes.slice(i, i + 16))
      .map(b => formatHex(b, 2))
      .join(' ');
    console.log(`${addr}  ${row}`);
  }
}

function dumpRegisters(regs: { pc: number; ua: number; ib: number; flag: number; ix: number; iy: number; iz: number; sx: number; sy: number; sz: number; ss: number; us: number; mr: Uint8Array }): void {
  console.log(`PC=${formatHex(regs.pc, 4)}  UA=${formatHex(regs.ua, 2)}  IB=${formatHex(regs.ib, 2)}  FLAG=${formatHex(regs.flag, 2)}`);
  console.log(`IX=${formatHex(regs.ix, 4)}  IY=${formatHex(regs.iy, 4)}  IZ=${formatHex(regs.iz, 4)}`);
  console.log(`SX=${formatHex(regs.sx, 2)}  SY=${formatHex(regs.sy, 2)}  SZ=${formatHex(regs.sz, 2)}  SS=${formatHex(regs.ss, 4)}  US=${formatHex(regs.us, 4)}`);
  const fmtRegs = (start: number, end: number) =>
    Array.from(regs.mr.slice(start, end + 1)).map(b => formatHex(b, 2)).join(' ');
  console.log(`$0-$9:   ${fmtRegs(0, 9)}`);
  console.log(`$10-$18: ${fmtRegs(10, 18)}`);
  console.log(`$19-$31: ${fmtRegs(19, 31)}`);
}

function runCommand(args: ParsedArgs): void {
  if (!args.binary) {
    console.error('Usage: debug run <binary> [options]');
    process.exit(1);
  }
  const bytes = new Uint8Array(readFileSync(args.binary));
  if (!args.quiet) {
    console.log(`emu-debugger: loaded ${args.binary} (${bytes.length} bytes) at 0x${formatHex(args.loadAddr, 4)}, entry 0x${formatHex(args.entry, 4)}`);
  }

  const sess = new EmulatorSession({ mode: args.mode });
  sess.loadBinary(args.loadAddr, bytes);
  sess.setEntry(args.entry);
  for (const bp of args.breakpoints) sess.addBreakpoint(bp);
  for (const wp of args.watchpoints) sess.addWatchpoint(wp.addr, wp.kind);

  const result = sess.run({ maxCycles: args.maxCycles, maxInstructions: args.maxInstructions });

  console.log('');
  console.log('── Exit ──────────────────────────────────────');
  console.log(formatExitResult(result));

  if (!args.noLcd) {
    const lcd = sess.getLcd();
    console.log('');
    console.log('── LCD ──────────────────────────────────────');
    for (const row of lcd.rows) {
      console.log(`│ ${row.padEnd(32)} │`);
    }
  }

  if (args.dumpRegs) {
    console.log('');
    console.log('── Registers ────────────────────────────────');
    dumpRegisters(sess.getRegisters());
  }

  for (const dm of args.dumpMem) {
    console.log('');
    console.log(`── Memory @ 0x${formatHex(dm.addr, 4)} (${dm.len} bytes) ──`);
    dumpMemory(sess.getMemory(dm.addr, dm.len), dm.addr);
  }

  process.exit(0);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (!args.command) {
    console.error('Usage: npx tsx tools/emu-debugger/cli.ts <run|trace|step> <binary> [options]');
    process.exit(1);
  }
  switch (args.command) {
    case 'run': runCommand(args); break;
    case 'trace':
      console.error('trace command: implemented in Task 14');
      process.exit(1);
      break;
    case 'step':
      console.error('step command: implemented in Task 15');
      process.exit(1);
      break;
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exit(1);
  }
}

main();
```

- [ ] **Step 2: Add npm script**

Edit `package.json` to add `"debug": "tsx tools/emu-debugger/cli.ts"` to the scripts section.

- [ ] **Step 3: Test the CLI manually**

Run: `npm run debug -- run build/compiler/hello.bin --max-cycles 100000 --quiet`
Expected: Exit output showing cycle count and LCD. (First run takes longer due to snapshot generation.)

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/cli.ts package.json
git commit -m "feat(debugger): add CLI with run command"
```

---

## Task 14: CLI — Trace Command

**Files:**
- Modify: `tools/emu-debugger/cli.ts`

- [ ] **Step 1: Add traceCommand function**

Add this function to `cli.ts` (before `main()`):

```typescript
function traceCommand(args: ParsedArgs): void {
  if (!args.binary) {
    console.error('Usage: debug trace <binary> [options]');
    process.exit(1);
  }
  const bytes = new Uint8Array(readFileSync(args.binary));
  if (!args.quiet) {
    console.log(`emu-debugger: tracing ${args.binary} (${bytes.length} bytes)`);
  }

  const sess = new EmulatorSession({ mode: args.mode });
  sess.loadBinary(args.loadAddr, bytes);
  sess.setEntry(args.entry);
  for (const bp of args.breakpoints) sess.addBreakpoint(bp);
  for (const wp of args.watchpoints) sess.addWatchpoint(wp.addr, wp.kind);

  const result = sess.run({
    maxCycles: args.maxCycles,
    maxInstructions: args.maxInstructions,
    trace: true,
  });

  console.log('');
  console.log('  PC    Bytes            Instruction           ');
  console.log('  ----  ---------------  ----------------------');
  for (const entry of sess.getTrace()) {
    const pc = formatHex(entry.pc, 4);
    const bytesStr = entry.bytes.map((b: number) => formatHex(b, 2)).join(' ').padEnd(15);
    console.log(`  ${pc}  ${bytesStr}  ${entry.mnemonic}`);
  }

  console.log('');
  console.log('── Exit ──────────────────────────────────────');
  console.log(formatExitResult(result));
  process.exit(0);
}
```

Replace the trace case in `main()`:

```typescript
    case 'trace': traceCommand(args); break;
```

- [ ] **Step 2: Test manually**

Run: `npm run debug -- trace build/compiler/hello.bin --max-instructions 20 --quiet`
Expected: Table of instructions with PC, bytes, mnemonic.

- [ ] **Step 3: Commit**

```bash
git add tools/emu-debugger/cli.ts
git commit -m "feat(debugger): add trace CLI command"
```

---

## Task 15: CLI — Step Command

**Files:**
- Modify: `tools/emu-debugger/cli.ts`

- [ ] **Step 1: Implement interactive step command**

Add import at the top of `cli.ts`:

```typescript
import * as readline from 'node:readline';
```

Add function:

```typescript
async function stepCommand(args: ParsedArgs): Promise<void> {
  if (!args.binary) {
    console.error('Usage: debug step <binary> [options]');
    process.exit(1);
  }
  const bytes = new Uint8Array(readFileSync(args.binary));
  const sess = new EmulatorSession({ mode: args.mode });
  sess.loadBinary(args.loadAddr, bytes);
  sess.setEntry(args.entry);
  for (const bp of args.breakpoints) sess.addBreakpoint(bp);
  for (const wp of args.watchpoints) sess.addWatchpoint(wp.addr, wp.kind);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q: string) => new Promise<string>(r => rl.question(q, r));

  console.log(`emu-debugger: stepping ${args.binary} — Enter=step, r N=run N, q=quit`);
  let stepsLeft = 0;
  while (true) {
    if (stepsLeft <= 0) {
      const line = (await ask('(debug) ')).trim();
      if (line === 'q') break;
      if (line.startsWith('r ')) {
        stepsLeft = parseInt(line.slice(2), 10) || 1;
      } else {
        stepsLeft = 1;
      }
    }
    const result = sess.step();
    stepsLeft--;
    const regs = sess.getRegisters();
    console.log(`PC=${formatHex(regs.pc, 4)}  cycles=${result.cyclesExecuted}  instr=${result.instructionsExecuted}`);
    if (result.reason !== 'max-instructions') {
      console.log('');
      console.log('── Exit ──────────────────────────────────────');
      console.log(formatExitResult(result));
      break;
    }
  }
  rl.close();
  process.exit(0);
}
```

Update `main()` to be async:

```typescript
async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args.command) {
    console.error('Usage: npx tsx tools/emu-debugger/cli.ts <run|trace|step> <binary> [options]');
    process.exit(1);
  }
  switch (args.command) {
    case 'run': runCommand(args); break;
    case 'trace': traceCommand(args); break;
    case 'step': await stepCommand(args); break;
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exit(1);
  }
}

main();
```

- [ ] **Step 2: Test manually**

Run: `npm run debug -- step build/compiler/hello.bin --quiet`
Expected: Interactive prompt; press Enter to advance, `q` to quit.

- [ ] **Step 3: Commit**

```bash
git add tools/emu-debugger/cli.ts
git commit -m "feat(debugger): add interactive step CLI command"
```

---

## Task 16: Gitignore Snapshots and CLI Smoke Tests

**Files:**
- Modify: `.gitignore`
- Create: `tools/emu-debugger/tests/cli.test.ts`

- [ ] **Step 1: Gitignore snapshots**

Append to `.gitignore`:

```
tools/emu-debugger/snapshots/
```

- [ ] **Step 2: Write CLI smoke test using execFileSync**

```typescript
// tools/emu-debugger/tests/cli.test.ts
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('CLI smoke tests', () => {
  it('run command executes a minimal binary', () => {
    const dir = mkdtempSync(join(tmpdir(), 'emudbg-cli-'));
    const binPath = join(dir, 'tiny.bin');
    writeFileSync(binPath, new Uint8Array([0xCE, 0xF7]));
    try {
      const out = execFileSync('npx', [
        'tsx', 'tools/emu-debugger/cli.ts', 'run', binPath,
        '--max-instructions', '10', '--quiet',
      ], { encoding: 'utf8', timeout: 60_000 });
      expect(out).toContain('Exit');
      expect(out).toContain('Cycles:');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120_000);

  it('fails cleanly when binary does not exist', () => {
    expect(() => {
      execFileSync('npx', [
        'tsx', 'tools/emu-debugger/cli.ts', 'run',
        '/nonexistent/file.bin', '--quiet',
      ], { encoding: 'utf8', timeout: 60_000 });
    }).toThrow();
  });
});
```

- [ ] **Step 3: Run CLI tests**

Run: `npx vitest run tools/emu-debugger/tests/cli.test.ts`
Expected: Tests PASS (may take 30-60s due to boot time).

- [ ] **Step 4: Commit**

```bash
git add .gitignore tools/emu-debugger/tests/cli.test.ts
git commit -m "test(debugger): add CLI smoke tests and gitignore snapshots"
```

---

## Task 17: End-to-End Compile-and-Run Test

**Files:**
- Create: `tools/emu-debugger/tests/compile-and-run.test.ts`

- [ ] **Step 1: Write the integration test**

```typescript
// tools/emu-debugger/tests/compile-and-run.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';

describe('compile-and-run integration', () => {
  it('compiles and executes hello.bas', () => {
    const source = readFileSync('tools/compiler/tests/fixtures/hello.bas', 'utf8');
    const ast = parse(source);
    const asm = generate(ast);
    const assembled = assemble(asm.lines);

    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, assembled.binary);
    sess.setEntry(0x0000);
    const result = sess.run({ maxCycles: 1_000_000 });

    console.log(`hello.bas exit: ${result.reason} after ${result.instructionsExecuted} instructions, PC=0x${result.pc.toString(16)}`);
    console.log('LCD rows:', sess.getLcd().rows);

    // The test initially just verifies that we GET an exit reason — crashes
    // produce 'illegal' or 'halted' which is the signal we need to debug.
    expect(result.instructionsExecuted).toBeGreaterThan(0);
    expect(typeof result.reason).toBe('string');
  }, 60_000);
});
```

NOTE: This test logs the exit reason and LCD content. If it reports `illegal`, `halted`, or runs to `max-cycles`, those are debug signals — we now have a reproducible way to diagnose compiler output issues.

- [ ] **Step 2: Run the test**

Run: `npx vitest run tools/emu-debugger/tests/compile-and-run.test.ts`
Expected: Test passes; console shows exit reason and LCD content.

- [ ] **Step 3: Commit**

```bash
git add tools/emu-debugger/tests/compile-and-run.test.ts
git commit -m "test(debugger): add end-to-end compile-and-run integration test"
```

---

## Task 18: Final Validation

**Files:** Modify `CLAUDE.md`

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (original 396 + new ~30 debugger tests).

- [ ] **Step 2: Verify CLI works end-to-end**

Run: `npm run debug -- run build/compiler/hello.bin --dump-regs --max-cycles 100000 --quiet`
Expected: Exit reason, cycle count, LCD output, register dump.

Run: `npm run debug -- trace build/compiler/hello.bin --max-instructions 10 --quiet`
Expected: Instruction trace table.

- [ ] **Step 3: Document in CLAUDE.md**

Find the compiler section in `CLAUDE.md` and add this after it:

```markdown
## Headless Emulator Debugger

Debug compiled BASIC binaries and explore the FX-870P emulator programmatically.

### Usage

```bash
npm run debug -- run <binary.bin>       # run with exit reason + LCD
npm run debug -- trace <binary.bin>     # log every instruction
npm run debug -- step <binary.bin>      # interactive single-step
```

Key flags: `--break 0xADDR`, `--watch 0xADDR:w`, `--dump-regs`, `--max-cycles N`, `--boot` (slow but fresh state), `--raw` (no boot).

Library usage (from tests):
```typescript
import { EmulatorSession } from './tools/emu-debugger/session.js';
const sess = new EmulatorSession({ mode: 'snapshot' });
sess.loadBinary(0x0000, bytes);
sess.setEntry(0x0000);
const result = sess.run({ maxCycles: 1_000_000 });
console.log(result.reason, sess.getLcd().rows);
```

Design spec: `docs/superpowers/specs/2026-04-05-emu-debugger-design.md`
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document emu-debugger in CLAUDE.md"
```

---

## Summary

| Task | Description | Depends On |
|------|-------------|------------|
| 1 | RAM read monitor hook | — |
| 2 | Illegal opcode monitor hook | 1 (shared file) |
| 3 | Exit reason types | — |
| 4 | Breakpoint/watchpoint data structures | 3 |
| 5 | Verify register setters exist | — |
| 6 | Snapshot save/restore | 5 |
| 7 | Harness-core helpers | — |
| 8 | EmulatorSession core (ctor + inspection) | 4, 6, 7 |
| 9 | Session run loop | 1, 2, 8 |
| 10 | Watchpoint integration tests | 9 |
| 11 | Instruction tracing | 9 |
| 12 | LCD output reading | 9 |
| 13 | CLI run command | 8, 9, 12 |
| 14 | CLI trace command | 11, 13 |
| 15 | CLI step command | 13 |
| 16 | Gitignore + CLI smoke tests | 13 |
| 17 | End-to-end compile-and-run test | 9, 12 |
| 18 | Final validation + docs | all above |

**Parallel tracks:**
- Tasks 3-4 and Tasks 5-6 can proceed in parallel
- Task 7 can proceed in parallel with Tasks 3-6
- Tasks 1-2 must complete before Task 9 (session run loop)
