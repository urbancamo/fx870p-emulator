*back to [Command Reference](../index.md#command-reference-alphabetical)*

## STAT

**[FX-870P/VX-4]**

### Purpose
Enter statistical data.

### Format
```basic
STAT X_data [, Y_data] [; Frequency]
```

### Example
```basic
STAT 1, 3; 10
STAT 5.2
STAT 2, 7
```

### Parameters
1. X_data: Numeric expression for the X data value.
2. Y_data: Numeric expression for the Y data value (optional, for paired data).
3. Frequency: Numeric expression specifying how many times this data point
is entered (optional, default is 1).

### Explanation
1. Enters data for statistical processing.
2. When only X_data is specified, single-variable statistics are performed.
3. When both X_data and Y_data are specified, paired-variable statistics
are performed (required for correlation and regression functions).
4. The frequency parameter after the semicolon allows entering the same data
point multiple times. For example, `STAT 1, 3; 10` enters the data point
(1, 3) ten times.
5. Use [STAT CLEAR](STAT_CLEAR.md) to initialize the statistical data before
entering new data.

### See
- [STAT CLEAR](STAT_CLEAR.md)
- [CNT](CNT.md)
- [SUMX/SUMY](SUMX_SUMY.md)
- [MEANX/MEANY](MEANX_MEANY.md)
- [SDX/SDY](SDX_SDY.md)
- [LRA/LRB](LRA_LRB.md)
- [COR](COR.md)

### Sample Program
```basic
10 STAT CLEAR
20 FOR I = 1 TO 5
30 READ X, Y
40 STAT X, Y
50 NEXT I
60 DATA 1,2,3,4,5,6,7,8,9,10
70 PRINT "MEAN X="; MEANX
80 PRINT "MEAN Y="; MEANY
```
Enters five paired data points and displays the means.
