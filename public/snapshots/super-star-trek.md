# Super Star Trek

A faithful conversion of the classic 1978 Super Star Trek by Mike Mayfield and Bob Leedom, adapted for the Casio FX-870P / VX-4's 32×4 character display.

## Mission

Destroy all Klingon warships in the galaxy before time runs out. You command the USS Enterprise, navigating an 8×8 galaxy of quadrants, each containing an 8×8 grid of sectors.

## Display

The Short Range Scan (SRS) is the main display, showing 4 of 8 sector rows at a time. Auto-centers on the Enterprise, or press 1–5 to scroll manually:

```
1..K..*.. ENERGY:2450        ↑
2..E..... SHIELD: 200
3......*. TORP:8 KLING:3
4.....*.. DOCK NSLPTHDCQ1→5+
```

### Map Symbols

| Symbol | Meaning |
|--------|---------|
| `E` | USS Enterprise |
| `K` | Klingon warship |
| `B` | Starbase |
| `*` | Star |
| `.` | Empty space |

## Commands

Press a single key at the command prompt:

| Key | Command | Description |
|-----|---------|-------------|
| N | NAV | Navigate — set course (1–8) and warp factor (0–8) |
| S | SRS | Short Range Scan — refresh the sector display |
| L | LRS | Long Range Scan — show 3×3 surrounding quadrants |
| P | PHA | Phasers — fire energy weapons at all Klingons in sector |
| T | TOR | Torpedo — fire a photon torpedo along a course |
| H | SHE | Shields — transfer energy to/from shields |
| D | DAM | Damage — show status of all 8 ship systems |
| C | COM | Computer — galactic record, status, navigation data |
| Q | QUIT | Resign your command |
| + | HELP | Show command reference |
| 1–5 | SCROLL | Set top row of SRS display |

## Course Directions

```
  4 3 2
  5 * 1
  6 7 8
```

Direction 1 = right, 3 = up, 5 = left, 7 = down. Intermediate values are diagonals.

## Game Mechanics

- Start with **3000 energy** and **10 torpedoes**
- Warp travel costs energy (warp factor × 8 + 10 units)
- Dock at a starbase to fully restore energy, torpedoes, and repair systems
- Phasers split energy among all Klingons in the sector; damage falls with distance
- Torpedoes travel in a straight line, destroying the first thing they hit
- Klingons fire back after each of your actions

## About

The original Star Trek game was created by Mike Mayfield in 1971. Bob Leedom enhanced it into "Super Star Trek" in 1974, published in David Ahl's *BASIC Computer Games* (1978). This snapshot places you at the start screen with a freshly generated galaxy, ready to play.
