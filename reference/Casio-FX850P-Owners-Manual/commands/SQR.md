## SQR

### Purpose
Returns the square root of the argument.

## Format
```basic
SQR         (argument)
             └──┬───┘ 
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
SQR(4)
```

### Parameters
argument: Numeric expression in the range of 0 ≦ argument

### Explanation
Returns the square root of the argument.
 - SQR(x) = √𝑥

### Sample Program
```basic
10  FOR I=0 TO 10
20  PRINT "SQR"; I; SQR I
30  NEXT I
40  END
```
Displays the square roots of values from 0 through 10.
