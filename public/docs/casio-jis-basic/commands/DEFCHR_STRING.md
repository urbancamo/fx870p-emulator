*back to [Command Reference](../index.md#command-reference-alphabetical)*

## DEFCHR$

**[All Models]** **[Undocumented: codes 252-255]**

### Purpose
Define custom character display patterns.

### Format
```basic
DEFCHR$(code) = "hex_pattern"
```

### Example
```basic
DEFCHR$(252) = "FFFFFFFFFF"
PRINT CHR$(252)
```

### Parameters
1. code: Character code to define (252 to 255).
2. hex_pattern: A 12-character hexadecimal string defining the 5x7 pixel
character pattern.

### Explanation
1. Defines a custom display pattern for the character at the specified code.
2. The character codes 252 through 255 (the last 4 character codes) are
available for user-defined characters.
3. The hex pattern is a 12-character hexadecimal string. Each pair of hex
characters is assigned from left to right to define the pixel columns of
the character in a 5x7 grid.
4. Once defined, the custom character can be displayed using
`PRINT CHR$(code)`.
5. Custom character definitions are lost when the calculator is reset.

### See
- [CHR$](CHR_STRING.md)
- [ASC](ASC.md)

### Sample Program
```basic
10 DEFCHR$(252) = "FFFFFFFFFF"
20 PRINT CHR$(252)
```
Defines a custom character at code 252 and displays it.
