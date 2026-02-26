// RS-232C (COM0:) communication layer.
// Translated from Delphi comm.pas.
// The calculator loads via: LOAD "COM0:6,N,8,1,N,N,N,N,N"
// COM0 params: speed=6(4800 baud), parity=N, data=8, stop=1, CS=N, DS=N, CD=N, busy=N, code=N

import { XTAL } from './def.js';
import { registerComm } from './port.js';

// Char delay in ms between bytes (mirrors Delphi CommForm.DelaySpinEdit.Value).
// 0 = no artificial delay; Xon/Xoff handles pacing at 9600 baud.
const CHAR_DELAY_MS = 0;

let rxQueue        = new Array<number>(); // bytes queued for transmission to calculator
let sending        = false; // true while a file is loaded and not yet fully sent
let suspend        = false; // true after XOFF (0x13); cleared by XON (0x11)
let charDelayTimer = 0;     // cycles remaining before next byte may be read
let lastTxByte     = -1;    // last byte delivered (used for AppendEof check)
let bytesSent      = 0;     // total bytes delivered from our queue to the UART

const outputBuffer = new Array<number>(); // bytes received FROM the calculator

// Bidirectional stream: direction + byte pairs for the UI
export interface CommStreamEntry { dir: 'tx' | 'rx'; byte: number; }
const streamBuffer: CommStreamEntry[] = [];
export function getStream(): readonly CommStreamEntry[] { return streamBuffer; }
export function clearStream(): void { streamBuffer.length = 0; }

// Load raw file bytes into the TX queue.
// Normalizes lone LF → CR+LF; appends 0x1A EOF if absent.
export function loadFileBytes(raw: Uint8Array): void {
  rxQueue = [];
  for (let i = 0; i < raw.length; i++) {
    const b = raw[i];
    // Normalize bare LF to CR+LF (skip if already preceded by CR)
    if (b === 0x0A && (i === 0 || raw[i - 1] !== 0x0D)) {
      rxQueue.push(0x0D);
    }
    rxQueue.push(b);
  }
  // Ensure file ends with 0x1A (Ctrl-Z / EOF)
  if (rxQueue.length === 0 || rxQueue[rxQueue.length - 1] !== 0x1A) {
    rxQueue.push(0x1A);
  }
  sending        = true;
  suspend        = false;
  charDelayTimer = 0;
  lastTxByte     = -1;
  bytesSent      = 0;
}

export function stopTransfer(): void {
  rxQueue    = [];
  sending    = false;
  suspend    = false;
  bytesSent  = 0;
  lastTxByte = -1;
}

export function clearOutput(): void {
  outputBuffer.length = 0;
}

export function rxBytesRemaining(): number {
  return sending ? rxQueue.length : 0;
}

export function isSending(): boolean { return sending; }
export function isSuspended(): boolean { return suspend; }
export function getBytesSent(): number { return bytesSent; }
export function getOutput(): number[] { return outputBuffer; }

// Decrement the char-delay timer by the given CPU cycle count.
// Called from the emulator main loop each instruction, mirroring Delphi main.pas:
//   if CommDelayTimer > 0 then Dec(CommDelayTimer, x)
export function commDecTimer(cycles: number): void {
  if (charDelayTimer > 0) {
    charDelayTimer -= cycles;
    if (charDelayTimer < 0) charDelayTimer = 0;
  }
}

// Called by port.ts onSerialTick when the UART requests a byte from us.
// Returns -1 if nothing to send right now.
function commReadFn(): number {
  // Gate: must be sending, timer expired, and not suspended by XOFF
  if (!sending || charDelayTimer > 0 || suspend) return -1;

  if (rxQueue.length > 0) {
    const b = rxQueue.shift()!;
    lastTxByte = b;
    bytesSent++;
    streamBuffer.push({ dir: 'tx', byte: b });
    if (b === 0x1A) {
      // StopEof: halt transmission after delivering the EOF byte
      sending = false;
    } else if (CHAR_DELAY_MS > 0) {
      charDelayTimer = XTAL * CHAR_DELAY_MS;
    }
    return b;
  }

  // Queue exhausted (AppendEof: return 0x1A if last byte wasn't already one)
  if (lastTxByte !== 0x1A) {
    lastTxByte = 0x1A;
    sending = false;
    streamBuffer.push({ dir: 'tx', byte: 0x1A });
    return 0x1A;
  }
  sending = false;
  return -1;
}

// Called by port.ts when the calculator transmits a byte to us.
// In Sending mode: 0x13 = XOFF (pause), 0x11 = XON (resume).
// All bytes are also captured in outputBuffer for the UI to display.
function commWriteFn(b: number): void {
  outputBuffer.push(b);
  streamBuffer.push({ dir: 'rx', byte: b });
  if (sending) {
    if (b === 0x13)      suspend = true;   // XOFF — calculator buffer full
    else if (b === 0x11) suspend = false;  // XON  — calculator ready for more
  }
}

// Self-register with port.ts on module load
registerComm(commWriteFn, commReadFn);

// No-op export — import this to guarantee module registration runs
export function commInit(): void {}
