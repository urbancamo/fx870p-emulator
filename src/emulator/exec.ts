// HD61700 instruction handlers + dispatch table
// Ported from exec.pas + decoder.pas

import {
  Z_bit, C_bit, LZ_bit, UZ_bit, APO_bit, SW_bit,
  mr, ix, iy, iz, us, ss, pc, ky, ua, ia, ie, ib,
  sx, sy, sz, flag, tm,
  setSx, setSy, setSz, setIb, setUa, setIa, setIe, setTm,
  setIx, setIy, setIz, setUs, setSs, setPc, setFlag,
  setSpeed, setCpuSleep, setIserv,
  opcode, opindex, opforg, cycles, iserv,
  setCycles, setOpindex,
  addr18, srcRead, dstWrite, fetchByte, fetchOpcode,
} from './def.js';
import { setLcdctrl, lcdTransfer, lcdSync, lcdInit } from './lcd.js';
import { readKy } from './keyboard.js';
import { pe as portPe, pd as portPd, readPd, writePd, setPe, setPd, ioInit } from './port.js';

// ─── register tables (matching Delphi's r8tab, r16tab, sirtab, stacktab) ──────

// r8tab: [PE, PD, IB, UA, IA, IE, TM(ro), TM(ro)]
function r8Read(i: number): number {
  switch (i & 7) {
    case 0: return portPe & 0xFF;
    case 1: return portPd & 0xFF;
    case 2: return ib;
    case 3: return ua;
    case 4: return ia;
    case 5: return ie;
    case 6:
    case 7: return tm;
    default: return 0;
  }
}

function r8Write(i: number, v: number): void {
  v = v & 0xFF;
  switch (i & 7) {
    case 0: setPe(v); writePd(); return;
    case 1: setPd(v); writePd(); return;
    case 2: setIb((ib & 0x1F) | (v & 0xE0)); return;
    case 3: setUa(v); return;
    case 4: setIa(v); return;
    case 5:
      setIe(v);
      setIb(ib & ((v >> 3) | 0xE0));
      setIserv(iserv & (v >> 3));
      return;
    case 6:
    case 7: return; // TM is read-only
  }
}

// r16tab: [IX, IY, IZ, US, SS, ky1, ky1, ky1]
// ky1 is a local alias that prevents direct KY writes
let ky1 = 0;

function r16Read(i: number): number {
  switch (i & 7) {
    case 0: return ix & 0xFFFF;
    case 1: return iy & 0xFFFF;
    case 2: return iz & 0xFFFF;
    case 3: return us & 0xFFFF;
    case 4: return ss & 0xFFFF;
    case 5:
    case 6:
    case 7: return ky1 & 0xFFFF;
    default: return 0;
  }
}

function r16Write(i: number, lo: number, hi: number): void {
  const v = (lo & 0xFF) | ((hi & 0xFF) << 8);
  switch (i & 7) {
    case 0: setIx(v); return;
    case 1: setIy(v); return;
    case 2: setIz(v); return;
    case 3: setUs(v); return;
    case 4: setSs(v); return;
    case 5:
    case 6:
    case 7: /* ky1 — writes ignored */ return;
  }
}

// sirtab: [SX, SY, SZ, SZ]
function sirRead(x: number): number {
  switch ((x >> 5) & 3) {
    case 0: return sx;
    case 1: return sy;
    case 2:
    case 3: return sz;
    default: return 0;
  }
}

function sirWrite(x: number, v: number): void {
  v = v & 0x1F;
  switch ((x >> 5) & 3) {
    case 0: setSx(v); return;
    case 1: setSy(v); return;
    case 2:
    case 3: setSz(v); return;
  }
}

// stacktab: [SS, US]
function stackSp(i: number): number { return (i & 1) === 0 ? ss : us; }
function stackSetSp(i: number, v: number): void {
  if ((i & 1) === 0) setSs(v & 0xFFFF); else setUs(v & 0xFFFF);
}

// ─── BCD arithmetic ───────────────────────────────────────────────────────────
function addBcd(a: number, b: number): number {
  let r = (a & 0x0F) + (b & 0x0F);
  if (r > 9) r = ((r + 6) & 0x0F) | 0x10;
  if (r > 0x1F) r -= 0x10;
  r += (a & 0xF0) + (b & 0xF0);
  if (r > 0x9F) r = ((r + 0x60) & 0xFF) | 0x100;
  return r >>> 0;
}

function subBcd(a: number, b: number): number {
  let r = ((a & 0x0F) - (b & 0x0F)) >>> 0;
  if (r > 9) r = (r - 6 - 0x10) >>> 0;
  r = (r + (a & 0xF0) - (b & 0xF0)) >>> 0;
  if (r > 0x9F) r = (r - 0x60 - 0x100) >>> 0;
  return r >>> 0;
}

// ─── flag helpers ─────────────────────────────────────────────────────────────
function setFlagsB(x: number): void {
  let f = flag & ~(Z_bit | C_bit | UZ_bit | LZ_bit);
  if (x !== 0)          f |= Z_bit;
  if ((x & 0x0F) !== 0) f |= LZ_bit;
  if ((x & 0xF0) !== 0) f |= UZ_bit;
  setFlag(f);
}

function setFlagsW(x: number): void {
  let f = flag & ~(Z_bit | C_bit | UZ_bit | LZ_bit);
  if (x !== 0)            f |= Z_bit;
  if ((x & 0x0F00) !== 0) f |= LZ_bit;
  if ((x & 0xF000) !== 0) f |= UZ_bit;
  setFlag(f);
}

function setFlagsD(x: number): void {
  let f = flag & ~(Z_bit | C_bit | UZ_bit | LZ_bit);
  if (x !== 0)            f |= Z_bit;
  if ((x & 0x000F) !== 0) f |= LZ_bit;
  if ((x & 0x00F0) !== 0) f |= UZ_bit;
  setFlag(f);
}

function setFlagsM(x: number): void {
  let f = flag & ~(Z_bit | C_bit | UZ_bit | LZ_bit);
  if ((x & 0x0F) !== 0) f |= LZ_bit;
  if ((x & 0xF0) !== 0) f |= UZ_bit;
  setFlag(f);
}

function setLogicC(): void {
  const x = opcode[0] & 3;
  if (x === 1 || x === 2) setFlag(flag | C_bit);
}

// ─── argument decoders ────────────────────────────────────────────────────────
function imm3Arg(x: number): number {
  let r = ((x >> 5) & 7) + 1;
  if (r < 2) r = 2;
  return r;
}

function imm7Arg(): number {
  const y = pc;
  if (opforg > 0 && (opindex & 1) === 0) fetchByte();
  let x = fetchByte();
  if ((x & 0x80) !== 0) x = 0x80 - x;
  return (x + y) & 0xFFFF;
}

function absArg(): number {
  let x = fetchByte();
  if (opforg > 0) fetchByte();
  return (x | (fetchByte() << 8)) & 0xFFFF;
}

function regArg(x: number): number {
  return x & 0x1F;
}

function shortRegArg(x: number): number {
  if ((x & 0x60) === 0x60) return regArg(fetchByte());
  return regArg(sirRead(x));
}

function shortRegAr1(x: number, y: number): number {
  if ((x & 0x60) === 0x60) return regArg(y);
  return regArg(sirRead(x));
}

function shortRegImm8(x: number): number {
  if ((opcode[0] & 0x40) === 0) return mr[shortRegArg(x)];
  return fetchByte();
}

function indexOffset(x: number): number {
  let r: number;
  if ((opcode[0] & 0x40) === 0) r = mr[shortRegArg(x)] & 0xFFFF;
  else r = fetchByte() & 0xFFFF;
  if ((x & 0x80) !== 0) r = (-r) & 0xFFFF;
  return r;
}

function getRegPair(x: number): number {
  return (mr[regArg(x)] | (mr[regArg(x + 1)] << 8)) & 0xFFFF;
}

function putRegPair(x: number, y: number): void {
  mr[regArg(x)]     = y & 0xFF;
  mr[regArg(x + 1)] = (y >> 8) & 0xFF;
}

// Transfer one byte (two nibbles) through LCD
function lcdByte(x: number): number {
  let r = lcdTransfer(x);
  r |= lcdTransfer(x >> 4) << 4;
  return r & 0xFF;
}

// ─── condition codes ──────────────────────────────────────────────────────────
function testCC(): boolean {
  switch (opcode[0] & 7) {
    case 0: return (flag & Z_bit)   === 0; // Z
    case 1: return (flag & C_bit)   === 0; // NC
    case 2: return (flag & LZ_bit)  === 0; // LZ
    case 3: return (flag & UZ_bit)  === 0; // UZ
    case 4: return (flag & Z_bit)   !== 0; // NZ
    case 5: return (flag & C_bit)   !== 0; // C
    case 6: return (flag & LZ_bit)  !== 0; // NLZ
    case 7: return true;                   // unconditional
    default: return false;
  }
}

// ─── stack ops ────────────────────────────────────────────────────────────────
function push(stackIdx: number, what: number): void {
  const sp = (stackSp(stackIdx) - 1) & 0xFFFF;
  stackSetSp(stackIdx, sp);
  dstWrite(addr18(ua >> 2, sp), what);
}

function pop(stackIdx: number): number {
  const sp = stackSp(stackIdx);
  const v  = srcRead(addr18(ua >> 2, sp));
  stackSetSp(stackIdx, (sp + 1) & 0xFFFF);
  return v;
}

function optionalJr(x: number): void {
  if ((x & 0x80) !== 0) {
    setPc(imm7Arg());
    setOpindex(0);
  }
}

// ─── logic operation (AN, NA, OR, XR) ────────────────────────────────────────
function logicOp(x1: number, x2: number): number {
  switch (opcode[0] & 3) {
    case 0: return (x1 & x2)   & 0xFF; // AN
    case 1: return (~(x1 & x2)) & 0xFF; // NA
    case 2: return (x1 | x2)   & 0xFF; // OR
    case 3: return (x1 ^ x2)   & 0xFF; // XR
    default: return 0;
  }
}

// ─── instruction handlers ─────────────────────────────────────────────────────

export function illComm(): void {
  setCycles(cycles + 3);
}

export function ld_02(): void {
  const x = fetchByte();
  mr[regArg(x)] = mr[shortRegArg(x)];
  optionalJr(x);
  setCycles(cycles + 3);
}

export function adSb_08(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const src = shortRegImm8(x);
  let y: number;
  if ((opcode[0] & 1) === 0) y = mr[dst] + src;
  else                        y = mr[dst] - src;
  if ((opcode[0] & 8) !== 0) mr[dst] = y & 0xFF;
  setFlagsB(y & 0xFF);
  if (y > 0xFF) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function adbSbb_0A(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const src = shortRegImm8(x);
  let y: number;
  if ((opcode[0] & 1) === 0) y = addBcd(mr[dst], src);
  else                        y = subBcd(mr[dst], src);
  mr[dst] = y & 0xFF;
  setFlagsB(y & 0xFF);
  if (y > 0xFF) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function logic_0C(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y = logicOp(mr[dst], shortRegImm8(x));
  if ((opcode[0] & 8) !== 0) mr[dst] = y;
  setFlagsB(y);
  setLogicC();
  optionalJr(x);
  setCycles(cycles + 3);
}

export function st_10(): void {
  const x = fetchByte();
  const o = getRegPair(shortRegArg(x));
  dstWrite(addr18(ua >> 4, o), mr[regArg(x)]);
  optionalJr(x);
  setCycles(cycles + 8);
}

export function ld_11(): void {
  const x = fetchByte();
  const o = getRegPair(shortRegArg(x));
  mr[regArg(x)] = srcRead(addr18(ua >> 4, o));
  optionalJr(x);
  setCycles(cycles + 8);
}

export function stl_12(): void {
  const x = fetchByte();
  lcdSync();
  lcdByte(mr[regArg(x)]);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function ldl_13(): void {
  const x = fetchByte();
  lcdSync();
  mr[regArg(x)] = lcdByte(0);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function ppoPfl_14(): void {
  const x = fetchByte();
  let y: number;
  if ((opcode[0] & 0x40) === 0) y = mr[regArg(x)];
  else y = fetchByte();
  if ((x & 0x40) === 0) setLcdctrl(y);
  else setFlag((flag & 0x0F) | (y & 0xF0));
  if ((opcode[0] & 0x40) === 0) optionalJr(x);
  setCycles(cycles + 3);
}

export function psr_15(): void {
  const x = fetchByte();
  let y: number;
  if ((opcode[0] & 0x40) === 0) y = mr[regArg(x)];
  else y = x;
  sirWrite(x, y & 0x1F);
  if ((opcode[0] & 0x40) === 0) optionalJr(x);
  setCycles(cycles + 3);
}

export function pst_16(): void {
  const x = fetchByte();
  const i = ((opcode[0] << 2) & 4) + ((x >> 5) & 3);
  let y: number;
  if ((opcode[0] & 0x40) === 0) y = mr[regArg(x)];
  else y = fetchByte();
  r8Write(i, y);
  if ((opcode[0] & 0x40) === 0) optionalJr(x);
  setCycles(cycles + 3);
}

export function rod_18(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y = mr[dst];
  mr[dst] = (mr[dst] >> 1) | ((flag & C_bit) !== 0 ? 0x80 : 0);
  setFlagsB(mr[dst]);
  if ((y & 1) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function rou_18(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y = mr[dst];
  mr[dst] = ((mr[dst] << 1) | ((flag & C_bit) !== 0 ? 1 : 0)) & 0xFF;
  setFlagsB(mr[dst]);
  if ((y & 0x80) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function bid_18(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y = mr[dst];
  mr[dst] = mr[dst] >> 1;
  setFlagsB(mr[dst]);
  if ((y & 1) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function biu_18(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y = mr[dst];
  mr[dst] = (mr[dst] << 1) & 0xFF;
  setFlagsB(mr[dst]);
  if ((y & 0x80) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function did_1A(): void {
  const x = fetchByte();
  const dst = regArg(x);
  mr[dst] = mr[dst] >> 4;
  setFlagsB(mr[dst]);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function diu_1A(): void {
  const x = fetchByte();
  const dst = regArg(x);
  mr[dst] = (mr[dst] << 4) & 0xFF;
  setFlagsB(mr[dst]);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function bydByu_1A(): void {
  const x = fetchByte();
  mr[regArg(x)] = 0;
  setFlag(flag & ~(C_bit | Z_bit | UZ_bit | LZ_bit));
  optionalJr(x);
  setCycles(cycles + 3);
}

export function cmpInv_1B(): void {
  const x = fetchByte();
  const dst = regArg(x);
  let y = (~mr[dst]) & 0xFF;
  if ((x & 0x40) === 0) y = (y + 1) & 0xFF;
  mr[dst] = y;
  setFlagsB(y);
  if (y !== 0 || (x & 0x40) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function gpoGfl_1C(): void {
  const x = fetchByte();
  if ((x & 0x40) === 0) mr[regArg(x)] = readPd();
  else                   mr[regArg(x)] = flag;
  optionalJr(x);
  setCycles(cycles + 3);
}

export function gsr_1D(): void {
  const x = fetchByte();
  mr[regArg(x)] = sirRead(x) & 0xFF;
  optionalJr(x);
  setCycles(cycles + 3);
}

export function gst_1E(): void {
  const x = fetchByte();
  const i = ((opcode[0] << 2) & 4) + ((x >> 5) & 3);
  mr[regArg(x)] = r8Read(i);
  optionalJr(x);
  setCycles(cycles + 3);
}

export function stSti_20(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const irsave = getIR();
  const x = fetchByte();
  setIR((getIR() + indexOffset(x)) & 0xFFFF);
  dstWrite(addr18(s, getIR()), mr[regArg(x)]);
  setIR((getIR() + 1) & 0xFFFF);
  if ((opcode[0] & 2) === 0) setIR(irsave);
  setCycles(cycles + 8);
}

export function std_24(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const x = fetchByte();
  setIR((getIR() + indexOffset(x)) & 0xFFFF);
  dstWrite(addr18(s, getIR()), mr[regArg(x)]);
  setCycles(cycles + 6);
}

export function phsPhu_26(): void {
  const si = opcode[0] & 1;
  push(si, mr[regArg(fetchByte())]);
  setCycles(cycles + 9);
}

export function ldLdi_28(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const irsave = getIR();
  const x = fetchByte();
  setIR((getIR() + indexOffset(x)) & 0xFFFF);
  mr[regArg(x)] = srcRead(addr18(s, getIR()));
  setIR((getIR() + 1) & 0xFFFF);
  if ((opcode[0] & 2) === 0) setIR(irsave);
  setCycles(cycles + 8);
}

export function ldd_2C(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const x = fetchByte();
  setIR((getIR() + indexOffset(x)) & 0xFFFF);
  mr[regArg(x)] = srcRead(addr18(s, getIR()));
  setCycles(cycles + 6);
}

export function ppsPpu_2E(): void {
  const si = opcode[0] & 1;
  mr[regArg(fetchByte())] = pop(si);
  setCycles(cycles + 11);
}

export function jp_3x(): void {
  const x = absArg();
  if (testCC()) { setPc(x); setOpindex(0); }
  setCycles(cycles + 3);
}

export function ld_42(): void {
  const x = fetchByte();
  mr[regArg(x)] = fetchByte();
  optionalJr(x);
  setCycles(cycles + 3);
}

export function adSb_38(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  let o = getIR();
  const x = fetchByte();
  o = (o + indexOffset(x)) & 0xFFFF;
  const srcVal = srcRead(addr18(s, o));
  let y: number;
  if ((opcode[0] & 2) === 0) y = srcVal + mr[regArg(x)];
  else                        y = srcVal - mr[regArg(x)];
  if ((opcode[0] & 4) !== 0) dstWrite(addr18(s, o), y & 0xFF);
  setFlagsB(y & 0xFF);
  if (y > 0xFF) setFlag(flag | C_bit);
  setCycles(cycles + 9);
}

export function st_50(): void {
  const x = fetchByte();
  const o = getRegPair(sirRead(x));
  dstWrite(addr18(ua >> 4, o), fetchByte());
  setCycles(cycles + 8);
}

export function ld_51(): void {
  const x = fetchByte();
  mr[regArg(x)] = fetchByte();
  setCycles(cycles + 8);
}

export function stl_52(): void {
  lcdSync();
  lcdByte(fetchByte());
  setCycles(cycles + 12);
}

export function bupsBdns_58(): void {
  const x1 = fetchByte();
  const s1 = ua >> 6;
  const s2 = ua >> 4;
  const step = (opcode[0] & 1) === 0 ? 1 : 0xFFFF;
  let y: number;
  do {
    const x2 = srcRead(addr18(s2, ix));
    dstWrite(addr18(s1, iz), x2);
    y = (x2 - x1) & 0xFFFF;
    setCycles(cycles + 6);
    if (y === 0 || ix === iy) break;
    setIx((ix + step) & 0xFFFF);
    setIz((iz + step) & 0xFFFF);
  } while (true);
  setFlagsB(y & 0xFF);
  if (y > 0xFF) setFlag(flag | C_bit);
  setCycles(cycles + 3);
}

export function supSdn_5C(): void {
  let x = fetchByte();
  if ((opcode[0] & 0x80) !== 0) x = mr[regArg(x)];
  const s = ua >> 4;
  const step = (opcode[0] & 1) === 0 ? 1 : 0xFFFF;
  let y: number;
  do {
    y = (srcRead(addr18(s, ix)) - x) & 0xFFFF;
    setCycles(cycles + 6);
    if (y === 0 || ix === iy) break;
    setIx((ix + step) & 0xFFFF);
  } while (true);
  setFlagsB(y & 0xFF);
  if (y > 0xFF) setFlag(flag | C_bit);
  setCycles(cycles + 3);
}

export function cal_7x(): void {
  const x = absArg();
  if (testCC()) {
    const retAddr = (pc - 1) & 0xFFFF;
    push(0, (retAddr >> 8) & 0xFF);
    push(0, retAddr & 0xFF);
    setPc(x);
    setOpindex(0);
    setCycles(cycles + 6);
  }
  setCycles(cycles + 3);
}

export function ldw_82(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const src = shortRegArg(x);
  mr[dst]             = mr[src];
  mr[regArg(dst + 1)] = mr[regArg(src + 1)];
  optionalJr(x);
  setCycles(cycles + 8);
}

export function adwSbw_88(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const src = shortRegArg(x);
  let y: number;
  if ((opcode[0] & 1) === 0) y = getRegPair(dst) + getRegPair(src);
  else                        y = getRegPair(dst) - getRegPair(src);
  if ((opcode[0] & 8) !== 0) putRegPair(dst, y);
  setFlagsW(y & 0xFFFF);
  if (y > 0xFFFF) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 8);
}

export function adbwSbbw_8A(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const src = shortRegArg(x);
  let y1: number, y2: number;
  if ((opcode[0] & 1) === 0) y1 = addBcd(mr[dst], mr[src]);
  else                        y1 = subBcd(mr[dst], mr[src]);
  mr[dst] = y1 & 0xFF;
  const carry = y1 > 0xFF ? 1 : 0;
  const src2 = regArg(src + 1), dst2 = regArg(dst + 1);
  if ((opcode[0] & 1) === 0) y2 = addBcd(mr[dst2], mr[src2] + carry);
  else                        y2 = subBcd(mr[dst2], mr[src2] + carry);
  mr[dst2] = y2 & 0xFF;
  setFlagsM(y2 & 0xFF);
  if (y2 > 0xFF) setFlag(flag | C_bit);
  if ((y1 | y2) !== 0) setFlag(flag | Z_bit);
  optionalJr(x);
  setCycles(cycles + 8);
}

export function logicW_8C(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const src = shortRegArg(x);
  const y1 = logicOp(mr[dst], mr[src]);
  if ((opcode[0] & 8) !== 0) mr[dst] = y1;
  const y2 = logicOp(mr[dst + 1], mr[src + 1]);
  if ((opcode[0] & 8) !== 0) mr[dst + 1] = y2;
  setFlagsM(y2);
  setLogicC();
  if ((y1 | y2) !== 0) setFlag(flag | Z_bit);
  optionalJr(x);
  setCycles(cycles + 8);
}

export function stw_90(): void {
  const x = fetchByte();
  const s = ua >> 4;
  const o = getRegPair(shortRegArg(x));
  dstWrite(addr18(s, o),     mr[regArg(x)]);
  dstWrite(addr18(s, o + 1), mr[regArg(x + 1)]);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function ldw_91(): void {
  const x = fetchByte();
  const s = ua >> 4;
  const o = getRegPair(shortRegArg(x));
  mr[regArg(x)]     = srcRead(addr18(s, o));
  mr[regArg(x + 1)] = srcRead(addr18(s, o + 1));
  optionalJr(x);
  setCycles(cycles + 11);
}

export function stlw_92(): void {
  const x = fetchByte();
  lcdSync();
  lcdByte(mr[regArg(x)]);
  lcdByte(mr[regArg(x + 1)]);
  optionalJr(x);
  setCycles(cycles + 19);
}

export function ldlw_93(): void {
  const x = fetchByte();
  lcdSync();
  mr[regArg(x)]     = lcdByte(0);
  mr[regArg(x + 1)] = lcdByte(0);
  optionalJr(x);
  setCycles(cycles + 19);
}

export function pre_96(): void {
  const x = fetchByte();
  const i = ((opcode[0] << 2) & 4) + ((x >> 5) & 3);
  r16Write(i, mr[regArg(x)], mr[regArg(x + 1)]);
  optionalJr(x);
  setCycles(cycles + 8);
}

export function rodw_98(): void {
  const x = fetchByte();
  const dst = regArg(x - 1);
  const y1 = getRegPair(dst);
  const y2 = (y1 >> 1) | ((flag & C_bit) !== 0 ? 0x8000 : 0);
  putRegPair(dst, y2);
  setFlagsD(y2);
  if ((y1 & 1) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function rouw_98(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y1 = getRegPair(dst);
  const y2 = ((y1 << 1) | ((flag & C_bit) !== 0 ? 1 : 0)) & 0xFFFF;
  putRegPair(dst, y2);
  setFlagsW(y2);
  if ((y1 & 0x8000) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function bidw_98(): void {
  const x = fetchByte();
  const dst = regArg(x - 1);
  const y1 = getRegPair(dst);
  const y2 = y1 >> 1;
  putRegPair(dst, y2);
  setFlagsD(y2);
  if ((y1 & 1) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function biuw_98(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y1 = getRegPair(dst);
  const y2 = (y1 << 1) & 0xFFFF;
  putRegPair(dst, y2);
  setFlagsW(y2);
  if ((y1 & 0x8000) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function didw_9A(): void {
  const x = fetchByte();
  const dst = regArg(x - 1);
  const y = getRegPair(dst) >> 4;
  putRegPair(dst, y);
  setFlagsD(y);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function diuw_9A(): void {
  const x = fetchByte();
  const dst = regArg(x);
  const y = (getRegPair(dst) << 4) & 0xFFFF;
  putRegPair(dst, y);
  setFlagsW(y);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function bydw_9A(): void {
  const x = fetchByte();
  const y = mr[regArg(x)];
  mr[regArg(x - 1)] = y;
  mr[regArg(x)]     = 0;
  setFlagsB(y);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function byuw_9A(): void {
  const x = fetchByte();
  const y = mr[regArg(x)];
  mr[regArg(x + 1)] = y;
  mr[regArg(x)]     = 0;
  setFlagsB(y);
  optionalJr(x);
  setCycles(cycles + 11);
}

export function cmpwInvw_9B(): void {
  const x = fetchByte();
  const dst = regArg(x);
  let y = (~getRegPair(dst)) & 0xFFFF;
  if ((x & 0x40) === 0) y = (y + 1) & 0xFFFF;
  putRegPair(dst, y);
  setFlagsW(y);
  if (y !== 0 || (x & 0x40) !== 0) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles + 8);
}

export function gpowGflw_9C(): void {
  const x = fetchByte();
  if ((x & 0x40) === 0) {
    mr[regArg(x)]     = readPd();
    mr[regArg(x + 1)] = readPd();
  } else {
    mr[regArg(x)]     = flag;
    mr[regArg(x + 1)] = flag;
  }
  optionalJr(x);
  setCycles(cycles + 8);
}

export function gre_9E(): void {
  const x = fetchByte();
  const i = ((opcode[0] << 2) & 4) + ((x >> 5) & 3);
  if (i >= 5) ky1 = (ky & 0x0F00) | readKy(ia & 0x0F);
  const v = r16Read(i);
  mr[regArg(x)]     = v & 0xFF;
  mr[regArg(x + 1)] = (v >> 8) & 0xFF;
  optionalJr(x);
  setCycles(cycles + 8);
}

export function stwStiw_A0(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const irsave = getIR();
  const x = fetchByte();
  const d = mr[shortRegArg(x)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  dstWrite(addr18(s, getIR()), mr[regArg(x)]);
  setIR((getIR() + 1) & 0xFFFF);
  dstWrite(addr18(s, getIR()), mr[regArg(x + 1)]);
  setIR((getIR() + 1) & 0xFFFF);
  if ((opcode[0] & 2) === 0) setIR(irsave);
  setCycles(cycles + 11);
}

export function stdw_A4(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const x = fetchByte();
  const d = mr[shortRegArg(x)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  dstWrite(addr18(s, getIR()),     mr[regArg(x)]);
  setIR((getIR() - 1) & 0xFFFF);
  dstWrite(addr18(s, getIR()), mr[regArg(x - 1)]);
  setCycles(cycles + 9);
}

export function phswPhuw_A6(): void {
  const si = opcode[0] & 1;
  const x = fetchByte();
  push(si, mr[regArg(x)]);
  push(si, mr[regArg(x - 1)]);
  setCycles(cycles + 12);
}

export function ldwLdiw_A8(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const irsave = getIR();
  const x = fetchByte();
  const d = mr[shortRegArg(x)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  mr[regArg(x)]     = srcRead(addr18(s, getIR()));
  setIR((getIR() + 1) & 0xFFFF);
  mr[regArg(x + 1)] = srcRead(addr18(s, getIR()));
  setIR((getIR() + 1) & 0xFFFF);
  if ((opcode[0] & 2) === 0) setIR(irsave);
  setCycles(cycles + 11);
}

export function lddw_AC(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const x = fetchByte();
  const d = mr[shortRegArg(x)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  mr[regArg(x)]     = srcRead(addr18(s, getIR()));
  setIR((getIR() - 1) & 0xFFFF);
  mr[regArg(x - 1)] = srcRead(addr18(s, getIR()));
  setCycles(cycles + 9);
}

export function ppswPpuw_AE(): void {
  const si = opcode[0] & 1;
  const x = fetchByte();
  mr[regArg(x)]     = pop(si);
  mr[regArg(x + 1)] = pop(si);
  setCycles(cycles + 14);
}

export function jr_Bx(): void {
  const x = imm7Arg();
  if (testCC()) { setPc(x); setOpindex(0); }
  setCycles(cycles + 3);
}

export function adwSbw_B8(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  let o = getIR();
  const x = fetchByte();
  const d = mr[shortRegArg(x)] & 0xFFFF;
  if ((x & 0x80) === 0) o = (o + d) & 0xFFFF;
  else                   o = (o - d) & 0xFFFF;
  const lo1 = srcRead(addr18(s, o));
  const lo2 = srcRead(addr18(s, o + 1));
  let y1: number, y2: number, carry: number;
  if ((opcode[0] & 2) === 0) {
    y1 = lo1 + mr[regArg(x)];
    carry = y1 > 0xFF ? 1 : 0;
    y2 = lo2 + mr[regArg(x + 1)] + carry;
  } else {
    y1 = lo1 - mr[regArg(x)];
    carry = y1 > 0xFF ? 1 : 0;
    y2 = lo2 - mr[regArg(x + 1)] - carry;
  }
  if ((opcode[0] & 4) !== 0) {
    dstWrite(addr18(s, o),     y1 & 0xFF);
    dstWrite(addr18(s, o + 1), y2 & 0xFF);
  }
  setFlagsM(y2 & 0xFF);
  if ((y1 | y2) !== 0) setFlag(flag | Z_bit);
  if (y2 > 0xFF) setFlag(flag | C_bit);
  setCycles(cycles + 15);
}

export function ldm_C2(): void {
  const x = fetchByte();
  const y = fetchByte();
  let src = shortRegAr1(x, y);
  let dst = x;
  let n   = imm3Arg(y);
  do {
    mr[regArg(dst)] = mr[regArg(src)];
    dst++; src++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  optionalJr(x);
  setCycles(cycles - 2);
}

export function adbmSbbm_C8(): void {
  const x = fetchByte();
  const z0 = fetchByte();
  let src = shortRegAr1(x, z0);
  let dst = x;
  let n   = imm3Arg(z0);
  let y1  = 0;
  let z   = 0;
  let y2  = 0;
  do {
    if ((opcode[0] & 1) === 0) y2 = addBcd(mr[regArg(dst)], mr[regArg(src)] + y1);
    else                        y2 = subBcd(mr[regArg(dst)], mr[regArg(src)] + y1);
    y1 = y2 > 0xFF ? 1 : 0;
    if ((opcode[0] & 8) !== 0) mr[regArg(dst)] = y2 & 0xFF;
    z |= y2 & 0xFF;
    dst++; src++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2 & 0xFF);
  if (z !== 0) setFlag(flag | Z_bit);
  if (y2 > 0xFF) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles - 2);
}

export function adbmSbbm_CA(): void {
  const x = fetchByte();
  const z0 = fetchByte();
  let dst = x;
  let n   = imm3Arg(z0);
  let y1  = z0 & 0x1F;
  let z   = 0;
  let y2  = 0;
  do {
    if ((opcode[0] & 1) === 0) y2 = addBcd(mr[regArg(dst)], y1);
    else                        y2 = subBcd(mr[regArg(dst)], y1);
    y1 = y2 > 0xFF ? 1 : 0;
    if ((opcode[0] & 8) !== 0) mr[regArg(dst)] = y2 & 0xFF;
    z |= y2 & 0xFF;
    dst++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2 & 0xFF);
  if (z !== 0) setFlag(flag | Z_bit);
  if (y2 > 0xFF) setFlag(flag | C_bit);
  optionalJr(x);
  setCycles(cycles - 2);
}

export function logicM_CC(): void {
  const x = fetchByte();
  const y0 = fetchByte();
  let src = shortRegAr1(x, y0);
  let dst = x;
  let n   = imm3Arg(y0);
  let z   = 0;
  let y   = 0;
  do {
    y = logicOp(mr[regArg(dst)], mr[regArg(src)]);
    if ((opcode[0] & 8) !== 0) mr[regArg(dst)] = y;
    z |= y;
    dst++; src++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y);
  setLogicC();
  if (z !== 0) setFlag(flag | Z_bit);
  optionalJr(x);
  setCycles(cycles - 2);
}

export function stw_D0(): void {
  const x = fetchByte();
  const s = ua >> 4;
  const o = getRegPair(sirRead(x));
  dstWrite(addr18(s, o),     fetchByte());
  dstWrite(addr18(s, o + 1), fetchByte());
  setCycles(cycles + 11);
}

export function ldw_D1(): void {
  const x = fetchByte();
  mr[regArg(x)]     = fetchByte();
  mr[regArg(x + 1)] = fetchByte();
  setCycles(cycles + 11);
}

export function stlm_D2(): void {
  let x = regArg(fetchByte());
  let n = imm3Arg(fetchByte());
  lcdSync();
  do {
    lcdByte(mr[regArg(x)]);
    x++; n--;
    setCycles(cycles + 8);
  } while (n > 0);
  setCycles(cycles + 3);
}

export function ldlm_D3(): void {
  let x = fetchByte();
  let n = imm3Arg(fetchByte());
  lcdSync();
  do {
    mr[regArg(x)] = lcdByte(0);
    x++; n--;
    setCycles(cycles + 8);
  } while (n > 0);
  setCycles(cycles + 3);
}

export function pre_D6(): void {
  const xbyte = fetchByte();
  const i = ((opcode[0] << 2) & 4) + ((xbyte >> 5) & 3);
  const lo = fetchByte();
  const hi = fetchByte();
  r16Write(i, lo, hi);
  setCycles(cycles + 8);
}

export function didm_DA(): void {
  let x  = fetchByte();
  let n  = imm3Arg(fetchByte());
  let y1 = 0, y2 = 0, z = 0;
  do {
    y2 = y1;
    y1 = mr[regArg(x)];
    y2 = ((y1 >> 4) | (y2 << 4)) & 0xFF;
    mr[regArg(x)] = y2;
    z |= y2;
    x--; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2);
  if (z !== 0) setFlag(flag | Z_bit);
  setCycles(cycles - 2);
}

export function dium_DA(): void {
  let x  = fetchByte();
  let n  = imm3Arg(fetchByte());
  let y1 = 0, y2 = 0, z = 0;
  do {
    y2 = y1;
    y1 = mr[regArg(x)];
    y2 = ((y1 << 4) | (y2 >> 4)) & 0xFF;
    mr[regArg(x)] = y2;
    z |= y2;
    x++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2);
  if (z !== 0) setFlag(flag | Z_bit);
  setCycles(cycles - 2);
}

export function bydm_DA(): void {
  let x  = fetchByte();
  let n  = imm3Arg(fetchByte());
  let y1 = 0, y2 = 0, z = 0;
  do {
    y2 = y1;
    y1 = mr[regArg(x)];
    mr[regArg(x)] = y2;
    z |= y2;
    x--; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2);
  if (z !== 0) setFlag(flag | Z_bit);
  setCycles(cycles - 2);
}

export function byum_DA(): void {
  let x  = fetchByte();
  let n  = imm3Arg(fetchByte());
  let y1 = 0, y2 = 0, z = 0;
  do {
    y2 = y1;
    y1 = mr[regArg(x)];
    mr[regArg(x)] = y2;
    z |= y2;
    x++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2);
  if (z !== 0) setFlag(flag | Z_bit);
  setCycles(cycles - 2);
}

export function bupBdn_D8(): void {
  const s1 = ua >> 6;
  const s2 = ua >> 4;
  const step = (opcode[0] & 1) === 0 ? 1 : 0xFFFF;
  do {
    dstWrite(addr18(s1, iz), srcRead(addr18(s2, ix)));
    setCycles(cycles + 6);
    if (ix === iy) break;
    setIx((ix + step) & 0xFFFF);
    setIz((iz + step) & 0xFFFF);
  } while (true);
  setCycles(cycles + 3);
}

export function cmpmInvm_DB(): void {
  let x = fetchByte();
  let n = imm3Arg(fetchByte());
  let y1 = (x & 0x40) === 0 ? 1 : 0;
  let z = 0, y2 = 0;
  do {
    y2 = (y1 + ((~mr[regArg(x)]) & 0xFF)) & 0xFF;
    mr[regArg(x)] = y2;
    if (y2 !== 0) y1 = 0;
    z |= y2;
    x++; n--;
    setCycles(cycles + 5);
  } while (n > 0);
  setFlagsM(y2);
  if (z !== 0) setFlag(flag | Z_bit);
  if (z !== 0 || (opcode[1] & 0x40) !== 0) setFlag(flag | C_bit);
  setCycles(cycles - 2);
}

export function jp_DE(): void {
  setPc(getRegPair(fetchByte()));
  setOpindex(0);
  setCycles(cycles + 5);
}

export function jp_DF(): void {
  const s = ua >> 4;
  const o = getRegPair(fetchByte());
  setPc(srcRead(addr18(s, o)) | (srcRead(addr18(s, o + 1)) << 8));
  setOpindex(0);
  setCycles(cycles + 5);
}

export function stmStim_E0(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const irsave = getIR();
  let x = fetchByte();
  const y = fetchByte();
  const d = mr[shortRegAr1(x, y)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  let n = imm3Arg(y);
  do {
    dstWrite(addr18(s, getIR()), mr[regArg(x)]);
    x++; setIR((getIR() + 1) & 0xFFFF); n--;
    setCycles(cycles + 3);
  } while (n > 0);
  if ((opcode[0] & 2) === 0) setIR(irsave);
  setCycles(cycles + 5);
}

export function stdm_E4(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  let x = fetchByte();
  const y = fetchByte();
  const d = mr[shortRegAr1(x, y)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  let n = imm3Arg(y);
  do {
    dstWrite(addr18(s, getIR()), mr[regArg(x)]);
    x--; setIR((getIR() - 1) & 0xFFFF); n--;
    setCycles(cycles + 3);
  } while (n > 0);
  setIR((getIR() + 1) & 0xFFFF);
  setCycles(cycles + 3);
}

export function phsmPhum_E6(): void {
  const si = opcode[0] & 1;
  let x = fetchByte();
  let n = imm3Arg(fetchByte());
  do {
    push(si, mr[regArg(x)]);
    x--; n--;
    setCycles(cycles + 3);
  } while (n > 0);
  setCycles(cycles + 3);
}

export function ldmLdim_E8(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  const irsave = getIR();
  let x = fetchByte();
  const y = fetchByte();
  const d = mr[shortRegAr1(x, y)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  let n = imm3Arg(y);
  do {
    mr[regArg(x)] = srcRead(addr18(s, getIR()));
    x++; setIR((getIR() + 1) & 0xFFFF); n--;
    setCycles(cycles + 3);
  } while (n > 0);
  if ((opcode[0] & 2) === 0) setIR(irsave);
  setCycles(cycles + 5);
}

export function lddm_EC(): void {
  function getIR(): number { return (opcode[0] & 1) === 0 ? ix : iz; }
  function setIR(v: number): void { if ((opcode[0] & 1) === 0) setIx(v); else setIz(v); }
  const s = (opcode[0] & 1) === 0 ? ua >> 4 : ua >> 6;
  let x = fetchByte();
  const y = fetchByte();
  const d = mr[shortRegAr1(x, y)] & 0xFFFF;
  if ((x & 0x80) === 0) setIR((getIR() + d) & 0xFFFF);
  else                   setIR((getIR() - d) & 0xFFFF);
  let n = imm3Arg(y);
  do {
    mr[regArg(x)] = srcRead(addr18(s, getIR()));
    x--; setIR((getIR() - 1) & 0xFFFF); n--;
    setCycles(cycles + 3);
  } while (n > 0);
  setIR((getIR() + 1) & 0xFFFF);
  setCycles(cycles + 3);
}

export function ppsmPpum_EE(): void {
  const si = opcode[0] & 1;
  let x = fetchByte();
  let n = imm3Arg(fetchByte());
  do {
    mr[regArg(x)] = pop(si);
    x++; n--;
    setCycles(cycles + 3);
  } while (n > 0);
  setCycles(cycles + 5);
}

export function rtn_Fx(): void {
  if (testCC()) {
    const lo = pop(0);
    const hi = pop(0);
    setPc(((lo | (hi << 8)) + 1) & 0xFFFF);
    setOpindex(0);
    setCycles(cycles + 8);
  }
  setCycles(cycles + 3);
}

export function nop_F8(): void {
  setCycles(cycles + 3);
}

export function clt_F9(): void {
  setTm(0);
  setCycles(cycles + 3);
}

export function fst_FA(): void {
  setSpeed(0);
  setCycles(cycles + 3);
}

export function slw_FB(): void {
  setSpeed(4);
  setCycles(cycles + 3);
}

export function cani_FC(): void {
  let mask = 0x10;
  while (mask >= 0x01) {
    if ((ib & mask) !== 0) {
      setIb(ib & ~mask);
      setIserv(iserv & ~mask);
      break;
    }
    mask >>= 1;
  }
  setCycles(cycles + 3);
}

export function rtni_FD(): void {
  const lo = pop(0);
  const hi = pop(0);
  setPc((lo | (hi << 8)) & 0xFFFF);
  setOpindex(0);
  cani_FC();
  setCycles(cycles + 8);
  if ((ua & 3) !== 0) setCycles(cycles + 1);
}

export function off_FE(): void {
  setUa(0);
  setPc(0x0010);
  setOpindex(0);
  setIe(ie & 0x1C);
  setIa(0);
  setIb(ib & 0xE3);
  setIserv(0);
  setIx(0); setIy(0); setIz(0);
  setSx(0); setSy(0); setSz(0);
  setPe(0); writePd();
  setLcdctrl(0);
  lcdInit();
  ioInit();
  setCpuSleep(true);
  let f = flag;
  if ((f & SW_bit) !== 0) f = f | APO_bit; else f = f & ~APO_bit;
  setFlag(f & 0xFF);
  setCycles(cycles + 3);
}

export function trp_FF(): void {
  const retAddr = (pc - 1) & 0xFFFF;
  push(0, (retAddr >> 8) & 0xFF);
  push(0, retAddr & 0xFF);
  setPc(0x0022);
  setOpindex(0);
  setCycles(cycles + 9);
}

// ─── secondary dispatch (opcode[1] bits 7:5 select sub-operation) ────────────

function ext18(): void {
  const sub = (opcode[1] >> 5) & 3;
  [rod_18, rou_18, bid_18, biu_18][sub]();
}

function ext1A(): void {
  const sub = (opcode[1] >> 5) & 3;
  [did_1A, diu_1A, bydByu_1A, bydByu_1A][sub]();
}

function ext98(): void {
  const sub = (opcode[1] >> 5) & 3;
  [rodw_98, rouw_98, bidw_98, biuw_98][sub]();
}

function ext9A(): void {
  const sub = (opcode[1] >> 5) & 3;
  [didw_9A, diuw_9A, bydw_9A, byuw_9A][sub]();
}

function extDA(): void {
  const sub = (opcode[1] >> 5) & 3;
  [didm_DA, dium_DA, bydm_DA, byum_DA][sub]();
}

// ─── primary dispatch table (256 entries, indexed by opcode[0]) ──────────────

const dispatch: ReadonlyArray<() => void> = [
  /* $00 */ adSb_08,   /* $01 */ adSb_08,   /* $02 */ ld_02,      /* $03 */ illComm,
  /* $04 */ logic_0C,  /* $05 */ logic_0C,  /* $06 */ logic_0C,   /* $07 */ logic_0C,
  /* $08 */ adSb_08,   /* $09 */ adSb_08,   /* $0A */ adbSbb_0A,  /* $0B */ adbSbb_0A,
  /* $0C */ logic_0C,  /* $0D */ logic_0C,  /* $0E */ logic_0C,   /* $0F */ logic_0C,
  /* $10 */ st_10,     /* $11 */ ld_11,     /* $12 */ stl_12,     /* $13 */ ldl_13,
  /* $14 */ ppoPfl_14, /* $15 */ psr_15,    /* $16 */ pst_16,     /* $17 */ pst_16,
  /* $18 */ ext18,     /* $19 */ illComm,   /* $1A */ ext1A,      /* $1B */ cmpInv_1B,
  /* $1C */ gpoGfl_1C, /* $1D */ gsr_1D,   /* $1E */ gst_1E,     /* $1F */ gst_1E,
  /* $20 */ stSti_20,  /* $21 */ stSti_20,  /* $22 */ stSti_20,   /* $23 */ stSti_20,
  /* $24 */ std_24,    /* $25 */ std_24,    /* $26 */ phsPhu_26,  /* $27 */ phsPhu_26,
  /* $28 */ ldLdi_28,  /* $29 */ ldLdi_28,  /* $2A */ ldLdi_28,   /* $2B */ ldLdi_28,
  /* $2C */ ldd_2C,    /* $2D */ ldd_2C,    /* $2E */ ppsPpu_2E,  /* $2F */ ppsPpu_2E,
  /* $30 */ jp_3x,     /* $31 */ jp_3x,     /* $32 */ jp_3x,      /* $33 */ jp_3x,
  /* $34 */ jp_3x,     /* $35 */ jp_3x,     /* $36 */ jp_3x,      /* $37 */ jp_3x,
  /* $38 */ adSb_38,   /* $39 */ adSb_38,   /* $3A */ adSb_38,    /* $3B */ adSb_38,
  /* $3C */ adSb_38,   /* $3D */ adSb_38,   /* $3E */ adSb_38,    /* $3F */ adSb_38,
  /* $40 */ adSb_08,   /* $41 */ adSb_08,   /* $42 */ ld_42,      /* $43 */ illComm,
  /* $44 */ logic_0C,  /* $45 */ logic_0C,  /* $46 */ logic_0C,   /* $47 */ logic_0C,
  /* $48 */ adSb_08,   /* $49 */ adSb_08,   /* $4A */ adbSbb_0A,  /* $4B */ adbSbb_0A,
  /* $4C */ logic_0C,  /* $4D */ logic_0C,  /* $4E */ logic_0C,   /* $4F */ logic_0C,
  /* $50 */ st_50,     /* $51 */ ld_51,     /* $52 */ stl_52,     /* $53 */ illComm,
  /* $54 */ ppoPfl_14, /* $55 */ psr_15,    /* $56 */ pst_16,     /* $57 */ pst_16,
  /* $58 */ bupsBdns_58, /* $59 */ bupsBdns_58, /* $5A */ illComm,  /* $5B */ illComm,
  /* $5C */ supSdn_5C, /* $5D */ supSdn_5C, /* $5E */ illComm,    /* $5F */ illComm,
  /* $60 */ stSti_20,  /* $61 */ stSti_20,  /* $62 */ stSti_20,   /* $63 */ stSti_20,
  /* $64 */ std_24,    /* $65 */ std_24,    /* $66 */ illComm,    /* $67 */ illComm,
  /* $68 */ ldLdi_28,  /* $69 */ ldLdi_28,  /* $6A */ ldLdi_28,   /* $6B */ ldLdi_28,
  /* $6C */ ldd_2C,    /* $6D */ ldd_2C,    /* $6E */ illComm,    /* $6F */ illComm,
  /* $70 */ cal_7x,    /* $71 */ cal_7x,    /* $72 */ cal_7x,     /* $73 */ cal_7x,
  /* $74 */ cal_7x,    /* $75 */ cal_7x,    /* $76 */ cal_7x,     /* $77 */ cal_7x,
  /* $78 */ adSb_38,   /* $79 */ adSb_38,   /* $7A */ adSb_38,    /* $7B */ adSb_38,
  /* $7C */ adSb_38,   /* $7D */ adSb_38,   /* $7E */ adSb_38,    /* $7F */ adSb_38,
  /* $80 */ adwSbw_88, /* $81 */ adwSbw_88, /* $82 */ ldw_82,     /* $83 */ illComm,
  /* $84 */ logicW_8C, /* $85 */ logicW_8C, /* $86 */ logicW_8C,  /* $87 */ logicW_8C,
  /* $88 */ adwSbw_88, /* $89 */ adwSbw_88, /* $8A */ adbwSbbw_8A, /* $8B */ adbwSbbw_8A,
  /* $8C */ logicW_8C, /* $8D */ logicW_8C, /* $8E */ logicW_8C,  /* $8F */ logicW_8C,
  /* $90 */ stw_90,    /* $91 */ ldw_91,    /* $92 */ stlw_92,    /* $93 */ ldlw_93,
  /* $94 */ illComm,   /* $95 */ illComm,   /* $96 */ pre_96,     /* $97 */ pre_96,
  /* $98 */ ext98,     /* $99 */ illComm,   /* $9A */ ext9A,      /* $9B */ cmpwInvw_9B,
  /* $9C */ gpowGflw_9C, /* $9D */ illComm, /* $9E */ gre_9E,     /* $9F */ gre_9E,
  /* $A0 */ stwStiw_A0, /* $A1 */ stwStiw_A0, /* $A2 */ stwStiw_A0, /* $A3 */ stwStiw_A0,
  /* $A4 */ stdw_A4,   /* $A5 */ stdw_A4,   /* $A6 */ phswPhuw_A6, /* $A7 */ phswPhuw_A6,
  /* $A8 */ ldwLdiw_A8, /* $A9 */ ldwLdiw_A8, /* $AA */ ldwLdiw_A8, /* $AB */ ldwLdiw_A8,
  /* $AC */ lddw_AC,   /* $AD */ lddw_AC,   /* $AE */ ppswPpuw_AE, /* $AF */ ppswPpuw_AE,
  /* $B0 */ jr_Bx,     /* $B1 */ jr_Bx,     /* $B2 */ jr_Bx,      /* $B3 */ jr_Bx,
  /* $B4 */ jr_Bx,     /* $B5 */ jr_Bx,     /* $B6 */ jr_Bx,      /* $B7 */ jr_Bx,
  /* $B8 */ adwSbw_B8, /* $B9 */ adwSbw_B8, /* $BA */ adwSbw_B8,  /* $BB */ adwSbw_B8,
  /* $BC */ adwSbw_B8, /* $BD */ adwSbw_B8, /* $BE */ adwSbw_B8,  /* $BF */ adwSbw_B8,
  /* $C0 */ adbmSbbm_C8, /* $C1 */ adbmSbbm_C8, /* $C2 */ ldm_C2, /* $C3 */ illComm,
  /* $C4 */ logicM_CC, /* $C5 */ logicM_CC, /* $C6 */ logicM_CC,  /* $C7 */ logicM_CC,
  /* $C8 */ adbmSbbm_C8, /* $C9 */ adbmSbbm_C8, /* $CA */ adbmSbbm_CA, /* $CB */ adbmSbbm_CA,
  /* $CC */ logicM_CC, /* $CD */ logicM_CC, /* $CE */ logicM_CC,  /* $CF */ logicM_CC,
  /* $D0 */ stw_D0,    /* $D1 */ ldw_D1,    /* $D2 */ stlm_D2,    /* $D3 */ ldlm_D3,
  /* $D4 */ illComm,   /* $D5 */ illComm,   /* $D6 */ pre_D6,     /* $D7 */ pre_D6,
  /* $D8 */ bupBdn_D8, /* $D9 */ bupBdn_D8, /* $DA */ extDA,      /* $DB */ cmpmInvm_DB,
  /* $DC */ supSdn_5C, /* $DD */ supSdn_5C, /* $DE */ jp_DE,      /* $DF */ jp_DF,
  /* $E0 */ stmStim_E0, /* $E1 */ stmStim_E0, /* $E2 */ stmStim_E0, /* $E3 */ stmStim_E0,
  /* $E4 */ stdm_E4,   /* $E5 */ stdm_E4,   /* $E6 */ phsmPhum_E6, /* $E7 */ phsmPhum_E6,
  /* $E8 */ ldmLdim_E8, /* $E9 */ ldmLdim_E8, /* $EA */ ldmLdim_E8, /* $EB */ ldmLdim_E8,
  /* $EC */ lddm_EC,   /* $ED */ lddm_EC,   /* $EE */ ppsmPpum_EE, /* $EF */ ppsmPpum_EE,
  /* $F0 */ rtn_Fx,    /* $F1 */ rtn_Fx,    /* $F2 */ rtn_Fx,     /* $F3 */ rtn_Fx,
  /* $F4 */ rtn_Fx,    /* $F5 */ rtn_Fx,    /* $F6 */ rtn_Fx,     /* $F7 */ rtn_Fx,
  /* $F8 */ nop_F8,    /* $F9 */ clt_F9,    /* $FA */ fst_FA,     /* $FB */ slw_FB,
  /* $FC */ cani_FC,   /* $FD */ rtni_FD,   /* $FE */ off_FE,     /* $FF */ trp_FF,
];

// ─── main entry point: fetch and execute one instruction ─────────────────────
export function execInstr(): void {
  const opIdx = fetchOpcode();
  dispatch[opIdx]();
  // Align PC: for word-addressed memory, consume the padding byte if opindex is odd
  if (opforg > 0 && (opindex & 1) !== 0) fetchByte();
}
