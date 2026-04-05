// tools/compiler/lexer.ts
// Lexer for Casio JIS Standard BASIC (FX-870P / VX-4)

export const enum TokenType {
  // Literals
  LineNumber,     // leading integer on a BASIC line
  Number,         // numeric literal in an expression context: 3, 3.14, 3.14E-5
  StringLiteral,  // "hello"
  HexLiteral,     // &HFF

  // Identifiers / keywords
  Keyword,        // reserved word(s) — may be multi-word (e.g. "HYP SIN")
  Ident,          // variable name, may end with $ for string vars

  // Operators (normalised)
  Plus,           // +
  Minus,          // -
  Star,           // *
  Slash,          // /
  BackSlash,      // \ (integer division)
  Caret,          // ^
  Eq,             // =
  Ne,             // <>  (normalised from >< as well)
  Lt,             // <
  Gt,             // >
  Le,             // <=  (normalised from =<)
  Ge,             // >=  (normalised from =>)

  // Punctuation
  LParen,         // (
  RParen,         // )
  Comma,          // ,
  Semicolon,      // ;
  Colon,          // :
  Hash,           // #

  // Special
  Comment,        // REM or ' — the rest of the line
  EOL,            // end of tokenised line
}

export interface Token {
  type: TokenType;
  /** Normalised text for keywords/idents; raw text for literals. */
  value: string;
  /** Zero-based column where the token starts. */
  col: number;
}

// ---------------------------------------------------------------------------
// Keyword tables
// All entries are stored / matched in UPPER CASE.
// ---------------------------------------------------------------------------

// Three-word compound keywords
const KEYWORDS3: readonly string[] = [
  'ON ERROR GOTO',
];

// Two-word compound keywords
const KEYWORDS2: readonly string[] = [
  'HYP SIN',
  'HYP COS',
  'HYP TAN',
  'HYP ASN',
  'HYP ACS',
  'HYP ATN',
  'RESUME NEXT',
  'STAT CLEAR',
  'LINE INPUT#',
];

// Single-word keywords
const KEYWORDS1: readonly string[] = [
  'CALCJMP', 'VARLIST', 'DEFSEG', 'DEFCHR$', 'SYSTEM', 'VERIFY',
  'RESTORE', 'FORMAT', 'TRON', 'TROFF', 'MERGE', 'RENUM', 'DELETE',
  'DEFM', 'PRINT', 'LPRINT', 'INPUT', 'INPUT$', 'INKEY$', 'GOSUB',
  'RETURN', 'WHILE', 'ERASE', 'CLEAR', 'LOCATE', 'ANGLE', 'USING',
  'WRITE#', 'READ#', 'PRINT#', 'INPUT#', 'RESTORE#', 'CHAIN', 'BEEP',
  'POKE', 'PEEK', 'DATA', 'READ', 'NEXT', 'STEP', 'THEN', 'ELSE',
  'GOTO', 'WEND', 'STOP', 'CONT', 'OPEN', 'CLOSE', 'APPEND', 'OUTPUT',
  'SAVE', 'LOAD', 'KILL', 'NAME', 'LIST', 'LLIST', 'PASS', 'FILES',
  'MODE', 'CALC$', 'SUMX2', 'SUMY2', 'SUMXY', 'MEANX', 'MEANY', 'SDXN',
  'SDYN', 'VALF', 'ROUND', 'FACT', 'CHR$', 'STR$', 'LEFT$', 'RIGHT$',
  'MID$', 'HEX$', 'DSKF', 'SUMX', 'SUMY', 'SDX', 'SDY', 'STAT',
  'LRA', 'LRB', 'COR', 'EOX', 'EOY', 'CNT', 'FRE', 'ERL', 'ERR',
  'EOF', 'TAB', 'POL', 'REC', 'DEG', 'DMS$', 'DMS', 'NCR', 'NPR',
  'ASC', 'VAL', 'LEN', 'FIX', 'SGN', 'SQR', 'CUR', 'EXP', 'LOG',
  'ABS', 'INT', 'SIN', 'COS', 'TAN', 'ASN', 'ACS', 'ATN', 'LN',
  'MOD', 'XOR', 'AND', 'NOT', 'FOR', 'DIM', 'DEF', 'END', 'NEW',
  'FN', 'AS', 'OR', 'TO', 'ON', 'IF', 'LET', 'RUN', 'CLS',
  'FRAC', 'EDIT', 'REM', 'RESUME',
  // Zero-argument functions that look like keywords
  'RAN#', 'PI',
];

// Build lookup sets (all upper-case)
const KEYWORD_SET3 = new Set<string>(KEYWORDS3);
const KEYWORD_SET2 = new Set<string>(KEYWORDS2);
const KEYWORD_SET1 = new Set<string>(KEYWORDS1);

// ---------------------------------------------------------------------------
// Character helpers
// ---------------------------------------------------------------------------

function isAlpha(ch: string): boolean {
  return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');
}
function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}
function isAlNum(ch: string): boolean {
  return isAlpha(ch) || isDigit(ch);
}

// ---------------------------------------------------------------------------
// Scan one BASIC-style word (letters + digits + underscore, optional trailing
// $ or # suffix).  Returns the raw slice; advances `pos`.
// ---------------------------------------------------------------------------
function scanWord(line: string, pos: number): { word: string; end: number } {
  const start = pos;
  while (pos < line.length && (isAlNum(line[pos]!) || line[pos] === '_')) {
    pos++;
  }
  // Trailing $ or # is part of the identifier / keyword
  if (pos < line.length && (line[pos] === '$' || line[pos] === '#')) {
    pos++;
  }
  return { word: line.slice(start, pos), end: pos };
}

// Skip whitespace and return new position.
function skipSpaces(line: string, pos: number): number {
  while (pos < line.length && line[pos] === ' ') pos++;
  return pos;
}

// ---------------------------------------------------------------------------
// Main tokenise function
// ---------------------------------------------------------------------------

/**
 * Tokenise a single BASIC source line.
 *
 * If the line starts with a sequence of digits (with optional leading spaces)
 * a `LineNumber` token is emitted first.  All subsequent digit sequences are
 * emitted as `Number` tokens (expression context).
 *
 * An `EOL` token is always the last element in the returned array.
 */
export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  function peek(offset = 0): string {
    return line[pos + offset] ?? '';
  }

  function advance(): string {
    return line[pos++] ?? '';
  }

  function addTok(type: TokenType, value: string, col: number): void {
    tokens.push({ type, value, col });
  }

  // ------------------------------------------------------------------
  // 1. Optional leading line number (must come before anything else)
  // ------------------------------------------------------------------
  pos = skipSpaces(line, pos);
  if (pos < line.length && isDigit(peek())) {
    const start = pos;
    while (pos < line.length && isDigit(peek())) pos++;
    // Only treat as LineNumber if it's followed by space, end-of-line, or a
    // non-digit (i.e. not part of a variable name starting with a digit —
    // which BASIC doesn't allow anyway, but be safe).
    addTok(TokenType.LineNumber, line.slice(start, pos), start);
  }

  // ------------------------------------------------------------------
  // 2. Scan remaining tokens
  // ------------------------------------------------------------------
  while (pos < line.length) {
    pos = skipSpaces(line, pos);
    if (pos >= line.length) break;

    const start = pos;
    const ch = peek();

    // ---------------------------------------------------------------
    // String literal
    // ---------------------------------------------------------------
    if (ch === '"') {
      advance(); // consume opening quote
      let str = '';
      while (pos < line.length && peek() !== '"') {
        str += advance();
      }
      if (pos < line.length) advance(); // consume closing quote
      addTok(TokenType.StringLiteral, str, start);
      continue;
    }

    // ---------------------------------------------------------------
    // Hex literal  &Hxx
    // ---------------------------------------------------------------
    if (ch === '&' && (peek(1) === 'H' || peek(1) === 'h')) {
      advance(); // &
      advance(); // H
      let hex = '';
      while (pos < line.length && /[0-9A-Fa-f]/.test(peek())) {
        hex += advance();
      }
      addTok(TokenType.HexLiteral, hex, start);
      continue;
    }

    // ---------------------------------------------------------------
    // Apostrophe comment
    // ---------------------------------------------------------------
    if (ch === "'") {
      addTok(TokenType.Comment, line.slice(pos), start);
      pos = line.length;
      continue;
    }

    // ---------------------------------------------------------------
    // Two-char operators  <>, ><, <=, =<, >=, =>
    // ---------------------------------------------------------------
    if (pos + 1 < line.length) {
      const two = ch + peek(1);
      if (two === '<>') { addTok(TokenType.Ne, '<>', start); pos += 2; continue; }
      if (two === '><') { addTok(TokenType.Ne, '<>', start); pos += 2; continue; }
      if (two === '<=') { addTok(TokenType.Le, '<=', start); pos += 2; continue; }
      if (two === '=<') { addTok(TokenType.Le, '<=', start); pos += 2; continue; }
      if (two === '>=') { addTok(TokenType.Ge, '>=', start); pos += 2; continue; }
      if (two === '=>') { addTok(TokenType.Ge, '>=', start); pos += 2; continue; }
    }

    // ---------------------------------------------------------------
    // Single-char operators / punctuation
    // ---------------------------------------------------------------
    switch (ch) {
      case '+': advance(); addTok(TokenType.Plus,      '+', start); continue;
      case '-': advance(); addTok(TokenType.Minus,     '-', start); continue;
      case '*': advance(); addTok(TokenType.Star,      '*', start); continue;
      case '/': advance(); addTok(TokenType.Slash,     '/', start); continue;
      case '\\':advance(); addTok(TokenType.BackSlash, '\\', start); continue;
      case '^': advance(); addTok(TokenType.Caret,     '^', start); continue;
      case '=': advance(); addTok(TokenType.Eq,        '=', start); continue;
      case '<': advance(); addTok(TokenType.Lt,        '<', start); continue;
      case '>': advance(); addTok(TokenType.Gt,        '>', start); continue;
      case '(': advance(); addTok(TokenType.LParen,    '(', start); continue;
      case ')': advance(); addTok(TokenType.RParen,    ')', start); continue;
      case ',': advance(); addTok(TokenType.Comma,     ',', start); continue;
      case ';': advance(); addTok(TokenType.Semicolon, ';', start); continue;
      case ':': advance(); addTok(TokenType.Colon,     ':', start); continue;
      case '#': advance(); addTok(TokenType.Hash,      '#', start); continue;
    }

    // ---------------------------------------------------------------
    // Number literal (expression context)
    // ---------------------------------------------------------------
    if (isDigit(ch) || (ch === '.' && isDigit(peek(1)))) {
      let num = '';
      while (pos < line.length && isDigit(peek())) num += advance();
      if (pos < line.length && peek() === '.') {
        num += advance();
        while (pos < line.length && isDigit(peek())) num += advance();
      }
      if (pos < line.length && (peek() === 'E' || peek() === 'e')) {
        num += advance();
        if (pos < line.length && (peek() === '+' || peek() === '-')) {
          num += advance();
        }
        while (pos < line.length && isDigit(peek())) num += advance();
      }
      addTok(TokenType.Number, num, start);
      continue;
    }

    // ---------------------------------------------------------------
    // Keyword or identifier
    // ---------------------------------------------------------------
    if (isAlpha(ch) || ch === '_') {
      // Scan first word
      const { word: rawWord1, end: end1 } = scanWord(line, pos);
      pos = end1;
      const upper1 = rawWord1.toUpperCase();

      // Special-case: REM — keyword + everything after is a comment
      if (upper1 === 'REM') {
        addTok(TokenType.Keyword, 'REM', start);
        if (pos < line.length) {
          addTok(TokenType.Comment, line.slice(pos), pos);
          pos = line.length;
        }
        continue;
      }

      // ---- Try 3-word compound match ----
      {
        const savedPos = pos;
        const p2 = skipSpaces(line, pos);
        if (p2 < line.length && isAlpha(line[p2]!)) {
          const { word: rawWord2, end: end2 } = scanWord(line, p2);
          const upper2 = rawWord2.toUpperCase();
          const p3 = skipSpaces(line, end2);
          if (p3 < line.length && isAlpha(line[p3]!)) {
            const { word: rawWord3, end: end3 } = scanWord(line, p3);
            const upper3 = rawWord3.toUpperCase();
            const threeWord = upper1 + ' ' + upper2 + ' ' + upper3;
            if (KEYWORD_SET3.has(threeWord)) {
              pos = end3;
              addTok(TokenType.Keyword, threeWord, start);
              continue;
            }
          }
          // Restore if no 3-word match
          pos = savedPos;
        }
      }

      // ---- Try 2-word compound match ----
      {
        const savedPos = pos;
        const p2 = skipSpaces(line, pos);
        if (p2 < line.length && (isAlpha(line[p2]!) || line[p2] === '_')) {
          const { word: rawWord2, end: end2 } = scanWord(line, p2);
          const upper2 = rawWord2.toUpperCase();
          const twoWord = upper1 + ' ' + upper2;
          if (KEYWORD_SET2.has(twoWord)) {
            pos = end2;
            addTok(TokenType.Keyword, twoWord, start);
            continue;
          }
        }
        pos = savedPos;
      }

      // ---- Single-word keyword? ----
      if (KEYWORD_SET1.has(upper1)) {
        addTok(TokenType.Keyword, upper1, start);
        continue;
      }

      // ---- Identifier (variable name) ----
      addTok(TokenType.Ident, rawWord1, start);
      continue;
    }

    // ---------------------------------------------------------------
    // Unknown character — skip (graceful degradation)
    // ---------------------------------------------------------------
    advance();
  }

  addTok(TokenType.EOL, '', pos);
  return tokens;
}
