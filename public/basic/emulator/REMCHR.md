# Casio Character Set Demo

Displays the full Casio FX-870P character set (bytes 0x20-0xFF) using REM statements.

Each line contains 24 consecutive characters from the Casio ASCII table. When viewed in the BASIC listing panel, these raw byte values are converted to their Unicode equivalents via the `casio-ascii.ts` conversion table.

## Character Ranges

| Line | Hex Range   | Contents                                     |
|-----:|-------------|----------------------------------------------|
|   10 | 0x20 - 0x37 | Space, punctuation, digits 0-7               |
|   20 | 0x38 - 0x4F | Digits 8-9, symbols, uppercase A-O           |
|   30 | 0x50 - 0x67 | Uppercase P-Z, brackets, lowercase a-g       |
|   40 | 0x68 - 0x7F | Lowercase h-z, braces, broken bar, tilde, DEL |
|   50 | 0x80 - 0x97 | Math symbols, Greek letters, superscripts    |
|   60 | 0x98 - 0xAF | Superscripts, katakana punctuation, small kana |
|   70 | 0xB0 - 0xC7 | Half-width katakana (a-nu)                   |
|   80 | 0xC8 - 0xDF | Half-width katakana (ne-n), dakuten/handakuten |
|   90 | 0xE0 - 0xF7 | Comparison, arrows, card suits, shapes, CJK  |
|  100 | 0xF8 - 0xFF | Currency, plus-minus, user-defined chars      |

## Notable Casio ASCII Differences

- **0x5C** = Yen sign (not backslash)
- **0x7C** = Broken bar (not pipe)
- **0xEF** = Backslash (the actual backslash lives here, not at 0x5C)
