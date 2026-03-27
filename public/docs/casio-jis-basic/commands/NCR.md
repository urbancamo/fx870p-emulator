*back to [Command Reference](../index.md#command-reference-alphabetical)*

## NCR

**[All Models]**

### Purpose
Returns the combination *n*C*r* for the values of *n* and *r*.

### Format
```basic
NCR         ( n value , r value )
              └──┬──┘   └──┬──┘
       Numeric expression  Numeric expression
```

### Example
```basic
X = NCR(70, 35)
```

### Parameters
- n & r: Integer in the range of 0 ≦ r ≦ n ≦ 10^10

### Explanation
1. Returns the combination: *n*C*r* = n! / r! (n - r)!
2. A fractional value as either *n* or *r* generates an error.

### See
 - [NPR](NPR.md)

### Sample Program
```basic
10  N=8 : R=4
20  X = NCR(N, R)
30  PRINT X
```
Calculates 8C4 and displays the result.
