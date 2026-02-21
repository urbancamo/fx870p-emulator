<script setup lang="ts">
// Top-level orchestrator component.
// Loads ROMs, starts the emulator, and composes:
//   face.png → LcdCanvas (at x=48,y=36) → KeyboardOverlay

import { ref, onMounted, onUnmounted } from 'vue';
import {
  loadRoms, loadCharset,
  emulatorReset, emulatorStart, emulatorStop,
  saveState, restoreState,
  loadConfig, saveConfig,
} from '../emulator/emulator.js';
import LcdCanvas from './LcdCanvas.vue';
import KeyboardOverlay from './KeyboardOverlay.vue';

const error    = ref<string | null>(null);
const loading  = ref(true);

async function init(): Promise<void> {
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
  init();
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('beforeunload', beforeUnload);
});

onUnmounted(() => {
  emulatorStop();
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('beforeunload', beforeUnload);
});
</script>

<template>
  <div class="emulator-root">
    <div v-if="loading" class="overlay-msg">Loading ROMs…</div>
    <div v-else-if="error" class="overlay-msg error">{{ error }}</div>

    <div class="face-container">
      <img
        src="/images/face.png"
        alt="CASIO fx-870P"
        class="face-img"
        draggable="false"
      />
      <!-- LCD canvas positioned at face.png pixel (48, 36) -->
      <LcdCanvas class="lcd-overlay" />
      <!-- Transparent keyboard hit-test overlay -->
      <KeyboardOverlay />
    </div>
  </div>
</template>

<style scoped>
.emulator-root {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #1a1a1a;
}

/* Natural face dimensions: 709 × 280 px */
.face-container {
  position: relative;
  width: 709px;
  height: 280px;
  flex-shrink: 0;
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
</style>
