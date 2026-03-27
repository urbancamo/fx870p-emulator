*back to [CONTENTS...](casio-fx850-owners-manual.md)*

*back to [Part 12 Appendices...](part-12-appendices.md)*

## Character Code Table

| HEX   | 0               | 1     | 2     | 3    | 4   | 5   | 6     | 7   | 8   | 9   | A   | B   | C   | D   | E   | F   |
|-------|-----------------|-------|-------|------|-----|-----|-------|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **0** |                 |       | SPACE | 0    | @   | P   | &#96; | p   | Å   | ⁰   | ␣   | ー   | ﾀ   | ﾐ   | ≥   | ×   | 
| **1** |                 | (DEL) | !     | 1    | A   | Q   | a     | q   | ∫   | ¹   | 。   | ｱ   | ﾁ   | ﾑ   | ≤   | 円   | 
| **2** | (LINE TOP)      | (INS) | "     | 2    | B   | R   | b     | r   | √   | ²   | 「   | ｲ   | ﾂ   | ﾒ   | ≠   | ⽜   | 
| **3** |                 |       | #     | 3    | C   | S   | c     | s   | '   | ³   | 」   | ｳ   | ﾃ   | ﾓ   | ↑   | ⽉   | 
| **4** | (SHIFT RELEASE) |       | $     | 4    | D   | T   | d     | t   | ∑   | ⁴   | 、   | ｴ   | ﾄ   | ﾔ   | ←   | 日   | 
| **5** | (LINE CANCEL)   |       | %     | 5    | E   | U   | e     | u   | Ω   | ⁵   | ・   | ｵ   | ﾅ   | ﾕ   | ↓   | 千   | 
| **6** | (LINE END)      |       | &amp; | 6    | F   | V   | f     | v   | ▒   | ⁶   | ｦ   | ｶ   | ﾆ   | ﾖ   | →   | 万   | 
| **7** | (BEL)           |       | '     | 7    | G   | W   | g     | w   | █   | ⁷   | ｧ   | ｷ   | ﾇ   | ﾗ   | π   | £   | 
| **8** | (BS)            |       | (     | 8    | H   | X   | h     | x   | 𝛼  | ⁸   | ｨ   | ｸ   | ﾈ   | ﾘ   | ♠   | ¢   | 
| **9** | (CAPS L→U)      |       | )     | 9    | I   | Y   | i     | y   | 𝛽  | ⁹   | ｩ   | ｹ   | ﾉ   | ﾙ   | ♥   | ±   | 
| **A** | (LF)            |       | *     | :    | J   | Z   | j     | z   | 𝛾  | ⁺   | ｪ   | ｺ   | ﾊ   | ﾚ   | ♣   | ∓   | 
| **B** | (HOME)          |       | +     | ;    | K   | [   | k     | {   | 𝜀  | ⁻   | ｫ   | ｻ   | ﾋ   | ﾛ   | ♦   | ₀   | 
| **C** | (CLS)           | (→)   | ,     | <    | L   | ¥   | l     | ¦   | 𝜃  | ⁿ   | ｬ   | ｼ   | ﾌ   | ﾜ   | ◻   | ➀   | 
| **D** | (CR)            | (←)   | -     | =    | M   | ]   | m     | }   | 𝜇  | ﹪   | ｭ   | ｽ   | ﾍ   | ﾝ   | ▢   | ➁   | 
| **E** | (SHIFT SET)     | (↑)   | .     | &gt; | N   | ^   | n     | ~   | 𝜎  | ⁻¹  | ｮ   | ｾ   | ﾎ   | ゛   | △   | ➂   | 
| **F** | (CAPS U→L)      | (↓)   | /     | ?    | O   | _   | o     | ␡   | 𝜙  | ÷   | ｯ   | ｿ   | ﾏ   | ゜   | \   | ➃   | 

 * Nothing is output for character codes for a character or function is specified (indicated by a blank cell in the table).
 * Control codes are indicated by parentheses and are not displayed.
 * Characters which cannot be input directly can be displayed using the [CHR$](commands/CHR_STRING.md) function.

**NOTE**:
The special characters in the character code table below only appear on the display and are not 
printed output by the printer. When a [LLIST](commands/LLIST.md) or [LPRINT](commands/LPRINT.md) command
is executed, they are substituted by the differently shaped printer characters corresponding to the 
respective character codes. Refer to the pocket computer and printer character code tables and 
compare then for further details.

**Character Code Table**

|     |     | 0               |    16 |    32 |   48 |  64 |  80 |    96 | 112 |    128 |   144 | 160 | 176 | 192 | 208 |   224 | 240 |
|-----|-----|-----------------|------:|------:|-----:|----:|----:|------:|----:|-------:|------:|----:|----:|----:|----:|------:|----:|
|     | HEX | 0               |     1 |     2 |    3 |   4 |   5 |     6 |   7 |      8 |     9 |   A |   B |   C |   D |     E |   F |
| 0   | 0   |                 |       | (SPC) |    0 |   @ |   P | &#96; |   p |    Å ª |   ⁰ ª |   ␣ |   ー |   ﾀ |   ﾐ | ≥ º ª | × º | 
| 1   | 1   |                 | (DEL) |     ! |    1 |   A |   Q |     a |   q |    ∫ ª |   ¹ ª |   。 |   ｱ |   ﾁ |   ﾑ | ≤ º ª |   円 | 
| 2   | 2   | (LINE TOP)      | (INS) |     " |    2 |   B |   R |     b |   r |    √ ª |   ² ª |   「 |   ｲ |   ﾂ |   ﾒ |   ≠ º |   ⽜ | 
| 3   | 3   |                 |       |     # |    3 |   C |   S |     c |   s |    ' ª |   ³ ª |   」 |   ｳ |   ﾃ |   ﾓ | ↑ º ª |   ⽉ | 
| 4   | 4   | (SHIFT RELEASE) |       |     $ |    4 |   D |   T |     d |   t |  ∑ º ª |   ⁴ ª |   、 |   ｴ |   ﾄ |   ﾔ | ← º ª |   日 | 
| 5   | 5   | (LINE CANCEL)   |       |     % |    5 |   E |   U |     e |   u |  Ω º ª |   ⁵ ª |   ・ |   ｵ |   ﾅ |   ﾕ | ↓ º ª | 千 ª | 
| 6   | 6   | (LINE END)      |       | &amp; |    6 |   F |   V |     f |   v |  ▒ º ª |   ⁶ ª |   ｦ |   ｶ |   ﾆ |   ﾖ | → º ª | 万 ª | 
| 7   | 7   | (BEL)           |       |     ' |    7 |   G |   W |     g |   w |  █ º ª |   ⁷ ª |   ｧ |   ｷ |   ﾇ |   ﾗ | π º ª | £ ª | 
| 8   | 8   | (BS)            |       |     ( |    8 |   H |   X |     h |   x |   𝛼 ª |   ⁸ ª |   ｨ |   ｸ |   ﾈ |   ﾘ |   ♠ º | ¢ ª | 
| 9   | 9   | (CAPS L→U)      |       |     ) |    9 |   I |   Y |     i |   y |   𝛽 ª |   ⁹ ª |   ｩ |   ｹ |   ﾉ |   ﾙ |   ♥ º | ± ª | 
| 10  | A   | (LF)            |       |     * |    : |   J |   Z |     j |   z | 𝛾 º ª |   ⁺ ª |   ｪ |   ｺ |   ﾊ |   ﾚ |   ♣ º | ∓ ª | 
| 11  | B   | (HOME)          |       |     + |    ; |   K |   [ |     k |   { |   𝜀 ª |   ⁻ ª |   ｫ |   ｻ |   ﾋ |   ﾛ |   ♦ º | ₀ ª | 
| 12  | C   | (CLS)           |   (→) |     , |    < |   L |   ¥ |     l |   ¦ |   𝜃 ª |   ⁿ ª |   ｬ |   ｼ |   ﾌ |   ﾜ | ◻ º ª |   ➀ | 
| 13  | D   | (CR)            |   (←) |     - |    = |   M |   ] |     m |   } | 𝜇 º ª |   ﹪ ª |   ｭ |   ｽ |   ﾍ |   ﾝ |   ▢ º |   ➁ | 
| 14  | E   | (SHIFT SET)     |   (↑) |     . | &gt; |   N |   ^ |     n |   ~ | 𝜎 º ª |  ⁻¹ ª |   ｮ |   ｾ |   ﾎ |   ゛ | △ º ª |   ➂ | 
| 15  | F   | (CAPS U→L)      |   (↓) |     / |    ? |   O |   _ |     o |   ␡ |   𝜙 ª | ÷ º ª |   ｯ |   ｿ |   ﾏ |   ゜ |   \ º |   ➃ | 

 - Characters marked with a superscript-V (º) are available on the PB-100 series.
 - Except for the special characters marked with superscript-a (ª), all can be printed with the FP-40 and FP-100.
 - To display characters that can not be input directly, use the respective [CHR$](commands/CHR_STRING.md) function.
   **Example:** Display "∑"

   CAL mode: `CHR$(132)` *EXE* or `CHR$(&H84)` *EXE*
 
   BASIC mode: `PRINT CHR$(132)` *EXE* or `PRINT CHR$(&H84)` *EXE*
 - Characters ➀➁➂➃ in the table (hexadecimal `FC` ~ `FF` (decimal 252~255)) are used internally and therefore not defined.