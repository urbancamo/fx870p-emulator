*back to [Command Reference](../index.md#command-reference-alphabetical)*

## HYP SIN, HYP COS, HYP TAN

**[All Models]**

### Purpose
Returns the value of the corresponding hyperbolic trigonometric function value for the argument.

### Format
```basic
HYP SIN     (argument)
             └──┬───┘
       Numeric expression

HYP COS     (argument)
             └──┬───┘
       Numeric expression

HYP TAN     (argument)
             └──┬───┘
       Numeric expression
```
*The parenthesis enclosing the argument can be omitted when the argument
is a numeric value of variable.

### Example
```basic
HYP SIN(1.5)
```

### Parameters
argument: Numeric expression

HYP SIN |argument| <= 230.2585092
HYP COS |argument| <= 230.2585092

### Explanation
Returns the value of the corresponding hyperbolic function for the argument.
  - HYP SIN(*x*) : sinh x = (e^x - e^-x)/2
  - HYP COS(*x*) : cosh x = (e^x + e^-x)/2
  - HYP TAN(*x*) : tanh x = (e^x - e^-x)/(e^x + e^-x)

### See
- [HYP ASN, HYP ACS, HYP ATN](HYP_ASN_ACS_ATN.md)

### Sample Program
```basic
10  INPUT "INPUT NUMBER (UP TO 230)"; N
20  PRINT "HSN(";N;")=";HYPSIN N
30  PRINT "HCS(";N;")=";HYPCOS N
40  PRINT "HTN(";N;")=";HYPTAN N
50  END
```
Displays the hyperbolic functions for numeric input up to 230.
