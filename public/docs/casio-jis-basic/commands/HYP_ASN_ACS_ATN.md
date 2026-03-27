*back to [Command Reference](../index.md#command-reference-alphabetical)*

## HYP ASN, HYP ACS, HYP ATN

**[All Models]**

### Purpose
Returns the value of the corresponding inverse hyperbolic function value for the argument.

### Format
```basic
HYP ASN     (argument)
             └──┬───┘
       Numeric expression

HYP ACS     (argument)
             └──┬───┘
       Numeric expression

HYP ATN     (argument)
             └──┬───┘
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
HYP ASN(10)
```

### Parameters
argument: Numeric expression
 - HYP ASN: |argument| < 5 x 10^99 (5E+99)
 - HYP ACS: 1 <= argument < 5 x 10^99 (5E+99)
 - HYP ATN: -1 < argument < 1

### Explanation
Returns the value of the corresponding inverse hyperbolic function
for the argument.
 - HYP ASN(x): sinh^-1 x = loge(x + sqrt(x^2 + 1))
 - HYP ACS(x): cosh^-1 x = loge(x + sqrt(x^2 - 1))
 - HYP ATN(x): tanh^-1 x = 1/2 * loge((1+x)/(1-x))

### See
- [ANGLE](ANGLE.md)
- [HYP SIN, HYP COS, HYP TAN](HYP_SIN_COS_TAN.md)

### Sample Program
```basic
10  INPUT "INPUT NUMBER (1 OR GREATER)"; N
20  PRINT "HAS(";N;")="; HYPASN N
30  PRINT "HAC(";N;")="; HYPACS N
40  END
```
Displays inverse hyperbolic function value for numeric input of 1 or greater.
