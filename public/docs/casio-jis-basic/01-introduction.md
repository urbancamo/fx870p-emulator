*back to [Table of Contents](index.md)*

# Introduction to Casio JIS Standard BASIC

## What is Casio JIS Standard BASIC?

Casio JIS Standard BASIC is a dialect of the BASIC programming language implemented by Casio for their series of pocket computers released from the late 1980s through the 1990s. The name refers to its conformance with the Japanese Industrial Standards (JIS) specification for the BASIC language.

Unlike the earlier Casio pocket computers (PB-700 series and earlier), which used a more limited BASIC dialect, the JIS Standard BASIC implementation provides a substantially richer programming environment with features including:

- **High-precision arithmetic**: 10-digit mantissa display with 13-digit internal BCD precision and 2-digit exponent
- **10 independent program areas** (P0 through P9) that can each hold a separate program
- **Extended variable names** up to 255 characters, with case sensitivity (A and a are different variables)
- **Virtual screen**: an 8-line by 32-column virtual display that can be scrolled, even though the physical LCD typically shows only 2 or 4 lines
- **Tokenized storage**: BASIC keywords are stored as single-byte tokens, saving memory
- **Rich built-in function library**: trigonometric, hyperbolic, logarithmic, statistical, and string functions
- **File I/O**: sequential file operations via RS-232C, cassette tape, or floppy disk (model-dependent)
- **Data bank**: integrated memo/data storage with dedicated commands
- **Error handling**: structured error handling with ON ERROR GOTO and RESUME

## History

The Casio JIS Standard BASIC family begins with the **PB-1000** (1986), which introduced the HD61700 CPU and the new BASIC dialect. The PB-1000 used a RAM-based file system rather than the numbered program areas of later models.

The **FX-850P** (1987) and its 64KB sibling the **FX-880P** refined the design with 10 program areas (P0-P9), 10 file areas (F0-F9) for data bank storage, and the familiar two-line LCD display. These became the most popular models in the series.

The **FX-870P** and its rebranded variant the **VX-4** (early 1990s) added a four-line LCD display, C language support, CASL assembler, and additional BASIC commands including statistical functions, file management commands (FILES, KILL, NAME, CHAIN), and the hidden MODE110 instruction for machine language execution.

Later models such as the **FX-890P**, **Z-1**, and **Z-1GR** added graphics capabilities (LINE, DRAW, POINT) and expanded memory, though the core BASIC language remained the same.

## How This Manual is Organized

- **[Supported Models](02-supported-models.md)** — A comparison of all pocket computer models that run Casio JIS BASIC
- **[Entering BASIC Mode](03-entering-basic-mode.md)** — How to switch to BASIC mode and select program areas
- **[Grammar Overview](04-grammar-overview.md)** — Language syntax, variables, operators, and data types
- **[Programming Guide](05-basic-programming-guide.md)** — A tutorial-style guide to writing BASIC programs
- **[Command/Function Table](06-command-function-table.md)** — Quick reference table of all commands and functions
- **[Command Reference](index.md#command-reference-alphabetical)** — Detailed description of every command and function
- **[Error Messages](07-error-messages.md)** — List of all error codes and their meanings
- **[Character Code Table](08-character-code-table.md)** — The full character set with hex and decimal codes
- **[Reserved Word List](09-reserved-word-list.md)** — Alphabetical list of all reserved words

Model-specific features are marked with badges such as **[FX-870P/VX-4]** or **[FX-850P/880P]** throughout the manual. Commands without a badge, or marked **[All Models]**, are available on all Casio JIS BASIC computers.
