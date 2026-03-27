## ANGLE

### Purpose
Specifies the angle unit

### Format
```basic
ANGLE   angle specification
         └───────┬────────┘
         Numeric expression
```
### Example
```basic
ANGLE 0
```

### Parameters
angle specification: Numeric expression truncated to an integer in
the range 0 ≦ angle specification < 3

### Explanation
1. The angle units for the trigonometric function can be specified
using the values 0, 1, and 2.
   0: DEG (degrees)
   1: RAD (radians)
   2: GRAD (grads)
2. The relationship between the angle units are as follows:

|Angle Unit|  DEG  |  RAD  |  GRAD  |
|----------|-------|-------|--------|
| 1 DEG =  |   1   |   π<br>──<br>180 | 100<br>──<br>90 |
| 1 RAD = | 180<br>──<br> π | 1 | 200<br>──<br> π |
| 1 GRAD = | 90<br>──<br>100 | π<br>──<br>200 | 1 |

3. `ANGLE 0` is set whenever `ALL RESET` is executed.
4. The angle unit can also be specified using the **MODE** key.

### Sample Programs
```basic
10  ANGLE 0 'DEGREES
20  PRINT SIN 30;
30  ANGLE 1 'RADIAN
40  PRINT SIN (PI/6);
50  ANGLE 2 'GRAD
60  PRINT SIN(100/3)
```
Calculates and displays sin 30º in the degree mode, sin π÷6 in
the radian mode, and sin 100÷30 in the grad mode.

