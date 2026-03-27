## REM( ' )

### Purpose
Allows remarks or comments to be included within a program. This command is not executed.

### Format
```basic
⎧  REM  ⎫   comments 
⎨       ⎬   └──┬───┘
⎩   '   ⎭   String expression
```

### Example
```basic
REM  or  '
```

### Parameters
comments: String expression (internal codes 20ʰ to 7Eʰ and 80ʰ to FBʰ)

### Explanation
1. Including an apostrophe or `REM` statement following the line number indicates
that the following text is comments and should be ignored in program execution.
2. The apostrophe may be included at the end of any executable statement to indicate that the following
text is comments. The `REM` statement can only be used at the beginning of a line.
3. Any command following the `REM` statement is treated as a comment and is not executed.
    ```basic
    PRINT A:   REM 123      123 is treated as a comment
                   → comments
    PRINT A    REM 123      SN error occurs.
    PRINT A  ' 123          123 is treated as a comment
               → comments 
    ```
4. An apostrophe is entered by pressing the **,** key following the **SHIFT** key.

### Sample Program
```basic
10  ' REM(') indicates comment
```
