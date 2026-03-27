*back to [Table of Contents](index.md)*

# How to Enter BASIC Mode

## Modes Overview

The Casio pocket computers operate in several modes. BASIC mode is where you write, edit, and run BASIC programs. The following table shows the available modes and how to enter them:

| Mode Key | Mode | Description |
|----------|------|-------------|
| MODE + 0 | CAL | Calculator mode (default when powered on) |
| MODE + 1 | BASIC | BASIC programming mode — write, edit, and run programs |
| MODE + 4 | DEG | Set angle unit to degrees |
| MODE + 5 | RAD | Set angle unit to radians |
| MODE + 6 | GRA | Set angle unit to grads |
| MODE + 7 | Print ON | Enable printer output |
| MODE + 8 | Print OFF | Disable printer output |
| MODE + 9 | MEMO IN | Data bank / memo input mode |

Additional modes available on the FX-870P/VX-4 and later:

| Mode | How to Enter | Description |
|------|-------------|-------------|
| FX (Statistical) | Press the FX key | Statistical calculation and training board |
| F.COM | SHIFT + CASL key | File communication — save/load/merge/copy programs to external devices |
| C Language | SHIFT + FX key | C language programming mode **[FX-870P/VX-4]** |
| CASL | CASL key | CASL assembler mode **[FX-870P/VX-4]** |

## Entering BASIC Mode

1. Press the **MODE** key followed by **1** to enter BASIC mode.

2. The display shows the BASIC mode screen with the current program area and available memory:

```
P 0 1 2 3 4 5 6 7 8 9    3355B
Ready P0
_
```

The number after the program areas (e.g., `3355B`) shows the total free memory in bytes.

## Selecting a Program Area

There are 10 independent program areas, numbered P0 through P9. Each can hold a separate BASIC program.

- **In BASIC mode**: Press **SHIFT** (the red S key) followed by a numeric key **0-9** to select that program area for editing. The selected area number is highlighted on the top line of the display.

- **In CAL mode**: Press **SHIFT** followed by a numeric key **0-9**. If a BASIC program exists in that program area, it is immediately executed.

## File Areas

In addition to the 10 program areas, there are 10 file areas (F0 through F9) used by the data bank feature. These are accessed with the `#` variants of commands such as [LIST#](commands/LIST_HASH.md), [WRITE#](commands/WRITE_HASH.md), [READ#](commands/READ_HASH.md), and [RESTORE#](commands/RESTORE_HASH.md).

## Notes

- Variables are global — they are shared across all 10 program areas. There are no scoping rules. This means a program in P0 can set a variable that a program in P3 can read.
- The [PASS](commands/PASS.md) command can password-protect program and file areas, preventing LIST and EDIT access.
- The [SYSTEM](commands/SYSTEM.md) command displays the current BASIC system settings including trace mode, printer mode, and free memory.
