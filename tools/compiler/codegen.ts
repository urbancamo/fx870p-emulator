// tools/compiler/codegen.ts
// Code generator: takes a parsed BASIC AST and produces annotated HD61700 assembly (AsmLine[])

import type {
  Program, Statement, Expression, VarRef,
  PrintItem, BinaryOp,
  ForStatement, NextStatement, IfStatement, InputStatement, PrintStatement, LetStatement,
  OnBranchStatement, DimStatement, ReadStatement, RestoreStatement,
  WhileStatement, LocateStatement, AngleStatement, PokeStatement, DefsegStatement,
  OnErrorGotoStatement, ResumeStatement, DefFnStatement,
  OpenStatement, CloseStatement, PrintFileStatement, InputFileStatement,
  LineInputFileStatement, WriteFileStatement, StatStatement, DefchrStatement,
  ChainStatement, ModeStatement, ArrayDecl,
} from './ast.js';
import type { AsmLine, AsmProgram } from './asm-types.js';

// ---------------------------------------------------------------------------
// ROM entry points
// ---------------------------------------------------------------------------

const ROM = {
  FP_ADD:    '&H05DA',
  FP_SUB:    '&H05D4',
  FP_MUL:    '&H0607',
  FP_DIV:    '&H16BD',
  PRINT:     '&H3EF1',
  INPUT:     '&H3DEE',
  OUTCR:     '&H2AE8',
  OUTCH:     '&H2AF1',
  CLS:       '&H2ADF',
  BEEP:      '&H33B3',
  KYIN:      '&H03A4',  // Blocking key input — returns keycode in $0
  LCDSEL:    '&H2991',  // Select LCD as output device (OUTDV=0)
  // ROM addresses for built-in functions (TODO: verify exact addresses)
  SIN:       '&H0000',  // TODO: ROM address for SIN
  COS:       '&H0000',  // TODO: ROM address for COS
  TAN:       '&H0000',  // TODO: ROM address for TAN
  ASN:       '&H0000',  // TODO: ROM address for ASN
  ACS:       '&H0000',  // TODO: ROM address for ACS
  ATN:       '&H0000',  // TODO: ROM address for ATN
  EXP:       '&H0000',  // TODO: ROM address for EXP
  LN:        '&H0000',  // TODO: ROM address for LN
  LOG:       '&H0000',  // TODO: ROM address for LOG
  SQR:       '&H0000',  // TODO: ROM address for SQR
  ABS:       '&H0000',  // TODO: ROM address for ABS
  INT:       '&H0000',  // TODO: ROM address for INT
  FIX:       '&H0000',  // TODO: ROM address for FIX
  SGN:       '&H0000',  // TODO: ROM address for SGN
  RND:       '&H0000',  // TODO: ROM address for RND
  LEN:       '&H0000',  // TODO: ROM address for LEN
  VAL:       '&H0000',  // TODO: ROM address for VAL
  ASC:       '&H0000',  // TODO: ROM address for ASC
  LOCATE:    '&H0000',  // TODO: ROM address for LOCATE
  ANGLE:     '&H0000',  // TODO: ROM address for ANGLE
  // File I/O ROM stubs (TODO: determine correct addresses)
  FILE_OPEN:  '&H0000', // TODO: ROM address for file OPEN
  FILE_CLOSE: '&H0000', // TODO: ROM address for file CLOSE
  FILE_PRINT: '&H0000', // TODO: ROM address for PRINT#
  FILE_INPUT: '&H0000', // TODO: ROM address for INPUT#
  FILE_WRITE: '&H0000', // TODO: ROM address for WRITE#
  // Stat ROM stubs
  STAT_ADD:   '&H0000', // TODO: ROM address for STAT data entry
  STAT_CLEAR: '&H0000', // TODO: ROM address for STAT CLEAR
  // Misc ROM stubs
  DEFCHR:     '&H0000', // TODO: ROM address for DEFCHR$
  CHAIN:      '&H0000', // TODO: ROM address for CHAIN
  MODE:       '&H0000', // TODO: ROM address for MODE
} as const;

// ---------------------------------------------------------------------------
// Variable tracking
// ---------------------------------------------------------------------------

interface VarInfo {
  label: string;
  type: 'numeric' | 'string';
  size: number;  // 9 for numeric, 256 for string
}

// ---------------------------------------------------------------------------
// String literal tracking
// ---------------------------------------------------------------------------

interface StringInfo {
  label: string;
  value: string;
}

// ---------------------------------------------------------------------------
// FOR loop tracking
// ---------------------------------------------------------------------------

interface ForLoopInfo {
  varName: string;
  topLabel: string;
  endLabel: string;
}

// ---------------------------------------------------------------------------
// Code generator state
// ---------------------------------------------------------------------------

class CodeGen {
  private code: AsmLine[] = [];
  private variables = new Map<string, VarInfo>();
  private strings: StringInfo[] = [];
  private stringIndex = 0;
  private labelIndex = 0;
  private forStack: ForLoopInfo[] = [];
  private whileStack: Array<{ topLabel: string; endLabel: string }> = [];
  private arrays = new Map<string, { label: string; totalBytes: number }>();
  private fnDefs = new Map<string, { params: string[]; body: Expression }>();
  private currentSegment = 0;

  generate(program: Program): AsmProgram {
    // 1. ORG directive
    // Origin 0x1CD0 — Bank1 area that's reachable via BASIC POKE/MODE110,
    // same address used by CosmicV4. BASIC POKE can't reach Bank1 0x0000.
    this.code.push({ mnemonic: 'ORG', operands: '&H1CD0' });

    // 1b. Prologue: force OUTDV=0 (LCD). The loader's OPEN "COM0:.." leaves
    // OUTDV=8 (comm device), so PRINT routines would route to COM0 instead
    // of the LCD. Direct memory write is more reliable than calling ROM
    // LCDSEL (&H2991), which uses ld $0,$sx with unpredictable SX state.
    this.code.push({ comment: 'prologue: force OUTDV=0 (LCD)' });
    this.code.push({ mnemonic: 'ldw', operands: '$2,&H1739', comment: 'OUTDV addr' });
    this.code.push({ mnemonic: 'pre', operands: 'ix,$2' });
    this.code.push({ mnemonic: 'ld', operands: '$0,&H00', comment: 'LCD device code' });
    this.code.push({ mnemonic: 'std', operands: '$0,(ix+&H00)', comment: 'write OUTDV' });

    // 2. Code section — one block per BASIC line
    const sortedLineNums = [...program.lines.keys()].sort((a, b) => a - b);
    for (const lineNum of sortedLineNums) {
      const stmts = program.lines.get(lineNum)!;
      const source = this.reconstructSource(lineNum, stmts);

      // Emit BASIC source annotation on the label line
      this.code.push({
        label: `L${lineNum}`,
        basicLine: { num: lineNum, source },
      });

      for (const stmt of stmts) {
        this.emitStatement(stmt);
      }
    }

    // 3. ROM_CALL wrapper
    this.emitRomCallWrapper();

    // 4. DATA table — collected DATA values emitted as DB/DW directives
    if (program.dataValues.length > 0) {
      this.code.push({ comment: 'DATA table' });
      this.code.push({ label: 'DATA_TABLE', comment: 'DATA values' });
      for (const val of program.dataValues) {
        if (val.type === 'string') {
          const strInfo = this.allocString(val.value);
          this.code.push({
            mnemonic: 'dw',
            operands: strInfo.label,
            comment: `DATA "${val.value}"`,
          });
        } else {
          // Store as a 9-byte FP value placeholder (TODO: encode as BCD)
          this.code.push({
            mnemonic: 'dw',
            operands: this.formatNumber(val.value),
            comment: `DATA ${val.value} (TODO: BCD encode)`,
          });
        }
      }
      // DATA_PTR variable — holds current read position in DATA_TABLE
      this.code.push({
        label: 'DATA_PTR',
        mnemonic: 'dw',
        operands: 'DATA_TABLE',
        comment: 'READ pointer — initialized to start of DATA table',
      });
    }

    // 5. String literals (DB directives)
    if (this.strings.length > 0) {
      this.code.push({ comment: 'String literals' });
      for (const str of this.strings) {
        this.code.push({
          label: str.label,
          mnemonic: 'db',
          operands: this.encodeStringOperand(str.value),
        });
      }
    }

    // 6. Array storage (DS directives)
    if (this.arrays.size > 0) {
      this.code.push({ comment: 'Array storage' });
      for (const [, info] of this.arrays) {
        this.code.push({
          label: info.label,
          mnemonic: 'DS',
          operands: String(info.totalBytes),
          comment: 'array storage',
        });
      }
    }

    // 7. Variable table (DS directives)
    if (this.variables.size > 0) {
      this.code.push({ comment: 'Variable storage' });
      for (const [, info] of this.variables) {
        this.code.push({
          label: info.label,
          mnemonic: 'DS',
          operands: String(info.size),
          comment: `${info.type} variable`,
        });
      }
    }

    return { lines: this.code, origin: 0x1CD0 };
  }

  // -------------------------------------------------------------------------
  // Unique label generation
  // -------------------------------------------------------------------------

  private uniqueLabel(prefix: string): string {
    this.labelIndex++;
    return `${prefix}_${this.labelIndex}`;
  }

  // -------------------------------------------------------------------------
  // Statement emission
  // -------------------------------------------------------------------------

  private emitStatement(stmt: Statement): void {
    switch (stmt.type) {
      case 'cls':
        this.emitRomCall(ROM.CLS, 'CLS');
        break;

      case 'beep':
        this.emitRomCall(ROM.BEEP, 'BEEP');
        break;

      case 'end':
        // Before returning to BASIC (which clears the LCD when redrawing its
        // prompt), emit OUTCR + "[EXE]" prompt + wait for keypress. This lets
        // the user see the program's output before BASIC clobbers it.
        this.emitPauseAtEnd();
        this.code.push({ mnemonic: 'rtn', comment: stmt.kind.toUpperCase() });
        break;

      case 'goto':
        this.code.push({ mnemonic: 'jp', operands: `L${stmt.target}` });
        break;

      case 'gosub':
        this.code.push({ mnemonic: 'cal', operands: `L${stmt.target}` });
        break;

      case 'return':
        this.code.push({ mnemonic: 'rtn' });
        break;

      case 'rem':
        // No code emitted for REM — annotation is on the label line
        break;

      case 'print':
        this.emitPrint(stmt);
        break;

      case 'let':
        this.emitLet(stmt);
        break;

      case 'for':
        this.emitFor(stmt);
        break;

      case 'next':
        this.emitNext(stmt);
        break;

      case 'if':
        this.emitIf(stmt);
        break;

      case 'input':
        this.emitInput(stmt);
        break;

      case 'on-branch':
        this.emitOnBranch(stmt);
        break;

      case 'dim':
        this.emitDim(stmt);
        break;

      case 'read':
        this.emitRead(stmt);
        break;

      case 'data':
        // DATA is pre-collected into program.dataValues; no inline code needed
        break;

      case 'restore':
        this.emitRestore(stmt);
        break;

      case 'while':
        this.emitWhile(stmt);
        break;

      case 'wend':
        this.emitWend();
        break;

      case 'locate':
        this.emitLocate(stmt);
        break;

      case 'angle':
        this.emitAngle(stmt);
        break;

      case 'poke':
        this.emitPoke(stmt);
        break;

      case 'defseg':
        this.emitDefseg(stmt);
        break;

      case 'on-error-goto':
        this.emitOnErrorGoto(stmt);
        break;

      case 'resume':
        this.emitResume(stmt);
        break;

      case 'erase':
        this.code.push({ comment: `ERASE ${stmt.names.join(',')} — simplified: array deallocation not tracked` });
        break;

      case 'clear':
        this.code.push({ comment: 'CLEAR — simplified: variable reset not emitted' });
        break;

      case 'defm':
        this.code.push({ comment: `DEFM — simplified: memory size directive, no code emitted` });
        break;

      case 'def-fn':
        this.emitDefFn(stmt);
        break;

      case 'open':
        this.emitOpen(stmt);
        break;

      case 'close':
        this.emitClose(stmt);
        break;

      case 'print-file':
        this.emitPrintFile(stmt);
        break;

      case 'input-file':
        this.emitInputFile(stmt);
        break;

      case 'line-input-file':
        this.emitLineInputFile(stmt);
        break;

      case 'write-file':
        this.emitWriteFile(stmt);
        break;

      case 'stat':
        this.emitStat(stmt);
        break;

      case 'stat-clear':
        this.emitStatClear();
        break;

      case 'defchr':
        this.emitDefchr(stmt);
        break;

      case 'chain':
        this.emitChain(stmt);
        break;

      case 'mode':
        this.emitMode(stmt);
        break;

      default:
        this.code.push({ comment: `TODO: ${(stmt as Statement).type} not yet implemented` });
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Expression emission — recursive, result in FP accumulator ($10-$18)
  // -------------------------------------------------------------------------

  private emitExpression(expr: Expression): void {
    switch (expr.type) {
      case 'number':
        this.emitNumberLiteral(expr.value);
        break;

      case 'hex-literal':
        this.emitNumberLiteral(expr.value);
        break;

      case 'string':
        this.emitStringLiteral(expr.value);
        break;

      case 'variable':
        this.emitVariableLoad(expr.ref);
        break;

      case 'binary':
        this.emitBinaryExpr(expr.op, expr.left, expr.right);
        break;

      case 'unary':
        this.emitUnaryExpr(expr.op, expr.operand);
        break;

      case 'builtin-call':
        this.emitBuiltinCall(expr.name, expr.args);
        break;

      case 'array-access':
        this.emitArrayAccess(expr.name, expr.isString, expr.indices);
        break;

      case 'fn-call':
        this.code.push({ comment: `TODO: FN call ${expr.name}` });
        break;
    }
  }

  // -------------------------------------------------------------------------
  // Number literal → load into FP accumulator
  // -------------------------------------------------------------------------

  private emitNumberLiteral(value: number): void {
    // Simplified: load integer value into accumulator register pair
    // Real implementation needs full BCD conversion for the 9-byte FP format
    this.code.push({
      mnemonic: 'ldw',
      operands: `$10,${this.formatNumber(value)}`,
      comment: `load constant ${value} (TODO: BCD conversion)`,
    });
  }

  // -------------------------------------------------------------------------
  // String literal → load address into accumulator
  // -------------------------------------------------------------------------

  private emitStringLiteral(value: string): void {
    const strInfo = this.allocString(value);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$10,${strInfo.label}`,
      comment: `address of "${value}"`,
    });
  }

  // -------------------------------------------------------------------------
  // Variable load → load 9 bytes from variable storage into FP accumulator
  // -------------------------------------------------------------------------

  private emitVariableLoad(ref: VarRef): void {
    const varInfo = this.allocVariable(ref);
    if (ref.isString) {
      // Load address of string variable
      this.code.push({
        mnemonic: 'ldw',
        operands: `$10,${varInfo.label}`,
        comment: `address of ${ref.name}$`,
      });
    } else {
      // Load 9-byte FP value from variable into accumulator via IX addressing
      this.emitVarLoad9(varInfo.label, `load ${ref.name}`);
    }
  }

  // -------------------------------------------------------------------------
  // Variable store — store FP accumulator to variable storage
  // -------------------------------------------------------------------------

  private emitVariableStore(ref: VarRef): void {
    const varInfo = this.allocVariable(ref);
    if (ref.isString) {
      // String: the accumulator holds the source address; loading the address is sufficient
      // (string copy via ROM strcpy would be needed for a real assignment; stub with comment)
      this.code.push({
        comment: `TODO: string copy for ${ref.name}$ (needs strcpy ROM call)`,
      });
    } else {
      // Store 9-byte FP accumulator to variable via IX addressing
      this.emitVarStore9(varInfo.label, `store ${ref.name}`);
    }
  }

  // -------------------------------------------------------------------------
  // IX-indexed 9-byte load/store helpers — valid HD61700 addressing
  //
  // The HD61700 stm/ldm instructions use REGIRRIM3 addressing (ix+sir, count 1-8).
  // Direct-address stm/ldm is not valid. We set IX to the variable address,
  // move the first 8 bytes with a zero displacement, then reach the 9th byte
  // with an immediate +8 displacement.
  // -------------------------------------------------------------------------

  // `(ix+$sx)` is NOT "ix plus the value of SX": SX names a general register
  // and the displacement is that register's CONTENTS. The ROM's global
  // convention -- set up by ColdBootInit at &H1F53 and relied on by every ROM
  // routine, including the FP ones -- is SX -> $31 (which holds 0) and
  // SY -> $30 (which holds 1). So `psr sx,31` is how you say "displacement 0",
  // and `psr sx,8` did NOT mean +8, it meant "displacement = contents of $8".
  // Non-zero displacements use the immediate form `(ix+&Hnn)` instead.
  private emitVarLoad9(label: string, comment?: string): void {
    if (comment) this.code.push({ comment });
    this.code.push({ mnemonic: 'ldw',  operands: `$2,${label}`,         comment: 'load var address' });
    this.code.push({ mnemonic: 'pre',  operands: 'ix,$2',               comment: 'IX = var address' });
    this.code.push({ mnemonic: 'psr',  operands: 'sx,31',               comment: '$sx -> $31 (= 0): displacement 0' });
    this.code.push({ mnemonic: 'ldm',  operands: '$10,(ix+$sx),8',      comment: 'load bytes 0-7' });
    this.code.push({ mnemonic: 'ld',   operands: '$18,(ix+&H08)',       comment: 'load byte 8' });
  }

  private emitVarStore9(label: string, comment?: string): void {
    if (comment) this.code.push({ comment });
    this.code.push({ mnemonic: 'ldw',  operands: `$2,${label}`,         comment: 'load var address' });
    this.code.push({ mnemonic: 'pre',  operands: 'ix,$2',               comment: 'IX = var address' });
    this.code.push({ mnemonic: 'psr',  operands: 'sx,31',               comment: '$sx -> $31 (= 0): displacement 0' });
    this.code.push({ mnemonic: 'stm',  operands: '$10,(ix+$sx),8',      comment: 'store bytes 0-7' });
    this.code.push({ mnemonic: 'st',   operands: '$18,(ix+&H08)',       comment: 'store byte 8' });
  }

  // Store N bytes (N <= 8) from $10 to a direct label via IX
  private emitVarStoreN(label: string, n: number, comment?: string): void {
    if (comment) this.code.push({ comment });
    this.code.push({ mnemonic: 'ldw',  operands: `$2,${label}`,         comment: 'load var address' });
    this.code.push({ mnemonic: 'pre',  operands: 'ix,$2',               comment: 'IX = var address' });
    this.code.push({ mnemonic: 'psr',  operands: 'sx,31',               comment: '$sx -> $31 (= 0): displacement 0' });
    if (n === 1) {
      this.code.push({ mnemonic: 'st',  operands: '$10,(ix+$sx)',        comment: 'store 1 byte' });
    } else {
      this.code.push({ mnemonic: 'stm', operands: `$10,(ix+$sx),${n}`,  comment: `store ${n} bytes` });
    }
  }

  // -------------------------------------------------------------------------
  // Binary expression → left push, right eval, pop left, call ROM
  // -------------------------------------------------------------------------

  private emitBinaryExpr(op: BinaryOp, left: Expression, right: Expression): void {
    // 1. Evaluate left operand → FP accumulator ($10-$18)
    this.emitExpression(left);

    // 2. Push left operand (9 bytes) to stack
    // phsm max count is 8; push the 9th byte separately
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push left[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push left[8]' });

    // 3. Evaluate right operand → FP accumulator ($10-$18)
    this.emitExpression(right);

    // 4. Pop left operand into temporary registers $19-$27
    // ppsm max count is 8; pop the 9th byte (stack top = left[8]) first
    this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop left[8] → $27' });
    this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop left[0..7] → $19-$26' });

    // State: left in $19-$27, right in $10-$18
    // 5. Perform the operation
    const romAddr = this.arithmeticRomAddr(op);
    if (romAddr) {
      // ROM routines expect: left operand in $10-$18, right operand in $0-$8.
      // Right is currently in $10-$18 (from emitExpression(right)).
      // Left is already in $19-$27 (from the unconditional pop above).
      // Move right down to $0-$8 and left up to $10-$18.
      this.code.push({ mnemonic: 'ldm', operands: '$0,$10,8',  comment: 'right[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',  operands: '$8,$18',    comment: 'right[8] -> $8' });
      this.code.push({ mnemonic: 'ldm', operands: '$10,$19,8', comment: 'left[0..7] -> $10-$17' });
      this.code.push({ mnemonic: 'ld',  operands: '$18,$27',   comment: 'left[8] -> $18' });

      this.emitRomCallFp(romAddr, `${op}`);
    } else if (this.isComparisonOp(op)) {
      // Same operand convention as arithmetic — FP_SUB also expects
      // left in $10-$18, right in $0-$8.
      // Right is currently in $10-$18 (from emitExpression(right)).
      // Left is already in $19-$27 (from the unconditional pop above).
      // Move right down to $0-$8 and left up to $10-$18.
      this.code.push({ mnemonic: 'ldm', operands: '$0,$10,8',  comment: 'right[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',  operands: '$8,$18',    comment: 'right[8] -> $8' });
      this.code.push({ mnemonic: 'ldm', operands: '$10,$19,8', comment: 'left[0..7] -> $10-$17' });
      this.code.push({ mnemonic: 'ld',  operands: '$18,$27',   comment: 'left[8] -> $18' });
      this.emitRomCallFp(ROM.FP_SUB, `compare: ${op}`);
      // Result flags used by conditional jumps
    } else {
      this.code.push({ comment: `TODO: operator ${op}` });
    }
  }

  private arithmeticRomAddr(op: BinaryOp): string | undefined {
    switch (op) {
      case '+': return ROM.FP_ADD;
      case '-': return ROM.FP_SUB;
      case '*': return ROM.FP_MUL;
      case '/': return ROM.FP_DIV;
      default: return undefined;
    }
  }

  private isComparisonOp(op: BinaryOp): boolean {
    return ['=', '<>', '<', '>', '<=', '>='].includes(op);
  }

  // -------------------------------------------------------------------------
  // Unary expression
  // -------------------------------------------------------------------------

  private emitUnaryExpr(op: 'not' | '-', operand: Expression): void {
    this.emitExpression(operand);
    if (op === '-') {
      // Negate: XOR the sign byte of the BCD accumulator
      this.code.push({
        mnemonic: 'xr',
        operands: '$10,&H80',
        comment: 'negate FP sign bit',
      });
    } else {
      this.code.push({ comment: 'TODO: NOT operator' });
    }
  }

  // -------------------------------------------------------------------------
  // Builtin function call
  // -------------------------------------------------------------------------

  private emitBuiltinCall(name: string, args: Expression[]): void {
    // Evaluate first argument into accumulator (most builtins take one arg)
    for (const arg of args) {
      this.emitExpression(arg);
    }
    // Look up ROM address for known functions; fall back to &H0000 with TODO comment
    const romAddr = this.builtinRomAddr(name);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${romAddr}`,
      comment: `TODO: ROM address for ${name}`,
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  private builtinRomAddr(name: string): string {
    const upper = name.toUpperCase();
    const known: Record<string, string> = {
      SIN: ROM.SIN, COS: ROM.COS, TAN: ROM.TAN,
      ASN: ROM.ASN, ACS: ROM.ACS, ATN: ROM.ATN,
      EXP: ROM.EXP, LN: ROM.LN, LOG: ROM.LOG,
      SQR: ROM.SQR, ABS: ROM.ABS, INT: ROM.INT,
      FIX: ROM.FIX, SGN: ROM.SGN, RND: ROM.RND,
      LEN: ROM.LEN, VAL: ROM.VAL, ASC: ROM.ASC,
    };
    return known[upper] ?? '&H0000';
  }

  // -------------------------------------------------------------------------
  // Array access — compute byte offset from indices, load element
  // -------------------------------------------------------------------------

  private emitArrayAccess(name: string, isString: boolean, indices: Expression[]): void {
    const elementSize = isString ? 256 : 9;
    const arrayKey = name + (isString ? '$' : '');
    const arrayLabel = `ARR_${name.toUpperCase()}${isString ? '_S' : ''}`;

    this.code.push({ comment: `array access ${name}(${indices.length} dims)` });

    // Evaluate first index into accumulator, then multiply by element size
    // For simplicity, only handle 1-D arrays fully; multi-dim emits stubs
    if (indices.length >= 1) {
      this.emitExpression(indices[0]);
      // Multiply index by element size to get byte offset
      this.emitNumberLiteral(elementSize);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push element size[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push element size[8]' });
      // (index already evaluated above; for full impl we'd swap and call FP_MUL here)
      this.code.push({ comment: `TODO: multiply index by ${elementSize} for array offset` });
    }

    // Load element from array base + offset
    this.code.push({
      mnemonic: 'ldw',
      operands: `$10,${arrayLabel}`,
      comment: `base address of ${name}`,
    });

    // Register array if not already known (use a fallback size)
    if (!this.arrays.has(arrayKey)) {
      // Assume size 10 if not DIM'd explicitly
      const fallbackElements = 11; // 0..10
      this.arrays.set(arrayKey, {
        label: arrayLabel,
        totalBytes: fallbackElements * elementSize,
      });
    }
  }

  // -------------------------------------------------------------------------
  // ROM call helper
  // -------------------------------------------------------------------------

  private emitRomCall(addr: string, comment?: string): void {
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${addr}`,
      comment,
    });
    this.code.push({
      mnemonic: 'cal',
      operands: 'ROM_CALL',
    });
  }

  // FP-safe ROM call -- for routines that take their right-hand operand in
  // $0-$8 (FP_ADD/SUB/MUL/DIV and the comparison subtract). The normal
  // ROM_CALL path would destroy that operand: `ldw $2,<addr>` overwrites
  // $2-$3 and the wrapper's own `ldw $0,&H5323` overwrites $0-$1.
  //
  // Register choice: $19/$20 hold the ROM target address and $28/$29 the
  // BIOS2 return context. $19-$27 are dead by the time the operands have
  // been shuffled into place, and $28/$29 are unused elsewhere. Note that
  // $30/$31 must NOT be used: the ROM keeps global constants there
  // ($30 = 1, $31 = 0, with SX -> $31 and SY -> $30), and the FP routines
  // themselves read them via `$sx`/`$sy`.
  private emitRomCallFp(addr: string, comment?: string): void {
    this.code.push({
      mnemonic: 'ldw',
      operands: `$19,${addr}`,
      comment,
    });
    this.code.push({
      mnemonic: 'cal',
      operands: 'ROM_CALL_FP',
    });
  }

  private emitRomCallWrapper(): void {
    this.code.push({
      label: 'ROM_CALL',
      mnemonic: 'ldw',
      operands: '$0,&H5323',
      comment: 'BIOS2 return context',
    });
    this.code.push({
      mnemonic: 'phsw',
      operands: '$1',
      comment: 'push return address',
    });
    this.code.push({
      mnemonic: 'pst',
      operands: 'UA,&H54',
      comment: 'bank switch to Bank0',
    });
    this.code.push({
      mnemonic: 'jp',
      operands: '$2',
      comment: 'jump to ROM routine',
    });

    // FP-safe mirror of the wrapper above -- identical sequence, but built
    // from $28/$29 (unused) and $19/$20 (dead once the operands are staged)
    // so the $0-$8 operand window survives the call.
    this.code.push({
      label: 'ROM_CALL_FP',
      mnemonic: 'ldw',
      operands: '$28,&H5323',
      comment: 'BIOS2 return context (FP-safe: avoids $0-$8)',
    });
    this.code.push({
      mnemonic: 'phsw',
      operands: '$29',
      comment: 'push return address',
    });
    this.code.push({
      mnemonic: 'pst',
      operands: 'UA,&H54',
      comment: 'bank switch to Bank0',
    });
    this.code.push({
      mnemonic: 'jp',
      operands: '$19',
      comment: 'jump to ROM routine',
    });
  }

  // -------------------------------------------------------------------------
  // PRINT — evaluate each item, call ROM PRINT handler
  // -------------------------------------------------------------------------

  private emitPrint(stmt: PrintStatement): void {
    let trailingSep = false;

    for (const item of stmt.items) {
      if (item.type === 'expr') {
        if (item.value.type === 'string') {
          // String literal: emit character-by-character loop calling OUTCH (&H2AF1)
          const strInfo = this.allocString(item.value.value);
          this.emitPrintStringLoop(strInfo.label, item.value.value);
        } else {
          // Evaluate expression into FP accumulator
          this.emitExpression(item.value);
          // Call PRINT ROM handler (&H3EF1) for numeric values
          this.emitRomCall(ROM.PRINT, 'PRINT value');
        }
        trailingSep = false;
      } else if (item.type === 'separator') {
        trailingSep = true;
        if (item.kind === ',') {
          // Comma: advance to next tab zone
          this.code.push({ comment: 'PRINT comma — tab zone' });
        }
        // Semicolon: no space, no action needed
      } else if (item.type === 'tab') {
        this.emitExpression(item.col);
        this.code.push({ comment: 'PRINT TAB(...)' });
      }
    }

    // Output CR-LF unless there's a trailing separator
    if (!trailingSep) {
      this.emitRomCall(ROM.OUTCR, 'OUTCR');
    }
  }

  // Emit a pause-at-end sequence: newline, "[EXE]" prompt, wait for keypress.
  // Called before the program's final rtn so the user can read the output
  // before BASIC redraws its prompt and clears the LCD.
  private emitPauseAtEnd(): void {
    this.code.push({ comment: 'pause before return' });
    // Print "[EXE]" prompt on the current line (PRINT already emitted OUTCR)
    const promptInfo = this.allocString('[EXE]');
    this.emitPrintStringLoop(promptInfo.label, '[EXE]');
    // Wait for any key
    this.emitRomCall(ROM.KYIN, 'wait for key');
    // Switch UA to Bank 0 so the subsequent rtn lands at MODE110's return
    // dispatcher at Bank0:&H5313 (CosmicV4 exit pattern).
    this.code.push({ mnemonic: 'pst', operands: 'ua,&H54', comment: 'return to BASIC (Bank 0)' });
  }

  // Emit a character loop that prints a NUL-terminated string.
  // Uses ROM OUTCH (&H2AF1) which expects the character in $16.
  // Pattern:
  //   ldw $2,LABEL        ; load string address
  //   pre ix,$2           ; IX = address
  //   psr sx,0            ; SX = 0
  //   L_loop: ldi $16,(ix+$sx)  ; load byte, auto-increment IX
  //           an  $16,$16       ; test zero (sets Z flag)
  //           jr  z,L_done
  //           ldw $2,&H2AF1     ; OUTCH ROM address
  //           cal ROM_CALL
  //           jr  L_loop
  //   L_done:
  private emitPrintStringLoop(strLabel: string, text: string): void {
    const n = this.labelIndex++;
    const loop = `L_PRS${n}`;
    const done = `L_PRSD${n}`;

    this.code.push({ comment: `PRINT string: "${text}"` });
    this.code.push({ mnemonic: 'ldw', operands: `$2,${strLabel}` });
    this.code.push({ mnemonic: 'pre', operands: 'ix,$2' });
    // Use immediate-offset ldi: ldi $16,(ix+0) loads byte at IX and auto-increments IX
    this.code.push({ label: loop, mnemonic: 'ldi', operands: '$16,(ix+&H00)' });
    this.code.push({ mnemonic: 'an', operands: '$16,$16' });
    this.code.push({ mnemonic: 'jr', operands: `z,${done}` });
    // Save IX to stack via $4,$5 scratch pair (ROM routines clobber IX)
    this.code.push({ mnemonic: 'gre', operands: 'ix,$4', comment: 'save IX -> $4,$5' });
    this.code.push({ mnemonic: 'phsw', operands: '$5', comment: 'push word $4,$5' });
    this.code.push({ mnemonic: 'ldw', operands: `$2,${ROM.OUTCH}`, comment: 'OUTCH' });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
    this.code.push({ mnemonic: 'ppsw', operands: '$4', comment: 'pop word into $4,$5' });
    this.code.push({ mnemonic: 'pre', operands: 'ix,$4', comment: 'restore IX' });
    this.code.push({ mnemonic: 'jr', operands: loop });
    this.code.push({ label: done });
  }

  // -------------------------------------------------------------------------
  // LET — evaluate expression, store to variable
  // -------------------------------------------------------------------------

  private emitLet(stmt: LetStatement): void {
    const varInfo = this.allocVariable(stmt.variable);

    this.code.push({
      comment: `LET ${stmt.variable.name} = ...`,
    });

    // Evaluate expression → result in FP accumulator
    this.emitExpression(stmt.expr);

    // Store accumulator to variable
    this.emitVariableStore(stmt.variable);

    // Always ensure variable is allocated (side effect of allocVariable above)
    void varInfo;
  }

  // -------------------------------------------------------------------------
  // INPUT — call INPUT ROM routine, store to variable(s)
  // -------------------------------------------------------------------------

  private emitInput(stmt: InputStatement): void {
    // Display prompt if present
    if (stmt.prompt) {
      const strInfo = this.allocString(stmt.prompt);
      this.code.push({
        mnemonic: 'ldw',
        operands: `$10,${strInfo.label}`,
        comment: `INPUT prompt: "${stmt.prompt}"`,
      });
      this.emitRomCall(ROM.PRINT, 'display prompt');
    }

    // Call INPUT for each variable
    for (const varRef of stmt.variables) {
      this.allocVariable(varRef);

      this.emitRomCall(ROM.INPUT, `INPUT ${varRef.name}`);

      // Store result to variable
      this.emitVariableStore(varRef);
    }
  }

  // -------------------------------------------------------------------------
  // FOR/NEXT — loop structure
  // -------------------------------------------------------------------------

  private emitFor(stmt: ForStatement): void {
    const varName = stmt.variable.name;
    const topLabel = this.uniqueLabel(`FOR_${varName}`);
    const endLabel = this.uniqueLabel(`ENDFOR_${varName}`);

    // Store initial value
    this.code.push({ comment: `FOR ${varName}` });
    this.emitExpression(stmt.from);
    this.emitVariableStore(stmt.variable);

    // Allocate temp variable for limit
    const limitRef: VarRef = { name: `_FOR_LIMIT_${varName}`, isString: false };
    this.emitExpression(stmt.to);
    this.emitVariableStore(limitRef);

    // Allocate temp variable for step
    const stepRef: VarRef = { name: `_FOR_STEP_${varName}`, isString: false };
    if (stmt.step) {
      this.emitExpression(stmt.step);
    } else {
      this.emitNumberLiteral(1);
    }
    this.emitVariableStore(stepRef);

    // Loop top label
    this.code.push({ label: topLabel, comment: `FOR ${varName} loop top` });

    // Push loop info for matching NEXT
    this.forStack.push({ varName, topLabel, endLabel });
  }

  private emitNext(stmt: NextStatement): void {
    // Match to innermost FOR (or specific variable)
    const varNames = stmt.variables.length > 0
      ? stmt.variables.map(v => v.name)
      : [this.forStack.length > 0 ? this.forStack[this.forStack.length - 1].varName : '?'];

    for (const varName of varNames) {
      const loopIdx = this.findForLoop(varName);
      if (loopIdx < 0) {
        this.code.push({ comment: `ERROR: NEXT ${varName} without FOR` });
        continue;
      }

      const loop = this.forStack[loopIdx];
      const loopVar: VarRef = { name: varName, isString: false };
      const stepRef: VarRef = { name: `_FOR_STEP_${varName}`, isString: false };
      const limitRef: VarRef = { name: `_FOR_LIMIT_${varName}`, isString: false };

      // Increment: counter = counter + step
      this.code.push({ comment: `NEXT ${varName}` });
      this.emitVariableLoad(loopVar);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push counter[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push counter[8]' });
      this.emitVariableLoad(stepRef);
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop counter[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop counter[0..7] → $19-$26' });
      // Swap so left=counter in acc, right=step in temp
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push step[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push step[8]' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'acc[0..7] = counter' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'acc[8] = counter[8]' });
      this.code.push({ mnemonic: 'pps',  operands: '$27',       comment: 'pop step[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8',     comment: 'pop step[0..7] → $19-$26' });
      this.emitRomCall(ROM.FP_ADD, 'counter + step');
      this.emitVariableStore(loopVar);

      // Compare: counter - limit
      this.emitVariableLoad(loopVar);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push counter[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push counter[8]' });
      this.emitVariableLoad(limitRef);
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop counter[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop counter[0..7] → $19-$26' });
      // Swap so left=counter in acc, right=limit in temp
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push limit[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push limit[8]' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'acc[0..7] = counter' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'acc[8] = counter[8]' });
      this.code.push({ mnemonic: 'pps',  operands: '$27',       comment: 'pop limit[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8',     comment: 'pop limit[0..7] → $19-$26' });
      this.emitRomCall(ROM.FP_SUB, 'counter - limit');

      // If counter <= limit, loop back (jump if not positive)
      this.code.push({
        mnemonic: 'jr',
        operands: `nz,${loop.topLabel}`,
        comment: 'loop if counter <= limit',
      });

      // End label
      this.code.push({ label: loop.endLabel, comment: `ENDFOR ${varName}` });

      // Remove from stack
      this.forStack.splice(loopIdx, 1);
    }
  }

  private findForLoop(varName: string): number {
    // Search from top of stack
    for (let i = this.forStack.length - 1; i >= 0; i--) {
      if (this.forStack[i].varName === varName) return i;
    }
    // If no specific match, pop the top
    return this.forStack.length > 0 ? this.forStack.length - 1 : -1;
  }

  // -------------------------------------------------------------------------
  // IF/THEN/ELSE — conditional branching
  // -------------------------------------------------------------------------

  private emitIf(stmt: IfStatement): void {
    const elseLabel = this.uniqueLabel('ELSE');
    const endIfLabel = this.uniqueLabel('ENDIF');

    // Evaluate condition
    this.emitCondition(stmt.condition);

    if (stmt.elseBranch && stmt.elseBranch.length > 0) {
      // Conditional jump to ELSE block
      this.code.push({
        mnemonic: 'jr',
        operands: `z,${elseLabel}`,
        comment: 'IF false, jump to ELSE',
      });

      // THEN block
      for (const s of stmt.thenBranch) {
        this.emitStatement(s);
      }
      this.code.push({ mnemonic: 'jr', operands: endIfLabel, comment: 'skip ELSE' });

      // ELSE block
      this.code.push({ label: elseLabel });
      for (const s of stmt.elseBranch) {
        this.emitStatement(s);
      }
      this.code.push({ label: endIfLabel });
    } else {
      // No ELSE — jump over THEN block if condition false
      this.code.push({
        mnemonic: 'jr',
        operands: `z,${endIfLabel}`,
        comment: 'IF false, skip THEN',
      });

      // THEN block
      for (const s of stmt.thenBranch) {
        this.emitStatement(s);
      }
      this.code.push({ label: endIfLabel });
    }
  }

  private emitCondition(expr: Expression): void {
    if (expr.type === 'binary' && this.isComparisonOp(expr.op)) {
      // Evaluate as subtraction: left - right, then test flags
      this.emitExpression(expr.left);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push left[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push left[8]' });
      this.emitExpression(expr.right);
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop left[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop left[0..7] → $19-$26' });
      // Swap so left=acc, right=temp, then subtract
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push right[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push right[8]' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'acc[0..7] = left' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'acc[8] = left[8]' });
      this.code.push({ mnemonic: 'pps',  operands: '$27',       comment: 'pop right[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8',     comment: 'pop right[0..7] → $19-$26' });
      this.emitRomCall(ROM.FP_SUB, `compare: ${expr.op}`);
      // Flags are now set based on left - right
    } else {
      // Non-comparison condition: evaluate and test for zero
      this.emitExpression(expr);
    }
  }

  // -------------------------------------------------------------------------
  // ON GOTO / ON GOSUB — jump table based on expression value
  // -------------------------------------------------------------------------

  private emitOnBranch(stmt: OnBranchStatement): void {
    const skipLabel = this.uniqueLabel('ON_END');
    this.code.push({ comment: `ON ... ${stmt.kind.toUpperCase()} ${stmt.targets.map(t => t.line).join(',')}` });

    // Evaluate the selector expression into accumulator
    this.emitExpression(stmt.expr);

    // For each target: compare accumulator with index 1,2,3...
    // We save the evaluated selector to a temp variable and compare sequentially
    const selectorRef: VarRef = { name: `_ON_SEL_${this.labelIndex}`, isString: false };
    this.emitVariableStore(selectorRef);

    for (let i = 0; i < stmt.targets.length; i++) {
      const targetLine = stmt.targets[i].line;
      const compareLabel = this.uniqueLabel('ON_CMP');

      // Load selector
      this.emitVariableLoad(selectorRef);
      // Push selector
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: `push selector[0..7]` });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push selector[8]' });
      // Load comparison value (i+1)
      this.emitNumberLiteral(i + 1);
      // Pop selector to temp
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop selector[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop selector[0..7] → $19-$26' });
      // Swap so acc=selector, temp=(i+1), then subtract
      this.code.push({ mnemonic: 'phsm', operands: '$17,8',     comment: 'push (i+1)[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',        comment: 'push (i+1)[8]' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8',  comment: 'acc[0..7] = selector' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',    comment: 'acc[8] = selector[8]' });
      this.code.push({ mnemonic: 'pps',  operands: '$27',        comment: 'pop (i+1)[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8',      comment: 'pop (i+1)[0..7] → $19-$26' });
      this.emitRomCall(ROM.FP_SUB, `selector - ${i + 1}`);

      // Jump to target if zero (selector == i+1)
      if (stmt.kind === 'goto') {
        this.code.push({ mnemonic: 'jr', operands: `z,L${targetLine}`, comment: `ON GOTO ${targetLine}` });
      } else {
        // ON GOSUB: jump to a small trampoline that calls and falls through
        this.code.push({ label: compareLabel });
        this.code.push({ mnemonic: 'jr', operands: `nz,${skipLabel}` });
        this.code.push({ mnemonic: 'cal', operands: `L${targetLine}`, comment: `ON GOSUB ${targetLine}` });
        this.code.push({ mnemonic: 'jp', operands: skipLabel });
      }
    }

    this.code.push({ label: skipLabel, comment: 'ON branch end' });
  }

  // -------------------------------------------------------------------------
  // DIM — allocate array storage
  // -------------------------------------------------------------------------

  private emitDim(stmt: DimStatement): void {
    for (const decl of stmt.decls) {
      this.allocArray(decl);
    }
  }

  private allocArray(decl: ArrayDecl): void {
    const key = decl.name + (decl.isString ? '$' : '');
    if (this.arrays.has(key)) return; // already DIM'd

    const isString = decl.isString;
    const elementSize = isString ? 256 : 9;
    const label = `ARR_${decl.name.toUpperCase()}${isString ? '_S' : ''}`;

    // Calculate total elements as product of (dim_i + 1) for each dimension
    // For static dimensions (number literals) we can compute at codegen time.
    // For dynamic dimensions we fall back to emitting a comment and using a
    // placeholder size of 1 — the real allocator would need runtime computation.
    let totalElements = 1;
    let allStatic = true;
    for (const dimExpr of decl.dimensions) {
      if (dimExpr.type === 'number') {
        totalElements *= (dimExpr.value + 1);
      } else if (dimExpr.type === 'hex-literal') {
        totalElements *= (dimExpr.value + 1);
      } else {
        allStatic = false;
        break;
      }
    }

    const totalBytes = allStatic ? totalElements * elementSize : elementSize; // fallback 1 element
    this.arrays.set(key, { label, totalBytes });

    this.code.push({
      comment: `DIM ${decl.name}${isString ? '$' : ''}(${decl.dimensions.length} dims) — ${totalBytes} bytes`,
    });
  }

  // -------------------------------------------------------------------------
  // READ — load next DATA value into variable(s)
  // -------------------------------------------------------------------------

  private emitRead(stmt: ReadStatement): void {
    for (const varRef of stmt.variables) {
      this.allocVariable(varRef);
      this.code.push({ comment: `READ ${varRef.name}` });

      // Load DATA_PTR value via IX
      this.code.push({ mnemonic: 'ldw', operands: '$2,DATA_PTR', comment: 'DATA_PTR address' });
      this.code.push({ mnemonic: 'pre', operands: 'ix,$2' });
      this.code.push({ mnemonic: 'psr', operands: 'sx,0' });
      this.code.push({ mnemonic: 'ldd', operands: '$10,(ix+$sx)', comment: 'load current DATA value via IX' });
      // Store into variable
      this.emitVariableStore(varRef);
      // Advance DATA_PTR by 9 (one FP value)
      this.code.push({ comment: 'TODO: advance DATA_PTR by 9 bytes' });
    }
  }

  // -------------------------------------------------------------------------
  // RESTORE — reset DATA pointer
  // -------------------------------------------------------------------------

  private emitRestore(stmt: RestoreStatement): void {
    if (stmt.target !== undefined) {
      this.code.push({
        comment: `RESTORE ${stmt.target} — TODO: DATA_PTR = address of DATA at line ${stmt.target}`,
      });
    } else {
      this.code.push({ comment: 'RESTORE — reset DATA_PTR to DATA_TABLE' });
      this.code.push({
        mnemonic: 'ldw',
        operands: '$10,DATA_TABLE',
        comment: 'address of DATA_TABLE',
      });
      // Store 2-byte pointer to DATA_PTR via IX
      this.emitVarStoreN('DATA_PTR', 2, 'DATA_PTR = DATA_TABLE');
    }
  }

  // -------------------------------------------------------------------------
  // WHILE/WEND — loop structure
  // -------------------------------------------------------------------------

  private emitWhile(stmt: WhileStatement): void {
    const topLabel = this.uniqueLabel('WHILE');
    const endLabel = this.uniqueLabel('WEND');

    this.code.push({ label: topLabel, comment: 'WHILE loop top' });

    // Evaluate condition
    this.emitCondition(stmt.condition);

    // Jump to after WEND if condition is false (zero flag set = false/zero result)
    this.code.push({
      mnemonic: 'jr',
      operands: `z,${endLabel}`,
      comment: 'WHILE false, exit loop',
    });

    // Push loop info for matching WEND
    this.whileStack.push({ topLabel, endLabel });
  }

  private emitWend(): void {
    if (this.whileStack.length === 0) {
      this.code.push({ comment: 'ERROR: WEND without WHILE' });
      return;
    }

    const loop = this.whileStack.pop()!;

    // Unconditional jump back to loop top
    this.code.push({
      mnemonic: 'jp',
      operands: loop.topLabel,
      comment: 'WEND — loop back',
    });

    // End label (jumped to when condition false)
    this.code.push({ label: loop.endLabel, comment: 'WEND end' });
  }

  // -------------------------------------------------------------------------
  // LOCATE — set cursor position
  // -------------------------------------------------------------------------

  private emitLocate(stmt: LocateStatement): void {
    this.code.push({ comment: 'LOCATE col,row' });
    // Evaluate col into accumulator
    this.emitExpression(stmt.col);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push col[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push col[8]' });
    // Evaluate row if present
    if (stmt.row) {
      this.emitExpression(stmt.row);
    } else {
      this.emitNumberLiteral(0);
    }
    // Call ROM locate routine (address TODO)
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.LOCATE}`,
      comment: 'TODO: ROM address for LOCATE',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  // -------------------------------------------------------------------------
  // ANGLE — set trigonometric angle mode
  // -------------------------------------------------------------------------

  private emitAngle(stmt: AngleStatement): void {
    this.code.push({ comment: 'ANGLE mode' });
    this.emitExpression(stmt.mode);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.ANGLE}`,
      comment: 'TODO: ROM address for ANGLE',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  // -------------------------------------------------------------------------
  // POKE — write byte to memory address
  // -------------------------------------------------------------------------

  private emitPoke(stmt: PokeStatement): void {
    this.code.push({ comment: 'POKE address, value' });
    // Evaluate address
    this.emitExpression(stmt.address);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push address[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push address[8]' });
    // Evaluate value
    this.emitExpression(stmt.value);
    // Pop address to $19
    this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop address[8] → $27' });
    this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop address[0..7] → $19-$26' });
    // $10 = value (low byte), $19 = address
    // For a simple byte write: load address into IZ, store value byte
    this.code.push({ comment: 'TODO: store byte $10 to address in $19 (POKE)' });
    // Simplified: use std instruction for byte store
    this.code.push({ mnemonic: 'ldw', operands: '$2,$19', comment: 'address from poped value' });
    this.code.push({ mnemonic: 'std', operands: '$10,($2)', comment: 'POKE — store byte' });
  }

  // -------------------------------------------------------------------------
  // DEFSEG — set current memory segment for POKE/PEEK
  // -------------------------------------------------------------------------

  private emitDefseg(stmt: DefsegStatement): void {
    this.code.push({ comment: 'DEFSEG segment' });
    this.emitExpression(stmt.segment);
    // Store segment value in UA register area
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push segment value[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push segment value[8]' });
    this.code.push({ comment: 'TODO: set segment register from expression result (DEFSEG)' });
  }

  // -------------------------------------------------------------------------
  // ON ERROR GOTO — set error handler
  // -------------------------------------------------------------------------

  private emitOnErrorGoto(stmt: OnErrorGotoStatement): void {
    this.code.push({ comment: `ON ERROR GOTO ${stmt.target}` });
    // Store error handler address — simplified: use a fixed memory location
    this.code.push({
      mnemonic: 'ldw',
      operands: `$10,L${stmt.target}`,
      comment: `error handler address = L${stmt.target}`,
    });
    // Store 2-byte error handler address via IX
    this.emitVarStoreN('ERR_HANDLER', 2, 'save error handler address');
    // Allocate error handler pointer variable
    if (!this.variables.has('__ERR_HANDLER')) {
      this.variables.set('__ERR_HANDLER', {
        label: 'ERR_HANDLER',
        type: 'numeric',
        size: 2,
      });
    }
  }

  // -------------------------------------------------------------------------
  // RESUME — return from error handler
  // -------------------------------------------------------------------------

  private emitResume(stmt: ResumeStatement): void {
    if (stmt.target === 'next') {
      this.code.push({ comment: 'RESUME NEXT — continue at next statement after error' });
      // TODO: advance program counter past the faulting statement
      this.code.push({ mnemonic: 'rtn', comment: 'RESUME NEXT (simplified: return)' });
    } else if (typeof stmt.target === 'number') {
      this.code.push({ comment: `RESUME ${stmt.target} — jump to line ${stmt.target}` });
      this.code.push({ mnemonic: 'jp', operands: `L${stmt.target}`, comment: 'RESUME to target line' });
    } else {
      // RESUME with no target: retry the faulting statement
      this.code.push({ comment: 'RESUME — retry faulting statement (TODO: restore saved PC)' });
      this.code.push({ mnemonic: 'rtn', comment: 'RESUME (simplified: return)' });
    }
  }

  // -------------------------------------------------------------------------
  // DEF FN — store function definition for FN calls
  // -------------------------------------------------------------------------

  private emitDefFn(stmt: DefFnStatement): void {
    // Store the function definition for later FN calls
    this.fnDefs.set(stmt.name, { params: stmt.params, body: stmt.body });
    this.code.push({ comment: `DEF FN${stmt.name}(${stmt.params.join(',')}) — stored for FN calls` });

    // Emit the function as a callable subroutine
    const fnLabel = `FN_${stmt.name.toUpperCase()}`;
    this.code.push({ label: fnLabel, comment: `FN ${stmt.name} body` });
    // Evaluate body expression (parameters are passed by convention in variables)
    this.emitExpression(stmt.body);
    this.code.push({ mnemonic: 'rtn', comment: `return from FN ${stmt.name}` });
  }

  // -------------------------------------------------------------------------
  // File I/O — stub ROM calls
  // -------------------------------------------------------------------------

  private emitOpen(stmt: OpenStatement): void {
    this.code.push({ comment: 'OPEN filename, mode, filenum — stub' });
    this.emitExpression(stmt.filenum);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push filenum[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push filenum[8]' });
    this.emitExpression(stmt.mode);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push mode[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push mode[8]' });
    this.emitExpression(stmt.filename);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.FILE_OPEN}`,
      comment: 'TODO: ROM address for OPEN',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  private emitClose(stmt: CloseStatement): void {
    this.code.push({ comment: 'CLOSE filenum — stub' });
    if (stmt.filenum) {
      this.emitExpression(stmt.filenum);
    } else {
      this.emitNumberLiteral(0); // close all
    }
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.FILE_CLOSE}`,
      comment: 'TODO: ROM address for CLOSE',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  private emitPrintFile(stmt: PrintFileStatement): void {
    this.code.push({ comment: 'PRINT# filenum, ... — stub' });
    this.emitExpression(stmt.filenum);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push filenum[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push filenum[8]' });
    // Print each item
    for (const item of stmt.items) {
      if (item.type === 'expr') {
        this.emitExpression(item.value);
        this.code.push({
          mnemonic: 'ldw',
          operands: `$2,${ROM.FILE_PRINT}`,
          comment: 'TODO: ROM address for PRINT#',
        });
        this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
      }
    }
  }

  private emitInputFile(stmt: InputFileStatement): void {
    this.code.push({ comment: 'INPUT# filenum, vars — stub' });
    this.emitExpression(stmt.filenum);
    for (const varRef of stmt.variables) {
      this.allocVariable(varRef);
      this.code.push({
        mnemonic: 'ldw',
        operands: `$2,${ROM.FILE_INPUT}`,
        comment: 'TODO: ROM address for INPUT#',
      });
      this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
      this.emitVariableStore(varRef);
    }
  }

  private emitLineInputFile(stmt: LineInputFileStatement): void {
    this.code.push({ comment: 'LINE INPUT# filenum, var — stub' });
    this.emitExpression(stmt.filenum);
    this.allocVariable(stmt.variable);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.FILE_INPUT}`,
      comment: 'TODO: ROM address for LINE INPUT#',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
    this.emitVariableStore(stmt.variable);
  }

  private emitWriteFile(stmt: WriteFileStatement): void {
    this.code.push({ comment: 'WRITE# filenum, items — stub' });
    this.emitExpression(stmt.filenum);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push filenum[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push filenum[8]' });
    for (const item of stmt.items) {
      this.emitExpression(item);
      this.code.push({
        mnemonic: 'ldw',
        operands: `$2,${ROM.FILE_WRITE}`,
        comment: 'TODO: ROM address for WRITE#',
      });
      this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
    }
  }

  // -------------------------------------------------------------------------
  // STAT / STAT CLEAR — statistical operations
  // -------------------------------------------------------------------------

  private emitStat(stmt: StatStatement): void {
    this.code.push({ comment: 'STAT data — stub' });
    for (const dataExpr of stmt.data) {
      this.emitExpression(dataExpr);
      this.code.push({
        mnemonic: 'ldw',
        operands: `$2,${ROM.STAT_ADD}`,
        comment: 'TODO: ROM address for STAT data entry',
      });
      this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
    }
  }

  private emitStatClear(): void {
    this.code.push({ comment: 'STAT CLEAR — stub' });
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.STAT_CLEAR}`,
      comment: 'TODO: ROM address for STAT CLEAR',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  // -------------------------------------------------------------------------
  // DEFCHR$ — custom character definition
  // -------------------------------------------------------------------------

  private emitDefchr(stmt: DefchrStatement): void {
    this.code.push({ comment: 'DEFCHR$ code, pattern — stub' });
    this.emitExpression(stmt.code);
    this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push char code[0..7]' });
    this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push char code[8]' });
    this.emitExpression(stmt.pattern);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.DEFCHR}`,
      comment: 'TODO: ROM address for DEFCHR$',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  // -------------------------------------------------------------------------
  // CHAIN — load another program
  // -------------------------------------------------------------------------

  private emitChain(stmt: ChainStatement): void {
    this.code.push({ comment: 'CHAIN filename — stub' });
    this.emitExpression(stmt.filename);
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.CHAIN}`,
      comment: 'TODO: ROM address for CHAIN',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  // -------------------------------------------------------------------------
  // MODE — set display/calculator mode
  // -------------------------------------------------------------------------

  private emitMode(stmt: ModeStatement): void {
    this.code.push({ comment: 'MODE n — stub' });
    this.emitExpression(stmt.number);
    if (stmt.args) {
      for (const arg of stmt.args) {
        this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push MODE arg[0..7]' });
        this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push MODE arg[8]' });
        this.emitExpression(arg);
      }
    }
    this.code.push({
      mnemonic: 'ldw',
      operands: `$2,${ROM.MODE}`,
      comment: 'TODO: ROM address for MODE',
    });
    this.code.push({ mnemonic: 'cal', operands: 'ROM_CALL' });
  }

  // -------------------------------------------------------------------------
  // Variable allocation
  // -------------------------------------------------------------------------

  private allocVariable(ref: VarRef): VarInfo {
    const key = ref.name + (ref.isString ? '$' : '');
    if (!this.variables.has(key)) {
      const isString = ref.isString;
      const label = `VAR_${ref.name.toUpperCase()}${isString ? '_S' : ''}`;
      const info: VarInfo = {
        label,
        type: isString ? 'string' : 'numeric',
        size: isString ? 256 : 9,
      };
      this.variables.set(key, info);
    }
    return this.variables.get(key)!;
  }

  // -------------------------------------------------------------------------
  // String literal allocation
  // -------------------------------------------------------------------------

  private allocString(value: string): StringInfo {
    // Check if we already have this exact string
    const existing = this.strings.find(s => s.value === value);
    if (existing) return existing;

    this.stringIndex++;
    const label = `STR_${String(this.stringIndex).padStart(3, '0')}`;
    const info: StringInfo = { label, value };
    this.strings.push(info);
    return info;
  }

  private encodeStringOperand(value: string): string {
    // Encode as quoted string with null terminator
    return `"${value}",0`;
  }

  // -------------------------------------------------------------------------
  // Source reconstruction (for annotations)
  // -------------------------------------------------------------------------

  private reconstructSource(lineNum: number, stmts: Statement[]): string {
    const parts: string[] = [`${lineNum}`];
    for (const stmt of stmts) {
      parts.push(this.stmtToSource(stmt));
    }
    return parts.join(' ');
  }

  private stmtToSource(stmt: Statement): string {
    switch (stmt.type) {
      case 'cls': return 'CLS';
      case 'beep': return 'BEEP';
      case 'end': return stmt.kind.toUpperCase();
      case 'goto': return `GOTO ${stmt.target}`;
      case 'gosub': return `GOSUB ${stmt.target}`;
      case 'return': return 'RETURN';
      case 'rem': return `REM ${stmt.text}`;
      case 'print': return 'PRINT ...';
      case 'let': return `${stmt.variable.name}=${this.exprToSource(stmt.expr)}`;
      case 'for': return `FOR ${stmt.variable.name}=${this.exprToSource(stmt.from)} TO ${this.exprToSource(stmt.to)}`;
      case 'next': return `NEXT ${stmt.variables.map(v => v.name).join(',')}`;
      case 'if': return 'IF ...';
      case 'input': return `INPUT ${stmt.variables.map(v => v.name).join(',')}`;
      case 'on-branch': return `ON ${this.exprToSource(stmt.expr)} ${stmt.kind.toUpperCase()} ${stmt.targets.map((t: { line: number }) => t.line).join(',')}`;
      case 'dim': return `DIM ${stmt.decls.map((d: ArrayDecl) => `${d.name}(${d.dimensions.length})`).join(',')}`;
      case 'read': return `READ ${stmt.variables.map((v: VarRef) => v.name).join(',')}`;
      case 'data': return `DATA ${stmt.values.map((v: { type: string; value: unknown }) => v.type === 'string' ? `"${v.value}"` : String(v.value)).join(',')}`;
      case 'restore': return stmt.target !== undefined ? `RESTORE ${stmt.target}` : 'RESTORE';
      case 'while': return `WHILE ${this.exprToSource(stmt.condition)}`;
      case 'wend': return 'WEND';
      case 'locate': return `LOCATE ${this.exprToSource(stmt.col)}`;
      case 'angle': return `ANGLE ${this.exprToSource(stmt.mode)}`;
      case 'poke': return `POKE ${this.exprToSource(stmt.address)},${this.exprToSource(stmt.value)}`;
      case 'defseg': return `DEFSEG ${this.exprToSource(stmt.segment)}`;
      case 'on-error-goto': return `ON ERROR GOTO ${stmt.target}`;
      case 'resume': return stmt.target !== undefined ? `RESUME ${stmt.target}` : 'RESUME';
      case 'erase': return `ERASE ${stmt.names.join(',')}`;
      case 'clear': return 'CLEAR';
      case 'defm': return `DEFM ${this.exprToSource(stmt.size)}`;
      case 'def-fn': return `DEF FN${stmt.name}(${stmt.params.join(',')})`;
      case 'open': return 'OPEN ...';
      case 'close': return 'CLOSE';
      case 'print-file': return 'PRINT# ...';
      case 'input-file': return 'INPUT# ...';
      case 'line-input-file': return 'LINE INPUT# ...';
      case 'write-file': return 'WRITE# ...';
      case 'stat': return 'STAT ...';
      case 'stat-clear': return 'STAT CLEAR';
      case 'defchr': return 'DEFCHR$ ...';
      case 'chain': return 'CHAIN ...';
      case 'mode': return `MODE ${this.exprToSource(stmt.number)}`;
      default: return (stmt as Statement).type.toUpperCase();
    }
  }

  private exprToSource(expr: Expression): string {
    switch (expr.type) {
      case 'number': return String(expr.value);
      case 'string': return `"${expr.value}"`;
      case 'variable': return expr.ref.name;
      case 'binary': return `${this.exprToSource(expr.left)}${expr.op}${this.exprToSource(expr.right)}`;
      default: return '...';
    }
  }

  private formatNumber(n: number): string {
    if (Number.isInteger(n) && n >= 0 && n <= 0xFFFF) {
      return `&H${n.toString(16).toUpperCase().padStart(4, '0')}`;
    }
    return String(n);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generate(program: Program): AsmProgram {
  return new CodeGen().generate(program);
}
