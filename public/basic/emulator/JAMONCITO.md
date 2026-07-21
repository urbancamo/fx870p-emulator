# Jamoncito FX

An amateur-radio QSO logging tool for the Casio FX-870P / VX-4, written in JIS Standard BASIC by **EI3LH** ([www.ei3lh.eu](https://www.ei3lh.eu)). Designed for portable field activations (BOTA / POTA / SOTA / WWFF), it records contacts, keeps a software clock, and exports or prints the log.

The version in this library is **v0.2**; the original v0.1a release is at [github.com/EI3LH/jamoncito-fx](https://github.com/EI3LH/jamoncito-fx/releases/tag/Jamoncito_FX_v0.1a).

## Features

- **Log up to 50 QSOs** — date, time, callsign, RST sent/received, Maidenhead grid, activation type (BOTA/POTA/SOTA/WWFF/custom), frequency, mode (CW/SSB/FT8/RTTY/custom), and free-text notes
- **Software clock** — the FX-870P has no real-time clock, so the program keeps its own HH:MM:SS time with a calibration routine to tune the tick rate; expect some drift
- **Standby clock mode** — full-screen live clock and date; press any key to return to the menu
- **CSV export** — writes a header row plus one line per contact, to Casio floppy disk (`0:filename`) or RS-232 (`COM0:`)
- **Printing** — prints all records or a range to a Casio FP-40 style printer via `LPRINT`
- **Band plan reference** — quick IARU band plan and QRP CW frequencies page (still being expanded upstream)

## Main Menu

```
1=Log    2=Set    3=Exp   4=Abt
5=Plan   6=Clock  7=Prn   8=End
```

| Option | Function                                                          |
|--------|-------------------------------------------------------------------|
| 1      | Log menu — new contact, list/detail entries                       |
| 2      | Settings — set date/time, calibrate the clock                     |
| 3      | Export log as CSV to floppy or RS-232                             |
| 4      | About screen                                                      |
| 5      | IARU band plans and QRP CW frequencies                            |
| 6      | Standby clock display                                             |
| 7      | Print log (all or a range) to printer                             |
| 8      | Exit                                                              |

New contacts require the date and time to be set first (menu 2, or it is prompted at start). Times are entered as `HH:MM` (or `HHMM`), dates as `DD/MM/YY` (or `DDMMYY`); both are validated, including days-per-month and leap years.

## Clock Calibration

The clock ticks by counting busy-loop iterations, so its accuracy depends on the machine's speed. From **Settings → 2=Cal**: press EXE to start counting, then press any key when exactly 60 seconds have elapsed (use a real watch). The measured rate is stored in `W` and used for all subsequent timing.

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
3. Set the date and time when prompted, then use the menus

## Program Structure

```
Lines 10-48      Init: CLEAR, DIM L$(50,10), state variables, title
Lines 50-115     Main menu
Lines 200-240    Log menu (new / list / back)
Lines 300-499    New contact entry (all 10 fields, with validation)
Lines 600-720    List entries 3 at a time, drill into details
Lines 800-840    Settings menu (set date/time, calibrate)
Lines 900-1075   CSV export to floppy or RS-232, ON ERROR guarded
Lines 1150-1185  Export error handler (NO FLOPPY / NO RS-232)
Lines 1300-1315  About screen
Lines 1350-1370  IARU band plan reference
Lines 1400-1410  Exit
Lines 1500-1545  Standby clock with live seconds
Lines 1550-1695  Print all/range of records via LPRINT
Lines 2000-2150  Time input and validation
Lines 2200-2350  Date input and validation (leap-year aware)
Line  2500       "Press EXE" pause subroutine
Lines 3000-3050  Clock tick: seconds → minutes → hours → date rollover
Lines 3300-3415  Format helpers: T$=HH:MM, W$=HH:MM:SS, D$=DD/MM/YY
Lines 3450-3470  Days-in-month (with leap year)
Line  3500       Two-digit zero-padded number formatter
Lines 3600-3670  Clock calibration (count loops over a timed minute)
```

## About

Jamoncito FX was developed by EI3LH for QRP portable operating, and was built and tested using this browser-based FX-870P emulator. The log lives in the string array `L$(50,10)` and is lost when the program is re-run (`CLEAR` on line 10) — export or print before quitting if you want to keep it.
