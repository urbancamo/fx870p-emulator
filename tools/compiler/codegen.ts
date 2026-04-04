// tools/compiler/codegen.ts
// Code generator: takes a parsed BASIC AST and produces annotated HD61700 assembly (AsmLine[])

import type {
  Program, Statement, Expression, VarRef,
  PrintItem, BinaryOp,
  ForStatement, NextStatement, IfStatement, InputStatement, PrintStatement, LetStatement,
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

  generate(program: Program): AsmProgram {
    // 1. ORG directive
    this.code.push({ mnemonic: 'ORG', operands: '&H0000' });

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

    // 4. String literals (DB directives)
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

    // 5. Variable table (DS directives)
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

    return { lines: this.code, origin: 0 };
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
        // END, STOP, CONT all return to caller for now
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

      default:
        this.code.push({ comment: `TODO: ${stmt.type} not yet implemented` });
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
      // Load 9-byte FP value from variable into accumulator
      this.code.push({
        mnemonic: 'ldm',
        operands: `$10,${varInfo.label},9`,
        comment: `load ${ref.name}`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // Variable store — store FP accumulator to variable storage
  // -------------------------------------------------------------------------

  private emitVariableStore(ref: VarRef): void {
    const varInfo = this.allocVariable(ref);
    if (ref.isString) {
      this.code.push({
        comment: `TODO: string copy for ${ref.name}$`,
      });
    } else {
      this.code.push({
        mnemonic: 'stm',
        operands: `$10,${varInfo.label},9`,
        comment: `store ${ref.name}`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // Binary expression → left push, right eval, pop left, call ROM
  // -------------------------------------------------------------------------

  private emitBinaryExpr(op: BinaryOp, left: Expression, right: Expression): void {
    // 1. Evaluate left operand → FP accumulator
    this.emitExpression(left);

    // 2. Push FP accumulator to stack (save left)
    this.code.push({
      mnemonic: 'phsm',
      operands: '$10,9',
      comment: 'push left operand',
    });

    // 3. Evaluate right operand → FP accumulator
    this.emitExpression(right);

    // 4. Pop left operand into temporary registers $19-$27
    this.code.push({
      mnemonic: 'ppsm',
      operands: '$19,9',
      comment: 'pop left operand to temp',
    });

    // 5. Perform the operation
    const romAddr = this.arithmeticRomAddr(op);
    if (romAddr) {
      // Swap: move current accumulator to temp, left to accumulator
      // The ROM routines expect: left in $10-$18, right in $19-$27
      // After pop, left is in $19-$27, right is in $10-$18
      // So we need to swap
      this.code.push({
        mnemonic: 'ldm',
        operands: '$28,9',
        comment: 'temp = right (from accumulator)',
      });
      this.code.push({
        mnemonic: 'ldm',
        operands: '$10,$19,9',
        comment: 'accumulator = left',
      });
      this.code.push({
        mnemonic: 'ldm',
        operands: '$19,$28,9',
        comment: 'temp regs = right',
      });

      this.emitRomCall(romAddr, `${op}`);
    } else if (this.isComparisonOp(op)) {
      // Comparison: subtract and test flags
      this.emitRomCall(ROM.FP_SUB, `compare: ${op}`);
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
        mnemonic: 'xrm',
        operands: '$10,&H80',
        comment: 'negate FP value',
      });
    } else {
      this.code.push({ comment: 'TODO: NOT operator' });
    }
  }

  // -------------------------------------------------------------------------
  // Builtin function call
  // -------------------------------------------------------------------------

  private emitBuiltinCall(name: string, args: Expression[]): void {
    // Evaluate arguments
    for (const arg of args) {
      this.emitExpression(arg);
    }
    this.code.push({ comment: `TODO: builtin ${name}(...)` });
  }

  // -------------------------------------------------------------------------
  // Array access
  // -------------------------------------------------------------------------

  private emitArrayAccess(name: string, isString: boolean, indices: Expression[]): void {
    // Evaluate index expressions
    for (const idx of indices) {
      this.emitExpression(idx);
    }
    this.code.push({ comment: `TODO: array access ${name}(${indices.length} dims)` });
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
      mnemonic: 'jr',
      operands: 'ROM_CALL',
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
  }

  // -------------------------------------------------------------------------
  // PRINT — evaluate each item, call ROM PRINT handler
  // -------------------------------------------------------------------------

  private emitPrint(stmt: PrintStatement): void {
    let trailingSep = false;

    for (const item of stmt.items) {
      if (item.type === 'expr') {
        if (item.value.type === 'string') {
          // String literal: load address and call print
          const strInfo = this.allocString(item.value.value);
          this.code.push({
            mnemonic: 'ldw',
            operands: `$10,${strInfo.label}`,
            comment: `PRINT string: "${item.value.value}"`,
          });
        } else {
          // Evaluate expression into FP accumulator
          this.emitExpression(item.value);
        }
        // Call PRINT ROM handler
        this.emitRomCall(ROM.PRINT, 'PRINT value');
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
      this.code.push({ mnemonic: 'phsm', operands: '$10,9', comment: 'push counter' });
      this.emitVariableLoad(stepRef);
      this.code.push({ mnemonic: 'ppsm', operands: '$19,9', comment: 'pop counter to temp' });
      // Swap for ROM call (left=counter in $10, right=step in $19)
      this.code.push({ mnemonic: 'ldm', operands: '$28,9', comment: 'temp = step' });
      this.code.push({ mnemonic: 'ldm', operands: '$10,$19,9', comment: 'acc = counter' });
      this.code.push({ mnemonic: 'ldm', operands: '$19,$28,9', comment: 'temp = step' });
      this.emitRomCall(ROM.FP_ADD, 'counter + step');
      this.emitVariableStore(loopVar);

      // Compare: counter - limit
      this.emitVariableLoad(loopVar);
      this.code.push({ mnemonic: 'phsm', operands: '$10,9', comment: 'push counter' });
      this.emitVariableLoad(limitRef);
      this.code.push({ mnemonic: 'ppsm', operands: '$19,9', comment: 'pop counter to temp' });
      this.code.push({ mnemonic: 'ldm', operands: '$28,9', comment: 'temp = limit' });
      this.code.push({ mnemonic: 'ldm', operands: '$10,$19,9', comment: 'acc = counter' });
      this.code.push({ mnemonic: 'ldm', operands: '$19,$28,9', comment: 'temp = limit' });
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
      this.code.push({ mnemonic: 'phsm', operands: '$10,9', comment: 'push left' });
      this.emitExpression(expr.right);
      this.code.push({ mnemonic: 'ppsm', operands: '$19,9', comment: 'pop left to temp' });
      // Swap for subtract
      this.code.push({ mnemonic: 'ldm', operands: '$28,9', comment: 'temp = right' });
      this.code.push({ mnemonic: 'ldm', operands: '$10,$19,9', comment: 'acc = left' });
      this.code.push({ mnemonic: 'ldm', operands: '$19,$28,9', comment: 'temp = right' });
      this.emitRomCall(ROM.FP_SUB, `compare: ${expr.op}`);
      // Flags are now set based on left - right
    } else {
      // Non-comparison condition: evaluate and test for zero
      this.emitExpression(expr);
    }
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
      default: return stmt.type.toUpperCase();
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
