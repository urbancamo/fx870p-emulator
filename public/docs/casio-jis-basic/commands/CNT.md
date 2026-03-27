*back to [Command Reference](../index.md#command-reference-alphabetical)*

## CNT

**[FX-870P/VX-4]**

### Purpose
Returns the number of statistically processed data points.

### Format
```basic
CNT
```

### Example
```basic
PRINT CNT
```

### Explanation
1. Returns the total number of data points entered using the [STAT](STAT.md)
command.
2. When a frequency is specified with `STAT`, each repetition counts as a
separate data point. For example, `STAT 5; 10` adds 10 to the count.
3. Returns 0 after [STAT CLEAR](STAT_CLEAR.md) is executed.

### See
- [STAT](STAT.md)
- [STAT CLEAR](STAT_CLEAR.md)
- [SUMX/SUMY](SUMX_SUMY.md)
- [MEANX/MEANY](MEANX_MEANY.md)
