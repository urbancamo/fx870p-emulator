# Extended CLEAR

Reserves a block of machine-code area above BASIC's normal workspace, so it's excluded from BASIC's own memory management. **Required before using `MLLOADER.BAS`** — without it, the receive loop's own `INPUT$()` calls silently corrupt the loaded code (see below).

Ported verbatim from CosmicV4's `clr.b` (BLUE, 2003) — proven on real VX-4/FX-870P hardware.

## Usage

1. Open the library (**LIB**), load `EXTCLR.BAS` into a program slot
2. Type `RUN` and press `[EXE]`
3. It installs a small relocator via `DEFCHR$` (not COM0 — safe to run before any serial setup) and prints `MODE110(&H18F5)`
4. Type `MODE110(&H18F5),1520[EXE]` — the `,1520` reserves 1520 bytes for machine code
5. `IOBF` (the top of BASIC's work area, `PEEK(&H1895)+PEEK(&H1896)*256`) now sits below `&H1CD0`, protecting the standard ML area

Do this once per session (it doesn't survive a reset or `NEW`/power-off). Then load and run `MLLOADER.BAS` as usual.

## Why this is needed

The FX-870P/VX-4 ROM hard-codes the string-operation stack pointer (`US`) to `&H1CD0` — see `rom1a.src` `&H1F64`/`&H66BA`. Any BASIC string operation, including a transient one like `ASC(INPUT$(1,#1))` whose result is never stored, still causes the ROM to write through `US` at that fixed address. During `MLLOADER.BAS`'s receive loop this repeatedly stomps the very bytes it just POKEd — the corruption is small (often just 1-2 bytes) but is silent and lands in the loaded program's code.

Extended CLEAR moves the *usable* top of BASIC's workspace (tracked via `IOBF`) down below `&H1CD0`. This is a different, undocumented ROM mechanism from plain `CLEAR n,m` (which only resizes variable/work areas *within* the existing bounds) — it requires this specific machine-code stub, which is why it can't be done from BASIC alone.

## How much to reserve

`1520` matches CosmicV4's own game size. The compiler (`tools/compiler/`) budgets up to `4096` bytes for compiled programs (see `WARN_THRESHOLD` in `compile.ts`) — reserve at least that much if you plan to run larger compiled programs: `MODE110(&H18F5),4096[EXE]`.

## See also

- `reference/CosmicV4/Readme.txt` — original real-hardware writeup
- `MLLOADER.md` — the loader this unblocks, including its own safety check against under-allocation
