*back to [CONTENTS...](casio-fx850-owners-manual.md)*

*back to [Part 12 Appendices...](part-12-appendices.md)*

## Error Messages Table

 - [AM error](#am-error)
 - [BF error](#bf-error)
 - [BN error](#bn-error)
 - [BS error](#bs-error)
 - [BV error](#bv-error)
 - [DA error](#da-error)
 - [DD error](#dd-error)
 - [FC error](#fc-error)
 - [FO error](#fo-error)
 - [FR error](#fr-error)
 - [GS error](#gs-error)
 - [MA error](#ma-error)
 - [NR error](#nr-error)
 - [NX error](#nx-error)
 - [OM error](#om-error)
 - [OP error](#op-error)
 - [OV error](#ov-error)
 - [PO error](#po-error)
 - [PR error](#pr-error)
 - [RE error](#re-error)
 - [RW error](#rw-error)
 - [SN error](#sn-error)
 - [ST error](#st-error)
 - [TC error](#tc-error)
 - [TM error](#tm-error)
 - [UL error](#ul-error)

### OM error

**Error Code:** 1

**Error Message:** OM error

**Meaning:**
1. Insufficient memory or system overflow.
2. Erroneous CLEAR statement specification.

**Correction:**
1. Shorten program and check array dimensioning.
2. Check CLEAR statement value.
3. Use RAM expansion pack.

---

### SN error

**Error Code:** 2

**Meaning:** Erroneous command or statement format.

**Correction:**
1. Check spelling of commands.
2. Check program input.

---

### ST error

**Error Code**: 3

**Meaning:** String length exceeds 255 characters.

**Correction:**
Shorten string to 255 characters or less.

---

### TC error

**Error Code**: 4

**Meaning:** Formula too complex.

**Correction:**
Divide formula into smaller sub-formulas

---

### BV error

**Error Code**: 5

**Meaning:** 
1. I/O buffer overflow.
2. Line length exceed 255 bytes or 255 characters.

**Correction:**
1. Set RS-232C baud rate to lower value or set XON/XOFF.
2. Keep lines 255 characters or less in length.

---

### NR error

**Error Code**: 6

**Meaning:** I/O device not ready for input/output.

**Correction:** Check connection and power switch of I/O device.

---

### RW error

**Error Code**: 7

**Meaning:** Error generated in I/O device operation.

**Correction:** Check I/O device.

---

### BF error

**Error Code**: 8

**Meaning:** Improper filename specification.

**Correction:** Check filename.

---

### BN error

**Error Code**: 9

**Meaning:** Improper file number specification.

**Correction:** Check file number.

---

### OV error

**Error Code**: 13

**Meaning:** Value exceeds allowable calculation result or input range.

**Correction:** Check values.

---

### MA error

**Error Code**: 14

**Meaning:**
1. Mathematical error such as division by zero.
2. Argument exceeds allowable calculation range.

**Correction:** Check expressions and values.

---

### DD error

**Error Code**: 15

**Meaning:** Double declaration of identical array.

**Correction:** Either erase previous array or use a different array name.

---

### BS error

**Error Code**: 16

**Meaning:** Subscript or parameter outside of allowable range.

**Correction:**
1. Check subscripts.
2. Increase size of arrays.

---

### FC error

**Error Code**: 17

**Meaning:**
1. Erroneous use of function or statement.
2. Illegal command used in direct mode or program mode.
3. Illegal command used in CAL mode.
4. Attempt to use undeclared array.

**Correction:**
1. Check argument values and statements.
2. Check for statements that can not be used in respective mode.
3. Check statements.
4. Declare array using [DIM](commands/DIM.md) statement.

---

### UL error

**Error Code**: 18

**Meaning:**
1. Branch destination line number does not exist.
2. Input of statement without line number in BASIC editing mode.

**Correction:**
1. Check line numbers.
2. Always use line numbers in BASIC editing mode.

---

### TM error

**Error Code**: 19

**Meaning:** 
1. Mismatch of variable type and contents.
2. Mismatch of [READ](commands/READ.md) statement variable and data.
3. Mismatc of [INPUT#](commands/INPUT_HASH.md) statement variable and data.

**Correction:** Check for illegal numeric assignment to string variables
or string assignment to numeric variable.

---

### RE error

**Error Code**: 20

**Meaning:** [RESUME](commands/RESUME.md) statement outside of 
error handling routine.

**Correction:** Check [RESUME](commands/RESUME.md) statement location.

---

### PR error

**Error Code**: 21

**Meaning:** Execution of command that cannot be used with password protected files.

**Correction:** Cancel password.


---

### DA error

**Error Code**: 22

**Meaning:** [READ](commands/READ.md) statement execution when no data present.

**Correction:** Check [READ](commands/READ.md) and [DATA](commands/DATA.md) statements.

---

### FO error

**Error Code**: 23 

**Meaning:** No [FOR](commands/FOR_NEXT_STEP.md) for [NEXT](commands/FOR_NEXT_STEP.md) statement.

**Correction:** Check for matching of [FOR](commands/FOR_NEXT_STEP.md) and [NEXT](commands/FOR_NEXT_STEP.md) statements.

---

### NX error

**Error Code**: 24

**Meaning:** No [NEXT](commands/FOR_NEXT_STEP.md) for [FOR](commands/FOR_NEXT_STEP.md) statement.

**Correction:** Check for matching of [FOR](commands/FOR_NEXT_STEP.md) and [NEXT](commands/FOR_NEXT_STEP.md) statements.

---

### GS error

**Error Code**: 25

**Meaning:** Mismatch of [GOSUB](commands/GOSUB.md) and [RETURN](commands/RETURN.md) statements.

**Correction:** Check for matching of [GOSUB](commands/GOSUB.md) and [RETURN](commands/RETURN.md) statements.

---

### OP error

**Error Code**: 28

**Meaning:**
1. Attempt to access unopened file.
2. Attempt to open already opened file.

**Correction:**
1. Execute [OPEN](commands/OPEN.md) statement.
2. [CLOSE](commands/CLOSE.md) file and then reopen.

---

### AM error

**Error Code**: 29

**Meaning:** Attempt to use output-related command for device opened
for input or vice versa.

**Correction:** Ensure proper use of input-related and output-related commands.

---

### FR error

**Error Code**: 30

**Meaning:** Framing error detected by RS-232C port.

**Correction:** Check RS-232C connection and data transmission methods.

---

### PO error

**Error Code**: 31

**Meaning:** Parity error or over run error detected by RS-232C port. 
Erroneous read from the cassette tape recorder.

**Correction:**
1. Check RS-232C connection and data transmission method.
2. Adjust the playback volume of the tape recorder.
3. Attempt using the phase which is opposite the current setting.
4. Clean the head ofthe tape recorder.
