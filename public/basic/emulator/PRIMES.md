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
