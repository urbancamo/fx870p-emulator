*back to [Command Reference](../index.md#command-reference-alphabetical)*

## RENUM

**[All Models]**

### Purpose
Renumber program lines at regular intervals.

### Format
```basic
RENUM [new_line] [, old_line] [, increment]
```

### Example
```basic
RENUM
RENUM 100, 10, 10
```

### Parameters
1. new_line: New starting line number (default: 10).
2. old_line: First existing line to renumber from (default: first line of
program).
3. increment: Increment between new line numbers (default: 10).

### Explanation
1. Renumbers program lines beginning at `old_line`, assigning new line numbers
starting from `new_line` with the specified `increment`.
2. All references to line numbers in `GOTO`, `GOSUB`, `ON GOTO`, `ON GOSUB`,
`RESTORE`, and other line-referencing statements are automatically updated.
3. Default values are used for any omitted parameters: new_line=10,
old_line=first line, increment=10.
4. An error is generated if the renumbering would result in line numbers
exceeding the maximum allowed value.
5. This is a manual command only; it cannot be used within a program.

### See
- [LIST](LIST.md)
- [EDIT](EDIT.md)
