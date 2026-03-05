# FLE Logger — Design & Implementation Plan

> Created: 2026-03-05
> Requirements: docs/fle-logger-requirements.md
> Output: public/basic/emulator/FLE.FX

## Overview

BASIC program for the Casio FX-870P that logs amateur radio contacts using Fast Log Entry (FLE) format. Data is stored in the memo (data bank) facility — one memo record per FLE line. Supports download via COM0 at 4800 baud.

## Menu Structure

```
1. New Log       — Preamble prompts, then entry loop
2. Resume Log    — Re-read memo state, continue entry loop
3. View Log      — Forward-only paginated display
4. Clear Log     — Delete all memo records (with Y/N confirmation)
5. Download      — Write all records to COM0 at 4800 baud
6. Quit
```

## Memo Storage Format

Each memo record is one line of FLE text, stored verbatim via WRITE#. Preamble generates:

```
mycall m5tea/p
operator m5tea
date 2025-12-29
mysota g/ld-050
```

Then each user-entered line becomes one record (comments, band declarations, QSO lines).

## Preamble Prompts (New Log)

1. Callsign
2. Operator
3. Date (YYYY-MM-DD)
4. Activity: (N)one, (P)OTA, (S)OTA, (W)WFF
5. If activity selected: reference (e.g. g/ld-050)

Stored immediately to memo after collection.

## Entry Loop

**Screen layout (32x4 LCD):**
- Row 0: Status line — `<callsign> <reference> <band> <freq>`
- Row 1-2: Last two entered lines
- Row 3: `>` prompt with INPUT

**Flow:**
1. Display status line and last two entries
2. INPUT L$ on row 3
3. If L$ = "q" → return to menu
4. Parse L$ for band/freq/mode changes (GOSUB 700)
5. WRITE# L$ to memo
6. Shift display: P$ = Q$, Q$ = L$
7. Loop

## Band/Frequency/Mode Parsing (GOSUB 700)

Two cases:

**Band declaration lines** — first token is a recognised band:
- Bands: 2m, 4m, 6m, 10m, 12m, 15m, 17m, 20m, 30m, 40m, 60m, 80m, 160m, 70cm, 23cm
- Modes: ssb, cw, fm, am, dv
- Extract band, then scan remaining tokens for mode and/or frequency (contains ".")

**QSO lines** — scan tokens for frequency (contains ".") to update freq only.

No validation of frequency vs band — just record and display.

## Resume Log (menu option 2)

1. RESTORE#
2. Read preamble lines — extract callsign and activity reference from `mycall`/`mysota`/`mypota`/`mywwff` prefixes
3. Continue reading all remaining lines, passing each through band/freq parser
4. Set P$ and Q$ to last two lines read
5. Jump into entry loop

## View Log (menu option 3)

1. RESTORE#
2. READ# and display 4 lines at a time
3. Any key to advance to next 4 lines
4. Q to return to menu
5. When no more records, show "END OF LOG" and return

## Clear Log (menu option 4)

1. Display "CLEAR ALL LOG DATA? Y/N"
2. INPUT$(1) — if not "Y" return to menu
3. Loop: RESTORE#, WRITE# (empty = delete current record) until all gone
4. Return to menu

## Download (menu option 5)

1. OPEN "COM0:6,N,8,1,N,N,N,N,N" FOR OUTPUT AS #1 (speed 6 = 4800 baud)
2. RESTORE#
3. Loop: READ# each record, PRINT #1 the line
4. CLOSE
5. Display "DOWNLOAD COMPLETE"
6. Return to menu

## Variables

| Var  | Purpose                          |
|------|----------------------------------|
| C$   | Callsign                         |
| O$   | Operator                         |
| D$   | Date                             |
| R$   | Activity reference line (full)   |
| B$   | Current band                     |
| M$   | Current mode                     |
| F$   | Current frequency                |
| L$   | Current input line               |
| P$   | Previous line (row 1 display)    |
| Q$   | Last line (row 2 display)        |
| K$   | Single keypress temp             |
| T$   | Temp for token parsing           |
| A$   | Activity type letter             |

## Line Number Ranges

| Range     | Purpose                              |
|-----------|--------------------------------------|
| 10-90     | Init, check existing memo, show menu |
| 100-190   | Main menu display and dispatch       |
| 200-390   | New Log — preamble prompts           |
| 400-490   | Resume Log — re-read memo state      |
| 500-690   | Entry loop — input, parse, store     |
| 700-790   | Band/freq/mode parsing subroutine    |
| 800-890   | View Log                             |
| 900-990   | Clear Log                            |
| 1000-1090 | Download via COM0                    |

## Implementation Order

1. Main menu skeleton (100-190) + Quit (just END)
2. New Log preamble (200-390) — prompts and WRITE# to memo
3. Entry loop (500-690) — input, store, display with status line
4. Band/freq/mode parser (700-790)
5. View Log (800-890)
6. Clear Log (900-990)
7. Resume Log (400-490)
8. Download (1000-1090)
9. Init/startup check (10-90)

Resume is implemented after entry loop and view log since it reuses both the parser and display logic.