<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { marked } from 'marked';

const DOC_BASE = `${import.meta.env.BASE_URL}docs/casio-jis-basic/`;

interface CommandEntry {
  file: string;
  purpose: string;
  badge: string;
}
interface CommandIndex {
  keywords: Record<string, CommandEntry>;
}

const props = defineProps<{
  visible: boolean;
  commandPage?: string;
  docLayout: 'side' | 'stack';
  showBasic: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'update:docLayout', v: 'side' | 'stack'): void;
}>();

const htmlContent = ref('');
const loading = ref(false);
const currentPath = ref('index.md');
const history = ref<string[]>([]);
const commandIndex = ref<CommandIndex | null>(null);
const contentEl = ref<HTMLElement | null>(null);

// Load command index
onMounted(async () => {
  try {
    const res = await fetch(`${DOC_BASE}command-index.json`);
    commandIndex.value = await res.json();
  } catch {
    console.warn('Failed to load command index');
  }
  if (props.visible) {
    await loadPage(currentPath.value);
  }
});

// Watch for external command page requests
watch(() => props.commandPage, async (cmd) => {
  if (!cmd || !commandIndex.value) return;
  const entry = commandIndex.value.keywords[cmd.toUpperCase()];
  if (entry) {
    await navigateTo(entry.file);
  }
});

watch(() => props.visible, async (vis) => {
  if (vis && !htmlContent.value) {
    await loadPage(currentPath.value);
  }
});

async function loadPage(path: string): Promise<void> {
  loading.value = true;
  try {
    const res = await fetch(`${DOC_BASE}${path}`);
    if (!res.ok) {
      htmlContent.value = `<p>Failed to load: ${path}</p>`;
      return;
    }
    const md = await res.text();
    htmlContent.value = await marked(md);
    currentPath.value = path;
    await nextTick();
    if (contentEl.value) contentEl.value.scrollTop = 0;
  } catch {
    htmlContent.value = `<p>Failed to load documentation.</p>`;
  } finally {
    loading.value = false;
  }
}

async function navigateTo(path: string): Promise<void> {
  history.value.push(currentPath.value);
  await loadPage(path);
}

async function goBack(): Promise<void> {
  const prev = history.value.pop();
  if (prev) {
    await loadPage(prev);
  }
}

function goHome(): void {
  history.value = [];
  loadPage('index.md');
}

function close(): void {
  emit('update:visible', false);
}

function toggleLayout(): void {
  emit('update:docLayout', props.docLayout === 'side' ? 'stack' : 'side');
}

// Intercept link clicks inside rendered markdown
function onContentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const anchor = target.closest('a');
  if (!anchor) {
    // Check for keyword click within code blocks
    const cmdEl = target.closest('[data-cmd]') as HTMLElement | null;
    if (cmdEl && commandIndex.value) {
      const cmd = cmdEl.getAttribute('data-cmd')!;
      const entry = commandIndex.value.keywords[cmd];
      if (entry) {
        event.preventDefault();
        navigateTo(entry.file);
      }
    }
    return;
  }

  const href = anchor.getAttribute('href');
  if (!href) return;

  // External links open in new tab
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return; // let browser handle it
  }

  event.preventDefault();

  // Resolve relative path from current page
  const currentDir = currentPath.value.replace(/[^/]*$/, '');
  let resolved = href;
  if (href.startsWith('../')) {
    // Go up one directory
    const parentDir = currentDir.replace(/[^/]*\/$/, '');
    resolved = parentDir + href.replace('../', '');
  } else if (!href.startsWith('/')) {
    resolved = currentDir + href;
  }

  // Strip any anchor fragments for now
  resolved = resolved.split('#')[0];

  if (resolved) {
    navigateTo(resolved);
  }
}

// Breadcrumb parts
function breadcrumb(): string[] {
  const parts = currentPath.value.split('/').filter(Boolean);
  const last = parts[parts.length - 1]?.replace('.md', '') ?? 'Index';
  if (parts.length <= 1) return [last];
  return ['Index', ...parts.slice(0, -1), last];
}
</script>

<template>
  <div v-if="visible" class="doc-panel">
    <div class="doc-header">
      <span class="doc-label">DOC</span>
      <span class="doc-sep">│</span>
      <button
        class="doc-nav-btn"
        :disabled="history.length === 0"
        @click="goBack"
        title="Back"
      >←</button>
      <button class="doc-nav-btn" @click="goHome" title="Index">⌂</button>
      <span class="doc-sep">│</span>
      <span class="doc-breadcrumb">
        <span v-for="(part, i) in breadcrumb()" :key="i">
          <span v-if="i > 0" class="doc-sep-light"> › </span>
          <span :class="{ 'doc-crumb-current': i === breadcrumb().length - 1 }">{{ part }}</span>
        </span>
      </span>
      <span class="doc-spacer" />
      <button
        v-if="showBasic"
        class="doc-nav-btn"
        @click="toggleLayout"
        :title="docLayout === 'side' ? 'Switch to stacked layout' : 'Switch to side-by-side layout'"
      >{{ docLayout === 'side' ? '⬒' : '⬓' }}</button>
      <button class="doc-nav-btn doc-close" @click="close" title="Close">✕</button>
    </div>
    <div
      ref="contentEl"
      class="doc-content"
      @click="onContentClick"
      v-html="htmlContent"
    />
    <div v-if="loading" class="doc-loading">Loading...</div>
  </div>
</template>

<style scoped>
.doc-panel {
  background: #0a0a0a;
  border-top: 2px solid #8bc34a;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 400px;
  text-align: left;
}

.doc-header {
  background: #1a1a1a;
  padding: 4px 8px;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  font-family: 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
}

.doc-label {
  color: #8bc34a;
  font-weight: bold;
}

.doc-sep {
  color: #444;
}

.doc-sep-light {
  color: #555;
}

.doc-nav-btn {
  background: none;
  border: 1px solid #444;
  border-radius: 3px;
  color: #7eb8f7;
  cursor: pointer;
  padding: 0 4px;
  font-family: inherit;
  font-size: 0.75rem;
  line-height: 1.3;
}
.doc-nav-btn:hover {
  background: #222;
}
.doc-nav-btn:disabled {
  color: #444;
  cursor: default;
}
.doc-nav-btn:disabled:hover {
  background: none;
}
.doc-close {
  color: #888;
}
.doc-close:hover {
  color: #ccc;
}

.doc-breadcrumb {
  color: #666;
  font-size: 0.7rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.doc-crumb-current {
  color: #ccc;
}

.doc-spacer {
  flex: 1;
}

.doc-content {
  flex: 1;
  overflow: auto;
  padding: 12px 16px;
  color: #ccc;
  font-family: 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.doc-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 0.8rem;
}

/* Markdown element styling */
.doc-content :deep(h1) { font-size: 1.3rem; color: #fff; margin: 0 0 8px 0; border-bottom: 1px solid #333; padding-bottom: 6px; }
.doc-content :deep(h2) { font-size: 1.1rem; color: #e5c07b; margin: 16px 0 6px 0; }
.doc-content :deep(h3) { font-size: 0.95rem; color: #bbb; margin: 12px 0 4px 0; }
.doc-content :deep(h4) { font-size: 0.8rem; color: #888; margin: 10px 0 3px 0; text-transform: uppercase; letter-spacing: 0.5px; }
.doc-content :deep(p) { margin: 6px 0; }
.doc-content :deep(a) { color: #7eb8f7; text-decoration: none; }
.doc-content :deep(a:hover) { text-decoration: underline; }
.doc-content :deep(code) { background: #1a1a1a; padding: 1px 5px; border-radius: 3px; font-size: 0.9em; }
.doc-content :deep(pre) { background: #111; border: 1px solid #222; border-radius: 4px; padding: 8px 10px; overflow-x: auto; margin: 6px 0; white-space: pre-wrap; word-wrap: break-word; }
.doc-content :deep(pre code) { background: none; padding: 0; }
.doc-content :deep(table) { border-collapse: collapse; width: 100%; margin: 8px 0; table-layout: fixed; word-wrap: break-word; }
.doc-content :deep(th) { background: #1a1a1a; color: #aaa; padding: 4px 8px; border: 1px solid #333; text-align: left; font-size: 0.8em; }
.doc-content :deep(td) { padding: 4px 8px; border: 1px solid #222; font-size: 0.8em; }
.doc-content :deep(ul), .doc-content :deep(ol) { padding-left: 20px; margin: 4px 0; }
.doc-content :deep(li) { margin: 2px 0; }
.doc-content :deep(blockquote) { border-left: 3px solid #444; margin: 8px 0; padding: 4px 12px; color: #999; }
.doc-content :deep(hr) { border: none; border-top: 1px solid #333; margin: 12px 0; }
.doc-content :deep(strong) { color: #ddd; }
</style>
