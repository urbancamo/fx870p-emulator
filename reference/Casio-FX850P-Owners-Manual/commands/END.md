## END

### Purpose
Terminates program execution.

### Explanation
1. Terminates program execution, and the computer stands by for command input.
2. Closes all files that are open.
3. Variables and arrays are not cleared.
4. Any number of `END` statements can be used in a single program. Program 
execution is terminated and open files are closed automatically at the end of 
the program even if an `END` statement is not included.

### Sample Program
```basic
10 FOR I = 1 TO 20
20 IF I > 10 THEN END
30 PRINT I;
40 NEXT I
```
Displays values of `I` in `FOR ~ NEXT` loop.

Program ends when `I` exceeds `10`.