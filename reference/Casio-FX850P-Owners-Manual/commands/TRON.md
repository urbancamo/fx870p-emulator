## TRON

### Purpose
Specifies the trace mode.

### Example
```basic
TRON
```

### Explanation
1. Switches the trace mode ON and TR appears on the display.
2. All subsequent program execution is accompanied by a display of the area name
and line number. The first two lines are displayed, and execution is suspended.
Program execution can be resumed at this time by pressing **EXE**.
3. The program stays in the TRON mode until the TROFF statement is executed or
the power is switched OFF.

### See
 - [TROFF](TROFF.md)

### Sample Execution
```basic
TRON
RUN
```

```
┌────────────────────────────────┐
│RUN                             │
│P0-1                            │
└────────────────────────────────┘
```

P0 represents currently specified program area and 10 currently executed line number.
