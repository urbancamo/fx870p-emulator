## CUR

### Purpose
Returns the cube root of the argument.

## Format
```basic
CUR         (argument)
             └──┬───┘ 
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
X = CUR(Y)
```

### Parameters
argument: Numeric expression

### Explanation
Returns the cube root of the argument.
  - CUR(x) = ∛𝑥

### Sample Program
```basic
10  A=27
20  PRINT A; ", CUBE ROOT"; CUR A
30  END
```
Displays the cube roots of value assigned to variable A.
