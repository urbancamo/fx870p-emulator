// tools/compiler/type-inference.ts
import type { Program, Statement, Expression } from './ast.js';

/**
 * Classify every scalar numeric variable in the program as integer-eligible
 * (every value ever assigned to it is provably a whole number in a compiler-
 * known-safe form) or not. Whole-variable, whole-program: a single
 * non-integer assignment anywhere makes the variable ineligible everywhere,
 * including at other assignment sites that look integer on their own.
 *
 * This is deliberately conservative and does not attempt reachability
 * analysis (e.g. an unreachable GOSUB target's assignment still counts) —
 * simplicity and soundness are worth more here than precision.
 */
export function inferIntegerEligibility(program: Program): Set<string> {
  const ineligible = new Set<string>();
  const everAssigned = new Set<string>();

  function isIntegerExpr(expr: Expression): boolean {
    if (expr.type === 'number') {
      return Number.isInteger(expr.value) && !expr.hasDecimalPoint;
    }
    if (expr.type === 'variable' && !expr.ref.isString && !expr.ref.indices) {
      // Plain scalar reference (indices present = array access, always
      // bcd-only, excluded here). Optimistically eligible on this first
      // pass; corrected in the propagation pass below once every
      // assignment site has been seen.
      everAssigned.add(expr.ref.name);
      return true;
    }
    if (expr.type === 'binary' && ['+', '-', '*', 'mod'].includes(expr.op)) {
      // '/' is deliberately excluded: +/-/*/MOD are integer-closed (both
      // operands integer implies an integer result), but division is not
      // (5/2 = 2.5). A variable assigned only from A/B is therefore never
      // provably whole from its syntax alone, even when A and B both are.
      return isIntegerExpr(expr.left) && isIntegerExpr(expr.right);
    }
    return false;
  }

  function markIneligible(name: string): void {
    everAssigned.add(name);
    ineligible.add(name);
  }

  function visitAssignment(name: string, expr: Expression): void {
    everAssigned.add(name);
    if (!isIntegerExpr(expr)) ineligible.add(name);
  }

  // Statements that assign a scalar variable from a source the compiler
  // cannot see the value of at compile time (keyboard input, a serial
  // file read) are unconditionally ineligible — same reasoning as INPUT,
  // regardless of what the program does with the value afterward.
  function visitUnknowableSource(vars: { name: string; isString: boolean; indices?: unknown }[]): void {
    for (const v of vars) if (!v.isString && !v.indices) markIneligible(v.name);
  }

  function visitStatement(stmt: Statement): void {
    switch (stmt.type) {
      case 'let':
        if (!stmt.variable.isString && !stmt.variable.indices) {
          visitAssignment(stmt.variable.name, stmt.expr);
        }
        break;
      case 'input':
        visitUnknowableSource(stmt.variables);
        break;
      case 'read':
        // DATA values ARE known at compile time, but correlating a READ
        // statement with the specific DATA values it will consume (in
        // program order, across possible RESTORE calls) is a materially
        // harder analysis than anything else in this pass. Treat exactly
        // like INPUT: unconditionally bcd-only. Simple, safe, and this
        // plan's target program (PRIMES.BAS) uses neither READ nor INPUT,
        // so nothing exercising the fast path needs this to be smarter.
        visitUnknowableSource(stmt.variables);
        break;
      case 'input-file':
        visitUnknowableSource(stmt.variables);
        break;
      case 'line-input-file':
        visitUnknowableSource([stmt.variable]);
        break;
      case 'for':
        if (!stmt.variable.isString && !stmt.variable.indices) {
          visitAssignment(stmt.variable.name, stmt.from);
          if (!isIntegerExpr(stmt.to)) ineligible.add(stmt.variable.name);
          if (stmt.step && !isIntegerExpr(stmt.step)) ineligible.add(stmt.variable.name);
        }
        break;
      case 'if':
        for (const s of stmt.thenBranch) visitStatement(s);
        if (stmt.elseBranch) for (const s of stmt.elseBranch) visitStatement(s);
        break;
      // other statement types (PRINT, GOTO, GOSUB, RETURN, DIM, CLS, ...)
      // don't assign a scalar numeric variable.
    }
  }

  for (const [, stmts] of program.lines) {
    for (const stmt of stmts) visitStatement(stmt);
  }

  // Propagate ineligibility through variable-to-variable references.
  // Re-walk until no new variable becomes ineligible (a variable
  // referencing another variable pass 1 didn't yet know was ineligible —
  // order-independent, since BASIC line numbers don't imply evaluation
  // order for a variable referenced before its own later disqualifying
  // assignment, e.g. inside a GOSUB target that appears after its callers).
  //
  // Convergence is driven by ineligible.size growth rather than a
  // manually-set "changed" flag: ineligible only ever grows and Set.add is
  // idempotent, so checking size before/after each sweep guarantees
  // termination even if an individual branch below forgets to gate its
  // ineligible.add() call behind an "is this actually new" check — that
  // exact omission (an unconditional add on every sweep in the `for`
  // branch) previously caused an infinite loop for programs like
  // `FOR I=1 TO N` where N is bcd-only.
  function exprTouchesIneligible(expr: Expression): boolean {
    if (expr.type === 'variable' && !expr.ref.isString) {
      return expr.ref.indices !== undefined || ineligible.has(expr.ref.name);
    }
    if (expr.type === 'binary') return exprTouchesIneligible(expr.left) || exprTouchesIneligible(expr.right);
    return false;
  }
  function recheckStatement(stmt: Statement): void {
    switch (stmt.type) {
      case 'let':
        if (!stmt.variable.isString && !stmt.variable.indices) {
          if (exprTouchesIneligible(stmt.expr)) ineligible.add(stmt.variable.name);
        }
        break;
      case 'for':
        if (!stmt.variable.isString && !stmt.variable.indices) {
          if (exprTouchesIneligible(stmt.from)) ineligible.add(stmt.variable.name);
          if (exprTouchesIneligible(stmt.to)) ineligible.add(stmt.variable.name);
          if (stmt.step && exprTouchesIneligible(stmt.step)) ineligible.add(stmt.variable.name);
        }
        break;
      case 'if':
        for (const s of stmt.thenBranch) recheckStatement(s);
        if (stmt.elseBranch) for (const s of stmt.elseBranch) recheckStatement(s);
        break;
    }
  }
  let sizeBefore: number;
  do {
    sizeBefore = ineligible.size;
    for (const [, stmts] of program.lines) for (const stmt of stmts) recheckStatement(stmt);
  } while (ineligible.size !== sizeBefore);

  const eligible = new Set<string>();
  for (const name of everAssigned) if (!ineligible.has(name)) eligible.add(name);
  return eligible;
}

/**
 * Pure predicate: is `expr`, given an already-computed integer-eligible set,
 * itself provably a whole number? Same structural rule as
 * inferIntegerEligibility's internal isIntegerExpr, but with no side effects
 * and taking the eligible set as input rather than building it. Shared by
 * loop-shadow-eligibility.ts and codegen.ts's shadow-aware fast path.
 */
export function isIntegerEligibleExpr(expr: Expression, integerEligible: Set<string>): boolean {
  if (expr.type === 'number') {
    return Number.isInteger(expr.value) && !expr.hasDecimalPoint;
  }
  if (expr.type === 'variable' && !expr.ref.isString && !expr.ref.indices) {
    return integerEligible.has(expr.ref.name);
  }
  if (expr.type === 'binary' && ['+', '-', '*', 'mod'].includes(expr.op)) {
    // '/' excluded: never integer-closed (5/2=2.5), matching
    // inferIntegerEligibility's own exclusion and its documented reasoning.
    return isIntegerEligibleExpr(expr.left, integerEligible) && isIntegerEligibleExpr(expr.right, integerEligible);
  }
  return false;
}
