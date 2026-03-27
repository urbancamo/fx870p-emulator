## DEFSET

### Purpose
Specifies segment base address.

### Format
```basic
DEFSEG    segment address
          └──────┬──────┘
         Numeric expression
```

### Example
```basic
DEFSEG = 16
```

### Parameters
segment address: integer within the range of -32768  segment < 65536

### Explanation
1. Specifies the segment base address for use with the [PEEK](PEEK.md) and 
[POKE](POKE.md) commands. The relationship between the address (offset address)
and the segment address within the [PEEK](PEEK.md) and [POKE](POKE.md) format is as follows:
   actual address = segment address * 16 + offset address
2. The initial specification for `DEFSEG` is 0 whenever power is switched ON,
3. or the **P** button or **ALL RESET** button is pressed.

### See
 - [PEEK](PEEK.md)
 - [POKE](POKE.md)

### Sample Program
```basic
10  DEFSEG = &H1000
20  A = PEEK(&H00F0)
```
In this case, the value assigned to A is that contained in address 100F0ʰ.

