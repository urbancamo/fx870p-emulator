## EOF

### Purpose
Indicates the end of file reading.

### Format
```basic
EOF     ( file number )
          └────┬────┘
      Numeric expression
```

### Example
```basic
IF EOF(1) THEN END
```

### Parameters
file number: Numeric expression truncated to an integer in the range of 1 ≦ file number < 2

### Explanation
1. Indicates the end of reading for a file specified by the file number. 
Generally, this function is assigned a value of 0, but the value becomes -1 when
the last record ofa file is read.
2. A value of -1 is returned when the receive buffer (for RS-232C application) becomes empty.
3. This statement is valid for sequential files opened for input (`FOR INPUT`) and for 
   communications circuits (`COM0:`) input/output files.
4. Generally, a 0 is returned for sequential files opened for output (`FOR OUTPUT`).

### Sample Program
```basic
10  OPEN "CAS0:TEST" FOR INPUT AS #1
20  INPUT #1, A$
30  PRINT A$
40  IF NOT EOF(1) THEN 20
50  CLOSE
60  END
```

Reads and displays data in sequential file on cassette tape until no more data remain.
