## CLEAR

### Purpose
Clears all variables and determines the variable area size in accordance with 
the parameter entered. Also closes all files that are open.

### Format
```basic
CLEAR [variable area size]
```

### Example
```basic
CLEAR 400
```

### Parameters
variable area size: Numeric expression

Determines the areas used for variables. The initial setting when `ALL RESET`
is executed depends upon total memory capacity.

| MODEL   | MEMORY CAPACITY | VARIABLE AREA SIZE |
|---------|-----------------|--------------------|
| FX-850P | Less than 32KB  | 1536 byes          |
| FX-850P | 32KB and over   | 8192 bytes         |
| FX-880P | N/A             | 8192 bytes         |

### Explanation
1. Clears all variables
2. Closes all open files and clears the [FOR ~ NEXT](FOR_NEXT_STEP.md) and 
[GOSUB](GOSUB.md) stack.
3. Variable area cannot be set during program execution.

### See
- [FRE](FRE.md)
