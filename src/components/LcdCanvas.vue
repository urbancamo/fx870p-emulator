<script setup lang="ts">
// Renders the HD44352A01 LCD to a <canvas> element.
// The internal canvas is 394×64 px (matching Delphi's LcdBmp dimensions).
// Each LCD pixel is a 2×2 block; signs occupy X=0..11.
//
// Layout (matching Delphi's View procedure):
//   Bank 0: X=12..203, Y=0..63  (96 cols × 2 hc × 4 px/hc = 192 nibbles/row)
//   Bank 1: X=204..393, Y=0..63 (95 cols × 2 hc × 4 px/hc, padded to same)
//   Signs:  X=0..6, 5 indicators at Y=0,15,30,45,60

import { onMounted, onUnmounted, ref } from 'vue';
import { lcdimage, lcdctrl } from '../emulator/lcd.js';
import { setRenderCallback } from '../emulator/emulator.js';
import { VDD2_bit } from '../emulator/def.js';

// Canvas dimensions (internal resolution)
const LCD_W = 394;
const LCD_PAD_TOP = 2; // blank green rows above content
const LCD_H = 64 + LCD_PAD_TOP;

// Sign indicator nibble indices and their bitmasks (from Delphi)
const SIGN_IND  = [0x03BE, 0x047E, 0x053E, 0x053F, 0x05FF];
const SIGN_MASK = [4, 8, 8, 1, 2];

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let imageData: ImageData | null = null;
let pixels: Uint32Array | null = null;

// Pre-computed pixel colors as ABGR (ImageData is RGBA little-endian)
const PIXEL_ON  = 0xFF2a4218; // opaque dark green ABGR
const PIXEL_OFF = 0xFF5caa8b; // opaque light green ABGR

function setPixel2x2(px: Uint32Array, x: number, y: number, color: number): void {
  const idx = y * LCD_W + x;
  px[idx]           = color;
  px[idx + 1]       = color;
  px[idx + LCD_W]   = color;
  px[idx + LCD_W + 1] = color;
}

function render(): void {
  if (!ctx || !imageData || !pixels) return;

  const powered = (lcdctrl & VDD2_bit) !== 0;
  const bg = powered ? PIXEL_OFF : 0xFF909090; // grey when off

  // Clear to background
  pixels.fill(bg);

  if (!powered) {
    ctx.putImageData(imageData, 0, 0);
    return;
  }

  // Draw LCD pixel matrix (mirrors Delphi's View procedure loop)
  let index = 0;
  let startX = 12;

  for (let bank = 0; bank < 2; bank++) {
    let x = startX;
    let y = LCD_PAD_TOP;
    const cols = 96 - bank;

    for (let row = 0; row < 4; row++) {
      x = startX;
      for (let col = 0; col < cols; col++) {
        for (let hc = 0; hc < 2; hc++) {
          let nibble = lcdimage[index] ?? 0;
          let py = y + hc * 8;
          for (let pixel = 0; pixel < 4; pixel++) {
            const color = (nibble & 0x8) !== 0 ? PIXEL_ON : PIXEL_OFF;
            setPixel2x2(pixels, x, py, color);
            nibble = (nibble << 1) & 0xFF;
            py += 2;
          }
          index++;
        }
        x += 2;
      }
      y += 16;
      index += 2 * bank; // skip padding nibbles in bank 1
    }

    startX += (96 - bank) * 2; // bank 1 starts at X=192+12=204
    // Y stays at 0 (Dec Y, 64 in Delphi)
  }

  // Draw sign indicators (5 status dots at left edge)
  for (let s = 0; s < 5; s++) {
    const idx  = SIGN_IND[s] ?? 0;
    const mask = SIGN_MASK[s] ?? 0;
    const on   = ((lcdimage[idx] ?? 0) & mask) !== 0;
    const color = on ? PIXEL_ON : PIXEL_OFF;
    const sy = LCD_PAD_TOP + s * 13; // spread vertically
    for (let dy = 0; dy < 4; dy++) {
      for (let dx = 0; dx < 7; dx++) {
        pixels[(sy + dy) * LCD_W + dx] = color;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width  = LCD_W;
  canvas.height = LCD_H;
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  imageData = ctx.createImageData(LCD_W, LCD_H);
  pixels    = new Uint32Array(imageData.data.buffer);
  render();
  setRenderCallback(render);
});

onUnmounted(() => {
  setRenderCallback(() => {});
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="lcd-canvas"
    :width="394"
    :height="66"
  />
</template>

<style scoped>
.lcd-canvas {
  image-rendering: pixelated;
  width: 394px;
  height: 66px;
}
</style>
