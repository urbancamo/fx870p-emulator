## GOSUB

### Purpose
Jumps to a specified subroutine.

### Format
```basic
            ⎧ branch destination line number ⎫
            ⎪  └─────────────┬─────────────┘ ⎪
            ⎪           Line number          ⎪
   GOSUB    ⎨                                ⎪
            ⎪    # program area number       ⎪
            ⎪      └────────┬────────┘       ⎪
            ⎩      Single character; 0~9     ⎭
```

### Example
```basic
GOSUB 100
GOSUB #6
```

### Parameters
1. branch destination line number: Integer in the range of 1 ≦ line number ≦ 65535
2. program area number: Single character, 0 ~ 9

### Explanation
1. Program execution branches to the subroutine that starts at the specified 
line number. Execution is returned from the subroutine by the [RETURN](RETURN.md) statement.
2. Subroutines can be nested up to 96 levels. Exceeding this value results in an [OM](../part-12-2-error-messages.md#om-error) error.
3. A [UL](../part-12-2-error-messages.md#ul-error) error is generated when the specified line number does not exist.
4. A [CLEAR](CLEAR.md) command cannot be used within a subroutine.

### See
 - [RETURN](RETURN.md)

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
