## MID$

### Purpose
Returns a substring of a specified length from a specified position
within a string.

### Format
```basic
MID$    ( string     , position       [ , number of characters ] )
          └─┬──┘       └──┬───┘           └─────────┬────────┘
   String expression  Numeric expression     Numeric expression
```

### Example
```basic
MID$(A$, 5, 3)
```

### Parameters
1. string: String expression
2. position: Numeric expression truncated to an integer in the range
of 1 ≦ position < 256.
3. number of characters: Numeric expression truncated to an integer
in the range of 0 ≦ number of characters < 256. The default option is
from the specified position to the end of the string when this 
parameter is omitted.

### Explanation
1. Returns a substring of a specified length from a specified position
within a string. A substring from the specified position to the end of
the string is returned when the length of the substring is not specified.
2. A substring of length 0 (null) is returned when the specified position
exceeds the length of the string.
3. A substring from the specified position to the end of the string is 
returned when the specified number of characters is greater than the 
number of characters from the specified position to the end of the string.

### See
 - [RIGHT$](RIGHT_STRING.md)
 - [LEFT$](LEFT_STRING.md)

### Sample Program
```basic
10  A$="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
20  INPUT "1 TO 26 FROM"; B
30  PRINT "1 TO "; 27-B; " TO ";
40  INPUT E
50  S$ = MID$(A$, B, E)
60  PRINT S$
70  END
```
Uses numeric input to produce alphabetic series of a specified number
of characters starting from a specified position.
