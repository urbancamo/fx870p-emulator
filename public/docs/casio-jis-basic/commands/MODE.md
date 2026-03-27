*back to [Command Reference](../index.md#command-reference-alphabetical)*

## MODE (Special)

**[FX-870P/VX-4]**

### Purpose
Hidden and special mode instructions for advanced operations.

### Format
```basic
MODE formula
```

### Example
```basic
MODE 10
MODE 11
MODE 110, addr
MODE 200, Tr, Sf, Sc
MODE 201, Tr, Sf, Sc
```

### Parameters
formula: Numeric expression specifying the mode operation.

### Explanation

#### MODE 10
Enable rounding after arithmetic operations. This is the default setting.

#### MODE 11
Disable rounding after arithmetic operations.

#### MODE 110, addr
Call machine language subroutine at the specified address. Executes the
machine language code located at the memory address given by `addr`.

#### MODE 200, Tr, Sf, Sc
Floppy disk sector READ operation.
- Tr: Track number (0 to 79)
- Sf: Surface (0 or 1)
- Sc: Sector number (1 to 8)

#### MODE 201, Tr, Sf, Sc
Floppy disk sector WRITE operation.
- Tr: Track number (0 to 79)
- Sf: Surface (0 or 1)
- Sc: Sector number (1 to 8)

#### MODE A
Execute processing based on the value of variable A. When A is 110, 200, or
201, the corresponding arguments must follow as described above.

### See
- [PEEK](PEEK.md)
- [POKE](POKE.md)
