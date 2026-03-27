## EXP

### Purpose 
Returns the value of the exponential function for the argument.

### Format
```basic
EXP      (argument) 
          └──┬───┘ 
   Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the
argument is a numeric value or variable.

### Example
```basic
EXP(1)
```

### Parameters
argument: Numeric expression in the range of the argument ≦ 230.2585092

### Explanation
Returns the value of the exponential function value for the argument.

```basic
EXP(x) = 𝑒ˣ
```

### See
 - [LOG](LOG_LN.md)
 - [LN](LOG_LN.md)

### Sample Program
```basic
10  INPUT "e^X (UP TO 230)"; N
20  PRINT "e^X";N;"="; EXP N
30  END
```

Displays exponential function value for numeric input up to 230.
