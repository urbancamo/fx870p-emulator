# BASIC Detokenizer Reference

Technical reference for the FX-870P BASIC detokenizer module (`src/emulator/detokenize.ts`).

## Memory Layout

### File Address Table

Location: RAM offset `0x18A7` (physical address `0x118A7`)

The table contains 11 consecutive 16-bit little-endian pointers — one boundary per program slot. Program P(n) occupies RAM from `pointer[n]` to `pointer[n+1]`. Add `0x10000` to convert from logical RAM offset to physical address.

```
Offset  Contents
0x18A7  P0 start pointer (16-bit LE)
0x18A9  P0 end / P1 start pointer
0x18AB  P1 end / P2 start pointer
  ...
0x18BB  P9 end pointer
```

The ROM's `GetFileAddresses` routine at `0x33EE` uses the `biu` instruction (bit shift up = multiply by 2) to index into this table, confirming 2-byte entries. It then loads 4 consecutive bytes (`ldm $25,(iz+$sx),4`) to get both the start and end pointers for a file in one operation.

**Source:** `reference/ROM Disassembly/fx870_r1/rom1a.src` lines 4240–4280.

### BASIC Line Format

Each line in a program is a length-prefixed record:

```
Byte 0     : record length N (does NOT count itself)
Byte 1–2   : line number (16-bit little-endian)
Byte 3..N  : tokenized body
Byte N     : 0x00 terminator (included in N)
```

The total size of a line record on disk is `1 + N` bytes (length byte + N data bytes).

**End of program** is signaled by a record length byte of `0x00` (or `0xFF` for uninitialized RAM).

**Source:** ROM0 line walker at `0x0B8C` (`reference/ROM Disassembly/fx870_r0/rom0.src` lines 2745–2756).

### Verified Example

Line `1 REM BINARY SEARCH` encodes as:

```
14 01 00 20 04 a9 20 42 49 4e 41 52 59 20 53 45 41 52 43 48 00
│  │     │  │     │
│  │     │  └─────┴── " BINARY SEARCH" (ASCII) + 0x00 terminator
│  │     └── space (literal 0x20)
│  └── line number 1 (0x01 0x00 LE)
└── record length 20 (0x14) — counts everything after this byte
```

Keyword `REM` = prefix `0x04` + code `0xA9`.

## Token Encoding

### Body Byte Values

| Byte      | Meaning                                                            |
|-----------|--------------------------------------------------------------------|
| `0x00`    | End of line (implicit from record length)                          |
| `0x01`    | Colon `:` (statement separator)                                    |
| `0x02`    | Apostrophe `'` (REM shorthand)                                     |
| `0x03`    | Binary line-number reference — next 2 bytes = 16-bit LE line number |
| `0x04`–`0x07` | Keyword prefix — next byte is keyword code (0x47–0xC7)       |
| `0x20`–`0x7F` | Literal ASCII character                                       |
| Other     | Rendered as `[XX]` hex escape                                      |

### Hidden Colon Before ELSE

When `0x01` (colon) is immediately followed by `0x07 0x48` (ELSE keyword), the colon is suppressed in the listing. The calculator stores `IF ... THEN ...:ELSE ...` but displays `IF ... THEN ... ELSE ...`.

### Keyword Prefix Tables

Four prefix bytes (`0x04`–`0x07`) select four different keyword tables. The byte following the prefix is a code in the range `0x47`–`0xC7`, used as an index into the table (subtract `0x47` to get the array index).

**Source:** ROM1 dispatch tables at `0x0FA9`, `0x10AB`, `0x11AD`, `0x12AF` — see `reference/ROM Disassembly/fx870_r1/rom1c.src` lines 371–509.

#### Prefix 0x04 — Statements and Commands

| Code | Keyword  | Code | Keyword  | Code | Keyword  | Code | Keyword  |
|------|----------|------|----------|------|----------|------|----------|
| 0x49 | GOTO     | 0x4A | GOSUB    | 0x4B | RETURN   | 0x4C | RESUME   |
| 0x4D | RESTORE  | 0x4E | WRITE#   | 0x50 | CONT     | 0x52 | SYSTEM   |
| 0x53 | PASS     | 0x55 | DELETE   | 0x57 | LIST     | 0x58 | LLIST    |
| 0x59 | LOAD     | 0x5A | MERGE    | 0x5C | RENUM    | 0x5D | TRON     |
| 0x5F | TROFF    | 0x60 | VERIFY   | 0x63 | POKE     | 0x69 | CHAIN    |
| 0x6A | CLEAR    | 0x6B | NEW      | 0x6C | SAVE     | 0x6D | RUN      |
| 0x6E | ANGLE    | 0x6F | EDIT     | 0x70 | BEEP     | 0x71 | CLS      |
| 0x72 | CLOSE    | 0x76 | DEF      | 0x78 | DEFSEG   | 0x7C | DIM      |
| 0x80 | DATA     | 0x81 | FOR      | 0x82 | NEXT     | 0x85 | ERASE    |
| 0x86 | ERROR    | 0x87 | END      | 0x8B | FORMAT   | 0x8D | IF       |
| 0x8E | KILL     | 0x8F | LET      | 0x90 | LINE     | 0x91 | LOCATE   |
| 0x96 | NAME     | 0x97 | OPEN     | 0x99 | OUT      | 0x9A | ON       |
| 0x9F | CALCJMP  | 0xA3 | PRINT    | 0xA4 | LPRINT   | 0xA5 | PUT      |
| 0xA8 | READ     | 0xA9 | REM      | 0xAC | SET      | 0xAD | STAT     |
| 0xAE | STOP     | 0xB0 | MODE     | 0xB2 | VAR      | 0xB5 | FILES    |

#### Prefix 0x05 — Functions and Constants

| Code | Keyword  | Code | Keyword  | Code | Keyword  | Code | Keyword  |
|------|----------|------|----------|------|----------|------|----------|
| 0x4F | ERL      | 0x50 | ERR      | 0x51 | CNT      | 0x52 | SUMX     |
| 0x53 | SUMY     | 0x54 | SUMX2    | 0x55 | SUMY2    | 0x56 | SUMXY    |
| 0x57 | MEANX    | 0x58 | MEANY    | 0x59 | SDX      | 0x5A | SDY      |
| 0x5B | SDXN     | 0x5C | SDYN     | 0x5D | LRA      | 0x5E | LRB      |
| 0x5F | COR      | 0x60 | PI       | 0x61 | DSKF     | 0x63 | CUR      |
| 0x67 | FACT     | 0x69 | EOX      | 0x6A | EOY      | 0x6B | SIN      |
| 0x6C | COS      | 0x6D | TAN      | 0x6E | ASN      | 0x6F | ACS      |
| 0x70 | ATN      | 0x77 | LN       | 0x78 | LOG      | 0x79 | EXP      |
| 0x7A | SQR      | 0x7B | ABS      | 0x7C | SGN      | 0x7D | INT      |
| 0x7E | FIX      | 0x7F | FRAC     | 0x81 | DEGR     | 0x82 | DMS      |
| 0x86 | PEEK     | 0x8A | EOF      | 0x8D | FRE      | 0x90 | ROUND    |
| 0x92 | VALF     | 0x93 | RAN#     | 0x94 | ASC      | 0x95 | LEN      |
| 0x96 | VAL      | 0x9B | HYP      | 0x9C | DEG      | 0xA7 | REC      |
| 0xA8 | POL      | 0xAA | NPR      | 0xAB | NCR      | 0xAC | HYP      |

#### Prefix 0x06 — String Functions

| Code | Keyword  | Code | Keyword  | Code | Keyword  | Code | Keyword  |
|------|----------|------|----------|------|----------|------|----------|
| 0x97 | DMS$     | 0x9B | INPUT    | 0x9C | MID$     | 0x9D | RIGHT$   |
| 0x9E | LEFT$    | 0xA0 | CHR$     | 0xA1 | STR$     | 0xA3 | HEX$     |
| 0xA8 | INKEY$   | 0xAD | CALC$    |      |          |      |          |

#### Prefix 0x07 — Operators and Modifiers

| Code | Keyword  | Code | Keyword  | Code | Keyword  | Code | Keyword  |
|------|----------|------|----------|------|----------|------|----------|
| 0x47 | THEN     | 0x48 | ELSE     | 0xB6 | TAB      | 0xBB | ALL      |
| 0xBC | AS       | 0xBD | APPEND   | 0xC0 | STEP     | 0xC1 | TO       |
| 0xC2 | USING    | 0xC3 | NOT      | 0xC4 | AND      | 0xC5 | OR       |
| 0xC6 | XOR      | 0xC7 | MOD      |      |          |      |          |

### Hyperbolic Functions

Prefix `0x05`, codes `0x71`–`0x76` represent hyperbolic functions. These are rendered as `HYP` followed by the corresponding trigonometric keyword:

| Code | Output   |
|------|----------|
| 0x71 | HYP SIN  |
| 0x72 | HYP COS  |
| 0x73 | HYP TAN  |
| 0x74 | HYP ASN  |
| 0x75 | HYP ACS  |
| 0x76 | HYP ATN  |

**Source:** ENLST routine at ROM1 `0x5108`–`0x5121`.

## Adding New Keywords

If a new keyword is discovered (rendered as `???` in the listing):

1. Enable the HEX dump in the BASIC panel to see the raw token bytes
2. Identify the prefix byte (`0x04`–`0x07`) and keyword code (`0x47`–`0xC7`)
3. Look up the code in the ROM dispatch table to find the keyword string
4. Add the keyword to the appropriate `PREFIX4`/`PREFIX5`/`PREFIX6`/`PREFIX7` array in `detokenize.ts` at index `(code - 0x47)`

## ROM Source References

| Location | Purpose |
|----------|---------|
| ROM0 `0x0B8C` | Line walker — walks BASIC lines comparing line numbers |
| ROM1 `0x33EE` | `GetFileAddresses` — reads file table using `biu` to index |
| ROM1 `0x508B` | `ENLST` — converts tokenized line to ASCII string |
| ROM1 `0x5173` | `LNSCH` — searches for BASIC line by number |
| ROM1 `0x0FA9` | Prefix 4 dispatch table |
| ROM1 `0x10AB` | Prefix 5 dispatch table |
| ROM1 `0x11AD` | Prefix 6 dispatch table |
| ROM1 `0x12AF` | Prefix 7 dispatch table |
| ROM1 `0x0BA8` | Keyword string table |
