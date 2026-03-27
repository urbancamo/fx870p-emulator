## OPEN

### Purpose
Declares a file open for use.

### Format:
```basic

OPEN "file descriptor" ⎡ FOR ⎧ INPUT  ⎫ ⎤ AS [#]     file number
                       ⎣     ⎩ OUTPUT ⎭ ⎦            └────┬────┘
                                                 numeric expression
```

### Example
```basic
OPEN "DATA1" FOR OUTPUT AS #1
```

### Parameters
1. file descriptor: String expression
2. file number: Numeric expression truncated to an integer in the range 1 ≦ file number ≦ 2

### Explanation
1. Opens the file specified by the file descriptor as the specified file number. 
Subsequent input to and output from open files is performed by designating the file numbers.
2. `CAS0:` is the default option when the device name is omitted from the file descriptor.
3. Specifying `FOR INPUT` makes sequential file input possible.
4. Specifying `FOR OUTPUT` makes sequential file output possible. A new file is created on the cassette tape.
5. The following two conditions are specified when either `FOR INPUT` or `FOR OUTPUT` is not specified:
   1. Cassette tape (`CAS0:`, `CAS1:`)
      Error generated
   2. Communications circuit (`COM0:`)
      Sequential file input/output specified
6. Only one file (`#1`) can be open at any given time. Attempting to open two or more files results in an [OP](../part-12-2-error-messages.md#op-error) error.
7. Attempting to open a file which is already open results in an [OP](../part-12-2-error-messages.md#op-error) error.
8. A file buffer is automatically retained within the stack area. An [OM](../part-12-2-error-messages.md#om-error) error is generated whenever the stack area becomes full.
9. This command can only be executed within a program.

### See
 - [CLOSE](CLOSE.md)

### Sample Programs

#### Sample 1
```basic
10  OPEN "CAS0:TEST" FOR OUTPUT AS #1
20  PRINT #1, "WRITE TEST"
30  CLOSE
```

Creates sequential file on cassette tape under the filename "TEST".

#### Sample 2
```basic
10  OPEN "CAS0:TEST" FOR INPUT AS #1
20  INPUT #1,A$
30  CLOSE
```

Reads sequential file created in Sample 1.
