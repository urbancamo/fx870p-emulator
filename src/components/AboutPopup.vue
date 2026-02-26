<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { marked } from 'marked';

const base = import.meta.env.BASE_URL;

const emit = defineEmits<{ (e: 'close'): void }>();

const logoUrl = `${base}images/casio-logo.svg`;
const htmlContent = ref('');

onMounted(async () => {
  try {
    const res = await fetch(`${base}ABOUT.md`);
    const md = await res.text();
    htmlContent.value = await marked(md);
  } catch {
    htmlContent.value = '<p>Failed to load about content.</p>';
  }
});

function onBackdrop(e: MouseEvent): void {
  if (e.target === e.currentTarget) emit('close');
}
</script>

<template>
  <div class="about-backdrop" @click="onBackdrop">
    <div class="about-popup">
      <div class="about-logo" :style="{ backgroundImage: `url(${logoUrl})` }" />
      <div class="about-content" v-html="htmlContent" />
      <div class="about-footer">
        <button class="about-close-btn" @click="emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.about-popup {
  width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.about-logo {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 70%;
  opacity: 0.07;
  pointer-events: none;
}

.about-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 48px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #ccc;
}

/* Markdown element styles */
.about-content :deep(h1) {
  font-size: 1.8rem;
  color: #fff;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
  margin: 0 0 16px;
}

.about-content :deep(h2) {
  font-size: 1.3rem;
  color: #ddd;
  margin: 24px 0 12px;
}

.about-content :deep(h3) {
  font-size: 1.1rem;
  color: #bbb;
  margin: 20px 0 8px;
}

.about-content :deep(p) {
  margin: 8px 0;
}

.about-content :deep(a) {
  color: #7eb8f7;
  text-decoration: none;
}
.about-content :deep(a:hover) {
  text-decoration: underline;
}

.about-content :deep(code) {
  background: #2a2a2a;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.85em;
  color: #e0e0e0;
}

.about-content :deep(pre) {
  background: #0d0d0d;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 12px 16px;
  overflow-x: auto;
}

.about-content :deep(pre code) {
  background: none;
  padding: 0;
}

.about-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

.about-content :deep(th),
.about-content :deep(td) {
  border: 1px solid #333;
  padding: 6px 12px;
  text-align: left;
}

.about-content :deep(th) {
  background: #222;
  color: #ddd;
}

.about-content :deep(ul),
.about-content :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.about-content :deep(li) {
  margin: 4px 0;
}

.about-content :deep(blockquote) {
  border-left: 3px solid #444;
  margin: 12px 0;
  padding: 4px 16px;
  color: #999;
}

.about-content :deep(hr) {
  border: none;
  border-top: 1px solid #333;
  margin: 24px 0;
}

.about-content :deep(img) {
  max-width: 100%;
}

.about-footer {
  display: flex;
  justify-content: center;
  padding: 12px;
  border-top: 1px solid #333;
  background: #111;
}

.about-close-btn {
  padding: 6px 32px;
  font-family: monospace;
  font-size: 0.85rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
}
.about-close-btn:hover {
  background: #3a3a3a;
  color: #fff;
}
</style>
