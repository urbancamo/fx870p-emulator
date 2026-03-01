# Super Star Trek — Casio VX-4 Implementation Plan

## Constraint Summary

- **Display**: 32 columns × 4 rows (the only hard constraint)
- **Memory**: ~32KB available (generous — no need to cut features)
- **Input**: `INPUT$(1)` for single keypress, `INPUT` for numeric values
- **Original**: 8×8 galaxy, 8×8 sectors, 425 lines, 9 commands, 6 computer sub-commands

## Decision: Keep Full 8×8

With 32KB we keep the **full 8×8 galaxy** and **8×8 sectors per quadrant**. All original game mechanics are preserved. The challenge is purely display layout.

---

## Display Designs

### Design Principle: Two-Column Layout

With 32 characters available, many screens can show data in **two columns** to eliminate paging. A single column wastes half the display width. Key applications: damage report (8 systems on 1 screen), combat results (all Klingon hits on 1 screen), torpedo data, mission briefing.

### Short Range Scan (SRS) — "Home Screen"

The SRS is the primary display, shown after every action. It shows **4 of the 8 sector rows** at a time, auto-centered on the Enterprise's row. Each cell is 1 character: `.`=empty, `E`=Enterprise, `K`=Klingon, `*`=star, `B`=starbase.

```
1..K..*.. E:2450
2..E..... S: 200
3......*. T:8  K:3
4.*B..... RED  v
```

- **Columns 0-8**: row number + 8 sector cells (9 chars)
- **Column 10+**: sidebar with key stats
- **`v`/`^`**: scroll indicator

Layout detail:
- Line 0 sidebar: `E:` + energy (up to 4 digits)
- Line 1 sidebar: `S:` + shields
- Line 2 sidebar: `T:` + torpedoes, space, `K:` + total Klingons remaining
- Line 3 sidebar: condition (`GRN`/`YEL`/`RED`/`DOC`) + scroll indicator

**Auto-centering**: If Enterprise is in row R, display rows max(1,R-1) to max(1,R-1)+3, clamped so rows stay within 1-8. The Enterprise is always visible on screen.

### Command Prompt

After SRS, line 3 shows the command menu replacing the condition line:

```
1..K..*.. E:2450
2..E..... S: 200
3......*. T:8  K:3
NSLPTHDCQ?
```

Single keypress selects command. Press `?` to show help:

```
N=NAV S=SRS L=LRS
P=PHA T=TOR H=SHE
D=DAM C=COM Q=QUIT
PRESS COMMAND KEY
```

### Long Range Scan (LRS)

Shows 3×3 surrounding quadrants with KBS encoding, combined with quadrant entry message:

```
ANTARES II  Q:3,4
 113 207 003
 010[045]105
 *** 100 012
```

- Line 0: quadrant name + coordinates
- Lines 1-3: the 3×3 grid, one row per line
- Brackets `[045]` mark the Enterprise's current quadrant
- `***` = out of bounds

Explored quadrants are recorded in Z() for the galactic record.

### Navigation (NAV)

**Screen 1** — course diagram + prompt:
```
COURSE:  4 3 2
         5 * 1
         6 7 8
ENTER (1-9)?
```

After digit entered via INPUT$(1), **Screen 2**:
```
COURSE: 3
WARP (0-8)?
_
```

Warp entered via INPUT (allows decimals like 0.2). If engines damaged, shows `MAX WARP: 0.2`.

### Phaser Fire (PHA) — Two-Column Results

Prompt:
```
PHASERS: 3 KLINGONS
ENERGY AVAIL: 2450
UNITS TO FIRE?
_
```

Results — all Klingons on one screen using compact format:
```
PHASER FIRE: 450
K1@3,7:350 DESTROYED
K2@6,2:200 LEFT:150
K3@1,5: 80 LEFT:120
```

One line per Klingon (max 3), damage + outcome on the same line. No paging needed for phaser results.

### Klingon Return Fire — Two-Column Results

All Klingon hits consolidated on one screen:
```
KLINGON FIRE:
K1:45 K2:30 K3:20
SHIELDS: 125
ANY KEY...
```

If a system is damaged by the hit, line 3 shows it:
```
KLINGON FIRE:
K1:45 K2:30
SHIELDS:125 LRS DAMAGED
ANY KEY...
```

### Photon Torpedo (TOR)

Course input (same diagram as NAV):
```
TORPEDO COURSE:
         4 3 2
         5 * 1
ENTER (1-9)? 6 7 8
```

Then torpedo track — compact coordinates on one line:
```
TORPEDO TRACK:
 4,5  3,5  2,5
*** KLINGON DESTROYED
ANY KEY...
```

Or miss: `TORPEDO MISSED` / `STAR ABSORBED ENERGY`

### Shields (SHE)

```
SHIELD CONTROL
ENERGY+SHIELDS: 2650
SHIELDS ARE: 200
NEW VALUE?_
```

### Damage Report (DAM) — Two-Column, Single Screen

All 8 systems on one screen using two columns:
```
DAMAGE REPORT
WRP  0.0  TOR  0.0
SRS  0.0  DAM -0.8
LRS -1.2  SHD  0.0
PHA  0.0  CMP  0.0
```

Each column: 3-char abbreviation + value = ~15 chars. Two columns fits in 32. **No paging needed.**

If docked at starbase, line 0 changes:
```
DOCKED-REPAIR? Y/N
WRP  0.0  TOR  0.0
SRS  0.0  DAM -0.8
LRS -1.2  SHD  0.0
PHA  0.0  CMP  0.0
```

### Computer (COM)

Sub-command menu:
```
COMPUTER ACTIVE
0=RECORD  1=STATUS
2=TORPEDO 3=BASE
COMMAND (0-3)?
```

**Sub 0 — Galactic Record**: Shows 4 galaxy rows at a time, all 8 columns per row. Each quadrant encoded as 3-digit KBS:

```
GALAXY   COL 1-8
1:113 207 003 *** ***
2:010 045 105 *** ***
3:*** 100 012 003 045
```

Each row: `N:` + 8×(3 digits + space) = 2 + 32 = 34... tight. Compact version without spaces between all entries:

```
GALAXY RECORD  [1/3]
1:113 207 003 010 ***
2:*** 045 105 012 003
3:*** 100 *** 003 045
```

Actually with `N:NNN NNN NNN NNN NNN NNN NNN NNN` = 2+8*4 = 34, two over. Drop the colon and use tighter format:

```
GALAXY RECORD   1/3
1 113 207 003 *** ***
2 *** 045 105 012 003
3 *** 100 *** 003 045
```

`1 113 207 003 *** ***` is only 6 entries = 2 + 6*4 = 26 chars. Still need 8 entries. Alternative: use 3-char values with no space before first:

`1 113207003010***045105012` — unreadable.

Best approach: show columns 1-4 and 5-8 side by side with a divider:

```
GALAXY RECORD   1/3
1 113 207 003 010|*** 045
2 *** 045 105 012|003 200
3 *** 100 *** 003|045 010
```

Hmm, still doesn't fit all 8. Pragmatic solution — **4 rows × 4 cols per page, 4 pages total**:

```
GALAXY REC  C:1-4
1 113 207 003 010
2 *** 045 105 012
3 *** 100 *** 003
ANY KEY=MORE Q=BACK
```

`1 113 207 003 010` = 20 chars. Fits with room. Press key to see C:5-8, then rows 5-8.

**Sub 1 — Status Report**:
```
STATUS REPORT
KLINGONS LEFT: 12
DAYS LEFT: 18.0
STARBASES: 3
```

**Sub 2 — Torpedo Data** — two-column direction+distance:
```
TORPEDO DATA:
K1@3,7 D:1.0 R:4.2
K2@6,2 D:5.3 R:3.1
ANY KEY...
```

Direction and range on same line per Klingon. Max 3 Klingons fits in 3 lines.

**Sub 3 — Starbase Nav**:
```
STARBASE AT 4,3
DIRECTION: 6.2
DISTANCE: 2.8
ANY KEY...
```

### Mission Briefing — Two Screens (was Three)

**Screen 1** — title + orders combined:
```
** SUPER STAR TREK **
DESTROY 12 KLINGONS
IN 25 DAYS. 3 BASES.
ANY KEY...
```

**Screen 2** — starting position, flows into first command:
```
MISSION BEGINS IN
ANTARES II  Q:1,2
CONDITION: GREEN
NSLPTHDCQ?
```

### Entering a New Quadrant

Combined with LRS data on one screen:
```
ANTARES II  Q:3,4
CONDITION RED!
 010[045]105
 *** 100 012
```

If no LRS damage, shows surrounding quadrants automatically. If LRS damaged, just shows the quadrant name and condition.

### Win/Lose Screens

**Win:**
```
CONGRATULATIONS!
ALL KLINGONS DESTROYED
EFFICIENCY: 875.0
PLAY AGAIN? Y/N
```

**Lose (destroyed):**
```
THE ENTERPRISE HAS
BEEN DESTROYED.
FEDERATION CONQUERED.
PLAY AGAIN? Y/N
```

**Lose (time expired):**
```
STARDATE EXPIRED!
12 KLINGONS REMAIN
THE FEDERATION FALLS
PLAY AGAIN? Y/N
```

---

## Screen Count Comparison

| Screen | Without 2-col | With 2-col | Saving |
|--------|---------------|------------|--------|
| Damage report | 2 pages | **1 page** | -1 |
| Phaser results | 1-3 pages | **1 page** | up to -2 |
| Klingon return fire | 1-3 pages | **1 page** | up to -2 |
| Mission briefing | 3 pages | **2 pages** | -1 |
| Torpedo data | 2 pages | **1 page** | -1 |
| Quadrant entry + LRS | 2 pages | **1 page** | -1 |

---

## Game Mechanics — Full Parity with Original

### All Features Preserved

| Feature | Notes |
|---------|-------|
| 8×8 galaxy (64 quadrants) | KBS encoding (Klingons×100 + Bases×10 + Stars) |
| 8×8 sectors per quadrant | Numeric array instead of string-based map |
| NAV (course 1-9, warp 0-8) | Fractional courses supported via INPUT |
| SRS with condition | GREEN/YELLOW/RED/DOCKED |
| LRS 3×3 scan | Reveals and records adjacent quadrants |
| Phasers | Energy distributed among targets, inverse-distance falloff |
| Torpedoes | Track along course vector, hit first entity in path |
| Shields | Energy transfer to/from shields |
| 8 damage systems | WARP/SRS/LRS/PHA/TOR/DAM/SHE/COM |
| Random damage/repair on warp | ~20% chance each warp, same probabilities |
| Starbase docking | Adjacent sector = docked, full refuel + torpedo reload |
| Klingon counterattack | After every player action when Klingons present |
| Klingon movement | Klingons reposition when Enterprise warps in quadrant |
| Time limit (stardates) | 25-34 days randomly determined |
| Max 3 Klingons per quadrant | Same density as original |
| 10 photon torpedoes | Start value |
| 3000 energy | Start value |
| Klingon shield 200 | ×(0.5+RND) per Klingon |
| Quadrant names | 16 star names × I/II/III/IV suffixes |
| Efficiency rating on win | 1000 × (kills / time_elapsed)² |
| Edge-of-galaxy denial | "Permission denied" message |
| Play again prompt | After any ending |
| Computer sub-commands | 4 of 6 kept (record, status, torpedo data, base nav) |

### Adapted for 32×4 Display

| Feature | Original (80×24) | VX-4 (32×4) |
|---------|-------------------|-------------|
| SRS sector grid | 8 rows + sidebar all at once | 4 rows at a time, auto-centered, sidebar |
| Command input | Type 3-letter command | Single keypress (N/S/L/P/T/H/D/C/Q) |
| Phaser results | 1 message per Klingon, sequential | All Klingons on 1 screen, 2-col format |
| Klingon fire | 1 message per Klingon, sequential | All hits on 1 line: `K1:45 K2:30 K3:20` |
| Damage report | Full 8-row table | 2-column: all 8 systems on 1 screen |
| Mission briefing | 7+ lines of text | 2 compact screens |
| Galactic record | Full 8×8 table | 4×4 per page, 4 pages |
| Torpedo track | One position per PRINT line | Compact coordinates on single line |
| Quadrant entry | Separate name + LRS screens | Combined: name + LRS on 1 screen |
| ASCII art intro | Enterprise drawing | Text-only splash |

### Cut (Low Value for Pocket Computer)

| Feature | Reason |
|---------|--------|
| Computer cmd 4 (D/D calculator) | Manual calculation easy on 8×8 grid |
| Computer cmd 5 (galaxy region name map) | Quadrant names shown on entry |
| Verbose crew dialogue | Condensed equivalents convey same info |

---

## Data Structures

```
G(8,8)    Galaxy map: K*100 + B*10 + S per quadrant
Z(8,8)    Explored map: same encoding, 0 = unexplored
Q(8,8)    Sector grid: 0=empty, 1=Enterprise, 2=Klingon, 3=star, 4=base
K(3,3)    Klingon data: K(i,1)=row, K(i,2)=col, K(i,3)=energy
D(8)      System damage: negative=damaged, 0=ok, positive=above normal
C(9,2)    Course vectors: C(dir,1)=dx, C(dir,2)=dy for directions 1-8
```

Additional scalar variables:
```
Q1,Q2     Current quadrant (row, col)
S1,S2     Current sector (row, col)
E         Energy
S         Shield energy
P         Photon torpedoes remaining
T         Current stardate
T0        Starting stardate
T9        Time limit (days)
K9        Total Klingons remaining in galaxy
B9        Total starbases remaining
K3        Klingons in current quadrant
B3        Starbases in current quadrant
S3        Stars in current quadrant
B4,B5     Starbase position in current sector
D0        Docked flag (1=docked, 0=not)
K7        Initial Klingon count (for rating calculation)
E0        Starting energy (for refuel reference)
P0        Starting torpedoes (for reload reference)
```

---

## Program Structure (estimated ~350-400 lines)

```
Lines 1-5        REM header
Lines 10-25      Splash screen + mission briefing (2 screens)
Lines 30-80      Initialisation: course vectors, galaxy generation, ship placement
Lines 100-140    Main loop: SRS display + command input + dispatch
Lines 150-199    SRS display subroutine (4-row sector grid + sidebar + auto-center)
Lines 200-290    NAV: course input, warp, movement, quadrant transitions
Lines 300-360    Klingon attack subroutine (consolidated 2-col results)
Lines 370-399    Random damage/repair during warp
Lines 400-460    PHA: phaser fire (2-col hit reporting)
Lines 470-540    TOR: torpedo launch, track, hit detection
Lines 550-580    SHE: shield energy transfer
Lines 590-630    DAM: damage report (2-col single screen) + docked repair
Lines 650-700    LRS: long range scan display
Lines 710-760    Enter new quadrant: populate sector, combined LRS display
Lines 770-799    Starbase docking check subroutine
Lines 800-830    COM: computer menu dispatch
Lines 840-870    COM 0: galactic record (4×4 paged)
Lines 880-899    COM 1: status report
Lines 900-920    COM 2: torpedo data (2-col direction+distance)
Lines 930-950    COM 3: starbase navigation data
Lines 960-990    Win/lose/game over screens, efficiency rating, play-again
Lines 1000-1020  Utility: find random empty sector cell
Lines 1030-1050  Utility: place/remove entity in sector grid
Lines 1060-1090  Quadrant name lookup (16 star names via DATA/computed)
Lines 1100-1120  Direction/distance calculation subroutine
```

---

## Implementation Order

1. **Data structures + galaxy generation** — arrays, random placement, course vectors
2. **SRS display** — the core 4-row sector grid with sidebar and auto-centering
3. **Command dispatch loop** — single-keypress input, dispatch to subroutines
4. **NAV** — full course + warp, intra-quadrant movement, quadrant transitions
5. **Enter new quadrant** — populate sector grid from galaxy data, combined LRS display
6. **PHA** — phaser combat with 2-col hit reporting
7. **TOR** — torpedo fire with compact track
8. **Klingon counterattack** — consolidated 2-col damage display
9. **SHE** — shield control
10. **DAM** — 2-col damage report, docked repair
11. **LRS** — long range scan
12. **Docking** — starbase adjacency detection, refuel/repair
13. **Random damage/repair** — on warp travel
14. **COM** — computer sub-commands (record, status, torpedo data, base nav)
15. **Win/lose** — all end conditions, efficiency rating, play-again
16. **Quadrant names** — 16 star name lookup
17. **Testing + polish** — balance, edge cases, message formatting
