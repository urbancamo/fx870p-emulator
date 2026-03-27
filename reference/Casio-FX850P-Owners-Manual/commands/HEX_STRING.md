## HEX$

### Purpose
Returns a hexadecimal string for a decimal value specified in the argument.

### Format
```basic
HEX$    ( argument )
         └───┬───┘
     numeric argument
```

### Example
```basic
HEX$(15)
```

### Parameters
argument: Numeric expression truncated to an integer in the range of
-32769 < argument < 65536. Values more than 32767 are converted by 
subtracting 65536.

### Explanation
Returns a 4-digit hexadecimal string for a decimal value specified
in the argument.

### See
 - [&H](AMP_H.md)

### Sample Program
```basic
10  PRINT "DECIMAL" ; TAB(10); "HEX"
20  FOR I=0 TO 16
30  PRINT I;
40  PRINT TAB(10); HEX$(I); : PRINT
50  FOR J=0 TO 250; NEXT J
60  NEXT I
70  END
```
Displays the decimal values from 0 to 16 along with their 
hexadecimal equivalents.
