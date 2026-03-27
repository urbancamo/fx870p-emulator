*back to [Table of Contents](index.md)*

# Command/Function Quick Reference Table

This is a consolidated quick-reference for all commands, statements, and functions in Casio JIS Standard BASIC. Commands are organized by category. Click any command name to see its full documentation.

## Manual Commands

These commands are entered directly in the calculator's command mode (not within a program).

| Command | Description | Model |
|---------|-------------|-------|
| [LIST](commands/LIST.md) | Display program listing on screen | All Models |
| [LLIST](commands/LLIST.md) | Print program listing to printer | All Models |
| [RENUM](commands/RENUM.md) | Renumber program lines | All Models |
| [NEW](commands/NEW.md) | Delete program and clear variables | All Models |
| [PASS](commands/PASS.md) | Set or clear password protection | All Models |
| [RUN](commands/RUN.md) | Execute a program | All Models |
| [SAVE](commands/SAVE_SAVE_ALL.md) | Save program to cassette tape | All Models |
| [LOAD](commands/LOAD_LOAD_ALL.md) | Load program from cassette tape | All Models |
| [MERGE](commands/MERGE.md) | Merge program from cassette tape | All Models |
| [VERIFY](commands/VERIFY.md) | Verify saved program against memory | **[FX-850P/880P]** |
| [EDIT](commands/EDIT.md) | Edit a program line | All Models |
| [DELETE](commands/DELETE.md) | Delete a range of program lines | All Models |
| [SYSTEM](commands/SYSTEM.md) | Return to system mode | All Models |
| [CONT](commands/CONT.md) | Continue execution after STOP | All Models |
| [LIST#](commands/LIST_HASH.md) | List program to sequential file | All Models |
| [SAVE#](commands/SAVE_HASH.md) | Save program to data file | All Models |
| [LOAD#](commands/LOAD_HASH.md) | Load program from data file | **[FX-850P/880P]** |
| [NEW#](commands/NEW_HASH.md) | Delete a data file | All Models |
| [FILES](commands/FILES.md) | Display list of data files | **[FX-870P/VX-4]** |
| [FORMAT](commands/FORMAT.md) | Format a floppy disk | **[FX-870P/VX-4]** |

## Program Commands

These commands and statements are used within BASIC programs.

| Command | Description | Model |
|---------|-------------|-------|
| [ANGLE](commands/ANGLE.md) | Set angle mode (degrees/radians/gradients) | All Models |
| [BEEP](commands/BEEP.md) | Sound the buzzer | All Models |
| [CLEAR](commands/CLEAR.md) | Clear all variables and set string area size | All Models |
| [DIM](commands/DIM.md) | Declare array variables | All Models |
| [ERASE](commands/ERASE.md) | Delete array variables from memory | All Models |
| [END](commands/END.md) | Terminate program execution | All Models |
| [DATA](commands/DATA.md) | Define inline data for READ | All Models |
| [READ](commands/READ.md) | Read values from DATA statements | All Models |
| [RESTORE](commands/RESTORE.md) | Reset DATA pointer to a specified line | All Models |
| [FOR~TO~STEP~NEXT](commands/FOR_NEXT_STEP.md) | Counted loop | All Models |
| [GOTO](commands/GOTO.md) | Unconditional branch to a line number | All Models |
| [GOSUB](commands/GOSUB.md) | Call a subroutine | All Models |
| [RETURN](commands/RETURN.md) | Return from subroutine | All Models |
| [IF~THEN~ELSE](commands/IF_THEN_ELSE.md) | Conditional execution | All Models |
| [INPUT](commands/INPUT.md) | Read input from keyboard | All Models |
| [PRINT](commands/PRINT.md) | Display output on screen | All Models |
| [LPRINT](commands/LPRINT.md) | Print output to printer | All Models |
| [PRINT USING](commands/PRINT_USING.md) | Formatted output with template | **[FX-870P/VX-4]** |
| [LET](commands/LET.md) | Assign a value to a variable | All Models |
| [ON GOTO](commands/ON_GOTO.md) | Computed branch | All Models |
| [ON GOSUB](commands/ON_GOSUB.md) | Computed subroutine call | All Models |
| [REM](commands/REM.md) | Program comment (remark) | All Models |
| [SET](commands/SET.md) | Set system parameters | All Models |
| [STOP](commands/STOP.md) | Pause program execution | All Models |
| [CLS](commands/CLS.md) | Clear the display | All Models |
| [DEFSEG](commands/DEFSEG.md) | Set memory segment for PEEK/POKE | All Models |
| [POKE](commands/POKE.md) | Write a byte to memory | All Models |
| [LOCATE](commands/LOCATE.md) | Position cursor on display | All Models |
| [TRON](commands/TRON.md) | Enable trace mode | All Models |
| [TROFF](commands/TROFF.md) | Disable trace mode | All Models |
| [VARLIST](commands/VARLIST.md) | Display list of defined variables | All Models |
| [ON ERROR GOTO](commands/ON_ERROR_GOTO.md) | Set error handler | All Models |
| [RESUME](commands/RESUME.md) | Resume execution after error handling | All Models |
| [OPEN](commands/OPEN.md) | Open a data file | All Models |
| [CLOSE](commands/CLOSE.md) | Close a data file | All Models |
| [PRINT#](commands/PRINT_HASH.md) | Write data to a file | All Models |
| [INPUT#](commands/INPUT_HASH.md) | Read data from a file | All Models |
| [LINE INPUT#](commands/LINE_INPUT_HASH.md) | Read a full line from a file | **[FX-870P/VX-4]** |
| [READ#](commands/READ_HASH.md) | Read record from random-access file | All Models |
| [WRITE#](commands/WRITE_HASH.md) | Write record to random-access file | All Models |
| [RESTORE#](commands/RESTORE_HASH.md) | Set file pointer position | All Models |
| [DEFCHR$](commands/DEFCHR_STRING.md) | Define a custom character | All Models |
| [CHAIN](commands/CHAIN.md) | Load and run another program | **[FX-870P/VX-4]** |
| [STAT](commands/STAT.md) | Enter statistical data | **[FX-870P/VX-4]** |
| [STAT CLEAR](commands/STAT_CLEAR.md) | Clear statistical data | **[FX-870P/VX-4]** |
| [MODE](commands/MODE.md) | Set calculator mode | **[FX-870P/VX-4]** |
| [KILL](commands/KILL.md) | Delete a file from disk | **[FX-870P/VX-4]** |
| [NAME](commands/NAME.md) | Rename a file on disk | **[FX-870P/VX-4]** |
| [INPUT@](commands/INPUT_AT.md) | Input with cursor position | **[Undocumented]** |
| [CALC$](commands/CALC_STRING.md) | Evaluate expression string | **[Undocumented]** |
| [CALCJMP](commands/CALCJMP.md) | Evaluate and branch | **[Undocumented]** |

## Numeric Functions

| Function | Description | Model |
|----------|-------------|-------|
| [SIN](commands/SIN_COS_TAN.md) | Sine | All Models |
| [COS](commands/SIN_COS_TAN.md) | Cosine | All Models |
| [TAN](commands/SIN_COS_TAN.md) | Tangent | All Models |
| [ASN](commands/ASN_ACS_ATN.md) | Arc sine (inverse sine) | All Models |
| [ACS](commands/ASN_ACS_ATN.md) | Arc cosine (inverse cosine) | All Models |
| [ATN](commands/ASN_ACS_ATN.md) | Arc tangent (inverse tangent) | All Models |
| [HYP SIN](commands/HYP_SIN_COS_TAN.md) | Hyperbolic sine | All Models |
| [HYP COS](commands/HYP_SIN_COS_TAN.md) | Hyperbolic cosine | All Models |
| [HYP TAN](commands/HYP_SIN_COS_TAN.md) | Hyperbolic tangent | All Models |
| [HYP ASN](commands/HYP_ASN_ACS_ATN.md) | Hyperbolic arc sine | All Models |
| [HYP ACS](commands/HYP_ASN_ACS_ATN.md) | Hyperbolic arc cosine | All Models |
| [HYP ATN](commands/HYP_ASN_ACS_ATN.md) | Hyperbolic arc tangent | All Models |
| [SQR](commands/SQR.md) | Square root | All Models |
| [CUR](commands/CUR.md) | Cube root | All Models |
| ^ | Exponentiation | All Models |
| [EXP](commands/EXP.md) | Natural exponential (e^x) | All Models |
| [LOG](commands/LOG_LN.md) | Common logarithm (base 10) | All Models |
| [LN](commands/LOG_LN.md) | Natural logarithm (base e) | All Models |
| [ABS](commands/ABS.md) | Absolute value | All Models |
| [INT](commands/INT.md) | Integer part (floor) | All Models |
| [FIX](commands/FIX.md) | Truncate to integer (toward zero) | All Models |
| [FRAC](commands/FRAC.md) | Fractional part | All Models |
| [SGN](commands/SGN.md) | Sign function (-1, 0, or 1) | All Models |
| [ROUND](commands/ROUND.md) | Round to specified decimal places | All Models |
| [RAN#](commands/RAN_HASH.md) | Pseudo-random number (0 to 1) | All Models |
| [PI](commands/PI.md) | Value of pi (3.14159265359) | All Models |
| [FACT](commands/FACT.md) | Factorial | All Models |
| [NPR](commands/NPR.md) | Permutations | All Models |
| [NCR](commands/NCR.md) | Combinations | All Models |
| [POL](commands/POL.md) | Rectangular to polar conversion | All Models |
| [REC](commands/REC.md) | Polar to rectangular conversion | All Models |
| [DEG](commands/DEG.md) | Convert DMS to decimal degrees | All Models |
| DEGR | Convert radians to degrees | All Models |
| [DMS](commands/DMS_STRING.md) | Convert decimal degrees to DMS | All Models |
| [FRE](commands/FRE.md) | Free memory in bytes | All Models |
| [PEEK](commands/PEEK.md) | Read a byte from memory | All Models |
| [DSKF](commands/DSKF.md) | Free disk space in bytes | **[FX-870P/VX-4]** |

## Statistical Functions

All statistical functions require **[FX-870P/VX-4]** or later.

| Function | Description | Model |
|----------|-------------|-------|
| [CNT](commands/CNT.md) | Number of data points | **[FX-870P/VX-4]** |
| [SUMX](commands/SUMX_SUMY.md) | Sum of x values | **[FX-870P/VX-4]** |
| [SUMY](commands/SUMX_SUMY.md) | Sum of y values | **[FX-870P/VX-4]** |
| [SUMX2](commands/SUMX_SUMY.md) | Sum of x-squared values | **[FX-870P/VX-4]** |
| [SUMY2](commands/SUMX_SUMY.md) | Sum of y-squared values | **[FX-870P/VX-4]** |
| [SUMXY](commands/SUMX_SUMY.md) | Sum of x*y products | **[FX-870P/VX-4]** |
| [MEANX](commands/MEANX_MEANY.md) | Mean of x values | **[FX-870P/VX-4]** |
| [MEANY](commands/MEANX_MEANY.md) | Mean of y values | **[FX-870P/VX-4]** |
| [SDX](commands/SDX_SDY.md) | Sample standard deviation of x | **[FX-870P/VX-4]** |
| [SDY](commands/SDX_SDY.md) | Sample standard deviation of y | **[FX-870P/VX-4]** |
| [SDXN](commands/SDX_SDY.md) | Population standard deviation of x | **[FX-870P/VX-4]** |
| [SDYN](commands/SDX_SDY.md) | Population standard deviation of y | **[FX-870P/VX-4]** |
| [LRA](commands/LRA_LRB.md) | Linear regression intercept | **[FX-870P/VX-4]** |
| [LRB](commands/LRA_LRB.md) | Linear regression slope | **[FX-870P/VX-4]** |
| [COR](commands/COR.md) | Correlation coefficient | **[FX-870P/VX-4]** |
| [EOX](commands/EOX_EOY.md) | Estimated x value from y | **[FX-870P/VX-4]** |
| [EOY](commands/EOX_EOY.md) | Estimated y value from x | **[FX-870P/VX-4]** |

## Character/String Functions

| Function | Description | Model |
|----------|-------------|-------|
| [CHR$](commands/CHR_STRING.md) | Return character for a given code | All Models |
| [ASC](commands/ASC.md) | Return character code for a character | All Models |
| [STR$](commands/STR_STRING.md) | Convert number to string | All Models |
| [VAL](commands/VAL.md) | Convert string to number | All Models |
| [VALF](commands/VALF.md) | Convert string expression to number | All Models |
| [MID$](commands/MID_STRING.md) | Extract substring from middle | All Models |
| [RIGHT$](commands/RIGHT_STRING.md) | Extract substring from right | All Models |
| [LEFT$](commands/LEFT_STRING.md) | Extract substring from left | All Models |
| [LEN](commands/LEN.md) | Return length of string | All Models |
| [HEX$](commands/HEX_STRING.md) | Convert number to hexadecimal string | All Models |
| [&H](commands/AMP_H.md) | Hexadecimal number prefix | All Models |
| [DMS$](commands/DMS_STRING.md) | Convert decimal degrees to DMS string | All Models |

## Other Functions

| Function | Description | Model |
|----------|-------------|-------|
| [ERL](commands/ERL.md) | Line number where last error occurred | All Models |
| [ERR](commands/ERR.md) | Error code of last error | All Models |
| [TAB](commands/TAB.md) | Move cursor to column position in PRINT | All Models |
| [INPUT$](commands/INPUT_STRING.md) | Read specified number of characters | All Models |
| [INKEY$](commands/INKEY_STRING.md) | Read single keypress (non-blocking) | All Models |
| [EOF](commands/EOF.md) | Test for end of file | All Models |

## Logical and Arithmetic Operations

| Operator | Description | Model |
|----------|-------------|-------|
| [NOT](commands/LOGICAL.md) | Bitwise/logical NOT | All Models |
| [AND](commands/LOGICAL.md) | Bitwise/logical AND | All Models |
| [OR](commands/LOGICAL.md) | Bitwise/logical OR | All Models |
| [XOR](commands/LOGICAL.md) | Bitwise/logical exclusive OR | All Models |
| [\ (backslash)](commands/LOGICAL.md) | Integer division | All Models |
| [MOD](commands/MOD.md) | Modulo (remainder) | All Models |

---

*back to [Table of Contents](index.md)*
