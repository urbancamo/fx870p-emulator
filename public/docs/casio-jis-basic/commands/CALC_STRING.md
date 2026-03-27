*back to [Command Reference](../index.md#command-reference-alphabetical)*

## CALC$

**[Undocumented]**

### Purpose
Store a formula in the Function Memory (Formula Storage area).

### Format
```basic
CALC$ = "formula_string"
```

### Example
```basic
CALC$ = "AREA=BASE*HEIGHT"
```

### Parameters
formula_string: String expression containing the formula to store.

### Explanation
1. Stores the specified formula string into the Function Memory (Formula
Storage area).
2. Once stored, the formula can be recalled and displayed by pressing the
**OUT** key.
3. The stored formula can be used in conjunction with
[CALCJMP](CALCJMP.md) to automatically assign values to the variables
in the formula.
4. This provides a way for programs to set up the calculator's built-in
formula memory feature programmatically.

### See
- [CALCJMP](CALCJMP.md)
