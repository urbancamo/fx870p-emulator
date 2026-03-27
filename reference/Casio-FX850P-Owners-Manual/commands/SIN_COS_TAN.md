## SIN COS TAN

### Purpose
Returns the value of the corresponding trigonometric function value for the argument.

### Format
```basic
SIN     (argument)
         └──┬───┘ 
   Numeric expression
   
COS     (argument)
         └──┬───┘ 
   Numeric expression
   
TAN     (argument)
         └──┬───┘ 
   Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
SIN(30), COS(PI/2)
```

### Parameters
argument: Numeric expression (angle)
|argument| < 1440 (DEG)
|argument| < 8π (RAD)
|argument| < 1600 (GRAD)

### Explanation
Returns the value of the corresponding trigonometric function for the argument.
 - `SIN`: SINE
 - `COS`: COSINE
 - `TAN`: TANGENT

### See
 - [ANGLE](ANGLE.md)
 - [ASN](ASN_ACS_ATN.md)
 - [ACS](ASN_ACS_ATN.md)
 - [ATN](ASN_ACS_ATN.md)

### Sample Program
```basic
10  ANGLE 0
20  INPUT "DEGREE=", D
30  PRINT "SIN(";D;")="; SIN D
40  PRINT "COS(";D;")="; COS D
50  PRINT "TAN(";D;")="; TAN D
60  GOTO 20
```
Displays trigonometric function values for input angles.
