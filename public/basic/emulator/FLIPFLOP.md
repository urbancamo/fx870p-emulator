# Flip Flop

A puzzle game adapted from "101 BASIC Computer Games" (1973) by David Ahl, originally created by Michael Kass. Converted to Casio BASIC for the FX-870P / VX-4.

## How to Play

You are presented with 10 positions, each showing **X** or **O**. All start as **X**. Your goal is to turn them all into **O**.

```
X X X X X X X X X X    The 10 positions
1 2 3 4 5 6 7 8 9 0    Position labels (0 = 10th)
MOVES: 3                Move counter
1-9,0=10TH R=RST        Input prompt
```

### Controls

- **1**–**9**: Flip position 1 through 9
- **0**: Flip position 10
- **R**: Reset and start a new puzzle

### The Twist

Each position you pick always flips itself, but **some positions also flip a second position**. Which positions are linked changes with each new game. Part of the puzzle is figuring out the hidden connections.

For example, picking **3** might flip both position 3 and position 7. Picking **5** might only flip position 5. You need to discover the pattern and work out the right sequence of moves.

## Scoring

| Moves | Rating |
|-------|--------|
| 15 or fewer | Excellent! |
| More than 15 | Try fewer next time |

## Strategy Tips

- **Experiment first** — pick each number once to discover which positions are linked
- **Look for singles** — positions that only flip themselves are the easiest to control
- **Work backwards** — once you've found the links, plan your moves to avoid undoing progress
- **Some puzzles are easier than others** — the random links mean each game has a different difficulty

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Press any key to start

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen
Lines 20-31     Initialisation: arrays, random link table
Lines 100-108   Display: build X/O string, show positions and moves
Lines 120-129   Input: single keypress, handle reset
Lines 130-155   Flip logic: toggle position N, then linked position B(N)
Lines 200-220   Win check: verify all positions are O
Lines 250-270   Win screen and play again
```

## About

The original "Flip Flop" appeared in David Ahl's *101 BASIC Computer Games* (1973), one of the first computer game books ever published. The original used complex trigonometric formulas to determine secondary flips. This version uses a randomized link table generated at the start of each game, making every puzzle unique while keeping the core mechanic intact.
