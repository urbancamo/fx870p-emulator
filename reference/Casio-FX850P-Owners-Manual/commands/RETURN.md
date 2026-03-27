## RETURN

### Purpose
Returns execution from a subroutine to the main program.

### Format
```basic
RETURN
```
## Example
```basic
RETURN
```
### Explanation
1. Returns program execution to the statement immediately following the statement which originally called a subroutine.
2. A [GS](../part-12-2-error-messages.md#gs-error) error is generated when the `RETURN` statement is executed without first executing a [GOSUB](GOSUB.md) statement.

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
`RETURN` in line 120 returns to line 20, while line 210 returns to line 110.
