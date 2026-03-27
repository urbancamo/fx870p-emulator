## POL

### Purpose
Converts rectangular coordinates (𝑥,𝑦) to polar coordinates (𝑟,𝜃).

## Format
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
1. Converts rectangular coordinates (𝑥,𝑦) to polar coordinates (𝑟,𝜃).
   The following relational expressions are used at this time:

   r = √(𝑥²+𝑦²)    cos 𝜃 = 𝑥 / (√(𝑥²+𝑦²))   sin 𝜃 = 𝑦 / ((√(𝑥²+𝑦²))

2. The value of 𝑟  is automatically assigned to variable X, while
   𝜃 is automatically assigned to variable Y.
3. The value of 𝜃 is given as follows:
   DEG: -180º < 𝜃 ≦ 180º
   RAD: -π < 𝜃 ≦ π 
   GRA: -200 grads < 𝜃 ≦ 200 grads

### Sample Program
```basic
10  A=5 : B=3
20  Z=POL(A,B)
30  PRINT X; Y
```
Converts rectangular coordinate point (5,3) to polar coordinates.





