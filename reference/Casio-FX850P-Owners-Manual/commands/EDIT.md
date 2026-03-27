## EDIT

### Purpose
Enters the BASIC edit mode.

### Format
```basic
        ⎧  [   start line number   ]  ⎫
        ⎪      └───────┬───────┘      ⎪
  EDIT  ⎨    Line number or period    ⎬
        ⎩            [ . ]            ⎭
```

### Example 
```basic
EDIT 100
```

### Parameters
start line number: Integer in the range of 1 <= line number <= 65535 (first line
number when start omitted)

### Explanation
1. Enters the BASIC edit mode and displays the program from the specified line number.
The cursor is displayed and editing becomes possible when either the **⇦** or 
**⇨** key is pressed.
2. Using a period in place of the line number displays the most recently handled
   (i.e. written, edited, executed). If a program is halted during execution by an error,
   executing `EDIT .` displays the line in which the error was generated.
3. When the specified start line number does not exist, the first line number above
that specified is taken as the start line number.
4. This command cannot be used when a password is registered.
5. This command cannot be used in the CAL mode.
6. This mode is cancelled by pressing the **BRK** key.

### See
 - [LIST](LIST.md)
 - [LLIST](LLIST.md)
