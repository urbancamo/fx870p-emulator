# How Casio BASIC Tokens Are Stored (FX-870P / VX-4)

How the FX-870P family stores tokenized BASIC programs in RAM. Established from the
emulator's tokenizer (`src/emulator/tokenize.ts` / `src/emulator/basic-tokens.ts`,
whose tables were extracted from the ROM1 dispatch tables) and verified byte-for-byte
against real programs. This storage model is what makes the
[BASIC cruncher](../tools/cruncher/) byte counts exact, and it explains which
source-level "optimizations" actually save memory on this machine — and which don't.

## Program layout

A stored program is a contiguous sequence of line records followed by a single `0x00`
end-of-program marker. There is no per-program header in the stream itself: a
program's extent is defined externally by the **File Address Table** (`P0STT`) at
logical RAM `0x18A7`, which holds eleven 16-bit little-endian pointers bounding the
P0–P9 program areas (program *n* occupies `pointer[n]` to `pointer[n+1]`).

## Line record format

Every line costs a fixed **4 bytes of overhead**:

```
Byte 0     record length N — does NOT count itself (8-bit, so max 255: the line-length limit)
Bytes 1–2  line number, 16-bit little-endian binary (1–65535)
Bytes 3…   tokenized body
last byte  0x00 terminator (counted in N)
```

The on-disk record is `1 + N` bytes; `N = 2 + bodyLength + 1`.

## Keywords: 2-byte tokens

Every keyword is stored as a **prefix byte + code byte** (code range `0x47–0xC7`):

| Prefix | Table | Contents |
|--------|-------|----------|
| `0x04` | PREFIX4 | Statements/commands: GOTO, GOSUB, PRINT, IF, FOR, NEXT, DATA, REM, DIM… |
| `0x05` | PREFIX5 | Numeric functions: SIN, COS, LN, ABS, INT, PI, VAL, RAN#… (compound `HYP SIN`…`HYP ATN` are single 2-byte tokens) |
| `0x06` | PREFIX6 | String functions: MID$, LEFT$, RIGHT$, CHR$, STR$, HEX$, INKEY$, INPUT… |
| `0x07` | PREFIX7 | Operators/clauses: THEN (`0x47`), ELSE (`0x48`), TO, STEP, USING, AND, OR, XOR, NOT, MOD… |

> The printed manual claims keywords are single-byte tokens; the ROM's actual
> encoding is two bytes per keyword. Budget 2 bytes when estimating sizes.

## Structural low bytes

Byte values below `0x20` are structural, not characters:

| Byte | Meaning | Cost notes |
|------|---------|------------|
| `0x00` | line terminator / end-of-program | |
| `0x01` | `:` statement separator | 1 byte |
| `0x02` | `'` comment marker | 1 byte — cheaper than REM's 2-byte token, and legal trailing any statement |
| `0x03` | line-reference marker (see below) | |

`ELSE` is always stored with a **hidden `0x01` colon before its token**, so it
effectively costs 3 bytes; the listing display suppresses that colon.

## Line references are binary — renumbering saves nothing

After `GOTO`, `GOSUB`, `THEN`, `RESTORE`, `RESUME`, or `RUN`, a numeric target is
stored as `0x03` + 16-bit little-endian line number: a **fixed 3 bytes regardless of
digit count**. `GOTO 5` and `GOTO 63999` cost the same.

```
GOTO 100    →  04 49 20 03 64 00        (GOTO token, space, ref marker, 100, terminator)
GOSUB 1000  →  04 4A 20 03 E8 03
```

This is the key difference from most 8-bit BASICs, where targets are stored as ASCII
digits and renumbering to low line numbers is a classic memory-saving trick. On this
hardware **renumbering has zero effect on program size**.

## Everything else is literal Casio-ASCII, 1 byte per character

- **Identifiers** (variable names): stored character by character.
- **Numeric literals**: ASCII digits, never packed — `12345` costs 5 bytes; a
  constant repeated ten times costs its full digit length ten times.
- **String literals**: raw bytes including *both* quote characters.
- **DATA payloads**: raw ASCII — numbers as digits, commas as `0x2C`, no packing.
- **Comment text** after `REM`/`'`: raw ASCII.
- **Spaces**: every space is a stored `0x20`. Spaces are *not* canonicalized away
  by the tokenizer — which is why space-stripping is a genuine byte saving here.

`?` is **not** a PRINT abbreviation in this dialect: it stores as the literal byte
`0x3F` and does not execute as PRINT.

## Worked example

`10 PRINT "HELLO"` stores as:

```
0A            record length (10)
0A 00         line number 10
04 A3         PRINT token
20            space
22            "
48 45 4C 4C 4F  HELLO
22            "
00            terminator
```

11 bytes total on disk (length byte + 10).

## Byte-cost cheat sheet

| Element | Stored cost |
|---|---|
| Line overhead | 4 bytes (+1 end-of-program marker per program) |
| Keyword | 2 bytes |
| `:` separator | 1 byte |
| `ELSE` | 3 bytes (hidden colon + token) |
| `'` comment marker | 1 byte (`REM` = 2) + 1 byte/char of text |
| Line reference (GOTO/GOSUB/THEN/RESTORE/RESUME/RUN + number) | 3 bytes, digit-count independent |
| Space / identifier char / digit / string char / DATA char | 1 byte |
| Maximum line record | 255 bytes |

These costs are exactly what the cruncher's statistics report, because it measures
sizes by running candidate text through the emulator's own tokenizer rather than
estimating. The strategy consequences (why line merging and space stripping dominate,
and why renumbering is skipped entirely) are worked through in the
[cruncher design spec](superpowers/specs/2026-07-21-basic-compressor-design.md).
