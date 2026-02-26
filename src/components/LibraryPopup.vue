<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { marked } from 'marked';
import { loadFileBytes, clearOutput } from '../emulator/comm.js';

const base = import.meta.env.BASE_URL;

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'load', payload: { name: string; bytes: number }): void;
}>();

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

onMounted(async () => {
  try {
    const res = await fetch(`${base}basic/emulator/catalog.json`);
    entries.value = await res.json();
  } catch {
    loadError.value = 'Failed to load program catalog.';
  }
});

function docFile(entry: CatalogEntry): string {
  if (entry.doc) return entry.doc;
  const basename = entry.file.replace(/\.[^.]+$/, '');
  return `${basename}.md`;
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
    const res = await fetch(`${base}basic/emulator/${docFile(entry)}`);
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
  }
}

async function onLoad(entry: CatalogEntry): Promise<void> {
  try {
    const res = await fetch(`${base}basic/emulator/${entry.file}`);
    const raw = new Uint8Array(await res.arrayBuffer());
    clearOutput();
    loadFileBytes(raw);
    emit('load', { name: entry.file, bytes: raw.length });
    emit('close');
  } catch {
    // noop — file fetch failed
  }
}

function onBackdrop(e: MouseEvent): void {
  if (e.target === e.currentTarget) emit('close');
}
</script>

<template>
  <div class="lib-backdrop" @click="onBackdrop">
    <div class="lib-popup">
      <div class="lib-header">
        <span class="lib-title">Program Library</span>
        <button class="lib-close" @click="emit('close')">&times;</button>
      </div>

      <div class="lib-body">
        <div v-if="loadError" class="lib-error">{{ loadError }}</div>
        <div v-else-if="entries.length === 0" class="lib-empty">Loading...</div>
        <div v-else class="lib-list">
          <div v-for="entry in entries" :key="entry.file" class="lib-entry">
            <div class="lib-row">
              <div class="lib-info">
                <span class="lib-name">{{ entry.name }}</span>
                <span class="lib-desc">{{ entry.description }}</span>
                <span class="lib-file">{{ entry.file }}</span>
              </div>
              <div class="lib-actions">
                <button class="lib-btn lib-btn-info" @click="toggleInfo(entry)">
                  {{ expandedDoc === entry.file ? 'HIDE' : 'INFO' }}
                </button>
                <button class="lib-btn lib-btn-load" @click="onLoad(entry)">LOAD</button>
              </div>
            </div>
            <div v-if="expandedDoc === entry.file" class="lib-doc">
              <div v-if="docLoading" class="lib-doc-loading">Loading...</div>
              <div v-else class="lib-doc-content" v-html="docHtml" />
            </div>
          </div>
        </div>
      </div>

      <div class="lib-footer">
        <span class="lib-hint">Click LOAD, then on calc type: <code>LOAD "COM0:6,N,8,1,N,N,N,N,N"</code></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lib-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.lib-popup {
  width: 560px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
  font-family: monospace;
  font-size: 0.85rem;
  color: #ccc;
}

.lib-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #333;
  background: #111;
}

.lib-title {
  font-size: 1rem;
  color: #fff;
}

.lib-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.4rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.lib-close:hover {
  color: #fff;
}

.lib-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.lib-error {
  color: #f06060;
}

.lib-empty {
  color: #666;
  font-style: italic;
}

.lib-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lib-entry {
  border: 1px solid #333;
  border-radius: 4px;
  background: #0d0d0d;
}

.lib-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.lib-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.lib-name {
  color: #fff;
  font-size: 0.9rem;
}

.lib-desc {
  color: #999;
  font-size: 0.78rem;
}

.lib-file {
  color: #555;
  font-size: 0.7rem;
}

.lib-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.lib-btn {
  padding: 4px 12px;
  font-family: monospace;
  font-size: 0.75rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}
.lib-btn:hover {
  background: #3a3a3a;
  color: #fff;
}

.lib-btn-load {
  color: #8bc34a;
  border-color: #3a5a20;
}
.lib-btn-load:hover {
  background: #1a2a10;
  color: #aed581;
}

.lib-btn-info {
  color: #7eb8f7;
  border-color: #204050;
}
.lib-btn-info:hover {
  background: #102030;
  color: #aad4ff;
}

.lib-doc {
  border-top: 1px solid #222;
  padding: 12px 16px;
  max-height: 400px;
  overflow-y: auto;
}

.lib-doc-loading {
  color: #666;
  font-style: italic;
}

.lib-doc-content {
  line-height: 1.5;
  color: #bbb;
}

.lib-doc-content :deep(h1) {
  font-size: 1.2rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 6px;
  margin: 0 0 10px;
}

.lib-doc-content :deep(h2) {
  font-size: 1rem;
  color: #ddd;
  margin: 16px 0 8px;
}

.lib-doc-content :deep(h3) {
  font-size: 0.9rem;
  color: #bbb;
  margin: 12px 0 6px;
}

.lib-doc-content :deep(p) {
  margin: 6px 0;
}

.lib-doc-content :deep(a) {
  color: #7eb8f7;
  text-decoration: none;
}
.lib-doc-content :deep(a:hover) {
  text-decoration: underline;
}

.lib-doc-content :deep(code) {
  background: #2a2a2a;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.85em;
  color: #e0e0e0;
}

.lib-doc-content :deep(pre) {
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px 12px;
  overflow-x: auto;
}

.lib-doc-content :deep(pre code) {
  background: none;
  padding: 0;
}

.lib-doc-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.lib-doc-content :deep(th),
.lib-doc-content :deep(td) {
  border: 1px solid #333;
  padding: 4px 10px;
  text-align: left;
}

.lib-doc-content :deep(th) {
  background: #222;
  color: #ddd;
}

.lib-doc-content :deep(ul),
.lib-doc-content :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}

.lib-doc-content :deep(li) {
  margin: 3px 0;
}

.lib-doc-content :deep(strong) {
  color: #ddd;
}

.lib-footer {
  padding: 8px 16px;
  border-top: 1px solid #333;
  background: #111;
}

.lib-hint {
  color: #555;
  font-size: 0.72rem;
}

.lib-hint code {
  color: #777;
}
</style>
