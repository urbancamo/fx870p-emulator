## ABS

### Purpose
Returns the absolute value of the argument.

## Format
```basic
ABS         (argument)
             └──┬───┘ 
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
ABS(-1.5)
```

### Parameters
argument: Numeric expression

### Explanation
Returns the absolute value of the argument.
  - ABS(x) = |𝑥|

### Sample Program
```basic
10  INPUT "INPUT NUMBERS"; N
20  A=ABS N
30  PRINT N; "ABS()="; A
40  END
```
Displays the absolute value of an input value.

