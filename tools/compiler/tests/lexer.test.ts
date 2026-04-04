// tools/compiler/tests/lexer.test.ts
import { describe, it, expect } from 'vitest';
import { TokenType, tokenize } from '../lexer.js';
import type { Token } from '../lexer.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function types(tokens: Token[]): TokenType[] {
  return tokens.map(t => t.type);
}

function values(tokens: Token[]): string[] {
  return tokens.map(t => t.value);
}

function noEol(tokens: Token[]): Token[] {
  return tokens.filter(t => t.type !== TokenType.EOL);
}

// ---------------------------------------------------------------------------
// Line number
// ---------------------------------------------------------------------------

describe('line number tokenization', () => {
  it('emits LineNumber for leading integer', () => {
    const toks = tokenize('10 PRINT');
    expect(toks[0].type).toBe(TokenType.LineNumber);
    expect(toks[0].value).toBe('10');
  });

  it('emits LineNumber for multi-digit numbers', () => {
    const toks = tokenize('65530 END');
    expect(toks[0].type).toBe(TokenType.LineNumber);
    expect(toks[0].value).toBe('65530');
  });

  it('does not emit LineNumber when line starts with keyword', () => {
    const toks = tokenize('PRINT "X"');
    expect(toks[0].type).not.toBe(TokenType.LineNumber);
    expect(toks[0].type).toBe(TokenType.Keyword);
  });
});

// ---------------------------------------------------------------------------
// EOL token
// ---------------------------------------------------------------------------

describe('EOL token', () => {
  it('always ends the token list with EOL', () => {
    const toks = tokenize('10 CLS');
    expect(toks[toks.length - 1].type).toBe(TokenType.EOL);
  });

  it('EOL on empty line', () => {
    const toks = tokenize('');
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.EOL);
  });
});

// ---------------------------------------------------------------------------
// Keyword recognition
// ---------------------------------------------------------------------------

describe('keyword recognition', () => {
  const kws = [
    'PRINT', 'LPRINT', 'INPUT', 'LET', 'IF', 'THEN', 'ELSE',
    'GOTO', 'GOSUB', 'RETURN', 'FOR', 'TO', 'STEP', 'NEXT',
    'WHILE', 'WEND', 'END', 'STOP', 'CONT',
  ] as const;

  for (const kw of kws) {
    it(`recognises ${kw}`, () => {
      const toks = noEol(tokenize(kw));
      expect(toks).toHaveLength(1);
      expect(toks[0].type).toBe(TokenType.Keyword);
      expect(toks[0].value).toBe(kw);
    });
  }

  it('recognises keyword case-insensitively', () => {
    const toks = noEol(tokenize('print'));
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('PRINT');
  });

  it('does not match keyword inside longer identifier', () => {
    // FOREST contains FOR — should be an Ident, not Keyword + Ident
    const toks = noEol(tokenize('FOREST'));
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.Ident);
  });
});

// ---------------------------------------------------------------------------
// String literals
// ---------------------------------------------------------------------------

describe('string literals', () => {
  it('emits StringLiteral without surrounding quotes', () => {
    const toks = noEol(tokenize('"HELLO"'));
    expect(toks[0].type).toBe(TokenType.StringLiteral);
    expect(toks[0].value).toBe('HELLO');
  });

  it('handles empty string', () => {
    const toks = noEol(tokenize('""'));
    expect(toks[0].type).toBe(TokenType.StringLiteral);
    expect(toks[0].value).toBe('');
  });

  it('does not tokenize keywords inside strings', () => {
    const toks = noEol(tokenize('"GOTO 100"'));
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.StringLiteral);
  });
});

// ---------------------------------------------------------------------------
// Number literals
// ---------------------------------------------------------------------------

describe('number literals', () => {
  // Numbers at the start of a line are LineNumbers; test numbers in expression
  // context (after an operator, keyword, etc.).

  it('tokenizes an integer in expression context', () => {
    const toks = noEol(tokenize('A=42'));
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num).toBeDefined();
    expect(num!.value).toBe('42');
  });

  it('tokenizes a decimal number in expression context', () => {
    const toks = noEol(tokenize('A=3.14'));
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num).toBeDefined();
    expect(num!.value).toBe('3.14');
  });

  it('tokenizes scientific notation in expression context', () => {
    const toks = noEol(tokenize('A=3.14E-5'));
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num).toBeDefined();
    expect(num!.value).toBe('3.14E-5');
  });

  it('tokenizes positive exponent in expression context', () => {
    const toks = noEol(tokenize('A=1.5E+10'));
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num).toBeDefined();
    expect(num!.value).toBe('1.5E+10');
  });

  it('tokenizes number starting with dot', () => {
    const toks = noEol(tokenize('A=.5'));
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num).toBeDefined();
    expect(num!.value).toBe('.5');
  });

  it('number after line number is a Number token', () => {
    // After the line number is consumed, subsequent digits are Number tokens.
    const toks = noEol(tokenize('10 FOR I=1 TO 100'));
    const nums = toks.filter(t => t.type === TokenType.Number);
    expect(nums.map(t => t.value)).toContain('1');
    expect(nums.map(t => t.value)).toContain('100');
  });
});

// ---------------------------------------------------------------------------
// Hex literals
// ---------------------------------------------------------------------------

describe('hex literals', () => {
  it('tokenizes &HFF', () => {
    const toks = noEol(tokenize('&HFF'));
    expect(toks[0].type).toBe(TokenType.HexLiteral);
    expect(toks[0].value).toBe('FF');
  });

  it('tokenizes &H00', () => {
    const toks = noEol(tokenize('&H00'));
    expect(toks[0].type).toBe(TokenType.HexLiteral);
    expect(toks[0].value).toBe('00');
  });

  it('tokenizes lower-case hex digits', () => {
    const toks = noEol(tokenize('&Hff'));
    expect(toks[0].type).toBe(TokenType.HexLiteral);
    expect(toks[0].value).toBe('ff');
  });
});

// ---------------------------------------------------------------------------
// Operators
// ---------------------------------------------------------------------------

describe('operators', () => {
  it('tokenizes +', () => {
    expect(noEol(tokenize('+'))[0].type).toBe(TokenType.Plus);
  });
  it('tokenizes -', () => {
    expect(noEol(tokenize('-'))[0].type).toBe(TokenType.Minus);
  });
  it('tokenizes *', () => {
    expect(noEol(tokenize('*'))[0].type).toBe(TokenType.Star);
  });
  it('tokenizes /', () => {
    expect(noEol(tokenize('/'))[0].type).toBe(TokenType.Slash);
  });
  it('tokenizes ^ (power)', () => {
    expect(noEol(tokenize('^'))[0].type).toBe(TokenType.Caret);
  });
  it('tokenizes = (assignment / equality)', () => {
    expect(noEol(tokenize('='))[0].type).toBe(TokenType.Eq);
  });
  it('tokenizes < (less than)', () => {
    expect(noEol(tokenize('<'))[0].type).toBe(TokenType.Lt);
  });
  it('tokenizes > (greater than)', () => {
    expect(noEol(tokenize('>'))[0].type).toBe(TokenType.Gt);
  });
  it('tokenizes <> (not equal)', () => {
    const tok = noEol(tokenize('<>'))[0];
    expect(tok.type).toBe(TokenType.Ne);
    expect(tok.value).toBe('<>');
  });
  it('normalises >< to <>', () => {
    const tok = noEol(tokenize('><'))[0];
    expect(tok.type).toBe(TokenType.Ne);
    expect(tok.value).toBe('<>');
  });
  it('tokenizes <= (less or equal)', () => {
    const tok = noEol(tokenize('<='))[0];
    expect(tok.type).toBe(TokenType.Le);
    expect(tok.value).toBe('<=');
  });
  it('normalises =< to <=', () => {
    const tok = noEol(tokenize('=<'))[0];
    expect(tok.type).toBe(TokenType.Le);
    expect(tok.value).toBe('<=');
  });
  it('tokenizes >= (greater or equal)', () => {
    const tok = noEol(tokenize('>='))[0];
    expect(tok.type).toBe(TokenType.Ge);
    expect(tok.value).toBe('>=');
  });
  it('normalises => to >=', () => {
    const tok = noEol(tokenize('=>'))[0];
    expect(tok.type).toBe(TokenType.Ge);
    expect(tok.value).toBe('>=');
  });
});

// ---------------------------------------------------------------------------
// Integer division operator
// ---------------------------------------------------------------------------

describe('integer division operator', () => {
  it('tokenizes \\ as BackSlash', () => {
    const toks = noEol(tokenize('A\\B'));
    expect(toks[1].type).toBe(TokenType.BackSlash);
    expect(toks[1].value).toBe('\\');
  });
});

// ---------------------------------------------------------------------------
// Colon (statement separator)
// ---------------------------------------------------------------------------

describe('colon as statement separator', () => {
  it('tokenizes : between statements', () => {
    const toks = noEol(tokenize('CLS:PRINT "A"'));
    const colonTok = toks.find(t => t.type === TokenType.Colon);
    expect(colonTok).toBeDefined();
    expect(colonTok?.value).toBe(':');
  });

  it('produces colon between two keywords', () => {
    const toks = noEol(tokenize('CLS:END'));
    expect(types(toks)).toEqual([
      TokenType.Keyword,
      TokenType.Colon,
      TokenType.Keyword,
    ]);
  });
});

// ---------------------------------------------------------------------------
// Variable names
// ---------------------------------------------------------------------------

describe('variable names', () => {
  it('tokenizes single-char variable', () => {
    const toks = noEol(tokenize('X'));
    expect(toks[0].type).toBe(TokenType.Ident);
    expect(toks[0].value).toBe('X');
  });

  it('tokenizes multi-char variable', () => {
    const toks = noEol(tokenize('AB'));
    expect(toks[0].type).toBe(TokenType.Ident);
    expect(toks[0].value).toBe('AB');
  });

  it('tokenizes string variable ending with $', () => {
    const toks = noEol(tokenize('A$'));
    expect(toks[0].type).toBe(TokenType.Ident);
    expect(toks[0].value).toBe('A$');
  });

  it('tokenizes multi-char string variable', () => {
    const toks = noEol(tokenize('NAME$'));
    expect(toks[0].type).toBe(TokenType.Ident);
    expect(toks[0].value).toBe('NAME$');
  });

  it('is case-sensitive for variable names', () => {
    const upper = noEol(tokenize('AA'))[0];
    const lower = noEol(tokenize('aa'))[0];
    // Both are idents but value preserves case
    expect(upper.value).toBe('AA');
    expect(lower.value).toBe('aa');
  });
});

// ---------------------------------------------------------------------------
// REM and apostrophe comments
// ---------------------------------------------------------------------------

describe('REM and apostrophe comments', () => {
  it('tokenizes REM keyword followed by Comment', () => {
    const toks = noEol(tokenize('REM this is a comment'));
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('REM');
    expect(toks[1].type).toBe(TokenType.Comment);
  });

  it('REM comment consumes rest of line', () => {
    const toks = noEol(tokenize('10 REM PRINT "HELLO"'));
    // After REM there should be only one Comment token
    const afterRem = toks.slice(2);
    expect(afterRem).toHaveLength(1);
    expect(afterRem[0].type).toBe(TokenType.Comment);
  });

  it('tokenizes apostrophe as Comment consuming rest of line', () => {
    const toks = noEol(tokenize("' this is a comment"));
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.Comment);
    expect(toks[0].value).toContain('this is a comment');
  });

  it('apostrophe after statement is a comment', () => {
    const toks = noEol(tokenize("CLS 'clear screen"));
    const commentTok = toks.find(t => t.type === TokenType.Comment);
    expect(commentTok).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Two-word compound keywords
// ---------------------------------------------------------------------------

describe('two-word (compound) keywords', () => {
  const pairs: [string, string][] = [
    ['HYP SIN', 'HYP SIN'],
    ['HYP COS', 'HYP COS'],
    ['HYP TAN', 'HYP TAN'],
    ['HYP ASN', 'HYP ASN'],
    ['HYP ACS', 'HYP ACS'],
    ['HYP ATN', 'HYP ATN'],
    ['STAT CLEAR', 'STAT CLEAR'],
  ];

  for (const [input, expected] of pairs) {
    it(`recognises ${expected}`, () => {
      const toks = noEol(tokenize(input));
      expect(toks).toHaveLength(1);
      expect(toks[0].type).toBe(TokenType.Keyword);
      expect(toks[0].value).toBe(expected);
    });
  }

  it('recognises RESUME NEXT', () => {
    const toks = noEol(tokenize('RESUME NEXT'));
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('RESUME NEXT');
  });

  it('recognises LINE INPUT#', () => {
    const toks = noEol(tokenize('LINE INPUT#'));
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('LINE INPUT#');
  });
});

// ---------------------------------------------------------------------------
// Three-word compound keyword: ON ERROR GOTO
// ---------------------------------------------------------------------------

describe('ON ERROR GOTO compound keyword', () => {
  it('recognises ON ERROR GOTO as a single keyword token', () => {
    const toks = noEol(tokenize('ON ERROR GOTO'));
    expect(toks).toHaveLength(1);
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('ON ERROR GOTO');
  });
});

// ---------------------------------------------------------------------------
// RAN# and PI as zero-argument keywords
// ---------------------------------------------------------------------------

describe('RAN# and PI as keywords', () => {
  it('recognises RAN# as a keyword', () => {
    const toks = noEol(tokenize('RAN#'));
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('RAN#');
  });

  it('recognises PI as a keyword', () => {
    const toks = noEol(tokenize('PI'));
    expect(toks[0].type).toBe(TokenType.Keyword);
    expect(toks[0].value).toBe('PI');
  });
});

// ---------------------------------------------------------------------------
// Parentheses and comma
// ---------------------------------------------------------------------------

describe('parentheses and comma', () => {
  it('tokenizes (', () => {
    expect(noEol(tokenize('('))[0].type).toBe(TokenType.LParen);
  });
  it('tokenizes )', () => {
    expect(noEol(tokenize(')'))[0].type).toBe(TokenType.RParen);
  });
  it('tokenizes ,', () => {
    expect(noEol(tokenize(','))[0].type).toBe(TokenType.Comma);
  });

  it('tokenizes function call SIN(X)', () => {
    const toks = noEol(tokenize('SIN(X)'));
    expect(types(toks)).toEqual([
      TokenType.Keyword,   // SIN
      TokenType.LParen,    // (
      TokenType.Ident,     // X
      TokenType.RParen,    // )
    ]);
  });
});

// ---------------------------------------------------------------------------
// Semicolons
// ---------------------------------------------------------------------------

describe('semicolons', () => {
  it('tokenizes ;', () => {
    expect(noEol(tokenize(';'))[0].type).toBe(TokenType.Semicolon);
  });

  it('tokenizes PRINT with semicolons', () => {
    const toks = noEol(tokenize('PRINT A;B;'));
    expect(toks.filter(t => t.type === TokenType.Semicolon)).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Hash (file numbers)
// ---------------------------------------------------------------------------

describe('hash (#) for file numbers', () => {
  it('tokenizes standalone #', () => {
    expect(noEol(tokenize('#'))[0].type).toBe(TokenType.Hash);
  });

  it('tokenizes # in OPEN context', () => {
    const toks = noEol(tokenize('OPEN "FILE" AS #1'));
    const hashTok = toks.find(t => t.type === TokenType.Hash);
    expect(hashTok).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Full line integration
// ---------------------------------------------------------------------------

describe('full line tokenization', () => {
  it('tokenizes: 10 FOR I=1 TO 10 STEP 2', () => {
    const toks = noEol(tokenize('10 FOR I=1 TO 10 STEP 2'));
    expect(toks[0]).toMatchObject({ type: TokenType.LineNumber, value: '10' });
    expect(values(toks.filter(t => t.type === TokenType.Keyword))).toEqual(['FOR', 'TO', 'STEP']);
  });

  it('tokenizes: 20 IF A<>B THEN GOSUB 100', () => {
    const toks = noEol(tokenize('20 IF A<>B THEN GOSUB 100'));
    const kwds = toks.filter(t => t.type === TokenType.Keyword).map(t => t.value);
    expect(kwds).toEqual(['IF', 'THEN', 'GOSUB']);
    const ne = toks.find(t => t.type === TokenType.Ne);
    expect(ne?.value).toBe('<>');
  });

  it('tokenizes: 30 LET X=3.14E-5', () => {
    const toks = noEol(tokenize('30 LET X=3.14E-5'));
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num?.value).toBe('3.14E-5');
  });

  it('tokenizes: 40 A=&HFF', () => {
    const toks = noEol(tokenize('40 A=&HFF'));
    const hex = toks.find(t => t.type === TokenType.HexLiteral);
    expect(hex?.value).toBe('FF');
  });

  it('tokenizes: 50 PRINT A\\B', () => {
    const toks = noEol(tokenize('50 PRINT A\\B'));
    expect(toks.find(t => t.type === TokenType.BackSlash)).toBeDefined();
  });

  it('tokenizes: 60 ON ERROR GOTO 9000', () => {
    const toks = noEol(tokenize('60 ON ERROR GOTO 9000'));
    const kw = toks.find(t => t.type === TokenType.Keyword);
    expect(kw?.value).toBe('ON ERROR GOTO');
    const num = toks.find(t => t.type === TokenType.Number);
    expect(num?.value).toBe('9000');
  });

  it('tokenizes: 70 X=RAN#', () => {
    const toks = noEol(tokenize('70 X=RAN#'));
    expect(toks.find(t => t.type === TokenType.Keyword && t.value === 'RAN#')).toBeDefined();
  });
});
