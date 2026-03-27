## ERASE

### Purpose
Erases a specified array.

### Format
```basic
ERASE [array name [, array name]*]
```

### Example
```basic
ERASE A$, X
```

### Parameters
array name: Variable name

### Explanation
1. Erases the specified array from memory.
2. An error does not result when the specified array does not exist, and the program proceeds
to the next executable statement.
3. The `ERASE` statement cannot be used in a `FOR ~ NEXT` loop.
4. To declare an array using a name already assigned to an existing array,
first erase the existing array with the `ERASE` statement.

### See
 - [DIM](DIM.md)

### Sample Program
```basic
10  CLEAR
20  DIM A$(10), B$(10)
30  ERASE A$
40  VARLIST
```
Declares arrays A$ and B$, and then erases array A$.
