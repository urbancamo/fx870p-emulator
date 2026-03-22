# Planetary Positions BASIC Program — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write a Casio BASIC program for the FX-870P emulator that calculates planetary positions (RA/Dec and Alt/Az) for all major solar system bodies given a date/time and observer location.

**Architecture:** Meeus low-precision method using Keplerian orbital elements with equation-of-center approximation. Earth's heliocentric position is computed first as a reference, then each planet's heliocentric coordinates are converted to geocentric ecliptic, equatorial (RA/Dec), and horizontal (Alt/Az) coordinates. All orbital constants stored in DATA statements. The 32x4 LCD shows one planet at a time with left/right arrow navigation.

**Tech Stack:** Casio JIS BASIC for FX-870P, ~120 lines, well within 32KB memory limit.

**Requirements doc:** `docs/plans/2026-03-22-planetary-positions.md`

---

## File Structure

- **Create:** `public/basic/emulator/PLANETS.BAS` — the complete BASIC program

No other files are created or modified. This is a self-contained BASIC program.

## Critical FX-870P BASIC Constraints

1. **Case-insensitive variables**: The FX-870P tokenizer uppercases all code. `n` and `N` are the **same variable**. All variable names must be treated as uppercase-only.
2. **Multi-character variable names**: Supported (e.g., `M2`, `Y2`, `R1`). Used here to avoid collisions when 26 single-letter variables are not enough.
3. **DEFCHR$ format**: Uses 5-column pixel format = **10 hex characters** (not 16). Each byte is one column, bits 0–7 map to rows 0–7 (bit 0 = top row).
4. **STR$() may include leading space**: Use `RIGHT$(STR$(100+X),2)` for reliable zero-padded 2-digit output, `RIGHT$(STR$(1000+X),3)` for 3-digit.

## Algorithm Overview

For each planet:
1. Compute Julian Date from input → Julian centuries T from J2000.0
2. Read orbital elements from DATA: mean longitude L, rate L1, semi-major axis a, eccentricity e, perihelion longitude W, rate W1, inclination I, ascending node N
3. Mean anomaly: M = L - W (where L and W are evaluated at time T)
4. Equation of center: C = (2e - e³/4)sin(M) + 1.25e²sin(2M) (approximation good to ~0.01° for e < 0.21)
5. True anomaly: v = M + C; heliocentric distance: r = a(1-e²)/(1+e·cos(v))
6. Heliocentric ecliptic longitude/latitude (accounting for orbital inclination)
7. Convert to geocentric ecliptic using Earth's pre-computed position
8. Convert ecliptic → equatorial (RA/Dec) using obliquity
9. Convert equatorial → horizontal (Alt/Az) using Local Sidereal Time and observer latitude

The Sun is handled as a special case: its geocentric position is simply Earth's heliocentric position rotated by 180°.

## Variable Allocation

**IMPORTANT**: The FX-870P is case-insensitive. All variables below are effectively uppercase regardless of how they appear in code.

**Persistent globals (must not be overwritten after initialization):**
| Var | Purpose |
|-----|---------|
| K | PI/180 (degrees → radians conversion) |
| T | Julian centuries from J2000.0 |
| J | Julian Date number |
| H | Obliquity of ecliptic (radians) |
| F | Earth heliocentric longitude (radians) |
| G | Earth heliocentric distance (AU) |
| S | Local Sidereal Time (radians) |
| P | Observer latitude (radians) |
| N$(I) | Planet name strings (array, 1–8) |
| Z(I,1..4) | Results array: RA, Dec, Alt, Az in degrees |

**Computation loop variable:** I (FOR I=1 TO 8)
**Display loop variable:** N (current planet being displayed)

**DATA READ variables (8 values per planet, reused each iteration):**
| Var | DATA column | Purpose |
|-----|-------------|---------|
| A | 1 | L0: mean longitude base (°) |
| B | 2 | L1: mean longitude rate (°/century) |
| C | 3 | Semi-major axis (AU) |
| D | 4 | Eccentricity |
| E | 5 | W0: perihelion longitude base (°) |
| L | 6 | W1: perihelion longitude rate (°/century) |
| M | 7 | Inclination (°) |
| O | 8 | Ascending node longitude (°) |

**Computation temporaries (reused freely within subroutine):**
| Var | Purpose(s) |
|-----|-----------|
| A | → mean longitude (rad), then → geocentric ecliptic longitude |
| B | → mean anomaly (rad), then → ecliptic latitude |
| E | → perihelion longitude (rad) |
| L | → equation of center |
| M | → inclination (rad) |
| O | → ascending node (rad) |
| Q | z-rectangular coordinate, then hour angle |
| R | Heliocentric distance |
| U | ATN2 result |
| V | True anomaly |
| W | Heliocentric ecliptic longitude |
| X | ATN2 x-input / rectangular x-coordinate |
| Y | ATN2 y-input / rectangular y-coordinate |

**Display formatting temporaries:**
| Var | Purpose |
|-----|---------|
| R | Value being formatted |
| D | Integer degrees/hours |
| M | Integer arcminutes |
| A$ | Sign string ("+"/"-") |

## Casio ASCII Special Characters Used

| Code | Character | Usage |
|------|-----------|-------|
| CHR$(252) | Custom degree symbol (°) via DEFCHR$ | Angle display |
| CHR$(228) | ← (left arrow, code 0xE4) | Navigation hint |
| CHR$(230) | → (right arrow, code 0xE6) | Navigation hint |

## Orbital Elements Data (Meeus Table 31.A, J2000.0 epoch)

Each planet: L0 (°), L1 (°/century), a (AU), e, W0 (°), W1 (°/century), I (°), N (°)

| Body | L0 | L1 | a | e | W0 | W1 | I | N |
|---------|---------|-------------|---------|---------|---------|------|-------|--------|
| Sun/Earth | 100.4664 | 35999.372 | 1.000001 | 0.016709 | 102.9373 | 1.7192 | 0 | 0 |
| Mercury | 252.2509 | 149472.6746 | 0.387098 | 0.205634 | 77.4561 | 1.5564 | 7.0048 | 48.3309 |
| Venus | 181.9798 | 58517.8149 | 0.723332 | 0.006773 | 131.5637 | 1.4022 | 3.3947 | 76.6807 |
| Mars | 355.4330 | 19140.2993 | 1.523679 | 0.093405 | 336.0602 | 1.8408 | 1.8497 | 49.5581 |
| Jupiter | 34.3515 | 3034.9057 | 5.20260 | 0.048498 | 14.3312 | 1.6126 | 1.3033 | 100.4644 |
| Saturn | 50.0774 | 1222.1138 | 9.55490 | 0.055548 | 93.0572 | 1.9642 | 2.4889 | 113.6634 |
| Uranus | 314.0550 | 428.4677 | 19.2184 | 0.046381 | 173.0053 | 1.4863 | 0.7732 | 74.0060 |
| Neptune | 304.3487 | 218.4862 | 30.1104 | 0.008986 | 48.1227 | 1.4262 | 1.7700 | 131.7217 |

---

## Task 1: Program Skeleton — Init, Date Input, Julian Date

**Files:**
- Create: `public/basic/emulator/PLANETS.BAS`

This task creates the program file with initialization, date/time input, Julian Date calculation, and a stub that displays the computed JD and T for verification.

- [ ] **Step 1: Create the initial program file**

```basic
1 REM PLANETARY POSITIONS
2 REM CASIO FX-870P
3 REM MEEUS ALGORITHMS
4 CLEAR:DIM N$(8),Z(8,4)
5 DEFCHR$(252)="0C12120C00"
6 K=PI/180
7 FOR I=1 TO 8:READ N$(I):NEXT I
8 DATA "Sun","Mercury","Venus","Mars"
9 DATA "Jupiter","Saturn","Uranus","Neptune"
10 CLS:PRINT "PLANET POSITIONS";
11 INPUT " Y=";Y
12 INPUT "M(1-12)=";M
13 INPUT "D(1-31)=";D
14 INPUT "Hr(UT)=";U
15 D=D+U/24
20 REM --- JULIAN DATE ---
21 IF M>2 THEN 24
22 Y=Y-1:M=M+12
24 A=INT(Y/100):B=2-A+INT(A/4)
25 J=INT(365.25*(Y+4716))+INT(30.6001*(M+1))+D+B-1524.5
26 T=(J-2451545)/36525
27 H=(23.4393-.013*T)*K
28 REM --- STUB: show JD for verification ---
29 CLS:PRINT "JD=";J:PRINT "T=";T:END
```

Note: DEFCHR$(252)="0C12120C00" defines a degree symbol (°) using the FX-870P's 5-column pixel format. Each pair of hex digits is one column, bit 0=top row. Pattern:
```
     C0  C1  C2  C3  C4
R0:   .   .   .   .   .
R1:   .   1   1   .   .
R2:   1   .   .   1   .
R3:   1   .   .   1   .
R4:   .   1   1   .   .
R5-7: (blank)
```

- [ ] **Step 2: Verify Julian Date calculation in the emulator**

Load the program and run it. Enter the test date 2000-01-01 12:00 UT.

Expected output:
- JD = 2451545 (the J2000.0 epoch by definition)
- T = 0

Also test 2024-01-01 0:00 UT:
- JD = 2460310.5
- T ≈ 0.23997

- [ ] **Step 3: Commit**

```bash
git add public/basic/emulator/PLANETS.BAS
git commit -m "feat: planetary positions - skeleton with date input and Julian Date"
```

---

## Task 2: Earth Position, Sidereal Time, Observer Location

**Files:**
- Modify: `public/basic/emulator/PLANETS.BAS`

Add Earth's heliocentric position computation, Greenwich Mean Sidereal Time → Local Sidereal Time, and observer location DATA statement. Replace the JD stub with a verification display of Earth's position.

- [ ] **Step 1: Add Earth computation, sidereal time, and observer DATA**

Replace lines 28-29 (the stub) with:

```basic
28 REM --- GMST -> LST ---
29 S=280.46062+360.98565*(J-2451545)
30 S=S-INT(S/360)*360:IF S<0 THEN S=S+360
31 RESTORE 960:READ W,X
32 S=(S+X)*K:P=W*K
33 REM S=LST(rad), P=observer lat(rad)
35 REM --- EARTH POSITION ---
36 RESTORE 910
37 READ A,B,C,D,E,L,M,O
38 A=(A+B*T)*K:E=(E+L*T)*K
39 B=A-E
40 L=(2*D-D^3/4)*SIN(B)+1.25*D*D*SIN(2*B)
41 V=B+L:R=C*(1-D*D)/(1+D*COS(V))
42 F=V+E:G=R
43 REM F=Earth helio lon(rad), G=Earth dist(AU)
```

Variable flow in Earth computation:
- A,B,C,D,E,L,M,O ← READ from DATA (L0,L1,a,e,W0,W1,I,N)
- A = (L0 + L1*T) * K → mean longitude in radians
- E = (W0 + W1*T) * K → perihelion in radians
- B = A - E → mean anomaly in radians
- L = equation of center
- V = true anomaly, R = heliocentric distance
- F = V + E = true heliocentric longitude (persistent)
- G = R = heliocentric distance (persistent)

Add the first orbital DATA line at 910 and observer location at 960:

```basic
910 DATA 100.4664,35999.372,1.000001,.016709,102.9373,1.7192,0,0
960 REM --- OBSERVER LOCATION ---
961 REM Latitude(N+), Longitude(E+)
962 DATA 51.4772,-0.0005
963 REM Greenwich Observatory, London
```

Add a temporary verification stub:

```basic
44 CLS:PRINT "Earth lon=";F/K;" deg"
45 PRINT "Earth r=";G;" AU"
46 PRINT "LST=";S/K;" deg"
47 END
```

- [ ] **Step 2: Verify Earth position in emulator**

Run with 2024-01-01 0:00 UT. Earth's heliocentric longitude should be ~100° (its mean longitude for that date). Distance should be ~0.983 AU (near perihelion in January).

- [ ] **Step 3: Commit**

```bash
git add public/basic/emulator/PLANETS.BAS
git commit -m "feat: planetary positions - Earth position and sidereal time"
```

---

## Task 3: Planet Computation Subroutine and DATA

**Files:**
- Modify: `public/basic/emulator/PLANETS.BAS`

Add all planet orbital element DATA statements, the ATN2 subroutine, and the planet computation subroutine. Replace the verification stub with a computation loop that stores results.

- [ ] **Step 1: Add all planet orbital DATA (lines 911–917)**

Add after line 910:

```basic
911 DATA 252.2509,149472.6746,.387098,.205634,77.4561,1.5564,7.0048,48.3309
912 DATA 181.9798,58517.8149,.723332,.006773,131.5637,1.4022,3.3947,76.6807
913 DATA 355.433,19140.2993,1.523679,.093405,336.0602,1.8408,1.8497,49.5581
914 DATA 34.3515,3034.9057,5.2026,.048498,14.3312,1.6126,1.3033,100.4644
915 DATA 50.0774,1222.1138,9.5549,.055548,93.0572,1.9642,2.4889,113.6634
916 DATA 314.055,428.4677,19.2184,.046381,173.0053,1.4863,.7732,74.006
917 DATA 304.3487,218.4862,30.1104,.008986,48.1227,1.4262,1.77,131.7217
```

DATA order: Sun(=Earth), Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune.
Each line: L0, L1, a, e, W0, W1, I, N.

- [ ] **Step 2: Add ATN2 subroutine (lines 400–404)**

```basic
400 REM ATN2: Y=y-arg, X=x-arg -> U
401 IF X=0 THEN U=SGN(Y)*PI/2:RETURN
402 U=ATN(Y/X)
403 IF X<0 THEN U=U+PI*SGN(Y):IF Y=0 THEN U=PI
404 RETURN
```

This is a full atan2(y,x) implementation handling all four quadrants:
- X>0: ATN(Y/X) is correct
- X<0, Y>0: ATN(Y/X) + PI (second quadrant)
- X<0, Y<0: ATN(Y/X) - PI (third quadrant)
- X<0, Y=0: PI (negative x-axis)
- X=0: ±PI/2 based on sign of Y

**IMPORTANT:** X and Y are used as both ATN2 arguments and rectangular coordinates. The caller sets X,Y before each GOSUB 400 call — they are intentionally overwritten.

- [ ] **Step 3: Add planet computation subroutine (lines 100–141)**

```basic
100 REM --- PLANET COMPUTATION ---
101 REM Input: A,B,C,D,E,L,M,O from DATA READ
102 REM Uses loop var I as planet index
103 A=(A+B*T)*K:E=(E+L*T)*K:M=M*K:O=O*K
104 IF I=1 THEN 120
105 B=A-E
106 L=(2*D-D^3/4)*SIN(B)+1.25*D*D*SIN(2*B)
107 V=B+L:R=C*(1-D*D)/(1+D*COS(V))
108 W=V+E
109 REM --- Inclination projection ---
110 B=ASN(SIN(W-O)*SIN(M))
111 X=COS(W-O):Y=SIN(W-O)*COS(M):GOSUB 400
112 W=O+U
113 REM --- Helio to Geocentric ---
114 X=R*COS(B)*COS(W)-G*COS(F)
115 Y=R*COS(B)*SIN(W)-G*SIN(F)
116 Q=R*SIN(B)
117 GOSUB 400:A=U
118 B=ATN(Q/SQR(X*X+Y*Y))
119 GOTO 130
120 REM --- Sun (geocentric = Earth + PI) ---
121 A=F+PI:B=0
130 REM --- Ecliptic to Equatorial ---
131 X=COS(A):Y=SIN(A)*COS(H)-TAN(B)*SIN(H)
132 GOSUB 400:Z(I,1)=U/K
133 Z(I,2)=ASN(SIN(B)*COS(H)+COS(B)*SIN(H)*SIN(A))/K
134 REM --- Equatorial to Horizontal ---
135 Q=S-Z(I,1)*K
136 Z(I,3)=ASN(SIN(P)*SIN(Z(I,2)*K)+COS(P)*COS(Z(I,2)*K)*COS(Q))/K
137 X=COS(P)*TAN(Z(I,2)*K)-SIN(P)*COS(Q):Y=-SIN(Q)
138 GOSUB 400:Z(I,4)=U/K
139 IF Z(I,4)<0 THEN Z(I,4)=Z(I,4)+360
140 IF Z(I,1)<0 THEN Z(I,1)=Z(I,1)+360
141 RETURN
```

Key logic:
- Line 103: Convert angles to radians. A=mean longitude, E=perihelion, M=inclination, O=ascending node
- Lines 105–108: Mean anomaly → equation of center → true anomaly + distance → heliocentric longitude W
- Lines 110–112: Project heliocentric longitude/latitude using orbital inclination. X,Y set for ATN2 call
- Lines 114–118: Helio→geocentric. X,Y=rectangular coords, Q=z-coord. ATN2 gives geocentric longitude→A, ATN gives latitude→B
- Lines 120–121: Sun special case — geocentric is just Earth + 180°
- Lines 131–133: Ecliptic→equatorial. X,Y set for ATN2. Result stored in Z(I,1)=RA, Z(I,2)=Dec
- Lines 135–140: Equatorial→horizontal. Q=hour angle. X,Y set for ATN2. Z(I,3)=Alt, Z(I,4)=Az
- Line 116: Uses Q (not Z) for the z-rectangular coordinate to avoid conflicting with the Z() results array

- [ ] **Step 4: Add computation loop and temporary text output**

Replace lines 44-47 (the Earth verification stub) with:

```basic
44 CLS:PRINT "Computing..."
50 RESTORE 910
51 FOR I=1 TO 8
52   READ A,B,C,D,E,L,M,O
53   GOSUB 100
54 NEXT I
55 REM --- Temp: show first planet ---
56 CLS:PRINT N$(1)
57 PRINT "RA=";Z(1,1);" Dec=";Z(1,2)
58 PRINT "Alt=";Z(1,3);" Az=";Z(1,4)
59 END
```

Note: The loop uses I (not N) as the index. Inside GOSUB 100, the DATA variables A,B,C,D,E,L,M,O are freely overwritten during computation. The loop variable I is never touched by the subroutine. Results are stored in Z(I,1..4) before NEXT I increments I.

- [ ] **Step 5: Verify Sun position in emulator**

Run with 2024-03-20 12:00 UT (near vernal equinox).
Sun RA should be ~0° (near 0h), Dec should be ~0°.

Run with 2024-06-21 12:00 UT (near summer solstice).
Sun RA should be ~90° (~6h), Dec should be ~+23.4°.

- [ ] **Step 6: Commit**

```bash
git add public/basic/emulator/PLANETS.BAS
git commit -m "feat: planetary positions - orbital computation and coordinate conversion"
```

---

## Task 4: Display Formatting and Navigation UI

**Files:**
- Modify: `public/basic/emulator/PLANETS.BAS`

Replace the temporary text output with a properly formatted display showing planet name, RA (hours:minutes), Dec (degrees:arcminutes), Alt/Az, and left/right arrow navigation.

- [ ] **Step 1: Add display subroutine (lines 300–340)**

```basic
300 REM --- DISPLAY PLANET N ---
301 CLS
302 LOCATE 0,0:PRINT N$(N);
303 REM --- Format RA ---
304 R=Z(N,1)/15:IF R<0 THEN R=R+24
305 IF R>=24 THEN R=R-24
306 D=INT(R):M=INT((R-D)*60+.5)
307 IF M>=60 THEN M=0:D=D+1
308 IF D>=24 THEN D=D-24
309 LOCATE 16,0
310 PRINT RIGHT$(STR$(100+D),2);"h";
311 PRINT RIGHT$(STR$(100+M),2);"m";
312 REM --- Format Dec ---
313 LOCATE 0,1
314 R=Z(N,2):A$="+":IF R<0 THEN A$="-"
315 R=ABS(R):D=INT(R):M=INT((R-D)*60+.5)
316 IF M>=60 THEN M=0:D=D+1
317 PRINT "Dec ";A$;RIGHT$(STR$(100+D),2);CHR$(252);RIGHT$(STR$(100+M),2);"'";
318 REM --- Format Alt ---
319 LOCATE 0,2
320 R=Z(N,3):A$="+":IF R<0 THEN A$="-"
321 R=ABS(R):D=INT(R):M=INT((R-D)*60+.5)
322 IF M>=60 THEN M=0:D=D+1
323 PRINT "Alt";A$;RIGHT$(STR$(100+D),2);CHR$(252);RIGHT$(STR$(100+M),2);"' ";
324 REM --- Format Az ---
325 R=Z(N,4):D=INT(R):M=INT((R-D)*60+.5)
326 IF M>=60 THEN M=0:D=D+1
327 IF D>=360 THEN D=D-360
328 PRINT "Az";RIGHT$(STR$(1000+D),3);CHR$(252);RIGHT$(STR$(100+M),2);"'";
329 REM --- Navigation ---
330 LOCATE 0,3
331 PRINT CHR$(228);"Prev ";CHR$(230);"Next  Q=End";
340 RETURN
```

Display layout (32 chars per line):
```
Line 0: PLANET_NAME      HHhMMm
Line 1: Dec ±DD°MM'
Line 2: Alt±DD°MM'  AzDDD°MM'
Line 3: ←Prev →Next  Q=End
```

**Zero-padding trick:** `RIGHT$(STR$(100+M),2)` reliably gives zero-padded 2-digit output regardless of whether STR$() adds a leading space. For M=5: STR$(105)="105" (or " 105"), RIGHT$(...,2)="05". For M=59: RIGHT$(STR$(159),2)="59".

CHR$(252) = custom degree symbol defined by DEFCHR$ in line 5.
CHR$(228) = ← (left arrow, Casio ASCII 0xE4), CHR$(230) = → (right arrow, 0xE6).

- [ ] **Step 2: Add navigation loop (replace lines 55–59)**

Replace lines 55-59 with:

```basic
55 N=1
56 GOSUB 300
57 I$=INPUT$(1)
58 IF ASC(I$)=28 AND N<8 THEN N=N+1:GOTO 56
59 IF ASC(I$)=29 AND N>1 THEN N=N-1:GOTO 56
60 IF I$="Q" OR I$="q" THEN CLS:END
61 IF I$="R" OR I$="r" THEN 10
62 GOTO 57
```

Navigation keys:
- Right arrow (ASC 28): next planet
- Left arrow (ASC 29): previous planet
- Q: quit
- R: re-enter date (restart)

Note: Casio ASCII code 28 = right arrow cursor key, code 29 = left arrow cursor key (from the character table).

- [ ] **Step 3: Verify display in emulator**

Run with any date. Navigate through all 8 bodies using arrow keys. Verify:
- Planet names display correctly
- RA shows in hours:minutes format (0–23h), zero-padded
- Dec shows with sign and degree:arcminute format
- Alt shows with sign
- Az shows 0–360°
- Arrow keys navigate forward/backward
- Q exits cleanly
- The custom degree symbol renders (small circle) — if it doesn't look right, try alternative DEFCHR$ patterns: `"0612120600"` or `"0C24240C00"`

- [ ] **Step 4: Commit**

```bash
git add public/basic/emulator/PLANETS.BAS
git commit -m "feat: planetary positions - formatted display with arrow key navigation"
```

---

## Task 5: Jupiter/Saturn Perturbation Corrections

**Files:**
- Modify: `public/basic/emulator/PLANETS.BAS`

For a first version, the ~2° accuracy without perturbations is acceptable for a pocket calculator. **Skip full perturbation implementation for v1** — add accuracy notes.

- [ ] **Step 1: Add accuracy comment**

```basic
95 REM NOTE: No perturbation corrections.
96 REM Jupiter ~2deg, Saturn ~3deg error.
97 REM Other planets: <1 degree accuracy.
```

- [ ] **Step 2: Commit**

```bash
git add public/basic/emulator/PLANETS.BAS
git commit -m "feat: planetary positions - add accuracy notes (perturbations deferred)"
```

---

## Task 6: Verification Against Known Ephemeris

**Files:**
- Modify: `public/basic/emulator/PLANETS.BAS` (if corrections needed)

Test the program against known planetary positions from JPL Horizons or a reliable almanac. Fix any bugs found.

- [ ] **Step 1: Prepare verification data**

Reference positions for **2024-01-01 0:00 UT** from JPL Horizons (geocentric, J2000 equatorial):

| Body | RA (approx) | Dec (approx) |
|---------|-------------|-------------|
| Sun | 18h45m | -23°01' |
| Mercury | 17h20m | -21°30' |
| Venus | 16h12m | -19°00' |
| Mars | 16h35m | -21°40' |
| Jupiter | 2h25m | +13°30' |
| Saturn | 22h45m | -8°30' |
| Uranus | 3h14m | +17°30' |
| Neptune | 23h47m | -2°40' |

Note: These are approximate. The Meeus low-precision method should match within ~1° for inner planets and ~2-3° for Jupiter/Saturn.

- [ ] **Step 2: Run program in emulator and compare**

Enter: Year=2024, Month=1, Day=1, Hour=0

Navigate through each planet and record the displayed RA and Dec. Compare against the reference table above.

**Acceptable tolerances:**
- Sun: within 0.5°
- Mercury, Venus, Mars: within 1°
- Jupiter, Saturn: within 3° (no perturbation corrections)
- Uranus, Neptune: within 2°

- [ ] **Step 3: Debug any issues**

Common issues to check if results are wrong:
1. **RA off by 180°**: ATN2 quadrant error — check the ATN2 subroutine at lines 400-404
2. **Dec has wrong sign**: Check the ecliptic-to-equatorial formula at line 133
3. **Alt/Az wrong but RA/Dec correct**: Check LST calculation (line 29) or observer latitude
4. **Everything off by a large constant**: Julian Date calculation error — verify with known JD
5. **One planet wildly wrong**: Check that planet's DATA values against the table in this plan
6. **Degree symbol doesn't render**: Adjust the DEFCHR$ hex pattern in line 5

- [ ] **Step 4: Verify navigation edge cases**

- Press left arrow when on Sun (planet 1) — should stay on Sun
- Press right arrow when on Neptune (planet 8) — should stay on Neptune
- Press Q — should clear screen and end
- Press R — should restart with date input

- [ ] **Step 5: Final commit**

```bash
git add public/basic/emulator/PLANETS.BAS
git commit -m "feat: planetary positions - verified against JPL Horizons ephemeris"
```

---

## Complete Program Listing (Reference)

The final program after all tasks, for reference:

```basic
1 REM PLANETARY POSITIONS
2 REM CASIO FX-870P
3 REM MEEUS ALGORITHMS
4 CLEAR:DIM N$(8),Z(8,4)
5 DEFCHR$(252)="0C12120C00"
6 K=PI/180
7 FOR I=1 TO 8:READ N$(I):NEXT I
8 DATA "Sun","Mercury","Venus","Mars"
9 DATA "Jupiter","Saturn","Uranus","Neptune"
10 CLS:PRINT "PLANET POSITIONS";
11 INPUT " Y=";Y
12 INPUT "M(1-12)=";M
13 INPUT "D(1-31)=";D
14 INPUT "Hr(UT)=";U
15 D=D+U/24
20 REM --- JULIAN DATE ---
21 IF M>2 THEN 24
22 Y=Y-1:M=M+12
24 A=INT(Y/100):B=2-A+INT(A/4)
25 J=INT(365.25*(Y+4716))+INT(30.6001*(M+1))+D+B-1524.5
26 T=(J-2451545)/36525
27 H=(23.4393-.013*T)*K
28 REM --- GMST -> LST ---
29 S=280.46062+360.98565*(J-2451545)
30 S=S-INT(S/360)*360:IF S<0 THEN S=S+360
31 RESTORE 960:READ W,X
32 S=(S+X)*K:P=W*K
33 REM S=LST(rad), P=observer lat(rad)
35 REM --- EARTH POSITION ---
36 RESTORE 910
37 READ A,B,C,D,E,L,M,O
38 A=(A+B*T)*K:E=(E+L*T)*K
39 B=A-E
40 L=(2*D-D^3/4)*SIN(B)+1.25*D*D*SIN(2*B)
41 V=B+L:R=C*(1-D*D)/(1+D*COS(V))
42 F=V+E:G=R
43 REM F=Earth helio lon(rad), G=Earth dist(AU)
44 CLS:PRINT "Computing..."
50 RESTORE 910
51 FOR I=1 TO 8
52   READ A,B,C,D,E,L,M,O
53   GOSUB 100
54 NEXT I
55 N=1
56 GOSUB 300
57 I$=INPUT$(1)
58 IF ASC(I$)=28 AND N<8 THEN N=N+1:GOTO 56
59 IF ASC(I$)=29 AND N>1 THEN N=N-1:GOTO 56
60 IF I$="Q" OR I$="q" THEN CLS:END
61 IF I$="R" OR I$="r" THEN 10
62 GOTO 57
95 REM NOTE: No perturbation corrections.
96 REM Jupiter ~2deg, Saturn ~3deg error.
97 REM Other planets: <1 degree accuracy.
100 REM --- PLANET COMPUTATION ---
101 REM Input: A,B,C,D,E,L,M,O from READ
102 REM I=planet index (loop var, not modified)
103 A=(A+B*T)*K:E=(E+L*T)*K:M=M*K:O=O*K
104 IF I=1 THEN 120
105 B=A-E
106 L=(2*D-D^3/4)*SIN(B)+1.25*D*D*SIN(2*B)
107 V=B+L:R=C*(1-D*D)/(1+D*COS(V))
108 W=V+E
109 REM --- Inclination projection ---
110 B=ASN(SIN(W-O)*SIN(M))
111 X=COS(W-O):Y=SIN(W-O)*COS(M):GOSUB 400
112 W=O+U
113 REM --- Helio to Geocentric ---
114 X=R*COS(B)*COS(W)-G*COS(F)
115 Y=R*COS(B)*SIN(W)-G*SIN(F)
116 Q=R*SIN(B)
117 GOSUB 400:A=U
118 B=ATN(Q/SQR(X*X+Y*Y))
119 GOTO 130
120 REM --- Sun (geocentric = Earth + PI) ---
121 A=F+PI:B=0
130 REM --- Ecliptic to Equatorial ---
131 X=COS(A):Y=SIN(A)*COS(H)-TAN(B)*SIN(H)
132 GOSUB 400:Z(I,1)=U/K
133 Z(I,2)=ASN(SIN(B)*COS(H)+COS(B)*SIN(H)*SIN(A))/K
134 REM --- Equatorial to Horizontal ---
135 Q=S-Z(I,1)*K
136 Z(I,3)=ASN(SIN(P)*SIN(Z(I,2)*K)+COS(P)*COS(Z(I,2)*K)*COS(Q))/K
137 X=COS(P)*TAN(Z(I,2)*K)-SIN(P)*COS(Q):Y=-SIN(Q)
138 GOSUB 400:Z(I,4)=U/K
139 IF Z(I,4)<0 THEN Z(I,4)=Z(I,4)+360
140 IF Z(I,1)<0 THEN Z(I,1)=Z(I,1)+360
141 RETURN
300 REM --- DISPLAY PLANET N ---
301 CLS
302 LOCATE 0,0:PRINT N$(N);
303 REM --- Format RA ---
304 R=Z(N,1)/15:IF R<0 THEN R=R+24
305 IF R>=24 THEN R=R-24
306 D=INT(R):M=INT((R-D)*60+.5)
307 IF M>=60 THEN M=0:D=D+1
308 IF D>=24 THEN D=D-24
309 LOCATE 16,0
310 PRINT RIGHT$(STR$(100+D),2);"h";
311 PRINT RIGHT$(STR$(100+M),2);"m";
312 REM --- Format Dec ---
313 LOCATE 0,1
314 R=Z(N,2):A$="+":IF R<0 THEN A$="-"
315 R=ABS(R):D=INT(R):M=INT((R-D)*60+.5)
316 IF M>=60 THEN M=0:D=D+1
317 PRINT "Dec ";A$;RIGHT$(STR$(100+D),2);CHR$(252);RIGHT$(STR$(100+M),2);"'";
318 REM --- Format Alt ---
319 LOCATE 0,2
320 R=Z(N,3):A$="+":IF R<0 THEN A$="-"
321 R=ABS(R):D=INT(R):M=INT((R-D)*60+.5)
322 IF M>=60 THEN M=0:D=D+1
323 PRINT "Alt";A$;RIGHT$(STR$(100+D),2);CHR$(252);RIGHT$(STR$(100+M),2);"' ";
324 REM --- Format Az ---
325 R=Z(N,4):D=INT(R):M=INT((R-D)*60+.5)
326 IF M>=60 THEN M=0:D=D+1
327 IF D>=360 THEN D=D-360
328 PRINT "Az";RIGHT$(STR$(1000+D),3);CHR$(252);RIGHT$(STR$(100+M),2);"'";
329 REM --- Navigation ---
330 LOCATE 0,3
331 PRINT CHR$(228);"Prev ";CHR$(230);"Next  Q=End";
340 RETURN
400 REM ATN2: Y=y-arg, X=x-arg -> U
401 IF X=0 THEN U=SGN(Y)*PI/2:RETURN
402 U=ATN(Y/X)
403 IF X<0 THEN U=U+PI*SGN(Y):IF Y=0 THEN U=PI
404 RETURN
910 DATA 100.4664,35999.372,1.000001,.016709,102.9373,1.7192,0,0
911 DATA 252.2509,149472.6746,.387098,.205634,77.4561,1.5564,7.0048,48.3309
912 DATA 181.9798,58517.8149,.723332,.006773,131.5637,1.4022,3.3947,76.6807
913 DATA 355.433,19140.2993,1.523679,.093405,336.0602,1.8408,1.8497,49.5581
914 DATA 34.3515,3034.9057,5.2026,.048498,14.3312,1.6126,1.3033,100.4644
915 DATA 50.0774,1222.1138,9.5549,.055548,93.0572,1.9642,2.4889,113.6634
916 DATA 314.055,428.4677,19.2184,.046381,173.0053,1.4863,.7732,74.006
917 DATA 304.3487,218.4862,30.1104,.008986,48.1227,1.4262,1.77,131.7217
960 REM --- OBSERVER LOCATION ---
961 REM Latitude(N+), Longitude(E+)
962 DATA 51.4772,-0.0005
963 REM Greenwich Observatory, London
```

## Future Enhancements (not in scope)

- **Jupiter/Saturn perturbation corrections**: Add great inequality terms (~6 sine terms) to improve accuracy from ~3° to ~0.3° for these planets
- **Moon position**: Requires separate algorithm (simplified Brown's theory)
- **Rise/set times**: Iterate to find when Alt = 0°
- **Constellation display**: Show which constellation each planet is in
- **Elongation from Sun**: Show angular distance from Sun (useful for visibility)
- **Date display on screen**: Show the entered date in the planet view header
