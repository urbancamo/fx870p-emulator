#!/usr/bin/env node
// HD61700 Disassembler — TypeScript port of dis.pas
//
// Usage:
//   npm run dis -- [--start 0x0000] [--end 0xffff] [--rom0 <path>] [--rom1 <path>]
//
// Default ROM paths: public/roms/rom0.bin and public/roms/rom1.bin
// Default range: all of ROM (0x0000-0xffff, skips RAM region 0x10000-0x1ffff)

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ─── Memory map ───────────────────────────────────────────────────────────────
// Mirrors def.ts memdef (UA=0 only, 16-bit addresses)

interface Region {
  first:   number;   // first PC address
  last:    number;   // last PC address (exclusive)
  offset:  number;   // offset for file-byte calculation
  memorg:  number;   // 0=byte, 1=word (2 bytes per address in file)
  data:    Uint8Array | null;
}

const regions: Region[] = [
  { first: 0x0000, last: 0x0C00, offset: 0x0000, memorg: 1, data: null },  // ROM0 word
  { first: 0x0C00, last: 0x10000, offset: 0x0C00, memorg: 0, data: null }, // ROM1 byte
];

function loadRoms(rom0Path: string, rom1Path: string): void {
  regions[0]!.data = new Uint8Array(readFileSync(rom0Path));
  regions[1]!.data = new Uint8Array(readFileSync(rom1Path));
}

// ─── Fetch state ──────────────────────────────────────────────────────────────

let pc     = 0;
let opforg = 0;
const opcode = new Uint8Array(4);
let opindex  = 0;

function memorgAt(addr: number): number {
  for (const r of regions) {
    if (addr >= r.first && addr < r.last) return r.memorg;
  }
  return 0;
}

function rawRead(addr: number): number {
  for (const r of regions) {
    if (!r.data || addr < r.first || addr >= r.last) continue;
    const idx = (r.offset + (addr - r.first)) << r.memorg;
    return r.data[idx] ?? 0xFF;
  }
  return 0xFF;
}

function fetchOpcode(): number {
  opforg = memorgAt(pc);

  if (opforg === 0) {
    // Byte memory: prefetch 4 consecutive bytes
    opcode[0] = rawRead(pc);
    opcode[1] = rawRead((pc + 1) & 0xFFFF);
    opcode[2] = rawRead((pc + 2) & 0xFFFF);
    opcode[3] = rawRead((pc + 3) & 0xFFFF);
  } else {
    // Word memory: each PC address = 1 16-bit word (2 bytes in file)
    // Prefetch words at pc and pc+1
    for (const r of regions) {
      if (r.memorg === 1 && r.data && pc >= r.first && pc < r.last) {
        const base = (r.offset + (pc - r.first)) * 2;
        opcode[0] = r.data[base]     ?? 0xFF;
        opcode[1] = r.data[base + 1] ?? 0xFF;
        break;
      }
    }
    const pc1 = (pc + 1) & 0xFFFF;
    for (const r of regions) {
      if (r.memorg === 1 && r.data && pc1 >= r.first && pc1 < r.last) {
        const base = (r.offset + (pc1 - r.first)) * 2;
        opcode[2] = r.data[base]     ?? 0xFF;
        opcode[3] = r.data[base + 1] ?? 0xFF;
        break;
      }
    }
  }

  opindex = 0;
  return fetchByte();
}

function fetchByte(): number {
  const b = opcode[opindex] ?? 0xFF;
  if (opforg === 0) {
    pc = (pc + 1) & 0xFFFF;
  } else if (opindex & 1) {
    pc = (pc + 1) & 0xFFFF;   // advance PC on odd index (word boundary)
  }
  opindex++;
  return b;
}

// ─── Mnemonic table ───────────────────────────────────────────────────────────
// Mirrors the 'mnem' array in dis.pas

const enum Kind {
  ILLOP, NONE, CC, JRCC, JPCC, JR, JP,
  REGREGJR, REGDIRJR, REGJR, REGIRR, REGIRRIM3,
  REG, DIR, IRRREG, REGIM8JR, IM8, IM8A, R8IM8,
  REGIRI, IRIREG, R8REGJR, R16REGJR, R16IM16,
  IM8IND, IM16IND, RRIM3JR, RIM5IM3JR, REGIM8,
  REGIM16, REGIM3, SIRREGJR, SIRREGIM3, SIRIM5,
}

type Entry =
  | { mnem: string; kind: Kind }
  | { mnem: '0'; ext: number };  // extended: redirect to ext+variant

// Shorthand builders
const op = (mnem: string, kind: Kind): Entry => ({ mnem, kind });
const ex = (n: number): Entry => ({ mnem: '0', ext: 256 + n * 4 });

// 256 primary opcode entries (indexed by opcode byte)
const mnemTab: Entry[] = [
  op('adc',   Kind.REGREGJR),   // 0x00
  op('sbc',   Kind.REGREGJR),   // 0x01
  op('ld',    Kind.REGREGJR),   // 0x02
  op('ldc',   Kind.REGREGJR),   // 0x03
  op('anc',   Kind.REGREGJR),   // 0x04
  op('nac',   Kind.REGREGJR),   // 0x05
  op('orc',   Kind.REGREGJR),   // 0x06
  op('xrc',   Kind.REGREGJR),   // 0x07
  op('ad',    Kind.REGREGJR),   // 0x08
  op('sb',    Kind.REGREGJR),   // 0x09
  op('adb',   Kind.REGREGJR),   // 0x0A
  op('sbb',   Kind.REGREGJR),   // 0x0B
  op('an',    Kind.REGREGJR),   // 0x0C
  op('na',    Kind.REGREGJR),   // 0x0D
  op('or',    Kind.REGREGJR),   // 0x0E
  op('xr',    Kind.REGREGJR),   // 0x0F
  op('st',    Kind.REGDIRJR),   // 0x10
  op('ld',    Kind.REGDIRJR),   // 0x11
  ex(0),                         // 0x12 → stl/****
  ex(18),                        // 0x13 → ldl/****
  ex(1),                         // 0x14 → ppo/pfl/****
  op('psr',   Kind.SIRREGJR),   // 0x15
  op('pst',   Kind.R8REGJR),    // 0x16
  op('pst',   Kind.R8REGJR),    // 0x17
  ex(2),                         // 0x18 → rod/rou/bid/biu
  op('****',  Kind.ILLOP),      // 0x19
  ex(3),                         // 0x1A → did/diu/byd/byu
  ex(4),                         // 0x1B → cmp/inv/****
  ex(5),                         // 0x1C → gpo/gfl/****
  op('gsr',   Kind.SIRREGJR),   // 0x1D
  op('gst',   Kind.R8REGJR),    // 0x1E
  op('gst',   Kind.R8REGJR),    // 0x1F
  op('st',    Kind.REGIRR),     // 0x20
  op('st',    Kind.REGIRR),     // 0x21
  op('sti',   Kind.REGIRR),     // 0x22
  op('sti',   Kind.REGIRR),     // 0x23
  op('std',   Kind.REGIRR),     // 0x24
  op('std',   Kind.REGIRR),     // 0x25
  op('phs',   Kind.REG),        // 0x26
  op('phu',   Kind.REG),        // 0x27
  op('ld',    Kind.REGIRR),     // 0x28
  op('ld',    Kind.REGIRR),     // 0x29
  op('ldi',   Kind.REGIRR),     // 0x2A
  op('ldi',   Kind.REGIRR),     // 0x2B
  op('ldd',   Kind.REGIRR),     // 0x2C
  op('ldd',   Kind.REGIRR),     // 0x2D
  op('pps',   Kind.REG),        // 0x2E
  op('ppu',   Kind.REG),        // 0x2F
  op('jp',    Kind.JPCC),       // 0x30
  op('jp',    Kind.JPCC),       // 0x31
  op('jp',    Kind.JPCC),       // 0x32
  op('jp',    Kind.JPCC),       // 0x33
  op('jp',    Kind.JPCC),       // 0x34
  op('jp',    Kind.JPCC),       // 0x35
  op('jp',    Kind.JPCC),       // 0x36
  op('jp',    Kind.JP),         // 0x37
  op('adc',   Kind.IRRREG),     // 0x38
  op('adc',   Kind.IRRREG),     // 0x39
  op('sbc',   Kind.IRRREG),     // 0x3A
  op('sbc',   Kind.IRRREG),     // 0x3B
  op('ad',    Kind.IRRREG),     // 0x3C
  op('ad',    Kind.IRRREG),     // 0x3D
  op('sb',    Kind.IRRREG),     // 0x3E
  op('sb',    Kind.IRRREG),     // 0x3F
  op('adc',   Kind.REGIM8JR),   // 0x40
  op('sbc',   Kind.REGIM8JR),   // 0x41
  op('ld',    Kind.REGIM8JR),   // 0x42
  op('ldc',   Kind.REGIM8JR),   // 0x43
  op('anc',   Kind.REGIM8JR),   // 0x44
  op('nac',   Kind.REGIM8JR),   // 0x45
  op('orc',   Kind.REGIM8JR),   // 0x46
  op('xrc',   Kind.REGIM8JR),   // 0x47
  op('ad',    Kind.REGIM8JR),   // 0x48
  op('sb',    Kind.REGIM8JR),   // 0x49
  op('adb',   Kind.REGIM8JR),   // 0x4A
  op('sbb',   Kind.REGIM8JR),   // 0x4B
  op('an',    Kind.REGIM8JR),   // 0x4C
  op('na',    Kind.REGIM8JR),   // 0x4D
  op('or',    Kind.REGIM8JR),   // 0x4E
  op('xr',    Kind.REGIM8JR),   // 0x4F
  op('st',    Kind.IM8IND),     // 0x50
  ex(20),                        // 0x51 → ld/****
  op('stl',   Kind.IM8),        // 0x52
  op('****',  Kind.ILLOP),      // 0x53
  ex(6),                         // 0x54 → ppo/pfl/****
  op('psr',   Kind.SIRIM5),     // 0x55
  op('pst',   Kind.R8IM8),      // 0x56
  op('pst',   Kind.R8IM8),      // 0x57
  op('bups',  Kind.IM8),        // 0x58
  op('bdns',  Kind.IM8),        // 0x59
  op('****',  Kind.ILLOP),      // 0x5A
  op('****',  Kind.ILLOP),      // 0x5B
  op('sup',   Kind.IM8),        // 0x5C
  op('sdn',   Kind.IM8),        // 0x5D
  op('****',  Kind.ILLOP),      // 0x5E
  op('****',  Kind.ILLOP),      // 0x5F
  op('st',    Kind.REGIRI),     // 0x60
  op('st',    Kind.REGIRI),     // 0x61
  op('sti',   Kind.REGIRI),     // 0x62
  op('sti',   Kind.REGIRI),     // 0x63
  op('std',   Kind.REGIRI),     // 0x64
  op('std',   Kind.REGIRI),     // 0x65
  op('****',  Kind.ILLOP),      // 0x66
  op('****',  Kind.ILLOP),      // 0x67
  op('ld',    Kind.REGIRI),     // 0x68
  op('ld',    Kind.REGIRI),     // 0x69
  op('ldi',   Kind.REGIRI),     // 0x6A
  op('ldi',   Kind.REGIRI),     // 0x6B
  op('ldd',   Kind.REGIRI),     // 0x6C
  op('ldd',   Kind.REGIRI),     // 0x6D
  op('****',  Kind.ILLOP),      // 0x6E
  op('****',  Kind.ILLOP),      // 0x6F
  op('cal',   Kind.JPCC),       // 0x70
  op('cal',   Kind.JPCC),       // 0x71
  op('cal',   Kind.JPCC),       // 0x72
  op('cal',   Kind.JPCC),       // 0x73
  op('cal',   Kind.JPCC),       // 0x74
  op('cal',   Kind.JPCC),       // 0x75
  op('cal',   Kind.JPCC),       // 0x76
  op('cal',   Kind.JP),         // 0x77
  op('adc',   Kind.IRIREG),     // 0x78
  op('adc',   Kind.IRIREG),     // 0x79
  op('sbc',   Kind.IRIREG),     // 0x7A
  op('sbc',   Kind.IRIREG),     // 0x7B
  op('ad',    Kind.IRIREG),     // 0x7C
  op('ad',    Kind.IRIREG),     // 0x7D
  op('sb',    Kind.IRIREG),     // 0x7E
  op('sb',    Kind.IRIREG),     // 0x7F
  op('adcw',  Kind.REGREGJR),   // 0x80
  op('sbcw',  Kind.REGREGJR),   // 0x81
  op('ldw',   Kind.REGREGJR),   // 0x82
  op('ldcw',  Kind.REGREGJR),   // 0x83
  op('ancw',  Kind.REGREGJR),   // 0x84
  op('nacw',  Kind.REGREGJR),   // 0x85
  op('orcw',  Kind.REGREGJR),   // 0x86
  op('xrcw',  Kind.REGREGJR),   // 0x87
  op('adw',   Kind.REGREGJR),   // 0x88
  op('sbw',   Kind.REGREGJR),   // 0x89
  op('adbw',  Kind.REGREGJR),   // 0x8A
  op('sbbw',  Kind.REGREGJR),   // 0x8B
  op('anw',   Kind.REGREGJR),   // 0x8C
  op('naw',   Kind.REGREGJR),   // 0x8D
  op('orw',   Kind.REGREGJR),   // 0x8E
  op('xrw',   Kind.REGREGJR),   // 0x8F
  op('stw',   Kind.REGDIRJR),   // 0x90
  op('ldw',   Kind.REGDIRJR),   // 0x91
  ex(7),                         // 0x92 → stlw/****
  ex(19),                        // 0x93 → ldlw/****
  ex(8),                         // 0x94 → ppow/****
  op('psrw',  Kind.SIRREGJR),   // 0x95
  op('pre',   Kind.R16REGJR),   // 0x96
  op('pre',   Kind.R16REGJR),   // 0x97
  ex(9),                         // 0x98 → rodw/rouw/bidw/biuw
  op('****',  Kind.ILLOP),      // 0x99
  ex(10),                        // 0x9A → didw/diuw/bydw/byuw
  ex(11),                        // 0x9B → cmpw/invw/****
  ex(12),                        // 0x9C → gpow/gflw/****
  op('gsrw',  Kind.SIRREGJR),   // 0x9D
  op('gre',   Kind.R16REGJR),   // 0x9E
  op('gre',   Kind.R16REGJR),   // 0x9F
  op('stw',   Kind.REGIRR),     // 0xA0
  op('stw',   Kind.REGIRR),     // 0xA1
  op('stiw',  Kind.REGIRR),     // 0xA2
  op('stiw',  Kind.REGIRR),     // 0xA3
  op('stdw',  Kind.REGIRR),     // 0xA4
  op('stdw',  Kind.REGIRR),     // 0xA5
  op('phsw',  Kind.REG),        // 0xA6
  op('phuw',  Kind.REG),        // 0xA7
  op('ldw',   Kind.REGIRR),     // 0xA8
  op('ldw',   Kind.REGIRR),     // 0xA9
  op('ldiw',  Kind.REGIRR),     // 0xAA
  op('ldiw',  Kind.REGIRR),     // 0xAB
  op('lddw',  Kind.REGIRR),     // 0xAC
  op('lddw',  Kind.REGIRR),     // 0xAD
  op('ppsw',  Kind.REG),        // 0xAE
  op('ppuw',  Kind.REG),        // 0xAF
  op('jr',    Kind.JRCC),       // 0xB0
  op('jr',    Kind.JRCC),       // 0xB1
  op('jr',    Kind.JRCC),       // 0xB2
  op('jr',    Kind.JRCC),       // 0xB3
  op('jr',    Kind.JRCC),       // 0xB4
  op('jr',    Kind.JRCC),       // 0xB5
  op('jr',    Kind.JRCC),       // 0xB6
  op('jr',    Kind.JR),         // 0xB7
  op('adcw',  Kind.IRRREG),     // 0xB8
  op('adcw',  Kind.IRRREG),     // 0xB9
  op('sbcw',  Kind.IRRREG),     // 0xBA
  op('sbcw',  Kind.IRRREG),     // 0xBB
  op('adw',   Kind.IRRREG),     // 0xBC
  op('adw',   Kind.IRRREG),     // 0xBD
  op('sbw',   Kind.IRRREG),     // 0xBE
  op('sbw',   Kind.IRRREG),     // 0xBF
  op('adbcm', Kind.RRIM3JR),    // 0xC0
  op('sbbcm', Kind.RRIM3JR),    // 0xC1
  op('ldm',   Kind.RRIM3JR),    // 0xC2
  op('ldcm',  Kind.RRIM3JR),    // 0xC3
  op('ancm',  Kind.RRIM3JR),    // 0xC4
  op('nacm',  Kind.RRIM3JR),    // 0xC5
  op('orcm',  Kind.RRIM3JR),    // 0xC6
  op('xrcm',  Kind.RRIM3JR),    // 0xC7
  op('adbm',  Kind.RRIM3JR),    // 0xC8
  op('sbbm',  Kind.RRIM3JR),    // 0xC9
  ex(13),                        // 0xCA → adbm (5-bit)/****
  ex(14),                        // 0xCB → sbbm (5-bit)/****
  op('anm',   Kind.RRIM3JR),    // 0xCC
  op('nam',   Kind.RRIM3JR),    // 0xCD
  op('orm',   Kind.RRIM3JR),    // 0xCE
  op('xrm',   Kind.RRIM3JR),    // 0xCF
  op('stw',   Kind.IM16IND),    // 0xD0
  ex(21),                        // 0xD1 → ldw/****
  op('stlm',  Kind.REGIM3),     // 0xD2
  ex(15),                        // 0xD3 → ldlm/****
  op('ppom',  Kind.REGIM3),     // 0xD4
  op('psrm',  Kind.SIRREGIM3),  // 0xD5
  op('pre',   Kind.R16IM16),    // 0xD6
  op('pre',   Kind.R16IM16),    // 0xD7
  op('bup',   Kind.NONE),       // 0xD8
  op('bdn',   Kind.NONE),       // 0xD9
  ex(16),                        // 0xDA → didm/dium/bydm/byum
  ex(17),                        // 0xDB → cmpm/invm/****
  op('sup',   Kind.REG),        // 0xDC
  op('sdn',   Kind.REG),        // 0xDD
  op('jp',    Kind.REG),        // 0xDE
  op('jp',    Kind.DIR),        // 0xDF
  op('stm',   Kind.REGIRRIM3),  // 0xE0
  op('stm',   Kind.REGIRRIM3),  // 0xE1
  op('stim',  Kind.REGIRRIM3),  // 0xE2
  op('stim',  Kind.REGIRRIM3),  // 0xE3
  op('stdm',  Kind.REGIRRIM3),  // 0xE4
  op('stdm',  Kind.REGIRRIM3),  // 0xE5
  op('phsm',  Kind.REGIM3),     // 0xE6
  op('phum',  Kind.REGIM3),     // 0xE7
  op('ldm',   Kind.REGIRRIM3),  // 0xE8
  op('ldm',   Kind.REGIRRIM3),  // 0xE9
  op('ldim',  Kind.REGIRRIM3),  // 0xEA
  op('ldim',  Kind.REGIRRIM3),  // 0xEB
  op('lddm',  Kind.REGIRRIM3),  // 0xEC
  op('lddm',  Kind.REGIRRIM3),  // 0xED
  op('ppsm',  Kind.REGIM3),     // 0xEE
  op('ppum',  Kind.REGIM3),     // 0xEF
  op('rtn',   Kind.CC),         // 0xF0
  op('rtn',   Kind.CC),         // 0xF1
  op('rtn',   Kind.CC),         // 0xF2
  op('rtn',   Kind.CC),         // 0xF3
  op('rtn',   Kind.CC),         // 0xF4
  op('rtn',   Kind.CC),         // 0xF5
  op('rtn',   Kind.CC),         // 0xF6
  op('rtn',   Kind.NONE),       // 0xF7
  op('nop',   Kind.NONE),       // 0xF8
  op('clt',   Kind.NONE),       // 0xF9
  op('fst',   Kind.NONE),       // 0xFA
  op('slw',   Kind.NONE),       // 0xFB
  op('cani',  Kind.NONE),       // 0xFC
  op('rtni',  Kind.NONE),       // 0xFD
  op('off',   Kind.NONE),       // 0xFE
  op('trp',   Kind.NONE),       // 0xFF
];

// Extended table (22 groups × 4 variants) appended at index 256+
// Mirrors the tail of 'mnem' in dis.pas

const extTab: Entry[] = [
  // 0 (0x12) stl variants
  op('stl',   Kind.REGJR),   op('****', Kind.ILLOP), op('****', Kind.ILLOP), op('****', Kind.ILLOP),
  // 1 (0x14) ppo/pfl
  op('ppo',   Kind.REGJR),   op('****', Kind.ILLOP), op('pfl',  Kind.REGJR),  op('****', Kind.ILLOP),
  // 2 (0x18) rod/rou/bid/biu
  op('rod',   Kind.REGJR),   op('rou',  Kind.REGJR), op('bid',  Kind.REGJR),  op('biu',  Kind.REGJR),
  // 3 (0x1A) did/diu/byd/byu
  op('did',   Kind.REGJR),   op('diu',  Kind.REGJR), op('byd',  Kind.REGJR),  op('byu',  Kind.REGJR),
  // 4 (0x1B) cmp/inv
  op('cmp',   Kind.REGJR),   op('****', Kind.ILLOP), op('inv',  Kind.REGJR),  op('****', Kind.ILLOP),
  // 5 (0x1C) gpo/gfl
  op('gpo',   Kind.REGJR),   op('****', Kind.ILLOP), op('gfl',  Kind.REGJR),  op('****', Kind.ILLOP),
  // 6 (0x54) ppo/pfl (IM8A form)
  op('ppo',   Kind.IM8A),    op('****', Kind.ILLOP), op('pfl',  Kind.IM8A),   op('****', Kind.ILLOP),
  // 7 (0x92) stlw
  op('stlw',  Kind.REGJR),   op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
  // 8 (0x94) ppow
  op('ppow',  Kind.REGJR),   op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
  // 9 (0x98) rodw/rouw/bidw/biuw
  op('rodw',  Kind.REGJR),   op('rouw', Kind.REGJR), op('bidw', Kind.REGJR),  op('biuw', Kind.REGJR),
  // 10 (0x9A) didw/diuw/bydw/byuw
  op('didw',  Kind.REGJR),   op('diuw', Kind.REGJR), op('bydw', Kind.REGJR),  op('byuw', Kind.REGJR),
  // 11 (0x9B) cmpw/invw
  op('cmpw',  Kind.REGJR),   op('****', Kind.ILLOP), op('invw', Kind.REGJR),  op('****', Kind.ILLOP),
  // 12 (0x9C) gpow/gflw
  op('gpow',  Kind.REGJR),   op('****', Kind.ILLOP), op('gflw', Kind.REGJR),  op('****', Kind.ILLOP),
  // 13 (0xCA) adbm (5-bit imm)
  op('adbm',  Kind.RIM5IM3JR), op('****', Kind.ILLOP), op('****', Kind.ILLOP), op('****', Kind.ILLOP),
  // 14 (0xCB) sbbm (5-bit imm)
  op('sbbm',  Kind.RIM5IM3JR), op('****', Kind.ILLOP), op('****', Kind.ILLOP), op('****', Kind.ILLOP),
  // 15 (0xD3) ldlm
  op('ldlm',  Kind.REGIM3),  op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
  // 16 (0xDA) didm/dium/bydm/byum
  op('didm',  Kind.REGIM3),  op('dium', Kind.REGIM3), op('bydm', Kind.REGIM3), op('byum', Kind.REGIM3),
  // 17 (0xDB) cmpm/invm
  op('cmpm',  Kind.REGIM3),  op('****', Kind.ILLOP), op('invm', Kind.REGIM3),  op('****', Kind.ILLOP),
  // 18 (0x13) ldl
  op('ldl',   Kind.REGJR),   op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
  // 19 (0x93) ldlw
  op('ldlw',  Kind.REGJR),   op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
  // 20 (0x51) ld (REGIM8, no optional jr)
  op('ld',    Kind.REGIM8),  op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
  // 21 (0xD1) ldw (REGIM16)
  op('ldw',   Kind.REGIM16), op('****', Kind.ILLOP), op('****', Kind.ILLOP),  op('****', Kind.ILLOP),
];

function lookupEntry(index: number): Entry {
  if (index < 256) return mnemTab[index]!;
  return extTab[index - 256]!;
}

// ─── Register name helpers ────────────────────────────────────────────────────

const cctab   = ['z', 'nc', 'lz', 'uz', 'nz', 'c', 'nlz'] as const;
const r8tab   = [['pe','pd','ib','ua'], ['ia','ie','??','tm']] as const;
const r16tab  = [['ix','iy','iz','us'], ['ss','ky','ky','ky']] as const;
const sirtab  = ['sx','sy','sz','??'] as const;

function h2(n: number): string { return n.toString(16).toUpperCase().padStart(2, '0'); }
function h4(n: number): string { return n.toString(16).toUpperCase().padStart(4, '0'); }

function regArg(x: number): string {
  return '$' + (x & 0x1F).toString(10);   // decimal register number, like Delphi IntToStr
}

function sirArg(x: number): string {
  return sirtab[(x >> 5) & 3]!;
}

// If bits[6:5] == 0b11, fetch an extra byte and use as reg index; else use SI reg from x
function shortRegArg(x: number): string {
  if ((x & 0x60) === 0x60) return regArg(fetchByte());
  return '$' + sirArg(x);
}

// Same as shortRegArg but uses pre-fetched byte y instead of fetching
function shortRegAr1(x: number, y: number): string {
  if ((x & 0x60) === 0x60) return regArg(y);
  return '$' + sirArg(x);
}

// 'x' if (index & 1) == 0, else 'z'
function irArg(index: number): string {
  return (index & 1) === 0 ? 'x' : 'z';
}

// '+' if bit7 == 0, '-' if bit7 == 1
function signArg(x: number): string {
  return (x & 0x80) !== 0 ? '-' : '+';
}

// Relative 7-bit offset (adds to current pc, with word-memory alignment)
function imm7Arg(): string {
  const y = pc;
  if (opforg > 0 && (opindex & 1) === 0) fetchByte();   // word-memory alignment
  const raw = fetchByte();
  const x = (raw & 0x80) ? (0x80 - raw) : raw;          // HD61700 convention: $80-x (not sign-extend)
  return '&H' + h4((y + x) & 0xFFFF);
}

function imm8Arg(): string {
  return '&H' + h2(fetchByte());
}

function imm16Arg(): string {
  const lo = fetchByte();
  const hi = fetchByte();
  return '&H' + h2(hi) + h2(lo);
}

// Absolute address: 2 bytes (byte memory) or 3 bytes with alignment (word memory)
function absArg(): string {
  const lo = fetchByte();
  if (opforg > 0) fetchByte();   // alignment byte in word memory
  const hi = fetchByte();
  return '&H' + h2(hi) + h2(lo);
}

function optionalJr(x: number): string {
  return (x & 0x80) !== 0 ? ',jr ' + imm7Arg() : '';
}

// ─── Argument decoder ─────────────────────────────────────────────────────────

function scanMnemTab(): number {
  const code = fetchOpcode();
  const e = lookupEntry(code);
  if (e.mnem === '0') {
    return e.ext + ((opcode[1]! >> 5) & 3);
  }
  return code;
}

function decodeArgs(index: number): string {
  const e = lookupEntry(index);
  if (e.mnem === '0') return '???';
  const kind = e.kind;
  let x: number, y: number;

  switch (kind) {
    case Kind.NONE:    return '';
    case Kind.ILLOP:   return '';

    case Kind.CC:
      return cctab[index & 7] ?? '?';

    case Kind.JRCC:
      return (cctab[index & 7] ?? '?') + ',' + imm7Arg();

    case Kind.JPCC:
      return (cctab[index & 7] ?? '?') + ',' + absArg();

    case Kind.JR:
      return imm7Arg();

    case Kind.JP:
      return absArg();

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
      x = fetchByte();
      y = fetchByte();
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

    case Kind.IM8:
      return imm8Arg();

    case Kind.IM8A:
      fetchByte();  // consume alignment byte
      return imm8Arg();

    case Kind.R8IM8: {
      x = fetchByte();
      const row = index & 1;
      const col = (x >> 5) & 3;
      return r8tab[row]![col]! + ',' + imm8Arg();
    }

    case Kind.REGIRI:
      x = fetchByte();
      return regArg(x) + ',(i' + irArg(index) + signArg(x) + imm8Arg() + ')';

    case Kind.IRIREG:
      x = fetchByte();
      return '(i' + irArg(index) + signArg(x) + imm8Arg() + '),' + regArg(x);

    case Kind.R8REGJR: {
      x = fetchByte();
      const row = index & 1;
      const col = (x >> 5) & 3;
      return r8tab[row]![col]! + ',' + regArg(x) + optionalJr(x);
    }

    case Kind.R16REGJR: {
      x = fetchByte();
      const row = index & 1;
      const col = (x >> 5) & 3;
      return r16tab[row]![col]! + ',' + regArg(x) + optionalJr(x);
    }

    case Kind.R16IM16: {
      x = fetchByte();
      const row = index & 1;
      const col = (x >> 5) & 3;
      return r16tab[row]![col]! + ',' + imm16Arg();
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
      x = fetchByte();
      y = fetchByte();
      return regArg(x) + ',' + shortRegAr1(x, y) + ',' + imm3Arg(y) + optionalJr(x);

    case Kind.RIM5IM3JR:
      x = fetchByte();
      y = fetchByte();
      return regArg(x) + ',&H' + h2(y & 0x1F) + ',' + imm3Arg(y) + optionalJr(x);

    case Kind.REGIM8:
      x = fetchByte();
      return regArg(x) + ',' + imm8Arg();

    case Kind.REGIM16:
      x = fetchByte();
      return regArg(x) + ',' + imm16Arg();

    case Kind.REGIM3:
      x = fetchByte();
      y = fetchByte();
      return regArg(x) + ',' + imm3Arg(y);

    case Kind.SIRREGJR:
      x = fetchByte();
      return sirArg(x) + ',' + regArg(x) + optionalJr(x);

    case Kind.SIRREGIM3:
      x = fetchByte();
      y = fetchByte();
      return sirArg(x) + ',' + regArg(x) + ',' + imm3Arg(y);

    case Kind.SIRIM5:
      x = fetchByte();
      return sirArg(x) + ',' + (x & 0x1F).toString(10);

    default:
      return '?';
  }
}

function imm3Arg(x: number): string {
  return (((x >> 5) & 7) + 1).toString(10);
}

// Word-memory align after decoding (mirrors dis.pas Arguments epilogue)
function alignAfter(): void {
  if (opforg > 0 && (opindex & 1) !== 0) fetchByte();
}

// ─── Disassembly line builder ─────────────────────────────────────────────────

function rawBytes(pcStart: number, pcEnd: number, org: number): string {
  // Collect all instruction bytes between pcStart and pcEnd
  const bytes: number[] = [];
  for (let a = pcStart; a !== pcEnd; a = (a + 1) & 0xFFFF) {
    if (org === 1) {
      // word memory: each PC address = 2 file bytes
      for (const r of regions) {
        if (r.memorg === 1 && r.data && a >= r.first && a < r.last) {
          const base = (r.offset + (a - r.first)) * 2;
          bytes.push(r.data[base] ?? 0xFF, r.data[base + 1] ?? 0xFF);
          break;
        }
      }
    } else {
      bytes.push(rawRead(a));
    }
  }
  return bytes.map(b => h2(b)).join(' ');
}

function disOneLine(addr: number): { line: string; nextAddr: number } {
  pc = addr;
  const org = memorgAt(addr);

  const index   = scanMnemTab();
  const args    = decodeArgs(index);
  alignAfter();
  const nextPc  = pc;

  const e = lookupEntry(index);
  const mnemStr = e.mnem === '0' ? '???' : e.mnem;

  const bytesStr = rawBytes(addr, nextPc, org).padEnd(org === 1 ? 11 : 11, ' ');
  const addrStr  = h4(addr);
  const argsStr  = args ? '  ' + args : '';
  const line     = `${addrStr}:  ${bytesStr}  ${mnemStr.padEnd(6)}${argsStr}`;

  return { line, nextAddr: nextPc };
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

function parseArgs(): {
  rom0: string; rom1: string;
  start: number; end: number;
} {
  const args = process.argv.slice(2);
  let rom0  = resolve(ROOT, 'public/roms/rom0.bin');
  let rom1  = resolve(ROOT, 'public/roms/rom1.bin');
  let start = 0x0000;
  let end   = 0xFFFF;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--rom0': rom0  = resolve(args[++i]!); break;
      case '--rom1': rom1  = resolve(args[++i]!); break;
      case '--start': start = parseInt(args[++i]!, 16); break;
      case '--end':   end   = parseInt(args[++i]!, 16); break;
    }
  }
  return { rom0, rom1, start, end };
}

function main(): void {
  const { rom0, rom1, start, end } = parseArgs();
  loadRoms(rom0, rom1);

  let addr = start;
  while (addr <= end) {
    // Check the address falls in a loaded region
    const inRegion = regions.some(r => r.data && addr >= r.first && addr < r.last);
    if (!inRegion) {
      addr++;
      continue;
    }

    const { line, nextAddr } = disOneLine(addr);
    console.log(line);

    // Guard against infinite loop and 16-bit address wrap-around
    if (nextAddr <= addr) break;
    addr = nextAddr;
  }
}

main();
