*back to [Command Reference](../index.md#command-reference-alphabetical)*

## LRA / LRB

**[FX-870P/VX-4]**

### Purpose
Linear regression functions for statistically processed paired data.

### Format
```basic
LRA
LRB
```

### Example
```basic
PRINT LRA
PRINT LRB
```

### Explanation

| Function | Returns |
|----------|---------|
| `LRA`    | Linear regression constant term (Y-intercept) |
| `LRB`    | Linear regression coefficient (slope) |

1. These functions calculate the linear regression line Y = LRA + LRB * X
from paired (X, Y) data entered using the [STAT](STAT.md) command.
2. `LRA` is the constant term (Y-intercept), representing the value of Y
when X is zero.
3. `LRB` is the regression coefficient (slope), representing the change in Y
per unit change in X.
4. Paired data must be entered using the [STAT](STAT.md) command before using
these functions.

### See
- [STAT](STAT.md)
- [COR](COR.md)
- [EOX/EOY](EOX_EOY.md)
- [SDX/SDY](SDX_SDY.md)
