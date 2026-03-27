*back to [Command Reference](../index.md#command-reference-alphabetical)*

## CHAIN

**[FX-870P/VX-4]**

### Purpose
Reads and executes a program from the file specified by the file descriptor.

### Format
```basic
CHAIN "file descriptor"
```

### Example
```basic
CHAIN "CAS0: TEST"
CHAIN "0: TEST.BAS"
```

### Parameters
file descriptor: String expression specifying the device and filename.

### Explanation
1. Loads the program specified by the file descriptor into the current
program area and immediately executes it.
2. The current program in memory is replaced by the loaded program.
3. All variables are cleared when the new program is loaded.
4. `CAS0:` is the default device when the device name is omitted from the
file descriptor.

### See
- [RUN](RUN.md)
- [LOAD/LOAD ALL](LOAD_LOAD_ALL.md)
- [MERGE](MERGE.md)
