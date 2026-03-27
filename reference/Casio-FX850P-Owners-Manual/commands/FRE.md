## FRE

### Purpose
Returns memory area size in accordance with argument.

### Format
```basic
     ⎧     argument       ⎫
FRE  ⎨     └───┬──┘       ⎬
     ⎩ Numeric expression ⎭
```

### Example
```basic
PRINT FRE 0
```

### Parameters
argument: Integer in the range of 0 ≦ argument ≦ 3

### Explanation
1. parameter = 0: Returns unused memory in variable area in byte units.
2. parameter = 1: Returns unused memory in program or in DATA BANK area in byte units.
3. parameter = 2: Returns overall variable area in byte units.

### See
- [CLEAR](CLEAR.md)
