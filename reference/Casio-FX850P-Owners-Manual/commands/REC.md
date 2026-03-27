## REC

### Purpose
Converts polar coordinates (𝑥,𝑦) to polar coordinates (𝑟,𝜃).

## Format
```basic
REC         ( distance 𝑟    , angle 𝜃 )
              └────┬───┘     └───┬──┘ 
         Numeric expression  Numeric expression
```

### Example
```basic
REC(10,15)
```

### Parameters
- distance 𝑟: 0 ≦ r < 10¹⁰⁰
- angle 𝜃: 
  - DEG: -1440º < 𝜃 < 1440º
  - RAD: -8π < 𝜃 < 8π
  - GRA: -1600 (grads) < 𝜃 < 1600 (grads)

### Explanation
1. Converts polar coordinates (𝑟,𝜃) to rectangular coordinates (𝑥,𝑦).
   The following relational expressions are used at this time:

   𝑥 = 𝑟 cos 𝜃, 𝑦 = 𝑟 sin 𝜃 

2. The value of 𝑥 is automatically assigned to variable X, while
   𝑦 is automatically assigned to variable Y.

### Sample Program
```basic
10  A=2 : B=30
20  Z=REC(A,B)
30  PRINT X; Y
```
Converts polar coordinates (2,30) to rectangular coordinates.






