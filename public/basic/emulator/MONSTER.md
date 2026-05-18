# Monster Chase

A real-time number-guessing game ported to the FX-870P / VX-4 from the original Casio PB-700 version by Alvin Banderas (2026).

## How to Play

The computer picks a secret number between **1 and 20**. You (**H**) start at position 10 on the screen. A monster (**M**) starts at position 0 and is chasing you. Every wrong guess lets the monster gain ground — if it catches up, you're eaten.

```
M          H            Monster left, you on the right
GUESS(1-20)? 12         Type your guess and press EXE
TOO HIGH!               Hint after each wrong guess
```

### Controls

| Key                                                                                                                            | Action                 |
|--------------------------------------------------------------------------------------------------------------------------------|------------------------|
| ![1](../../../images/keys/standard/1.png)-![9](../../../images/keys/standard/9.png), ![0](../../../images/keys/standard/0.png) | Type your guess (1-20) |
| ![EXE](../../../images/keys/standard/exe.png)                                                                                  | Submit the guess       |

## The Chase

Each turn the figures move:

|                 | Start     | Per wrong guess |
|-----------------|-----------|-----------------|
| **Monster (M)** | column 0  | +2 columns      |
| **You (H)**     | column 10 | +1 column       |

The monster closes the 10-column gap by 1 per turn, so you have at most **10 wrong guesses** before it catches you. A binary-search strategy (start at 10, then halve the range) needs at most 5 guesses — well inside the danger window, but only if you don't waste turns.

## Outcomes

- **Win** — guess correctly: you sprint to safety at column 23, a beep sounds, and the game reports how many tries it took before starting a new round.
- **Lose** — monster reaches you: a `*` flashes at the monster's position with two beeps, then `MONSTER GOT YOU!` and the program stops.

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Type a guess from 1 to 20 and press **EXE**

## Program Structure

```
Lines 5-6       Title and origin comment
Line 10         Pick target, reset counter and positions
Line 20         Draw M and H at their current columns
Line 30         Prompt for a guess on the second LCD line
Lines 35-47     Score, move the chasers, print TOO LOW / TOO HIGH
Line 50         Pause, then check if monster caught the player
Line 60         Loop back for the next guess
Lines 100-115   Win sequence: sprint to safety, beep, report tries
Lines 200-215   Lose sequence: flash *, beep twice, STOP
Line 300        Busy-wait subroutine: FOR I=0 TO W*30:NEXT I
```

## About the Port

The original PB-700 listing used the `WAIT` command for timing (e.g. `WAIT 15`), but Casio JIS BASIC on the FX-870P / VX-4 has no `WAIT` or `PAUSE` keyword. This port replaces every wait with a call to a tiny busy-wait subroutine at line 300 that loops `FOR I=0 TO W*30:NEXT I`, with the caller setting `W` to the desired delay before each `GOSUB 300`. `RAN#` is used in place of the PB-700's `RND` for the random target.
