## &H

### Purpose
Converts the 1 through 4-digit hexadecimal value following &H to a decimal value.

### Format
```basic
&H       argument 
         └──┬───┘
   Hexadecimal value
```

### Example
```basic
A = &HAF
```

### Parameters
0ʰ ≦ argument ≦ FFFFʰ

### Explanation
1. The hexadecimal value is expressed using values 0 through 9, plus 
characters A through F.
2. In the manual mode, &H is entered followed by the hexadecimal value.
   Pressing **EXE** produces the decimal equivalent.
   Example: &H1B7F **EXE** → 7039
3. The following shows a typical application within a program. Since
a numeric variable cannot be used following &H, the hexadecimal value
is appended to &H as a string and then converted to a decimal value
using the [VAL](VAL.md) function.

### See
 - [HEX$](HEX_STRING.md)

### Sample Program
```basic
10  REM &H SAMPLE
20  INPUT "&H"; A$
30  H = VAL("&H" + A$)
40  PRINT "&H"; A$; "="; H
50  GOTO 10
```
Converts an entered hexadecimal value (4 digits max) to a decimal value.
Program execution is terminated using the **BRK** key.
