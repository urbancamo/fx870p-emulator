## ON ERROR GOTO

### Purpose
Specifies the line number to which execution branches when an error is generated.

### Format
```basic
ON ERROR GOTO branch destination line number
              └─────────────┬──────────────┘
                        Line number 
```

### Example
```basic
ON ERROR GOTO 1000
```

### Parameters
branch destination line number: Integer in the range of 0 ≦ line number ≦ 65535

### Explanation
1. Specifies the line number to which program execution branches when an error
is generated. The program returns to normal operations when a [RESUME](RESUME.md)
statement is executed after the error handling routine (starting at the specified
line number) is executed.
2. An error is generated and program execution is halted when the branch destination
line number is 0.
3. An `ON ERROR GOTO` statement must be followed by a corresponding [RESUME](RESUME.md)
statement in the same program area. Branching to another program area using 
`ON ERROR GOTO` generates an error when the [RESUME](RESUME.md) statement in the 
other program area is executed.

* The operations outlined are limited to BASIC program execution.

### Sample Program
```basic
10  ON ERROR GOTO 40
20  **ERROR**
30  END
40  PRINT "OOPS! ERROR!!!": BEEP 1
50  RESUME 30
```

Execution of line 40, followed by line 30 if error generated. The program
shown here is only an error subroutine and does nothing by itself.