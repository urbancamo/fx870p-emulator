# Blackjack

A classic card game for the FX-870P / VX-4, written by Claude (Anthropic).

## How to Play

1. You and the dealer are each dealt two cards
2. The dealer's first card is hidden (`??`)
3. Press ![H](../../../images/keys/standard/h.png) to Hit (take another card) or ![S](../../../images/keys/standard/s.png) to Stand (keep your hand)
4. Try to get as close to 21 as possible without going over
5. After you stand, the dealer reveals and hits until reaching 17 or higher
6. Closest to 21 wins — going over 21 is a bust

## Card Values

| Card | Value |
|------|-------|
| 2-9  | Face value |
| T, J, Q, K | 10 |
| A    | 11 (reduced to 1 if hand would bust) |

Cards are displayed as: `A` (Ace), `2`-`9`, `T` (Ten), `J` (Jack), `Q` (Queen), `K` (King).

## Display Layout

```
D: ?? 7               Dealer (first card hidden)
U: A 5 = 16           Your hand and total
H)IT S)TAND            Options
```

After standing, the dealer's hidden card is revealed and the dealer draws until 17+.

## Rules

- **Blackjack**: A natural 21 with your first two cards (Ace + Ten/Face) beats everything except a dealer blackjack, which is a push
- **Bust**: Going over 21 — instant loss
- **Push**: Tied totals — nobody wins
- **Dealer stands on 17**: The dealer must hit on 16 or below, stand on 17 or above
- **Ace handling**: Aces automatically count as 11, but are reduced to 1 if the hand would bust
- **Auto-stand on 21**: If your hand reaches exactly 21 after hitting, the game automatically moves to the dealer's turn
- Cards are dealt randomly (with replacement) rather than from a finite deck

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Press any key to start, then ![H](../../../images/keys/standard/h.png) to hit or ![S](../../../images/keys/standard/s.png) to stand
5. After each hand, press any key to play again

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen
Lines 20-35     Initialisation, deal 2 cards each
Lines 100-160   Player turn: display and hit/stand loop
Lines 200-235   Dealer turn: reveal and hit until 17+
Lines 300-355   Result: compare hands, announce winner
Lines 400-410   Play again prompt
Lines 800-830   Subroutine: card number to display name
Lines 850-865   Subroutine: build player hand string
Lines 870-885   Subroutine: build dealer hand string
Lines 900-910   Subroutine: deal random card
Lines 950-956   Subroutine: add card to player, adjust aces
Lines 960-966   Subroutine: add card to dealer, adjust aces
```
