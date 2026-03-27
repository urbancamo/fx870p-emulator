*back to [CONTENTS...](casio-fx850-owners-manual.md)*

# PART 7 - PERIPHERAL DEVICES

A variety of peripheral devices are available for connection to this unit
to provide even more computing power.

### System Configuration

[DIAGRAM]

## CASSETTE INTERFACE UNIT FA-6

### Features

The FA-6 is an interface unit which makes it possible to use a cassette tape recorder as 
an external data storage device. Besides a cassette interface, the FA-6 is also equipped with
an RS-232C interface and a Centronics standard printer interface.

The RS-232C interface connector, printer interface, cassette interface and an AC adapter
jack are located on the back of the FA-6. The battery compartment is located on the bottom
of the unit. Batteries are loaded by removing the battery compartment cover and inserting
batteries while ensuring that their polarities ( ⊕ ⊖ ) are as illustrated in the compartment.

[DIAGRAM]

### Connections

Ensure that the power of both the computer and interface unit is switched OFF before 
attempting connections. Once connected, power should be switched ON for the computer first
then the interface unit.

### Cassette Interface

The cassette interface is used for connection of a cassette recorder to make it possible
to store programs on cassette tapes and to later reload the programs into computer memory.
Connection to the cassette tape recorder is accomplished using the optional SB-7 connecting
cable. The red plug is inserted into the MIC or LINE IN jack (labeling differs according 
to type of recorder used) of the recorder, while the while plug is inserted into the EAR or
LINE OUT jack of the recorder. The black plug is inserted into the REM jack of recorders
equipped with a remote function.

[DIAGRAM]

**NOTE:**

The remote plug is not used when the recorder being used is not equipped with a remote
function.

The recorder should be set to its RECORD mode when performing recording of programs
or data. For program loading, set the recorder to its PLAYBACK mode after executing the
[LOAD](commands/LOAD_LOAD_ALL.md) command.

### Single Program Save

[SAVE](commands/SAVE_SAVE_ALL.md) "file descriptor" **EXE** (file descriptor may be omitted)

The file descriptor can contain any symbols, characters, or numbers (execpt quotation marks).

**EXAMPLE:**

[SAVE](commands/SAVE_SAVE_ALL.md) "CAS0:AD1990" **EXE**

*"CAS0:" may be omitted.

### Loading/Saving All Programs

[SAVE ALL](commands/SAVE_SAVE_ALL.md) "file descriptor" **EXE**

[LOAD ALL](commands/LOAD_LOAD_ALL.md) "file descriptor" **EXE** 

*(file descriptor maty be omitted).

The [SAVE ALL](commands/SAVE_SAVE_ALL.md) command saves all of the programs stored in program 
areas P0 through P9 to cassette tape. [LOAD ALL](commands/LOAD_LOAD_ALL.md), on the other hand,
loads programs saved using the [SAVE ALL](commands/SAVE_SAVE_ALL.md) command. The 
[LOAD ALL](commands/LOAD_LOAD_ALL.md) command also clears anyt contents present in the program areas
and replaces them with the programs from the cassette tape.

### Saing and Loading Data Bank Data

The [SAVE#](commands/SAVE_HASH.md) and [LOAD#](commands/LOAD_HASH.md) commands are used for the
saving and loading of memo data stored in DATA BANK. The procedure for using these commands is 
identical to that described for [SAVE](commands/SAVE_SAVE_ALL.md) and [LOAD](commands/LOAD_LOAD_ALL.md) above.

### Saved File Verification

The [VERIFY](commands/VERIFY.md) command checks whether the program or data saved to the cassette
tape matches exactly the current memory contents.

[VERIFY](commands/VERIFY.md) "file descriptor" (file descriptor may be omitted).

### Tape Recorder Operation

The recorder should be set to its RECORD mode before the [SAVE](commands/SAVE_SAVE_ALL.md) command
is executed. For program loading, set the recorder to its PLAYBACK mode and then execute the 
[LOAD](commands/LOAD_LOAD_ALL.md) command.

The [SAVE](commands/SAVE_SAVE_ALL.md), [SAVE ALL](commands/SAVE_SAVE_ALL.md),
[LOAD](commands/LOAD_LOAD_ALL.md), [LOAD ALL](commands/LOAD_LOAD_ALL.md),
[SAVE#](commands/SAVE_HASH.md), and [LOAD#](commands/LOAD_HASH.md) commands cannot be used
in the CAL mode or within programs. They can, however, be used during manual operations in the
BASIC mode.

## RS-232C Interface

### RS-232C Switch

The RS-232C interface can be used for data communications after the RS-232C/Cassette switch
is set to RS-232C.

### Specifications


| Feature                  | Details                                         |
|--------------------------|-------------------------------------------------|
| Communication method     | Start-stop (asynchronous) full-duplex mode only |
| Transmission speed       | 150, 300, 600, 1200, 2400, 4800 baud            |
| Parity bit               | Odd, Even, None                                 |
| Character bit length     | 7 or 8 bits                                     |
| Stop bits                | 1 or 2 bits                                     |
| CTS signal control       | Control/no control                              |
| DSR signal control       | Control/no control                              |
| CD signal control        | Control/no control                              |
| Busy control             | XON/XOFF control/no control                     |
| Input/output code system | SI/SO control/no control                        |

### Pin Configuration

```
  1────────────────────────13
┌────────────────────────────┐
 ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿   
  ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿ ⦿  
└────────────────────────────┘ 
   25─────────────────────14 
```

| Terminal number | Signal name | I/O    |
|----------------:|-------------|--------|
|               1 | FG          |        |
|               2 | TXD         | OUTPUT |
|               3 | RXD         | INPUT  |
|               4 | RTS         | OUTPUT |
|               5 | CTS         | INPUT  |
|               6 | DSR         | INPUT  |
|               7 | GND         |        |
|               8 | DCD         | INPUT  |
|               9 | NC          |        | 
|              10 | NC          |        | 
|              11 | NC          |        | 
|              12 | NC          |        | 
|              13 | NC          |        | 
|              14 | NC          |        | 
|              15 | NC          |        | 
|              16 | NC          |        | 
|              17 | NC          |        | 
|              18 | NC          |        | 
|              19 | NC          |        | 
|              20 | DTR         | OUTPUT |
|              21 | NC          |        | 
|              22 | NC          |        | 
|              23 | NC          |        | 
|              24 | NC          |        | 
|              25 | NC          |        |

*SEE PART 9 FILE HANDLING FUNDAMENTALS for details on using the RS-232C interface.

## Centronics Interface (Printer Interface)

### General

The Centronics interface is used to output data processing results or program lists to a printer.
Any Centronics printer can be connected to the computer via the FA-6 interface unit.

### Pin Configuration
```
 ┌─────────────────────────────────┐
 │    7┌──┬──┬──┬──┬──┬──┬──┐1     │ 
 │ ┌───┴──┴──┴──┴──┴──┴──┴──┴───┐  │
 │ │                            │  │
 │ └───┬──┬──┬──┬──┬──┬──┬──┬───┘  │ 
 │   14└──┴──┴──┴──┴──┴──┴──┘8     │
 └─────────────────────────────────┘
```

| Terminal number | Signal name | 
|----------------:|-------------|
|               1 | PSTB        |
|               2 | PDB0        |
|               3 | PDB1        |
|               4 | PDB2        |
|               5 | PDB3        |
|               6 | PDB4        |
|               7 | PDB5        |
|               8 | PDB6        |
|               9 | PDB7        | 
|              10 | NC          |
|              11 | BUSY        | 
|              12 | NC          | 
|              13 | NC          | 
|              14 | GND         | 

### BASIC Printer Commands

| Command                      | Function                                             | 
|:-----------------------------|------------------------------------------------------|
| [LLIST](commands/LLIST.md)   | Outputs program contents to printer                  |
| [LPRINT](commands/LPRINT.md) | Outputs specified characters to printer              |
| [TAB](commands/TAB.md)       | Outputs spaces up to a specified position to printer |

### PRT ON Mode

Setting the unit to the PRT ON mode ( **MODE** **7** ) and then executing the 
[PRINT](commands/PRINT.md), [LIST](commands/LIST.md) or [VARLIST](commands/VARLIST.md)
commands prints out the results of such command execution and object data specified by 
the [TRON](commands/TRON.md) command on the printer. Including **MODE7** within a program 
prints out all contents of the subsequent print commands. The PRT ON mode can be cancelled by
**MODE** **8** or **MODE8** (PRT OFF).

*See the FA-6 manual for details on its proper operation.

## PLOTTER-PRINTER (FP-100)

The FP-100 is a four-colour plotter-printer capable of printing on A4 size paper.

The FP-100 has both a character mode and a graphics mode which makes it possible to print
on virtual any type of computer output.

**Character mode:** Program lists, calculation results

**Graphics mode:** Graphics produced by graphics commands

### Specifications

4-color printing in black, red, blue, green

| Feature           | Details | 
|:------------------|---------|
| Character effects | Italics |
| Print resolution | 0.1mm/step | 
| Paper width | Postcard size to letter size | 
| Character size | 1.0mm x 1.2mm (S0,0) ~ 16.0mm x 19.2mm (S15,15); 256 types |

### Connections

This unit is connected to FP-100 via the FA-6 interface unit and PK-7 printer cable.

*Use only CASIO PK-7 printer cable

[DIAGRAM]

### Data Printing

Program lists are output to the printer using the BASIC [LLIST](commands/LLIST.md) command.
Execution of the [LLIST](commands/LLIST.md) command prints out the curently acccessed program.

The [LPRINT](commands/LPRINT.md) command is used to print out data within a program, while 
execution of the [LLIST#](commands/LLIST_HASH.md) command in the BASIC mode ( **MODE** **1** )
prints data bank contents.

*See the FP-100 manual for details on its proper operation.

## CHARACTER PRINTER (FP-40)

The FP-40 can be used to print out data or program lists of programs written on the computer.

*Addition of an optional interface pack also makes it possible to use the FP-40 with PB-100 
series and PB-700 series computers.

### Specifications

|Feature| Details|
|:------|--------|
|Print method|Thermal print system (non-impact)|
|Columns| 40 standard (normal mode), 80 maximum (80CHR mode)|
|Print speed| Approximately 0.65 lines/sec (normal mode)|
|Paper feed| 1/6 inch or 1/9 inch|
|Roll paper|Width 112mm, o.d. 30mm maximum; thermal paper (TRP-112)|

### Connection

this unit is connected to the FP-40 via the FT-6 interface unit, PK-7 printer cable, 
and SB-43 interface pack.

[DIAGRAM]
*See the FP-40 manual for details on its proper operation.

## RAM EXPANSION PACK (RP-8 (8KB)), (RP-33 (32KB))

This unit comes equipped with a standard RAM of 8K bytes (FX-850P), 32K bytes (FX-880P).
RAM expansion packs are also optionally available for larger programs and for handling larger
quantities of data. Addition of the RP-8 RAM pack expands memory capacity to 16K bytes
(FP-850P), 40KB (FX-880P), while the RP-33 RAM pack expands memory to 40K bytes (FX-850P),
64K bytes (FX-880P).

### Expanded Memory Map

```
0000    ┌────────────────────────────────┐
        │                                │
        │                                │
        │                                │
        │         SYSTEM AREA            │
        │                                │
        │                                │
        │                                │
        ├────────────────────────────────┤ 
        │    STRING VARIABLE DATA        │ ⎫
0B8     ├───┬────────────────────────────┤ │
      ⎧ │   ↓  VARIABLE FREE AREA        │ │ FX-850P: 1536 bytes with RP-8
      │ │  (Capacity checked by FRE0)    │ ⎬          8192 bytes with RP-33
      │ │   ↑                            │ │ FX-880P: 8192 bytes
      │ ├───┴────────────────────────────┤ │
      │ │     NUMERIC VARIABLE DATA      │ │
      │ ├────────────────────────────────┤ │
      │ │         VARIABLE TABLE         │ ⎭
      │ ├────────────────────────────────┤
      │ ├────────────────────────────────┤
      │ │            P0 AREA             │ ⎫
      │ ├────────────────────────────────┤ │
      │ │            P1 AREA             │ │
      │ ├────────────────────────────────┤ │
User's⎨ │               :                │ │
area  │ │               :                │ │ FX-850P: 11728 bytes with RP-8
      │ ├────────────────────────────────┤ ⎬          29648 bytes with RP-33
      │ │            P9 AREA             │ │ FX-880P: 29648 bytes with RP-8
      │ ├────────────────────────────────┤ │          54224 bytes with RP-33
      │ │        DATA BANK AREA          │ │          
      │ ├────────────────────────────────┤ │
      │ │                                │ │
      │ │           FREE AREA            │ │
      │ │  (Capacity checked by FRE1)    │ │
      ⎩ │                                │ ⎭
        ├────────────────────────────────┤
        │         CONTROL AREA           │
        └────────────────────────────────┘ 
```

### Handling RAM Packs

**Preparation**

Static electrical charges can damage internal circuitry of RAM packs. Be sure to touch a 
door knob or some other metal fixture to discharge static electricty before handling
RAM packs.

**Procedure**

➀ Switch the power of the unit OFF.

➁ Remove the back cover of the unit after removing the two screws holding it in place.

```
 ┌─────────────────────────────────┐
 │ ⊕ ←Screw               Screw→ ⊕ │ 
 │                                 │
 │  ◎                              │
 │  ↑                              │
 │  P Button                       │
 └─────────────────────────────────┘
```

➂  Insert the RAM pack into the socket provided in the unit and fasten it in place using the three screws provided.
*Never touch the RAM pack connector or PCB pad.

```
 ┌─────────────────────────────────┐
 │     Socket                      │ 
 │     ↓                           │
 │   ┌──⊕┐←PCB pad                 │
 │   │   ⊕                         │
 │   └──⊕┘                         │
 └─────────────────────────────────┘
```

➃ Replace the back cover of the unit and fasten it in place using the two screws.

➄ Switch the power of the unit ON and press the **P** button. Next, press the ALL RESET button and switch the power of the unit OFF and then ON again. 

* Failure to press the **P** button and ALL RESET button after inserting
  or removing the RAM pack can result in altered unit memory contents.
* Dirt, dist, or finger prints on the RAM pack connector or PCB pad can result in poor connection and malfunction. Never touch connectors.
* Be sure to store RAM packs in their original cases when removed from the computer and store in an area free of dirt or dust.
