# Hangman

A word-guessing game for the FX-870P / VX-4 with 100 hidden words, written by Claude (Anthropic).

## How to Play

1. The program picks a random word and shows it as underscores: `_ _ _ _ _ _`
2. Press a letter key (![A](../../../images/keys/standard/a.png)-![Z](../../../images/keys/standard/z.png)) to guess
3. Correct letters are revealed in the word; wrong guesses cost a life
4. You have **7 lives** — shown as filled blocks on line 2
5. Guess the whole word to win, or run out of lives and the answer is revealed
6. Press any key after the round ends to play again

**TURBO mode recommended:** The game runs fine at normal speed, but enabling TURBO makes the screen redraws instant. Click **TURBO** in the emulator toolbar before pressing RUN.

## Display Layout

```
_ O _ _ _ _           Word (revealed letters + blanks)
███████ 0/7           Lives remaining + wrong guess count
AEIOU                 Letters you've tried
GUESS: _              Press a letter to guess
```

## Word Encoding

The 100 words are stored in DATA statements using ROT13 encoding — each letter is shifted 13 positions through the alphabet. This means you can't spoil the answers by reading the program listing. The decoder is a single line of BASIC:

```
W$=W$+CHR$((ASC(MID$(E$,I,1))-65+13) MOD 26+65)
```

Since ROT13 is its own inverse (shifting by 13 twice returns to the original), the same formula both encodes and decodes.

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
4. Guess letters by pressing keys ![A](../../../images/keys/standard/a.png)-![Z](../../../images/keys/standard/z.png)
5. After a round ends, press any key to play again

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-120    Initialisation, random word selection, ROT13 decode
Lines 200-320   Display: word blanks, lives, used letters
Lines 330-390   Win/lose detection
Lines 400-570   Input handling, duplicate check, letter matching
Lines 600-620   Play again prompt
Lines 700-890   DATA: 100 ROT13-encoded words (20 lines x 5 words)
```

## Word Categories

The 100 words span a variety of themes:

- **Science & tech**: PYTHON, SCREEN, MEMORY, SYSTEM, BINARY, CIRCUIT, PRISM, LASER, RADAR, ROBOT, ENGINE, FOSSIL
- **Nature & geography**: PLANET, FOREST, ISLAND, DESERT, STREAM, CANYON, VALLEY, GARDEN, JUNGLE, BREEZE
- **Seasons & weather**: WINTER, SPRING, SUMMER, THUNDER, RAINBOW
- **Materials & objects**: COPPER, SILVER, MAGNET, MIRROR, QUARTZ, MARBLE, DIAMOND, CRYSTAL, PEBBLE
- **Animals**: FALCON, WALRUS, PENGUIN, DONKEY, PARROT, OYSTER, KITTEN, RABBIT, SALMON, TURKEY, INSECT, LIZARD
- **Fantasy & adventure**: DRAGON, WIZARD, PIRATE, CASTLE, THRONE, SHIELD, TEMPLE, SPHINX, MONSTER
- **Everyday items**: HAMMER, CANDLE, KETTLE, MUFFIN, NAPKIN, PEPPER, RIBBON, SADDLE, BOTTLE, COFFEE, BUTTON, BUCKET, HELMET, TABLET, NEEDLE, PADDLE, BASKET, PICKLE, WAFFLE, LOCKET, FABRIC
- **Other**: ROCKET, ANCHOR, BEACON, BRIDGE, TUNNEL, PUZZLE, JIGSAW, TURBAN, YELLOW, ZIGZAG, DINNER, FINGER, HIDDEN, MARKET, WINDOW, LUMBER, MANGO, VOYAGE, ORCHID
