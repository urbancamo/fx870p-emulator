# The Sorcerer's Cave

*A Game of Exploration, Magic, and Adventure*

Based on the board game by Terence Donnelly (1978), adapted for the Casio FX-870P / VX-4.

---

*"The descent to the underworld is easy: through day and night the door of black Dis lies open. But to retrace your steps and escape to the upper air — there is trouble and toil."*
— Vergil, Aeneid vi. 126-29

---

## Introduction

In the heart of a forest in a faraway land is the entrance to a vast underground labyrinth, the treasure-house of an evil Sorcerer. During his long lifetime of wicked deeds this Sorcerer has gathered immense wealth: heaps of silver and gold and glittering jewels, and artifacts of wondrous power.

You are an adventurer who has come to match wits and strength with the Sorcerer. You enter the Cave with a small band of companions. Within its twisting passages and echoing caverns you may find friends, and enemies too. You will encounter magic which may help or harm you; you will find treasure; and perhaps you will meet the Sorcerer himself.

May you have good luck. But heed this warning: many do not return from the perils of the Sorcerer's Cave!

## Setup

Before running the program, type `CLEAR 11000,17000` then `RUN`.

You begin by choosing your exploring party. Select one or more creatures with a total cost of up to 6 points. Browse with the arrow keys and press EXE to add a creature to your party.

## Object of the Game

Explore the Cave, collect treasure and recruit allies, then escape alive through a stairway leading up from the first level. Your score is based on the creatures in your party and the treasure you carry out.

The game ends when your party leaves the Cave, or when all your creatures are dead.

## Exploring the Cave

Your party begins at the Gateway, just below the surface on level 1. Each turn you choose a direction to move: North, East, South, West, Up, or Down.

When you explore a new direction, an area is revealed. It may be a **tunnel** (safe passage), a **chamber** (where you'll find creatures, treasure, or hazards), or a **special area** (the Viper Pit, Deep Pool, Tomb of Kings, or Great Hall).

If your chosen exit doesn't match a doorway on the new area, it's a **dead end** — the area is placed but you cannot enter from that direction. You may be able to reach it from another direction later.

You may also move through areas you've already explored, at the rate of one area per turn.

### Chambers

When you first enter a chamber, cards are drawn from the deck:
- **Level 1**: 1 card
- **Level 2**: 2 cards
- **Level 3**: 3 cards
- **Level 4 or deeper**: 4 cards
- **Tomb of Kings**: 1 extra card
- **Great Hall**: 2 extra cards

Cards may be **hazards** (resolved immediately), **treasure** (which you can pick up), or **creatures** (strangers you must deal with).

### Encountering Strangers

When creatures are found in a chamber, you must choose one of three actions:

- **Withdraw** [W] — retreat the way you came. Strangers and treasure remain.
- **Attack** [A] — fight the strangers immediately. Your party has the advantage of surprise.
- **Test** [T] — approach the strangers to test their reaction. A die is rolled and the leader's reaction table is consulted:
  - **Friendly** — the strangers join your party as allies, and you may take any treasure.
  - **Indifferent** — the strangers ignore you. You may test again next turn, attack, or leave. After 3 indifferent results, they remain permanently indifferent.
  - **Hostile** — the strangers attack! They have the advantage of surprise.

If a Hero or Woman-Hero is in your party, add 1 to the die roll when testing strangers (except that a roll of 1 always counts as 1).

### Levels and Stairways

The Cave has multiple levels extending downward. Stairways connect areas on adjacent levels. When you descend a stairway, a new area is drawn on the level below.

Any stairway leading **up** from the first level is an exit from the Cave. Once you leave, you cannot return.

## Hazards

Hazards take effect immediately when drawn:

- **Trap** — your party falls one level deeper into a new area. If a Dwarf is in your party, you may avoid the trap.
- **Earthquake** — the area behind you collapses and becomes impassable.
- **Medusa** — a die is rolled for each creature in your party. On a 1 or 2, that creature is turned to stone and removed. A Wizard bearing the Magic Staff is immune.
- **Ghouls** — each creature in your party is immediately attacked by ghouls with a strength of 2. Casualties are removed.
- **Mutiny** — all allied creatures (those recruited during the game) leave your party.

## Combat

A fight may last one or more rounds. Each round, your creatures are matched against the enemy:

1. Creatures are paired off — strongest against strongest.
2. A die is rolled for each side. Each side's total strength is added to their roll.
3. The side with the higher total wins that match; the loser is slain.
4. If the scores are tied, no one is slain.

After each round, you may choose to **fight on** [F] or **retreat** [R].

### Strength

Each creature has a **fighting strength** and possibly a **magical power**. When fighting hand-to-hand, a creature uses their total strength (fighting + magical).

### Surprise

The side with surprise adds 1 to all die rolls in the first round:
- Your party has surprise when **attacking** strangers.
- Strangers have surprise when they are **hostile** on being approached.

### The Magic Sword

The Magic Sword adds 2 to a Hero's strength, or 1 to a Man's or Woman's strength. It also enables the bearer to fight Spectres hand-to-hand.

### Curses

A party under a curse subtracts 1 from all die rolls. Multiple curses stack. Curses have no effect if the Sorcerer is dead.

## Special Areas

### Viper Pit

A narrow ledge winds around a pit of vipers. You must cross one or more segments of ledge to reach another exit. For each segment, a die is rolled for each creature — on a 1, the creature falls into the pit and is lost.

If your party has the **Charmed Flute**, the vipers are lulled to sleep and all creatures cross safely.

### Deep Pool

Water blocks the way. Non-giant creatures must drop heavy treasure before crossing. All creatures cross safely.

## Treasure

### Heavy Treasure

| Name | Weight | Points |
|------|--------|--------|
| Silver | 25 kg | 5 |
| Gold | 25 kg | 10 |
| Gems | 25 kg | 20 |

Each creature can carry weight up to their carrying capacity.

### Artifacts

Artifacts are weightless and provide special abilities:

| Name | Points | Effect |
|------|--------|--------|
| Magic Sword | 15 | +1 strength to Man/Woman, +2 to Hero. Enables fighting Spectres |
| Magic Carpet | 5 | Transports party to an adjacent area. Single use |
| Lotus Dust | 5 | Puts 1 creature to sleep for 2 turns. Single use |
| Healing Balm | 5 | Restores life to a creature just killed. Single use |
| Talisman | 10 | Wards off Zombies and Ghouls. On level 4+, also wards off Spectres |
| Strength Potion | 5 | +2 strength for one fight. Single use |
| Magic Staff | 15 | +1 magical power for Priest, +2 for Wizard. Protects Wizard from Medusa |
| The Ring | 30 | +1 to all die rolls. Bearer invincible on level 4+ |
| Lost Ruby | 20 | Guarded by a statue (strength 8). Must defeat statue to take it |
| Charmed Flute | 10 | Lulls Dragons and Vipers to sleep. Opens secret doors |
| Eye of God | 0 | Destroys Spectres and Zombies. Renders all magic powerless. Curse if dropped |
| Treasure Chest | 0 | Roll a die to open (see below) |

### Treasure Chest

When opened, roll a die:

| Roll | Result | Points |
|------|--------|--------|
| 1 | A Curse | 0 |
| 2 | A Spectre attacks | 0 |
| 3 | Sand (worthless) | 0 |
| 4 | Silver | 20 |
| 5 | Gold | 40 |
| 6 | Gems | 80 |

The chest is consumed after opening.

## Creatures

### Starting Creatures

| Type | Fight | Magic | Carry | Cost | Points | Special |
|------|-------|-------|-------|------|--------|---------|
| Hero | 5 | — | 75 kg | 6 | 10 | +1 to die when testing strangers |
| Woman-Hero | 4 | — | 50 kg | 5 | 10 | Abilities of Woman and Hero |
| Ogre | 5 | — | 100 kg | 5 | 5 | Inhuman |
| Troll | 4 | — | 75 kg | 4 | 4 | Inhuman |
| Priest | 2 | 2 | 25 kg | 4 | 8 | Can use magical power in background |
| Man | 3 | — | 50 kg | 3 | 5 | |
| Woman | 2 | — | 25 kg | 2 | 5 | Befriends Unicorn |
| Dwarf | 1 | — | 25 kg | 1 | 2 | Guides past Traps |

### Cave Creatures

| Type | Fight | Magic | Carry | Points | Reaction |
|------|-------|-------|-------|--------|----------|
| Wizard | 2 | 5 | — | 15 | 1:Hostile, 2-5:Indiff, 6:Friendly |
| Spectre | — | 5 | — | — | 1-5:Hostile, 6:Indiff |
| Dragon | 6 | — | — | — | Always hostile |
| Sorcerer | 4 | 9 | — | — | Always hostile |
| Ogre | 5 | — | 100 kg | 5 | 1-4:Hostile, 5:Indiff, 6:Friendly |
| Troll | 4 | — | 75 kg | 4 | 1-3:Hostile, 4:Indiff, 5-6:Friendly |
| Unicorn | — | 4 | — | 4 | Friendly to Women, else Indiff |
| Giant | 7 | — | 150 kg | 7 | 1-3:Hostile, 4-5:Indiff, 6:Friendly |
| Woman-Hero | 4 | — | 50 kg | 10 | 1-3:Hostile, 4-6:Friendly |

## Scoring

When your party escapes the Cave:
- Points for each creature in your party
- Points for each treasure carried out
- Dragon-slayers: creature's points doubled
- Sorcerer killed: +30 bonus
- Each curse: -30 penalty
- Minimum score: 0

## Controls Reference

| Key | Context | Action |
|-----|---------|--------|
| N/E/S/W | Exploration | Move in compass direction |
| U/D | Exploration | Use stairs up/down |
| I | Exploration | Inventory |
| A | Exploration | Use artifact |
| X | Exploration | Exit cave (level 1, stair up) |
| ? | Exploration | Help |
| ←/→ | Menus | Browse items/creatures |
| EXE | Universal | Confirm / Continue |
| W/A/T | Encounter | Withdraw / Attack / Test |
| F/R | Combat | Fight on / Retreat |
| R | Inventory | Redistribute treasure |

---

# Implementation Details

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
| 260-290 | Decode area, build exit string, display actions |
| 300-410 | Input: map keys to directions, I/A/?/X handlers |
| 430-495 | Validate exit, execute move, increment turn |

### Setup (510-707)

| Lines | Purpose |
|-------|---------|
| 510-560 | Setup dispatch and game state init |
| 610-707 | Pre-splash, title, loading message |
| 710-947 | Party selection and confirmation |
| 862-888 | Deck initialization and shuffle |
| 955-990 | Map init with GATEWAY |

### Movement (1010-1490)

| Lines | Purpose |
|-------|---------|
| 1010-1142 | Direction calc, find existing area, dead-end check |
| 1155-1166 | Stair handling with level 1 exit check |
| 1180-1398 | Draw new card, match exits, place, trigger events |
| 1410-1490 | Dead end display |

### Chamber & Hazards (2010-2930)

| Lines | Purpose |
|-------|---------|
| 2010-2260 | Chamber entry: draw cards, categorize, dispatch |
| 2510-2710 | Hazard dispatch loop |
| 2720-2734 | Mutiny |
| 2740-2768 | Trap (fall to deeper level) |
| 2770-2774 | Earthquake |
| 2780-2795 | Medusa (stone on 1-2) |
| 2830-2848 | Ghouls (fight str 2) |
| 2860-2899 | Treasure pickup |
| 2900-2930 | Dead creature removal |

### Strangers (3010-3750)

| Lines | Purpose |
|-------|---------|
| 3010-3150 | Display strangers, identify leader, options |
| 3200-3230 | Withdraw |
| 3300 | Attack (triggers combat with surprise) |
| 3400-3594 | Test reaction, friendly/hostile/indifferent |
| 3600-3750 | Hostile and indifferent handlers |

### Combat (4010-4540)

| Lines | Purpose |
|-------|---------|
| 4010-4068 | Round setup, matching, die rolls, casualties |
| 4080-4094 | Fight/retreat choice |
| 4200-4304 | Victory, retreat handlers |
| 4500-4540 | Strongest enemy lookup |

### Special Areas (5010-5250)

| Lines | Purpose |
|-------|---------|
| 5010-5080 | Viper Pit crossing |
| 5210-5250 | Deep Pool crossing |

### Artifacts (6010-6242)

| Lines | Purpose |
|-------|---------|
| 6010-6034 | Artifact menu |
| 6110-6124 | Healing Balm |
| 6210-6242 | Treasure Chest |

### UI & Score (7010-7995)

| Lines | Purpose |
|-------|---------|
| 7010-7060 | End game display |
| 7110-7230 | Score calculation |
| 7510-7610 | Status display |
| 7621-7699 | Inventory and redistribution |
| 7810-7860 | Help |
| 7910-7995 | Exit cave confirmation |

## Arrays

| Array | Elements | Purpose |
|-------|----------|---------|
| AK(60) | 61 | Area card encoded values |
| CD(13) | 14 | Creature data (packed) |
| CN$(13) | 14 | Creature names |
| CS(7) | 8 | Starting creature counts |
| CA(7) | 8 | Working counts (selection) |
| MP(60) | 61 | Map: card value at each position |
| ML(60) | 61 | Map: packed coords (Level×10000 + Y×100 + X) |
| MS(60) | 61 | Map: stair links |
| LP(59) | 60 | Large pack (shuffled) |
| SP(51) | 52 | Small pack (shuffled) |
| PC(8) | 9 | Party: creature type |
| PS(8) | 9 | Party: status (0=orig, 1=ally, 2=stone, 3=dead) |
| PK(8) | 9 | Party: dragon-slayer kills |
| PT(8) | 9 | Party: treasure slot 1 |
| PU(8) | 9 | Party: treasure slot 2 |
| DC(5) | 6 | Drawn cards (current chamber) |

## Creature Data Encoding

`CD = FS×100000 + MP×10000 + CW×1000 + SV×100 + PT`

Decode with GOSUB 9220 → CF, CM, CW, CV, CP.

## Key Variables

| Var | Purpose |
|-----|---------|
| GS | Game state: 0=playing, 1=escaped, 2=dead |
| TN | Turn number |
| NC | Curse count |
| SK | Sorcerer killed flag |
| SC | Final score |
| PA | Current area index |
| PL | Current level |
| NP | Party size |
| NM | Areas placed |
| LI/SI | Pack draw positions |
| SU | Surprise (+1=party, -1=strangers) |
| RD | Combat round |

## References

- Original rules: `reference/sorcerers-cave/sorcerers-cave-rules.md`
- Rules analysis: `docs/plans/sorcerers-cave/requirement-1-rules-analysis.md`
- Architecture: `docs/plans/sorcerers-cave/requirement-2-high-level-architecture.md`
- Data structures: `docs/plans/sorcerers-cave/requirement-3-4-data-structures.md`
- UI design: `docs/plans/sorcerers-cave/requirement-5-6-phases-and-ui.md`
- Area card encoding: `reference/sorcerers-cave/area-card-encoding.md`
