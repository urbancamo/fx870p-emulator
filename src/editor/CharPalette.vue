<!-- src/editor/CharPalette.vue -->
<!--
  Compact character palette for inserting Casio special characters
  into the BASIC editor. Displays Unicode equivalents of the FX-870P's
  extended character set (0x80-0xFF), organized by category.
-->
<script setup lang="ts">
import { ref } from 'vue';
import { casioToUnicode } from '../emulator/casio-ascii.js';

const emit = defineEmits<{
  insert: [char: string];
}>();

const activeTab = ref<'sym' | 'kana'>('sym');

// Build character groups from the Casio ASCII table.
// Each entry is { char: unicode string, hex: display label, byte: casio byte value }
interface CharEntry {
  char: string;
  hex: string;
  byte: number;
}

function entries(start: number, end: number): CharEntry[] {
  const out: CharEntry[] = [];
  for (let b = start; b <= end; b++) {
    out.push({ char: casioToUnicode(b), hex: b.toString(16).toUpperCase(), byte: b });
  }
  return out;
}

// ── Symbol tab groups ────────────────────────────────────────────────────────

const groups = [
  { label: 'Greek',
    chars: entries(0x88, 0x8F).concat(
      [{ char: casioToUnicode(0xE7), hex: 'E7', byte: 0xE7 }],  // π
      [{ char: casioToUnicode(0x85), hex: '85', byte: 0x85 }],   // Ω
    ) },
  { label: 'Math',
    chars: [0x80, 0x81, 0x82, 0x84, 0xE0, 0xE1, 0xE2, 0xF9, 0xFA, 0xF0, 0x9F].map(
      b => ({ char: casioToUnicode(b), hex: b.toString(16).toUpperCase(), byte: b })
    ) },  // Å ∫ √ ∑ ≥ ≤ ≠ ± ∓ × ÷
  { label: 'Super',
    chars: entries(0x90, 0x9E) },  // ⁰-⁹ ⁺ ⁻ ⁿ ﹪ ⁻¹
  { label: 'Arrows',
    chars: [0xE3, 0xE4, 0xE5, 0xE6].map(
      b => ({ char: casioToUnicode(b), hex: b.toString(16).toUpperCase(), byte: b })
    ) },
  { label: 'Shapes',
    chars: [0x86, 0x87, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEE].map(
      b => ({ char: casioToUnicode(b), hex: b.toString(16).toUpperCase(), byte: b })
    ) },  // ▒ █ ♠ ♥ ♣ ♦ ◻ ▢ △
  { label: 'Currency',
    chars: [0xF7, 0xF8, 0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xEF].map(
      b => ({ char: casioToUnicode(b), hex: b.toString(16).toUpperCase(), byte: b })
    ) },  // £ ¢ 円 ⽜ ⽉ 日 千 万 \
  { label: 'Misc',
    chars: [0x83, 0xA0, 0xFB, 0xFC, 0xFD, 0xFE, 0xFF].map(
      b => ({ char: casioToUnicode(b), hex: b.toString(16).toUpperCase(), byte: b })
    ) },  // ' ␣ ₀ ➀-➃
];

// ── Katakana tab ─────────────────────────────────────────────────────────────

const kanaGroups = [
  { label: '句読',
    chars: entries(0xA0, 0xA5) },
  { label: '小書',
    chars: entries(0xA6, 0xAF) },
  { label: 'カナ',
    chars: entries(0xB0, 0xDD) },
  { label: '濁点',
    chars: entries(0xDE, 0xDF) },
];

function onClick(entry: CharEntry): void {
  emit('insert', entry.char);
}
</script>

<template>
  <div class="char-palette">
    <div class="palette-tabs">
      <button class="palette-tab" :class="{ active: activeTab === 'sym' }"
              @click="activeTab = 'sym'">SYM</button>
      <button class="palette-tab" :class="{ active: activeTab === 'kana' }"
              @click="activeTab = 'kana'">カナ</button>
    </div>
    <div class="palette-body">
      <template v-if="activeTab === 'sym'">
        <div v-for="group in groups" :key="group.label" class="char-group">
          <span class="group-label">{{ group.label }}</span>
          <button v-for="entry in group.chars" :key="entry.byte"
                  class="char-btn" :title="'0x' + entry.hex"
                  @click="onClick(entry)">{{ entry.char }}</button>
        </div>
      </template>
      <template v-else>
        <div v-for="group in kanaGroups" :key="group.label" class="char-group">
          <span class="group-label">{{ group.label }}</span>
          <button v-for="entry in group.chars" :key="entry.byte"
                  class="char-btn" :title="'0x' + entry.hex"
                  @click="onClick(entry)">{{ entry.char }}</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.char-palette {
  background: #0d0d0d;
  border-bottom: 1px solid #222;
  font-family: "Consolas", "Menlo", "Monaco", "Courier New", monospace;
  font-size: 0.72rem;
}

.palette-tabs {
  display: flex;
  gap: 0;
  padding: 0 10px;
  border-bottom: 1px solid #1a1a1a;
}

.palette-tab {
  padding: 2px 10px;
  font-family: monospace;
  font-size: 0.65rem;
  background: transparent;
  color: #555;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.palette-tab:hover { color: #999; }
.palette-tab.active {
  color: #d2a8ff;
  border-bottom-color: #d2a8ff;
}

.palette-body {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
  padding: 4px 10px 6px;
  align-items: flex-start;
}

.char-group {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-wrap: wrap;
}

.group-label {
  color: #444;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 2px;
  user-select: none;
  flex-shrink: 0;
}

.char-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  font-family: "Consolas", "Menlo", "Monaco", "Courier New", monospace;
  font-size: 0.75rem;
  line-height: 1;
  background: #1a1a1a;
  color: #ccc;
  border: 1px solid #222;
  border-radius: 2px;
  cursor: pointer;
  flex-shrink: 0;
}
.char-btn:hover {
  background: #2a2a3a;
  border-color: #555;
  color: #fff;
}
.char-btn:active {
  background: #3a3a5a;
}
</style>
