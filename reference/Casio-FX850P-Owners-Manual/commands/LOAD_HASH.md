## LOAD#

### Purpose
Reads data into DATA BANK area.

### Format
```basic
LOAD#  ⎡  [ file descriptor   ⎤ ] [ , M ]
       ⎢    └──────┬──────┘   ⎥
       ⎣   String expression  ⎦
```

### Example
```basic
LOAD# "CAS0:TEST"
```

### Parameters
1. file descriptor: String expression
2. ,M: Indicates that current execution is append to existing data.

### Explanation
1. Reads data to the DATA BANK area from the file specified by the file descriptor.
2. The current contents of the DATA BANK area are deleted when `,M` is not specified.
Specifying `,M` indicates that the new data are to be appended to the end of the current contents of the DATA BANK area.
3. `CAS0:` is the default option when the device name is omitted from the file descriptor.
4. The first file on the cassette tape with an attribute (S) which matches the
one specified is the default option when the entire file descriptor is omitted.
5. This command cannot be executed in the CAL mode, but in the BASIC mode.

### Sample Execution
```basic
LOAD# "CAS0:TEL2", M
```
Reads memo data file stored on cassette tape under filename `TEL2` and appends to 
current DATA BANK area contents.

