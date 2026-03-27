## DMS$

### Purpose
Converts a decimal value to a sexagesimal string.

### Format
```basic
DMS$    ( argument )
         └───┬───┘ 
    Numeric expression
```
### Example
```basic
DMS$(1.52)
```

### Parameters
argument: Numeric expression in the range of |numeric expression| < 10¹⁰⁰

### Explanation
1. Converts decimal values to sexagesimal strings.
2. Minutes and seconds are not displayed when the argument is in the range
of numeric expression ≧  1 × 10⁶ (1E6). In this case, the absolute
value of the input value is converted to a string as it is.

### Sample Program
```basic
10  INPUT "INPUT NUMBER"; N
20  PRINT "=" ; DMS$(N)
30  END
```
Converts input decimal values to sexagesimal strings.
