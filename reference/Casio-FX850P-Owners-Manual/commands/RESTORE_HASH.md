## RESTORE#

### Purpose
Searches specific data in the DATA BANK area and changes the read sequence
of DATA BANK data.

### Format
```basic
RESTORE# ⎡ "object string"   ⎡     ⎧ 0 ⎫      ⎧ line number            ⎫ ⎤ ⎤
         ⎢ ---------------   ⎢ [,  ⎨   ⎬ ] [, ⎨ #program area number   ⎬ ⎥ ⎥
         ⎣ string expression ⎣     ⎩ 1 ⎭      ⎩                        ⎭ ⎦ ⎦
```

### Parameters
1. object string: String expression
2. line number: Numeric expression. Integer within the range 0 < line number < 65536.
3. program area number: Numeric expression. Integer within the range 0 ≦ program area number < 10

### Explanation
1. Searches specific data in the DATA BANK area and sets the DATA BANK area pointer
position. Subsequent executions of the [READ#](READ_HASH.md) and [WRITE#](WRITE_HASH.md)
commands are performed from the new pointer position.
2. The relationship between the parameters and the object string are as follows:
   1. `RESTORE#`
      Omitting all parameters sets the DATA BANK area pointer to the beginning of the data to be read by the next [READ#](READ_HASH.md) command.
   2. `RESTORE# "object string"`
      Sets the DATA BANK area pointer to the position of the specified object string.
      Strings are delimited by commas, and not by spaces. A [DA](../part-12-2-error-messages.md#da-error) error is generated when the object string cannot be found.
   3. 
```basic
RESTORE# "object string" [, ⎧ 0 ⎫ ], ⎧ line number          ⎫
                            ⎩ 1 ⎭    ⎩ #program area number ⎭
```
Execution branches to specified line or program area when the object string is not found.
   
*Search is conducted from the present pointer position forward to the higher record
number. The following procedure is used to search from the beginning of entire data:

```basic
RESTORE#: RESTORE# "object string"
```

### Sample Program
```basic
10  RESTORE# "YOU", 0, 50
20  READ# A#
30  PRINT A$
40  GOTO 10
50  PRINT "NO DATA!"
```

Searches for data beginning with "YOU", and displays "NO DATA!" if not found.
