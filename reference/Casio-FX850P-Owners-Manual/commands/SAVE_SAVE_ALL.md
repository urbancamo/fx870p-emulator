## SAVE, SAVE ALL

### Purpose
Saves a program to a specified file.

### Format
```basic
SAVE [ALL] "file descriptor"  [, A]
            ---------------
           String expression
```

### Example
```basic
SAVE "DEMO1"
```

### Parameters
1. `ALL`: Outputs all programs from P0 to P9. Can only be specified for output to cassette tape.
2. file descriptor: String expressions.
3. `[, A]`: Specifies ASCII format. Binary internal format is the default option
when omitted. Cannot be specified while `SAVE ALL` is specified.

### Explanation
1. Outputs the currently specified program area contents to the file specified by the file descriptor.
2. Specifying `ALL` outputs programs from areas P0 to P9 to cassette tape as an `ALL` file.
3. `CAS0:` is the default option when the device name is omitted from the file descriptor.
   When the entire file descriptor is omitted, the file is output to cassette tape and saved without a filename.
4. Specifying `, A` causes the program to be converted to and saved in ASCII format. 
   This format uses alphabetic characters such as those which appear when the [LIST](LIST.md) command is executed.
5. Data are output as they are in binary format when `, A` is not specified. However,
   files are saved in ASCII format whenever `COM0:` is specified in the file descriptor, regardless of the `, A` specification.
6. Files for which a password has been registered cannot be saved in ASCII format.
7. This command causes all open files to be closed and enters command input standby once the `SAVE` execution is complete.
8. This command cannot be executed while program execution is halted (**STOP** displayed).
9. This command cannot be executed in the CAL mode.

### See
 - [LOAD](LOAD_LOAD_ALL.md)
 - [PASS](PASS.md)
 - [LOAD ALL](LOAD_LOAD_ALL.md)

### Sample Execution
```basic
SAVE "CAS0:TEST"
```
Saves a program on cassette tape under the filename TEST.
