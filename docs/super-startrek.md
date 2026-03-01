# Super Star Trek — Complete Guide

A faithful conversion of the classic 1978 Super Star Trek for the Casio FX-870P / VX-4 pocket computer emulator.

---

## History and Origins

The following history is adapted from the [Super Star Trek README](https://github.com/philspil66/Super-Star-Trek) by philspil66, whose repository also provided the reference BASIC source code used for this conversion.

Super Star Trek is one of the most famous early text-only computer games ever created — as iconic as The Oregon Trail or Zork — and it inspired countless other video games. Since the code was public domain, it was changed and improved many times over the years. There are literally thousands of versions out there.

### Timeline

**1971 — Mike Mayfield** wrote the original Star Trek game for the Sigma 7 mainframe. The program didn't even require a screen — you could play it with a teleprinter machine: enter a command after the prompt, and the game printed some lines in return.

**1972** — Mayfield rewrote the game in HP BASIC. One year later, the code became "public domain" when it was placed on several HP data center machines. This version is what people consider the "standard" Star Trek game.

**1973** — David H. Ahl, founder of *Creative Computing* magazine, published a BASIC-PLUS version called *Space War* in his book *BASIC COMPUTER GAMES*.

**1974 — Bob Leedom**, a Westinghouse employee, ported the game to a Data General Nova 800. This computer had 32K of RAM, so he expanded and improved the code, calling it **Super Star Trek**. Leedom enhanced the mechanics, improved the map, changed the original numeric commands into readable names (NAV, PHA, COM), and added occasional feedback from Spock, Uhura, Sulu, Scotty, and more.

All of this happened before the first home computers were even invented — the Commodore PET, Apple II, and TRS-80 weren't released until 1977.

**1978** — David Ahl published Leedom's version in *BASIC Computer Games — Microcomputer Edition*. It became the first computer book to sell one million copies, buoyed by the arrival of home computers that could run BASIC. The game became hugely popular.

### This Version

This Casio VX-4 adaptation preserves the full 8x8 galaxy, all combat mechanics, the complete damage/repair system, and all strategic depth of the 1978 original. The challenge was fitting the game's output onto a 32-column by 4-row LCD display. The solution uses auto-centering displays, two-column layouts, and single-keypress commands to keep the game playable without a full terminal.

### Attribution

- **Original concept**: Mike Mayfield (1971)
- **Super Star Trek**: Bob Leedom (1974)
- **Published in**: David Ahl, *BASIC Computer Games — Microcomputer Edition* (1978)
- **Source reference**: [philspil66/Super-Star-Trek](https://github.com/philspil66/Super-Star-Trek) on GitHub
- **Casio VX-4 adaptation**: Created for the FX-870P Emulator project

---

## The Mission

You are the captain of the USS Enterprise. Your mission: **destroy all Klingon warships in the galaxy before time runs out**.

At the start of each game, you are told:
- How many **Klingons** you must destroy (typically 10-20)
- How many **stardates** (days) you have to complete the mission (25-34)
- How many **starbases** are available for resupply

The galaxy is an **8x8 grid of quadrants** (64 total). Each quadrant contains an **8x8 grid of sectors** (64 positions). You navigate between quadrants at warp speed and manoeuvre within quadrants at impulse speed.

---

## Loading and Starting the Game

1. Open the emulator and click **LIB** in the toolbar
2. Find "Super Star Trek" and click **LOAD**
3. On the calculator, type: `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
4. Wait for the transfer to complete
5. Press **MODE**, select **BASIC**
6. Type `RUN` and press **EXE**

The title screen appears:

```
** SUPER STAR TREK **
USS ENTERPRISE NCC-1701
PRESS ANY KEY...
```

Press any key to see your mission orders:

```
ORDERS: DESTROY 15
KLINGONS IN 28 DAYS
3 STARBASE(S) IN GALAXY
ANY KEY...
```

---

## Understanding the Display

### Short Range Scan (SRS) — The Main Screen

The SRS is the primary display. It shows **4 of the 8 sector rows** at a time, auto-centered on the Enterprise's position:

```
1..K..*.. E:2450
2..E..... S: 200
3......*. T:8 K:3
NSLPTHDCQ+
```

**Left side** — Sector map (columns 0-9):
- The leading number is the **row number** (1-8)
- Each character after it represents one sector position

**Right side** — Status sidebar (columns 11+):
- `E:` — Energy remaining (start: 3000)
- `S:` — Shield energy
- `T:` — Photon torpedoes remaining / `K:` — Klingons left in the galaxy
- Bottom line: Command prompt or condition indicator

**Map symbols:**

| Symbol | Meaning |
|--------|---------|
| `E` | USS Enterprise (you) |
| `K` | Klingon warship |
| `B` | Starbase |
| `*` | Star |
| `.` | Empty space |

**Auto-centering**: The display always keeps the Enterprise visible. If you're in row 5, it shows rows 4-7. Scroll indicators (`^` and `v`) appear when there are rows above or below the visible area.

**Condition indicators** (shown at bottom-right of SRS):

| Code | Meaning |
|------|---------|
| `GRN` | Green — no Klingons in this quadrant |
| `YEL` | Yellow — energy below 10% |
| `RED` | Red — Klingons present in this quadrant |
| `DOC` | Docked at a starbase |

### Entering a New Quadrant

When you warp into a new quadrant, you see:

```
ANTARES II  Q:3,4
** CONDITION RED **
SHIELDS LOW!
ANY KEY...
```

This tells you the quadrant name, your coordinates (row 3, column 4), and whether enemies are present.

---

## Commands

All commands are entered by pressing a **single key** — no need to type full words or press EXE.

The command prompt shows available keys:

```
NSLPTHDCQ+
```

Press `+` at any time to see the help screen:

```
N=NAV S=SRS L=LRS
P=PHA T=TOR H=SHE
D=DAM C=COM Q=QUIT
PRESS COMMAND KEY
```

### Command Reference

| Key | Command | Description |
|-----|---------|-------------|
| **N** | Navigate | Set course and warp speed to move |
| **S** | Short Range Scan | Refresh the sector display |
| **L** | Long Range Scan | Scan the 3x3 surrounding quadrants |
| **P** | Phasers | Fire energy weapons at Klingons |
| **T** | Torpedo | Launch a photon torpedo on a heading |
| **H** | Shields | Transfer energy to or from shields |
| **D** | Damage Report | View status of all 8 ship systems |
| **C** | Computer | Access the ship's library computer |
| **Q** | Quit | Resign your command |
| **+** | Help | Show the command key reference |

---

## Navigation (N)

Navigation is how you move around the galaxy. When you press **N**, you see a course diagram:

```
COURSE:  4 3 2
         5 * 1
         6 7 8
ENTER (1-9)?
```

### Course Directions

The compass rose maps numbers to directions:

```
  4  3  2
  5  *  1
  6  7  8
```

| Course | Direction |
|--------|-----------|
| 1 | Right (East) |
| 2 | Up-Right (NE) |
| 3 | Up (North) |
| 4 | Up-Left (NW) |
| 5 | Left (West) |
| 6 | Down-Left (SW) |
| 7 | Down (South) |
| 8 | Down-Right (SE) |
| 9 | Same as 1 (wraps around) |

Press a digit key (1-9) to select your course. Then you are prompted for warp factor:

```
COURSE: 3
MAX WARP: 8
WARP FACTOR?
```

### Warp Speed

| Warp Factor | Effect |
|-------------|--------|
| 0.1 - 0.9 | Move within the current quadrant (fractional sectors) |
| 1 | Move to the adjacent quadrant in the chosen direction |
| 2-8 | Move multiple quadrants (higher = faster but costs more energy) |

**Energy cost**: warp factor x 8 + 10 units per move.

**Time cost**: Warp 1+ uses 1 stardate. Sub-warp (< 1.0) uses a fraction of a stardate.

If **warp engines are damaged**, maximum speed is limited to **warp 0.2**. You'll need to find a starbase to repair them.

If you try to leave the galaxy (go past the 8x8 boundary), you'll see:

```
EDGE OF GALAXY
PERMISSION DENIED
```

### Collisions

If you fly into a star, starbase, or Klingon while manoeuvring within a quadrant, you'll be blocked:

```
BLOCKED AT SECTOR
4, 6
ANY KEY...
```

Your ship stops at the last clear position before the obstacle.

---

## Combat

### Phasers (P)

Phasers are energy weapons that automatically target all Klingons in the current quadrant. Press **P** to fire:

```
PHASERS: 2 KLINGON(S)
ENERGY: 2450
UNITS TO FIRE?
```

Enter the amount of energy to allocate. The energy is **split equally** among all Klingon targets, and damage decreases with distance. Results are shown one line per Klingon:

```
K1@3,7 DESTROYED
K2@6,2:200 LEFT:150
ANY KEY...
```

**Tips**:
- Allocate more energy when targets are far away — damage falls off with distance
- If the computer is damaged, phaser accuracy is reduced (random multiplier applied)
- After you fire, surviving Klingons fire back

### Photon Torpedoes (T)

Torpedoes travel in a straight line along a course you choose and destroy the first thing they hit. Press **T** to fire:

```
TORPEDO:  4 3 2
          5 * 1
          6 7 8
COURSE (1-9)?
```

Use the same course diagram as navigation. The torpedo track is displayed:

```
TORPEDO TRACK:
 4,5  3,5  2,5
*** KLINGON DESTROYED
ANY KEY...
```

Torpedoes can hit:
- **Klingons** — destroyed instantly regardless of their remaining energy
- **Stars** — torpedo absorbed, no effect
- **Starbases** — destroyed! (Very bad — you lose a resupply point. If it was the last starbase and you can't finish the mission in time, you'll be relieved of command.)

**Tips**:
- Use the computer's torpedo data (COM 2) to calculate the exact course to a Klingon
- Torpedoes are more efficient than phasers for distant targets — they always kill in one hit
- You start with 10 torpedoes and each shot costs 2 energy in addition to the torpedo itself

### Klingon Counterattack

After every combat action (phasers or torpedoes), surviving Klingons in the quadrant fire back. Damage depends on their remaining energy strength and their distance from you:

```
KLINGON FIRE:
K1:45 K2:30
SHIELDS: 125
ANY KEY...
```

Klingon hits can also damage random ship systems if the hit is strong enough.

If you are **docked at a starbase**, the starbase shields protect you:

```
STARBASE SHIELDS
PROTECT ENTERPRISE
ANY KEY...
```

---

## Shields (H)

Shields absorb Klingon attacks. Without shields, even a modest hit will destroy the Enterprise. Press **H** to adjust:

```
SHIELD CONTROL
ENERGY+SHIELDS: 2650
SHIELDS NOW: 200
NEW VALUE?
```

Enter the new shield level. Energy is transferred between your main energy banks and shields:
- **Raising shields**: Energy decreases, shields increase
- **Lowering shields**: Shields decrease, energy increases

**Tips**:
- Before entering a quadrant with Klingons, raise shields to at least 200-300
- When shields reach 0 from enemy fire, the Enterprise is **destroyed**
- Docking at a starbase sets shields to 0 (the base protects you)
- Don't put all your energy into shields — you need energy for warp drive and phasers

---

## Damage Report (D)

Shows all 8 ship systems on a single screen in three columns:

```
DAMAGE REPORT
WRP 0.0 SRS 0.0 LRS 0.0
PHA 0.0 TOR 0.0 DAM 0.0
SHD 0.0 CMP 0.0
```

If docked at a starbase, the header changes to a repair prompt:

```
DOCKED:REPAIR? Y/N
WRP 0.0 SRS 0.0 LRS-1.2
PHA 0.0 TOR 0.0 DAM-0.8
SHD 0.0 CMP 0.0
```

**Reading damage values**:
- **0.0** = Fully operational
- **Negative** (e.g., -1.2) = Damaged — that system is offline
- **Positive** (e.g., 1.5) = Above normal (from random repair events)

### Ship Systems

| # | System | Abbrev | Effect When Damaged |
|---|--------|--------|---------------------|
| 1 | Warp Engines | WRP | Maximum warp limited to 0.2 |
| 2 | Short Range Sensors | SRS | Cannot display the sector map |
| 3 | Long Range Sensors | LRS | Cannot scan adjacent quadrants |
| 4 | Phaser Control | PHA | Cannot fire phasers |
| 5 | Photon Tubes | TOR | Cannot fire torpedoes |
| 6 | Damage Control | DAM | Damage report limited |
| 7 | Shield Control | SHD | Cannot adjust shields |
| 8 | Library Computer | CMP | Computer commands unavailable |

**Repairs**: If you are docked at a starbase when you view the damage report, you'll be asked "REPAIR? Y/N". Press **Y** to repair all damaged systems instantly.

---

## Long Range Scan (L)

Shows a 3x3 grid of surrounding quadrants:

```
ANTARES II  Q:3,4
 113 207 003
 010[045]105
 *** 100 012
```

- Line 1: Current quadrant name and coordinates
- Lines 2-4: The nine surrounding quadrants (including your own)

**Reading the 3-digit codes**: Each number encodes **Klingons x 100 + Bases x 10 + Stars**.

| Code | Meaning |
|------|---------|
| `207` | 2 Klingons, 0 bases, 7 stars |
| `015` | 0 Klingons, 1 base, 5 stars |
| `[045]` | Your current quadrant (0 Klingons, 4 bases, 5 stars) |
| `***` | Edge of galaxy (out of bounds) |

The LRS also records all scanned quadrants for the galactic record (Computer command 0).

**Tip**: Use LRS frequently to find Klingons and plan your route. Efficient exploration is critical — you need to clear all Klingons before time expires.

---

## Computer (C)

The ship's library computer provides four functions. Press **C** then select a sub-command:

```
COMPUTER ACTIVE
0=RECORD  1=STATUS
2=TORPEDO 3=BASE
COMMAND (0-3)?
```

### 0 — Galactic Record

Displays all quadrants you've explored via LRS. Shows 4 rows and 4 columns per page (4 pages total):

```
GALAXY R:1-4 C:1-4
1 113 207 003 010
2 *** 045 105 012
3 *** 100 *** 003
```

Unexplored quadrants show `***`. Press any key to page through all columns and rows.

### 1 — Status Report

Summary of the current game state:

```
STATUS REPORT
KLINGONS LEFT: 12
DAYS LEFT: 18.0
STARBASES: 3
```

### 2 — Torpedo Data

Calculates the exact direction to each Klingon in the current quadrant:

```
TORPEDO DATA:
K1@3,7 D:6.2
K2@6,2 D:3.1
ANY KEY...
```

The `D:` value is the **course direction** to use with the torpedo command. Enter this value as your torpedo course for a direct hit.

### 3 — Starbase Navigation

Shows the direction and distance to the starbase in the current quadrant (if any):

```
STARBASE AT 4, 3
DIRECTION: 6.2
DISTANCE: 2.8
ANY KEY...
```

Use this when you need to dock for repairs and resupply.

---

## Starbases

Starbases are your lifeline. Moving to a sector **adjacent** to a starbase (including diagonals) automatically docks you:

- **Energy** fully restored to 3000
- **Torpedoes** reloaded to 10
- **Shields** set to 0 (the base shields protect you)
- **All systems** can be repaired via the damage report screen (press **D**, then **Y**)

The condition indicator shows **DOC** when docked. While docked, Klingon fire is absorbed by the starbase shields.

**Tips**:
- Don't destroy starbases with stray torpedoes!
- Plan your route to pass near starbases when energy is low
- Use the computer's base navigation (COM 3) to find the nearest starbase

---

## Random Events

### Warp Travel Damage and Repair

Each time you warp, there is approximately a **20% chance** of a random event:
- **60% chance of repair**: A random system gains 1-4 points of repair
- **40% chance of damage**: A random system takes 1-6 points of damage

This means systems can fail unexpectedly during travel, and damaged systems sometimes repair themselves.

### Combat Damage

When Klingons hit the Enterprise with strong attacks (20+ damage), there is a chance a random ship system will take collateral damage. The amount of system damage is proportional to the hit strength relative to your shield level.

---

## Strategy Guide

### Opening Moves

1. **Raise shields** to at least 200-300 immediately
2. **LRS scan** to find Klingons in adjacent quadrants
3. **Plan a route** that covers multiple Klingon quadrants efficiently
4. **Don't waste time** — every warp move costs a stardate

### Energy Management

- Starting energy: **3000**. This sounds like a lot, but it depletes fast.
- A single warp-1 jump costs **18 energy** (8 + 10)
- A phaser blast of 500 energy might be needed to kill 2 Klingons
- If energy + shields drop to **10 or below**, the game is over
- Dock at starbases whenever convenient — full energy refill is free

### Combat Tactics

- **Phasers vs Torpedoes**: Use phasers for close enemies (high damage at short range). Use torpedoes for distant enemies or to conserve energy (torpedoes always destroy in one hit).
- **Alpha strike**: Enter a quadrant, immediately fire phasers with high energy to destroy Klingons before they can fire back.
- **Torpedo conservation**: You only get 10 torpedoes. Use them for high-value targets or when energy is low.
- **Retreat**: If a quadrant has 3 Klingons and you're low on energy, warp out and find a starbase first.

### Time Management

- Typical mission: destroy 15 Klingons in 28 days
- Each warp-1+ jump costs **1 stardate**. Sub-warp moves cost less.
- You need to average roughly **one kill every 2 stardates**
- Use LRS and the galactic record to plan efficient routes
- Don't backtrack — sweep the galaxy systematically

### Advanced Tips

- **Klingons move** when you navigate within their quadrant. If a Klingon is behind a star, try warping within the quadrant to get a clear shot.
- **Computer torpedo data** (COM 2) gives exact firing solutions. Use it before every torpedo shot.
- **Shield balancing**: Keep shields high enough to survive 2-3 hits, but not so high that you can't fire phasers. A good balance is 200-400 shields.
- **Docked repair**: When docked at a starbase, check the damage report and repair all systems. This is the only reliable way to fix damaged systems.
- **Edge of galaxy**: You cannot leave the 8x8 grid. If you're at the edge, some course directions are blocked.

---

## Victory and Defeat

### Ways to Win

**Destroy all Klingons** before the deadline. You'll see:

```
CONGRATULATIONS!
ALL KLINGONS DESTROYED
EFFICIENCY: 875
PLAY AGAIN? Y/N
```

Your efficiency rating is calculated as: **1000 x (total_kills / stardates_elapsed)^2**

Higher is better. Try to beat your previous score!

### Ways to Lose

1. **Enterprise destroyed**: Shields drop to 0 during a Klingon attack
2. **Energy depleted**: Total energy + shields falls to 10 or below
3. **Time expired**: All stardates used up before all Klingons are destroyed
4. **Relieved of command**: You destroy the last starbase when there are more Klingons than time remaining

### Resigning

Press **Q** at any time to resign your command. Your remaining Klingon count is shown.

Press **Y** at the "PLAY AGAIN?" prompt to start a new game with a freshly generated galaxy.

---

## Quick Reference Card

### Commands
```
N = Navigate     S = Short Range Scan
L = Long Range   P = Phasers
T = Torpedo      H = Shields
D = Damage       C = Computer
Q = Quit         + = Help
```

### Course Directions
```
  4  3  2
  5  *  1
  6  7  8
```

### Map Symbols
```
E = Enterprise   K = Klingon
B = Starbase     * = Star
. = Empty space
```

### LRS Codes
```
KBS = Klingons x 100 + Bases x 10 + Stars
Example: 207 = 2 Klingons, 0 bases, 7 stars
```

### Starting Resources
```
Energy:    3000
Torpedoes: 10
Shields:   0 (must be raised manually)
```

---

*Based on Super Star Trek by Mike Mayfield (1971) and Bob Leedom (1974), as published in David Ahl's* BASIC Computer Games — Microcomputer Edition *(1978). Adapted for the Casio FX-870P / VX-4 32x4 character display.*
