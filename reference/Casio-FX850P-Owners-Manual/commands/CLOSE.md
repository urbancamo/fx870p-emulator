## CLOSE

### Purpose
Closes files and declares an end to the user of the I/O (input/output) buffer.

### Format
```basic
CLOSE
```

### Example
```basic
CLOSE
```

### Explanation
1. Closes a file and clears the file buffer.
2. An error is not generated even if a file is not open when this command is executed.

### See
 - [OPEN](OPEN.md)

### Sample Program
```basic
10  OPEN "CAS0:TEST" FOR INPUT AS #1
20  INPUT #1, A$: PRINT A$;
30  IF EOF(1)=0 THEN 20
40  CLOSE
```

Reads and displays data from sequential file TEST (stored on cassette tape) until all data have been read.
