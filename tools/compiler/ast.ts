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

// hasDecimalPoint: true iff the source literal's raw text contained a '.'
// (e.g. "5.0"), independent of `value` — 5.0 and 5 both parse to value: 5
// but must stay distinguishable for type-inference.ts's eligibility rule,
// which is syntactic, not semantic. NOTE: `tools/` is not covered by any
// tsconfig `include` (see tsconfig.app.json/tsconfig.node.json), so this
// field is NOT enforced by the type-checker outside an editor's ad-hoc
// TS server — a future NumberLiteral construction site that omits it will
// silently read as `undefined` (falsy) at runtime rather than fail a build.
export interface NumberLiteral { type: 'number'; value: number; hasDecimalPoint: boolean }
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
