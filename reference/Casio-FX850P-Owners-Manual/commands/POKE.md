## POKE

### Purpose
Writes data to a specified address.

### Format
```basic
POKE      (address)        ,     data
           └──┬──┘               └┬─┘
       Numeric expression    Numeric expression
```

### Example
```basic
POKE &H7000, 0
```

### Parameters
1. address: Numeric expression truncated to an integer in the range of -32769 < address < 65536.
Negative addresses are added to 65536 and data are written to the resulting address
(i.e. `POKE(-1)` is identical to `POKE(65535),data`).
2. data: Numeric expression truncated to an integer in the range of 0 ≦ data ≦ 256.
### Explanation
1. Writes data to the specified address in memory.
2. Runaway execution may result if the contents of an address outside the user work area is altered using the `POKE` statement.
3. The actual address is specified using the [DEFSEG](DEFSEG.md) statement.
   ```basic
   DEFSEG = 2
   A = POKE &H100, 0
   ```
   The above does not directly read writet data to address &H100 (256).
   Instead, 0 is written to the address &H120 (288). (16 x 2 + 256 = 288).
   Further information of segments can be found under [DEFSEG](DEFSEG.md).

### See
- [PEEK](PEEK.md)
- [DEFSEG](DEFSEG.md)

### Sample Program
```basic
10  DEFSEG=&H0
20  FOR I=&7000 TO &H7010
30  POKE I, 0
40  NEXT I
50  END 
```
Clears (assigns zeros) memory from 7000ʰ to 7010ʰ.

