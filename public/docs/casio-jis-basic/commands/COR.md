*back to [Command Reference](../index.md#command-reference-alphabetical)*

## COR

**[FX-870P/VX-4]**

### Purpose
Returns the correlation coefficient based on statistically processed paired
data.

### Format
```basic
COR
```

### Example
```basic
PRINT COR
```

### Explanation
1. Returns the correlation coefficient (r) calculated from paired (X, Y) data
entered using the [STAT](STAT.md) command.
2. The correlation coefficient ranges from -1 to 1:
   - A value close to 1 indicates a strong positive linear relationship.
   - A value close to -1 indicates a strong negative linear relationship.
   - A value close to 0 indicates little or no linear relationship.
3. Paired data must be entered using the [STAT](STAT.md) command before using
this function.

### See
- [STAT](STAT.md)
- [LRA/LRB](LRA_LRB.md)
- [EOX/EOY](EOX_EOY.md)
