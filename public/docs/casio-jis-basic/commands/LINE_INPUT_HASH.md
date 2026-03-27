*back to [Command Reference](../index.md#command-reference-alphabetical)*

## LINE INPUT #

**[FX-870P/VX-4]**

### Purpose
Read one line of character string data from a sequential file.

### Format
```basic
LINE INPUT # file_number, character_variable
```

### Example
```basic
LINE INPUT # 1, A$
```

### Parameters
1. file_number: Numeric expression specifying the file number (opened with
`OPEN`).
2. character_variable: String variable to receive the data.

### Explanation
1. Reads one line of character string data from the sequential file specified
by the file number.
2. Data is read from the current file position until the end of the line is
reached.
3. The file must be opened for input with the [OPEN](OPEN.md) statement before
using this command.
4. Unlike [INPUT#](INPUT_HASH.md), commas and quotation marks within the data
are treated as ordinary characters and included in the string.

### See
- [OPEN](OPEN.md)
- [INPUT#](INPUT_HASH.md)
- [CLOSE](CLOSE.md)

### Sample Program
```basic
10 OPEN "CAS0:DATA" FOR INPUT AS #1
20 LINE INPUT # 1, A$
30 PRINT A$
40 CLOSE
```
Reads one line from the sequential file "DATA" and displays it.
