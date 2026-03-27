## PI

### Purpose
Returns the value of π.

## Format
```basic
PI
```

### Example
```basic
S = 2 * PI * R
```

### Explanation
1. Returns the value of π.
2. The value of π used for internal calculations is 3.1415926536
3. The displayed value is rounded off to 10 digits, so the value 
of π is displayed as 3.141592654.

### Sample Program
```basic
10  INPUT "RADIUS"; R
20  PRINT "CIRCUMFERENCE="; 2*PI*R
30  PRINT "AREA="; R^2*PI
40  END
```
Calculates circumference and area of circle after input of radius.

