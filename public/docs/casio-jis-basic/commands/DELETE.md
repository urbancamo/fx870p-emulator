*back to [Command Reference](../index.md#command-reference-alphabetical)*

## DELETE

**[All Models]**

### Purpose
Delete part of a program by line number.

### Format
```basic
DELETE [start_line] [-end_line]
```

### Example
```basic
DELETE 50
DELETE 20-80
DELETE 20-
DELETE -80
```

### Parameters
1. start_line: Line number of the first line to delete.
2. end_line: Line number of the last line to delete.

### Explanation
1. `DELETE 50` deletes line 50 only.
2. `DELETE 20-80` deletes all lines from line 20 through line 80 inclusive.
3. `DELETE 20-` deletes all lines from line 20 to the end of the program.
4. `DELETE -80` deletes all lines from the beginning of the program up to and
including line 80.
5. An SN error is generated if no arguments are given.
6. This is a manual command only; it cannot be used within a program.

### See
- [LIST](LIST.md)
- [NEW](NEW.md)
- [EDIT](EDIT.md)
