## GOTO

### Purpose
Branches unconditionally to a specified branch destination.

### Format
```basic
            ⎧ branch destination line number ⎫
            ⎪  └─────────────┬─────────────┘ ⎪
            ⎪           Line number          ⎪
   GOTO     ⎨                                ⎬
            ⎪    # program area number       ⎪
            ⎪      └────────┬────────┘       ⎪
            ⎩      Single character; 0~9     ⎭
```

### Sample
```basic
GOTO   1000
GOTO   #7
```

### Parameters
1. branch destination line number: Integer in the range of 1 ≦ line number ≦ 65535
2. program area number: Single character, 0 ~ 9

### Explanation
1. Specifying a line number causes program execution to jump to that line number in the current program area.
2. Specifying a program area number causes program execution to jump to the first line number of the specified program area.
3. A [UL](../part-12-2-error-messages.md#ul-error) error is generated when the specified line number does not exist.

### Sample Program
```basic
10  PRINT "PRESS [BRK]";
20  PRINT "TO HALT EXECIUTION" ;
30  GOTO 10
```

Line 30 returns execution to line 10.

This loop continues until **BRK** is pressed.
