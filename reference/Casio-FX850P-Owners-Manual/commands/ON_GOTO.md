## ON GOTO

### Purpose
Jumps to a specified branch destination in accordance with a specified branching condition.

### Format
```basic
ON     condition       GOTO    [ branch          [, [ branch
       └───┬───┘                destination ]       destination ] ]*
   Numeric expression

                    ⎧  destination branch line number  ⎫
                    ⎪  └─────────────┬──────────────┘  ⎪
                    ⎪           Line number            ⎪
Branch destination: ⎨                                  ⎬
                    ⎪  # program area number           ⎪
                    ⎪    └────────┬────────┘           ⎪
                    ⎩    Single character; 0~9         ⎭

```
### Example
```basic
ON A GOTO 100, 200, 300
```

### Parameters
1. branch condition: Numeric expression truncated to an integer
2. line number: Integer in the range of 1 ≦ line number ≦ 65535
3. program area number: Singe character, 0~9

### Explanation
1. The [GOTO](GOTO.md) statement is executed in accordance with the value of the
expression used for the branch condition. For example, execution jumps to the first
branch destination specified when the value is 1, to the second destination when the 
value is 2, etc.
2. Program execution does not branch and execution proceeds to the next statement
when the value of the branch condition is less than 1, or if a branch destination
corresponding to that value does not exist.
3. Up to 99 branch destinations may be specified.

### Sample Program
```basic
10  INPUT "1 OR 2"; A
20  ON A GOTO 40, 50
30  END
40  PRINT "ONE" : END
50  PRINT "TWO"
```
Execution jumps to line 40 if `1` **EXE** is entered or to line 50 is `2` **EXE** is entered.

Otherwise, execution terminates at line 30.