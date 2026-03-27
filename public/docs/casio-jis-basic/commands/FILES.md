*back to [Command Reference](../index.md#command-reference-alphabetical)*

## FILES

**[FX-870P/VX-4]**

### Purpose
Displays file names, attributes, and sizes on floppy disk.

### Format
```basic
FILES ["file descriptor"]
```

### Example
```basic
FILES
FILES "0: TEST.DAT"
FILES "0: *.DAT"
```

### Parameters
file descriptor: String expression specifying the device and filename.
Wildcards `*` and `?` are supported in the filename portion.

### Explanation
1. Displays a list of files matching the specified file descriptor, including
each file's name, attributes, and size.
2. When no file descriptor is specified, all files on the current disk are
displayed.
3. The wildcard `*` matches any sequence of characters, and `?` matches any
single character. For example, `*.DAT` matches all files with the `.DAT`
extension.

### See
- [KILL](KILL.md)
- [NAME](NAME.md)
- [DSKF](DSKF.md)
