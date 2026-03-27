# Requirement 2: High-Level Architecture

This document defines the overall game structure, phases, and flow for the Sorcerer's Cave solitaire implementation on the Casio VX-4.

## Game Phases Overview

The game has five major phases, each with distinct sub-phases:

```
┌─────────────────────────────────────────────────────────┐
│                    GAME FLOW                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. SETUP PHASE                                         │
│     ├── Title screen                                    │
│     ├── Party selection (choose creatures, total ≤ 6)   │
│     ├── Shuffle decks (area cards, small cards)         │
│     └── Place party on GATEWAY                          │
│                                                         │
│  2. TURN LOOP (repeats until game ends)                 │
│     ├── 2a. Redistribute treasure (optional)            │
│     ├── 2b. Choose action:                              │
│     │       ├── Move through explored area              │
│     │       ├── Explore new doorway/stairway            │
│     │       ├── Use artifact (carpet, flute, etc.)      │
│     │       ├── Open treasure chest                     │
│     │       └── Leave the cave (exit stairway, level 1) │
│     ├── 2c. Resolve new area (if exploring)             │
│     │       ├── Dead end → turn ends                    │
│     │       ├── Tunnel → turn ends                      │
│     │       ├── Viper Pit → crossing phase              │
│     │       ├── Deep Pool → crossing phase              │
│     │       └── Chamber → draw small cards              │
│     ├── 2d. Chamber events (if chamber entered)         │
│     │       ├── Resolve hazards (in priority order)     │
│     │       ├── Pick up unguarded treasure              │
│     │       └── Encounter strangers → sub-phase         │
│     └── 2e. Stranger encounter (if strangers present)   │
│             ├── Withdraw (go back)                      │
│             ├── Attack (→ FIGHT phase)                  │
│             └── Approach (test reaction)                │
│                 ├── Hostile → FIGHT phase               │
│                 ├── Indifferent → turn ends             │
│                 └── Friendly → join party               │
│                                                         │
│  3. FIGHT PHASE (sub-phase, can span multiple turns)    │
│     ├── Set up matchings                                │
│     ├── Resolve each match (die rolls)                  │
│     ├── Remove casualties                               │
│     └── Continue or retreat                             │
│                                                         │
│  4. SPECIAL AREA PHASES                                 │
│     ├── Viper Pit crossing (segment by segment)         │
│     └── Deep Pool crossing (turn-based)                 │
│                                                         │
│  5. END PHASE                                           │
│     ├── Calculate score                                 │
│     ├── Display results                                 │
│     └── High score check                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Detailed Phase Flowcharts

### Phase 1: Setup

```
START
  │
  ▼
Title Screen
"SORCERER'S CAVE"
"Press EXE"
  │
  ▼
Party Selection ◄────────────┐
  Show available creatures   │
  Show selection points left │
  Player picks a creature    │
  Deduct selection value     │
  │                          │
  ├── Points remaining > 0 ──┘
  │
  ▼
Confirm party
  │
  ▼
Initialize decks
  Shuffle 59 area cards (GATEWAY removed)
  Shuffle small pack (52 cards)
  │
  ▼
Place party on GATEWAY (level 1)
  │
  ▼
→ Enter TURN LOOP
```

### Phase 2: Turn Loop

```
TURN START
  │
  ▼
Redistribute treasure? ──Yes──► Show party inventory
  │ No                          Allow moving items
  ▼                             between creatures
Show current location
  Area name, exits, level
  Contents (strangers, treasure)
  │
  ▼
┌─ Choose action ─────────────────────────────┐
│                                              │
│  [N/E/S/W] Move through exit                 │
│  [U/D]     Use stairway                      │
│  [I]       Inventory / redistribute          │
│  [A]       Use artifact                      │
│  [X]       Leave cave (if on level 1 + up)   │
│                                              │
└──────────────────────────────────────────────┘
  │
  ├── Exit/stairway leads to EXPLORED area
  │     Move party there
  │     If chamber with strangers → Stranger Encounter
  │     Else → TURN END
  │
  ├── Exit/stairway leads to UNEXPLORED direction
  │     Draw area card from large pack
  │     ├── Dead end (no matching doorway)
  │     │     Card placed face-down
  │     │     → TURN END
  │     ├── Tunnel
  │     │     Card placed, party moves
  │     │     → TURN END
  │     ├── Viper Pit
  │     │     → VIPER PIT PHASE
  │     ├── Deep Pool
  │     │     → DEEP POOL PHASE
  │     └── Chamber (normal, Great Hall, Tomb of Kings)
  │           → CHAMBER PHASE
  │
  ├── Use stairway UP from level 1
  │     → EXIT CAVE → END PHASE
  │
  └── Use artifact
        ├── Magic Carpet → move to adjacent area
        ├── Charmed Flute → find secret doors / sleep dragons
        ├── Healing Balm → revive creature
        ├── Open Treasure Chest → die roll
        └── etc.
```

### Phase 2d: Chamber Entry

```
ENTER CHAMBER
  │
  ▼
First visit?
  │
  ├── Yes: Draw small cards
  │     Level 1 → draw 1
  │     Level 2 → draw 2
  │     Level 3 → draw 3
  │     Level 4+ → draw 4
  │     (+1 for Tomb of Kings)
  │     (+2 for Great Hall)
  │
  └── No: Use existing contents
  │
  ▼
Sort drawn cards by type:
  Hazards first (in priority order)
  Then treasure
  Then creatures
  │
  ▼
Resolve hazards (in order):
  ├── EARTHQUAKE → destroy previous area
  ├── MEDUSA → roll per creature, 1-2 = stone
  ├── GHOULS → fight each creature vs str 2
  ├── MUTINY → allies become strangers
  └── TRAP → party falls one level down
        └── Draw new area card below
            → Recursively enter that area
  │
  ▼
Strangers present?
  │
  ├── No: Pick up treasure
  │       Distribute among party
  │       → TURN END
  │
  └── Yes: → STRANGER ENCOUNTER
```

### Phase 2e: Stranger Encounter

```
STRANGER ENCOUNTER
  │
  ▼
Show strangers (names, strengths)
  │
  ▼
┌─ Choose action ──────────────────┐
│                                   │
│  [W] Withdraw (go back)          │
│  [A] Attack (start fight)        │
│  [T] Test reaction (approach)    │
│                                   │
└───────────────────────────────────┘
  │
  ├── Withdraw
  │     Party returns to previous area
  │     Strangers + treasure stay
  │     → TURN END
  │
  ├── Attack
  │     → FIGHT PHASE (party has surprise
  │       if entered by new doorway)
  │
  └── Test reaction
        Determine leader (priority list)
        Roll die + modifiers
        (Hero: +1, Ring: +1, Curse: -1)
        (Roll of 1 always = 1)
        Consult reaction table
        │
        ├── Hostile
        │     Strangers attack (they have surprise)
        │     → FIGHT PHASE
        │
        ├── Indifferent
        │     Strangers ignore party
        │     Track approach count (solitaire: max 3)
        │     → TURN END
        │     (Next turn: test again, attack, or leave)
        │
        └── Friendly
              Strangers join party as allies
              Pick up any treasure in chamber
              → TURN END
```

### Phase 3: Fight

```
FIGHT SETUP
  │
  ▼
Both sides drop heavy treasure
  │
  ▼
Player deploys creatures:
  ├── Front line (hand-to-hand fighters)
  └── Background (priests/wizards using magic)
  │
  ▼
Auto-deploy strangers:
  Match strongest vs strongest
  Priests/wizards go background if beneficial
  │
  ▼
┌──────── FIGHT ROUND ◄─────────────────────┐
│  │                                         │
│  ▼                                         │
│  For each match:                           │
│    Roll die for each side                  │
│    Add strength + modifiers                │
│    (surprise +1, ring +1, curse -1, etc.)  │
│    Higher total wins → loser slain         │
│    Tie → no casualty                       │
│    │                                       │
│    If 2-vs-1 and player loses:             │
│      Player states preference              │
│      Roll die: 4-6 = preference dies       │
│                1-3 = other dies             │
│  │                                         │
│  ▼                                         │
│  Remove casualties                         │
│  All strangers dead? → VICTORY             │
│  All party dead? → DEFEAT (maybe game over)│
│  │                                         │
│  ▼                                         │
│  ┌─ Choose ──────────┐                     │
│  │ [F] Fight on       │──────────────────┘
│  │ [R] Retreat        │
│  └────────────────────┘
│         │
│         ▼
│       Retreat
│         Choose exit
│         ├── Exit clear → escape
│         │   Leave dropped treasure behind
│         │   → TURN END
│         └── Exit blocked (dead end / strangers)
│               Must fight another round
│               → back to FIGHT ROUND
│
VICTORY
  Surviving strangers' treasure available
  Redistribute loot
  → TURN END

DEFEAT
  All party creatures dead?
  ├── Yes → GAME OVER → END PHASE
  └── No (shouldn't happen) → continue
```

### Phase 4: Special Areas

#### Viper Pit

```
ENTER VIPER PIT
  │
  ▼
Party is at entry doorway
  Show pit layout with exits
  │
  ▼
┌─ Choose ─────────────────────────┐
│ [B] Go back                      │
│ [N/E/S/W] Cross to that exit     │
│ (shows segments to cross)        │
└──────────────────────────────────┘
  │
  ▼
For each segment to cross:
  For each creature in party:
    Roll die
    1 = creature falls into pit (lost)
      Treasure stays in pit
    2-6 = safe passage
  │
  ▼
(If charmed flute: no rolls needed,
 also can retrieve pit treasure)
  │
  ▼
Party at target exit
  → TURN END (can explore from here next turn)
```

#### Deep Pool

```
ENTER DEEP POOL
  │
  ▼
Party is at entry doorway
  │
  ▼
Turn 1: Arrive at edge (TURN END)
  │
  ▼
Turn 2+:
┌─ Choose ─────────────────────────┐
│ [B] Go back to previous area     │
│ [N/E/S/W] Cross to that exit     │
└──────────────────────────────────┘
  │
  ▼
Crossing:
  Non-giants drop heavy treasure at doorway
  Giants carry one load across
  │
  ├── Giant has more loads?
  │     Extra turn per load → TURN END
  │
  └── All across
        → TURN END (explore from here next turn)
```

### Phase 5: End Game

```
END PHASE
  │
  ├── Party left the cave
  │     Calculate score:
  │       Sum creature points (allies in party)
  │       Sum treasure points (carried out)
  │       Dragon-slayers: creature worth × 2
  │       Sorcerer killed: +30 bonus
  │       Each curse: -30 points
  │       Discard used items (carpet, dust, potion, balm)
  │
  └── All creatures dead
        Score = 0
  │
  ▼
Display final score
Compare to high score
  │
  ▼
Play again? [Y/N]
  ├── Yes → SETUP PHASE
  └── No → END
```

## Program Architecture (BASIC Structure)

### Line Number Allocation

The program is divided into logical blocks, each assigned a range of line numbers:

| Line Range | Module   | Description                                          |
|------------|----------|------------------------------------------------------|
| 100-499    | MAIN     | Title screen, main game loop, turn dispatch          |
| 500-999    | SETUP    | Party selection, deck initialization                 |
| 1000-1999  | MAP      | Area card management, movement, map display          |
| 2000-2999  | CHAMBER  | Chamber entry, small card drawing, hazard resolution |
| 3000-3999  | STRANGER | Stranger encounters, reaction testing                |
| 4000-4999  | FIGHT    | Combat setup, rounds, retreat                        |
| 5000-5999  | SPECIAL  | Viper pit, deep pool, special area handling          |
| 6000-6999  | ARTIFACT | Artifact usage (carpet, flute, balm, etc.)           |
| 7000-7499  | SCORE    | End game scoring, high score                         |
| 7500-7999  | UI       | Display helpers, prompts, status display             |
| 8000-8999  | DATA     | DATA statements for cards, creatures, treasure       |
| 9000-9999  | UTIL     | Utility subroutines (die roll, shuffle, etc.)        |

### Subroutine Architecture

```
MAIN LOOP (100)
  │
  ├── GOSUB SETUP (500)
  │     ├── GOSUB TITLE (510)
  │     ├── GOSUB PICK_PARTY (550)
  │     ├── GOSUB INIT_DECKS (700)
  │     └── GOSUB INIT_MAP (750)
  │
  ├── GOSUB TURN (200) ◄─── main loop
  │     ├── GOSUB SHOW_STATUS (7500)
  │     ├── GOSUB GET_ACTION (250)
  │     │
  │     ├── GOSUB MOVE (1000)
  │     │     ├── GOSUB DRAW_AREA (1100)
  │     │     ├── GOSUB PLACE_AREA (1200)
  │     │     └── GOSUB ENTER_AREA (1300)
  │     │
  │     ├── GOSUB CHAMBER_ENTER (2000)
  │     │     ├── GOSUB DRAW_SMALL (2100)
  │     │     ├── GOSUB RESOLVE_HAZARDS (2200)
  │     │     │     ├── GOSUB DO_EARTHQUAKE (2210)
  │     │     │     ├── GOSUB DO_MEDUSA (2230)
  │     │     │     ├── GOSUB DO_GHOULS (2250)
  │     │     │     ├── GOSUB DO_MUTINY (2270)
  │     │     │     └── GOSUB DO_TRAP (2290)
  │     │     ├── GOSUB TAKE_TREASURE (2400)
  │     │     └── GOSUB ENCOUNTER (3000)
  │     │
  │     ├── GOSUB FIGHT (4000)
  │     │     ├── GOSUB FIGHT_SETUP (4100)
  │     │     ├── GOSUB FIGHT_ROUND (4200)
  │     │     │     └── GOSUB RESOLVE_MATCH (4300)
  │     │     └── GOSUB FIGHT_END (4400)
  │     │
  │     ├── GOSUB VIPER_PIT (5000)
  │     ├── GOSUB DEEP_POOL (5200)
  │     │
  │     └── GOSUB USE_ARTIFACT (6000)
  │           ├── GOSUB USE_CARPET (6100)
  │           ├── GOSUB USE_FLUTE (6200)
  │           ├── GOSUB USE_BALM (6300)
  │           ├── GOSUB OPEN_CHEST (6400)
  │           ├── GOSUB USE_DUST (6500)
  │           └── GOSUB USE_POTION (6600)
  │
  ├── GOSUB END_GAME (7000)
  │     ├── GOSUB CALC_SCORE (7100)
  │     └── GOSUB SHOW_SCORE (7200)
  │
  └── DATA blocks (8000-8999)
        ├── Area card data (8000)
        ├── Creature data (8200)
        ├── Treasure data (8400)
        └── Hazard data (8500)
```

## Implementation Stages

The game should be built incrementally, with each stage producing a playable (if incomplete) game:

### Stage 1: Foundation
- Title screen and party selection
- Basic map with GATEWAY
- Moving through tunnels (no chambers yet)
- Simple status display

### Stage 2: Exploration
- Drawing and placing area cards
- Dead end detection
- Chamber detection (draw small cards)
- Level transitions via stairways

### Stage 3: Encounters
- Stranger reaction testing
- Picking up unguarded treasure
- Hazard resolution (TRAP, EARTHQUAKE, MEDUSA, GHOULS, MUTINY)

### Stage 4: Combat
- Fight setup (matching creatures)
- Fight rounds (die rolls, casualties)
- Retreat mechanics
- Priests/wizards in background

### Stage 5: Special Areas & Artifacts
- Viper Pit crossing
- Deep Pool crossing
- All artifact effects
- Secret doors

### Stage 6: Scoring & Polish
- End game scoring
- High score persistence
- Curse tracking
- Dragon-slayer tracking
- Lost Ruby statue combat
- Treasure Chest die roll

## Memory Budget (32KB)

Rough allocation for the VX-4's ~32KB usable memory:

| Component            | Estimated Size | Notes                            |
|----------------------|----------------|----------------------------------|
| Program code (BASIC) | ~15-18 KB      | Tokenized BASIC is compact       |
| DATA statements      | ~3-4 KB        | Card definitions, creature stats |
| Map state (arrays)   | ~3-4 KB        | 60 areas × ~8 bytes each         |
| Party state (arrays) | ~1-2 KB        | Creatures, inventory, status     |
| Small deck state     | ~1-2 KB        | 52 card positions/drawn status   |
| Variables            | ~1-2 KB        | Game state, counters, temps      |
| Stack/workspace      | ~2-3 KB        | GOSUB stack, BASIC workspace     |
| **Total**            | **~26-33 KB**  | Tight but feasible               |

Memory will be the primary constraint. Strategies to manage it:
- Use compact numeric arrays rather than string arrays for card data
- Encode card properties as bit fields where possible
- Reuse variables aggressively (short names for temporaries)
- Keep DATA statements concise with numeric encoding
- Use CLEAR to set appropriate variable/work area sizes

## Next Steps

- **Requirement 3**: Define the specific data structures for static card data (DATA statements)
- **Requirement 4**: Define the data structures for dynamic game state (arrays, variables)
- **Requirement 5**: Detailed flowcharts for each phase
- **Requirement 6**: UI layout designs for the 4×32 display
