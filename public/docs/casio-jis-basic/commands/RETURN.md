*back to [Command Reference](../index.md#command-reference-alphabetical)*

## RETURN

**[All Models]**

### Purpose
Returns execution from a subroutine to the main program.

### Format
```basic
RETURN
```

### Example
```basic
RETURN
```

### Explanation
1. Returns program execution to the statement immediately following the statement which originally called a subroutine.
2. A GS error is generated when the `RETURN` statement is executed without first executing a [GOSUB](GOSUB.md) statement.

**Note:** When a subroutine is called across program areas using `GOSUB #n`, the corresponding `RETURN` returns execution to the statement following the `GOSUB #n` in the original program area. The `RETURN #n` syntax is not used; cross-program-area returns are handled automatically by the return stack.

### See
 - [GOSUB](GOSUB.md)
 - [ON ~ GOSUB](ON_GOSUB.md)

### Sample Program
```basic
10  REM ***MAIN***
20  GOSUB 40
30  END
40  REM ***SUBROUTINE 1***
50  PRINT "SUBROUTINE 1";
60  GOSUB 80
70  RETURN
80  REM ***SUBROUTINE 2***
90  PRINT "SUBROUTINE 2"
100 RETURN
```

`RETURN` in line 70 returns to line 30, while line 100 returns to line 70.
