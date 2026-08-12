// tools/compiler/opcodes.ts
// HD61700 instruction encoder — reverses the disassembler decode tables
// into encode tables for the assembler.

// ─── Kind constants (mirrors disassemble.ts) ─────────────────────────────────

const Kind = {
  ILLOP: 0, NONE: 1, CC: 2, JRCC: 3, JPCC: 4, JR: 5, JP: 6,
  REGREGJR: 7, REGDIRJR: 8, REGJR: 9, REGIRR: 10, REGIRRIM3: 11,
  REG: 12, DIR: 13, IRRREG: 14, REGIM8JR: 15, IM8: 16, IM8A: 17, R8IM8: 18,
  REGIRI: 19, IRIREG: 20, R8REGJR: 21, R16REGJR: 22, R16IM16: 23,
  IM8IND: 24, IM16IND: 25, RRIM3JR: 26, RIM5IM3JR: 27, REGIM8: 28,
  REGIM16: 29, REGIM3: 30, SIRREGJR: 31, SIRREGIM3: 32, SIRIM5: 33,
} as const;
type KindVal = typeof Kind[keyof typeof Kind];

// ─── Mnemonic table (identical to disassemble.ts) ────────────────────────────

type OpEntry  = { mnem: string; kind: KindVal };
type ExtEntry = { mnem: '0';    ext:  number   };
type Entry    = OpEntry | ExtEntry;

const op = (mnem: string, kind: KindVal): Entry => ({ mnem, kind });
const ex = (n: number): Entry => ({ mnem: '0', ext: 256 + n * 4 });

// Build the full 256-entry table matching the disassembler exactly
const mnemTab: Entry[] = [
  /* 0x00 */ op('adc',   Kind.REGREGJR),   /* 0x01 */ op('sbc',   Kind.REGREGJR),
  /* 0x02 */ op('ld',    Kind.REGREGJR),   /* 0x03 */ op('ldc',   Kind.REGREGJR),
  /* 0x04 */ op('anc',   Kind.REGREGJR),   /* 0x05 */ op('nac',   Kind.REGREGJR),
  /* 0x06 */ op('orc',   Kind.REGREGJR),   /* 0x07 */ op('xrc',   Kind.REGREGJR),
  /* 0x08 */ op('ad',    Kind.REGREGJR),   /* 0x09 */ op('sb',    Kind.REGREGJR),
  /* 0x0A */ op('adb',   Kind.REGREGJR),   /* 0x0B */ op('sbb',   Kind.REGREGJR),
  /* 0x0C */ op('an',    Kind.REGREGJR),   /* 0x0D */ op('na',    Kind.REGREGJR),
  /* 0x0E */ op('or',    Kind.REGREGJR),   /* 0x0F */ op('xr',    Kind.REGREGJR),
  /* 0x10 */ op('st',    Kind.REGDIRJR),   /* 0x11 */ op('ld',    Kind.REGDIRJR),
  /* 0x12 */ ex(0),                          /* 0x13 */ ex(18),
  /* 0x14 */ ex(1),                          /* 0x15 */ op('psr',   Kind.SIRREGJR),
  /* 0x16 */ op('pst',   Kind.R8REGJR),    /* 0x17 */ op('pst',   Kind.R8REGJR),
  /* 0x18 */ ex(2),                          /* 0x19 */ op('****',  Kind.ILLOP),
  /* 0x1A */ ex(3),                          /* 0x1B */ ex(4),
  /* 0x1C */ ex(5),                          /* 0x1D */ op('gsr',   Kind.SIRREGJR),
  /* 0x1E */ op('gst',   Kind.R8REGJR),    /* 0x1F */ op('gst',   Kind.R8REGJR),
  /* 0x20 */ op('st',    Kind.REGIRR),     /* 0x21 */ op('st',    Kind.REGIRR),
  /* 0x22 */ op('sti',   Kind.REGIRR),     /* 0x23 */ op('sti',   Kind.REGIRR),
  /* 0x24 */ op('std',   Kind.REGIRR),     /* 0x25 */ op('std',   Kind.REGIRR),
  /* 0x26 */ op('phs',   Kind.REG),        /* 0x27 */ op('phu',   Kind.REG),
  /* 0x28 */ op('ld',    Kind.REGIRR),     /* 0x29 */ op('ld',    Kind.REGIRR),
  /* 0x2A */ op('ldi',   Kind.REGIRR),     /* 0x2B */ op('ldi',   Kind.REGIRR),
  /* 0x2C */ op('ldd',   Kind.REGIRR),     /* 0x2D */ op('ldd',   Kind.REGIRR),
  /* 0x2E */ op('pps',   Kind.REG),        /* 0x2F */ op('ppu',   Kind.REG),
  /* 0x30 */ op('jp',    Kind.JPCC),       /* 0x31 */ op('jp',    Kind.JPCC),
  /* 0x32 */ op('jp',    Kind.JPCC),       /* 0x33 */ op('jp',    Kind.JPCC),
  /* 0x34 */ op('jp',    Kind.JPCC),       /* 0x35 */ op('jp',    Kind.JPCC),
  /* 0x36 */ op('jp',    Kind.JPCC),       /* 0x37 */ op('jp',    Kind.JP),
  /* 0x38 */ op('adc',   Kind.IRRREG),     /* 0x39 */ op('adc',   Kind.IRRREG),
  /* 0x3A */ op('sbc',   Kind.IRRREG),     /* 0x3B */ op('sbc',   Kind.IRRREG),
  /* 0x3C */ op('ad',    Kind.IRRREG),     /* 0x3D */ op('ad',    Kind.IRRREG),
  /* 0x3E */ op('sb',    Kind.IRRREG),     /* 0x3F */ op('sb',    Kind.IRRREG),
  /* 0x40 */ op('adc',   Kind.REGIM8JR),   /* 0x41 */ op('sbc',   Kind.REGIM8JR),
  /* 0x42 */ op('ld',    Kind.REGIM8JR),   /* 0x43 */ op('ldc',   Kind.REGIM8JR),
  /* 0x44 */ op('anc',   Kind.REGIM8JR),   /* 0x45 */ op('nac',   Kind.REGIM8JR),
  /* 0x46 */ op('orc',   Kind.REGIM8JR),   /* 0x47 */ op('xrc',   Kind.REGIM8JR),
  /* 0x48 */ op('ad',    Kind.REGIM8JR),   /* 0x49 */ op('sb',    Kind.REGIM8JR),
  /* 0x4A */ op('adb',   Kind.REGIM8JR),   /* 0x4B */ op('sbb',   Kind.REGIM8JR),
  /* 0x4C */ op('an',    Kind.REGIM8JR),   /* 0x4D */ op('na',    Kind.REGIM8JR),
  /* 0x4E */ op('or',    Kind.REGIM8JR),   /* 0x4F */ op('xr',    Kind.REGIM8JR),
  /* 0x50 */ op('st',    Kind.IM8IND),     /* 0x51 */ ex(20),
  /* 0x52 */ op('stl',   Kind.IM8),        /* 0x53 */ op('****',  Kind.ILLOP),
  /* 0x54 */ ex(6),                          /* 0x55 */ op('psr',   Kind.SIRIM5),
  /* 0x56 */ op('pst',   Kind.R8IM8),      /* 0x57 */ op('pst',   Kind.R8IM8),
  /* 0x58 */ op('bups',  Kind.IM8),        /* 0x59 */ op('bdns',  Kind.IM8),
  /* 0x5A */ op('****',  Kind.ILLOP),      /* 0x5B */ op('****',  Kind.ILLOP),
  /* 0x5C */ op('sup',   Kind.IM8),        /* 0x5D */ op('sdn',   Kind.IM8),
  /* 0x5E */ op('****',  Kind.ILLOP),      /* 0x5F */ op('****',  Kind.ILLOP),
  /* 0x60 */ op('st',    Kind.REGIRI),     /* 0x61 */ op('st',    Kind.REGIRI),
  /* 0x62 */ op('sti',   Kind.REGIRI),     /* 0x63 */ op('sti',   Kind.REGIRI),
  /* 0x64 */ op('std',   Kind.REGIRI),     /* 0x65 */ op('std',   Kind.REGIRI),
  /* 0x66 */ op('****',  Kind.ILLOP),      /* 0x67 */ op('****',  Kind.ILLOP),
  /* 0x68 */ op('ld',    Kind.REGIRI),     /* 0x69 */ op('ld',    Kind.REGIRI),
  /* 0x6A */ op('ldi',   Kind.REGIRI),     /* 0x6B */ op('ldi',   Kind.REGIRI),
  /* 0x6C */ op('ldd',   Kind.REGIRI),     /* 0x6D */ op('ldd',   Kind.REGIRI),
  /* 0x6E */ op('****',  Kind.ILLOP),      /* 0x6F */ op('****',  Kind.ILLOP),
  /* 0x70 */ op('cal',   Kind.JPCC),       /* 0x71 */ op('cal',   Kind.JPCC),
  /* 0x72 */ op('cal',   Kind.JPCC),       /* 0x73 */ op('cal',   Kind.JPCC),
  /* 0x74 */ op('cal',   Kind.JPCC),       /* 0x75 */ op('cal',   Kind.JPCC),
  /* 0x76 */ op('cal',   Kind.JPCC),       /* 0x77 */ op('cal',   Kind.JP),
  /* 0x78 */ op('adc',   Kind.IRIREG),     /* 0x79 */ op('adc',   Kind.IRIREG),
  /* 0x7A */ op('sbc',   Kind.IRIREG),     /* 0x7B */ op('sbc',   Kind.IRIREG),
  /* 0x7C */ op('ad',    Kind.IRIREG),     /* 0x7D */ op('ad',    Kind.IRIREG),
  /* 0x7E */ op('sb',    Kind.IRIREG),     /* 0x7F */ op('sb',    Kind.IRIREG),
  /* 0x80 */ op('adcw',  Kind.REGREGJR),   /* 0x81 */ op('sbcw',  Kind.REGREGJR),
  /* 0x82 */ op('ldw',   Kind.REGREGJR),   /* 0x83 */ op('ldcw',  Kind.REGREGJR),
  /* 0x84 */ op('ancw',  Kind.REGREGJR),   /* 0x85 */ op('nacw',  Kind.REGREGJR),
  /* 0x86 */ op('orcw',  Kind.REGREGJR),   /* 0x87 */ op('xrcw',  Kind.REGREGJR),
  /* 0x88 */ op('adw',   Kind.REGREGJR),   /* 0x89 */ op('sbw',   Kind.REGREGJR),
  /* 0x8A */ op('adbw',  Kind.REGREGJR),   /* 0x8B */ op('sbbw',  Kind.REGREGJR),
  /* 0x8C */ op('anw',   Kind.REGREGJR),   /* 0x8D */ op('naw',   Kind.REGREGJR),
  /* 0x8E */ op('orw',   Kind.REGREGJR),   /* 0x8F */ op('xrw',   Kind.REGREGJR),
  /* 0x90 */ op('stw',   Kind.REGDIRJR),   /* 0x91 */ op('ldw',   Kind.REGDIRJR),
  /* 0x92 */ ex(7),                          /* 0x93 */ ex(19),
  /* 0x94 */ ex(8),                          /* 0x95 */ op('psrw',  Kind.SIRREGJR),
  /* 0x96 */ op('pre',   Kind.R16REGJR),   /* 0x97 */ op('pre',   Kind.R16REGJR),
  /* 0x98 */ ex(9),                          /* 0x99 */ op('****',  Kind.ILLOP),
  /* 0x9A */ ex(10),                         /* 0x9B */ ex(11),
  /* 0x9C */ ex(12),                         /* 0x9D */ op('gsrw',  Kind.SIRREGJR),
  /* 0x9E */ op('gre',   Kind.R16REGJR),   /* 0x9F */ op('gre',   Kind.R16REGJR),
  /* 0xA0 */ op('stw',   Kind.REGIRR),     /* 0xA1 */ op('stw',   Kind.REGIRR),
  /* 0xA2 */ op('stiw',  Kind.REGIRR),     /* 0xA3 */ op('stiw',  Kind.REGIRR),
  /* 0xA4 */ op('stdw',  Kind.REGIRR),     /* 0xA5 */ op('stdw',  Kind.REGIRR),
  /* 0xA6 */ op('phsw',  Kind.REG),        /* 0xA7 */ op('phuw',  Kind.REG),
  /* 0xA8 */ op('ldw',   Kind.REGIRR),     /* 0xA9 */ op('ldw',   Kind.REGIRR),
  /* 0xAA */ op('ldiw',  Kind.REGIRR),     /* 0xAB */ op('ldiw',  Kind.REGIRR),
  /* 0xAC */ op('lddw',  Kind.REGIRR),     /* 0xAD */ op('lddw',  Kind.REGIRR),
  /* 0xAE */ op('ppsw',  Kind.REG),        /* 0xAF */ op('ppuw',  Kind.REG),
  /* 0xB0 */ op('jr',    Kind.JRCC),       /* 0xB1 */ op('jr',    Kind.JRCC),
  /* 0xB2 */ op('jr',    Kind.JRCC),       /* 0xB3 */ op('jr',    Kind.JRCC),
  /* 0xB4 */ op('jr',    Kind.JRCC),       /* 0xB5 */ op('jr',    Kind.JRCC),
  /* 0xB6 */ op('jr',    Kind.JRCC),       /* 0xB7 */ op('jr',    Kind.JR),
  /* 0xB8 */ op('adcw',  Kind.IRRREG),     /* 0xB9 */ op('adcw',  Kind.IRRREG),
  /* 0xBA */ op('sbcw',  Kind.IRRREG),     /* 0xBB */ op('sbcw',  Kind.IRRREG),
  /* 0xBC */ op('adw',   Kind.IRRREG),     /* 0xBD */ op('adw',   Kind.IRRREG),
  /* 0xBE */ op('sbw',   Kind.IRRREG),     /* 0xBF */ op('sbw',   Kind.IRRREG),
  /* 0xC0 */ op('adbcm', Kind.RRIM3JR),    /* 0xC1 */ op('sbbcm', Kind.RRIM3JR),
  /* 0xC2 */ op('ldm',   Kind.RRIM3JR),    /* 0xC3 */ op('ldcm',  Kind.RRIM3JR),
  /* 0xC4 */ op('ancm',  Kind.RRIM3JR),    /* 0xC5 */ op('nacm',  Kind.RRIM3JR),
  /* 0xC6 */ op('orcm',  Kind.RRIM3JR),    /* 0xC7 */ op('xrcm',  Kind.RRIM3JR),
  /* 0xC8 */ op('adbm',  Kind.RRIM3JR),    /* 0xC9 */ op('sbbm',  Kind.RRIM3JR),
  /* 0xCA */ ex(13),                         /* 0xCB */ ex(14),
  /* 0xCC */ op('anm',   Kind.RRIM3JR),    /* 0xCD */ op('nam',   Kind.RRIM3JR),
  /* 0xCE */ op('orm',   Kind.RRIM3JR),    /* 0xCF */ op('xrm',   Kind.RRIM3JR),
  /* 0xD0 */ op('stw',   Kind.IM16IND),    /* 0xD1 */ ex(21),
  /* 0xD2 */ op('stlm',  Kind.REGIM3),     /* 0xD3 */ ex(15),
  /* 0xD4 */ op('ppom',  Kind.REGIM3),     /* 0xD5 */ op('psrm',  Kind.SIRREGIM3),
  /* 0xD6 */ op('pre',   Kind.R16IM16),    /* 0xD7 */ op('pre',   Kind.R16IM16),
  /* 0xD8 */ op('bup',   Kind.NONE),       /* 0xD9 */ op('bdn',   Kind.NONE),
  /* 0xDA */ ex(16),                         /* 0xDB */ ex(17),
  /* 0xDC */ op('sup',   Kind.REG),        /* 0xDD */ op('sdn',   Kind.REG),
  /* 0xDE */ op('jp',    Kind.REG),        /* 0xDF */ op('jp',    Kind.DIR),
  /* 0xE0 */ op('stm',   Kind.REGIRRIM3),  /* 0xE1 */ op('stm',   Kind.REGIRRIM3),
  /* 0xE2 */ op('stim',  Kind.REGIRRIM3),  /* 0xE3 */ op('stim',  Kind.REGIRRIM3),
  /* 0xE4 */ op('stdm',  Kind.REGIRRIM3),  /* 0xE5 */ op('stdm',  Kind.REGIRRIM3),
  /* 0xE6 */ op('phsm',  Kind.REGIM3),     /* 0xE7 */ op('phum',  Kind.REGIM3),
  /* 0xE8 */ op('ldm',   Kind.REGIRRIM3),  /* 0xE9 */ op('ldm',   Kind.REGIRRIM3),
  /* 0xEA */ op('ldim',  Kind.REGIRRIM3),  /* 0xEB */ op('ldim',  Kind.REGIRRIM3),
  /* 0xEC */ op('lddm',  Kind.REGIRRIM3),  /* 0xED */ op('lddm',  Kind.REGIRRIM3),
  /* 0xEE */ op('ppsm',  Kind.REGIM3),     /* 0xEF */ op('ppum',  Kind.REGIM3),
  /* 0xF0 */ op('rtn',   Kind.CC),         /* 0xF1 */ op('rtn',   Kind.CC),
  /* 0xF2 */ op('rtn',   Kind.CC),         /* 0xF3 */ op('rtn',   Kind.CC),
  /* 0xF4 */ op('rtn',   Kind.CC),         /* 0xF5 */ op('rtn',   Kind.CC),
  /* 0xF6 */ op('rtn',   Kind.CC),         /* 0xF7 */ op('rtn',   Kind.NONE),
  /* 0xF8 */ op('nop',   Kind.NONE),       /* 0xF9 */ op('clt',   Kind.NONE),
  /* 0xFA */ op('fst',   Kind.NONE),       /* 0xFB */ op('slw',   Kind.NONE),
  /* 0xFC */ op('cani',  Kind.NONE),       /* 0xFD */ op('rtni',  Kind.NONE),
  /* 0xFE */ op('off',   Kind.NONE),       /* 0xFF */ op('trp',   Kind.NONE),
];

const extTab: Entry[] = [
  /* ex(0)  = 256+0  */ op('stl',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(1)  = 256+4  */ op('ppo',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('pfl',   Kind.REGJR),      op('****',  Kind.ILLOP),
  /* ex(2)  = 256+8  */ op('rod',   Kind.REGJR),     op('rou',   Kind.REGJR),      op('bid',   Kind.REGJR),      op('biu',   Kind.REGJR),
  /* ex(3)  = 256+12 */ op('did',   Kind.REGJR),     op('diu',   Kind.REGJR),      op('byd',   Kind.REGJR),      op('byu',   Kind.REGJR),
  /* ex(4)  = 256+16 */ op('cmp',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('inv',   Kind.REGJR),      op('****',  Kind.ILLOP),
  /* ex(5)  = 256+20 */ op('gpo',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('gfl',   Kind.REGJR),      op('****',  Kind.ILLOP),
  /* ex(6)  = 256+24 */ op('ppo',   Kind.IM8A),      op('****',  Kind.ILLOP),      op('pfl',   Kind.IM8A),       op('****',  Kind.ILLOP),
  /* ex(7)  = 256+28 */ op('stlw',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(8)  = 256+32 */ op('ppow',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(9)  = 256+36 */ op('rodw',  Kind.REGJR),     op('rouw',  Kind.REGJR),      op('bidw',  Kind.REGJR),      op('biuw',  Kind.REGJR),
  /* ex(10) = 256+40 */ op('didw',  Kind.REGJR),     op('diuw',  Kind.REGJR),      op('bydw',  Kind.REGJR),      op('byuw',  Kind.REGJR),
  /* ex(11) = 256+44 */ op('cmpw',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('invw',  Kind.REGJR),      op('****',  Kind.ILLOP),
  /* ex(12) = 256+48 */ op('gpow',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('gflw',  Kind.REGJR),      op('****',  Kind.ILLOP),
  /* ex(13) = 256+52 */ op('adbm',  Kind.RIM5IM3JR), op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(14) = 256+56 */ op('sbbm',  Kind.RIM5IM3JR), op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(15) = 256+60 */ op('ldlm',  Kind.REGIM3),    op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(16) = 256+64 */ op('didm',  Kind.REGIM3),    op('dium',  Kind.REGIM3),     op('bydm',  Kind.REGIM3),     op('byum',  Kind.REGIM3),
  /* ex(17) = 256+68 */ op('cmpm',  Kind.REGIM3),    op('****',  Kind.ILLOP),      op('invm',  Kind.REGIM3),     op('****',  Kind.ILLOP),
  /* ex(18) = 256+72 */ op('ldl',   Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(19) = 256+76 */ op('ldlw',  Kind.REGJR),     op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(20) = 256+80 */ op('ld',    Kind.REGIM8),    op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
  /* ex(21) = 256+84 */ op('ldw',   Kind.REGIM16),   op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),      op('****',  Kind.ILLOP),
];

function lookupEntry(index: number): Entry {
  if (index < 256) return mnemTab[index]!;
  return extTab[index - 256]!;
}

// ─── Register name tables ────────────────────────────────────────────────────

const cctab   = ['z', 'nc', 'lz', 'uz', 'nz', 'c', 'nlz'] as const;
const r8tab   = [['pe','pd','ib','ua'], ['ia','ie','??','tm']] as const;
const r16tab  = [['ix','iy','iz','us'], ['ss','ky','ky','ky']] as const;
const sirtab  = ['sx','sy','sz','??'] as const;

// ─── Reverse lookup maps ─────────────────────────────────────────────────────

interface Encoding {
  index: number;   // table index (0-255 for primary, 256+ for ext)
  kind: KindVal;
}

// Build mnemonic → possible encodings map
const reverseMap = new Map<string, Encoding[]>();

function addToReverse(mnem: string, index: number, kind: KindVal) {
  if (mnem === '****' || mnem === '0') return;
  const key = mnem.toLowerCase();
  let arr = reverseMap.get(key);
  if (!arr) { arr = []; reverseMap.set(key, arr); }
  arr.push({ index, kind });
}

// Primary opcodes
for (let i = 0; i < 256; i++) {
  const e = mnemTab[i]!;
  if (e.mnem === '0') {
    // Extension: enumerate the 4 sub-entries
    const base = (e as ExtEntry).ext;
    for (let v = 0; v < 4; v++) {
      const sub = extTab[base - 256 + v]!;
      if (sub.mnem !== '****' && sub.mnem !== '0') {
        addToReverse(sub.mnem, base + v, (sub as OpEntry).kind);
      }
    }
  } else if (e.mnem !== '****') {
    addToReverse(e.mnem, i, (e as OpEntry).kind);
  }
}

// ─── Reverse lookup for R8/R16/SIR/CC registers ─────────────────────────────

const ccMap = new Map<string, number>();
cctab.forEach((name, i) => ccMap.set(name, i));

const r8Map = new Map<string, { row: number; col: number }>();
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 4; col++) {
    const name = r8tab[row]![col]!;
    if (name !== '??') r8Map.set(name.toLowerCase(), { row, col });
  }
}

const r16Map = new Map<string, { row: number; col: number }>();
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 4; col++) {
    const name = r16tab[row]![col]!;
    if (name !== '??') {
      // Only store first occurrence for 'ky' (row=1, col=1)
      if (!r16Map.has(name.toLowerCase())) {
        r16Map.set(name.toLowerCase(), { row, col });
      }
    }
  }
}

const sirMap = new Map<string, number>();
sirtab.forEach((name, i) => { if (name !== '??') sirMap.set(name.toLowerCase(), i); });

// ─── Parsing helpers ─────────────────────────────────────────────────────────

function parseHex(s: string): number {
  s = s.trim();
  if (s.startsWith('&H') || s.startsWith('&h')) return parseInt(s.slice(2), 16);
  if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s.slice(2), 16);
  return parseInt(s, 10);
}

function parseReg(s: string): number | null {
  s = s.trim();
  if (s.startsWith('$')) {
    const n = parseInt(s.slice(1), 10);
    if (!isNaN(n) && n >= 0 && n <= 31) return n;
  }
  return null;
}

function parseSir(s: string): number | null {
  const idx = sirMap.get(s.trim().toLowerCase());
  return idx !== undefined ? idx : null;
}

function parseCC(s: string): number | null {
  const idx = ccMap.get(s.trim().toLowerCase());
  return idx !== undefined ? idx : null;
}

function splitOperands(s: string): string[] {
  // Split on comma, but handle parenthesized expressions
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function isImmediate(s: string): boolean {
  s = s.trim();
  return s.startsWith('&H') || s.startsWith('&h') ||
         s.startsWith('0x') || s.startsWith('0X') ||
         /^\d+$/.test(s);
}

// ─── Encoding helpers ────────────────────────────────────────────────────────

// Encode a 7-bit relative jump offset per HD61700 convention
// Encode a 7-bit imm7 offset for jr/conditional-jr-style instructions.
// The `base` argument is the PC value that imm7Arg() will capture as `y` in
// the emulator (i.e. the PC AFTER the opcode byte has been fetched, BEFORE
// the offset byte is fetched). For byte-memory code this is instr_addr + 1;
// for word-memory ROM code this is the instruction's own address.
function encodeImm7(base: number, target: number): number {
  const pc = base;
  const offset = (target - pc) & 0xFFFF;
  if (offset === 0) return 0;
  if (offset <= 0x7F) return offset;  // positive
  // Negative: offset is like 0xFFxx, we need actual signed offset
  const signed = target - pc;
  if (signed < 0) return 0x80 + (-signed);  // HD61700: raw=0x80+|offset|, decoder does 0x80-raw
  return offset & 0x7F;
}

// Find which primary opcode hosts an extension index
function findExtHost(extIndex: number): number {
  // extIndex is 256-based. We need to find which mnemTab entry has ex(N)
  // where 256 + N*4 <= extIndex < 256 + N*4 + 4
  const variant = (extIndex - 256) & 3;
  const base = extIndex - variant;  // = 256 + N*4
  for (let i = 0; i < 256; i++) {
    const e = mnemTab[i]!;
    if (e.mnem === '0' && (e as ExtEntry).ext === base) return i;
  }
  return -1;
}

// ─── Encode SIR into bits [7:5] ──────────────────────────────────────────────

function encodeSirBits(sirIdx: number): number {
  return (sirIdx & 3) << 5;
}

// Encode a register reference for the "short reg" field (bits [6:5] of operand byte)
// If the source is an SIR register name, use bits [6:5].
// If it is a general register ($N), use 0x60 and emit extra byte.
function encodeShortReg(s: string): { bits: number; extraByte?: number } | null {
  const sir = parseSir(s);
  if (sir !== null) {
    return { bits: encodeSirBits(sir) };
  }
  // Check if it's $sir_name (e.g., "$sx")
  if (s.startsWith('$')) {
    const inner = s.slice(1).toLowerCase();
    const sirIdx = sirMap.get(inner);
    if (sirIdx !== undefined) {
      return { bits: encodeSirBits(sirIdx) };
    }
    // General register
    const reg = parseReg(s);
    if (reg !== null) {
      return { bits: 0x60, extraByte: reg };
    }
  }
  return null;
}

// ─── Main encoder ────────────────────────────────────────────────────────────

export function encodeInstruction(mnem: string, operands: string, pc?: number): Uint8Array {
  const m = mnem.toLowerCase().trim();
  const ops = operands.trim();

  // ── Pseudo-instructions ──
  if (m === 'db') return encodeDb(ops);
  if (m === 'dw') return encodeDw(ops);
  if (m === 'ds') return encodeDs(ops);

  // ── Look up mnemonic ──
  const candidates = reverseMap.get(m);
  if (!candidates || candidates.length === 0) {
    throw new Error(`Unknown mnemonic: ${m}`);
  }

  // Parse operand string to determine addressing mode and encode
  const parts = ops ? splitOperands(ops) : [];

  // ── Try each candidate encoding ──
  for (const cand of candidates) {
    const result = tryEncode(cand, m, parts, ops, pc ?? 0);
    if (result) return result;
  }

  throw new Error(`Cannot encode: ${m} ${ops}`);
}

function tryEncode(
  cand: Encoding,
  mnem: string,
  parts: string[],
  rawOps: string,
  pc: number
): Uint8Array | null {
  const { index, kind } = cand;
  const bytes: number[] = [];

  switch (kind) {
    case Kind.NONE: {
      if (parts.length > 0 && parts[0] !== '') return null;
      if (index >= 256) {
        // Extension opcode
        const host = findExtHost(index);
        if (host < 0) return null;
        const variant = (index - 256) & 3;
        bytes.push(host);
        bytes.push(variant << 5);
      } else {
        bytes.push(index);
      }
      return new Uint8Array(bytes);
    }

    case Kind.CC: {
      // rtn z, rtn nc, etc. or rtn (no operand = unconditional = index & 7 == 7)
      if (parts.length === 0 || parts[0] === '') {
        // Unconditional — need the index where (index & 7) == 7
        if ((index & 7) !== 7) return null;
        // But wait, rtn unconditional is Kind.NONE at 0xF7
        // CC entries are 0xF0-0xF6. No operand should match Kind.NONE
        return null;
      }
      const cc = parseCC(parts[0]!);
      if (cc === null) return null;
      if ((index & 7) !== cc) return null;
      bytes.push(index);
      return new Uint8Array(bytes);
    }

    case Kind.JRCC: {
      // e.g., jr z,&H1234
      if (parts.length < 2) return null;
      const cc = parseCC(parts[0]!);
      if (cc === null) return null;
      if ((index & 7) !== cc) return null;
      const target = parseHex(parts[1]!);
      bytes.push(index);
      bytes.push(encodeImm7(pc + 1, target));
      return new Uint8Array(bytes);
    }

    case Kind.JR: {
      // Unconditional jr &H1234
      if (parts.length !== 1) return null;
      if (!isImmediate(parts[0]!)) return null;
      const target = parseHex(parts[0]!);
      bytes.push(index);
      bytes.push(encodeImm7(pc + 1, target));
      return new Uint8Array(bytes);
    }

    case Kind.JPCC: {
      // e.g., cal z,&H1234 or jp nc,&H1234
      if (parts.length < 2) return null;
      const cc = parseCC(parts[0]!);
      if (cc === null) return null;
      if ((index & 7) !== cc) return null;
      const addr = parseHex(parts[1]!);
      bytes.push(index);
      bytes.push(addr & 0xFF);
      bytes.push((addr >> 8) & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.JP: {
      // Unconditional jp/cal &H1234
      if (parts.length !== 1) return null;
      if (!isImmediate(parts[0]!)) return null;
      const addr = parseHex(parts[0]!);
      bytes.push(index);
      bytes.push(addr & 0xFF);
      bytes.push((addr >> 8) & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.REG: {
      // e.g., phs $1, pps $0
      if (parts.length !== 1) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;
      if (index >= 256) {
        const host = findExtHost(index);
        if (host < 0) return null;
        const variant = (index - 256) & 3;
        bytes.push(host);
        bytes.push((variant << 5) | (reg & 0x1F));
      } else {
        bytes.push(index);
        bytes.push(reg & 0x1F);
      }
      return new Uint8Array(bytes);
    }

    case Kind.DIR: {
      // e.g., jp ($2)
      if (parts.length !== 1) return null;
      let s = parts[0]!.trim();
      if (s.startsWith('(') && s.endsWith(')')) {
        s = s.slice(1, -1).trim();
      } else {
        return null;
      }
      const reg = parseReg(s);
      if (reg === null) return null;
      bytes.push(index);
      bytes.push(reg & 0x1F);
      return new Uint8Array(bytes);
    }

    case Kind.REGREGJR: {
      // e.g., ld $10,$0 or ad $10,$11
      // Encoding: opcode, then byte with dest_reg[4:0] and src encoded in [6:5]
      if (parts.length < 2) return null;
      const destReg = parseReg(parts[0]!);
      if (destReg === null) return null;

      // Check for optional jr suffix
      const hasJr = parts.length >= 3 && parts[2]!.toLowerCase().startsWith('jr');

      const src = parts[1]!.trim();
      const short = encodeShortReg(src);
      if (!short) return null;

      const operandByte = (destReg & 0x1F) | short.bits | (hasJr ? 0x80 : 0);

      if (index >= 256) {
        const host = findExtHost(index);
        if (host < 0) return null;
        const variant = (index - 256) & 3;
        bytes.push(host);
        // For extension opcodes, the variant goes in bits [7:5] of the second byte
        // But REGREGJR already uses bits [6:5] for the short reg...
        // Extension: first byte = host opcode, second byte has variant in [7:5] (but here kind is REGREGJR)
        // Actually, extension dispatch uses bits [7:5] of byte1 for variant selection.
        // But REGREGJR also uses bits [6:5] for the short reg. Conflict?
        // Looking at extTab, none of the REGREGJR-kind entries exist in extensions.
        // So this shouldn't occur. Return null.
        return null;
      }

      bytes.push(index);
      bytes.push(operandByte);
      if (short.extraByte !== undefined) bytes.push(short.extraByte);
      if (hasJr) {
        const jrPart = parts[2]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.REGDIRJR: {
      // e.g., st $1,($sx) or ld $1,($0)
      if (parts.length < 2) return null;
      const destReg = parseReg(parts[0]!);
      if (destReg === null) return null;

      let s = parts[1]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();

      const hasJr = parts.length >= 3 && parts[2]!.toLowerCase().startsWith('jr');
      const short = encodeShortReg(s);
      if (!short) return null;
      const operandByte = (destReg & 0x1F) | short.bits | (hasJr ? 0x80 : 0);

      bytes.push(index);
      bytes.push(operandByte);
      if (short.extraByte !== undefined) bytes.push(short.extraByte);
      if (hasJr) {
        const jrPart = parts[2]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.REGJR: {
      // e.g., stl $1 or cmp $1
      if (parts.length < 1) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;

      const hasJr = parts.length >= 2 && parts[1]!.toLowerCase().startsWith('jr');
      const operandByte = (reg & 0x1F) | (hasJr ? 0x80 : 0);

      if (index >= 256) {
        const host = findExtHost(index);
        if (host < 0) return null;
        const variant = (index - 256) & 3;
        bytes.push(host);
        bytes.push((variant << 5) | operandByte);
      } else {
        bytes.push(index);
        bytes.push(operandByte);
      }
      if (hasJr) {
        const jrPart = parts[1]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.REGIM8JR: {
      // e.g., ld $10,&H42 or ad $5,&HFF
      if (parts.length < 2) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;
      if (!isImmediate(parts[1]!)) return null;

      const imm = parseHex(parts[1]!);
      const hasJr = parts.length >= 3 && parts[2]!.toLowerCase().startsWith('jr');
      const operandByte = (reg & 0x1F) | (hasJr ? 0x80 : 0);

      bytes.push(index);
      bytes.push(operandByte);
      bytes.push(imm & 0xFF);
      if (hasJr) {
        const jrPart = parts[2]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.REGIM8: {
      // e.g., ld $2,&H42  (extension opcode)
      if (parts.length !== 2) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;
      if (!isImmediate(parts[1]!)) return null;

      const imm = parseHex(parts[1]!);
      const host = findExtHost(index);
      if (host < 0) return null;
      const variant = (index - 256) & 3;
      bytes.push(host);
      bytes.push((variant << 5) | (reg & 0x1F));
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.REGIM16: {
      // e.g., ldw $2,&H2ADF (extension opcode)
      if (parts.length !== 2) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;
      if (!isImmediate(parts[1]!)) return null;

      const imm = parseHex(parts[1]!);
      const host = findExtHost(index);
      if (host < 0) return null;
      const variant = (index - 256) & 3;
      bytes.push(host);
      bytes.push((variant << 5) | (reg & 0x1F));
      bytes.push(imm & 0xFF);
      bytes.push((imm >> 8) & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.IM8: {
      // e.g., stl &H42
      if (parts.length !== 1) return null;
      if (!isImmediate(parts[0]!)) return null;
      const imm = parseHex(parts[0]!);
      bytes.push(index);
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.IM8A: {
      // e.g., ppo &H42 (has an extra byte before the immediate)
      if (parts.length !== 1) return null;
      if (!isImmediate(parts[0]!)) return null;
      const imm = parseHex(parts[0]!);
      const host = findExtHost(index);
      if (host < 0) return null;
      const variant = (index - 256) & 3;
      bytes.push(host);
      bytes.push(variant << 5);  // first operand byte (variant in [7:5])
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.R8IM8: {
      // e.g., pst UA,&H54
      if (parts.length !== 2) return null;
      const regName = parts[0]!.trim().toLowerCase();
      const r8 = r8Map.get(regName);
      if (!r8) return null;
      if (!isImmediate(parts[1]!)) return null;
      const imm = parseHex(parts[1]!);

      // r8tab[row][col]: row = index & 1, col = (x >> 5) & 3
      // So we need (index & 1) == r8.row
      if ((index & 1) !== r8.row) return null;

      bytes.push(index);
      bytes.push(r8.col << 5);
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.R8REGJR: {
      // e.g., pst pe,$1 or gst ia,$2
      if (parts.length < 2) return null;
      const regName = parts[0]!.trim().toLowerCase();
      const r8 = r8Map.get(regName);
      if (!r8) return null;
      const srcReg = parseReg(parts[1]!);
      if (srcReg === null) return null;

      if ((index & 1) !== r8.row) return null;

      const hasJr = parts.length >= 3 && parts[2]!.toLowerCase().startsWith('jr');
      const operandByte = (srcReg & 0x1F) | (r8.col << 5) | (hasJr ? 0x80 : 0);

      bytes.push(index);
      bytes.push(operandByte);
      if (hasJr) {
        const jrPart = parts[2]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.R16REGJR: {
      // e.g., pre ix,$1
      if (parts.length < 2) return null;
      const regName = parts[0]!.trim().toLowerCase();
      const r16 = r16Map.get(regName);
      if (!r16) return null;
      const srcReg = parseReg(parts[1]!);
      if (srcReg === null) return null;

      if ((index & 1) !== r16.row) return null;

      const hasJr = parts.length >= 3 && parts[2]!.toLowerCase().startsWith('jr');
      const operandByte = (srcReg & 0x1F) | (r16.col << 5) | (hasJr ? 0x80 : 0);

      bytes.push(index);
      bytes.push(operandByte);
      if (hasJr) {
        const jrPart = parts[2]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.R16IM16: {
      // e.g., pre ix,&H1234
      if (parts.length !== 2) return null;
      const regName = parts[0]!.trim().toLowerCase();
      const r16 = r16Map.get(regName);
      if (!r16) return null;
      if (!isImmediate(parts[1]!)) return null;

      if ((index & 1) !== r16.row) return null;

      const imm = parseHex(parts[1]!);
      bytes.push(index);
      bytes.push(r16.col << 5);
      bytes.push(imm & 0xFF);
      bytes.push((imm >> 8) & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.SIRREGJR: {
      // e.g., psr sx,$1
      if (parts.length < 2) return null;
      const sir = parseSir(parts[0]!);
      if (sir === null) return null;
      const reg = parseReg(parts[1]!);
      if (reg === null) return null;

      const hasJr = parts.length >= 3 && parts[2]!.toLowerCase().startsWith('jr');
      const operandByte = (reg & 0x1F) | (sir << 5) | (hasJr ? 0x80 : 0);

      bytes.push(index);
      bytes.push(operandByte);
      if (hasJr) {
        const jrPart = parts[2]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.SIRIM5: {
      // e.g., psr sx,5
      if (parts.length !== 2) return null;
      const sir = parseSir(parts[0]!);
      if (sir === null) return null;
      const imm5 = parseInt(parts[1]!.trim(), 10);
      if (isNaN(imm5) || imm5 < 0 || imm5 > 31) return null;

      bytes.push(index);
      bytes.push((sir << 5) | (imm5 & 0x1F));
      return new Uint8Array(bytes);
    }

    case Kind.SIRREGIM3: {
      // e.g., psrm sx,$1,3
      if (parts.length !== 3) return null;
      const sir = parseSir(parts[0]!);
      if (sir === null) return null;
      const reg = parseReg(parts[1]!);
      if (reg === null) return null;
      const count = parseInt(parts[2]!.trim(), 10);
      if (isNaN(count) || count < 1 || count > 8) return null;

      bytes.push(index);
      bytes.push((sir << 5) | (reg & 0x1F));
      bytes.push(((count - 1) & 7) << 5);
      return new Uint8Array(bytes);
    }

    case Kind.REGIRR: {
      // e.g., st $1,(ix+$sy) or ld $2,(iz-$0)
      if (parts.length !== 2) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;

      // Parse (ix+$sy) or (iz-$0)
      let s = parts[1]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();

      // Determine ix vs iz from the opcode index (bit 0)
      const irName = s.startsWith('ix') ? 'x' : s.startsWith('iz') ? 'z' : null;
      if (!irName) return null;
      const expectedBit = irName === 'x' ? 0 : 1;
      if ((index & 1) !== expectedBit) return null;

      // Parse sign
      const rest = s.slice(2).trim();
      let sign: number;
      let srcStr: string;
      if (rest.startsWith('+')) { sign = 0; srcStr = rest.slice(1).trim(); }
      else if (rest.startsWith('-')) { sign = 0x80; srcStr = rest.slice(1).trim(); }
      else return null;

      const short = encodeShortReg(srcStr);
      if (!short) return null;
      const operandByte = (reg & 0x1F) | short.bits | sign;

      bytes.push(index);
      bytes.push(operandByte);
      if (short.extraByte !== undefined) bytes.push(short.extraByte);
      return new Uint8Array(bytes);
    }

    case Kind.REGIRRIM3: {
      // e.g., stm $1,(ix+$sy),3
      if (parts.length !== 3) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;

      let s = parts[1]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();

      const irName = s.startsWith('ix') ? 'x' : s.startsWith('iz') ? 'z' : null;
      if (!irName) return null;
      const expectedBit = irName === 'x' ? 0 : 1;
      if ((index & 1) !== expectedBit) return null;

      const rest = s.slice(2).trim();
      let sign: number;
      let srcStr: string;
      if (rest.startsWith('+')) { sign = 0; srcStr = rest.slice(1).trim(); }
      else if (rest.startsWith('-')) { sign = 0x80; srcStr = rest.slice(1).trim(); }
      else return null;

      const count = parseInt(parts[2]!.trim(), 10);
      if (isNaN(count) || count < 1 || count > 8) return null;

      const short = encodeShortReg(srcStr);
      if (!short) return null;
      const operandByte = (reg & 0x1F) | short.bits | sign;

      bytes.push(index);
      bytes.push(operandByte);
      // For REGIRRIM3: second operand byte has short reg and im3
      // From disassembler: shortRegAr1(x, y) uses y for general reg case
      // y byte has im3 in bits [7:5]
      if (short.extraByte !== undefined) {
        bytes.push(((count - 1) << 5) | (short.extraByte & 0x1F));
      } else {
        bytes.push(((count - 1) << 5));
      }
      return new Uint8Array(bytes);
    }

    case Kind.IRRREG: {
      // e.g., adc (ix+$sy),$1
      if (parts.length !== 2) return null;

      let s = parts[0]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();

      const irName = s.startsWith('ix') ? 'x' : s.startsWith('iz') ? 'z' : null;
      if (!irName) return null;
      const expectedBit = irName === 'x' ? 0 : 1;
      if ((index & 1) !== expectedBit) return null;

      const rest = s.slice(2).trim();
      let sign: number;
      let srcStr: string;
      if (rest.startsWith('+')) { sign = 0; srcStr = rest.slice(1).trim(); }
      else if (rest.startsWith('-')) { sign = 0x80; srcStr = rest.slice(1).trim(); }
      else return null;

      const destReg = parseReg(parts[1]!);
      if (destReg === null) return null;

      const short = encodeShortReg(srcStr);
      if (!short) return null;
      const operandByte = (destReg & 0x1F) | short.bits | sign;

      bytes.push(index);
      bytes.push(operandByte);
      if (short.extraByte !== undefined) bytes.push(short.extraByte);
      return new Uint8Array(bytes);
    }

    case Kind.REGIRI: {
      // e.g., st $1,(ix+&H42) or ld $1,(iz-&H10)
      if (parts.length !== 2) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;

      let s = parts[1]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();

      const irName = s.startsWith('ix') ? 'x' : s.startsWith('iz') ? 'z' : null;
      if (!irName) return null;
      const expectedBit = irName === 'x' ? 0 : 1;
      if ((index & 1) !== expectedBit) return null;

      const rest = s.slice(2).trim();
      let sign: number;
      let immStr: string;
      if (rest.startsWith('+')) { sign = 0; immStr = rest.slice(1).trim(); }
      else if (rest.startsWith('-')) { sign = 0x80; immStr = rest.slice(1).trim(); }
      else return null;

      const imm = parseHex(immStr);
      bytes.push(index);
      bytes.push((reg & 0x1F) | sign);
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.IRIREG: {
      // e.g., adc (ix+&H42),$1
      if (parts.length !== 2) return null;

      let s = parts[0]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();

      const irName = s.startsWith('ix') ? 'x' : s.startsWith('iz') ? 'z' : null;
      if (!irName) return null;
      const expectedBit = irName === 'x' ? 0 : 1;
      if ((index & 1) !== expectedBit) return null;

      const rest = s.slice(2).trim();
      let sign: number;
      let immStr: string;
      if (rest.startsWith('+')) { sign = 0; immStr = rest.slice(1).trim(); }
      else if (rest.startsWith('-')) { sign = 0x80; immStr = rest.slice(1).trim(); }
      else return null;

      const destReg = parseReg(parts[1]!);
      if (destReg === null) return null;
      const imm = parseHex(immStr);

      bytes.push(index);
      bytes.push((destReg & 0x1F) | sign);
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.IM8IND: {
      // e.g., st &H42,($sx)
      if (parts.length !== 2) return null;
      if (!isImmediate(parts[0]!)) return null;

      let s = parts[1]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();
      // Remove leading $ if present
      if (s.startsWith('$')) s = s.slice(1);
      const sir = sirMap.get(s.toLowerCase());
      if (sir === undefined) return null;

      const imm = parseHex(parts[0]!);
      bytes.push(index);
      bytes.push(sir << 5);
      bytes.push(imm & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.IM16IND: {
      // e.g., stw &H1234,($sx)
      if (parts.length !== 2) return null;
      if (!isImmediate(parts[0]!)) return null;

      let s = parts[1]!.trim();
      if (!s.startsWith('(') || !s.endsWith(')')) return null;
      s = s.slice(1, -1).trim();
      if (s.startsWith('$')) s = s.slice(1);
      const sir = sirMap.get(s.toLowerCase());
      if (sir === undefined) return null;

      const imm = parseHex(parts[0]!);
      bytes.push(index);
      bytes.push(sir << 5);
      bytes.push(imm & 0xFF);
      bytes.push((imm >> 8) & 0xFF);
      return new Uint8Array(bytes);
    }

    case Kind.RRIM3JR: {
      // e.g., ldm $1,$sy,3 or ldm $1,$0,3
      if (parts.length < 3) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;

      const count = parseInt(parts[2]!.trim(), 10);
      if (isNaN(count) || count < 1 || count > 8) return null;

      const hasJr = parts.length >= 4 && parts[3]!.toLowerCase().startsWith('jr');

      // The source selector lives in bits [6:5] of the FIRST operand byte —
      // the decoder (`shortRegAr1` in src/emulator/exec.ts) tests
      // `(x & 0x60) === 0x60` on that byte to decide whether the source is a
      // named general register (index then supplied in the low 5 bits of the
      // count byte) or an SIR-indexed one. Emitting the selector in the count
      // byte instead silently turned `ldm $0,$10,8` into `ldm $0,($sx),8`.
      const srcStr = parts[1]!.trim();
      const short = encodeShortReg(srcStr);
      if (!short) return null;

      const operandByte = (reg & 0x1F) | short.bits | (hasJr ? 0x80 : 0);

      bytes.push(index);
      bytes.push(operandByte);
      bytes.push(((count - 1) << 5) | ((short.extraByte ?? 0) & 0x1F));
      if (hasJr) {
        const jrPart = parts[3]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.RIM5IM3JR: {
      // e.g., adbm $1,&H05,3
      if (parts.length < 3) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;
      if (!isImmediate(parts[1]!)) return null;
      const imm5 = parseHex(parts[1]!);
      const count = parseInt(parts[2]!.trim(), 10);
      if (isNaN(count) || count < 1 || count > 8) return null;

      const hasJr = parts.length >= 4 && parts[3]!.toLowerCase().startsWith('jr');
      const operandByte = (reg & 0x1F) | (hasJr ? 0x80 : 0);

      if (index >= 256) {
        const host = findExtHost(index);
        if (host < 0) return null;
        const variant = (index - 256) & 3;
        bytes.push(host);
        bytes.push((variant << 5) | operandByte);
        bytes.push(((count - 1) << 5) | (imm5 & 0x1F));
      } else {
        bytes.push(index);
        bytes.push(operandByte);
        bytes.push(((count - 1) << 5) | (imm5 & 0x1F));
      }
      if (hasJr) {
        const jrPart = parts[3]!.trim();
        const jrTarget = parseHex(jrPart.replace(/^jr\s+/i, ''));
        bytes.push(encodeImm7(pc + bytes.length, jrTarget));
      }
      return new Uint8Array(bytes);
    }

    case Kind.REGIM3: {
      // e.g., phsm $1,3
      if (parts.length !== 2) return null;
      const reg = parseReg(parts[0]!);
      if (reg === null) return null;
      const count = parseInt(parts[1]!.trim(), 10);
      if (isNaN(count) || count < 1 || count > 8) return null;

      if (index >= 256) {
        const host = findExtHost(index);
        if (host < 0) return null;
        const variant = (index - 256) & 3;
        bytes.push(host);
        bytes.push((variant << 5) | (reg & 0x1F));
        bytes.push(((count - 1) & 7) << 5);
      } else {
        bytes.push(index);
        bytes.push(reg & 0x1F);
        bytes.push(((count - 1) & 7) << 5);
      }
      return new Uint8Array(bytes);
    }

    default:
      return null;
  }
}

// ─── Pseudo-instruction encoders ─────────────────────────────────────────────

function encodeDb(ops: string): Uint8Array {
  ops = ops.trim();
  if (ops.startsWith('"') && ops.endsWith('"')) {
    // Pure string literal: db "Hello"
    const str = ops.slice(1, -1);
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i) & 0xFF;
    }
    return bytes;
  }

  if (ops.startsWith('"')) {
    // Mixed format: db "Hello, World!",0  (quoted string followed by byte values)
    // Find the closing quote — scan for unescaped "
    const closeIdx = ops.indexOf('"', 1);
    if (closeIdx > 0) {
      const str = ops.slice(1, closeIdx);
      const result: number[] = [];
      for (let i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i) & 0xFF);
      }
      // Parse any trailing comma-separated byte values after the closing quote
      const rest = ops.slice(closeIdx + 1).trim();
      if (rest.startsWith(',')) {
        const parts = rest.slice(1).split(',').map(s => s.trim()).filter(s => s.length > 0);
        for (const part of parts) {
          result.push(parseHex(part) & 0xFF);
        }
      }
      return new Uint8Array(result);
    }
  }

  // Hex byte list: &H48,&H65,...
  const parts = ops.split(',').map(s => s.trim());
  const bytes = new Uint8Array(parts.length);
  for (let i = 0; i < parts.length; i++) {
    bytes[i] = parseHex(parts[i]!) & 0xFF;
  }
  return bytes;
}

function encodeDw(ops: string): Uint8Array {
  const val = parseHex(ops.trim());
  return new Uint8Array([val & 0xFF, (val >> 8) & 0xFF]);
}

function encodeDs(ops: string): Uint8Array {
  const count = parseInt(ops.trim(), 10);
  return new Uint8Array(count);
}
