<script setup lang="ts">
// Top-level orchestrator component.
// Loads ROMs, starts the emulator, and composes:
//   face.png → LcdCanvas (at x=48,y=36) → KeyboardOverlay

import { ref, computed, onMounted, onUnmounted } from 'vue';

const base = import.meta.env.BASE_URL;

// ─── responsive scaling ─────────────────────────────────────────────────────
// The face image is 709×280 px. We scale the entire emulator column to fill
// the viewport width with a small border, keeping the aspect ratio intact.
const FACE_W = 709;
const BORDER_PX = 24; // padding each side
const windowWidth = ref(window.innerWidth);
function onResize() { windowWidth.value = window.innerWidth; }
const SIDE_PANEL_W = 709; // CommPanel / DebugPanel natural width
const scaleFactor = computed(() => {
  let available = windowWidth.value - BORDER_PX * 2;
  // In side layout, reserve space for the panel
  if (panelLayout.value !== 'bottom') {
    available -= SIDE_PANEL_W;
  }
  return Math.max(0.25, Math.min(available / FACE_W, 4));
});

// Pick the sharpest face image that won't be upscaled.
// face.png = 709px (1×), face-large.png = 1418px (2×), face-huge.png = 2836px (4×).
const faceImage = computed(() => {
  const rendered = FACE_W * scaleFactor.value;
  if (rendered > 1418) return `${base}images/face-huge.png`;
  if (rendered > 709)  return `${base}images/face-large.png`;
  return `${base}images/face.png`;
});
import {
  loadRoms, loadCharset,
  emulatorReset, emulatorStart, emulatorStop,
  saveState, restoreState,
  loadConfig, saveConfig,
} from '../emulator/emulator.js';
import LcdCanvas from './LcdCanvas.vue';
import KeyboardOverlay from './KeyboardOverlay.vue';
import CommPanel from './CommPanel.vue';
import DebugPanel from './DebugPanel.vue';
import { commInit } from '../emulator/comm.js';
import { setIoDebug, isIoDebug } from '../emulator/port.js';

const showDebug = ref(false);

// Panel layout: bottom (default), right, or left of calculator
type PanelLayout = 'bottom' | 'right' | 'left';
const LAYOUT_KEY = 'fx870p-panel-layout';
const panelLayout = ref<PanelLayout>(
  (localStorage.getItem(LAYOUT_KEY) as PanelLayout) || 'bottom'
);
function cycleLayout(): void {
  const order: PanelLayout[] = ['bottom', 'right', 'left'];
  const idx = order.indexOf(panelLayout.value);
  panelLayout.value = order[(idx + 1) % order.length]!;
  localStorage.setItem(LAYOUT_KEY, panelLayout.value);
}
// In side layout, the scaler wrapper must set explicit width/height to the
// scaled face dimensions, because CSS transform doesn't change layout size.
const FACE_H = 280;
const scalerWidth = computed(() => Math.round(FACE_W * scaleFactor.value));
const scalerHeight = computed(() => Math.round(FACE_H * scaleFactor.value));

const error    = ref<string | null>(null);
const loading  = ref(true);

async function init(): Promise<void> {
  commInit(); // ensures comm.ts registers its callbacks before the emulator starts
  loadConfig();
  try {
    await Promise.all([loadRoms(), loadCharset()]);
    await restoreState();
    emulatorReset();
    emulatorStart();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.key === 'F9') {
    e.preventDefault();
    emulatorReset();
  }
}

async function beforeUnload(): Promise<void> {
  saveConfig();
  await saveState();
}

onMounted(() => {
  // Expose debug toggle on window for browser console use:
  //   ioDebug(true)  — start tracing all I/O register reads/writes
  //   ioDebug(false) — stop tracing
  (window as unknown as Record<string, unknown>).ioDebug = setIoDebug;
  (window as unknown as Record<string, unknown>).ioDebugState = isIoDebug;
  init();
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('beforeunload', beforeUnload);
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  emulatorStop();
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('beforeunload', beforeUnload);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div class="emulator-root">
    <div v-if="loading" class="overlay-msg">Loading ROMs…</div>
    <div v-else-if="error" class="overlay-msg error">{{ error }}</div>

    <div
      class="emulator-layout"
      :class="{
        'layout-bottom': panelLayout === 'bottom',
        'layout-right':  panelLayout === 'right',
        'layout-left':   panelLayout === 'left',
      }"
    >
      <!-- Side panel (left) -->
      <div v-if="panelLayout === 'left'" class="side-panels">
        <CommPanel class="side-comm" />
        <div class="debug-toggle-row side-toggle">
          <button class="debug-toggle-btn" @click="cycleLayout" title="Cycle panel layout">{{ panelLayout }}</button>
          <button class="debug-toggle-btn" @click="showDebug = !showDebug">
            {{ showDebug ? 'Hide Debugger' : 'Debugger' }}
          </button>
        </div>
        <DebugPanel v-if="showDebug" class="side-debug" />
      </div>

      <!-- Calculator (always present, always scaled) -->
      <div
        v-if="panelLayout !== 'bottom'"
        class="scaler-sizer"
        :style="{ width: scalerWidth + 'px', height: scalerHeight + 'px' }"
      >
        <div
          class="emulator-scaler"
          :style="{ transform: `scale(${scaleFactor})` }"
        >
          <div class="face-container">
            <img
              :src="faceImage"
              alt="CASIO fx-870P"
              class="face-img"
              draggable="false"
            />
            <LcdCanvas class="lcd-overlay" />
            <KeyboardOverlay />
          </div>
        </div>
      </div>
      <div
        v-else
        class="emulator-scaler"
        :style="{ transform: `scale(${scaleFactor})` }"
      >
        <div class="face-container">
          <img
            :src="faceImage"
            alt="CASIO fx-870P"
            class="face-img"
            draggable="false"
          />
          <LcdCanvas class="lcd-overlay" />
          <KeyboardOverlay />
        </div>
        <CommPanel />
        <div class="debug-toggle-row">
          <button class="debug-toggle-btn" @click="cycleLayout" title="Cycle panel layout">{{ panelLayout }}</button>
          <button class="debug-toggle-btn" @click="showDebug = !showDebug">
            {{ showDebug ? 'Hide Debugger' : 'Debugger' }}
          </button>
        </div>
        <DebugPanel v-if="showDebug" />
      </div>

      <!-- Side panel (right) -->
      <div v-if="panelLayout === 'right'" class="side-panels">
        <CommPanel class="side-comm" />
        <div class="debug-toggle-row side-toggle">
          <button class="debug-toggle-btn" @click="cycleLayout" title="Cycle panel layout">{{ panelLayout }}</button>
          <button class="debug-toggle-btn" @click="showDebug = !showDebug">
            {{ showDebug ? 'Hide Debugger' : 'Debugger' }}
          </button>
        </div>
        <DebugPanel v-if="showDebug" class="side-debug" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.emulator-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #000;
  padding-top: 24px;
}

/* ── outer layout container ── */
.emulator-layout {
  display: flex;
  align-items: flex-start;
}
.layout-bottom {
  flex-direction: column;
  align-items: center;
}
.layout-right {
  flex-direction: row;
}
.layout-left {
  flex-direction: row;
}

.emulator-scaler {
  transform-origin: top center;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

/* Side layout: scale from top-left; the sizer wrapper handles positioning */
.layout-right .emulator-scaler,
.layout-left .emulator-scaler {
  transform-origin: top left;
}

/* Sizer wrapper: reserves the exact scaled dimensions in the flex layout */
.scaler-sizer {
  flex-shrink: 0;
  overflow: hidden;
}

/* Natural face dimensions: 709 × 280 px */
.face-container {
  position: relative;
  width: 709px;
  height: 280px;
  flex-shrink: 0;
  user-select: none;
}

.face-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  user-select: none;
}

/* LCD canvas sits at face.png pixel coords (48, 36) */
.lcd-overlay {
  position: absolute;
  left: 48px;
  top: 36px;
}

.overlay-msg {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 1rem;
  color: #ccc;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.overlay-msg.error {
  color: #f66;
}

/* ── toggle row (shared between bottom and side) ── */
.debug-toggle-row {
  width: 709px;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 2px 8px;
  background: #0d0d0d;
  border-top: 1px solid #1a1a1a;
  box-sizing: border-box;
}

.debug-toggle-btn {
  padding: 2px 10px;
  font-family: monospace;
  font-size: 0.72rem;
  background: #1e1e1e;
  color: #555;
  border: 1px solid #333;
  border-radius: 3px;
  cursor: pointer;
}
.debug-toggle-btn:hover { color: #999; background: #2a2a2a; }

/* ── side panels ── */
.side-panels {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-height: 100vh;
  overflow-y: auto;
}

.side-toggle {
  width: auto;
}
</style>
