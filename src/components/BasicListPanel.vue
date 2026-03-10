<!-- src/components/BasicListPanel.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { readBasicPrograms, debugFileTable, type BasicProgram } from '../emulator/detokenize.js';

const props = defineProps<{
  defchr?: string;
}>();

const programs = ref<BasicProgram[]>([]);
const debugInfo = ref('');
const showDebugDump = ref(false);
const activeTab = ref(0); // index into programs array
const live = ref(true);
let pollId: ReturnType<typeof setInterval> | null = null;

const activeProgram = computed(() => programs.value[activeTab.value] ?? null);

function refresh(): void {
  const prev = programs.value;
  programs.value = readBasicPrograms();
  // Keep activeTab in range; try to stay on the same slot
  if (programs.value.length === 0) {
    activeTab.value = 0;
  } else if (activeTab.value >= programs.value.length) {
    activeTab.value = programs.value.length - 1;
  } else if (prev.length > 0 && prev[activeTab.value]) {
    const prevSlot = prev[activeTab.value].slot;
    const idx = programs.value.findIndex(p => p.slot === prevSlot);
    if (idx >= 0) activeTab.value = idx;
  }
  if (showDebugDump.value) {
    debugInfo.value = debugFileTable();
  }
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

function toggleDebug(): void {
  showDebugDump.value = !showDebugDump.value;
  if (showDebugDump.value) {
    debugInfo.value = debugFileTable();
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
      <span class="basic-title">BASIC<span v-if="props.defchr" class="defchr-badge">{{ props.defchr }}</span></span>
      <button class="btn" :class="{ active: live }" @click="toggleLive">
        {{ live ? 'LIVE' : 'FROZEN' }}
      </button>
      <button class="btn" @click="refresh">REFRESH</button>
      <button class="btn" :class="{ active: showDebugDump }" @click="toggleDebug">HEX</button>
    </div>
    <div v-if="programs.length > 0" class="tab-bar">
      <button
        v-for="(prog, i) in programs"
        :key="prog.slot"
        class="tab"
        :class="{ active: i === activeTab }"
        @click="activeTab = i"
      >P{{ prog.slot }}</button>
    </div>
    <pre v-if="showDebugDump" class="debug-dump">{{ debugInfo }}</pre>
    <div class="basic-listing">
      <template v-if="programs.length === 0">
        <span class="empty">(no programs in memory)</span>
      </template>
      <template v-else-if="activeProgram">
        <div v-for="line in activeProgram.lines" :key="line.num" class="basic-line">
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
  text-align: left;
  width: 709px;
  box-sizing: border-box;
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

.defchr-badge {
  margin-left: 8px;
  padding: 1px 6px;
  font-size: 0.68rem;
  font-weight: normal;
  color: #f0c040;
  background: #1a1a0a;
  border: 1px solid #333;
  border-radius: 3px;
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

.tab-bar {
  display: flex;
  gap: 0;
  padding: 0 10px;
  background: #0d0d0d;
  border-bottom: 1px solid #222;
}

.tab {
  padding: 3px 10px;
  font-family: monospace;
  font-size: 0.7rem;
  background: transparent;
  color: #666;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.tab:hover { color: #aaa; }
.tab.active {
  color: #f0a030;
  border-bottom-color: #f0a030;
}

.debug-dump {
  padding: 4px 10px;
  background: #0a0a1a;
  border-bottom: 1px solid #222;
  color: #9ecbff;
  font-size: 0.65rem;
  line-height: 1.3;
  max-height: 200px;
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.basic-listing {
  max-height: 350px;
  overflow-y: auto;
  padding: 4px 10px;
  background: #0a0a0a;
  line-height: 1.4;
  text-align: left;
}

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
