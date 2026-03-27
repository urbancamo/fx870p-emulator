*back to [Command Reference](../index.md#command-reference-alphabetical)*

## KILL

**[FX-870P/VX-4]**

### Purpose
Delete a file from floppy disk.

### Format
```basic
KILL "file descriptor"
```

### Example
```basic
KILL "0: TEST.DAT"
KILL "0: *.DAT"
```

### Parameters
file descriptor: String expression specifying the device and filename.
Wildcards `*` and `?` are supported in the filename portion.

### Explanation
1. Deletes the file specified by the file descriptor from the floppy disk.
2. The wildcard `*` matches any sequence of characters, and `?` matches any
single character. Using wildcards allows deletion of multiple files at once.
3. An error is generated if the specified file does not exist.

### See
- [FILES](FILES.md)
- [NAME](NAME.md)
