// tools/compiler/tests/parser.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../parser.js';
import type {
  Program, Statement, Expression,
  LetStatement, PrintStatement, InputStatement, GotoStatement,
  GosubStatement, IfStatement, ForStatement, NextStatement,
  DataStatement, ReadStatement, DimStatement, OnBranchStatement,
  OnErrorGotoStatement, ClearStatement, PokeStatement, DefFnStatement,
  RemStatement, ClsStatement, EndStatement, BeepStatement, ReturnStatement,
  RestoreStatement,
} from '../ast.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseLine(src: string): Statement[] {
  const prog = parse(src);
  const lineNums = [...prog.lines.keys()];
  expect(lineNums.length).toBeGreaterThan(0);
  return prog.lines.get(lineNums[0]!)!;
}

function firstStmt(src: string): Statement {
  return parseLine(src)[0]!;
}

// ---------------------------------------------------------------------------
// Simple no-arg statements
// ---------------------------------------------------------------------------

describe('simple no-arg statements', () => {
  it('parses REM', () => {
    const s = firstStmt('10 REM hello world') as RemStatement;
    expect(s.type).toBe('rem');
    expect(s.text).toContain('hello world');
  });

  it('parses apostrophe comment as rem', () => {
    const s = firstStmt("10 ' a comment") as RemStatement;
    expect(s.type).toBe('rem');
  });

  it('parses CLS', () => {
    const s = firstStmt('10 CLS') as ClsStatement;
    expect(s.type).toBe('cls');
  });

  it('parses END', () => {
    const s = firstStmt('10 END') as EndStatement;
    expect(s.type).toBe('end');
    expect(s.kind).toBe('end');
  });

  it('parses STOP', () => {
    const s = firstStmt('10 STOP') as EndStatement;
    expect(s.type).toBe('end');
    expect(s.kind).toBe('stop');
  });

  it('parses CONT', () => {
    const s = firstStmt('10 CONT') as EndStatement;
    expect(s.type).toBe('end');
    expect(s.kind).toBe('cont');
  });

  it('parses BEEP', () => {
    const s = firstStmt('10 BEEP') as BeepStatement;
    expect(s.type).toBe('beep');
  });

  it('parses RETURN', () => {
    const s = firstStmt('10 RETURN') as ReturnStatement;
    expect(s.type).toBe('return');
  });
});

// ---------------------------------------------------------------------------
// LET — implicit and explicit
// ---------------------------------------------------------------------------

describe('LET statement', () => {
  it('parses explicit LET with number literal', () => {
    const s = firstStmt('10 LET A=5') as LetStatement;
    expect(s.type).toBe('let');
    expect(s.variable.name).toBe('A');
    expect(s.variable.isString).toBe(false);
    expect(s.expr).toMatchObject({ type: 'number', value: 5 });
  });

  it('parses implicit LET (A=5 without LET keyword)', () => {
    const s = firstStmt('10 A=5') as LetStatement;
    expect(s.type).toBe('let');
    expect(s.variable.name).toBe('A');
    expect(s.expr).toMatchObject({ type: 'number', value: 5 });
  });

  it('parses LET with string literal', () => {
    const s = firstStmt('10 LET A$="hello"') as LetStatement;
    expect(s.type).toBe('let');
    expect(s.variable.name).toBe('A$');
    expect(s.variable.isString).toBe(true);
    expect(s.expr).toMatchObject({ type: 'string', value: 'hello' });
  });

  it('parses LET with hex literal', () => {
    const s = firstStmt('10 LET A=&HFF') as LetStatement;
    expect(s.type).toBe('let');
    expect(s.expr).toMatchObject({ type: 'hex-literal', value: 0xff });
  });

  it('parses implicit LET string variable', () => {
    const s = firstStmt('10 B$="world"') as LetStatement;
    expect(s.type).toBe('let');
    expect(s.variable.isString).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// GOTO and GOSUB
// ---------------------------------------------------------------------------

describe('GOTO and GOSUB', () => {
  it('parses GOTO with line number', () => {
    const s = firstStmt('10 GOTO 100') as GotoStatement;
    expect(s.type).toBe('goto');
    expect(s.target).toBe(100);
    expect(s.area).toBeUndefined();
  });

  it('parses GOTO with #area', () => {
    const s = firstStmt('10 GOTO #3') as GotoStatement;
    expect(s.type).toBe('goto');
    expect(s.area).toBe(3);
  });

  it('parses GOSUB with line number', () => {
    const s = firstStmt('10 GOSUB 200') as GosubStatement;
    expect(s.type).toBe('gosub');
    expect(s.target).toBe(200);
    expect(s.area).toBeUndefined();
  });

  it('parses GOSUB with #area', () => {
    const s = firstStmt('10 GOSUB #2') as GosubStatement;
    expect(s.type).toBe('gosub');
    expect(s.area).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// RETURN
// ---------------------------------------------------------------------------

describe('RETURN', () => {
  it('parses RETURN without area', () => {
    const s = firstStmt('10 RETURN') as ReturnStatement;
    expect(s.type).toBe('return');
    expect(s.area).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Multi-statement lines (colon separator)
// ---------------------------------------------------------------------------

describe('multi-statement lines', () => {
  it('parses two statements on one line', () => {
    const stmts = parseLine('10 CLS:BEEP');
    expect(stmts).toHaveLength(2);
    expect(stmts[0].type).toBe('cls');
    expect(stmts[1].type).toBe('beep');
  });

  it('parses three statements on one line', () => {
    const stmts = parseLine('10 CLS:BEEP:END');
    expect(stmts).toHaveLength(3);
    expect(stmts[0].type).toBe('cls');
    expect(stmts[1].type).toBe('beep');
    expect(stmts[2].type).toBe('end');
  });

  it('parses assignment followed by GOTO', () => {
    const stmts = parseLine('10 A=1:GOTO 100');
    expect(stmts).toHaveLength(2);
    expect(stmts[0].type).toBe('let');
    expect(stmts[1].type).toBe('goto');
  });
});

// ---------------------------------------------------------------------------
// PRINT
// ---------------------------------------------------------------------------

describe('PRINT statement', () => {
  it('parses PRINT with string literal', () => {
    const s = firstStmt('10 PRINT "hello"') as PrintStatement;
    expect(s.type).toBe('print');
    expect(s.device).toBe('lcd');
    expect(s.items[0]).toMatchObject({ type: 'expr', value: { type: 'string', value: 'hello' } });
  });

  it('parses PRINT with semicolons', () => {
    const s = firstStmt('10 PRINT A;B') as PrintStatement;
    expect(s.type).toBe('print');
    expect(s.items).toHaveLength(3);
    expect(s.items[1]).toMatchObject({ type: 'separator', kind: ';' });
  });

  it('parses PRINT with comma separator', () => {
    const s = firstStmt('10 PRINT A,B') as PrintStatement;
    expect(s.items[1]).toMatchObject({ type: 'separator', kind: ',' });
  });

  it('parses trailing semicolon in PRINT', () => {
    const s = firstStmt('10 PRINT "OK";') as PrintStatement;
    expect(s.items).toHaveLength(2);
    expect(s.items[1]).toMatchObject({ type: 'separator', kind: ';' });
  });

  it('parses LPRINT (device=printer)', () => {
    const s = firstStmt('10 LPRINT "X"') as PrintStatement;
    expect(s.type).toBe('print');
    expect(s.device).toBe('printer');
  });

  it('parses PRINT with no items', () => {
    const s = firstStmt('10 PRINT') as PrintStatement;
    expect(s.type).toBe('print');
    expect(s.items).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// INPUT
// ---------------------------------------------------------------------------

describe('INPUT statement', () => {
  it('parses INPUT with single variable', () => {
    const s = firstStmt('10 INPUT A') as InputStatement;
    expect(s.type).toBe('input');
    expect(s.variables[0]).toMatchObject({ name: 'A', isString: false });
    expect(s.prompt).toBeUndefined();
  });

  it('parses INPUT with prompt (semicolon separator)', () => {
    const s = firstStmt('10 INPUT "Enter:";A') as InputStatement;
    expect(s.type).toBe('input');
    expect(s.prompt).toBe('Enter:');
    expect(s.promptSep).toBe(';');
    expect(s.variables[0].name).toBe('A');
  });

  it('parses INPUT with prompt (comma separator)', () => {
    const s = firstStmt('10 INPUT "Value",A') as InputStatement;
    expect(s.prompt).toBe('Value');
    expect(s.promptSep).toBe(',');
  });

  it('parses INPUT with multiple variables', () => {
    const s = firstStmt('10 INPUT A,B,C') as InputStatement;
    expect(s.variables).toHaveLength(3);
    expect(s.variables[1].name).toBe('B');
  });
});

// ---------------------------------------------------------------------------
// LOCATE
// ---------------------------------------------------------------------------

describe('LOCATE statement', () => {
  it('parses LOCATE with col only', () => {
    const s = firstStmt('10 LOCATE 5') as { type: string; col: Expression; row?: Expression };
    expect(s.type).toBe('locate');
    expect(s.col).toMatchObject({ type: 'number', value: 5 });
    expect(s.row).toBeUndefined();
  });

  it('parses LOCATE with col and row', () => {
    const s = firstStmt('10 LOCATE 5,2') as { type: string; col: Expression; row: Expression };
    expect(s.type).toBe('locate');
    expect(s.col).toMatchObject({ type: 'number', value: 5 });
    expect(s.row).toMatchObject({ type: 'number', value: 2 });
  });
});

// ---------------------------------------------------------------------------
// Multi-line programs
// ---------------------------------------------------------------------------

describe('multi-line programs', () => {
  it('parses program with multiple lines', () => {
    const src = '10 CLS\n20 PRINT "hi"\n30 END';
    const prog = parse(src);
    expect([...prog.lines.keys()]).toEqual([10, 20, 30]);
  });

  it('preserves line number order', () => {
    const src = '100 BEEP\n200 GOTO 100';
    const prog = parse(src);
    const keys = [...prog.lines.keys()];
    expect(keys[0]).toBe(100);
    expect(keys[1]).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// IF / THEN / ELSE
// ---------------------------------------------------------------------------

describe('IF statement', () => {
  it('parses IF THEN with line number (GOTO shorthand)', () => {
    const s = firstStmt('10 IF A=1 THEN 100') as IfStatement;
    expect(s.type).toBe('if');
    expect(s.condition).toBeDefined();
    expect(s.thenBranch[0]).toMatchObject({ type: 'goto', target: 100 });
  });

  it('parses IF THEN ELSE', () => {
    const s = firstStmt('10 IF A>0 THEN PRINT "pos" ELSE PRINT "neg"') as IfStatement;
    expect(s.type).toBe('if');
    expect(s.thenBranch[0]).toMatchObject({ type: 'print' });
    expect(s.elseBranch![0]).toMatchObject({ type: 'print' });
  });

  it('parses IF with comparison and AND', () => {
    const s = firstStmt('10 IF A>0 AND B<10 THEN CLS') as IfStatement;
    expect(s.type).toBe('if');
    expect(s.condition).toMatchObject({ type: 'binary', op: 'and' });
  });

  it('parses IF with OR', () => {
    const s = firstStmt('10 IF A=1 OR A=2 THEN END') as IfStatement;
    expect(s.type).toBe('if');
    expect(s.condition).toMatchObject({ type: 'binary', op: 'or' });
  });

  it('parses nested IF with multiple then-statements', () => {
    const s = firstStmt('10 IF X=0 THEN BEEP:GOTO 999') as IfStatement;
    expect(s.thenBranch).toHaveLength(2);
    expect(s.thenBranch[0].type).toBe('beep');
    expect(s.thenBranch[1].type).toBe('goto');
  });
});

// ---------------------------------------------------------------------------
// FOR / NEXT
// ---------------------------------------------------------------------------

describe('FOR / NEXT', () => {
  it('parses FOR without STEP', () => {
    const s = firstStmt('10 FOR I=1 TO 10') as ForStatement;
    expect(s.type).toBe('for');
    expect(s.variable.name).toBe('I');
    expect(s.from).toMatchObject({ type: 'number', value: 1 });
    expect(s.to).toMatchObject({ type: 'number', value: 10 });
    expect(s.step).toBeUndefined();
  });

  it('parses FOR with STEP', () => {
    const s = firstStmt('10 FOR I=0 TO 100 STEP 5') as ForStatement;
    expect(s.step).toMatchObject({ type: 'number', value: 5 });
  });

  it('parses NEXT with single variable', () => {
    const s = firstStmt('10 NEXT I') as NextStatement;
    expect(s.type).toBe('next');
    expect(s.variables[0].name).toBe('I');
  });

  it('parses NEXT with multiple variables', () => {
    const s = firstStmt('10 NEXT I,J') as NextStatement;
    expect(s.type).toBe('next');
    expect(s.variables).toHaveLength(2);
    expect(s.variables[0].name).toBe('I');
    expect(s.variables[1].name).toBe('J');
  });

  it('parses NEXT with no variables', () => {
    const s = firstStmt('10 NEXT') as NextStatement;
    expect(s.type).toBe('next');
    expect(s.variables).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// DATA, READ, RESTORE
// ---------------------------------------------------------------------------

describe('DATA / READ / RESTORE', () => {
  it('parses DATA with numbers', () => {
    const s = firstStmt('10 DATA 1,2,3') as DataStatement;
    expect(s.type).toBe('data');
    expect(s.values).toHaveLength(3);
    expect(s.values[0]).toMatchObject({ type: 'number', value: 1 });
    expect(s.values[2]).toMatchObject({ type: 'number', value: 3 });
  });

  it('parses DATA with strings', () => {
    const s = firstStmt('10 DATA "hello","world"') as DataStatement;
    expect(s.type).toBe('data');
    expect(s.values[0]).toMatchObject({ type: 'string', value: 'hello' });
  });

  it('parses DATA with mixed values', () => {
    const s = firstStmt('10 DATA 42,"text",3.14') as DataStatement;
    expect(s.values).toHaveLength(3);
    expect(s.values[1]).toMatchObject({ type: 'string', value: 'text' });
  });

  it('collects DATA values into program.dataValues', () => {
    const prog = parse('10 DATA 1,2\n20 DATA 3,4');
    expect(prog.dataValues).toHaveLength(4);
    expect(prog.dataValues[0]).toMatchObject({ type: 'number', value: 1 });
    expect(prog.dataValues[3]).toMatchObject({ type: 'number', value: 4 });
  });

  it('parses READ with single variable', () => {
    const s = firstStmt('10 READ A') as ReadStatement;
    expect(s.type).toBe('read');
    expect(s.variables[0].name).toBe('A');
  });

  it('parses READ with multiple variables', () => {
    const s = firstStmt('10 READ A,B,C') as ReadStatement;
    expect(s.variables).toHaveLength(3);
  });

  it('parses RESTORE without target', () => {
    const s = firstStmt('10 RESTORE') as RestoreStatement;
    expect(s.type).toBe('restore');
    expect(s.target).toBeUndefined();
  });

  it('parses RESTORE with target line', () => {
    const s = firstStmt('10 RESTORE 500') as RestoreStatement;
    expect(s.type).toBe('restore');
    expect(s.target).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// DIM
// ---------------------------------------------------------------------------

describe('DIM statement', () => {
  it('parses DIM with single 1D array', () => {
    const s = firstStmt('10 DIM A(10)') as DimStatement;
    expect(s.type).toBe('dim');
    expect(s.decls).toHaveLength(1);
    expect(s.decls[0].name).toBe('A');
    expect(s.decls[0].isString).toBe(false);
    expect(s.decls[0].dimensions[0]).toMatchObject({ type: 'number', value: 10 });
  });

  it('parses DIM with multi-dimensional array', () => {
    const s = firstStmt('10 DIM B(3,4)') as DimStatement;
    expect(s.decls[0].dimensions).toHaveLength(2);
    expect(s.decls[0].dimensions[0]).toMatchObject({ type: 'number', value: 3 });
    expect(s.decls[0].dimensions[1]).toMatchObject({ type: 'number', value: 4 });
  });

  it('parses DIM with multiple declarations', () => {
    const s = firstStmt('10 DIM A(5),B$(10)') as DimStatement;
    expect(s.decls).toHaveLength(2);
    expect(s.decls[0].name).toBe('A');
    expect(s.decls[0].isString).toBe(false);
    expect(s.decls[1].name).toBe('B$');
    expect(s.decls[1].isString).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ON GOTO / ON GOSUB
// ---------------------------------------------------------------------------

describe('ON GOTO / ON GOSUB', () => {
  it('parses ON x GOTO with multiple targets', () => {
    const s = firstStmt('10 ON X GOTO 100,200,300') as OnBranchStatement;
    expect(s.type).toBe('on-branch');
    expect(s.kind).toBe('goto');
    expect(s.targets).toHaveLength(3);
    expect(s.targets[0].line).toBe(100);
    expect(s.targets[2].line).toBe(300);
  });

  it('parses ON x GOSUB with multiple targets', () => {
    const s = firstStmt('10 ON X GOSUB 1000,2000') as OnBranchStatement;
    expect(s.type).toBe('on-branch');
    expect(s.kind).toBe('gosub');
    expect(s.targets).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// ON ERROR GOTO
// ---------------------------------------------------------------------------

describe('ON ERROR GOTO', () => {
  it('parses ON ERROR GOTO with line number', () => {
    const s = firstStmt('10 ON ERROR GOTO 9000') as OnErrorGotoStatement;
    expect(s.type).toBe('on-error-goto');
    expect(s.target).toBe(9000);
  });
});

// ---------------------------------------------------------------------------
// CLEAR and POKE
// ---------------------------------------------------------------------------

describe('CLEAR and POKE', () => {
  it('parses CLEAR without args', () => {
    const s = firstStmt('10 CLEAR') as ClearStatement;
    expect(s.type).toBe('clear');
    expect(s.stringArea).toBeUndefined();
  });

  it('parses CLEAR with string area size', () => {
    const s = firstStmt('10 CLEAR 200') as ClearStatement;
    expect(s.type).toBe('clear');
    expect(s.stringArea).toMatchObject({ type: 'number', value: 200 });
  });

  it('parses POKE', () => {
    const s = firstStmt('10 POKE 100,42') as PokeStatement;
    expect(s.type).toBe('poke');
    expect(s.address).toMatchObject({ type: 'number', value: 100 });
    expect(s.value).toMatchObject({ type: 'number', value: 42 });
  });
});

// ---------------------------------------------------------------------------
// DEF FN
// ---------------------------------------------------------------------------

describe('DEF FN', () => {
  it('parses DEF FN with single param', () => {
    const s = firstStmt('10 DEF FN F(X)=X*2') as DefFnStatement;
    expect(s.type).toBe('def-fn');
    expect(s.name).toBe('F');
    expect(s.params).toEqual(['X']);
    expect(s.body).toMatchObject({ type: 'binary', op: '*' });
  });

  it('parses DEF FN with multiple params', () => {
    const s = firstStmt('10 DEF FN G(X,Y)=X+Y') as DefFnStatement;
    expect(s.params).toEqual(['X', 'Y']);
  });
});

// ---------------------------------------------------------------------------
// Expression precedence
// ---------------------------------------------------------------------------

describe('expression precedence', () => {
  it('2+3*4 is parsed as 2+(3*4)', () => {
    const s = firstStmt('10 A=2+3*4') as LetStatement;
    const expr = s.expr as { type: string; op: string; right: { op: string } };
    expect(expr.type).toBe('binary');
    expect(expr.op).toBe('+');
    expect(expr.right).toMatchObject({ type: 'binary', op: '*' });
  });

  it('2*3+4 is parsed as (2*3)+4', () => {
    const s = firstStmt('10 A=2*3+4') as LetStatement;
    const expr = s.expr as { type: string; op: string; left: { op: string } };
    expect(expr.type).toBe('binary');
    expect(expr.op).toBe('+');
    expect(expr.left).toMatchObject({ type: 'binary', op: '*' });
  });

  it('2^3*4 is parsed as (2^3)*4', () => {
    const s = firstStmt('10 A=2^3*4') as LetStatement;
    const expr = s.expr as { type: string; op: string; left: { op: string } };
    expect(expr.type).toBe('binary');
    expect(expr.op).toBe('*');
    expect(expr.left).toMatchObject({ type: 'binary', op: '^' });
  });
});

// ---------------------------------------------------------------------------
// Unary negation
// ---------------------------------------------------------------------------

describe('unary negation', () => {
  it('parses -A', () => {
    const s = firstStmt('10 X=-A') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'unary', op: '-' });
  });

  it('parses -5', () => {
    const s = firstStmt('10 X=-5') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'unary', op: '-' });
  });
});

// ---------------------------------------------------------------------------
// Parenthesized expressions
// ---------------------------------------------------------------------------

describe('parenthesized expressions', () => {
  it('parses (2+3)*4 correctly', () => {
    const s = firstStmt('10 A=(2+3)*4') as LetStatement;
    const expr = s.expr as { type: string; op: string; left: Expression };
    expect(expr.type).toBe('binary');
    expect(expr.op).toBe('*');
    expect(expr.left).toMatchObject({ type: 'binary', op: '+' });
  });
});

// ---------------------------------------------------------------------------
// Builtin function calls
// ---------------------------------------------------------------------------

describe('builtin function calls', () => {
  it('parses SIN(X)', () => {
    const s = firstStmt('10 A=SIN(X)') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'builtin-call', name: 'SIN' });
    const expr = s.expr as { type: string; args: Expression[] };
    expect(expr.args).toHaveLength(1);
  });

  it('parses MID$ with 3 args', () => {
    const s = firstStmt('10 A$=MID$(B$,2,3)') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'builtin-call', name: 'MID$' });
    const expr = s.expr as { args: Expression[] };
    expect(expr.args).toHaveLength(3);
  });

  it('parses PEEK(addr)', () => {
    const s = firstStmt('10 A=PEEK(100)') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'builtin-call', name: 'PEEK' });
  });
});

// ---------------------------------------------------------------------------
// Array access
// ---------------------------------------------------------------------------

describe('array access', () => {
  it('parses single-dimension array read', () => {
    const s = firstStmt('10 X=A(3)') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'array-access', name: 'A' });
    const expr = s.expr as { indices: Expression[] };
    expect(expr.indices).toHaveLength(1);
    expect(expr.indices[0]).toMatchObject({ type: 'number', value: 3 });
  });

  it('parses 2D array access', () => {
    const s = firstStmt('10 X=M(2,3)') as LetStatement;
    const expr = s.expr as { type: string; indices: Expression[] };
    expect(expr.type).toBe('array-access');
    expect(expr.indices).toHaveLength(2);
  });

  it('parses string array access', () => {
    const s = firstStmt('10 X$=S$(5)') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'array-access', name: 'S$', isString: true });
  });
});

// ---------------------------------------------------------------------------
// Zero-argument builtins: RAN#, PI
// ---------------------------------------------------------------------------

describe('zero-argument builtins', () => {
  it('parses RAN# (no parens)', () => {
    const s = firstStmt('10 A=RAN#') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'builtin-call', name: 'RAN#', args: [] });
  });

  it('parses PI (no parens)', () => {
    const s = firstStmt('10 A=PI') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'builtin-call', name: 'PI', args: [] });
  });
});

// ---------------------------------------------------------------------------
// Hex literal
// ---------------------------------------------------------------------------

describe('hex literal in expression', () => {
  it('parses &HFF as hex-literal with value 255', () => {
    const s = firstStmt('10 A=&HFF') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'hex-literal', value: 255 });
  });
});

// ---------------------------------------------------------------------------
// FN call
// ---------------------------------------------------------------------------

describe('FN call', () => {
  it('parses FN F(5) as fn-call', () => {
    const s = firstStmt('10 A=FN F(5)') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'fn-call', name: 'F' });
    const expr = s.expr as { args: Expression[] };
    expect(expr.args[0]).toMatchObject({ type: 'number', value: 5 });
  });
});

// ---------------------------------------------------------------------------
// Logical operators in conditions
// ---------------------------------------------------------------------------

describe('logical operators', () => {
  it('parses NOT X', () => {
    const s = firstStmt('10 A=NOT X') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'unary', op: 'not' });
  });

  it('parses A AND B', () => {
    const s = firstStmt('10 IF A AND B THEN CLS') as IfStatement;
    expect(s.condition).toMatchObject({ type: 'binary', op: 'and' });
  });

  it('parses A OR B', () => {
    const s = firstStmt('10 IF A OR B THEN CLS') as IfStatement;
    expect(s.condition).toMatchObject({ type: 'binary', op: 'or' });
  });

  it('parses A XOR B', () => {
    const s = firstStmt('10 A=X XOR Y') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'binary', op: 'xor' });
  });
});

// ---------------------------------------------------------------------------
// WHILE / WEND
// ---------------------------------------------------------------------------

describe('WHILE / WEND', () => {
  it('parses WHILE condition', () => {
    const s = firstStmt('10 WHILE A>0') as { type: string; condition: Expression };
    expect(s.type).toBe('while');
    expect(s.condition).toMatchObject({ type: 'binary', op: '>' });
  });

  it('parses WEND', () => {
    const s = firstStmt('10 WEND') as { type: string };
    expect(s.type).toBe('wend');
  });
});

// ---------------------------------------------------------------------------
// ANGLE
// ---------------------------------------------------------------------------

describe('ANGLE', () => {
  it('parses ANGLE 1', () => {
    const s = firstStmt('10 ANGLE 1') as { type: string; mode: Expression };
    expect(s.type).toBe('angle');
    expect(s.mode).toMatchObject({ type: 'number', value: 1 });
  });
});

// ---------------------------------------------------------------------------
// MODE
// ---------------------------------------------------------------------------

describe('MODE', () => {
  it('parses MODE with number', () => {
    const s = firstStmt('10 MODE 1') as { type: string; number: Expression };
    expect(s.type).toBe('mode');
    expect(s.number).toMatchObject({ type: 'number', value: 1 });
  });
});

// ---------------------------------------------------------------------------
// OPEN / CLOSE
// ---------------------------------------------------------------------------

describe('OPEN / CLOSE', () => {
  it('parses OPEN', () => {
    const s = firstStmt('10 OPEN "FILE.BAS" AS #1') as { type: string; filename: Expression; filenum: Expression };
    expect(s.type).toBe('open');
    expect(s.filename).toMatchObject({ type: 'string', value: 'FILE.BAS' });
  });

  it('parses CLOSE with file number', () => {
    const s = firstStmt('10 CLOSE #1') as { type: string; filenum: Expression };
    expect(s.type).toBe('close');
  });

  it('parses CLOSE without file number', () => {
    const s = firstStmt('10 CLOSE') as { type: string };
    expect(s.type).toBe('close');
  });
});

// ---------------------------------------------------------------------------
// PRINT# (print to file)
// ---------------------------------------------------------------------------

describe('PRINT# (print to file)', () => {
  it('parses PRINT# with items', () => {
    const s = firstStmt('10 PRINT#1,A') as { type: string; filenum: Expression; items: unknown[] };
    expect(s.type).toBe('print-file');
    expect(s.filenum).toMatchObject({ type: 'number', value: 1 });
  });
});

// ---------------------------------------------------------------------------
// DEFM / DEFSEG
// ---------------------------------------------------------------------------

describe('DEFM / DEFSEG', () => {
  it('parses DEFM', () => {
    const s = firstStmt('10 DEFM 100') as { type: string; size: Expression };
    expect(s.type).toBe('defm');
    expect(s.size).toMatchObject({ type: 'number', value: 100 });
  });

  it('parses DEFSEG', () => {
    const s = firstStmt('10 DEFSEG 2') as { type: string; segment: Expression };
    expect(s.type).toBe('defseg');
    expect(s.segment).toMatchObject({ type: 'number', value: 2 });
  });
});

// ---------------------------------------------------------------------------
// RESUME
// ---------------------------------------------------------------------------

describe('RESUME', () => {
  it('parses RESUME without target', () => {
    const s = firstStmt('10 RESUME') as { type: string; target?: unknown };
    expect(s.type).toBe('resume');
    expect(s.target).toBeUndefined();
  });

  it('parses RESUME NEXT', () => {
    const s = firstStmt('10 RESUME NEXT') as { type: string; target: unknown };
    expect(s.type).toBe('resume');
    expect(s.target).toBe('next');
  });

  it('parses RESUME with line number', () => {
    const s = firstStmt('10 RESUME 100') as { type: string; target: unknown };
    expect(s.type).toBe('resume');
    expect(s.target).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// ERASE
// ---------------------------------------------------------------------------

describe('ERASE', () => {
  it('parses ERASE with single variable', () => {
    const s = firstStmt('10 ERASE A') as { type: string; names: string[] };
    expect(s.type).toBe('erase');
    expect(s.names).toContain('A');
  });

  it('parses ERASE with multiple variables', () => {
    const s = firstStmt('10 ERASE A,B,C') as { type: string; names: string[] };
    expect(s.names).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// CHAIN
// ---------------------------------------------------------------------------

describe('CHAIN', () => {
  it('parses CHAIN with filename', () => {
    const s = firstStmt('10 CHAIN "PROG2"') as { type: string; filename: Expression };
    expect(s.type).toBe('chain');
    expect(s.filename).toMatchObject({ type: 'string', value: 'PROG2' });
  });
});

// ---------------------------------------------------------------------------
// STAT / STAT CLEAR
// ---------------------------------------------------------------------------

describe('STAT / STAT CLEAR', () => {
  it('parses STAT with data', () => {
    const s = firstStmt('10 STAT 1,2,3') as { type: string; data: Expression[] };
    expect(s.type).toBe('stat');
    expect(s.data).toHaveLength(3);
  });

  it('parses STAT CLEAR', () => {
    const s = firstStmt('10 STAT CLEAR') as { type: string };
    expect(s.type).toBe('stat-clear');
  });
});

// ---------------------------------------------------------------------------
// DEFCHR$
// ---------------------------------------------------------------------------

describe('DEFCHR$', () => {
  it('parses DEFCHR$ with code and pattern', () => {
    const s = firstStmt('10 DEFCHR$ 128,&HFF') as { type: string; code: Expression; pattern: Expression };
    expect(s.type).toBe('defchr');
    expect(s.code).toMatchObject({ type: 'number', value: 128 });
    expect(s.pattern).toMatchObject({ type: 'hex-literal', value: 255 });
  });
});

// ---------------------------------------------------------------------------
// INKEY$ as zero-arg builtin
// ---------------------------------------------------------------------------

describe('INKEY$ zero-arg builtin', () => {
  it('parses INKEY$ as builtin-call with no args', () => {
    const s = firstStmt('10 A$=INKEY$') as LetStatement;
    expect(s.expr).toMatchObject({ type: 'builtin-call', name: 'INKEY$', args: [] });
  });
});

// ---------------------------------------------------------------------------
// USING in PRINT
// ---------------------------------------------------------------------------

describe('PRINT USING', () => {
  it('parses PRINT USING with format', () => {
    const s = firstStmt('10 PRINT USING "###.##",A') as PrintStatement;
    expect(s.type).toBe('print');
    expect(s.using).toMatchObject({ type: 'string' });
  });
});
