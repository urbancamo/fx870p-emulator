*back to [Command Reference](../index.md#command-reference-alphabetical)*

## GOSUB

**[All Models]**

### Purpose
Jumps to a specified subroutine.

### Format
```basic
            { branch destination line number }
            {  └─────────────┬─────────────┘ }
            {           Line number          }
   GOSUB    {                                }
            {    # program area number       }
            {      └────────┬────────┘       }
            {      Single character; 0~9     }
```

### Example
```basic
GOSUB 100
GOSUB #6
```

### Parameters
1. branch destination line number: Integer in the range of 1 <= line number <= 65535
2. program area number: Single character, 0 ~ 9

### Explanation
1. Program execution branches to the subroutine that starts at the specified
line number. Execution is returned from the subroutine by the [RETURN](RETURN.md) statement.
2. Subroutines can be nested up to 96 levels. Exceeding this value results in an OM error.
3. A UL error is generated when the specified line number does not exist.
4. A [CLEAR](CLEAR.md) command cannot be used within a subroutine.
5. Using the `GOSUB #n` form (where n is 0-9) causes execution to branch to the
first line of the specified program area and begin executing there as a subroutine.
When a [RETURN](RETURN.md) is encountered, execution returns to the statement following
the `GOSUB #n` in the original program area. This allows subroutines to be shared
across program areas.

### See
 - [RETURN](RETURN.md)
 - [GOTO](GOTO.md)

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

Line 20 branches to subroutine beginning at line 40, and line 60 branches to subroutine beginning at line 80.
