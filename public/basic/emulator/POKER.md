# Draw Poker

A five-card draw poker game adapted from "101 BASIC Computer Games" (1973) by David Ahl. Converted to Casio BASIC for the FX-870P / VX-4.

## How to Play

You play heads-up draw poker against the computer. Each player starts with **$200** and antes **$5** per hand.

### Display

```
2♠ 7♥ J♦ K♣ A♥         Your five cards
1  2  3  4  5           Card positions
POT:$10 YOU:$195        Money info
I BET $7. MATCH? _      Action prompt
```

Cards are shown as rank + suit symbol (e.g. `A♠` = Ace of Spades).

### Game Flow

1. **Ante** — $5 from each player goes into the pot
2. **Computer bets first** — it may check (bet $0) or open with a bet
3. **You respond** — match the bet (![Y](../../../images/keys/standard/y.png)/![N](../../../images/keys/standard/n.png)) or place your own bet if CPU checked
4. **Draw phase** — discard up to 3 cards to improve your hand
5. **You bet after draw** — place a final bet
6. **Showdown** — both hands revealed, best hand wins the pot

### Controls

| Key                                       | Action                                            |
|-------------------------------------------|---------------------------------------------------|
| ![Y](../../../images/keys/standard/y.png) | Yes — match a bet                                 |
| ![N](../../../images/keys/standard/n.png) | No — decline a bet                                |
| ![0](../../../images/keys/standard/0.png)-![9](../../../images/keys/standard/9.png) | Bet amount (multiplied by $5, so 3 = $15) |
| ![F](../../../images/keys/standard/f.png) | Fold (forfeit the pot)                            |
| ![1](../../../images/keys/standard/1.png)-![5](../../../images/keys/standard/5.png) | Select card position to discard during draw phase |
| ![D](../../../images/keys/standard/d.png) | Done discarding                                   |

### Hand Rankings (lowest to highest)

| Rank | Hand |
|------|------|
| 9 | High Card |
| 11 | One Pair |
| 12 | Two Pair |
| 13 | Three of a Kind |
| 14 | Straight |
| 15 | Flush |
| 16 | Full House |
| 17 | Four of a Kind |
| 20 | Straight Flush |

### Card Notation

| Symbol | Rank |
|--------|------|
| 2–9 | Number cards |
| T | Ten |
| J | Jack |
| Q | Queen |
| K | King |
| A | Ace |

Suits use the calculator's built-in suit characters: ♠ ♥ ♦ ♣

## Strategy Tips

- **Fold weak hands early** — don't chase bad cards
- **Watch CPU draw count** — if it draws 0-1 cards, it likely has a strong hand
- **Bluff occasionally** — bet big with nothing to keep the CPU guessing
- **Manage your bankroll** — small consistent bets outlast big gambles

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Press any key to start

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen
Lines 20-24     Initialisation: arrays, starting money
Lines 25-86     Pre-draw betting: CPU opens, player responds
Lines 100-122   Draw phase: player discards and gets new cards
Lines 140-180   Post-draw: CPU draws, player bets again
Lines 190-283   Showdown: reveal hands, compare, award pot
Lines 500-522   Display player hand (rank + suit symbols)
Lines 600-633   Hand evaluation (pairs through straight flush)
Lines 700-706   Deal unique card from deck
Lines 750-754   CPU discard logic (keep pairs, discard singles)
Lines 800-816   Print single card
Lines 900-906   Game over screen
```

## About

The original "Poker" appeared in David Ahl's *101 BASIC Computer Games* (1973). The original featured a sophisticated AI with bluffing, watch-selling, and complex hand evaluation across ~400 lines of DEC BASIC. This version preserves the core draw poker gameplay while adapting the interface for the 32×4 LCD display. The AI evaluates its hand strength and makes betting decisions accordingly, with some randomness to simulate bluffing.
