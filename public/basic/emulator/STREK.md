# Super Star Trek

A faithful conversion of the classic 1978 Super Star Trek by Mike Mayfield and Bob Leedom, adapted for the Casio FX-870P / VX-4's 32×4 character display.

## Mission

Destroy all Klingon warships in the galaxy before time runs out. You command the USS Enterprise, navigating an 8×8 galaxy of quadrants, each containing an 8×8 grid of sectors.

## Display

The Short Range Scan (SRS) is the main display, showing 4 of 8 sector rows at a time, auto-centered on the Enterprise:

```
1..K..*.. E:2450
2..E..... S: 200
3......*. T:8 K:3
NSLPTHDCQ+
```

### Map Symbols

| Symbol | Meaning |
|--------|---------|
| `E` | USS Enterprise |
| `K` | Klingon warship |
| `B` | Starbase |
| `*` | Star |
| `.` | Empty space |

### Sidebar

| Label | Meaning |
|-------|---------|
| E: | Energy remaining |
| S: | Shield energy |
| T: | Photon torpedoes |
| K: | Klingons remaining (galaxy-wide) |
| GRN/YEL/RED/DOC | Condition |

## Commands

Press a single key at the command prompt:

| Key                                                         | Command | Description |
|-------------------------------------------------------------|---------|-------------|
| ![N](../../../images/keys/standard/n.png)                   | NAV | Navigate — set course (1-8) and warp factor (0-8) |
| ![S](../../../images/keys/standard/s.png)                   | SRS | Short Range Scan — refresh the sector display |
| ![L](../../../images/keys/standard/l.png)                   | LRS | Long Range Scan — show 3×3 surrounding quadrants |
| ![P](../../../images/keys/standard/p.png)                   | PHA | Phasers — fire energy weapons at all Klingons in sector |
| ![T](../../../images/keys/standard/t.png)                   | TOR | Torpedo — fire a photon torpedo along a course |
| ![H](../../../images/keys/standard/h.png)                   | SHE | Shields — transfer energy to/from shields |
| ![D](../../../images/keys/standard/d.png)                   | DAM | Damage — show status of all 8 ship systems |
| ![C](../../../images/keys/standard/c.png)                   | COM | Computer — access galactic record, status, navigation data |
| ![Q](../../../images/keys/standard/q.png)                   | QUIT | Resign your command |
| ![+](../../../images/keys/standard/plus.png)                | HELP | Show command key reference |

## Course Directions

Used for both navigation and torpedoes:

```
  4 3 2
  5 * 1
  6 7 8
```

Direction 1 = right, 3 = up, 5 = left, 7 = down. Intermediate values (2, 4, 6, 8) are diagonals.

## Ship Systems

The damage report shows all 8 systems on one screen in three columns:

```
DAMAGE REPORT
WRP 0.0 SRS 0.0 LRS 0.0
PHA 0.0 TOR 0.0 DAM 0.0
SHD 0.0 CMP 0.0
```

| # | System | Abbreviation | Effect When Damaged |
|---|--------|-------------|---------------------|
| 1 | Warp Engines | WRP | Max warp limited to 0.2 |
| 2 | Short Range Sensors | SRS | Cannot display sector map |
| 3 | Long Range Sensors | LRS | Cannot scan adjacent quadrants |
| 4 | Phaser Control | PHA | Cannot fire phasers |
| 5 | Photon Tubes | TOR | Cannot fire torpedoes |
| 6 | Damage Control | DAM | Damage report limited |
| 7 | Shield Control | SHD | Cannot adjust shields |
| 8 | Library Computer | CMP | Computer commands unavailable |

## Game Mechanics

### Energy
- Start with **3000 energy** and **10 torpedoes**
- Warp travel costs energy (warp factor × 8 + 10 units)
- Phasers consume the energy you allocate to them
- Torpedoes cost 2 energy each
- If energy + shields drop to 10 or below, game over

### Shields
- Transfer energy to shields to absorb Klingon attacks
- Shields drain when hit — if shields reach 0, the Enterprise is destroyed
- Docking at a starbase resets shields to 0 (you're protected by the base)

### Starbases
- Move to a sector adjacent to a starbase to **dock**
- Docking fully restores energy, torpedoes, and repairs all systems
- The condition indicator shows **DOC** when docked

### Combat
- **Phasers** automatically target all Klingons in the quadrant. Damage decreases with distance. Energy allocated is split among targets.
- **Torpedoes** travel in a straight line along the course you choose. They destroy the first thing they hit (Klingon, star, or starbase).
- After your action, Klingons **fire back**. Their damage depends on their remaining strength and distance.

### Random Events
- Each warp jump has a ~20% chance of causing random system damage or repair
- Klingon hits can damage random systems (proportional to hit strength)

### Computer Sub-Commands
- **0 — Galactic Record**: Shows explored quadrants (3-digit KBS: Klingons/Bases/Stars)
- **1 — Status Report**: Klingons remaining, days left, starbases
- **2 — Torpedo Data**: Direction to each Klingon in the current quadrant
- **3 — Base Nav**: Direction and distance to the starbase (if present)

## Long Range Scan

The LRS shows a 3×3 grid of surrounding quadrants:

```
ANTARES II  Q:3,4
 113 207 003
 010[045]105
 *** 100 012
```

Each 3-digit number encodes: Klingons × 100 + Bases × 10 + Stars. `[045]` marks your current quadrant. `***` = edge of galaxy.

## Victory & Defeat

- **Win**: Destroy all Klingons before the deadline
- **Lose**: Time expires, Enterprise destroyed, or energy depleted
- **Rating**: Efficiency = 1000 × (kills / days_elapsed)²

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**

## About

The original Star Trek game was created by Mike Mayfield in 1971. Bob Leedom enhanced it into "Super Star Trek" in 1974, which was published in David Ahl's *BASIC Computer Games* (1978) — one of the first million-selling computer books. This version preserves the full 8×8 galaxy, all combat mechanics, and the complete damage/repair system, adapted for the Casio VX-4's 32×4 character display with single-keypress controls and two-column status layouts.
