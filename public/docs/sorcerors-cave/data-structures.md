# Data Structures

## Arrays

### Map Arrays (indexed by area number, 0–60)

| Array | Type | Purpose |
|-------|------|---------|
| `AK(60)` | Integer | Area card definitions. Each is a bitmask encoding exits and features. Read from DATA 6280–6400 at init. Index 21 = Gateway |
| `MP(60)` | Integer | Map position card value. `MP(i)` = the area card bitmask for area `i`. Set from `AK()` when area is placed |
| `ML(60)` | Integer | Map location. Packed as `level*10000 + y*100 + x`. Used to find areas by coordinate |
| `MS(60)` | Integer | Map stairs link. `MS(i)` = area number connected by stairs. Bidirectional: `MS(a)=b` and `MS(b)=a` |
| `MR(60)` | Integer | Map room state. Tens digit = creature count, ones digit = treasure flag (0 or 1). See [Room State Encoding](#room-state-encoding-mr) |
| `RT$(60)` | String | Remaining treasure per room. Each character encodes a treasure card ID as `CHR$(CI+65)`. Empty = no skipped treasure |
| `RC$(60)` | String | Remaining creatures per room. Each character encodes a creature card ID as `CHR$(CI+65)`. Empty = no pending creatures (joined, killed, or never encountered) |

### Deck Arrays

| Array | Type | Size | Purpose |
|-------|------|------|---------|
| `LP(59)` | Integer | 60 | Area card draw order (shuffled indices into `AK()`). `LI` = next index to draw |
| `SP(51)` | Integer | 52 | Chamber card deck (shuffled). Each value = `CY*100+CI`. `SI` = next index to draw |
| `DC(5)` | Integer | 6 | Current chamber's drawn cards. Up to 6 cards (base 4 + Great Hall bonus 2). Each = `CY*100+CI` |

### Party Arrays (indexed by party slot, 0–8)

| Array | Type | Purpose |
|-------|------|---------|
| `PC(8)` | Integer | Party creature index. `PC(i)` = creature type (0-13, index into `CD()`/`CN$()`) |
| `PS(8)` | Integer | Party status. 0=original member, 1=ally, 2=turned to stone, 3=dead/removed |
| `PK(8)` | Integer | Dragon-slayer flag. >0 if this member has slain a dragon (doubles their point value) |
| `IV$(8)` | String | Inventory. Each character = `CHR$(CI+65)` where CI is the treasure card index. E.g. 'A'=Silver, 'B'=Gold, 'D'=Magic Sword |

### Creature Data Arrays

| Array | Type | Size | Purpose |
|-------|------|------|---------|
| `CD(13)` | Integer | 14 | Creature stat blocks. Each is a 6-digit packed integer. Read from DATA 6420–6470 |
| `CN$(13)` | String | 14 | Creature names. Read from DATA 6500–6530 |
| `CS(7)` | Integer | 8 | Starting creature availability count (how many of each type exist in the starting pack) |
| `CA(7)` | Integer | 8 | Current creature availability (decremented as party members are chosen) |

---

## Encoding Schemes

### Area Card Bitmask (`AK()`, `MP()`, `AC`)

Each area card is a 10-bit integer. Decoded by subroutine at line 6760:

| Bit(s) | Mask | Variable | Meaning |
|--------|------|----------|---------|
| 0 | 1 | `AN` | North exit |
| 1 | 2 | `AE` | East exit |
| 2 | 4 | `AZ` | South exit (Z to avoid conflict with string functions) |
| 3 | 8 | `AW` | West exit |
| 4 | 16 | `AH` | Inhabited (1=chamber, 0=tunnel) |
| 5 | 32 | `AU` | Stairs up |
| 6 | 64 | `AD` | Stairs down |
| 7–9 | 896 (128*7) | `AT` | Area type: 0=normal, 1=Gateway, 2=Deep Pool, 3=Viper Pit, 4=Tomb, 5=Great Hall |

**Example**: Gateway card `AK(21)` = 191 = binary `010111111`
- AN=1, AE=1, AZ=1, AW=1, AH=1, AU=1, AD=0, AT=1 (Gateway)

### Map Location Encoding (`ML()`)

Packed as a 5-digit integer: `level*10000 + y*100 + x`

- **Level**: 1-based (1 = top level, increases going deeper)
- **Y coordinate**: row position (decreases going North, increases going South)
- **X coordinate**: column position (increases going East)

Initial position: `ML(1) = 15050` → level 1, y=50, x=50 (centre of coordinate space)

### Chamber Card Encoding (`SP()`, `DC()`)

Each card is encoded as `CY*100 + CI`:

| CY (category) | CI range | Meaning |
|----------------|----------|---------|
| 1 | 0–7 | Creature (CI = creature index, matches `CD()`/`CN$()` for starting creatures) |
| 1 | 8–13 | Cave creature (Wizard=8, Spectre=9, Dragon=10, Sorcerer=11, Giant=12, Unicorn=13) |
| 2 | 0–14 | Treasure (see [Treasure Index](#treasure-index)) |
| 3 | 0–4 | Hazard (see [Hazard Index](#hazard-index)) |

### Room State Encoding (`MR()`)

`MR(PA) = creature_count * 10 + treasure_flag`

- **Tens digit** (`INT(MR(PA)/10)`): number of creatures/enemies remaining in room
- **Ones digit** (`MR(PA) - INT(MR(PA)/10)*10`): 1 if treasure present, 0 if not

Used by the area map renderer to display room contents (e.g. "2C $" = 2 creatures + treasure).

Updated by:
- Line 1910: Initial set on chamber entry
- Line 2840: Treasure bit cleared after pickup (only if all taken)
- Line 3370: Creature count cleared when strangers join (friendly)
- Line 3890: Creature count updated after combat
- Line 3950: Creature count updated after retreat

### Creature Stats Encoding (`CD()`)

Each creature's stats are packed into a 6-digit integer: `CF*100000 + CM*10000 + CW*1000 + CV*100 + CP`

Decoded by subroutine at line 6850:

| Field | Variable | Meaning |
|-------|----------|---------|
| Hundred-thousands | `CF` | Fighting strength (0–9) |
| Ten-thousands | `CM` | Magical power (0–9) |
| Thousands | `CW` | Carry weight in units of 25kg (0–6, multiply by 25 for kg) |
| Hundreds | `CV` | Selection cost (for party building, 1–6) |
| Ones+Tens | `CP` | Point value (0–99) |

**Examples from DATA 6420–6470:**

| Index | CD value | Name | Fight | Magic | Carry(kg) | Cost | Points |
|-------|----------|------|-------|-------|-----------|------|--------|
| 0 | 503610 | HERO | 5 | 0 | 75 | 6 | 10 |
| 1 | 402510 | W-HERO | 4 | 0 | 50 | 5 | 10 |
| 2 | 504505 | OGRE | 5 | 0 | 100 | 5 | 5 |
| 3 | 403404 | TROLL | 4 | 0 | 75 | 4 | 4 |
| 4 | 221408 | PRIEST | 2 | 2 | 25 | 4 | 8 |
| 5 | 302305 | MAN | 3 | 0 | 50 | 3 | 5 |
| 6 | 201205 | WOMAN | 2 | 0 | 25 | 2 | 5 |
| 7 | 101102 | DWARF | 1 | 0 | 25 | 1 | 2 |
| 8 | 250015 | WIZARD | 2 | 5 | 0 | 0 | 15 |
| 9 | 50000 | SPECTRE | 0 | 5 | 0 | 0 | 0 |
| 10 | 600000 | DRAGON | 6 | 0 | 0 | 0 | 0 |
| 11 | 490000 | SORCERER | 4 | 9 | 0 | 0 | 0 |
| 12 | 706007 | GIANT | 7 | 0 | 150 | 0 | 7 |
| 13 | 40004 | UNICORN | 0 | 4 | 0 | 0 | 4 |

### Inventory Encoding (`IV$()`)

Each character in the string represents one item carried, encoded as `CHR$(CI+65)`:

| Character | CI | Item | Weight |
|-----------|----|------|--------|
| A | 0 | Silver | 25kg |
| B | 1 | Gold | 25kg |
| C | 2 | Gems | 25kg |
| D | 3 | Magic Sword | 0 |
| E | 4 | Magic Carpet | 0 |
| F | 5 | Lotus Dust | 0 |
| G | 6 | Healing Balm | 0 |
| H | 7 | Talisman | 0 |
| I | 8 | Strength Potion | 0 |
| J | 9 | Magic Staff | 0 |
| K | 10 | Ring | 0 |
| L | 11 | Lost Ruby | 0 |
| M | 12 | Charmed Flute | 0 |
| N | 13 | Eye of God | 0 |
| O | 14 | Treasure Chest | 100kg |

Weight rule: items with CI < 3 weigh 25kg each. Item CI=14 (Chest) weighs 100kg. All others are weightless.

The same CHR$(CI+65) encoding is used for `RT$()` (remaining treasure per room) and `RC$()` (remaining creatures per room, but using creature CI values).

### Treasure Point Values (DATA 6670)

Indexed by treasure CI (0–14):

```
CI:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14
Pts: 5  10  20  15   5   5   5  10   5  15  30  20  10   0   0
```

### Reaction Thresholds (DATA 6750)

8 pairs of (hostile_max, indifferent_max) for cave creatures, read via RESTORE 6750:

```
DATA 1,5,  5,6,  6,6,  4,5,  3,4,  0,0,  3,5,  3,3
```

Indexed by creature CI minus 8 (for cave creatures 8–13, plus 2 extra entries):

| Creature | CI | HM | IM | Hostile | Indifferent | Friendly |
|----------|----|----|----|---------|-------------|----------|
| Wizard | 8 | 1 | 5 | 1 | 2–5 | 6 |
| Spectre | 9 | 5 | 6 | 1–5 | 6 | never |
| Dragon | 10 | 6 | 6 | 1–6 | never | never |
| Sorcerer | 11 | 4 | 5 | 1–4 | 5 | 6 |
| Giant | 12 | 3 | 4 | 1–3 | 4 | 5–6 |
| Unicorn | 13 | 0 | 0 | never | always* | never |

*Unicorn is always indifferent (HM=0, IM=0 — no roll ≤ 0, so falls through to friendly, but special rules apply).

Die roll R is tested: if R ≤ HM → hostile. If R ≤ IM → indifferent. Otherwise → friendly.

### Chamber Card Deck Composition (DATA 6540–6630)

52 cards total:

**Creatures (CY=1):** 22 cards
- Ogre(2) ×3, Troll(3) ×3, Priest(4) ×1, Wizard(8) ×3, Spectre(9) ×3
- Dragon(10) ×3, Sorcerer(11) ×1, Giant(12) ×2, Unicorn(13) ×1
- W-Hero(1) ×1, Man(5) ×1

**Treasure (CY=2):** 15 cards
- Silver(0) ×6, Gold(1) ×6, Gems(2) ×3

**Artifacts (CY=2, CI 3–14):** 12 cards
- One each of: Magic Sword(3), Carpet(4), Lotus Dust(5), Healing Balm(6), Talisman(7), Str Potion(8), Magic Staff(9), Ring(10), Lost Ruby(11), Charmed Flute(12), Eye of God(13), Chest(14)

**Hazards (CY=3):** 5 cards
- Mutiny(0) ×1, Trap(1) ×2, Earthquake(2) ×1, Medusa(3) ×1, Ghouls(4) ×1

Deck is not replenished — 52 cards is the maximum for the entire game.

---

## Key Scalar Variables

### Game State

| Variable | Purpose |
|----------|---------|
| `GS` | Game state: 0=playing, 1=escaped, 2=party dead, 3=trapped |
| `TN` | Turn number |
| `NC` | Curse count (cumulative, -30 points each) |
| `SK` | Sorcerer killed flag (+30 points) |
| `SC` | Final score |
| `NP` | Number of party members (current) |
| `RP` | Remaining party selection points (starts at 6) |

### Map/Navigation

| Variable | Purpose |
|----------|---------|
| `PA` | Current area number (index into MP/ML/MS/MR) |
| `PP` | Previous area number (for withdrawal) |
| `PL` | Current level (1-based) |
| `NM` | Next map slot (total areas placed, also serves as area counter) |
| `FA` | Found area index (during movement search) |
| `DR` | Direction: 1=N, 2=E, 3=S, 4=W, 5=Up, 6=Down |
| `DX, DY` | Direction deltas for coordinate calculation |
| `LI` | Area deck draw index (into LP()) |
| `SI` | Chamber deck draw index (into SP()) |

### Area Decoding (set by GOSUB 6760)

| Variable | Purpose |
|----------|---------|
| `AC` | Area card value being decoded |
| `AN, AE, AZ, AW` | Exit flags: North, East, South, West |
| `AH` | Inhabited flag (1=chamber, 0=tunnel) |
| `AU, AD` | Stairs up, stairs down |
| `AT` | Area type (0–5) |

### Creature Decoding (set by GOSUB 6850)

| Variable | Purpose |
|----------|---------|
| `CI` | Creature index being decoded (input) — **caution: heavily reused for multiple purposes** |
| `CF` | Fighting strength |
| `CM` | Magical power |
| `CW` | Carry weight (in 25kg units) |
| `CV` | Selection cost |
| `CP` | Point value |

### Chamber/Encounter

| Variable | Purpose |
|----------|---------|
| `ND` | Number of drawn cards in current chamber |
| `NS` | Number of creatures (strangers) drawn |
| `NQ` | Number of treasure cards drawn |
| `NH` | Number of hazard cards drawn |
| `SL` | Stranger leader creature index |
| `SS` | Stranger test count (resets each encounter) |
| `SU` | Surprise flag: 1=party has surprise, -1=enemy has surprise |

### Combat

| Variable | Purpose |
|----------|---------|
| `NE` | Number of enemies remaining |
| `RD` | Current fight round |
| `MI` | Number of matches this round (min of NP, NE) |
| `EC` | Current strongest enemy creature index |
| `EF` | Current strongest enemy's combined strength |
| `YS` | Party member's total strength for current match |
| `ES` | Enemy's total strength for current match |
| `YR` | Party member's roll result (die + strength + modifiers) |
| `ER` | Enemy's roll result |

### Misc Temporaries

| Variable | Purpose |
|----------|---------|
| `W` | General-purpose working variable |
| `K$` | Keyboard input |
| `D` | Die roll result (set by GOSUB 7050) |
| `GI` | Give-to index (party member selected for item transfer) |
| `WI` | Weight-check index |
| `WC` | Current carry weight in kg |
| `TI` | Saved treasure card index (during pickup loop, before CI is overwritten) |
| `QH` | Saved PA before hazard processing (trap displacement guard) |
| `RI` | Loop variable for cleanup routine (2850) and reconstruction loops |
| `EX$` | Exit string (e.g. "NESWD") |
| `TN$` | Treasure name (read from DATA) |
| `HF` | Has-item flag (e.g. has Magic Sword) |
| `HI, HJ, HK, HK$` | Item search loop variables |
