*back to [Command Reference](../index.md#command-reference-alphabetical)*

## PRINT USING

**[FX-870P/VX-4]**

### Purpose
Display output formatted according to a format specification.

### Format
```basic
PRINT USING "format_spec"; output_element [; output_element]*
```

### Example
```basic
PRINT USING "###.##"; X
PRINT USING "& &"; A$
```

### Parameters
1. format_spec: String expression defining the output format.
2. output_element: Numeric or string expression to be formatted.

### Format Characters

| Character | Meaning |
|-----------|---------|
| `#`       | Digit position. Also used for sign and decimal point placement. |
| `&`       | String placeholder. The output string is displayed with a length equal to the number of `&` characters. |

### Explanation
1. Formats and displays the output elements according to the format
specification string.
2. For numeric formatting, `#` characters define digit positions. Include a
decimal point in the format to specify the number of decimal places. For
example, `###.##` displays a number with up to 3 integer digits and 2
decimal digits.
3. For string formatting, `&` characters define the display width. The string
is displayed with a length matching the number of `&` characters.
4. This formatting also works with `LPRINT USING` for printer output and
`PRINT # USING` for file output.

### See
- [PRINT](PRINT.md)
- [LPRINT](LPRINT.md)
- [PRINT#](PRINT_HASH.md)

### Sample Program
```basic
10 X = 3.14159
20 PRINT USING "###.##"; X
30 A$ = "HELLO"
40 PRINT USING "&&&&&&&&&&"; A$
```
Displays `  3.14` and `HELLO     ` with formatted output.
