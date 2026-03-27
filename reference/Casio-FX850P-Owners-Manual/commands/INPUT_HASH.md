## INPUT#

### Purpose
Reads data from a sequential file.

### Format
```basic
INPUT#     file number   , variable name  [ , variable name ]*
           └────┬────┘
        Numeric expression
```

### Example
```basic
INPUT #1, A
```

### Parameters
file number: Numeric expression truncated to an integer in the range of 1 ≦ filename < 2.

### Explanation
1. Reads data from the file specified by the file number.
2. Data are input in the same format s data input using the [INPUT](INPUT.md) statement
   (see [INPUT](INPUT.md)). Consequently, data are delimited using commas, quotation marks, 
   CR codes (0DH) or CR, LF codes (0Dʰ, 0Aʰ). Internal codes 00ʰ through 1Fʰ and 7Fʰ cannot be 
   input, and leading spaces (spaces preceding that data) are disregarded.
3. This statement is valid for sequential files opened for input (`FOR INPUT`), and for
   communication circuit (`COM0:`) input/output files.
4. Spaces can also be used as delimiters when data are read to numeric variables.
5. An [ST](../part-12-2-error-messages.md#st-error) error is generated when data read exceeds 256 characters.
   Execution continues using an `ON ERROR` statement begins from the 257th character.

### Sample Program
```basic
10  OPEN "CAS0:TEST" FOR INPUT AS #1
20  INPUT #1,A$
30  PRINT A$;
40  IF EOF(1)=0 THEN 20
50  CLOSE: END
```

Reads and displays data in a sequential file on cassette tape until no more data remain.
