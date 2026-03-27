## VALF

### Purpose
Performs calculation of numeric expression as string, and returns 
the result.

### Format
```basic
VALF    ( string )
         └─┬──┘ 
   String expression
```

### Example
```basic
VVALF(X$)
```

### Parameters
string: String expression

### Explanation
1. Performs calculation of numeric expressions which are expressed
as strings, and returns their results.
2. An error is generated when an intermediate or final result of 
calculation exceeds 10^100.
3. `VALF` cannot be used within a `VALF` argument.

### Sample Program
```basic
10  X$ = "123+456"
20  PRINT VALF(X$)
30  PRINT VALF("EXP 2")

RUN
579
7.389056099
```
Executes the strings "123+456" and "EXP 2" as numeric expression and 
displays results.