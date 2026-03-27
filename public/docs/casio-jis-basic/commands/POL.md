*back to [Command Reference](../index.md#command-reference-alphabetical)*

## POL

**[All Models]**

### Purpose
Converts rectangular coordinates (x,y) to polar coordinates (r,theta).

### Format
```basic
POL         ( x-coordinate , y-coordinate )
              └─────┬────┘   └─────┬────┘
         Numeric expression  Numeric expression
```

### Example
```basic
POL(3, 2)
```

### Parameters
- x-coordinate & y-coordinate: Numeric expression. |x| + |y| > 0

### Explanation
1. Converts rectangular coordinates (x,y) to polar coordinates (r,theta).
   The following relational expressions are used at this time:

   r = sqrt(x^2 + y^2)    cos(theta) = x / sqrt(x^2 + y^2)    sin(theta) = y / sqrt(x^2 + y^2)

2. The value of r is automatically assigned to variable X, while
   theta is automatically assigned to variable Y.
3. The value of theta is given as follows:
   - DEG: -180 < theta <= 180
   - RAD: -pi < theta <= pi
   - GRA: -200 grads < theta <= 200 grads

### See
 - [REC](REC.md)

### Sample Program
```basic
10  A=5 : B=3
20  Z=POL(A,B)
30  PRINT X; Y
```
Converts rectangular coordinate point (5,3) to polar coordinates.
