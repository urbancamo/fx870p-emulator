## RUN

### Purpose
Executes a program.

### Format
```basic
RUN   [ execution start line ] 
        --------------------
            Line number
```

### Example
```basic
RUN
RUN 100
```

### Parameters
start line number: Integer in the range of 1 <= line number <= 65335

### Explanation
1. Execution starts from the beginning of the program when the line number is omitted.
2. When the specified line number does not exist, the first line number above that 
specified is taken as the start line number.
3. This command closes all files that are open.
4. Variable and array values are not cleared.
5. This command cannot be used within a program.
6. This command cannot be used in the CAL mode.

### Sample Program
```basic
RUN 100
```

Executes program from line number 100.
