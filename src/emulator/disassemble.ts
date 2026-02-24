// HD61700 disassembler — browser-side, reads from live emulator memdef
// Adapted from tools/dis.ts (which reads from files for CLI use).

import { memdef } from './def.js';

// ─── memory helpers ──────────────────────────────────────────────────────────

function memorgAt(addr: number): number {
  for (const m of memdef) {
    if (addr >= m.first && addr < m.last) return m.memorg;
  }
  return 0;
}

function rawRead(addr: number): number {
  for (const m of memdef) {
    if (!m.data || addr < m.first || addr >= m.last) continue;
    const idx = (m.offset + (addr - m.first)) << m.memorg;
    return m.data[idx] ?? 0xFF;
  }
  return 0xFF;
}

// ─── fetch state (module-level, reset per call to disOneLine) ────────────────

let _pc     = 0;
let _opforg = 0;
const _opcode = new Uint8Array(4);
let _opindex  = 0;

function fetchOpcode(): number {
  _opforg = memorgAt(_pc);

  if (_opforg === 0) {
    _opcode[0] = rawRead(_pc);
    _opcode[1] = rawRead((_pc + 1) & 0xFFFF);
    _opcode[2] = rawRead((_pc + 2) & 0xFFFF);
    _opcode[3] = rawRead((_pc + 3) & 0xFFFF);
  } else {
    // Word memory: each PC address = 1 word (2 file bytes)
    for (const m of memdef) {
      if (m.memorg === 1 && m.data && _pc >= m.first && _pc < m.last) {
        const base = (m.offset + (_pc - m.first)) * 2;
        _opcode[0] = m.data[base]     ?? 0xFF;
        _opcode[1] = m.data[base + 1] ?? 0xFF;
        break;
      }
    }
    const pc1 = (_pc + 1) & 0xFFFF;
    for (const m of memdef) {
      if (m.memorg === 1 && m.data && pc1 >= m.first && pc1 < m.last) {
        const base = (m.offset + (pc1 - m.first)) * 2;
        _opcode[2] = m.data[base]     ?? 0xFF;
        _opcode[3] = m.data[base + 1] ?? 0xFF;
        break;
      }
    }
  }

  _opindex = 0;
  return fetchByte();
}

function fetchByte(): number {
  const b = _opcode[_opindex] ?? 0xFF;
  if (_opforg === 0) {
    _pc = (_pc + 1) & 0xFFFF;
  } else if (_opindex & 1) {
    _pc = (_pc + 1) & 0xFFFF;
  }
  _opindex++;
  return b;
}

// ─── Mnemonic table (mirrors tools/dis.ts exactly) ───────────────────────────

// Plain numeric constants instead of const enum (const enum banned by erasableSyntaxOnly)
const Kind = {
  ILLOP: 0, NONE: 1, CC: 2, JRCC: 3, JPCC: 4, JR: 5, JP: 6,
  REGREGJR: 7, REGDIRJR: 8, REGJR: 9, REGIRR: 10, REGIRRIM3: 11,
  REG: 12, DIR: 13, IRRREG: 14, REGIM8JR: 15, IM8: 16, IM8A: 17, R8IM8: 18,
  REGIRI: 19, IRIREG: 20, R8REGJR: 21, R16REGJR: 22, R16IM16: 23,
  IM8IND: 24, IM16IND: 25, RRIM3JR: 26, RIM5IM3JR: 27, REGIM8: 28,
  REGIM16: 29, REGIM3: 30, SIRREGJR: 31, SIRREGIM3: 32, SIRIM5: 33,
} as const;
type KindVal = typeof Kind[keyof typeof Kind];

type OpEntry  = { mnem: string; kind: KindVal };
type ExtEntry = { mnem: '0';    ext:  number   };
type Entry    = OpEntry | ExtEntry;

const op = (mnem: string, kind: KindVal): Entry => ({ mnem, kind });
const ex = (n: number): Entry => ({ mnem: '0', ext: 256 + n * 4 });

const mnemTab: Entry[] = [
  op('adc',   Kind.REGREGJR),   op('sbc',   Kind.REGREGJR),   op('ld',    Kind.REGREGJR),   op('ldc',   Kind.REGREGJR),
  op('anc',   Kind.REGREGJR),   op('nac',   Kind.REGREGJR),   op('orc',   Kind.REGREGJR),   op('xrc',   Kind.REGREGJR),
  op('ad',    Kind.REGREGJR),   op('sb',    Kind.REGREGJR),   op('adb',   Kind.REGREGJR),   op('sbb',   Kind.REGREGJR),
  op('an',    Kind.REGREGJR),   op('na',    Kind.REGREGJR),   op('or',    Kind.REGREGJR),   op('xr',    Kind.REGREGJR),
  op('st',    Kind.REGDIRJR),   op('ld',    Kind.REGDIRJR),   ex(0),                          ex(18),
  ex(1),                          op('psr',   Kind.SIRREGJR),   op('pst',   Kind.R8REGJR),    op('pst',   Kind.R8REGJR),
  ex(2),                          op('****',  Kind.ILLOP),      ex(3),                          ex(4),
  ex(5),                          op('gsr',   Kind.SIRREGJR),   op('gst',   Kind.R8REGJR),    op('gst',   Kind.R8REGJR),
  op('st',    Kind.REGIRR),     op('st',    Kind.REGIRR),     op('sti',   Kind.REGIRR),     op('sti',   Kind.REGIRR),
  op('std',   Kind.REGIRR),     op('std',   Kind.REGIRR),     op('phs',   Kind.REG),        op('phu',   Kind.REG),
  op('ld',    Kind.REGIRR),     op('ld',    Kind.REGIRR),     op('ldi',   Kind.REGIRR),     op('ldi',   Kind.REGIRR),
  op('ldd',   Kind.REGIRR),     op('ldd',   Kind.REGIRR),     op('pps',   Kind.REG),        op('ppu',   Kind.REG),
  op('jp',    Kind.JPCC),       op('jp',    Kind.JPCC),       op('jp',    Kind.JPCC),       op('jp',    Kind.JPCC),
  op('jp',    Kind.JPCC),       op('jp',    Kind.JPCC),       op('jp',    Kind.JPCC),       op('jp',    Kind.JP),
  op('adc',   Kind.IRRREG),     op('adc',   Kind.IRRREG),     op('sbc',   Kind.IRRREG),     op('sbc',   Kind.IRRREG),
  op('ad',    Kind.IRRREG),     op('ad',    Kind.IRRREG),     op('sb',    Kind.IRRREG),     op('sb',    Kind.IRRREG),
  op('adc',   Kind.REGIM8JR),   op('sbc',   Kind.REGIM8JR),   op('ld',    Kind.REGIM8JR),   op('ldc',   Kind.REGIM8JR),
  op('anc',   Kind.REGIM8JR),   op('nac',   Kind.REGIM8JR),   op('orc',   Kind.REGIM8JR),   op('xrc',   Kind.REGIM8JR),
  op('ad',    Kind.REGIM8JR),   op('sb',    Kind.REGIM8JR),   op('adb',   Kind.REGIM8JR),   op('sbb',   Kind.REGIM8JR),
  op('an',    Kind.REGIM8JR),   op('na',    Kind.REGIM8JR),   op('or',    Kind.REGIM8JR),   op('xr',    Kind.REGIM8JR),
  op('st',    Kind.IM8IND),     ex(20),                         op('stl',   Kind.IM8),        op('****',  Kind.ILLOP),
  ex(6),                          op('psr',   Kind.SIRIM5),     op('pst',   Kind.R8IM8),      op('pst',   Kind.R8IM8),
  op('bups',  Kind.IM8),        op('bdns',  Kind.IM8),        op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('sup',   Kind.IM8),        op('sdn',   Kind.IM8),        op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('st',    Kind.REGIRI),     op('st',    Kind.REGIRI),     op('sti',   Kind.REGIRI),     op('sti',   Kind.REGIRI),
  op('std',   Kind.REGIRI),     op('std',   Kind.REGIRI),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ld',    Kind.REGIRI),     op('ld',    Kind.REGIRI),     op('ldi',   Kind.REGIRI),     op('ldi',   Kind.REGIRI),
  op('ldd',   Kind.REGIRI),     op('ldd',   Kind.REGIRI),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('cal',   Kind.JPCC),       op('cal',   Kind.JPCC),       op('cal',   Kind.JPCC),       op('cal',   Kind.JPCC),
  op('cal',   Kind.JPCC),       op('cal',   Kind.JPCC),       op('cal',   Kind.JPCC),       op('cal',   Kind.JP),
  op('adc',   Kind.IRIREG),     op('adc',   Kind.IRIREG),     op('sbc',   Kind.IRIREG),     op('sbc',   Kind.IRIREG),
  op('ad',    Kind.IRIREG),     op('ad',    Kind.IRIREG),     op('sb',    Kind.IRIREG),     op('sb',    Kind.IRIREG),
  op('adcw',  Kind.REGREGJR),   op('sbcw',  Kind.REGREGJR),   op('ldw',   Kind.REGREGJR),   op('ldcw',  Kind.REGREGJR),
  op('ancw',  Kind.REGREGJR),   op('nacw',  Kind.REGREGJR),   op('orcw',  Kind.REGREGJR),   op('xrcw',  Kind.REGREGJR),
  op('adw',   Kind.REGREGJR),   op('sbw',   Kind.REGREGJR),   op('adbw',  Kind.REGREGJR),   op('sbbw',  Kind.REGREGJR),
  op('anw',   Kind.REGREGJR),   op('naw',   Kind.REGREGJR),   op('orw',   Kind.REGREGJR),   op('xrw',   Kind.REGREGJR),
  op('stw',   Kind.REGDIRJR),   op('ldw',   Kind.REGDIRJR),   ex(7),                          ex(19),
  ex(8),                          op('psrw',  Kind.SIRREGJR),   op('pre',   Kind.R16REGJR),   op('pre',   Kind.R16REGJR),
  ex(9),                          op('****',  Kind.ILLOP),      ex(10),                         ex(11),
  ex(12),                         op('gsrw',  Kind.SIRREGJR),   op('gre',   Kind.R16REGJR),   op('gre',   Kind.R16REGJR),
  op('stw',   Kind.REGIRR),     op('stw',   Kind.REGIRR),     op('stiw',  Kind.REGIRR),     op('stiw',  Kind.REGIRR),
  op('stdw',  Kind.REGIRR),     op('stdw',  Kind.REGIRR),     op('phsw',  Kind.REG),        op('phuw',  Kind.REG),
  op('ldw',   Kind.REGIRR),     op('ldw',   Kind.REGIRR),     op('ldiw',  Kind.REGIRR),     op('ldiw',  Kind.REGIRR),
  op('lddw',  Kind.REGIRR),     op('lddw',  Kind.REGIRR),     op('ppsw',  Kind.REG),        op('ppuw',  Kind.REG),
  op('jr',    Kind.JRCC),       op('jr',    Kind.JRCC),       op('jr',    Kind.JRCC),       op('jr',    Kind.JRCC),
  op('jr',    Kind.JRCC),       op('jr',    Kind.JRCC),       op('jr',    Kind.JRCC),       op('jr',    Kind.JR),
  op('adcw',  Kind.IRRREG),     op('adcw',  Kind.IRRREG),     op('sbcw',  Kind.IRRREG),     op('sbcw',  Kind.IRRREG),
  op('adw',   Kind.IRRREG),     op('adw',   Kind.IRRREG),     op('sbw',   Kind.IRRREG),     op('sbw',   Kind.IRRREG),
  op('adbcm', Kind.RRIM3JR),    op('sbbcm', Kind.RRIM3JR),    op('ldm',   Kind.RRIM3JR),    op('ldcm',  Kind.RRIM3JR),
  op('ancm',  Kind.RRIM3JR),    op('nacm',  Kind.RRIM3JR),    op('orcm',  Kind.RRIM3JR),    op('xrcm',  Kind.RRIM3JR),
  op('adbm',  Kind.RRIM3JR),    op('sbbm',  Kind.RRIM3JR),    ex(13),                         ex(14),
  op('anm',   Kind.RRIM3JR),    op('nam',   Kind.RRIM3JR),    op('orm',   Kind.RRIM3JR),    op('xrm',   Kind.RRIM3JR),
  op('stw',   Kind.IM16IND),    ex(21),                         op('stlm',  Kind.REGIM3),     ex(15),
  op('ppom',  Kind.REGIM3),     op('psrm',  Kind.SIRREGIM3),   op('pre',   Kind.R16IM16),    op('pre',   Kind.R16IM16),
  op('bup',   Kind.NONE),       op('bdn',   Kind.NONE),       ex(16),                         ex(17),
  op('sup',   Kind.REG),        op('sdn',   Kind.REG),        op('jp',    Kind.REG),        op('jp',    Kind.DIR),
  op('stm',   Kind.REGIRRIM3),  op('stm',   Kind.REGIRRIM3),  op('stim',  Kind.REGIRRIM3),  op('stim',  Kind.REGIRRIM3),
  op('stdm',  Kind.REGIRRIM3),  op('stdm',  Kind.REGIRRIM3),  op('phsm',  Kind.REGIM3),     op('phum',  Kind.REGIM3),
  op('ldm',   Kind.REGIRRIM3),  op('ldm',   Kind.REGIRRIM3),  op('ldim',  Kind.REGIRRIM3),  op('ldim',  Kind.REGIRRIM3),
  op('lddm',  Kind.REGIRRIM3),  op('lddm',  Kind.REGIRRIM3),  op('ppsm',  Kind.REGIM3),     op('ppum',  Kind.REGIM3),
  op('rtn',   Kind.CC),         op('rtn',   Kind.CC),         op('rtn',   Kind.CC),         op('rtn',   Kind.CC),
  op('rtn',   Kind.CC),         op('rtn',   Kind.CC),         op('rtn',   Kind.CC),         op('rtn',   Kind.NONE),
  op('nop',   Kind.NONE),       op('clt',   Kind.NONE),       op('fst',   Kind.NONE),       op('slw',   Kind.NONE),
  op('cani',  Kind.NONE),       op('rtni',  Kind.NONE),       op('off',   Kind.NONE),       op('trp',   Kind.NONE),
];

const extTab: Entry[] = [
  op('stl',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ppo',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('pfl',   Kind.REGJR),      op('****',  Kind.ILLOP),
  op('rod',   Kind.REGJR),     op('rou',   Kind.REGJR),      op('bid',   Kind.REGJR),      op('biu',   Kind.REGJR),
  op('did',   Kind.REGJR),     op('diu',   Kind.REGJR),      op('byd',   Kind.REGJR),      op('byu',   Kind.REGJR),
  op('cmp',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('inv',   Kind.REGJR),      op('****',  Kind.ILLOP),
  op('gpo',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('gfl',   Kind.REGJR),      op('****',  Kind.ILLOP),
  op('ppo',   Kind.IM8A),      op('****',  Kind.ILLOP),      op('pfl',   Kind.IM8A),       op('****',  Kind.ILLOP),
  op('stlw',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ppow',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('rodw',  Kind.REGJR),     op('rouw',  Kind.REGJR),      op('bidw',  Kind.REGJR),      op('biuw',  Kind.REGJR),
  op('didw',  Kind.REGJR),     op('diuw',  Kind.REGJR),      op('bydw',  Kind.REGJR),      op('byuw',  Kind.REGJR),
  op('cmpw',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('invw',  Kind.REGJR),      op('****',  Kind.ILLOP),
  op('gpow',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('gflw',  Kind.REGJR),      op('****',  Kind.ILLOP),
  op('adbm',  Kind.RIM5IM3JR), op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('sbbm',  Kind.RIM5IM3JR), op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ldlm',  Kind.REGIM3),    op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('didm',  Kind.REGIM3),    op('dium',  Kind.REGIM3),     op('bydm',  Kind.REGIM3),     op('byum',  Kind.REGIM3),
  op('cmpm',  Kind.REGIM3),    op('****',  Kind.ILLOP),      op('invm',  Kind.REGIM3),     op('****',  Kind.ILLOP),
  op('ldl',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ldlw',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ld',    Kind.REGIM8),    op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  op('ldw',   Kind.REGIM16),   op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
];

function lookupEntry(index: number): Entry {
  if (index < 256) return mnemTab[index]!;
  return extTab[index - 256]!;
}

// ─── register name helpers ────────────────────────────────────────────────────

const cctab   = ['z', 'nc', 'lz', 'uz', 'nz', 'c', 'nlz'] as const;
const r8tab   = [['pe','pd','ib','ua'], ['ia','ie','??','tm']] as const;
const r16tab  = [['ix','iy','iz','us'], ['ss','ky','ky','ky']] as const;
const sirtab  = ['sx','sy','sz','??'] as const;

function h2(n: number): string { return n.toString(16).toUpperCase().padStart(2, '0'); }
function h4(n: number): string { return n.toString(16).toUpperCase().padStart(4, '0'); }

function regArg(x: number): string   { return '$' + (x & 0x1F).toString(10); }
function sirArg(x: number): string   { return sirtab[(x >> 5) & 3]!; }

function shortRegArg(x: number): string {
  if ((x & 0x60) === 0x60) return regArg(fetchByte());
  return '$' + sirArg(x);
}
function shortRegAr1(x: number, y: number): string {
  if ((x & 0x60) === 0x60) return regArg(y);
  return '$' + sirArg(x);
}
function irArg(index: number): string  { return (index & 1) === 0 ? 'x' : 'z'; }
function signArg(x: number): string    { return (x & 0x80) !== 0 ? '-' : '+'; }

function imm7Arg(): string {
  const y = _pc;
  if (_opforg > 0 && (_opindex & 1) === 0) fetchByte();
  const raw = fetchByte();
  const x = (raw & 0x80) ? (0x80 - raw) : raw;  // HD61700 convention: $80-x (not sign-extend)
  return '&H' + h4((y + x) & 0xFFFF);
}
function imm8Arg():  string { return '&H' + h2(fetchByte()); }
function imm16Arg(): string { const lo = fetchByte(); const hi = fetchByte(); return '&H' + h2(hi) + h2(lo); }
function absArg():   string { const lo = fetchByte(); if (_opforg > 0) fetchByte(); const hi = fetchByte(); return '&H' + h2(hi) + h2(lo); }
function imm3Arg(x: number): string { return (((x >> 5) & 7) + 1).toString(10); }
function optionalJr(x: number): string { return (x & 0x80) !== 0 ? ',jr ' + imm7Arg() : ''; }

function alignAfter(): void {
  if (_opforg > 0 && (_opindex & 1) !== 0) fetchByte();
}

function scanMnemTab(): number {
  const code = fetchOpcode();
  const e = lookupEntry(code);
  if (e.mnem === '0') return (e as ExtEntry).ext + ((_opcode[1]! >> 5) & 3);
  return code;
}

function decodeArgs(index: number): string {
  const e = lookupEntry(index);
  if (e.mnem === '0') return '???';
  const kind = (e as OpEntry).kind;
  let x: number, y: number;

  switch (kind) {
    case Kind.NONE:    return '';
    case Kind.ILLOP:   return '';
    case Kind.CC:      return cctab[index & 7] ?? '?';
    case Kind.JRCC:    return (cctab[index & 7] ?? '?') + ',' + imm7Arg();
    case Kind.JPCC:    return (cctab[index & 7] ?? '?') + ',' + absArg();
    case Kind.JR:      return imm7Arg();
    case Kind.JP:      return absArg();

    case Kind.REGREGJR:
      x = fetchByte();
      return regArg(x) + ',' + shortRegArg(x) + optionalJr(x);
    case Kind.REGDIRJR:
      x = fetchByte();
      return regArg(x) + ',(' + shortRegArg(x) + ')' + optionalJr(x);
    case Kind.REGJR:
      x = fetchByte();
      return regArg(x) + optionalJr(x);
    case Kind.REGIRR:
      x = fetchByte();
      return regArg(x) + ',(i' + irArg(index) + signArg(x) + shortRegArg(x) + ')';
    case Kind.REGIRRIM3:
      x = fetchByte(); y = fetchByte();
      return regArg(x) + ',(i' + irArg(index) + signArg(x) + shortRegAr1(x, y) + '),' + imm3Arg(y);
    case Kind.REG:
      return regArg(fetchByte());
    case Kind.DIR:
      return '(' + regArg(fetchByte()) + ')';
    case Kind.IRRREG:
      x = fetchByte();
      return '(i' + irArg(index) + signArg(x) + shortRegArg(x) + '),' + regArg(x);
    case Kind.REGIM8JR:
      x = fetchByte();
      return regArg(x) + ',' + imm8Arg() + optionalJr(x);
    case Kind.IM8:     return imm8Arg();
    case Kind.IM8A:    fetchByte(); return imm8Arg();
    case Kind.R8IM8: {
      x = fetchByte();
      const row8 = index & 1, col8 = (x >> 5) & 3;
      return r8tab[row8]![col8]! + ',' + imm8Arg();
    }
    case Kind.REGIRI:
      x = fetchByte();
      return regArg(x) + ',(i' + irArg(index) + signArg(x) + imm8Arg() + ')';
    case Kind.IRIREG:
      x = fetchByte();
      return '(i' + irArg(index) + signArg(x) + imm8Arg() + '),' + regArg(x);
    case Kind.R8REGJR: {
      x = fetchByte();
      const row8r = index & 1, col8r = (x >> 5) & 3;
      return r8tab[row8r]![col8r]! + ',' + regArg(x) + optionalJr(x);
    }
    case Kind.R16REGJR: {
      x = fetchByte();
      const row16 = index & 1, col16 = (x >> 5) & 3;
      return r16tab[row16]![col16]! + ',' + regArg(x) + optionalJr(x);
    }
    case Kind.R16IM16: {
      x = fetchByte();
      const row16i = index & 1, col16i = (x >> 5) & 3;
      return r16tab[row16i]![col16i]! + ',' + imm16Arg();
    }
    case Kind.IM8IND: {
      x = fetchByte();
      return imm8Arg() + ',($' + sirArg(x) + ')';
    }
    case Kind.IM16IND: {
      x = fetchByte();
      return imm16Arg() + ',($' + sirArg(x) + ')';
    }
    case Kind.RRIM3JR:
      x = fetchByte(); y = fetchByte();
      return regArg(x) + ',' + shortRegAr1(x, y) + ',' + imm3Arg(y) + optionalJr(x);
    case Kind.RIM5IM3JR:
      x = fetchByte(); y = fetchByte();
      return regArg(x) + ',&H' + h2(y & 0x1F) + ',' + imm3Arg(y) + optionalJr(x);
    case Kind.REGIM8:
      x = fetchByte();
      return regArg(x) + ',' + imm8Arg();
    case Kind.REGIM16:
      x = fetchByte();
      return regArg(x) + ',' + imm16Arg();
    case Kind.REGIM3:
      x = fetchByte(); y = fetchByte();
      return regArg(x) + ',' + imm3Arg(y);
    case Kind.SIRREGJR:
      x = fetchByte();
      return sirArg(x) + ',' + regArg(x) + optionalJr(x);
    case Kind.SIRREGIM3:
      x = fetchByte(); y = fetchByte();
      return sirArg(x) + ',' + regArg(x) + ',' + imm3Arg(y);
    case Kind.SIRIM5:
      x = fetchByte();
      return sirArg(x) + ',' + (x & 0x1F).toString(10);
    default:
      return '?';
  }
}

// ─── raw byte dump for display ────────────────────────────────────────────────

function rawBytesStr(pcStart: number, pcEnd: number, org: number): string {
  const bytes: number[] = [];
  for (let a = pcStart; a !== pcEnd; a = (a + 1) & 0xFFFF) {
    if (org === 1) {
      for (const m of memdef) {
        if (m.memorg === 1 && m.data && a >= m.first && a < m.last) {
          const base = (m.offset + (a - m.first)) * 2;
          bytes.push(m.data[base] ?? 0xFF, m.data[base + 1] ?? 0xFF);
          break;
        }
      }
    } else {
      bytes.push(rawRead(a));
    }
  }
  return bytes.map(b => h2(b)).join(' ');
}

// ─── public API ───────────────────────────────────────────────────────────────

export interface DisLine {
  addr:     number;
  nextAddr: number;
  mnem:     string;
  args:     string;
  bytes:    string;
}

export function disOneLine(addr: number): DisLine {
  _pc = addr & 0xFFFF;
  const org = memorgAt(_pc);

  const index = scanMnemTab();
  const args  = decodeArgs(index);
  alignAfter();
  const nextAddr = _pc;

  const e = lookupEntry(index);
  const mnem = e.mnem === '0' ? '???' : e.mnem;
  const bytes = rawBytesStr(addr, nextAddr, org);

  return { addr, nextAddr, mnem, args, bytes };
}

/** Disassemble `count` instructions starting at `startAddr`. */
export function disLines(startAddr: number, count: number): DisLine[] {
  const lines: DisLine[] = [];
  let addr = startAddr & 0xFFFF;
  for (let i = 0; i < count; i++) {
    const line = disOneLine(addr);
    lines.push(line);
    if (line.nextAddr <= addr) break; // guard against infinite loop
    addr = line.nextAddr;
  }
  return lines;
}

/** Walk backward from `targetAddr` to find an earlier start addr that
 *  reaches `targetAddr` exactly in `targetAddr - searchFrom` steps,
 *  scanning backwards from `targetAddr - maxBacktrack` bytes.
 *  Returns best-effort start address for centering the disassembly view. */
export function findLineStart(targetAddr: number, linesAbove: number): number {
  targetAddr &= 0xFFFF;
  // Build a forward map of (addr → nextAddr) starting `maxScan` bytes back.
  const maxScan = linesAbove * 4 + 16;
  const startScan = (targetAddr - maxScan + 0x10000) & 0xFFFF;

  // Collect addresses that land exactly on targetAddr
  const candidates: number[] = [];
  let a = startScan;
  const limit = linesAbove * 2 + 8;
  for (let iter = 0; iter < 512 && candidates.length < limit; iter++) {
    if (a === targetAddr) break;
    const d = disOneLine(a);
    if (d.nextAddr === targetAddr || d.addr === targetAddr) {
      // walk back from here collecting `linesAbove` lines
      candidates.push(a);
    }
    if (d.nextAddr <= a) break;
    a = d.nextAddr;
  }

  // Walk back through candidates to find the start of `linesAbove` lines
  if (candidates.length === 0) return targetAddr;

  // From the last candidate that reaches targetAddr, step back linesAbove lines
  let best = candidates[candidates.length - 1]!;
  for (let n = 1; n < linesAbove && best > startScan; n++) {
    // find the instruction that ends at `best`
    const prev = (best - 4 + 0x10000) & 0xFFFF;
    let a2 = prev;
    for (let iter = 0; iter < 8; iter++) {
      const d = disOneLine(a2);
      if (d.nextAddr === best) { best = a2; break; }
      if (d.nextAddr >= best) break;
      a2 = d.nextAddr;
    }
  }
  return best;
}
