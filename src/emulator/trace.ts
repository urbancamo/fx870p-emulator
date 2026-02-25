// Execution trace module — mirrors Delphi Trace.pas
// Records one JSONL line per instruction to /trace (→ trace.jsonl on disk).
// Output format matches Trace.pas so the two traces can be diffed directly.
//
// Usage:
//   traceInit()          — start recording (call from emulatorReset)
//   traceClose()         — flush & stop (auto-fires on cycle/line limit)
//   traceInstr(pc)       — call in cpuRun() before execInstr()
//   traceAddCycles(n)    — call in cpuRun() after the speed-scale line
//   isTraceEnabled()     — guard used in cpu.ts hot path
//
// TRACE_MAX_CYCLES is set to 10 s of nominal 921 kHz wall time.
// The server plugin in vite.config.ts appends batches to trace.jsonl.

import {
  mr,
  sx, sy, sz,
  ix, iy, iz,
  us, ss,
  ua, delayed_ua,
  ia, ie, ib,
  tm, flag, iserv, ky,
} from './def.js';

// 10 s at 921 kHz ≈ 9 210 000 cycles
const TRACE_MAX_CYCLES = 921 * 10_000;
const TRACE_MAX_LINES  = 5_000_000;
const BATCH_SIZE       = 500; // lines per POST

let _enabled   = false;
let _cycles    = 0;           // cumulative emulated cycles
let _lines     = 0;
let _batch: string[] = [];

export function traceInit(): void {
  _enabled = true;
  _cycles  = 0;
  _lines   = 0;
  _batch   = [];
}

export function traceClose(): void {
  if (!_enabled) return;
  _flush();
  _enabled = false;
}

export function isTraceEnabled(): boolean {
  return _enabled;
}

// Called from cpuRun() BEFORE execInstr().
// pc is the address of the instruction about to execute.
export function traceInstr(pc: number): void {
  if (!_enabled) return;

  if (_cycles >= TRACE_MAX_CYCLES || _lines >= TRACE_MAX_LINES) {
    traceClose();
    return;
  }

  // Build compact JSON matching Trace.pas field names
  const mrArr = '[' + (mr as Uint8Array).join(',') + ']';
  _batch.push(
    `{"pc":${pc},"cy":${_cycles},"mr":${mrArr},` +
    `"sx":${sx},"sy":${sy},"sz":${sz},` +
    `"ix":${ix},"iy":${iy},"iz":${iz},` +
    `"us":${us},"ss":${ss},` +
    `"ua":${ua},"dua":${delayed_ua},` +
    `"ia":${ia},"ie":${ie},"ib":${ib},` +
    `"tm":${tm},"fl":${flag},"iserv":${iserv},"ky":${ky}}`
  );
  _lines++;

  if (_batch.length >= BATCH_SIZE) _flush();
}

// Called from cpuRun() after the speed-scale line, with the final cycle count.
export function traceAddCycles(n: number): void {
  if (_enabled) _cycles += n;
}

// Serial send queue: ensures batches arrive at the server in order.
let _sendQueue: Promise<void> = Promise.resolve();

function _flush(): void {
  if (_batch.length === 0) return;
  const body = _batch.join('\n') + '\n';
  _batch = [];
  _sendQueue = _sendQueue.then(() =>
    fetch('/trace', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
    }).then(() => {}).catch(() => { /* ignore if dev server not running */ })
  );
}
