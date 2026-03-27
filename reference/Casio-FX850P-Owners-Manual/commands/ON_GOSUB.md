## ON GOSUB

### Purpose
Jumps to a specified subroutine in accordance with a specified branching condition.

### Format
```basic
ON     condition       GOSUB   [ branch          [, [ branch
       └───┬───┘                destination ]       destination ] ]*
   Numeric expression

```basic
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
ON A GOSUB 1000, 1100, 1200
```

### Parameters
1. branch condition: Numeric expression truncated to an integer
2. line number: Integer in the range of 1 ≦ line number ≦ 65535
3. program area number: Singe character, 0~9

### Explanation
1. The [GOSUB](GOSUB.md) statement is executed in accordance with the value of the
   expression used for the branch condition. For example, execution jumps to the first
   branch destination specified when the value is 1, to the second destination when the
   value is 2, etc.
2. Program execution does not branch and execution proceeds to the next statement
   when the value of the branch condition is less than 1, or if a branch destination
   corresponding to that value does not exist.
3. Up to 99 branch destinations may be specified.

### Sample Program
```basic
10  S1=0: S2=0
20  FOR I=1 TO 100
30  ON (I MOD 2)+1 GOSUB 1000, 1100
40  NEXT I
50  PRINT "S1="; S1
60  PRINT "S2="; S2
70  END
1000 S1=S1+I: RETURN
1100 S2=S2+I: RETURN
```
S1 calculates sum of even numbers from 1 to 100, S2 calculates sum of odd numbers from 1 to 100.
