## NCR

### Purpose
Returns the permutation *n*C*r* for the values of *n* and *r*.

## Format
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
- n & r: Integer in the range of 0 ≦ r ≦ n ≦ 10¹⁰

### Explanation
1. Returns the combination: *n*C*r* = n! / r! (n - r)!
2. A fractional value as either *n* or *r* generates an error.

### Sample Program
```basic
10  N=8 : R=4
20  X = NCR(N, R)
30  PRINT X
```
Calculates ₈C₄ and displays the result.



