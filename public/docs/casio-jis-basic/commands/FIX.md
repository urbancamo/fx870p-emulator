*back to [Command Reference](../index.md#command-reference-alphabetical)*

## FIX

**[All Models]**

### Purpose
Returns the integer part of the argument.

### Format
```basic
FIX         (argument)
             └──┬───┘
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value or variable.

### Example
```basic
FIX(-1.5)
```

### Parameters
argument: Numeric expression

### Explanation
Returns the integer part of the argument.

### See
- [INT](INT.md)

### Sample Program
```basic
10  INPUT A
20  PRINT "FIX(";A;")=";FIX A
30  GOTO 10
```
Displays the integer part of input values.
