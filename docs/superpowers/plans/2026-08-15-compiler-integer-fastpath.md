# Native Integer Arithmetic Fast Path Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make provably-integer arithmetic in compiled BASIC programs skip the ROM's slow general-purpose BCD floating-point library and use the HD61700's native 16-bit word instructions instead, closing most of the gap between compiled and interpreted performance for integer-heavy programs like `PRIMES.BAS`.

**Architecture:** A new static-analysis pass (`type-inference.ts`) classifies every scalar variable as `integer-eligible` or `bcd-only` by scanning every assignment site in the whole program. `codegen.ts`'s arithmetic/comparison/loop emitters check this classification and, when every operand involved is integer-eligible, emit a fast path built from two new shared subroutines (BCD→int16 decode, int16→BCD encode) plus native `adw`/`sbcw`-based arithmetic, with a runtime overflow guard falling back to the existing (untouched) BCD path whenever the true result wouldn't fit in 16 bits.

**Tech Stack:** TypeScript compiler (`tools/compiler/`), HD61700 assembly codegen, Vitest, the headless `EmulatorSession` harness (`tools/emu-debugger/`) for real-ROM verification.

## Global Constraints

- Integer range is 16-bit **signed**: −32768..32767. Any value or intermediate result outside this range must fall back to the existing BCD path — never silently wrap or truncate.
- Integer-eligible variables keep their existing 9-byte BCD storage in RAM. No change to variable allocation, `DIM`, `PRINT`, `DATA`, or array storage. The fast path only changes what happens *between* loading a variable's BCD bytes and storing a result back.
- `INPUT`-sourced variables are always `bcd-only`, unconditionally, everywhere they're ever targeted by `INPUT` — no runtime type-checking of typed-in values.
- Arrays are always `bcd-only`. This plan does not touch array element access.
- New scratch registers used by the shared decode/encode subroutines (and any other new shared code) must not collide with the established conventions on this branch: **never use `$30`/`$31`** (ROM globals: `$sx`→`$31`=0, `$sy`→`$30`=1, read by ROM FP routines and both interrupt service routines). If a new routine is called from a fast-path site that's adjacent to a `ROM_CALL_FP` invocation, it must also avoid clobbering `$19/$20` and `$28/$29` (already used by `ROM_CALL_FP`'s own wrapper) unless the call sequencing guarantees those are dead by then — verify this empirically, the same way `emitRomCallFp`'s registers were verified in earlier work on this branch (see `.superpowers/sdd/2026-08-12-compiler-bcd-arithmetic/progress.md` for that history).
- Every claim about HD61700 instruction semantics, condition-code behavior, or overflow-flag behavior **must be verified against `src/emulator/exec.ts`/`def.ts` and proven empirically via `EmulatorSession`**, not assumed from mnemonic naming or this plan's own prose. This branch's history (see the same ledger) has repeatedly shown that assumptions about this specific CPU's semantics — even from careful, well-reasoned people — have been wrong until checked against the real emulator.
- Every task's correctness claim must be proven by actually running compiled code through `EmulatorSession` and checking real memory/register values — a codegen-level "the right instructions got emitted" test is necessary but never sufficient on its own.

---

## The BCD format (read this before starting — everything in this plan depends on it)

From `tools/compiler/bcd.ts` (already implemented, tested, and in production use — treat as ground truth, do not re-derive):

- 9 bytes: `bytes[0..6]` = 7-byte packed mantissa, little-endian by byte (`bytes[6]` most significant); `bytes[7]` = low two digits of the biased exponent (packed BCD); `bytes[8]` = hundreds digit of the biased exponent, **plus 5 when the value is negative**.
- The mantissa holds 13 significant decimal digits: `d1` is the low nibble of `bytes[6]` (a normalized number always has `bytes[6]`'s high nibble as a zero guard digit), then alternating high/low nibbles down through `bytes[0]`'s low nibble (`d13`).
- `value = d1.d2d3...d13 × 10^(biasedExponent − 100)`, where `biasedExponent = bytes[7]-as-decimal + bytes[8]-as-decimal×100` (with the sign folded out of `bytes[8]` first: subtract 5 if `bytes[8] >= 5`).
- Zero is the unique all-zero-bytes encoding.

**What "integer-eligible" means for a stored value:** because the type-inference pass (Task 1) guarantees every value ever written to an integer-eligible variable is a whole number, the decimal point always falls immediately after the last non-zero significant digit — i.e. `biasedExponent − 100 + 1` is exactly the count of integer digits, and every mantissa digit beyond that position is zero. Decoding relies on this invariant; it does not need to handle a fractional stored value (that can't happen for a variable this pass classified as integer-eligible).

---

### Task 1: Static integer-eligibility inference pass

**Files:**
- Create: `tools/compiler/type-inference.ts`
- Modify: `tools/compiler/ast.ts` (`NumberLiteral` gains a field), `tools/compiler/parser.ts` (every `Expression`-producing number-literal site sets it)
- Test: `tools/compiler/tests/type-inference.test.ts`

**Interfaces:**
- Consumes: `Program` (parsed AST, from `tools/compiler/ast.ts` — already exists: `Statement`, `Expression`, `VarRef`, `LetStatement`, `InputStatement`, `ReadStatement`, `ForStatement`, `BinaryOp` types).
- Produces: `NumberLiteral` gains `hasDecimalPoint: boolean`. `inferIntegerEligibility(program: Program): Set<string>` — exported function, returns the set of variable names (matching `VarRef.name`) that are integer-eligible. Consumed by Task 3 onward (`codegen.ts`) and Task 9 (`listing.ts`).

This pass never touches codegen or the emulator — it's pure AST analysis, testable entirely with `parse()` output.

- [ ] **Step 1: Write the failing tests**

```typescript
// tools/compiler/tests/type-inference.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../parser.js';
import { inferIntegerEligibility } from '../type-inference.js';

describe('inferIntegerEligibility', () => {
  it('classifies a variable assigned only integer literals as eligible', () => {
    const ast = parse('10 A=5\n20 A=10\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(true);
  });

  it('classifies a variable ever assigned a decimal literal as bcd-only', () => {
    const ast = parse('10 A=5\n20 A=3.14\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies a variable built from +/-/*/MOD// of eligible sources as eligible', () => {
    const ast = parse('10 A=5\n20 B=A+3\n30 C=B-1\n40 D=C*2\n50 E=D MOD 4\n60 F=D/2\n');
    const eligible = inferIntegerEligibility(ast);
    expect(eligible.has('A')).toBe(true);
    expect(eligible.has('B')).toBe(true);
    expect(eligible.has('C')).toBe(true);
    expect(eligible.has('D')).toBe(true);
    expect(eligible.has('E')).toBe(true);
    expect(eligible.has('F')).toBe(true);
  });

  it('classifies a variable built from an expression touching a bcd-only variable as bcd-only', () => {
    const ast = parse('10 A=5\n20 X=3.14\n30 A=A+X\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies any variable ever targeted by INPUT as bcd-only, unconditionally', () => {
    const ast = parse('10 A=5\n20 INPUT A\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies a FOR loop counter, limit, and step as eligible when all are integer expressions', () => {
    const ast = parse('10 FOR I=1 TO 10 STEP 2\n20 NEXT I\n');
    expect(inferIntegerEligibility(ast).has('I')).toBe(true);
  });

  it('classifies a FOR loop counter as bcd-only when the limit is a decimal', () => {
    const ast = parse('10 FOR I=1 TO 10.5\n20 NEXT I\n');
    expect(inferIntegerEligibility(ast).has('I')).toBe(false);
  });

  it('is whole-variable, whole-program: one bad assignment poisons every use, including earlier integer-looking ones', () => {
    const ast = parse('10 A=5\n20 PRINT A\n30 A=1.5\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('a variable assigned inside a GOSUB target reachable from multiple call sites is classified from every assignment, not just the first', () => {
    const ast = parse('10 GOSUB 100\n20 GOSUB 200\n30 END\n100 A=5\n110 RETURN\n200 A=3.14\n210 RETURN\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });

  it('classifies a variable never assigned a decimal-point literal even when its value happens to be whole, based on the literal text not the numeric value', () => {
    const ast = parse('10 A=5.0\n');
    expect(inferIntegerEligibility(ast).has('A')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/type-inference.test.ts`
Expected: FAIL — `type-inference.ts` doesn't exist yet (`Cannot find module`).

- [ ] **Step 3: Add the missing "had a decimal point" flag to `NumberLiteral`**

`ast.ts`'s `NumberLiteral` is currently `{ type: 'number'; value: number }` — no way to distinguish a `5.0` literal from `5`, both parse to `value: 5`. This distinction matters (see the design's rule: eligibility is syntactic, not semantic — `5.0` is `bcd-only`-inducing even though its value is whole). Fix at the source:

In `ast.ts`, change:
```typescript
export interface NumberLiteral { type: 'number'; value: number }
```
to:
```typescript
export interface NumberLiteral { type: 'number'; value: number; hasDecimalPoint: boolean }
```

In `parser.ts`, every site constructing `{ type: 'number', value: ... }` for an `Expression` (search for that exact literal-object pattern — there are several, all following the shape `{ type: 'number', value: parseFloat(tok.value) }` or similar) needs `hasDecimalPoint: tok.value.includes('.')` added, computed from the *raw token text* (`tok.value`, a string, holds the original literal text before `parseFloat` runs). **Do not touch `parseDataValue()`** (around `parser.ts:619`) — it constructs the separate `Literal` type (`{ type: 'number'; value: number } | { type: 'string'; ... }`, used for `DATA` values, not `Expression`), which stays out of scope for this task since `READ`-sourced variables are always `bcd-only` regardless (see Step 4) — no need to track decimal-ness for `DATA` values themselves.

- [ ] **Step 4: Implement the pass**

```typescript
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
    if (expr.type === 'binary' && ['+', '-', '*', 'mod', '/'].includes(expr.op)) {
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
  let changed = true;
  while (changed) {
    changed = false;
    function exprTouchesIneligible(expr: Expression): boolean {
      if (expr.type === 'variable' && !expr.ref.isString) {
        return expr.ref.indices !== undefined || ineligible.has(expr.ref.name);
      }
      if (expr.type === 'binary') return exprTouchesIneligible(expr.left) || exprTouchesIneligible(expr.right);
      return false;
    }
    function recheckAssignment(name: string, expr: Expression): void {
      if (!ineligible.has(name) && exprTouchesIneligible(expr)) {
        ineligible.add(name);
        changed = true;
      }
    }
    function recheckStatement(stmt: Statement): void {
      switch (stmt.type) {
        case 'let':
          if (!stmt.variable.isString && !stmt.variable.indices) {
            recheckAssignment(stmt.variable.name, stmt.expr);
          }
          break;
        case 'for':
          if (!stmt.variable.isString && !stmt.variable.indices) {
            recheckAssignment(stmt.variable.name, stmt.from);
            if (exprTouchesIneligible(stmt.to)) { ineligible.add(stmt.variable.name); changed = true; }
            if (stmt.step && exprTouchesIneligible(stmt.step)) { ineligible.add(stmt.variable.name); changed = true; }
          }
          break;
        case 'if':
          for (const s of stmt.thenBranch) recheckStatement(s);
          if (stmt.elseBranch) for (const s of stmt.elseBranch) recheckStatement(s);
          break;
      }
    }
    for (const [, stmts] of program.lines) for (const stmt of stmts) recheckStatement(stmt);
  }

  const eligible = new Set<string>();
  for (const name of everAssigned) if (!ineligible.has(name)) eligible.add(name);
  return eligible;
}
```

This is grounded directly against the real `ast.ts` (verified while writing this plan, not assumed): `LetStatement` is `{ variable: VarRef; expr: Expression }` (not `target`/`value`), `VariableExpr` is `{ ref: VarRef }` (name/isString/indices live under `.ref`, not directly on the expression), `VarRef.indices?: Expression[]` marks an array access (excluded here — arrays are always `bcd-only` per this plan's Global Constraints), and `BinaryOp` uses lowercase `'mod'`. Still worth a final check against `ast.ts` before implementing, in case something has changed since this plan was written.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/type-inference.test.ts`
Expected: PASS (all 10 cases).

- [ ] **Step 6: Commit**

```bash
git add tools/compiler/ast.ts tools/compiler/parser.ts tools/compiler/type-inference.ts tools/compiler/tests/type-inference.test.ts
git commit -m "feat(compiler): static integer-eligibility inference pass"
```

---

### Task 2: Shared BCD↔int16 conversion subroutines

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-conversion.test.ts`

**Interfaces:**
- Consumes: nothing from other new-in-this-plan code (this is the foundation everything else builds on).
- Produces: two shared subroutines emitted once per compiled program (same pattern as `ROM_CALL`/`ROM_CALL_FP` in `emitRomCallWrapper()`, `codegen.ts` — read that method first, this follows its shape): `BCD_TO_INT16` and `INT16_TO_BCD`. Also produces two private codegen methods, `emitBcdToInt16()` and `emitInt16ToBcd()`, that emit a `cal` to these subroutines from a call site — these are what Tasks 3+ call.

This is the highest-risk task in the plan: every later task depends on these being exactly right, and there is no existing precedent in this codebase for binary↔BCD conversion (everything so far has stayed in BCD). Budget real time for empirical verification here.

**The algorithm (language-level; translate to HD61700 assembly, verifying every instruction choice empirically):**

`BCD_TO_INT16` (decode): given the BCD accumulator ($10-$18, following this compiler's existing convention for "the value currently being operated on"), compute the integer value as `sign × (d1×10^(n-1) + d2×10^(n-2) + ... + dn×10^0)`, where `n = biasedExponent - 100 + 1` is the integer digit count and `d1..dn` are the first `n` mantissa digits (per the BCD format section above). Equivalently: accumulate left-to-right, `result = 0; for each of the first n digits: result = result*10 + digit`. Apply the sign (from `bytes[8] >= 5`) at the end. Since integer-eligible variables are guaranteed whole numbers by Task 1, `n` will never exceed 5 (the widest 16-bit-safe integer, 32767, has 5 digits) for a value that's about to be used in the fast path — but the overflow guard (Task 3) is what actually enforces this at runtime; this subroutine itself should not assume `n <= 5` without a check (see Error Handling below).

`INT16_TO_BCD` (encode): given a signed 16-bit value in a register pair, extract its absolute value's decimal digits via repeated `remainder = value MOD 10; value = value DIV 10`, collecting remainders least-significant-digit-first (up to 5 digits), then place them into the mantissa in the same nibble layout `bcd.ts` uses (`d1` in the high nibble position closest to `bytes[6]`, working down), set `bytes[7]`/`bytes[8]` from the digit count as the biased exponent, fold the sign into `bytes[8]` if negative, and write all 9 bytes to the accumulator ($10-$18). Zero is the special case: all-zero bytes, matching `bcd.ts`'s own zero encoding — do not run the general digit-extraction path for exactly zero.

**Register convention:** pick a register range for `BCD_TO_INT16`'s output (the 16-bit integer) and `INT16_TO_BCD`'s input that doesn't collide with anything in the Global Constraints section above. Document your choice with a comment the same way `emitRomCallFp`'s comment in `codegen.ts` documents its own register choice and why it's safe — this is the pattern to follow, not simply mimic the specific registers (which are already spoken for).

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('emits the BCD_TO_INT16 and INT16_TO_BCD shared subroutines once per program', () => {
    const asm = generate(parse('10 A=5\n20 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    expect(labels).toContain('BCD_TO_INT16');
    expect(labels).toContain('INT16_TO_BCD');
    // emitted exactly once, not once per call site
    expect(labels.filter(l => l === 'BCD_TO_INT16').length).toBe(1);
    expect(labels.filter(l => l === 'INT16_TO_BCD').length).toBe(1);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "BCD_TO_INT16"`
Expected: FAIL — the labels don't exist yet.

- [ ] **Step 3: Implement the two subroutines**

Add `emitIntFastPathWrapper()` (called from `generate()` alongside the existing `this.emitRomCallWrapper()` call) that pushes the `BCD_TO_INT16` and `INT16_TO_BCD` label blocks, implementing the algorithm above. Read `emitRomCallWrapper()` first for the established pattern of how a shared, call-once subroutine is emitted and labeled in this file. Do not write the exact instruction sequence here without reading `src/emulator/exec.ts` for the real semantics of every instruction you plan to use (`adw`, `sbcw`, the digit-shift family `dium`/`didm`/`diuw`/`didw` — confirmed nibble/4-bit shifts, i.e. ×16/÷16, **not** decimal ×10/÷10, so a genuine ×10 step needs to be built from these plus `adw`, e.g. via doubling — verify your exact approach against the emulator before trusting it).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "BCD_TO_INT16"`
Expected: PASS.

- [ ] **Step 5: Write the empirical round-trip test**

```typescript
// tools/emu-debugger/tests/intfast-conversion.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { numberToBcd9 } from '../../compiler/bcd.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv } from '../../../src/emulator/def.js';

// These tests call emitBcdToInt16()/emitInt16ToBcd() directly by compiling a
// tiny program that stages a known BCD value into the accumulator, calls the
// conversion subroutine, and stores the result somewhere observable. The
// exact test-scaffolding mechanism (a temporary AST-free codegen entry point,
// or a minimal BASIC snippet plus a way to inject/observe the intermediate
// register state) depends on the internal API Steps 1-4 actually produced —
// design the harness once you know the real emitBcdToInt16()/emitInt16ToBcd()
// signatures and the register convention chosen. At minimum, cover:
describe('BCD <-> int16 conversion round-trip (via the real ROM/CPU, not simulated)', () => {
  const cases = [0, 1, -1, 541, -541, 32767, -32768, 9999, -9999];
  for (const n of cases) {
    it(`round-trips ${n}`, () => {
      // 1. Inject numberToBcd9(n) into a variable's storage.
      // 2. Compile+run a program that: loads the variable, calls
      //    BCD_TO_INT16, calls INT16_TO_BCD, stores the result to a second
      //    variable.
      // 3. Read the second variable's 9 bytes, compare against
      //    numberToBcd9(n) exactly.
    });
  }
});
```

Fill in the harness per the note in the test file, following the established `EmulatorSession` pattern from `tools/emu-debugger/tests/task4-constants-fix.test.ts` (symbol-table address lookup, `setIserv(0)`, breakpoint-based stopping — read that file for the exact API shape). Also test the boundary values `32767`/`-32768` specifically, since those are exactly where a 5-vs-4-digit boundary or a sign-handling bug would first show up.

- [ ] **Step 6: Run the empirical test, confirm it passes for every case**

Run: `npx vitest run tools/emu-debugger/tests/intfast-conversion.test.ts`
Expected: PASS for all 9 cases, byte-exact against `numberToBcd9()`.

If any case fails, investigate and fix the conversion algorithm — do not adjust the expected bytes to match a wrong result.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-conversion.test.ts
git commit -m "feat(compiler): shared BCD<->int16 conversion subroutines for the integer fast path"
```

---

### Task 3: Fast path for `+` and `-`, with overflow guard

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-addsub.test.ts`

**Interfaces:**
- Consumes: `inferIntegerEligibility()` (Task 1), `emitBcdToInt16()`/`emitInt16ToBcd()` (Task 2).
- Produces: `emitBinaryExpr` gains a fast-path branch for `+`/`-`, taken when `this.integerEligible` (a `Set<string>` field on the `CodeGen` class, populated from `inferIntegerEligibility(program)` at the start of `generate()`) contains every variable operand and every literal operand is an integer literal. Establishes the pattern (decode both operands, native op, overflow check, fall back to BCD on overflow, encode-and-store) that Tasks 4-7 repeat for their own operators.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('uses the fast integer path for + when both operands are integer-eligible', () => {
    const asm = generate(parse('10 A=5\n20 B=3\n30 C=A+B\n40 END\n'));
    const mnems = asm.lines.map(l => l.mnemonic).filter(Boolean);
    expect(mnems).toContain('adw');
    // must NOT stage the old BCD operand convention for this expression
    const romCallSites = asm.lines.filter(l => l.comment === '+').length;
    expect(romCallSites).toBe(0); // no ROM FP_ADD call for this integer-eligible expression
  });

  it('still uses the BCD path for + when an operand is not integer-eligible', () => {
    const asm = generate(parse('10 A=3.14\n20 B=1\n30 C=A+B\n40 END\n'));
    const mnems = asm.lines.map(l => l.mnemonic).filter(Boolean);
    expect(mnems).toContain('cal'); // ROM_CALL_FP still used
  });
```

(Adjust the exact assertions once you see what `emitBinaryExpr`'s fast path actually emits — these pin the *behavior*, not literal instruction text; keep them meaningful rather than fragile.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for +"`
Expected: FAIL.

- [ ] **Step 3: Implement the fast path in `emitBinaryExpr`**

Add a check at the top of the `+`/`-` handling: if `op` is `+` or `-` and both `left`/`right` are integer-eligible (a variable in `this.integerEligible`, or an integer literal — write a small `isIntegerEligibleExpr(expr)` helper reusable by later tasks too), emit:
1. Evaluate left, `emitBcdToInt16()` → 16-bit register pair.
2. Evaluate right, `emitBcdToInt16()` → a different 16-bit register pair.
3. Native `adw`/`sbcw`.
4. **Overflow check** — determine empirically (against `exec.ts`) which condition code correctly detects that a *signed* 16-bit add/subtract's true result fell outside −32768..32767. This is not necessarily the CPU's raw carry flag (carry typically reflects *unsigned* wraparound, not signed overflow) — verify this distinction against the real emulator before trusting any specific flag/condition code, the same way Task 2c had to verify Z/NEG semantics empirically rather than assume them.
5. If overflow: fall through to the existing BCD path using the operands' original BCD bytes (still in memory — nothing has been destroyed).
6. If not: `emitInt16ToBcd()` and store.

Leave the existing BCD-path code for `+`/`-` completely untouched — this is purely additive, gated by the new eligibility check.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for +"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/intfast-addsub.test.ts
// Follow the compileAndRun() pattern from tools/emu-debugger/tests/task4-constants-fix.test.ts.
// Required cases, each compiling real BASIC source with real integer literals
// (not injected BCD bytes, since the whole point is proving the fast path
// end-to-end):
//   10 A=5\n20 B=3\n30 C=A+B\n40 END\n           -> VAR_C = numberToBcd9(8)
//   10 A=5\n20 B=3\n30 C=A-B\n40 END\n           -> VAR_C = numberToBcd9(2)
//   10 A=3\n20 B=5\n30 C=A-B\n40 END\n           -> VAR_C = numberToBcd9(-2)  (negative result)
//   10 A=32000\n20 B=1000\n30 C=A+B\n40 END\n    -> VAR_C = numberToBcd9(33000) (OVERFLOW: must fall back to BCD and still be correct)
//   10 A=-32000\n20 B=-1000\n30 C=A+B\n40 END\n  -> VAR_C = numberToBcd9(-33000) (OVERFLOW, other direction)
```

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/intfast-addsub.test.ts`
Expected: PASS for all 5 cases — including both overflow cases producing the *correct* answer via fallback, not just "didn't crash".

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-addsub.test.ts
git commit -m "feat(compiler): fast integer path for + and - with overflow fallback"
```

---

### Task 4: Fast path for comparisons

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-compare.test.ts`

**Interfaces:**
- Consumes: `emitBcdToInt16()` (Task 2), `this.integerEligible`/`isIntegerEligibleExpr()` (Task 3).
- Produces: `emitComparisonBranch` (used by `emitCondition`, which drives `IF`/`WHILE`) gains a fast path for all six comparison operators when both operands are integer-eligible.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('uses the fast integer path for a comparison when both operands are integer-eligible', () => {
    const asm = generate(parse('10 A=5\n20 B=3\n30 IF A>B THEN PRINT 1\n40 END\n'));
    const mnems = asm.lines.map(l => l.mnemonic).filter(Boolean);
    // native subtract used instead of staging through ROM_CALL_FP + FP_SUB
    expect(mnems).toContain('sbcw');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for a comparison"`
Expected: FAIL.

- [ ] **Step 3: Implement the fast path**

Decode both operands to int16, native subtract, then classify the six operators from the resulting flags — determine empirically which condition codes correspond to `=`/`<>`/`<`/`>`/`<=`/`>=` for a native signed 16-bit subtract (this is a *different* instruction from the BCD path's `orcm`/`anc` byte tests built in Task 2c, so its flag semantics need their own empirical verification, not an assumption that they match). `emitComparisonBranch`'s existing signature/contract (branch to `falseLabel` when the condition doesn't hold, fall through when it does) should stay the same — only the *how* changes for the fast-path case.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for a comparison"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/intfast-compare.test.ts
// One true-branch and one false-branch case per operator (=, <>, <, >, <=, >=),
// following the exact pattern established in
// tools/emu-debugger/tests/task2c-condition-fix.test.ts (which did this same
// thing for the BCD comparison path — reuse its test shape, not its
// assertions). Use integer-eligible variables and literals throughout so the
// fast path is actually exercised. Also include a WHILE-loop case (a loop
// that increments an integer-eligible counter and exits via an
// integer-eligible comparison) to prove the fast path works through
// emitCondition's WHILE usage, not just IF.
```

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/intfast-compare.test.ts`
Expected: PASS for all cases.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-compare.test.ts
git commit -m "feat(compiler): fast integer path for comparisons"
```

---

### Task 5: Fast path for `*`, with overflow guard

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-mul.test.ts`

**Interfaces:**
- Consumes: same as Task 3.
- Produces: `emitBinaryExpr`'s `*` case gains the same shape of fast path as `+`/`-`.

The HD61700 has no hardware multiply. A 16×16-bit multiply needs a software loop (shift-and-add: for each of the 16 bits of one operand, conditionally add the (progressively shifted) other operand into an accumulator wide enough to hold the full up-to-32-bit product before the range check). This can reuse the digit/bit-shift instructions already surveyed in Task 2 (verify shift-by-1-bit vs shift-by-4-bit availability empirically — `dium`/`didm`/`diuw`/`didw` are 4-bit/"digit" shifts per Task 2's finding, so a binary shift-and-add multiply needs either a genuine 1-bit shift instruction (check the opcode table) or an equivalent built from what's available).

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('uses the fast integer path for * when both operands are integer-eligible', () => {
    const asm = generate(parse('10 A=6\n20 B=7\n30 C=A*B\n40 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    expect(labels).toContain('BCD_TO_INT16'); // conversion subroutine present
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for \*"`
Expected: FAIL.

- [ ] **Step 3: Implement the fast path**

Same overall shape as Task 3: decode both operands, multiply via the software loop, check the product fits −32768..32767 (not just that it fits in whatever intermediate width the multiply loop uses internally — the *final* range check is what matters), fall back to BCD `FP_MUL` on overflow, otherwise encode and store.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for \*"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/intfast-mul.test.ts
// Required cases:
//   6*7 = 42 (fast path, small)
//   -6*7 = -42 (sign handling)
//   -6*-7 = 42 (both negative)
//   200*200 = 40000 (OVERFLOW: exceeds 32767, must fall back to BCD, still correct)
//   181*181 = 32761 (just under the boundary, fast path, correct)
//   182*181 = 32942 (just over, overflow, falls back, correct)
```

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/intfast-mul.test.ts`
Expected: PASS for all 6 cases, boundary cases exact.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-mul.test.ts
git commit -m "feat(compiler): fast integer path for * with overflow fallback"
```

---

### Task 6: Shared integer division routine + fast path for `MOD`

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-mod.test.ts`

**Interfaces:**
- Consumes: same as Task 3.
- Produces: a new shared subroutine `INT16_DIVMOD` (same "emit once, call via `cal`" pattern as `BCD_TO_INT16`/`INT16_TO_BCD`), taking two 16-bit operands and producing both quotient and remainder. `emitBinaryExpr`'s `MOD` case uses it directly. Task 7 (`/`) reuses this same subroutine.

No hardware divide either — this needs a software binary long-division loop (repeated shift-and-subtract, 16 iterations for a 16-bit dividend), producing both outputs since `MOD` needs the remainder and Task 7's `/` needs the quotient.

**BASIC's `MOD` semantics matter here**: confirm what sign the result should have for negative operands by checking the *existing* BCD `MOD` path's behavior (already implemented and tested — `tools/emu-debugger/tests/task3-mod-div-fix.test.ts` and the ROM's own `&H105F` entry point convert both operands to absolute values internally, per the finding already recorded in this branch's history) and match it, rather than picking an arbitrary convention. The fast path must agree with the existing BCD path's behavior for negative operands, or a program could get a different `MOD` result depending on whether its operands happened to be integer-eligible — a real correctness bug, not just an inconsistency.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('uses the fast integer path for MOD when both operands are integer-eligible', () => {
    const asm = generate(parse('10 A=17\n20 B=5\n30 C=A MOD B\n40 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    expect(labels).toContain('INT16_DIVMOD');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for MOD"`
Expected: FAIL.

- [ ] **Step 3: Implement `INT16_DIVMOD` and the `MOD` fast path**

Note `MOD` has no overflow case the way `+`/`-`/`*` do (an integer remainder of two 16-bit-range integers always fits in 16-bit range) — no BCD fallback needed for `MOD` itself. Division by zero: check what the *existing* BCD `MOD`/`/` paths currently do for a zero divisor (read the ROM annotations / existing test coverage) and match that behavior in the fast path rather than inventing new error handling.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for MOD"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/intfast-mod.test.ts
// Required cases, cross-checked against the EXISTING BCD MOD path's behavior
// for the same inputs (tools/emu-debugger/tests/task3-mod-div-fix.test.ts):
//   17 MOD 5 = 2
//   12 MOD 4 = 0 (exact)
//   10 MOD 3 = 1
//   -17 MOD 5 = ? (must match whatever the existing BCD path produces for this exact input -- run both paths on the same inputs and assert they agree, don't just assert a guessed value)
```

- [ ] **Step 6: Run the empirical tests, confirm they pass and agree with the existing BCD path**

Run: `npx vitest run tools/emu-debugger/tests/intfast-mod.test.ts`
Expected: PASS, including the negative-operand case matching the BCD path's existing behavior exactly.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-mod.test.ts
git commit -m "feat(compiler): shared integer division routine + fast integer path for MOD"
```

---

### Task 7: Fast path for `/`, with exact-division check

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-div.test.ts`

**Interfaces:**
- Consumes: `INT16_DIVMOD` (Task 6).
- Produces: `emitBinaryExpr`'s `/` case gains a fast path.

Per the design's documented tradeoff: this fast path only pays off when division results are usually whole numbers. When the remainder is non-zero, this attempt is discarded and the *full* BCD `FP_DIV` path runs on the original operands — i.e. the inexact case is strictly more expensive than just always using BCD would have been for that one operation. This is accepted, not a bug — document it with a comment at the fast-path `/` call site pointing at this tradeoff, so a future reader isn't surprised by the double-work shape.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('uses the fast integer path for / when both operands are integer-eligible', () => {
    const asm = generate(parse('10 A=20\n20 B=4\n30 C=A/B\n40 END\n'));
    const labels = asm.lines.map(l => l.label).filter(Boolean);
    expect(labels).toContain('INT16_DIVMOD');
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for /"`
Expected: FAIL.

- [ ] **Step 3: Implement the fast path**

Call `INT16_DIVMOD`, check the remainder is zero; if so, `emitInt16ToBcd()` the quotient and store; if not, fall through to the existing BCD `FP_DIV` call using the original (untouched) BCD operand bytes.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for /"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/intfast-div.test.ts
// Required cases:
//   20/4 = 5 (exact, fast path)
//   7/2 = 3.5 (INEXACT: must fall back to the full BCD FP_DIV and still be correct)
//   -20/4 = -5 (exact, negative)
//   10/3 = 3.333... (inexact, another fallback case)
```

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/intfast-div.test.ts`
Expected: PASS, both exact and inexact cases producing correct BCD results.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-div.test.ts
git commit -m "feat(compiler): fast integer path for / with exact-division check"
```

---

### Task 8: `FOR`/`NEXT` fast path

**Files:**
- Modify: `tools/compiler/codegen.ts`
- Test: `tools/compiler/tests/codegen.test.ts`, new file `tools/emu-debugger/tests/intfast-for.test.ts`

**Interfaces:**
- Consumes: everything from Tasks 2-4 (decode/encode, fast `+`, fast comparison).
- Produces: `emitFor`/`emitNext` use the fast path for the loop counter's increment and continuation test when the counter, limit, and step are all integer-eligible (which Task 1's inference pass already determines — a `FOR` loop's counter is only integer-eligible if `from`/`to`/`step` all are).

This task is mostly wiring — `emitNext`'s increment (`counter = counter + step`) and continuation test (`counter <= limit`) already call into the same kind of staging `emitBinaryExpr`/`emitComparisonBranch` use; the fast-path check just needs to apply here too, following the exact pattern Tasks 3-4 established rather than re-deriving it.

- [ ] **Step 1: Write the failing codegen test**

```typescript
// in tools/compiler/tests/codegen.test.ts
  it('uses the fast integer path for a FOR loop when counter/limit/step are all integer-eligible', () => {
    const asm = generate(parse('10 FOR I=1 TO 10\n20 NEXT I\n30 END\n'));
    const mnems = asm.lines.map(l => l.mnemonic).filter(Boolean);
    expect(mnems).toContain('adw'); // fast increment
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for a FOR loop"`
Expected: FAIL.

- [ ] **Step 3: Implement**

Wire the same eligibility check into `emitFor`/`emitNext`. Reuse Tasks 3/4's helpers directly — do not duplicate the overflow-guard or comparison-classification logic.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "fast integer path for a FOR loop"`
Expected: PASS.

- [ ] **Step 5: Write the empirical tests**

```typescript
// tools/emu-debugger/tests/intfast-for.test.ts
// Required cases:
//   10 S=0\n20 FOR I=1 TO 100\n30 S=S+I\n40 NEXT I\n50 END\n  -> VAR_S = numberToBcd9(5050)
//   A FOR loop with STEP 2, confirming the fast increment respects a non-default step
//   A FOR loop whose limit is 32767 (near the 16-bit boundary) that still terminates correctly
```

- [ ] **Step 6: Run the empirical tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/intfast-for.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts tools/emu-debugger/tests/intfast-for.test.ts
git commit -m "feat(compiler): fast integer path for FOR/NEXT loops"
```

---

### Task 9: Listing visibility for the classification

**Files:**
- Modify: `tools/compiler/listing.ts`, `tools/compiler/compile.ts`
- Test: `tools/compiler/tests/listing.test.ts` (create if it doesn't exist — check first)

**Interfaces:**
- Consumes: `inferIntegerEligibility()`'s result (Task 1), already computed once in `generate()` and stored as `this.integerEligible` (Task 3).
- Produces: `ListingInput` (in `listing.ts`) gains an `integerEligible: Set<string>` field; `formatListing()` emits a new section.

- [ ] **Step 1: Write the failing test**

```typescript
// in tools/compiler/tests/listing.test.ts (or wherever existing listing tests live — check tools/compiler/tests/ first)
  it('lists integer-eligible and bcd-only variables separately', () => {
    const asm = generate(parse('10 A=5\n20 X=3.14\n30 END\n'));
    const assembled = assemble(asm.lines);
    const listing = formatListing({ /* ...existing fields..., */ integerEligible: asm.integerEligible, symbols: assembled.symbols });
    expect(listing).toContain('Integer-Eligible Variables:');
    expect(listing).toContain('VAR_A');
    expect(listing).toContain('BCD-Only Variables:');
    expect(listing).toContain('VAR_X');
  });
```

(Check `listing.test.ts`'s actual existing test setup first — match its exact helper functions/imports rather than guessing; if no such file exists yet, check how `compile.ts` currently calls `formatListing()` to build an equivalent minimal test.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tools/compiler/tests/listing.test.ts -t "integer-eligible and bcd-only"`
Expected: FAIL.

- [ ] **Step 3: Implement**

Add the `integerEligible: Set<string>` field to `ListingInput`, and a new section in `formatListing()` right after (or before — match the existing `Symbol Table:` section's placement style) that section, listing eligible and ineligible variable names split into two groups (per the design spec's example format). Thread `this.integerEligible` from `CodeGen` through `AsmProgram`'s return value (`generate()`'s return type) to `compile.ts`'s call into `formatListing()` — check `AsmProgram`'s current shape in `asm-types.ts` first and extend it consistently with how `symbols`/other metadata already flow through this same path.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tools/compiler/tests/listing.test.ts -t "integer-eligible and bcd-only"`
Expected: PASS.

- [ ] **Step 5: Regenerate and manually inspect a real listing**

Run: `npx tsx tools/compiler/compile.ts public/basic/emulator/PRIMES.BAS` and read `build/compiler/PRIMES.lst` — confirm `C`, `N`, `K` appear under "Integer-Eligible Variables" (they should: every assignment to each is a whole-number expression, per the source in `public/basic/emulator/PRIMES.BAS`).

- [ ] **Step 6: Commit**

```bash
git add tools/compiler/listing.ts tools/compiler/compile.ts tools/compiler/tests/listing.test.ts
git commit -m "feat(compiler): show integer-eligibility classification in the .lst listing"
```

---

### Task 10: End-to-end verification and benchmarking on PRIMES.BAS

**Files:**
- Modify: `tools/emu-debugger/tests/primes.test.ts` (confirm still passes, no code change expected)
- Create: a benchmarking note appended to `public/basic/emulator/PRIMES.md`, documenting the measured result

**Interfaces:**
- Consumes: everything from Tasks 1-9.
- Produces: nothing consumed by other tasks — this is the plan's final proof, mirroring how Task 7 closed out the original BCD arithmetic plan.

This is the task that answers the question this whole plan exists to answer: how much of the 83-85%-in-ROM gap did this actually close.

- [ ] **Step 1: Confirm the existing acceptance test still passes unchanged**

Run: `npx vitest run tools/emu-debugger/tests/primes.test.ts`
Expected: PASS, LCD still shows `541`. No code change to this test file should be needed — if one is, that's a sign something in Tasks 1-9 changed externally-visible behavior it shouldn't have.

- [ ] **Step 2: Re-run the instruction-category profiling from the original investigation**

Using the same method as the investigation that motivated this plan (trace a representative slice of PRIMES.BAS's inner trial-division loop via `EmulatorSession`'s `run({trace: true})`, bucket instructions by whether their PC falls inside the compiled program's own address range vs. ROM), measure the new ROM-vs-compiled-code instruction ratio for the same loop. Write a throwaway script for this (not committed — same approach used during the original investigation), report the before/after percentages.

- [ ] **Step 3: Re-measure the interpreted-vs-compiled wall-clock comparison**

Follow `public/basic/emulator/PRIMES.md`'s existing instructions (interpreted: load via LIB, `RUN`, stopwatch to `541`; compiled: `EXTCLR.BAS` → `MLLOADER.BAS` → send the freshly-recompiled `PRIMES.hex` → stopwatch to `541`). This is a manual/human-timed step — if running in an automated context without a human able to time it, report the emulator's own `instructionsExecuted`/cycle count for the compiled run instead (already easy to get from `EmulatorSession`'s result) as a proxy, and flag that the human-timed wall-clock comparison is still needed before treating the improvement as final.

- [ ] **Step 4: Document the result**

Append a short section to `public/basic/emulator/PRIMES.md` recording: the new ROM-vs-compiled-code instruction ratio, the new measured (or proxied) speedup versus interpreted, and a one-line pointer back to this plan and its design spec for anyone wanting the full story.

- [ ] **Step 5: Commit**

```bash
git add public/basic/emulator/PRIMES.md
git commit -m "docs(compiler): record integer fast-path benchmark results for PRIMES.BAS"
```

---
