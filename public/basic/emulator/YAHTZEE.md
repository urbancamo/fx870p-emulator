# Yahtzee

The classic dice game for the FX-870P / VX-4, written by Claude (Anthropic). Play all 13 rounds, score in each category once, and aim for the highest total.

## How to Play

Each of the 13 rounds has two phases:

### Rolling Phase

Five dice are rolled automatically. You get up to 3 rolls per round.

```
3  1  5  2  6           Dice values
-  K  -  K  -           Keep markers
ROLL 2/3  RND 1/13      Roll and round count
1-5)KEEP R)OLL S)CORE   Commands
```

- ![1](../../../images/keys/standard/1.png)-![5](../../../images/keys/standard/5.png): Toggle keep/release for that die position
- ![R](../../../images/keys/standard/r.png): Re-roll all non-kept dice (up to 3 rolls total)
- ![S](../../../images/keys/standard/s.png): Stop rolling and choose a scoring category

After the 3rd roll, you must score.

### Scoring Phase

Browse available categories and see what each would score with your current dice:

```
DICE: 3 3 5 2 6
> 3-KIND = 19 PTS
N)EXT  S)ELECT
ROUND 1/13
```

- ![N](../../../images/keys/standard/n.png): Cycle to the next available (unscored) category
- ![S](../../../images/keys/standard/s.png): Lock in the displayed score

You can score 0 in any category — sometimes it's strategic to "burn" a bad category.

## Scoring Categories

### Upper Section (categories 1-6)

| Category | Score |
|----------|-------|
| **ONES** | Sum of all 1s |
| **TWOS** | Sum of all 2s |
| **THREES** | Sum of all 3s |
| **FOURS** | Sum of all 4s |
| **FIVES** | Sum of all 5s |
| **SIXES** | Sum of all 6s |

**Upper Bonus**: If your upper section total is 63 or more (averaging 3 of each number), you earn a **+35 bonus**.

### Lower Section (categories 7-13)

| Category | Score | Requirement |
|----------|-------|-------------|
| **3-KIND** | Sum of all dice | Three or more of the same value |
| **4-KIND** | Sum of all dice | Four or more of the same value |
| **F.HOUSE** | 25 | Three of one value + two of another |
| **SM.STR** | 30 | Four consecutive values (e.g. 2-3-4-5) |
| **LG.STR** | 40 | Five consecutive values (1-2-3-4-5 or 2-3-4-5-6) |
| **YAHTZEE** | 50 | All five dice the same |
| **CHANCE** | Sum of all dice | Any combination (no requirement) |

## Game Over

After all 13 rounds, the final score is displayed:

```
GAME OVER! TOTAL:205
UPPER:42 BONUS:35
LOWER:128
ANY KEY=PLAY AGAIN
```

Press any key to start a new game.

## Strategy Tips

- **Aim for the upper bonus** (63+) early — it's worth 35 free points
- **Keep straights in progress** — they're hard to get but worth a lot
- **Yahtzee is rare** — don't chase it unless you have 3+ of a kind already
- **Chance is your safety net** — use it for a high total when nothing else fits
- **Burn weak categories** — score 0 in ONES or TWOS early if you have a bad roll

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Press any key to start

**TURBO mode recommended:** While the game is playable at normal speed, TURBO makes the screen redraws instant for a smoother experience.

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen
Lines 20-22     Initialisation (arrays, scores set to -1)
Lines 25-33     New round: reset keeps, roll dice
Lines 100-165   Roll phase: display dice/keeps, handle input
Lines 200-225   Score selection: browse categories
Lines 300-364   Score calculation for each category
Lines 400-403   Record score, advance to next round
Lines 450-461   Game over: totals, bonus, final score
Lines 700-703   Subroutine: count dice values into CT()
Lines 900-913   Subroutine: category name lookup
```
