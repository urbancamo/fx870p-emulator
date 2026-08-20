# Loop-Scoped Integer Arithmetic Shadowing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make a `FOR` loop's own bookkeeping (the increment + limit test `NEXT` pays every single iteration, currently via a full ROM `FP_ADD` and BCD comparison regardless of loop body content) skip the ROM's BCD library entirely when the loop qualifies, and let in-body references to the loop counter reuse that same native value — amortizing the BCD↔int16 conversion cost across the loop's whole lifetime instead of paying it per operation.

**Architecture:** A new static pass (`loop-shadow-eligibility.ts`) decides, per `FOR` statement, whether its counter/limit/step are always whole numbers (reusing Task 1's `inferIntegerEligibility()`) and whether the loop body only ever touches the counter in a safe, fast-path-able way. A qualifying loop gets three 2-byte RAM "shadow" slots (counter/limit/step) plus a 1-byte `SHADOW_ACTIVE` runtime flag — decoded once at loop entry, kept live natively for the loop's duration, encoded back to BCD once at exit. `NEXT`'s tail and every in-body expression that references the counter check `SHADOW_ACTIVE` at runtime and choose between the native-shadow code shape and today's unmodified BCD code shape — never duplicating the loop body itself.

**Tech Stack:** TypeScript compiler (`tools/compiler/`), HD61700 assembly codegen, Vitest, the headless `EmulatorSession` harness (`tools/emu-debugger/`) for real-ROM verification.

**Spec:** `docs/superpowers/specs/2026-08-17-compiler-integer-fastpath-loop-shadowing-design.md` — this plan implements that design (Components, Data Flow, Error Handling, Testing sections in particular). Also depends on the still-current `docs/superpowers/specs/2026-08-15-compiler-integer-fastpath-design.md` for the BCD format and Tasks 1-2's already-implemented conversion subroutines.

## Global Constraints

- Integer range is 16-bit **signed**: −32768..32767. Any value that doesn't fit — at loop entry, or as an in-body arithmetic result — falls back to the existing BCD path, never silently wraps or truncates.
- No change to variable storage layout for BASIC-visible variables — they stay 9-byte BCD. Shadow slots are new, compiler-internal, RAM-only storage, never visible to `DIM`/`PRINT`/`DATA`/array access.
- **Shadow slots must use a separate allocation map from `allocVariable`/`this.variables`** (codegen.ts:2090-2103). That map's entries are always 9 or 256 bytes, get emitted as `DS 9`/`DS 256` (codegen.ts:271-282), and are read by `listing.ts`'s Symbol Table — a 2-byte or 1-byte shadow slot in that map would corrupt both.
- Register conventions already established and must not be violated: **never use `$30`/`$31`** (ROM globals). `BCD_TO_INT16` (in: `$10-$18`, out: `$0/$1`, status `$9`, clobbers `$0-$9`) and `INT16_TO_BCD` (in: `$0/$1`, out: `$10-$18`, clobbers `$0-$9`) are already implemented (Task 2, commit `2c95728`) — read `codegen.ts:900-955`'s register-convention comment before writing any code that calls them.
- On overflow inside a shadow-active operation, the fallback to BCD must never reload the counter's `VAR_${varName}` memory — it is stale mid-loop by design (only refreshed at loop exit). The fallback must encode the shadow's *current* value via `INT16_TO_BCD` instead. Getting this backwards is a silent-wrong-answer bug, not a crash — see the design's Error Handling section.
- Every claim about HD61700 instruction semantics, condition-code behavior, or overflow-flag behavior **must be verified against `src/emulator/exec.ts`/`def.ts` and proven empirically via `EmulatorSession`**, not assumed from mnemonic naming. This branch's entire history has repeatedly found assumptions about this CPU's semantics wrong until checked against the real emulator.
- Every task's correctness claim must be proven by actually running compiled code through `EmulatorSession` and checking real memory/register values — a codegen-level "the right instructions got emitted" test is necessary but never sufficient on its own.
- A statically shadow-eligible loop that turns out runtime-inactive (`SHADOW_ACTIVE=0`) must behave identically, in every observable way, to a loop the static scan disqualified outright.

---

## Background you need before starting

Read `docs/superpowers/specs/2026-08-17-compiler-integer-fastpath-loop-shadowing-design.md` in full first — this plan assumes familiarity with it and won't re-derive its reasoning. In particular:
- Why this replaces a per-operation fast path (Task 2's cycle-cost table found naive `+`/`-` fast-pathing would be a net *slowdown*).
- The 4 static disqualifying conditions (integer-eligibility; no body write to counter/limit/step outside `NEXT`; every counter reference is a direct operand of a fast-path-eligible op with an integer-eligible sibling; no `GOTO`/`ON GOTO`/`ON GOSUB` out of the loop span).
- Why `SHADOW_ACTIVE` exists as a *runtime* flag on top of the *static* eligibility scan.

Also relevant, already implemented and not to be re-derived:
- `tools/compiler/type-inference.ts`'s `inferIntegerEligibility()` (Task 1) — the `Set<string>` of integer-eligible variable names this plan's eligibility scan and codegen changes both consume.
- `codegen.ts:900-1140`'s `BCD_TO_INT16`/`INT16_TO_BCD` shared subroutines and their `emitBcdToInt16()`/`emitInt16ToBcd()` call-site helpers (Task 2).
- `codegen.ts:1290-1395`'s current `emitFor`/`emitNext`/`findForLoop` — this plan modifies these directly; read them first.
- `codegen.ts:633-719`'s current `emitBinaryExpr` and (around line 1534) `emitComparisonBranch` — this plan adds a new branch at the top of each; read them first.

---

### Task 1: Wire integer-eligibility into `CodeGen`, shared `isIntegerEligibleExpr` helper

**Files:**
- Modify: `tools/compiler/type-inference.ts`, `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`

**Interfaces:**
- Consumes: `inferIntegerEligibility()` (already exists, Task 1 of the original plan).
- Produces: `type-inference.ts` gains an exported pure predicate `isIntegerEligibleExpr(expr, integerEligible): boolean`, used by both Task 2 (this plan) and Task 5 (this plan). `CodeGen` gains a `private integerEligible: Set<string>` field, populated at the start of `generate()`. Nothing outside this file currently populates or reads this field — it has no callers yet until Task 2 onward.

This is pure wiring — no behavior changes to any existing test.

- [ ] **Step 1: Write the failing test**

```typescript
// in tools/compiler/tests/codegen.test.ts
import { isIntegerEligibleExpr } from '../type-inference.js';

  it('isIntegerEligibleExpr classifies literals, eligible variables, and eligible binary chains', () => {
    const eligible = new Set(['A', 'B']);
    expect(isIntegerEligibleExpr({ type: 'number', value: 5, hasDecimalPoint: false }, eligible)).toBe(true);
    expect(isIntegerEligibleExpr({ type: 'number', value: 5, hasDecimalPoint: true }, eligible)).toBe(false);
    expect(isIntegerEligibleExpr({ type: 'variable', ref: { name: 'A', isString: false } }, eligible)).toBe(true);
    expect(isIntegerEligibleExpr({ type: 'variable', ref: { name: 'X', isString: false } }, eligible)).toBe(false);
    const sum = { type: 'binary', op: '+', left: { type: 'variable', ref: { name: 'A', isString: false } }, right: { type: 'variable', ref: { name: 'B', isString: false } } } as const;
    expect(isIntegerEligibleExpr(sum, eligible)).toBe(true);
    const div = { type: 'binary', op: '/', left: sum.left, right: sum.right } as const;
    expect(isIntegerEligibleExpr(div, eligible)).toBe(false); // '/' is never integer-closed, matches Task 1's own exclusion
  });

  it('CodeGen.generate() populates integerEligible from inferIntegerEligibility() before emitting any statement', () => {
    // Compile a program with one integer-eligible and one bcd-only variable,
    // and confirm generate() doesn't throw and produces the same output as
    // before this task for a program with no FOR loops (pure regression check
    // -- this task changes no observable codegen output by itself).
    const asm = generate(parse('10 A=5\n20 X=3.14\n30 END\n'));
    expect(asm.lines.length).toBeGreaterThan(0);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "isIntegerEligibleExpr"`
Expected: FAIL — `isIntegerEligibleExpr` isn't exported yet.

- [ ] **Step 3: Add the exported predicate to `type-inference.ts`**

Add below `inferIntegerEligibility` (do not touch that function's own internal `isIntegerExpr` — it has side effects (`everAssigned.add`) that are load-bearing for that function and must not be shared with this new pure predicate):

```typescript
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
```

- [ ] **Step 4: Wire `this.integerEligible` into `CodeGen`**

In `codegen.ts`, add the field near the other `private` fields (around line 122, alongside `private variables`):

```typescript
  private integerEligible: Set<string> = new Set();
```

At the very start of `generate(program: Program)` (before the `ORG` directive push, codegen.ts:134-138), add:

```typescript
    this.integerEligible = inferIntegerEligibility(program);
```

Add the import at the top of `codegen.ts`:

```typescript
import { inferIntegerEligibility } from './type-inference.js';
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "isIntegerEligibleExpr|integerEligible from inferIntegerEligibility"`
Expected: PASS.

- [ ] **Step 6: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS, same pass count as before this task (this step adds no new observable codegen behavior).

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/type-inference.ts tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): wire integer-eligibility into CodeGen, shared isIntegerEligibleExpr helper"
```

---

### Task 2: Static loop-shadow eligibility scan

**Files:**
- Create: `tools/compiler/loop-shadow-eligibility.ts`
- Test: `tools/compiler/tests/loop-shadow-eligibility.test.ts`

**Interfaces:**
- Consumes: `Program` (AST), `isIntegerEligibleExpr()` (Task 1).
- Produces: `analyzeLoopShadowEligibility(program: Program, integerEligible: Set<string>): Map<ForStatement, boolean>` — exported function, keyed by AST node identity (a `ForStatement` object is a unique reference within one parse). `true` = statically shadow-eligible. Consumed by Task 3 onward (`codegen.ts`).

This is pure AST analysis, no codegen or emulator involvement — fully testable via `parse()` output alone.

**The four conditions being checked** (see the design doc for full rationale):
1. Counter, limit (`to`), and step are all integer-eligible.
2. No statement in the loop body writes to the counter, limit, or step names, other than `NEXT`'s own implicit increment (which isn't a source AST node this scan ever sees).
3. Every reference to the counter inside the loop body is a **direct operand** of a binary or comparison operation (`+`,`-`,`*`,`mod`,`=`,`<>`,`<`,`>`,`<=`,`>=`) whose other direct operand is integer-eligible. Any other shape — bare (`X=K`), inside `PRINT`, an array index, a builtin/`FN` argument, nested inside a non-fast-path op like `/`/`^`/`and`/`or`/`xor`/unary minus — disqualifies.
4. No `GOTO`/`ON GOTO`/`ON GOSUB` in the body targets a line number outside the loop's own `[FOR line, NEXT line]` span (inclusive).

**FOR/NEXT pairing must mirror `codegen.ts`'s own runtime `forStack`/`findForLoop` semantics exactly** (codegen.ts:1395-1402: search the open-loop stack from the top for a name match; `NEXT` with no name, or no match found, closes the innermost). Using a different pairing rule here than codegen actually uses at generation time would let this scan attribute a loop's body to the wrong `FOR`/`NEXT` pair.

- [ ] **Step 1: Write the failing tests**

```typescript
// tools/compiler/tests/loop-shadow-eligibility.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../parser.js';
import { inferIntegerEligibility } from '../type-inference.js';
import { analyzeLoopShadowEligibility } from '../loop-shadow-eligibility.js';
import type { ForStatement } from '../ast.js';

function analyze(source: string) {
  const program = parse(source);
  const integerEligible = inferIntegerEligibility(program);
  const result = analyzeLoopShadowEligibility(program, integerEligible);
  // Find the (first, or only) ForStatement in program order for convenience.
  const forStmts: ForStatement[] = [];
  for (const [, stmts] of program.lines) for (const s of stmts) if (s.type === 'for') forStmts.push(s);
  return { result, forStmts };
}

describe('analyzeLoopShadowEligibility', () => {
  it('eligible: a simple integer counter/limit/step loop with no body hazards', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 PRINT "hi"\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('eligible: PRIMES.BAS-shaped loop with a runtime (non-literal) limit and an in-body comparison referencing the counter', () => {
    const { result, forStmts } = analyze(
      '10 N=100\n20 FOR K=2 TO N-1\n30 IF N MOD K = 0 THEN GOTO 50\n40 PRINT K\n50 NEXT K\n60 END\n'
    );
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 1: disqualified when the limit is not integer-eligible', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10.5\n20 NEXT K\n30 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 2: disqualified when the body writes to the counter outside NEXT', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 K=K+5\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 2: disqualified when a nested loop reuses the same counter name', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 FOR K=1 TO 3\n30 NEXT K\n40 NEXT K\n50 END\n');
    // forStmts[0] is the OUTER loop (encountered first in program order)
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is used bare (not as a direct operand of a fast-path op)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 X=K\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is used as an array index', () => {
    const { result, forStmts } = analyze('10 DIM A(20)\n20 FOR K=1 TO 10\n30 PRINT A(K)\n40 NEXT K\n50 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: disqualified when the counter is combined via a non-fast-path op (integer divide)', () => {
    const { result, forStmts } = analyze('10 FOR K=2 TO 10\n20 X=100/K\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 3: eligible when the counter appears nested inside a fast-path expression', () => {
    const { result, forStmts } = analyze('10 N=100\n20 FOR K=1 TO 10\n30 IF (K+1)*2>N THEN GOTO 50\n40 PRINT K\n50 NEXT K\n60 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 3: disqualified when the counter\'s sibling operand is not integer-eligible', () => {
    const { result, forStmts } = analyze('10 X=3.14\n20 FOR K=1 TO 10\n30 Y=K+X\n40 NEXT K\n50 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4: disqualified when a GOTO in the body jumps past NEXT', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 IF K=5 THEN GOTO 100\n30 NEXT K\n40 END\n100 PRINT "done"\n');
    expect(result.get(forStmts[0])).toBe(false);
  });

  it('condition 4: eligible when a GOTO inside the body only jumps within the loop span', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 IF K=5 THEN GOTO 25\n25 PRINT K\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('condition 4: GOSUB out of the loop body does NOT disqualify (it returns)', () => {
    const { result, forStmts } = analyze('10 FOR K=1 TO 10\n20 GOSUB 100\n30 NEXT K\n40 END\n100 PRINT "hi"\n110 RETURN\n');
    expect(result.get(forStmts[0])).toBe(true);
  });

  it('nested loops are evaluated independently: outer eligible, inner disqualified by an array index', () => {
    const { result, forStmts } = analyze(
      '10 DIM A(20)\n20 FOR K=1 TO 10\n30 FOR J=1 TO 5\n40 PRINT A(J)\n50 NEXT J\n60 NEXT K\n70 END\n'
    );
    const outer = forStmts.find(f => f.variable.name === 'K')!;
    const inner = forStmts.find(f => f.variable.name === 'J')!;
    expect(result.get(outer)).toBe(true);
    expect(result.get(inner)).toBe(false);
  });

  it('a bare INPUT-sourced variable used as TO makes the counter ineligible (condition 1, via Task 1)', () => {
    const { result, forStmts } = analyze('10 INPUT N\n20 FOR K=1 TO N\n30 NEXT K\n40 END\n');
    expect(result.get(forStmts[0])).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/loop-shadow-eligibility.test.ts`
Expected: FAIL — `loop-shadow-eligibility.ts` doesn't exist yet.

- [ ] **Step 3: Implement the scan**

```typescript
// tools/compiler/loop-shadow-eligibility.ts
import type { Program, Statement, Expression, ForStatement, VarRef } from './ast.js';
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

const UNKNOWN = Symbol('unknown-statement-shape');

/**
 * Every Expression slot a statement directly holds (NOT recursing into
 * nested statement lists like `if`'s branches -- the body-walk below handles
 * that separately), plus every scalar VarRef a statement directly writes to.
 * Exhaustive over every Statement variant in ast.ts as of this writing. A
 * FUTURE statement type not listed here falls into the `default` case and
 * returns UNKNOWN, which the caller treats as an automatic disqualification
 * -- silence must never be mistaken for safety in this specific check (an
 * unhandled statement type could hide a write to, or an unsafe use of, the
 * counter that this scan would otherwise miss).
 */
function statementShape(stmt: Statement): { exprs: Expression[]; writes: string[] } | typeof UNKNOWN {
  switch (stmt.type) {
    case 'let':
      return {
        exprs: [stmt.expr, ...(stmt.variable.indices ?? [])],
        writes: stmt.variable.isString || stmt.variable.indices ? [] : [stmt.variable.name],
      };
    case 'print':
      return {
        exprs: [
          ...stmt.items.filter(i => i.type === 'expr').map(i => (i as { value: Expression }).value),
          ...stmt.items.filter(i => i.type === 'tab').map(i => (i as { col: Expression }).col),
          ...(stmt.using ? [stmt.using] : []),
        ],
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
    default:
      return UNKNOWN;
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
 * findForLoop, codegen.ts:1321-1402).
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
    }

    result.set(forStmt, true);
  });

  return result;
}
```

Before implementing, re-check `ast.ts`'s exact `Statement` union against the `statementShape` switch above — it was written against the 41 variants enumerated in `ast.ts:8-49` as read while drafting this plan, and every one of them has an explicit `case` above (26 individual cases plus one 15-way combined no-op case for statement types with no expression-bearing fields: `cls`/`beep`/`goto`/`gosub`/`return`/`rem`/`next`/`wend`/`end`/`on-error-goto`/`resume`/`restore`/`erase`/`stat-clear`/`data`). Confirm this still matches `ast.ts` exactly before implementing — if a variant has been added, removed, or had fields changed since this plan was written, update the switch accordingly rather than assuming it's still accurate. Add a `default: { const _exhaustive: never = stmt; return UNKNOWN; }`-style exhaustiveness assertion (adjust to whatever idiom the rest of this codebase already uses for exhaustive switches, if any) so a genuinely new, future `Statement` variant fails to compile here rather than silently falling through to `UNKNOWN` at runtime with no compile-time signal.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/loop-shadow-eligibility.test.ts`
Expected: PASS (all 15 cases). If any fails, fix the scan — do not adjust a test's expectation to match a wrong result without re-deriving by hand which of the 4 conditions actually applies.

- [ ] **Step 5: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS, same pass count as before plus this task's new tests (this task adds a pure new module with no existing callers yet).

- [ ] **Step 6: Commit**

```bash
git add tools/compiler/loop-shadow-eligibility.ts tools/compiler/tests/loop-shadow-eligibility.test.ts
git commit -m "feat(compiler): static loop-shadow eligibility scan for FOR loops"
```

---

### Task 3: RAM shadow-slot allocation + `emitFor` runtime decode + `SHADOW_ACTIVE` flag

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`

**Interfaces:**
- Consumes: `analyzeLoopShadowEligibility()` (Task 2), `emitBcdToInt16()` (already exists).
- Produces: a new `private shadowSlots = new Map<string, { counter: string; limit: string; step: string; active: string }>()` allocation map on `CodeGen` (label names, NOT the old 9-byte `this.variables` map — see Global Constraints). A new `private shadowStack: Array<{ varName: string; counter: string; limit: string; step: string; active: string }> = []` tracking currently-open shadowed loops, consulted by Task 4/5. A new `private currentLine: number = 0` tracking which BASIC line is currently being emitted (needed to record where a shadowed loop actually is, for Task 6's listing). A new `private shadowedLoopsFound: { varName: string; line: number }[] = []`, appended to whenever a loop actually gets shadow slots allocated — consumed by Task 6. `emitFor` decodes counter/limit/step into the shadow slots and sets `SHADOW_ACTIVE` at runtime when the loop is statically shadow-eligible.

This task only changes `emitFor`'s entry-time behavior and the loop's shadow bookkeeping. `emitNext`'s tail (Task 4) and in-body expression codegen (Task 5) are separate tasks — after this task, a statically-eligible loop will decode into shadow slots at entry but nothing downstream consumes them yet, so no observable behavior changes until Task 4 lands. Verification for this task is therefore codegen-shape-only; the first real-emulator proof arrives in Task 4.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('emits shadow slot storage and an entry-time decode+SHADOW_ACTIVE sequence for a shadow-eligible FOR loop', () => {
    const asm = generate(parse('10 FOR K=1 TO 10\n20 PRINT K\n30 NEXT K\n40 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    // shadow slots exist as DS reservations, distinct from VAR_K
    expect(labels.some(l => l!.includes('SHADOW') && l!.includes('K'))).toBe(true);
    expect(labels).toContain('VAR_K'); // unchanged: the counter still gets its normal BCD slot too
    // BCD_TO_INT16 is called at least 3 times at loop entry (counter, limit, step)
    const decodeCalls = asm.lines.filter(l => l.mnemonic === 'cal' && l.operands === 'BCD_TO_INT16').length;
    expect(decodeCalls).toBeGreaterThanOrEqual(3);
  });

  it('does NOT emit shadow slots for a statically disqualified loop (array index in body)', () => {
    const asm = generate(parse('10 DIM A(20)\n20 FOR K=1 TO 10\n30 PRINT A(K)\n40 NEXT K\n50 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    expect(labels.some(l => l!.includes('SHADOW') && l!.includes('K'))).toBe(false);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "shadow slot storage"`
Expected: FAIL.

- [ ] **Step 3: Implement**

Add near the top of the `CodeGen` class (alongside `private variables`, `private forStack`):

```typescript
  private shadowEligibility: Map<ForStatement, boolean> = new Map();
  private shadowSlots = new Map<string, { counter: string; limit: string; step: string; active: string }>();
  private shadowStack: Array<{ varName: string; counter: string; limit: string; step: string; active: string }> = [];
  private currentLine = 0;
  private shadowedLoopsFound: { varName: string; line: number }[] = [];
```

In `generate()`'s main statement-emission loop (codegen.ts:182-196), set `this.currentLine` right before processing each line's statements:

```typescript
    for (const lineNum of sortedLineNums) {
      const stmts = program.lines.get(lineNum)!;
      this.currentLine = lineNum; // <-- add this line
      const source = this.reconstructSource(lineNum, stmts);
      // ...unchanged...
      for (const stmt of stmts) {
        this.emitStatement(stmt);
      }
    }
```

In `generate()`, right after the existing `this.integerEligible = inferIntegerEligibility(program);` line (Task 1), add:

```typescript
    this.shadowEligibility = analyzeLoopShadowEligibility(program, this.integerEligible);
```

with the import `import { analyzeLoopShadowEligibility } from './loop-shadow-eligibility.js';` and `import type { ForStatement } from './ast.js';` (or reuse whatever `ForStatement` import already exists in the file).

Add a shadow-slot allocator, following the exact pattern `allocVariable` uses but with its own map and 2-/1-byte sizes (codegen.ts:2090-2103 is the pattern to mirror, not extend):

```typescript
  private allocShadowSlots(varName: string): { counter: string; limit: string; step: string; active: string } {
    if (!this.shadowSlots.has(varName)) {
      this.shadowSlots.set(varName, {
        counter: `SHADOW_${varName.toUpperCase()}`,
        limit: `SHADOW_LIMIT_${varName.toUpperCase()}`,
        step: `SHADOW_STEP_${varName.toUpperCase()}`,
        active: `SHADOW_ACTIVE_${varName.toUpperCase()}`,
      });
    }
    return this.shadowSlots.get(varName)!;
  }
```

Emit their `DS` reservations in `generate()`'s output section, right after the existing "Variable table" block (codegen.ts:271-282) — do NOT fold them into `this.variables`'s own loop:

```typescript
    // 7a. Shadow slot storage (DS directives) -- separate from the variable
    // table on purpose: these are 1-2 byte compiler-internal int16/flag
    // slots, never 9-byte BCD, and must never be mistaken for a BASIC
    // variable by listing.ts's Symbol Table or anything else that assumes
    // every this.variables entry is 9 or 256 bytes.
    if (this.shadowSlots.size > 0) {
      this.code.push({ comment: 'Loop-shadow storage (int16 counter/limit/step + active flag)' });
      for (const [, slots] of this.shadowSlots) {
        this.code.push({ label: slots.counter, mnemonic: 'DS', operands: '2', comment: 'shadow: counter (int16)' });
        this.code.push({ label: slots.limit, mnemonic: 'DS', operands: '2', comment: 'shadow: limit (int16)' });
        this.code.push({ label: slots.step, mnemonic: 'DS', operands: '2', comment: 'shadow: step (int16)' });
        this.code.push({ label: slots.active, mnemonic: 'DS', operands: '1', comment: 'shadow: active flag' });
      }
    }
```

Modify `emitFor` (codegen.ts:1290-1319). Keep every existing line unchanged (the plain BCD stores of initial value/limit/step must still happen unconditionally — see Global Constraints), and append, right before pushing onto `forStack`:

```typescript
    // --- Loop-shadow entry (only for a statically shadow-eligible loop) ---
    if (this.shadowEligibility.get(stmt)) {
      const slots = this.allocShadowSlots(varName);
      // Decode counter (currently in $10-$18 from the initial-value store
      // above -- reload it, since emitVariableStore doesn't leave it there)
      // Verify empirically against exec.ts exactly how $9's status flag
      // combines across three decodes -- the intent is: active = 1 iff ALL
      // THREE decodes report $9=0 (fits int16), active = 0 if ANY does not.
      this.emitVariableLoad(stmt.variable);
      this.emitBcdToInt16('decode counter for shadow');
      this.code.push({ mnemonic: 'stw', operands: `$0,${slots.counter}`, comment: 'shadow counter <- decoded value' });
      this.code.push({ mnemonic: 'ld', operands: `$2,$9`, comment: 'save counter decode status' });

      this.emitVariableLoad(limitRef);
      this.emitBcdToInt16('decode limit for shadow');
      this.code.push({ mnemonic: 'stw', operands: `$0,${slots.limit}`, comment: 'shadow limit <- decoded value' });
      this.code.push({ mnemonic: 'or', operands: `$2,$9`, comment: 'accumulate decode status' });

      this.emitVariableLoad(stepRef);
      this.emitBcdToInt16('decode step for shadow');
      this.code.push({ mnemonic: 'stw', operands: `$0,${slots.step}`, comment: 'shadow step <- decoded value' });
      this.code.push({ mnemonic: 'or', operands: `$2,$9`, comment: 'accumulate decode status' });

      // $2 == 0 iff all three decodes succeeded ($9=0 every time, since
      // BCD_TO_INT16's $9 is 0=ok/1=fail and OR-ing zeros stays zero).
      // active = 1 when $2==0, else 0. Verify the exact instruction for
      // "boolean-invert a zero/nonzero flag into $2==0 ? 1 : 0" against
      // exec.ts -- do not assume a specific mnemonic without checking.
      const activeLabel = this.uniqueLabel(`SHADOW_INACTIVE_${varName}`);
      const doneLabel = this.uniqueLabel(`SHADOW_SETFLAG_DONE_${varName}`);
      this.code.push({ mnemonic: 'jr', operands: `nz,${activeLabel}`, comment: 'any decode failed -> inactive' });
      this.code.push({ mnemonic: 'ld', operands: `$3,&H01` });
      this.code.push({ mnemonic: 'jr', operands: doneLabel });
      this.code.push({ label: activeLabel, mnemonic: 'ld', operands: `$3,&H00` });
      this.code.push({ label: doneLabel, mnemonic: 'st', operands: `$3,${slots.active}`, comment: 'SHADOW_ACTIVE <- computed' });

      this.shadowStack.push({ varName, ...slots });
      this.shadowedLoopsFound.push({ varName, line: this.currentLine });
    }
```

`emitFor` needs access to `limitRef`/`stepRef` (already local variables in the existing function body) and to the `ForStatement` itself (`stmt`) to look it up in `this.shadowEligibility` — confirm the existing function signature already has `stmt: ForStatement` in scope (it does, per codegen.ts:1290).

**Before trusting any of the above instruction sequence**, verify against `src/emulator/exec.ts`:
- The exact status-combination approach for `$9` across three separate `BCD_TO_INT16` calls (does `$9` get clobbered between calls in a way that changes this OR-accumulation approach? `emitBcdToInt16`'s doc comment says it clobbers `$0-$9`, so `$2` must be saved OUTSIDE that range before each subsequent call, and it is above — but confirm `or $2,$9` behaves as expected for a `0`/`1`-only status byte, i.e. that OR-ing status flags this way can't produce a false negative).
- Whether `stw`/`st` (word/byte store to an absolute label) are the actual correct mnemonics this assembler uses for a direct-to-memory store (check `codegen.ts` elsewhere for a precedent, or `src/emulator/exec.ts`'s opcode table) — the codebase's existing `emitVariableLoad`/`emitVariableStore` might use a different indexed-addressing convention (e.g. via `ix`/`iz`) that has to be followed instead of a bare absolute store, if this CPU doesn't support one. **This is exactly the kind of assumption this plan's Global Constraints require verifying, not assuming.**

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "shadow slot storage|does NOT emit shadow slots"`
Expected: PASS.

- [ ] **Step 5: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS. In particular, confirm every existing `FOR`/`NEXT` test (from the original BCD arithmetic work) still passes unchanged — this task must not alter the plain BCD codegen path for a loop that isn't statically shadow-eligible.

- [ ] **Step 6: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): RAM shadow-slot allocation + emitFor entry-time decode with SHADOW_ACTIVE"
```

---

### Task 4: `emitNext` dual-tail codegen (shadowed increment/compare + BCD exit sync)

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/loop-shadow-next.test.ts`

**Interfaces:**
- Consumes: `this.shadowStack` (Task 3), `emitInt16ToBcd()` (already exists).
- Produces: `emitNext` gains a runtime `SHADOW_ACTIVE` check selecting between a native-shadow tail and today's unmodified BCD tail, for any loop that has a shadow-stack entry.

This is the first task with a real, observable behavior change — a shadowed loop's `NEXT` now does meaningfully different work. First real-emulator proof of the loop-shadowing mechanism.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('emits a runtime SHADOW_ACTIVE branch in NEXT for a shadow-eligible loop, with both a native and a BCD tail', () => {
    const asm = generate(parse('10 FOR K=1 TO 10\n20 PRINT K\n30 NEXT K\n40 END\n'));
    const mnems = asm.lines.map(l => l.mnemonic).filter(Boolean);
    expect(mnems).toContain('adw'); // native shadow increment present
    expect(mnems).toContain('cal'); // BCD tail (FP_ADD via ROM_CALL_FP) still present too
    const romAddSites = asm.lines.filter(l => l.comment?.includes('counter + step')).length;
    expect(romAddSites).toBeGreaterThan(0); // today's BCD tail is NOT deleted, only made conditional
  });

  it('a statically disqualified loop\'s NEXT is byte-for-byte identical to pre-shadowing output', () => {
    const before = generate(parse('10 DIM A(20)\n20 FOR K=1 TO 10\n30 PRINT A(K)\n40 NEXT K\n50 END\n'));
    // Regression pin: capture this once, on a clean checkout of this task's
    // parent commit, and compare structurally (mnemonic+operands sequence
    // for the NEXT portion) rather than embedding a giant literal here.
    // At minimum, assert no SHADOW_ACTIVE reference appears anywhere:
    const anyShadowRef = before.lines.some(l => (l.operands ?? '').includes('SHADOW_ACTIVE'));
    expect(anyShadowRef).toBe(false);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "SHADOW_ACTIVE branch in NEXT"`
Expected: FAIL.

- [ ] **Step 3: Implement**

In `emitNext` (codegen.ts:1321-1395), for each `varName` being closed, look up `this.shadowStack` for an entry matching `varName`. If found:

1. Emit a runtime check of `SHADOW_ACTIVE_${varName}` branching to either tail (two new unique labels, e.g. `SHADOW_NEXT_ACTIVE_${n}` / `SHADOW_NEXT_DONE_${n}`).
2. **Active tail:** `ldw`/`adw` the counter shadow by the step shadow (both already in the 2-byte slots — no BCD staging at all). Native compare against the limit shadow (reuse whatever condition-code approach Task 5 establishes for comparisons — if Task 5 hasn't landed yet in execution order, this task must independently verify the correct native signed-16-bit comparison condition codes against `exec.ts`, matching the ORIGINAL plan's Task 4 guidance: "determine empirically which condition codes correspond to `<=`" — do not assume `sbcw`'s flags mirror the BCD path's `orcm`/`anc` byte tests). Branch back to `topLabel` if the loop continues. If done: `emitInt16ToBcd()` on the counter shadow's current value and store to `VAR_${varName}` (via `emitVariableStore`) — this is the ONE place the counter's BCD form gets refreshed under shadowing.
3. **Not-active tail:** exactly today's existing code (codegen.ts:1339-1379+), unmodified, moved under this branch rather than deleted.
4. Pop `this.shadowStack`'s entry for `varName` after emitting both tails (regardless of which one a given run takes at runtime — this is a compile-time stack, tracking lexical nesting, not the runtime branch).

For a `varName` with NO shadow-stack entry (today's ordinary case, and any statically-disqualified loop), `emitNext` must take exactly its current, unmodified code path — no `SHADOW_ACTIVE` reference anywhere, satisfying this task's second test.

Before implementing the native comparison, re-read the ORIGINAL plan's Task 4 guidance on comparison condition codes (still valid, only the call site changed) and Task 2's own note about `adwSbw_88` setting carry "when the true sum exceeds 0xFFFF" (codegen.ts:1008) — the SIGNED overflow condition for a native compare/subtract is not necessarily the same flag; verify both separately.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "SHADOW_ACTIVE branch in NEXT|byte-for-byte identical"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/loop-shadow-next.test.ts
// Follow the EmulatorSession pattern established in
// tools/emu-debugger/tests/task4-constants-fix.test.ts and
// tools/emu-debugger/tests/intfast-conversion.test.ts (symbol-table address
// lookup, setIserv(0), breakpoint-based stopping).
//
// Required cases:
//   1. `10 S=0\n20 FOR K=1 TO 100\n30 S=S+1\n40 NEXT K\n50 END\n`
//      -> after run, VAR_K's BCD bytes equal numberToBcd9(101) (BASIC's FOR
//      leaves the counter one step past the limit after normal exit -- match
//      whatever the EXISTING unshadowed FOR/NEXT does for this exact
//      program, don't assume; this specific loop doesn't reference K in a
//      shadow-triggering way (S=S+1 doesn't touch K), so it's a control case
//      confirming NEXT's own tail alone is correct).
//   2. A loop whose body references the counter in a fast-path-eligible way
//      once Task 5 lands (`FOR K=1 TO 100:S=S+K:NEXT K` -> VAR_S =
//      numberToBcd9(5050)) -- if Task 5 hasn't landed when this task is
//      implemented, this specific case is expected to still be CORRECT (via
//      the not-active-equivalent unshadowed codegen for in-body references,
//      since Task 5 is what wires shadow-aware operand resolution) but not
//      yet exercising the fast path; note this explicitly in the test
//      comment and revisit once Task 5 lands.
//   3. STEP 2 loop: `FOR K=0 TO 20 STEP 2` terminates with the correct final
//      count and correct VAR_K afterward.
//   4. SHADOW_ACTIVE runtime-false case: `10 N=40000\n20 FOR K=1 TO N\n...`
//      -- N exceeds int16 range, so the loop is statically eligible (N is
//      integer-eligible) but must run via the not-active tail. Confirm the
//      loop still terminates correctly (this specific N is large enough
//      that a short loop body making it fully terminate would be slow to
//      simulate -- consider a smaller out-of-range boundary test instead,
//      e.g. TO 33000, with a body that just counts iterations via a second
//      variable, and cap iterations/cycles sensibly for the test).
```

Fill in the harness per the established `EmulatorSession` pattern. Confirm case 1 and case 3 pass by reading `VAR_K`'s actual memory bytes, not just "the program didn't crash."

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/loop-shadow-next.test.ts`
Expected: PASS for all cases.

- [ ] **Step 7: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS, including every pre-existing `FOR`/`NEXT`/`intfast-conversion` test.

- [ ] **Step 8: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/loop-shadow-next.test.ts
git commit -m "feat(compiler): NEXT dual-tail codegen -- native shadow increment/compare when SHADOW_ACTIVE"
```

---

### Task 5: Shadow-aware operand resolution in `emitBinaryExpr`/`emitComparisonBranch`, with correct overflow fallback

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/loop-shadow-body.test.ts`

**Interfaces:**
- Consumes: `this.shadowStack` (Task 3/4), `emitInt16ToBcd()`/`emitBcdToInt16()` (already exist).
- Produces: `emitBinaryExpr` and `emitComparisonBranch` each gain a check, before falling through to existing logic: is `left` or `right` a `VariableExpr` naming the counter of a loop currently on `this.shadowStack`? If so, emit the `SHADOW_ACTIVE`-gated shadow-vs-BCD dual path described below.

This is the task that actually makes `IF K+K>N` (or any other counter-touching expression) inside a shadowed loop skip BCD decoding for the `K` side.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('a counter-touching expression inside a shadowed loop checks SHADOW_ACTIVE and reads the shadow slot when active', () => {
    const asm = generate(parse('10 N=100\n20 FOR K=1 TO N\n30 IF K+K>N THEN GOTO 50\n40 PRINT K\n50 NEXT K\n60 END\n'));
    const operands = asm.lines.map(l => l.operands).filter(Boolean);
    expect(operands.some(o => o!.includes('SHADOW_K'))).toBe(true); // reads the shadow slot directly
  });

  it('an expression NOT touching the counter inside a shadowed loop adds no shadow references of its own', () => {
    // Baseline: a shadowed loop with an EMPTY body -- every SHADOW reference
    // in this output comes purely from emitFor's entry decode/SHADOW_ACTIVE
    // setup and emitNext's dual-tail machinery, none from body content.
    const baseline = generate(parse('10 FOR K=1 TO 10\n20 NEXT K\n30 END\n'));
    // Same loop, with a body statement that never references K.
    const withBody = generate(parse('10 S=0\n20 FOR K=1 TO 10\n30 S=S+1\n40 NEXT K\n50 END\n'));
    const shadowRefCount = (asm: { lines: { label?: string; operands?: string }[] }) =>
      asm.lines.filter(l => (l.label ?? '').includes('SHADOW') || (l.operands ?? '').includes('SHADOW')).length;
    // S=S+1 must contribute exactly zero additional shadow references beyond
    // the loop's own fixed entry/exit machinery.
    expect(shadowRefCount(withBody)).toBe(shadowRefCount(baseline));
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "SHADOW_ACTIVE and reads the shadow slot"`
Expected: FAIL.

- [ ] **Step 3: Implement**

Add a helper near `emitBinaryExpr`:

```typescript
  private activeShadowFor(varName: string): { varName: string; counter: string; limit: string; step: string; active: string } | undefined {
    // Search from the top (innermost) -- an inner loop's own counter takes
    // precedence over an outer loop reusing... actually names differ by
    // construction here (same-name reentrancy is a condition-2 disqualifier
    // upstream), so any match is unambiguous. Search the whole stack, not
    // just the top, since a loop body can reference an OUTER shadowed
    // loop's counter too (see design doc).
    for (let i = this.shadowStack.length - 1; i >= 0; i--) {
      if (this.shadowStack[i].varName === varName) return this.shadowStack[i];
    }
    return undefined;
  }
```

At the top of `emitBinaryExpr(op, left, right)` (before its existing `if (op === 'mod')` branch), add a check: is `left` or `right` a `VariableExpr` whose name resolves via `activeShadowFor`? If so, route to a new method, e.g. `emitShadowAwareBinaryExpr(op, left, right, shadow)`, implementing:

1. Emit a runtime check of `${shadow.active}`.
2. **`SHADOW_ACTIVE` branch:** for whichever operand(s) reference the shadowed counter, `ldw` directly from `${shadow.counter}` instead of `emitExpression`+`emitBcdToInt16`. For the other operand (if not itself the same counter), evaluate normally (`emitExpression`, then `emitBcdToInt16()` — this operand's BCD form is never stale, since it isn't the shadowed variable). Perform the native op (`adw`/`sbcw` for `+`/`-`; for other ops in `FAST_PATH_OPS`, follow the same shape). **Overflow check**, same as the original per-operation plan's Task 3 guidance (verify the correct signed-overflow condition code against `exec.ts`, do not assume). On overflow: **do not reload `VAR_${shadow.varName}`.** Instead, `emitInt16ToBcd()` on the value currently held in the shadow-sourced operand's register (refreshing `$10-$18` directly from the native value already in hand) to get fresh, correct BCD bytes, then stage those for the existing ROM call exactly as the non-shadow path would have — the non-counter operand's BCD form (if any) is already fresh and can be used as-is. On no overflow: `emitInt16ToBcd()` the result and proceed as a normal expression result (leaves `$10-$18` holding the result, matching every other `emitExpression` path's contract — no store happens here, since `emitBinaryExpr` never stores on its own; whatever called it decides that).
3. **Not-active branch:** exactly today's codegen for this same `op`/`left`/`right` — i.e., simply the existing pre-Task-5 body of `emitBinaryExpr`, unconditionally, with no knowledge that a shadow was ever considered. The cleanest way to get this exactly right without duplicating logic by hand: factor today's existing `emitBinaryExpr` body into a private method (e.g. `emitPlainBinaryExpr`) FIRST, then call it from both the not-active branch here and (for a fully non-shadow-touching expression) from `emitBinaryExpr`'s own top-level fallthrough. This refactor should be a pure extraction with no behavior change — verify via the full test suite before adding any new logic on top.

Do the equivalent for `emitComparisonBranch` (around codegen.ts:1534) — same three-part shape (shadow-aware active branch / not-active branch calling the extracted-and-unchanged original / runtime `SHADOW_ACTIVE` check), reusing whatever native-compare condition-code work Task 4 already verified for `NEXT`'s own limit test, rather than re-deriving it.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "SHADOW_ACTIVE and reads the shadow slot|completely unaffected"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/loop-shadow-body.test.ts
// Required cases (EmulatorSession, following the established pattern):
//   1. `10 N=100\n20 S=0\n30 FOR K=1 TO N\n40 IF K+K>N THEN GOTO 60\n50 S=S+1\n60 NEXT K\n70 END\n`
//      -> confirm S ends up correct (count of K in 1..100 where 2K<=100,
//      i.e. K<=50 -> S=50) AND confirm this every iteration, not just at
//      the boundary -- e.g. also check the LCD/PRINT output of a smaller,
//      fully-observable variant if that's easier to assert precisely.
//   2. SHADOW_ACTIVE-inactive case: a statically-eligible loop whose runtime
//      limit exceeds int16 range, WITH a body expression referencing the
//      counter (e.g. `K+K`) -- confirm the not-active branch produces the
//      correct result and specifically does NOT read an uninitialized/stale
//      shadow slot (construct so a bug here produces a visibly wrong,
//      checkable answer).
//   3. Overflow-inside-active-shadow case: SHADOW_ACTIVE=1 (small initial
//      limit) but K+K overflows once K exceeds 16383 -- use a loop that
//      reaches that range (e.g. FOR K=16380 TO 16385) and confirm the
//      overflow fallback produces the CORRECT result, and specifically
//      construct the case so a "reloaded stale VAR_K" bug would produce a
//      DIFFERENT, wrong, checkable answer (e.g. have the loop body ALSO do
//      an ordinary, non-counter-touching BCD store to VAR_K-adjacent memory
//      earlier, or simply confirm the K+K result against the independently
//      known-correct arithmetic for the specific K values reached -- pick
//      whichever construction most directly proves the fallback used the
//      CURRENT shadow value, not stale BCD memory).
//   4. An outer shadowed loop referencing its own counter inside an inner
//      DISQUALIFIED loop's body (e.g. inner loop does an array access) --
//      confirm the outer loop's own shadow-aware codegen at the OUTER
//      loop's own body statements (outside the inner loop) still works
//      correctly, and the inner loop's disqualified codegen is unaffected.
//   5. The reverse nesting direction (design doc's Testing section requires
//      both): an outer DISQUALIFIED loop (e.g. references its own counter
//      as an array index) containing an inner SHADOWED loop -- confirm the
//      inner loop's shadow-aware codegen works correctly and the outer
//      loop's plain BCD codegen is unaffected by the inner loop's shadow
//      slots (different variable names, independent RAM addresses).
//   6. GOSUB called from inside a shadowed loop's body, where the callee
//      subroutine does BCD arithmetic of its own (e.g. adds two unrelated
//      variables, exercising $0-$18 scratch) -- confirm the shadow slots
//      survive the call untouched (a real emulator proof that the shadow's
//      RAM-not-register storage is actually safe across a GOSUB, not just
//      an assumption).
```

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/loop-shadow-body.test.ts`
Expected: PASS for all cases, especially case 3 (the overflow-fallback-correctness case this plan's Global Constraints call out as the dangerous one).

- [ ] **Step 7: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS, full suite.

- [ ] **Step 8: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/loop-shadow-body.test.ts
git commit -m "feat(compiler): shadow-aware operand resolution for in-body counter expressions, with correct overflow fallback"
```

---

### Task 6: Listing visibility

**Files:**
- Modify: `tools/compiler/listing.ts`, `tools/compiler/compile.ts`, `tools/compiler/asm-types.ts`
- Test: `tools/compiler/tests/listing.test.ts` (create if it doesn't exist — check first)

**Interfaces:**
- Consumes: `this.integerEligible` (Task 1), `this.shadowEligibility` (Task 3).
- Produces: `AsmProgram` gains `integerEligible: Set<string>` and `shadowedLoops: { varName: string; line: number }[]` fields, threaded from `CodeGen.generate()`'s return value through to `compile.ts`. `ListingInput` gains matching fields. `formatListing()` emits two new sections.

This covers the original design's Task 9 (integer-eligible listing, never implemented since Tasks 3-8 were replaced before reaching it) plus this design's own shadowed-loop listing addition, together, since they're the same kind of change to the same files.

- [ ] **Step 1: Write the failing test**

```typescript
// in tools/compiler/tests/listing.test.ts (create if none exists; check
// tools/compiler/tests/ first and match whatever helper functions an
// existing listing-adjacent test already uses)
  it('lists integer-eligible/bcd-only variables and shadowed FOR loops', () => {
    const asm = generate(parse('10 N=100\n20 X=3.14\n30 FOR K=1 TO N\n40 PRINT K\n50 NEXT K\n60 END\n'));
    const assembled = assemble(asm.lines);
    const listing = formatListing({
      // ...existing required fields...,
      integerEligible: asm.integerEligible,
      shadowedLoops: asm.shadowedLoops,
      symbols: assembled.symbols,
    });
    expect(listing).toContain('Integer-Eligible Variables:');
    expect(listing).toContain('VAR_N');
    expect(listing).toContain('BCD-Only Variables:');
    expect(listing).toContain('VAR_X');
    expect(listing).toContain('Shadowed FOR Loops:');
    expect(listing).toContain('K');
  });
```

Check `tools/compiler/tests/` first for how `compile.ts` currently constructs a `ListingInput` for its own tests, and match that exact helper shape rather than guessing.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/listing.test.ts -t "integer-eligible/bcd-only"`
Expected: FAIL.

- [ ] **Step 3: Implement**

In `asm-types.ts`, extend `AsmProgram`:

```typescript
export interface AsmProgram {
  lines: AsmLine[];
  origin: number;
  integerEligible: Set<string>;
  shadowedLoops: { varName: string; line: number }[];
}
```

In `codegen.ts`'s `generate()` return statement (codegen.ts:284), add the two new fields:

```typescript
    return { lines: this.code, origin: 0x1CD0, integerEligible: this.integerEligible, shadowedLoops: this.shadowedLoopsFound };
```

`this.shadowedLoopsFound` is already populated by Task 3's `emitFor` (see `codegen.ts:900-1140` era additions — the push right after `this.shadowStack.push(...)` in Task 3's Step 3) whenever a loop actually gets shadow slots allocated, so no new tracking logic is needed here — this task only threads the already-collected data out through `generate()`'s return value.

In `listing.ts`, extend `ListingInput` with `integerEligible: Set<string>` and `shadowedLoops: { varName: string; line: number }[]`. Add two new sections in `formatListing()`, matching the existing `Symbol Table:` section's style (listing.ts:155-168 is the pattern to mirror):

```typescript
  lines.push('');
  lines.push('Integer-Eligible Variables:');
  const allVarNames = [...input.symbols].filter(s => s.type === 'variable').map(s => s.name).sort();
  const eligible = allVarNames.filter(n => input.integerEligible.has(n.replace(/^VAR_/, '')));
  const bcdOnly = allVarNames.filter(n => !input.integerEligible.has(n.replace(/^VAR_/, '')));
  lines.push('  ' + (eligible.length > 0 ? eligible.join('  ') : '(none)'));
  lines.push('');
  lines.push('BCD-Only Variables:');
  lines.push('  ' + (bcdOnly.length > 0 ? bcdOnly.join('  ') : '(none)'));

  lines.push('');
  lines.push('Shadowed FOR Loops:');
  if (input.shadowedLoops.length > 0) {
    for (const loop of input.shadowedLoops) lines.push(`  ${loop.varName} (line ${loop.line})`);
  } else {
    lines.push('  (none)');
  }
```

(The `symbols` list's `name` field — confirm from `asm-types.ts`'s `SymbolEntry` whether variable symbol names already include the `VAR_` prefix or not, and adjust the `.replace(/^VAR_/, '')` matching above accordingly — write this against what's actually there, not the guess above.)

Thread `asm.integerEligible`/`asm.shadowedLoops` through `compile.ts`'s existing call into `formatListing()` (compile.ts:136 is the current construction site) the same way `symbols` already flows through that same path.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/listing.test.ts -t "integer-eligible/bcd-only"`
Expected: PASS.

- [ ] **Step 5: Regenerate and manually inspect a real listing**

Run: `npx tsx tools/compiler/compile.ts public/basic/emulator/PRIMES.BAS` and read the generated `.lst` file. Confirm `C`, `N`, `K` appear under "Integer-Eligible Variables", and confirm `K` (the `FOR K=2 TO N-1` loop) appears under "Shadowed FOR Loops" — this is the concrete, human-checkable proof that PRIMES.BAS's own hot loop is actually the one this whole plan optimizes.

- [ ] **Step 6: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/listing.ts tools/compiler/compile.ts tools/compiler/asm-types.ts tools/compiler/codegen.ts tools/compiler/tests/listing.test.ts
git commit -m "feat(compiler): show integer-eligibility and shadowed-loop classification in the .lst listing"
```

---

### Task 6b: Treat `GOTO`-out-of-loop like `RETURN` — forced sync, not disqualification

> Added mid-execution, after Task 6's regenerated `PRIMES.BAS` listing (the concrete proof step Task 6 itself specifies) showed the program's own `FOR K` loop getting `(none)` under "Shadowed FOR Loops" — not a bug in Task 6, a real discovery about the target program. See the SDD ledger for the full investigation; summarized below.

**Files:**
- Modify: `tools/compiler/loop-shadow-eligibility.ts`, `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/loop-shadow-eligibility.test.ts`, `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/loop-shadow-goto.test.ts`

**Interfaces:**
- Consumes: `markShadowCounterMustBeCurrent()` (Task 4, already exists — the exact same private method the `return` hook calls, at `codegen.ts:1636`-ish).
- Produces: `bodyContainsOutOfSpanJump` and its call from `analyzeLoopShadowEligibility` removed entirely (condition 4 no longer exists as a static disqualifier). A `case 'goto':` hook and an `on-branch`/`kind === 'goto'` hook in `codegen.ts`, both calling `markShadowCounterMustBeCurrent()`, mirroring `case 'return':`'s existing pattern exactly.

**Why this is correct, not just convenient:** `PRIMES.BAS`'s actual hot loop (`110 FOR K=2 TO N-1 ... 120 IF K+K>N THEN 200 ... 130 IF N MOD K=0 THEN 100 ... 140 NEXT K`) has two `GOTO`s that jump past `NEXT`, both instances of the exact early-exit-from-trial-division idiom every design document in this plan singled out as the representative case. Neither jump target ever reads `K` again — but condition 4 can't know that without real reachability analysis, deliberately out of scope. `markShadowCounterMustBeCurrent()`'s existing safety argument (see `codegen.ts:141-204`'s `OpenShadowLoop` doc comment, and Task 4's ledger entry) doesn't actually depend on anything specific to `RETURN` — it depends only on this invariant: **`VAR_<v>` is refreshed at the START of every iteration** (via `emitFor`'s seed for iteration 1, or the prior iteration's `NEXT` sync for iteration N>1), and nothing in an iteration's own body writes to it before that iteration's own exit. That invariant holds regardless of *how* the iteration's body execution ends — falling through to `NEXT` normally, `RETURN`ing, or `GOTO`ing out — so the exact same remedy that made the `RETURN` fix sound applies unchanged to `GOTO`.

**Scope decision, deliberately conservative:** the hook fires on *any* `goto`/`on-goto` in a shadowed loop's body, unconditionally — it does not check whether the specific target is actually outside the loop's span (today's existing "GOTO within the loop span" test case would, after this change, ALSO force a sync it doesn't strictly need). This costs a small, known amount of otherwise-achievable full amortization for that one case, in exchange for not needing to add line-span tracking to `ForLoopInfo`/`OpenShadowLoop` — a real reduction in surface area for a fix whose whole point is safety. A future task could add the precise, span-aware version if profiling ever shows it matters; not needed now, and not part of this task.

- [ ] **Step 1: Write the failing tests**

In `tools/compiler/tests/loop-shadow-eligibility.test.ts`, update the existing test named around "condition 4: disqualified when a GOTO in the body jumps past NEXT" — its expectation flips from `false` to `true` (the loop is no longer statically disqualified; safety now comes from the codegen-time hook, tested separately). Keep the "eligible when a GOTO inside the body only jumps within the loop span" test as-is (still `true`, unaffected either way). Add one more: a loop whose body contains `ON x GOTO ...` with a target outside the span — also now `true`.

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('a GOTO out of a shadowed loop body forces markShadowCounterMustBeCurrent (a NEXTSHADOW_SYNC block is emitted)', () => {
    const asm = generate(parse('10 N=100\n20 FOR K=1 TO N\n30 IF K=5 THEN GOTO 50\n40 NEXT K\n50 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    expect(labels.some(l => l!.includes('NEXTSHADOW_SYNC'))).toBe(true);
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/loop-shadow-eligibility.test.ts tools/compiler/tests/codegen.test.ts`
Expected: FAIL — the eligibility test still expects `false` (old behavior), and the codegen test's `NEXTSHADOW_SYNC` never appears (nothing calls the hook for `goto` yet).

- [ ] **Step 3: Remove condition 4 from `loop-shadow-eligibility.ts`**

Delete `bodyContainsOutOfSpanJump` and its call site inside `analyzeLoopShadowEligibility` (the block checking condition 4 and returning `false`). Confirm by re-reading the function that conditions 1-3 are untouched.

- [ ] **Step 4: Add the `goto` and `on-goto` hooks in `codegen.ts`**

Find `case 'return':` (search for `markShadowCounterMustBeCurrent`) and add the identical call to `case 'goto':`'s handler, right before it pushes the `jp`/`jr` instruction (order doesn't matter for correctness — the hook only affects a compile-time flag, not emitted instructions — but placing it first matches `return`'s own ordering for consistency). Find wherever `ON..GOTO` is emitted (search for `on-branch`, near the `on-branch`/`kind === 'gosub'` handling Task 4 already added around `codegen.ts:2124`) and add the same call for the `kind === 'goto'` case.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/loop-shadow-eligibility.test.ts tools/compiler/tests/codegen.test.ts`
Expected: PASS.

- [ ] **Step 6: Write the empirical test**

```typescript
// tools/emu-debugger/tests/loop-shadow-goto.test.ts
// Compile and run, via EmulatorSession, a program shaped exactly like PRIMES.BAS's
// hot loop (a FOR loop with a body GOTO past NEXT, referencing the counter both
// before AND after the point where it becomes unreachable via NEXT), and confirm:
//   1. The loop still terminates and produces the correct result (compare
//      against the same program's output under the ORIGINAL, pre-Task-6b
//      compiler, or against manually-derived expected values).
//   2. A body expression referencing the counter BEFORE the GOTO (e.g.
//      `IF K+K>N THEN GOTO ...`) still gets the native fast path (per Task 5) --
//      confirm via the same technique Task 5's own tests use (checking for a
//      SHADOW_<v> operand reference in the emitted assembly, or checking
//      cycle count).
//   3. Construct a case where getting the sync wrong would produce a
//      DIFFERENT, checkably wrong answer (matching this whole plan's standing
//      requirement for overflow/staleness tests) -- e.g. a program where a
//      GOTO'd-to location DOES read a value that depends on the loop counter
//      having been correct at some prior point, confirming the sync actually
//      ran.
```

- [ ] **Step 7: Run the empirical test, confirm it passes**

Run: `npx vitest run tools/emu-debugger/tests/loop-shadow-goto.test.ts`
Expected: PASS.

- [ ] **Step 8: Regenerate the PRIMES.BAS listing and confirm the fix actually lands**

Run: `npx tsx tools/compiler/compile.ts public/basic/emulator/PRIMES.BAS` and read the generated `.lst` file. Confirm `K` now appears under "Shadowed FOR Loops" — this is the concrete proof that closes the loop Task 6 opened.

- [ ] **Step 9: Run the full existing test suite to confirm zero regressions**

Run: `npx vitest run`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add tools/compiler/loop-shadow-eligibility.ts tools/compiler/codegen.ts tools/compiler/tests/loop-shadow-eligibility.test.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/loop-shadow-goto.test.ts
git commit -m "feat(compiler): treat GOTO out of a shadowed loop like RETURN -- forced sync, not disqualification"
```

---

### Task 7: End-to-end verification and benchmarking on PRIMES.BAS

**Files:**
- Modify: `tools/emu-debugger/tests/primes.test.ts` (confirm still passes, no code change expected)
- Create: a benchmarking note appended to `public/basic/emulator/PRIMES.md`

**Interfaces:**
- Consumes: everything from Tasks 1-6.
- Produces: nothing consumed by other tasks — this is the plan's final proof, answering the question the whole redesign exists to answer: how much of the original 83-85%-in-ROM finding did loop shadowing actually close, now that the naive per-operation approach was rejected in favor of this amortized one.

- [ ] **Step 1: Confirm the existing acceptance test still passes unchanged**

Run: `npx vitest run tools/emu-debugger/tests/primes.test.ts`
Expected: PASS, LCD still shows `541`. If a code change to this test file is needed, that's a sign something in Tasks 1-6 changed externally-visible behavior it shouldn't have — stop and investigate before proceeding.

- [ ] **Step 2: Re-run the instruction-category profiling from the original investigation**

Using the same method as the investigation that motivated the original `2026-08-15` design (trace a representative slice of `PRIMES.BAS`'s inner trial-division loop via `EmulatorSession`'s `run({trace: true})`, bucket instructions by whether their PC falls inside the compiled program's own address range vs. ROM), measure the new ROM-vs-compiled-code instruction ratio for the same loop, now that `FOR K=2 TO N-1`'s own bookkeeping and its `IF N MOD K = 0`'s `K` reference (if shadow-eligible per Task 6's listing check) run natively. Write a throwaway script for this (not committed, same as the original investigation). Report the before/after percentages, and specifically call out how much of the change came from `NEXT`'s own per-iteration cost (the mechanism this design's Goal section identified as the actual target) versus in-body expression savings.

- [ ] **Step 3: Re-measure the interpreted-vs-compiled wall-clock comparison**

Follow `public/basic/emulator/PRIMES.md`'s existing instructions (interpreted: load via LIB, `RUN`, stopwatch to `541`; compiled: `EXTCLR.BAS` → `MLLOADER.BAS` → send the freshly-recompiled `PRIMES.hex` → stopwatch to `541`). This is a manual/human-timed step — if running in an automated context without a human able to time it, report the emulator's own `instructionsExecuted`/cycle count for the compiled run instead (easy to get from `EmulatorSession`'s result) as a proxy, and flag that the human-timed wall-clock comparison is still needed before treating the improvement as final.

- [ ] **Step 4: Document the result**

Append a section to `public/basic/emulator/PRIMES.md` recording: the new ROM-vs-compiled-code instruction ratio, the new measured (or proxied) speedup versus interpreted, and a one-line pointer back to this plan and its design spec (`docs/superpowers/specs/2026-08-17-compiler-integer-fastpath-loop-shadowing-design.md`) for anyone wanting the full story — including a note that this superseded an earlier, rejected per-operation approach (`docs/superpowers/specs/2026-08-15-compiler-integer-fastpath-design.md`'s Tasks 3-8), and why.

- [ ] **Step 5: Commit**

```bash
git add public/basic/emulator/PRIMES.md
git commit -m "docs(compiler): record loop-shadowing benchmark results for PRIMES.BAS"
```
