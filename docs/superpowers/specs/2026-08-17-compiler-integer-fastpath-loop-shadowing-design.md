# Loop-Scoped Integer Arithmetic Shadowing — Design

> Created: 2026-08-17
> Status: Approved (brainstorming phase)
> Related:
> - `docs/superpowers/specs/2026-08-15-compiler-integer-fastpath-design.md` — original design. Tasks 1-2 (static integer-eligibility inference, shared BCD↔int16 conversion subroutines) are complete, unchanged, and reused as-is by this design. This document **supersedes** that design's Tasks 3-8 (per-operation fast path).
> - `docs/superpowers/plans/2026-08-15-compiler-integer-fastpath.md` — original plan. Tasks 3-8 are stale; this design's implementation plan replaces them. Tasks 9-10 (listing visibility, benchmarking) are still expected to apply, extended per this document.
> - `docs/superpowers/plans/2026-08-16-integer-fastpath-session-status.md` — session status explaining the pivot from per-operation to loop-scoped amortization.

## Goal

Close the gap the original design's Task 2 found: a naive per-operation fast path
(decode BCD→int16, do one native op, encode int16→BCD) makes `+`/`-` *slower* than
the ROM's own BCD routines, because conversion overhead (~2100-3700 cycles) exceeds
what `+` (1087 cy) or `-` (1300 cy) cost in isolation. Only `*`/`/`/`MOD` win in
isolation. But `PRIMES.BAS`'s hot loop is dominated by `+` (`K+K`) and by `FOR`/`NEXT`'s
own bookkeeping — so a per-operation path would leave the actual bottleneck largely
untouched, or make part of it worse.

This design amortizes the conversion cost instead of paying it per operation: for a
`FOR` loop that qualifies, decode the counter/limit/step to native int16 **once**, keep
them live in RAM for the loop's whole lifetime, and encode back to BCD **once**, at
normal exit. Every iteration's increment and limit test — paid today via a full
`FP_ADD` (1087 cy) and a full BCD comparison (1478 cy), *unconditionally, regardless of
loop body content* — becomes two native 16-bit register operations instead. This is
where the win comes from: not from any single operation beating ROM cost, but from
removing loop bookkeeping from the BCD path entirely.

## Background

See the session status doc for full detail. Summary: Task 2 measured real CPU cycle
costs and found:

| Operation | ROM cost (cycles) | Naive fast-path cost (decode+op+encode) |
|---|---|---|
| `+` | 1087 | ~2700-3500 (slower) |
| `-` | 1300 | ~2900-3700 (slower) |
| comparison | 1478 | roughly break-even |
| `*` | 3080 | real headroom |
| `/` | 7045 | real headroom |
| `MOD` | 10217 | real headroom |

An independent reviewer reproduced every figure exactly with a separate harness. This
is a confirmed constraint the design below is built around, not a risk to re-litigate.

## Scope

In scope:
- A static, whole-loop eligibility scan (new) deciding whether a given `FOR` loop
  qualifies for shadowing.
- RAM shadow-slot storage for a qualifying loop's counter, limit, and step —
  decoded once at loop entry, kept live as native int16 for the loop body, encoded
  back to BCD once at normal exit.
- `codegen.ts` changes so `NEXT`'s increment/comparison and any in-body arithmetic
  referencing the counter consult the shadow directly, skipping BCD entirely, when
  the loop is shadow-eligible.
- Listing visibility (extending the original design's Task 9): which `FOR` loops got
  shadowed, alongside the existing integer-eligible variable listing.

Out of scope (unchanged from the original design, still applies):
- General expression-tree amortization outside a `FOR` loop's scope.
- A full register allocator; shadow state lives in RAM, not pinned registers.
- Arrays, `INPUT`-sourced variables, 32-bit+ integers.
- Per-operation fast-path codegen for `*`/`/`/`MOD`/comparisons used *outside* a
  shadowed loop's counter — those still show real headroom per Task 2's table and
  are a legitimate future extension, but are not part of this document. This design
  only wires the fast native ops in for the specific case of a shadowed loop's own
  counter/limit/step traffic.

## Components

### `tools/compiler/loop-shadow-eligibility.ts` (new)

A static pass, run after `type-inference.ts` (needs its integer-eligible set) and
before `codegen.ts`. For every `FOR` statement in the program, decides shadow-eligible
or not, by walking the AST between the `FOR` and its matching `NEXT`:

**Eligible only if ALL of:**
1. Counter, limit, and step expressions are all integer-eligible (Task 1's existing
   classification, or an integer literal).
2. No statement in the loop body assigns to the counter, limit, or step names, other
   than the implicit increment `NEXT` itself performs (which isn't a source AST node
   the scan would ever see — only real, user-written assignments count).
3. Every reference to the counter inside the loop body is an operand of a binary or
   comparison operation where every other operand is also integer-eligible (i.e.,
   exactly the condition under which that operation would already use the native
   fast path). Any other use — `PRINT`, array subscript, builtin/`FN` call argument,
   assignment source to a `bcd-only` variable — disqualifies the loop.
4. No `GOTO`, `ON GOTO`, or `ON GOSUB` inside the loop body targets a line number
   outside the loop's own `[FOR line, NEXT line]` span.

Condition 4 exists because BASIC's common "break out of a loop" idiom is a bare
`GOTO` past `NEXT` — skipping the one place shadowing re-syncs BCD. Without this
check, code after such a jump would read a stale BCD counter value. `GOSUB` calls
*into* a subroutine are unaffected by any of this (see Error Handling) and don't
disqualify a loop.

Output: `Map<ForStatement, boolean>` (or equivalent, keyed by AST node identity —
`FOR` statements are unique object references, no synthetic ID needed), consumed by
`codegen.ts`.

Nested loops are evaluated independently. A shadowed outer loop containing an
unrelated, non-shadow-eligible inner loop works with no interaction: different
variable names get different RAM slots, and the inner loop's own body is scanned
against its own `[FOR, NEXT]` span. A loop reusing the *same* counter name as an
already-active outer loop is a pre-existing hazard shared with today's
`_FOR_LIMIT_K`/`_FOR_STEP_K` temporaries — not a new risk this design introduces, and
not newly solved by it either.

### RAM shadow-slot allocation (`codegen.ts`)

**Must not reuse `allocVariable`/`this.variables`.** That map's entries are always
9-byte BCD (or 256-byte string) and get emitted as `DS 9`/`DS 256` (codegen.ts:271-282)
and read by `listing.ts`'s Symbol Table. A 2-byte shadow slot in that map would corrupt
both the storage-size assumption and the listing output.

A new, separate allocation map (e.g. `private shadowSlots = new Map<string, string>()`,
name → label) backs three 2-byte `DS 2` reservations per shadowed loop variable —
counter, limit, step — using labels like `SHADOW_${varName}`, `SHADOW_LIMIT_${varName}`,
`SHADOW_STEP_${varName}`. Same emission mechanism as the existing variable table
(a `DS` directive per entry), just a separate map so a 2-byte slot can never be
mistaken for a 9-byte variable anywhere downstream.

### `codegen.ts`: `emitFor` / `emitNext` changes

- `emitFor`: after the existing BCD stores of initial value/limit/step (unchanged —
  the BCD form of the counter must still exist for the disqualified-loop case, and
  for the counter to be readable in its normal BCD form immediately after loop
  entry, before any shadow sync), check the eligibility map. If shadow-eligible,
  additionally decode all three (via Task 2's existing `emitBcdToInt16` helper) into
  the three shadow slots. Push the loop's shadow state onto a new stack (parallel to
  the existing `forStack`) so `emitBinaryExpr`/`emitComparisonBranch` can look up
  "is this variable name the counter of a currently-active shadowed loop."
- `emitNext`, shadowed case: replace the current `FP_ADD`-based increment and
  BCD-staged comparison (codegen.ts:1339-1379) with a native `adw` of the counter
  shadow by the step shadow, then a native compare against the limit shadow. On the
  branch where the loop is done (comparison fails), encode the counter shadow back
  to BCD (`emitInt16ToBcd`) and store it, so code after the loop sees a correct,
  up-to-date value — matching today's behavior for a disqualified loop exactly. On
  the branch where the loop continues, no BCD traffic at all. Pop the shadow stack
  entry when the loop is done. Limit and step shadows are never encoded back to
  BCD — condition 2 already guarantees nothing outside `NEXT`'s own machinery ever
  reads `_FOR_LIMIT_${var}`/`_FOR_STEP_${var}` in their BCD form, so only the
  counter's BCD copy needs to be current after the loop.
- `emitNext`, disqualified case: entirely unchanged — today's BCD codegen, byte-for-byte.

### `codegen.ts`: `emitBinaryExpr` / `emitComparisonBranch` changes

Before falling through to existing logic, check whether an operand is a `VarRef`
naming the counter of a currently-active shadowed loop (top of the new shadow
stack, or any active entry — a loop body can reference an outer shadowed loop's
counter too). If so, use the shadow slot's int16 value directly (a cheap `ldw`)
instead of decoding from BCD. This only ever fires for operations the eligibility
scan already proved are among integer-eligible operands, so no new overflow-fallback
paths are needed beyond what those operations already require.

### `tools/compiler/listing.ts` changes

Extend the `Integer-Eligible Variables:` section (from the original design) with a
`Shadowed FOR Loops:` section listing which loop variables actually got the
optimization — e.g.:

```
Shadowed FOR Loops:
  K (line 120)
```

Same rationale as the original design's listing addition: makes the optimization's
actual reach visible without reading generated assembly.

## Data Flow

```
BASIC source
    |
    v
Parser → AST
    |
    v
type-inference.ts ──────► Set<integer-eligible variable names>
    |                              |
    v                              v
loop-shadow-eligibility.ts ─► Map<FOR statement, shadow-eligible?>
    |                              |
    v                              v
codegen.ts:
  emitFor    — shadow-eligible? decode counter/limit/step once into RAM shadow slots
  NEXT loop  — shadowed: native adw + native compare, no BCD, every iteration
             — not shadowed: unchanged FP_ADD + BCD compare, every iteration
  loop body  — counter ref in fast-path-eligible op? read shadow directly (ldw)
  loop exit  — shadowed: encode shadow → BCD once, store
             — not shadowed: already up to date (unchanged)
```

## Testing & Verification Strategy

Same discipline as the original design and every prior task on this compiler:
codegen shape alone doesn't prove correctness; real execution does.

1. **Eligibility scan tests**: each of the 4 disqualifying conditions, individually
   and in combination, plus the happy path — assert `loop-shadow-eligibility.ts`
   classifies correctly. Include the adversarial break-idiom case (`GOTO` past
   `NEXT`) and a body write to the counter (`K=K+5` inside the loop) as explicit
   regression cases, since both were the specific gaps found while designing this.
2. **Codegen tests**: a shadowed loop's `NEXT` emits native `adw`/compare, not
   `FP_ADD`/BCD staging; a disqualified loop's codegen is byte-for-byte identical to
   today's (a real regression check, not just "still produces some output").
3. **Real emulator tests** (`EmulatorSession`), required cases:
   - Shadowed loop runs to completion with the correct final counter value, and the
     counter's BCD form is correct immediately after the loop (read via a normal,
     non-fast-path statement placed right after `NEXT`).
   - In-body reference to the counter (`IF K+K>N`) inside a shadowed loop produces
     the correct result every iteration, not just at the boundaries.
   - Each of the 4 disqualifying conditions, run for real: confirm the loop still
     produces the *correct* result via the (unchanged) BCD path — this feature must
     never change a disqualified loop's behavior.
   - Nested loops: an outer shadowed loop containing an inner disqualified loop
     (and vice versa) both produce correct results with no interference.
   - `GOSUB` called from inside a shadowed loop's body, where the callee does BCD
     arithmetic of its own (exercising `$0-$18` scratch) — confirm the shadow slots
     survive untouched (they must, being RAM, not registers, but this is exactly
     the kind of assumption this codebase's discipline says to verify, not assume).
4. **Benchmarking, part of "done":** re-run the same instruction-category profiling
   that found the original 83-85% ROM-time split, over `PRIMES.BAS`'s hot loop, and
   re-measure the interpreted-vs-compiled wall-clock comparison the same way it was
   originally measured.

## Error Handling & Edge Cases

- **Mis-classification is still the dangerous failure mode, not a crash** — same
  framing as the original design. A loop wrongly judged shadow-eligible would
  silently desync BCD and native views of the counter; testing specifically targets
  breaking the eligibility scan (see adversarial cases above), not just the happy
  path.
- **`GOSUB` into a shadowed loop body is safe by construction**: the shadow lives in
  RAM at a fixed label, not in a register range a callee could clobber. No new
  interaction with the existing `$0-$18`/`$19-$27`/`$28-$29` register conventions.
- **Reentrant reuse of the same loop variable** (a shadowed loop whose body, via
  `GOSUB`, re-enters a loop over the same counter name) is a pre-existing hazard
  shared with `_FOR_LIMIT_K`/`_FOR_STEP_K` today — unaffected by, and not newly
  solved by, this design.
- **No new user-visible error paths.** A loop that fails the eligibility scan just
  silently uses today's already-correct BCD codegen — this feature can only make
  eligible loops faster, never change an ineligible loop's behavior.

## Non-Goals

- Per-operation fast-path codegen for `*`/`/`/`MOD`/comparisons outside a shadowed
  loop's own counter/limit/step traffic — real headroom exists per Task 2's table,
  but wiring that in generally is future scope, not part of this document.
- General expression-tree-level amortization beyond a single `FOR` loop's lifetime.
- Everything the original design already excluded: arrays, `INPUT` variables, 32-bit+
  integers.
