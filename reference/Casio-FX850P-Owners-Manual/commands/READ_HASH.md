## READ#

### Purpose
Reads data from DATA BANK area.

### Format
```basic
READ#  variable name [ , variable name ]*
```

### Parameters
variable name

### Explanation
1. Sequentially reads data stored in the DATA BANK area and assigns them to variables.
2. Numeric data can only be read into numeric variables, and string data only
into string variables. Mismatching data and variables generates an error.
3. Data items can be delimited by commas.
4. A [DA](../part-12-2-error-messages.md#da-error) error is generated when data are not present to be read.
5. The read sequence can be altered using `RESTORE#` command.
6. Spaces in front of data items are skipped.
7. Data included within quotation marks are read as a single string.
8. This command cannot be executed in the CAL mode, but in the BASIC mode.

### See
 - [RESTORE#](RESTORE_HASH.md)
 - [WRITE#](WRITE_HASH.md)

### Sample Program
```basic
10  RESTORE# "READ", 0, 50
20  READ# A$
30  PRINT A$
40  GOTO 10
50  PRINT "NO DATA!"
```

Searches and displays data items which start with "RED" within DATA BANK function.
Message "NO DATA!" appears when such data items are not found.
