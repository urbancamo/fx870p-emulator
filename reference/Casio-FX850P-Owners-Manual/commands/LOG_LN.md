## LOG LN

### Purpose
Returns the value of the corresponding logarithm function for the argument.

### Format
```basic
LOG     (argument)
         └──┬───┘ 
   Numeric expression

LN      (argument)
         └──┬───┘ 
   Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
LOG(2), LN(3)
```

### Parameters
argument: Numeric expression
 - LOG: 0 < argument
 - LN: 0 < argument

### Explanation
Returns the value of the corresponding logarithm function value for the argument.
 - LOG: Common logarithm log₁₀𝑥, log𝑥
 - LN: Natural logarithm logₑ𝑥, ln𝑥

### Sample Program
```basic
10  INPUT "INPUT NUMBER"; N
20  PRINT "LOG";N;"=";LOG N
30  PRINT "LN";N;"=";LN N
40  END
```
Displays logarithm function values for numeric input greater than 0.
