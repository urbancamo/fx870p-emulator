# Sorcerer's Cave

An adaptation of Terence Donnelly's 1978 board game for the Casio VX-4.
Explore an underground labyrinth, recruit creatures, fight monsters,
collect treasure, and escape alive.

**Solitaire mode** — one exploring party, all player interaction rules ignored.

## Setup

Before running, type: `CLEAR 11000,17000` then `RUN`

## How to Play

1. **Select your party** — choose creatures totalling up to 6 selection points
2. **Explore** — move through tunnels and chambers using N/E/S/W/U/D keys
3. **Survive** — handle hazards, fight or befriend strangers, collect treasure
4. **Escape** — reach a level 1 stairway going up to leave the cave with your loot

## Controls

| Key | Context | Action |
|-----|---------|--------|
| N/E/S/W | Main | Move in compass direction |
| U/D | Main | Use stairs up/down |
| I | Main | Inventory — view party and carried items |
| A | Main | Artifact menu — use carried artifacts |
| X | Main | Exit cave (level 1 stair up only) |
| ? | Main | Help screen |
| ←/→ | Selection | Browse items/creatures |
| EXE | Universal | Confirm / Continue |
| 0 | Party select | Done selecting |
| BS | Party confirm | Redo selection |
| W | Encounter | Withdraw from strangers |
| A | Encounter | Attack strangers |
| T | Encounter | Test stranger reaction |
| F | Combat | Fight another round |
| R | Combat/Inv | Retreat from fight / Redistribute items |

## Line Number Map

### Main Loop (150-210)

| Lines | Purpose |
|-------|---------|
| 150 | Load all DATA into arrays (GOSUB 8090) |
| 160 | Setup: title, party, decks, map (GOSUB 510) |
| 180-210 | Main loop: check game state, show status, get action |

### Get Action (260-495)

| Lines | Purpose |
|-------|---------|
| 260-270 | Decode current area, build exit string |
| 280-290 | Display available actions on line 4 |
| 300-410 | INKEY$ input: map keys to directions, I/A/?/X handlers |
| 430-480 | Validate chosen exit exists |
| 490-495 | Execute move, increment turn |

### Setup (510-560)

| Lines | Purpose |
|-------|---------|
| 510 | Title screen (GOSUB 610) |
| 520 | Party selection (GOSUB 710) |
| 530 | Initialize decks (GOSUB 862) |
| 540 | Initialize map (GOSUB 955) |
| 550 | Set game state: GS=0, TN=1, NC=0, SK=0, SC=0 |

### Pre-Splash & Title (610-707)

| Lines | Purpose |
|-------|---------|
| 610-680 | Pre-splash: shows CLEAR command |
| 696-704 | Title screen |
| 706-707 | "Loading..." message |

### Party Selection (710-947)

| Lines | Purpose |
|-------|---------|
| 710-730 | Init: RP=6 budget, copy starting counts |
| 750-859 | Browse creatures with arrows, EXE to add, 0 to finish |
| 851-859 | Add creature: validate cost/availability, update party |
| 905-947 | Confirm party: EXE begins, BS redoes |

### Init Decks (862-888)

| Lines | Purpose |
|-------|---------|
| 862-870 | Shuffle large pack (60 area cards) |
| 874-888 | Read and shuffle small pack (52 cards) |

### Init Map (955-990)

| Lines | Purpose |
|-------|---------|
| 955-965 | Zero all map arrays |
| 975-990 | Place GATEWAY at level 1, coords (50,50) |

### Movement (1010-1490)

| Lines | Purpose |
|-------|---------|
| 1010-1050 | Calculate DX,DY from direction |
| 1070-1142 | Search for existing area, check dead-end blocking |
| 1160-1166 | Stairs: follow link if direction matches level change |
| 1180-1200 | Draw new area card from large pack |
| 1210-1270 | Check matching exit (opposite direction) |
| 1290-1398 | Place card, move party, trigger chamber/viper/pool |
| 1410-1490 | Dead end handler |

### Chamber Entry (2010-2260)

| Lines | Purpose |
|-------|---------|
| 2010-2050 | Calculate cards to draw (level + special bonuses) |
| 2060-2200 | Draw and categorize cards (creatures/treasure/hazards) |
| 2220-2260 | Resolve hazards, then strangers or treasure |

### Hazards (2510-2848)

| Lines | Purpose |
|-------|---------|
| 2510-2710 | Hazard dispatch loop |
| 2720-2734 | MUTINY: allies leave party |
| 2740-2768 | TRAP: draw card, move party one level deeper |
| 2770-2774 | EARTHQUAKE: area behind collapses |
| 2780-2795 | MEDUSA: die roll per creature, 1-2 = stone |
| 2830-2848 | GHOULS: each creature fights strength 2 |

### Treasure Pickup (2860-2899)

Browse party members with arrows to assign each treasure item.

### Dead Creature Removal (2900-2930)

Removes creatures with PS=3 (dead/stone), shifts arrays.

### Stranger Encounters (3010-3750)

| Lines | Purpose |
|-------|---------|
| 3010-3100 | Show strangers, identify leader, offer W/A/T options |
| 3200-3230 | Withdraw: return to previous area |
| 3300 | Attack: trigger combat with party surprise |
| 3400-3490 | Test reaction: die roll + hero bonus, lookup reaction table |
| 3510-3594 | Friendly: strangers join party, treasure available |
| 3600-3620 | Hostile: strangers attack with their surprise |
| 3700-3750 | Indifferent: track count, permanent after 3 (solitaire) |

### Combat (4010-4540)

| Lines | Purpose |
|-------|---------|
| 4010-4026 | Setup: count enemies, show round and surprise |
| 4030-4068 | Match resolution: auto-pair, die rolls, magic sword bonus |
| 4080-4094 | Post-round: fight on or retreat |
| 4200-4210 | Victory: treasure available |
| 4300-4304 | Retreat: treasure left behind |
| 4500-4540 | Find strongest enemy for matching |

### Viper Pit (5010-5080)

| Lines | Purpose |
|-------|---------|
| 5010-5034 | Show exits, choose target |
| 5036-5042 | Calculate segments (adjacent=1, opposite=2) |
| 5044-5052 | Charmed flute check: safe crossing |
| 5054-5080 | Die roll per creature per segment, 1 = falls |

### Deep Pool (5210-5250)

| Lines | Purpose |
|-------|---------|
| 5210-5234 | Show exits, choose target |
| 5236-5250 | Non-giants drop heavy treasure, all cross |

### Artifact Menu (6010-6242)

| Lines | Purpose |
|-------|---------|
| 6010-6034 | List carried artifacts, offer H/C/0 options |
| 6110-6124 | Healing Balm check |
| 6210-6242 | Treasure Chest: die roll for contents, consumed |

### End Game (7010-7060)

Shows escaped/perished message and final score, then END.

### Score Calculation (7110-7230)

| Lines | Purpose |
|-------|---------|
| 7120-7150 | Sum creature points, double for dragon-slayers |
| 7160-7190 | Sum treasure points via RESTORE 8690 lookup |
| 7200-7220 | Sorcerer bonus (+30), curse penalty (-30 each) |

### Status Display (7510-7610)

| Lines | Purpose |
|-------|---------|
| 7510-7585 | Line 1: level, area name/type, turn counter |
| 7590-7599 | Line 2: exits with ↑/↓ for stairs |
| 7601-7608 | Line 3: party names (as many as fit in 32 cols) |

### Inventory (7621-7699)

| Lines | Purpose |
|-------|---------|
| 7621-7628 | Show creature stats and carried items |
| 7630-7644 | Navigate with arrows, EXE back, R redistribute |
| 7650-7699 | Redistribute: pick item, browse party, assign/drop/undo |

### Help (7810-7860)

Key reference display.

### Exit Cave (7910-7995)

Validate level 1 + stair up, confirm, calculate score.

## DATA Layout (8090-8750)

### Arrays (8090-8140)

| Array | Elements | Purpose |
|-------|----------|---------|
| AK(60) | 61 | Area card encoded values |
| CD(13) | 14 | Creature data (packed) |
| CN$(13) | 14 | Creature names |
| CS(7) | 8 | Starting creature counts |
| CA(7) | 8 | Working counts (selection) |
| MP(60) | 61 | Map: card value at each placed position |
| ML(60) | 61 | Map: packed coords (Level×10000 + Y×100 + X) |
| MS(60) | 61 | Map: stair links (index of connected area) |
| LP(59) | 60 | Large pack (shuffled card indices) |
| SP(51) | 52 | Small pack (shuffled card values) |
| PC(8) | 9 | Party: creature type index |
| PS(8) | 9 | Party: status (0=original, 1=ally, 2=stone, 3=dead) |
| PK(8) | 9 | Party: dragon-slayer kill count |
| PT(8) | 9 | Party: treasure slot 1 (-1=empty) |
| PU(8) | 9 | Party: treasure slot 2 (-1=empty) |
| DC(5) | 6 | Drawn cards (current chamber) |

### Creature Data Encoding

`CD = FS×100000 + MP×10000 + CW×1000 + SV×100 + PT`

Decode with GOSUB 9220 → CF, CM, CW, CV, CP.

### Area Card Encoding

See `reference/sorcerers-cave/area-card-encoding.md`

Bits: N=1, E=2, S=4, W=8, Chamber=16, StairUp=32, StairDown=64, Special=type×128

### Small Pack Card Encoding

Card value = type × 100 + index. Type: 1=creature, 2=treasure, 3=hazard.

## Key Variables

| Var | Purpose |
|-----|---------|
| GS | Game state: 0=playing, 1=escaped, 2=dead |
| TN | Turn number |
| NC | Curse count |
| SK | Sorcerer killed flag |
| SC | Final score |
| PA | Current party area index |
| PL | Current party level |
| NP | Party creature count |
| NM | Areas placed on map |
| LI | Large pack draw position |
| SI | Small pack draw position |
| SN | Small pack total count |
| DR | Direction (1=N, 2=E, 3=S, 4=W, 5=U, 6=D) |
| SU | Surprise (+1=party, -1=strangers) |
| RD | Combat round number |
| NE | Enemy count in combat |

## Scoring

When you exit the cave:
- Each creature in party: their point value
- Dragon-slayers: doubled
- Each carried treasure: its point value
- Sorcerer killed: +30
- Each curse: -30
- Minimum: 0

## References

- Full rules: `reference/sorcerers-cave/sorcerers-cave-rules.md`
- Rules analysis: `docs/plans/sorcerers-cave/requirement-1-rules-analysis.md`
- Architecture: `docs/plans/sorcerers-cave/requirement-2-high-level-architecture.md`
- Data structures: `docs/plans/sorcerers-cave/requirement-3-4-data-structures.md`
- UI design: `docs/plans/sorcerers-cave/requirement-5-6-phases-and-ui.md`
- Area card encoding: `reference/sorcerers-cave/area-card-encoding.md`
