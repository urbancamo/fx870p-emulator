## ERR

### Purpose 
Returns the error error code which corresponds to a generate error.

### Format
```basic
PRINT ERR
```

### Explanation
The value of `ERR` can only be changed within a program, and the value is 
cleared when a program is executed or when the power of the unit is switched ON.
See the [error message table](../part-12-2-error-messages.md) on page 397 for details
concerning error codes and their corresponding error messages.

### See
 - [ON ERROR GOTO](ON_ERROR_GOTO.md)
 - [ERL](ERL.md)
 - [Error Messages Table](../part-12-2-error-messages.md)

### Sample Program
```basic
10  ON ERROR GOTO 40
20  **ERROR**
30  END
40  PRINT "ERROR CODE="; ERR
50  RESUME 30
```

An error is generated in line 20 and corresponding error code is displayed in line 40.
