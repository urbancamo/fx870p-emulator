// HD44352A01 LCD controller emulation
// Ported from lcd.pas

import { VDD2_bit, LCDCE, OP_bit } from './def.js';

// ─── exported state ───────────────────────────────────────────────────────────
export const LCDSIZE = 0x0600; // data RAM: 2 banks × 0x300 nibbles
export const CHRSIZE = 0x1000; // character ROM: 256 chars × 16 nibbles

// Flat arrays: lcdimage[i] = one nibble (0..15)
export const lcdimage = new Uint8Array(LCDSIZE);
export const lcdchr   = new Uint8Array(256 * 16); // lcdchr[char * 16 + col]

export let lcdctrl = 0; // LCD control port (written by exec PPO/PFL)
export let onrate  = 8192;

export function setLcdctrl(v: number) {
  lcdctrl = v & 0xFF;
}

// ─── internal state ───────────────────────────────────────────────────────────
const lcdmem = new Uint8Array(2 * 768); // lcdmem[bank * 768 + index]

interface CursorParam {
  mem:    Uint8Array; // 16 nibbles
  offset: number;
  page:   number;    // 0 or 96
  col:    number;    // 0..95
  row:    number;    // 0 | 192 | 256 | 384
}

const ontab = [8192, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 2048, 4096, 4096, 4096, 4096];

let param     = new Uint8Array(6);
let state     = 0;  // bits 2..0 = received command nibbles; bit 3+ = data nibbles
let index     = 0;
let CharWidth = 8;
let Visible   = false;
let DataByte  = 0;

const cursor: CursorParam[] = [
  { mem: new Uint8Array(16), offset: 0, page: 0, col: 0, row: 0 },
  { mem: new Uint8Array(16), offset: 0, page: 0, col: 0, row: 0 },
];
let curmode = 0;

// ─── init ─────────────────────────────────────────────────────────────────────

export function lcdInit(): void {
  lcdmem.fill(0);
  param.fill(0);
  state     = 0;
  index     = 0;
  onrate    = 8192;
  CharWidth = 8;
  Visible   = false;
  DataByte  = 0;
  curmode   = 0;
  for (const c of cursor) {
    c.mem.fill(0);
    c.offset = c.page = c.col = c.row = 0;
  }
}

export function lcdSync(): void {
  state = 0;
}

// ─── nexus: combine old and new pixel nibble ──────────────────────────────────
function nexus(buf: Uint8Array, pos: number, y: number, kind: number): void {
  let x = buf[pos];
  switch (kind) {
    case 0: x = (~x & y);       break;
    case 1: x = (x ^ y);        break;
    case 2:
    case 6: x = 0;              break;
    case 3: x = (x & ~y);       break;
    case 4: x = y;              break;
    case 5: x = (x | y);        break;
    default:                    return; // no-op
  }
  buf[pos] = x & 0xF;
}

// ─── LCD transfer: send one nibble to/from the controller ────────────────────
export function lcdTransfer(data: number): number {
  data = data & 0xF;

  if ((lcdctrl & VDD2_bit) === 0) {
    // unpowered
    lcdInit();
    return 0xF;
  }

  if ((lcdctrl & LCDCE) === 0) return 0xF; // not selected

  if ((lcdctrl & OP_bit) !== 0) {
    // ── command nibble ──
    if (state < 6) {
      param[state] = data;
      state++;
    }

    switch (param[0]) {
      case 0x1: // Graphic Input
      case 0x2: // Graphic Output
      case 0x3: // Character Output
        if (state === 3) {
          index = data;
        } else if (state === 4) {
          index += (data & 7) << 4;
          if (index >= 96) index -= 32;
          if (data > 7) index += 96;
        } else if (state === 5) {
          index += 192 * (data & 3);
        }
        break;

      case 0x4: // LCD Visibility
        if (state === 2) Visible = (data & 1) !== 0;
        break;

      case 0x6: // Cursor Definition by Graphic
      case 0x7: // Cursor Definition by Character
        index = 0;
        if (state === 3) cursor[param[1] & 1].offset = data;
        break;

      case 0x8: // Scroll / Character Width
        if (state === 2) CharWidth = 8 - (data & 3);
        break;

      case 0x9: // Cursor Visibility
        if (state === 2) curmode = data;
        break;

      case 0xB: // User Character Definition
        index = 0;
        break;

      case 0xD: // Timer Frequency Control
        if (state === 2) onrate = ontab[data];
        break;

      case 0xE: // Cursor Position
        {
          const c = cursor[param[1] & 1];
          if (state === 3) {
            c.col = data;
          } else if (state === 4) {
            c.col += (data & 7) << 4;
            c.page = data > 7 ? 96 : 0;
          } else if (state === 5) {
            c.row = 192 * (data & 3);
          }
        }
        break;
    }
    return 0xF;

  } else {
    // ── data nibble ──
    const bank = param[1] & 1;
    const op   = param[1] >> 1;

    switch (param[0]) {
      case 0x1: // Graphic Input
        {
          const i = index % 768;
          // HD44352A01: return the nibble at i XOR 1 (HD44356 uses i directly)
          if ((param[1] >> 1) === 7) {
            return lcdmem[bank * 768 + (i ^ 1)];
          }
          index++;
        }
        return 0xF;

      case 0x2: // Graphic Output
        {
          const i = index % 768;
          nexus(lcdmem, bank * 768 + (i ^ 1), data, op);
          index++;
        }
        break;

      case 0x3: // Character Output
        if ((state & 8) === 0) {
          DataByte = data;
        } else {
          // HD44352A01: DataByte = (DataByte << 4) | data  (low nibble last)
          DataByte = ((DataByte << 4) | data) & 0xFF;
          for (let i = 0; i < 2 * CharWidth; i++) {
            const idx = index % 768;
            nexus(lcdmem, bank * 768 + idx, lcdchr[DataByte * 16 + i], op);
            index++;
          }
        }
        state ^= 8;
        break;

      case 0x6: // Cursor Definition by Graphic
        {
          const i = index & 0xF;
          cursor[bank].mem[i ^ 1] = data;
          index++;
        }
        break;

      case 0x7: // Cursor Definition by Character
        if ((state & 8) === 0) {
          DataByte = data;
        } else {
          DataByte = ((DataByte << 4) | data) & 0xFF;
          cursor[bank].mem.set(lcdchr.subarray(DataByte * 16, DataByte * 16 + 16));
        }
        state ^= 8;
        break;

      case 0xB: // User Character Definition
        {
          const charIdx = 0xFC | param[2];
          const i = index & 0xF;
          lcdchr[charIdx * 16 + (i ^ 1)] = data;
          index++;
        }
        break;
    }
    return 0xF;
  }
}

// ─── render: compose final lcdimage from lcdmem + cursors ────────────────────
export function lcdRender(): void {
  if (Visible) {
    lcdimage.set(lcdmem);
    if ((curmode & 1) !== 0) {
      for (let j = 0; j < 2; j++) {
        const c  = cursor[j];
        const m  = curmode >> 1;
        const n  = 768 * j + c.row + c.page + c.col;
        const cw = CharWidth << 1;
        for (let i = 0; i < cw; i++) {
          if (c.col + i > 95) break;
          nexus(lcdimage, n + i, c.mem[(c.offset - c.col + i) & 0xF], m);
        }
      }
    }
  } else {
    lcdimage.fill(0);
  }
}

// ─── charset init (called from emulator.ts after charset.bin is fetched) ─────
// charset.bin contains 128 chars × 16 bytes packed (upper nibble first per column)
// We expand to lcdchr[256][16] (one nibble per byte)
export function initCharset(raw: Uint8Array): void {
  // Load first 128 chars (2048 bytes = 128 * 16) into lcdchr directly
  lcdchr.fill(0);
  for (let c = 0; c < 128; c++) {
    for (let i = 0; i < 16; i++) {
      lcdchr[c * 16 + i] = raw[c * 16 + i] ?? 0;
    }
  }
  // Expand: working backwards so we don't overwrite unconverted data
  // for size := 127 downto 0 do
  //   for i := 15 downto 0 do
  //     lcdchr[2*size + i div 8, 2*(i mod 8)    ] := lcdchr[size,i] shr 4
  //     lcdchr[2*size + i div 8, 2*(i mod 8) + 1] := lcdchr[size,i] and $F
  for (let size = 127; size >= 0; size--) {
    for (let i = 15; i >= 0; i--) {
      const src      = lcdchr[size * 16 + i];
      const destChar = 2 * size + (i >> 3);    // 2*size + i/8
      const destCol  = 2 * (i & 7);            // 2*(i%8)
      lcdchr[destChar * 16 + destCol]     = src >> 4;
      lcdchr[destChar * 16 + destCol + 1] = src & 0xF;
    }
  }
}
