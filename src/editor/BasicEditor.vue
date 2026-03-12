<!-- src/editor/BasicEditor.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { basicLanguage } from './cm-basic-lang.js';
import { basicEditorTheme, basicHighlighting } from './cm-basic-theme.js';

const props = defineProps<{
  initialCode?: string;
  multiline?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits<{
  submit: [code: string];
  cancel: [];
  change: [code: string];
}>();

const editorRef = ref<HTMLDivElement>();
let view: EditorView | null = null;

function getContent(): string {
  return view?.state.doc.toString() ?? '';
}

function setContent(text: string): void {
  if (!view) return;
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: text },
  });
}

function focus(): void {
  view?.focus();
}

defineExpose({ getContent, setContent, focus });

onMounted(() => {
  if (!editorRef.value) return;

  const submitKey = props.multiline
    ? { key: 'Ctrl-Enter', run: () => { emit('submit', getContent()); return true; } }
    : { key: 'Enter', run: () => { emit('submit', getContent()); return true; } };

  const extensions = [
    basicLanguage,
    basicEditorTheme,
    basicHighlighting,
    history(),
    keymap.of([
      submitKey,
      { key: 'Escape', run: () => { emit('cancel'); return true; } },
      ...historyKeymap,
      ...defaultKeymap,
    ]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit('change', getContent());
      }
    }),
  ];

  // Single-line: prevent Enter from inserting newline
  if (!props.multiline) {
    extensions.push(EditorState.transactionFilter.of(tr => {
      if (tr.newDoc.lines > 1) return [];
      return tr;
    }));
  }

  view = new EditorView({
    state: EditorState.create({
      doc: props.initialCode ?? '',
      extensions,
    }),
    parent: editorRef.value,
  });

  view.focus();
});

onBeforeUnmount(() => {
  view?.destroy();
  view = null;
});

watch(() => props.initialCode, (newVal) => {
  if (newVal !== undefined && view && getContent() !== newVal) {
    setContent(newVal);
  }
});
</script>

<template>
  <div ref="editorRef" class="basic-editor"
       :class="{ multiline: props.multiline }" />
</template>

<style scoped>
.basic-editor {
  width: 100%;
  border: 1px solid #333;
  border-radius: 2px;
  overflow: hidden;
}
.basic-editor:focus-within {
  border-color: #555;
}
.basic-editor.multiline {
  min-height: 60px;
  max-height: 250px;
  overflow-y: auto;
}
</style>
