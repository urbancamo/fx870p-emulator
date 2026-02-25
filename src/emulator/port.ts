// I/O port and UART emulation
// Ported from port.pas

import {
  XTAL, ky, setKy,
  procptr, procindex, setProcindex,
  Option2, PrinterData,
  registerIoRdPtr, registerIoWrPtr,
} from './def.js';
import { remoteLog } from './remote-log.js';

export let pd  = 0;  // port D output latch
export let pe  = 0;  // port E direction register
export let pdi = 0;  // port D external input

export function setPe(v: number): void {
  if (_ioDebug) console.log(`[PE] pe=0x${(v & 0xFF).toString(16)} (was 0x${pe.toString(16)}) pdi=0x${pdi.toString(16)}`);
  pe = v & 0xFF;
}
export function setPd(v: number): void {
  if (_ioDebug) console.log(`[PD] pd=0x${(v & 0xFF).toString(16)}`);
  pd = v & 0xFF;
}

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

let _lastReadPdResult = -1; // tracks last logged Port-D composite value

export function readPd(): number {
  const v = getPort();
  if (_ioDebug && v !== _lastReadPdResult) {
    _lastReadPdResult = v;
    const msg = `readPd=0x${v.toString(16)} pe=0x${pe.toString(16)} pd=0x${pd.toString(16)} pdi=0x${pdi.toString(16)}`;
    console.log(`[RPD] ${msg}`);
    remoteLog('readPd', msg);
  }
  return v;
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
  // Mirror Delphi ResetAll exactly:
  //   Delphi: pdi = $EF (VX-4) or $FF (FX-870P), then IoInit does pdi &= $DF
  //   Result: pdi = 0xCF (VX-4) or 0xDF (FX-870P)
  //   pe = $00, pd = $00 set before IoInit in Delphi's ResetAll.
  pdi     = (Option2 === 0 ? 0xEF : 0xFF) & 0xDF;
  pe      = 0x00;
  pd      = 0x00;
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
  _lastReadPdResult = -1; // force log on first readPd after init
  remoteLog('ioInit', `pdi=0x${pdi.toString(16)} pe=0x${pe.toString(16)} pd=0x${pd.toString(16)} Option2=${Option2}`);
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
  const prevRate = SerialRate;
  const prev4 = ga_rd[4], prev5 = ga_rd[5];
  if ((ga_rd[5] & 0x04) !== 0 && (ga_rd[4] & 0x40) !== 0) {
    // MT mode
    SerialRate = baud_div[3 + ((ga_rd[4] >> 4) & 0x02)];
  } else {
    SerialRate = baud_div[ga_rd[4] & 7];
  }
  if ((ga_rd[3] & 0x01) !== 0) latched5 = ga_rd[5];
  LineCounter = 0;
  // Log whenever UART config registers change (unconditional — helps diagnose F.COM and LOAD)
  if (ga_rd[4] !== prev4 || ga_rd[5] !== prev5 || SerialRate !== prevRate) {
    const mode = (ga_rd[5] & 0x04) ? 'MT' : 'RS232';
    remoteLog('UART cfg', `ga4=0x${ga_rd[4]!.toString(16)} ga5=0x${ga_rd[5]!.toString(16)} mode=${mode} rate=${SerialRate} rxEn=${(ga_rd[4]! & 0x40) ? 'Y' : 'N'}`);
  }
}

function lengthSetting(): void {
  if ((ga_wr3 & 0x40) !== 0) {
    const prev = SerialLength;
    SerialLength = 9; // 1 start + 7 data + 1 stop
    if ((ga_wr3 & 0x04) !== 0) SerialLength++; // 8 data bits
    if ((ga_wr3 & 0x10) !== 0) SerialLength++; // parity
    if ((ga_wr3 & 0x80) !== 0) SerialLength++; // 2 stop bits
    LineCounter = 0;
    if (SerialLength !== prev) {
      remoteLog('UART len', `wr3=0x${ga_wr3.toString(16)} SerialLength=${SerialLength}`);
    }
  }
}

// ─── debug I/O trace (set true to log all port reads/writes) ─────────────────
let _ioDebug = false;
export function setIoDebug(on: boolean): void {
  _ioDebug = on;
  _lastReadPdResult = -1; // force log on next readPd call
  console.log(`[PORT] setIoDebug(${on}) — pdi=0x${pdi.toString(16)} pe=0x${pe.toString(16)} pd=0x${pd.toString(16)}`);
}
export function isIoDebug(): boolean { return _ioDebug; }

// ─── I/O pointer interface (returns buffer + offset for read/write) ───────────
// We use small wrappers that match the signature expected by def.ts

export function ioWrPtr(index: number): { buf: Uint8Array; off: number } {
  index = index & 7;
  if (_ioDebug) {
    const msg = `reg=${index} ga_rd=[${Array.from(ga_rd).map(b => b.toString(16).padStart(2,'0')).join(',')}] ga_wr2=0x${ga_wr2.toString(16)} ga_wr3=0x${ga_wr3.toString(16)}`;
    console.log(`[IO WR] ${msg}`);
    remoteLog('IO WR', msg);
  }
  switch (index) {
    case 2: {
      // TX data register: capture written byte synchronously before onWriteDataReg reads ga_wr2
      const buf2 = new Uint8Array(1);
      buf2[0] = ga_wr2;
      procptr[procindex] = () => { ga_wr2 = buf2[0]; onWriteDataReg(); };
      setProcindex(procindex + 1);
      return { buf: buf2, off: 0 };
    }
    case 3: {
      // Format register: update ga_wr3 synchronously before lengthSetting() reads it.
      // (Previously used queueMicrotask which fired AFTER the procptr callback,
      //  so lengthSetting() always saw the stale ga_wr3 value.)
      const buf3 = new Uint8Array(1);
      buf3[0] = ga_wr3;
      procptr[procindex] = () => { ga_wr3 = buf3[0]; lengthSetting(); };
      setProcindex(procindex + 1);
      return { buf: buf3, off: 0 };
    }
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
  if (_ioDebug) {
    const msg = `reg=${index} val=0x${ga_rd[index]!.toString(16)} ga_rd=[${Array.from(ga_rd).map(b => b.toString(16).padStart(2,'0')).join(',')}]`;
    console.log(`[IO RD] ${msg}`);
    remoteLog('IO RD', msg);
  }
  return { buf: ga_rd, off: index };
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

// ─── UART register snapshot (for UI diagnostics) ─────────────────────────────
export function getUartRegs(): { rd: number[]; wr2: number; wr3: number } {
  return { rd: Array.from(ga_rd), wr2: ga_wr2, wr3: ga_wr3 };
}

// ─── parity ──────────────────────────────────────────────────────────────────
export function parity(x: number): number {
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
        remoteLog('UART TX', `byte=0x${ga_wr2.toString(16).padStart(2,'0')} ga_rd4=0x${ga_rd[4]!.toString(16)} ga_rd5=0x${ga_rd[5]!.toString(16)}`);
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
      if (RxData >= 0) {
        remoteLog('UART RX got', `byte=0x${RxData.toString(16).padStart(2,'0')} ga_rd4=0x${ga_rd[4]!.toString(16)}`);
        RxCounter = SerialLength;
      }
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
