## SAVE#

### Purpose
Outputs DATA BANK data to the file specified by the file descriptor.

### Format
```basic
SAVE#    [ file descriptor ]
           ---------------
           String expression
```

### Example
```basic
SAVE# "CAS0:TEXT"
```

### Parameters
file descriptor: String expression

### Explanation
1. Outputs DATA BANK data to a file specified by the file descriptor.
2. Data are output in ASCII format.
3. `CAS0:` is the default option when the device name is omitted from the file descriptor.
4. When the entire file descriptor is omitted, the file is output to cassette tape without a filename.
5. This command cannot be executed in the CAL mode, but in the BASIC mode.
6. This command cannot be executed while program is halted (`STOP` displayed).
7. This command cannot be exeuted for data protected by a password.

### See
 - [LOAD#](LOAD_HASH.md)

### Sample Execution
```basic
SAVE# "CAS0:TEL"
```
Save DATA BANK data to cassette tape under filename `TEL`.
