## PRINT#

### Purpose
Outputs data to a sequential file.

### Format
```basic
PRINT#     file number   [, output data   [ ⎧ , ⎫ [ output data ] ]* ]
           └────┬────┘                      ⎩ ; ⎭
        Numeric expression
        
                                       ⎡ TAB                ⎤
                         Output data:  ⎢ String expression  ⎥
                                       ⎣ Numeric expression ⎦
```

### Example
```basic
PRINT #1, A$
```

### Parameters
file number: Numeric expression truncated to an integer in the range of 1 ≦ file number < 2

### Explanation
1. Sequentially outputs data to the sequential file specified by the file number.
2. The contents of the output data are the same as those output to the printer by the [LPRINT](LPRINT.md)
statement (see [LPRINT](LPRINT.md), [PRINT](PRINT.md)).
3. a `CR`-`LF` (0Dʰ, 0Aʰ) is output following the last output data when a semicolon and comma are not included.
4. This statement is valid for sequential files opened for output (`FOR OUTPUT`), and for communication circuit (`COM0:`) input/output files.

### See
 - [INPUT#](INPUT_HASH.md)
 - [PRINT](PRINT.md)
 - [LPRINT](LPRINT.md)

### Sample Programs

#### Sample 1
```basic
10  OPEN "CAS0:TEST" FOR OUTPUT AS #1
20  INPUT "DATA=", A$
30  IF A$="" THEN 60
40  PRINT #1, A$
50  GOTO 20
60  CLOSE: END
```

Creates sequential file on cassette tape for input of characters from keyboard.

#### Sample 2
```basic
10  OPEN "CAS0:TEST" FOR INPUT AS #1
20  INPUT #1, A$
30  CLOSE
```
Reads sequential file on cassette tape created in Sample Program 1.
