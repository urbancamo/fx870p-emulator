## FRAC

### Purpose
Returns the fractional part of the argument.

## Format
```basic
FIX         (argument)
             └──┬───┘ 
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
FRAC(3.14)
```

### Parameters
argument: Numeric expression

### Explanation
1. Returns the fractional part of the argument.
2. The sign (±) of the value is the same as that for the argument.

### Sample Program
```basic
10  FOR I=1 TO 10
20  N = RAN# * 10
30  LPRINT "FRAC(";N;")=";FRAC N
40  NEXT I
50  END
```
Isolates fractional parts of random values and outputs results to the printer.
