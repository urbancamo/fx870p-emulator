## ROUND

### Purpose
Rounds the argument at the specified digit.

## Format
```basic
ROUND         ( argument , digit )
                └──┬───┘   └─┬─┘ 
       Numeric expression  Numeric expression
```

### Example
```basic
ROUND(A, -3)
```

### Parameters
1. argument: Numeric expression
2. digit: Numeric expression truncated to an integer in the range
   of -100 < digit < 100

### Explanation
Rounds the argument (to the nearest whole number) at the specified digit.

### Sample Program
```basic
10  N=RAN# * 1000
20  PRINT N
30  INPUT "WHERE"; R
40  PRINT ROUND(N,R)
50  END
```
Displays random value and then rounds value at digit specified by 
numeric input.

For example, responding to prompt "WHERE" with input of -2 when
N = 610.5765383 produces result of 610.6.
