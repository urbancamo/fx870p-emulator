// src/editor/cm-basic-lang.ts
//
// CodeMirror 6 StreamLanguage definition for FX-870P BASIC.
// Provides syntax highlighting as-you-type.

import { StreamLanguage } from '@codemirror/language';
import { PREFIX4, PREFIX5, PREFIX6, PREFIX7 } from '../emulator/basic-tokens.js';

// Build keyword sets by category for token coloring
const STATEMENT_KEYWORDS = new Set<string>();
const FUNCTION_KEYWORDS = new Set<string>();
const STRING_FUNCTION_KEYWORDS = new Set<string>();
const OPERATOR_KEYWORDS = new Set<string>();

for (const kw of PREFIX4) {
  if (kw) STATEMENT_KEYWORDS.add(kw);
}
for (const kw of PREFIX5) {
  if (kw) FUNCTION_KEYWORDS.add(kw);
}
for (const kw of PREFIX6) {
  if (kw) STRING_FUNCTION_KEYWORDS.add(kw);
}
// PREFIX7: operators and modifiers
for (const kw of PREFIX7) {
  if (kw) OPERATOR_KEYWORDS.add(kw);
}

// Compound: HYP SIN etc.
const HYP_TRIG = new Set(['SIN', 'COS', 'TAN', 'ASN', 'ACS', 'ATN']);

// Build regex for all keywords (sorted by length desc for greedy match)
const ALL_KW = new Set([
  ...STATEMENT_KEYWORDS,
  ...FUNCTION_KEYWORDS,
  ...STRING_FUNCTION_KEYWORDS,
  ...OPERATOR_KEYWORDS,
]);
const kwSorted = [...ALL_KW].sort((a, b) => b.length - a.length);
// Escape $ and # for regex
const kwPattern = kwSorted.map(k => k.replace(/[$#]/g, '\\$&')).join('|');
const KEYWORD_REGEX = new RegExp(`^(?:${kwPattern})(?![A-Z0-9_])`, 'i');

interface BasicState {
  inString: boolean;
  inRem: boolean;
  afterHyp: boolean;
}

export const basicLanguage = StreamLanguage.define<BasicState>({
  startState: () => ({ inString: false, inRem: false, afterHyp: false }),

  token(stream, state): string | null {
    // After REM or ', rest of line is comment
    if (state.inRem) {
      stream.skipToEnd();
      return 'comment';
    }

    // Inside "..." string literal
    if (state.inString) {
      if (stream.eat('"')) {
        state.inString = false;
        return 'string';
      }
      stream.next();
      return 'string';
    }

    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Start of string
    if (stream.eat('"')) {
      state.inString = true;
      return 'string';
    }

    // Apostrophe = REM shorthand
    if (stream.eat("'")) {
      state.inRem = true;
      stream.skipToEnd();
      return 'comment';
    }

    // Line numbers at start of line
    if (stream.sol() && stream.match(/^\d+/)) {
      return 'labelName';
    }

    // After HYP, match the trig function
    if (state.afterHyp) {
      state.afterHyp = false;
      for (const trig of HYP_TRIG) {
        if (stream.match(new RegExp(`^${trig}(?![A-Z0-9_])`, 'i'))) {
          return 'keyword';
        }
      }
    }

    // Try keyword match
    const kwMatch = stream.match(KEYWORD_REGEX) as RegExpMatchArray | false;
    if (kwMatch) {
      const upper = kwMatch[0].toUpperCase();

      if (upper === 'REM') {
        state.inRem = true;
        return 'keyword';
      }
      if (upper === 'HYP') {
        state.afterHyp = true;
        return 'keyword';
      }

      if (STATEMENT_KEYWORDS.has(upper)) return 'keyword';
      if (FUNCTION_KEYWORDS.has(upper)) return 'typeName';
      if (STRING_FUNCTION_KEYWORDS.has(upper)) return 'typeName';
      if (OPERATOR_KEYWORDS.has(upper)) return 'operatorKeyword';
      return 'keyword';
    }

    // Numeric literals
    if (stream.match(/^\d+(\.\d*)?([eE][+-]?\d+)?/)) {
      return 'number';
    }

    // Operators
    if (stream.match(/^[+\-*/^=<>(),:;]/)) {
      return 'operator';
    }

    // Variables and identifiers
    if (stream.match(/^[A-Za-z_]\w*\$?/)) {
      return 'variableName';
    }

    // Fallback: consume one character
    stream.next();
    return null;
  },

  languageData: {
    commentTokens: { line: "'" },
  },
});
