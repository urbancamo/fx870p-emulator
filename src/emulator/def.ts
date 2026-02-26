// HD61700 CPU state, memory map, and helpers
// Ported from def.pas

// ─── flag register bits ───────────────────────────────────────────────────────
export const Z_bit   = 0x80;
export const C_bit   = 0x40;
export const LZ_bit  = 0x20;
export const UZ_bit  = 0x10;
export const SW_bit  = 0x08;
export const APO_bit = 0x04;

// ─── LCD control port bits ────────────────────────────────────────────────────
export const VDD2_bit = 0x80;
export const CLK_bit  = 0x40;
export const CE2_bit  = 0x04;
export const CE1_bit  = 0x02;
export const OP_bit   = 0x01;
export const LCDCE    = CE1_bit | CE2_bit;

export const XTAL = 921; // nominal CPU clock in kHz

// ─── interrupt constants ──────────────────────────────────────────────────────
export const INTVECTORS    = 5;
export const INT1_bit      = 0x10;
export const KEYPULSE_bit  = 0x08;
export const INT2_bit      = 0x04;
export const MINTIMER_bit  = 0x02;
export const ONINT_bit     = 0x01;

export const intmask: readonly number[] = [
  INT1_bit, KEYPULSE_bit, INT2_bit, MINTIMER_bit, ONINT_bit,
];

export const intvec: readonly number[] = [
  0x0072, // INT1
  0x0062, // KEY/Pulse
  0x0052, // INT2
  0x0042, // One-minute timer
  0x0032, // ON
];

// ─── memory region definitions ────────────────────────────────────────────────
// (parallel to the memdef array in def.pas)
export interface MemRegion {
  first:    number;
  last:     number;
  offset:   number;   // file byte offset to subtract when mapping address → file pos
  memorg:   number;   // 0 = byte, 1 = 16-bit word (address×2 in file)
  writable: boolean;
  required: boolean;
  filename: string;
  data:     Uint8Array | null; // allocated on init
}

export const MEMORIES = 4;
export const ROM0_IDX = 0;
export const RAM0_IDX = 2;

export const memdef: MemRegion[] = [
  {
    first: 0x00000, last: 0x00C00, offset: 0x00000,
    memorg: 1, writable: false, required: true, filename: 'rom0.bin', data: null,
  },
  {
    first: 0x00C00, last: 0x10000, offset: 0x00C00,
    memorg: 0, writable: false, required: true, filename: 'rom1.bin', data: null,
  },
  {
    first: 0x10000, last: 0x20000, offset: 0x00000,
    memorg: 0, writable: true,  required: false, filename: 'ram0.bin', data: null,
  },
  {
    first: 0x20000, last: 0x30000, offset: 0x10000,
    memorg: 0, writable: false, required: true, filename: 'rom1.bin', data: null,
  },
];

// ─── CPU registers ────────────────────────────────────────────────────────────
// 5-bit index sub-registers
export let sx = 0;
export let sy = 0;
export let sz = 0;

// 8-bit general + special registers
// Initialised to 0xFF matching Delphi's MemLoad behaviour when no register.bin exists
// (GetMem allocates uninitialized memory, MemLoad pre-fills with 0xFF before attempting
// to read the file; if the file is absent the buffer stays 0xFF).
export const mr = new Uint8Array(36).fill(0xFF); // main register file (+ saved ss/us at [32..35])
export let ib    = 0;
export let ua    = 0;
export let ia    = 0;
export let ie    = 0;
export let tm    = 0;
export let flag  = 0;

// 16-bit registers (stored as JS numbers, masked to 16 bits on write)
export let ix = 0;
export let iy = 0;
export let iz = 0;
export let us = 0xFFFF; // matches Delphi: us = ptrw(@mr[34])^ where mr[34..35]=0xFF
export let ss = 0xFFFF; // matches Delphi: ss = ptrw(@mr[32])^ where mr[32..33]=0xFF
export let pc = 0;
export let ky = 0;

// CPU control
export let iserv       = 0;
export let delayed_ua  = 0;
export let delayed_ky  = 0;

// opcode fetch state
export const opcode = new Uint8Array(4);
export let opindex = 0;
export let opforg  = 0;   // memorg of current fetch region
export let cycles  = 0;
export let acycles = 0;
export let speed   = 0;   // 0=fast, 4=slow (shifts cycles left)

// deferred I/O write hooks
export const procptr: Array<(() => void) | null> = new Array(8).fill(null);
export let procindex = 0;

// emulator control
export let OscFreq  = XTAL;
export let CpuStop  = false;
export let CpuSleep = false;
export let CpuDelay = 0;
export let CpuSteps = -1;
export let BreakPoint = -1;
export let turbo = false;
export let Option2  = 1;  // 0 = International (VX-4); 1 = Japanese (FX-870P)

// port / printer (needed by port.ts, referenced from def)
export let PrinterData = 0;
export let dummydst    = 0;
export const dummysrc  = new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]);

// ─── register setters (needed because ES modules export bindings, not refs) ───
export function setSx(v: number) { sx = v & 0x1F; }
export function setSy(v: number) { sy = v & 0x1F; }
export function setSz(v: number) { sz = v & 0x1F; }
export function setIb(v: number) { ib = v & 0xFF; }
export function setUa(v: number) { ua = v & 0xFF; }
export function setIa(v: number) { ia = v & 0xFF; }
export function setIe(v: number) { ie = v & 0xFF; }
export function setTm(v: number) { tm = v & 0xFF; }
export function setFlag(v: number) { flag = v & 0xFF; }
export function setIx(v: number) { ix = v & 0xFFFF; }
export function setIy(v: number) { iy = v & 0xFFFF; }
export function setIz(v: number) { iz = v & 0xFFFF; }
export function setUs(v: number) { us = v & 0xFFFF; }
export function setSs(v: number) { ss = v & 0xFFFF; }
export function setPc(v: number) { pc = v & 0xFFFF; }
export function setKy(v: number) { ky = v & 0xFFFF; }
export function setIserv(v: number)      { iserv      = v & 0xFF; }
export function setDelayedUa(v: number)  { delayed_ua = v & 0xFF; }
export function setDelayedKy(v: number)  { delayed_ky = v & 0xFFFF; }
export function setOpindex(v: number)    { opindex    = v; }
export function setOpforg(v: number)     { opforg     = v; }
export function setCycles(v: number)     { cycles     = v; }
export function setAcycles(v: number)    { acycles    = v; }
export function setSpeed(v: number)      { speed      = v; }
export function setProcindex(v: number)  { procindex  = v; }
export function setOscFreq(v: number)    { OscFreq    = v; }
export function setCpuStop(v: boolean)   { CpuStop    = v; }
export function setCpuSleep(v: boolean)  { CpuSleep   = v; }
export function setCpuDelay(v: number)   { CpuDelay   = v; }
export function setCpuSteps(v: number)   { CpuSteps   = v; }
export function setBreakPoint(v: number) { BreakPoint = v; }
export function setTurbo(v: boolean)     { turbo      = v; }
export function setOption2(v: number)    { Option2    = v; }
export function setPrinterData(v: number){ PrinterData = v & 0xFF; }

// ─── address helpers ──────────────────────────────────────────────────────────

// Convert bank + 16-bit offset to 18-bit physical address
export function addr18(segment: number, offset: number): number {
  offset = offset & 0xFFFF;
  // if offset < ((ib << 8) & 0xC000) then segment = 0 (bank 0 selected)
  if (offset < ((ib << 8) & 0xC000)) segment = 0;
  return (offset + ((segment & 3) << 16)) >>> 0;
}

// forward declarations filled by port.ts / fdd.ts on init
export let ioRdPtr:  (index: number) => { buf: Uint8Array; off: number } = () => ({ buf: dummysrc, off: 0 });
export let ioWrPtr:  (index: number) => { buf: Uint8Array; off: number } = () => ({ buf: new Uint8Array([dummydst]), off: 0 });
export let fddRdPtr: (index: number) => { buf: Uint8Array; off: number } = () => ({ buf: dummysrc, off: 0 });
export let fddWrPtr: (index: number) => { buf: Uint8Array; off: number } = () => ({ buf: new Uint8Array(1), off: 0 });

export function registerIoRdPtr(fn: typeof ioRdPtr)  { ioRdPtr  = fn; }
export function registerIoWrPtr(fn: typeof ioWrPtr)  { ioWrPtr  = fn; }
export function registerFddRdPtr(fn: typeof fddRdPtr) { fddRdPtr = fn; }
export function registerFddWrPtr(fn: typeof fddWrPtr) { fddWrPtr = fn; }

// ─── memory read / write ──────────────────────────────────────────────────────

// srcorg is set as a side-effect of srcRead (mirrors Delphi's srcorg global)
export let srcorg = 0;

// Returns [buffer, byteOffset] for a read at the given 18-bit address.
// Also sets the module-level srcorg variable.
export function srcRead(address: number): number {
  address = address >>> 0;

  if ((address & 0xFFFF0) === 0x30000) {
    const r = ioRdPtr(address & 7);
    srcorg = 0;
    return r.buf[r.off] ?? 0xFF;
  }
  if ((address & 0xFFFFE) === 0x3FFFE) {
    const r = fddRdPtr(address & 1);
    srcorg = 0;
    return r.buf[r.off] ?? 0xFF;
  }

  for (let i = 0; i < MEMORIES; i++) {
    const m = memdef[i]!;
    if (address >= m.first && address < m.last) {
      if (!m.data) break;
      srcorg = m.memorg;
      // byteIdx = (offset + (address - first)) << memorg
      // offset accounts for where in the file this region's data begins
      const byteIdx = (m.offset + (address - m.first)) << m.memorg;
      return m.data[byteIdx] ?? 0xFF;
    }
  }
  srcorg = 0;
  return 0xFF;
}

// Optional monitor — set by debug tooling; called on every RAM write when active.
// Signature: (address: number, value: number) => void
let _ramWriteMonitor: ((a: number, v: number) => void) | null = null;
export function setRamWriteMonitor(fn: ((a: number, v: number) => void) | null): void {
  _ramWriteMonitor = fn;
}

// Optional PC monitor — called before each instruction, with the current PC value.
let _pcMonitor: ((pc: number) => void) | null = null;
export function setPcMonitor(fn: ((pc: number) => void) | null): void {
  _pcMonitor = fn;
}
export function firePcMonitor(pcVal: number): void {
  _pcMonitor?.(pcVal);
}

export function dstWrite(address: number, value: number): void {
  address = address >>> 0;
  value   = value & 0xFF;

  if ((address & 0xFFFF0) === 0x30000) {
    const r = ioWrPtr(address & 7);
    r.buf[r.off] = value;
    return;
  }
  if ((address & 0xFFFC) === 0x3FFFC) {
    // printer area 0x38000..
  }
  if ((address & 0x38000) === 0x38000) {
    PrinterData = value;
    return;
  }
  if ((address & 0xFFFC) === 0x3FFFC) {
    const r = fddWrPtr(address & 3);
    r.buf[r.off] = value;
    return;
  }

  for (let i = 0; i < MEMORIES; i++) {
    const m = memdef[i]!;
    if (m.writable && address >= m.first && address < m.last) {
      if (!m.data) return;
      const byteIdx = (m.offset + (address - m.first)) << m.memorg;
      m.data[byteIdx] = value;
      _ramWriteMonitor?.(address, value);
      return;
    }
  }
  // unmapped write: ignore (dummydst)
}

// ─── opcode fetch ─────────────────────────────────────────────────────────────

export function fetchByte(): number {
  const b = opcode[opindex];
  if (opforg === 0) {
    pc = (pc + 1) & 0xFFFF;
    cycles += 3;
  } else if (opindex & 1) {
    pc = (pc + 1) & 0xFFFF;
  } else {
    cycles += 4;
  }
  opindex++;
  return b;
}

export function fetchOpcode(): number {
  // Use delayed_ua unless we are in interrupt service
  const ua1 = (iserv === 0) ? delayed_ua : 0;
  delayed_ua = ua;

  opcode[0] = srcRead(addr18(ua1, pc));
  opforg = srcorg;

  if (srcorg === 0) {
    // byte memory: prefetch 4 bytes
    opcode[1] = srcRead(addr18(ua1, (pc + 1) & 0xFFFF));
    opcode[2] = srcRead(addr18(ua1, (pc + 2) & 0xFFFF));
    opcode[3] = srcRead(addr18(ua1, (pc + 3) & 0xFFFF));
  } else {
    // 16-bit word memory: each address maps to 2 bytes in file
    // We need both bytes of word-at-pc and word-at-(pc+1).
    const a0 = addr18(ua1, pc);
    const a1 = addr18(ua1, (pc + 1) & 0xFFFF);
    for (let i = 0; i < MEMORIES; i++) {
      const m = memdef[i]!;
      if (m.memorg === 1 && m.data && a0 >= m.first && a0 < m.last) {
        const base = (m.offset + (a0 - m.first)) * 2;
        opcode[0] = m.data[base]     ?? 0xFF;
        opcode[1] = m.data[base + 1] ?? 0xFF;
        break;
      }
    }
    for (let i = 0; i < MEMORIES; i++) {
      const m = memdef[i]!;
      if (m.memorg === 1 && m.data && a1 >= m.first && a1 < m.last) {
        const base = (m.offset + (a1 - m.first)) * 2;
        opcode[2] = m.data[base]     ?? 0xFF;
        opcode[3] = m.data[base + 1] ?? 0xFF;
        break;
      }
    }
  }

  opindex = 0;
  return fetchByte();
}

// ─── integer ↔ bytes conversions (used by debug) ─────────────────────────────

export function intToBytes(x: number, dst: Uint8Array, offset: number, bytes: number): void {
  for (let i = 0; i < bytes; i++) {
    dst[offset + i] = x & 0xFF;
    x >>>= 8;
  }
}

export function bytesToInt(src: Uint8Array, offset: number, bytes: number): number {
  let result = 0;
  for (let i = bytes - 1; i >= 0; i--) {
    result = (result << 8) + ((src[offset + i] ?? 0) & 0xFF);
  }
  return result >>> 0;
}

// ─── interrupt helpers (here to avoid circular deps with cpu.ts) ─────────────

export function cpuWakeUp(apo_value: boolean): void {
  if (!CpuSleep) return;
  if (apo_value) flag = flag | APO_bit;
  else           flag = flag & ~APO_bit;
  flag   = flag & 0xFF;
  speed  = 0;
  acycles = 0;
  CpuSleep = false;
}

export function setIfl(int_bit: number): void {
  if (((ie >> 3) & int_bit) !== 0) ib = (ib | int_bit) & 0xFF;
  if (((ib & (MINTIMER_bit | 0x20)) === (MINTIMER_bit | 0x20)) ||
      (int_bit === ONINT_bit && (ie & 0x04) !== 0)) {
    cpuWakeUp(true);
  }
}

// ─── memory area query helpers (used by debugger) ────────────────────────────

export function findMem(address: number): number {
  for (let i = 0; i < MEMORIES; i++) {
    const m = memdef[i]!;
    if (address >= m.first && address < m.last) return i;
  }
  return -1;
}

export function firstAddr(memArea: number): number {
  return memdef[memArea]!.first;
}

export function lastAddr(memArea: number): number {
  return memdef[memArea]!.last;
}
