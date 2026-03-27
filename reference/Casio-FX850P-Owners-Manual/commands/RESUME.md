## RESUME

### Purpose
Returns from an error handling routine to the main routine.

### Format
```basic
              [       NEXT           ]
     RESUME   [ {return line number} ]
              [ {------------------} ]
              { {    Line number   } ]
```

### Example
```basic
RESUME NEXT
RESUME 100
```

### Parameters
1. `NEXT`
2. return line number: Integer in the range of 1 <= line number <= 65535

### Explanation
1. This statement is entere at the end of an error handling routine.
2. The statement that generated the original error is the default option when the
return destination (`NEXT` or return line number) is omitted.
3. Program execution returns to the statement following the statement that generated
the original error when `NEXT` is specified.
4. Return line number specifies the line to which program execution is to be resumed.
5. A [RESUME](RESUME.md) statement without a return destination or a [RESUME](RESUME.md) statement
that specifies the line in which the original error was generated as the return line
line number cannot be written at the beginning of the error handling routine.
This would result in an endless loop between the statement in which the error
was generated and the error handling routine.
6. A [RESUME](RESUME.md) statement must always be included in the same program area
as the [ON ERROR GOTO](ON_ERROR_GOTO.md) statement.

### See
 - [ERR](ERR.md)
 - [ERL](ERL.md)
 - [ON ERROR GOTO](ON_ERROR_GOTO.md)

### Sample Program
```basic
10  ON ERROR GOTO 1000
20  INPUT A
30  D = 1/A
40  PRINT "1/"; A; "=";D
50  GOTO 20
1000  PRINT "0 IS ILLEGAL"
1010  RESUME 20
```

Calculating reciprocals of input values and returns to line 20 if a 0 is 
entered (resulting in division by 0).
