## PEEK

### Purpose
Returns the value stored at the specified memory address.

### Format
```basic
PEEK      (address)
           └──┬──┘
       Numeric expression
```

### Example
```basic
PEEK (&H100)
```

### Parameters
address: Numeric expression truncated to an integer in the range of -32769 < address < 65536.
Negative addresses are added to 65536 and the contents of the resulting address are returned
(i.e. `PEEK(-1)` is identical to `PEEK(65535)`).

### Explanation
1. Returns the value stored in memory at the specified address.
2. The actual address is specified using the [DEFSEG](DEFSEG.md) statement.
   ```basic
   DEFSEG = 2
   A = PEEK(&H100)
   ```
   The above does not directly read the contents of address &H100 (256). 
   Instead, the contents of &H120 (288) are read (16 x 2 + 256 = 288).
   Further information of segments can be found under [DEFSEG](DEFSEG.md).

### See
 - [POKE](POKE.md)
 - [DEFSEG](DEFSEG.md)

### Sample Program
```basic
 5  DEFSEG=&H0
10  FOR I=&H0C00 TO &H0D00
20  PRINT HEX$( PEEK(I) ); " "
30  NEXT I
```
Prints memory contents from &H0C00 to &H0D00 in hexadecimal.
