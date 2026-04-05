# Headless Emulator Debugger — Design Specification

> Created: 2026-04-05
> Status: Approved
> Scope: Library + CLI for headless FX-870P emulator debugging

## Overview

A general-purpose headless debugger backend for the FX-870P emulator. Provides programmatic control over CPU execution, breakpoints, memory watchpoints, and state inspection. Primary use cases:

- Debugging compiled BASIC programs (find crashes, verify behavior)
- ROM routine exploration (call individual ROM entry points and inspect results)
- Automated regression testing for the compiler (compile → run → compare output)
- Foundation for future interactive debugger UI

## Architecture

```
tools/emu-debugger/
  session.ts         — EmulatorSession class (public API)
  snapshot.ts        — boot snapshot save/restore
  breakpoints.ts     — PC breakpoints + memory watchpoints
  trace.ts           — instruction tracing with disassembly
  exit-reasons.ts    — exit detection logic and constants
  cli.ts             — CLI entry point
  snapshots/         — saved snapshots (gitignored)
  tests/             — unit, integration, and E2E tests
```

The library wraps and extends `tests/emu-harness.ts`, which already solves the hard problem of driving the emulator headlessly in Node. Primitives used: `boot()`, `stepOnce()`, `runCycles()`, `setPcMonitor()`, `setRamWriteMonitor()`.

Runs are deterministic — no wall-clock time, no requestAnimationFrame. Cycle budgets are pure counters.

## Public API

```typescript
// tools/emu-debugger/session.ts

export type SessionMode = 'snapshot' | 'boot' | 'raw';

export interface SessionOptions {
  mode: SessionMode;
  snapshotPath?: string;  // default: tools/emu-debugger/snapshots/default.snap.json
}

export type WatchKind = 'read' | 'write' | 'access';

export type ExitReason =
  | 'breakpoint'
  | 'watchpoint'
  | 'max-cycles'
  | 'max-instructions'
  | 'halted'
  | 'returned'
  | 'illegal'
  | 'manual';

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

export interface Registers {
  pc: number; ua: number; ib: number; flag: number;
  ix: number; iy: number; iz: number;
  sx: number; sy: number; sz: number;
  ss: number; us: number;
  mr: Uint8Array;  // $0-$31, 36 bytes
}

export interface TraceEntry {
  pc: number;
  bytes: number[];
  mnemonic: string;
  cycles: number;
}

export class EmulatorSession {
  constructor(options: SessionOptions);

  loadBinary(address: number, bytes: Uint8Array): void;
  setEntry(address: number): void;

  addBreakpoint(pc: number): void;
  removeBreakpoint(pc: number): void;
  clearBreakpoints(): void;

  addWatchpoint(address: number, kind: WatchKind): void;
  removeWatchpoint(address: number, kind: WatchKind): void;
  clearWatchpoints(): void;

  run(options?: { maxCycles?: number; maxInstructions?: number; trace?: boolean }): ExitResult;
  step(): ExitResult;
  stop(): void;

  getRegisters(): Registers;
  getMemory(address: number, length: number): Uint8Array;
  getLcd(): { rows: string[]; raw: Uint8Array };
  getTrace(): TraceEntry[];
  getInstructionCount(): number;
  getCycleCount(): number;

  reset(): void;
}
```

**Design choices:**

- `'returned'` exit reason detected by tracking initial stack level at `setEntry()`. When stack returns to that level AND PC leaves loaded region, the program has finished.
- `run()` always bounded (default: 10M cycles).
- `trace` is opt-in — every-instruction disassembly is expensive.
- `getMemory()` returns a copy; callers cannot corrupt emulator state.
- `reset()` restores snapshot/boot state for re-running without paying boot cost.

## Snapshot Mechanism

**State captured:**
- All RAM regions (writable entries in `memdef[]`)
- CPU registers: `pc`, `ua`, `ib`, `flag`, `ix`, `iy`, `iz`, `sx`, `sy`, `sz`, `ss`, `us`, `mr[]`, `tm`, `ia`, `ie`, `ky`, `pe`, `pd`
- LCD state: `lcdmem`, `lcdchr`, `lcdctrl`
- Counters: `acycles`, `onCounter`, `pulseCounter`, `serialCounter`, `secondCycles`

**File format:** JSON with binary fields base64-encoded (diff-friendly, ~10-30KB):

```json
{
  "version": 1,
  "romHash": "sha256:...",
  "cpu": { "pc": 40960, "ua": 0, ... },
  "mr": "base64:...",
  "memory": { "ram0": "base64:...", "ram1": "base64:..." },
  "lcd": { "ctrl": 23, "mem": "base64:...", "chr": "base64:..." }
}
```

**Storage:** `tools/emu-debugger/snapshots/default.snap.json` (gitignored).

**ROM hash verification:** Snapshots tied to specific ROM versions. Mismatch → refuse to load, suggest regenerating with `--boot`.

**Auto-generation:** On first run with `mode: 'snapshot'` when snapshot absent/mismatched, boot fresh → save snapshot → continue. Subsequent runs are near-instant.

**Helpers exposed:**
```typescript
export function saveSnapshot(path: string): void;
export function loadSnapshot(path: string): void;
export function captureBootSnapshot(path: string): void;
```

## Breakpoints, Watchpoints & Exit Detection

**Breakpoints (PC-based):**
- Registered via existing `setPcMonitor(fn)` in `def.ts`
- Session's callback checks `Set<number>` of breakpoint PCs each instruction
- On hit, sets `exitPending` flag polled by run loop
- Software-only (no instruction patching); cheap Set lookup per instruction

**Watchpoints (memory access-based):**
- Write watchpoints hook existing `setRamWriteMonitor(fn)` in `def.ts`
- Read watchpoints require new hook `setRamReadMonitor` to be added to `def.ts`
- Session checks `Map<address, Set<WatchKind>>` on each access
- Records hit (address, kind, value, PC) and sets `exitPending`

**Exit detection loop:**
```
while (within budgets):
  stepOnce()
  if exitPending: break         // breakpoint or watchpoint
  if CpuStop || CpuSleep: halted
  if stackLevel returned to entry stackLevel: returned
```

**"Returned" detection:** At `setEntry(addr)`, snapshot stack pointer (`ss`). When stack returns to that level AND PC is outside loaded binary's region, the initial call has finished.

**Illegal opcode detection:** The emulator's `illComm()` already handles illegal opcodes. We add an `onIllegalOpcode` hook that fires from `illComm()` and sets `exitPending` with `reason='illegal'`.

**Trace mode:** When `trace: true`, the PC monitor also:
- Calls `disOneLine` from `src/emulator/disassemble.ts` for mnemonic
- Captures instruction bytes
- Pushes to `traceEntries[]` (capped at 100k entries)

**Monitor chaining:** Session save/restores any pre-existing monitor to coexist with `tests/emu-harness.ts`'s `installPcTracker`.

## CLI Interface

**Entry:** `npx tsx tools/emu-debugger/cli.ts <cmd> [args]`

**npm script:** `"debug": "tsx tools/emu-debugger/cli.ts"` added to `package.json`.

**Commands:**
- `run <binary>` — execute, print LCD + result
- `trace <binary>` — log every instruction to stdout
- `step <binary>` — interactive single-stepping (Enter to advance, `q` to quit, `r N` to run N)

**Global flags:**
```
--entry 0xADDR            entry point (default: 0x0000)
--load-addr 0xADDR        load address (default: 0x0000)
--max-cycles N            cycle budget (default: 10_000_000)
--max-instructions N      instruction budget (default: unlimited)
--boot                    full boot instead of snapshot
--raw                     no boot, cold RAM
--break 0xADDR            PC breakpoint (repeatable)
--watch 0xADDR[:r|w|rw]   watchpoint, default kind 'w' (repeatable)
--dump-mem 0xADDR:N       print memory at exit (repeatable)
--dump-regs               print register state at exit
--no-lcd                  skip LCD output
--quiet                   suppress banner
```

**Exit output:**
```
── Exit ──────────────────────────────────────
Reason:         breakpoint at 0x3EF1
Cycles:         1,247
Instructions:   42
PC at exit:     0x3EF1

── LCD ──────────────────────────────────────
│ Hello, World!                  │
│                                │
...
```

**Trace output:**
```
  PC    Bytes            Instruction            Cycles
  ----  ---------------  ---------------------  ------
  0000  D1 02 DF 2A      ldw $2,&H2ADF               4
  0004  B7 12            jr ROM_CALL                 3
  ...
```

## Testing Strategy

### Unit tests (`tools/emu-debugger/tests/`)
- **snapshot.test.ts** — save/restore round-trips preserve state
- **breakpoints.test.ts** — PC breakpoints fire correctly, multiple/clear work
- **watchpoints.test.ts** — write/read/access watchpoints fire with correct data
- **trace.test.ts** — captures PC/bytes/mnemonic, respects cap
- **exit-reasons.test.ts** — each reason detected via hand-crafted binaries

### Integration tests
- Hand-crafted ML binaries (e.g. `0xCE 0xF7` = nop+rtn → `returned` in 2 instructions)
- Existing `sin90.test.ts` still passes (regression check)

### End-to-end compiler integration (`tests/compile-and-run.test.ts`)
- Compile each fixture .bas
- Run via `EmulatorSession`
- Verify expected LCD output
- Compare compiler vs. interpreter output for ground truth

### CLI tests
- Spawn CLI as subprocess, verify exit code + stdout
- Lightweight smoke tests

## Dependencies

- No new npm dependencies
- Extends: `tests/emu-harness.ts`, `src/emulator/def.ts`, `src/emulator/disassemble.ts`

## Non-goals

- Interactive TUI debugger (gdb-style REPL) — future work
- MCP/JSON-RPC server layer — future work
- Breakpoint conditions/expressions — future work
- Reverse stepping — future work
- Symbol-based breakpoints (using `.sym` files) — future enhancement, not MVP
