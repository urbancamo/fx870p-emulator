## NPR

### Purpose
Returns the permutation *n*P*r* for the values of *n* and *r*.

## Format
```basic
NPR         ( n value , r value )
              └──┬──┘   └──┬──┘ 
       Numeric expression  Numeric expression
```

### Example
```basic
X = NPR(69, 20)
```

### Parameters
 - n & r: Integer in the range of 0 ≦ r ≦ n ≦ 10¹⁰

### Explanation
1. Returns the permutation: *n*P*r* = n! / (n - r)!
2. A fractional value as either *n* or *r* generates an error.

### Sample Program
```basic
10  N=10 : P=5
20  X = NPR(N, R)
30  PRINT X
```
Calculates ₁₀P₅ and displays the result.


