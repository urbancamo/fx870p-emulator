## PBLOAD PBGET

### Format 1

```basic
       ⎡ ⎧ 0 ⎫ ⎤ 
PBLOAD ⎢ ⎨   ⎬ ⎥  ["filename"]
       ⎣ ⎩ 1 ⎭ ⎦
```

1. 0: positive phase, 1: reverse phase (default = positive phase)
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
           ⎡ ⎧ 0 ⎫ ⎤ 
PBLOAD ALL ⎢ ⎨   ⎬ ⎥  ["filename"]
           ⎣ ⎩ 1 ⎭ ⎦
```
1. This command loads all files under the specified filename into program
areas P0 through P9.

Operation is identical to PBLOAD.

### Format 3

```basic
        ⎡ ⎧ 0 ⎫ ⎤ 
PBLOAD# ⎢ ⎨   ⎬ ⎥  ["filename"] [, M]
        ⎣ ⎩ 1 ⎭ ⎦
```

1. This command reads the data under the specified filename into the DATA BANK.
2. The [, M] specification appends the read data to the end of the data
   currently stored in the DATA BANK.

Operation is identical to PBLOAD.

### Format 4

```basic
        ⎡ ⎧ 0 ⎫ ⎤ 
PBGET   ⎢ ⎨   ⎬ ⎥  ["filename"]
        ⎣ ⎩ 1 ⎭ ⎦
```
1. This command reads the data file contents under the specified
   filename and assign them to $ variable, A( ) array, or A$( ) array.
2. String data and numeric data are automatically assigned to the proper
   corresponding array.
3. This command can be executed in both the BASIC mode and CAL mode,
   but must be preceded by array declaration using the [DIM](DIM.md)
   statement or [DEFM](DEFM.md) statement.
4. Data are automatically converted (Converting...displayed) before
   being assigned to variables.

### NOTES
 - Suspending execution of PBLOAD, PBLOAD ALL, PBLOAD#, and PBGET using
   the **STOP** key and then resuming operation should be avoided.
 - A [PO](../part-12-2-error-messages.md#po-error) or [DA](../part-12-2-error-messages.md#da-error) error (data error)
   is generated when program or data load is unsuccessful using the PB command.
 - The following variables are used as work areas when any of the PB commands
   are executed:
     - a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y
     - a$, b$, c$, d$, e$, f$, g$, h$, i$, j$, k$, l$, m$, n$, o$, p$
 - STAT, EOX, EOY, PUT, GET commands are converted to the code ??? when
   loaded to a PB series computer. Executing programs with this code generates
   an [SN](../part-12-2-error-messages.md#sn-error) error (syntax error). See section 8-1 for
   details on manual conversion of code ???.
 - Execution of a PB command while in the PRT mode (**PRT** symbol on display)
   automatically cancels the PRT mode.