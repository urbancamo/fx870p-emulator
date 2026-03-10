<!-- src/components/BasicListPanel.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { readBasicPrograms, type BasicProgram } from '../emulator/detokenize.js';

const programs = ref<BasicProgram[]>([]);
const live = ref(true);
let pollId: ReturnType<typeof setInterval> | null = null;

function refresh(): void {
  programs.value = readBasicPrograms();
}

function toggleLive(): void {
  live.value = !live.value;
  if (live.value) {
    refresh();
    pollId = setInterval(refresh, 1000);
  } else if (pollId !== null) {
    clearInterval(pollId);
    pollId = null;
  }
}

onMounted(() => {
  refresh();
  pollId = setInterval(refresh, 1000);
});

onUnmounted(() => {
  if (pollId !== null) clearInterval(pollId);
});
</script>

<template>
  <div class="basic-panel">
    <div class="basic-header">
      <span class="basic-title">BASIC</span>
      <button class="btn" :class="{ active: live }" @click="toggleLive">
        {{ live ? 'LIVE' : 'FROZEN' }}
      </button>
      <button class="btn" @click="refresh">REFRESH</button>
    </div>
    <div class="basic-listing">
      <template v-if="programs.length === 0">
        <span class="empty">(no programs in memory)</span>
      </template>
      <template v-for="prog in programs" :key="prog.slot">
        <div class="slot-header">P{{ prog.slot }}</div>
        <div v-for="line in prog.lines" :key="line.num" class="basic-line">
          <span class="line-num">{{ line.num }}</span>
          <span class="line-text"> {{ line.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.basic-panel {
  display: flex;
  flex-direction: column;
  background: #111;
  border-top: 1px solid #333;
  font-family: monospace;
  font-size: 0.72rem;
}

.basic-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-bottom: 1px solid #222;
}

.basic-title {
  color: #9ecbff;
  font-weight: bold;
  margin-right: auto;
}

.btn {
  padding: 1px 6px;
  font-family: monospace;
  font-size: 0.7rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}
.btn:hover { background: #3a3a3a; color: #fff; }
.btn.active { color: #8bc34a; border-color: #3a5a20; background: #1a2a10; }

.basic-listing {
  max-height: 350px;
  overflow-y: auto;
  padding: 4px 10px;
  background: #0a0a0a;
  line-height: 1.4;
}

.slot-header {
  color: #f0a030;
  font-weight: bold;
  margin-top: 4px;
  margin-bottom: 2px;
}
.slot-header:first-child { margin-top: 0; }

.basic-line {
  white-space: pre;
  color: #ccc;
}

.line-num {
  color: #777;
}

.line-text {
  color: #ccc;
}

.empty {
  color: #444;
  font-style: italic;
}
</style>
