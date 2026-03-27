*back to [Command Reference](../index.md#command-reference-alphabetical)*

## REC

**[All Models]**

### Purpose
Converts polar coordinates (r,theta) to rectangular coordinates (x,y).

### Format
```basic
REC         ( distance r    , angle theta )
              └────┬───┘     └───┬──┘
         Numeric expression  Numeric expression
```

### Example
```basic
REC(10,15)
```

### Parameters
- distance r: 0 <= r < 10^100
- angle theta:
  - DEG: -1440 < theta < 1440
  - RAD: -8pi < theta < 8pi
  - GRA: -1600 (grads) < theta < 1600 (grads)

### Explanation
1. Converts polar coordinates (r,theta) to rectangular coordinates (x,y).
   The following relational expressions are used at this time:

   x = r cos theta, y = r sin theta

2. The value of x is automatically assigned to variable X, while
   y is automatically assigned to variable Y.

### See
- [POL](POL.md)

### Sample Program
```basic
10  A=2 : B=30
20  Z=REC(A,B)
30  PRINT X; Y
```
Converts polar coordinates (2,30) to rectangular coordinates.
