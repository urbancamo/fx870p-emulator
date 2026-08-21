# Primes Benchmark

Finds the 100th prime number (541) via trial division, then stops. Written to
benchmark interpreted vs. compiled BASIC performance — see `tools/compiler/README.md`
for how to compile it.

## Algorithm

For each candidate N starting at 2, tries every K from 2 up to N/2 (via the
`K+K>N` check — no factor greater than N/2 is possible) looking for a divisor.
If none divides N evenly, N is prime and the count increments. Stops after
finding the 100th prime.

Deliberately uses only `+`, `-`, `*`, `MOD`, comparisons, and `FOR`/`WHILE`/`GOTO`
— no arrays, no builtin functions (`SQR`/`INT`/etc. aren't wired into the
compiler).

## Running It

**Interpreted (for the performance baseline):**
1. Load into the emulator via **LOAD** or **LIB**
2. Type `RUN` and press **EXE**
3. Time how long it takes to print `541`

**Compiled (for comparison):**
See `tools/compiler/README.md` — compile with
`npx tsx tools/compiler/compile.ts public/basic/emulator/PRIMES.BAS`, then load
and send the resulting `.hex` via `MLLOADER.BAS` (after running `EXTCLR.BAS`
first — see `EXTCLR.md`).

## Expected Output

```
541
```

## Loop-Shadowing Benchmark (2026-08-21)

End-to-end verification of the loop-scoped integer arithmetic shadowing
feature (`docs/superpowers/plans/2026-08-17-compiler-integer-fastpath-loop-shadowing.md`,
design: `docs/superpowers/specs/2026-08-17-compiler-integer-fastpath-loop-shadowing-design.md`)
against this benchmark — the program the whole feature was designed and
measured against. `PRIMES.BAS`'s `FOR K=2 TO N-1` loop (line 110) is
confirmed shadowed as of this measurement (compiler `.lst` output shows
`Shadowed FOR Loops: K (line 110)`).

This design superseded an earlier, rejected per-operation approach
(`docs/superpowers/specs/2026-08-15-compiler-integer-fastpath-design.md`'s
original Tasks 3-8): that design would have converted BCD↔int16 once per
individual `+`/`-` operation rather than once per loop lifetime, and a
measured cycle-cost table found this made `+`/`-` themselves **slower**
than the ROM path (`+`: 1087 ROM cycles vs. ~2700-3500 decode+op+encode
cycles; `-` similarly) even though the decode/encode cost would have won
back for `*`, `/`, and `MOD`. The loop-shadowing redesign amortizes the
decode/encode cost across a whole loop's lifetime instead of paying it per
operation, which is why it's scoped to `FOR` loops specifically.

### ROM-vs-compiled instruction ratio

Re-ran the original investigation's methodology (trace a representative
slice of the hot loop via `EmulatorSession`'s `run({trace:true})`, bucket
instructions by whether PC falls inside the compiled program's own loaded
address range or outside it, in ROM) against two binaries built from the
same `PRIMES.BAS`: the pre-loop-shadowing compiler (git `5448c27`, whose
`.lst` output confirms `K`'s loop was still statically disqualified from
shadowing at that point) and the current, loop-shadowing compiler. Both
traces cover a ~100,000-instruction post-prologue slice (many full
iterations across several candidate `N` values):

| | ROM | Compiled |
|---|---|---|
| Before (unshadowed) | 83.6% | 16.4% |
| After (shadowed) | 61.3% | 38.7% |

The "before" figure (83.6%) independently reproduces the original
investigation's documented 83-85% finding almost exactly, confirming the
methodology lines up. The "after" figure shows a real 22-percentage-point
drop in ROM's share of executed instructions — the shadowing mechanism is
genuinely diverting work away from the ROM's BCD library, as designed.

**Attribution — NEXT's bookkeeping vs. in-body expression savings.** Static
analysis of the generated assembly (both `.lst` listings) counts, per
continuing loop iteration, how many `cal ROM_CALL_FP` invocations each
statement makes:

| Statement | Before | After |
|---|---|---|
| `IF K+K>N` (line 120) | 2 (add, compare) | 1 (compare only — the `K+K` add is now a native `adw`) |
| `IF N MOD K=0` (line 130) | 2 (mod, compare) | 2 (unchanged) |
| `NEXT K` (line 140) | 2 (increment, limit compare) | 0 (native `adw`/`sbcw`) |
| **Total** | **6** | **3** |

Of the 3 ROM calls eliminated per iteration, **2 (67%) come from `NEXT`'s
own per-iteration bookkeeping** — the increment and limit test the design's
Goal section identified as the actual target — and **1 (33%) comes from the
in-body `K+K` expression** now reading the shadow directly instead of
decoding `VAR_K` from BCD. `N MOD K=0` is completely unaffected: `MOD` is
not in the native fast-path's operator set (`+`/`-` only — the same set
Task 2's cycle-cost table found actually wins as a native op), so it still
costs the same 2 ROM calls before and after.

One caveat visible directly in the listing: `NEXT`'s native tail still
calls the (non-ROM, compiled-side) `INT16_TO_BCD` subroutine on every
continuing iteration, not just once per loop. This is because line 130
reads `K`'s plain BCD form directly (`MOD` isn't shadow-accelerated), so
the compiler's own `bcdCounterRead` analysis correctly keeps `VAR_K`'s BCD
form refreshed every iteration even though `NEXT` no longer needs it for
its own arithmetic. That refresh is real work — just work that lands in the
"compiled" bucket instead of the "ROM" one.

### Wall-clock / cycle-count proxy

Per the brief for this task: this is a manual, human-timed step (see
"Running It" above) and no human was available to run it in this session.
As a proxy, `EmulatorSession`'s own cycle/instruction counters were used to
measure both binaries end-to-end, running to the exact cycle at which the
LCD first shows `541`:

| | Cycles | Instructions | Cycles/instruction |
|---|---|---|---|
| Before (unshadowed) | 216,001,454 | 12,801,312 | 16.87 |
| After (shadowed) | 218,001,331 | 13,500,170 | 16.15 |
| Change | **+0.9%** | **+5.5%** | −4.3% |

(Sanity check: `primes.test.ts`'s own Step 1 output, `instr=20631550` for a
run that continues 82M cycles past the 218,001,331-cycle point above and
into the post-`END` `KYIN` key-wait idle spin, is consistent with this —
the extra ~7.1M instructions over that idle stretch average ~11.5
cycles/instruction, a plausible cost for a tight wait loop, and land on top
of the 13,500,170 figure rather than contradicting it.)

**This is not a wall-clock win for this benchmark** — cycles are flat to
very slightly worse, and now that instruction counts are measured
correctly, the shadowed binary actually executes *more* total instructions
(+5.5%), not fewer. That's coherent, not contradictory: shadowing trades a
smaller number of expensive ROM digit-serial call chains for a larger
number of cheap native instructions (`SHADOW_K_ACT` loads, `adw`/`sbcw`,
the `INT16_TO_BCD` re-encode's own instruction sequence) — more
instructions individually, each one cheaper on average (16.15 vs. 16.87
cycles/instruction), landing at roughly the same total. The reason there's
no net win is visible in the attribution table above: `N MOD K=0`'s `MOD`
call is by far the most expensive ROM operation in the loop (~10,217
cycles per call, per Task 2's own measured table, vs. ~1087 for `+` and
~1478 for a comparison) and this feature never touches it, so it dominates
every iteration's cost in both binaries equally. The ~3,650 ROM
cycles/iteration saved from `NEXT` and `K+K` are real, but small next to
`MOD`'s cost, and get further offset by the shadow mechanism's own real
overhead: three `BCD_TO_INT16` decodes per loop entry (once per candidate
`N`, not per iteration) plus the per-iteration `INT16_TO_BCD` re-encode
described above.

An interpreted baseline was also attempted headlessly (typing `PRIMES.BAS`
into the BASIC editor via the test harness's synthetic keyboard, then
`RUN`), but the harness's key-code table doesn't correctly enter all of the
source's characters, corrupting the typed program and producing a genuine
`SN error` rather than a working run — a real, pre-existing harness
limitation unrelated to this feature. **The documented human-timed
interpreted-vs-compiled comparison above is still needed** to get an actual
interpreted baseline; nothing in this session established one.

### Bottom line

Both mechanisms this feature built — native `NEXT` bookkeeping and
in-body shadow reads — are confirmed working exactly as designed, and
together they cut the hot loop's ROM instruction share by 22 points (83.6%
→ 61.3%). But for `PRIMES.BAS` specifically, the loop's dominant cost was
always `MOD`, which this design deliberately left on the BCD path (Task 2's
own findings showed real headroom there, but implementing it was out of
this plan's scope), so the net effect on this particular benchmark's
wall-clock/cycle proxy is negligible. A program whose hot loop leaned more
on `+`/`-`/comparisons of the counter and less on an untouched expensive
operator would be expected to show a real wall-clock improvement from this
feature; `PRIMES.BAS` doesn't happen to be that program.
