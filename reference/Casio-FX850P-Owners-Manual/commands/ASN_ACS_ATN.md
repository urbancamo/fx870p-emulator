## ASN ACS ATN

### Purpose
Returns the value of the corresponding inverse trigonometric function value for the argument.

### Format
```basic
ASN     (argument)
         └──┬───┘ 
   Numeric expression
   
ACS     (argument)
         └──┬───┘ 
   Numeric expression
   
ATN     (argument)
         └──┬───┘ 
   Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
ASN(0,1)
```

### Parameters
argument: Numeric expression in the range if -1 ≦ argument ≦ 1 (ASN, ACS)

### Explanation
1. Returns the value of the corresponding trigonometric function for the argument.
   - `ASN`: ARCSINE
   - `ACS`: ARCCOSINE
   - `ATN`: ARCTANGENT
2. Function values are returned within the following ranges:
   - -90º ≦ ASN(*x*) ≦ 90º, 0º ≦ ACS(*x*) ≦ 180º
   - -90º ≦ ATN(*x*) ≦ 90º
   - 
### See
- [ANGLE](ANGLE.md)
- [SIN](SIN_COS_TAN.md)
- [COS](SIN_COS_TAN.md)
- [TAN](SIN_COS_TAN.md)

### Sample Program
```basic
10  ANGLE 1
20  INPUT "INPUT NUMBER (-1 TO 1)="; N
30  PRINT N; "=SIN("; ASN N; "RAD)"
40  PRINT N; "=COS("; ACS N; "RAD)"
50  PRINT N; "=TAN("; ATN N; "RAD)"
60  ANGLE 0: END
```
Displays trigonometric angles in radians for each input in range of -1 to 1.


