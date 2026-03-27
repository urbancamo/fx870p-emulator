## ASC

### Purpose
Returns the character code corresponding to the character in the 
first (leftmost) position of a string.

### Format
```basic
ASC     ( string )
          └─┬──┘
     String expression
```

### Example
```basic
ASC("A")
```

### Parameters
string: String expression

### Explanation
1. Returns the character code corresponding to a character. The character
   code for the first (leftmost) character only is returned for a string
   of two or more characters.
2. A value of 0 is returned for a null string.

### See
 - [CHR$](CHR_STRING.md)

### Sample Program
```basic
10  INPUT "INPUT CHARACTERS"; A$
20  B$ = LEFT$(A$, 1)
30  C = ASC(A$)
40  PRINT "FIRST CHAR="; B$; " CODE="; C
50 END
```
Displays first character and corresponding character code for string input.
