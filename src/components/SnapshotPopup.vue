<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { marked } from 'marked';
import { importSnapshot, exportSnapshot, emulatorStart } from '../emulator/emulator.js';

const base = import.meta.env.BASE_URL;

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const snapFileInput = ref<HTMLInputElement | null>(null);

function openImportPicker(): void {
  snapFileInput.value?.click();
}

async function onImportSelected(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  input.value = '';
  const text = await file.text();
  await importSnapshot(text);
  emulatorStart();
  emit('close');
}

function saveSnapshot(): void {
  const json = exportSnapshot();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'snapshot.fxsnap';
  a.click();
  URL.revokeObjectURL(url);
}

interface CatalogEntry {
  file: string;
  name: string;
  description: string;
  doc?: string;
}

const entries = ref<CatalogEntry[]>([]);
const loadError = ref('');
const expandedDoc = ref<string | null>(null);
const docHtml = ref('');
const docLoading = ref(false);
const restoreError = ref('');

onMounted(async () => {
  try {
    const res = await fetch(`${base}snapshots/catalog.json`);
    entries.value = await res.json();
  } catch {
    loadError.value = 'Failed to load snapshot catalog.';
  }
});

function docFile(entry: CatalogEntry): string {
  if (entry.doc) return entry.doc;
  return entry.file.replace(/\.[^.]+$/, '') + '.md';
}

async function toggleInfo(entry: CatalogEntry): Promise<void> {
  const key = entry.file;
  if (expandedDoc.value === key) {
    expandedDoc.value = null;
    docHtml.value = '';
    return;
  }
  expandedDoc.value = key;
  docHtml.value = '';
  docLoading.value = true;
  try {
    const res = await fetch(`${base}snapshots/${docFile(entry)}`);
    if (!res.ok) {
      docHtml.value = '<p>No documentation available.</p>';
      return;
    }
    const md = await res.text();
    docHtml.value = await marked(md);
  } catch {
    docHtml.value = '<p>Failed to load documentation.</p>';
  } finally {
    docLoading.value = false;
    await nextTick();
    const el = document.querySelector(`.snap-entry-doc-${CSS.escape(key)}`);
    if (el) {
      const row = el.previousElementSibling;
      (row || el).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

async function onRestore(entry: CatalogEntry): Promise<void> {
  restoreError.value = '';
  try {
    const res = await fetch(`${base}snapshots/${entry.file}`);
    if (!res.ok) throw new Error(`${entry.file} not found`);
    const text = await res.text();
    await importSnapshot(text);
    emulatorStart();
    emit('close');
  } catch (e) {
    restoreError.value = `Failed to restore: ${e instanceof Error ? e.message : String(e)}`;
  }
}

async function onDownload(entry: CatalogEntry): Promise<void> {
  try {
    const res = await fetch(`${base}snapshots/${entry.file}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = entry.file;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // noop
  }
}

function onBackdrop(e: MouseEvent): void {
  if (e.target === e.currentTarget) emit('close');
}
</script>

<template>
  <div class="snap-backdrop" @click="onBackdrop">
    <div class="snap-popup">
      <div class="snap-header">
        <span class="snap-title">Snapshot Library</span>
        <div class="snap-header-actions">
          <button class="snap-btn snap-btn-import" @click="openImportPicker" title="Import snapshot from file">IMPORT</button>
          <button class="snap-btn snap-btn-save" @click="saveSnapshot" title="Save current state to file">SAVE</button>
        </div>
        <button class="snap-close" @click="emit('close')">&times;</button>
      </div>
      <input ref="snapFileInput" type="file" accept=".fxsnap,.json" style="display:none" @change="onImportSelected" />

      <div class="snap-body">
        <div v-if="restoreError" class="snap-error">{{ restoreError }}</div>
        <div v-if="loadError" class="snap-error">{{ loadError }}</div>
        <div v-else-if="entries.length === 0" class="snap-empty">Loading...</div>
        <div v-else class="snap-list">
          <div v-for="entry in entries" :key="entry.file" class="snap-entry">
            <div class="snap-row">
              <div class="snap-info">
                <span class="snap-name">{{ entry.name }}</span>
                <span class="snap-desc">{{ entry.description }}</span>
                <span class="snap-file">{{ entry.file }}</span>
              </div>
              <div class="snap-actions">
                <button class="snap-btn snap-btn-info" @click="toggleInfo(entry)">
                  {{ expandedDoc === entry.file ? 'HIDE' : 'INFO' }}
                </button>
                <button class="snap-btn snap-btn-restore" @click="onRestore(entry)">RESTORE</button>
                <button class="snap-btn snap-btn-dl" @click="onDownload(entry)" title="Download"><i class="fa-solid fa-download"></i></button>
              </div>
            </div>
            <div v-if="expandedDoc === entry.file" :class="['snap-doc', `snap-entry-doc-${entry.file}`]">
              <div v-if="docLoading" class="snap-doc-loading">Loading...</div>
              <div v-else class="snap-doc-content" v-html="docHtml" />
            </div>
          </div>
        </div>
      </div>

      <div class="snap-footer">
        <span class="snap-hint">Restoring a snapshot resumes the machine exactly where it was saved — no boot or LOAD needed.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.snap-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.snap-popup {
  width: 50vw;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
  font-family: monospace;
  font-size: 0.97rem;
  color: #ccc;
}

.snap-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #333;
  background: #111;
}

.snap-title {
  font-size: 1.12rem;
  color: #fff;
}

.snap-header-actions {
  display: flex;
  gap: 4px;
  margin-left: auto;
  margin-right: 12px;
}

.snap-btn-import {
  color: #7eb8f7;
  border-color: #204050;
}
.snap-btn-import:hover {
  background: #102030;
  color: #aad4ff;
}

.snap-btn-save {
  color: #e0a050;
  border-color: #504020;
}
.snap-btn-save:hover {
  background: #2a2010;
  color: #f0c070;
}

.snap-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.52rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.snap-close:hover { color: #fff; }

.snap-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.snap-error {
  color: #f06060;
  margin-bottom: 8px;
}

.snap-empty {
  color: #666;
  font-style: italic;
}

.snap-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.snap-entry {
  border: 1px solid #333;
  border-radius: 4px;
  background: #0d0d0d;
}

.snap-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.snap-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.snap-name {
  color: #fff;
  font-size: 1.02rem;
}

.snap-desc {
  color: #999;
  font-size: 0.9rem;
}

.snap-file {
  color: #555;
  font-size: 0.82rem;
}

.snap-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.snap-btn {
  padding: 4px 12px;
  font-family: monospace;
  font-size: 0.87rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}
.snap-btn:hover {
  background: #3a3a3a;
  color: #fff;
}

.snap-btn-restore {
  color: #8bc34a;
  border-color: #3a5a20;
}
.snap-btn-restore:hover {
  background: #1a2a10;
  color: #aed581;
}

.snap-btn-dl {
  color: #e0a050;
  border-color: #504020;
}
.snap-btn-dl:hover {
  background: #2a2010;
  color: #f0c070;
}

.snap-btn-info {
  color: #7eb8f7;
  border-color: #204050;
}
.snap-btn-info:hover {
  background: #102030;
  color: #aad4ff;
}

.snap-doc {
  border-top: 1px solid #222;
  padding: 12px 16px;
  max-height: 400px;
  overflow-y: auto;
}

.snap-doc-loading {
  color: #666;
  font-style: italic;
}

.snap-doc-content {
  line-height: 1.5;
  color: #bbb;
}

.snap-doc-content :deep(h1) {
  font-size: 1.32rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 6px;
  margin: 0 0 10px;
}

.snap-doc-content :deep(h2) {
  font-size: 1.12rem;
  color: #ddd;
  margin: 16px 0 8px;
}

.snap-doc-content :deep(h3) {
  font-size: 1.02rem;
  color: #bbb;
  margin: 12px 0 6px;
}

.snap-doc-content :deep(p) { margin: 6px 0; }

.snap-doc-content :deep(a) {
  color: #7eb8f7;
  text-decoration: none;
}
.snap-doc-content :deep(a:hover) { text-decoration: underline; }

.snap-doc-content :deep(code) {
  background: #2a2a2a;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.97em;
  color: #e0e0e0;
}

.snap-doc-content :deep(pre) {
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px 12px;
  overflow-x: auto;
}

.snap-doc-content :deep(pre code) {
  background: none;
  padding: 0;
}

.snap-doc-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.snap-doc-content :deep(th),
.snap-doc-content :deep(td) {
  border: 1px solid #333;
  padding: 4px 10px;
  text-align: left;
}

.snap-doc-content :deep(th) {
  background: #222;
  color: #ddd;
}

.snap-doc-content :deep(ul),
.snap-doc-content :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.snap-doc-content :deep(li) { margin: 3px 0; }

.snap-doc-content :deep(strong) { color: #ddd; }

.snap-footer {
  padding: 8px 16px;
  border-top: 1px solid #333;
  background: #111;
}

.snap-hint {
  color: #555;
  font-size: 0.84rem;
}
</style>
