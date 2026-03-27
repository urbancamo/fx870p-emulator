*back to [Command Reference](../index.md#command-reference-alphabetical)*

## SUMX / SUMY / SUMX2 / SUMY2 / SUMXY

**[FX-870P/VX-4]**

### Purpose
Statistical sum functions for processed data.

### Format
```basic
SUMX
SUMY
SUMX2
SUMY2
SUMXY
```

### Example
```basic
PRINT SUMX
PRINT SUMXY
```

### Explanation

| Function | Returns |
|----------|---------|
| `SUMX`   | Sum of X data |
| `SUMY`   | Sum of Y data |
| `SUMX2`  | Sum of X squared data (sum of X^2) |
| `SUMY2`  | Sum of Y squared data (sum of Y^2) |
| `SUMXY`  | Product sum of X and Y data (sum of X*Y) |

1. These functions return the accumulated sums from data entered using the
[STAT](STAT.md) command.
2. `SUMY`, `SUMY2`, and `SUMXY` require paired (X, Y) data to have been
entered.
3. All values return 0 after [STAT CLEAR](STAT_CLEAR.md) is executed.

### See
- [STAT](STAT.md)
- [STAT CLEAR](STAT_CLEAR.md)
- [CNT](CNT.md)
- [MEANX/MEANY](MEANX_MEANY.md)
- [SDX/SDY](SDX_SDY.md)
