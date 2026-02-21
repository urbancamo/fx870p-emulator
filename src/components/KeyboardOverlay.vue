<script setup lang="ts">
// Transparent overlay over the face image that handles mouse clicks
// and keyboard events to set keyCode1 / keyCode2.
// Coordinates are in face.png pixel space (709×280).

import { onMounted, onUnmounted } from 'vue';
import {
  keypad, KEYPADS, LASTKEYCODE,
  setKeyCode1, setKeyCode2, keyCode1,
} from '../emulator/keyboard.js';
import { ia, setIfl } from '../emulator/def.js';
import { KEYPULSE_bit } from '../emulator/def.js';

// face.png dimensions
const FACE_W = 709;
const FACE_H = 280;

// PC keyboard → calculator keyCode2 mapping (from Delphi FormKeyDown)
const KEY_MAP: Record<string, number> = {
  'PageDown': 3,   // CAPS
  'PageUp': 13,    // red S
  'Escape': 67,    // BRK
  'Backspace': 66, // BS
  'Insert': 12,    // INS
  'Enter': 81,     // EXE
  'ArrowLeft': 10, // ←
  'ArrowRight': 11,// →
  'ArrowUp': 8,    // ↑
  'ArrowDown': 9,  // ↓
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

function onMouseDown(e: MouseEvent): void {
  if (e.button !== 0) return;
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  // Map click to face.png coordinates
  const fx = Math.round((e.clientX - rect.left) * FACE_W / rect.width);
  const fy = Math.round((e.clientY - rect.top)  * FACE_H / rect.height);
  const k  = hitTest(fx, fy);
  setKeyCode1(k <= LASTKEYCODE ? k : 0);
  if (keyCode1 > 0 && keyCode1 <= LASTKEYCODE - 2) keyInterrupt();
}

function onMouseUp(): void {
  setKeyCode1(0);
}

function onMouseMove(e: MouseEvent): void {
  if (keyCode1 === 0) return;
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const fx = Math.round((e.clientX - rect.left) * FACE_W / rect.width);
  const fy = Math.round((e.clientY - rect.top)  * FACE_H / rect.height);
  // Release key if mouse moved off it (simplified: release on any move outside key)
  const k = hitTest(fx, fy);
  if (k !== keyCode1) setKeyCode1(0);
}

function onKeyDown(e: KeyboardEvent): void {
  const code = KEY_MAP[e.key];
  if (code !== undefined) {
    e.preventDefault();
    setKeyCode2(code);
    keyInterrupt();
  }
  // F9 = reset handled by EmulatorView
}

function onKeyUp(e: KeyboardEvent): void {
  if (KEY_MAP[e.key] !== undefined) setKeyCode2(0);
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
});

onUnmounted(() => {
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
  />
</template>

<style scoped>
.keyboard-overlay {
  position: absolute;
  inset: 0;
  cursor: pointer;
  user-select: none;
}
</style>
