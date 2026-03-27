# Sorcerer's Cave — Stage 1

A board game adaptation for the Casio VX-4. Explore an underground labyrinth,
recruit creatures, find treasure, and escape alive.

## Setup

Before running, type: `CLEAR 4096,10000` then `RUN`

## Line Number Map

### Main Loop (100-210)

| Line | Purpose |
|------|---------|
| 100-130 | Program header |
| 150 | Load all DATA into arrays (GOSUB 8000) |
| 160 | Run setup: title, party selection, deck init, map init (GOSUB 500) |
| 170-210 | Main game loop: check game state, show status, get action |

### Get Action (250-495)

| Line | Purpose |
|------|---------|
| 250-270 | Decode current area, build exit string |
| 280-290 | Display available actions on line 4 |
| 300 | INKEY$ input loop |
| 310-320 | I = inventory, ? = help |
| 330-400 | Map key press to direction (N=1,E=2,S=3,W=4,U=5,D=6,X=exit) |
| 410-480 | Validate chosen exit exists on current area card |
| 490-495 | Execute move, increment turn counter |

### Setup (500-560)

| Line | Purpose |
|------|---------|
| 510 | Show title screen (GOSUB 600) |
| 520 | Party selection (GOSUB 700) |
| 530 | Initialize and shuffle decks (GOSUB 860) |
| 540 | Initialize map with GATEWAY (GOSUB 950) |
| 550 | Set initial game state: GS=0 (playing), TN=1, NC=0 (curses), SK=0, SC=0 |

### Title / Pre-Splash (600-707)

| Line | Purpose |
|------|---------|
| 600-690 | Pre-splash: shows CLEAR command needed before RUN |
| 695-705 | Title screen with game name |
| 706 | "Loading..." message while data is read |

### Party Selection (700-859)

| Line | Purpose |
|------|---------|
| 710 | Init: RP=6 (remaining points), NP=0 (party size) |
| 720 | Copy starting creature counts to CA() working array |
| 730-740 | CI = current creature index being browsed |
| 750-840 | Display: party so far, current creature stats, available actions |
| 845-849 | Input: left/right arrows browse, EXE adds, 0 = done |
| 850-859 | Add creature: validate points/availability, update party arrays |
| 900-947 | Confirm party screen: show party, EXE = begin, BS = redo |

### Init Decks (860-888)

| Line | Purpose |
|------|---------|
| 862-870 | Build and Fisher-Yates shuffle large pack (60 area cards, gateway excluded) |
| 874-878 | Read pre-built small pack (52 cards) from DATA using RESTORE 8500 |
| 880-888 | Fisher-Yates shuffle small pack |

### Init Map (950-990)

| Line | Purpose |
|------|---------|
| 955-965 | Zero all map arrays |
| 970-985 | Place GATEWAY (card index 21) at coordinates (50,50) on level 1 |
| 985 | Set NM=1, PA=1, PL=1 (1 area placed, party at area 1, level 1) |

### Movement (1000-1495)

| Line | Purpose |
|------|---------|
| 1010-1050 | Calculate DX,DY offsets from direction DR |
| 1070-1130 | Search existing placed areas for target coordinates |
| 1140 | If found, move party there |
| 1150-1160 | Stairs: check MS() stair link array |
| 1170-1180 | Draw new area card from large pack (check exhaustion) |
| 1190-1200 | Decode new card |
| 1210-1270 | Check opposite exit matches (N needs S, E needs W, etc.) |
| 1280-1380 | Place card: set coords, stair links, move party |
| 1390-1398 | Check area type: chamber/viper pit/deep pool (Stage 2 stubs) |
| 1400-1495 | Dead end handler: place face-down card, show message |

### End Game (7000-7080)

| Line | Purpose |
|------|---------|
| 7010-7040 | Show escaped/perished message and score |
| 7060-7080 | Wait for EXE, restart |

### Score Calculation (7100-7230)

| Line | Purpose |
|------|---------|
| 7120-7150 | Sum creature point values; double for dragon-slayers |
| 7160-7190 | Sum treasure point values (RESTORE 8690 to look up points) |
| 7200-7220 | Add sorcerer bonus (+30), subtract curse penalty (-30 each) |

### Status Display (7500-7610)

| Line | Purpose |
|------|---------|
| 7510-7520 | CLS, decode current area |
| 7530-7585 | Line 1: level, area name (or type+number), turn counter |
| 7590-7599 | Line 2: available exits with △ for stairs |
| 7601-7607 | Line 3: party creature names (max 3 shown, +N for overflow) |
| (line 4) | Drawn by GET ACTION routine |

### Inventory (7620-7642)

| Line | Purpose |
|------|---------|
| 7621 | VI = scroll offset |
| 7622-7630 | Show 2 creatures at a time with stats |
| 7632-7642 | Input: EXE = back, arrows = scroll |

### Help (7800-7860)

Shows key reference: N/E/S/W, U/D, I, X

### Exit Cave (7900-7995)

| Line | Purpose |
|------|---------|
| 7910-7920 | Validate: must be level 1 with stair up |
| 7930-7970 | Confirm: "Leave the cave? You cannot return!" |
| 7980 | If yes: set GS=1, calculate score |

## DATA Statements (8000-8740)

### Arrays Allocated (8090-8140)

| Array | Size | Purpose |
|-------|------|---------|
| AK(60) | 61 | Area card encoded values |
| CD(13) | 14 | Creature data (packed: FS*100000+MP*10000+CW*1000+SV*100+PT) |
| CN$(13) | 14 | Creature names |
| CS(7) | 8 | Starting creature availability counts |
| CA(7) | 8 | Working copy of starting counts (decremented during selection) |
| MP(60) | 61 | Map: area card value at each placed position |
| ML(60) | 61 | Map: packed coordinates (level*10000 + y*100 + x, origin 50,50) |
| MS(60) | 61 | Map: stair connection (index of linked area, 0=none) |
| LP(59) | 60 | Large pack: shuffled card indices |
| SP(51) | 52 | Small pack: shuffled card values |
| PC(8) | 9 | Party: creature type index |
| PS(8) | 9 | Party: status (0=original, 1=ally) |
| PK(8) | 9 | Party: dragon-slayer kill count |
| PT(8) | 9 | Party: treasure slot 1 (-1=empty) |
| PU(8) | 9 | Party: treasure slot 2 (-1=empty) |

### Area Cards DATA (8170-8290)

61 encoded area cards. See `reference/sorcerers-cave/area-card-encoding.md` for the encoding table.

### Creature Data (8340-8400)

14 packed values. Decode with GOSUB 9200:
- CF = fighting strength (digit 6)
- CM = magical power (digit 5)
- CW = carry capacity / 25 (digit 4)
- CV = selection value (digit 3-2)
- CP = point value (digits 1-0)

### Creature Names (8490-8497)

14 short names: HERO, W-HERO, OGRE, TROLL, PRIEST, MAN, WOMAN, DWARF, WIZARD, SPECTRE, DRAGON, SORCER, GIANT, UNICRN

### Small Pack (8540-8630)

52 pre-built cards. Encoding: creature=100+index, treasure=200+index, hazard=300+index

### Starting Counts (8660)

How many of each starting creature (indices 0-7) are available for party selection.

### Treasure Points (8690)

15 point values for treasures (indices 0-14), looked up with RESTORE 8690.

## Utility Subroutines (9100-9520)

| Line | Name | Input | Output |
|------|------|-------|--------|
| 9100 | DECODE AREA | AC | AN,AE,AZ,AW,AH,AU,AD,AT |
| 9200 | DECODE CREATURE | CI | CF,CM,CW,CV,CP |
| 9300 | BUILD EXIT STRING | (uses AN,AE,AZ,AW,AU,AD) | EX$ |
| 9400 | WAIT EXE | — | — (blocks until EXE pressed) |
| 9500 | ROLL DIE | — | D (1-6) |

## Key Variables

| Var | Purpose |
|-----|---------|
| GS | Game state: 0=playing, 1=escaped, 2=dead |
| TN | Turn number |
| NC | Curse count |
| SK | Sorcerer killed flag |
| SC | Score |
| PA | Current party area index |
| PL | Current party level |
| NP | Number of creatures in party |
| NM | Number of areas placed on map |
| LI | Large pack draw index |
| SI | Small pack draw index |
| DR | Direction chosen (1=N,2=E,3=S,4=W,5=U,6=D) |
| FA | Found area index (movement result) |
| CI | Current creature index (browsing/decoding) |
| RP | Remaining selection points (party setup) |

## Input Keys

| Key | Context | Action |
|-----|---------|--------|
| N/E/S/W | Main | Move in direction |
| U/D | Main | Use stairs |
| I | Main | Inventory |
| ? | Main | Help |
| X | Main | Exit cave (level 1 only) |
| ←/→ | Selection | Browse previous/next |
| EXE | Universal | Confirm / Continue |
| 0 | Party select | Done selecting |
| BS | Party confirm | Redo selection |
| Y/N | Exit confirm | Yes / No |
