## RIGHT$

### Purpose
Returns a substring of a specified length from the right of a string.

### Format
```basic
RIGHT$    ( string  , number of characters ] )
            └─┬──┘       └──────┬────────┘          
   String expression   Numeric expression  
```

### Example
```basic
RIGHT$("ABCDEF", 3)
```

### Parameters
1. string: String expression
2. number of characters: Numeric expression truncated to an integer
   in the range of 0 ≦ number of characters < 256.

### Explanation
1. Returns a substring of a specified length counting from the right of string.
2. The entire string is returned as the substring when the specified
number of characters is greater than the number of characters in the string.

### See
- [MID$](MID_STRING.md)
- [LEFT$](LEFT_STRING.md)

### Sample Program
```basic
10  A$="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
20  PRINT A$
30  INPUT "1 TO 26 HOW MANY GET"; N
40  PRINT RIGHT$(A$, N)
50 END
```
Uses numeric input to display specified number of characters from
end of alphabetic sequence.