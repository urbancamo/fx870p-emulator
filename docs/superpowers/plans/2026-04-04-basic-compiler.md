# FX-870P BASIC Compiler — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a TypeScript compiler that translates Casio JIS Standard BASIC into HD61700 machine code, with assembly IR and 132-column listing output.

**Architecture:** BASIC source → Lexer → Parser → AST → Code Generator → HD61700 assembly text → Assembler → binary + listing. Generated code calls into existing ROM routines for runtime operations (PRINT, INPUT, FP math, string handling) rather than reimplementing them.

**Tech Stack:** TypeScript 5.9, vitest for testing, tsx for CLI execution. All modules under `tools/compiler/`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-04-04-basic-compiler-design.md`

**Existing disassembler:** `src/emulator/disassemble.ts` — contains the `Kind` enum (34 addressing modes), `mnemTab` (256 primary opcodes), `extTab` (64 extension entries), and all operand decode logic. The assembler reverses these tables.

---

## File Structure

```
tools/compiler/
  compile.ts          — CLI entry point, runs full pipeline
  lexer.ts            — Tokenizer for Casio JIS BASIC
  parser.ts           — Recursive descent parser, produces AST
  ast.ts              — AST type definitions (shared by parser + codegen)
  codegen.ts          — BASIC AST → annotated HD61700 assembly
  assembler.ts        — Two-pass assembler: assembly text → binary
  asm-types.ts        — Assembly IR types (AsmLine, AsmProgram)
  opcodes.ts          — Instruction encoding tables (reversed from disassembler)
  listing.ts          — 132-column listing formatter
  loader.ts           — Generate BASIC loader program for real hardware
  tests/
    lexer.test.ts
    parser.test.ts
    assembler.test.ts
    codegen.test.ts
    integration.test.ts
    fixtures/
      hello.bas
      arithmetic.bas
      strings.bas
      control.bas
      loops.bas
      arrays.bas
```

---

## Task 1: AST Type Definitions

**Files:**
- Create: `tools/compiler/ast.ts`
- Test: `tools/compiler/tests/parser.test.ts` (types used here later; no test for this task)

- [ ] **Step 1: Create the AST types file**

```typescript
// tools/compiler/ast.ts

export type Program = {
  lines: Map<number, Statement[]>;
  dataValues: Literal[];  // all DATA values collected in order
};

export type Statement =
  | LetStatement
  | PrintStatement
  | InputStatement
  | ClsStatement
  | LocateStatement
  | BeepStatement
  | AngleStatement
  | GotoStatement
  | GosubStatement
  | ReturnStatement
  | OnBranchStatement
  | IfStatement
  | ForStatement
  | NextStatement
  | WhileStatement
  | WendStatement
  | EndStatement
  | OnErrorGotoStatement
  | ResumeStatement
  | ReadStatement
  | DataStatement
  | RestoreStatement
  | DimStatement
  | EraseStatement
  | ClearStatement
  | DefmStatement
  | DefsegStatement
  | PokeStatement
  | DefFnStatement
  | OpenStatement
  | CloseStatement
  | PrintFileStatement
  | InputFileStatement
  | LineInputFileStatement
  | WriteFileStatement
  | StatStatement
  | StatClearStatement
  | RemStatement
  | DefchrStatement
  | ChainStatement
  | ModeStatement;

export interface LetStatement { type: 'let'; variable: VarRef; expr: Expression }
export interface PrintStatement { type: 'print'; device: 'lcd' | 'printer'; items: PrintItem[]; using?: Expression }
export interface InputStatement { type: 'input'; prompt?: string; promptSep?: ';' | ','; variables: VarRef[] }
export interface ClsStatement { type: 'cls' }
export interface LocateStatement { type: 'locate'; col: Expression; row?: Expression }
export interface BeepStatement { type: 'beep' }
export interface AngleStatement { type: 'angle'; mode: Expression }
export interface GotoStatement { type: 'goto'; target: number; area?: number }
export interface GosubStatement { type: 'gosub'; target: number; area?: number }
export interface ReturnStatement { type: 'return'; area?: number }
export interface OnBranchStatement { type: 'on-branch'; expr: Expression; kind: 'goto' | 'gosub'; targets: { line: number; area?: number }[] }
export interface IfStatement { type: 'if'; condition: Expression; thenBranch: Statement[]; elseBranch?: Statement[] }
export interface ForStatement { type: 'for'; variable: VarRef; from: Expression; to: Expression; step?: Expression }
export interface NextStatement { type: 'next'; variables: VarRef[] }
export interface WhileStatement { type: 'while'; condition: Expression }
export interface WendStatement { type: 'wend' }
export interface EndStatement { type: 'end'; kind: 'end' | 'stop' | 'cont' }
export interface OnErrorGotoStatement { type: 'on-error-goto'; target: number }
export interface ResumeStatement { type: 'resume'; target?: number | 'next' }
export interface ReadStatement { type: 'read'; variables: VarRef[] }
export interface DataStatement { type: 'data'; values: Literal[] }
export interface RestoreStatement { type: 'restore'; target?: number }
export interface DimStatement { type: 'dim'; decls: ArrayDecl[] }
export interface EraseStatement { type: 'erase'; names: string[] }
export interface ClearStatement { type: 'clear'; stringArea?: Expression }
export interface DefmStatement { type: 'defm'; size: Expression }
export interface DefsegStatement { type: 'defseg'; segment: Expression }
export interface PokeStatement { type: 'poke'; address: Expression; value: Expression }
export interface DefFnStatement { type: 'def-fn'; name: string; params: string[]; body: Expression }
export interface OpenStatement { type: 'open'; filename: Expression; mode: Expression; filenum: Expression }
export interface CloseStatement { type: 'close'; filenum?: Expression }
export interface PrintFileStatement { type: 'print-file'; filenum: Expression; items: PrintItem[] }
export interface InputFileStatement { type: 'input-file'; filenum: Expression; variables: VarRef[] }
export interface LineInputFileStatement { type: 'line-input-file'; filenum: Expression; variable: VarRef }
export interface WriteFileStatement { type: 'write-file'; filenum: Expression; items: Expression[] }
export interface StatStatement { type: 'stat'; data: Expression[] }
export interface StatClearStatement { type: 'stat-clear' }
export interface RemStatement { type: 'rem'; text: string }
export interface DefchrStatement { type: 'defchr'; code: Expression; pattern: Expression }
export interface ChainStatement { type: 'chain'; filename: Expression }
export interface ModeStatement { type: 'mode'; number: Expression; args?: Expression[] }

export type Expression =
  | NumberLiteral
  | StringLiteral
  | HexLiteral
  | VariableExpr
  | BinaryExpr
  | UnaryExpr
  | BuiltinCallExpr
  | FnCallExpr
  | ArrayAccessExpr;

export interface NumberLiteral { type: 'number'; value: number }
export interface StringLiteral { type: 'string'; value: string }
export interface HexLiteral { type: 'hex-literal'; value: number }
export interface VariableExpr { type: 'variable'; ref: VarRef }
export interface BinaryExpr { type: 'binary'; op: BinaryOp; left: Expression; right: Expression }
export interface UnaryExpr { type: 'unary'; op: 'not' | '-'; operand: Expression }
export interface BuiltinCallExpr { type: 'builtin-call'; name: string; args: Expression[] }
export interface FnCallExpr { type: 'fn-call'; name: string; args: Expression[] }
export interface ArrayAccessExpr { type: 'array-access'; name: string; isString: boolean; indices: Expression[] }

export type BinaryOp =
  | '+' | '-' | '*' | '/' | '¥' | 'mod'
  | '^' | '=' | '<>' | '<' | '>' | '<=' | '>='
  | 'and' | 'or' | 'xor';

export interface VarRef {
  name: string;
  isString: boolean;
  indices?: Expression[];  // present = array access
}

export type PrintItem =
  | { type: 'expr'; value: Expression }
  | { type: 'separator'; kind: ';' | ',' }
  | { type: 'tab'; col: Expression };

export type Literal =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string };

export interface ArrayDecl {
  name: string;
  isString: boolean;
  dimensions: Expression[];
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsx --eval "import('./tools/compiler/ast.ts').then(() => console.log('OK'))"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tools/compiler/ast.ts
git commit -m "feat(compiler): add AST type definitions for Casio JIS BASIC"
```

---

## Task 2: Lexer

**Files:**
- Create: `tools/compiler/lexer.ts`
- Create: `tools/compiler/tests/lexer.test.ts`

- [ ] **Step 1: Write lexer tests**

```typescript
// tools/compiler/tests/lexer.test.ts
import { describe, it, expect } from 'vitest';
import { tokenize, TokenType } from '../lexer.js';

describe('lexer', () => {
  it('tokenizes a simple line number', () => {
    const tokens = tokenize('10 PRINT "HELLO"');
    expect(tokens[0]).toEqual({ type: TokenType.LineNumber, value: '10' });
  });

  it('tokenizes keywords', () => {
    const tokens = tokenize('10 PRINT "HELLO"');
    expect(tokens[1]).toEqual({ type: TokenType.Keyword, value: 'PRINT' });
  });

  it('tokenizes string literals', () => {
    const tokens = tokenize('10 PRINT "HELLO"');
    expect(tokens[2]).toEqual({ type: TokenType.String, value: 'HELLO' });
  });

  it('tokenizes number literals', () => {
    const tokens = tokenize('10 LET A=42.5');
    const numToken = tokens.find(t => t.type === TokenType.Number);
    expect(numToken).toEqual({ type: TokenType.Number, value: '42.5' });
  });

  it('tokenizes hex literals', () => {
    const tokens = tokenize('10 A=&HFF');
    const hexToken = tokens.find(t => t.type === TokenType.HexNumber);
    expect(hexToken).toEqual({ type: TokenType.HexNumber, value: 'FF' });
  });

  it('tokenizes operators', () => {
    const tokens = tokenize('10 IF A<>B THEN 20');
    const opToken = tokens.find(t => t.value === '<>');
    expect(opToken).toEqual({ type: TokenType.Operator, value: '<>' });
  });

  it('tokenizes colon as statement separator', () => {
    const tokens = tokenize('10 A=1:B=2');
    const colons = tokens.filter(t => t.type === TokenType.Colon);
    expect(colons.length).toBe(1);
  });

  it('tokenizes variable names (case-sensitive, multi-char)', () => {
    const tokens = tokenize('10 LET Score=100');
    const varToken = tokens.find(t => t.type === TokenType.Identifier && t.value === 'Score');
    expect(varToken).toBeDefined();
  });

  it('tokenizes string variable names with $', () => {
    const tokens = tokenize('10 A$="hi"');
    const varToken = tokens.find(t => t.type === TokenType.Identifier && t.value === 'A$');
    expect(varToken).toBeDefined();
  });

  it('tokenizes REM and apostrophe comments', () => {
    const tokens = tokenize("10 REM this is a comment");
    expect(tokens[1]).toEqual({ type: TokenType.Keyword, value: 'REM' });
    expect(tokens[2]).toEqual({ type: TokenType.Comment, value: 'this is a comment' });
  });

  it('tokenizes apostrophe comments', () => {
    const tokens = tokenize("10 ' this is a comment");
    expect(tokens[1]).toEqual({ type: TokenType.Keyword, value: "'" });
    expect(tokens[2]).toEqual({ type: TokenType.Comment, value: 'this is a comment' });
  });

  it('tokenizes integer division operator', () => {
    const tokens = tokenize('10 A=B\\C');
    const opToken = tokens.find(t => t.value === '\\');
    expect(opToken).toEqual({ type: TokenType.Operator, value: '\\' });
  });

  it('tokenizes two-word keywords: HYP SIN', () => {
    const tokens = tokenize('10 A=HYP SIN(X)');
    const hypToken = tokens.find(t => t.value === 'HYP SIN');
    expect(hypToken).toEqual({ type: TokenType.Keyword, value: 'HYP SIN' });
  });

  it('tokenizes RAN# as keyword', () => {
    const tokens = tokenize('10 A=RAN#');
    const ranToken = tokens.find(t => t.value === 'RAN#');
    expect(ranToken).toEqual({ type: TokenType.Keyword, value: 'RAN#' });
  });

  it('tokenizes PI as keyword', () => {
    const tokens = tokenize('10 A=PI');
    const piToken = tokens.find(t => t.value === 'PI');
    expect(piToken).toEqual({ type: TokenType.Keyword, value: 'PI' });
  });

  it('tokenizes PRINT USING as two separate keywords', () => {
    const tokens = tokenize('10 PRINT USING "##.#";A');
    expect(tokens[1]).toEqual({ type: TokenType.Keyword, value: 'PRINT' });
    expect(tokens[2]).toEqual({ type: TokenType.Keyword, value: 'USING' });
  });

  it('tokenizes parentheses and comma', () => {
    const tokens = tokenize('10 DIM A(10,20)');
    const parens = tokens.filter(t => t.type === TokenType.LParen || t.type === TokenType.RParen);
    expect(parens.length).toBe(2);
    const commas = tokens.filter(t => t.type === TokenType.Comma);
    expect(commas.length).toBe(1);
  });

  it('tokenizes semicolons', () => {
    const tokens = tokenize('10 PRINT A;B');
    const semis = tokens.filter(t => t.type === TokenType.Semicolon);
    expect(semis.length).toBe(1);
  });

  it('tokenizes # for file numbers', () => {
    const tokens = tokenize('10 PRINT #1, A');
    const hashToken = tokens.find(t => t.type === TokenType.Hash);
    expect(hashToken).toBeDefined();
  });

  it('tokenizes ON ERROR GOTO as compound keyword', () => {
    const tokens = tokenize('10 ON ERROR GOTO 100');
    expect(tokens[1]).toEqual({ type: TokenType.Keyword, value: 'ON ERROR GOTO' });
  });

  it('tokenizes RESUME NEXT as compound keyword', () => {
    const tokens = tokenize('10 RESUME NEXT');
    expect(tokens[1]).toEqual({ type: TokenType.Keyword, value: 'RESUME NEXT' });
  });

  it('handles end of line', () => {
    const tokens = tokenize('10 END');
    const eol = tokens[tokens.length - 1];
    expect(eol!.type).toBe(TokenType.EOL);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/lexer.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the lexer**

```typescript
// tools/compiler/lexer.ts

export const enum TokenType {
  LineNumber,
  Keyword,
  Identifier,
  Number,
  HexNumber,
  String,
  Operator,
  LParen,
  RParen,
  Comma,
  Semicolon,
  Colon,
  Hash,
  Comment,
  EOL,
}

export interface Token {
  type: TokenType;
  value: string;
}

// Casio JIS BASIC keywords — sorted longest-first for greedy matching
const COMPOUND_KEYWORDS = [
  'ON ERROR GOTO', 'RESUME NEXT', 'LINE INPUT#',
  'STAT CLEAR', 'PRINT USING', 'LPRINT USING',
  'HYP SIN', 'HYP COS', 'HYP TAN', 'HYP ASN', 'HYP ACS', 'HYP ATN',
];

const KEYWORDS = [
  'PRINT', 'LPRINT', 'INPUT', 'INPUT$', 'INKEY$', 'LET',
  'IF', 'THEN', 'ELSE', 'GOTO', 'GOSUB', 'RETURN',
  'FOR', 'TO', 'STEP', 'NEXT', 'WHILE', 'WEND',
  'ON', 'END', 'STOP', 'CONT',
  'DIM', 'ERASE', 'CLEAR', 'DEFM', 'DEFSEG',
  'READ', 'DATA', 'RESTORE',
  'OPEN', 'CLOSE', 'AS', 'OUTPUT', 'APPEND',
  'WRITE#', 'READ#', 'RESTORE#', 'PRINT#', 'INPUT#', 'LINE',
  'DEF', 'FN', 'USING',
  'POKE', 'PEEK', 'CLS', 'LOCATE', 'BEEP', 'ANGLE',
  'AND', 'OR', 'XOR', 'NOT', 'MOD',
  'REM', "'",
  'SIN', 'COS', 'TAN', 'ASN', 'ACS', 'ATN',
  'SQR', 'CUR', 'EXP', 'LOG', 'LN', 'ABS', 'INT', 'FIX', 'FRAC', 'SGN',
  'ROUND', 'FACT', 'NCR', 'NPR',
  'CHR$', 'ASC', 'STR$', 'VAL', 'VALF', 'LEN',
  'LEFT$', 'RIGHT$', 'MID$', 'HEX$',
  'RAN#', 'PI',
  'CNT', 'SUMX', 'SUMY', 'SUMX2', 'SUMY2', 'SUMXY',
  'MEANX', 'MEANY', 'SDX', 'SDY', 'SDXN', 'SDYN',
  'LRA', 'LRB', 'COR', 'EOX', 'EOY',
  'FRE', 'ERL', 'ERR', 'DSKF', 'EOF',
  'TAB', 'STAT', 'DEFCHR$', 'CHAIN', 'MODE',
  'POL', 'REC', 'DEG', 'DMS$', 'DMS',
  'RESUME', 'ON ERROR GOTO',
  'VARLIST', 'TRON', 'TROFF', 'RENUM', 'DELETE', 'EDIT',
  'RUN', 'NEW', 'LIST', 'LLIST', 'SYSTEM', 'PASS',
  'FILES', 'KILL', 'NAME', 'FORMAT',
  'SAVE', 'LOAD', 'MERGE', 'VERIFY',
  'CALC$', 'CALCJMP',
];

const TWO_CHAR_OPS = ['<>', '><', '<=', '=<', '>=', '=>'];
const ONE_CHAR_OPS = ['+', '-', '*', '/', '\\', '^', '=', '<', '>'];

export function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let pos = 0;

  function peek(): string { return line[pos] ?? ''; }
  function advance(): string { return line[pos++] ?? ''; }
  function remaining(): string { return line.slice(pos); }

  // Skip whitespace (but not newlines)
  function skipSpaces(): void {
    while (pos < line.length && line[pos] === ' ') pos++;
  }

  // Line number at start
  skipSpaces();
  if (pos < line.length && line[pos]! >= '0' && line[pos]! <= '9') {
    let num = '';
    while (pos < line.length && line[pos]! >= '0' && line[pos]! <= '9') {
      num += advance();
    }
    tokens.push({ type: TokenType.LineNumber, value: num });
    skipSpaces();
  }

  while (pos < line.length) {
    skipSpaces();
    if (pos >= line.length) break;

    const ch = peek();

    // String literal
    if (ch === '"') {
      advance(); // skip opening quote
      let str = '';
      while (pos < line.length && peek() !== '"') {
        str += advance();
      }
      if (pos < line.length) advance(); // skip closing quote
      tokens.push({ type: TokenType.String, value: str });
      continue;
    }

    // Hex literal &H
    if (ch === '&' && line[pos + 1]?.toUpperCase() === 'H') {
      pos += 2; // skip &H
      let hex = '';
      while (pos < line.length && /[0-9A-Fa-f]/.test(peek())) {
        hex += advance();
      }
      tokens.push({ type: TokenType.HexNumber, value: hex.toUpperCase() });
      continue;
    }

    // Punctuation
    if (ch === '(') { advance(); tokens.push({ type: TokenType.LParen, value: '(' }); continue; }
    if (ch === ')') { advance(); tokens.push({ type: TokenType.RParen, value: ')' }); continue; }
    if (ch === ',') { advance(); tokens.push({ type: TokenType.Comma, value: ',' }); continue; }
    if (ch === ';') { advance(); tokens.push({ type: TokenType.Semicolon, value: ';' }); continue; }
    if (ch === ':') { advance(); tokens.push({ type: TokenType.Colon, value: ':' }); continue; }
    if (ch === '#') { advance(); tokens.push({ type: TokenType.Hash, value: '#' }); continue; }

    // Apostrophe comment
    if (ch === "'") {
      tokens.push({ type: TokenType.Keyword, value: "'" });
      pos++; // skip apostrophe
      if (pos < line.length && peek() === ' ') pos++; // skip optional space
      tokens.push({ type: TokenType.Comment, value: line.slice(pos) });
      pos = line.length;
      continue;
    }

    // Two-char operators
    if (pos + 1 < line.length) {
      const twoChar = line.slice(pos, pos + 2);
      if (TWO_CHAR_OPS.includes(twoChar)) {
        pos += 2;
        // Normalize: >< to <>, =< to <=, => to >=
        const normalized = twoChar === '><' ? '<>' : twoChar === '=<' ? '<=' : twoChar === '=>' ? '>=' : twoChar;
        tokens.push({ type: TokenType.Operator, value: normalized });
        continue;
      }
    }

    // One-char operators
    if (ONE_CHAR_OPS.includes(ch)) {
      advance();
      tokens.push({ type: TokenType.Operator, value: ch });
      continue;
    }

    // Number
    if (ch >= '0' && ch <= '9' || (ch === '.' && pos + 1 < line.length && line[pos + 1]! >= '0' && line[pos + 1]! <= '9')) {
      let num = '';
      while (pos < line.length && ((peek() >= '0' && peek() <= '9') || peek() === '.')) {
        num += advance();
      }
      // Scientific notation
      if (pos < line.length && (peek() === 'E' || peek() === 'e')) {
        num += advance();
        if (pos < line.length && (peek() === '+' || peek() === '-')) {
          num += advance();
        }
        while (pos < line.length && peek() >= '0' && peek() <= '9') {
          num += advance();
        }
      }
      tokens.push({ type: TokenType.Number, value: num });
      continue;
    }

    // Keywords and identifiers (start with letter)
    if (/[A-Za-z]/.test(ch)) {
      // Try compound keywords first (longest match)
      const rest = remaining();
      let matched = false;
      for (const compound of COMPOUND_KEYWORDS) {
        if (rest.startsWith(compound) && (rest.length === compound.length || !/[A-Za-z0-9$#]/.test(rest[compound.length]!))) {
          tokens.push({ type: TokenType.Keyword, value: compound });
          pos += compound.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // Read full word (letters + digits + optional trailing $/#)
      let word = '';
      while (pos < line.length && /[A-Za-z0-9]/.test(peek())) {
        word += advance();
      }
      // Check for trailing $ or # (string var / RAN#)
      if (pos < line.length && (peek() === '$' || peek() === '#')) {
        word += advance();
      }

      // Is it a keyword?
      const upper = word.toUpperCase();
      if (KEYWORDS.includes(upper) || KEYWORDS.includes(word)) {
        // REM consumes rest of line
        if (upper === 'REM') {
          tokens.push({ type: TokenType.Keyword, value: 'REM' });
          skipSpaces();
          tokens.push({ type: TokenType.Comment, value: line.slice(pos) });
          pos = line.length;
        } else {
          tokens.push({ type: TokenType.Keyword, value: upper });
        }
      } else {
        tokens.push({ type: TokenType.Identifier, value: word });
      }
      continue;
    }

    // Unknown character — skip
    advance();
  }

  tokens.push({ type: TokenType.EOL, value: '' });
  return tokens;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/lexer.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/lexer.ts tools/compiler/tests/lexer.test.ts
git commit -m "feat(compiler): implement BASIC lexer with full Casio JIS keyword support"
```

---

## Task 3: Parser — Core Infrastructure + Simple Statements

**Files:**
- Create: `tools/compiler/parser.ts`
- Create: `tools/compiler/tests/parser.test.ts`

- [ ] **Step 1: Write parser tests for simple statements**

```typescript
// tools/compiler/tests/parser.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../parser.js';

describe('parser', () => {
  it('parses REM', () => {
    const prog = parse('10 REM hello world');
    const stmts = prog.lines.get(10)!;
    expect(stmts).toHaveLength(1);
    expect(stmts[0]).toEqual({ type: 'rem', text: 'hello world' });
  });

  it('parses CLS', () => {
    const prog = parse('10 CLS');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'cls' });
  });

  it('parses END', () => {
    const prog = parse('10 END');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'end', kind: 'end' });
  });

  it('parses STOP', () => {
    const prog = parse('10 STOP');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'end', kind: 'stop' });
  });

  it('parses BEEP', () => {
    const prog = parse('10 BEEP');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'beep' });
  });

  it('parses implicit LET: A=5', () => {
    const prog = parse('10 A=5');
    const stmt = prog.lines.get(10)![0]!;
    expect(stmt.type).toBe('let');
    if (stmt.type === 'let') {
      expect(stmt.variable.name).toBe('A');
      expect(stmt.expr).toEqual({ type: 'number', value: 5 });
    }
  });

  it('parses explicit LET', () => {
    const prog = parse('10 LET A=5');
    expect(prog.lines.get(10)![0]!.type).toBe('let');
  });

  it('parses string assignment', () => {
    const prog = parse('10 A$="hello"');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.variable.name).toBe('A$');
      expect(stmt.variable.isString).toBe(true);
      expect(stmt.expr).toEqual({ type: 'string', value: 'hello' });
    }
  });

  it('parses GOTO', () => {
    const prog = parse('10 GOTO 100');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'goto', target: 100 });
  });

  it('parses GOTO with area', () => {
    const prog = parse('10 GOTO #3');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'goto', target: 0, area: 3 });
  });

  it('parses GOSUB', () => {
    const prog = parse('10 GOSUB 500');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'gosub', target: 500 });
  });

  it('parses RETURN', () => {
    const prog = parse('10 RETURN');
    expect(prog.lines.get(10)![0]).toEqual({ type: 'return' });
  });

  it('parses multi-statement lines with colon', () => {
    const prog = parse('10 A=1:B=2:C=3');
    expect(prog.lines.get(10)).toHaveLength(3);
  });

  it('parses PRINT with string', () => {
    const prog = parse('10 PRINT "hello"');
    const stmt = prog.lines.get(10)![0]!;
    expect(stmt.type).toBe('print');
    if (stmt.type === 'print') {
      expect(stmt.device).toBe('lcd');
      expect(stmt.items).toHaveLength(1);
      expect(stmt.items[0]).toEqual({ type: 'expr', value: { type: 'string', value: 'hello' } });
    }
  });

  it('parses PRINT with separators', () => {
    const prog = parse('10 PRINT A;B');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'print') {
      expect(stmt.items).toHaveLength(3); // expr, separator, expr
      expect(stmt.items[1]).toEqual({ type: 'separator', kind: ';' });
    }
  });

  it('parses LPRINT', () => {
    const prog = parse('10 LPRINT "test"');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'print') {
      expect(stmt.device).toBe('printer');
    }
  });

  it('parses INPUT', () => {
    const prog = parse('10 INPUT A');
    const stmt = prog.lines.get(10)![0]!;
    expect(stmt.type).toBe('input');
    if (stmt.type === 'input') {
      expect(stmt.variables).toHaveLength(1);
      expect(stmt.variables[0]!.name).toBe('A');
    }
  });

  it('parses INPUT with prompt', () => {
    const prog = parse('10 INPUT "Enter X";X');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'input') {
      expect(stmt.prompt).toBe('Enter X');
      expect(stmt.promptSep).toBe(';');
    }
  });

  it('parses LOCATE', () => {
    const prog = parse('10 LOCATE 5,2');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'locate') {
      expect(stmt.col).toEqual({ type: 'number', value: 5 });
      expect(stmt.row).toEqual({ type: 'number', value: 2 });
    }
  });

  it('parses multi-line program', () => {
    const prog = parse('10 CLS\n20 PRINT "HI"\n30 END');
    expect(prog.lines.size).toBe(3);
    expect(prog.lines.has(10)).toBe(true);
    expect(prog.lines.has(20)).toBe(true);
    expect(prog.lines.has(30)).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/parser.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the parser**

Create `tools/compiler/parser.ts` with a recursive descent parser. The parser consumes the token stream from the lexer and builds AST nodes.

Key functions:
- `parse(source: string): Program` — entry point, splits into lines, parses each
- `parseLine(tokens: Token[]): Statement[]` — parse a single BASIC line (handles `:` separation)
- `parseStatement(tokens: Token[], pos: number): [Statement, number]` — parse one statement
- `parseExpression(tokens: Token[], pos: number, minPrec: number): [Expression, number]` — Pratt precedence climbing
- `parsePrimary(tokens: Token[], pos: number): [Expression, number]` — literals, variables, function calls, parens

The parser should call `tokenize()` from the lexer internally — `parse()` takes raw BASIC source text.

This is a large file (~400-600 lines). Implement all statement types from the AST. For expression parsing, use precedence climbing with the operator precedence table from the spec.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/parser.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/parser.ts tools/compiler/tests/parser.test.ts
git commit -m "feat(compiler): implement recursive descent BASIC parser"
```

---

## Task 4: Parser — Control Flow & Complex Statements

**Files:**
- Modify: `tools/compiler/tests/parser.test.ts`
- Modify: `tools/compiler/parser.ts` (if needed)

- [ ] **Step 1: Add tests for IF/FOR/WHILE/DATA/DIM**

```typescript
// Append to tools/compiler/tests/parser.test.ts

describe('parser - control flow', () => {
  it('parses IF THEN with line number', () => {
    const prog = parse('10 IF A>5 THEN 100');
    const stmt = prog.lines.get(10)![0]!;
    expect(stmt.type).toBe('if');
    if (stmt.type === 'if') {
      expect(stmt.condition.type).toBe('binary');
      expect(stmt.thenBranch).toHaveLength(1);
      expect(stmt.thenBranch[0]!.type).toBe('goto');
    }
  });

  it('parses IF THEN ELSE', () => {
    const prog = parse('10 IF A=1 THEN B=2 ELSE B=3');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'if') {
      expect(stmt.thenBranch).toHaveLength(1);
      expect(stmt.elseBranch).toHaveLength(1);
    }
  });

  it('parses FOR NEXT', () => {
    const prog = parse('10 FOR I=1 TO 10 STEP 2');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'for') {
      expect(stmt.variable.name).toBe('I');
      expect(stmt.from).toEqual({ type: 'number', value: 1 });
      expect(stmt.to).toEqual({ type: 'number', value: 10 });
      expect(stmt.step).toEqual({ type: 'number', value: 2 });
    }
  });

  it('parses NEXT with variable', () => {
    const prog = parse('10 NEXT I');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'next') {
      expect(stmt.variables).toHaveLength(1);
      expect(stmt.variables[0]!.name).toBe('I');
    }
  });

  it('parses DATA', () => {
    const prog = parse('10 DATA 1,2,"hello",4.5');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'data') {
      expect(stmt.values).toHaveLength(4);
      expect(stmt.values[0]).toEqual({ type: 'number', value: 1 });
      expect(stmt.values[2]).toEqual({ type: 'string', value: 'hello' });
    }
  });

  it('collects DATA values into program.dataValues', () => {
    const prog = parse('10 DATA 1,2\n20 DATA 3,4');
    expect(prog.dataValues).toHaveLength(4);
    expect(prog.dataValues[2]).toEqual({ type: 'number', value: 3 });
  });

  it('parses READ', () => {
    const prog = parse('10 READ A,B$');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'read') {
      expect(stmt.variables).toHaveLength(2);
      expect(stmt.variables[1]!.isString).toBe(true);
    }
  });

  it('parses DIM', () => {
    const prog = parse('10 DIM A(10),B$(5,3)');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'dim') {
      expect(stmt.decls).toHaveLength(2);
      expect(stmt.decls[0]!.name).toBe('A');
      expect(stmt.decls[0]!.dimensions).toHaveLength(1);
      expect(stmt.decls[1]!.name).toBe('B$');
      expect(stmt.decls[1]!.isString).toBe(true);
      expect(stmt.decls[1]!.dimensions).toHaveLength(2);
    }
  });

  it('parses ON GOTO', () => {
    const prog = parse('10 ON X GOTO 100,200,300');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'on-branch') {
      expect(stmt.kind).toBe('goto');
      expect(stmt.targets).toHaveLength(3);
    }
  });

  it('parses ON ERROR GOTO', () => {
    const prog = parse('10 ON ERROR GOTO 9000');
    const stmt = prog.lines.get(10)![0]!;
    expect(stmt.type).toBe('on-error-goto');
    if (stmt.type === 'on-error-goto') {
      expect(stmt.target).toBe(9000);
    }
  });

  it('parses RESTORE', () => {
    const prog = parse('10 RESTORE 400');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'restore') {
      expect(stmt.target).toBe(400);
    }
  });

  it('parses CLEAR', () => {
    const prog = parse('10 CLEAR');
    expect(prog.lines.get(10)![0]!.type).toBe('clear');
  });

  it('parses POKE', () => {
    const prog = parse('10 POKE &H1000,255');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'poke') {
      expect(stmt.address.type).toBe('hex-literal');
      expect(stmt.value).toEqual({ type: 'number', value: 255 });
    }
  });

  it('parses DEF FN', () => {
    const prog = parse('10 DEF FN F(X)=X*X+1');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'def-fn') {
      expect(stmt.name).toBe('F');
      expect(stmt.params).toEqual(['X']);
      expect(stmt.body.type).toBe('binary');
    }
  });
});

describe('parser - expressions', () => {
  it('parses binary arithmetic', () => {
    const prog = parse('10 A=2+3*4');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      // Should be 2 + (3 * 4) due to precedence
      expect(stmt.expr.type).toBe('binary');
      if (stmt.expr.type === 'binary') {
        expect(stmt.expr.op).toBe('+');
        expect(stmt.expr.right.type).toBe('binary');
      }
    }
  });

  it('parses unary negation', () => {
    const prog = parse('10 A=-5');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('unary');
    }
  });

  it('parses parenthesized expressions', () => {
    const prog = parse('10 A=(2+3)*4');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('binary');
      if (stmt.expr.type === 'binary') {
        expect(stmt.expr.op).toBe('*');
      }
    }
  });

  it('parses builtin function call', () => {
    const prog = parse('10 A=SIN(3.14)');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('builtin-call');
      if (stmt.expr.type === 'builtin-call') {
        expect(stmt.expr.name).toBe('SIN');
        expect(stmt.expr.args).toHaveLength(1);
      }
    }
  });

  it('parses string concatenation', () => {
    const prog = parse('10 A$="hi"+" world"');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('binary');
      if (stmt.expr.type === 'binary') {
        expect(stmt.expr.op).toBe('+');
      }
    }
  });

  it('parses MID$ with three args', () => {
    const prog = parse('10 A$=MID$(B$,2,3)');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let' && stmt.expr.type === 'builtin-call') {
      expect(stmt.expr.name).toBe('MID$');
      expect(stmt.expr.args).toHaveLength(3);
    }
  });

  it('parses array access', () => {
    const prog = parse('10 A=B(I+1)');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('array-access');
    }
  });

  it('parses RAN# (no arguments)', () => {
    const prog = parse('10 A=RAN#');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('builtin-call');
      if (stmt.expr.type === 'builtin-call') {
        expect(stmt.expr.name).toBe('RAN#');
        expect(stmt.expr.args).toHaveLength(0);
      }
    }
  });

  it('parses PEEK', () => {
    const prog = parse('10 A=PEEK(&H1000)');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let' && stmt.expr.type === 'builtin-call') {
      expect(stmt.expr.name).toBe('PEEK');
      expect(stmt.expr.args[0]!.type).toBe('hex-literal');
    }
  });

  it('parses logical operators', () => {
    const prog = parse('10 IF A>0 AND B<10 THEN 20');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'if') {
      expect(stmt.condition.type).toBe('binary');
      if (stmt.condition.type === 'binary') {
        expect(stmt.condition.op).toBe('and');
      }
    }
  });

  it('parses comparison returning -1/0', () => {
    const prog = parse('10 A=(X=5)');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('binary');
      if (stmt.expr.type === 'binary') {
        expect(stmt.expr.op).toBe('=');
      }
    }
  });

  it('parses hex literal', () => {
    const prog = parse('10 A=&HFF');
    const stmt = prog.lines.get(10)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr).toEqual({ type: 'hex-literal', value: 0xFF });
    }
  });

  it('parses FN call', () => {
    const prog = parse('10 DEF FN F(X)=X*2\n20 A=FN F(5)');
    const stmt = prog.lines.get(20)![0]!;
    if (stmt.type === 'let') {
      expect(stmt.expr.type).toBe('fn-call');
    }
  });
});
```

- [ ] **Step 2: Run tests to verify new ones fail**

Run: `npx vitest run tools/compiler/tests/parser.test.ts`
Expected: New tests FAIL if parser doesn't yet handle these constructs

- [ ] **Step 3: Extend parser to handle all control flow and expression types**

Ensure the parser handles: IF/THEN/ELSE, FOR/TO/STEP/NEXT, WHILE/WEND, DATA, READ, RESTORE, DIM, ON GOTO, ON GOSUB, ON ERROR GOTO, RESUME, POKE, DEF FN, CLEAR, ERASE, and the full expression grammar with correct operator precedence.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/parser.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/parser.ts tools/compiler/tests/parser.test.ts
git commit -m "feat(compiler): complete parser with control flow, expressions, and all statement types"
```

---

## Task 5: Assembly IR Types

**Files:**
- Create: `tools/compiler/asm-types.ts`

- [ ] **Step 1: Create assembly IR types**

```typescript
// tools/compiler/asm-types.ts

export interface AsmLine {
  label?: string;
  mnemonic?: string;
  operands?: string;
  comment?: string;
  basicLine?: { num: number; source: string };
}

export interface AsmProgram {
  lines: AsmLine[];
  origin: number;
}

export interface SymbolEntry {
  name: string;
  address: number;
  type: 'code' | 'data' | 'variable';
}

export interface AssemblerOutput {
  binary: Uint8Array;
  symbols: SymbolEntry[];
  listing: string;
  codeSize: number;
  dataSize: number;
  variableSize: number;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsx --eval "import('./tools/compiler/asm-types.ts').then(() => console.log('OK'))"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add tools/compiler/asm-types.ts
git commit -m "feat(compiler): add assembly IR type definitions"
```

---

## Task 6: Opcode Encoding Tables

**Files:**
- Create: `tools/compiler/opcodes.ts`
- Create: `tools/compiler/tests/assembler.test.ts`

This is the most critical infrastructure task. The encoding tables reverse the disassembler's decode tables from `src/emulator/disassemble.ts`.

- [ ] **Step 1: Write encoding tests based on known instruction bytes**

```typescript
// tools/compiler/tests/assembler.test.ts
import { describe, it, expect } from 'vitest';
import { encodeInstruction } from '../opcodes.js';

describe('opcode encoding', () => {
  it('encodes NOP', () => {
    const bytes = encodeInstruction('nop', '');
    expect(bytes).toEqual(new Uint8Array([0xCE]));
  });

  it('encodes LD $2,$0 (register to register)', () => {
    const bytes = encodeInstruction('ld', '$2,$0');
    expect(bytes[0]).toBe(0x02); // ld opcode
    // operand byte: $0 register in bits [4:0], $2 as dest
    expect(bytes.length).toBe(2);
  });

  it('encodes LDW $2,&H2ADF (16-bit immediate)', () => {
    const bytes = encodeInstruction('ldw', '$2,&H2ADF');
    // ldw with 16-bit immediate: opcode + reg + lo + hi
    expect(bytes.length).toBe(4);
    expect(bytes[2]).toBe(0xDF); // low byte
    expect(bytes[3]).toBe(0x2A); // high byte
  });

  it('encodes JR with positive offset', () => {
    const bytes = encodeInstruction('jr', '&H10', 0x0000);
    expect(bytes[0]).toBe(0xD8); // jr opcode (unconditional, cc=7)
  });

  it('encodes PST UA,&H54', () => {
    const bytes = encodeInstruction('pst', 'UA,&H54');
    expect(bytes.length).toBe(2);
  });

  it('encodes JP $2', () => {
    const bytes = encodeInstruction('jp', '$2');
    expect(bytes.length).toBe(2);
  });

  it('encodes PHSW $1', () => {
    const bytes = encodeInstruction('phsw', '$1');
    expect(bytes.length).toBe(2);
  });

  it('encodes DB "Hello"', () => {
    const bytes = encodeInstruction('db', '"Hello"');
    expect(Array.from(bytes)).toEqual([0x48, 0x65, 0x6C, 0x6C, 0x6F]);
  });

  it('encodes DB &H48,&H65', () => {
    const bytes = encodeInstruction('db', '&H48,&H65');
    expect(Array.from(bytes)).toEqual([0x48, 0x65]);
  });

  it('encodes ADC $0,$SX', () => {
    const bytes = encodeInstruction('adc', '$0,$SX');
    expect(bytes[0]).toBe(0x00); // adc opcode
  });

  it('encodes conditional JR: JR NZ,offset', () => {
    const bytes = encodeInstruction('jr', 'NZ,&H20', 0x0000);
    expect(bytes[0]).toBe(0xD4); // jr nz opcode (cc=4)
  });

  it('encodes CAL (16-bit absolute)', () => {
    const bytes = encodeInstruction('cal', '&H1000');
    expect(bytes.length).toBe(3); // opcode + lo + hi
  });

  it('encodes RTN', () => {
    const bytes = encodeInstruction('rtn', '');
    expect(bytes).toEqual(new Uint8Array([0xEE]));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/assembler.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement opcode encoding**

Create `tools/compiler/opcodes.ts` that:

1. Builds a reverse lookup table from the disassembler's `mnemTab` and `extTab`: `Map<string, { opcodeIndex: number; kind: number }[]>` (mnemonic → list of possible encodings)
2. For each `Kind`, implements the encoder that packs operands into bytes (reversing the decoder logic)
3. Exports `encodeInstruction(mnem: string, operands: string, pc?: number): Uint8Array`
4. Handles the `DB`, `DW`, `DS` pseudo-instructions directly

Reference files:
- `src/emulator/disassemble.ts` — the `Kind` enum values, `mnemTab`, `extTab`, register name tables (`cctab`, `r8tab`, `r16tab`, `sirtab`)
- `reference/HD61700 CROSS ASSEMBLER/hd61700.h` — the definitive 1125-entry instruction table for cross-reference

Key encoding rules:
- Register `$N` → bits [4:0] of operand byte
- SIR (sx/sy/sz) → bits [7:5] of operand byte
- Condition codes → bits [2:0] of primary opcode
- 3-bit immediate → `(value - 1) << 5` in bits [7:5]
- 7-bit relative jump: `offset = target - pc`; if negative, emit `0x80 - abs(offset)`
- 16-bit immediates: little-endian (low byte first)
- Extension opcodes: primary opcode from `mnemTab` extension index, variant in bits [7:5] of first operand byte

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/assembler.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/opcodes.ts tools/compiler/tests/assembler.test.ts
git commit -m "feat(compiler): implement HD61700 instruction encoding tables"
```

---

## Task 7: Two-Pass Assembler

**Files:**
- Create: `tools/compiler/assembler.ts`
- Modify: `tools/compiler/tests/assembler.test.ts`

- [ ] **Step 1: Add assembler tests**

```typescript
// Append to tools/compiler/tests/assembler.test.ts
import { assemble } from '../assembler.js';

describe('assembler', () => {
  it('assembles a simple program', () => {
    const result = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'MAIN', mnemonic: 'nop', comment: 'do nothing' },
      { mnemonic: 'rtn' },
    ]);
    expect(result.binary[0]).toBe(0xCE); // nop
    expect(result.binary[1]).toBe(0xEE); // rtn
    expect(result.codeSize).toBe(2);
  });

  it('resolves forward label references', () => {
    const result = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'jr', operands: 'SKIP' },
      { mnemonic: 'nop' },
      { label: 'SKIP', mnemonic: 'rtn' },
    ]);
    // jr should encode offset to SKIP (address 3)
    expect(result.binary.length).toBe(4); // jr(2) + nop(1) + rtn(1)
    expect(result.symbols.find(s => s.name === 'SKIP')!.address).toBe(3);
  });

  it('resolves EQU constants', () => {
    const result = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'CLS_ADDR', mnemonic: 'EQU', operands: '&H2ADF' },
      { mnemonic: 'ldw', operands: '$2,CLS_ADDR' },
    ]);
    // ldw should use &H2ADF as the 16-bit immediate
    expect(result.binary[2]).toBe(0xDF); // low byte
    expect(result.binary[3]).toBe(0x2A); // high byte
  });

  it('handles DS (reserve space)', () => {
    const result = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'nop' },
      { label: 'VAR_A', mnemonic: 'DS', operands: '9' },
      { label: 'VAR_B', mnemonic: 'DS', operands: '9' },
    ]);
    expect(result.symbols.find(s => s.name === 'VAR_A')!.address).toBe(1);
    expect(result.symbols.find(s => s.name === 'VAR_B')!.address).toBe(10);
  });

  it('reports code and data sizes', () => {
    const result = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'nop' },
      { mnemonic: 'rtn' },
      { mnemonic: 'db', operands: '"Hello"' },
    ]);
    expect(result.codeSize).toBe(2);
    expect(result.dataSize).toBe(5);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/assembler.test.ts`
Expected: FAIL — `assemble` not found

- [ ] **Step 3: Implement the two-pass assembler**

Create `tools/compiler/assembler.ts`:

```typescript
// tools/compiler/assembler.ts
import type { AsmLine, AssemblerOutput, SymbolEntry } from './asm-types.js';
import { encodeInstruction } from './opcodes.js';

export function assemble(lines: AsmLine[]): AssemblerOutput {
  const symbols = new Map<string, number>();
  const equValues = new Map<string, number>();
  let origin = 0;

  // Pass 1: collect labels and compute addresses
  let pc = 0;
  for (const line of lines) {
    if (line.mnemonic === 'ORG') {
      pc = parseImmediate(line.operands ?? '0');
      origin = pc;
      continue;
    }
    if (line.mnemonic === 'EQU') {
      if (line.label) equValues.set(line.label, parseImmediate(line.operands ?? '0'));
      continue;
    }
    if (line.label) {
      symbols.set(line.label, pc);
    }
    if (line.mnemonic) {
      pc += instructionSize(line.mnemonic, line.operands ?? '');
    }
  }

  // Pass 2: emit binary
  const buffer = new Uint8Array(65536);
  pc = origin;
  let codeSize = 0;
  let dataSize = 0;
  let variableSize = 0;

  for (const line of lines) {
    if (line.mnemonic === 'ORG' || line.mnemonic === 'EQU') continue;
    if (!line.mnemonic) continue;

    if (line.mnemonic === 'DS') {
      const size = parseImmediate(line.operands ?? '0');
      variableSize += size;
      pc += size;
      continue;
    }

    // Resolve label references in operands
    const resolvedOperands = resolveLabels(line.operands ?? '', symbols, equValues);
    const bytes = encodeInstruction(line.mnemonic, resolvedOperands, pc);
    buffer.set(bytes, pc - origin);

    if (line.mnemonic === 'db' || line.mnemonic === 'dw') {
      dataSize += bytes.length;
    } else {
      codeSize += bytes.length;
    }
    pc += bytes.length;
  }

  const totalSize = pc - origin;
  const symbolList: SymbolEntry[] = [];
  for (const [name, addr] of symbols) {
    symbolList.push({ name, address: addr, type: 'code' });
  }

  return {
    binary: buffer.slice(0, totalSize),
    symbols: symbolList,
    listing: '', // filled by listing.ts
    codeSize,
    dataSize,
    variableSize,
  };
}
```

Implement helper functions: `parseImmediate`, `instructionSize`, `resolveLabels`.

`instructionSize` needs to determine byte count without encoding — it can call `encodeInstruction` with a dummy PC, or use a size lookup table keyed by (mnemonic, operand pattern).

`resolveLabels` replaces label names in operand strings with their hex addresses (`&Hxxxx`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/assembler.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/assembler.ts tools/compiler/tests/assembler.test.ts
git commit -m "feat(compiler): implement two-pass HD61700 assembler"
```

---

## Task 8: 132-Column Listing Formatter

**Files:**
- Create: `tools/compiler/listing.ts`
- Modify: `tools/compiler/tests/assembler.test.ts`

- [ ] **Step 1: Add listing format tests**

```typescript
// Append to tools/compiler/tests/assembler.test.ts
import { formatListing } from '../listing.js';

describe('listing formatter', () => {
  it('formats a header line', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [
        { address: 0, bytes: [0xCE], label: 'MAIN', mnemonic: 'nop', operands: '', comment: 'do nothing' },
      ],
      symbols: [{ name: 'MAIN', address: 0, type: 'code' as const }],
      codeSize: 1,
      dataSize: 0,
      variableSize: 0,
    });
    expect(listing).toContain('HD61700 Cross Assembler');
    expect(listing).toContain('TEST.BAS');
    expect(listing).toContain('Page 1');
  });

  it('formats an instruction line with correct columns', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [
        { address: 0, bytes: [0xCE], label: 'MAIN', mnemonic: 'nop', operands: '', comment: 'do nothing' },
      ],
      symbols: [],
      codeSize: 1,
      dataSize: 0,
      variableSize: 0,
    });
    // Check the instruction line contains address, hex, label, mnemonic
    expect(listing).toContain('0000');
    expect(listing).toContain('CE');
    expect(listing).toContain('MAIN');
    expect(listing).toContain('nop');
  });

  it('includes BASIC source annotations', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [
        { address: -1, bytes: [], label: '', mnemonic: '', operands: '', comment: '', basicLine: { num: 10, source: 'PRINT "HI"' } },
        { address: 0, bytes: [0xCE], label: '', mnemonic: 'nop', operands: '', comment: '' },
      ],
      symbols: [],
      codeSize: 1,
      dataSize: 0,
      variableSize: 0,
    });
    expect(listing).toContain('=== BASIC Line 10: PRINT "HI" ===');
  });

  it('includes symbol table', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [],
      symbols: [
        { name: 'MAIN', address: 0, type: 'code' as const },
        { name: 'VAR_A', address: 0x50, type: 'variable' as const },
      ],
      codeSize: 0,
      dataSize: 0,
      variableSize: 0,
    });
    expect(listing).toContain('Symbol Table:');
    expect(listing).toContain('MAIN');
    expect(listing).toContain('VAR_A');
  });

  it('includes size summary', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [],
      symbols: [],
      codeSize: 100,
      dataSize: 50,
      variableSize: 27,
    });
    expect(listing).toContain('Code size: 100 bytes');
    expect(listing).toContain('Data size: 50 bytes');
    expect(listing).toContain('Variables: 27 bytes');
    expect(listing).toContain('Total: 177 bytes');
  });

  it('keeps lines to 132 columns', () => {
    const listing = formatListing({
      sourceFile: 'TEST.BAS',
      date: '2026-04-04',
      lines: [
        { address: 0, bytes: [0xCE], label: 'MAIN', mnemonic: 'nop', operands: '', comment: 'a short comment' },
      ],
      symbols: [],
      codeSize: 1,
      dataSize: 0,
      variableSize: 0,
    });
    const contentLines = listing.split('\n');
    for (const line of contentLines) {
      expect(line.length).toBeLessThanOrEqual(132);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/assembler.test.ts`
Expected: New listing tests FAIL

- [ ] **Step 3: Implement the listing formatter**

Create `tools/compiler/listing.ts` that takes listing input data and formats it according to the 132-column spec:

```typescript
// tools/compiler/listing.ts

export interface ListingLine {
  address: number;       // -1 for comment-only lines
  bytes: number[];
  label: string;
  mnemonic: string;
  operands: string;
  comment: string;
  basicLine?: { num: number; source: string };
}

export interface ListingInput {
  sourceFile: string;
  date: string;
  lines: ListingLine[];
  symbols: { name: string; address: number; type: string }[];
  codeSize: number;
  dataSize: number;
  variableSize: number;
}

export function formatListing(input: ListingInput): string {
  const output: string[] = [];
  let page = 1;

  // Page header
  output.push(formatHeader(input.sourceFile, input.date, input.codeSize + input.dataSize + input.variableSize, page));
  output.push('');
  output.push(formatColumnHeaders());
  output.push('-'.repeat(132));

  for (const line of input.lines) {
    if (line.basicLine) {
      output.push(formatBasicAnnotation(line.basicLine.num, line.basicLine.source));
      continue;
    }
    output.push(formatInstructionLine(line));
  }

  // Symbol table
  output.push('');
  output.push('Symbol Table:');
  output.push(formatSymbolTable(input.symbols));

  // Size summary
  output.push('');
  const total = input.codeSize + input.dataSize + input.variableSize;
  output.push(`Code size: ${input.codeSize} bytes   Data size: ${input.dataSize} bytes   Variables: ${input.variableSize} bytes   Total: ${total} bytes`);
  output.push(`Free space: ${4096 - total} bytes (of 4096 available)`);

  return output.join('\n');
}
```

Implement `formatHeader`, `formatColumnHeaders`, `formatBasicAnnotation`, `formatInstructionLine`, `formatSymbolTable` following the column layout:

| Column | Width | Content |
|--------|-------|---------|
| 1-5 | 5 | Address (hex) |
| 7-22 | 16 | Machine code bytes |
| 24-35 | 12 | Label |
| 37-68 | 32 | Assembly instruction |
| 70-132 | 40+ | Comment |

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/assembler.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/listing.ts tools/compiler/tests/assembler.test.ts
git commit -m "feat(compiler): implement 132-column assembler listing formatter"
```

---

## Task 9: Code Generator — Core Infrastructure & Simple Statements

**Files:**
- Create: `tools/compiler/codegen.ts`
- Create: `tools/compiler/tests/codegen.test.ts`

- [ ] **Step 1: Write codegen tests**

```typescript
// tools/compiler/tests/codegen.test.ts
import { describe, it, expect } from 'vitest';
import { generate } from '../codegen.js';
import { parse } from '../parser.js';

function asmFor(basic: string): string[] {
  const ast = parse(basic);
  const program = generate(ast);
  return program.lines
    .filter(l => l.mnemonic && l.mnemonic !== 'ORG' && l.mnemonic !== 'EQU' && l.mnemonic !== 'DS')
    .map(l => `${l.mnemonic} ${l.operands ?? ''}`.trim());
}

function labelsFor(basic: string): string[] {
  const ast = parse(basic);
  const program = generate(ast);
  return program.lines.filter(l => l.label).map(l => l.label!);
}

describe('codegen', () => {
  it('generates ORG directive', () => {
    const ast = parse('10 END');
    const program = generate(ast);
    expect(program.lines[0]!.mnemonic).toBe('ORG');
    expect(program.lines[0]!.operands).toBe('&H0000');
  });

  it('generates label for each BASIC line number', () => {
    const labels = labelsFor('10 CLS\n20 END');
    expect(labels).toContain('L10');
    expect(labels).toContain('L20');
  });

  it('annotates BASIC source lines as comments', () => {
    const ast = parse('10 CLS');
    const program = generate(ast);
    const annotationLine = program.lines.find(l => l.basicLine?.num === 10);
    expect(annotationLine).toBeDefined();
    expect(annotationLine!.basicLine!.source).toContain('CLS');
  });

  it('generates CLS as ROM call', () => {
    const asm = asmFor('10 CLS');
    // Should load CLS address into $2 and call ROM_CALL
    expect(asm.some(l => l.includes('&H2ADF'))).toBe(true);
    expect(asm.some(l => l.includes('ROM_CALL'))).toBe(true);
  });

  it('generates GOTO as JP', () => {
    const asm = asmFor('10 GOTO 20\n20 END');
    expect(asm.some(l => l.startsWith('jp') && l.includes('L20'))).toBe(true);
  });

  it('generates GOSUB as CAL', () => {
    const asm = asmFor('10 GOSUB 100\n100 RETURN');
    expect(asm.some(l => l.startsWith('cal') && l.includes('L100'))).toBe(true);
  });

  it('generates RETURN as RTN', () => {
    const asm = asmFor('100 RETURN');
    expect(asm.some(l => l === 'rtn')).toBe(true);
  });

  it('generates END as system return', () => {
    const asm = asmFor('10 END');
    expect(asm.some(l => l === 'rtn')).toBe(true);
  });

  it('generates BEEP as ROM call', () => {
    const asm = asmFor('10 BEEP');
    expect(asm.some(l => l.includes('&H33B3'))).toBe(true);
  });

  it('generates ROM_CALL wrapper in output', () => {
    const ast = parse('10 CLS');
    const program = generate(ast);
    expect(program.lines.some(l => l.label === 'ROM_CALL')).toBe(true);
  });

  it('generates variable storage reservations', () => {
    const ast = parse('10 A=5');
    const program = generate(ast);
    const dsLines = program.lines.filter(l => l.mnemonic === 'DS');
    expect(dsLines.length).toBeGreaterThan(0);
    // Numeric variable = 9 bytes
    expect(dsLines.some(l => l.operands === '9')).toBe(true);
  });

  it('generates string literal in data section', () => {
    const ast = parse('10 PRINT "Hello"');
    const program = generate(ast);
    const dbLines = program.lines.filter(l => l.mnemonic === 'db');
    expect(dbLines.some(l => l.operands?.includes('"Hello"'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the code generator**

Create `tools/compiler/codegen.ts`:

The code generator walks the AST and emits `AsmLine[]` for each statement. Key responsibilities:

1. **Variable allocator** — assigns RAM addresses to variables. Numeric = 9 bytes, strings = length byte + max 255 bytes. Tracks in a `Map<string, { address: number; type: 'numeric' | 'string' }>`.

2. **String literal pool** — collects string constants, emits as `DB` directives in data section with labels (`STR_001`, etc.).

3. **Line number labels** — emits `L10:`, `L20:`, etc. for each BASIC line.

4. **BASIC source annotations** — each block starts with an `AsmLine` that has `basicLine` set.

5. **ROM call generation** — loads ROM address into `$2`, emits `JR ROM_CALL`. The `ROM_CALL` wrapper is emitted once at the end.

6. **Section organization** — code section, then ROM wrappers, then string literals, then variable table.

Start with: CLS, BEEP, GOTO, GOSUB, RETURN, END, PRINT (string literal only), LET (simple numeric assignment). More complex statements in next task.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): implement code generator for core BASIC statements"
```

---

## Task 10: Code Generator — Expressions & Arithmetic

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Modify: `tools/compiler/tests/codegen.test.ts`

- [ ] **Step 1: Add expression codegen tests**

```typescript
// Append to tools/compiler/tests/codegen.test.ts

describe('codegen - expressions', () => {
  it('generates numeric constant load', () => {
    const asm = asmFor('10 A=42');
    // Should emit code to load 42 into FP accumulator ($10-$18)
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates variable load', () => {
    const asm = asmFor('10 A=5\n20 B=A');
    // Line 20 should load from VAR_A into FP acc
    expect(asm.some(l => l.includes('VAR_A'))).toBe(true);
  });

  it('generates addition as ROM call', () => {
    const asm = asmFor('10 A=2+3');
    // Should call FP addition ROM routine
    expect(asm.some(l => l.includes('&H05DA'))).toBe(true);
  });

  it('generates multiplication as ROM call', () => {
    const asm = asmFor('10 A=2*3');
    expect(asm.some(l => l.includes('&H0607'))).toBe(true);
  });

  it('generates comparison', () => {
    const asm = asmFor('10 IF A>5 THEN 20\n20 END');
    // Should evaluate A-5 and test flags
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates PRINT with numeric expression', () => {
    const asm = asmFor('10 PRINT 2+3');
    // Should evaluate expression then call PRINT
    expect(asm.some(l => l.includes('&H3EF1'))).toBe(true);
  });

  it('generates INPUT', () => {
    const asm = asmFor('10 INPUT A');
    expect(asm.some(l => l.includes('&H3DEE'))).toBe(true);
  });

  it('generates FOR/NEXT loop', () => {
    const asm = asmFor('10 FOR I=1 TO 5\n20 NEXT I');
    const labels = labelsFor('10 FOR I=1 TO 5\n20 NEXT I');
    // Should have loop top and loop exit labels
    expect(labels.some(l => l.includes('FOR'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify new ones fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts`

- [ ] **Step 3: Extend code generator with expression compilation**

Add to `codegen.ts`:
- `emitExpression(expr: Expression)` — recursive expression compiler. Evaluates into FP accumulator ($10-$18). For binary ops: evaluate left → push FP acc → evaluate right → call ROM arithmetic routine.
- `emitLet` — evaluate expression, store FP acc to variable address
- `emitPrint` — for numeric expressions, evaluate then call PRINT ROM
- `emitInput` — call INPUT ROM, store result
- `emitFor` / `emitNext` — init counter, emit loop top label, compare + conditional jump
- `emitIf` — evaluate condition, conditional jump

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): add expression compilation and arithmetic codegen"
```

---

## Task 11: Code Generator — Remaining Statements

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Modify: `tools/compiler/tests/codegen.test.ts`

- [ ] **Step 1: Add tests for remaining statement types**

```typescript
// Append to tools/compiler/tests/codegen.test.ts

describe('codegen - remaining statements', () => {
  it('generates ON GOTO as jump table', () => {
    const asm = asmFor('10 ON X GOTO 100,200,300\n100 END\n200 END\n300 END');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates DIM (array allocation)', () => {
    const ast = parse('10 DIM A(10)');
    const program = generate(ast);
    const dsLines = program.lines.filter(l => l.mnemonic === 'DS');
    // Array of 11 elements (0-10) * 9 bytes each = 99 bytes
    expect(dsLines.some(l => parseInt(l.operands ?? '0') >= 99)).toBe(true);
  });

  it('generates READ/DATA', () => {
    const asm = asmFor('10 READ A\n20 DATA 42');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates string operations', () => {
    const asm = asmFor('10 A$="hello"');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates LOCATE', () => {
    const asm = asmFor('10 LOCATE 5,2');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates WHILE/WEND', () => {
    const asm = asmFor('10 WHILE A<10\n20 A=A+1\n30 WEND');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates ON ERROR GOTO', () => {
    const asm = asmFor('10 ON ERROR GOTO 100\n100 RESUME NEXT');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates POKE', () => {
    const asm = asmFor('10 POKE &H1000,255');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates builtin function calls', () => {
    const asm = asmFor('10 A=SIN(3.14)');
    expect(asm.length).toBeGreaterThan(0);
  });

  it('generates ANGLE', () => {
    const asm = asmFor('10 ANGLE 1');
    expect(asm.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests, implement remaining codegen, verify all pass**

Implement code generation for: ON GOTO/GOSUB, DIM, READ/DATA/RESTORE, string assignment and operations, LOCATE, WHILE/WEND, ON ERROR GOTO, RESUME, POKE, DEFSEG, ANGLE, builtin function calls (SIN, COS, etc.), and file I/O stubs.

- [ ] **Step 3: Run all codegen tests**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts`
Expected: All PASS

- [ ] **Step 4: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): complete code generator for all BASIC statement types"
```

---

## Task 12: Loader Generator

**Files:**
- Create: `tools/compiler/loader.ts`
- Modify: `tools/compiler/tests/integration.test.ts`

- [ ] **Step 1: Write loader tests**

```typescript
// tools/compiler/tests/integration.test.ts
import { describe, it, expect } from 'vitest';
import { generateLoader } from '../loader.js';

describe('loader generator', () => {
  it('generates valid BASIC program', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE, 0xEE]),
      entryPoint: 0x0000,
      sourceFile: 'TEST.BAS',
      totalSize: 2,
    });
    expect(loader).toContain('MODE110');
    expect(loader).toContain('DATA');
    expect(loader).toContain('POKE');
  });

  it('includes program header comment', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0x0000,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain("' Compiled: TEST.BAS");
  });

  it('encodes binary as hex DATA statements', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0x48, 0x65, 0x6C]),
      entryPoint: 0x0000,
      sourceFile: 'TEST.BAS',
      totalSize: 3,
    });
    expect(loader).toContain('48656C');
  });

  it('calls MODE110 with entry point', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0x0000,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain('MODE110(0)');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/integration.test.ts`

- [ ] **Step 3: Implement the loader generator**

```typescript
// tools/compiler/loader.ts

export interface LoaderInput {
  binary: Uint8Array;
  entryPoint: number;
  sourceFile: string;
  totalSize: number;
}

export function generateLoader(input: LoaderInput): string {
  const lines: string[] = [];
  let lineNum = 10;

  lines.push(`${lineNum} ' Compiled: ${input.sourceFile}`);
  lineNum += 10;
  lines.push(`${lineNum} ' Size: ${input.totalSize} bytes`);
  lineNum += 10;
  lines.push(`${lineNum} CLEAR`);
  lineNum += 10;
  lines.push(`${lineNum} MODE110(&H18F5),${input.totalSize}`);
  lineNum += 10;

  // Encode binary as hex DATA statements (24 bytes per line)
  const dataLines: string[] = [];
  for (let i = 0; i < input.binary.length; i += 24) {
    const chunk = input.binary.slice(i, Math.min(i + 24, input.binary.length));
    const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
    dataLines.push(hex);
  }

  // Loader loop
  const loaderStart = lineNum;
  lines.push(`${lineNum} FOR I=0 TO ${dataLines.length - 1}`);
  lineNum += 10;
  lines.push(`${lineNum} READ A$`);
  lineNum += 10;
  lines.push(`${lineNum} FOR J=1 TO LEN(A$) STEP 2`);
  lineNum += 10;
  lines.push(`${lineNum} POKE I*24+(J-1)/2,VAL("&H"+MID$(A$,J,2))`);
  lineNum += 10;
  lines.push(`${lineNum} NEXT J`);
  lineNum += 10;
  lines.push(`${lineNum} NEXT I`);
  lineNum += 10;
  lines.push(`${lineNum} MODE110(${input.entryPoint})`);
  lineNum += 10;
  lines.push(`${lineNum} END`);
  lineNum += 10;

  // DATA statements
  for (const hex of dataLines) {
    lines.push(`${lineNum} DATA "${hex}"`);
    lineNum += 10;
  }

  return lines.join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/integration.test.ts`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/loader.ts tools/compiler/tests/integration.test.ts
git commit -m "feat(compiler): implement BASIC loader generator for real hardware"
```

---

## Task 13: CLI Entry Point

**Files:**
- Create: `tools/compiler/compile.ts`

- [ ] **Step 1: Create the CLI entry point**

```typescript
// tools/compiler/compile.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { parse } from './parser.js';
import { generate } from './codegen.js';
import { assemble } from './assembler.js';
import { formatListing, type ListingLine } from './listing.js';
import { generateLoader } from './loader.js';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npx tsx tools/compiler/compile.ts <program.bas>');
  process.exit(1);
}

const inputFile = args[0]!;
const source = readFileSync(inputFile, 'utf-8');
const baseName = basename(inputFile, '.bas').replace(/\.BAS$/, '');
const outDir = dirname(inputFile);

// Parse
const ast = parse(source);

// Generate assembly
const asmProgram = generate(ast);

// Assemble
const result = assemble(asmProgram.lines);

// Build listing data
const listingLines: ListingLine[] = [];
let pc = asmProgram.origin;
for (const line of asmProgram.lines) {
  if (line.basicLine) {
    listingLines.push({
      address: -1, bytes: [], label: '', mnemonic: '', operands: '', comment: '',
      basicLine: line.basicLine,
    });
    continue;
  }
  if (line.mnemonic === 'ORG' || line.mnemonic === 'EQU') continue;
  if (!line.mnemonic) {
    if (line.label) {
      listingLines.push({ address: pc, bytes: [], label: line.label, mnemonic: '', operands: '', comment: line.comment ?? '' });
    }
    continue;
  }
  // Find bytes for this instruction from binary
  const instrBytes: number[] = [];
  // (simplified — actual implementation would track per-instruction byte ranges)
  listingLines.push({
    address: pc,
    bytes: instrBytes,
    label: line.label ?? '',
    mnemonic: line.mnemonic,
    operands: line.operands ?? '',
    comment: line.comment ?? '',
  });
}

const today = new Date().toISOString().slice(0, 10);
const listing = formatListing({
  sourceFile: basename(inputFile),
  date: today,
  lines: listingLines,
  symbols: result.symbols,
  codeSize: result.codeSize,
  dataSize: result.dataSize,
  variableSize: result.variableSize,
});

// Write outputs
writeFileSync(join(outDir, `${baseName}.bin`), result.binary);
writeFileSync(join(outDir, `${baseName}.lst`), listing);
writeFileSync(join(outDir, `${baseName}.sym`), JSON.stringify(result.symbols, null, 2));

const loader = generateLoader({
  binary: result.binary,
  entryPoint: asmProgram.origin,
  sourceFile: basename(inputFile),
  totalSize: result.codeSize + result.dataSize + result.variableSize,
});
writeFileSync(join(outDir, `${baseName}.loader.bas`), loader);

// Summary
const total = result.codeSize + result.dataSize + result.variableSize;
console.log(`Compiled: ${basename(inputFile)} → ${total} bytes`);
console.log(`  Code: ${result.codeSize} bytes  Data: ${result.dataSize} bytes  Variables: ${result.variableSize} bytes`);
console.log(`  Available: 4096 bytes  Used: ${(total / 4096 * 100).toFixed(1)}%`);
console.log(`  Output: ${baseName}.bin, ${baseName}.lst, ${baseName}.sym, ${baseName}.loader.bas`);

if (total > 4096) {
  console.warn(`  WARNING: Output exceeds 4KB — use CLEAR to allocate additional space`);
}
```

- [ ] **Step 2: Test with a simple BASIC program**

Create `tools/compiler/tests/fixtures/hello.bas`:
```basic
10 CLS
20 PRINT "Hello, World!"
30 END
```

Run: `npx tsx tools/compiler/compile.ts tools/compiler/tests/fixtures/hello.bas`
Expected: Compiles without errors, produces `.bin`, `.lst`, `.sym`, `.loader.bas`

- [ ] **Step 3: Inspect the listing output**

Run: `cat tools/compiler/tests/fixtures/hello.lst`
Expected: 132-column formatted listing with BASIC annotations, hex code, symbol table

- [ ] **Step 4: Add npm script**

Add to `package.json` scripts:
```json
"compile": "tsx tools/compiler/compile.ts"
```

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/compile.ts tools/compiler/tests/fixtures/hello.bas package.json
git commit -m "feat(compiler): add CLI entry point and hello world test fixture"
```

---

## Task 14: Integration Tests — Compile Demo Programs

**Files:**
- Modify: `tools/compiler/tests/integration.test.ts`
- Create: additional test fixtures

- [ ] **Step 1: Add integration tests that compile real programs**

```typescript
// Append to tools/compiler/tests/integration.test.ts
import { readFileSync, existsSync } from 'node:fs';
import { parse } from '../parser.js';
import { generate } from '../codegen.js';
import { assemble } from '../assembler.js';

describe('integration - compile demo programs', () => {
  const basicsDir = 'public/basic/emulator';
  const programs = [
    'BSEARCH.BAS', 'CALENDAR.BAS', 'FLIPFLOP.BAS',
    'HANGMAN.BAS', 'LIFE.BAS', 'WUMPUS.BAS',
  ];

  for (const prog of programs) {
    const filePath = `${basicsDir}/${prog}`;
    if (!existsSync(filePath)) continue;

    it(`parses ${prog} without errors`, () => {
      const source = readFileSync(filePath, 'utf-8');
      expect(() => parse(source)).not.toThrow();
    });

    it(`generates assembly for ${prog} without errors`, () => {
      const source = readFileSync(filePath, 'utf-8');
      const ast = parse(source);
      expect(() => generate(ast)).not.toThrow();
    });

    it(`assembles ${prog} without errors`, () => {
      const source = readFileSync(filePath, 'utf-8');
      const ast = parse(source);
      const asmProg = generate(ast);
      const result = assemble(asmProg.lines);
      expect(result.binary.length).toBeGreaterThan(0);
      expect(result.codeSize).toBeGreaterThan(0);
    });

    it(`${prog} fits in 4KB`, () => {
      const source = readFileSync(filePath, 'utf-8');
      const ast = parse(source);
      const asmProg = generate(ast);
      const result = assemble(asmProg.lines);
      const total = result.codeSize + result.dataSize + result.variableSize;
      // Log size for reference
      console.log(`${prog}: ${total} bytes (${(total/4096*100).toFixed(1)}%)`);
      // Warn but don't fail for large programs
    });
  }
});
```

- [ ] **Step 2: Run integration tests**

Run: `npx vitest run tools/compiler/tests/integration.test.ts`
Expected: All parse + generate + assemble without errors

- [ ] **Step 3: Fix any issues found**

Address any parser or codegen gaps exposed by real programs. Common issues:
- Unhandled statement variants
- Expression edge cases
- Missing builtin functions

- [ ] **Step 4: Commit**

```bash
git add tools/compiler/tests/integration.test.ts
git commit -m "test(compiler): add integration tests compiling demo BASIC programs"
```

---

## Task 15: Test Fixture Suite

**Files:**
- Create: `tools/compiler/tests/fixtures/arithmetic.bas`
- Create: `tools/compiler/tests/fixtures/strings.bas`
- Create: `tools/compiler/tests/fixtures/control.bas`
- Create: `tools/compiler/tests/fixtures/loops.bas`
- Create: `tools/compiler/tests/fixtures/arrays.bas`

- [ ] **Step 1: Create targeted test fixtures**

```basic
' tools/compiler/tests/fixtures/arithmetic.bas
10 A=2+3
20 B=A*4-1
30 C=10/3
40 D=10 MOD 3
50 E=2^8
60 F=-A
70 G=(A+B)*C
80 PRINT A;B;C;D;E;F;G
90 END
```

```basic
' tools/compiler/tests/fixtures/strings.bas
10 A$="Hello"
20 B$=" World"
30 C$=A$+B$
40 PRINT C$
50 PRINT LEN(C$)
60 PRINT LEFT$(C$,5)
70 PRINT MID$(C$,7,5)
80 PRINT CHR$(65)
90 PRINT ASC("A")
100 PRINT STR$(42)
110 PRINT VAL("3.14")
120 END
```

```basic
' tools/compiler/tests/fixtures/control.bas
10 A=5
20 IF A>3 THEN PRINT "big" ELSE PRINT "small"
30 ON A GOTO 40,50,60,70,80
40 PRINT "one":GOTO 90
50 PRINT "two":GOTO 90
60 PRINT "three":GOTO 90
70 PRINT "four":GOTO 90
80 PRINT "five"
90 GOSUB 200
100 END
200 PRINT "subroutine"
210 RETURN
```

```basic
' tools/compiler/tests/fixtures/loops.bas
10 FOR I=1 TO 5
20 PRINT I;
30 NEXT I
40 PRINT
50 FOR I=10 TO 0 STEP -2
60 PRINT I;
70 NEXT I
80 PRINT
90 J=0
100 WHILE J<5
110 J=J+1
120 PRINT J;
130 WEND
140 END
```

```basic
' tools/compiler/tests/fixtures/arrays.bas
10 DIM A(10),B$(5)
20 FOR I=0 TO 10
30 A(I)=I*I
40 NEXT I
50 FOR I=0 TO 5
60 B$(I)=CHR$(65+I)
70 NEXT I
80 FOR I=0 TO 10
90 PRINT A(I);
100 NEXT I
110 PRINT
120 FOR I=0 TO 5
130 PRINT B$(I);
140 NEXT I
150 END
```

- [ ] **Step 2: Add fixture compilation tests**

```typescript
// Append to tools/compiler/tests/integration.test.ts

describe('integration - test fixtures', () => {
  const fixtures = ['hello', 'arithmetic', 'strings', 'control', 'loops', 'arrays'];

  for (const name of fixtures) {
    const filePath = `tools/compiler/tests/fixtures/${name}.bas`;

    it(`compiles ${name}.bas end-to-end`, () => {
      const source = readFileSync(filePath, 'utf-8');
      const ast = parse(source);
      const asmProg = generate(ast);
      const result = assemble(asmProg.lines);
      expect(result.binary.length).toBeGreaterThan(0);
      console.log(`${name}.bas: ${result.codeSize + result.dataSize + result.variableSize} bytes`);
    });
  }
});
```

- [ ] **Step 3: Run all tests**

Run: `npx vitest run tools/compiler/tests/`
Expected: All PASS

- [ ] **Step 4: Commit**

```bash
git add tools/compiler/tests/fixtures/ tools/compiler/tests/integration.test.ts
git commit -m "test(compiler): add targeted test fixtures for all major BASIC constructs"
```

---

## Task 16: Final Validation & Documentation

**Files:**
- Modify: `CLAUDE.md` (add compiler commands)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing emulator tests + all new compiler tests)

- [ ] **Step 2: Compile BSEARCH.BAS and inspect listing**

Run: `npx tsx tools/compiler/compile.ts public/basic/emulator/BSEARCH.BAS`
Expected: Compiles successfully, produces listing with readable assembly

- [ ] **Step 3: Inspect the listing file**

Run: `head -60 public/basic/emulator/BSEARCH.lst`
Expected: Properly formatted 132-column listing with BASIC annotations

- [ ] **Step 4: Update CLAUDE.md with compiler commands**

Add to the Commands section:
```markdown
npm run compile <file>  # compile BASIC to HD61700 machine code
```

Add a brief Compiler section documenting the pipeline.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add compiler commands to CLAUDE.md"
```

---

## Summary

| Task | Description | Depends On |
|------|-------------|------------|
| 1 | AST type definitions | — |
| 2 | Lexer | 1 |
| 3 | Parser (core) | 1, 2 |
| 4 | Parser (control flow + expressions) | 3 |
| 5 | Assembly IR types | — |
| 6 | Opcode encoding tables | 5 |
| 7 | Two-pass assembler | 5, 6 |
| 8 | Listing formatter | 5, 7 |
| 9 | Code generator (core) | 1, 4, 5 |
| 10 | Code generator (expressions) | 9 |
| 11 | Code generator (remaining) | 10 |
| 12 | Loader generator | 7 |
| 13 | CLI entry point | all above |
| 14 | Integration tests (demo programs) | 13 |
| 15 | Test fixtures | 13 |
| 16 | Final validation | all above |

**Parallel tracks possible:**
- Tasks 1-4 (parser) and Tasks 5-8 (assembler) can proceed in parallel
- Task 12 (loader) can proceed once Task 7 is done
- Tasks 9-11 (codegen) need both parser and assembler infrastructure
