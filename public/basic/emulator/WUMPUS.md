# Hunt the Wumpus

The classic cave adventure for the FX-870P / VX-4, written by Claude (Anthropic). Navigate a network of 20 caves, avoid hazards, and slay the Wumpus with your crooked arrows.

## How to Play

You are in a cave system shaped like a dodecahedron — 20 rooms, each connected to exactly 3 others. Somewhere in the caves lurks the fearsome Wumpus. Your mission: find and shoot it before it finds you.

### Main Screen

```
ROOM 5  ARROWS: 3       Your location and remaining arrows
EXITS: 1  4  6          Three connected rooms
WUMPUS! DRAFT!          Warnings (if any)
M)OVE  S)HOOT           Commands
```

### Warnings

When adjacent to a hazard, you'll see a warning on line 3:

| Warning | Meaning |
|---------|---------|
| **WUMPUS!** | The Wumpus is in an adjacent room |
| **DRAFT!** | A bottomless pit is in an adjacent room |
| **BATS!** | Super bats are in an adjacent room |

Multiple warnings can appear at once (e.g. `WUMPUS! DRAFT!`).

### Moving

Press ![M](../../../images/keys/standard/m.png) to move, then press ![1](../../../images/keys/standard/1.png), ![2](../../../images/keys/standard/2.png), or ![3](../../../images/keys/standard/3.png) to choose which exit to take.

```
MOVE TO WHICH EXIT?
1) 1  2) 4  3) 6
```

### Shooting

Press ![S](../../../images/keys/standard/s.png) to shoot an arrow into one of the three exits. The arrow enters that room and then bounces randomly through 2 more connected rooms. If it hits the Wumpus at any point, you win!

```
SHOOT WHICH EXIT?
1) 1  2) 4  3) 6
ARROWS LEFT: 5
```

You have **5 arrows** for the entire game — use them wisely.

## Hazards

### The Wumpus

The Wumpus is too heavy for bats and has sucker feet to avoid pits. If you walk into its room, you bump it awake:
- **75% chance** it runs to an adjacent room (you survive)
- **25% chance** it eats you (game over)

After a missed shot, the Wumpus always moves to a random adjacent room. If it moves to yours — game over.

### Bottomless Pits (2)

Walk into a pit room and you fall to your doom. No second chances.

### Super Bats (2)

Walk into a bat room and they grab you, carrying you to a random room in the cave system. You then face whatever hazards are in your new location.

## Game Over

The game ends when:
- You shoot the Wumpus (you win!)
- The Wumpus eats you (bumped it or it moved to you)
- You fall in a pit
- Your own arrow comes back and hits you
- You run out of arrows

Press any key after the result to start a new game with a fresh random layout.

## Strategy Tips

- **Map the caves** — the dodecahedron layout is fixed, so track which rooms connect where
- **Use warnings** — if you smell the Wumpus, it's in one of your 3 exits; shoot carefully
- **Save arrows** — with only 5 shots and 20 rooms, don't shoot blind
- **Avoid bats** — being dropped randomly can land you in a pit or on the Wumpus
- **Remember the layout** — rooms 1-20 always have the same connections every game

## The Cave Map

The 20 rooms form a dodecahedron (like a 12-sided die):

```
Room  1: 2, 5, 8        Room 11: 10, 12, 19
Room  2: 1, 3, 10       Room 12: 3, 11, 13
Room  3: 2, 4, 12       Room 13: 12, 14, 20
Room  4: 3, 5, 14       Room 14: 4, 13, 15
Room  5: 1, 4, 6        Room 15: 6, 14, 16
Room  6: 5, 7, 15       Room 16: 15, 17, 20
Room  7: 6, 8, 17       Room 17: 7, 16, 18
Room  8: 1, 7, 9        Room 18: 9, 17, 19
Room  9: 8, 10, 18      Room 19: 11, 18, 20
Room 10: 2, 9, 11       Room 20: 13, 16, 19
```

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Press any key to start exploring

**TURBO mode recommended** for instant screen redraws.

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen
Lines 20-32     Initialisation: read cave map, place hazards randomly
Lines 100-153   Main display: room info, warnings, M/S input
Lines 200-270   Move: pick exit, check hazards at new room
Lines 300-324   Shoot: pick exit, arrow bounces through 3 rooms
Lines 500-506   Super bat encounter: carried to random room
Lines 600-603   Death: Wumpus eats you
Lines 610-613   Death: fell in pit
Lines 620-623   Win: arrow hit the Wumpus
Lines 630-633   Death: arrow came back to you
Lines 640-643   Death: out of arrows
Lines 650-653   Death: Wumpus moved to your room
Lines 660-663   Play again prompt
Lines 700-720   Data: dodecahedron cave connections
```
