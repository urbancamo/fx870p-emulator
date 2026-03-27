## MOD

### Purpose
Returns the remainder of integer division.

## Format
```basic
( number ) MOD ( divisor )
  └──┬─┘         └──┬──┘ 
  Numeric         Numeric
 expression      expression
```

### Example
```basic
X = -15 MOD 7 
```

### Parameters
- the values used within the MOD operator are limited to the range of 
-32768 through 32767, and the fractional part of non-integer values is
truncated.

### Explanation
the values are converted to their absolute values before division is 
performed. The sign assigned to the result of the MOD operation is the
sign of the dividend.

### Sample Program
```basic
10  INPUT "NUMBER"; N
20  INPUT "DIVISOR"; D
30  R=N MOD D
40  PRINT "RESULT="; R
50  END
```
Shows the remainder of a division between two number.



