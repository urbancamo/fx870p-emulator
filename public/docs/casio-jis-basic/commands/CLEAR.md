*back to [Command Reference](../index.md#command-reference-alphabetical)*

## CLEAR

**[All Models]**

### Purpose
Clears all variables and determines the variable area size in accordance with
the parameter entered. Also closes all files that are open.

### Format
```basic
CLEAR [variable area size] [, work area size]
```

### Example
```basic
CLEAR 400
CLEAR 1024,2048
```

### Parameters
1. variable area size: Numeric expression — sets the storage area for numeric variables, array data, and variable name tables.
2. work area size: Numeric expression — sets the area used for I/O buffers, character string operations, FOR stack, GOSUB stack, and character variable data. **[FX-870P/VX-4]**

The variable area size must be smaller than the work area size.

Default values depend on total memory capacity:

| Model   | Memory     | Default Variable Area | Default Work Area |
|---------|------------|-----------------------|-------------------|
| FX-850P | < 32KB     | 1536 bytes            | —                 |
| FX-850P | 32KB+      | 8192 bytes            | —                 |
| FX-880P | N/A        | 8192 bytes            | —                 |
| VX-4    | 8KB        | 512 bytes             | 1536 bytes        |
| VX-4    | 8KB + RP-8 | 1024 bytes            | 8192 bytes        |

The current sizes can be checked with [SYSTEM](SYSTEM.md) and [FRE](FRE.md).

### Explanation
1. Clears all variables.
2. Closes all open files and clears the [FOR ~ NEXT](FOR_NEXT_STEP.md) and
[GOSUB](GOSUB.md) stack.
3. Variable area cannot be set during program execution.
4. The work area must be large enough for the GOSUB stack depth, string operations, and I/O buffers used by the program. An OM error results if either area is exhausted during execution.

### See
- [FRE](FRE.md)
