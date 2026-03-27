## LEN

### Purpose
Returns a value which represents the number of characters contained in a string.

### Format
```basic
LEN      ( string ) 
           └─┬──┘ 
     String expression

```

### Example
```basic
LEN(A$)
```

### Parameters
string: String expression

### Explanation
Returns a value which represents the number of characters contained in
a string, including characters that don't appear on the display
(character codes from 00ʰ ~ 1Fʰ) and spaces.

### Sample Program
```basic
10  INPUT "INPUT CHARACTERS"; C$
20  PRINT "LENGTH="; LEN(C$)
30  END
```
Determines the length of an input string.