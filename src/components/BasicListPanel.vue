<!-- src/components/BasicListPanel.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { readBasicPrograms, debugFileTable, type BasicProgram } from '../emulator/detokenize.js';
import { upsertLine, deleteLine, writeProgram, isBasicRunning } from '../emulator/ram-edit.js';
import { tokenizeProgram, parseListingText } from '../emulator/tokenize.js';
import BasicEditor from '../editor/BasicEditor.vue';
import CharPalette from '../editor/CharPalette.vue';
import { highlightBasic, exportListingHtml, type ExportTheme } from '../editor/basic-highlight.js';


const props = defineProps<{
  defchr?: string;
}>();

const programs = ref<BasicProgram[]>([]);
const debugInfo = ref('');
const showDebugDump = ref(false);
const activeTab = ref(0);
const live = ref(true);
const editMode = ref(false);
const editingLine = ref<number | null>(null); // line number being edited
const errorMsg = ref('');
const showImport = ref(false);
const statusMsg = ref('');
let pollId: ReturnType<typeof setInterval> | null = null;

const activeProgram = computed(() => programs.value[activeTab.value] ?? null);
const activeSlot = computed(() => activeProgram.value?.slot ?? 0);

const showCharPalette = ref(false);
const showExportMenu = ref(false);
const addLineEditor = ref<InstanceType<typeof BasicEditor> | null>(null);
const importEditor = ref<InstanceType<typeof BasicEditor> | null>(null);
const editLineEditor = ref<InstanceType<typeof BasicEditor> | null>(null);
let lastFocusedEditor: InstanceType<typeof BasicEditor> | null = null;

function trackEditorFocus(editor: InstanceType<typeof BasicEditor> | null): void {
  if (editor) lastFocusedEditor = editor;
}

function insertSpecialChar(char: string): void {
  if (lastFocusedEditor) {
    lastFocusedEditor.insertAtCursor(char);
  } else if (addLineEditor.value) {
    addLineEditor.value.insertAtCursor(char);
  }
}

function refresh(): void {
  const prev = programs.value;
  programs.value = readBasicPrograms();
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

function enterEditMode(): void {
  editMode.value = true;
  editingLine.value = null;
  errorMsg.value = '';
  showImport.value = false;
  // Pause live polling
  if (live.value) {
    live.value = false;
    if (pollId !== null) {
      clearInterval(pollId);
      pollId = null;
    }
  }
  refresh(); // get fresh snapshot
}

function exitEditMode(): void {
  editMode.value = false;
  editingLine.value = null;
  errorMsg.value = '';
  showImport.value = false;
  showCharPalette.value = false;
  // Resume live polling
  live.value = true;
  refresh();
  pollId = setInterval(refresh, 1000);
}

function startEditLine(lineNum: number): void {
  editingLine.value = lineNum;
  errorMsg.value = '';
}

function cancelEditLine(): void {
  editingLine.value = null;
  errorMsg.value = '';
}

function submitEditLine(lineNum: number, code: string): void {
  const text = code.trim();
  if (!text) {
    // Empty text = delete the line
    doDeleteLine(lineNum);
    return;
  }
  try {
    if (isBasicRunning()) {
      errorMsg.value = 'Cannot edit while BASIC is running';
      return;
    }
    upsertLine(activeSlot.value, lineNum, text);
    editingLine.value = null;
    errorMsg.value = '';
    statusMsg.value = '';
    refresh();
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e);
  }
}

function doDeleteLine(lineNum: number): void {
  try {
    if (isBasicRunning()) {
      errorMsg.value = 'Cannot edit while BASIC is running';
      return;
    }
    deleteLine(activeSlot.value, lineNum);
    editingLine.value = null;
    errorMsg.value = '';
    refresh();
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e);
  }
}

function submitNewLine(code: string): void {
  const text = code.trim();
  if (!text) return;

  // Parse "LINENUM TEXT" format
  const match = text.match(/^(\d+)\s+(.*)/);
  if (!match) {
    errorMsg.value = 'Format: LINE_NUMBER BASIC_TEXT (e.g., "50 PRINT \\"HELLO\\"")';
    return;
  }

  const lineNum = parseInt(match[1], 10);
  if (lineNum < 1 || lineNum > 65535) {
    errorMsg.value = 'Line number must be 1-65535';
    return;
  }

  try {
    if (isBasicRunning()) {
      errorMsg.value = 'Cannot edit while BASIC is running';
      return;
    }
    upsertLine(activeSlot.value, lineNum, match[2]);
    errorMsg.value = '';
    statusMsg.value = '';
    refresh();
    // Clear the input
    nextTick(() => {
      addLineEditor.value?.setContent('');
      addLineEditor.value?.focus();
    });
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e);
  }
}

function closeExportMenu(e: MouseEvent): void {
  if (!(e.target as HTMLElement)?.closest('.export-wrap')) {
    showExportMenu.value = false;
  }
}
watch(showExportMenu, (open) => {
  if (open) setTimeout(() => document.addEventListener('click', closeExportMenu), 0);
  else document.removeEventListener('click', closeExportMenu);
});

function doExport(theme: ExportTheme): void {
  showExportMenu.value = false;
  if (!activeProgram.value) return;
  const prog = activeProgram.value;
  const plain = prog.lines.map(l => `${l.num} ${l.text}`).join('\n');
  const html = exportListingHtml(prog.lines, `P${prog.slot}`, theme);

  const clipItem = new ClipboardItem({
    'text/plain': new Blob([plain], { type: 'text/plain' }),
    'text/html': new Blob([html], { type: 'text/html' }),
  });
  navigator.clipboard.write([clipItem]).then(() => {
    statusMsg.value = 'Copied to clipboard';
    setTimeout(() => { statusMsg.value = ''; }, 2000);
  }).catch(() => {
    statusMsg.value = 'Copy failed';
    setTimeout(() => { statusMsg.value = ''; }, 2000);
  });
}

function toggleImport(): void {
  showImport.value = !showImport.value;
  errorMsg.value = '';
  if (showImport.value) {
    nextTick(() => importEditor.value?.focus());
  }
}

function submitImport(code: string): void {
  const text = code.trim();
  if (!text) return;

  try {
    if (isBasicRunning()) {
      errorMsg.value = 'Cannot edit while BASIC is running';
      return;
    }
    const lines = parseListingText(text);
    if (lines.length === 0) {
      errorMsg.value = 'No valid lines found';
      return;
    }
    const bytes = tokenizeProgram(lines);
    writeProgram(activeSlot.value, bytes);
    showImport.value = false;
    errorMsg.value = '';
    statusMsg.value = `Imported ${lines.length} lines`;
    setTimeout(() => { statusMsg.value = ''; }, 2000);
    refresh();
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e);
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
      <template v-if="!editMode">
        <button class="btn" :class="{ active: live }" @click="toggleLive">
          {{ live ? 'LIVE' : 'FROZEN' }}
        </button>
        <button class="btn" @click="refresh">REFRESH</button>
      </template>
      <button class="btn" :class="{ active: editMode }" @click="editMode ? exitEditMode() : enterEditMode()">
        EDIT
      </button>
      <div v-if="activeProgram" class="export-wrap">
        <button class="btn" @click="showExportMenu = !showExportMenu">EXPORT</button>
        <div v-if="showExportMenu" class="export-menu">
          <button class="export-opt" @click="doExport('dark')">Dark</button>
          <button class="export-opt" @click="doExport('light')">Light</button>
        </div>
      </div>
      <template v-if="editMode">
        <button class="btn" :class="{ active: showImport }" @click="toggleImport">IMPORT</button>
        <button class="btn chr-btn" :class="{ active: showCharPalette }" @click="showCharPalette = !showCharPalette"
                title="Special characters">&Omega;</button>
      </template>
      <button class="btn" :class="{ active: showDebugDump }" @click="toggleDebug">HEX</button>
      <span v-if="statusMsg" class="status-msg">{{ statusMsg }}</span>
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

    <!-- Character palette -->
    <CharPalette v-if="showCharPalette && editMode" @insert="insertSpecialChar" />

    <!-- Import editor -->
    <div v-if="showImport" class="import-area">
      <div class="import-label">Paste BASIC listing (line numbers required). Ctrl+Enter to import.</div>
      <div @focusin="trackEditorFocus(importEditor)">
        <BasicEditor
          ref="importEditor"
          :multiline="true"
          @submit="submitImport"
          @cancel="toggleImport"
        />
      </div>
    </div>

    <!-- Error display -->
    <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

    <div class="basic-listing">
      <template v-if="programs.length === 0">
        <span class="empty">(no programs in memory)</span>
      </template>
      <template v-else-if="activeProgram">
        <div v-for="line in activeProgram.lines" :key="line.num" class="basic-line"
             :class="{ 'editing': editMode && editingLine !== line.num }">
          <span class="line-num">{{ line.num }}</span>
          <!-- Editing this line -->
          <template v-if="editMode && editingLine === line.num">
            <div class="line-editor" @focusin="trackEditorFocus(editLineEditor)">
              <BasicEditor
                ref="editLineEditor"
                :initial-code="line.text"
                @submit="(code: string) => submitEditLine(line.num, code)"
                @cancel="cancelEditLine"
              />
            </div>
          </template>
          <!-- Normal display -->
          <template v-else>
            <span class="line-text"
                  :class="{ clickable: editMode }"
                  @click="editMode ? startEditLine(line.num) : undefined"
                  v-html="highlightBasic(line.text)"
            ></span>
            <button v-if="editMode" class="delete-btn" @click.stop="doDeleteLine(line.num)"
                    title="Delete line">&times;</button>
          </template>
        </div>
      </template>

      <!-- Add line input (visible in edit mode) -->
      <div v-if="editMode" class="add-line">
        <span class="add-prefix">+</span>
        <div class="add-editor">
          <div @focusin="trackEditorFocus(addLineEditor)">
            <BasicEditor
              ref="addLineEditor"
              placeholder="50 PRINT &quot;HELLO&quot;"
              @submit="submitNewLine"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.basic-panel {
  display: flex;
  flex-direction: column;
  background: #111;
  border-top: 1px solid #333;
  font-family: "Consolas", "Menlo", "Monaco", "Courier New", monospace;
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
.btn.chr-btn { font-family: serif; font-size: 0.8rem; }
.btn.chr-btn.active { color: #d2a8ff; border-color: #4a2a6a; background: #1a102a; }

.export-wrap {
  position: relative;
  display: inline-block;
}
.export-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 3px;
  z-index: 20;
  overflow: hidden;
}
.export-opt {
  padding: 3px 12px;
  font-family: monospace;
  font-size: 0.7rem;
  background: transparent;
  color: #ccc;
  border: none;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
}
.export-opt:hover { background: #333; color: #fff; }
.export-opt + .export-opt { border-top: 1px solid #333; }

.status-msg {
  color: #8bc34a;
  font-size: 0.65rem;
  margin-left: 4px;
}

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

.import-area {
  padding: 4px 10px;
  border-bottom: 1px solid #222;
  background: #0a0a1a;
}
.import-label {
  color: #666;
  font-size: 0.65rem;
  margin-bottom: 4px;
}

.error-msg {
  padding: 2px 10px;
  color: #ff6b6b;
  font-size: 0.65rem;
  background: #1a0a0a;
  border-bottom: 1px solid #322;
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
  display: flex;
  align-items: flex-start;
  position: relative;
}

.line-num {
  color: #777;
  flex-shrink: 0;
  min-width: 3em;
}

.line-text {
  color: #ccc;
  flex: 1;
  margin-left: 1ch;
}
.line-text.clickable {
  cursor: pointer;
  border-left: 2px solid transparent;
  padding-left: 4px;
}
.line-text.clickable:hover {
  border-left-color: #f0a030;
  background: #1a1a1a;
}

.line-editor {
  flex: 1;
  margin-left: 4px;
}

.delete-btn {
  visibility: hidden;
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  flex-shrink: 0;
}
.basic-line:hover .delete-btn {
  visibility: visible;
}
.delete-btn:hover {
  color: #ff3333;
}

.add-line {
  display: flex;
  align-items: flex-start;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #1a1a1a;
}
.add-prefix {
  color: #8bc34a;
  font-weight: bold;
  margin-right: 4px;
  line-height: 1.6;
}
.add-editor {
  flex: 1;
}

.empty {
  color: #444;
  font-style: italic;
}

/* Syntax highlighting for listing lines (v-html spans) */
.line-text :deep(.hl-keyword) { color: #6cb6ff; }
.line-text :deep(.hl-function) { color: #d2a8ff; }
.line-text :deep(.hl-operator-kw) { color: #f0a030; }
.line-text :deep(.hl-string) { color: #7ee787; }
.line-text :deep(.hl-number) { color: #f0c040; }
.line-text :deep(.hl-comment) { color: #666; font-style: italic; }
.line-text :deep(.hl-variable) { color: #ccc; }
.line-text :deep(.hl-operator) { color: #aaa; }
</style>
