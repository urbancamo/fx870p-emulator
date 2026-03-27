## VERIFY

### Purpose
Verifies the contents of a file stored on cassette tape.

### Format
```basic
VERIFY   "file descriptor"
          ---------------
         String expression
```

### Example
```basic
VERIFY "CAS0:DEMO"
```

### Parameters
file descriptor: String expression

### Explanation
1. Verifies the contents of a file stored on cassette tape.
2. Parity and checksum data included within the file itself are used for checking.
3. This command cannot be executed in the CAL mode.
4. This command closes all open files.
5. The first program found is checked when the filename is omitted.
6. This command cannot be executed while program execution is halted ((**STOP** is displayed)).

### See
 - [SAVE](SAVE_SAVE_ALL.md)
 - [LOAD](LOAD_LOAD_ALL.md)

### Sample Execution
```basic
VERIFY "CAS0:TEST"
```
Confirms whether or not program on cassette tape has been correctly stored under filename `TEST`.
