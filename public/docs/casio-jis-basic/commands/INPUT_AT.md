*back to [Command Reference](../index.md#command-reference-alphabetical)*

## INPUT@

**[Undocumented]**

### Purpose
Restricts input to a maximum number of characters. No question mark is
displayed as a prompt.

### Format
```basic
INPUT@n; variable
```

### Example
```basic
INPUT@3; age
INPUT@10; A$
```

### Parameters
1. n: Maximum number of characters allowed for input (1 to 250).
2. variable: Numeric or string variable to receive the input.

### Explanation
1. Functions like [INPUT](INPUT.md), but limits the number of characters the
user can type to a maximum of `n` characters.
2. Unlike the standard `INPUT` statement, no question mark `?` prompt is
displayed.
3. The maximum value of `n` is 250 characters.
4. This command is useful for creating formatted input screens where input
fields have a fixed maximum width.

### See
- [INPUT](INPUT.md)
- [INKEY$](INKEY_STRING.md)
- [INPUT$](INPUT_STRING.md)
