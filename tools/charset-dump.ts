#!/usr/bin/env npx tsx
// Extracts characters from the ROM1 font table and generates a markdown file
// showing each character code with a bitmap representation.
//
// The ROM stores character bitmaps in ROM1 at offset 0x10000 (Japanese)
// or 0x10540 (English), 6 bytes per character, indexed by (code - 0x20).
// Each byte is one column, bit 7 = top pixel, bit 0 = bottom pixel.
//
// Usage: npx tsx tools/charset-dump.ts > docs/charset.md

import { readFileSync } from 'fs';

const rom1 = new Uint8Array(readFileSync('public/roms/rom1.bin'));

const JP_FONT = 0x10000;
const FONT_BASE = JP_FONT;

const ON = '\u2588';   // █ Full block
const OFF = '\u2591';  // ░ Light shade

function renderChar(code: number): string[] {
  const lines: string[] = [];

  if (code < 0x20 || code > 0xFB) {
    for (let row = 0; row < 8; row++) lines.push(OFF.repeat(6));
    return lines;
  }

  const offset = FONT_BASE + (code - 0x20) * 6;
  for (let row = 0; row < 8; row++) {
    let line = '';
    for (let col = 0; col < 6; col++) {
      const byte = rom1[offset + col] ?? 0;
      const bit = 7 - row;
      line += (byte & (1 << bit)) ? ON : OFF;
    }
    lines.push(line);
  }
  return lines;
}

// Generate markdown
const out: string[] = [];
out.push('# FX-870P Character Set');
out.push('');
out.push('Character bitmaps from ROM1 font table. Each character is 6 pixels wide by 8 pixels tall.');
out.push('Codes 0x20\u20130xFB are ROM font characters. 0x00\u20130x1F are control codes. 0xFC\u20130xFF are user-defined.');
out.push('');
out.push('- `\u2588` = pixel on');
out.push('- `\u2591` = pixel off');
out.push('');

for (let code = 0x20; code <= 0xFB; code++) {
  const hex = code.toString(16).padStart(2, '0').toUpperCase();
  let label = '';
  if (code >= 0x20 && code < 0x7F) {
    label = ` \`${String.fromCharCode(code)}\``;
  }
  out.push(`## 0x${hex} (${code})${label}`);
  out.push('');
  out.push('```');
  const lines = renderChar(code);
  for (const line of lines) {
    out.push(line);
  }
  out.push('```');
  out.push('');
}

process.stdout.write(out.join('\n'));
