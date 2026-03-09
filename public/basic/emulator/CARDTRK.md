# 3-Pile Card Trick

A classic three-pile card trick ported from the Sharp PC-1600 version by Alvin Banderas. Converted to Casio BASIC for the FX-870P / VX-4.

## How to Play

1. Think of a card (any of the 36 cards: suits with ranks 6-10, J, Q, K, A)
2. The computer shuffles and deals cards three at a time into three columns
3. After each group of three, press any key to see the next group
4. When all 12 groups have been shown, tell the computer which column (1, 2, or 3) contained your card
5. This process repeats for **three rounds** total
6. After the third round, the computer reveals your card

```
RD 1 DEAL 7 /12       Round and deal counter
(1)    (2)    (3)      Column headers
7                Q     Cards (rank + suit symbol)
  ANY KEY=NEXT         Press any key to continue
```

### Controls

| Key | Action |
|-----|--------|
| ![1](../../../images/keys/standard/1.png) | Select column 1 |
| ![2](../../../images/keys/standard/2.png) | Select column 2 |
| ![3](../../../images/keys/standard/3.png) | Select column 3 |
| Any key | Advance to next deal |

## Why It Works

Each time you identify the pile containing your card, it is placed in the middle of the deck. After three such moves, the card converges to exactly the 18th position out of 36, which the computer then reveals.

## The Deck

36 cards: four suits, each with ranks 6, 7, 8, 9, 10, J, Q, K, A. This is the same subset used in many European card games (e.g., German Skat).

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Press any key to start, then follow the on-screen prompts

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen
Lines 20-25     Initialisation: arrays, rank lookup string
Lines 30-50     Fisher-Yates shuffle of 36 cards
Lines 55-175    Main game loop (3 rounds)
  Lines 60-120    Deal 12 groups of 3 cards into columns
  Lines 125-145   Ask which column contains the card
  Lines 150-165   Swap chosen pile with middle pile
  Line 170        Rebuild deck from piles
Lines 180-215   Reveal the card at position 18
```

## About

The original program was written for the Sharp PC-1600 by Alvin Banderas, ported and fixed from a German version. This Casio FX-870P conversion replaces the Sharp's graphical suit display (GPRINT bitmaps) with the FX-870P's built-in suit characters, and adapts all Sharp-specific BASIC syntax (RANDOM/RND, INKEY$, CURSOR, labeled DATA) to Casio equivalents. The shuffle algorithm was replaced with a proper Fisher-Yates shuffle, and pile management uses numeric arrays instead of string manipulation.