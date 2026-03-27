## STR$

### Purpose
Converts the argument (numeric value or numeric expression value)
to a string.

### Format
```basic
STR$   ( argument )
         └──┬───┘
     numeric value
     numeric expression
``` 

### Example
```basic
STR$(123) STR$(255+3)
```

### Explanation
1. Converts decimal values specified in the argument to strings.
2. Converted positive values include a leading space and converted
negative values are preceded by a minus sign.

### See
 - [VAL](VAL.md)

### Sample Program
```basic
10  INPUT "INPUT NUMBERS"; N
20  S$=STR(N)
30  C$=MID$(S$, 2, 1)
40  PRINT "FIRST CHARACTER="; C$
50  END
```
Converts numeric input to a string. Next, the first number of converted
string is displayed as a character.
