<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
  category?: string;
}

type LibTab = 'programs' | 'scientific';
const activeTab = ref<LibTab>('programs');

const programEntries = ref<CatalogEntry[]>([]);
const sciEntries = ref<CatalogEntry[]>([]);
const loadError = ref('');
const expandedDoc = ref<string | null>(null);
const expandedEntry = ref<CatalogEntry | null>(null);
const docHtml = ref('');
const docLoading = ref(false);

// Group scientific entries by category
const sciGroups = computed(() => {
  const groups: { category: string; entries: CatalogEntry[] }[] = [];
  const seen = new Map<string, CatalogEntry[]>();
  for (const entry of sciEntries.value) {
    const cat = entry.category || 'Other';
    if (!seen.has(cat)) {
      const arr: CatalogEntry[] = [];
      seen.set(cat, arr);
      groups.push({ category: cat, entries: arr });
    }
    seen.get(cat)!.push(entry);
  }
  return groups;
});

onMounted(async () => {
  try {
    const [progRes, sciRes] = await Promise.all([
      fetch(`${base}basic/emulator/catalog.json`),
      fetch(`${base}basic/scientific-library/catalog.json`),
    ]);
    programEntries.value = await progRes.json();
    sciEntries.value = await sciRes.json();
  } catch {
    loadError.value = 'Failed to load program catalog.';
  }
});

function basePath(): string {
  return activeTab.value === 'scientific'
    ? `${base}basic/scientific-library/`
    : `${base}basic/emulator/`;
}

function docFile(entry: CatalogEntry): string {
  if (entry.doc) return entry.doc;
  const basename = entry.file.replace(/\.[^.]+$/, '');
  return `${basename}.md`;
}

async function showInfo(entry: CatalogEntry): Promise<void> {
  expandedDoc.value = entry.file;
  expandedEntry.value = entry;
  docHtml.value = '';
  docLoading.value = true;
  try {
    const res = await fetch(`${basePath()}${docFile(entry)}`);
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

function closeInfo(): void {
  expandedDoc.value = null;
  expandedEntry.value = null;
  docHtml.value = '';
}

async function onLoad(entry: CatalogEntry): Promise<void> {
  try {
    const res = await fetch(`${basePath()}${entry.file}`);
    const raw = new Uint8Array(await res.arrayBuffer());
    clearOutput();
    loadFileBytes(raw);
    emit('load', { name: entry.file, bytes: raw.length });
    emit('close');
  } catch {
    // noop — file fetch failed
  }
}

async function onDownload(entry: CatalogEntry): Promise<void> {
  try {
    const res = await fetch(`${basePath()}${entry.file}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = entry.file;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    // noop — file fetch failed
  }
}

function onBackdrop(e: MouseEvent): void {
  if (e.target === e.currentTarget) emit('close');
}

function switchTab(tab: LibTab): void {
  activeTab.value = tab;
  closeInfo();
}

const currentEntries = computed(() =>
  activeTab.value === 'scientific' ? sciEntries.value : programEntries.value
);
</script>

<template>
  <div class="lib-backdrop" @click="onBackdrop">
    <div class="lib-popup">
      <!-- Header: tabs (list view) or back+name+actions (doc view) -->
      <div class="lib-header">
        <template v-if="expandedEntry">
          <button class="lib-back" @click="closeInfo">&larr; Back</button>
          <span class="lib-detail-name">{{ expandedEntry.name }}</span>
          <div class="lib-detail-actions">
            <button class="lib-btn lib-btn-load" @click="onLoad(expandedEntry)">LOAD</button>
            <button class="lib-btn lib-btn-dl" @click="onDownload(expandedEntry)" title="Download"><i class="fa-solid fa-download"></i></button>
          </div>
        </template>
        <template v-else>
          <div class="lib-tabs">
            <button class="lib-tab" :class="{ active: activeTab === 'programs' }"
                    @click="switchTab('programs')">Program Library</button>
            <button class="lib-tab" :class="{ active: activeTab === 'scientific' }"
                    @click="switchTab('scientific')">Scientific Library</button>
          </div>
        </template>
        <button class="lib-close" @click="emit('close')">&times;</button>
      </div>

      <!-- Body: doc view or list view -->
      <div class="lib-body">
        <!-- Doc detail view -->
        <template v-if="expandedEntry">
          <div v-if="docLoading" class="lib-doc-loading">Loading...</div>
          <div v-else class="lib-doc-content" v-html="docHtml" />
        </template>

        <!-- List view -->
        <template v-else>
          <div v-if="loadError" class="lib-error">{{ loadError }}</div>
          <div v-else-if="currentEntries.length === 0" class="lib-empty">Loading...</div>

          <!-- Program Library: flat list -->
          <div v-else-if="activeTab === 'programs'" class="lib-list">
            <div v-for="entry in programEntries" :key="entry.file" class="lib-entry">
              <div class="lib-row">
                <div class="lib-info">
                  <span class="lib-name">{{ entry.name }}</span>
                  <span class="lib-desc">{{ entry.description }}</span>
                  <span class="lib-file">{{ entry.file }}</span>
                </div>
                <div class="lib-actions">
                  <button class="lib-btn lib-btn-info" @click="showInfo(entry)">INFO</button>
                  <button class="lib-btn lib-btn-load" @click="onLoad(entry)">LOAD</button>
                  <button class="lib-btn lib-btn-dl" @click="onDownload(entry)" title="Download"><i class="fa-solid fa-download"></i></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Scientific Library: grouped by category -->
          <div v-else class="lib-list">
            <div v-for="group in sciGroups" :key="group.category" class="lib-category">
              <div class="lib-category-header">{{ group.category }}</div>
              <div v-for="entry in group.entries" :key="entry.file" class="lib-entry">
                <div class="lib-row">
                  <div class="lib-info">
                    <span class="lib-name">{{ entry.name }}</span>
                    <span class="lib-desc">{{ entry.description }}</span>
                    <span class="lib-file">{{ entry.file }}</span>
                  </div>
                  <div class="lib-actions">
                    <button class="lib-btn lib-btn-load" @click="onLoad(entry)">LOAD</button>
                    <button class="lib-btn lib-btn-dl" @click="onDownload(entry)" title="Download"><i class="fa-solid fa-download"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="lib-footer">
        <span class="lib-hint">Click LOAD, then on calc type: <code>LOAD "COM0:6,E,8,1,N,N,N,B,N"</code></span>
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
  width: 80vw;
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

.lib-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #333;
  background: #111;
}

.lib-tabs {
  display: flex;
  gap: 0;
}

.lib-tab {
  padding: 10px 16px;
  font-family: monospace;
  font-size: 1rem;
  background: none;
  color: #777;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.lib-tab:hover { color: #bbb; }
.lib-tab.active {
  color: #fff;
  border-bottom-color: #7eb8f7;
}

.lib-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.52rem;
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

.lib-category {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lib-category-header {
  font-size: 0.82rem;
  color: #7eb8f7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 4px 2px;
  border-bottom: 1px solid #222;
  margin-top: 4px;
}
.lib-category:first-child .lib-category-header { margin-top: 0; }

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
  font-size: 1.02rem;
}

.lib-desc {
  color: #999;
  font-size: 0.9rem;
}

.lib-file {
  color: #555;
  font-size: 0.82rem;
}

.lib-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.lib-btn {
  padding: 4px 12px;
  font-family: monospace;
  font-size: 0.87rem;
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

.lib-btn-dl {
  color: #e0a050;
  border-color: #504020;
}
.lib-btn-dl:hover {
  background: #2a2010;
  color: #f0c070;
}

.lib-btn-info {
  color: #7eb8f7;
  border-color: #204050;
}
.lib-btn-info:hover {
  background: #102030;
  color: #aad4ff;
}

.lib-back {
  background: none;
  border: none;
  color: #7eb8f7;
  font-family: monospace;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px 12px;
  flex-shrink: 0;
}
.lib-back:hover {
  color: #aad4ff;
}

.lib-detail-name {
  flex: 1;
  color: #fff;
  font-size: 1.02rem;
  padding: 10px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lib-detail-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  padding-right: 8px;
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
  font-size: 1.32rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 6px;
  margin: 0 0 10px;
}

.lib-doc-content :deep(h2) {
  font-size: 1.12rem;
  color: #ddd;
  margin: 16px 0 8px;
}

.lib-doc-content :deep(h3) {
  font-size: 1.02rem;
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
  font-size: 0.97em;
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
  font-size: 0.84rem;
}

.lib-hint code {
  color: #777;
}
</style>
