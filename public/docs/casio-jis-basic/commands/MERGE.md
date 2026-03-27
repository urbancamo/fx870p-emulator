*back to [Command Reference](../index.md#command-reference-alphabetical)*

## MERGE

**[All Models]**

### Purpose
Mix a program from a file with the current program in memory.

### Format
```basic
MERGE "file descriptor"
```

### Example
```basic
MERGE "0: TEST.BAS"
MERGE "CAS0: SUBPROG"
```

### Parameters
file descriptor: String expression specifying the device and filename.

### Explanation
1. Reads the program from the specified file and merges it with the program
currently in memory.
2. If a line number in the file matches a line number in the current program,
the line from the file replaces the existing line.
3. Lines in the current program that do not conflict with the file are
retained.
4. Unlike [CHAIN](CHAIN.md) or [LOAD](LOAD_LOAD_ALL.md), `MERGE` does not
clear the current program or variables before loading.
5. `CAS0:` is the default device when the device name is omitted from the
file descriptor.

### See
- [LOAD/LOAD ALL](LOAD_LOAD_ALL.md)
- [SAVE/SAVE ALL](SAVE_SAVE_ALL.md)
- [CHAIN](CHAIN.md)
