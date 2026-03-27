# Requirements 3 & 4: Data Structures

This document defines the static data encoding (DATA statements) and dynamic game state (arrays and variables) for the Sorcerer's Cave implementation on the Casio VX-4.

## Design Principles

1. **Numeric encoding over strings** — strings use more memory (variable name + 4 bytes + string length + 1). Numeric arrays use 8 bytes per element regardless of value. For card data that's mostly small numbers, packed numeric encoding is far more compact.
2. **Bit-packing where practical** — multiple properties can be packed into a single number. The VX-4 has 13-digit BCD precision internally, but for bit-packing we'll use values up to 65535 (16 bits via &H notation).
3. **Short variable names** — single or two-character names for frequently-used variables to minimise memory.
4. **Reuse arrays** — a single array can serve multiple purposes if the data is structured carefully.

---

## Requirement 3: Static Data (DATA Statements)

### 3.1 Area Cards (Large Pack)

60 area cards, each encoded as a single number packing exits, type, and special status.

**Encoding scheme — single integer per card:**

```
Bits 0-3: Exits (N=1, E=2, S=4, W=8)
Bit 4:    Is chamber (1=chamber, 0=tunnel/corridor)
Bit 5:    Has stairway up
Bit 6:    Has stairway down
Bits 7-9: Special type (0=none, 1=Gateway, 2=Deep Pool, 3=Viper Pit, 4=Tomb of Kings, 5=Great Hall)
```

Examples:
- `NSEWUD` (all exits, up, down, no chamber) = 1+2+4+8+32+64 = 111
- `NESC` (N,E,S exits, chamber) = 1+2+4+16 = 23
- `NSEWC` + GATEWAY = 1+2+4+8+16+128 = 159 (special=1, shifted to bit 7)
- `NSEWC` + DEEP POOL = 1+2+4+8+16+256 = 287 (special=2)
- `NSEWC` + VIPER PIT = 1+2+4+8+16+384 = 415 (special=3)
- `NSEWC` + TOMB OF KINGS = 1+2+4+8+16+512 = 543 (special=4)
- `NSEWC` + GREAT HALL = 1+2+4+8+16+640 = 671 (special=5)

**DATA statement (line 8000):**

```basic
8000 DATA 111,23,73,23,79
8010 DATA 543,671,287,31,15
8020 DATA 25,23,9,7,11
8030 DATA 415,9,43,75,9
8040 DATA 9,191,39,71,14
8050 DATA 31,27,25,66,22
8060 DATA 14,5,69,31,23
8070 DATA 25,22,47,46,11
8080 DATA 10,78,31,3,78
8090 DATA 27,6,72,15,7
8100 DATA 27,37,23,13,13
8110 DATA 12,78,6,5,12
8120 DATA 25
```

(60 values, 12 lines of 5 values each — to be calculated precisely from the card list)

**Decoding subroutine:**

```basic
9100 REM DECODE AREA CARD
9110 REM Input: AC = card value
9120 REM Output: AN,AE,AS,AW = exits (0/1)
9130 REM         AU,AD = stairs up/down
9140 REM         AH = is chamber
9150 REM         AT = special type
9160 AN = AC AND 1
9170 AE = (AC AND 2) / 2
9180 AS = (AC AND 4) / 4
9190 AW = (AC AND 8) / 8
9200 AH = (AC AND 16) / 16
9210 AU = (AC AND 32) / 32
9220 AD = (AC AND 64) / 64
9230 AT = (AC AND 896) / 128
9240 RETURN
```

### 3.2 Creature Data

Each creature type is encoded with its properties. We define creature types by index (0-17).

**Creature type indices:**

| Index | Type | Category |
|-------|------|----------|
| 0 | HERO | Starting |
| 1 | WOMAN-HERO | Starting + Cave |
| 2 | OGRE | Starting + Cave |
| 3 | TROLL | Starting + Cave |
| 4 | PRIEST | Starting |
| 5 | MAN | Starting |
| 6 | WOMAN | Starting |
| 7 | DWARF | Starting |
| 8 | WIZARD | Cave |
| 9 | SPECTRE | Cave |
| 10 | DRAGON | Cave |
| 11 | THE SORCERER | Cave |
| 12 | GIANT | Cave |
| 13 | UNICORN | Cave |

**Creature properties (6 values per creature in DATA):**

```
Value 1: Fighting Strength
Value 2: Magical Power
Value 3: Carrying capacity (kg) / 25 (to keep values small: 0,1,2,3,4,6)
Value 4: Selection Value (0 for cave-only creatures)
Value 5: Point Value
Value 6: Flags (bit-packed):
         Bit 0: Is human (can use most artifacts)
         Bit 1: Has charisma (hero bonus on stranger test)
         Bit 2: Befriends unicorn (women)
         Bit 3: Guides past traps (dwarf)
         Bit 4: Inhuman
```

**DATA statement (line 8200):**

```basic
8200 REM CREATURE DATA: FS,MP,CARRY/25,SEL,PTS,FLAGS
8210 DATA 3,0,3,6,10,3
8220 DATA 4,0,2,5,10,7
8230 DATA 5,0,4,5,5,16
8240 DATA 4,0,3,4,4,16
8250 DATA 2,2,1,4,8,1
8260 DATA 3,0,2,3,5,1
8270 DATA 2,0,1,2,5,5
8280 DATA 1,0,1,1,2,25
8290 DATA 2,5,0,0,15,1
8300 DATA 0,5,0,0,0,0
8310 DATA 6,0,0,0,0,16
8320 DATA 4,9,0,0,0,0
8330 DATA 7,0,6,0,7,16
8340 DATA 0,4,0,0,4,16
```

**Creature names (kept short for display on 32-col screen):**

```basic
8350 REM CREATURE NAMES (index 0-13)
8360 DATA "HERO","W-HERO","OGRE","TROLL"
8370 DATA "PRIEST","MAN","WOMAN","DWARF"
8380 DATA "WIZARD","SPECTRE","DRAGON","SORCERR"
8390 DATA "GIANT","UNICORN"
```

**Number available in starting pack:**

```basic
8400 REM STARTING PACK COUNTS (index 0-7)
8410 DATA 1,1,3,3,3,6,3,3
```

**Number available in cave pack:**

```basic
8420 REM CAVE PACK COUNTS (index 0-13, 0 if not in cave pack)
8430 DATA 0,1,3,2,0,0,0,0,3,3,3,1,2,1
```

**Reaction tables (hostile upper bound, indifferent upper bound — friendly is above that):**

```basic
8440 REM REACTION TABLES: hostile_max, indifferent_max
8450 REM (friendly = indifferent_max+1 to 6)
8460 REM Index 8-13 (cave creatures only)
8470 DATA 1,5
8480 DATA 5,6
8490 DATA 6,6
8500 DATA 4,5
8510 DATA 3,4
8520 DATA 0,0
8530 DATA 3,5
8540 DATA 3,3
```

Note: UNICORN (index 13) has special handling — friendly to women, otherwise indifferent. Encoded as 0,0 with special logic in code. SORCERER (index 11) is always hostile (6,6).

### 3.3 Treasure Data

**Heavy treasure (3 types):**

| Index | Name | Weight | Points | Count |
|-------|------|--------|--------|-------|
| 0 | SILVER | 25 | 5 | 6 |
| 1 | GOLD | 25 | 10 | 6 |
| 2 | GEMS | 25 | 20 | 3 |

**Artifacts (12 types):**

| Index | Name | Points | Weight | Count |
|-------|------|--------|--------|-------|
| 3 | MAGIC SWORD | 15 | 0 | 1 |
| 4 | MAGIC CARPET | 5 | 0 | 1 |
| 5 | LOTUS DUST | 5 | 0 | 1 |
| 6 | HEALING BALM | 5 | 0 | 1 |
| 7 | TALISMAN | 10 | 0 | 1 |
| 8 | STRENGTH POTION | 5 | 0 | 1 |
| 9 | MAGIC STAFF | 15 | 0 | 1 |
| 10 | THE RING | 30 | 0 | 1 |
| 11 | LOST RUBY | 20 | 0 | 1 |
| 12 | CHARMED FLUTE | 10 | 0 | 1 |
| 13 | EYE OF GOD | 0 | 0 | 1 |
| 14 | TREASURE CHEST | 0 | 100 | 1 |

**DATA statement (line 8600):**

```basic
8600 REM TREASURE: POINTS, WEIGHT, COUNT
8610 DATA 5,25,6,10,25,6,20,25,3
8620 DATA 15,0,1,5,0,1,5,0,1,5,0,1
8630 DATA 10,0,1,5,0,1,15,0,1,30,0,1
8640 DATA 20,0,1,10,0,1,0,0,1,0,100,1
```

**Treasure names:**

```basic
8650 DATA "SILVER","GOLD","GEMS"
8660 DATA "M.SWORD","M.CARPET","L.DUST","H.BALM"
8670 DATA "TALISMAN","S.POTION","M.STAFF","RING"
8680 DATA "L.RUBY","C.FLUTE","EYE","CHEST"
```

### 3.4 Hazard Data

| Index | Name | Count |
|-------|------|-------|
| 0 | MUTINY | 1 |
| 1 | TRAP | 2 |
| 2 | EARTHQUAKE | 1 |
| 3 | MEDUSA | 1 |
| 4 | GHOULS | 1 |

```basic
8700 REM HAZARD COUNTS
8710 DATA 1,2,1,1,1
8720 DATA "MUTINY","TRAP","QUAKE","MEDUSA","GHOULS"
```

### 3.5 Small Pack Composition

The small pack has 52 cards total. Each card is encoded as a single number:

**Card encoding:**

```
Type byte (high digit):   1=creature, 2=treasure, 3=hazard
Index byte (low digits):  index within that type
```

So card value = type × 100 + index.

- Creature cards: 100 + creature_index (e.g., WIZARD = 108, DRAGON = 110)
- Treasure cards: 200 + treasure_index (e.g., SILVER = 200, MAGIC SWORD = 203)
- Hazard cards: 300 + hazard_index (e.g., TRAP = 301, MEDUSA = 303)

---

## Requirement 4: Dynamic Game State

### 4.1 Map State

The explored map is stored in arrays. Each area that has been placed gets an entry.

**Core map arrays:**

```basic
DIM MP(60)    : REM Map — area card value for each placed area (0=not placed)
DIM MX(60)    : REM X coordinate of area on its level
DIM MY(60)    : REM Y coordinate of area on its level
DIM ML(60)    : REM Level number for this area (1=first level)
DIM MV(60)    : REM Visited flag (0=face-down/dead-end, 1=explored, 2=chamber explored)
DIM MS(60)    : REM Stair connection — index of area connected by stairway (0=none)
```

**Map variables:**

```basic
NM = 0        : REM Number of areas placed so far
PA = 1        : REM Current party area index (starts at 1 = gateway)
PL = 1        : REM Current party level
PD = 0        : REM Direction party entered current area from (1=N,2=E,3=S,4=W,5=stairs)
```

### 4.2 Party State

The player's party is a collection of creatures, each potentially carrying treasure.

**Party arrays:**

```basic
DIM PC(12)    : REM Party creature type index (0-13), -1 = empty slot
DIM PS(12)    : REM Party creature status: 0=original, 1=ally, 2=stone, 3=dead
DIM PK(12)    : REM Dragon-slayer count for this creature
DIM PT(12,4)  : REM Treasure carried by creature i: up to 4 items per creature
                : REM Value = treasure index (0-14), -1 = empty slot
```

**Party variables:**

```basic
NP = 0        : REM Number of creatures in party (alive, not stone)
NC = 0        : REM Number of curses on party
SK = 0        : REM Sorcerer killed flag (0/1)
```

### 4.3 Chamber State

When a chamber is entered, its contents need to be tracked.

**Chamber arrays (temporary, reused per chamber):**

```basic
DIM CS(8)     : REM Strangers in current chamber — creature type index
DIM CT(8)     : REM Treasure in current chamber — treasure index
DIM CH(4)     : REM Hazards in current chamber — hazard index
```

**Chamber variables:**

```basic
NS = 0        : REM Number of strangers in chamber
NT = 0        : REM Number of treasure items in chamber
NH = 0        : REM Number of hazards in chamber
SI = 0        : REM Stranger indifference counter (solitaire: max 3)
SH = 0        : REM Strangers hostile flag (permanent for this chamber)
```

### 4.4 Persistent Chamber Contents

Chambers can contain leftover strangers and treasure from previous visits. We need to track which area has what contents.

**Persistent content arrays:**

```basic
DIM AC(60,4)  : REM Area contents — up to 4 items per area
                : REM Encoded: creature=100+type, treasure=200+type, 0=empty
DIM AF(60)    : REM Area flags per area:
                : REM Bit 0: has active trap
                : REM Bit 1: has active medusa
                : REM Bit 2: earthquake destroyed
                : REM Bit 3: strangers tested hostile
                : REM Bit 4: strangers permanently indifferent (3 rolls)
                : REM Bit 5: lost ruby statue aroused
```

### 4.5 Deck State

**Large pack (area cards):**

```basic
DIM LP(59)    : REM Large pack — shuffled indices into area card DATA
LI = 0        : REM Large pack draw index (next card to draw)
```

**Small pack (chamber cards):**

```basic
DIM SP(51)    : REM Small pack — shuffled card values
SI = 0        : REM Small pack draw index
```

### 4.6 Fight State

During fights, temporary arrays track the matchups.

```basic
DIM FA(8)     : REM Fight — attacker creature indices (from party or strangers)
DIM FD(8)     : REM Fight — defender creature indices
DIM FB(8)     : REM Fight — background magic supporters and their target match
NF = 0        : REM Number of matches
FS = 0        : REM Surprise flag (1=party has surprise, -1=strangers have surprise)
```

### 4.7 Key Game Variables Summary

| Variable | Purpose | Range |
|----------|---------|-------|
| `PA` | Current area index | 1-60 |
| `PL` | Current level | 1-10+ |
| `NP` | Party creature count | 0-12 |
| `NC` | Curse count | 0-5+ |
| `SK` | Sorcerer killed | 0-1 |
| `NM` | Areas placed | 0-60 |
| `LI` | Large pack draw position | 0-59 |
| `SI` | Small pack draw position | 0-51 |
| `GS` | Game state (0=playing, 1=won, 2=dead) | 0-2 |
| `SC` | Current score | 0-999 |
| `HS` | High score | 0-999 |
| `TN` | Turn number | 1-999 |

### 4.8 Memory Usage Estimate

| Array | Elements | Bytes (8 per element) |
|-------|----------|----------------------|
| `MP(60)` | 61 | 488 |
| `MX(60)` | 61 | 488 |
| `MY(60)` | 61 | 488 |
| `ML(60)` | 61 | 488 |
| `MV(60)` | 61 | 488 |
| `MS(60)` | 61 | 488 |
| `AC(60,4)` | 305 | 2,440 |
| `AF(60)` | 61 | 488 |
| `LP(59)` | 60 | 480 |
| `SP(51)` | 52 | 416 |
| `PC(12)` | 13 | 104 |
| `PS(12)` | 13 | 104 |
| `PK(12)` | 13 | 104 |
| `PT(12,4)` | 65 | 520 |
| `CS(8)` | 9 | 72 |
| `CT(8)` | 9 | 72 |
| `CH(4)` | 5 | 40 |
| `FA(8)` | 9 | 72 |
| `FD(8)` | 9 | 72 |
| `FB(8)` | 9 | 72 |
| **Total arrays** | | **~7,464 bytes** |

Plus ~30 key variables × 12 bytes each = ~360 bytes.

**Total dynamic state: ~7,824 bytes (~7.6 KB)**

This is within the ~8-10 KB we budgeted for state in the memory plan. The remaining ~24 KB is available for program code and DATA statements.

### 4.9 Optimisation Options (if memory is tight)

If we hit memory limits, these reductions can be applied:

1. **Merge MX/MY/ML into a single encoded value** — e.g., `M(i) = level*10000 + y*100 + x`. Saves ~976 bytes.
2. **Reduce AC(60,4) to AC(60,2)** — max 2 items per area instead of 4. Saves ~976 bytes. Most areas will have 0-2 remaining items.
3. **Reduce party max from 12 to 8** — saves ~256 bytes across PC/PS/PK/PT arrays. Party rarely exceeds 8 creatures.
4. **Use CLEAR to set exact variable/work area sizes** — avoid wasting memory on oversized default areas.
5. **Eliminate MV array** — derive visited status from MP values (0 = unplaced, >0 = placed). Saves ~488 bytes.

---

## Utility Subroutines

### Die Roll

```basic
9000 REM ROLL DIE — result in D
9010 D = INT(RAN# * 6) + 1
9020 RETURN
```

### Shuffle Array

```basic
9050 REM SHUFFLE ARRAY A() with N elements
9060 REM Fisher-Yates shuffle
9070 FOR I = N - 1 TO 1 STEP -1
9080   J = INT(RAN# * (I + 1))
9090   T = A(I) : A(I) = A(J) : A(J) = T
9100 NEXT I
9110 RETURN
```

### Decode Card Type from Small Pack

```basic
9200 REM DECODE SMALL CARD — input CV, output CY (type), CI (index)
9210 CY = INT(CV / 100)
9220 CI = CV - CY * 100
9230 RETURN
```
