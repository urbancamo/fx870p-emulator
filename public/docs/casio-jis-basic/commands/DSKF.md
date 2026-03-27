*back to [Command Reference](../index.md#command-reference-alphabetical)*

## DSKF

**[FX-870P/VX-4]**

### Purpose
Returns the number of remaining clusters on the floppy disk.

### Format
```basic
DSKF
```

### Example
```basic
PRINT DSKF
```

### Explanation
1. Returns the number of free (unused) clusters remaining on the floppy disk.
2. One cluster equals 1 Kbyte of storage.
3. This function can be used to check available disk space before writing data.

### See
- [FILES](FILES.md)
- [FORMAT](FORMAT.md)
