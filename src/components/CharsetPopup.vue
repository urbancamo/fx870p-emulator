<script setup lang="ts">
// Displays a 16×16 character set table from the ROM1 font data.
// Each cell shows the 6×8 pixel bitmap, hex code, and CHR$(decimal).
// Clicking any cell opens a pixel editor with the DEFCHR$ command output.

import { ref, computed, reactive } from 'vue';
import { memdef } from '../emulator/def.js';
import { getOption2 } from '../emulator/emulator.js';

const emit = defineEmits<{ (e: 'close'): void }>();

// Font table offsets within rom1.bin (memdef[3] = full rom1.bin)
const JP_FONT = 0x10000;
const EN_FONT = 0x10540;

const hex = '0123456789ABCDEF';
const ON = '\u2588';
const OFF = '\u2591';

// Edited character bitmaps: code → rows string[] (saved when editor closes)
const editedRows = reactive<Record<number, string[]>>({});
// Reactivity trigger bumped whenever editorPixels changes
const editorTick = ref(0);

// ─── localStorage persistence for user-defined characters (252-255) ──────────
const LS_KEY = 'fx870p-userchars';

// Stored format: { "252": "AABBCCDDEE", "253": "...", ... }
// Each value is the 5 column bytes as a 10-char hex string (same as DEFCHR$).

function bytesToRows(bytes: number[]): string[] {
  const lines: string[] = [];
  for (let row = 0; row < 8; row++) {
    let line = '';
    for (let col = 0; col < 5; col++) {
      line += (bytes[col]! & (1 << (7 - row))) ? ON : OFF;
    }
    line += OFF;
    lines.push(line);
  }
  return lines;
}

function loadUserChars(): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Record<string, string>;
    for (const key of Object.keys(saved)) {
      const code = Number(key);
      if (code < 252 || code > 255) continue;
      const hexStr = saved[key]!;
      if (hexStr.length !== 10) continue;
      const bytes: number[] = [];
      for (let i = 0; i < 5; i++) {
        bytes.push(parseInt(hexStr.substring(i * 2, i * 2 + 2), 16));
      }
      editedRows[code] = bytesToRows(bytes);
    }
  } catch { /* ignore corrupt data */ }
}

function saveUserChar(code: number, columnBytes: number[]): void {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const saved: Record<string, string> = raw ? JSON.parse(raw) : {};
    saved[String(code)] = columnBytes
      .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      .join('');
    localStorage.setItem(LS_KEY, JSON.stringify(saved));
  } catch { /* ignore storage errors */ }
}

// Load saved user-defined characters on component init
loadUserChars();

interface CellData {
  code: number;
  hexStr: string;
  chrStr: string;
  asciiLabel: string;
  unused: boolean;
  userDefined: boolean;
  rows: string[];
}

// Build rows from the editor pixel grid (5 cols + blank 6th)
function rowsFromEditor(): string[] {
  const lines: string[] = [];
  for (let row = 0; row < 8; row++) {
    let line = '';
    for (let col = 0; col < 5; col++) {
      line += editorPixels[col]![row] ? ON : OFF;
    }
    line += OFF;
    lines.push(line);
  }
  return lines;
}

const cells = computed<CellData[]>(() => {
  // Access editorTick so this recomputes when the live editor changes
  void editorTick.value;
  const rom1b = memdef[3]?.data;
  const fontBase = getOption2() === 1 ? JP_FONT : EN_FONT;
  const result: CellData[] = [];

  for (let code = 0; code < 256; code++) {
    const unused = code < 0x20 || code > 0xFF;
    const userDefined = code >= 0xFC && code <= 0xFF;
    let rows: string[];

    // If this code is currently being edited, show live pixels
    if (code === editorCode.value) {
      rows = rowsFromEditor();
    } else if (editedRows[code]) {
      // Previously edited: use saved bitmap
      rows = editedRows[code]!;
    } else if ((unused && !userDefined) || !rom1b) {
      rows = [];
      for (let r = 0; r < 8; r++) rows.push(OFF.repeat(6));
    } else if (userDefined) {
      rows = [];
      for (let r = 0; r < 8; r++) rows.push(OFF.repeat(6));
    } else {
      rows = [];
      const offset = fontBase + (code - 0x20) * 6;
      for (let row = 0; row < 8; row++) {
        let line = '';
        for (let col = 0; col < 6; col++) {
          const byte = rom1b[offset + col] ?? 0;
          line += (byte & (1 << (7 - row))) ? ON : OFF;
        }
        rows.push(line);
      }
    }

    let asciiLabel = '';
    if (code >= 0x20 && code < 0x7F) {
      asciiLabel = String.fromCharCode(code);
    }

    result.push({
      code,
      hexStr: code.toString(16).toUpperCase().padStart(2, '0'),
      chrStr: `CHR$(${code})`,
      asciiLabel,
      unused: unused && !userDefined,
      userDefined,
      rows,
    });
  }
  return result;
});

function cell(r: number, c: number): CellData {
  return cells.value[r * 16 + c]!;
}

function onBackdrop(e: MouseEvent): void {
  if (e.target === e.currentTarget) emit('close');
}

// ─── character editor ─────────────────────────────────────────────────────────
const editorCode = ref<number | null>(null);
// 5 columns × 8 rows pixel grid (DEFCHR$ uses 5 columns; column 6 is spacing)
const editorPixels = reactive<boolean[][]>(
  Array.from({ length: 5 }, () => Array(8).fill(false)),
);

function openEditor(code: number): void {
  if (code < 0x20 && code > 0x1F) return; // skip control chars
  editorCode.value = code;

  // Load current character data into editor grid
  const rom1b = memdef[3]?.data;
  const fontBase = getOption2() === 1 ? JP_FONT : EN_FONT;

  // Try to load saved user-defined char from localStorage
  let savedBytes: number[] | null = null;
  if (code >= 0xFC) {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, string>;
        const hexStr = saved[String(code)];
        if (hexStr && hexStr.length === 10) {
          savedBytes = [];
          for (let i = 0; i < 5; i++) {
            savedBytes.push(parseInt(hexStr.substring(i * 2, i * 2 + 2), 16));
          }
        }
      }
    } catch { /* ignore */ }
  }

  for (let col = 0; col < 5; col++) {
    let byte = 0;
    if (savedBytes) {
      byte = savedBytes[col]!;
    } else if (code >= 0xFC) {
      byte = 0;
    } else if (code >= 0x20 && rom1b) {
      const offset = fontBase + (code - 0x20) * 6;
      byte = rom1b[offset + col] ?? 0;
    }
    for (let row = 0; row < 8; row++) {
      editorPixels[col]![row] = (byte & (1 << (7 - row))) !== 0;
    }
  }
}

function saveEditorToTable(): void {
  const code = editorCode.value;
  if (code === null) return;
  editedRows[code] = rowsFromEditor();
  // Persist user-defined characters to localStorage
  if (code >= 0xFC && code <= 0xFF) {
    const bytes: number[] = [];
    for (let col = 0; col < 5; col++) {
      let byte = 0;
      for (let row = 0; row < 8; row++) {
        if (editorPixels[col]![row]) byte |= (1 << (7 - row));
      }
      bytes.push(byte);
    }
    saveUserChar(code, bytes);
  }
}

function closeEditor(): void {
  saveEditorToTable();
  editorCode.value = null;
}

function bumpTick(): void {
  editorTick.value++;
}

function clearEditor(): void {
  for (let col = 0; col < 5; col++)
    for (let row = 0; row < 8; row++)
      editorPixels[col]![row] = false;
  bumpTick();
}

function invertEditor(): void {
  for (let col = 0; col < 5; col++)
    for (let row = 0; row < 8; row++)
      editorPixels[col]![row] = !editorPixels[col]![row];
  bumpTick();
}

// Compute column bytes from pixel grid
const editorColumnBytes = computed(() => {
  const bytes: number[] = [];
  for (let col = 0; col < 5; col++) {
    let byte = 0;
    for (let row = 0; row < 8; row++) {
      if (editorPixels[col]![row]) byte |= (1 << (7 - row));
    }
    bytes.push(byte);
  }
  return bytes;
});

// DEFCHR$ command string
const defchrString = computed(() => {
  const code = editorCode.value;
  if (code === null) return '';
  const hexStr = editorColumnBytes.value
    .map(b => b.toString(16).toUpperCase().padStart(2, '0'))
    .join('');
  return `DEFCHR$(${code})="${hexStr}"`;
});

// Also show a preview bitmap using the block characters
const editorPreview = computed(() => {
  const lines: string[] = [];
  for (let row = 0; row < 8; row++) {
    let line = '';
    for (let col = 0; col < 5; col++) {
      line += editorPixels[col]![row] ? ON : OFF;
    }
    line += OFF; // 6th column always off (spacing)
    lines.push(line);
  }
  return lines;
});

// Mouse drag state for painting
let painting = false;
let paintValue = true;

function onPixelDown(col: number, row: number, e: MouseEvent | TouchEvent): void {
  e.preventDefault();
  painting = true;
  paintValue = !editorPixels[col]![row];
  editorPixels[col]![row] = paintValue;
  bumpTick();
}

function onPixelEnter(col: number, row: number): void {
  if (painting) {
    editorPixels[col]![row] = paintValue;
    bumpTick();
  }
}

const copyFeedback = ref(false);

function copyDefchr(): void {
  navigator.clipboard.writeText(defchrString.value).then(() => {
    copyFeedback.value = true;
    setTimeout(() => { copyFeedback.value = false; }, 1500);
  });
}

function onPixelUp(): void {
  painting = false;
}
</script>

<template>
  <div class="charset-backdrop" @click="onBackdrop">
    <div class="charset-popup" @mouseup="onPixelUp" @mouseleave="onPixelUp">
      <div class="charset-title">FX-870P Character Set</div>
      <div class="charset-scroll">
        <table class="charset-table">
          <tr>
            <th></th>
            <th v-for="c in 16" :key="c">_{{ hex[c - 1] }}</th>
          </tr>
          <tr v-for="r in 16" :key="r">
            <th>{{ hex[r - 1] }}_</th>
            <td
              v-for="c in 16"
              :key="c"
              :class="{
                unused: cell(r - 1, c - 1).unused,
                'user-defined': cell(r - 1, c - 1).userDefined,
                clickable: !cell(r - 1, c - 1).unused || cell(r - 1, c - 1).userDefined,
              }"
              @click="openEditor(cell(r - 1, c - 1).code)"
            >
              <div class="cell-hex">
                {{ cell(r - 1, c - 1).hexStr }}
                <b v-if="cell(r - 1, c - 1).asciiLabel">{{
                  cell(r - 1, c - 1).asciiLabel
                }}</b>
              </div>
              <div class="cell-bmp"><pre><!--
                -->{{ cell(r - 1, c - 1).rows.join('\n') }}<!--
              --></pre></div>
              <div class="cell-chr">{{ cell(r - 1, c - 1).chrStr }}</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- ── pixel editor overlay ── -->
      <div v-if="editorCode !== null" class="editor-overlay" @click.self="closeEditor">
        <div class="editor-panel">
          <div class="editor-header">
            <span class="editor-title">
              Character Editor &mdash; CHR$({{ editorCode }})
              <span class="editor-hex">(0x{{ editorCode.toString(16).toUpperCase().padStart(2, '0') }})</span>
            </span>
            <button class="editor-close" @click="closeEditor">&times;</button>
          </div>

          <div class="editor-body">
            <div class="editor-grid-area">
              <!-- Column headers -->
              <div class="editor-col-headers">
                <div class="editor-row-label"></div>
                <div v-for="col in 5" :key="col" class="editor-col-label">{{ col }}</div>
              </div>
              <!-- Pixel grid -->
              <div
                v-for="row in 8"
                :key="row"
                class="editor-row"
              >
                <div class="editor-row-label">{{ row - 1 }}</div>
                <div
                  v-for="col in 5"
                  :key="col"
                  class="editor-pixel"
                  :class="{ on: editorPixels[col - 1]![row - 1] }"
                  @mousedown="onPixelDown(col - 1, row - 1, $event)"
                  @mouseenter="onPixelEnter(col - 1, row - 1)"
                  @touchstart.prevent="onPixelDown(col - 1, row - 1, $event)"
                />
              </div>
            </div>

            <div class="editor-sidebar">
              <!-- Preview at actual size -->
              <div class="editor-preview-label">Preview</div>
              <div class="editor-preview">
                <pre>{{ editorPreview.join('\n') }}</pre>
              </div>

              <!-- Column hex values -->
              <div class="editor-col-values">
                <div v-for="(b, i) in editorColumnBytes" :key="i" class="editor-col-val">
                  Col {{ i + 1 }}: <code>{{ b.toString(16).toUpperCase().padStart(2, '0') }}</code>
                  <span class="editor-col-bin">{{ b.toString(2).padStart(8, '0') }}</span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="editor-actions">
                <button class="editor-btn" @click="clearEditor">Clear</button>
                <button class="editor-btn" @click="invertEditor">Invert</button>
              </div>
            </div>
          </div>

          <!-- DEFCHR$ output -->
          <div class="editor-defchr">
            <div class="defchr-label">BASIC command:</div>
            <div class="defchr-row">
              <code class="defchr-value">{{ defchrString }}</code>
              <button class="defchr-copy" @click="copyDefchr">
                {{ copyFeedback ? 'Copied!' : 'COPY' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="charset-footer">
        <button class="charset-close-btn" @click="emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charset-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.charset-popup {
  width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
}

.charset-title {
  padding: 12px 24px;
  font-family: monospace;
  font-size: 1.1rem;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #333;
  background: #111;
  flex-shrink: 0;
}

.charset-scroll {
  flex: 1;
  overflow: auto;
  padding: 12px;
  display: flex;
  justify-content: center;
}

.charset-table {
  border-collapse: collapse;
}

.charset-table th {
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: clamp(8px, 1.2vw, 14px);
  padding: 2px 4px;
  color: #8be;
  white-space: nowrap;
}

.charset-table td {
  border: 1px solid #333;
  padding: 2px;
  vertical-align: middle;
  text-align: center;
}

.charset-table td.clickable {
  cursor: pointer;
}

.charset-table td.clickable:hover {
  border-color: #8be;
  background: rgba(100, 160, 255, 0.06);
}

.charset-table td.unused {
  opacity: 0.3;
}

.charset-table td.user-defined {
  background: rgba(180, 120, 255, 0.12);
  border-color: #636;
}
.charset-table td.user-defined:hover {
  background: rgba(180, 120, 255, 0.22);
  border-color: #a6e;
}

.cell-hex {
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: clamp(5px, 0.8vw, 8px);
  color: #888;
  margin-bottom: 1px;
  white-space: nowrap;
}

.cell-hex b {
  color: #ccc;
}

.cell-bmp {
  display: inline-block;
  background: #5caa8b;
  border-radius: 2px;
  padding: 1px 2px;
}

.cell-bmp pre {
  margin: 0;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: clamp(3px, 0.6vw, 7px);
  line-height: 1;
  letter-spacing: 0;
  color: #1a3a18;
}

.user-defined .cell-bmp {
  background: #7a6a9b;
}
.user-defined .cell-bmp pre {
  color: #2a1a3e;
}

.cell-chr {
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: clamp(4px, 0.65vw, 7px);
  color: #aaa;
  margin-top: 1px;
  user-select: all;
  cursor: text;
  white-space: nowrap;
}

.charset-footer {
  display: flex;
  justify-content: center;
  padding: 10px;
  border-top: 1px solid #333;
  background: #111;
  flex-shrink: 0;
}

.charset-close-btn {
  padding: 6px 32px;
  font-family: monospace;
  font-size: 0.85rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
}
.charset-close-btn:hover {
  background: #3a3a3a;
  color: #fff;
}

/* ── editor overlay ── */
.editor-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.editor-panel {
  background: #1a1a2e;
  border: 1px solid #555;
  border-radius: 8px;
  min-width: 420px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #333;
  background: #111;
  border-radius: 8px 8px 0 0;
}

.editor-title {
  font-family: monospace;
  font-size: 0.95rem;
  color: #fff;
}

.editor-hex {
  color: #888;
  font-size: 0.85rem;
}

.editor-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.editor-close:hover {
  color: #fff;
}

.editor-body {
  display: flex;
  gap: 24px;
  padding: 16px;
  align-items: flex-start;
}

.editor-grid-area {
  display: flex;
  flex-direction: column;
  gap: 0;
  user-select: none;
}

.editor-col-headers {
  display: flex;
  gap: 0;
}

.editor-col-label {
  width: 36px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.65rem;
  color: #666;
}

.editor-row {
  display: flex;
  gap: 0;
}

.editor-row-label {
  width: 20px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.65rem;
  color: #666;
  flex-shrink: 0;
}

.editor-pixel {
  width: 36px;
  height: 36px;
  border: 1px solid #444;
  background: #5caa8b;
  cursor: pointer;
  transition: background 0.05s;
}

.editor-pixel:hover {
  border-color: #8be;
}

.editor-pixel.on {
  background: #1a3a18;
}

.editor-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 140px;
}

.editor-preview-label {
  font-family: monospace;
  font-size: 0.75rem;
  color: #666;
}

.editor-preview {
  display: inline-block;
  background: #5caa8b;
  border-radius: 3px;
  padding: 4px 6px;
  align-self: flex-start;
}

.editor-preview pre {
  margin: 0;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0;
  color: #1a3a18;
}

.editor-col-values {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.editor-col-val {
  font-family: monospace;
  font-size: 0.75rem;
  color: #999;
}

.editor-col-val code {
  color: #9ecbff;
  background: #1a1a2e;
  padding: 1px 3px;
  border-radius: 2px;
}

.editor-col-bin {
  color: #555;
  font-size: 0.65rem;
  margin-left: 4px;
}

.editor-actions {
  display: flex;
  gap: 6px;
}

.editor-btn {
  padding: 3px 10px;
  font-family: monospace;
  font-size: 0.75rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}
.editor-btn:hover {
  background: #3a3a3a;
  color: #fff;
}

/* ── DEFCHR$ output ── */
.editor-defchr {
  padding: 12px 16px;
  border-top: 1px solid #333;
  background: #0d0d0d;
  border-radius: 0 0 8px 8px;
}

.defchr-label {
  font-family: monospace;
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 4px;
}

.defchr-row {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.defchr-value {
  flex: 1;
  display: block;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 1rem;
  color: #f0c040;
  background: #1a1a0a;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #333;
  user-select: all;
  cursor: text;
  word-break: break-all;
}

.defchr-copy {
  padding: 6px 14px;
  font-family: monospace;
  font-size: 0.8rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}
.defchr-copy:hover {
  background: #3a3a3a;
  color: #fff;
}
</style>
