*back to [Command Reference](../index.md#command-reference-alphabetical)*

## MODE (Special)

**[FX-870P/VX-4]**

### Purpose
Hidden and special mode instructions for advanced operations.

### Format
```basic
MODE formula
MODE110(var)           ' hidden ML execution — parenthesised form
MODE 200, Tr, Sf, Sc   ' floppy disk I/O — comma-separated arguments
MODE 201, Tr, Sf, Sc
```

### Example
```basic
MODE 10
MODE 11
100 EX=&H1CD0:MODE110(EX)
MODE 200, 0, 0, 1
MODE 201, 0, 0, 1
```

### Parameters
formula: Numeric expression specifying the mode operation.

### Explanation

#### MODE 10
Enable rounding after arithmetic operations. This is the default setting.

#### MODE 11
Disable rounding after arithmetic operations.

#### MODE110(addr)
**[Undocumented]** Call a machine language subroutine at the specified
address. Syntax uses parentheses with **no space** between `MODE` and
`110`, following CosmicV4's convention.

Important: the argument **must be a variable**, not a hex/decimal
literal. `MODE110(&H1CD0)` produces an SN error — Casio BASIC's
tokenizer cannot handle a literal inside `MODE110(...)`. Always
assign the address to a variable first:

```basic
10 EX=&H1CD0
20 MODE110(EX)
```

Before calling, the ML code must be POKEd into memory at `addr`
(typically via `DEFSEG=addr/16:POKE offset,byte`). The standard
FX-870P/VX-4 target is `&H1CD0` (SAVE/LOAD buffer).

On entry to user code, `UA` is set to `&H55` (Bank 1 visible). User
code must execute `PST UA,&H54` immediately before its final `RTN`
so the return lands in the Bank 0 dispatcher at `&H5313`.

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
Execute processing based on the value of variable A. When A is 200 or
201, the corresponding arguments must follow as described above.

### See
- [PEEK](PEEK.md)
- [POKE](POKE.md)
