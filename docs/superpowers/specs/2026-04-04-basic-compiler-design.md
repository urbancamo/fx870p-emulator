# FX-870P BASIC Compiler — Design Specification

> Created: 2026-04-04
> Status: Approved
> Approach: TypeScript compiler with assembly IR and integrated assembler

## Overview

A compiler that translates Casio JIS Standard BASIC programs into HD61700 machine code for the FX-870P/VX-4. Compiled programs call into the existing ROM for runtime operations (PRINT, INPUT, FP math, string handling) rather than reimplementing them, yielding an order-of-magnitude speed improvement over the interpreter.

## Architecture

```
BASIC source → Lexer → Parser → AST → Code Generator → Assembly text → Assembler → Binary + Listing
```

Five modules under `tools/compiler/`:

| Module | Input | Output | Responsibility |
|--------|-------|--------|----------------|
| `lexer.ts` | BASIC source text | Token stream | Tokenize Casio JIS BASIC |
| `parser.ts` | Token stream | AST | Build typed AST with Casio-specific syntax |
| `codegen.ts` | AST | Assembly text (annotated) | Emit HD61700 assembly; ROM call orchestration |
| `assembler.ts` | Assembly text | Binary + listing + symbol table | Two-pass assembly; instruction encoding |
| `loader.ts` | Binary + config | BASIC loader program | MODE110-based loader for real hardware |

Entry point: `tools/compiler/compile.ts` — CLI tool that runs the full pipeline.

Modules are pure functions (text in → data out) so they can later be wired into the emulator UI.

## BASIC Parser & AST

### Lexer

Tokenizes Casio JIS BASIC with these specific requirements:

- Line numbers are mandatory
- Multiple statements per line separated by `:`
- Case-sensitive variable names (up to 255 chars, including Katakana)
- Two-word functions: `HYP SIN`, `HYP COS`, `HYP TAN`, `HYP ASN`, `HYP ACS`, `HYP ATN`
- `&H` hex literal prefix
- `¥` (0xA5) as integer division operator
- `RAN#` and `PI` as zero-argument tokens
- `'` as comment shorthand for `REM`

### AST Node Types

#### Statements (~126 commands)

```typescript
type Statement =
  // Assignment
  | { type: 'let'; variable: VarRef; expr: Expression }

  // I/O
  | { type: 'print'; device: 'lcd' | 'printer'; items: PrintItem[];
      using?: Expression }
  | { type: 'input'; prompt?: string; promptSep?: ';' | ',';
      variables: VarRef[] }
  | { type: 'cls' }
  | { type: 'locate'; col: Expression; row?: Expression }
  | { type: 'beep' }
  | { type: 'angle'; mode: Expression }

  // Flow control
  | { type: 'goto'; target: number; area?: number }
  | { type: 'gosub'; target: number; area?: number }
  | { type: 'return'; area?: number }
  | { type: 'on-branch'; expr: Expression;
      kind: 'goto' | 'gosub';
      targets: { line: number; area?: number }[] }
  | { type: 'if'; condition: Expression;
      thenBranch: Statement[]; elseBranch?: Statement[] }
  | { type: 'for'; variable: VarRef; from: Expression;
      to: Expression; step?: Expression }
  | { type: 'next'; variables: VarRef[] }
  | { type: 'while'; condition: Expression }
  | { type: 'wend' }
  | { type: 'end' | 'stop' | 'cont' }

  // Error handling
  | { type: 'on-error-goto'; target: number }
  | { type: 'resume'; target?: number | 'next' }

  // Data
  | { type: 'read'; variables: VarRef[] }
  | { type: 'data'; values: Literal[] }
  | { type: 'restore'; target?: number }

  // Variables & memory
  | { type: 'dim'; decls: { name: string; isString: boolean;
      dimensions: Expression[] }[] }
  | { type: 'erase'; names: string[] }
  | { type: 'clear'; stringArea?: Expression }
  | { type: 'defm'; size: Expression }
  | { type: 'defseg'; segment: Expression }
  | { type: 'poke'; address: Expression; value: Expression }
  | { type: 'def-fn'; name: string; params: string[];
      body: Expression }

  // File I/O
  | { type: 'open'; filename: Expression; mode: Expression;
      filenum: Expression }
  | { type: 'close'; filenum?: Expression }
  | { type: 'print-file'; filenum: Expression; items: PrintItem[] }
  | { type: 'input-file'; filenum: Expression; variables: VarRef[] }
  | { type: 'line-input-file'; filenum: Expression; variable: VarRef }
  | { type: 'write-file'; filenum: Expression; items: Expression[] }

  // Statistical
  | { type: 'stat'; data: Expression[] }
  | { type: 'stat-clear' }

  // Misc
  | { type: 'rem'; text: string }
  | { type: 'defchr'; code: Expression; pattern: Expression }
  | { type: 'chain'; filename: Expression }
  | { type: 'mode'; number: Expression; args?: Expression[] }
```

#### Expressions

```typescript
type Expression =
  | { type: 'number'; value: number }
  | { type: 'string'; value: string }
  | { type: 'hex-literal'; value: number }
  | { type: 'variable'; ref: VarRef }
  | { type: 'binary'; op: BinaryOp; left: Expression; right: Expression }
  | { type: 'unary'; op: 'not' | '-'; operand: Expression }
  | { type: 'builtin-call'; name: string; args: Expression[] }
  | { type: 'fn-call'; name: string; args: Expression[] }
  | { type: 'array-access'; name: string; isString: boolean;
      indices: Expression[] }

type BinaryOp = '+' | '-' | '*' | '/' | '¥' | 'mod'
  | '^' | '=' | '<>' | '<' | '>' | '<=' | '>='
  | 'and' | 'or' | 'xor'

type VarRef = { name: string; isString: boolean; indices?: Expression[] }

type PrintItem =
  | { type: 'expr'; value: Expression }
  | { type: 'separator'; kind: ';' | ',' }
  | { type: 'tab'; col: Expression }

type Literal = { type: 'number'; value: number }
  | { type: 'string'; value: string }
```

### Parser Strategy

Recursive descent with Pratt/precedence climbing for expressions.

Operator precedence (highest to lowest):
1. Parentheses `()`
2. Built-in functions
3. `^` (exponentiation)
4. `-` (unary negation)
5. `*`, `/`, `¥`
6. `MOD`
7. `+`, `-` (binary)
8. `=`, `<>`, `<`, `>`, `<=`, `>=`
9. `NOT`
10. `AND`
11. `OR`, `XOR`

The parser builds a `Map<number, Statement[]>` (line number → statements). GOTO/GOSUB targets are validated against this map.

## Code Generator — ROM Call Strategy

The compiler generates HD61700 assembly that calls into the FX-870P ROM for all high-level operations. The compiler orchestrates these calls rather than reimplementing the BASIC runtime.

### ROM Call Wrapper

From the CosmicV4 pattern — all ROM calls go through a shared wrapper:

```asm
ROM_CALL:
    LDW  $0, &H5323      ; BIOS2 return context
    PHSW $1               ; push return stack
    PST  UA, &H54         ; bank switch to Bank0
    JP   $2               ; jump to ROM routine
```

### Key ROM Entry Points

| ROM Address | Function | Purpose |
|-------------|----------|---------|
| 0x2ADF | CLS | Clear screen |
| 0x3EF1 | PRINT | Print handler |
| 0x3DEE | INPUT | Keyboard input handler |
| 0x112F | EXPRW | Evaluate numeric expression |
| 0x11D2 | — | Evaluate string expression |
| 0x1088 | SIKI | Core expression evaluator |
| 0x2F5D | — | Parse variable name/type |
| 0x05DA | — | FP addition |
| 0x0607 | — | FP multiplication |
| 0x05D4 | — | FP subtraction |
| 0x16BD | — | Integer division |
| 0x03A4 | KYIN | Key input |
| 0x191D | INKEY | INKEY$ function |
| 0x33B3 | BEEP | Sound generation |
| 0x2AF1 | — | Output character ($16) |
| 0x2AE8 | OUTCR | Output CR-LF |
| 0x0E95 | — | String function dispatch |

### Code Generation Per BASIC Construct

| BASIC | Assembly Strategy |
|-------|-------------------|
| `LET A = expr` | Evaluate expr → FP accumulator ($10-$18), store to variable's RAM address |
| `PRINT expr` | Evaluate expr, call ROM 0x3EF1 |
| `INPUT A` | Call ROM 0x3DEE, store result to variable |
| `A + B` | Load A → FP acc, push, load B, call ROM 0x05DA |
| `SIN(x)` | Evaluate x → FP acc, call ROM SIN entry |
| `IF cond THEN` | Evaluate cond, test Z flag, conditional JR over THEN block |
| `GOTO 100` | `JP L100` |
| `GOSUB 100` | `CAL L100` / `RTN` |
| `FOR I=1 TO 10` | Init counter in RAM, loop top label, compare + JR to after NEXT |
| `A$ = "hello"` | Store literal in data section, set $15/$16 addr + $17 length |
| `PEEK(addr)` | Direct memory read instruction |
| `POKE addr, val` | Direct memory write instruction |

### Register Allocation

| Registers | Purpose |
|-----------|---------|
| $0-$9 | Scratch / function arguments |
| $10-$18 | FP accumulator (ROM convention) |
| $19-$24 | Compiler temporaries (expression eval stack) |
| $25-$31 | Reserved (SX=$31, SY=$30, SZ default) |

### Memory Layout of Compiled Program

```
Bank1 RAM:
0x0000 ┌──────────────────────┐
       │ Compiled code        │
       ├──────────────────────┤
       │ ROM call wrappers    │
       ├──────────────────────┤
       │ String literals      │
       ├──────────────────────┤
       │ Variable table       │  (9 bytes per numeric, len+data per string)
       ├──────────────────────┤
       │ Array storage        │  (allocated by DIM)
       ├──────────────────────┤
       │ Stack space          │  (FOR/GOSUB nesting)
0x0FFF └──────────────────────┘
0x1000 │ System area          │  (do not touch)
```

4KB default. For large programs, `CLEAR` can allocate additional space (CosmicV4 uses 1520 bytes at 0x1CD0+). The emulator can relax memory constraints since there's no physical limit.

### Speed Improvement Source

The interpreter parses text, looks up variable names, and re-tokenizes on every execution. Compiled code jumps directly to fixed RAM addresses and ROM routines — no parsing, no name lookup, no tokenization at runtime.

## HD61700 Assembler

A focused TypeScript assembler for the compiler's output. Not a general-purpose development tool.

### Two-Pass Assembly

| Pass | Purpose |
|------|---------|
| Pass 1 | Parse all lines, collect label addresses, compute instruction sizes |
| Pass 2 | Emit binary, resolve label references, format listing |

### Input Format

AI-format syntax (compatible with the reference C cross assembler):

```asm
        ORG  &H0000
MAIN:   LDW  $2, &H2ADF
        JR   ROM_CALL
L100:   LD   $10, (IX+$SX)
        DB   "Hello"
VAR_A:  DS   9
```

### Supported Directives

- `ORG` — set origin address
- `EQU` — define constant
- `DB` / `DW` — data bytes / words
- `DS` — reserve space
- Labels: alphanumeric + underscore, terminated by `:`

### Instruction Encoding

The assembler uses tables derived from:
- `src/disassemble.ts` — `mnemonicTable` (256 primary + 88 extended entries) with `Kind` enum (34 addressing modes)
- `reference/HD61700 CROSS ASSEMBLER/hd61700.h` — 1125 instruction entries (definitive reference)

Encoding process:
1. Parse mnemonic + operands
2. Match operand pattern against addressing modes
3. Look up primary opcode
4. Encode operands per `Kind` enum
5. All compiled code is byte-addressed (Bank1 RAM) — no word-memory alignment needed

### Features NOT Included

- No macro support
- No conditional compilation
- No `#INCLUDE` / `#INCBIN`
- No PBF or Quick Loader formats
- No word-memory mode

### 132-Column Listing File

Fixed-width format with BASIC source annotations:

```
HD61700 Cross Assembler - FX-870P BASIC Compiler                                                          Page 1
Source: SORCERER.BAS  Date: 2026-04-04  Size: 1847 bytes

Addr  Hex Code         Label        Assembly                         Comment
----- ---------------- ------------ -------------------------------- ----------------------------------------
                                    ORG  &H0000                      ;
                                                                     ; === BASIC Line 10: CLEAR 11000,17000 ===
0000  08 02 DF 2A      MAIN:        LDW  $2,&H2ADF                  ; CLS ROM address
0004  18 23            ROM_CLS:     JR   ROM_CALL                   ; call Bank0 ROM
                                                                     ;
                                                                     ; === BASIC Line 30: FOR I=1 TO 10 ===
000E  08 0A 00 01                   LDW  $10,&H0001                 ; load constant 1
0012  2C 0A 00 50                   STM  $10,VAR_I,9                ; store to I (9-byte FP)
```

Column layout:

| Column | Width | Content |
|--------|-------|---------|
| 1-5 | 5 | Address (hex) |
| 7-22 | 16 | Machine code bytes (hex, space-separated) |
| 24-35 | 12 | Label |
| 37-68 | 32 | Assembly instruction |
| 70-132 | 40+ | Comment (BASIC source headers + auto-generated) |

Features:
- `; === BASIC Line N: <source> ===` headers before each generated block
- `; --- Section Name ---` separators (ROM Call Wrappers, String Literals, Variable Table)
- Symbol table at end (4-column alphabetical layout)
- Size summary: code, data, variables, total, free space remaining
- Page headers with filename, date, page number
- Long hex sequences wrap onto continuation lines

### Assembler Internal Representation

The code generator produces structured assembly lines:

```typescript
interface AsmLine {
  label?: string;
  mnemonic?: string;
  operands?: string;
  comment?: string;
  basicLine?: { num: number; source: string };
}
```

The assembler consumes these, resolves addresses, encodes instructions, and produces both binary and listing outputs.

## Loader & Output

### Output Files

```bash
npx tsx tools/compiler/compile.ts program.bas

# Outputs:
#   program.bin          — raw binary
#   program.lst          — 132-column listing
#   program.sym          — symbol table (JSON)
#   program.loader.bas   — BASIC loader for real hardware
```

### Emulator Mode (Primary)

Load binary directly into Bank1 RAM via the emulator's memory API. No BASIC loader needed. The emulator can add a "Load compiled program" feature that writes the binary at 0x0000 and executes via simulated `MODE110(0)`.

### Hardware Mode (BASIC Loader)

Self-loading BASIC program following the CosmicV4 pattern:
- `CLEAR` to allocate ML area
- `MODE110` to set up memory
- FOR/READ/POKE loop to write binary from DATA statements
- Final `MODE110(entry)` to execute

### Size Reporting

```
Compiled: program.bas → 1847 bytes
  Code: 1204 bytes  Data: 412 bytes  Variables: 231 bytes
  Available: 4096 bytes  Used: 45.1%
```

Warns if output exceeds 4KB.

## Testing Strategy

### Level 1: Unit Tests (vitest)

- **Lexer** — tokenize BASIC fragments, verify token stream. Edge cases: `¥`, `&H`, `HYP SIN`, implicit LET, multi-statement lines.
- **Parser** — parse BASIC lines → AST. One test per statement type. Verify error messages.
- **Assembler** — encode individual instructions, verify against known-good bytes. Round-trip: disassemble → reassemble → compare.
- **Code generator** — compile individual statements → assembly text. Verify structure.

### Level 2: Integration Tests (full pipeline)

- Compile all 20 programs from `public/basic/emulator/` — must compile without errors
- Round-trip: compile → disassemble with `tools/dis.ts` → verify valid HD61700
- Size budget tests — verify output fits within expected allocation
- Listing verification — addresses sequential, hex matches binary

### Level 3: Execution Tests (emulator-based)

- Load compiled binary into emulator, execute, verify output matches interpreter
- Progressive complexity: `PRINT "Hello"` → arithmetic → loops → string ops → full programs
- Sorcerer's Cave as the ultimate integration test
- Performance comparison: time interpreter vs. compiled, document speedup

### Test Fixtures

`tools/compiler/tests/fixtures/` with small `.bas` files targeting specific constructs:

```
hello.bas        — PRINT string literal
arithmetic.bas   — numeric expressions, all operators
strings.bas      — string functions, concatenation
control.bas      — IF/THEN/ELSE, GOTO, GOSUB
loops.bas        — FOR/NEXT, WHILE/WEND, nested
arrays.bas       — DIM, array access, multi-dimensional
fileio.bas       — OPEN, PRINT#, INPUT#, CLOSE
errors.bas       — ON ERROR GOTO, RESUME
```

Each fixture has a `.expected` file with expected LCD output.

## Scope & Constraints

- **Target:** Full Casio JIS Standard BASIC for FX-870P/VX-4
- **Language:** TypeScript (matches emulator codebase)
- **Runtime:** Calls ROM routines — does not reimplement BASIC runtime
- **Memory:** 4KB default at Bank1 0x0000-0x0FFF; expandable via CLEAR
- **Instruction set:** All HD61700 instructions supported by the assembler (1125 entries)
- **Cross-program areas:** P0-P9 with `#` addressing supported in AST but initially compiled as single-program (multi-area compilation is a future enhancement)

## Resources

- `reference/HD61700 CROSS ASSEMBLER/hd61700.h` — definitive instruction table
- `reference/HD61700 CROSS ASSEMBLER/hd61700.c` — reference assembler implementation
- `reference/HD61700 DISASSEMBLER/HD61700.cs` — instruction decode reference
- `src/disassemble.ts` — existing TS disassembler with opcode tables
- `reference/CosmicV4/` — working ML program with ROM call patterns and loader
- `reference/fx870p-rom-annotations.md` — ROM subroutine documentation
- `reference/ROM Disassembly/*.src` — inline-commented ROM disassembly
- `public/docs/casio-jis-basic/` — Casio JIS BASIC manual
- `docs/CasioVX-4-Manual-Peter-Rost.pdf` — VX-4 hardware manual
