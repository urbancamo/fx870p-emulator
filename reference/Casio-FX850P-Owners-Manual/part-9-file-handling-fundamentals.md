*back to [CONTENTS...](casio-fx850-owners-manual.md)*

# PART 9 - FILE HANDLING FUNDAMENTALS

## FILING DEVICES

Besides execution of programs currently stored in memory, this unit can also
employ cassette tapes for data and program storage. Data and programs can also
be exchanged with other devices via a communications circuit. The `OPEN`, 
`CLOSE`, `PRINT#`, `INPUT#`, `SAVE` and `LOAD` commands are used for these
purposes.

### Device Names

When using the commands noted above for file interchanges, it is first necessary
to specify whether cassette tape or the communications circuit is to be employed.
This is known as specifying a "device name". The following table shows the 
available device names:

| DEVICE NAME | MEANING                                 |
|-------------|-----------------------------------------|
| CAS0:       | Cassette tape recorder (positive phase) |
| CAS1:       | Cassette tape recorder (reverse phase)  |
| COM0:       | Communications circuit (RS-232C)        |

### Filenames

Once the device to be used is determined, the next thing to do is assign a 
"filename" to the file. A filename can be any combination of numeric and alphabetic
characters up to eight characters in length.

The unit automatically disregards any filename input exceeding the first eight
characters.

**NOTE**: Only one file can be open at any time. A program or subroutine, which
successively opens and closes files as they are required, should be prepared when
multiple files need to be accessed.

### File Descriptors

A "file descriptor" is actually a combination of a device name and a filename.
When using the communications circuit, the file descriptor also specifies various
communication parameters in addition to the device name and filename.

## FILE DESCRIPTORS

### Cassette Tapes

The following shows the file descriptor when a cassette tape is used for file
storage (using regular expression notation).

```
CAS[01]: [FS] filename
```

Phase specification
 - **CAS0**: Positive phase
 - **CAS1**: Reverse phase

Speed specification:
 - **S**: 300 baud (300 bits/second)
 - **F**: 1200 baud (1200 bits/second)

**EXAMPLE 1:**

Reading data of a file named `TEST`, at positive phase, 300 baud

`OPEN "CAS0: (S) TEST" FOR INPUT AS #1`

The file descriptor in this case is `CAS0: (S) TEST`

**EXAMPLE 2:**

Reading of a program under the filename `AD1990`

`LOAD "AD1990"`

This is the same as `LOAD "CAS0: (F) AD1990"`

The file descriptor commands which can be used as outlined above are:
 - `OPEN`, `LOAD`, `SAVE`, `LOAD#`, `SAVE#` and `VERIFY`

**NOTE:** `CAS0:` and `CAS1:` specify the read phase (positive/reverse) of data recorded
on tape. `CAS0:` is generally used, but `CAS1:` can be used for certain tape
recorders.

**NOTE:** An attribute is automatically assigned when a program or data is written
to cassette tape. Attributes can be checked when the tape is read.

| ATTRIBUTE | MEANING                                                                      |
|-----------|------------------------------------------------------------------------------|
| `B`       | Binary file (program file)                                                   |
| `A`       | All file (program file saved using SAVE ALL command)                         |
| `S`       | Sequential file (data file, memo file, or program file saved in ASCII format |

### Communications Circuit

The file descriptor for communications circuit data interchange is as follows:

`COM0: [[Speed]], [Parity], [Data], [Stop], [CS], [DS], [CD], [Busy], [Code]]`

#### `[Speed]` (baud rate : data transfer speed)

| Value | Meaning                   |
|-------|---------------------------|
| `6`   | 4800 baud (4800 bits/sec) |
| `5`   | 2400 baud (2400 bits/sec) |
| `4`   | 1200 baud (1200 bits/sec) |
| `3`   | 600 baud (600 bits/sec)   |
| `2`   | 300 baud (300 bits/sec)   |
| `1`   | 150 baud (150 bits/sec)   |

**NOTE:** 2400 (`5`) or less should be specified when the communications circuit
is specified using the `OPEN` statement.

#### `Parity` (parity bit : check bit for data send)

|Value|Meaning|
|-----|-------|
|`N`|No parity bit|
|`E`|Even parity|
|`O`|Odd parity|

#### `Data` (data bit : number of bits representing one character)

| Value | Meaning                      |
|-------|------------------------------|
| `7`   | JIS 7 bit (7 bits/character) |
| `8`   | JIS 8 bit (8 bits/character) |

#### `Stop` (stop bit : bit(s) at end of a character signifying character end)

| Value | Meaning |
|-------|---------|
| `1`   | 1 bit   |
| `2`   | 2 bits  |

#### `CS` (Clear to send (CTS) : control function to inform partner device whether or not data can be sent)

| Value | Meaning                                        |
|-------|------------------------------------------------|
| `C`   | Used - The sending device waits until CS is ON |
| `N`   | Not used                                       |

#### `DS` (Data set ready (DSR) : function to inform normal operation of partner device)

| Value | Meaning                                                                                                                  |
|-------|--------------------------------------------------------------------------------------------------------------------------|
| `D`   | Used - An `NR error` is generated when data are received while DS is OFF. When sending, the device waits until DS is ON. |
| `N`   | Not used                                                                                                                 |

#### `CD` (Carrier detect (CD) : function to inform partner device ready to receive data)

| Value | Meaning                                                                   |
|-------|---------------------------------------------------------------------------|
| `C`   | Used - An `NR error` is generated when data are received while CD is OFF. |
| `N`   | Not used                                                                  |

#### `Busy` (Busy, (XON/XOFF), function to temporarily suspend data send)

| Value | Meaning                                                                                                                                                                                                                                                                                                                        |
|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `B`   | Used - A send suspend request is sent to the partner device when the remaining number of characters to be read at one time is less than 64 during data receive. During data send, send it temporarily suspended when a send suspend request is received from the partner device. Sending is resumed upon a send start request. |
| `N`   | Not used                                                                                                                                                                                                                                                                                                                       |

#### `Code` (Input/Output code system (SI/SO) : Used to send character expressed as eight bits when data bits specified as seven)

|Value|Meaning|
|-----|-------|
|`S`|Used - This function is only applicable when the data bit parameter (`Data` above) is specified as seven bits. The `SO` code (`0x0E`) is sent before codes `0x80` or higher in this case to enter the `SO` mode. Codes `0x7F` or lower are sent preceded by the `SI` code (`0xF`) to enter the `SI` mode.|
|`N`|Not used|

#### Parameter Default Values

| Parameter | Default                 |
|-----------|-------------------------|
| `COM0`    | `2,E,8,1,N,N,N,B,N`     |
| Baud rate | 300 baud (300 bits/sec) |
| Parity    | Even                    |
| Data bits | 8 bits                  |
| Stop bit  | 1 bit                   |
| CS        | Not used                |
| DS        | Not used                |
| CD        | Not used                |
| Busy      | `XON`/`XOFF`            |
| Code      | `SI`/`SO` - Not used    |

### EXAMPLE 1:

Send the character string noted below to RS-232C using the parameters listed.

| Parameter | Setting                 | Value |
|-----------|-------------------------|-------|
| Baud rate | 300 baud (300 bits/sec) | `2`   |
| Parity    | Even                    | `E`   |
| Data bits | 8 bits                  | `8`   |
| Stop bit  | 1 bit                   | `1`   |
| CS        | Not used                | `N`   |
| DS        | Not used                | `N`   |
| CD        | Not used                | `N`   |
| Busy      | Used                    | `B`   |
| Code      | Not used                | `N`   |

```
10 OPEN "COM0:2,E,8,1,N,N,N,B,N" AS #1
20 PRINT #1, "HELLO."
30 CLOSE
```

### EXAMPLE 2:

Receive character string from RS-232C as above.

```
10 OPEN "COM0:2,E,8,1,N,N,N,B,N" AS #1
20 INPUT #1, A$
30 CLOSE
```

**NOTE:** Communications are performed via the RS-232C terminal.
**NOTE:** Data interchange is performed using full-duplex (both sides can 
communicate simultaneously, as with a standard telephone), start-stop system
(typical computer communications system, also known as asynchronous).
