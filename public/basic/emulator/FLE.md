# FLE Logger

A Fast Log Entry (FLE) logger for amateur radio contacts on the Casio FX-870P / VX-4. Records QSO data in FLE format to the memo (data bank) facility, with serial download via COM0.

## Features

- New log with preamble: callsign, operator, date, activity (POTA/SOTA/WWFF)
- Status line shows current callsign, reference, band, mode, and frequency
- Automatic band/mode/frequency detection from entered lines
- Resume previous log session
- View stored log (forward paging, 4 lines at a time)
- Clear all log data
- Download log via COM0 at 4800 baud

## Usage

1. Select **1=NEW** to start a new log
2. Enter callsign, operator, date, and optional activity reference
3. Type FLE-format lines at the `>` prompt:
   - Band/mode declarations: `2m fm 145.475`
   - QSO entries: `1204 m5tue/p 28.350 59 59 g/ld-050`
   - Comments: `# MYRIG: IC-705`
4. Type `q` to return to the main menu
5. Use **4=DOWNLOAD** to send the log out via serial port

## FLE Format

See the [Fast Log Entry](https://df3cb.com/fle/) documentation. Sample logs are in `reference/sfle/data/`.
