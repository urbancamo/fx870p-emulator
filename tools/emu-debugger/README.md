# Headless Emulator Debugger

A Node.js library and CLI for driving the FX-870P emulator programmatically. Breakpoints, memory watchpoints, instruction tracing, snapshots, and single-stepping — all without a browser.

## Use Cases

- **Debug compiled BASIC programs** — load a `.bin` into RAM, execute from a given entry point, catch crashes and runaway execution
- **ROM routine exploration** — call individual ROM entry points with controlled register state and inspect the result
- **Automated regression testing** — compile each BASIC fixture, run it, assert on LCD output
- **CI coverage** — the existing vitest harness runs in CI; this builds on top of it

## Quick Start

### CLI

```bash
# Run a binary, show exit reason + LCD output
npm run debug -- run build/compiler/hello.bin

# Trace every instruction
npm run debug -- trace build/compiler/hello.bin --max-instructions 50

# Single-step interactively
npm run debug -- step build/compiler/hello.bin
```

### Library (from a test or script)

```typescript
import { EmulatorSession } from './tools/emu-debugger/session.js';

const sess = new EmulatorSession({ mode: 'snapshot' });
sess.loadBinary(0x0000, readFileSync('hello.bin'));
sess.setEntry(0x0000);
sess.addBreakpoint(0x3EF1);  // break when ROM PRINT is called

const result = sess.run({ maxCycles: 1_000_000 });
console.log(result.reason);           // 'breakpoint'
console.log(result.breakpointHit);    // 0x3EF1
console.log(sess.getLcd().rows);      // 4 rows of LCD text
console.log(sess.getRegisters());     // full CPU state
```

## CLI Reference

### Commands

| Command | Purpose |
|---------|---------|
| `run <binary>` | Load binary, execute, print exit reason + LCD |
| `trace <binary>` | Same as run, but logs every instruction |
| `step <binary>` | Interactive single-stepping (Enter to step, `r N` to run N, `q` to quit) |

### Flags

| Flag | Description |
|------|-------------|
| `--entry 0xADDR` | Entry point address (default: `0x0000`) |
| `--load-addr 0xADDR` | Where to load the binary in RAM (default: `0x0000`) |
| `--max-cycles N` | Cycle budget — aborts if exceeded (default: 10,000,000) |
| `--max-instructions N` | Instruction budget (default: unlimited) |
| `--break 0xADDR` | Add PC breakpoint (can repeat) |
| `--watch 0xADDR:r\|w\|rw` | Memory watchpoint (default kind: `w`; can repeat) |
| `--dump-mem 0xADDR:N` | Print N bytes at exit (can repeat) |
| `--dump-regs` | Print full register state at exit |
| `--no-lcd` | Skip LCD output in the summary |
| `--quiet` | Suppress banner |
| `--boot` | Full boot instead of snapshot (slow, guaranteed fresh state) |
| `--raw` | No boot, cold RAM (pure CPU tests only) |

### Addresses

Hex addresses accept `0x1234`, `&H1234`, or plain `1234` (decimal).

### Example: Debugging a Crash

```bash
# Run with breakpoint on ROM PRINT entry and dump state
npm run debug -- run build/compiler/hello.bin \
  --break 0x3EF1 \
  --dump-regs \
  --dump-mem 0x0000:64 \
  --max-cycles 100000
```

### Example Output

```
emu-debugger: loaded hello.bin (48 bytes) at 0x0000, entry 0x0000

── Exit ──────────────────────────────────────
Reason:         returned
Cycles:         92
Instructions:   9
PC at exit:     0x0D6E

── LCD ──────────────────────────────────────
│ Hello, World!                    │
│                                  │
│                                  │
│                                  │

── Registers ────────────────────────────────
PC=0D6E  UA=54  IB=00  FLAG=08
IX=110F  IY=0000  IZ=18A7
SX=1F  SY=1E  SZ=00  SS=1BCF  US=1CD0
$0-$9:   A8 00 0E 00 00 03 03 03 03 03
$10-$18: 03 00 00 00 00 00 00 FF FF
$19-$31: FF FF FF FF FF FF FF FF FF FF FF 01 00
```

## Library API

### `EmulatorSession`

Main class for programmatic control.

```typescript
new EmulatorSession({ mode: SessionMode, snapshotPath?: string })
```

**Modes:**

| Mode | Description |
|------|-------------|
| `'snapshot'` | Restore from a saved snapshot (fast). Auto-captures on first run if missing. |
| `'boot'` | Full boot from ROM (~8M cycles, guaranteed fresh state). |
| `'raw'` | No boot, cold RAM. Only useful for pure CPU tests. |

#### Loading & Execution

```typescript
loadBinary(address: number, bytes: Uint8Array): void
setEntry(address: number): void
run(options?: { maxCycles?: number; maxInstructions?: number; trace?: boolean }): ExitResult
step(): ExitResult     // single instruction
stop(): void           // signals manual exit from callback
reset(): void          // restore to initial snapshot, clear breakpoints
```

#### Breakpoints

```typescript
addBreakpoint(pc: number): void
removeBreakpoint(pc: number): void
clearBreakpoints(): void
```

#### Watchpoints

```typescript
addWatchpoint(address: number, kind: 'read' | 'write' | 'access'): void
removeWatchpoint(address: number, kind: WatchKind): void
clearWatchpoints(): void
```

#### Inspection

```typescript
getRegisters(): Registers                              // full CPU state
getMemory(address: number, length: number): Uint8Array // RAM slice (copy)
getLcd(): { rows: string[]; raw: Uint8Array }          // 4 LCD rows + raw bytes
getTrace(): TraceEntry[]                               // instruction trace (if trace=true)
getInstructionCount(): number
getCycleCount(): number
```

### `ExitResult`

```typescript
interface ExitResult {
  reason: ExitReason;
  cyclesExecuted: number;
  instructionsExecuted: number;
  pc: number;
  breakpointHit?: number;
  watchpointHit?: WatchpointHit;
  illegalOpcode?: number;
}
```

**Exit reasons:**

| Reason | Meaning |
|--------|---------|
| `'breakpoint'` | Hit a PC breakpoint |
| `'watchpoint'` | Memory access matched a watch |
| `'max-cycles'` | Cycle budget exhausted (hang protection) |
| `'max-instructions'` | Instruction budget exhausted |
| `'halted'` | CPU halted (off/sleep) |
| `'returned'` | Initial call returned (stack back to entry level, PC outside loaded region) |
| `'illegal'` | Illegal opcode executed (CPU runaway) |
| `'manual'` | `session.stop()` was called |

### Standalone Helpers

From `snapshot.ts`:

```typescript
captureSnapshot(): Snapshot
restoreSnapshot(snap: Snapshot): void
saveSnapshotToFile(path: string, snap: Snapshot): void
loadSnapshotFromFile(path: string): Snapshot
computeRomHash(): string
```

## How Snapshots Work

The debugger's `'snapshot'` mode saves CPU and RAM state to a JSON file after booting the emulator to the BASIC ready prompt. Subsequent sessions restore from this snapshot instead of re-booting (saves ~8M cycles per test).

- **Location:** `tools/emu-debugger/snapshots/default.snap.json` (gitignored)
- **Contents:** All CPU registers, all RAM regions, LCD state
- **ROM verification:** Each snapshot embeds a SHA-256 hash of the ROM. Loading a snapshot against a different ROM version fails cleanly.
- **Auto-generation:** First run captures the snapshot. Delete the file to force regeneration.

## Architecture

```
tools/emu-debugger/
  session.ts         EmulatorSession class — public API
  snapshot.ts        save/restore CPU + memory state (JSON + base64)
  breakpoints.ts     BreakpointSet, WatchpointSet data structures
  exit-reasons.ts    ExitReason types + formatExitResult
  harness-core.ts    shared emulator primitives (boot, stepOnce, RAM helpers)
  trace.ts           TraceBuffer with configurable cap
  cli.ts             CLI entry point (run/trace/step commands)
  snapshots/         generated snapshots (gitignored)
  tests/             unit, integration, and E2E tests
```

The session hooks into the emulator's existing monitors (`setPcMonitor`, `setRamWriteMonitor`, `setRamReadMonitor`, `setIllegalOpcodeMonitor`) to detect breakpoints, watchpoints, and CPU runaway. All monitors are installed at the start of `run()` and uninstalled in `finally` so they don't leak into other code.

## Testing

```bash
# All debugger tests (30+ tests)
npx vitest run tools/emu-debugger/tests/

# Full test suite (430 tests including emulator + compiler + debugger)
npx vitest run
```

Test categories:

- **Unit tests** — snapshot round-trip, breakpoint/watchpoint data structures, trace buffer cap, exit formatter
- **Integration tests** — session run loop with real monitors, watchpoint installation, LCD reading
- **CLI smoke tests** — spawn the CLI as a subprocess, verify exit + output
- **End-to-end** — compile `hello.bas` via the compiler, run via session, verify pipeline works

## Design Spec

Full design: [`docs/superpowers/specs/2026-04-05-emu-debugger-design.md`](../../docs/superpowers/specs/2026-04-05-emu-debugger-design.md)

## Related Tools

- [`tools/compiler/`](../compiler/README.md) — BASIC to HD61700 machine code compiler
- [`tools/dis.ts`](../dis.ts) — standalone disassembler
- [`tests/emu-harness.ts`](../../tests/emu-harness.ts) — lower-level boot + keystroke helpers (this library wraps it)
