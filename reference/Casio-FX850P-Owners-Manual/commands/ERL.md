## ERL

### Purpose
Returns the number of a line in which an error has been generated.

### Format
```basic
ER = ERL
```

### Explanation
The value of `ERL` can only be changed within a program, and the value is cleared
when a program is executed or when the power of the unit is switched OFF.

### See
 - [ERR](ERR.md)
 - [ON ERROR GOTO](ON_ERROR_GOTO.md)

### Sample Program
```basic
10  ON ERROR GOTO 40
20  **ERROR**
30  END
40  PRINT "ERROR LINE="; ERL
50  RESUME 30
```

Error is generated in line 20 line mumber where the error was 
generated is displayed in line 40.
