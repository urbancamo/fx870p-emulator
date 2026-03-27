*back to [Command Reference](../index.md#command-reference-alphabetical)*

## EOX / EOY

**[FX-870P/VX-4]**

### Purpose
Estimated value functions based on linear regression of statistical data.

### Format
```basic
EOX(formula)
EOY(formula)
```

### Example
```basic
PRINT EOX(5)
PRINT EOY(10)
```

### Parameters
formula: Numeric expression specifying the known value.

### Explanation

| Function | Returns |
|----------|---------|
| `EOX(Y)` | Estimated value of X for a given Y value |
| `EOY(X)` | Estimated value of Y for a given X value |

1. `EOY(X)` calculates the estimated Y value corresponding to the given X
value using the linear regression line Y = LRA + LRB * X.
2. `EOX(Y)` calculates the estimated X value corresponding to the given Y
value using the inverse of the regression relationship.
3. Paired (X, Y) data must be entered using the [STAT](STAT.md) command before
using these functions.

### See
- [STAT](STAT.md)
- [LRA/LRB](LRA_LRB.md)
- [COR](COR.md)
