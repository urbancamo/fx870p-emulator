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

## Strategy Guide

### Party Selection

Your 6 selection points are the most important decision in the game. Here are some proven combinations:

**Solo (1 creature)**
- **Hero (6)** — fighting strength 5, charisma bonus (+1 when testing strangers), 75 kg carry. High risk but high reward. One bad fight ends the game.

**Pairs (2 creatures)**
- **Ogre + Dwarf (5+1=6)** — strong fighter (5) with trap protection. Ogre carries 100 kg. But inhuman creatures can't use most artifacts.
- **Troll + Woman (4+2=6)** — good fighter (4) with 75 kg carry, plus the Woman befriends Unicorns.
- **Priest + Woman (4+2=6)** — magical power (2) handles Spectres, Woman befriends Unicorns. Weak in combat but the Priest is worth 8 points.
- **Troll + Dwarf (4+1=5)** — strong fighter with trap protection. One point unspent.
- **Man + Man (3+3=6)** — redundancy: if one falls, the other continues. Combined 100 kg carry.
- **Man + Woman + Dwarf (3+2+1=6)** — three creatures give numbers advantage in combat and trap protection.

**Trios (3 creatures)**
- **Troll + Dwarf + Dwarf (4+1+1=6)** — strong fighter with double trap protection. Invaluable on deeper levels.
- **Man + Dwarf + Dwarf (3+1+1=5)** — one point unspent but good trap safety.
- **Woman + Woman + Woman (2+2+2=6)** — three Unicorn-befrienders with combined 75 kg carry. Weak individually but strength in numbers.

**Large parties**
- **Dwarf × 6 (1+1+1+1+1+1=6)** — maximum trap protection and combat matchups. Each Dwarf is weak (strength 1) but six of them can overwhelm most enemies. Very low carry capacity (150 kg total).

### Party Size

Larger parties have advantages:
- **Redundancy** — losing one creature isn't fatal
- **More carrying capacity** — more treasure brought out
- **Better combat matchups** — can outnumber enemies

But smaller parties have their own strengths:
- **Higher individual strength** — the Hero at strength 5 beats most enemies
- **Charisma bonus** — only available with the Hero
- **Fewer casualties** from Medusa and Ghouls (fewer die rolls)

A party of 2-3 creatures is usually the sweet spot.

### Combat Tactics

- **Test before attacking** — approaching strangers gives a chance to recruit them. A friendly Wizard (magical power 5) or Giant (fighting strength 7) is a game-changing ally.
- **But beware** — if strangers are hostile on approach, *they* get surprise, not you. Attacking first gives *you* surprise (+1 to all your rolls in round 1).
- **Know when to retreat** — if you lose a round, you can retreat before more creatures die. Treasure dropped in combat is lost, so redistribute valuable items before picking fights.
- **The Magic Sword is crucial** — it adds +2 to a Hero's strength (making them effectively strength 7) and is the only way for non-magical creatures to fight Spectres.
- **Priests and Wizards** — their total strength (fighting + magical) is used in combat. A Wizard fights at strength 7 (2+5), making them formidable.

### When to Exit

The hardest decision is knowing when to leave:

- **Exit early** if your party is weakened — a dead party scores 0. A live party with modest treasure still scores something.
- **Each curse costs 30 points** — if you've accumulated curses, the penalty may exceed the value of further exploration. Two curses (-60 points) wipes out most treasure gains.
- **Deeper levels are riskier but richer** — level 3+ chambers draw 3-4 cards, meaning more treasure but also more enemies and hazards.
- **Watch your stairways** — you need a path back to level 1 with an upward stairway. If an earthquake destroys your route, you may be trapped.
- **The Sorcerer bonus (+30)** is tempting but dangerous — he fights at strength 13 (4 fighting + 9 magical) and is always hostile. Only attempt with a strong, well-equipped party.

### Treasure Priorities

- **The Ring (30 pts)** — the most valuable single item, and its +1 to all die rolls makes everything easier.
- **Gems (20 pts, 25 kg)** — best points-per-weight ratio for heavy treasure.
- **Priests (8 pts)** and **Wizards (15 pts)** — friendly creatures are worth more than most treasure. Recruit them when possible.
- **The Magic Sword (15 pts)** and **Magic Staff (15 pts)** — valuable and useful. Keep these.
- **Charmed Flute (10 pts)** — essential if you encounter the Viper Pit. Also opens secret doors.
- **Silver (5 pts, 25 kg)** — low value for its weight. Only take it if you have spare carrying capacity.

## Controls Reference

### Exploration

| Key | Action |
|-----|--------|
| ![N](/fx870p-emulator/images/keys/standard/n.png) ![E](/fx870p-emulator/images/keys/standard/e.png) ![S](/fx870p-emulator/images/keys/standard/s.png) ![W](/fx870p-emulator/images/keys/standard/w.png) | Move North / East / South / West |
| ![U](/fx870p-emulator/images/keys/standard/u.png) ![D](/fx870p-emulator/images/keys/standard/d.png) | Use stairs Up / Down |
| ![I](/fx870p-emulator/images/keys/standard/i.png) | Inventory — view party and carried items |
| ![A](/fx870p-emulator/images/keys/standard/a.png) | Artifact menu — use carried artifacts |
| ![X](/fx870p-emulator/images/keys/standard/x.png) | Exit cave (level 1 stair up only) |
| ![?](/fx870p-emulator/images/keys/standard/divide.png) | Help screen |

### Menus & Selection

| Key | Action |
|-----|--------|
| ![←](/fx870p-emulator/images/keys/standard/left.png) ![→](/fx870p-emulator/images/keys/standard/right.png) | Browse items / creatures |
| ![EXE](/fx870p-emulator/images/keys/standard/exe.png) | Confirm / Continue |
| ![0](/fx870p-emulator/images/keys/standard/0.png) | Done selecting (party setup) |
| ![BS](/fx870p-emulator/images/keys/standard/bs.png) | Redo selection |

### Stranger Encounters

| Key | Action |
|-----|--------|
| ![W](/fx870p-emulator/images/keys/standard/w.png) | Withdraw from chamber |
| ![A](/fx870p-emulator/images/keys/standard/a.png) | Attack strangers |
| ![T](/fx870p-emulator/images/keys/standard/t.png) | Test stranger reaction |

### Combat

| Key | Action |
|-----|--------|
| ![F](/fx870p-emulator/images/keys/standard/f.png) | Fight another round |
| ![R](/fx870p-emulator/images/keys/standard/r.png) | Retreat from fight |

### Inventory

| Key | Action |
|-----|--------|
| ![R](/fx870p-emulator/images/keys/standard/r.png) | Redistribute treasure between creatures |
| ![1](/fx870p-emulator/images/keys/standard/1.png) ![2](/fx870p-emulator/images/keys/standard/2.png) | Select item slot 1 or 2 |
| ![D](/fx870p-emulator/images/keys/standard/d.png) | Drop item |

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

## Deep Dive: Fitting a Board Game into 32KB

The Casio VX-4 has approximately 32KB of usable RAM, shared between the BASIC program text, DATA statements, variables, arrays, the GOSUB/FOR stack, string workspace, and I/O buffers. Implementing a game with 61 area cards, 52 chamber cards, 14 creature types, 15 treasure types, 5 hazards, a multi-level map, a party of up to 9 creatures each carrying treasure, and a full combat system required aggressive memory optimisation at every level.

### The CLEAR Problem

The VX-4's `CLEAR` command takes two parameters: `CLEAR variable_area, work_area`. The variable area stores numeric arrays and variable name tables. The work area contains the variable area *within it*, plus the GOSUB/FOR stack (growing downward from the top), I/O buffers, and string workspace. Crucially, the work area must be **larger** than the variable area — if they're equal, there's zero space for the stack and the program crashes with OM errors on the first GOSUB.

The game requires `CLEAR 11000,17000` — 11KB for variables and arrays, 17KB total work area, leaving 6KB for the stack and string operations. Finding these numbers required iterative testing; too small and the game crashes mid-play when arrays are full and the GOSUB stack is deep.

### Bit-Packed Area Cards

The original board game has 61 area cards, each with up to 4 compass exits, an optional chamber flag, optional stairs up/down, and a special type (Gateway, Deep Pool, Viper Pit, Tomb of Kings, Great Hall). Naively, this would require 8 properties per card × 61 cards = 488 array elements.

Instead, each card is encoded as a single integer using bit packing:

```
Bit 0:    North exit (1)
Bit 1:    East exit  (2)
Bit 2:    South exit (4)
Bit 3:    West exit  (8)
Bit 4:    Chamber    (16)
Bit 5:    Stair up   (32)
Bit 6:    Stair down (64)
Bits 7-9: Special type (×128: 1=Gateway, 2=Deep Pool, 3=Viper Pit, 4=Tomb, 5=Great Hall)
```

The GATEWAY card (`NSEWU`, special type 1) encodes as: 1+2+4+8+32+128 = **175**. A simple chamber with north and south exits (`NSC`) encodes as: 1+4+16 = **21**.

This reduces 61 cards to a single `DIM AK(60)` array — 61 elements instead of 488. Decoding uses bitwise AND:

```basic
AN = AC AND 1          : REM North exit
AE = (AC AND 2) / 2    : REM East exit
AZ = (AC AND 4) / 4    : REM South exit (AZ not AS — AS is a reserved word)
AW = (AC AND 8) / 8    : REM West exit
AH = (AC AND 16) / 16  : REM Is chamber
AU = (AC AND 32) / 32  : REM Stair up
AD = (AC AND 64) / 64  : REM Stair down
AT = INT((AC AND 896) / 128)  : REM Special type
```

Note the use of `AZ` for south instead of `AS` — the latter is a BASIC reserved word (`AS` is used in `OPEN ... AS #n`), which would cause a syntax error.

### Decimal-Packed Creature Stats

Each creature has 5 properties: fighting strength, magical power, carry capacity, selection value, and point value. Storing these in separate arrays would require 5 arrays × 14 creature types = 70 elements. Instead, all 5 values are packed into a single decimal number:

```
CD = FS×100000 + MP×10000 + CW×1000 + SV×100 + PT
```

For example, the HERO (fight=5, magic=0, carry=3 [×25=75kg], selection=6, points=10) encodes as: **503610**. A WIZARD (fight=2, magic=5, carry=0, selection=0, points=15) encodes as: **250015**.

The Casio's 13-digit BCD internal precision means a 6-digit packed value is decoded without rounding errors. The decode subroutine extracts each field using integer division:

```basic
CF = INT(W / 100000)
CM = INT((W - CF*100000) / 10000)
CW = INT((W - CF*100000 - CM*10000) / 1000)
CV = INT((W - CF*100000 - CM*10000 - CW*1000) / 100)
CP = W - CF*100000 - CM*10000 - CW*1000 - CV*100
```

This reduces 5 arrays to 1, saving ~320 bytes of variable area.

### Coordinate Encoding for Multi-Level Maps

The game's map can span many levels, each with areas at different x,y positions. Three separate arrays (MX, MY, ML for x-coordinate, y-coordinate, and level) would cost 3 × 61 elements = 183 elements. Instead, all three values are packed into a single number:

```
ML(i) = Level × 10000 + Y × 100 + X
```

With the origin at (50, 50), coordinates range from 0-99 on each axis, supporting maps up to 50 areas in any direction from the starting point. The level occupies the ten-thousands digit.

For example, the GATEWAY at level 1, position (50,50) encodes as: 1×10000 + 50×100 + 50 = **15050**. An area at level 3, position (48,52) encodes as: 3×10000 + 48×100 + 52 = **34852**.

Extracting coordinates uses integer division:

```basic
TL = INT(W / 10000)              : REM Level
TY = INT((W - TL*10000) / 100)   : REM Y coordinate
TX = W - TL*10000 - TY*100       : REM X coordinate
```

This eliminates two arrays, saving ~976 bytes.

### Pre-Built Small Pack

The small pack of 52 chamber cards (19 creatures, 15 heavy treasures, 12 artifacts, 6 hazards) could be built programmatically from count arrays at runtime. The original design used arrays for creature counts, treasure counts, and hazard counts, then looped through them to build the pack. This required 3 extra arrays and ~30 lines of code.

Instead, the 52 card values are pre-computed and stored directly as DATA statements:

```basic
8500 DATA 101,102,102,102,103,103
8510 DATA 104,104,104,108,108,108
...
8590 DATA 300,301,301,302,303,304
```

Each card is encoded as `type × 100 + index` (creatures=1xx, treasures=2xx, hazards=3xx). The pack is read with a single `RESTORE 8500` / `FOR-READ` loop, eliminating the count arrays entirely.

### Eliminating Redundant Arrays

The initial design used 31 arrays totalling ~7.8KB — more than the variable area could hold. Through systematic elimination:

| Optimisation | Arrays Removed | Bytes Saved |
|-------------|---------------|-------------|
| Pack 6 creature stat arrays → 1 | 5 | ~560 |
| Merge MX/MY/ML → 1 packed ML | 2 | ~976 |
| Eliminate MV (visited) array | 1 | ~488 |
| Eliminate treasure weight/count arrays | 3 | ~360 |
| Eliminate hazard count/name arrays | 2 | ~80 |
| Pre-built small pack (no count arrays) | 3 | ~200 |
| Reduce PT(12,4) → PT(8)+PU(8) | 1 (2D→2×1D) | ~360 |
| **Total** | **17** | **~3,024** |

The final design uses 16 arrays totalling ~3.6KB — less than half the original.

### Stripping Comments for Memory

Every REM line in a BASIC program consumes memory: 2 bytes for the line number, 2 bytes for the REM token, 1 byte per character, plus 1 byte overhead. A comment like `REM == DECODE AREA CARD ==` costs 30 bytes.

All comments were stripped from the program and moved to an external documentation file (this file), saving approximately 400 bytes. The documentation is maintained with line number references so it stays synchronised with the program.

### The GOSUB 9400 Pattern

Many screens end with `PRINT "[EXE] Continue";:GOSUB 9410` — printing the prompt and waiting for the EXE key. This 35-character pattern appeared 12+ times. Creating a two-line subroutine:

```basic
9400 PRINT "[EXE]";
9410 K$=INKEY$:IF K$="" THEN 9410
9420 IF K$<>CHR$(13) THEN 9410
9430 RETURN
```

Replaced each instance with `GOSUB 9400` (11 characters), saving ~24 bytes per call — roughly 200 bytes total.

### Variable Name Collisions

In Casio BASIC, all variables are global and there are no local scopes. With dozens of subroutines sharing the same variable space, name collisions are a constant risk. Two critical bugs were caused by this:

1. **NC collision** — `NC` was used for both the curse count (initialised to 0 at game start) and the newly-drawn area card value. After drawing any area card, `NC` would be set to something like 175, and combat would subtract 175 from the player's die rolls, producing wildly negative scores. Fixed by renaming the card variable to `NW`.

2. **AS reserved word** — `AS` is a BASIC reserved word (used in `OPEN ... FOR INPUT AS #1`). Using it as the "south exit" variable caused syntax errors. Renamed to `AZ`.

### DATA Statement Sequencing

Casio BASIC's `READ` command reads DATA statements sequentially across the entire program. The DATA pointer advances globally — if subroutine A reads 61 values and subroutine B reads 14 values, B picks up where A left off, regardless of which DATA line B's values are on.

This caused a subtle bug: creature names (strings) were followed by the pre-built small pack (numbers), which were followed by starting creature counts (numbers). After reading 14 creature names, the DATA pointer landed on the small pack numbers, causing the starting counts to read card values instead of counts.

The fix was to use `RESTORE line_number` to explicitly reset the DATA pointer before each independent read sequence:

```basic
8650 RESTORE 8660
8655 FOR I=0 TO 7:READ CS(I):NEXT I
8660 DATA 1,1,3,3,3,6,3,3
```

### FOR Inside IF THEN

Casio BASIC evaluates `IF condition THEN statement` by skipping the statement if the condition is false. But if the statement is a `FOR` loop, the corresponding `NEXT` on the following line is *not* inside the IF — it always executes. When the condition is false, `FOR` is skipped but `NEXT` runs, causing an "FO error" (FOR without NEXT).

```basic
' BROKEN:
3430 IF R>1 THEN FOR I=0 TO NP-1:IF PC(I)=0 THEN R=R+1
3440 NEXT I   ← runs even when R<=1, causing FO error

' FIXED:
3430 FOR I=0 TO NP-1:IF R>1 AND PC(I)=0 THEN R=R+1
3440 NEXT I   ← FOR always runs, condition is inside the loop
```

### Dead-End Card Persistence

In the board game, a dead-end card is placed face-down — it exists on the map but can't be entered from the direction that revealed it. The initial implementation placed dead-end cards in the map arrays but didn't prevent re-entry. Moving in the same direction again would find the existing card and teleport the party into it.

The fix checks the found card's exits: if it doesn't have an exit facing back toward the player (the opposite direction), movement is blocked:

```basic
1130 AC=MP(FA):GOSUB 9110      : REM Decode found area
1134 IF DR=1 AND AZ>0 THEN OK=1 : REM Going N, need S exit on target
1136 IF DR=2 AND AW>0 THEN OK=1 : REM Going E, need W exit
1138 IF DR=3 AND AN>0 THEN OK=1 : REM Going S, need N exit
1139 IF DR=4 AND AE>0 THEN OK=1 : REM Going W, need E exit
1140 IF OK=0 THEN PRINT "Dead end.":RETURN
```

### Bidirectional Stair Links

Stair connections between levels are stored in `MS()` — when area A connects to area B via stairs, both `MS(A)=B` and `MS(B)=A` are set. This bidirectional link caused a bug: going "down" from level 2 would follow MS() back to level 1 instead of drawing a new card for level 3.

The fix checks the linked area's level before following the link:

```basic
1164 IF DR=5 AND W<PL THEN PA=FA:PL=W:RETURN  : REM Up: only if target is shallower
1166 IF DR=6 AND W>PL THEN PA=FA:PL=W:RETURN  : REM Down: only if target is deeper
' Falls through to draw new card if link goes wrong way
```
