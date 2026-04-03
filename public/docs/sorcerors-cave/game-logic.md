# Game Logic

## Turn Flow

Each turn follows this sequence:

```
Display HUD (5220)
  → decode area card, show level/type/exits/party/map

Player Input (110)
  → wait for keypress
  → I = Inventory, A = Artifacts, * = Help
  → N/E/S/W/U/D = Move direction

Movement (1080)
  → calculate target coordinates
  → is target a visited area? → re-enter (1300)
  → is target unexplored? → draw new area card (1360)

Increment turn counter (340)
```

## Movement & Exploration

### Coordinate System

Areas are placed on a grid with coordinates packed as `level*10000 + y*100 + x`. Starting position is `(1, 50, 50)`. Moving North decreases Y, East increases X.

### Moving to a Visited Area (lines 1190–1305)

1. Calculate target coordinates from current position + direction delta
2. Search `ML(1..NM)` for matching coordinates
3. If found (`FA > 0`): check that the destination has a matching exit (e.g. going North requires the target to have a South exit)
4. If exits match: set `PA = FA` (move there)
5. Check for remaining creatures (`RC$`) → re-trigger stranger encounter
6. Check for remaining treasure (`RT$`) → re-offer pickup
7. If exits don't match: "Dead end that way" — seal the exit (1710)

### Moving via Stairs (lines 1310–1350)

- `MS(PA)` links paired stair areas bidirectionally
- Going Up from level 1 → exit the cave (6090)
- If a stair link exists, move to the linked area and check for remaining creatures/treasure

### Exploring a New Area (lines 1360–1600)

1. Draw top card from area deck: `NW = AK(LP(LI))`
2. Check exit compatibility (target area must have matching exit)
3. If no match → dead end (1610): seal the exit, record the area
4. If match → register new area:
   - Assign next map slot: `NM = NM + 1`
   - Store card and coordinates in `MP(NM)`, `ML(NM)`
   - For stairs: create bidirectional `MS()` link
5. Dispatch by area type:
   - AT=3 (Viper Pit) → GOSUB 4080
   - AT=2 (Deep Pool) → GOSUB 4440
   - AH=1 and AT not 2 or 3 → GOSUB 1770 (enter inhabited area)

## Entering an Inhabited Area (lines 1770–2040)

The number of chamber cards drawn depends on level:

```
Cards drawn = min(level, 4) + area_type_bonus
  AT=4 (Tomb):       +1 card
  AT=5 (Great Hall):  +2 cards
```

Cards are drawn from `SP()` into `DC()`. Each is categorised:
- CY=1: creature (NS counter)
- CY=2: treasure (NQ counter)
- CY=3: hazard (NH counter)

Room state is recorded: `MR(PA) = NS*10 + (1 if NQ>0)`

Processing order (matches board game rules):

```
1. Hazards first (if NH > 0)  → GOSUB 2050
2. Party wipe check            → if NP <= 0, GS=2
3. Displacement check          → if PA changed (trap), RETURN
4. Creatures (if NS > 0)       → GOSUB 2930 (stranger encounter), RETURN
5. Treasure only (if NQ > 0)   → GOSUB 2615 (pickup)
```

The displacement guard at line 2010 uses `QH` (saved PA before hazards). If a trap moved the party to a different area, the outer call returns without processing the original area's creatures/treasure (which would be stale).

## Hazard Processing (lines 2050–2610)

Hazards are processed in order of their position in `DC()`. The hazard dispatcher (2050) iterates all drawn cards, skipping non-hazard entries (CY≠3).

### Mutiny (CI=0)

All allies (PS=1) leave the party (PS set to 3, then cleaned up by 2850). If no allies exist, "No allies to mutiny." In the board game, mutineers should join strangers in the chamber — this is partially implemented (they're removed from party but not added as hostile strangers).

### Trap (CI=1)

1. Draw a new area card for one level down
2. Register it in the map
3. Move the party there (`PA = NM, PL = TL+1`)
4. If the new area is inhabited (AH=1), recursively call the inhabited area handler (GOSUB 1770)

**Critical**: The recursive call to 1770 from the trap handler overwrites global variables (ND, DC, NS, NQ, NH, etc.). The `QH` guard variable in the outer 1770 call detects the PA change and prevents duplicate processing.

### Earthquake (CI=2)

Cosmetic only — prints "Area behind collapses!" but does not actually modify the map data. The board game rule says the previous area should become impassable.

### Medusa (CI=3)

Each party member rolls a die. Roll of 1 or 2 → turned to stone (PS=2). If all members are stone, NP is set to 0 (effectively party wipe, but PS=2 members aren't cleaned up by 2850).

### Ghouls (CI=4)

Each party member fights ghouls with strength 2:
- Party member rolls die + their fighting strength (CF)
- Ghouls roll die + 2
- If ghouls win, party member is slain (PS=3)

Slain members are cleaned up by GOSUB 2850.

## Stranger Encounter (lines 2930–3480)

On first entering a chamber with creatures, or re-entering a room with persistent creatures (`RC$`), the stranger encounter fires.

### Setup

1. Store all creature IDs from `DC()` into `RC$(PA)` for persistence
2. Identify the leader (`SL`) — first creature found in DC() iteration order
3. Display creature names and leader
4. Reset test counter: `SS = 0`

**Note on leader selection**: The code uses the first creature found in DC() order, which corresponds to the order cards were drawn. The board game rules specify a priority list (Spectre > Dragon > Wizard > Hero > ...), which is not implemented — the leader is simply the first creature card drawn.

### Player Options

| Key | Action |
|-----|--------|
| W | **Withdraw** — party returns to previous area (`PA = PP`). Creatures remain; `RC$(PA)` stays set for re-entry |
| A | **Attack** — party has surprise (SU=1). Initiates combat (GOSUB 3490) |
| T | **Test** — roll die to determine stranger reaction (not available if leader is the Sorcerer, SL=11) |
| L | **Lotus Dust** — put one non-Spectre creature to sleep (removed from encounter). Only shown if party has Lotus Dust. One use |

### The Sorcerer (SL=11)

Per the board game rules, the Sorcerer and his companions are always hostile and cannot be tested. When the stranger leader is the Sorcerer, the [T]est option is hidden and the reaction data (HM=6, IM=6) ensures hostile on any roll as a safety net.

### Testing Strangers

1. Roll die → base result `R`
2. Ring bonus: if R > 1 and any party member carries Ring ('K'), R = R + 1
3. Hero/W-Hero bonus: if R > 1 and party contains Hero (CI=0) or W-Hero (CI=1), R = R + 1
4. Clamp R to 1–6
4. Read reaction thresholds (HM, IM) from DATA 6750 for the leader creature
5. If R ≤ HM → **Hostile**: enemies have surprise (SU=-1), combat starts. `RC$` cleared
6. If R ≤ IM → **Indifferent**: SS incremented. After 3 indifferent results: "Permanently indifferent". `RC$` stays set for re-entry retesting
7. If R > IM → **Friendly**: strangers join party as allies (PS=1). Creature count cleared from MR. Treasure offered. `RC$` cleared

### Re-entry (lines 2925–2928)

When re-entering a visited room with `RC$(PA)` content:
1. Reconstruct `DC()` array from `RC$` (creature cards) and `RT$` (treasure cards)
2. Set `ND`, `NS`, `NQ` accordingly
3. Clear `RC$` and call the encounter (2930), which immediately rebuilds `RC$` if creatures remain

## Combat (lines 3490–3980)

### Setup

Count enemies from DC() (CY=1 entries) → `NE`. Set round counter `RD = 1`.

### Each Round

Number of matches = `min(NP, NE)`. For each match:

1. **Party member**: total strength = CF + CM + bonuses
   - Sword bonus: if carrying Magic Sword (item 'D'): Hero gets +2, Man/Woman gets +1
   - Dragon-slayer bonus: `+PK(MN)` (incremented each time member slays a Dragon)
   - Strength Potion bonus: +2 if potion used on this member (`PB=MN`)
   - Magic Staff bonus: if carrying Staff (item 'J'): Priest gets +1, Wizard gets +2
2. **Enemy**: find strongest remaining enemy (iterate DC() for highest CF+CM) → `EC`, `ES`
   - Sorcerer penalty: if EC=11 (Sorcerer), ES is reduced by 2 for each of Lotus Dust ('F') or Eye of God ('N') carried by any party member (min 0)
3. **Party roll**: `YR = die + party_strength + surprise_bonus + ring_bonus - curse_penalty`
   - Ring bonus: +1 if any party member carries Ring ('K')
   - Curse penalty: `NC` (but only if Sorcerer is alive, `SK=0`)
4. **Enemy roll**: `ER = die + enemy_strength + surprise_bonus`
5. If YR > ER: enemy slain, NE decremented. If Dragon (EC=10): `PK(MN)` incremented. If Sorcerer (EC=11): `SK=1`
6. If ER > YR: party member slain (PS=3), unless bearer has Ring ('K') on level 4+ (invincible)
7. If tie: no casualty

Surprise bonus (+1) applies only in round 1.

Before each round, if Strength Potion ('I') is carried by a Man/Woman/Hero and hasn't been used yet, player is offered to use it. One use per fight.

### After Each Round

1. Clean up dead party members (GOSUB 2850)
2. If NP = 0 → game over (GS=2)
3. If NE = 0 → victory
4. Otherwise: offer [F]ight on or [R]etreat

### Victory (line 3890)

- Update `MR(PA)` with NE=0 (no creatures) + existing treasure flag
- If treasure present (NQ > 0): offer pickup (GOSUB 2615)

### Retreat (line 3950)

- Update `MR(PA)` with remaining NE + existing treasure flag
- "Treasure left behind" — player cannot pick up treasure

## Treasure Pickup (lines 2620–2845)

The pickup loop iterates all cards in `DC()`, processing only treasure entries (CY=2).

For each treasure:
1. Read treasure name from DATA 6680
2. Show weight warning for heavy items (CI < 3 → 25kg, CI = 14 → 100kg)
3. Player selects recipient with arrow keys (cycles through party members)
4. Show selected member's current carry weight vs capacity
5. **[EXE] Pickup**: check weight limit. If OK, add item character to `IV$(GI)`
6. **[S]kip**: store item in `RT$(PA)` for later retrieval

After the loop:
- If `RT$(PA)` is empty (all items taken): clear treasure bit in `MR(PA)`
- If items remain: treasure bit stays set → shows `$` on area map

### Re-entry Treasure (lines 2610–2612)

When re-entering a room with `RT$(PA)` content and no creatures:
1. Reconstruct `DC()/ND` from `RT$(PA)`
2. Clear `RT$` and run the pickup loop

### Manual Pickup (line 135/155)

The [P]ickup option appears in the main input prompt when the current room has uncollected treasure (`RT$(PA)` non-empty) and no hostile creatures (`INT(MR(PA)/10) = 0`). This provides a fallback for treasure that wasn't automatically offered after combat victory or friendly stranger resolution, and allows the player to return to a room to collect previously skipped items.

## Special Areas

### Viper Pit (AT=3, lines 4080–4430)

The pit has a narrow ledge with segments. To cross:
1. Calculate number of segments based on angular distance between entry and exit directions
2. For each segment, each party member rolls die:
   - Roll of 1 → falls off ledge (PS=3)
   - Roll > 1 → safe

**Charmed Flute bypass**: if any party member carries item 'M', all cross safely.

Dead party members are cleaned up after each segment. If NP reaches 0, game over.

### Deep Pool (AT=2, lines 4440–4640)

When crossing:
- Party members with low carry capacity (CW < 4, i.e. < 100kg) must drop heavy treasure (items with CI < 3)
- Items are removed from inventory (not recoverable)
- All surviving members cross safely

## Artifacts Menu (lines 4650–5020)

Accessed via 'A' key from the main input loop. Shows all artifacts (CI ≥ 3) carried by party members.

### Healing Balm (item 'G')

Searches for Healing Balm in party inventories. Currently prints "No dead to heal" — the resurrection mechanic is not fully implemented.

### Treasure Chest (item 'O')

1. Find a party member carrying the Chest
2. Roll die:
   - 1: Curse (NC incremented)
   - 2: Spectre attacks (not implemented as combat — just message + beep)
   - 3: Sand (worthless)
   - 4: Silver (20 points)
   - 5: Gold (40 points)
   - 6: Gems (80 points)
3. Chest is consumed (removed from inventory)

Points from the chest are scored by the presence of the score values in the existing scoring DATA — the chest die results modify score at game end.

## Scoring (lines 5080–5210)

Calculated when leaving the cave (GS=1):

```
Base score:
  + CP for each party member
  + CP again for each dragon-slayer (PK > 0)
  + treasure point value for each item in all IV$()

Bonuses/penalties:
  + 30 if Sorcerer killed (SK flag)
  - 30 per curse (NC count)

Minimum score: 0
```

## Game End Conditions

| GS value | Condition | Trigger |
|----------|-----------|---------|
| 0 | Playing | Normal state |
| 1 | Escaped | Player confirms exit via stairs up from level 1 |
| 2 | Party perished | NP reaches 0 (all members dead/stone) |
| 3 | Trapped | No available exits from current area (`EX$` is empty) |

## Unimplemented / Partial Rules

The following board game rules are not fully implemented:

| Rule | Status |
|------|--------|
| Earthquake destroying previous area | Cosmetic message only; map not modified |
| Healing Balm resurrection | Searches for item but always says "No dead to heal" |
| Spectre from Treasure Chest | Message only; no actual combat |
| Lotus Dust (sleep effect) | Reduces Sorcerer's strength by 2. Sleep implemented: [L]otus option in encounter menu puts one non-Spectre creature to sleep (removed from encounter). One use |
| Magic Carpet (teleport) | Not implemented |
| Strength Potion (combat bonus) | Implemented: offered before each combat round, adds +2 to Man/Woman/Hero strength for duration of fight. One use |
| Talisman (ward off undead) | Implemented: wards off Ghouls if any party member carries it |
| Ring invincibility (level 4+) | Implemented: +1 to all party combat die rolls. Bearer invincible on level 4+ (death rolls ignored). +1 to stranger test rolls |
| Magic Staff (reanimation) | Implemented: +1 strength for Priest, +2 for Wizard in combat. [S]taff option in artifacts menu reanimates stone members (requires Wizard with Staff) |
| Lost Ruby (statue fight) | Implemented: statue (Str 8) must be defeated to claim ruby. If party loses or draws, ruby stays in room for re-attempt |
| Eye of God (magic nullification) | Nullification not implemented; reduces Sorcerer's strength by 2 |
| Dragon-slayer strength bonus | Implemented: PK incremented on dragon kill, adds to fighting strength in combat. Double point value in scoring |
| Leader priority order | Uses first creature in draw order, not board game priority |
| Dwarf guides past traps | Implemented: living Dwarf in party ignores first trap per chamber. Second trap in same chamber still triggers |
| Mutineers joining strangers | Removed from party but not added to room's stranger pool |
| Secret doors | Implemented: stairs to areas without matching stair bit create secret doors. Blocked from hidden side unless Charmed Flute reveals them |
| Heavy treasure drop before combat | Not implemented |
| Creature pairing in combat | Always fights strongest enemy; no two-on-one mechanic |
| Sorcerer kill tracking | Implemented: SK flag set when Sorcerer slain (+30 pts). Curses nullified when Sorcerer dead. Retreat from Sorcerer causes curse |
| Healing Balm resurrection | Implemented: [H]eal in artifacts menu. Requires Woman/Priest/Wizard with balm. Restores last-killed creature as ally. One use |
| Spectre from Chest | Implemented: roll 2 on chest triggers one-round combat vs Spectre (Str 5). Surviving Spectre remains hostile in area |
