## CHR$

### Purpose
Returns a single character which corresponds to the specified character code.

### Format
```basic
CHR$       (code)
            └─┬┘
      Numeric expression
```

### Example
```basic
CHR$(65)
```

### Parameters
code: Numeric expression truncated to an integer in the range of
0 ≦ code < 256

### Explanation
Variables can also be used as a parameter, and decimal parts of numeric
values are truncated. A `null` is returned when a character does not 
exist for the specified character code.

### See
 - [ASC](ASC.md)

### Sample Program
```basic
10  FOR I=65 TO 90
20  PRINT CHR$(I)
30  NEXT I
```
Displays characters from 65 through 90 in character code.
