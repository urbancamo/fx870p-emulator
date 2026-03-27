# Requirements 5 & 6: Detailed Phase Planning and UI Layouts

This document defines the detailed logic for each game phase and the exact screen layouts for the 4-line × 32-column VX-4 display.

## Display Conventions

```
┌────────────────────────────────┐
│ Line 1: Context / Location     │  ← always shows where you are
│ Line 2: Main info / content    │  ← primary information
│ Line 3: Secondary info         │  ← details, options
│ Line 4: Prompt / actions       │  ← player input
└────────────────────────────────┘
```

- Line 1 is the **status line** — always shows current area, level, and turn number
- Lines 2-3 are **content** — changes based on what's happening
- Line 4 is the **action line** — shows available keys/prompts
- Numbers in `[brackets]` are key presses
- `_` represents the cursor/input position

## Phase 1: Title and Setup

### 1.1 Title Screen

```
┌────────────────────────────────┐
│  ** SORCERER'S CAVE **         │
│  A Game of Exploration         │
│  Magic, and Adventure          │
│ [EXE] Start  [1-6] HiScore    │
└────────────────────────────────┘
```

On EXE → party selection. On number key → show high scores.

### 1.2 Party Selection

The player chooses creatures totalling up to 6 selection points. The screen cycles through available creatures.

```
┌────────────────────────────────┐
│ SELECT PARTY    Pts left: 6    │
│ HERO     Str:3 Carry:75kg     │
│ Sel:6  Special: Charisma      │
│ [EXE]Add [4/6]Prev/Next [0]Go │
└────────────────────────────────┘
```

After adding a creature:

```
┌────────────────────────────────┐
│ SELECT PARTY    Pts left: 2    │
│ Party: PRIEST                  │
│ WOMAN  Str:2 Carry:25kg Sel:2 │
│ [EXE]Add [4/6]Prev/Next [0]Go │
└────────────────────────────────┘
```

When points exhausted or player presses [0]:

```
┌────────────────────────────────┐
│ YOUR PARTY:                    │
│ PRIEST(4) WOMAN(2)             │
│ Total Str:4 Carry:50kg         │
│ [EXE] Begin  [BS] Redo        │
└────────────────────────────────┘
```

### 1.3 Setup Logic

```
Phase 1 pseudocode:

1. Display title screen
2. Wait for EXE
3. PARTY SELECTION:
   a. Set remaining points = 6
   b. Show first available creature
   c. Loop:
      - [4] = show previous creature
      - [6] = show next creature
      - [EXE] = add creature to party (if points allow)
        - Deduct selection value
        - Reduce available count
      - [0] = done selecting (if party not empty)
   d. Show confirmation screen
   e. [EXE] = proceed, [BS] = restart selection
4. INITIALIZE:
   a. CLEAR memory areas
   b. READ all DATA into arrays
   c. Build and shuffle large pack (59 cards, gateway removed)
   d. Build and shuffle small pack (52 cards)
   e. Place GATEWAY as area 1, level 1, at coordinates (0,0)
   f. Set party location to area 1
```

## Phase 2: Main Turn Loop

### 2.1 Status Display (shown at start of each turn)

```
┌────────────────────────────────┐
│ L1 GATEWAY     Trn:1  Crs:0   │
│ Exits: N E S W  Stairs: U     │
│ Party: PRIEST WOMAN            │
│ [NESW]Move [I]Inv [A]Art [?]  │
└────────────────────────────────┘
```

Status line format: `L{level} {area_name} Trn:{turn} Crs:{curses}`

For regular tunnels/chambers without special names:

```
┌────────────────────────────────┐
│ L1 Chamber#3   Trn:5  Crs:0   │
│ Exits: N S     Chamber        │
│ Contains: TROLL, GOLD          │
│ [NS]Move [I]Inv [A]Art [?]    │
└────────────────────────────────┘
```

For tunnels (no chamber):

```
┌────────────────────────────────┐
│ L1 Tunnel#7    Trn:8  Crs:0   │
│ Exits: N E W   Stair: D       │
│ Party: PRIEST WOMAN 2xSILVER  │
│ [NEW]Move [D]Down [I]Inv      │
└────────────────────────────────┘
```

### 2.2 Movement Logic

```
Phase 2 pseudocode:

1. Display status
2. Get player input (direction key)
3. Determine target:
   a. Check if chosen exit exists on current area
   b. Look for adjacent explored area in that direction
      - If found: move there (one turn)
      - If not found: draw from large pack
4. If drawing new area card:
   a. Pop top card from large pack
   b. Check if chosen exit matches a doorway on new card
      - Match: place card, move party there
      - No match: dead end — card placed face-down
        - If ALL exits tried and blocked:
          put card back, draw again (forced redraw rule)
   c. Determine area type:
      - Tunnel → end turn
      - Chamber → enter chamber phase
      - Viper Pit → viper pit phase
      - Deep Pool → deep pool phase
      - Gateway (shouldn't happen, only one)
5. If moving to previously explored area:
   a. Move party
   b. If chamber with strangers → stranger encounter
   c. If chamber with hazards still active → resolve
   d. Otherwise → end turn
```

### 2.3 Explore New Direction — Screen Flow

Player presses [N] to go North from current area:

```
┌────────────────────────────────┐
│ L1 GATEWAY     Trn:1  Crs:0   │
│ Exploring North...             │
│ Drew: Tunnel (N,E,S exits)     │
│ [EXE] Enter tunnel             │
└────────────────────────────────┘
```

Dead end:

```
┌────────────────────────────────┐
│ L1 GATEWAY     Trn:1  Crs:0   │
│ Exploring North...             │
│ DEAD END! No matching exit     │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

### 2.4 Inventory Screen [I]

```
┌────────────────────────────────┐
│ INVENTORY        Party: 2     │
│ PRIEST(4) 25kg: SILVER         │
│ WOMAN(2)  25kg: (empty)        │
│ [EXE]Back [R]Redist [4/6]Scrl │
└────────────────────────────────┘
```

If party is larger than 2, scroll with [4]/[6]:

```
┌────────────────────────────────┐
│ INVENTORY        Party: 4     │
│ MAN(3)   50kg: GOLD,GOLD      │
│ DWARF(1) 25kg: M.SWORD        │
│ [EXE]Back [R]Redist [4/6]Scrl │
└────────────────────────────────┘
```

### 2.5 Redistribute Treasure [R]

```
┌────────────────────────────────┐
│ REDISTRIBUTE                   │
│ From: PRIEST > SILVER          │
│   To: WOMAN  (free:25kg)       │
│ [EXE]Move [4/6]Chng [0]Done   │
└────────────────────────────────┘
```

## Phase 2d: Chamber Entry

### Chamber Card Draw

```
┌────────────────────────────────┐
│ L2 Chamber#5   Trn:12 Crs:0   │
│ First visit! Drawing 2 cards.. │
│ Found: TROLL, GOLD             │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

### Hazard Resolution

Each hazard shows on screen before being resolved:

**TRAP:**

```
┌────────────────────────────────┐
│ L2 Chamber#5   Trn:12 Crs:0   │
│ !! TRAP !!                     │
│ Party falls to Level 3!        │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

**MEDUSA:**

```
┌────────────────────────────────┐
│ L1 Chamber#3   Trn:8  Crs:0   │
│ !! MEDUSA !!                   │
│ PRIEST: safe  WOMAN: STONE!    │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

**EARTHQUAKE:**

```
┌────────────────────────────────┐
│ L1 Chamber#3   Trn:8  Crs:0   │
│ !! EARTHQUAKE !!               │
│ Tunnel#2 collapsed behind you! │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

**GHOULS:**

```
┌────────────────────────────────┐
│ L1 Chamber#3   Trn:8  Crs:0   │
│ !! GHOULS attack! Str:2 each  │
│ PRIEST:4vs3 OK  MAN:5vs2 OK   │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

**MUTINY:**

```
┌────────────────────────────────┐
│ L1 Chamber#3   Trn:15 Crs:0   │
│ !! MUTINY !!                   │
│ TROLL(ally) leaves your party! │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

### Unguarded Treasure

```
┌────────────────────────────────┐
│ L2 Chamber#5   Trn:12 Crs:0   │
│ Treasure: GOLD (25kg, 10pts)  │
│ Give to: PRIEST (free:0kg)     │
│ [4/6]Creature [EXE]Take [S]kip│
└────────────────────────────────┘
```

## Phase 2e: Stranger Encounter

### Meeting Strangers

```
┌────────────────────────────────┐
│ L2 Chamber#5   Trn:12 Crs:0   │
│ STRANGERS: TROLL(4) OGRE(5)   │
│ Leader: OGRE                   │
│ [W]ithdraw [A]ttack [T]est    │
└────────────────────────────────┘
```

### Testing Reaction

```
┌────────────────────────────────┐
│ Testing OGRE's reaction...     │
│ Die: 5 +1(hero) = 6            │
│ Result: FRIENDLY!              │
│ TROLL & OGRE join party! [EXE] │
└────────────────────────────────┘
```

```
┌────────────────────────────────┐
│ Testing OGRE's reaction...     │
│ Die: 3 = 3                     │
│ Result: INDIFFERENT (1/3)      │
│ [EXE] Continue (next turn)     │
└────────────────────────────────┘
```

```
┌────────────────────────────────┐
│ Testing WIZARD's reaction...   │
│ Die: 1 (always hostile!)       │
│ Result: HOSTILE! They attack!  │
│ [EXE] Fight!                   │
└────────────────────────────────┘
```

### Encounter Logic

```
Encounter pseudocode:

1. Identify strangers in chamber
2. Determine leader (priority: SPECTRE > DRAGON > WIZARD >
   HERO/W-HERO > PRIEST > MAN/WOMAN > GIANT > OGRE > TROLL > DWARF)
3. Show strangers and options
4. Player chooses:
   a. WITHDRAW:
      - Can only withdraw by the doorway entered
      - Move party back to previous area
      - Strangers + treasure stay in chamber
      - End turn
   b. ATTACK:
      - Party has surprise if entered by new doorway
      - → Fight phase
   c. TEST:
      - Roll die
      - Add modifiers: +1 if HERO in party, +1 if RING held
      - Subtract curses
      - Roll of 1 always counts as 1 (no bonuses)
      - Clamp to 1-6 range
      - Consult leader's reaction table:
        - ≤ hostile_max → HOSTILE: strangers attack (they have surprise)
          → Fight phase
        - ≤ indifferent_max → INDIFFERENT:
          increment approach counter
          if counter ≥ 3 (solitaire) → permanently indifferent
          end turn
        - > indifferent_max → FRIENDLY:
          add all strangers to party as allies
          pick up any treasure in chamber
          end turn
```

## Phase 3: Fight

### Fight Setup Screen

```
┌────────────────────────────────┐
│ FIGHT! Round 1   Surprise: You │
│ Match 1: HERO(3) vs TROLL(4)  │
│ Match 2: MAN(3)+PRIEST(2mag)  │
│          vs OGRE(5)            │
└────────────────────────────────┘
```

Wait for EXE, then show each match result:

### Fight Round Resolution

```
┌────────────────────────────────┐
│ FIGHT Round 1                  │
│ HERO(3)+1sur = Die:4+4=8      │
│ TROLL(4)+1sur = Die:2+5=7     │
│ HERO WINS! TROLL slain! [EXE] │
└────────────────────────────────┘
```

```
┌────────────────────────────────┐
│ FIGHT Round 1                  │
│ MAN(3)+PRIEST(2)+1= Die:5+6=11│
│ OGRE(5)+1sur = Die:6+6=12     │
│ OGRE WINS! Who dies? [4/6]    │
└────────────────────────────────┘
```

When player must choose who dies (2v1 loss):

```
┌────────────────────────────────┐
│ Choose who to sacrifice:       │
│ > MAN                          │
│   PRIEST (background, safe)    │
│ [4/6]Select [EXE]Confirm      │
└────────────────────────────────┘
```

Note: PRIEST in background is not vulnerable. Only front-line creatures can die.

After die roll for preference:

```
┌────────────────────────────────┐
│ Preference: MAN                │
│ Die roll: 5 (need 4-6)        │
│ Your choice stands.            │
│ MAN is slain! [EXE]           │
└────────────────────────────────┘
```

### End of Round

```
┌────────────────────────────────┐
│ Round 1 complete               │
│ Your losses: MAN               │
│ Enemy losses: TROLL            │
│ [F]ight on  [R]etreat         │
└────────────────────────────────┘
```

### Fight Setup Logic

```
Fight setup pseudocode:

1. All fighters drop heavy treasure (left on area card)
2. Count party fighters and stranger fighters
3. Separate priests/wizards for possible background role
4. AUTO-MATCH strangers (computer decides optimal deployment):
   a. Sort strangers by total strength (descending)
   b. For each stranger:
      - If priest/wizard AND more value in background → background
      - Else → front line
5. PLAYER DEPLOYS party:
   a. For simple implementation: auto-match strongest vs strongest
   b. Player can choose to put priests/wizards in background
   c. If outnumbered: send 2 vs 1 for strongest enemy
   d. If outnumber enemy: send 1 vs 1, extras support
6. Determine surprise:
   - Party has surprise if: entered by new doorway, or magic carpet
   - Strangers have surprise if: they attacked on approach test
   - Surprise adds 1 to all die rolls for that side in round 1
```

### Fight Round Logic

```
Fight round pseudocode:

For each match:
  1. Calculate attacker strength:
     - Front-line creature(s) fighting strength
     - + background magical power assigned to this match
     - + artifact bonuses (magic sword, strength potion)
     - + surprise bonus (round 1 only)
     - + ring bonus
     - - curse penalty
  2. Calculate defender strength (same formula)
  3. Roll die for each side
  4. Add strength to die roll
  5. Compare totals:
     - Higher wins → loser slain
     - Tie → no casualty
  6. If 2v1 and the 2 lose:
     - Player states preference for who dies
     - Roll die: 4-6 = preference, 1-3 = other
     - Background creatures are safe (not vulnerable)
  7. Special: Ring on level 4+ makes bearer invincible
     (die rolls that would kill bearer are ignored)
  8. Special: Spectre can only be fought by magic power
     or magic sword bearer. Otherwise auto-slain.

After all matches resolved:
  - Remove slain creatures
  - Check if all enemies dead → victory
  - Check if all party dead → game over
  - Otherwise: player chooses fight or retreat
```

## Phase 4: Special Areas

### 4.1 Viper Pit

```
┌────────────────────────────────┐
│ L2 VIPER PIT   Trn:15 Crs:0   │
│ Exits: N E S W (narrow ledge) │
│ Cross to which exit?           │
│ [NESW]Choose [B]ack [F]lute   │
└────────────────────────────────┘
```

Crossing segment by segment:

```
┌────────────────────────────────┐
│ Crossing N→E segment...       │
│ PRIEST: Die:4 SAFE             │
│ WOMAN:  Die:1 FALLS! Lost!    │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

With charmed flute:

```
┌────────────────────────────────┐
│ Crossing N→E segment...       │
│ Flute lulls vipers to sleep!  │
│ All party members cross safely │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

### 4.2 Deep Pool

```
┌────────────────────────────────┐
│ L2 DEEP POOL   Trn:18 Crs:0   │
│ Water blocks the way.          │
│ Cross to which exit?           │
│ [NESW]Choose [B]ack            │
└────────────────────────────────┘
```

Crossing:

```
┌────────────────────────────────┐
│ Crossing deep pool...          │
│ PRIEST drops SILVER at edge    │
│ GIANT carries GOLD across      │
│ GIANT: 1 more load [EXE]      │
└────────────────────────────────┘
```

### 4.3 Special Area Logic

```
Viper Pit pseudocode:

1. Party arrives at entry doorway
2. Show exits (ledge segments needed for each)
3. Calculate segments to cross:
   - Adjacent exits = 1 segment
   - Opposite exits = 2 segments
   - Same exit = 0 (going back)
4. For each segment:
   - If party has charmed flute: auto-safe
   - Else: roll die per creature
     - 1 = creature falls (removed, treasure in pit)
     - 2-6 = safe
5. After crossing, party at target exit
6. If flute player present: can retrieve pit treasure

Deep Pool pseudocode:

1. Party arrives at entry doorway (turn 1: arrive, end turn)
2. On turn 2+: choose exit to cross to
3. All creatures cross water:
   - Non-giants: must drop heavy treasure at entry doorway
   - Giants: carry one load of heavy treasure per turn
   - If giant has N loads: takes N turns total
4. After crossing: party at target exit
5. Dropped treasure stays at entry doorway (can be picked up later)
```

## Phase 5: End Game and Scoring

### Leaving the Cave

```
┌────────────────────────────────┐
│ L1 Tunnel#2    Trn:34 Crs:0   │
│ Stair UP leads out of cave!   │
│ Leave the cave? No return!     │
│ [Y]es leave  [N]o stay        │
└────────────────────────────────┘
```

### Score Screen

```
┌────────────────────────────────┐
│ ** ESCAPED THE CAVE! **        │
│ Creatures: 18  Treasure: 35   │
│ DragonSlayer: x2  Sorc: +30   │
│ TOTAL: 101  HiScore: 85 [EXE]│
└────────────────────────────────┘
```

If party dies:

```
┌────────────────────────────────┐
│ ** YOUR PARTY HAS PERISHED ** │
│ The cave claims another band   │
│ of adventurers...              │
│ Score: 0  HiScore: 85  [EXE]  │
└────────────────────────────────┘
```

### Scoring Logic

```
Score pseudocode:

1. If party left cave:
   a. Sum points of all living party creatures (allies only, not originals?
      Actually: ALL creatures in party have point values)
   b. Sum points of all treasure carried out
   c. For each dragon-slayer creature: double that creature's point value
   d. If sorcerer killed: +30 bonus
   e. For each curse: -30 points
   f. Discard used single-use items (carpet, dust, potion, balm)
      from treasure total (they were consumed)
   g. Final score = max(0, total)
2. If party dead:
   a. Score = 0
3. Compare to high score
4. If new high score: save to variable (persists in VX-4 memory)
```

## Help Screen [?]

Accessible from the main turn display:

```
┌────────────────────────────────┐
│ HELP  [4/6] to scroll          │
│ N/E/S/W = Move direction       │
│ U/D = Use stairs up/down       │
│ I=Inventory A=Artifact ?=Help  │
└────────────────────────────────┘
```

Page 2:

```
┌────────────────────────────────┐
│ HELP  [4/6] to scroll          │
│ X = Exit cave (L1 stair up)   │
│ In combat: F=Fight R=Retreat   │
│ [EXE] Return to game          │
└────────────────────────────────┘
```

## Artifact Usage Screens [A]

### Select Artifact

```
┌────────────────────────────────┐
│ USE ARTIFACT                   │
│ > M.CARPET (PRIEST)            │
│   C.FLUTE  (WOMAN)             │
│ [4/6]Select [EXE]Use [0]Back  │
└────────────────────────────────┘
```

### Magic Carpet

```
┌────────────────────────────────┐
│ MAGIC CARPET                   │
│ Fly to adjacent area:          │
│ Direction? (one-time use)      │
│ [NESW] Direction  [UD] Level   │
└────────────────────────────────┘
```

### Treasure Chest

```
┌────────────────────────────────┐
│ OPEN TREASURE CHEST            │
│ Rolling die...  Die: 5         │
│ GOLD! (40 points)              │
│ [EXE] Continue                 │
└────────────────────────────────┘
```

```
┌────────────────────────────────┐
│ OPEN TREASURE CHEST            │
│ Rolling die...  Die: 2         │
│ A SPECTRE emerges & attacks!   │
│ [EXE] Fight!                   │
└────────────────────────────────┘
```

### Lost Ruby

```
┌────────────────────────────────┐
│ THE LOST RUBY                  │
│ A colossal statue! Str: 8     │
│ Try to remove the ruby?        │
│ [Y]es attempt  [N]o leave it  │
└────────────────────────────────┘
```

## Summary of Key Input Conventions

| Key | Context | Action |
|-----|---------|--------|
| N/E/S/W | Movement | Move in direction |
| U/D | Movement | Use stairs up/down |
| 4/6 | Lists/Scrolling | Previous/Next item |
| EXE | Universal | Confirm/Continue |
| 0 | Selection | Done/Back |
| BS | Selection | Cancel/Redo |
| I | Turn | Show inventory |
| A | Turn | Use artifact |
| R | Turn/Fight | Redistribute/Retreat |
| F | Fight | Fight on |
| W | Encounter | Withdraw |
| T | Encounter | Test stranger reaction |
| X | Turn (L1) | Exit cave |
| Y/N | Confirmations | Yes/No |
| ? | Turn | Help screen |

## Next Steps

All requirements 1-6 are now complete. The game design is fully specified:

1. ✅ Rules analysis (gaps, ambiguities resolved)
2. ✅ High-level architecture (phases, subroutine structure, memory budget)
3. ✅ Static data structures (DATA encoding for cards, creatures, treasure)
4. ✅ Dynamic data structures (arrays for map, party, combat state)
5. ✅ Detailed phase logic (pseudocode for every game phase)
6. ✅ UI layouts (screen mockups for every interaction)

**Requirement 7: Implementation** can now begin, following the 6 incremental stages defined in the architecture document.
