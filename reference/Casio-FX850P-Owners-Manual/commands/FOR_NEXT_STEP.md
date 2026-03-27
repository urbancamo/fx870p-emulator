## FOR ~ NEXT

### Purpose
Executes the program lines between the `FOR` statement and `NEXT` statements
and increments the control variable, starting with the initial value.
Execution is terminated when value of the control variable exceeds the specified
final value.

### Format
```basic
FOR   control variable name     =      initial value
                                       └─────┬─────┘
                                     Numeric expression
                                     
               TO     final value       [ STEP      increment ]
                      └────┬────┘                   └───┬───┘
                   Numeric expression           Numeric expression
                   
NEXT  [ Control variable name ]   [ , Control variable name ]*
```

### Example
```basic
FOR I = 1 TO 10 STEP 0.1
```

### Parameters
1. control variable name: Array variables cannot be used.
2. initial value: Numeric expression
3. final value: Numeric expression
4. increment: Numeric expression (default value = 1)

### Explanation
1. None of the statements between `FOR` and `NEXT` are executed and the program
proceeds to the next executable statement after `NEXT` when the initial value is greater than the final value.
2. Each `FOR` requires a corresponding `NEXT`.
3. `FOR ~ NEXT` loops can be nested (a `FOR ~ NEXT` loop can be placed inside
another `FOR ~ NEXT~ loop). Nested loops must be structured as shown below with
`NEXT` appearing in reverse sequence of the `FOR` (e.g. `FOR A, FOR B, FOR C ~ NEXT C, NEXT B, NEXT A)`
    ```basic
    ┌────10  FOR I=1 TO 12 STEP 3
    │  ┌─20  FOR J=1 TO 4 STEP 0.5
    │  │ 30  PRINT I, J
    │  └─40  NEXT J
    └────50  NEXT I
         60  END  
    ```
4. `FOR ~ NEXT` loops can be nested up to 29 levels.
5. The control variable may be omitted from `NEXT`. However, use of the control 
variable in the `NEXT` statement is recommended when nesting loops.
6. NEXT statements can be chained by including them under one `NEXT` statement, separated by commas.
    ```basic
    ┌────10  FOR I=1 TO 12 STEP 3    ┌────10  FOR I=1 TO 12 STEP 3
    │  ┌─20  FOR J=1 TO 4 STEP 0.5   │  ┌─20  FOR J=1 TO 4 STEP 0.5
    │  │ 30  PRINT I, J              │  │ 30  PRINT I,J
    │  └─40  NEXT J                  └──┴─40  NEXT J,I
    └────50  NEXT I                      50  END
         60  END  
    ```
7. The control variable retains the value which exceeds the final value
   (and terminates the loop) when loop execution is complete. With the loop
   `FOR I=3 TO 10 STEP 3`, for example, the value of control variable `I` is `12`
   when execution of the loop is complete.
8. Jumping out of a `FOR ~ NEXT` loop is also possible. In this case, the current
   control variable value is retained in memory, and the loop can be resumed by 
   returning with a `GOTO` statement.
