# Lunar Lander — Conversion Plan (Z88/BBC BASIC to Casio FX-870P)

## Source

- **Program**: `lander28g.bas` by Mark Wickens, developed for Summer 2010 Retrochallenge
- **Location**: `reference/z88_lander/lander28g.bas` (229 lines, BBC/Z88 BASIC)
- **Documentation**: `reference/z88_lander/lander28g.txt`

## Game Summary

A real-time lunar landing simulation. The player controls a Lunar Excursion Module (LEM) descending to the moon's surface. Starting at 10,000m altitude with 500 m/s horizontal velocity, the player must:

1. **Braking phase**: Tilt the lander and fire the engine to slow horizontal speed
2. **Descent phase**: Manage vertical descent rate while approaching the landing site
3. **Landing**: Touch down within 500m of the landing site with both DX and DY below 6.0 m/s

Controls are real-time — the simulation runs on a 1-second tick cycle, reading keypresses non-blockingly between updates.

## Key Conversion Challenges

### 1. Display: 64x7 → 32x4

The original uses a 64-column, 7-row display with:
- 3 rows of instrument data (9 values: F, X, Y, DX, DY, BR, LA, VT, HT)
- 1 row of status indicators (FUEL, ASC, RADAR, CONTACT, ENGINE, RANGE)
- 2 vertical "tape" displays (ALT and VSI gauges, 7 rows tall)

The Casio has **32 columns x 4 rows**. Everything must be redesigned.

### 2. BBC BASIC → Casio BASIC Dialect

| BBC/Z88 Feature                 | Casio Equivalent                                                 |
|---------------------------------|------------------------------------------------------------------|
| `DEF PROC_name` / `ENDPROC`     | `GOSUB` / `RETURN` subroutines                                   |
| `REPEAT ... UNTIL`              | `GOTO`-based loops                                               |
| `PRINT TAB(x,y)`                | `LOCATE x,y : PRINT`                                             |
| `INKEY$(delay)`                 | `INKEY$` (no delay parameter — returns "" immediately if no key) |
| `TIME` pseudo-variable          | Not available — use busy loop or tick counter                    |
| `@%=&0102020A` (format control) | `INT(x*10)/10` for manual rounding                               |
| Named procedures with params    | Inline code or GOSUB with shared variables                       |
| Local variables in procs        | All variables are global                                         |

### 3. Real-Time Tick Timing

The original uses `TIME` (10ms resolution) and `INKEY$(delay)` with a timeout to create a ~1 second tick. Casio BASIC has `INKEY$` (confirmed working in LIFE.FX) but no timer variable.

**Approach**: Use a `FOR` delay loop calibrated to approximate 1-second ticks. The loop reads `INKEY$` on each iteration so keypresses aren't missed. With the TURBO button providing ~50x speed, the delay constant may need tuning. A variable `TK` controls tick length, letting the player adjust speed.

---

## Display Design

The display adapts to flight phase. At high altitude, all 32 columns are used for instrument data. Below 75m (radar altitude), the right 8 columns switch to analog-style ALT and VSI tape gauges for the critical landing phase — matching the original's design intent.

### Cruise Mode (Y > 75m) — Full Instrument Panel

All 9 values displayed across the full 32-column width:

```
Y:10000 DY:  0.0 F:25000
X:-30000 DX:500.0 BR: 0
LA: 60  VT: 0.0 HT: 0.0
FUEL ASC              +?
```

| Row | Content                                                            | Rationale                      |
|-----|--------------------------------------------------------------------|--------------------------------|
| 0   | `Y:` altitude, `DY:` vertical speed, `F:` fuel                     | The three most critical values |
| 1   | `X:` range, `DX:` horizontal speed, `BR:` burn rate                | Position and engine status     |
| 2   | `LA:` lander angle, `VT:` vertical thrust, `HT:` horizontal thrust | Attitude and thrust components |
| 3   | Status indicators + help hint                                      | Warnings and alerts            |

**Column layout** (32 chars):

Row 0: `Y:` (2) + value (5) + space + `DY:` (3) + value (5) + space + `F:` (2) + value (5) = 24-30 chars
- Y: integer when >100, 1 decimal when ≤100
- DY: always 1 decimal
- F: always integer

Row 1: `X:` (2) + value (6) + space + `DX:` (3) + value (5) + space + `BR:` (3) + value (3) = 24-28 chars

Row 2: `LA:` (3) + value (4) + spaces + `VT:` (3) + value (4) + spaces + `HT:` (3) + value (4) = 27 chars

### Radar Mode (Y ≤ 75m) — Instruments + Horizontal Tape Gauges

When altitude drops below 75m, the display switches to radar mode. VT and HT are dropped (derivable from LA+BR, and less critical when focused on touchdown). Row 2 becomes two **horizontal tape gauges** — ALT and VSI — giving much better resolution than vertical tapes would on a 4-row screen.

```
Y:45.2 DY:-3.1 F: 3200
X: 120 DX: 2.3 BR:40 LA:0
A:--->---------- V:---->----
CONTACT RANGE    0       -10
```

**Rows 0-1**: Core instruments compressed to 2 rows (Y, DY, F, X, DX, BR, LA)

**Row 2**: Two horizontal tape gauges side-by-side

**Row 3**: Status indicators + scale labels for the tapes

#### ALT Tape (columns 0-15, row 2)

A 14-character horizontal bar representing altitude from 0 to 75m:

```
A:--->----------
0            75
```

- `A:` label (2 chars) + 14-char tape area
- The `>` marker slides from left (0m) to right (75m) based on current altitude
- `-` fills the tape background
- Scale labels `0` and `75` appear on row 3 beneath the tape ends

Position calculation: `P = INT(Y / 75 * 13)`, clamped to 0-13. The marker is placed at column `2 + P`.

When altitude exceeds 75m (shouldn't happen in radar mode, but if ascending), the marker pins to the right end. At 0m (surface), it's at the left.

#### VSI Tape (columns 17-31, row 2)

A 13-character horizontal bar representing vertical speed from 0 to -10 m/s:

```
V:---->---------
0            -10
```

- `V:` label (2 chars) + 13-char tape area
- The `>` marker slides from left (0 m/s) to right (-10 m/s)
- Safe landing speed (DY > -6) keeps the marker in the left half
- Danger zone (DY < -6) pushes it into the right half

Position calculation: `P = INT(ABS(DY) / 10 * 12)`, clamped to 0-12. Placed at column `19 + P`.

#### Why Horizontal?

With 4 rows, a vertical tape gives only 3-4 positions of resolution. A horizontal tape using 13-14 columns gives **13-14 positions** — roughly matching the original's 7-row vertical tapes in useful precision. The player gets a genuine analog feel: watching the `>` marker slide across the tape as they adjust thrust is intuitive and provides at-a-glance feedback during the most tense phase of the game.

#### Tape Transition

When Y crosses the 75m threshold:
- **Entering radar mode** (Y drops below 75): `CLS`, redraw with compressed 2-row instruments and tapes on row 2. Draw scale labels on row 3.
- **Leaving radar mode** (Y rises above 75): `CLS`, redraw full 3-row instrument panel. This is rare — usually means the player overshot and is ascending briefly.

### Status Indicators (Row 3, left side)

| Indicator | Condition                            | Original                   |
|-----------|--------------------------------------|----------------------------|
| `FUEL`    | Fuel < 3000, flashes (odd/even step) | Same                       |
| `ASC`     | DY > 0 (ascending)                   | Same                       |
| `RADAR`   | Y < 1000 (radar altimeter active)    | Same                       |
| `CONTACT` | Y < 3 (near surface)                 | Replaces RADAR when active |
| `ENGINE`  | BR=0 and F=0 (engine off, no fuel)   | Same                       |
| `RANGE`   | abs(X) ≤ 500 (near landing site)     | Same                       |

In cruise mode, indicators span the full row: `FUEL ASC RADAR ENGINE RANGE`

In radar mode, indicators share row 3 with the tape bottoms: `CONTACT RANGE` fits in columns 0-23, tape pointers/scale in 24-31.

### Help Screen (Toggled)

Press `+` (help key, consistent with STREK) to show controls:

```
4/6:TILT10 7/9:TILT5
0:CUT 1-5:THRUST .:THR-
8:VERT R:RESET Q:QUIT
PRESS ANY KEY...
```

---

## Control Mapping

The original uses `[`, `]`, `-`, `=`, `;`, `'` and letter keys. Many of these are multi-keypress on the Casio (shifted). Remap to single-keypress number pad and simple keys:

| Casio Key | Action                     | Original                     |
|-----------|----------------------------|------------------------------|
| `1`       | Thrust 20%                 | `1`                          |
| `2`       | Thrust 40%                 | `2`                          |
| `3`       | Thrust 60%                 | `3`                          |
| `4`       | Thrust 80% / Tilt left 10° | `4` (repurposed — see below) |
| `5`       | Thrust 100%                | `5`                          |
| `0`       | Engine cut (0%)            | `0`                          |
| `6`       | Tilt right 10°             | New mapping                  |
| `7`       | Fine tilt left 5°          | `-` original                 |
| `9`       | Fine tilt right 5°         | `=` original                 |
| `8`       | Vertical (LA=0)            | `V` original                 |
| `.`       | Thrust -10%                | `[` original                 |
| `+`       | Help screen                | New                          |
| `R`       | Reset simulation           | `R`                          |
| `Q`       | Quit                       | `Q`                          |

**Design rationale**: On the Casio keyboard, number keys 0-9 are all single-press. The layout mirrors a logical grouping:
- **0-5**: Thrust control (direct set)
- **4/6**: Left/right tilt (like a D-pad on the number row)
- **7/9**: Fine tilt adjustment
- **8**: Centre/vertical
- **.** (decimal point): Thrust reduce (easy reach near 0)

This loses the `C` (-60°) and `B` (+60°) instant presets and the fine ±2% thrust keys (`; '`), but these are rarely used and the number pad gives fast access to all needed controls.

---

## Physics Engine

The simulation physics are straightforward and translate directly:

```
HT = LA/90 * BR/10              — horizontal thrust component
VT = (1 - ABS(LA)/90) * BR/10   — vertical thrust component
DY = DY - G + VT                — gravity + thrust
Y  = Y + DY                     — update altitude
DX = DX - HT                    — horizontal thrust effect
X  = X + DX                     — update range
IF F - BR < 0 THEN BR = F       — can't burn more than remaining fuel
IF F > 0 THEN F = F - BR        — consume fuel
IF Y < 0 THEN Y = 0             — clamp to surface
```

Constants:
- `G = 10/3` (≈3.33 m/s², lunar gravity)
- Initial: `Y=10000`, `X=-30000`, `DX=500`, `DY=0`, `F=25000`, `LA=60`, `BR=0`

No changes needed to the physics model.

---

## Landing Detection and Scoring

**Landing condition**: `Y <= 0 AND BR = 0` (on surface with engine off)

**Outcome logic**:

| Condition                           | Result                |
|-------------------------------------|-----------------------|
| abs(DX) ≤ 6 AND DY ≥ -6             | "LANDED OK!"          |
| abs(DX) < 6 AND DY > -6 AND DY < -3 | "LANDED WITH BOUNCE!" |
| abs(DY) > 6 OR abs(DX) > 6          | "CRASHED!"            |

**Score**: `100 / (ABS(DX) * ABS(DY))` — only displayed for successful landings within 500m of site.

**Landing screen** (replaces instrument panel):

```
*** LANDED OK! ***
DX: 2.3  DY:-4.1 X: 120
SCORE: 10
PLAY AGAIN? Y/N
```

Or for crash:

```
*** CRASHED! ***
DX:45.0  DY:-12.3
CRATER: 30.8M DEEP
PLAY AGAIN? Y/N
```

---

## Program Structure

```
Lines 1-3       REM header
Lines 10-18     Splash screen: title, I=instructions, S=start
Lines 20-30     Instructions screen (2 pages)
Lines 40-49     Controls/keys help screen
Lines 100-109   Initialisation: set all variables to starting values
Lines 200-209   Main simulation loop (GOTO-based):
                  GOSUB display (300)
                  GOSUB readkey (400)
                  GOSUB physics (500)
                  GOSUB input (600)
                  GOSUB testland (700)
                  GOSUB delay (800)
                  Step counter, loop back to 200
Lines 300-349   Display subroutine:
                  Row 0: Y, DY, F
                  Row 1: X, DX, BR
                  Row 2: LA, VT, HT
                  Row 3: status indicators
Lines 400-409   Read key: K$=INKEY$ (non-blocking)
Lines 500-519   Physics update subroutine (HT, VT, DY, Y, DX, X, fuel)
Lines 600-649   Input processing: map K$ to actions
Lines 700-749   Landing test + outcome display + score
Lines 800-819   Delay loop (calibrated busy-wait, reads INKEY$ to catch keys)
Lines 900-949   Reset subroutine (re-initialise variables)
```

**Estimated size**: ~120-150 lines of Casio BASIC.

---

## Display Value Formatting

Casio BASIC's `PRINT` with numbers uses variable-width formatting. To keep the display stable (no jittering columns), use fixed-position `LOCATE` for each value and clear the field before printing:

```basic
LOCATE 2,0:PRINT "     ";:LOCATE 2,0:PRINT INT(Y);
```

For 1-decimal display: `INT(DY*10)/10`

For large values (>9999): Show integer only. For small values (<100): Show 1 decimal.

---

## Timing Approach

Without a hardware timer, use a busy-wait loop that also polls `INKEY$`:

```basic
800 REM DELAY WITH KEY POLL
801 FOR I=1 TO TK
802 K$=INKEY$:IF K$<>"" THEN K9$=K$
803 NEXT I
804 RETURN
```

`TK` is calibrated at startup. The delay loop also captures the last keypress (`K9$`), so keys pressed during the delay aren't lost. The main loop uses `K9$` instead of `K$` for input processing, and clears it each tick.

With TURBO mode (~50x speed), `TK` may need to be ~500-1000 for a 1-second tick. At normal speed, `TK` ~10-20. Could offer a speed setting at startup or use a fixed value tuned for TURBO mode (the expected play mode for real-time games).

---

## Splash and Instruction Screens

**Title screen:**

```
** LUNAR LANDER **
BY MARK WICKENS (2010)
I=INFO S=START +=KEYS
```

**Instructions** (3 pages, press any key to advance):

Page 1:
```
LAND THE LEM ON THE
MOON. TILT AND BURN TO
SLOW DOWN, THEN DESCEND
TO THE LANDING SITE.
```

Page 2:
```
LAND WITHIN 500M OF SITE
WITH DX AND DY BELOW 6.0
SHUT DOWN ENGINE ON THE
SURFACE TO COMPLETE.
```

Page 3:
```
TIP: AT 60DEG AND 100%
BURN, DESCENT RATE IS
CONSTANT. 33% VERTICAL
HOLDS ALTITUDE. GL HF!
```

---

## Differences from Original

| Feature             | Original (Z88/BBC)                   | Casio VX-4                                                    |
|---------------------|--------------------------------------|---------------------------------------------------------------|
| Display             | 64x7, 9 values + tape gauges         | 32x4, context-sensitive layout                                |
| ALT/VSI tape gauges | 7-row vertical tapes, always visible | Horizontal tapes on row 2 (13-14 positions), appear below 75m |
| Tick timing         | `TIME` variable (10ms precision)     | Busy-wait `FOR` loop with `INKEY$` polling                    |
| Controls            | `[ ] - = ; '` + letters              | Number pad 0-9, `.`, `+`, `R`, `Q`                            |
| Fine thrust ±2%     | `; '` keys                           | Omitted (±10% via `.`/direct set sufficient)                  |
| Preset angles C/V/B | -60°, 0°, +60°                       | `8` = vertical only; use 4/6 to reach ±60°                    |
| Instructions        | Read from file on disk               | Inline PRINT screens                                          |
| Number formatting   | `@%` format control register         | `INT(x*N)/N` manual rounding                                  |
| Pause               | `P` key                              | Omitted (TURBO button serves as speed control)                |

## Attribution

- **Original**: Mark Wickens, "Lunar Lander", Z88/BBC BASIC, Summer 2010 Retrochallenge
- **Documentation**: `lander28g.txt` by Mark Wickens
- **Reference**: http://hecnet.eu/rc2010sc

---

## Implementation Order

1. **Physics engine** (lines 500-519) — translate directly, verify with known values
2. **Initialisation** (lines 100-109) — all starting variables
3. **Display** (lines 300-349) — the core challenge; get layout right first
4. **Key reading + input** (lines 400-409, 600-649) — INKEY$ + action mapping
5. **Main loop** (lines 200-209) — tie it together
6. **Timing** (lines 800-819) — calibrate delay loop
7. **Landing detection + scoring** (lines 700-749) — outcome screens
8. **Splash/instructions** (lines 10-49) — title, info, keys
9. **Testing + tuning** — play-test, adjust timing, tweak display positions
