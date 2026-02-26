<script setup lang="ts">
// Transparent overlay over the face image that handles mouse clicks
// and keyboard events to set keyCode1 / keyCode2.
// Coordinates are in face.png pixel space (709×280).

import { onMounted, onUnmounted } from 'vue';
import {
  keypad, KEYPADS, LASTKEYCODE,
  setKeyCode1, keyCode1,
  bufferKey, setKeyInterruptFn,
} from '../emulator/keyboard.js';
import { ia, setIfl } from '../emulator/def.js';
import { KEYPULSE_bit } from '../emulator/def.js';
import { cpuWakeUp } from '../emulator/cpu.js';

// ON/BRK key code — matches Delphi case 67 which calls CpuWakeUp(False) on release
const ON_KEY_CODE = 67;

// CAPS key code — toggles upper/lowercase on the calculator
const CAPS_KEY_CODE = 3;

// Mirror the FX-870P's CAPS state so we can auto-toggle before letter keys
let fxCapsLocked = false;
function noteCapsPress(): void { fxCapsLocked = !fxCapsLocked; }

// face.png dimensions
const FACE_W = 709;
const FACE_H = 280;

// PC keyboard → calculator keyCode2 mapping.
// Special keys from Delphi FormKeyDown (VK_ codes).
// Letter/symbol keys from Delphi FormKeyPress Letters string:
//   FIRST=14, COUNT=66: 'ASDFGHJKLaQWERTYUIOPaZXCVBNM,= aaaaaaaaaaaaaa()^a789aa456*/123+-0.'
//   'a' = no mapping (function/mode key with no printable equivalent).
//   UpCase applied in Delphi, so both 'a' and 'A' map to same calculator key.
const KEY_MAP: Record<string, number> = {
  // ── Special keys (Delphi FormKeyDown VK_ codes) ────────────────────────────
  'PageDown':   3,  // CAPS
  'PageUp':    13,  // red S (2nd / calculator Shift)
  'Escape':    67,  // BRK / ON
  'Backspace': 66,  // BS
  'Delete':    66,  // BS (convenience alias)
  'Insert':    12,  // INS
  'Enter':     81,  // EXE
  'ArrowLeft':  10, // ←
  'ArrowRight': 11, // →
  'ArrowUp':     8, // ↑
  'ArrowDown':   9, // ↓

  // ── A row (block 2 row 2, codes 14–22) ─────────────────────────────────────
  'a': 14, 'A': 14,
  's': 15, 'S': 15,
  'd': 16, 'D': 16,
  'f': 17, 'F': 17,
  'g': 18, 'G': 18,
  'h': 19, 'H': 19,
  'j': 20, 'J': 20,
  'k': 21, 'K': 21,
  'l': 22, 'L': 22,
  // code 23 = ANS — no printable PC key mapping

  // ── Q row (block 3, codes 24–33) ───────────────────────────────────────────
  'q': 24, 'Q': 24,
  'w': 25, 'W': 25,
  'e': 26, 'E': 26,
  'r': 27, 'R': 27,
  't': 28, 'T': 28,
  'y': 29, 'Y': 29,
  'u': 30, 'U': 30,
  'i': 31, 'I': 31,
  'o': 32, 'O': 32,
  'p': 33, 'P': 33,
  // code 34 = ENG — no printable PC key mapping

  // ── Z row (block 4, codes 35–44) ───────────────────────────────────────────
  'z': 35, 'Z': 35,
  'x': 36, 'X': 36,
  'c': 37, 'C': 37,
  'v': 38, 'V': 38,
  'b': 39, 'B': 39,
  'n': 40, 'N': 40,
  'm': 41, 'M': 41,
  ',': 42,           // comma key
  '=': 43,           // calculator key at Z-row position 9 (Delphi Letters[30]='=')
  ' ': 44,           // Space

  // ── Block 5 row 3 — punctuation keys (codes 59–61) ─────────────────────────
  '(': 59,           // Delphi Letters[46]='('
  ')': 60,           // Delphi Letters[47]=')'
  '^': 61,           // Delphi Letters[48]='^'

  // ── Block 6 — large numeric/arithmetic keys (codes 63–79) ──────────────────
  //   Row 1: 7(63) 8(64) 9(65) BS(66) BRK(67) — BS/BRK handled above
  '7': 63, '8': 64, '9': 65,
  //   Row 2: 4(68) 5(69) 6(70) *(71) /(72)
  '4': 68, '5': 69, '6': 70,
  '*': 71, '/': 72,
  //   Row 3: 1(73) 2(74) 3(75) +(76) -(77)
  '1': 73, '2': 74, '3': 75,
  '+': 76, '-': 77,
  //   Row 4: 0(78) .(79)
  '0': 78, '.': 79,
};

// PC shifted-symbol → [modifier code, base key code] pairs.
// These require two simultaneous calculator keys (red S code 13 + letter key).
// Shift-layer labels read from face.png red text above each key.
// Format: PC_char: [modifierKeyCode, baseKeyCode]
const RED_S = 13; // red S key code (calculator Shift)
// Confirmed shift-layer labels from face.png (user-verified):
//   Q:! W:" E:# R:$ T:% Y:& U:' I:¥ O:| P:`
//   A:@ S:~ D:? F:{ G:} H:[ J:] K:< L:>
//   ,:; =:: SPC:_
const SHIFT_MAP: Record<string, [number, number]> = {
  // ── Q row red-S functions ────────────────────────────────────────────────────
  '!':  [RED_S, 24],  // red S + Q
  '"':  [RED_S, 25],  // red S + W
  '#':  [RED_S, 26],  // red S + E
  '$':  [RED_S, 27],  // red S + R
  '%':  [RED_S, 28],  // red S + T
  '&':  [RED_S, 29],  // red S + Y
  "'":  [RED_S, 30],  // red S + U
  '¥':  [RED_S, 31],  // red S + I  (¥ only typeable on JP keyboards)
  '|':  [RED_S, 32],  // red S + O
  '`':  [RED_S, 33],  // red S + P  (backtick)

  // ── A row red-S functions ────────────────────────────────────────────────────
  '@':  [RED_S, 14],  // red S + A
  '~':  [RED_S, 15],  // red S + S
  '?':  [RED_S, 16],  // red S + D
  '{':  [RED_S, 17],  // red S + F
  '}':  [RED_S, 18],  // red S + G
  '[':  [RED_S, 19],  // red S + H
  ']':  [RED_S, 20],  // red S + J
  '<':  [RED_S, 21],  // red S + K
  '>':  [RED_S, 22],  // red S + L
  // ANS (code 23): shift = TAB — intentionally unmapped (breaks browser focus nav)

  // ── Z row red-S functions ────────────────────────────────────────────────────
  ';':  [RED_S, 42],  // red S + ,
  ':':  [RED_S, 43],  // red S + =
  '_':  [RED_S, 44],  // red S + SPC
};

// Table of interrupt-capable KY bits (from Delphi KeyInterrupt)
const KTAB = [0x0000, 0x0080, 0x00C0, 0xF0FF];

function keyInterrupt(): void {
  if ((ia & 0x80) !== 0) {
    const { readKy } = (await_readKy());
    const ktabIdx = (ia >> 4) & 3;
    const mask = KTAB[ktabIdx] ?? 0;
    if ((readKy(ia & 0x0F) & mask) !== 0) {
      setIfl(KEYPULSE_bit);
    }
  }
}

// Thin wrapper to access readKy without circular concern
import { readKy as _readKy } from '../emulator/keyboard.js';
function await_readKy() { return { readKy: _readKy }; }

// Hit-test a face.png coordinate against the keypad table.
// Returns key code (1-based) or 0 if no key hit.
function hitTest(x: number, y: number): number {
  let code = 1;
  for (let i = 0; i <= KEYPADS; i++) {
    const b = keypad[i];
    if (!b) break;
    if (x >= b.L && x < b.L + b.SX * b.col &&
        (x - b.L) % b.SX < b.W &&
        y >= b.T &&
        (y - b.T) % b.SY < b.H) {
      const c = Math.floor((x - b.L) / b.SX);
      const r = Math.floor((y - b.T) / b.SY);
      const k = b.col * r + c;
      if (k < b.cnt) {
        return code + k;
      }
    }
    code += b.cnt;
  }
  return 0; // no key hit
}

// Shared press/release logic for both mouse and touch
function pressAt(el: HTMLElement, clientX: number, clientY: number): void {
  const rect = el.getBoundingClientRect();
  const fx = Math.round((clientX - rect.left) * FACE_W / rect.width);
  const fy = Math.round((clientY - rect.top)  * FACE_H / rect.height);
  const k  = hitTest(fx, fy);
  setKeyCode1(k <= LASTKEYCODE ? k : 0);
  if (k === CAPS_KEY_CODE) noteCapsPress();
  if (keyCode1 > 0 && keyCode1 <= LASTKEYCODE - 2) keyInterrupt();
}

function releaseKey(): void {
  if (keyCode1 === ON_KEY_CODE) cpuWakeUp(false);
  setKeyCode1(0);
}

function onMouseDown(e: MouseEvent): void {
  if (e.button !== 0) return;
  pressAt(e.currentTarget as HTMLElement, e.clientX, e.clientY);
}

function onMouseUp(): void {
  releaseKey();
}

function onMouseMove(e: MouseEvent): void {
  if (keyCode1 === 0) return;
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const fx = Math.round((e.clientX - rect.left) * FACE_W / rect.width);
  const fy = Math.round((e.clientY - rect.top)  * FACE_H / rect.height);
  const k = hitTest(fx, fy);
  if (k !== keyCode1) setKeyCode1(0);
}

function onTouchStart(e: TouchEvent): void {
  e.preventDefault();
  const t = e.touches[0];
  if (t) pressAt(e.currentTarget as HTMLElement, t.clientX, t.clientY);
}

function onTouchEnd(e: TouchEvent): void {
  e.preventDefault();
  releaseKey();
}

function onTouchMove(e: TouchEvent): void {
  if (keyCode1 === 0) return;
  const t = e.touches[0];
  if (!t) return;
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const fx = Math.round((t.clientX - rect.left) * FACE_W / rect.width);
  const fy = Math.round((t.clientY - rect.top)  * FACE_H / rect.height);
  const k = hitTest(fx, fy);
  if (k !== keyCode1) setKeyCode1(0);
}


function isInputFocused(): boolean {
  const t = document.activeElement;
  if (!t) return false;
  const tag = (t as HTMLElement).tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || (t as HTMLElement).isContentEditable;
}

function onKeyDown(e: KeyboardEvent): void {
  if (isInputFocused()) return; // let the UI input handle it
  // Allow auto-repeat for backspace and cursor keys; ignore for everything else
  const REPEAT_KEYS = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  if (e.repeat && !REPEAT_KEYS.includes(e.key)) return;
  // Shift-combo keys (e.g. '"' → red S then W sequentially).
  // Buffer both the modifier and letter key — the buffer's hold/gap timing
  // ensures the ROM sees red S before the letter arrives.
  const combo = SHIFT_MAP[e.key];
  if (combo !== undefined) {
    e.preventDefault();
    bufferKey(combo[0], 0, true);  // red S press
    bufferKey(combo[1], 0, true);  // letter press
    return;
  }
  const code = KEY_MAP[e.key];
  if (code !== undefined) {
    e.preventDefault();
    // Auto-CAPS: if the PC letter case doesn't match the FX-870P CAPS state,
    // inject a CAPS press first so the ROM toggles before the letter arrives.
    const isLetter = e.key.length === 1 &&
      ((e.key >= 'A' && e.key <= 'Z') || (e.key >= 'a' && e.key <= 'z'));
    const wantCaps = isLetter && e.key >= 'A' && e.key <= 'Z';
    if (isLetter && wantCaps !== fxCapsLocked) {
      noteCapsPress();
      bufferKey(CAPS_KEY_CODE, 0, true);
      bufferKey(code, 0, true);
    } else {
      if (code === CAPS_KEY_CODE) noteCapsPress();
      bufferKey(code, 0, true);
    }
  }
  // F9 = reset handled by EmulatorView
}

function onKeyUp(e: KeyboardEvent): void {
  if (isInputFocused()) return;
  // Delphi: Escape → keycode 67 → CpuWakeUp(False) on key release
  if (KEY_MAP[e.key] === ON_KEY_CODE) cpuWakeUp(false);
  // Don't clear buffered keys on keyUp — the buffer manages hold/release timing.
  // Only clear if nothing is buffered (user is holding and releasing a single key slowly).
  // For fast typing the buffer handles everything via timed hold+gap cycles.
}

onMounted(() => {
  setKeyInterruptFn(keyInterrupt);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
});

onUnmounted(() => {
  setKeyInterruptFn(null);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
});
</script>

<template>
  <div
    class="keyboard-overlay"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @mouseleave="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @touchmove="onTouchMove"
  />
</template>

<style scoped>
.keyboard-overlay {
  position: absolute;
  inset: 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}
</style>
