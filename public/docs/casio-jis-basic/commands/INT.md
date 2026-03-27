*back to [Command Reference](../index.md#command-reference-alphabetical)*

## INT

**[All Models]**

### Purpose
Returns the largest integer which does not exceed the value of the argument.

### Format
```basic
INT         (argument)
             └──┬───┘
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
INT(1.3)
```

### Parameters
argument: Numeric expression

### Explanation
1. Returns the largest integer which does not exceed the value of the argument.
2. INT(x) is equivalent to FIX(x) when x is positive, and FIX(x)-1 when x is negative.

### See
 - [FIX](FIX.md)
 - [FRAC](FRAC.md)

### Sample Program
```basic
10  FOR I=1 TO 10
20  N = RAN# * 10
30  LPRINT "INT(";N;")=";INT N
40  NEXT I
50  END
```
Converts random values to integers and outputs results to printer.
