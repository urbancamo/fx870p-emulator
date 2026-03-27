## LIST [ALL]

### Purpose
Displays all or part of the current specified program.

### Format
```basic
         {  [start line number] [- [end line number]]  }
         {   -----------------      ---------------    }
  LIST   {     Line number             Line number     }
         {  [.]                                        }
         {  [ALL]                                      }
```

### Example 
```basic
LIST 100
LIST 100 - 300
LIST - 400
LIST
```

### Parameters
1. start line number: Integer in the range of 1 <= line number <= 65535
   (first line number when start omitted)
2. end line number: Integer in the range of 1 <= line number <= 65535
   (end line number when end omitted)

### Explanation
1. Displays the currently specified program in the range specified by the line numbers.
2. A minus sign must be used as the delimiter between line numbers.
3. The following five examples illustrate specification of the display range.

| Command       | Explanation                                        | 
|---------------|----------------------------------------------------|
| `LIST`        | **EXE** (All lines from beginning of program)      |
| `LIST 30`     | **EXE** (Line 30)                                  | 
| `LIST 50-100` | **EXE** (Lines 50 through 100)                     |
| `LIST 200-`   | **EXE** (From line 200 through end of program)     |
| `LIST -80`    | **EXE** (From beginning of program through line 80 |

4. Using a period in place of the line number displays the most recently handled
   (i.e. written, edited, executed). If a program is halted during execution by
   an error, executing `LIST .` displays the line in whcih the error was generated.
5. When the specified start line number does not exist, the first line number above
that specified is taken as the start line number.
6. When the specified end line number does not exist, the greatest line number not 
exceeding that specified in taken as the end line number.
7. The start line number must be smaller than the end line number.
8. `LIST` command execution can be halted by pressing the `BRK` key.
9. Press the **STOP** key to momentarily halt `LIST` command execution. To restart
   execution, press the **EXE** key or one of the alphanumeric keys. 
10. The computer stands by for command input after the program list is displayed.
11. This command cannot be used when a password is registered.
12. This command cannot be used in the `CAL` mode.
13. Specifying `ALL` displays all programs in sequence from area P0 through P9.

### See
- [EDIT](EDIT.md)
- [VARLIST](VARLIST.md)
- [LLIST](LLIST.md)
