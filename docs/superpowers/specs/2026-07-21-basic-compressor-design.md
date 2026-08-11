# BASIC Program Compressor — Strategy & Design Plan

> Status: awaiting agreement (per docs/basic-program-compressor.md, code follows once this plan is agreed)
> Date: 2026-07-21

## Goal

A TypeScript CLI that takes a Casio JIS BASIC source listing and emits a semantically
identical program that occupies the fewest possible bytes in FX-870P/VX-4 program
memory, plus a 132-column printable listing documenting every transformation and the
savings achieved.

## The byte-cost model (measured, not assumed)

All costs verified against the emulator's tokenizer (`src/emulator/tokenize.ts` /
`basic-tokens.ts`, extracted from the ROM dispatch tables), which is the byte-count
oracle the tool will use directly.

| Element | Stored cost | Note |
|---|---|---|
| Line overhead | **4 bytes** | length byte + 16-bit line number + 0x00 terminator |
| Keyword | **2 bytes** | prefix 0x04–0x07 + code byte; ALL keywords, incl. `HYP SIN` |
| `:` separator | 1 byte | token 0x01 |
| `ELSE` | **3 bytes** | hidden 0x01 colon + 2-byte token |
| `'` comment marker | 1 byte | vs `REM` = 2 bytes; text 1 byte/char either way |
| Space | 1 byte | stored literally — every removable space is a real byte |
| Line reference after GOTO/GOSUB/THEN/RESTORE/RESUME/RUN | **3 bytes fixed** | 0x03 + 16-bit binary — **independent of digit count** |
| Identifier / digit / string char | 1 byte/char | numeric literals and DATA are ASCII, never packed |
| Program end marker | 1 byte | |
| Line record cap | **255 bytes** | 8-bit length byte — hard limit on merging |

**Two classic 8-bit crunch tricks are dead on arrival here, and the plan exploits that:**

1. **Renumbering saves nothing** — line references are binary, `GOTO 5` = `GOTO 63999`.
   Therefore the compressor **never renumbers**: original line numbers survive, keeping
   the output diffable against the source and preserving `ERL`-based logic.
2. **`?` is not a PRINT alias** in this dialect (undocumented, and tokenizes as a
   literal `0x3F`). It will never be emitted.

## Transformation passes (in application order)

Each pass is independently switchable; savings are attributed per pass in the listing
summary. Aggressiveness levels: `--level 1` (safe, default), `--level 2` (adds variable
renaming), with per-pass override flags.

### Pass 1 — Analysis (no transformation)
Statement-level scan (string/comment/DATA aware) building:
- the **reference graph**: every line number cited by `GOTO`, `GOSUB`, `THEN n`,
  `ELSE n`, `ON…GOTO/GOSUB` lists, `ON ERROR GOTO`, `RESTORE n`, `RESUME n`, `RUN n`
- the variable census keyed on the `(name, $-suffix, array)` tuple (the dialect keeps
  `A`, `A$`, `A(…)`, `A$(…)` as four distinct variables)
- **warnings**: `IF ERL=nnn` comparisons (line-number-coupled logic — reported, never
  touched), references to nonexistent lines, `ON…GOTO` lists (tokenizer fidelity note)

### Pass 2 — Comment elimination (level 1; `--keep-comments` to disable)
- Delete `'`/`REM` tails from mixed lines (incl. the preceding `:` when present).
- Delete comment-only lines. **If a comment-only line is a jump target** (STREK jumps
  to `230 REM MOVE ENTERPRISE`), retarget every reference to the next surviving line
  instead of deleting blindly — for `RESTORE` retargets, the next line holding `DATA`.
- `--keep-comments` keeps text but still converts `REM` → `'` (1 byte/line saved,
  legal in trailing position where `REM` isn't).

### Pass 3 — Micro-rewrites (level 1)
- `THEN GOTO n` → `THEN n`, `ELSE GOTO n` → `ELSE n` (−2 bytes each; 8 sites in STREK).
  The THEN-less `IF…GOTO n` form is manual-legal but rejected by the repo parser, so it
  is never emitted.
- Strip `LET` (−2 bytes per use).
- Canonicalize relational spellings (`=<`→`<=` etc. — 0 bytes, normalization only).
- `NEXT I` → `NEXT` (−2 bytes/site: identifier + space) — **level 2 only**. Verified
  legal: the manual's format is `NEXT [var][,var]*` and explanation 5 states the
  control variable may be omitted (`reference/Casio-FX850P-Owners-Manual/commands/
  FOR_NEXT_STEP.md:19,49-50`). Not default because a named `NEXT X` pops loop frames
  until `X` while a bare `NEXT` pops only the innermost — in GOTO-heavy flow (manual
  explanation 8 explicitly blesses jumping out of loops and resuming) these can
  diverge, which is why the manual "recommends" naming when nesting. Comma-chaining
  (`NEXT J,I`, explanation 6) is legal but subsumed: bare `NEXT:NEXT` (5 bytes) beats
  `NEXT J,I` (6 bytes).

### Pass 4 — Whitespace stripping (level 1)
Remove every space except:
- inside string literals, kept comments, and `DATA` payloads (preserved verbatim)
- **exactly one space between a word-keyword and a following alphanumeric**
  (`GOTO 10`, `FOR I`) — required by the repo lexer even though real hardware
  tokenizes `GOTO10`. This is the portable default; a later `--target=hardware` could
  strip those too.

### Pass 5 — Line merging (level 1; `--no-merge` to disable)
Greedy forward merge of line *n+1* into line *n* with `:` (net −3 bytes per eliminated
line). A merge is forbidden when:
- line *n+1* is a jump target (must stay addressable)
- line *n* contains `IF` (THEN swallows the rest of the line — appended statements
  would become conditional)
- line *n* ends in a kept comment (dead tail) or `DATA` (payload fragility)
- line *n* ends in an unconditional control transfer (`GOTO`/`RETURN`/`END`/`STOP` —
  successor code would become unreachable-looking; no byte win worth the confusion)
- the merged record would exceed the 255-byte tokenized cap or 255 source chars
`FOR`/`NEXT` merging across lines is safe and allowed.

### Pass 6 — Variable renaming (level 2 only, off by default)
Frequency-ranked renaming of multi-character variables to unused 1-char (then 2-char)
names, per `(name,$,array)` tuple. Never generates a name beginning with a reserved
word (portable across hardware and emulator keyword-matching differences). The
old→new mapping is printed in the listing's cross-reference section. Off by default
because it hurts readability and the flagship programs already use short names.

### Deferred (documented, not in v1)
- Constant hoisting (repeated long literals → variable initialised at start) — changes
  initialization order; needs flow awareness.
- Dead-code elimination, expression rewriting — semantic risk outweighs bytes.
- Trailing end-of-line quote omission (`PRINT "TEST`) — legal and verified in the
  lexer, but ugly; candidate for a later `--level 3`.

## Correctness guarantees

After all passes the tool:
1. Re-tokenizes the output with `src/emulator/tokenize.ts` — every line must tokenize
   cleanly and fit the 255-byte record cap (this also produces the exact final byte
   count for the stats).
2. Verifies the reference graph closes: every cited line number exists in the output.
3. Verifies merge/retarget bijection: every original line maps to a surviving
   (line, statement-offset) location, printed in the listing.
4. Never touches: string literals, DATA payloads, `ERL` comparisons, line numbers.

An optional future `--verify` could run both versions headless via
`tools/emu-debugger` and compare output; out of scope for v1.

## CLI

```
npx tsx tools/cruncher/crunch.ts PROGRAM.BAS [options]
  -o FILE        output .BAS (default: PROGRAM.min.BAS)
  -l FILE        listing file (default: PROGRAM.crunch.lst)
  --level 1|2    aggressiveness (default 1)
  --keep-comments  --no-merge  --no-spaces-strip  --no-rewrites   per-pass overrides
  --width N      listing width (default 132)
```
npm script: `npm run crunch`. Module layout `tools/cruncher/`: `scan.ts` (statement
scanner), `refs.ts` (reference graph), `passes/*.ts` (one file per pass), `listing.ts`
(formatter), `crunch.ts` (CLI). Byte oracle imported from `src/emulator/tokenize.ts`.

## The 132-column listing (VAX/VMS compiler style)

Form-feed paginated, 60 lines/page, each page headed:

```
Casio BASIC Cruncher V1.0          PROGRAM.BAS          21-Jul-2026 14:32    Page  3
Source -> Optimized                                     Level 1  (merge,spaces,comments,rewrites)
```

Body, two synchronized columns (old left, new right), gutter-annotated:

```
  OLD  SOURCE                                                 |  NEW  OPTIMIZED
    1  REM SUPER STAR TREK                                    |   --  [deleted: comment]
   20  REM === INIT ARRAYS ===                                |   --  [deleted: comment]
   25  FOR I=1 TO 9                                           |   25  FORI=1TO9:C(I,1)=0:C(I,2)=0:NEXTI     <- merged 26,27,28
   26  C(I,1)=0                                               |   ..  ^ merged into 25
  102  IF E+S<=10 THEN GOTO 1810                              |  102  IFE+S<=10THEN1810                     <- THEN GOTO->THEN
```

End-of-listing sections:
1. **Retarget map** (references redirected from deleted lines)
2. **Variable map** (level 2 renames, with occurrence counts)
3. **Warnings** (ERL couplings, unverifiable constructs)
4. **Summary statistics**:

```
Pass                    Lines removed   Bytes saved
Comment elimination                68         1,742
Micro-rewrites                      0            18
Whitespace strip                    0           905
Line merging                      114           342
                                 ----        ------
Source:     412 lines,  11,908 tokenized bytes
Optimized:  230 lines,   8,901 tokenized bytes
Reduction:  3,007 bytes  (25.3%)
```

(Byte figures computed by actual tokenization of both versions, so the numbers are
exactly what the calculator's FRE 1 would reflect.)

## Open questions to verify (before or during implementation)

1. ~~`NEXT` without variable / `NEXT I,J` comma form~~ **RESOLVED**: both legal per
   the manual (`commands/FOR_NEXT_STEP.md:19,49-59`); adopted as a level-2 rewrite
   (see Pass 3) due to the named-NEXT multi-pop vs bare-NEXT innermost-pop divergence
   under unstructured GOTO flow.
2. `ON…GOTO` multi-target byte encoding — emulator tokenizer binary-encodes only the
   first target; byte model for later targets is ASCII. No compressor impact, but the
   stats should count it correctly.
3. Real-hardware keyword-abutment (`GOTO10`) — enables a future `--target=hardware`
   mode that strips ~1 space per keyword site.

## Acceptance test

Run against `STREK.BAS` and `SORCERER.BAS` (the size-critical programs): output must
tokenize cleanly, load and run in the emulator, and the listing/statistics must
faithfully account for every byte of difference.
