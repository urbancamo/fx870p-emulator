## STOP

### Purpose
Temporarily halts program execution.

### Example
```basic
STOP
```

### Explanation
1. Temporarily halts program execution and **STOP** appears on the display.
Execution can be resumed by pressing **EXE**.
2. Pressing **SHIFT** **STOP** while execution is halted by the `STOP` command
displays the current program area and line number.
3. Such commands as [PRINT](PRINT.md) can be executed while execution is halted
by the `STOP` command. Manual calculations can also be performed in the CAL mode.
4. Open files, variable values and array values are retained as they are at the point when execution is halted
5. The **STOP** status is cancelled when an error is generated, the mode is changed,
or the program is edited while program execution is halted.

### Sample Program
```basic
10  FOR I=1 TO 10
20  IF I=6 THEN STOP : PRINT
30  PRINT I;
40  NEXT I
```
Displays values for `I` in `FOR ~ NEXT` loop.

Execution is halted wjen `I` equals `6`. Next, pressing **EXE** resumes execution.
