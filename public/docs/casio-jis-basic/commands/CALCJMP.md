*back to [Command Reference](../index.md#command-reference-alphabetical)*

## CALCJMP

**[Undocumented]**

### Purpose
Simulate the CALC (Function Memory) key, auto-assigning values to variables
in a stored formula.

### Format
```basic
CALCJMP
```

### Explanation
1. Simulates pressing the CALC key, which activates the Function Memory mode
and prompts the user to enter values for each variable in the stored
formula.
2. Only works when executed from MODE 0 (CAL mode). Executing from MODE 1
(BASIC mode) generates an FC error.
3. Typically used in conjunction with [CALC$](CALC_STRING.md) to first store
a formula and then activate the variable assignment process.
4. After all variable values are entered, the formula is evaluated and the
result is displayed.

### See
- [CALC$](CALC_STRING.md)

### Sample Program
```basic
10 CALC$ = "AREA=BASE*HEIGHT"
20 CALCJMP
```
Stores a formula for area calculation and activates the Function Memory to
prompt for BASE and HEIGHT values. Must be run from CAL mode (MODE 0).
