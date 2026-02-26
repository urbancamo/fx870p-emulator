// Test harness for FX-870P emulator - runs headlessly in Node.js.
//
// Replicates the essential boot and run logic from emulator.ts without
// importing it (that file has window/requestAnimationFrame references
// at module top level that crash in Node.js).
//
// All emulator core modules (def, cpu, exec, lcd, port, comm, keyboard)
// are pure computation and work fine in Node.js.

import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  OscFreq,
  CpuStop, CpuSleep, SW_bit,
  setCpuStop,
  setAcycles, acycles,
  memdef,
  tm, setTm,
  ky, ie, ia,
  setFlag, setKy,
  VDD2_bit, CLK_bit,
  INT1_bit, INT2_bit, ONINT_bit, KEYPULSE_bit, MINTIMER_bit,
  delayed_ky, setDelayedKy,
  setIfl,
  setPcMonitor,
  cpuWakeUp,
} from '../src/emulator/def.js';
import { cpuReset, cpuRun } from '../src/emulator/cpu.js';
import { ioInit, SerialRate, onSerialTick } from '../src/emulator/port.js';
import { lcdInit, lcdRender, lcdimage, lcdmem, lcdchr, initCharset, onrate, lcdctrl } from '../src/emulator/lcd.js';
import { commDecTimer } from '../src/emulator/comm.js';
import { setKeyCode2, setKeyCode2b, readKy } from '../src/emulator/keyboard.js';

// --- ROM loading from disk ---

const ROMS_DIR = path.resolve(import.meta.dirname!, '..', 'public', 'roms');

export function loadRomsFromDisk(): void {
  for (const m of memdef) {
    if (!m.filename) continue;
    const romPath = path.join(ROMS_DIR, m.filename);
    if (fs.existsSync(romPath)) {
      m.data = new Uint8Array(fs.readFileSync(romPath));
    } else if (m.required) {
      throw new Error(`Required ROM file not found: ${romPath}`);
    }
  }
  // Writable regions not loaded get initialised to 0xFF
  for (const m of memdef) {
    if (m.writable && !m.data) {
      m.data = new Uint8Array(m.last - m.first).fill(0xFF);
    }
  }
  // Load charset
  const charsetPath = path.join(ROMS_DIR, 'charset.bin');
  if (fs.existsSync(charsetPath)) {
    initCharset(new Uint8Array(fs.readFileSync(charsetPath)));
  }
}

// --- cycle-based counters (mirror emulator.ts) ---

let onCounter = 0;
let pulseCounter = 0;
let serialCounter = 0;
let secondCycles = 0;

// --- stepOnce: execute one instruction + handle all interrupts ---

export function stepOnce(): number {
  if (CpuStop) return 0;

  const x = cpuRun();
  setAcycles(acycles - x);

  // INT1 - edge triggered on KY bit 11
  if (((ky ^ delayed_ky) & 0x0800) !== 0 &&
      ((ky & 0x0800) === 0) === ((ie & 0x02) === 0)) {
    setIfl(INT1_bit);
  }
  setDelayedKy(ky);

  // INT2 - level triggered on KY bit 10
  if (((ky & 0x0400) === 0) === ((ie & 0x01) === 0)) {
    setIfl(INT2_bit);
  }

  // ON pulse interrupt
  if ((lcdctrl & (VDD2_bit | CLK_bit)) === (VDD2_bit | CLK_bit)) {
    onCounter -= x;
    if (onCounter < 0) {
      onCounter += onrate;
      if (onCounter < 0) onCounter = onrate;
      setKy(ky ^ 0x0200);
      if ((ky & 0x0200) === 0) setIfl(ONINT_bit);
    }
  }

  // KEY/Pulse interrupt
  const pulseHz = (ia & 0x40) === 0 ? 256 : 1;
  pulseCounter -= x * pulseHz;
  if (pulseCounter < 0) {
    pulseCounter += OscFreq * 1000;
    if (pulseCounter < 0) pulseCounter = OscFreq * 1000;
    if ((ia & 0x80) === 0) setIfl(KEYPULSE_bit);
  }

  // Serial tick
  serialCounter -= x;
  if (serialCounter < 0) {
    serialCounter += SerialRate;
    if (serialCounter < 0) serialCounter = SerialRate;
    onSerialTick();
  }

  // Comm char-delay timer
  commDecTimer(x);

  // One-second tick -> TM register
  secondCycles += x;
  if (secondCycles >= OscFreq * 1000) {
    secondCycles -= OscFreq * 1000;
    let newTm = (tm + 1) & 0xFF;
    setTm(newTm);
    if ((newTm & 0x3F) === 60) {
      setTm((newTm + 4) & 0xFF);
      if (!CpuStop) setIfl(MINTIMER_bit);
    }
  }

  return x;
}

// --- runCycles: run N cycles ---

export function runCycles(n: number): number {
  let total = 0;
  while (total < n && !CpuStop) {
    total += stepOnce();
  }
  return total;
}

// --- runUntil: run until predicate or budget exhausted ---

export function runUntil(pred: () => boolean, maxCycles: number): number {
  let total = 0;
  while (total < maxCycles && !CpuStop) {
    total += stepOnce();
    if (pred()) break;
  }
  return total;
}

// --- boot: cold boot and auto-wake ---

export function boot(): void {
  loadRomsFromDisk();

  // Wipe RAM to 0xFF (cold start)
  for (const m of memdef) {
    if (m.writable && m.data) m.data.fill(0xFF);
  }

  cpuReset();
  ioInit();
  lcdInit();
  onCounter = 0;
  pulseCounter = 0;
  serialCounter = 0;
  secondCycles = 0;
  setFlag(SW_bit);
  setCpuStop(false);

  // Run until APO sleep (ROM does a cold-start APO sleep immediately)
  // Budget: 5M cycles (~5.4 seconds at 921 kHz)
  let ran = 0;
  const BOOT_BUDGET = 5_000_000;
  while (ran < BOOT_BUDGET && !CpuSleep) {
    ran += stepOnce();
  }

  // Auto-wake (simulates pressing ON after APO sleep)
  if (CpuSleep) {
    cpuWakeUp(false);
    setCpuStop(false);
  }

  // Run until idle (LCD showing prompt). Budget: 3M more cycles.
  const WAKE_BUDGET = 3_000_000;
  let ran2 = 0;
  while (ran2 < WAKE_BUDGET && !CpuSleep) {
    ran2 += stepOnce();
  }

  // Wake again if it slept a second time
  if (CpuSleep) {
    cpuWakeUp(false);
    setCpuStop(false);
  }
}

// --- key code table (from KeyboardOverlay.vue) ---

const RED_S = 13;

const KEY_MAP: Record<string, number> = {
  'a': 14, 'A': 14, 's': 15, 'S': 15, 'd': 16, 'D': 16,
  'f': 17, 'F': 17, 'g': 18, 'G': 18, 'h': 19, 'H': 19,
  'j': 20, 'J': 20, 'k': 21, 'K': 21, 'l': 22, 'L': 22,
  'q': 24, 'Q': 24, 'w': 25, 'W': 25, 'e': 26, 'E': 26,
  'r': 27, 'R': 27, 't': 28, 'T': 28, 'y': 29, 'Y': 29,
  'u': 30, 'U': 30, 'i': 31, 'I': 31, 'o': 32, 'O': 32,
  'p': 33, 'P': 33,
  'z': 35, 'Z': 35, 'x': 36, 'X': 36, 'c': 37, 'C': 37,
  'v': 38, 'V': 38, 'b': 39, 'B': 39, 'n': 40, 'N': 40,
  'm': 41, 'M': 41, ',': 42, '=': 43, ' ': 44,
  '(': 59, ')': 60, '^': 61,
  '7': 63, '8': 64, '9': 65,
  '4': 68, '5': 69, '6': 70, '*': 71, '/': 72,
  '1': 73, '2': 74, '3': 75, '+': 76, '-': 77,
  '0': 78, '.': 79,
};

const SHIFT_MAP: Record<string, [number, number]> = {
  '!': [RED_S, 24], '"': [RED_S, 25], '#': [RED_S, 26],
  '$': [RED_S, 27], '%': [RED_S, 28], '&': [RED_S, 29],
  "'": [RED_S, 30], '|': [RED_S, 32], '`': [RED_S, 33],
  '@': [RED_S, 14], '~': [RED_S, 15], '?': [RED_S, 16],
  '{': [RED_S, 17], '}': [RED_S, 18], '[': [RED_S, 19],
  ']': [RED_S, 20], '<': [RED_S, 21], '>': [RED_S, 22],
  ';': [RED_S, 42], ':': [RED_S, 43], '_': [RED_S, 44],
};

const EXE_CODE = 81;

// Function key codes (block 5, small keys upper-right)
// Row 1 (codes 45-50): F.COM, Fx, DEGR, ...
// Row 2 (codes 51-56): log, ln, hyp, sin, cos, tan
// Row 3 (codes 57-62): MR/Min, M+/M-, (, ), ^, ...
const FUNC_MAP: Record<string, number> = {
  'SIN': 54, 'COS': 55, 'TAN': 56,
  'LOG': 51, 'LN': 52, 'HYP': 53,
};

// KTAB from KeyboardOverlay
const KTAB = [0x0000, 0x0080, 0x00C0, 0xF0FF];

// --- pressKey: inject one keystroke ---

function fireKeyInterrupt(): void {
  if ((ia & 0x80) !== 0) {
    const ktabIdx = (ia >> 4) & 3;
    const mask = KTAB[ktabIdx] ?? 0;
    if ((readKy(ia & 0x0F) & mask) !== 0) {
      setIfl(KEYPULSE_bit);
    }
  }
}

export function pressKey(code: number, modifier: number = 0): void {
  // Press key
  setKeyCode2(code);
  setKeyCode2b(modifier);
  fireKeyInterrupt();

  // Hold for ~36k cycles (enough for the 256 Hz key-scan to see it)
  runCycles(36_000);

  // Release
  setKeyCode2(0);
  setKeyCode2b(0);

  // Gap before next key (~18k cycles)
  runCycles(18_000);
}

// --- typeString: map characters to key codes and press each ---

export function typeString(s: string): void {
  let i = 0;
  while (i < s.length) {
    // Try to match a function name (e.g. SIN, COS, TAN, LOG, LN, HYP)
    // On the real calculator, pressing the function key inserts "FUNC(" automatically
    let funcMatched = false;
    for (const [name, code] of Object.entries(FUNC_MAP)) {
      if (s.substring(i, i + name.length).toUpperCase() === name) {
        pressKey(code);
        i += name.length;
        funcMatched = true;
        break;
      }
    }
    if (funcMatched) continue;

    const ch = s[i];
    i++;
    const direct = KEY_MAP[ch];
    if (direct !== undefined) {
      pressKey(direct);
      continue;
    }
    const shifted = SHIFT_MAP[ch];
    if (shifted) {
      pressKey(shifted[1], shifted[0]);
      continue;
    }
    throw new Error(`No key mapping for character: '${ch}' (0x${ch.charCodeAt(0).toString(16)})`);
  }
}

// --- pressExe: press the EXE key ---

export function pressExe(): void {
  pressKey(EXE_CODE);
}

// --- LCD text decoding ---
// The ROM renders characters via Graphic Output (not Character Output), so
// matching against lcdchr entries doesn't work. Instead we match against an
// empirically-built font table recorded from ROM rendering.
// Each character occupies 10 data nibbles + 2 spacing zeros = 12-nibble stride.
// Layout: Row 0 = input line, Row 1 = result line (after EXE).
// We read from lcdmem directly to avoid cursor overlay corruption.

const CHAR_STRIDE = 12;
const CHAR_WIDTH = 10; // data nibbles per character
const MAX_CHARS = 16;  // 192 / 12 = 16

// Font table: 10-nibble patterns for each character, recorded from ROM output
const FONT_TABLE: [string, number[]][] = [
  ['0', [0x7, 0xC, 0x8, 0xA, 0x9, 0x2, 0xA, 0x2, 0x7, 0xC]],
  ['1', [0x0, 0x0, 0x4, 0x2, 0xF, 0xE, 0x0, 0x2, 0x0, 0x0]],
  ['2', [0x4, 0x2, 0x8, 0x6, 0x8, 0xA, 0x9, 0x2, 0x6, 0x2]],
  ['3', [0x8, 0x4, 0x8, 0x2, 0xA, 0x2, 0xD, 0x2, 0x8, 0xC]],
  ['4', [0x1, 0x8, 0x2, 0x8, 0x4, 0x8, 0xF, 0xE, 0x0, 0x8]],
  ['5', [0xE, 0x4, 0xA, 0x2, 0xA, 0x2, 0xA, 0x2, 0x9, 0xC]],
  ['6', [0x3, 0xC, 0x5, 0x2, 0x9, 0x2, 0x9, 0x2, 0x0, 0xC]],
  ['7', [0x8, 0x0, 0x8, 0xE, 0x9, 0x0, 0xA, 0x0, 0xC, 0x0]],
  ['8', [0x6, 0xC, 0x9, 0x2, 0x9, 0x2, 0x9, 0x2, 0x6, 0xC]],
  ['9', [0x6, 0x0, 0x9, 0x2, 0x9, 0x2, 0x9, 0x4, 0x7, 0x8]],
  ['(', [0x0, 0x0, 0x3, 0x8, 0x4, 0x4, 0x8, 0x2, 0x0, 0x0]],
  [')', [0x0, 0x0, 0x8, 0x2, 0x4, 0x4, 0x3, 0x8, 0x0, 0x0]],
  ['+', [0x1, 0x0, 0x1, 0x0, 0x7, 0xC, 0x1, 0x0, 0x1, 0x0]],
  ['-', [0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x1, 0x0, 0x1, 0x0]],
  ['*', [0x2, 0x8, 0x1, 0x0, 0x7, 0xC, 0x1, 0x0, 0x2, 0x8]],
  ['/', [0x0, 0x4, 0x0, 0x8, 0x1, 0x0, 0x2, 0x0, 0x4, 0x0]],
  ['.', [0x0, 0x0, 0x0, 0x6, 0x0, 0x6, 0x0, 0x0, 0x0, 0x0]],
  [',', [0x0, 0x0, 0x0, 0x5, 0x0, 0x6, 0x0, 0x0, 0x0, 0x0]],
  ['=', [0x2, 0x8, 0x2, 0x8, 0x2, 0x8, 0x2, 0x8, 0x2, 0x8]],
  ['^', [0x2, 0x0, 0x4, 0x0, 0x8, 0x0, 0x4, 0x0, 0x2, 0x0]],
  // 'E' in scientific notation (different from keyboard 'E')
  ['E', [0xF, 0xE, 0x9, 0x2, 0x9, 0x2, 0x9, 0x2, 0x8, 0x2]],
  // Letter patterns captured from ROM rendering (Graphic Output)
  ['S', [0x6, 0x4, 0x9, 0x2, 0x9, 0x2, 0x9, 0x2, 0x4, 0xC]],
  ['I', [0x0, 0x0, 0x8, 0x2, 0xF, 0xE, 0x8, 0x2, 0x0, 0x0]],
  ['N', [0xF, 0xE, 0x2, 0x0, 0x1, 0x0, 0x0, 0x8, 0xF, 0xE]],
  ['n', [0x1, 0xE, 0x2, 0x0, 0x1, 0x0, 0x1, 0x0, 0x0, 0xE]],
  ['e', [0x1, 0xC, 0x2, 0xA, 0x2, 0xA, 0x2, 0xA, 0x1, 0x8]],
  ['r', [0x3, 0xE, 0x1, 0x0, 0x2, 0x0, 0x2, 0x0, 0x1, 0x0]],
  ['o', [0x1, 0xC, 0x2, 0x2, 0x2, 0x2, 0x2, 0x2, 0x1, 0xC]],
  ['F', [0xF, 0xE, 0x9, 0x0, 0x9, 0x0, 0x9, 0x0, 0x8, 0x0]],
  ['C', [0x7, 0xC, 0x8, 0x2, 0x8, 0x2, 0x8, 0x2, 0x4, 0x4]],
];

function matchFontChar(base: number): string {
  for (const [ch, pat] of FONT_TABLE) {
    let match = true;
    for (let i = 0; i < CHAR_WIDTH; i++) {
      if (lcdmem[base + i] !== pat[i]) { match = false; break; }
    }
    if (match) return ch;
  }
  // Check if all zeros = space
  let allZero = true;
  for (let i = 0; i < CHAR_WIDTH; i++) {
    if (lcdmem[base + i] !== 0) { allZero = false; break; }
  }
  return allZero ? ' ' : '?';
}

// Read a single LCD row (0-3) as text
export function readLcdRow(row: number): string {
  const base = row * 192;
  let result = '';
  for (let ci = 0; ci < MAX_CHARS; ci++) {
    result += matchFontChar(base + ci * CHAR_STRIDE);
  }
  return result.trimEnd();
}

// Read LCD "line" (0 = input on row 0, 1 = result on row 1)
export function readLcdLine(lineNo: number): string {
  return readLcdRow(lineNo);
}

// --- PC tracker for hang diagnosis ---

const PC_RING_SIZE = 64;
const pcRing = new Uint16Array(PC_RING_SIZE);
let pcRingIdx = 0;

export function installPcTracker(): void {
  pcRingIdx = 0;
  pcRing.fill(0);
  setPcMonitor((tracePC) => {
    pcRing[pcRingIdx % PC_RING_SIZE] = tracePC;
    pcRingIdx++;
  });
}

export function removePcTracker(): void {
  setPcMonitor(null);
}

export function getPcRing(): number[] {
  const result: number[] = [];
  const start = pcRingIdx >= PC_RING_SIZE ? pcRingIdx - PC_RING_SIZE : 0;
  for (let i = start; i < pcRingIdx; i++) {
    result.push(pcRing[i % PC_RING_SIZE]);
  }
  return result;
}

// Get the most frequently visited PCs from the ring (for hang diagnosis)
export function getTopPCs(n: number = 10): Array<{ pc: number; count: number; hex: string }> {
  const counts = new Map<number, number>();
  const ring = getPcRing();
  for (const p of ring) {
    counts.set(p, (counts.get(p) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([addr, count]) => ({ pc: addr, count, hex: `0x${addr.toString(16).padStart(4, '0')}` }));
}
