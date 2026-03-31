# Program Structure

## Main Loop (lines 40–100)

```
40  GOSUB 410        ← Title screen
50  GOSUB 6190       ← Initialise data (DIM, READ, custom chars)
60  GOSUB 350        ← New game setup (party selection, shuffle decks, init map)
70  IF GS<>0 THEN 5030   ← Game-over check
80  GOSUB 5220       ← Display HUD (level, area type, exits, party, area map)
90  GOSUB 110        ← Player input + turn execution
100 GOTO 70          ← Loop
```

## Line Number Map

### Initialisation & Setup

| Lines     | Subroutine         | Purpose                                                                                |
|-----------|--------------------|----------------------------------------------------------------------------------------|
| 350–400   | New game           | Calls party selection, deck shuffle, map init. Sets `GS=0, TN=1, NC=0, SK=0, SC=0`     |
| 410–510   | Title screen       | Displays "SORCERER'S CAVE" splash with decorative border                               |
| 520–790   | Party selection    | Player chooses creatures (budget of 6 RP). Shows stats, enforces cost/availability     |
| 800–910   | Deck shuffle       | Shuffles area card deck (`LP()`) and chamber card deck (`SP()`) using Fisher-Yates     |
| 920–1000  | Party confirmation | Shows chosen party, allows redo or begin                                               |
| 1010–1070 | Map initialisation | Zeroes map arrays. Places Gateway card (AK(21)) at position 1, level 1, coords (50,50) |

### Player Input & HUD

| Lines     | Subroutine          | Purpose                                                                                                                |
|-----------|---------------------|------------------------------------------------------------------------------------------------------------------------|
| 110–340   | Turn handler        | Reads current area, builds exit string, accepts directional/menu input. Calls movement (1080), increments turn counter |
| 5220–5510 | HUD display         | Shows level, area type/number, exits, party member names, and calls area map renderer (7110)                           |
| 5520–5690 | Inventory viewer    | Cycles through party members showing carried items, weight. Allows redistribution via GOSUB 5700                       |
| 5700–5950 | Item redistribution | Move an item from one party member to another. Enforces weight limits                                                  |
| 5970–6080 | Help screen         | Displays key legend and map symbol legend                                                                              |

### Movement & Exploration

| Lines     | Subroutine                    | Purpose                                                                                                                                                     |
|-----------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1080–1600 | Movement dispatcher           | Converts direction to DX/DY, checks visited areas, draws new cards, handles dead ends, special areas                                                        |
| 1080–1300 | Horizontal movement (visited) | Calculates target coords, searches `ML()` for match. If found, checks exit compatibility. Sets `PA=FA`                                                      |
| 1302–1305 | Re-entry handler              | On re-entering visited area: offers creature re-encounter (`RC$`) then remaining treasure (`RT$`)                                                           |
| 1310–1350 | Vertical movement (visited)   | Handles stairs up/down via `MS()` links. Shares re-entry handler at 1302                                                                                    |
| 1360–1600 | New area exploration          | Draws area card from `LP()`, checks exit compatibility, registers new area in map arrays. Dispatches to special area handlers or inhabited area handler     |
| 1610–1760 | Dead end handler              | Records dead-end area, removes the exit that led to it from current area's card bits                                                                        |
| 1710–1760 | Exit removal                  | Removes a directional bit from `MP(PA)` to seal off a dead-end passage                                                                                      |
| 1770–2040 | Enter inhabited area          | Draws chamber cards from `SP()`. Counts creatures/treasures/hazards. Dispatches to hazard handler, stranger encounter, or treasure pickup in priority order |

### Hazards (lines 2050–2610)

| Lines     | Subroutine        | Purpose                                                                                                                    |
|-----------|-------------------|----------------------------------------------------------------------------------------------------------------------------|
| 2050–2140 | Hazard dispatcher | Iterates `DC()` for hazard cards (CY=3), dispatches by CI value                                                            |
| 2150–2220 | Mutiny (CI=0)     | Allies (PS=1) leave party (PS=3). Calls cleanup (2850)                                                                     |
| 2230–2370 | Trap (CI=1)       | Party drops one level. Draws new area card, enters if inhabited. Uses `QH` guard to prevent duplicate processing in caller |
| 2380–2400 | Earthquake (CI=2) | Passage behind collapses (cosmetic message only)                                                                           |
| 2410–2510 | Medusa (CI=3)     | Each party member rolls die; 1-2 = turned to stone (PS=2). If all stone, NP=0                                              |
| 2520–2610 | Ghouls (CI=4)     | Each party member fights ghouls (strength 2). Losers slain (PS=3). Calls cleanup (2850)                                    |

### Treasure Pickup (lines 2610–2845)

| Lines     | Subroutine              | Purpose                                                                                                                                                    |
|-----------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 2610–2612 | Re-entry reconstruction | Rebuilds `DC()/ND` from `RT$(PA)` for re-entry treasure pickup                                                                                             |
| 2615      | RT$ clear               | Clears `RT$(PA)` before pickup loop (entry point for first-time callers)                                                                                   |
| 2620–2830 | Pickup loop             | For each treasure card (CY=2): shows item name, lets player select recipient with arrow keys, checks weight. Skip stores item in `RT$(PA)` for persistence |
| 2840–2845 | Post-pickup             | Clears treasure bit in `MR(PA)` only if all treasures taken (`RT$` empty)                                                                                  |

### Party Cleanup (lines 2850–2920)

| Lines     | Subroutine          | Purpose                                                                                                                                     |
|-----------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| 2850–2920 | Remove dead members | Iterates backwards through party. Members with PS=3 are shifted out, NP decremented. Uses `RI` as loop var to avoid clobbering caller's `I` |

### Stranger Encounter (lines 2925–3480)

| Lines     | Subroutine              | Purpose                                                                                                             |
|-----------|-------------------------|---------------------------------------------------------------------------------------------------------------------|
| 2925–2928 | Re-entry reconstruction | Rebuilds `DC()/ND/NS/NQ` from `RC$(PA)` and `RT$(PA)`. Clears `RC$`, calls 2930                                     |
| 2930–2934 | Encounter entry         | Prints "STRANGERS!", stores creature IDs in `RC$(PA)` for persistence                                               |
| 2940–3080 | Encounter menu          | Shows creatures and leader. Offers [W]ithdraw, [A]ttack, [T]est                                                     |
| 3090–3160 | Withdraw                | Party returns to previous area (`PA=PP`). `RC$(PA)` stays set for re-entry                                          |
| 3170      | Attack                  | Sets surprise flag SU=1, calls combat (3490)                                                                        |
| 3180–3290 | Test strangers          | Rolls die, adds hero/W-hero bonus. Reads reaction thresholds from DATA 6750. Routes to hostile/indifferent/friendly |
| 3300–3390 | Friendly result         | Clears `RC$`. Strangers join party as allies (PS=1). Clears creature count in MR. Offers treasure pickup            |
| 3400–3420 | Hostile result          | Clears `RC$`. Enemy has surprise (SU=-1), calls combat (3490)                                                       |
| 3430–3480 | Indifferent result      | Increments SS counter. After 3 tests: "Permanently indifferent". `RC$(PA)` stays set for re-entry                   |

### Combat (lines 3490–3980)

| Lines     | Subroutine            | Purpose                                                                                                                                              |
|-----------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| 3490–3530 | Combat setup          | Counts enemies from DC() (CY=1 entries). Sets round counter RD=1                                                                                     |
| 3540–3570 | Round display         | Shows round number and surprise status                                                                                                               |
| 3580–3770 | Combat round          | Pairs min(NP,NE) matches. Each match: party member strength (CF+CM + sword bonus) vs strongest enemy. Die roll + strength for each side. Loser slain |
| 3625–3630 | Sword bonus           | Checks if party member carries Magic Sword (item 'D'). Hero +2, Man/Woman +1                                                                         |
| 3780      | Post-round cleanup    | Calls 2850 to remove slain party members                                                                                                             |
| 3790      | Party wipe check      | If NP<=0, game over (GS=2)                                                                                                                           |
| 3800–3880 | Continue/retreat menu | If enemies remain, offer [F]ight on or [R]etreat                                                                                                     |
| 3890–3940 | Combat end            | Updates MR(PA) with remaining enemy count. Victory: offers treasure. No fighters: cosmetic message                                                   |
| 3950–3980 | Retreat               | Updates MR(PA). Treasure left behind                                                                                                                 |
| 3990–4060 | Find strongest enemy  | Iterates DC() for CY=1, returns creature with highest CF+CM as EC                                                                                    |

### Special Areas (lines 4080–4640)

| Lines     | Subroutine       | Purpose                                                                                                                                                |
|-----------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| 4080–4430 | Viper Pit (AT=3) | Shows exits on ledge. Player chooses exit or back. Crossing segments: each segment, each party member rolls die (1=fall, PS=3). Charmed Flute bypasses |
| 4265–4266 | Flute check      | Scans party inventories for item 'M' (Charmed Flute)                                                                                                   |
| 4440–4640 | Deep Pool (AT=2) | Player chooses exit. Weak carriers (CW<4) drop heavy treasure (CI<3 = items A,B,C). Party crosses safely                                               |

### Artifacts Menu (lines 4650–5020)

| Lines     | Subroutine          | Purpose                                                                                                                                 |
|-----------|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 4650–4770 | Artifacts display   | Lists all non-heavy artifacts (CI>=3) carried by party. Offers [H]eal, [C]hest, [0]Back                                                 |
| 4780–4850 | Heal                | Searches for Healing Balm (item 'G'). Currently incomplete — prints "No dead to heal"                                                   |
| 4860–5020 | Open Treasure Chest | Searches for Chest (item 'O'). Rolls die: 1=Curse, 2=Spectre, 3=Sand, 4=Silver(20pts), 5=Gold(40pts), 6=Gems(80pts). Consumes the chest |

### Exit & Scoring (lines 5030–5210)

| Lines     | Subroutine        | Purpose                                                                                                                                                  |
|-----------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| 5030–5070 | Game over screen  | Displays outcome message based on GS (1=escaped, 2=perished, 3=trapped). Shows score                                                                     |
| 5080–5210 | Score calculation | Sums CP for each party member (double if dragon-slayer PK>0). Sums treasure point values from DATA 6670. +30 if Sorcerer killed (SK). -30 per curse (NC) |
| 6090–6180 | Cave exit         | Offered when going Up from level 1. Confirms exit ("You cannot return!"). Sets GS=1, calculates score                                                    |

### Data & Initialisation (lines 6190–6740)

| Lines     | Subroutine            | Purpose                                                                             |
|-----------|-----------------------|-------------------------------------------------------------------------------------|
| 6190–6260 | DIM statements        | Allocates all arrays (see [data-structures.md](data-structures.md))                 |
| 6200–6210 | Custom characters     | Defines up-stair (CHR$ 253) and down-stair (CHR$ 252) glyphs                        |
| 6270–6400 | Area card data        | 61 entries in `AK()`, each a bitmask encoding exits/features                        |
| 6410–6470 | Creature stats data   | 14 entries in `CD()`, each a 6-digit packed integer                                 |
| 6490–6530 | Creature names        | 14 entries in `CN$()`                                                               |
| 6540–6630 | Chamber card deck     | 52 entries in `SP()`, each encoded as `CY*100+CI`                                   |
| 6640–6660 | Creature availability | `CS()` = number of each creature in starting pack                                   |
| 6670      | Treasure point values | 15 values indexed by treasure CI                                                    |
| 6680–6700 | Treasure names        | 15 string literals read via RESTORE                                                 |
| 6710–6740 | Inventory clear       | Zeroes all `IV$()` strings                                                          |
| 6750      | Reaction thresholds   | 8 pairs of (hostile_max, indifferent_max) for cave creatures 8-13 and extra entries |

### Utility Subroutines (lines 6760–7060)

| Lines     | Subroutine                   | Purpose                                                                                  |
|-----------|------------------------------|------------------------------------------------------------------------------------------|
| 6760–6840 | Decode area card (`AC`)      | Extracts exit bits (AN/AE/AZ/AW), feature flags (AH/AU/AD), area type (AT) from bitmask  |
| 6850–6910 | Decode creature stats (`CI`) | Extracts CF/CM/CW/CV/CP from packed integer `CD(CI)`                                     |
| 6912–6915 | Calculate carry weight       | Sums weight of items in `IV$(WI)`: heavy treasure (A,B,C) = 25kg each, Chest (O) = 100kg |
| 6920–6990 | Build exit string            | Builds `EX$` from decoded area flags (e.g. "NESW")                                       |
| 7000–7040 | Wait for EXE                 | Displays "[EXE]" prompt, waits for CHR$(13), changes to "[...]"                          |
| 7010      | Wait for EXE (no prompt)     | Entry point that skips displaying "[EXE]" — reuses the INKEY$ loop at 7010               |
| 7050–7060 | Roll die                     | Sets `D` = random 1-6                                                                    |
| 7070–7100 | Decode creature stats (alt)  | Like 6850 but uses `CJ2` as input, extracts only CF and CM                               |

### Area Map Renderer (lines 7110–7460)

| Lines     | Subroutine         | Purpose                                                                                                                                                                                                                                                                                                    |
|-----------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 7110–7330 | Chamber map (AH=1) | Draws 9x4 character ASCII map at screen column 22. Shows walls/exits using alternating CHR$(134)/CHR$(135). Centre shows room contents from `MR(PA)`: creature count + "$" for treasure. Special area codes: G=Gateway, D=Deep Pool, V=Viper Pit, T=Tomb, H=Great Hall. Shows stair symbols (CHR$ 252/253) |
| 7340–7460 | Tunnel map (AH=0)  | Same layout but with solid block borders (CHR$(135) only)                                                                                                                                                                                                                                                  |
