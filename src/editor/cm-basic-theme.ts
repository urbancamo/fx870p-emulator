// src/editor/cm-basic-theme.ts
//
// CodeMirror 6 dark theme for the FX-870P BASIC editor panel.
// Matches the panel's #111 / #0a0a0a background.

import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

export const basicEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: '#0a0a0a',
    color: '#ccc',
    fontSize: '0.72rem',
    fontFamily: '"Consolas", "Menlo", "Monaco", "Courier New", monospace',
  },
  '&.cm-focused': {
    outline: '1px solid #444',
  },
  '.cm-content': {
    caretColor: '#f0a030',
    padding: '2px 0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#f0a030',
  },
  '.cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#264f78 !important',
  },
  '.cm-activeLine': {
    backgroundColor: '#1a1a2a',
  },
  '.cm-gutters': {
    backgroundColor: '#111',
    color: '#555',
    borderRight: '1px solid #222',
    fontSize: '0.65rem',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#1a1a2a',
  },
  '.cm-line': {
    padding: '0 4px',
  },
}, { dark: true });

export const basicHighlighting = syntaxHighlighting(HighlightStyle.define([
  // Statements (PRINT, GOTO, FOR, IF, etc.)
  { tag: tags.keyword, color: '#6cb6ff' },
  // Functions (SIN, ABS, LEN, etc.) and string functions (MID$, etc.)
  { tag: tags.typeName, color: '#d2a8ff' },
  // Operators (AND, OR, NOT, MOD, THEN, ELSE, TO, STEP)
  { tag: tags.operatorKeyword, color: '#f0a030' },
  // String literals
  { tag: tags.string, color: '#7ee787' },
  // Numeric literals
  { tag: tags.number, color: '#f0c040' },
  // Comments (REM, ')
  { tag: tags.comment, color: '#666', fontStyle: 'italic' },
  // Line numbers
  { tag: tags.labelName, color: '#777' },
  // Variables
  { tag: tags.variableName, color: '#ccc' },
  // Operators (+, -, *, etc.)
  { tag: tags.operator, color: '#aaa' },
]));
