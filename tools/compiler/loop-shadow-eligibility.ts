// tools/compiler/loop-shadow-eligibility.ts
import type { Program, Statement, Expression, ForStatement } from './ast.js';
import { isIntegerEligibleExpr } from './type-inference.js';

const FAST_PATH_OPS = new Set(['+', '-', '*', 'mod', '=', '<>', '<', '>', '<=', '>=']);

/**
 * Does `expr` contain a reference to `name` ANYWHERE in its tree? Used as the
 * conservative fallback for any expression context this design doesn't treat
 * as a safe operand position for the loop counter.
 */
function referencesVariable(expr: Expression, name: string): boolean {
  switch (expr.type) {
    case 'variable':
      return expr.ref.name === name || (expr.ref.indices?.some(i => referencesVariable(i, name)) ?? false);
    case 'binary':
      return referencesVariable(expr.left, name) || referencesVariable(expr.right, name);
    case 'unary':
      return referencesVariable(expr.operand, name);
    case 'builtin-call':
    case 'fn-call':
      return expr.args.some(a => referencesVariable(a, name));
    case 'array-access':
      return expr.indices.some(i => referencesVariable(i, name));
    default:
      return false; // number, string, hex-literal
  }
}

/**
 * Is `expr`, used as one direct operand of an already-confirmed fast-path
 * binary/comparison op, a SAFE operand with respect to `counterName`? Either
 * it's the counter itself (terminates safely), a nested fast-path binary
 * expression that recursively satisfies the same property, or an expression
 * that doesn't touch the counter at all and is integer-eligible as a whole.
 */
function isSafeOperand(expr: Expression, counterName: string, integerEligible: Set<string>): boolean {
  if (expr.type === 'variable' && expr.ref.name === counterName && !expr.ref.indices) return true;
  if (expr.type === 'binary' && FAST_PATH_OPS.has(expr.op)) {
    return isSafeOperand(expr.left, counterName, integerEligible) && isSafeOperand(expr.right, counterName, integerEligible);
  }
  if (referencesVariable(expr, counterName)) return false; // counter buried in an unsafe position
  return isIntegerEligibleExpr(expr, integerEligible);
}

/**
 * Top-level check for an arbitrary expression slot found in the loop body:
 * true = violates condition 3 (a use of the counter that isn't safely
 * positioned). A bare reference to the counter reaching this function
 * (rather than being consumed by the binary-op case) means it was NOT a
 * direct operand of a fast-path op at all -- e.g. `X=K`, a builtin argument,
 * an array index, or nested under `and`/`or`/unary/`/`.
 */
function violatesCounterUsage(expr: Expression, counterName: string, integerEligible: Set<string>): boolean {
  if (expr.type === 'variable') {
    return expr.ref.name === counterName || (expr.ref.indices?.some(i => violatesCounterUsage(i, counterName, integerEligible)) ?? false);
  }
  if (expr.type === 'binary') {
    if (FAST_PATH_OPS.has(expr.op)) {
      const leftIsCounter = expr.left.type === 'variable' && expr.left.ref.name === counterName;
      const rightIsCounter = expr.right.type === 'variable' && expr.right.ref.name === counterName;
      if (leftIsCounter || rightIsCounter) {
        // At least one side directly references the counter -- validate both
        // sides as safe operands (this also re-validates the counter side,
        // which trivially passes).
        return !isSafeOperand(expr.left, counterName, integerEligible) || !isSafeOperand(expr.right, counterName, integerEligible);
      }
      // Neither side is a BARE counter reference, but the counter could still
      // be nested deeper (e.g. `(K+1)*2`) -- recurse into both sides with the
      // same top-level check.
      return violatesCounterUsage(expr.left, counterName, integerEligible) || violatesCounterUsage(expr.right, counterName, integerEligible);
    }
    // A binary op this design never fast-paths (/, ^, and, or, xor, ¥): no
    // safe context exists anywhere inside it.
    return referencesVariable(expr.left, counterName) || referencesVariable(expr.right, counterName);
  }
  if (expr.type === 'unary') return referencesVariable(expr.operand, counterName);
  if (expr.type === 'builtin-call' || expr.type === 'fn-call') return expr.args.some(a => referencesVariable(a, counterName));
  if (expr.type === 'array-access') return expr.indices.some(i => referencesVariable(i, counterName));
  return false; // number, string, hex-literal
}

/**
 * Same check as `violatesCounterUsage`, EXCEPT: a bare (unindexed) reference
 * to the counter as the WHOLE expression is safe here. PRINT always
 * materializes its printed value through the ROM's BCD-based print routine
 * regardless of what the source expression looked like, so codegen can
 * convert the shadowed int16 counter back to BCD at the print call site --
 * `PRINT K` doesn't need K to already be a direct operand of a fast-path op.
 * Anything else (the counter nested inside an array index, a builtin/FN
 * argument, a non-fast-path binary, etc.) is unchanged from the ordinary
 * rule: no safe context exists there.
 *
 * Deliberately scoped to exactly `PrintStatement`'s printed `value` items --
 * the only context the eligibility tests actually exercise this in. Every
 * other expression slot (including `PRINT`'s own `TAB()` column and `USING`
 * expressions, and all of `PrintFileStatement`) stays on the strict rule:
 * relaxing further without a test proving it's safe risks exactly the
 * silent-wrong-answer failure mode this module exists to prevent.
 */
function violatesCounterUsageAsPrintArg(expr: Expression, counterName: string, integerEligible: Set<string>): boolean {
  if (expr.type === 'variable' && expr.ref.name === counterName && !expr.ref.indices) return false;
  return violatesCounterUsage(expr, counterName, integerEligible);
}

const UNKNOWN = Symbol('unknown-statement-shape');

/**
 * Every Expression slot a statement directly holds (NOT recursing into
 * nested statement lists like `if`'s branches -- the body-walk below handles
 * that separately), plus every scalar VarRef a statement directly writes to.
 * `exprs` are checked with the strict rule (`violatesCounterUsage`);
 * `printExprs` (currently only a PRINT statement's printed `value` items)
 * are checked with the relaxed rule (`violatesCounterUsageAsPrintArg`) that
 * additionally permits a bare counter reference. Exhaustive over every
 * Statement variant in ast.ts as of this writing. A FUTURE statement type
 * not listed here falls into the `default` case and returns UNKNOWN, which
 * the caller treats as an automatic disqualification -- silence must never
 * be mistaken for safety in this specific check (an unhandled statement
 * type could hide a write to, or an unsafe use of, the counter that this
 * scan would otherwise miss).
 */
function statementShape(stmt: Statement): { exprs: Expression[]; printExprs?: Expression[]; writes: string[] } | typeof UNKNOWN {
  switch (stmt.type) {
    case 'let':
      return {
        exprs: [stmt.expr, ...(stmt.variable.indices ?? [])],
        writes: stmt.variable.isString || stmt.variable.indices ? [] : [stmt.variable.name],
      };
    case 'print':
      return {
        exprs: [
          ...stmt.items.filter(i => i.type === 'tab').map(i => (i as { col: Expression }).col),
          ...(stmt.using ? [stmt.using] : []),
        ],
        // Printed VALUES get the relaxed check (see violatesCounterUsageAsPrintArg)
        // -- TAB()/USING expressions do not, since no test establishes they're safe.
        printExprs: stmt.items.filter(i => i.type === 'expr').map(i => (i as { value: Expression }).value),
        writes: [],
      };
    case 'print-file':
      return {
        exprs: [
          ...stmt.items.filter(i => i.type === 'expr').map(i => (i as { value: Expression }).value),
          ...stmt.items.filter(i => i.type === 'tab').map(i => (i as { col: Expression }).col),
          stmt.filenum,
        ],
        writes: [],
      };
    case 'cls': case 'beep': case 'goto': case 'gosub': case 'return': case 'rem':
    case 'next': case 'wend': case 'end': case 'on-error-goto': case 'resume':
    case 'restore': case 'erase': case 'stat-clear': case 'data':
      return { exprs: [], writes: [] };
    case 'locate':
      return { exprs: [stmt.col, ...(stmt.row ? [stmt.row] : [])], writes: [] };
    case 'angle':
      return { exprs: [stmt.mode], writes: [] };
    case 'on-branch':
      return { exprs: [stmt.expr], writes: [] };
    case 'if':
      return { exprs: [stmt.condition], writes: [] }; // thenBranch/elseBranch handled by the body walk, not here
    case 'for':
      return {
        exprs: [stmt.from, stmt.to, ...(stmt.step ? [stmt.step] : [])],
        writes: stmt.variable.isString || stmt.variable.indices ? [] : [stmt.variable.name],
      };
    case 'while':
      return { exprs: [stmt.condition], writes: [] };
    case 'input': case 'read':
      return { exprs: [], writes: stmt.variables.filter(v => !v.isString && !v.indices).map(v => v.name) };
    case 'input-file':
      return { exprs: [stmt.filenum], writes: stmt.variables.filter(v => !v.isString && !v.indices).map(v => v.name) };
    case 'line-input-file':
      return {
        exprs: [stmt.filenum],
        writes: stmt.variable.isString || stmt.variable.indices ? [] : [stmt.variable.name],
      };
    case 'dim':
      return { exprs: stmt.decls.flatMap(d => d.dimensions), writes: [] };
    case 'clear':
      return { exprs: stmt.stringArea ? [stmt.stringArea] : [], writes: [] };
    case 'defm':
      return { exprs: [stmt.size], writes: [] };
    case 'defseg':
      return { exprs: [stmt.segment], writes: [] };
    case 'poke':
      return { exprs: [stmt.address, stmt.value], writes: [] };
    case 'def-fn':
      return { exprs: [stmt.body], writes: [] };
    case 'open':
      return { exprs: [stmt.filename, stmt.mode, stmt.filenum], writes: [] };
    case 'close':
      return { exprs: stmt.filenum ? [stmt.filenum] : [], writes: [] };
    case 'write-file':
      return { exprs: [...stmt.items, stmt.filenum], writes: [] };
    case 'stat':
      return { exprs: stmt.data, writes: [] };
    case 'defchr':
      return { exprs: [stmt.code, stmt.pattern], writes: [] };
    case 'chain':
      return { exprs: [stmt.filename], writes: [] };
    case 'mode':
      return { exprs: [stmt.number, ...(stmt.args ?? [])], writes: [] };
    default: {
      const _exhaustive: never = stmt;
      return UNKNOWN;
    }
  }
}

interface OpenLoop {
  forStmt: ForStatement;
  varName: string;
  forLine: number;
  bodyStatements: Statement[];
}

/**
 * Recursively collect every statement reachable inside `if` branches too,
 * appending each one to every currently open loop's accumulated body. `for`
 * pushes a new open loop; `next` closes one (mirroring codegen.ts's own
 * forStack/findForLoop pairing exactly -- see that file's emitNext/
 * findForLoop, codegen.ts:1325-1406).
 *
 * A nested `FOR` statement is ALSO registered as a body statement against
 * every loop that is already open at the point it's encountered (but not
 * against the new loop it starts, whose own body begins empty). This is
 * required for soundness: a nested loop reusing an enclosing loop's counter
 * name performs a write to that name (its own initial assignment) that is a
 * genuine hazard for the enclosing loop's shadowed value, and statementShape
 * already has an explicit `for` case (`writes: [stmt.variable.name]`) meant
 * to catch exactly this -- it only fires if the FOR statement actually
 * reaches an enclosing loop's bodyStatements list.
 */
function walkProgram(program: Program, onLoopClosed: (loop: OpenLoop, nextLine: number) => void): void {
  const openLoops: OpenLoop[] = [];

  function closeLoop(varName: string | null, line: number): void {
    let idx = -1;
    if (varName !== null) {
      for (let i = openLoops.length - 1; i >= 0; i--) {
        if (openLoops[i].varName === varName) { idx = i; break; }
      }
    }
    if (idx < 0) idx = openLoops.length - 1; // NEXT with no match, or no name: close innermost
    if (idx < 0) return; // NEXT without FOR -- not this pass's concern
    const [closed] = openLoops.splice(idx, 1);
    onLoopClosed(closed, line);
  }

  function visit(stmt: Statement, line: number): void {
    if (stmt.type === 'for') {
      // Register against loops already open BEFORE this one starts -- see
      // the doc comment above for why this matters.
      for (const open of openLoops) open.bodyStatements.push(stmt);
      openLoops.push({ forStmt: stmt, varName: stmt.variable.name, forLine: line, bodyStatements: [] });
      return;
    }
    if (stmt.type === 'next') {
      const names = stmt.variables.length > 0 ? stmt.variables.map(v => v.name) : [null];
      for (const n of names) closeLoop(n, line);
      return;
    }
    for (const open of openLoops) open.bodyStatements.push(stmt);
    if (stmt.type === 'if') {
      for (const s of stmt.thenBranch) visit(s, line);
      if (stmt.elseBranch) for (const s of stmt.elseBranch) visit(s, line);
    }
  }

  const sortedLines = [...program.lines.keys()].sort((a, b) => a - b);
  for (const line of sortedLines) {
    for (const stmt of program.lines.get(line)!) visit(stmt, line);
  }
}

function bodyContainsOutOfSpanJump(body: Statement[], forLine: number, nextLine: number): boolean {
  for (const stmt of body) {
    if (stmt.type === 'goto' && (stmt.target < forLine || stmt.target > nextLine)) return true;
    if (stmt.type === 'on-branch' && stmt.kind === 'goto') {
      for (const t of stmt.targets) if (t.line < forLine || t.line > nextLine) return true;
    }
  }
  return false;
}

export function analyzeLoopShadowEligibility(program: Program, integerEligible: Set<string>): Map<ForStatement, boolean> {
  const result = new Map<ForStatement, boolean>();

  walkProgram(program, (loop, nextLine) => {
    const { forStmt, varName, forLine, bodyStatements } = loop;

    // Condition 1: counter, limit, and step are all integer-eligible.
    // integerEligible already reflects this for the counter itself (Task
    // 1's own for-statement handling requires from/to/step to all be
    // integer expressions), but check the counter name explicitly too --
    // cheap, and future-proofs against Task 1 changing shape.
    if (!integerEligible.has(varName)) {
      result.set(forStmt, false);
      return;
    }

    // Condition 4: no GOTO/ON GOTO out of the loop's own line span.
    if (bodyContainsOutOfSpanJump(bodyStatements, forLine, nextLine)) {
      result.set(forStmt, false);
      return;
    }

    // Conditions 2 and 3, combined per statement.
    for (const stmt of bodyStatements) {
      const shape = statementShape(stmt);
      if (shape === UNKNOWN) {
        result.set(forStmt, false);
        return;
      }
      if (shape.writes.includes(varName)) {
        result.set(forStmt, false);
        return;
      }
      for (const expr of shape.exprs) {
        if (violatesCounterUsage(expr, varName, integerEligible)) {
          result.set(forStmt, false);
          return;
        }
      }
      for (const expr of shape.printExprs ?? []) {
        if (violatesCounterUsageAsPrintArg(expr, varName, integerEligible)) {
          result.set(forStmt, false);
          return;
        }
      }
    }

    result.set(forStmt, true);
  });

  return result;
}
