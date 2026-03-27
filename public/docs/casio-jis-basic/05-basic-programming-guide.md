*back to [Table of Contents](index.md)*

# BASIC Programming Guide

This section provides a practical guide to writing BASIC programs on Casio pocket computers. It covers program entry, editing, execution, debugging, and the fundamental commands used in BASIC programming.

## Features of BASIC

1. **High-precision calculations** — numeric values with 10-digit mantissa and 2-digit exponent display (13-digit mantissa and 2-digit exponent internally).
2. **Rich built-in functions** — standard mathematical functions ([SIN](commands/SIN_COS_TAN.md), [COS](commands/SIN_COS_TAN.md), [TAN](commands/SIN_COS_TAN.md), [LOG](commands/LOG_LN.md), [EXP](commands/EXP.md), [SQR](commands/SQR.md), etc.), string functions ([CHR$](commands/CHR_STRING.md), [MID$](commands/MID_STRING.md), [LEFT$](commands/LEFT_STRING.md), [RIGHT$](commands/RIGHT_STRING.md), etc.), and high-level math functions ([POL](commands/POL.md), [REC](commands/REC.md), [NCR](commands/NCR.md), [NPR](commands/NPR.md), hyperbolic functions).
3. **10 independent program areas** (P0-P9) — up to ten programs can be stored simultaneously.
4. **Extended variable names** — up to 255 characters long (15 on the FX-850P/880P), making it possible to use descriptive names.
5. **Debugging with [TRON](commands/TRON.md)** — displays the line number currently being executed, making it easy to trace program flow.
6. **Screen editor** — programs can be easily modified directly on the screen.
7. **Virtual screen** — though the physical display shows 2 lines (FX-850P/880P) or 4 lines (FX-870P/VX-4), the virtual screen is 32 columns by 8 lines, scrollable with cursor keys.
8. **File management** — standard BASIC commands [OPEN](commands/OPEN.md), [CLOSE](commands/CLOSE.md), [INPUT#](commands/INPUT_HASH.md), and [PRINT#](commands/PRINT_HASH.md) for data file operations.

## Program Structure

A BASIC program is a collection of numbered lines. Each line consists of a **line number** followed by one or more **statements**:

```basic
10 REM CYLINDER
20 R = 15
30 INPUT "H="; H
40 V = PI * R ^ 2 * H
50 PRINT "V="; V
60 END
```

- Line numbers can range from **1 to 65,535**.
- Lines are executed in order of their line numbers.
- Lines can be entered in any order — the computer arranges them automatically.
- Multiple statements can be placed on one line, separated by colons:
  ```basic
  100 R = 15 : A = 7 : B = 8
  ```

## Entering a Program

1. Enter BASIC mode by pressing **MODE** then **1**.
2. Select a program area if needed (e.g., **SHIFT** **3** for P3).
3. Type each line with its line number and press **EXE** to store it.

```
10 REM CYLINDER    [EXE]
20 R=15            [EXE]
30 INPUT "H=";H    [EXE]
40 V=PI*R^2*H      [EXE]
50 PRINT "V=";V    [EXE]
60 END             [EXE]
```

A line is **not** stored in memory until **EXE** is pressed.

**One-key input**: Many BASIC keywords can be entered with a single key combination using **SHIFT** followed by the labeled key (e.g., **SHIFT** + **INPUT** key).

## Editing a Program

### Editing the Current Line

Before pressing **EXE**, use the cursor keys (left/right arrows) to move to the character you want to change, then type the correct character.

- **INS** key: Opens a space at the cursor position for inserting characters.
- **SHIFT** + **DEL**: Deletes the character at the cursor position.
- **BS** key: Deletes the character to the left of the cursor.

After making changes, press **EXE** to store the corrected line.

### Using LIST to Edit

The [LIST](commands/LIST.md) command displays the program. You can then scroll through it with cursor keys and make changes directly.

```basic
LIST        ' Display entire program
LIST 30     ' Display from line 30
LIST 30-60  ' Display lines 30 through 60
LIST .      ' Display last line executed
```

- Press **BRK** to stop the listing.
- Press **STOP** to pause; **EXE** to resume.

### Using EDIT Mode

The [EDIT](commands/EDIT.md) command enters a line-by-line editing mode:

```basic
EDIT        ' Start editing from first line
EDIT 30     ' Start editing from line 30
EDIT .      ' Edit last line executed
```

In EDIT mode:
- **Down arrow** or **EXE**: advance to the next line
- **Up arrow** or **SHIFT** + **EXE**: return to the previous line
- **Right arrow**: enable editing of the current line
- **BRK**: exit EDIT mode

### Deleting Lines

- To delete a single line, type its number and press **EXE**: `40 [EXE]`
- To delete a range: use [DELETE](commands/DELETE.md): `DELETE 40-60 [EXE]`
- To delete the entire program in the current area: `NEW [EXE]`
- To delete all programs in all areas: `NEW ALL [EXE]`

## Running a Program

Two ways to execute a program:

1. **In BASIC mode**: type `RUN` and press **EXE**. The program in the current program area executes.
   - `RUN 100` starts execution from line 100.

2. **In CAL mode**: press **SHIFT** followed by a program area number (0-9). If a program exists in that area, it runs immediately.

### Program Output

When a [PRINT](commands/PRINT.md) statement executes, `STOP` appears on the display and execution pauses. Press **EXE** to continue. To suppress the pause, end the PRINT statement with a semicolon:

```basic
10 PRINT "BASIC ";    ' No pause — next output appears immediately after
20 PRINT "PROGRAM"
```

### Stopping a Program

- Press **BRK** during execution to interrupt the program.
- The [STOP](commands/STOP.md) command in a program pauses execution; use `CONT` to resume.
- The [END](commands/END.md) command terminates the program.

## Fundamental Commands

### REM — Remarks

```basic
140 REM Square root and cube root calculation
```

[REM](commands/REM.md) lines are ignored during execution. Use them to document your program. A single quote (`'`) can substitute for REM: `140 ' Square root calculation`

### INPUT — Keyboard Input

```basic
30 INPUT "Height="; H
```

[INPUT](commands/INPUT.md) displays a prompt and waits for keyboard input. The entered value is assigned to the variable.

### PRINT — Display Output

```basic
50 PRINT "Volume="; V
```

[PRINT](commands/PRINT.md) displays values and strings on the screen. Separate items with `;` for continuous output or `,` for paused output.

### IF~THEN~ELSE — Conditional Execution

```basic
40 IF N > 5 THEN N = 5
50 IF N = 0 THEN GOTO 130
60 IF A > 100 THEN PRINT "Big" ELSE PRINT "Small"
```

[IF~THEN~ELSE](commands/IF_THEN_ELSE.md) tests a condition. If true, the THEN clause executes. If false and ELSE is present, the ELSE clause executes. You can jump to other program areas: `IF A = 1 THEN GOTO #2`

### GOTO — Unconditional Jump

```basic
120 GOTO 10
```

[GOTO](commands/GOTO.md) jumps to the specified line number. Can also jump to other program areas: `GOTO #3`

### FOR~NEXT — Loop

```basic
60 FOR I = 1 TO 10
70   X = X + A(I)
80 NEXT I
```

[FOR~NEXT](commands/FOR_NEXT_STEP.md) repeats the enclosed statements. An optional [STEP](commands/FOR_NEXT_STEP.md) value can be specified: `FOR I = 10 TO 0 STEP -1`

### READ / DATA / RESTORE — Embedded Data

```basic
70 READ X
180 DATA 9, 7, 20, 28, 36
20 RESTORE
```

[READ](commands/READ.md) assigns values from [DATA](commands/DATA.md) statements to variables. [RESTORE](commands/RESTORE.md) resets the read pointer back to the first DATA item (or to a specific line).

### GOSUB / RETURN — Subroutines

```basic
100 GOSUB 1000
    ...
1000 REM Subroutine
1010 Y = SQR(S)
1020 RETURN
```

[GOSUB](commands/GOSUB.md) jumps to a subroutine; [RETURN](commands/RETURN.md) returns to the statement following the GOSUB call. Can also call subroutines in other program areas: `GOSUB #3`

### END — Program Termination

```basic
130 END
```

[END](commands/END.md) terminates program execution. A program ends naturally when it reaches the last line, but END can terminate execution from anywhere.

## Constants and Variables

### Numeric Constants

- **Decimal notation**: `15`, `3.14`, `-27`
- **Hexadecimal notation**: `&HFF`, `&H1A3C` (see [&H](commands/AMP_H.md))
- **Exponential notation**: `1.5E10` (1.5 × 10¹⁰)

### String Constants

- Enclosed in double quotes: `"Hello"`, `"H="`
- Closing quote at end of line may be omitted: `10 PRINT "TEST` is valid
- Concatenate with `+`: `"AD" + "1990"` produces `"AD1990"`

### Variable Types

| Type | Example | Description |
|------|---------|-------------|
| Numeric variable | `A`, `TOTAL`, `x1` | Stores a numeric value |
| String variable | `A$`, `NAME$` | Stores a character string |
| Numeric array | `A(10)`, `M(3,3)` | Array of numeric values |
| String array | `A$(10)`, `NAMES$(5)` | Array of character strings |

- Variable names are **case-sensitive**: `A` and `a` are different variables.
- Variable names must not begin with a reserved word.
- Arrays must be declared with [DIM](commands/DIM.md) before use. Subscripts start at 0.

## Debugging

### Trace Mode

[TRON](commands/TRON.md) enables trace mode. When a program runs, the program area and line number of each statement are displayed, and execution pauses until **EXE** is pressed. This lets you step through the program to find logic errors.

```basic
TRON        ' Enable trace mode
RUN         ' Run with tracing
TROFF       ' Disable trace mode
```

### Error Messages

When an error occurs, a message like `SN error P0--10` is displayed, indicating:
- **SN**: the error type (Syntax Error)
- **P0**: the program area
- **10**: the line number

Use `LIST .` or `EDIT .` to jump directly to the line that caused the error. See [Error Messages](07-error-messages.md) for the full list.

### Continuing After an Error

After fixing an error, use `CONT` to resume execution from where it stopped (only works after [STOP](commands/STOP.md) or **BRK** — not after an error).

## Saving and Loading Programs

Programs are preserved in memory by the backup battery even when the computer is powered off. For permanent storage, programs can be saved to external media.

### FX-850P/FX-880P (Cassette Tape) **[FX-850P/880P]**

```basic
SAVE "MYPROG"           ' Save current program area to cassette
SAVE ALL "ALLPROGS"     ' Save all program areas
LOAD "MYPROG"           ' Load a program from cassette
LOAD ALL "ALLPROGS"     ' Load all program areas
VERIFY "MYPROG"         ' Verify saved program matches memory
```

### FX-870P/VX-4 (RS-232C and Floppy Disk) **[FX-870P/VX-4]**

```basic
SAVE "0:MYPROG.BAS"     ' Save to floppy disk
LOAD "0:MYPROG.BAS"     ' Load from floppy disk
SAVE "COM0:...", A       ' Save as ASCII over RS-232C
FILES                    ' List files on floppy disk
KILL "0:OLDPROG.BAS"    ' Delete a file
NAME "0:OLD" AS "0:NEW" ' Rename a file
```

See the individual command pages for [SAVE](commands/SAVE_SAVE_ALL.md), [LOAD](commands/LOAD_LOAD_ALL.md), [FILES](commands/FILES.md), [KILL](commands/KILL.md), and [NAME](commands/NAME.md) for complete details on file descriptors and options.

## Error Handling

Programs can handle errors gracefully using [ON ERROR GOTO](commands/ON_ERROR_GOTO.md):

```basic
10 ON ERROR GOTO 100
20 INPUT "Number: "; N
30 PRINT 1 / N
40 END
100 PRINT "Error"; ERR; "at line"; ERL
110 RESUME NEXT
```

- [ON ERROR GOTO](commands/ON_ERROR_GOTO.md) sets up an error handler
- [ERR](commands/ERR.md) returns the error code
- [ERL](commands/ERL.md) returns the line number where the error occurred
- [RESUME](commands/RESUME.md) returns execution after handling the error

## Memory Management

### Checking Free Memory

- The BASIC mode display shows free bytes (e.g., `3355B`)
- [SYSTEM](commands/SYSTEM.md) shows detailed memory information
- [FRE](commands/FRE.md)(0) returns the free program/variable area

### Memory Allocation

- [CLEAR](commands/CLEAR.md) resets all variables and optionally sets the variable area and work area sizes
- [DEFM](commands/DEFM.md) sets the number of character variable storage locations
- [ERASE](commands/ERASE.md) deallocates specific array variables

### Calculating Program Size

| Element | Bytes |
|---------|-------|
| Line number | 2 bytes (regardless of number size) |
| Command/keyword | 2 bytes (stored as token) |
| Each character (letters, digits, spaces) | 1 byte |
| End of line (EXE) | 1 byte |
| Overhead per line | 1 byte |

Example: `10 A = SIN X` uses 2 + 1 + 1 + 1 + 2 + 1 + 1 + 1 + 1 = **11 bytes**.

## Cross-Program-Area Features

One of the unique features of Casio JIS BASIC is the ability to call between program areas:

```basic
GOTO #3          ' Jump to the first line of program area 3
GOSUB #5         ' Call program area 5 as a subroutine
RETURN #0        ' Return to program area 0
IF A=1 THEN #2   ' Conditional jump to program area 2
ON A GOTO #1,#2  ' Computed jump across program areas
```

Remember that variables are global across all program areas — a value set in P0 is visible in P3. This enables cooperation between programs but requires care to avoid naming conflicts.
