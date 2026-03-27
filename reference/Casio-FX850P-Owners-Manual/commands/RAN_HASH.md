## RAN#

### Purpose
Returns a random value in the range of 0 to 1.

## Format
```basic
RAN#         ( argument )
               └──┬───┘
         Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
RAN# * 10
```

### Parameters
argument: Numeric expression

### Explanation
1. Returns a random value in the range of 0 to 1. (0<RAN#(X)<1)
2. Random numbers are generated from the same table when X=1.
3. The last random number generated is repeated when X=0.
4. Random numbers are generated from the random table when X=-1.
5. Random number generation begins with the same value each time
a program is executed. This means that the same series of numbers is
generated unless the argument of RAN# is omitted or is equal to -1.

### Sample Program
```basic
10  R=RAN#(1): PRINT R
20  R=RAN#(0): PRINT R
30  R=RAN#(-1): PRINT R
40  GOTO 10
```
Generates random numbers using each type (positive, negative, zero)
of the argument.
