*back to [Table of Contents](index.md)*

# Error Messages

When an error occurs during program execution or direct command entry, the calculator displays an error message in the format:

```
XX error Pn--line
```

Where `XX` is the two-letter error code, `n` is the program area number (0-9), and `line` is the line number where the error occurred. In direct mode, the line number is omitted.

## Error Code Reference

| Code | Error | Message | Description | Common Causes / Workaround |
|-----:|-------|---------|-------------|---------------------------|
| 1 | OM | OM error | Memory overflow | Not enough free memory to execute the operation. The CLEAR statement value may be too large to secure the required memory. Reduce program size, reduce array dimensions, lower CLEAR value, or free memory with ERASE. |
| 2 | SN | SN error | Syntax error | Incorrect command or statement format. Check spelling of commands, matching parentheses, and proper use of delimiters. |
| 3 | ST | ST error | String too long | A string operation produced a result exceeding 255 characters. Break the operation into smaller parts or reduce string lengths. |
| 4 | TC | TC error | Too complex | The formula or expression is too deeply nested or complex for the evaluation stack. Simplify the expression by breaking it into intermediate variables. |
| 5 | BV | BV error | Buffer overflow | The I/O buffer overflowed, or a program line exceeds 256 bytes. Shorten the line or split it into multiple lines. |
| 6 | NR | NR error | Not ready | An I/O device is not ready, or a file operation was attempted on a file that has not been opened. Check cable connections and ensure OPEN was called before file I/O. |
| 7 | RW | RW error | Read/Write error | An error occurred during I/O device operation (cassette tape, printer, or disk). Check connections and retry. |
| 8 | BF | BF error | Bad filename | Invalid file name specification. File names must follow the naming rules for the target device. |
| 9 | BN | BN error | Bad file number | Invalid file number specified in a file operation. File numbers must be in the valid range (#1 for FX-850P/880P, #1-#4 for FX-870P/VX-4). |
| 10 | NF | NF error | Not found | The specified file name was not found on the storage device. Check the file name spelling and use FILES to verify the file exists. |
| 11 | LB | LB error | Low battery | No power supply detected for the MD-110S floppy disk drive. Check the power connection to the disk drive. |
| 12 | FL | FL error | Full | The floppy disk is full, or a program file exceeds 64K bytes. Delete unnecessary files or use a new disk. |
| 13 | OV | OV error | Overflow | A numeric calculation produced a result exceeding the valid range (absolute value greater than 9.999999999 x 10^99). Scale the calculation or check for runaway values. |
| 14 | MA | MA error | Math error | A mathematical operation is invalid: division by zero, square root of a negative number, LOG of zero or negative, or function argument out of the valid range. Add input validation before the calculation. |
| 15 | DD | DD error | Duplicate dimension | An array was declared with DIM more than once without an intervening ERASE. Use ERASE before re-dimensioning, or dimension the array only once. |
| 16 | BS | BS error | Bad subscript | An array subscript is out of the declared range. Check that index values are within 0 to the DIM'd maximum. |
| 17 | FC | FC error | Function call error | An invalid argument was passed to a function (e.g., negative argument to LEFT$, MID$ position of 0). Validate arguments before calling the function. |
| 18 | UL | UL error | Undefined line | A GOTO or GOSUB references a line number that does not exist in the program. Verify target line numbers exist. Use RENUM if line numbers have changed. |
| 19 | TM | TM error | Type mismatch | A string value was used where a number was expected, or vice versa. Check variable types (string variables end with $). |
| 20 | RE | RE error | Resume error | A RESUME statement was executed without a preceding error (no active ON ERROR GOTO handler). Ensure RESUME is only reached via an error handler. |
| 21 | FO | FO error | FOR without NEXT | A FOR loop has no matching NEXT statement. Add the missing NEXT, or check that GOTO/GOSUB does not skip over it. |
| 22 | NX | NX error | NEXT without FOR | A NEXT statement was encountered without a matching FOR. Check loop structure and ensure GOTO/GOSUB does not jump into the middle of a loop. |
| 23 | GS | GS error | GOSUB error | The GOSUB stack has overflowed (too many nested subroutine calls), or a RETURN was executed without a matching GOSUB. Reduce nesting depth or restructure the program. |
| 24 | DA | DA error | Out of data | A READ statement was executed but there are no more DATA values to read. Add more DATA statements or use RESTORE to reset the data pointer. |
| 25 | OP | OP error | Open error | A file is already open (attempted to OPEN a file that is already open), or another OPEN-related error occurred. CLOSE the file before reopening. |
| 26 | AM | AM error | Argument error | An invalid argument was supplied to a command or function. Check the documentation for valid argument ranges. |
| 27 | FR | FR error | File read error | An error occurred while reading a file. The file may be corrupted or the wrong file type was specified. |
| 28 | PO | PO error | Verification error | The VERIFY command found a mismatch between the program in memory and the program on tape. The tape save may be corrupted; try SAVE again. |
| 29 | PR | PR error | Printer error | A printer communication error occurred. Check that the printer is connected, powered on, and has paper. |
| 30 | FM | FM error | Format error | A formatting error occurred, typically with PRINT USING or numeric formatting. Check the format string for valid format characters. |
| 31 | DF | DF error | Disk format error | The floppy disk is not formatted or has a format error. Use FORMAT to format the disk before use. |

## Notes

- The **LB error** (error code 11) has been deleted in the FX-890P and Z-1. These models do not support the MD-110S floppy disk drive and use different storage peripherals.

- When an error occurs inside an ON ERROR GOTO handler, the error is reported immediately and cannot be trapped again (to prevent infinite error loops).

- The ERR variable holds the error code number (1-31) and ERL holds the line number where the error occurred. These can be used inside an ON ERROR GOTO handler to identify and respond to specific errors programmatically:

```basic
100 ON ERROR GOTO 900
...
900 IF ERR=13 THEN PRINT "Overflow!":RESUME NEXT
910 IF ERR=14 THEN PRINT "Math error!":RESUME NEXT
920 PRINT "Error";ERR;"at line";ERL:END
```

---

*back to [Table of Contents](index.md)*
