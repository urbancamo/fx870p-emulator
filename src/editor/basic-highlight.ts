// src/editor/basic-highlight.ts
//
// Lightweight BASIC syntax highlighter that produces HTML spans.
// Used for read-only listing display and rich-text clipboard export.
// Shares keyword classification with the CodeMirror language definition.

import { PREFIX4, PREFIX5, PREFIX6, PREFIX7 } from '../emulator/basic-tokens.js';

// Build keyword sets by category
const STATEMENT_KEYWORDS = new Set<string>();
const FUNCTION_KEYWORDS = new Set<string>();
const STRING_FUNCTION_KEYWORDS = new Set<string>();
const OPERATOR_KEYWORDS = new Set<string>();

for (const kw of PREFIX4) { if (kw) STATEMENT_KEYWORDS.add(kw); }
for (const kw of PREFIX5) { if (kw) FUNCTION_KEYWORDS.add(kw); }
for (const kw of PREFIX6) { if (kw) STRING_FUNCTION_KEYWORDS.add(kw); }
for (const kw of PREFIX7) { if (kw) OPERATOR_KEYWORDS.add(kw); }

const HYP_TRIG = new Set(['SIN', 'COS', 'TAN', 'ASN', 'ACS', 'ATN']);

// Keyword regex (greedy longest match)
const ALL_KW = new Set([
  ...STATEMENT_KEYWORDS, ...FUNCTION_KEYWORDS,
  ...STRING_FUNCTION_KEYWORDS, ...OPERATOR_KEYWORDS,
]);
const kwSorted = [...ALL_KW].sort((a, b) => b.length - a.length);
const kwPattern = kwSorted.map(k => k.replace(/[$#]/g, '\\$&')).join('|');
const KEYWORD_RE = new RegExp(`^(?:${kwPattern})(?![A-Z0-9_])`, 'i');
const NUM_RE = /^\d+(\.\d*)?([eE][+-]?\d+)?/;
const OP_RE = /^[+\-*/^=<>(),:;]/;
const IDENT_RE = /^[A-Za-z_]\w*\$?/;

// ── Token types ──────────────────────────────────────────────────────────────

type TokenType = 'keyword' | 'function' | 'operator-kw' | 'string' | 'number'
  | 'comment' | 'variable' | 'operator' | null;

interface Token {
  type: TokenType;
  text: string;
}

// ── Core tokenizer ───────────────────────────────────────────────────────────

function tokenizeLine(text: string): Token[] {
  const upper = text.toUpperCase();
  const tokens: Token[] = [];
  let i = 0;
  let inString = false;
  let inRem = false;
  let afterHyp = false;

  while (i < text.length) {
    if (inRem) {
      tokens.push({ type: 'comment', text: text.substring(i) });
      break;
    }

    if (inString) {
      if (text[i] === '"') {
        tokens.push({ type: 'string', text: '"' });
        i++;
        inString = false;
      } else {
        let end = i;
        while (end < text.length && text[end] !== '"') end++;
        tokens.push({ type: 'string', text: text.substring(i, end) });
        i = end;
      }
      continue;
    }

    if (text[i] === ' ') {
      let end = i;
      while (end < text.length && text[end] === ' ') end++;
      tokens.push({ type: null, text: text.substring(i, end) });
      i = end;
      continue;
    }

    if (text[i] === '"') {
      tokens.push({ type: 'string', text: '"' });
      i++;
      inString = true;
      continue;
    }

    if (text[i] === "'") {
      tokens.push({ type: 'comment', text: text.substring(i) });
      break;
    }

    if (afterHyp) {
      afterHyp = false;
      let matched = false;
      for (const trig of HYP_TRIG) {
        const sub = upper.substring(i);
        if (sub.startsWith(trig) && (i + trig.length >= upper.length ||
            !/[A-Z0-9_]/.test(upper[i + trig.length]))) {
          tokens.push({ type: 'keyword', text: text.substring(i, i + trig.length) });
          i += trig.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    const kwMatch = upper.substring(i).match(KEYWORD_RE);
    if (kwMatch) {
      const kw = kwMatch[0];
      const kwUpper = kw.toUpperCase();
      let cls: TokenType = 'keyword';

      if (FUNCTION_KEYWORDS.has(kwUpper) || STRING_FUNCTION_KEYWORDS.has(kwUpper)) {
        cls = 'function';
      } else if (OPERATOR_KEYWORDS.has(kwUpper)) {
        cls = 'operator-kw';
      }

      if (kwUpper === 'REM') {
        tokens.push({ type: 'keyword', text: text.substring(i, i + kw.length) });
        i += kw.length;
        inRem = true;
        continue;
      }

      if (kwUpper === 'HYP') {
        afterHyp = true;
      }

      tokens.push({ type: cls, text: text.substring(i, i + kw.length) });
      i += kw.length;
      continue;
    }

    const numMatch = text.substring(i).match(NUM_RE);
    if (numMatch && (i === 0 || !/[A-Za-z_$]/.test(text[i - 1]))) {
      tokens.push({ type: 'number', text: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }

    const opMatch = text.substring(i).match(OP_RE);
    if (opMatch) {
      tokens.push({ type: 'operator', text: opMatch[0] });
      i += opMatch[0].length;
      continue;
    }

    const idMatch = text.substring(i).match(IDENT_RE);
    if (idMatch) {
      tokens.push({ type: 'variable', text: idMatch[0] });
      i += idMatch[0].length;
      continue;
    }

    tokens.push({ type: null, text: text[i] });
    i++;
  }

  return tokens;
}

// ── HTML renderers ───────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Highlight a BASIC line body using CSS classes (for in-page display).
 * Returns HTML with <span class="hl-*"> wrappers.
 */
export function highlightBasic(text: string): string {
  return tokenizeLine(text).map(t =>
    t.type ? `<span class="hl-${t.type}">${esc(t.text)}</span>` : esc(t.text)
  ).join('');
}

// Inline style themes for clipboard export (self-contained, no external CSS needed)
export type ExportTheme = 'dark' | 'light';

const DARK_STYLES: Record<string, string> = {
  'keyword':     'color:#6cb6ff',
  'function':    'color:#d2a8ff',
  'operator-kw': 'color:#f0a030',
  'string':      'color:#7ee787',
  'number':      'color:#f0c040',
  'comment':     'color:#666;font-style:italic',
  'variable':    'color:#ccc',
  'operator':    'color:#aaa',
};

const LIGHT_STYLES: Record<string, string> = {
  'keyword':     'color:#0550ae',
  'function':    'color:#6639ba',
  'operator-kw': 'color:#b35900',
  'string':      'color:#116329',
  'number':      'color:#953800',
  'comment':     'color:#8b949e;font-style:italic',
  'variable':    'color:#24292f',
  'operator':    'color:#57606a',
};

/**
 * Highlight a BASIC line body using inline styles (for clipboard export).
 * Returns self-contained HTML that renders correctly without external CSS.
 */
function highlightBasicInline(text: string, theme: ExportTheme = 'dark'): string {
  const styles = theme === 'light' ? LIGHT_STYLES : DARK_STYLES;
  return tokenizeLine(text).map(t => {
    if (t.type && styles[t.type]) {
      return `<span style="${styles[t.type]}">${esc(t.text)}</span>`;
    }
    return esc(t.text);
  }).join('');
}

/**
 * Generate a complete HTML snippet for a BASIC program listing,
 * suitable for clipboard export. Includes inline styles so it
 * renders correctly when pasted into rich-text editors.
 */
export function exportListingHtml(
  lines: { num: number; text: string }[],
  slotLabel?: string,
  theme: ExportTheme = 'dark',
): string {
  const isDark = theme === 'dark';
  const headerColor = isDark ? '#9ecbff' : '#0550ae';
  const numColor = isDark ? '#777' : '#8b949e';
  const preStyle = isDark
    ? 'background:#0a0a0a;color:#ccc'
    : 'background:transparent;color:#24292f';

  const header = slotLabel
    ? `<div style="color:${headerColor};font-weight:bold;margin-bottom:4px">${esc(slotLabel)}</div>\n`
    : '';
  const lineHtml = lines.map(l => {
    const numStr = String(l.num).padStart(5, '\u00A0');
    return `<span style="color:${numColor}">${esc(numStr)}</span> ${highlightBasicInline(l.text, theme)}`;
  }).join('\n');

  return `${header}<pre style="font-family:'Consolas','Menlo','Monaco','Courier New',monospace;font-size:13px;${preStyle};padding:8px 12px;border-radius:4px;line-height:1.5">${lineHtml}</pre>`;
}
