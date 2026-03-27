*back to [Command Reference](../index.md#command-reference-alphabetical)*

## SDX / SDY / SDXN / SDYN

**[FX-870P/VX-4]**

### Purpose
Standard deviation functions for statistically processed data.

### Format
```basic
SDX
SDY
SDXN
SDYN
```

### Example
```basic
PRINT SDX
PRINT SDYN
```

### Explanation

| Function | Returns | Formula |
|----------|---------|---------|
| `SDX`    | Sample standard deviation of X | SQR(MEANX2 - MEANX^2) |
| `SDY`    | Sample standard deviation of Y | SQR(MEANY2 - MEANY^2) |
| `SDXN`   | Population standard deviation of X | SQR(CNT / (CNT - 1)) * SDX |
| `SDYN`   | Population standard deviation of Y | SQR(CNT / (CNT - 1)) * SDY |

1. `SDX` and `SDY` calculate the sample standard deviation (dividing by N).
2. `SDXN` and `SDYN` apply Bessel's correction to produce the population
standard deviation estimate (dividing by N-1).
3. `SDY`, `SDYN` require paired (X, Y) data to have been entered.
4. Data must first be entered using the [STAT](STAT.md) command.

### See
- [STAT](STAT.md)
- [STAT CLEAR](STAT_CLEAR.md)
- [MEANX/MEANY](MEANX_MEANY.md)
- [SUMX/SUMY](SUMX_SUMY.md)
- [LRA/LRB](LRA_LRB.md)
- [COR](COR.md)
