## DIM

### Purpose
Declares an array.

### Format
```basic
DIM array name ( subscript maximum value [ , superscript maximum value ]* )
                 └──────────┬──────────┘     └───────────┬───────────┘
                   Numeric expression           Numeric expression

[ ,  array name ( subscript maximum value [ , superscript maximum value ]* ) ]*
                 └──────────┬──────────┘     └───────────┬───────────┘
                   Numeric expression           Numeric expression
```

### Example
```basic
DIM A$(10, B$(10), X (2, 2, 2)
```

### Parameters
1. array name: Variable name
2. subscript maximum value: Numeric expression truncated to an integer

### Explanation
1. Declares an array of the dimensions determined by the number of subscript 
maximum values. The size of the array is determined by each subscript maximum value.
2. Array elements range from 0 through the specific subscript maximum value.
3. All elements of a newly declared array are set to their initial value. For
numeric arrays the initial value is 0, while string arrays are assigned null strings
   (length 0).
4. The size of an array is limited by available memory capacity. Declaration by the DIM 
statement is subjected to the limitations specified for logical lines (255 characters).
5. Declaring identical (same array name same subscript maximum value) in the same 
program causes the second declaration to be discarded. Declaring two arrays with identical
names and different subscript maximum values results in a [DD](../part-12-2-error-messages.md#dd-error) error.
6. An array variable cannot be used unless they are first declared in a DIM statement.

### See
- [ERASE](ERASE.md)
- [CLEAR](CLEAR.md)

### Sample Program
```basic
10  DIM A$(5)
20  FOR I=65 TO 70
30  A$(I-65)=CHR(I)
40  PRINT A$(I-65);
50  NEXT I
```
Respectively assigns A through F to array cells A$(0) through A$(5).


