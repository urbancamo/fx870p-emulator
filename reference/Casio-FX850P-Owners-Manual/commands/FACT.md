## FACT

### Purpose
Returns the factorial of argument.

## Format
```basic
FACT         ( argument )
               └──┬───┘
         Numeric expression
```

### Example
```basic
A = FACT(10)
```

### Parameters
argument: Integer in the range of 0 ≦ argument ≦ 69

### Explanation
1. Returns the factorial of the argument.
   FACT x : x!
2. A fractional value as the argument generates an error.

### Sample Program
```basic
10  X = 5
20  Y = FACT X
30  PRINT X;"!="; Y
```
Assigns factorial of the value of variable X to variable Y and displays the result.
