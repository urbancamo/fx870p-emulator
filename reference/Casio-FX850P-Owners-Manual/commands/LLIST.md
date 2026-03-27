## LLIST

### Purpose
Output program contents to the printer.

### Format
```basic
LLIST   ⎧ [ starting line number ] [ - [ ending line number ] ] ⎫
        ⎪   └────────┬─────────┘         └────────┬───────┘     ⎪
        ⎨      line number                    line number       ⎬
        ⎪   [ . ]                                               ⎪
        ⎩   [ ALL ]                                             ⎭
```

### Example
```basic
LLIST 50-100
```

### Parameters
Both the starting line number and ending line number are within the range of
1 ≦ line number ≦ 65535. The last line number used by BASIC is specified when `.` is used.
1. starting line number: Program line number from which program content printout is to begin.
The default option is the first line of the program.
2. ending line number: Program line number at which program content printout is to end.
The default option is the last line of the program.
3. Specifying ALL sequentially outputs all program contents in the areas P0 through P9.

### Explanation
1. Outputs program contents to the printer within the specified range.
2. Ths statement differs from [LIST](LIST.md) in that output is to the printer
without showing program contents on the display.
3. `LLIST` cannot be used in the CAL mode.

### Sample Execution
```basic
LIST
```
Outputs the contents of current program area to printer.