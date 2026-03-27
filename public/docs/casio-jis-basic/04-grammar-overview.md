*back to [Table of Contents](index.md)*

# Grammar Overview

This section describes the syntax and structure of the Casio JIS Standard BASIC language.

## Program Structure

### Sentences (Lines)

Each BASIC sentence (line) has the following structure:

```
[line number] Command Operand [: Command Operand [: ...]]
```

- If a **line number** is present at the beginning, the line is stored as part of a program.
- If there is **no line number**, the line is executed immediately when **EXE** is pressed (direct mode).
- Multiple statements can be placed on a single line, separated by colons (`:`).

### Line Numbers

- Range: **1 to 65,535**
- Line numbers determine the order of execution.
- The [RENUM](commands/RENUM.md) command can renumber lines at regular intervals.

### Line Length

- Maximum **255 characters** per line.
- BASIC keywords are stored as single-byte tokens internally, so a line that appears long on screen may use less memory than expected.

## Variables

Variables are classified into four types based on data type and structure:

| | Single Variable | Array Variable |
|---|---|---|
| **Numeric** | Numeric variable | Array numeric variable |
| **Character (String)** | Character variable | Array character variable |

### Variable Naming Rules

1. Must **not** contain reserved words. (Conversely, because keywords are tokenized, delimiters like spaces around reserved words can be omitted.)
2. The first character must be an uppercase letter (A-Z), lowercase letter (a-z), or Katakana character (codes &HA6-&HDF).
3. After the first character, uppercase letters, lowercase letters, Katakana, and digits (0-9) are allowed.
4. Variable names can be up to **255 characters** long.
5. **Uppercase and lowercase letters are different characters.** For example, `A` and `a` are separate variables.
6. **Numeric variables, character variables, array numeric variables, and array character variables with the same name can all exist simultaneously.** For example, `DIM A(10)` and `A$` can coexist alongside `A`.
7. The standard string variables `A$` to `Z$` are limited to **30 characters** maximum length.

### Variable Scope

- Variables and arrays are **global** — they are shared across all 10 program areas (P0-P9).
- Variables are reserved (allocated) on first use.
- Use [VARLIST](commands/VARLIST.md) to display the names and types of all currently allocated variables.

**Care must be taken because global variables can cause bugs** when multiple programs use the same variable names.

## Arrays

1. An array must first be declared with a [DIM](commands/DIM.md) statement before use.
2. Array subscripts are integers greater than or equal to 0. If a fractional value is given, it is truncated.
3. The maximum number of dimensions is 255 (limited by the 255-character line length of a DIM statement).
4. The maximum value of each subscript is limited only by available memory.
5. An array variable cannot be used unless it has been declared with DIM.

## Data Types

### Numeric Values

- Display: **10-digit mantissa** with **2-digit exponent**
- Internal precision: **13-digit mantissa** (BCD) with **2-digit exponent**
- Range: 0 and ±1 × 10⁻⁹⁹ to ±9.999999999 × 10⁹⁹
- Numeric values are displayed as integers, fractions, or exponential notation, with the format selected automatically based on the value.
- Positive numbers are preceded by a space; negative numbers by a minus sign.
- A space is added after displayed numeric values.

### String Values

- Maximum length: **255 characters** (for extended string variables)
- Standard string variables (`A$` through `Z$`): maximum **30 characters**
- Only the `+` operator is valid for string operations (concatenation).
- The result of concatenation must be within 255 characters.

## Operators

### Arithmetic Operators

| Operator | Operation | Example |
|----------|-----------|---------|
| `+` | Addition | `A + B` |
| `-` | Subtraction (or negation) | `A - B` |
| `*` | Multiplication | `A * B` |
| `/` | Division | `A / B` |
| `^` | Exponentiation | `A ^ B` |
| `¥` | Integer division | `A ¥ B` |
| [MOD](commands/MOD.md) | Modulo (remainder) | `A MOD B` |

### Comparison Operators

Comparison operators return **-1** if true and **0** if false.

| Operator | Meaning |
|----------|---------|
| `=` | Equal to |
| `<>` or `><` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` or `=<` | Less than or equal to |
| `>=` or `=>` | Greater than or equal to |

**String comparison**: Strings are compared character by character using their character codes, from left to right. When one string is a prefix of another, the shorter string is considered smaller.

| Expression | Result |
|------------|--------|
| `PRINT "ABC" < "ABD"` | -1 (true) |
| `PRINT "DEF" < "ABC"` | 0 (false) |
| `PRINT "ABC" > "ABCD"` | 0 (false — shorter string is smaller) |

### Logical Operators

| Operator | Operation | Example |
|----------|-----------|---------|
| `NOT` | Bitwise NOT | `NOT A` |
| `AND` | Bitwise AND | `A AND B` |
| `OR` | Bitwise OR | `A OR B` |
| `XOR` | Bitwise XOR | `A XOR B` |

See [LOGICAL](commands/LOGICAL.md) for details.

### Operator Precedence (Arithmetic Priority)

Operations are evaluated in the following order, from highest to lowest priority:

| Priority | Operation |
|----------|-----------|
| 1 (highest) | Parentheses `( )` |
| 2 | Built-in functions (SIN, COS, etc.) |
| 3 | Exponentiation `^` |
| 4 | Negation `-` (unary minus) |
| 5 | Multiplication `*`, Division `/`, Integer division `¥` |
| 6 | Modulo `MOD` |
| 7 | Addition `+`, Subtraction `-` |
| 8 | Comparison operators (`=`, `<>`, `<`, `>`, `<=`, `>=`) |
| 9 | `NOT` |
| 10 | `AND` |
| 11 | `OR`, `XOR` |
| 12 (lowest) | String concatenation `+` (for strings) |

## Rounding Behavior

The Casio pocket computers perform internal calculations with 13-digit BCD precision but display only 10 digits. Rounding behavior after the four basic arithmetic operations can be controlled:

- **MODE10** — Enable rounding after arithmetic operations (default)
- **MODE11** — Disable rounding after arithmetic operations

When rounding is enabled (MODE10) on the FX-870P/VX-4:
- If digits 11-13 are **049 or less**: round down (truncate)
- If digits 11-13 are between **050 and 949**: no rounding
- If digits 11-13 are **950 or more**: round up

**Note:** Constant substitution (direct assignment like `A = 1.123456789049`) is **not** rounded even when rounding after arithmetic operations is enabled. Rounding only applies to the results of arithmetic operations (e.g., `A = A * 1`).

**Note:** The FX-890P/Z-1 uses stricter rounding thresholds (007 and 990 respectively).

## Variable Memory Usage

When variables are first used, memory is allocated as follows:

| Variable Type | Memory Used |
|---------------|-------------|
| Numeric variable | (variable name length + 12) bytes from work area |
| Character variable | (variable name length + 4) bytes from work area, plus (string length + 1) bytes from character area |

Array variables allocated by DIM:

| Array Type | Memory Used |
|------------|-------------|
| Array numeric variable | ((variable name length + 4) + (array size × 8) + (dimensions × 2 + 1)) bytes from work area |
| Array character variable | (variable name length + 4) bytes from work area, plus ((array size) + (dimensions × 2 + 1)) bytes from character area |

The current work area size, variable area size, and free space can be checked with the [SYSTEM](commands/SYSTEM.md) command and the [FRE](commands/FRE.md) function.

## Multiple Statements Per Line

Multiple BASIC statements can be placed on a single line, separated by colons:

```basic
10 A = 1 : B = 2 : PRINT A + B
```

This is equivalent to:

```basic
10 A = 1
20 B = 2
30 PRINT A + B
```

## Direct Mode vs Program Mode

- **Direct mode**: Type a statement without a line number and press EXE. It executes immediately. Useful for quick calculations, checking variable values, and testing commands.
- **Program mode**: Type statements with line numbers. They are stored in the current program area and executed with [RUN](commands/RUN.md).

Most commands work in both modes, but some are restricted to one or the other. Manual commands (like [LIST](commands/LIST.md), [EDIT](commands/EDIT.md), [RENUM](commands/RENUM.md)) can only be used in direct mode. See the [Command/Function Table](06-command-function-table.md) for details.
