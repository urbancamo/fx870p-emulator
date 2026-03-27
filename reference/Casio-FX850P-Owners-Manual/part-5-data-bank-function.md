*back to [CONTENTS...](casio-fx850-owners-manual.md)*


# PART 5 - DATA BANK FUNCTION

The DATA BANK function built into this unit gives it the capability to totally replace a standard
notebook. For the sake of example here, the following scientific constant table will be input
into the unit's DATA BANK

**SCIENTIFIC CONSTANT TABLE**

| Name                                | Symbol | Numeric value     | Unit    | Remarks     |
|-------------------------------------|--------|:------------------|---------|-------------|
| Acceleration of free fall           | g      | 9.80665           | ms⁻²    | FREE FALL   |
| Speed of light (in space)           | c      | 2.99792458 × 10⁸  | ms⁻¹    | SPEED LIGHT |
| Planck's constant                   | h      | 6.626176 × 10⁻³⁴  | Js      | PLANCK'S    | 
| Gravitational constant              | G      | 6.672 × 10⁻¹¹     | Nm²kg⁻² | GRAVITATION |
| Elementary charge                   | e      | 1.6021892 × 10⁻¹⁹ | C       | ELEMENTARY  |
| Electron mass                       | me     | 9.109534 × 10⁻³¹  | kg      | ELECTRON    |
| Atomic mass                         | u      | 1.6605655 × 10⁻²⁷ | kg      | ATOMIC      |
| Avogadro constant                   | Nₐ     | 6.022045 × 10²³   | mol⁻¹   | AVOGADRO    |
| Boltzmann's constant                | k      | 1.380662 × 10⁻²³  | JK⁻¹    | BOLTZMANN'S | 
| Molar volume of ideal gas at s.t.p. | Vm     | 2.241383 × 10⁻²   | m³mol⁻¹ | IDEAL GAS   |

## DATA INPUT 

The MEMO mode must be entered using the operation **MODE** **9** to allow input of data into the
DATA BANK. At this time, the display should appear as illustrated below:

```
                           Mode symbol       Record number
                                  ↓          ↓
        ┌─────────────────────────────────────────────┐
        │   CAPS          DEG    MEMO IN     1        │
        │                                             │
        │ ¯                                           │
        └─────────────────────────────────────────────┘
          ↑
          Cursor                  
```

The symbols appearing in the center of the top line of the display
indicate that the current mode is the MEMO IN mode. The value on the
upper right indicates the record number, which is actually DATA BANK
data line number. The record number 1 indicates that there is still
no data stored. The following is the procedure to enter the constant
for the acceleration of free fall.

**OPERATION:**

`CAPS G ,` → Lower case for input of g

`9 . 80665 , ` → Numeric value input

`M S - 2     ` → Lower case for input of ms⁻²

`SPC CAPS F R E E SPC F A L L EXE` → Upper case for remark input

Multiple items (i.e. symbols and values) can be included within a line
by separating them with commas. The final step of the operation is 
the **EXE** key which writes the data into memory. This operation also
causes the cursor to disappear from the display. Either press **EXE** again
to display the cursor at the upper left or simply enter the first character
for the next record. Either procedure switches to the next record number
for entry of the next item.

**OPERATION:**

`CAPS C ,` → Lower case for input of c

`2.99792458 𝔼 8 , ` → Numeric value input (exponent entered using 𝔼 )

`M S - 2     ` → Lower case for input of ms⁻²

`SPC CAPS S P E E D SPC L I G H T EXE` → Upper case for remark input

In this example, the value used as an exponent is entered using the **𝔼** key.
Note that both upper case and lower case letters were used in the first two lines.
Always check the display for the current mode. The indicator **CAPS** indicates the upper case mode,
while a clear display at the **CAPS** position indicates lower case.

Repeat the procedures outlined above until all ten constants are stored, 
and then switch to the CAL mode by pressing **MODE** **0**.

## DATA DISPLAY

All the data stored can now be displayed to check for proper input.
While in the CAL mode, press the **MEMO** key to display records 1 and 2.
Note here that only record 1 is displayed if its length exceeds 32 characters.

```
        ┌──────────────────────────────────┐
        │ g,9.80665,ms⁻2 FREE FALL         │ 
        │ c,2.99792458E8,ms⁻1 SPEED LIGHT  │ 
        └──────────────────────────────────┘
```
Pressing **↓** or **EXE** at this time displays record 2 and 3.
Pressing **↑** or **SHIFT** **EXE** at any time displays the preceding record.

```
        ┌──────────────────────────────────┐
        │ c,2.99792458E8,ms⁻1 SPEED LIGHT  │ 
↓       │ h,6.626176E⁻34,Js PLANCK'S       │ 
        └──────────────────────────────────┘
```
*Note that the scrolling key operations noted above differ as follows:

| Operation         | Results                  |
|-------------------|--------------------------|
| **EXE**           | Scrolls one record down. |
| **SHIFT** **EXE** | Scrolls one record up.   |
| **↑**             | Scrolls one line up.     |
| **↓**             | Scrolls one line down.   | 

## Data Editing

Editing of stored data is performed in the MEMO IN mode ( **MODE** **9** ).
Of course, data may also be changed during the input procedure
(before **EXE** is pressed) by moving the cursor to the desired
location using the cursor keys ( ← and → keys ) and then entering
the correct data.

The following procedure is used to edit data which has already
been stored.

1. Press **MODE** **9** (cursor not displayed).
2. Press **MEMO**.
3. Locate record to be changed in the first line of the display.
4. Press ← and → to display cursor (`EDIT` appears on display to 
   indicated EDIT mode).
5. Move cursor to desired location and enter correct data.
6. Press **EXE** ( `EDIT` disappears from display).

The following example assumes that an error is discovered in
RECORD 5 (elementary charge) during display in the CAL model.

```
        ┌─────────────────────────────────────────────┐
        │   CAPS CAL     DEG    MEMO        5         │
        │                                             │
        │ e,1.6.21892E-19,C ELEMENTARY                │
        │ me,9.109534E-31,kg ELECTRON                 │
        └─────────────────────────────────────────────┘
```

Press **MODE** **9** to enter the MEMO IN mode.

```
        ┌─────────────────────────────────────────────┐
        │   CAPS CAL     DEG    MEMO IN      5        │
MODE 9  │                                             │
        │ e,1.6.21892E-19,C ELEMENTARY                │
        │ me,9.109534E-31,kg ELECTRON                 │
        └─────────────────────────────────────────────┘
```

Here, the cursor can be displayed by pressing ← and →. At this time,
the `EDIT` symbol also appears to indicate the EDIT mode.


```
        ┌─────────────────────────────────────────────┐
        │   CAPS          DEG    MEMO IN EDIT    1    │
→       │ e,1.6.21892E-19,C ELEMENTARY                │
        │ ¯                                           │
        └─────────────────────────────────────────────┘
          ↑
          Cursor                  
```

Move the cursor to the desired location and enter the correct data.
Finally, press **EXE** to complete the procedure ( `EDIT` disappears from display).

```
        ┌─────────────────────────────────────────────┐
        │   CAPS          DEG    MEMO IN     1        │
→→→→→0  │ e,1.6.21892E-19,C ELEMENTARY                │
EXE     │ ¯                                           │
        └─────────────────────────────────────────────┘
          ↑
          Cursor                  
```

## ADDING RECORDS

New records can be added to previously input records. Records can
either be appended to the end of existing records, or inserted between
to existing records.

### Data Append

1. Press **MODE** **9**. Unit standing by for input of next successive
   record following previously stored records.
2. Enter data to append new record.
3. Press **EXE** to complete procedure.

### Data Insert

1. Press **MODE** **9**.
2. Press **MEMO** key.
3. Use **EXE** or **SHIFT** **EXE** to display existing record to follow newly inserted record.
4. Enter data.
5. Press **EXE** to complete procedure.

The following example describes how to enter a record containing the
constant for the absolute temperature of water at 0ºC between record 
8 (Avogadro constant) and record 9 (Boltzmann's constant).


| Name                                 | Symbol | Numeric values | Unit | Remarks  |
|--------------------------------------|--------|----------------|------|----------|
| Absolute temperature of water at 0ºC | T0     | 273.15         | K    | ABS TEMP |

Enter the above data after displaying RECORD 8 on the first line of the display.

**OPERATION:**

`T 0, 273 . 15 , K ABS TEMP EXE`

The result of the operation is as follows:

RECORD 8: Avogadro constant
RECORD 9: Absolute temperature of water at 0ºC
RECORD 10: Boltzmann's constant
RECORD 11: Molar volume of ideal gas at s.t.p

*To insert new data into RECORD 1, press **SHIFT** **EXE** after 
displaying RECORD 1, and then enter data for record 1. At this time,
all following records are shifted downwards.

## DELETE DATA AND ALL CLEAR

### Data Delete

The following procedure is used to delete specific records from
previously stored data.

1. Press **MODE** **9**.
2. Press **MEMO** key.
3. Press **EXE** and recall record number to be deleted.
4. Press cursor key ( ← and → ) to display `EDIT` symbol.
5. Press **SHIFT** **CLS** **EXE** to delete currently displayed 
   record. All following records are shifted upwards.

### Data All Clear

Data bank contents are retained when the power of the unit is switched off and
when the [NEW](commands/NEW.md), [NEW ALL](commands/NEW.md) and [CLEAR](commands/CLEAR.md)
commands are executed. The following procedure is used to clear all
current contents of the data bank.

1. Press **MODE** **1** to enter the BASIC mode.
2. Enter **NEW#** **EXE** to execute [NEW#](commands/NEW_HASH.md) command
   and clear all data stored in DATA BANK.

**IMPORTANT**

Data cleared using the procedures outlined above cannot be recovered.
Only delete or clear data when no longer required.

## DATA SEARCH

Press the **MEMO** key while in the CAL mode or MEMO IN mode displays
record 1. Now, each press of the **MEMO** key shifts the cursor to the 
data to the right of the next comma following the current cursor position.

The **EXE** key can also be used to shift the cursor to the next data item,
and **SHIFT** **EXE** can be used to shift to the previous data item.

### Conditional Search

Conditional search makes it possible to designate a specific letter,
value or word (up to eight characters long) in order to quickly locate
a desired record within a large file. Entering <object data> **MEMO**
displays the first data item in which the <object data> appears 
immediately following a comma. Each subsequent press of **MEMO** displays
the following data item which contains the <object data> following a comma.

In the following example, enter **N** **MEMO** to locate the 
Avogadro constant.

```
        ┌─────────────────────────────────────────────┐
        │   CAPS CAL     DEG    MEMO        4         │
        │                                             │
        │ G,6.672E-11,Nm2kg-2 GRAVITATION             │
        │ e,1.6.21892E-19,C ELEMENTARY                │
        └─────────────────────────────────────────────┘
```

The first record to appear is record 4 (gravitational constant)
because it contains the letter N following a comma. Press **MEMO** 
again to display the next data item which satisfies the stated condition.

```
        ┌─────────────────────────────────────────────┐
        │   CAPS CAL     DEG    MEMO        8         │
        │                                             │
        │ Na,6.022045E23,mol-1 AVOGADRO               │
        │ k,1.380662E-23,JK-1 BOLTZMANN'S             │
        └─────────────────────────────────────────────┘
```

Here, the desired data item is located. Of course the **MEMO** key
can be pressed as many times as desired until the <object data>
are located. If none of the records contain the specified <object data>
the cursor is displayed and the unit stands by for further input.

## USING DATA BANK DATA IN PROGRAMS

Data stored within the DATA BANK can also be accessed from a BASIC program
using the following program commands.

---
### READ#

The standard [READ](commands/READ.md) command is generally used to read
[DATA](commands/DATA.md) statements contained within a program. The
[READ#](commands/READ_HASH.md) command, on the other hand, reads data from
the DATA BANK. Data are read in units from the beginning of a group of data
up to the next comma.

**FORMAT**: `READ#  variable name  [, variable name]`

As shown above, multiple variable names can be specified, with variable 
names being separated by commas. As with the standard [READ](commands/READ.md),
numeric data can only be assigned to numeric variables, and string data
to string variables. Mismatching variable types results in a 
[TM error](part-12-2-error-messages.md#tm-error), and executing the [READ#](commands/READ_HASH.md) 
command when data does not exist produces a [DA error](part-12-2-error-messages.md#da-error).
Any leading spaces in a group of data are skipped, unless the group is 
included within quotation marks.

---
### RESTORE#

As with the standard [RESTORE](commands/RESTORE.md) command, 
[RESTORE#](commands/RESTORE_HASH.md) can be used to designate a specific
position from which the [READ#](commands/READ_HASH.md) operation is to be 
performed.

**FORMAT**: `RESTORE#`

Simply executing [RESTORE#](commands/RESTORE_HASH.md) specifies that the next
[READ#](commands/READ_HASH.md) or [WRITE#](commands/WRITE_HASH.md) operation
is to be performed at the beginning of data currently stored in the DATA BANK.

**FORMAT**: `RESTORE# "object string"`

Including an object string with the [RESTORE#](commands/RESTORE_HASH.md) 
command specifies that the next [READ#](commands/READ_HASH.md) or 
[WRITE#](commands/WRITE_HASH.md) operation is to be performed from the data
item which begins with the specified object string contained in the 
DATA BANK. A [DA error](part-12-2-error-messages.md#da-error) is generated when the specified
object string does not exist. The maximum capacity for a
[WRITE#](commands/WRITE_HASH.md) operation is 255 characters, and exceeding
this value results in an error.

**FORMAT**: `RESTORE# "object string", 0`

The above format is identical to `RESTORE# "object string"`

**FORMAT**: `RESTORE# "object string", 1`

The above format specifies that the next [READ#](commands/READ_HASH.md) or
[WRITE#](commands/WRITE_HASH.md) operation is to be performed from the 
record which begins with the specified object string.

**FORMAT**: `RESTORE# "object string", {0 or 1}, {line number or # program area number`

The above format designates a jump to the specified line number or program
area number for the next [READ#](commands/READ_HASH.md) or 
[WRITE#](commands/WRITE_HASH.md) operation when the specified object
string does not exist.

---
### WRITE#

The [WRITE#](commands/WRITE_HASH.md) command is used within a program
to rewrite or delete DATA BANK data.

**FORMAT**: `WRITE# DATA BANK data`

The above format replaces existing data items with the specified 
DATA BANK data, starting from the current [READ#](commands/READ_HASH.md)/
[WRITE#](commands/WRITE_HASH.md) position. In the case that data A, B, C exist
in the DATA BANK, with data B specified for the next
[READ#](commands/READ_HASH.md)/[WRITE#](commands/WRITE_HASH.md) operation,
executing `WRITE# "Y,Z"` results in A, Y, Z, C. The data line specified
for the next [READ#](commands/READ_HASH.md)/[WRITE#](commands/WRITE_HASH.md)
operation is deleted when the [WRITE#](commands/WRITE_HASH.md) command
is executed without specifying DATA BANK data.

---

## DATA BANK FUNCTION APPLICATIONS

The data bank function can be usd to perform a variety of tasks in addition
to the applications outlined in this section of the manual.
Virtually any data imaginable can be stored.

### EXAMPLE:

The formula storage function can be used in combination with DATA BANK to
store, recall and execute formulas whenever they are needed.

```
    ┌─────┬─────────────────────────────────┐
    │  1  │ V = 4 * PI * R^3 / 3            │
    ├─────┼─────────────────────────────────┤
    │  2  │ S = PI * R^2                    │
    ├─────┼─────────────────────────────────┤
    │  3  │ Y = 3 * X^2 + 4                 │
    ├─────┼─────────────────────────────────┤
    │  4  │ Z = SIN X + COS Y               │
    ├─────┼─────────────────────────────────┤
    │  5  │ A = Z * 1.13 + X * 1.24         │
    └─────┴─────────────────────────────────┘
```

The five formulas listed above are stored in the DATA BANK. Recall the 
third formula, transfer it to the formula storage function, and then 
execute it (in the CAL mode).

```
         ┌────────────────────────────────┐
MEMO     │ V=4*PI*R^3/3                   │(Displays 1st formula)
         │ S=PI*R^2                       │
         └────────────────────────────────┘
         ┌────────────────────────────────┐
EXE      │ S=PI*R^2                       │(Displays 2nd formula)
         │ Y=3*X^2+4                      │
         └────────────────────────────────┘
         ┌────────────────────────────────┐
EXE      │ Y=3*X^2+4                      │(Displays 3rd formula)
         │ Z=SINX+COSY                    │
         └────────────────────────────────┘
         ┌────────────────────────────────┐
IN       │ Z=SINX+COSY                    │(Stores 3rd formula in
         │ A=Z*1.13+X*1.24                │ memory)
         └────────────────────────────────┘
         ┌────────────────────────────────┐
CALC     │ X?_                            │(Executes formula
         │                                │ stored in memory)
         └────────────────────────────────┘
```

**IMPORTANT**

Note that DATA BANK record lines are limited to 255 characters. Care should 
be exercised when making changes using the [WRITE#](commands/WRITE_HASH.md)
command not to exceed this limit. Doing so results in an error.

