# FX-870P BASIC Compiler

Compiles Casio JIS Standard BASIC programs into HD61700 machine code for the FX-870P/VX-4.

## Quick Start

```bash
npx tsx tools/compiler/compile.ts program.bas
```

This reads `program.bas` and produces four output files in `build/compiler/`:

| File | Description |
|------|-------------|
| `build/compiler/program.bin` | Raw HD61700 binary |
| `build/compiler/program.lst` | 132-column assembly listing with BASIC source annotations |
| `build/compiler/program.sym` | Symbol table (JSON) |
| `build/compiler/program.loader.bas` | Self-loading BASIC program for real hardware |

You can also use the npm script shorthand:

```bash
npm run compile -- program.bas
```

The `build/` directory is gitignored.

## Output Files

### Binary (`.bin`)

Raw machine code bytes, starting at address `&H0000` (Bank1 RAM). Load this directly into the emulator's memory for execution.

### Listing (`.lst`)

132-column fixed-width assembly listing designed for monospaced display or printing. Includes:

- Page headers with source filename, date, and total size
- Hex address, machine code bytes, labels, assembly mnemonics, and comments per line
- BASIC source line annotations (`=== BASIC Line 10: PRINT "Hello" ===`) above each generated block
- Symbol table at the end (alphabetical, 4-column layout)
- Size summary showing code, data, variable, and total byte counts

Example:

```
HD61700 Cross Assembler - FX-870P BASIC Compiler                                   Page 1
Source: hello.bas  Date: 2026-04-05 00:07  Size: 37 bytes

Addr  Hex Code         Label        Assembly                         Comment
----- ---------------- ------------ -------------------------------- ----------------------
                                                                     ; === BASIC Line 10 ===
0000  D1 02 DF 2A                   ldw $2,&H2ADF                    ; CLS
0004  B7 05                         jr ROM_CALL
```

### Symbol Table (`.sym`)

JSON array of all labels with their resolved addresses and types:

```json
[
  { "name": "L10", "address": 0, "type": "code" },
  { "name": "ROM_CALL", "address": 23, "type": "code" },
  { "name": "STR_001", "address": 34, "type": "data" }
]
```

### BASIC Loader (`.loader.bas`)

A self-extracting BASIC program for loading compiled code onto real FX-870P/VX-4 hardware. It:

1. Allocates machine language space with `CLEAR` and `MODE110`
2. Reads hex-encoded DATA statements
3. POKEs the bytes into RAM
4. Executes via `MODE110(entrypoint)`

Type the loader program into the calculator (or send via serial), then `RUN` it.

## Pipeline

```
BASIC source
    |
    v
  Lexer (lexer.ts)         -- tokenizes keywords, operators, literals
    |
    v
  Parser (parser.ts)       -- recursive descent with Pratt precedence climbing
    |
    v
  AST (ast.ts types)       -- 33 statement types, 9 expression types
    |
    v
  Code Generator (codegen.ts)  -- emits HD61700 assembly calling ROM routines
    |
    v
  Assembly text (asm-types.ts) -- annotated AsmLine[] with BASIC source refs
    |
    v
  Assembler (assembler.ts)     -- two-pass: label resolution + binary emission
    |                           -- uses opcodes.ts for instruction encoding
    v
  Binary + Listing + Loader
```

## How It Works

The compiler does **not** reimplement the BASIC runtime. Instead, generated code calls into the FX-870P's ROM for all high-level operations: PRINT, INPUT, floating-point arithmetic, string handling, etc. This follows the same pattern used by CosmicV4 (a machine language game for the VX-4).

The ROM call wrapper at the end of every compiled program:

```asm
ROM_CALL:    LDW  $0,&H5323      ; BIOS2 return context
             PHSW $1              ; push return address
             PST  UA,&H54        ; bank switch to Bank0
             JP   $2              ; jump to ROM routine
```

To call a ROM routine, the compiler loads its address into `$2` and jumps to `ROM_CALL`.

## Memory Layout

Compiled programs reside in Bank1 RAM:

```
0x0000  Compiled code (instructions)
        ROM call wrappers
        String literals (DB directives)
        Variable table (9 bytes per numeric, 256 per string)
        Array storage (allocated by DIM)
0x0FFF  End of default 4KB area
```

The compiler warns if output exceeds 4KB. For larger programs, the `CLEAR` command can allocate additional space on real hardware.

## Tests

```bash
npx vitest run tools/compiler/tests/    # run compiler tests only
npx vitest run                          # run all tests (emulator + compiler)
```

Test fixtures in `tools/compiler/tests/fixtures/` cover arithmetic, strings, control flow, loops, and arrays.

## Known Limitations

- **BCD constants**: Numeric constants use simplified integer loads, not full 9-byte BCD encoding. This means floating-point literals like `3.14` won't load correctly yet.
- **ROM addresses**: Many builtin function addresses (SIN, COS, TAN, etc.) are placeholders (`&H0000`). These need to be mapped from the ROM annotations in `reference/fx870p-rom-annotations.md`.
- **Addressing modes**: Some complex programs may hit remaining edge cases where the code generator emits instruction forms that the assembler can't encode.
- **No optimisation**: The compiler emits straightforward code with no peephole optimisation or register allocation beyond the fixed convention.
