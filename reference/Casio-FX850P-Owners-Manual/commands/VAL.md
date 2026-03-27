## VAL

### Purpose
Converts a numeric character string to a numeric value.

### Format
```basic
VAL    ( string )
         └─┬──┘ 
   String expression
```

### Example
```basic
A = VAL("345")
```

### Parameters
string: String expression

### Explanation
1. Converts a numeric character string to a numeric value.
2. Numeric characters are converted up to the point in the string that
a non-numeric character is encountered. All subsequent characters are
disregarded from the non-numeric character onwards (i.e. when
`A = VAL("123A456"), A = 123`).
3. The value of this function becomes 0 when the length of the string
is 0 or when the leading character is non-numeric.

### See
 - [STR$](STR_STRING.md)

### Sample Program
```basic
10  INPUT "VALUE1", A$
20  INPUT "VALUE2", B$
30  C$ = A$ + B$
40  C = VAL(A$) + VAL(B$)
50  PRINT C$, C
```
Performs string addition and numeric addition of two input strings.
