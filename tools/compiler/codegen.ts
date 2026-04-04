// tools/compiler/codegen.ts
// Code generator: takes a parsed BASIC AST and produces annotated HD61700 assembly (AsmLine[])

import type { Program, Statement, Expression, VarRef } from './ast.js';
import type { AsmLine, AsmProgram } from './asm-types.js';

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
// Code generator state
// ---------------------------------------------------------------------------

class CodeGen {
  private code: AsmLine[] = [];
  private variables = new Map<string, VarInfo>();
  private strings: StringInfo[] = [];
  private stringIndex = 0;

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
  // Statement emission
  // -------------------------------------------------------------------------

  private emitStatement(stmt: Statement): void {
    switch (stmt.type) {
      case 'cls':
        this.emitRomCall('&H2ADF', 'CLS');
        break;

      case 'beep':
        this.emitRomCall('&H33B3', 'BEEP');
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

      default:
        this.code.push({ comment: `TODO: ${stmt.type} not yet implemented` });
        break;
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
  // PRINT (placeholder for Task 10)
  // -------------------------------------------------------------------------

  private emitPrint(stmt: { type: 'print'; items: any[]; using?: any }): void {
    // For string literal items, allocate string and emit a stub ROM call
    for (const item of stmt.items) {
      if (item.type === 'expr' && item.value.type === 'string') {
        const strInfo = this.allocString(item.value.value);
        this.code.push({
          comment: `PRINT string: ${strInfo.label}`,
        });
      }
    }
    this.code.push({ comment: 'TODO: full PRINT implementation (Task 10)' });
    this.emitRomCall('&H2B03', 'PRINT stub');
  }

  // -------------------------------------------------------------------------
  // LET (simple numeric constant assignment)
  // -------------------------------------------------------------------------

  private emitLet(stmt: { type: 'let'; variable: VarRef; expr: Expression }): void {
    const varInfo = this.allocVariable(stmt.variable);

    if (stmt.expr.type === 'number') {
      // Simple numeric constant — store value at variable address
      // For now, emit a load-immediate + store sequence
      const val = stmt.expr.value;
      this.code.push({
        comment: `LET ${stmt.variable.name} = ${val}`,
      });
      // Load address of variable into $0
      this.code.push({
        mnemonic: 'ldw',
        operands: `$0,${varInfo.label}`,
        comment: `address of ${stmt.variable.name}`,
      });
      // Load value into $2
      this.code.push({
        mnemonic: 'ldw',
        operands: `$2,${this.formatNumber(val)}`,
        comment: `value ${val}`,
      });
      // Store (placeholder — full BCD conversion in Task 10)
      this.code.push({
        comment: 'TODO: BCD conversion + store (Task 10)',
      });
    } else {
      // Complex expression — defer to Task 10
      this.code.push({
        comment: `TODO: expression evaluation for LET ${stmt.variable.name} (Task 10)`,
      });
    }

    // Always ensure variable is allocated (side effect of allocVariable above)
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
      default: return stmt.type.toUpperCase();
    }
  }

  private exprToSource(expr: Expression): string {
    switch (expr.type) {
      case 'number': return String(expr.value);
      case 'string': return `"${expr.value}"`;
      case 'variable': return expr.ref.name;
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
