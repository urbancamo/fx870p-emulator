#!/usr/bin/env npx tsx
// Generates a 16×16 HTML character table from the ROM1 font table,
// with hex digit row/column headers (like a classic ASCII table).
//
// The ROM stores character bitmaps in ROM1 at offset 0x10000 (Japanese)
// or 0x10540 (English), 6 bytes per character, indexed by (code - 0x20).
// Each byte is one column, bit 7 = top pixel, bit 0 = bottom pixel.
// Characters 0x00-0x1F are clamped to space. 0xFC-0xFF are user-defined.
//
// Usage: npx tsx tools/charset-table.ts > docs/charset-table.html

import { readFileSync } from 'fs';

const rom1 = new Uint8Array(readFileSync('public/roms/rom1.bin'));

// Font table offsets in rom1.bin (ROM1b segment, physical 0x20000+)
const JP_FONT = 0x10000;
const EN_FONT = 0x10540;
const FONT_BASE = JP_FONT; // use Japanese font by default

const ON = '\u2588';   // █
const OFF = '\u2591';  // ░

function renderChar(code: number): string[] {
  const lines: string[] = [];

  if (code < 0x20 || code > 0xFB) {
    // Control chars (0x00-0x1F) and user-defined (0xFC-0xFF): show blank
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

const hex = '0123456789ABCDEF';

const out: string[] = [];
out.push('<!DOCTYPE html>');
out.push('<html lang="en">');
out.push('<head>');
out.push('<meta charset="utf-8">');
out.push('<title>FX-870P Character Set</title>');
out.push('<style>');
out.push('body { background: #1a1a2e; color: #e0e0e0; font-family: system-ui, sans-serif; margin: 2rem; }');
out.push('h1 { text-align: center; color: #fff; margin-bottom: 0.25rem; }');
out.push('.subtitle { text-align: center; color: #888; margin-bottom: 1.5rem; font-size: 0.9rem; }');
out.push('table { border-collapse: collapse; margin: 0 auto; }');
out.push('th { font-family: "SF Mono", "Menlo", "Consolas", monospace; font-size: 14px; padding: 4px 6px; color: #8be; }');
out.push('td { border: 1px solid #333; padding: 3px; vertical-align: middle; text-align: center; }');
out.push('td:hover { border-color: #8be; }');
out.push('td.unused { opacity: 0.3; }');
out.push('pre { margin: 0; font-family: "SF Mono", "Menlo", "Consolas", monospace; font-size: 7px; line-height: 7px; letter-spacing: 0px; }');
out.push('.on { color: #1a3a18; }');
out.push('.off { color: #5caa8b; }');
out.push('.code { font-size: 8px; color: #888; margin-bottom: 1px; font-family: "SF Mono", "Menlo", "Consolas", monospace; }');
out.push('.cell { background: #5caa8b; border-radius: 2px; padding: 2px 3px; display: inline-block; }');
out.push('.chr { font-size: 7px; color: #aaa; margin-top: 1px; font-family: "SF Mono", "Menlo", "Consolas", monospace; user-select: all; cursor: text; }');
out.push('</style>');
out.push('</head>');
out.push('<body>');
out.push('<h1>FX-870P Character Set</h1>');
out.push('<p class="subtitle">220 characters from ROM1 font table &mdash; 6&times;8 pixel bitmaps &mdash; row = high nibble, column = low nibble</p>');
out.push('<p class="subtitle">Codes 0x00&ndash;0x1F = control characters (blank), 0x20&ndash;0xFB = ROM font, 0xFC&ndash;0xFF = user-defined (CGRAM)</p>');
out.push('<table>');

// Header row
out.push('<tr>');
out.push('<th></th>');
for (let c = 0; c < 16; c++) {
  out.push(`<th>_${hex[c]}</th>`);
}
out.push('</tr>');

// Data rows
for (let r = 0; r < 16; r++) {
  out.push('<tr>');
  out.push(`<th>${hex[r]}_</th>`);
  for (let c = 0; c < 16; c++) {
    const code = r * 16 + c;
    const lines = renderChar(code);
    const unused = code < 0x20 || code > 0xFB;

    const preLines = lines.map(line => {
      let s = '';
      for (const ch of line) {
        if (ch === ON) {
          s += `<span class="on">${ON}</span>`;
        } else {
          s += `<span class="off">${OFF}</span>`;
        }
      }
      return s;
    });

    const label = code >= 0x20 && code < 0x7F
      ? ` <b>${code === 0x3C ? '&lt;' : code === 0x3E ? '&gt;' : code === 0x26 ? '&amp;' : String.fromCharCode(code)}</b>`
      : '';

    const chrStr = `CHR$(${code})`;

    out.push(`<td${unused ? ' class="unused"' : ''}>`);
    out.push(`<div class="code">${code.toString(16).toUpperCase().padStart(2, '0')}${label}</div>`);
    out.push(`<div class="cell"><pre>${preLines.join('\n')}</pre></div>`);
    out.push(`<div class="chr">${chrStr}</div>`);
    out.push('</td>');
  }
  out.push('</tr>');
}

out.push('</table>');
out.push('</body>');
out.push('</html>');

process.stdout.write(out.join('\n'));
