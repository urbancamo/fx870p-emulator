*back to [Command Reference](../index.md#command-reference-alphabetical)*

## MEANX / MEANY

**[FX-870P/VX-4]**

### Purpose
Statistical mean (average) functions for processed data.

### Format
```basic
MEANX
MEANY
```

### Example
```basic
PRINT MEANX
PRINT MEANY
```

### Explanation

| Function | Returns |
|----------|---------|
| `MEANX`  | Average (arithmetic mean) of X data |
| `MEANY`  | Average (arithmetic mean) of Y data |

1. `MEANX` returns the sum of X data divided by the number of data points
(SUMX / CNT).
2. `MEANY` returns the sum of Y data divided by the number of data points
(SUMY / CNT). Requires paired (X, Y) data to have been entered.
3. Data must first be entered using the [STAT](STAT.md) command.

### See
- [STAT](STAT.md)
- [STAT CLEAR](STAT_CLEAR.md)
- [CNT](CNT.md)
- [SUMX/SUMY](SUMX_SUMY.md)
- [SDX/SDY](SDX_SDY.md)
