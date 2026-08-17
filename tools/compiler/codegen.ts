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
import { numberToBcd9 } from './bcd.js';
import { inferIntegerEligibility } from './type-inference.js';
import { analyzeLoopShadowEligibility } from './loop-shadow-eligibility.js';

// ---------------------------------------------------------------------------
// ROM entry points
// ---------------------------------------------------------------------------

const ROM = {
  FP_ADD:    '&H05DA',
  FP_SUB:    '&H05D4',
  FP_MUL:    '&H0607',
  FP_DIV:    '&H0646',
  MOD:       '&H105F',
  // Numeric output is a two-step ROM sequence, not a single "print a number"
  // entry point. &H3EF1 (used here before) is the BASIC *PRINT statement*
  // handler: it parses BASIC source text from IZ, so calling it from compiled
  // code walks off into the interpreter and ends at &H2B70 (SN Error).
  // The routine pair below is what &H3EF1 itself uses for a numeric item
  // (rom1a.src:3F53-3F66).
  FMT_NUM:   '&H131F',  // format the FP value in $10-$18 -> string; returns $15,$16 = ptr, $17 = length (rom1a.src:131F, ends 143B-1440)
  PRLB1:     '&H97D5',  // display the string of length $17 pointed to by $15,$16 (rom1a.src:97D5)
  // KNOWN BROKEN, same defect class as PRINT's old &H3EF1: &H3DEE is the
  // BASIC INPUT *command* handler (rom1a.src:3DEE, "cal &H5044 ;FC Error if
  // BASIC interpreter not in RUN mode"), not a callable numeric-input
  // routine. Calling it from compiled code will not work. Not yet fixed —
  // no program in this library uses INPUT from compiled code yet. Whoever
  // fixes this should look for the internal routine pair &H3DEE's own
  // command handler calls to actually read a value, the same way &H3EF1's
  // internal &H131F/&H97D5 pair was found for PRINT.
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
// Loop-shadow tracking
// ---------------------------------------------------------------------------

/**
 * The four RAM slots a shadowed FOR loop owns. These are compiler-internal
 * storage, NOT BASIC variables: counter/limit/step are native signed int16
 * (2 bytes each, little-endian) and `active` is a 1-byte runtime flag. They
 * are deliberately kept out of `CodeGen.variables`, whose every entry is a
 * 9-byte BCD value or a 256-byte string buffer.
 *
 * The role is the label SUFFIX, not a prefix, so the naming is injective:
 * with `SHADOW_LIMIT_K` a BASIC variable literally named `LIMIT_K` would
 * collide with loop K's limit slot, whereas `SHADOW_<var>_LIM` cannot collide
 * with `SHADOW_<other var>_<role>` for any other variable name.
 */
interface ShadowSlots {
  counter: string;
  limit: string;
  step: string;
  active: string;
}

// ---------------------------------------------------------------------------
// Code generator state
// ---------------------------------------------------------------------------

class CodeGen {
  private code: AsmLine[] = [];
  private variables = new Map<string, VarInfo>();
  private strings: StringInfo[] = [];
  private stringIndex = 0;
  private numberLiteralIndex = 0;
  private numberLiterals: Array<{ label: string; bytes: Uint8Array }> = [];
  private labelIndex = 0;
  private forStack: ForLoopInfo[] = [];
  private whileStack: Array<{ topLabel: string; endLabel: string }> = [];
  private arrays = new Map<string, { label: string; totalBytes: number }>();
  private fnDefs = new Map<string, { params: string[]; body: Expression }>();
  private currentSegment = 0;
  private integerEligible: Set<string> = new Set();
  /** Per-FOR-statement verdict from the static loop-shadow scan (Task 2). */
  private shadowEligibility: Map<ForStatement, boolean> = new Map();
  /** Allocated shadow slots, keyed by loop-counter variable name. */
  private shadowSlots = new Map<string, ShadowSlots>();
  /** Currently-open shadowed loops, innermost last. */
  private shadowStack: Array<{ varName: string } & ShadowSlots> = [];
  /** BASIC line number currently being emitted (for shadow bookkeeping). */
  private currentLine = 0;
  /** Every loop that actually got shadow slots, in emission order. */
  private shadowedLoopsFound: { varName: string; line: number }[] = [];

  generate(program: Program): AsmProgram {
    this.integerEligible = inferIntegerEligibility(program);
    this.shadowEligibility = analyzeLoopShadowEligibility(program, this.integerEligible);

    // 1. ORG directive
    // Origin 0x1CD0 — Bank1 area that's reachable via BASIC POKE/MODE110,
    // same address used by CosmicV4. BASIC POKE can't reach Bank1 0x0000.
    this.code.push({ mnemonic: 'ORG', operands: '&H1CD0' });

    // 1a. Prologue: disable interrupts for the whole program.
    //
    // This is NOT an optimisation — it is required for correctness, and it is
    // exactly what the ROM itself does when BASIC launches a machine-code
    // routine via MODE110 (rom1a.src:5306 `pst ie,$31`, i.e. IE := 0, with
    // rom1a.src:5318 `pst ie,$0` restoring it on return).
    //
    // Why: every bank switch relies on the HD61700's one-instruction UA
    // pipeline delay. `pst ua,X` does not affect the fetch of the *next*
    // instruction (fetchOpcode in src/emulator/def.ts uses `delayed_ua`), only
    // the one after it. Both our ROM_CALL wrapper (`pst UA,&H54` / `jp $2`)
    // and the ROM's own return trampoline (rom1a.src:5324 `pst ua,&H55` /
    // 5327 `rtn`) depend on that. Taking an interrupt on the shadowed
    // instruction destroys the pipeline state: cpuRun()'s interrupt dispatch
    // does not preserve `delayed_ua`, and fetchOpcode overwrites it with the
    // *new* UA on the very first ISR fetch, so after `rtni` the shadowed
    // instruction is re-fetched from the wrong bank and the CPU executes
    // whatever bytes happen to live at that address in the other bank.
    //
    // Note `pst ie,&H00` also clears any already-latched interrupt requests:
    // r8Write case 5 in src/emulator/exec.ts does `setIb(ib & ((v >> 3) |
    // 0xE0))` and `setIserv(iserv & (v >> 3))`, so nothing can be pending.
    //
    // IE is deliberately NOT restored here: on the real entry path MODE110's
    // own return dispatcher (Bank0:&H5313) restores the caller's IE, and
    // re-enabling it ourselves would have to happen either side of the final
    // `pst ua,&H54` / `rtn` bank switch — i.e. inside the very window this
    // disable exists to protect.
    this.code.push({ comment: 'prologue: disable interrupts (see MODE110, rom1a.src:5306)' });
    this.code.push({ mnemonic: 'pst', operands: 'ie,&H00', comment: 'IE=0: bank-switch pipeline is not interrupt-safe' });

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
      this.currentLine = lineNum;
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

    // 3a. Integer fast-path helpers (BCD <-> int16)
    this.emitIntFastPathWrapper();

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
          const bytes = numberToBcd9(val.value);
          this.code.push({
            mnemonic: 'db',
            operands: Array.from(bytes).map(b => '&H' + b.toString(16).toUpperCase().padStart(2, '0')).join(','),
            comment: `DATA ${val.value}`,
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

    // 5b. Number literals (DB directives, 9-byte BCD)
    if (this.numberLiterals.length > 0) {
      this.code.push({ comment: 'Number literals (9-byte BCD)' });
      for (const num of this.numberLiterals) {
        this.code.push({
          label: num.label,
          mnemonic: 'db',
          operands: Array.from(num.bytes).map(b => '&H' + b.toString(16).toUpperCase().padStart(2, '0')).join(','),
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

    // 7a. Loop-shadow storage (DS directives).
    //
    // Deliberately its own block rather than extra entries in `this.variables`:
    // these are 1- and 2-byte compiler-internal int16/flag slots, never 9-byte
    // BCD, and must never be mistaken for a BASIC variable by anything that
    // assumes every `this.variables` entry is 9 or 256 bytes wide.
    if (this.shadowSlots.size > 0) {
      this.code.push({ comment: 'Loop-shadow storage (int16 counter/limit/step + active flag)' });
      for (const [, slots] of this.shadowSlots) {
        this.code.push({ label: slots.counter, mnemonic: 'DS', operands: '2', comment: 'shadow: counter (int16)' });
        this.code.push({ label: slots.limit,   mnemonic: 'DS', operands: '2', comment: 'shadow: limit (int16)' });
        this.code.push({ label: slots.step,    mnemonic: 'DS', operands: '2', comment: 'shadow: step (int16)' });
        this.code.push({ label: slots.active,  mnemonic: 'DS', operands: '1', comment: 'shadow: active flag (0/1)' });
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
    const bytes = numberToBcd9(value);
    const label = `NUM_${this.numberLiteralIndex++}`;
    this.numberLiterals.push({ label, bytes });
    this.code.push({ comment: `load constant ${value}` });
    this.emitVarLoad9(label);
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
  // Loop-shadow slot access
  //
  // ── Why these exist ──────────────────────────────────────────────────────
  //
  // There is NO direct-absolute memory addressing on this CPU. Every mnemonic
  // that looks like it takes an address (`st_10`/`stw_90`, Kind.REGDIRJR)
  // actually takes the address out of a REGISTER PAIR, and the multi-byte and
  // displacement forms all go through IX/IZ. So `stw $0,SHADOW_K_CNT` is not
  // an encoding this assembler can produce; a shadow slot is reached exactly
  // the way emitVarLoad9/emitVarStore9 reach a variable — load the label as a
  // 16-bit immediate, `pre` it into IX, and use a zero displacement.
  //
  // ── Calling convention (Tasks 4 and 5 depend on this) ────────────────────
  //
  //   emitShadowStore16(label)      in : $0/$1  int16 to store ($0 = low byte)
  //   emitShadowLoad16(label)       out: $0/$1  int16 read from the slot
  //   emitShadowStore8(label, reg)  in : reg    byte to store
  //   emitShadowLoad8(label, reg)   out: reg    byte read from the slot
  //
  //   ALL FOUR clobber $2/$3, IX and SX, and nothing else. $2/$3 is the
  //   address scratch pair: `ldw $r,imm16` is ldw_D1 in src/emulator/exec.ts,
  //
  //       mr[regArg(x)]     = fetchByte();
  //       mr[regArg(x + 1)] = fetchByte();
  //
  //   i.e. it writes the named register AND the next one. A caller must
  //   therefore never park a live value in $3 (nor $2) across one of these,
  //   which is the same reason emitVarStoreN sources its bytes from $10.
  //   `reg` must likewise not be $2 or $3.
  //
  //   `pre ix,$2` (pre_96) only READS $2/$3, and `psr sx,31` (psr_15) only
  //   writes the SX selector, so neither disturbs any general register.
  //
  // The slots live at `ua >> 4` — the IX data segment — which is the same
  // segment stm/ldm reach a 9-byte variable through, so a shadow slot and a
  // BASIC variable are always in the same bank as each other.
  // -------------------------------------------------------------------------

  /** Emit the `ldw`/`pre`/`psr` preamble that points IX at `label`, displacement 0. */
  private emitShadowAddress(label: string, comment?: string): void {
    if (comment) this.code.push({ comment });
    this.code.push({ mnemonic: 'ldw', operands: `$2,${label}`, comment: 'shadow slot address' });
    this.code.push({ mnemonic: 'pre', operands: 'ix,$2',       comment: 'IX = slot address' });
    this.code.push({ mnemonic: 'psr', operands: 'sx,31',       comment: '$sx -> $31 (= 0): displacement 0' });
  }

  /** Store the int16 in $0/$1 into a 2-byte shadow slot. */
  private emitShadowStore16(label: string, comment?: string): void {
    this.emitShadowAddress(label, comment);
    this.code.push({ mnemonic: 'stw', operands: '$0,(ix+$sx)', comment: `${label} <- $0/$1` });
  }

  /**
   * Load a 2-byte shadow slot into $0/$1.
   *
   * No caller inside codegen yet — the shadowed `NEXT` tail (Task 4) and the
   * in-body counter substitution (Task 5) are what read the slots back. Kept
   * here, next to the store it mirrors, for the same reason emitBcdToInt16 and
   * emitInt16ToBcd were: the addressing convention is documented in one place.
   */
  private emitShadowLoad16(label: string, comment?: string): void {
    this.emitShadowAddress(label, comment);
    this.code.push({ mnemonic: 'ldw', operands: '$0,(ix+$sx)', comment: `$0/$1 <- ${label}` });
  }

  /** Store the byte in `reg` into a 1-byte shadow slot. `reg` must not be $2/$3. */
  private emitShadowStore8(label: string, reg: string, comment?: string): void {
    this.emitShadowAddress(label, comment);
    this.code.push({ mnemonic: 'st', operands: `${reg},(ix+$sx)`, comment: `${label} <- ${reg}` });
  }

  /**
   * Load a 1-byte shadow slot into `reg`. `reg` must not be $2/$3.
   * The SHADOW_ACTIVE test Tasks 4/5 need is this followed by `anc reg,reg` +
   * `jr z,<bcd path>` — logic_0C's setFlagsB sets Z_bit when the result is
   * NON-zero, so `jr z` is "branch if the flag was 0", i.e. not shadowing.
   * No caller yet, for the same reason as emitShadowLoad16 above.
   */
  private emitShadowLoad8(label: string, reg: string, comment?: string): void {
    this.emitShadowAddress(label, comment);
    this.code.push({ mnemonic: 'ld', operands: `${reg},(ix+$sx)`, comment: `${reg} <- ${label}` });
  }

  // -------------------------------------------------------------------------
  // Binary expression → left push, right eval, pop left, call ROM
  // -------------------------------------------------------------------------

  private emitBinaryExpr(op: BinaryOp, left: Expression, right: Expression): void {
    // MOD (&H105F) is not a leaf FP routine like FP_ADD/SUB/MUL/DIV — it's a
    // BASIC-interpreter operator-table entry point. Its preamble (&H1069 ->
    // &H05A1) pops the left operand off the CPU's separate US ("user") stack
    // itself, via `ppu`/`ppum`, matching how the ROM's own expression
    // evaluator stages operators (push left with `phum`/`phu`, leave right in
    // the $10-$18 accumulator). That US stack is a different physical stack
    // from the SS stack our `phs`/`phsm`/`pps`/`ppsm` staging below uses for
    // +/-/*//, so calling &H105F after that staging makes it pop garbage off
    // an untouched US stack, corrupting the accumulator (confirmed by tracing
    // execution — it derails into unrelated ROM code and always leaves 0).
    // The fix is to stage MOD's operands the way the ROM itself expects:
    // left pushed onto the US stack, right left untouched in $10-$18, then
    // call &H105F directly — no $19-$27 shuffle needed, since &H105F's own
    // preamble copies $10-$18 into $0-$8 and pops the US stack into $10-$18.
    if (op === 'mod') {
      this.emitExpression(left);
      this.code.push({ mnemonic: 'phum', operands: '$17,8', comment: 'push left[0..7] onto US stack (MOD reads it, not SS)' });
      this.code.push({ mnemonic: 'phu',  operands: '$18',   comment: 'push left[8] onto US stack' });
      this.emitExpression(right);
      this.emitRomCallFp(ROM.MOD, 'mod');
      return;
    }

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
      // 'mod' is NOT handled here — it needs different operand staging
      // (US stack, not SS) and is special-cased at the top of
      // emitBinaryExpr. See the comment there for why.
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
  // Integer fast path — shared BCD <-> int16 conversion subroutines
  //
  // These two routines are the foundation of the native-integer fast path:
  // everything downstream of them (native adw/sbw arithmetic, comparisons,
  // FOR/NEXT stepping) works on a plain signed 16-bit value rather than on the
  // ROM's 9-byte BCD floating-point format.
  //
  // ── Calling convention ───────────────────────────────────────────────────
  //
  //   BCD_TO_INT16   in : $10-$18  9-byte BCD value (the usual accumulator)
  //                  out: $0/$1    signed int16, little-endian ($0 = low byte)
  //                       $9       0 = converted exactly, 1 = NOT convertible
  //                  $10-$18 are NOT modified (the caller still needs them to
  //                  fall back to the BCD path), and neither is anything above
  //                  $9. Clobbers $0-$9 and the flags.
  //
  //   INT16_TO_BCD   in : $0/$1    signed int16
  //                  out: $10-$18  9-byte BCD encoding of that value
  //                  Clobbers $0-$9 and the flags; $19-$31 are untouched.
  //
  // `$9 = 1` from BCD_TO_INT16 means "this value is not an integer in
  // -32768..32767" and the caller MUST take the BCD path. It fires for a value
  // whose magnitude is >= 32768 (or > 32768 when negative), for |v| < 1 and
  // non-zero, and for any value with a non-zero digit past the decimal point —
  // so a type-inference bug that mis-classifies a variable degrades to "slow
  // but correct", never to a wrong answer. Callers must test it: nothing else
  // in the sequence detects an operand that never fitted in 16 bits to begin
  // with (the post-arithmetic carry check only sees the *result* overflow).
  //
  // ── Register choice ──────────────────────────────────────────────────────
  //
  // Both routines confine themselves to $0-$9. That window is safe here for
  // the same reason emitRomCallFp's $19/$20 + $28/$29 choice is safe -- it is
  // dead at the point of use, and provably not one of the registers the ROM
  // or the rest of this compiler needs preserved:
  //
  //   * $30/$31 are ROM globals ($31 = 0, $30 = 1, with SX -> $31 and
  //     SY -> $30) read by the FP routines, both interrupt service routines,
  //     and this compiler's own `psr sx,31` addressing. Never touched here.
  //   * $19-$27 hold the pushed-back left operand of a binary expression, and
  //     $19/$20 + $28/$29 are emitRomCallFp's own wrapper registers. All are
  //     left alone, so a fast path that has to bail out can still stage its
  //     operands for a ROM_CALL_FP exactly as the BCD path does.
  //   * $10-$18 are the FP accumulator. BCD_TO_INT16 only reads them (it works
  //     on a 3-register copy in $6-$8), which is what makes the BCD fallback
  //     possible after a decode.
  //   * $0-$8 are the *second* FP operand window, but only from the moment a
  //     call site stages them until the ROM call itself. A conversion never
  //     spans that window: either the fast path completes natively, or it
  //     bails out and stages $0-$8 afterwards from the untouched BCD copies.
  //
  // Every instruction below was checked against its handler in
  // src/emulator/exec.ts rather than inferred from the mnemonic; the
  // non-obvious ones are cited at the point of use.
  // -------------------------------------------------------------------------

  private emitIntFastPathWrapper(): void {
    this.emitBcdToInt16Routine();
    this.emitInt16ToBcdRoutine();
  }

  // BCD ($10-$18) -> signed int16 ($0/$1), status in $9.
  //
  // For an integer-valued BCD number the biased exponent gives the integer
  // digit count directly: `n = biasedExponent - 100 + 1` (see bcd.ts), so with
  // bytes[8]'s sign marker stripped the value is an int16 candidate only when
  // bytes[8] == 1 and bytes[7] <= 4 (i.e. biased exponent 100..104, 1..5
  // integer digits). The digits themselves are then accumulated left to right,
  // `acc = acc*10 + digit`, straight out of the mantissa nibbles.
  private emitBcdToInt16Routine(): void {
    const push = (mnemonic: string, operands: string, comment?: string, label?: string): void => {
      this.code.push({ label, mnemonic, operands, comment });
    };

    this.code.push({ comment: 'BCD_TO_INT16: $10-$18 (BCD) -> $0/$1 (int16), $9 = 0 ok / 1 not an int16' });
    this.code.push({
      label: 'BCD_TO_INT16',
      mnemonic: 'ld', operands: '$2,$17',
      comment: 'bytes[7] = low two digits of the biased exponent',
    });
    push('or',  '$2,$18',  'Z_bit set when (bytes[7] | bytes[8]) != 0');
    // setFlagsB (exec.ts) sets Z_bit when the result is NON-zero, so `jr z` is
    // "branch if the result was zero" — inverted from a conventional CPU.
    push('jr',  'z,B2I_ZERO', 'both exponent bytes zero -> the value is exactly 0');
    push('ld',  '$4,&H00', '$4 = sign flag (0 = positive)');
    push('ld',  '$2,$18');
    // adSb_08: `sbc` compares without writing back, and sets C when the
    // subtraction borrowed ((y >>> 0) > 0xFF for a negative result).
    push('sbc', '$2,&H05', 'C (borrow) when bytes[8] < 5, i.e. positive');
    push('jr',  'c,B2I_EXP');
    push('sb',  '$2,&H05', 'strip the negative marker bcd.ts folds into bytes[8]');
    push('ld',  '$4,&H01', 'negative');
    push('sbc', '$2,&H01', 'hundreds digit of the biased exponent must be exactly 1', 'B2I_EXP');
    push('jr',  'nz,B2I_FAIL', '0 -> |v| < 1; > 1 -> far past int16 range');
    push('sbc', '$17,&H05', 'and the low two digits must be 00..04 (1..5 integer digits)');
    push('jr',  'nc,B2I_FAIL', 'no borrow -> bytes[7] >= 5 -> more than 5 digits');
    push('ld',  '$5,$17');
    push('ad',  '$5,&H01', '$5 = n = integer digit count (1..5)');
    // d1..d6 live in the top three mantissa bytes: bytes[6] low nibble is d1,
    // then alternating high/low nibbles down through bytes[4]. Copying them
    // keeps the caller's accumulator intact for the BCD fallback.
    push('ldm', '$6,$14,3', 'working copy of bytes[4],[5],[6]');
    push('ldw', '$0,&H0000', 'acc = 0');
    // acc = acc*10 built from word doubling: 2a -> 4a -> 8a, plus the saved 2a.
    // The digit-shift family (diu/did/dium/didm) shifts by a NIBBLE, i.e. x16,
    // not x10, so it cannot do this step.
    push('adw', '$0,$0', 'acc *= 2', 'B2I_LOOP');
    push('jr',  'c,B2I_FAIL', 'adwSbw_88 sets C when the true sum exceeds 0xFFFF');
    push('ldw', '$2,$0', 'tmp = 2*acc');
    push('adw', '$0,$0', 'acc *= 4');
    push('jr',  'c,B2I_FAIL');
    push('adw', '$0,$0', 'acc *= 8');
    push('jr',  'c,B2I_FAIL');
    push('adw', '$0,$2', 'acc = 8*acc + 2*acc = 10*acc');
    push('jr',  'c,B2I_FAIL');
    push('ld',  '$2,$8');
    push('an',  '$2,&H0F', 'next mantissa digit');
    push('ld',  '$3,&H00', 'widen it to a word so adw can add it');
    push('adw', '$0,$2', 'acc = 10*acc + digit');
    push('jr',  'c,B2I_FAIL');
    push('ld',  '$8,&H00', 'drop the digit just consumed (keeps the tail test exact)');
    // dium_DA shifts a register range up by one nibble, ascending from the
    // named register, so the next digit lands in $8's low nibble.
    push('dium', '$6,3', 'next digit -> low nibble of $8');
    push('sb',  '$5,&H01');
    push('jr',  'nz,B2I_LOOP');
    // Whole-number check: an integer's mantissa is all zeros past digit n. If
    // anything survives, the stored value had a fractional part and the caller
    // must use the BCD path.
    push('ld',  '$2,$6');
    push('or',  '$2,$7');
    push('or',  '$2,$8');
    push('or',  '$2,$10');
    push('or',  '$2,$11');
    push('or',  '$2,$12');
    push('or',  '$2,$13');
    push('jr',  'nz,B2I_FAIL', 'a digit past the units place -> not a whole number');
    push('anc', '$1,&H80', 'magnitude >= 32768?');
    push('jr',  'z,B2I_SIGN', 'no -> in range for either sign');
    push('anc', '$4,$4');
    push('jr',  'z,B2I_FAIL', 'positive and >= 32768 -> out of range');
    push('ldw', '$2,&H8000');
    push('sbcw', '$0,$2', 'negative: only -32768 exactly is still in range');
    push('jr',  'nz,B2I_FAIL');
    push('anc', '$4,$4', undefined, 'B2I_SIGN');
    push('jr',  'z,B2I_OK', 'positive -> done');
    // cmpwInvw_9B with bit 6 of the operand byte clear is a two's complement
    // negate of the register pair (0x8000 negates to itself, which is right).
    push('cmpw', '$0', 'negate: acc = -acc');
    push('ld',  '$9,&H00', 'status = converted', 'B2I_OK');
    push('rtn', '');
    push('ldw', '$0,&H0000', undefined, 'B2I_ZERO');
    push('ld',  '$9,&H00');
    push('rtn', '');
    push('ld',  '$9,&H01', 'status = not representable as an int16', 'B2I_FAIL');
    push('rtn', '');
  }

  // Signed int16 ($0/$1) -> BCD ($10-$18).
  //
  // Binary -> BCD by the software form of double dabble: 16 times, double the
  // BCD field (adbm, which is a carry-propagating *BCD* add) and add the bit
  // shifted out of the top of the magnitude. Doubling always leaves an even
  // units digit, so the `+1` can never produce a BCD carry.
  //
  // That builds the digits right-aligned — units in the low nibble of bytes[4]
  // — which is the correct mantissa layout for a 5-digit number shifted two
  // nibbles too far down. Normalising is then just "shift up a nibble while
  // the leading digit is zero", with the shift count giving the exponent.
  private emitInt16ToBcdRoutine(): void {
    const push = (mnemonic: string, operands: string, comment?: string, label?: string): void => {
      this.code.push({ label, mnemonic, operands, comment });
    };

    this.code.push({ comment: 'INT16_TO_BCD: $0/$1 (int16) -> $10-$18 (BCD)' });
    this.code.push({
      label: 'INT16_TO_BCD',
      mnemonic: 'ldw', operands: '$10,&H0000',
      comment: 'clear the 9-byte accumulator (this is also the encoding of 0)',
    });
    push('ldw', '$12,&H0000');
    push('ldw', '$14,&H0000');
    push('ldw', '$16,&H0000');
    push('ld',  '$18,&H00');
    // logicW_8C sets Z_bit when either byte of the pair is non-zero.
    push('orcw', '$0,$0');
    push('jr',  'z,I2B_RET', 'zero -> the all-zero BCD encoding, already written');
    push('ld',  '$5,&H00', '$5 = sign flag');
    push('anc', '$1,&H80');
    push('jr',  'z,I2B_ABS', 'high bit clear -> positive');
    push('cmpw', '$0', 'magnitude = -value (-32768 negates to 0x8000 = 32768)');
    push('ld',  '$5,&H01');
    push('ld',  '$4,&H10', '16 bits, most significant first', 'I2B_ABS');
    // adbm is the multi-byte BCD add (adbmSbbm_C8); dst == src doubles the
    // field with carry propagation across all three bytes.
    push('adbm', '$14,$14,3', 'BCD field *= 2 (6 digits)', 'I2B_BIT');
    // biuw_98 shifts the pair left one bit and sets C from the old bit 15.
    // (Its `did`/`bid` down-counterparts operate on the pair ENDING at the
    // named register, which is why the up-form is used here.)
    push('biuw', '$0', 'magnitude <<= 1, C = the bit shifted out');
    push('jr',  'nc,I2B_NEXT');
    push('adb', '$14,&H01', '+1 in BCD: the units digit is even, so it cannot carry');
    push('sb',  '$4,&H01', undefined, 'I2B_NEXT');
    push('jr',  'nz,I2B_BIT');
    push('ld',  '$4,&H05', '5 digit positions, before normalising');
    push('anc', '$16,&H0F', 'leading digit of the 5-digit field', 'I2B_NORM');
    push('jr',  'nz,I2B_EXP', 'non-zero -> normalised');
    push('dium', '$14,3', 'drop one leading zero digit');
    push('sb',  '$4,&H01');
    push('jr',  'nz,I2B_NORM', '($4 can only reach 0 for a zero value, handled above)');
    push('ld',  '$17,$4', undefined, 'I2B_EXP');
    push('sb',  '$17,&H01', 'bytes[7] = digit count - 1 (biased exponent 100..104)');
    push('ld',  '$18,&H01', 'bytes[8] = hundreds digit of the biased exponent');
    push('anc', '$5,$5');
    push('jr',  'z,I2B_RET');
    push('ld',  '$18,&H06', 'negative: bcd.ts folds +5 into bytes[8]');
    push('rtn', '', undefined, 'I2B_RET');
  }

  // Call sites for the two routines above. Kept as helpers so the calling
  // convention is documented in exactly one place. They have no caller inside
  // codegen yet — the first one arrives with the `+`/`-` fast path, which is
  // also what the round-trip test in
  // tools/emu-debugger/tests/intfast-conversion.test.ts stands in for until
  // then (it splices the same two `cal`s into a compiled program).
  private emitBcdToInt16(comment?: string): void {
    this.code.push({
      mnemonic: 'cal',
      operands: 'BCD_TO_INT16',
      comment: comment ?? 'BCD $10-$18 -> int16 $0/$1 ($9 != 0 => must use the BCD path)',
    });
  }

  private emitInt16ToBcd(comment?: string): void {
    this.code.push({
      mnemonic: 'cal',
      operands: 'INT16_TO_BCD',
      comment: comment ?? 'int16 $0/$1 -> BCD $10-$18',
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
          // Evaluate expression into the FP accumulator ($10-$18), then run
          // the ROM's own numeric-item output pair: format to a string in
          // WORK1, then display it. Mirrors rom1a.src:3F53/3F63/3F66 minus the
          // interpreter-only bookkeeping (&H1088 expression eval, &H22A4
          // last-answer store) that compiled code has no use for.
          // $15-$17 (the pointer/length handed from one call to the other) are
          // untouched by emitRomCall's `ldw $2,...` and by the ROM_CALL
          // wrapper, which only writes $0/$1.
          this.emitExpression(item.value);
          this.emitRomCall(ROM.FMT_NUM, 'format FP value -> string ($15,$16 ptr, $17 len)');
          this.emitRomCall(ROM.PRLB1, 'display the formatted string');
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
      // Use the same proven OUTCH character loop PRINT uses for string
      // literals. (This previously loaded the string address into $10 and
      // called &H3EF1 — the BASIC PRINT *statement* handler, which parses
      // source text from IZ and ignores $10 entirely.)
      const strInfo = this.allocString(stmt.prompt);
      this.emitPrintStringLoop(strInfo.label, stmt.prompt);
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

    // --- Loop-shadow entry -------------------------------------------------
    //
    // Only for a loop the static scan (Task 2) proved safe. Everything above is
    // untouched: the plain 9-byte BCD stores of initial value, limit and step
    // still happen unconditionally, so the BCD state a non-shadowed NEXT — and
    // any runtime fallback to the BCD path — reads is exactly what it was.
    //
    // This block is emitted BEFORE `topLabel`, not after. NEXT jumps back to
    // topLabel, so anything placed after it runs once per ITERATION; the decode
    // has to run once per LOOP. Re-decoding the BCD counter every iteration
    // would not just waste the saving, it would be wrong once Task 4 makes the
    // native counter the live one — every iteration would reset the shadow
    // counter from a BCD variable nobody is updating any more.
    if (this.shadowEligibility.get(stmt)) {
      const slots = this.allocShadowSlots(varName);
      // Control-flow labels deliberately avoid the `SHADOW_` prefix: that
      // prefix is the shadow *storage* namespace, and a branch target sharing
      // it would make "is this label a shadow slot?" ambiguous for the listing
      // and for anything else scanning the symbol table.
      const offLabel  = this.uniqueLabel(`FORSHADOW_OFF_${varName}`);
      const doneLabel = this.uniqueLabel(`FORSHADOW_ON_${varName}`);

      // Decode counter, limit and step, bailing out to "not shadowing" on the
      // first one that is not an exact int16.
      //
      // The plan's draft instead accumulated BCD_TO_INT16's $9 status across
      // all three decodes with `or $2,$9`. That cannot work: $2/$3 is the
      // address scratch pair every variable load and every shadow store writes
      // (ldw_D1 in src/emulator/exec.ts writes the named register AND the next
      // one), so the accumulator would be destroyed before the second decode
      // ran. Branching out on the first failure keeps no value live across a
      // call at all, which is why it is done this way.
      const decode = (ref: VarRef, slot: string, what: string): void => {
        this.emitVariableLoad(ref);
        this.emitBcdToInt16(`decode ${what} for shadow`);
        this.emitShadowStore16(slot, `shadow: stash decoded ${what}`);
        // `anc` (0x04) is the compare-only AND — logic_0C skips the write-back
        // when bit 3 of the opcode is clear — and setFlagsB sets Z_bit when the
        // result is NON-zero. So this pair reads "branch if $9 was non-zero",
        // i.e. BCD_TO_INT16 rejected the value. Same idiom as the routine's own
        // `anc $4,$4` / `jr z`.
        this.code.push({ mnemonic: 'anc', operands: '$9,$9', comment: `${what} decode status` });
        this.code.push({ mnemonic: 'jr', operands: `nz,${offLabel}`, comment: 'not an int16 -> no shadowing' });
      };

      this.code.push({ comment: `loop-shadow entry for ${varName}: decode counter/limit/step` });
      decode(stmt.variable, slots.counter, 'counter');
      decode(limitRef,      slots.limit,   'limit');
      decode(stepRef,       slots.step,    'step');

      // $9 is dead here (the branch above was its last reader) and sits outside
      // the $2/$3 address pair, so it survives emitShadowStore8's own `ldw $2`.
      this.code.push({ mnemonic: 'ld', operands: '$9,&H01', comment: 'all three decoded -> shadowing active' });
      this.code.push({ mnemonic: 'jr', operands: doneLabel });
      this.code.push({ label: offLabel, mnemonic: 'ld', operands: '$9,&H00', comment: 'a decode failed -> stay on the BCD path' });
      this.code.push({ label: doneLabel });
      this.emitShadowStore8(slots.active, '$9', `${slots.active} <- shadowing on/off`);

      this.shadowStack.push({ varName, ...slots });
      this.shadowedLoopsFound.push({ varName, line: this.currentLine });
    }

    // Loop top label
    this.code.push({ label: topLabel, comment: `FOR ${varName} loop top` });

    // Push loop info for matching NEXT
    this.forStack.push({ varName, topLabel, endLabel });
  }

  /**
   * Close the shadow bookkeeping for the loop `NEXT` is ending, mirroring the
   * `forStack.splice` next to it. Returns the loop's slots when it was a
   * shadowed loop, or undefined when it was not.
   *
   * Emits nothing — Task 4 is what adds the shadowed `NEXT` tail (native step
   * and compare, plus the BCD re-sync on exit) and will use this return value
   * to decide which tail to emit. The pop itself belongs here regardless, so
   * that `shadowStack` really does mean "loops open right now" for every
   * consumer, including Task 5's in-body substitution.
   */
  private popShadowLoop(varName: string): ({ varName: string } & ShadowSlots) | undefined {
    for (let i = this.shadowStack.length - 1; i >= 0; i--) {
      if (this.shadowStack[i]!.varName === varName) return this.shadowStack.splice(i, 1)[0];
    }
    return undefined;
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
      this.code.push({ mnemonic: 'ldm',  operands: '$0,$10,8',  comment: 'step[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',   operands: '$8,$18',    comment: 'step[8] -> $8' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'counter[0..7] -> $10-$17' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'counter[8] -> $18' });
      this.emitRomCallFp(ROM.FP_ADD, 'counter + step');
      this.emitVariableStore(loopVar);

      // Compare: loop again while counter <= limit
      //
      // NOTE: this compiler has no negative-STEP direction-sensing — this
      // test is unconditionally `<=`, which is only correct for a positive
      // (or default/omitted) step. A descending loop would need `>=` chosen
      // at runtime based on step's sign; that's new scope, not part of this
      // fix (see task-4c brief).
      //
      // `FOR I=10 TO 1 STEP -1` does parse (STEP takes a general Expression,
      // and unary minus is a real AST node), but it does NOT compile to a
      // correctly-negated step: emitUnaryExpr negates via `xr $10,&H80`,
      // which flips bit 7 of BCD byte 0 — the low mantissa byte — not the
      // sign. The actual sign lives in byte 8 (register $18) as +5 on the
      // exponent-high digit (bcd.ts SIGN_OFFSET; read correctly by
      // emitSignTest's `anc $18,&H04` above). So today, negative STEP is
      // broken twice over — even a hypothetical `>=`-on-negative-step fix
      // here would have nothing correct to test against, since the "-1"
      // constant it would inspect isn't actually negative. Fixing that is
      // emitUnaryExpr's bug, not this one; not touched here.
      this.emitVariableLoad(loopVar);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push counter[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push counter[8]' });
      this.emitVariableLoad(limitRef);
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop counter[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop counter[0..7] → $19-$26' });
      this.code.push({ mnemonic: 'ldm',  operands: '$0,$10,8',  comment: 'limit[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',   operands: '$8,$18',    comment: 'limit[8] -> $8' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'counter[0..7] -> $10-$17' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'counter[8] -> $18' });
      this.emitRomCallFp(ROM.FP_SUB, 'counter - limit');
      this.emitComparisonBranch('<=', loop.endLabel);
      this.code.push({ mnemonic: 'jr', operands: loop.topLabel, comment: 'loop back (counter <= limit)' });

      // End label
      this.code.push({ label: loop.endLabel, comment: `ENDFOR ${varName}` });

      // Remove from stack. `loop.varName`, not the requested `varName`:
      // findForLoop falls back to the innermost loop when the name doesn't
      // match, and the shadow bookkeeping must close the loop that was
      // actually closed.
      this.popShadowLoop(loop.varName);
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

    if (stmt.elseBranch && stmt.elseBranch.length > 0) {
      // Condition falls through into THEN, branches to ELSE when false
      this.emitCondition(stmt.condition, elseLabel);

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
      // No ELSE — condition jumps over the THEN block when false
      this.emitCondition(stmt.condition, endIfLabel);

      // THEN block
      for (const s of stmt.thenBranch) {
        this.emitStatement(s);
      }
      this.code.push({ label: endIfLabel });
    }
  }

  /**
   * Emit a condition test that falls through when the condition is TRUE and
   * branches to `falseLabel` when it is FALSE.
   *
   * A comparison is evaluated as `left - right` through the ROM's FP_SUB and
   * then classified by the only two properties of the 9-byte BCD difference
   * that any relational operator needs (see `tools/compiler/bcd.ts`):
   *
   *   Z   — all nine bytes are zero. BCD zero is the unique all-zero encoding
   *         (bcd.ts:66, matching the ROM's own "floating point 0" at &H0636),
   *         so Z means exactly `left = right`.
   *   NEG — bit 2 of byte 8 is set. Byte 8 is
   *         `floor(biasedExponent / 100) + (5 when negative)` (bcd.ts:86) and
   *         the biased exponent is always 1..199, so byte 8 is 0 or 1 for a
   *         value >= 0 and 5 or 6 for a value < 0. Zero (byte 8 = 0) therefore
   *         reads as non-negative, which is what `>=` and `<=` need.
   *
   *     op | true when         | branch to falseLabel when
   *     ---+-------------------+--------------------------
   *     =  | Z                 | not Z
   *     <> | not Z             | Z
   *     <  | NEG               | not NEG
   *     >  | not Z and not NEG | Z, or NEG
   *     <= | Z or NEG          | not Z and not NEG
   *     >= | not NEG           | NEG
   *
   * A non-comparison condition is BASIC's numeric truth test: false is zero,
   * anything else is true, which is the same Z test on the accumulator.
   */
  private emitCondition(expr: Expression, falseLabel: string): void {
    if (expr.type === 'binary' && this.isComparisonOp(expr.op)) {
      // 1. left → accumulator, pushed to the stack
      this.emitExpression(expr.left);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: 'push left[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push left[8]' });

      // 2. right → accumulator; recover left into the $19-$27 scratch window
      this.emitExpression(expr.right);
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop left[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop left[0..7] → $19-$26' });

      // 3. Stage for the ROM's convention: left in $10-$18, right in $0-$8
      //    (identical to emitBinaryExpr's arithmetic path). The call must go
      //    through ROM_CALL_FP — plain ROM_CALL clobbers $0-$3.
      this.code.push({ mnemonic: 'ldm', operands: '$0,$10,8',  comment: 'right[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',  operands: '$8,$18',    comment: 'right[8] -> $8' });
      this.code.push({ mnemonic: 'ldm', operands: '$10,$19,8', comment: 'left[0..7] -> $10-$17' });
      this.code.push({ mnemonic: 'ld',  operands: '$18,$27',   comment: 'left[8] -> $18' });
      this.emitRomCallFp(ROM.FP_SUB, `compare: ${expr.op}`);

      // 4. Classify the difference now sitting in $10-$18
      this.emitComparisonBranch(expr.op, falseLabel);
    } else {
      // Numeric truth: the value is false only when it is BCD zero
      this.emitExpression(expr);
      this.emitZeroTest('condition value zero?');
      this.code.push({
        mnemonic: 'jr',
        operands: `z,${falseLabel}`,
        comment: 'value is zero → condition false',
      });
    }
  }

  /**
   * `orcm $10,$11,8` (opcode 0xC6) OR-compares $10-$17 against $11-$18 and
   * writes nothing back — bit 3 of the opcode is what enables the store, and
   * 0xC6 has it clear (`src/emulator/exec.ts:1068-1088`). The handler ORs every
   * intermediate byte result into one accumulator and sets Z_bit when that
   * accumulator is non-zero, so overlapping the two register ranges by one
   * makes a single instruction cover all nine accumulator bytes. That overlap
   * is necessary, not clever: `imm3Arg` (`exec.ts:170-174`) caps the repeat
   * count at 8, so nine bytes cannot be reached any other way.
   *
   * Condition code `z` is true when Z_bit is CLEAR (`exec.ts:236`), i.e. when
   * every byte was zero; `nz` is true when at least one byte was not.
   */
  private emitZeroTest(comment: string): void {
    this.code.push({ mnemonic: 'orcm', operands: '$10,$11,8', comment });
  }

  /**
   * `anc $18,&H04` (opcode 0x44) AND-compares the exponent/sign byte with
   * bit 2 and, again, writes nothing back (`src/emulator/exec.ts:322-331`;
   * 0x44 has the store bit clear and the 0x40 bit selects the immediate).
   * `setFlagsB` sets Z_bit when the result is non-zero (`exec.ts:133-139`), so
   * condition code `nz` is true exactly when the value is negative and `z`
   * when it is zero or positive.
   */
  private emitSignTest(comment: string): void {
    this.code.push({ mnemonic: 'anc', operands: '$18,&H04', comment });
  }

  /** Branch to `falseLabel` when `left <op> right` does not hold. */
  private emitComparisonBranch(op: BinaryOp, falseLabel: string): void {
    switch (op) {
      case '=':
        this.emitZeroTest('left - right == 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `nz,${falseLabel}`, comment: 'left <> right → false' });
        break;

      case '<>':
        this.emitZeroTest('left - right == 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `z,${falseLabel}`, comment: 'left = right → false' });
        break;

      case '<':
        this.emitSignTest('left - right < 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `z,${falseLabel}`, comment: 'left >= right → false' });
        break;

      case '>=':
        this.emitSignTest('left - right < 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `nz,${falseLabel}`, comment: 'left < right → false' });
        break;

      case '>':
        // true only when the difference is neither zero nor negative
        this.emitZeroTest('left - right == 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `z,${falseLabel}`, comment: 'left = right → false' });
        this.emitSignTest('left - right < 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `nz,${falseLabel}`, comment: 'left < right → false' });
        break;

      case '<=': {
        // true when the difference is zero OR negative, so a zero difference
        // has to skip past the sign test rather than fall into it
        const trueLabel = this.uniqueLabel('CMPLE');
        this.emitZeroTest('left - right == 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `z,${trueLabel}`, comment: 'left = right → true' });
        this.emitSignTest('left - right < 0 ?');
        this.code.push({ mnemonic: 'jr', operands: `z,${falseLabel}`, comment: 'left > right → false' });
        this.code.push({ label: trueLabel });
        break;
      }

      default:
        this.code.push({ comment: `TODO: comparison operator ${op}` });
        break;
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

    // Pre-allocate one label per target, marking where that target's own
    // comparison block begins. For ON GOSUB, a non-matching target must fall
    // through to the NEXT target's comparison rather than jumping straight to
    // the shared end-of-statement label — otherwise the very first non-match
    // abandons every remaining target (see task-4c report §4). ON GOTO
    // doesn't need these: a non-match there already falls through naturally
    // to the next target's setup code with no escape jump in between.
    const compareLabels = stmt.targets.map(() => this.uniqueLabel('ON_CMP'));

    for (let i = 0; i < stmt.targets.length; i++) {
      const targetLine = stmt.targets[i].line;

      if (stmt.kind === 'gosub') {
        this.code.push({ label: compareLabels[i]! });
      }

      // Load selector
      this.emitVariableLoad(selectorRef);
      this.code.push({ mnemonic: 'phsm', operands: '$17,8', comment: `push selector[0..7]` });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push selector[8]' });
      // Load comparison value (i+1)
      this.emitNumberLiteral(i + 1);
      // Pop selector to $19-$27
      this.code.push({ mnemonic: 'pps',  operands: '$27',   comment: 'pop selector[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8', comment: 'pop selector[0..7] → $19-$26' });
      this.code.push({ mnemonic: 'ldm',  operands: '$0,$10,8',  comment: '(i+1)[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',   operands: '$8,$18',    comment: '(i+1)[8] -> $8' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'selector[0..7] -> $10-$17' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'selector[8] -> $18' });
      this.emitRomCallFp(ROM.FP_SUB, `selector - ${i + 1}`);

      // Jump to target if zero (selector == i+1)
      if (stmt.kind === 'goto') {
        this.code.push({ mnemonic: 'jr', operands: `z,L${targetLine}`, comment: `ON GOTO ${targetLine}` });
      } else {
        // ON GOSUB: a non-match falls through to the next target's
        // comparison block (or, on the last target, to the shared end —
        // "no match" is a legal, silent no-op, matching ON GOTO's behavior
        // when the selector is out of range).
        const nextLabel = i + 1 < stmt.targets.length ? compareLabels[i + 1]! : skipLabel;
        this.code.push({ mnemonic: 'jr', operands: `nz,${nextLabel}`, comment: `not target ${i + 1} → try next` });
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
      this.code.push({ mnemonic: 'psr', operands: 'sx,31', comment: '$sx -> $31 (= 0): displacement 0' });
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

    // Falls through into the body while the condition holds; exits past WEND
    // when it does not
    this.emitCondition(stmt.condition, endLabel);

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
  // Loop-shadow slot allocation
  //
  // Mirrors allocVariable's shape but has its own map and its own 2-/1-byte
  // sizes; see the ShadowSlots doc comment for why it must not extend
  // `this.variables`. Two FOR loops driven by the same counter share one set of
  // slots, exactly as they share one VAR_ slot — they can never be open at the
  // same time, and each loop re-decodes into the slots at its own entry.
  // -------------------------------------------------------------------------

  private allocShadowSlots(varName: string): ShadowSlots {
    if (!this.shadowSlots.has(varName)) {
      const v = varName.toUpperCase();
      this.shadowSlots.set(varName, {
        counter: `SHADOW_${v}_CNT`,
        limit:   `SHADOW_${v}_LIM`,
        step:    `SHADOW_${v}_STP`,
        active:  `SHADOW_${v}_ACT`,
      });
    }
    return this.shadowSlots.get(varName)!;
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
