*back to [Command Reference](../index.md#command-reference-alphabetical)*

## ERR

**[All Models]**

### Purpose
Returns the error code which corresponds to a generated error.

### Format
```basic
PRINT ERR
```

### Explanation
The value of `ERR` can only be changed within a program, and the value is
cleared when a program is executed or when the power of the unit is switched ON.

### See
 - [ON ERROR GOTO](ON_ERROR_GOTO.md)
 - [ERL](ERL.md)

### Sample Program
```basic
10  ON ERROR GOTO 40
20  **ERROR**
30  END
40  PRINT "ERROR CODE="; ERR
50  RESUME 30
```

An error is generated in line 20 and corresponding error code is displayed in line 40.
