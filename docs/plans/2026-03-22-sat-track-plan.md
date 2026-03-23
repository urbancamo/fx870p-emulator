# Satellite Tracker — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the BBC BASIC satellite tracker (reference/sat-track/SAT1600.TXT) to Casio FX-870P BASIC, add documentation, and include in the program library.

**Architecture:** Direct port of Alvin Banderas' single-satellite tracker. Euler-type numerical integration propagates an orbit over 24 hours in 15-minute steps. For each step where the satellite is above the horizon and in favourable lighting, compass bearing, elevation, altitude, velocity and acceleration are displayed across 2 screens. Observer location and satellite initial conditions (ECI position/velocity) entered by the user.

**Tech Stack:** Casio JIS BASIC for FX-870P. Line numbers spaced 10 apart.

**Source:** `reference/sat-track/SAT1600.TXT` (Sharp PC-1600 BASIC)
**Description:** `reference/sat-track/SAT_TRACK_AMSTRAD_NC100_200.TXT`
**Requirements:** `docs/plans/2026-03-22-sat-track.md`

---

## Conversion Summary

Key changes from BBC/Sharp BASIC to Casio FX-870P:

| BBC/Sharp | Casio FX-870P | Lines affected |
|-----------|---------------|----------------|
| `RADIAN` | `ANGLE 1` | 26 |
| `CURSOR col,row` | `LOCATE col,row` | 14 instances |
| `BEEP n,m` / `BEEP n` | `BEEP` (no args) | 4 instances |
| `INKEY$` polling loop | `INPUT$(1)` blocking read | 4 instances |
| `"S" CLEAR` (Sharp label) | `CLEAR` | line 19 |
| `WAIT 0` | remove | line 19 |
| `IF cond LET var=x` | `IF cond THEN var=x` | ~8 instances |
| `@%` format variable | `INT()` + `STR$()` + `RIGHT$()` | display lines |
| 4 display screens | 2 screens (32x4 constraint) | 3000-3720 |
| Undefined `D2,M2,Y2` | Bug fix: removed broken period end-date line | 3560 |

## FX-870P BASIC Constraints (lessons from PLANETS.BAS)

1. **Case-insensitive variables** — tokenizer uppercases everything. All vars treated as uppercase.
2. **ANGLE 1** — must set radian mode; trig functions default to DEG.
3. **Trig argument range** — keep arguments small. Q2 stays within 0–2π over 24h, so no normalization needed here (unlike PLANETS.BAS where mean longitudes grew to hundreds of radians).
4. **`SQR(x)^3`** — exponentiation after function call works correctly (tested in PLANETS.BAS with `D^3/4`).
5. **`2*PI`** — parses correctly as the constant PI (confirmed by user during PLANETS.BAS debugging).
6. **Scalar vs array** — `D` (scalar, day) and `D()` (array, line-of-sight) coexist safely. Same for `X`/`X()`, `V`/`V1()`.

## File Structure

- **Create:** `public/basic/emulator/SATTRACK.BAS` — the converted BASIC program
- **Create:** `public/basic/emulator/SATTRACK.md` — companion documentation
- **Modify:** `public/basic/emulator/catalog.json` — add catalog entry

## Program Structure

| Lines | Section | Purpose |
|-------|---------|---------|
| 10–30 | Header | REM comments |
| 40–80 | Init | CLEAR, ANGLE 1, DIM arrays, constants |
| 90–280 | Input | Satellite name, date/time, observer location, position/velocity vectors |
| 290–310 | Setup | Save start time, convert angles to radians, compute initial acceleration |
| 320–330 | Main loop start | "Scanning..." message |
| 340–420 | Time step | Compute observer ECI position, visibility check |
| 430–570 | Integration | 5-step modified Euler (2nd-order Runge-Kutta) per 15-min interval |
| 580–590 | Main loop end | Print pass count |
| 600–810 | Display sub | Local coord frame, compass/elevation, time, daylight filter, alt/vel/acc |
| 820–870 | Screen 1 | Pass ID, time, position |
| 880–920 | Screen 2 | Az/El, visibility, alt, vel, acc |
| 2000–2040 | ATN2 | atan2(Y,X) subroutine (same as PLANETS.BAS) |
| 2100–2130 | Init accel | Compute initial gravitational acceleration |
| 2200–2220 | Dist cubed | r³ helper for integration |

## Display Layout (32×4)

**Screen 1 — Pass ID & Position:**
```
#1 ASTRA 1M
20:30 13/3/2026
X:42164 Y:1
Z:0  Alt:35793km
```

**Screen 2 — Observation Data:**
```
Az:177.8 El:28.8
Vis:GOOD
Vel:3075m/s
Acc:0.000
```

Press any key between screens. Navigation: automatic (each visible pass shown in sequence).

---

## Task 1: Create SATTRACK.BAS

**Files:**
- Create: `public/basic/emulator/SATTRACK.BAS`

- [ ] **Step 1: Create the program file**

```basic
10 REM SATELLITE TRACKER
20 REM CASIO FX-870P PORT
30 REM ALVIN BANDERAS (C)2026
40 CLEAR:ANGLE 1
50 DIM V1(2),V2(2),V3(2),P1(2),P2(2)
60 DIM P3(2),A1(2),A2(2),A3(2)
70 DIM X(2),D(2),U1(2),U2(2),U3(2),P0(2)
80 G=398600:R=6371:G1=0
90 CLS:PRINT "SATELLITE TRACKER"
100 INPUT "Satellite?";O$
110 INPUT "Year?";Y
120 INPUT "Month(1-12)?";M
130 IF M<1 OR M>12 THEN PRINT "Bad":GOTO 120
140 INPUT "Day(1-31)?";D
150 IF D<1 OR D>31 THEN PRINT "Bad":GOTO 140
160 INPUT "Hour(0-23)?";H0
170 INPUT "Min(0-59)?";M0
180 IF M0<0 OR M0>59 THEN PRINT "Bad":GOTO 170
190 CLS:INPUT "Long(-W)?";L0
200 INPUT "Lat?";A
210 CLS:PRINT "Position (km):"
220 INPUT "X?";P1(0)
230 INPUT "Y?";P1(1)
240 INPUT "Z?";P1(2)
250 CLS:PRINT "Velocity(km/s):"
260 INPUT "Vx?";V1(0)
270 INPUT "Vy?";V1(1)
280 INPUT "Vz?";V1(2)
290 H1=H0:M1=M0
300 L0=L0*PI/180:A=A*PI/180
310 GOSUB 2100:P=0
320 REM --- MAIN LOOP (24h) ---
330 CLS:PRINT "Scanning 24h..."
340 FOR T1=0 TO 95
350 T=T1*.25
360 Q1=G1-L0:Q2=T*PI/12+Q1
370 P0(0)=R*COS(A)*COS(Q2)
380 P0(1)=R*COS(A)*SIN(Q2)
390 P0(2)=R*SIN(A)
400 W=P1(0)*P0(0)+P1(1)*P0(1)+P1(2)*P0(2)
410 V0=P0(0)^2+P0(1)^2+P0(2)^2
420 IF W>V0 THEN GOSUB 600
430 REM --- Integrate 0.25h ---
440 FOR I5=1 TO 5:FOR J=0 TO 2
450 V3(J)=V1(J)+.05*A1(J)
460 V2(J)=.5*(V1(J)+V3(J))
470 P3(J)=P1(J)+.05*V2(J)
480 P2(J)=.5*(P1(J)+P3(J))
490 X(J)=P2(J):GOSUB 2200
500 A2(J)=(-G)*P2(J)/L
510 V3(J)=V1(J)+.05*A2(J)
520 V2(J)=.5*(V1(J)+V3(J))
530 P3(J)=P1(J)+.05*V2(J)
540 X(J)=P3(J):GOSUB 2200
550 A3(J)=(-G)*P3(J)/L
560 V1(J)=V3(J):P1(J)=P3(J):A1(J)=A3(J)
570 NEXT J:NEXT I5
580 NEXT T1
590 CLS:PRINT "Scan complete.":PRINT "Passes: ";P:END
600 REM --- PASS DISPLAY ---
610 REM East vector
620 E1=-SIN(L0):E2=COS(L0)
630 Z=SQR(E1^2+E2^2)
640 U3(0)=E1/Z:U3(1)=E2/Z:U3(2)=0
650 REM Up vector
660 Z=SQR(P0(0)^2+P0(1)^2+P0(2)^2)
670 U1(0)=P0(0)/Z:U1(1)=P0(1)/Z:U1(2)=P0(2)/Z
680 REM North = Up x East
690 U2(0)=U1(1)*U3(2)-U1(2)*U3(1)
700 U2(1)=U1(2)*U3(0)-U1(0)*U3(2)
710 U2(2)=U1(0)*U3(1)-U1(1)*U3(0)
720 Z=SQR(U2(0)^2+U2(1)^2+U2(2)^2)
730 U2(0)=U2(0)/Z:U2(1)=U2(1)/Z:U2(2)=U2(2)/Z
740 REM Line of sight
750 FOR J=0 TO 2:D(J)=P1(J)-P0(J):NEXT J
760 C1=D(0)*U1(0)+D(1)*U1(1)+D(2)*U1(2)
770 C2=D(0)*U2(0)+D(1)*U2(1)+D(2)*U2(2)
780 C3=D(0)*U3(0)+D(1)*U3(1)+D(2)*U3(2)
790 REM Compass & elevation
800 Y=C3:X=C2:GOSUB 2000:C4=U*180/PI:IF C4<0 THEN C4=C4+360
810 E5=ATN(C1/SQR(C2^2+C3^2))*180/PI
820 REM Time computation
830 Z=M1+INT(60*(T-INT(T))+.5)
840 IF Z<60 THEN M3=Z:B=0 ELSE M3=Z-60:B=1
850 Z=H1+INT(T)+B
860 IF Z<24 THEN H3=Z:B=0 ELSE H3=Z-24:B=1
870 D3=D+B
880 REM Daylight filter
890 IF H3>=6.1 AND H3<=17.9 THEN RETURN
900 L$="POOR":IF (H3>3.9 AND H3<6.1) OR (H3>17.9 AND H3<20.1) THEN L$="GOOD"
910 REM Altitude, velocity, acceleration
920 ALT=SQR(P1(0)^2+P1(1)^2+P1(2)^2)-R
930 V=SQR(V1(0)^2+V1(1)^2+V1(2)^2)*1000
940 IF P=0 THEN IV=V
950 A2C=(V-IV)/900:IV=V:P=P+1:BEEP
960 REM --- Screen 1: ID & Position ---
970 CLS:PRINT "#";P;" ";O$
980 LOCATE 0,1:PRINT RIGHT$(STR$(100+H3),2);":";RIGHT$(STR$(100+INT(M3)),2);" ";D3;"/";M;"/";Y
990 LOCATE 0,2:PRINT "X:";INT(P1(0));" Y:";INT(P1(1))
1000 LOCATE 0,3:PRINT "Z:";INT(P1(2));" Alt:";INT(ALT);"km"
1010 I$=INPUT$(1)
1020 REM --- Screen 2: Observation ---
1030 CLS:PRINT "Az:";INT(C4*10)/10;" El:";INT(E5*10)/10
1040 LOCATE 0,1:PRINT "Vis:";L$
1050 LOCATE 0,2:PRINT "Vel:";INT(V);"m/s"
1060 LOCATE 0,3:PRINT "Acc:";INT(A2C*1000)/1000
1070 I$=INPUT$(1):RETURN
2000 REM ATN2: Y=y, X=x -> U
2010 IF X=0 THEN U=SGN(Y)*PI/2:RETURN
2020 U=ATN(Y/X)
2030 IF X<0 THEN U=U+PI*SGN(Y):IF Y=0 THEN U=PI
2040 RETURN
2100 REM Initial acceleration
2110 L=SQR(P1(0)^2+P1(1)^2+P1(2)^2)^3
2120 FOR J=0 TO 2:A1(J)=(-G)*P1(J)/L:NEXT J
2130 RETURN
2200 REM Distance cubed
2210 L=SQR(X(0)^2+X(1)^2+X(2)^2)^3
2220 RETURN
```

- [ ] **Step 2: Commit**

```bash
git add public/basic/emulator/SATTRACK.BAS
git commit -m "feat: add satellite tracker - port of Banderas BBC BASIC program"
```

---

## Task 2: Create SATTRACK.md Documentation

**Files:**
- Create: `public/basic/emulator/SATTRACK.md`

- [ ] **Step 1: Convert the description document to markdown**

Create `public/basic/emulator/SATTRACK.md` with content adapted from `reference/sat-track/SAT_TRACK_AMSTRAD_NC100_200.TXT`. Include:

- Overview (single-satellite tracker, 24-hour pass window)
- How it works (Euler-type numerical integration, ECI coordinates, visibility check)
- Input parameters (satellite name, date/time, observer location, position/velocity vectors)
- Display layout (2 screens per pass)
- Controls (press any key to advance)
- Example: ASTRA 1M over Manchester (the reference test case from the description)
- Geostationary satellite examples table
- Notes on visibility (twilight windows, daylight exclusion)
- Running instructions

Use the same image path pattern as PLANETS.md (`images/keys/standard/`).

- [ ] **Step 2: Commit**

```bash
git add public/basic/emulator/SATTRACK.md
git commit -m "docs: add satellite tracker documentation"
```

---

## Task 3: Add to Program Library Catalog

**Files:**
- Modify: `public/basic/emulator/catalog.json`

- [ ] **Step 1: Add catalog entry**

Add to the end of the JSON array (before the closing `]`):

```json
  {
    "file": "SATTRACK.BAS",
    "name": "Satellite Tracker",
    "description": "Single-satellite tracker — propagates an orbit over 24h showing compass bearing, elevation, altitude, and velocity for visible passes"
  }
```

- [ ] **Step 2: Commit**

```bash
git add public/basic/emulator/catalog.json
git commit -m "feat: add satellite tracker to program library catalog"
```

---

## Task 4: Verification

- [ ] **Step 1: Verify with ASTRA 1M geostationary test case**

Load SATTRACK.BAS in the emulator. Enter:
- Satellite: ASTRA 1M
- Year: 2026, Month: 3, Day: 13
- Hour: 20, Minute: 30
- Longitude: -2.2 (Manchester, West)
- Latitude: 53.5
- Position X: 42164, Y: 0, Z: 0
- Velocity Vx: 0, Vy: 3.0747, Vz: 0

Expected first pass output:
- Compass: ~177° (SSE)
- Elevation: ~28°
- Altitude: ~35793 km
- Velocity: ~3075 m/s
- Acceleration: ~0 (circular orbit)

For geostationary orbit, expect 96 passes total (one every 15 minutes, satellite always visible at night).

- [ ] **Step 2: Check display fits 32×4**

Verify no text overflows the 32-character line width on either screen. Satellite names longer than ~20 characters may truncate — this is acceptable.

- [ ] **Step 3: Final commit**

```bash
git add public/basic/emulator/SATTRACK.BAS
git commit -m "feat: satellite tracker - verified against ASTRA 1M reference data"
```

---

## Performance Note

The 24-hour scan involves 96 time steps × 5 integration sub-steps × 3 axes = 1440 inner loop iterations. On the FX-870P's interpreted BASIC (~100-200 floating-point ops/sec), expect the full scan to take **3-5 minutes**. The "Scanning 24h..." message at line 330 lets the user know to wait. Visible passes interrupt the scan with display screens.

## Bug Fixes from Original

1. **Undefined variables D2, M2, Y2** (original line 3560): The period end-date display referenced variables that were never set. Removed — the converted version shows only the observation date, not the full period range.
2. **Missing THEN keyword**: Original used Sharp's `IF cond LET` syntax which omits `THEN`. All converted to standard `IF...THEN`.
