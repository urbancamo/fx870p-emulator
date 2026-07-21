import { describe, it, expect } from 'vitest';
import { parseSource, splitBody, headKeyword, codeSegments, emitLine, emitProgram } from '../scan.js';

describe('splitBody', () => {
  it('splits on colons outside strings', () => {
    expect(splitBody('A=1:B=2:PRINT A+B')).toEqual({
      stmts: ['A=1', 'B=2', 'PRINT A+B'], comment: null,
    });
  });
  it('keeps colons inside strings', () => {
    expect(splitBody('PRINT "A:B":C=1')).toEqual({
      stmts: ['PRINT "A:B"', 'C=1'], comment: null,
    });
  });
  it('apostrophe starts a comment anywhere outside strings', () => {
    expect(splitBody("PRINT A ' note")).toEqual({
      stmts: ['PRINT A'], comment: { marker: "'", text: ' note' },
    });
    expect(splitBody('PRINT "don' + "'" + 't"')).toEqual({
      stmts: ['PRINT "don' + "'" + 't"'], comment: null,
    });
  });
  it('REM at statement head swallows the rest of the line', () => {
    expect(splitBody('REM === INIT ===')).toEqual({
      stmts: [], comment: { marker: 'REM', text: ' === INIT ===' },
    });
    expect(splitBody('A=1: REM done')).toEqual({
      stmts: ['A=1'], comment: { marker: 'REM', text: ' done' },
    });
  });
  it('REM is not matched inside identifiers or mid-statement', () => {
    expect(splitBody('REMY=1')).toEqual({ stmts: ['REMY=1'], comment: null });
    expect(splitBody('PRINT REMY')).toEqual({ stmts: ['PRINT REMY'], comment: null });
  });
  it('REM boundary variants: bare REM at EOL, lowercase, and :REM', () => {
    expect(splitBody('A=1:REM')).toEqual({
      stmts: ['A=1'], comment: { marker: 'REM', text: '' },
    });
    expect(splitBody('rem lower')).toEqual({
      stmts: [], comment: { marker: 'REM', text: ' lower' },
    });
    expect(splitBody('A=1:REM done')).toEqual({
      stmts: ['A=1'], comment: { marker: 'REM', text: ' done' },
    });
  });
  it('drops empty statements from :: and trailing :', () => {
    expect(splitBody('A=1::B=2:')).toEqual({ stmts: ['A=1', 'B=2'], comment: null });
  });
  it('unterminated string runs to end of line', () => {
    expect(splitBody('PRINT "TEST')).toEqual({ stmts: ['PRINT "TEST'], comment: null });
  });
});

describe('headKeyword', () => {
  it('returns the uppercased leading word', () => {
    expect(headKeyword('goto 100')).toBe('GOTO');
    expect(headKeyword('  IF A=1 THEN 2')).toBe('IF');
    expect(headKeyword('=oops')).toBe('');
  });
});

describe('codeSegments', () => {
  it('alternates code and string segments', () => {
    expect(codeSegments('A="X":B="Y"')).toEqual([
      { code: true, text: 'A=' },
      { code: false, text: '"X"' },
      { code: true, text: ':B=' },
      { code: false, text: '"Y"' },
    ]);
  });
  it('handles unterminated strings', () => {
    expect(codeSegments('PRINT "TEST')).toEqual([
      { code: true, text: 'PRINT ' },
      { code: false, text: '"TEST' },
    ]);
  });
  it('adjacent string literals yield consecutive string segments', () => {
    expect(codeSegments('PRINT "A""B"')).toEqual([
      { code: true, text: 'PRINT ' },
      { code: false, text: '"A"' },
      { code: false, text: '"B"' },
    ]);
  });
});

describe('parseSource / emit round trip', () => {
  it('parses numbered lines and re-emits equivalently', () => {
    const src = '10 A=1:B=2\n20 PRINT A \' sum\n30 REM gone\n';
    const lines = parseSource(src);
    expect(lines.map(l => l.num)).toEqual([10, 20, 30]);
    expect(lines[0].stmts).toEqual(['A=1', 'B=2']);
    expect(lines[1].comment).toEqual({ marker: "'", text: ' sum' });
    expect(lines[2].stmts).toEqual([]);
    // emit always uses the 1-byte apostrophe marker
    expect(emitLine(lines[1])).toBe("PRINT A' sum");
    expect(emitLine(lines[2])).toBe("' gone");
    expect(emitProgram([lines[0]])).toBe('10 A=1:B=2\n');
  });
});
