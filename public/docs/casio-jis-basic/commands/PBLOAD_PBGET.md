*back to [Command Reference](../index.md#command-reference-alphabetical)*

## PBLOAD / PBGET

**[FX-850P/880P]**

### Format 1

```basic
PBLOAD [{ 0 | 1 }] ["filename"]
```

1. 0: positive phase, 1: reverse phase (default = positive phase).
   Attempt using the phase which is opposite the current setting
   if problems are experienced during PBLOAD operations.
2. This command loads file under the specified filename into the
   current program area.
3. This command must be executed in the BASIC mode.
4. Execution of this command reads the specified program from tape
   and converts it from PB-100 series format to FX-850P/FX-880P format.
5. Execution of this command can be terminated at any time by pressing
   the **BRK** key.

### Format 2

```basic
PBLOAD ALL [{ 0 | 1 }] ["filename"]
```

1. This command loads all files under the specified filename into program
areas P0 through P9.

Operation is identical to PBLOAD.

### Format 3

```basic
PBLOAD# [{ 0 | 1 }] ["filename"] [, M]
```

1. This command reads the data under the specified filename into the DATA BANK.
2. The `[, M]` specification appends the read data to the end of the data
   currently stored in the DATA BANK.

Operation is identical to PBLOAD.

### Format 4

```basic
PBGET [{ 0 | 1 }] ["filename"]
```

1. This command reads the data file contents under the specified
   filename and assigns them to $ variable, A( ) array, or A$( ) array.
2. String data and numeric data are automatically assigned to the proper
   corresponding array.
3. This command can be executed in both the BASIC mode and CAL mode,
   but must be preceded by array declaration using the [DIM](DIM.md)
   statement or [DEFM](DEFM.md) statement.
4. Data are automatically converted (Converting...displayed) before
   being assigned to variables.

### Notes
 - Suspending execution of PBLOAD, PBLOAD ALL, PBLOAD#, and PBGET using
   the **STOP** key and then resuming operation should be avoided.
 - A PO or DA error (data error) is generated when program or data load
   is unsuccessful using the PB command.
 - The following variables are used as work areas when any of the PB commands
   are executed:
     - a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y
     - a$, b$, c$, d$, e$, f$, g$, h$, i$, j$, k$, l$, m$, n$, o$, p$
 - STAT, EOX, EOY, PUT, GET commands are converted to the code ??? when
   loaded to a PB series computer. Executing programs with this code generates
   an SN error (syntax error).
 - Execution of a PB command while in the PRT mode (**PRT** symbol on display)
   automatically cancels the PRT mode.
