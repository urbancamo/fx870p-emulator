// I/O port and UART emulation
// Ported from port.pas

import {
  XTAL, ky, setKy,
  procptr, procindex, setProcindex,
  PrinterData,
  registerIoRdPtr, registerIoWrPtr,
} from './def.js';

export let pd  = 0;  // port D output latch
export let pe  = 0;  // port E direction register
export let pdi = 0;  // port D external input

export function setPe(v: number): void { pe = v & 0xFF; }
export function setPd(v: number): void { pd = v & 0xFF; }

export let SerialRate = 10000; // baud-rate divisor in cycles

// Comm stub — replaced by comm.ts callbacks
let commWriteFn: (b: number) => void = () => {};
let commReadFn:  () => number = () => -1;
export function registerComm(w: (b: number) => void, r: () => number) {
  commWriteFn = w;
  commReadFn  = r;
}

// ─── internal registers ───────────────────────────────────────────────────────
const ga_rd  = new Uint8Array(8);  // read/write and read-only registers
let ga_wr2   = 0; // TX data register
let ga_wr3   = 0; // control register 3 (write-only)
let latched5 = 0; // snapshot of ga_rd[5] at TX start
let SerialLength = 0;
let TxCounter    = 0;
let RxCounter    = 0;
let RxData       = 0;
let OldPort      = 0;
let LineCounter  = 0;

function getPort(): number {
  return ((pd & pe) | (pdi & ~pe)) & 0xFF;
}

export function readPd(): number {
  return getPort();
}

export function writePd(): void {
  const x = getPort();
  if ((x & 0x08) !== 0 && (OldPort & 0x08) === 0) {
    // Printer strobe 0→1
    commWriteFn(PrinterData);
  }
  OldPort = x;
}

export function ioInit(): void {
  pdi     = pdi & 0xDF;  // printer always ready
  OldPort = getPort();
  ga_rd[0] = 0xFF;
  ga_rd[1] = 0xFF;
  ga_rd[2] = 0;
  ga_rd[3] = 0x05;
  ga_rd[4] = 0;
  ga_rd[5] = 0xFF;
  latched5 = ga_rd[5];
  ga_rd[6] = 0;
  ga_rd[7] = 0xFF;
  ga_wr3   = 0;
}

function onWriteDataReg(): void {
  if ((ga_rd[4] & 0x80) !== 0) {
    ga_rd[3] = ga_rd[3] & 0xFE;  // TX buffer full
    latched5 = ga_rd[5];
    TxCounter = SerialLength;
  }
}

function onReadDataReg(): void {
  ga_rd[3] = ga_rd[3] & 0xC5;   // clear errors + RX buffer full
  setKy(ky | 0x0800);            // release INT1
}

const baud_div = [
  Math.round((1000 * XTAL) / 9600),
  Math.round((1000 * XTAL) / 4800),
  Math.round((1000 * XTAL) / 2400),
  Math.round((1000 * XTAL) / 1200),
  Math.round((1000 * XTAL) / 600),
  Math.round((1000 * XTAL) / 300),
  Math.round((1000 * XTAL) / 150),
  Math.round((1000 * XTAL) / 75),
];

function baudRateSetting(): void {
  if ((ga_rd[5] & 0x04) !== 0 && (ga_rd[4] & 0x40) !== 0) {
    // MT mode
    SerialRate = baud_div[3 + ((ga_rd[4] >> 4) & 0x02)];
  } else {
    SerialRate = baud_div[ga_rd[4] & 7];
  }
  if ((ga_rd[3] & 0x01) !== 0) latched5 = ga_rd[5];
  LineCounter = 0;
}

function lengthSetting(): void {
  if ((ga_wr3 & 0x40) !== 0) {
    SerialLength = 9; // 1 start + 7 data + 1 stop
    if ((ga_wr3 & 0x04) !== 0) SerialLength++; // 8 data bits
    if ((ga_wr3 & 0x10) !== 0) SerialLength++; // parity
    if ((ga_wr3 & 0x80) !== 0) SerialLength++; // 2 stop bits
    LineCounter = 0;
  }
}

// ─── I/O pointer interface (returns buffer + offset for read/write) ───────────
// We use small wrappers that match the signature expected by def.ts

export function ioWrPtr(index: number): { buf: Uint8Array; off: number } {
  index = index & 7;
  switch (index) {
    case 2:
      procptr[procindex] = onWriteDataReg;
      setProcindex(procindex + 1);
      return { buf: new Uint8Array([ga_wr2]), off: 0 };  // stub — handled via callback
    case 3:
      procptr[procindex] = lengthSetting;
      setProcindex(procindex + 1);
      // ga_wr3 is write-only; use a side-effecting approach
      return makeSetter(() => ga_wr3, (v) => { ga_wr3 = v; });
    case 4:
    case 5:
      procptr[procindex] = baudRateSetting;
      setProcindex(procindex + 1);
      return { buf: ga_rd, off: index };
    case 7:
      return { buf: ga_rd, off: 7 };
    default:
      return { buf: new Uint8Array(1), off: 0 }; // dummydst
  }
}

export function ioRdPtr(index: number): { buf: Uint8Array; off: number } {
  index = index & 7;
  if (index === 2) {
    procptr[procindex] = onReadDataReg;
    setProcindex(procindex + 1);
  }
  return { buf: ga_rd, off: index };
}

// Helper: create a single-byte settable buffer
function makeSetter(get: () => number, set: (v: number) => void): { buf: Uint8Array; off: number } {
  const buf = new Uint8Array(1);
  buf[0] = get();
  // Schedule update after write — not ideal but works for this port
  queueMicrotask(() => set(buf[0]));
  return { buf, off: 0 };
}

// Direct write helpers used by exec.ts for port write side effects
export function writeGaWr2(v: number): void {
  ga_wr2 = v & 0xFF;
  onWriteDataReg();
}

export function writeGaWr3(v: number): void {
  ga_wr3 = v & 0xFF;
  lengthSetting();
}

export function writeGaRd45(index: number, v: number): void {
  ga_rd[index & 7] = v & 0xFF;
  baudRateSetting();
}

// ─── parity ──────────────────────────────────────────────────────────────────
function parity(x: number): number {
  x = x ^ (x >> 4);
  x = x ^ (x << 2);
  x = x ^ (x << 1);
  return x & 0x08; // bit 3 = parity
}

// ─── MT (modem tape) write ────────────────────────────────────────────────────
function mtWrite(): void {
  if (LineCounter === 0) {
    commWriteFn(0x0D);
    commWriteFn(0x0A);
  }
  if ((ga_rd[3] & 0x01) === 0) {
    // TX buffer full — data transmission
    const x = ga_wr2;
    commWriteFn(((x & 0x1F) << 1) + 0x30);
    commWriteFn(((x & 0xE0) >> 5) + parity(x) + 0x60);
    ga_rd[3] = ga_rd[3] | 0x01;
    latched5 = ga_rd[5];
  } else {
    // TX buffer empty — leader
    commWriteFn(0x6F);
    commWriteFn(0x6F);
  }
  LineCounter++;
  if (LineCounter > 32) LineCounter = 0;
}

function mtRead(): number {
  ga_rd[6] = ga_rd[6] & 0xFE; // no valid carrier
  let x1: number, x2: number;
  do {
    do {
      x1 = commReadFn();
      if (x1 < 0) return -1;
    } while (x1 < 0x30 || x1 > 0x6F);
    x2 = commReadFn();
    if (x2 < 0) return -1;
  } while (x2 < 0x30 || x2 > 0x6F);

  if ((x1 & 0x01) === 0) {
    // start bit present
    const data = ((x1 - 0x30) >> 1) | ((x2 & 0x07) << 5);
    if (parity(data) !== (x2 & 0x08)) ga_rd[3] = ga_rd[3] | 0x08; // parity error
    return data;
  } else {
    if (x1 === 0x6F && x2 === 0x6F) ga_rd[6] = ga_rd[6] | 0x01; // valid carrier
    return 0x100;
  }
}

// ─── serial tick (called at baud rate from emulator loop) ────────────────────
export function onSerialTick(): void {
  // Continuous MT transmission
  if (TxCounter === 0 && (ga_rd[4] & 0x80) !== 0 && (ga_rd[5] & 0x04) !== 0) {
    TxCounter = SerialLength;
  }

  if (TxCounter > 0) {
    TxCounter--;
    if (TxCounter === 0) {
      if ((latched5 & 0x04) === 0) {
        // RS232
        commWriteFn(ga_wr2);
        ga_rd[3] = ga_rd[3] | 0x01; // transmitter ready
        latched5 = ga_rd[5];
      } else {
        mtWrite();
      }
    }
  }

  if ((ga_rd[4] & 0x50) === 0x40) {
    // receiver enabled, no MT
    if (RxCounter === 0) {
      RxData = (ga_rd[5] & 0x04) === 0 ? commReadFn() : mtRead();
      if (RxData >= 0) RxCounter = SerialLength;
    }
    if (RxCounter > 0) {
      RxCounter--;
      if (RxCounter === 0 && RxData <= 0xFF) {
        ga_rd[2] = RxData & 0xFF;
        setKy(ky & ~0x0800); // trigger INT1
        if ((ga_rd[3] & 0x02) === 0) {
          ga_rd[3] = ga_rd[3] | 0x02; // RX buffer full
        } else {
          ga_rd[3] = ga_rd[3] | 0x10; // overrun error
        }
      }
    }
  }
}

// ─── register I/O handlers with def.ts ────────────────────────────────────────
registerIoRdPtr((index) => ioRdPtr(index));
registerIoWrPtr((index) => ioWrPtr(index));
