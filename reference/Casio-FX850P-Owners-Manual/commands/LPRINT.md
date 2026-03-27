## LPRINT

### Purpose
Output text to the printer.

### Format
```basic
LPRINT  [output data] [ { , } [output data ] ] *
                        { ; }
                        
                            ⎡ TAB(numeric expression) ⎤
               Output data: ⎢ Numeric expression      ⎥
                            ⎣ String expression       ⎦
```

### Example
```basic
LPRINT A, B
```

### Parameters
output data: Output control function, numeric expression, or string expression.

### Explanation
1. Outputs data to the printer. When the output data is a control function, the
corresponding operation is performed. Numeric or string expressions as output data 
result in printout of the resulting value.
2. Numeric expression values are printed in decimal, and the print format is the same 
as that for the [PRINT](PRINT.md) statement.
3. String expression values are output as they are to the printer.
4. Including a comma between output data causes a zone tab to be inserted between output data and output.
   Zone tabs are set at 14-character intervals (counting from 0, within a range of 255 characters)
   following the last carrier return instruction, and zone tabs output spaces from the 
   current location to the next zone tab. Consequently, the printing of the first character
   of an output data following a comma is performed at the next zone tab.

```basic
10  LPRINT
20  FOR I=1 TO 20: LPRINT "*", NEXT I
30  LPRINT "(" ; I; ")"
40  NEXT I
50  LPRINT
60  END
```

5. Including a semicolon between output data causes the output data to be output sequentially.

```basic
10  LPRINT
20  FOR I=1 TO 50
30  LPRINT "("; I; ")"
40  NEXT I
50  LPRINT
60  END
```

6. Including a semicolon at the end of the statement causes the location immediately
following the printout of the last output data to be the next printing position.
7. Including a comma at the end of an `LPRINT` statement performs a zone tab following printout of the last output data.
8. A carrier return is performed when a semicolon or comma is not included at the end of the statement.
Print positions are counted from 0 to 255, and the count is reset to 0 when it exceeds 255.
Zone tabs and the TAB function are performed in accordance with the print position.
`CR`-`LF` (internal code 0Dʰ, 0Aʰ) is performed at this time.
9. Actual printing begins when a carrier return/line feed code is sent, and carrier return/line feed
is performed automatically when printing reaches the extreme right of the paper.

### See
 - [PRINT](PRINT.md)

### Sample Program
```basic
10  LPRINT
20  FOR I=1 TO 14: LPRINT "*";: NEXT I
30  LPRINT
40  END
```

Outputs a series of 14 asterisks to printer.
