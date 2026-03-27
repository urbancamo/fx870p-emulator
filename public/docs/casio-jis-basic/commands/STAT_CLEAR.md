*back to [Command Reference](../index.md#command-reference-alphabetical)*

## STAT CLEAR

**[FX-870P/VX-4]**

### Purpose
Clear (initialize) statistical processing data.

### Format
```basic
STAT CLEAR
```

### Explanation
1. Clears all previously entered statistical data, resetting the statistical
accumulators to zero.
2. Should be executed before entering a new set of statistical data with the
[STAT](STAT.md) command.
3. After executing `STAT CLEAR`, functions such as [CNT](CNT.md),
[SUMX](SUMX_SUMY.md), [MEANX](MEANX_MEANY.md), etc. will return zero.

### See
- [STAT](STAT.md)
- [CNT](CNT.md)
