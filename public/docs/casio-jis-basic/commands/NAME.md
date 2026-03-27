*back to [Command Reference](../index.md#command-reference-alphabetical)*

## NAME

**[FX-870P/VX-4]**

### Purpose
Rename a file on floppy disk.

### Format
```basic
NAME "old file descriptor" AS "new file descriptor"
```

### Example
```basic
NAME "0: TEST.BAS" AS "0: NEW.BAS"
```

### Parameters
1. old file descriptor: String expression specifying the current filename.
2. new file descriptor: String expression specifying the new filename.

### Explanation
1. Renames the file specified by the old file descriptor to the name
specified by the new file descriptor.
2. An error is generated if the old file does not exist, or if a file with
the new name already exists.

### See
- [FILES](FILES.md)
- [KILL](KILL.md)
