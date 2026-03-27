# Casio JIS Standard BASIC Reference Manual

A comprehensive reference for the Casio JIS Standard BASIC programming language as implemented across the Casio pocket computer family, including the FX-850P, FX-880P, FX-870P, VX-4, and related models.

This manual merges documentation from multiple sources into a single unified reference, noting where features are specific to particular models.

## Table of Contents

1. [Introduction to Casio JIS BASIC](01-introduction.md)
2. [Supported Computer Models](02-supported-models.md)
3. [How to Enter BASIC Mode](03-entering-basic-mode.md)
4. [Grammar Overview](04-grammar-overview.md)
5. [BASIC Programming Guide](05-basic-programming-guide.md)
6. [Command/Function Quick Reference Table](06-command-function-table.md)
7. [Error Messages](07-error-messages.md)
8. [Character Code Table](08-character-code-table.md)
9. [Reserved Word List](09-reserved-word-list.md)

## Model Compatibility Badges

Throughout this manual, model compatibility is indicated with the following badges:

- **[All Models]** — Available on all Casio JIS BASIC computers
- **[FX-850P/880P]** — FX-850P and FX-880P only
- **[FX-870P/VX-4]** — FX-870P, VX-4, and later models
- **[FX-890P/Z-1]** — FX-890P, Z-1, and Z-1GR only
- **[Undocumented]** — Not in any official Casio manual

## Command Reference (Alphabetical)

### A
- [ABS](commands/ABS.md)
- [ACS](commands/ASN_ACS_ATN.md)
- [AMP_H (&H)](commands/AMP_H.md)
- [ANGLE](commands/ANGLE.md)
- [ASC](commands/ASC.md)
- [ASN](commands/ASN_ACS_ATN.md)
- [ATN](commands/ASN_ACS_ATN.md)

### B
- [BEEP](commands/BEEP.md)

### C
- [CALC$](commands/CALC_STRING.md) **[Undocumented]**
- [CALCJMP](commands/CALCJMP.md) **[Undocumented]**
- [CHAIN](commands/CHAIN.md) **[FX-870P/VX-4]**
- [CHR$](commands/CHR_STRING.md)
- [CLEAR](commands/CLEAR.md)
- [CLOSE](commands/CLOSE.md)
- [CLS](commands/CLS.md)
- [CNT](commands/CNT.md) **[FX-870P/VX-4]**
- [CONT](commands/CONT.md)
- [COR](commands/COR.md) **[FX-870P/VX-4]**
- [COS](commands/SIN_COS_TAN.md)
- [CUR](commands/CUR.md)

### D
- [DATA](commands/DATA.md)
- [DEFCHR$](commands/DEFCHR_STRING.md)
- [DEFM](commands/DEFM.md)
- [DEFSEG](commands/DEFSEG.md)
- [DEG](commands/DEG.md)
- [DELETE](commands/DELETE.md)
- [DIM](commands/DIM.md)
- [DMS$](commands/DMS_STRING.md)
- [DSKF](commands/DSKF.md) **[FX-870P/VX-4]**

### E
- [EDIT](commands/EDIT.md)
- [END](commands/END.md)
- [EOF](commands/EOF.md)
- [EOX, EOY](commands/EOX_EOY.md) **[FX-870P/VX-4]**
- [ERASE](commands/ERASE.md)
- [ERL](commands/ERL.md)
- [ERR](commands/ERR.md)
- [EXP](commands/EXP.md)

### F
- [FACT](commands/FACT.md)
- [FILES](commands/FILES.md) **[FX-870P/VX-4]**
- [FIX](commands/FIX.md)
- [FOR~NEXT~STEP](commands/FOR_NEXT_STEP.md)
- [FORMAT](commands/FORMAT.md) **[FX-870P/VX-4]**
- [FRAC](commands/FRAC.md)
- [FRE](commands/FRE.md)

### G
- [GOSUB](commands/GOSUB.md)
- [GOTO](commands/GOTO.md)

### H
- [HEX$](commands/HEX_STRING.md)
- [HYP SIN, HYP COS, HYP TAN](commands/HYP_SIN_COS_TAN.md)
- [HYP ASN, HYP ACS, HYP ATN](commands/HYP_ASN_ACS_ATN.md)

### I
- [IF~THEN~ELSE](commands/IF_THEN_ELSE.md)
- [INKEY$](commands/INKEY_STRING.md)
- [INPUT](commands/INPUT.md)
- [INPUT@](commands/INPUT_AT.md) **[Undocumented]**
- [INPUT#](commands/INPUT_HASH.md)
- [INPUT$](commands/INPUT_STRING.md)
- [INT](commands/INT.md)

### K
- [KILL](commands/KILL.md) **[FX-870P/VX-4]**

### L
- [LEFT$](commands/LEFT_STRING.md)
- [LEN](commands/LEN.md)
- [LET](commands/LET.md)
- [LINE INPUT#](commands/LINE_INPUT_HASH.md) **[FX-870P/VX-4]**
- [LIST](commands/LIST.md)
- [LIST#](commands/LIST_HASH.md)
- [LLIST](commands/LLIST.md)
- [LLIST#](commands/LLIST_HASH.md)
- [LN](commands/LOG_LN.md)
- [LOAD](commands/LOAD_LOAD_ALL.md)
- [LOAD#](commands/LOAD_HASH.md)
- [LOCATE](commands/LOCATE.md)
- [LOG](commands/LOG_LN.md)
- [LOGICAL operators](commands/LOGICAL.md)
- [LPRINT](commands/LPRINT.md)
- [LRA, LRB](commands/LRA_LRB.md) **[FX-870P/VX-4]**

### M
- [MEANX, MEANY](commands/MEANX_MEANY.md) **[FX-870P/VX-4]**
- [MERGE](commands/MERGE.md) **[FX-870P/VX-4]**
- [MID$](commands/MID_STRING.md)
- [MOD](commands/MOD.md)
- [MODE](commands/MODE.md)

### N
- [NAME](commands/NAME.md) **[FX-870P/VX-4]**
- [NCR](commands/NCR.md)
- [NEW](commands/NEW.md)
- [NEW#](commands/NEW_HASH.md)
- [NPR](commands/NPR.md)

### O
- [ON ERROR GOTO](commands/ON_ERROR_GOTO.md)
- [ON GOSUB](commands/ON_GOSUB.md)
- [ON GOTO](commands/ON_GOTO.md)
- [OPEN](commands/OPEN.md)

### P
- [PASS](commands/PASS.md)
- [PBLOAD, PBGET](commands/PBLOAD_PBGET.md) **[FX-850P/880P]**
- [PEEK](commands/PEEK.md)
- [PI](commands/PI.md)
- [POKE](commands/POKE.md)
- [POL](commands/POL.md)
- [PRINT](commands/PRINT.md)
- [PRINT#](commands/PRINT_HASH.md)
- [PRINT USING](commands/PRINT_USING.md) **[FX-870P/VX-4]**

### R
- [RAN#](commands/RAN_HASH.md)
- [READ](commands/READ.md)
- [READ#](commands/READ_HASH.md)
- [REC](commands/REC.md)
- [REM](commands/REM.md)
- [RENUM](commands/RENUM.md)
- [RESTORE](commands/RESTORE.md)
- [RESTORE#](commands/RESTORE_HASH.md)
- [RESUME](commands/RESUME.md)
- [RETURN](commands/RETURN.md)
- [RIGHT$](commands/RIGHT_STRING.md)
- [ROUND](commands/ROUND.md)
- [RUN](commands/RUN.md)

### S
- [SAVE](commands/SAVE_SAVE_ALL.md)
- [SAVE#](commands/SAVE_HASH.md)
- [SDX, SDY, SDXN, SDYN](commands/SDX_SDY.md) **[FX-870P/VX-4]**
- [SET](commands/SET.md)
- [SGN](commands/SGN.md)
- [SIN, COS, TAN](commands/SIN_COS_TAN.md)
- [SQR](commands/SQR.md)
- [STAT](commands/STAT.md) **[FX-870P/VX-4]**
- [STAT CLEAR](commands/STAT_CLEAR.md) **[FX-870P/VX-4]**
- [STOP](commands/STOP.md)
- [STR$](commands/STR_STRING.md)
- [SUMX, SUMY, SUMX2, SUMY2, SUMXY](commands/SUMX_SUMY.md) **[FX-870P/VX-4]**
- [SYSTEM](commands/SYSTEM.md)

### T
- [TAB](commands/TAB.md)
- [TAN](commands/SIN_COS_TAN.md)
- [TROFF](commands/TROFF.md)
- [TRON](commands/TRON.md)

### V
- [VAL](commands/VAL.md)
- [VALF](commands/VALF.md)
- [VARLIST](commands/VARLIST.md)
- [VERIFY](commands/VERIFY.md) **[FX-850P/880P]**

### W
- [WRITE#](commands/WRITE_HASH.md)

---

*This manual is derived from the Casio FX-850P Owner's Manual (Wickens), the Casio FX-870P/VX-4 Manual (Rost), and community-documented undocumented commands.*
