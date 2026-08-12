# BCD Arithmetic for the BASIC Compiler — Design

> Created: 2026-08-12
> Status: Approved (brainstorming phase)
> Related: `docs/plans/compiler/2026-08-12-implement-bcd-arithmetic.md`

## Goal

The compiler's README lists a known limitation: numeric constants use simplified
integer loads, not full 9-byte BCD encoding, so floating-point literals don't load
correctly. This blocks compiling any program that does real arithmetic. Fix this so
`PRIMES.BAS` — a new benchmark program that finds the first 100 primes — can be
compiled to machine code and its performance compared against the interpreted BASIC
run of the same program.

## Current State

The compiler's arithmetic pipeline is already partially wired: `codegen.ts` calls real
ROM routines for `+`/`-`/`*`/`/` (`FP_ADD`/`FP_SUB`/`FP_MUL`/`FP_DIV` at `&H05DA`/
`&H05D4`/`&H0607`/`&H16BD`), with operands shuttled through two 9-byte register ranges.
Two things are actually broken, only one of which the README currently documents:

1. **Constant loading** (the documented limitation): `emitNumberLiteral()` does
   `LDW $10,<value>`, filling only 2 of the 9 bytes those ROM routines expect.
2. **Arithmetic operand register convention** (found during this design's research,
   not previously documented): `emitBinaryExpr()` stages the second operand in
   `$19-$27`, but the ROM disassembly is explicit that `FP_ADD` expects it in `$0-$8`
   (`&H05DA: floating point addition, $10-$18 <- $10-$18 + $0-$8`). This affects `+`,
   `-`, `*`, `/`, and comparisons (which reuse `FP_SUB`). Never caught because nothing
   has been run end-to-end yet.

`MOD` is a recognized operator in the lexer/parser/AST but has no ROM address wired up
at all (`arithmeticRomAddr()` returns `undefined` for it, falling through to a
`TODO: operator mod` stub).

## Scope

In scope:
- Full BCD constant encoding (integers and decimals) — `numberToBcd9()`.
- Fixing the `$0-$8` vs `$19-$27` operand register bug for `+`/`-`/`*`/`/` and
  comparisons.
- Wiring up `MOD` (ROM entry point `&H105F`, found in `rom1a.src`: converts both
  operands to absolute integers, calls the integer-division routine at `&H16BD`,
  returns the remainder).
- `PRIMES.BAS`, a new library program.

Out of scope (unchanged, pre-existing limitations):
- `SQR`, `INT`, integer division (`\`) as a *user-facing* operator beyond what `MOD`
  needs internally, and other builtin functions still listed as ROM address TODOs in
  `codegen.ts`. `PRIMES.BAS` is deliberately written to need none of these.
- Runtime overflow handling beyond matching the calculator's native 14-digit mantissa
  precision (see Error Handling below).

## Components

### `tools/compiler/bcd.ts` (new)

`numberToBcd9(value: number): Uint8Array` — pure function, JS `number` → 9-byte BCD:
7-byte packed mantissa (14 significant digits, most-significant first), 1 exponent
byte (BCD, biased), 1 sign byte. Handles negative numbers, zero, integers, and
decimals. The exact byte layout is derived from the `FP_ADD`/`FP_MUL` ROM disassembly
(`reference/ROM Disassembly/fx870_r0/rom0.src`) and locked in via unit tests before
anything in `codegen.ts` depends on it.

### `tools/compiler/codegen.ts` changes

- `emitNumberLiteral()`: call `numberToBcd9()` at compile time, emit the 9 bytes as a
  `DB` data block (same pattern already used for string literals), load into the
  accumulator via `LDM`/`LD` (matching the existing `emitVarLoad9` pattern).
- DATA-table numeric values: same treatment, replacing the current
  `TODO: BCD encode` stub.
- `emitBinaryExpr()`: fix the second-operand register range from `$19-$27` to `$0-$8`.
- `arithmeticRomAddr()`: add `case 'mod': return ROM.MOD`, with
  `MOD: '&H105F'` added to the `ROM` table.

### `public/basic/emulator/PRIMES.BAS` (new)

Trial division counting up to the 100th prime. Written to need only primitives that
are already fully wired or that this work adds: `+`, `-`, `*`, `MOD`, comparisons,
`FOR`/`WHILE`/`GOTO`. No arrays, no builtin functions. Prints the 100th prime (541),
then `END`. No self-timing — performance is measured externally with a stopwatch for
both the interpreted and compiled runs.

## Data Flow

```
BASIC literal / DATA value (JS number, at compile time)
    |
    v
numberToBcd9()  ──────────────────────────────► 9 bytes (DB data block)
    |                                                  |
    v                                                  v
codegen emits LDM/LD to load into $10-$18   codegen emits binary-expr operand setup
    |                                                  |
    +──────────────────────────────────────────────────+
                          |
                          v
              ROM_CALL wrapper (PST UA,&H54 bank switch)
                          |
                          v
        FP_ADD / FP_SUB / FP_MUL / FP_DIV / MOD  (left=$10-$18, right=$0-$8)
                          |
                          v
                  result in $10-$18
                          |
                          v
        PRINT (existing, proven ROM call) or STM to a variable
```

## Testing & Verification Strategy

This is where the design's real technical risk lives, so it gets a deliberate
strategy rather than "write some tests":

1. **Unit tests** (`tools/compiler/tests/bcd.test.ts`): `numberToBcd9()` against
   hand-derived worked examples (0, 1, -1, small/large integers, decimals).
2. **Round-trip verification through proven ROM entry points, not fragile internal
   helpers.** While researching this design, two ROM subroutines that looked like
   promising shortcuts for constant conversion (`CNVR` at `&H0A97`, and a "load FP
   constant 1" helper at `&H0669`) misbehaved when called in isolation via the
   headless emulator — they're internal implementation details that assume calling
   context/register state set up by the surrounding interpreter code, not stable
   standalone entry points. `numberToBcd9()` avoids all of that risk by not calling
   any ROM routine at compile time — it's pure TypeScript. Correctness is instead
   verified by compiling a tiny program that loads two constants via the new encoder,
   adds them via the (now-fixed) `FP_ADD` call, and `PRINT`s the result — checking the
   LCD shows the right number. `CLS`/`PRINT` are already proven to work end-to-end
   (`hello-at-1cd0.test.ts`), so this validates the new encoding against real ROM
   arithmetic rather than assumptions.
3. **Per-operator tests**, same pattern, for `+`, `-`, `*`, `/`, `MOD`, and
   comparisons.
4. **End-to-end acceptance test**: compile `PRIMES.BAS`, run it headlessly to
   completion, assert the printed result is 541 (the 100th prime).

## Error Handling & Edge Cases

- **Precision limit**: the mantissa holds 14 significant BCD digits, the calculator's
  own native precision. `numberToBcd9()` truncates/rounds a literal that doesn't fit
  the same way the real hardware would — not a new behavior to invent.
  `PRIMES.BAS` never approaches this (max value ~541).
- **Negative numbers**: sign byte set per the derived encoding. `MOD` converts both
  operands to absolute integers internally — this is the ROM's own behavior
  (confirmed at `&H1069` in the disassembly), not a compiler-side special case.
- **Zero**: confirmed empirically (via the isolated `CNVR` test, which — unlike
  arbitrary non-zero inputs — happened to work correctly for exactly zero) that it
  encodes as all-zero bytes.
- **No new runtime error paths**: `numberToBcd9()` either produces valid bytes at
  compile time, or the compiler should reject the literal outright at compile time,
  rather than emitting something that fails silently at runtime.

## Non-Goals

- Decimal support is in scope for the *encoding function*, but `PRIMES.BAS` itself
  only exercises integers — decimal arithmetic gets unit-test coverage, not a
  dedicated benchmark program.
- No attempt to fix or wire up `SQR`/`INT`/`\` as part of this work.
