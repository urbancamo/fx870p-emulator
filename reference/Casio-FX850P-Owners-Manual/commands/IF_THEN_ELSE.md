## IF ~ THEN ~ ELSE/IF ~ GOTO ~ ELSE

### Purpose 
Executes the `THEN` statement or [GOTO](GOTO.md) statement when the specified
condition is met. The `ELSE` statement is executed when the specified condition is not met.

### Format
```basic
                       ⎧ THEN       statement      ⎫ ⎧      ⎧  statement         ⎫
IF    condition        ⎪          [ : statement]   ⎪ ⎪ ELSE ⎪    [: statement ]  ⎪
      └───┬───┘        ⎨                           ⎪ ⎨      ⎨                    ⎬
      Numeric          ⎪ GOTO   branch destination ⎪ ⎪      ⎪ branch destination ⎪
      expression       ⎩                           ⎭ ⎩      ⎩                    ⎭

                    ⎧  destination branch line number  ⎫
                    ⎪  -----------------------------   ⎪
                    ⎪           Line number            ⎪
Branch destination: ⎨                                  ⎬
                    ⎪  # program area number           ⎪
                    ⎪    ---------------------         ⎪
                    ⎩    Single character; 0~9         ⎭
```

### Example
```basic
IF A=0 THEN 300 ELSE 400
IF K$="Y" THEN PRINT X ELSE PRINT Y
```

### Parameters 
1. branch condition: Numeric expression truncated to an integer
2. line number: Integer in the range of 1 ≦ line number ≦ 65535
3. program area number: Single character, 0 ~ 9

### Explanation
1. The statement following the `THEN` clause is executed, or execution jumps
to the destination specified by the [GOTO](GOTO.md) statement when the branch condition is met.
2. If the branch condition is not met, the statement following the `ELSE` statement is executed,
or the program jumps to the specifie branch destination. Execution proceeds to the 
next program line when the `ELSE` statement is omitted.
3. The format `IF A THEN ~` results in the condition being et when value of the expression (A) is not 0 (absolute value of A < 1 × 10⁻⁹⁹). The condition is not met when the value of the expression is 0.
4. `IF` statements can be nested (an `IF` statement may contain other `IF` statements).
In this case, the `THEN ~ ELSE` statements are related by their proximity.
The `GOTO ~ ELSE` combinations have the same relationships.

```basic
IF ~ THEN IF THEN ~ ELSE IF ~ THEN ~ ELSE ~ ELSE ~
│      │   └───┴──────┘  └──────┴─────┘       │
└──────┴──────────────────────────────────────┘
```

### Sample Program
```basic
10  INPUT "1 TO 9"; A
20  IF (0<A) AND (A<10) THEN PRINT "GOOD!" ELSE 10
```
"GOOD" is displayed for input values 1 to 9. Re-input is requested for other values.
