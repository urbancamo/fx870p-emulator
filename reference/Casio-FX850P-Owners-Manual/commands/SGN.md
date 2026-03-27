## SGN

### Purpose
Returns a value which corresponds to the sign of the argument.

## Format
```basic
SGN         (argument)
             └──┬───┘ 
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
SGN(A)
```

### Parameters
argument: Numeric expression

### Explanation
Returns a value of -1 when the argument is negative, 0 when the argument
equals 0, and 1 when the argument is positive.

| Argument(X) | SGN(X) |
|-------------|-------:|
| X < 0       |     -1 |
| X = 0       |      0 |
| X > 0       |      1 |

### Sample Program
```basic
10  INPUT "INPUT NUMBERS"; N
20  S = SGN N
30  IF S<>0 THEN PRINT "NOT ZERO": END
40  PRINT "ZERO": END
```
Uses SGN function to determine whether or not an input value equals 0.



