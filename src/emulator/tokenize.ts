// src/emulator/tokenize.ts
//
// BASIC tokenizer for the FX-870P / VX-4.
// Reverse of detokenize.ts — converts BASIC source text into the
// calculator's tokenized binary format.

import { PREFIX4, PREFIX5, PREFIX6, PREFIX7 } from './basic-tokens.js';
import { casioToUnicode } from './casio-ascii.js';

// ── Reverse lookup tables ────────────────────────────────────────────────────

// Build Unicode → Casio byte map from the casioToUnicode table
const UNICODE_TO_CASIO = new Map<string, number>();
for (let b = 0x20; b <= 0xFF; b++) {
  const u = casioToUnicode(b);
  if (!UNICODE_TO_CASIO.has(u)) {
    UNICODE_TO_CASIO.set(u, b);
  }
}

// Keyword → [prefix_byte, code_byte] reverse map
// Sorted by keyword length descending for greedy matching
export interface KeywordEntry {
  keyword: string;
  prefix: number;
  code: number;
}

const KEYWORD_LIST: KeywordEntry[] = [];
const PREFIXES_ARRAY = [PREFIX4, PREFIX5, PREFIX6, PREFIX7];
const CODE_BASE = 0x47;

for (let pi = 0; pi < PREFIXES_ARRAY.length; pi++) {
  const table = PREFIXES_ARRAY[pi];
  const prefixByte = 0x04 + pi;
  for (let ci = 0; ci < table.length; ci++) {
    const kw = table[ci];
    if (kw) {
      KEYWORD_LIST.push({ keyword: kw, prefix: prefixByte, code: CODE_BASE + ci });
    }
  }
}

// Add hyperbolic function compound keywords (HYP SIN, HYP COS, etc.)
const HYPER_ENTRIES: KeywordEntry[] = [
  { keyword: 'HYP SIN', prefix: 0x05, code: 0x71 },
  { keyword: 'HYP COS', prefix: 0x05, code: 0x72 },
  { keyword: 'HYP TAN', prefix: 0x05, code: 0x73 },
  { keyword: 'HYP ASN', prefix: 0x05, code: 0x74 },
  { keyword: 'HYP ACS', prefix: 0x05, code: 0x75 },
  { keyword: 'HYP ATN', prefix: 0x05, code: 0x76 },
];

// Sort all keywords by length descending for greedy matching
const ALL_KEYWORDS = [...HYPER_ENTRIES, ...KEYWORD_LIST]
  .sort((a, b) => b.keyword.length - a.keyword.length);

// Build a quick lookup map for exact keyword match
const KEYWORD_MAP = new Map<string, KeywordEntry>();
for (const entry of ALL_KEYWORDS) {
  // First entry wins (longer entries added first due to sort)
  if (!KEYWORD_MAP.has(entry.keyword)) {
    KEYWORD_MAP.set(entry.keyword, entry);
  }
}

// Keywords after which a number should be encoded as a binary line reference (0x03)
const LINE_REF_KEYWORDS = new Set([
  'GOTO', 'GOSUB', 'THEN', 'RESTORE', 'RESUME', 'RUN',
]);

// ── Public API ───────────────────────────────────────────────────────────────

export interface TokenizedLine {
  lineNum: number;
  bytes: Uint8Array; // complete record: recLen + lineNum(LE) + body + 0x00
}

/**
 * Tokenize a single BASIC line body (without line number prefix).
 * Returns the token bytes for the body only (no record header).
 */
export function tokenizeBody(text: string): number[] {
  const upper = text.toUpperCase();
  const bytes: number[] = [];
  let i = 0;
  let inRem = false;

  while (i < upper.length) {
    // After REM or apostrophe, rest is raw ASCII
    if (inRem) {
      const match = matchCasioChar(text, i);
      if (match === null) {
        throw new Error(`Character '${text[i]}' (U+${text.codePointAt(i)!.toString(16).padStart(4, '0')}) has no Casio ASCII mapping`);
      }
      bytes.push(match[0]);
      i += match[1];
      continue;
    }

    // Skip spaces (emit as literal)
    if (upper[i] === ' ') {
      bytes.push(0x20);
      i++;
      continue;
    }

    // String literals — emit raw until closing quote
    if (upper[i] === '"') {
      bytes.push(0x22); // "
      i++;
      while (i < text.length && text[i] !== '"') {
        const match = matchCasioChar(text, i);
        if (match === null) {
          throw new Error(`Character '${text[i]}' (U+${text.codePointAt(i)!.toString(16).padStart(4, '0')}) has no Casio ASCII mapping`);
        }
        bytes.push(match[0]);
        i += match[1];
      }
      if (i < text.length) {
        bytes.push(0x22); // closing "
        i++;
      }
      continue;
    }

    // Apostrophe = REM shorthand
    if (upper[i] === "'") {
      bytes.push(0x02);
      i++;
      inRem = true;
      continue;
    }

    // Colon — statement separator
    if (upper[i] === ':') {
      bytes.push(0x01);
      i++;
      continue;
    }

    // Try keyword match (greedy longest match)
    const kwMatch = matchKeyword(upper, i);
    if (kwMatch) {
      const { entry, length } = kwMatch;

      // Special: ELSE needs hidden colon before it
      if (entry.keyword === 'ELSE') {
        // Add hidden colon if not already present
        if (bytes.length === 0 || bytes[bytes.length - 1] !== 0x01) {
          bytes.push(0x01);
        }
      }

      bytes.push(entry.prefix, entry.code);
      i += length;

      // After REM keyword, rest of line is raw
      if (entry.keyword === 'REM') {
        inRem = true;
      }

      // After line-ref keywords, check for numeric line reference
      if (LINE_REF_KEYWORDS.has(entry.keyword)) {
        // Skip spaces
        while (i < upper.length && upper[i] === ' ') {
          bytes.push(0x20);
          i++;
        }
        // Parse line number if next thing is a digit
        const numMatch = upper.substring(i).match(/^\d+/);
        if (numMatch) {
          const lineRef = parseInt(numMatch[0], 10);
          if (lineRef >= 0 && lineRef <= 65535) {
            bytes.push(0x03, lineRef & 0xFF, (lineRef >> 8) & 0xFF);
            i += numMatch[0].length;
          }
        }
      }

      continue;
    }

    // Numeric literal — emit as raw ASCII
    if (upper[i] >= '0' && upper[i] <= '9') {
      while (i < upper.length && ((upper[i] >= '0' && upper[i] <= '9') || upper[i] === '.')) {
        bytes.push(upper.charCodeAt(i));
        i++;
      }
      // Handle E notation
      if (i < upper.length && (upper[i] === 'E') && i + 1 < upper.length &&
          (upper[i + 1] >= '0' && upper[i + 1] <= '9' || upper[i + 1] === '+' || upper[i + 1] === '-')) {
        bytes.push(upper.charCodeAt(i)); // E
        i++;
        if (upper[i] === '+' || upper[i] === '-') {
          bytes.push(upper.charCodeAt(i));
          i++;
        }
        while (i < upper.length && upper[i] >= '0' && upper[i] <= '9') {
          bytes.push(upper.charCodeAt(i));
          i++;
        }
      }
      continue;
    }

    // Default: emit as Casio ASCII byte
    const casioMatch = matchCasioChar(text, i);
    if (casioMatch === null) {
      throw new Error(`Character '${text[i]}' (U+${text.codePointAt(i)!.toString(16).padStart(4, '0')}) has no Casio ASCII mapping`);
    }
    bytes.push(casioMatch[0]);
    i += casioMatch[1];
  }

  return bytes;
}

/**
 * Tokenize a line number + text into a complete binary record.
 */
export function tokenizeLine(lineNum: number, text: string): TokenizedLine {
  if (lineNum < 1 || lineNum > 65535) {
    throw new Error(`Line number ${lineNum} out of range (1-65535)`);
  }

  const body = tokenizeBody(text);
  // Record: recLen + lineNum(2) + body + 0x00 terminator
  const recLen = 2 + body.length + 1; // linenum(2) + body + terminator
  if (recLen > 255) {
    throw new Error(`Line too long: ${recLen} bytes (max 255)`);
  }

  const bytes = new Uint8Array(1 + recLen);
  bytes[0] = recLen;
  bytes[1] = lineNum & 0xFF;
  bytes[2] = (lineNum >> 8) & 0xFF;
  for (let i = 0; i < body.length; i++) {
    bytes[3 + i] = body[i];
  }
  bytes[bytes.length - 1] = 0x00; // terminator

  return { lineNum, bytes };
}

/**
 * Tokenize a full program (array of lines) into a contiguous byte sequence.
 * Lines are sorted by line number. A 0x00 end-of-program marker is appended.
 */
export function tokenizeProgram(lines: { num: number; text: string }[]): Uint8Array {
  const sorted = [...lines].sort((a, b) => a.num - b.num);
  const tokenized = sorted.map(l => tokenizeLine(l.num, l.text));

  // Calculate total size
  let totalSize = 0;
  for (const t of tokenized) totalSize += t.bytes.length;
  totalSize += 1; // end-of-program 0x00

  const result = new Uint8Array(totalSize);
  let offset = 0;
  for (const t of tokenized) {
    result.set(t.bytes, offset);
    offset += t.bytes.length;
  }
  result[offset] = 0x00; // end-of-program marker

  return result;
}

/**
 * Parse a full BASIC listing text (with line numbers) into individual lines.
 * Each line should start with a line number followed by the BASIC text.
 */
export function parseListingText(text: string): { num: number; text: string }[] {
  const lines: { num: number; text: string }[] = [];
  for (const raw of text.split('\n')) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(\d+)\s+(.*)/);
    if (!match) {
      throw new Error(`Invalid line format: "${trimmed}" — must start with a line number`);
    }
    const num = parseInt(match[1], 10);
    if (num < 1 || num > 65535) {
      throw new Error(`Line number ${num} out of range (1-65535)`);
    }
    lines.push({ num, text: match[2] });
  }
  return lines;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Try to match a Casio character at position `pos` in `text`.
 * Returns [casio_byte, chars_consumed] or null.
 * Handles surrogate pairs (2 UTF-16 code units) and multi-char
 * mappings like ⁻¹ (2 codepoints).
 */
function matchCasioChar(text: string, pos: number): [number, number] | null {
  // Try 2-char match first (e.g. ⁻¹ = U+207B U+00B9 → 0x9E)
  if (pos + 1 < text.length) {
    const two = text.substring(pos, pos + 2);
    const mapped2 = UNICODE_TO_CASIO.get(two);
    if (mapped2 !== undefined) return [mapped2, 2];
  }

  // Single codepoint (may be a surrogate pair = 2 UTF-16 code units)
  const cp = text.codePointAt(pos);
  if (cp === undefined) return null;
  const ch = String.fromCodePoint(cp);
  const mapped = UNICODE_TO_CASIO.get(ch);
  if (mapped !== undefined) return [mapped, ch.length];

  return null;
}

function matchKeyword(text: string, pos: number): { entry: KeywordEntry; length: number } | null {
  const remaining = text.length - pos;

  for (const entry of ALL_KEYWORDS) {
    const kwLen = entry.keyword.length;
    if (kwLen > remaining) continue;

    // Check if the keyword matches at this position
    if (text.substring(pos, pos + kwLen) !== entry.keyword) continue;

    // Word boundary check: keyword must not be followed by an alphanumeric char
    // (prevents matching FOR inside FORMAT, TO inside STOP, etc.)
    // Exception: keywords ending with $ (like MID$, LEFT$) don't need boundary
    if (!entry.keyword.endsWith('$') && !entry.keyword.endsWith('#')) {
      if (pos + kwLen < text.length) {
        const nextChar = text[pos + kwLen];
        if ((nextChar >= 'A' && nextChar <= 'Z') || (nextChar >= '0' && nextChar <= '9') || nextChar === '_') {
          continue;
        }
      }
      // Also check preceding char for word boundary (avoid matching AND inside RAND)
      if (pos > 0) {
        const prevChar = text[pos - 1];
        if ((prevChar >= 'A' && prevChar <= 'Z') || (prevChar >= '0' && prevChar <= '9') || prevChar === '_' || prevChar === '$') {
          continue;
        }
      }
    }

    return { entry, length: kwLen };
  }

  return null;
}
