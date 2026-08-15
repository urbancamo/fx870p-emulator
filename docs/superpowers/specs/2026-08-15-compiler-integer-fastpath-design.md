# Native Integer Arithmetic Fast Path — Design

> Created: 2026-08-15
> Status: Approved (brainstorming phase)
> Related: `docs/superpowers/specs/2026-08-12-compiler-bcd-arithmetic-design.md`

## Goal

The BCD arithmetic work made the compiler correct — `PRIMES.BAS` compiles and prints
541 — but compiled performance is only ~50% faster than interpreted BASIC, well below
what compiling to native machine code should achieve. Profiling the compiled binary's
hot loop (`tools/emu-debugger/`, tracing actual instruction execution through
PRIMES.BAS's trial-division inner loop) found why: **83-85% of every loop iteration's
instructions execute inside the ROM's general-purpose 13-digit BCD floating-point
library**, not in code the compiler generated. Both the interpreter and the compiled
code call the exact same ROM routines for every `+`, `MOD`, and comparison — so
compiling can only ever eliminate the interpreter's own overhead (tokenizing,
AST-walking, variable lookup), which is the ~15-17% of cycles that were ever the
compiler's to control. The ratio gets worse, not better, for larger numbers: the
ROM's digit-serial arithmetic (chains of `dium`/`didm`/`sbb`/`sbc` in tight loops,
working through up to 13 decimal digits one nibble at a time) scales with how many
digits are in play, while the compiler's own per-statement overhead stays fixed.

This design adds a fast native-integer path: when the compiler can prove an
expression only ever involves small whole numbers, skip the ROM's BCD library
entirely and use the HD61700's native 16-bit word instructions instead. This is the
only change identified that touches the dominant 83-85% cost rather than trimming the
compiler's own already-small share.

## Current State

Every numeric variable is stored as 9-byte BCD (`tools/compiler/bcd.ts`), and every
arithmetic operation (`emitBinaryExpr`, `emitComparisonBranch` in `codegen.ts`) stages
both operands into fixed register ranges and calls a ROM routine
(`FP_ADD`/`FP_SUB`/`FP_MUL`/`FP_DIV`/`MOD`) — regardless of whether the values
involved could ever be fractional. `FOR`/`NEXT` (`emitFor`/`emitNext`) use the same
BCD arithmetic for the loop counter's increment and limit test. None of this
distinguishes "this is definitely a whole number in a small range" from "this could
be anything" — every operation pays the full BCD cost.

## Scope

In scope:
- A whole-program static analysis classifying each scalar variable as
  `integer-eligible` or `bcd-only`.
- A fast native 16-bit codegen path for `+`, `-`, `*`, `MOD`, `/`, and all six
  comparisons, used only when every operand feeding an operation is
  integer-eligible (a classified variable or an integer literal).
- `FOR`/`NEXT` benefiting from the same fast path when the loop counter, limit, and
  step are all integer-eligible.
- A runtime overflow guard on every fast-path operation, falling back to the
  existing BCD path (recomputing from the same BCD-stored operand bytes) whenever
  the true result wouldn't fit in a 16-bit signed integer, or (for `/`
  specifically) whenever the division isn't exact.
- Making the classification visible in the `.lst` listing output, so a developer
  can see which variables in their program actually got the fast path without
  reading generated assembly (see `tools/compiler/listing.ts` changes below).

Out of scope:
- Arrays. Array elements are always `bcd-only`, unchanged from today.
- Any change to variable storage layout — integer-eligible variables still live as
  9-byte BCD in memory; the fast path converts to/from a 16-bit register value only
  around the arithmetic itself.
- `INPUT`-sourced variables. Any variable ever targeted by `INPUT` is `bcd-only` for
  its entire lifetime, unconditionally — its value can't be known at compile time,
  and this sidesteps needing to reason about what a user might type.
- 32-bit or wider integers. 16-bit signed (−32768..32767) matches the CPU's native
  word instructions (`adw`/`sbcw`) directly; going wider would need multi-word
  sequences built from pairs of operations, at higher codegen complexity for less
  benefit per operation.
- Re-deriving `PRIMES.BAS` or writing a new benchmark — the existing profiling
  methodology (instruction-category tracing over the hot loop) and existing
  interpreted/compiled stopwatch comparison are reused to measure this feature's
  actual impact once built.

## Components

### `tools/compiler/type-inference.ts` (new)

A single pass over the AST, run once after parsing, before codegen. For every scalar
variable, walks every assignment site in the whole program and decides
`integer-eligible` or `bcd-only`:

- **Starts integer-eligible.** A variable stays eligible only if every assignment to
  it, everywhere in the program, is provably an integer expression: an integer
  literal (no decimal point), or the result of `+`/`-`/`*`/`MOD`/`/` between
  sources that are themselves integer-eligible.
- **Becomes `bcd-only`, permanently, on any of:** a decimal-point literal assigned
  to it anywhere; being the target of `INPUT` anywhere; an expression assigned to
  it that touches any `bcd-only` variable anywhere.
- Classification is whole-variable, whole-program — no per-line/per-scope type
  tracking. If a variable is assigned an integer at one point and a decimal at
  another, it's `bcd-only` everywhere, including the integer-looking assignment.
- Output: a `Set<string>` of integer-eligible variable names, consumed by
  `codegen.ts`.

### `tools/compiler/listing.ts` changes

The `.lst` output already has a `Symbol Table:` section (`formatListing()`, built
from `ListingInput.symbols`). A new `Integer-Eligible Variables:` section goes
alongside it, listing variable names split by classification — e.g.:

```
Integer-Eligible Variables:
  K  N  C

BCD-Only Variables:
  X  Y
```

This is the inference pass's `Set<string>` output made directly visible, so a
developer can see at a glance which variables in their program actually got the
fast path without needing to read generated assembly. `ListingInput` gains an
`integerEligible: Set<string>` field, threaded through from `type-inference.ts`'s
result via `compile.ts` the same way `symbols` already flows from the assembler.

### `tools/compiler/codegen.ts` changes

- `emitBinaryExpr`, `emitComparisonBranch`, `emitFor`, `emitNext`: each checks
  whether every operand involved is integer-eligible (in the inference pass's set,
  or an integer literal) before choosing codegen path. If not, behavior is
  completely unchanged — the existing BCD path handles it exactly as today.
- New helper functions for the fast path itself: BCD→int16 decode, int16→BCD
  encode, and the arithmetic sequences per operator:
  - `+`/`-`: native `adw`/`sbcw` directly.
  - `*`: a software multiply loop (no hardware multiply on this CPU), checking the
    result fits 16-bit signed range.
  - `MOD`/`/`: share a software binary-division routine (no hardware divide)
    producing quotient and remainder. `MOD` uses the remainder directly — always
    well-defined, no fallback needed for a genuinely integer `MOD`. `/` checks the
    remainder is zero; if so, the quotient is the (exact) result; if not, the fast
    attempt is discarded and the original BCD operands go through the standard
    `FP_DIV` ROM call instead.
  - Comparisons: a single native subtract, using its flags directly — much simpler
    than the Z/NEG-byte classification the BCD comparison path needs.
- The exact CPU instructions/flags used to detect 16-bit signed overflow are not
  decided here — this needs empirical verification against `src/emulator/exec.ts`
  during implementation, matching how every other task on this compiler has
  verified CPU semantics rather than assumed them.

## Data Flow

```
BASIC source
    |
    v
Parser → AST
    |
    v
type-inference.ts  ──────────────►  Set<integer-eligible variable names>
    |                                        |
    v                                        v
codegen.ts: for each arithmetic op, are ALL operands integer-eligible?
    |                                        |
   no                                       yes
    |                                        |
    v                                        v
existing BCD path                  decode BCD → int16, native op, overflow check
(unchanged)                                  |
                                    overflow / inexact-division? ──yes──► fall back
                                              |                            to BCD
                                             no                            path
                                              |
                                              v
                                    encode int16 → BCD, store
```

## Testing & Verification Strategy

Matching this codebase's established discipline: codegen-level assertions alone are
not sufficient proof, and every prior task on this compiler that trusted "the right
instructions got emitted" without running them found at least one wrong-result bug
under actual execution.

1. **Codegen tests**: given a program, assert `type-inference.ts` classifies
   variables correctly (including the adversarial cases below), and that the
   fast-path vs. BCD-path instruction shape is chosen correctly.
2. **Real emulator tests** (`EmulatorSession`, following the pattern already
   established in `tools/emu-debugger/tests/`): compile and run actual programs,
   check actual BCD bytes in memory afterward. Required cases:
   - Normal fast-path arithmetic for `+`/`-`/`*`/`MOD`/`/` and all six comparisons,
     producing correct results.
   - Overflow deliberately triggered for `+`, `-`, and `*`, confirming fallback to
     BCD still produces the correct answer.
   - `/` with an exact result (fast path) and an inexact result (falls back to
     `FP_DIV`), both correct.
   - A variable assigned an integer at one point and a decimal at another —
     confirmed `bcd-only` throughout and still correct.
   - A variable used inside a `GOSUB` called from multiple call sites with
     different argument patterns — a realistic way the whole-program inference
     could be tricked into a wrong classification.
   - `INPUT` variables confirmed to always take the BCD path regardless of what's
     typed at runtime.
   - `FOR`/`NEXT` with an integer-eligible counter/limit/step, confirming the loop
     still terminates correctly and the final counter value is right.
3. **Benchmarking is part of "done," not an afterthought.** Re-run the same
   instruction-category profiling that found the 83-85% ROM-time split, over
   `PRIMES.BAS`'s hot loop, after implementation — to quantify how much of that
   gap this closes. Re-measure the interpreted-vs-compiled wall-clock comparison
   the same way it was originally measured (external stopwatch, both runs).

## Error Handling & Edge Cases

- **Mis-classification is the dangerous failure mode, not a crash.** Every runtime
  guard (overflow, inexact division) has a single, already-correct fallback: the
  existing BCD path. The real risk is the *static* inference pass incorrectly
  classifying a variable as integer-eligible when it isn't — which would produce a
  silently wrong answer, not a visible failure. Testing specifically targets
  breaking the inference (see adversarial cases above), not just confirming the
  happy path.
- **`/`'s fast path can be a net loss for some programs.** When most divisions in a
  program are inexact, the fast path pays for a wasted integer-division attempt on
  top of the full BCD division it falls back to. This is a known, accepted
  tradeoff — PRIMES.BAS-shaped integer-heavy programs are exactly where this
  feature helps, and this needs to be documented plainly in the compiler's own
  comments, not hidden.
- **No new user-visible error paths.** A variable that can't be proven
  integer-eligible just silently uses the (already correct, already tested) BCD
  path — this feature can only make eligible programs faster, never break an
  ineligible one differently than today.

## Non-Goals

- Arrays, `INPUT` variables, and 32-bit+ integers are explicitly out of scope (see
  Scope above) — not deferred features to circle back to within this design, but
  boundaries the design deliberately doesn't cross.
- No change to how `PRINT`, `DATA`, or variable storage work — this is purely an
  arithmetic-operation-level optimization sitting inside the existing BCD storage
  model.
