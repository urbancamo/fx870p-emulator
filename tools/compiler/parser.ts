// tools/compiler/parser.ts
// Recursive descent parser for Casio JIS Standard BASIC (FX-870P / VX-4)
// Produces an AST as defined in ast.ts

import { tokenize, TokenType } from './lexer.js';
import type { Token } from './lexer.js';
import type {
  Program, Statement, Expression,
  LetStatement, PrintStatement, InputStatement, ClsStatement,
  LocateStatement, BeepStatement, AngleStatement, GotoStatement,
  GosubStatement, ReturnStatement, OnBranchStatement, IfStatement,
  ForStatement, NextStatement, WhileStatement, WendStatement,
  EndStatement, OnErrorGotoStatement, ResumeStatement, ReadStatement,
  DataStatement, RestoreStatement, DimStatement, EraseStatement,
  ClearStatement, DefmStatement, DefsegStatement, PokeStatement,
  DefFnStatement, OpenStatement, CloseStatement, PrintFileStatement,
  InputFileStatement, LineInputFileStatement, WriteFileStatement,
  StatStatement, StatClearStatement, RemStatement, DefchrStatement,
  ChainStatement, ModeStatement,
  VarRef, PrintItem, Literal, ArrayDecl,
} from './ast.js';

// ---------------------------------------------------------------------------
// Token stream wrapper
// ---------------------------------------------------------------------------

class TokenStream {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek(offset = 0): Token {
    const idx = this.pos + offset;
    if (idx >= this.tokens.length) {
      // Return EOL sentinel
      return { type: TokenType.EOL, value: '', col: 0 };
    }
    return this.tokens[idx]!;
  }

  advance(): Token {
    const tok = this.tokens[this.pos];
    if (this.pos < this.tokens.length) this.pos++;
    return tok!;
  }

  isEol(): boolean {
    return this.peek().type === TokenType.EOL;
  }

  isKeyword(kw: string): boolean {
    const t = this.peek();
    return t.type === TokenType.Keyword && t.value === kw;
  }

  isColon(): boolean {
    return this.peek().type === TokenType.Colon;
  }

  consumeKeyword(kw: string): void {
    const t = this.advance();
    if (t.type !== TokenType.Keyword || t.value !== kw) {
      throw new Error(`Expected keyword '${kw}', got '${t.value}' (type ${t.type})`);
    }
  }

  consume(type: TokenType): Token {
    const t = this.advance();
    if (t.type !== type) {
      throw new Error(`Expected token type ${type}, got ${t.type} ('${t.value}')`);
    }
    return t;
  }

  tryConsume(type: TokenType): Token | undefined {
    if (this.peek().type === type) return this.advance();
    return undefined;
  }

  tryConsumeKeyword(kw: string): boolean {
    if (this.isKeyword(kw)) {
      this.advance();
      return true;
    }
    return false;
  }

  getPos(): number {
    return this.pos;
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function parse(source: string): Program {
  const lines = new Map<number, Statement[]>();
  const dataValues: Literal[] = [];

  const rawLines = source.split(/\r?\n/);

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (trimmed === '') continue;

    const tokens = tokenize(trimmed);
    // Remove the final EOL token so we only have content tokens + EOL at end
    const stream = new TokenStream(tokens);

    // Expect line number
    if (stream.peek().type !== TokenType.LineNumber) continue;
    const lineNumTok = stream.advance();
    const lineNum = parseInt(lineNumTok.value, 10);

    // Parse statements separated by colons
    const stmts = parseStatements(stream);

    // Collect DATA values
    for (const stmt of stmts) {
      if (stmt.type === 'data') {
        dataValues.push(...stmt.values);
      }
    }

    lines.set(lineNum, stmts);
  }

  return { lines, dataValues };
}

// ---------------------------------------------------------------------------
// Statement parsing
// ---------------------------------------------------------------------------

function parseStatements(stream: TokenStream): Statement[] {
  const stmts: Statement[] = [];
  let prevPos = -1;

  while (!stream.isEol()) {
    // Skip stray colons at the start
    while (stream.isColon()) stream.advance();
    if (stream.isEol()) break;

    // Guard against infinite loop
    const curPos = stream.getPos();
    if (curPos === prevPos) { stream.advance(); continue; }
    prevPos = curPos;

    const stmt = parseStatement(stream);
    if (stmt !== null) stmts.push(stmt);

    // After each statement, consume a colon separator if present
    if (stream.isColon()) stream.advance();
  }

  return stmts;
}

function parseStatement(stream: TokenStream): Statement | null {
  const tok = stream.peek();

  // Comment token (apostrophe)
  if (tok.type === TokenType.Comment) {
    const text = stream.advance().value;
    return { type: 'rem', text: text.replace(/^'\s*/, '') } as RemStatement;
  }

  if (tok.type === TokenType.Keyword) {
    return parseKeywordStatement(stream);
  }

  // Implicit LET: Ident =  or  Ident$ =
  if (tok.type === TokenType.Ident) {
    return parseImplicitLet(stream);
  }

  // Unknown — skip token
  stream.advance();
  return null;
}

function parseKeywordStatement(stream: TokenStream): Statement {
  const kw = stream.peek().value;

  switch (kw) {
    case 'REM': return parseRem(stream);
    case 'LET': return parseLet(stream);
    case 'PRINT': return parsePrint(stream, 'lcd');
    case 'LPRINT': return parsePrint(stream, 'printer');
    case 'INPUT': return parseInput(stream);
    case 'CLS': { stream.advance(); return { type: 'cls' } as ClsStatement; }
    case 'LOCATE': return parseLocate(stream);
    case 'BEEP': { stream.advance(); return { type: 'beep' } as BeepStatement; }
    case 'ANGLE': return parseAngle(stream);
    case 'GOTO': return parseGoto(stream);
    case 'GOSUB': return parseGosub(stream);
    case 'RETURN': return parseReturn(stream);
    case 'ON ERROR GOTO': return parseOnErrorGoto(stream);
    case 'ON': return parseOn(stream);
    case 'IF': return parseIf(stream);
    case 'FOR': return parseFor(stream);
    case 'NEXT': return parseNext(stream);
    case 'WHILE': return parseWhile(stream);
    case 'WEND': { stream.advance(); return { type: 'wend' } as WendStatement; }
    case 'END': { stream.advance(); return { type: 'end', kind: 'end' } as EndStatement; }
    case 'STOP': { stream.advance(); return { type: 'end', kind: 'stop' } as EndStatement; }
    case 'CONT': { stream.advance(); return { type: 'end', kind: 'cont' } as EndStatement; }
    case 'RESUME NEXT': { stream.advance(); return { type: 'resume', target: 'next' } as ResumeStatement; }
    case 'RESUME': return parseResume(stream);
    case 'READ': return parseRead(stream);
    case 'DATA': return parseData(stream);
    case 'RESTORE': return parseRestore(stream);
    case 'DIM': return parseDim(stream);
    case 'ERASE': return parseErase(stream);
    case 'CLEAR': return parseClear(stream);
    case 'DEFM': return parseDefm(stream);
    case 'DEFSEG': return parseDefseg(stream);
    case 'POKE': return parsePoke(stream);
    case 'DEF': return parseDefFn(stream);
    case 'OPEN': return parseOpen(stream);
    case 'CLOSE': return parseClose(stream);
    case 'PRINT#': return parsePrintFile(stream);
    case 'INPUT#': return parseInputFile(stream);
    case 'LINE INPUT#': return parseLineInputFile(stream);
    case 'WRITE#': return parseWriteFile(stream);
    case 'STAT CLEAR': { stream.advance(); return { type: 'stat-clear' } as StatClearStatement; }
    case 'STAT': return parseStat(stream);
    case 'DEFCHR$': return parseDefchr(stream);
    case 'CHAIN': return parseChain(stream);
    case 'MODE': return parseMode(stream);
    default:
      // Unknown keyword — skip
      stream.advance();
      return { type: 'rem', text: '' } as RemStatement;
  }
}

// ---------------------------------------------------------------------------
// REM
// ---------------------------------------------------------------------------

function parseRem(stream: TokenStream): RemStatement {
  stream.consumeKeyword('REM');
  let text = '';
  if (stream.peek().type === TokenType.Comment) {
    text = stream.advance().value.trimStart();
  }
  return { type: 'rem', text };
}

// ---------------------------------------------------------------------------
// LET (explicit and implicit)
// ---------------------------------------------------------------------------

function parseLet(stream: TokenStream): LetStatement {
  stream.consumeKeyword('LET');
  return parseAssignment(stream);
}

function parseImplicitLet(stream: TokenStream): LetStatement {
  return parseAssignment(stream);
}

function parseAssignment(stream: TokenStream): LetStatement {
  const varRef = parseVarRefForAssignment(stream);
  stream.consume(TokenType.Eq);
  const expr = parseExpression(stream);
  return { type: 'let', variable: varRef, expr };
}

// Parse a variable reference on the left-hand side of assignment
function parseVarRefForAssignment(stream: TokenStream): VarRef {
  const ident = stream.consume(TokenType.Ident);
  const name = ident.value;
  const isString = name.endsWith('$');

  // Check for array indices
  if (stream.peek().type === TokenType.LParen) {
    stream.advance(); // (
    const indices: Expression[] = [];
    indices.push(parseExpression(stream));
    while (stream.peek().type === TokenType.Comma) {
      stream.advance();
      indices.push(parseExpression(stream));
    }
    stream.consume(TokenType.RParen);
    return { name, isString, indices };
  }

  return { name, isString };
}

// ---------------------------------------------------------------------------
// PRINT / LPRINT
// ---------------------------------------------------------------------------

function parsePrint(stream: TokenStream, device: 'lcd' | 'printer'): PrintStatement {
  stream.advance(); // PRINT or LPRINT

  // Check for USING
  let using: Expression | undefined;
  if (stream.isKeyword('USING')) {
    stream.advance();
    using = parseExpression(stream);
    // Consume comma after USING format
    stream.tryConsume(TokenType.Comma);
  }

  const items: PrintItem[] = [];

  // Parse items until EOL or colon or a statement keyword (e.g. ELSE)
  while (!stream.isEol() && !stream.isColon()) {
    const tok = stream.peek();

    // Stop at statement-level keywords that can't be part of a print expression
    if (tok.type === TokenType.Keyword && STATEMENT_KEYWORDS.has(tok.value)) break;

    if (tok.type === TokenType.Semicolon) {
      stream.advance();
      items.push({ type: 'separator', kind: ';' });
    } else if (tok.type === TokenType.Comma) {
      stream.advance();
      items.push({ type: 'separator', kind: ',' });
    } else if (tok.type === TokenType.Keyword && tok.value === 'TAB') {
      stream.advance();
      stream.consume(TokenType.LParen);
      const col = parseExpression(stream);
      stream.consume(TokenType.RParen);
      items.push({ type: 'tab', col });
    } else {
      items.push({ type: 'expr', value: parseExpression(stream) });
    }
  }

  return { type: 'print', device, items, using };
}

// ---------------------------------------------------------------------------
// INPUT
// ---------------------------------------------------------------------------

function parseInput(stream: TokenStream): InputStatement {
  stream.consumeKeyword('INPUT');

  let prompt: string | undefined;
  let promptSep: ';' | ',' | undefined;

  // Check for prompt string
  if (stream.peek().type === TokenType.StringLiteral) {
    prompt = stream.advance().value;
    if (stream.peek().type === TokenType.Semicolon) {
      stream.advance();
      promptSep = ';';
    } else if (stream.peek().type === TokenType.Comma) {
      stream.advance();
      promptSep = ',';
    }
  }

  const variables: VarRef[] = [];
  variables.push(parseVarRef(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    variables.push(parseVarRef(stream));
  }

  return { type: 'input', prompt, promptSep, variables };
}

// ---------------------------------------------------------------------------
// LOCATE
// ---------------------------------------------------------------------------

function parseLocate(stream: TokenStream): LocateStatement {
  stream.consumeKeyword('LOCATE');
  const col = parseExpression(stream);
  let row: Expression | undefined;
  if (stream.peek().type === TokenType.Comma) {
    stream.advance();
    row = parseExpression(stream);
  }
  return { type: 'locate', col, row };
}

// ---------------------------------------------------------------------------
// ANGLE
// ---------------------------------------------------------------------------

function parseAngle(stream: TokenStream): AngleStatement {
  stream.consumeKeyword('ANGLE');
  const mode = parseExpression(stream);
  return { type: 'angle', mode };
}

// ---------------------------------------------------------------------------
// GOTO / GOSUB
// ---------------------------------------------------------------------------

function parseGotoTarget(stream: TokenStream): { target: number; area?: number } {
  // Check for #area form
  if (stream.peek().type === TokenType.Hash) {
    stream.advance();
    const num = stream.consume(TokenType.Number);
    return { target: 0, area: parseInt(num.value, 10) };
  }
  const num = stream.consume(TokenType.Number);
  return { target: parseInt(num.value, 10) };
}

function parseGoto(stream: TokenStream): GotoStatement {
  stream.consumeKeyword('GOTO');
  const { target, area } = parseGotoTarget(stream);
  return { type: 'goto', target, area };
}

function parseGosub(stream: TokenStream): GosubStatement {
  stream.consumeKeyword('GOSUB');
  const { target, area } = parseGotoTarget(stream);
  return { type: 'gosub', target, area };
}

// ---------------------------------------------------------------------------
// RETURN
// ---------------------------------------------------------------------------

function parseReturn(stream: TokenStream): ReturnStatement {
  stream.consumeKeyword('RETURN');
  let area: number | undefined;
  if (stream.peek().type === TokenType.Hash) {
    stream.advance();
    const num = stream.consume(TokenType.Number);
    area = parseInt(num.value, 10);
  }
  return { type: 'return', area };
}

// ---------------------------------------------------------------------------
// ON ... GOTO / GOSUB  and  ON ERROR GOTO
// ---------------------------------------------------------------------------

function parseOnErrorGoto(stream: TokenStream): OnErrorGotoStatement {
  stream.consumeKeyword('ON ERROR GOTO');
  const num = stream.consume(TokenType.Number);
  return { type: 'on-error-goto', target: parseInt(num.value, 10) };
}

function parseOn(stream: TokenStream): OnBranchStatement {
  stream.consumeKeyword('ON');
  const expr = parseExpression(stream);

  let kind: 'goto' | 'gosub';
  if (stream.isKeyword('GOTO')) {
    stream.advance();
    kind = 'goto';
  } else if (stream.isKeyword('GOSUB')) {
    stream.advance();
    kind = 'gosub';
  } else {
    throw new Error('Expected GOTO or GOSUB after ON expr');
  }

  const targets: { line: number; area?: number }[] = [];
  // Parse first target
  if (stream.peek().type === TokenType.Number) {
    targets.push({ line: parseInt(stream.advance().value, 10) });
  }
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    if (stream.peek().type === TokenType.Number) {
      targets.push({ line: parseInt(stream.advance().value, 10) });
    }
  }

  return { type: 'on-branch', expr, kind, targets };
}

// ---------------------------------------------------------------------------
// IF ... THEN ... ELSE
// ---------------------------------------------------------------------------

function parseIf(stream: TokenStream): IfStatement {
  stream.consumeKeyword('IF');
  const condition = parseExpression(stream);
  stream.consumeKeyword('THEN');

  // THEN can be followed by a line number (shorthand GOTO)
  const thenBranch = parseIfBranch(stream);
  let elseBranch: Statement[] | undefined;

  if (stream.isKeyword('ELSE')) {
    stream.advance();
    elseBranch = parseIfBranch(stream);
  }

  return { type: 'if', condition, thenBranch, elseBranch };
}

function parseIfBranch(stream: TokenStream): Statement[] {
  // If next token is a number, it's a line number → implicit GOTO
  if (stream.peek().type === TokenType.Number) {
    const target = parseInt(stream.advance().value, 10);
    return [{ type: 'goto', target } as GotoStatement];
  }

  // Otherwise parse one or more colon-separated statements,
  // stopping at ELSE or EOL
  const stmts: Statement[] = [];
  let prevPos = -1;
  while (!stream.isEol() && !stream.isKeyword('ELSE')) {
    // Guard against infinite loop if no token is consumed
    const curPos = stream.getPos();
    if (curPos === prevPos) { stream.advance(); break; }
    prevPos = curPos;

    if (stream.isColon()) { stream.advance(); continue; }
    const stmt = parseStatement(stream);
    if (stmt !== null) stmts.push(stmt);
    if (stream.isKeyword('ELSE')) break;
    if (stream.isColon()) { stream.advance(); }
  }
  return stmts;
}

// ---------------------------------------------------------------------------
// FOR / NEXT
// ---------------------------------------------------------------------------

function parseFor(stream: TokenStream): ForStatement {
  stream.consumeKeyword('FOR');
  const variable = parseVarRef(stream);
  stream.consume(TokenType.Eq);
  const from = parseExpression(stream);
  stream.consumeKeyword('TO');
  const to = parseExpression(stream);

  let step: Expression | undefined;
  if (stream.isKeyword('STEP')) {
    stream.advance();
    step = parseExpression(stream);
  }

  return { type: 'for', variable, from, to, step };
}

function parseNext(stream: TokenStream): NextStatement {
  stream.consumeKeyword('NEXT');
  const variables: VarRef[] = [];

  // NEXT can have zero or more variables
  if (!stream.isEol() && !stream.isColon() && stream.peek().type === TokenType.Ident) {
    variables.push(parseVarRef(stream));
    while (stream.peek().type === TokenType.Comma) {
      stream.advance();
      variables.push(parseVarRef(stream));
    }
  }

  return { type: 'next', variables };
}

// ---------------------------------------------------------------------------
// WHILE / WEND
// ---------------------------------------------------------------------------

function parseWhile(stream: TokenStream): WhileStatement {
  stream.consumeKeyword('WHILE');
  const condition = parseExpression(stream);
  return { type: 'while', condition };
}

// ---------------------------------------------------------------------------
// RESUME
// ---------------------------------------------------------------------------

function parseResume(stream: TokenStream): ResumeStatement {
  stream.consumeKeyword('RESUME');
  if (!stream.isEol() && !stream.isColon()) {
    if (stream.peek().type === TokenType.Number) {
      return { type: 'resume', target: parseInt(stream.advance().value, 10) };
    }
  }
  return { type: 'resume' };
}

// ---------------------------------------------------------------------------
// READ / DATA / RESTORE
// ---------------------------------------------------------------------------

function parseRead(stream: TokenStream): ReadStatement {
  stream.consumeKeyword('READ');
  const variables: VarRef[] = [];
  variables.push(parseVarRef(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    variables.push(parseVarRef(stream));
  }
  return { type: 'read', variables };
}

function parseData(stream: TokenStream): DataStatement {
  stream.consumeKeyword('DATA');
  const values: Literal[] = [];

  // DATA values are raw literals (number or string)
  values.push(parseDataValue(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    values.push(parseDataValue(stream));
  }

  return { type: 'data', values };
}

function parseDataValue(stream: TokenStream): Literal {
  const tok = stream.peek();
  if (tok.type === TokenType.StringLiteral) {
    stream.advance();
    return { type: 'string', value: tok.value };
  }
  if (tok.type === TokenType.Number) {
    stream.advance();
    return { type: 'number', value: parseFloat(tok.value) };
  }
  // Negative number
  if (tok.type === TokenType.Minus) {
    stream.advance();
    const num = stream.consume(TokenType.Number);
    return { type: 'number', value: -parseFloat(num.value) };
  }
  // Fallback: treat as number 0
  stream.advance();
  return { type: 'number', value: 0 };
}

function parseRestore(stream: TokenStream): RestoreStatement {
  stream.consumeKeyword('RESTORE');
  let target: number | undefined;
  if (stream.peek().type === TokenType.Number) {
    target = parseInt(stream.advance().value, 10);
  }
  return { type: 'restore', target };
}

// ---------------------------------------------------------------------------
// DIM
// ---------------------------------------------------------------------------

function parseDim(stream: TokenStream): DimStatement {
  stream.consumeKeyword('DIM');
  const decls: ArrayDecl[] = [];

  decls.push(parseArrayDecl(stream));
  while (stream.peek().type === TokenType.Comma) {
    // Peek ahead: is this a new decl (Ident follows) or more dimensions?
    // After comma in DIM, it's always a new declaration
    stream.advance();
    decls.push(parseArrayDecl(stream));
  }

  return { type: 'dim', decls };
}

function parseArrayDecl(stream: TokenStream): ArrayDecl {
  const ident = stream.consume(TokenType.Ident);
  const name = ident.value;
  const isString = name.endsWith('$');
  stream.consume(TokenType.LParen);
  const dimensions: Expression[] = [];
  dimensions.push(parseExpression(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    dimensions.push(parseExpression(stream));
  }
  stream.consume(TokenType.RParen);
  return { name, isString, dimensions };
}

// ---------------------------------------------------------------------------
// ERASE
// ---------------------------------------------------------------------------

function parseErase(stream: TokenStream): EraseStatement {
  stream.consumeKeyword('ERASE');
  const names: string[] = [];
  names.push(stream.consume(TokenType.Ident).value);
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    names.push(stream.consume(TokenType.Ident).value);
  }
  return { type: 'erase', names };
}

// ---------------------------------------------------------------------------
// CLEAR
// ---------------------------------------------------------------------------

function parseClear(stream: TokenStream): ClearStatement {
  stream.consumeKeyword('CLEAR');
  let stringArea: Expression | undefined;
  if (!stream.isEol() && !stream.isColon() && stream.peek().type !== TokenType.EOL) {
    // Check if there's an expression following
    if (stream.peek().type === TokenType.Number ||
        stream.peek().type === TokenType.Ident ||
        stream.peek().type === TokenType.LParen) {
      stringArea = parseExpression(stream);
    }
  }
  return { type: 'clear', stringArea };
}

// ---------------------------------------------------------------------------
// DEFM / DEFSEG
// ---------------------------------------------------------------------------

function parseDefm(stream: TokenStream): DefmStatement {
  stream.consumeKeyword('DEFM');
  const size = parseExpression(stream);
  return { type: 'defm', size };
}

function parseDefseg(stream: TokenStream): DefsegStatement {
  stream.consumeKeyword('DEFSEG');
  const segment = parseExpression(stream);
  return { type: 'defseg', segment };
}

// ---------------------------------------------------------------------------
// POKE
// ---------------------------------------------------------------------------

function parsePoke(stream: TokenStream): PokeStatement {
  stream.consumeKeyword('POKE');
  const address = parseExpression(stream);
  stream.consume(TokenType.Comma);
  const value = parseExpression(stream);
  return { type: 'poke', address, value };
}

// ---------------------------------------------------------------------------
// DEF FN
// ---------------------------------------------------------------------------

function parseDefFn(stream: TokenStream): DefFnStatement {
  stream.consumeKeyword('DEF');
  stream.consumeKeyword('FN');

  // Function name is an identifier (may be followed by $)
  const nameTok = stream.consume(TokenType.Ident);
  const name = nameTok.value;

  // Parameter list
  stream.consume(TokenType.LParen);
  const params: string[] = [];
  if (stream.peek().type === TokenType.Ident) {
    params.push(stream.advance().value);
    while (stream.peek().type === TokenType.Comma) {
      stream.advance();
      params.push(stream.consume(TokenType.Ident).value);
    }
  }
  stream.consume(TokenType.RParen);
  stream.consume(TokenType.Eq);

  const body = parseExpression(stream);
  return { type: 'def-fn', name, params, body };
}

// ---------------------------------------------------------------------------
// OPEN / CLOSE
// ---------------------------------------------------------------------------

function parseOpen(stream: TokenStream): OpenStatement {
  stream.consumeKeyword('OPEN');
  const filename = parseExpression(stream);
  // Optional FOR mode clause (OUTPUT, INPUT, APPEND)
  let modeStr = 'INPUT';
  if (stream.isKeyword('FOR')) {
    stream.advance();
    const modeTok = stream.peek();
    if (modeTok.type === TokenType.Keyword &&
        (modeTok.value === 'OUTPUT' || modeTok.value === 'INPUT' || modeTok.value === 'APPEND')) {
      modeStr = stream.advance().value;
    }
  }
  const mode: Expression = { type: 'string', value: modeStr };
  stream.consumeKeyword('AS');
  // Optional #
  stream.tryConsume(TokenType.Hash);
  const filenum = parseExpression(stream);
  return { type: 'open', filename, mode, filenum };
}

function parseClose(stream: TokenStream): CloseStatement {
  stream.consumeKeyword('CLOSE');
  let filenum: Expression | undefined;
  if (stream.peek().type === TokenType.Hash) {
    stream.advance();
    filenum = parseExpression(stream);
  } else if (!stream.isEol() && !stream.isColon() &&
             stream.peek().type === TokenType.Number) {
    filenum = parseExpression(stream);
  }
  return { type: 'close', filenum };
}

// ---------------------------------------------------------------------------
// PRINT# (print to file)
// ---------------------------------------------------------------------------

function parsePrintFile(stream: TokenStream): PrintFileStatement {
  stream.consumeKeyword('PRINT#');
  // Optional #
  stream.tryConsume(TokenType.Hash);
  const filenum = parseExpression(stream);
  stream.tryConsume(TokenType.Comma);
  const items: PrintItem[] = parsePrintItems(stream);
  return { type: 'print-file', filenum, items };
}

function parsePrintItems(stream: TokenStream): PrintItem[] {
  const items: PrintItem[] = [];
  while (!stream.isEol() && !stream.isColon()) {
    const tok = stream.peek();
    if (tok.type === TokenType.Semicolon) {
      stream.advance();
      items.push({ type: 'separator', kind: ';' });
    } else if (tok.type === TokenType.Comma) {
      stream.advance();
      items.push({ type: 'separator', kind: ',' });
    } else {
      items.push({ type: 'expr', value: parseExpression(stream) });
    }
  }
  return items;
}

// ---------------------------------------------------------------------------
// INPUT# (input from file)
// ---------------------------------------------------------------------------

function parseInputFile(stream: TokenStream): InputFileStatement {
  stream.consumeKeyword('INPUT#');
  stream.tryConsume(TokenType.Hash);
  const filenum = parseExpression(stream);
  stream.consume(TokenType.Comma);
  const variables: VarRef[] = [];
  variables.push(parseVarRef(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    variables.push(parseVarRef(stream));
  }
  return { type: 'input-file', filenum, variables };
}

// ---------------------------------------------------------------------------
// LINE INPUT# (line input from file)
// ---------------------------------------------------------------------------

function parseLineInputFile(stream: TokenStream): LineInputFileStatement {
  stream.consumeKeyword('LINE INPUT#');
  stream.tryConsume(TokenType.Hash);
  const filenum = parseExpression(stream);
  stream.consume(TokenType.Comma);
  const variable = parseVarRef(stream);
  return { type: 'line-input-file', filenum, variable };
}

// ---------------------------------------------------------------------------
// WRITE# (write to file)
// ---------------------------------------------------------------------------

function parseWriteFile(stream: TokenStream): WriteFileStatement {
  stream.consumeKeyword('WRITE#');
  stream.tryConsume(TokenType.Hash);
  const filenum = parseExpression(stream);
  stream.consume(TokenType.Comma);
  const items: Expression[] = [];
  items.push(parseExpression(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    items.push(parseExpression(stream));
  }
  return { type: 'write-file', filenum, items };
}

// ---------------------------------------------------------------------------
// STAT / STAT CLEAR
// ---------------------------------------------------------------------------

function parseStat(stream: TokenStream): StatStatement {
  stream.consumeKeyword('STAT');
  const data: Expression[] = [];
  data.push(parseExpression(stream));
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    data.push(parseExpression(stream));
  }
  return { type: 'stat', data };
}

// ---------------------------------------------------------------------------
// DEFCHR$
// ---------------------------------------------------------------------------

function parseDefchr(stream: TokenStream): DefchrStatement {
  stream.consumeKeyword('DEFCHR$');
  const code = parseExpression(stream);
  stream.consume(TokenType.Comma);
  const pattern = parseExpression(stream);
  return { type: 'defchr', code, pattern };
}

// ---------------------------------------------------------------------------
// CHAIN
// ---------------------------------------------------------------------------

function parseChain(stream: TokenStream): ChainStatement {
  stream.consumeKeyword('CHAIN');
  const filename = parseExpression(stream);
  return { type: 'chain', filename };
}

// ---------------------------------------------------------------------------
// MODE
// ---------------------------------------------------------------------------

function parseMode(stream: TokenStream): ModeStatement {
  stream.consumeKeyword('MODE');
  const number = parseExpression(stream);
  const args: Expression[] = [];
  while (stream.peek().type === TokenType.Comma) {
    stream.advance();
    args.push(parseExpression(stream));
  }
  return { type: 'mode', number, args: args.length > 0 ? args : undefined };
}

// ---------------------------------------------------------------------------
// Variable reference helper (for read positions, not assignment)
// ---------------------------------------------------------------------------

function parseVarRef(stream: TokenStream): VarRef {
  const ident = stream.consume(TokenType.Ident);
  const name = ident.value;
  const isString = name.endsWith('$');
  // Check for array indices
  if (stream.peek().type === TokenType.LParen) {
    stream.advance(); // (
    const indices: Expression[] = [];
    indices.push(parseExpression(stream));
    while (stream.peek().type === TokenType.Comma) {
      stream.advance();
      indices.push(parseExpression(stream));
    }
    stream.consume(TokenType.RParen);
    return { name, isString, indices };
  }
  return { name, isString };
}

// ---------------------------------------------------------------------------
// Expression parser — Pratt / precedence climbing
//
// Precedence (lowest to highest):
//   1. OR, XOR
//   2. AND
//   3. NOT (unary prefix)
//   4. Comparisons:  = <> < > <= >=
//   5. Addition:     +  -
//   6. Multiplication: * / \ MOD
//   7. Power:        ^
//   8. Unary minus:  -
//   9. Primary: literals, variables, function calls, parenthesized exprs
// ---------------------------------------------------------------------------

const enum Prec {
  None = 0,
  OrXor = 1,
  And = 2,
  Comparison = 4,
  AddSub = 5,
  Mod = 6,
  MulDiv = 7,
  Power = 8,
}

function tokenPrec(tok: Token): number {
  switch (tok.type) {
    case TokenType.Keyword:
      if (tok.value === 'OR' || tok.value === 'XOR') return Prec.OrXor;
      if (tok.value === 'AND') return Prec.And;
      if (tok.value === 'MOD') return Prec.Mod;
      return Prec.None;
    case TokenType.Eq:
    case TokenType.Ne:
    case TokenType.Lt:
    case TokenType.Gt:
    case TokenType.Le:
    case TokenType.Ge:
      return Prec.Comparison;
    case TokenType.Plus:
    case TokenType.Minus:
      return Prec.AddSub;
    case TokenType.Star:
    case TokenType.Slash:
    case TokenType.BackSlash:
      return Prec.MulDiv;
    case TokenType.Caret:
      return Prec.Power;
    default:
      return Prec.None;
  }
}

function tokenToBinaryOp(tok: Token): import('./ast.js').BinaryOp | null {
  switch (tok.type) {
    case TokenType.Plus: return '+';
    case TokenType.Minus: return '-';
    case TokenType.Star: return '*';
    case TokenType.Slash: return '/';
    case TokenType.BackSlash: return '¥';
    case TokenType.Caret: return '^';
    case TokenType.Eq: return '=';
    case TokenType.Ne: return '<>';
    case TokenType.Lt: return '<';
    case TokenType.Gt: return '>';
    case TokenType.Le: return '<=';
    case TokenType.Ge: return '>=';
    case TokenType.Keyword:
      if (tok.value === 'AND') return 'and';
      if (tok.value === 'OR') return 'or';
      if (tok.value === 'XOR') return 'xor';
      if (tok.value === 'MOD') return 'mod';
      return null;
    default:
      return null;
  }
}

export function parseExpression(stream: TokenStream, minPrec: number = Prec.None): Expression {
  let left = parseUnary(stream);

  while (true) {
    const tok = stream.peek();
    const prec = tokenPrec(tok);
    if (prec === Prec.None || prec <= minPrec) break;

    const op = tokenToBinaryOp(tok);
    if (op === null) break;

    stream.advance();

    // Power is right-associative; everything else is left-associative
    const nextMinPrec = tok.type === TokenType.Caret ? prec - 1 : prec;
    const right = parseExpression(stream, nextMinPrec);

    left = { type: 'binary', op, left, right };
  }

  return left;
}

function parseUnary(stream: TokenStream): Expression {
  // Unary NOT
  if (stream.isKeyword('NOT')) {
    stream.advance();
    const operand = parseUnary(stream);
    return { type: 'unary', op: 'not', operand };
  }

  // Unary minus — binds tighter than +/- but looser than ^
  // So -X^2 is parsed as -(X^2), not (-X)^2
  if (stream.peek().type === TokenType.Minus) {
    stream.advance();
    const operand = parseExpression(stream, Prec.MulDiv);
    return { type: 'unary', op: '-', operand };
  }

  return parsePrimary(stream);
}

function parsePrimary(stream: TokenStream): Expression {
  const tok = stream.peek();

  // Number literal
  if (tok.type === TokenType.Number) {
    stream.advance();
    return { type: 'number', value: parseFloat(tok.value) };
  }

  // String literal
  if (tok.type === TokenType.StringLiteral) {
    stream.advance();
    return { type: 'string', value: tok.value };
  }

  // Hex literal
  if (tok.type === TokenType.HexLiteral) {
    stream.advance();
    return { type: 'hex-literal', value: parseInt(tok.value, 16) };
  }

  // Parenthesized expression
  if (tok.type === TokenType.LParen) {
    stream.advance();
    const expr = parseExpression(stream, Prec.None);
    stream.consume(TokenType.RParen);
    return expr;
  }

  // Keyword as expression
  if (tok.type === TokenType.Keyword) {
    return parseKeywordExpr(stream);
  }

  // Identifier: variable, array access
  if (tok.type === TokenType.Ident) {
    return parseIdentExpr(stream);
  }

  // Fallback — unexpected token, do not consume; return 0
  return { type: 'number', value: 0 };
}

// Keywords that should NOT be consumed when encountered in expression context
// (they are statement separators or control-flow words)
const STATEMENT_KEYWORDS = new Set([
  'ELSE', 'THEN', 'TO', 'STEP', 'NEXT', 'WEND',
  'GOTO', 'GOSUB', 'RETURN', 'PRINT', 'LPRINT', 'INPUT',
  'LET', 'IF', 'FOR', 'WHILE', 'END', 'STOP', 'CONT',
  'READ', 'DATA', 'RESTORE', 'DIM', 'ERASE', 'CLEAR',
  'DEFM', 'DEFSEG', 'POKE', 'DEF', 'OPEN', 'CLOSE',
  'PRINT#', 'INPUT#', 'LINE INPUT#', 'WRITE#', 'STAT', 'STAT CLEAR',
  'DEFCHR$', 'CHAIN', 'MODE', 'BEEP', 'CLS', 'LOCATE', 'ANGLE',
  'ON', 'ON ERROR GOTO', 'RESUME', 'RESUME NEXT', 'REM',
  'AS', 'USING',
]);

// Parse a keyword that appears in an expression context
function parseKeywordExpr(stream: TokenStream): Expression {
  const tok = stream.peek();
  const kw = tok.value;

  // Statement keywords must not be consumed as expressions — return 0 without advancing
  if (STATEMENT_KEYWORDS.has(kw)) {
    return { type: 'number', value: 0 };
  }

  // Zero-arg builtins that don't take parentheses
  const zeroArgBuiltins = new Set([
    'RAN#', 'PI', 'INKEY$', 'ERL', 'ERR', 'CNT', 'SUMX', 'SUMY',
    'SUMX2', 'SUMY2', 'SUMXY', 'MEANX', 'MEANY', 'SDXN', 'SDYN',
    'SDX', 'SDY', 'LRA', 'LRB', 'COR', 'EOX', 'EOY',
  ]);

  if (zeroArgBuiltins.has(kw)) {
    stream.advance();
    return { type: 'builtin-call', name: kw, args: [] };
  }

  // FN call: FN name(args)
  if (kw === 'FN') {
    stream.advance();
    const nameTok = stream.consume(TokenType.Ident);
    const name = nameTok.value;
    stream.consume(TokenType.LParen);
    const args: Expression[] = [];
    if (stream.peek().type !== TokenType.RParen) {
      args.push(parseExpression(stream));
      while (stream.peek().type === TokenType.Comma) {
        stream.advance();
        args.push(parseExpression(stream));
      }
    }
    stream.consume(TokenType.RParen);
    return { type: 'fn-call', name, args };
  }

  // Builtin functions that require parentheses
  const builtinFunctions = new Set([
    'SIN', 'COS', 'TAN', 'ASN', 'ACS', 'ATN', 'LN', 'LOG', 'EXP',
    'SQR', 'ABS', 'SGN', 'INT', 'FIX', 'FRAC', 'CUR',
    'HYP SIN', 'HYP COS', 'HYP TAN', 'HYP ASN', 'HYP ACS', 'HYP ATN',
    'LEFT$', 'RIGHT$', 'MID$', 'LEN', 'VAL', 'STR$', 'CHR$', 'ASC',
    'HEX$', 'VALF', 'ROUND', 'FACT', 'NCR', 'NPR',
    'DEG', 'DMS$', 'DMS', 'POL', 'REC',
    'PEEK', 'FRE', 'EOF', 'DSKF', 'INPUT$',
    'CALC$',
    'TAB',
  ]);

  if (builtinFunctions.has(kw)) {
    stream.advance();
    const args: Expression[] = [];
    if (stream.peek().type === TokenType.LParen) {
      stream.advance();
      if (stream.peek().type !== TokenType.RParen) {
        args.push(parseExpression(stream));
        while (stream.peek().type === TokenType.Comma) {
          stream.advance();
          args.push(parseExpression(stream));
        }
      }
      stream.consume(TokenType.RParen);
    }
    return { type: 'builtin-call', name: kw, args };
  }

  // Unknown keyword in expression context — do NOT consume; return 0 as sentinel
  return { type: 'number', value: 0 };
}

// Parse an identifier in expression context: variable or array access
function parseIdentExpr(stream: TokenStream): Expression {
  const ident = stream.advance();
  const name = ident.value;
  const isString = name.endsWith('$');

  // Array access: name(indices)
  if (stream.peek().type === TokenType.LParen) {
    stream.advance();
    const indices: Expression[] = [];
    indices.push(parseExpression(stream));
    while (stream.peek().type === TokenType.Comma) {
      stream.advance();
      indices.push(parseExpression(stream));
    }
    stream.consume(TokenType.RParen);
    return { type: 'array-access', name, isString, indices };
  }

  // Simple variable
  return { type: 'variable', ref: { name, isString } };
}
