*back to [Table of Contents](index.md)*

# Character Code Table

The Casio FX/VX/Z series pocket computers use a custom character encoding that includes standard ASCII in the range 0x20-0x7F, half-width katakana in the range 0xA0-0xDF, and mathematical/scientific symbols in the upper ranges.

## Model Differences

The **FX-850P, FX-880P, FX-870P, VX-4, FX-890P, and Z-1** series all share the same character set, which includes mathematical symbols (Greek letters, superscript digits, set notation) and Japanese katakana. This is the character set documented below.

The **PB-1000** uses a different character set that is compatible with the PB-700 series. It replaces many of the mathematical symbols with graphics characters (block drawing elements). Programs that use CHR$ codes above 0x7F may display differently when transferred between these families.

## Character Code Table

Characters are shown with their hexadecimal column (top) and row (left side). For example, the letter "A" is at column 4, row 1, giving character code 0x41 (decimal 65).

<table>
<tr>
<th>HEX</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th>
</tr>
<tr>
<td><b>0</b></td><td></td><td></td><td>(SPC)</td><td>0</td><td>@</td><td>P</td><td>`</td><td>p</td><td>&#197;</td><td>&#8304;</td><td>&#9251;</td><td>&#12540;</td><td>&#65408;</td><td>&#65424;</td><td>&ge;</td><td>&times;</td>
</tr>
<tr>
<td><b>1</b></td><td></td><td>(DEL)</td><td>!</td><td>1</td><td>A</td><td>Q</td><td>a</td><td>q</td><td>&int;</td><td>&sup1;</td><td>&#12290;</td><td>&#65393;</td><td>&#65409;</td><td>&#65425;</td><td>&le;</td><td>&#20870;</td>
</tr>
<tr>
<td><b>2</b></td><td>(LINE TOP)</td><td>(INS)</td><td>"</td><td>2</td><td>B</td><td>R</td><td>b</td><td>r</td><td>&radic;</td><td>&sup2;</td><td>&#12300;</td><td>&#65394;</td><td>&#65410;</td><td>&#65426;</td><td>&ne;</td><td>&#29275;</td>
</tr>
<tr>
<td><b>3</b></td><td></td><td></td><td>#</td><td>3</td><td>C</td><td>S</td><td>c</td><td>s</td><td>&rsquo;</td><td>&sup3;</td><td>&#12301;</td><td>&#65395;</td><td>&#65411;</td><td>&#65427;</td><td>&uarr;</td><td>&#26376;</td>
</tr>
<tr>
<td><b>4</b></td><td>(SHIFT REL)</td><td></td><td>$</td><td>4</td><td>D</td><td>T</td><td>d</td><td>t</td><td>&sum;</td><td>&#8308;</td><td>&#12289;</td><td>&#65396;</td><td>&#65412;</td><td>&#65428;</td><td>&larr;</td><td>&#26085;</td>
</tr>
<tr>
<td><b>5</b></td><td>(LINE CAN)</td><td></td><td>%</td><td>5</td><td>E</td><td>U</td><td>e</td><td>u</td><td>&Omega;</td><td>&#8309;</td><td>&#12539;</td><td>&#65397;</td><td>&#65413;</td><td>&#65429;</td><td>&darr;</td><td>&#21315;</td>
</tr>
<tr>
<td><b>6</b></td><td>(LINE END)</td><td></td><td>&amp;</td><td>6</td><td>F</td><td>V</td><td>f</td><td>v</td><td>&#9618;</td><td>&#8310;</td><td>&#65382;</td><td>&#65398;</td><td>&#65414;</td><td>&#65430;</td><td>&rarr;</td><td>&#19975;</td>
</tr>
<tr>
<td><b>7</b></td><td>(BEL)</td><td></td><td>'</td><td>7</td><td>G</td><td>W</td><td>g</td><td>w</td><td>&#9608;</td><td>&#8311;</td><td>&#65383;</td><td>&#65399;</td><td>&#65415;</td><td>&#65431;</td><td>&pi;</td><td>&pound;</td>
</tr>
<tr>
<td><b>8</b></td><td>(BS)</td><td></td><td>(</td><td>8</td><td>H</td><td>X</td><td>h</td><td>x</td><td>&alpha;</td><td>&#8312;</td><td>&#65384;</td><td>&#65400;</td><td>&#65416;</td><td>&#65432;</td><td>&spades;</td><td>&cent;</td>
</tr>
<tr>
<td><b>9</b></td><td>(CAPS L&rarr;U)</td><td></td><td>)</td><td>9</td><td>I</td><td>Y</td><td>i</td><td>y</td><td>&beta;</td><td>&#8313;</td><td>&#65385;</td><td>&#65401;</td><td>&#65417;</td><td>&#65433;</td><td>&hearts;</td><td>&plusmn;</td>
</tr>
<tr>
<td><b>A</b></td><td>(LF)</td><td></td><td>*</td><td>:</td><td>J</td><td>Z</td><td>j</td><td>z</td><td>&gamma;</td><td>&#8314;</td><td>&#65386;</td><td>&#65402;</td><td>&#65418;</td><td>&#65434;</td><td>&clubs;</td><td>&#8723;</td>
</tr>
<tr>
<td><b>B</b></td><td>(HOME)</td><td></td><td>+</td><td>;</td><td>K</td><td>[</td><td>k</td><td>{</td><td>&epsilon;</td><td>&#8315;</td><td>&#65387;</td><td>&#65403;</td><td>&#65419;</td><td>&#65435;</td><td>&diams;</td><td>&#8320;</td>
</tr>
<tr>
<td><b>C</b></td><td>(CLS)</td><td>(&rarr;)</td><td>,</td><td>&lt;</td><td>L</td><td>&yen;</td><td>l</td><td>&brvbar;</td><td>&theta;</td><td>&#8319;</td><td>&#65388;</td><td>&#65404;</td><td>&#65420;</td><td>&#65436;</td><td>&#9723;</td><td>&#10102;</td>
</tr>
<tr>
<td><b>D</b></td><td>(CR)</td><td>(&larr;)</td><td>-</td><td>=</td><td>M</td><td>]</td><td>m</td><td>}</td><td>&mu;</td><td>&#65130;</td><td>&#65389;</td><td>&#65405;</td><td>&#65421;</td><td>&#65437;</td><td>&#9634;</td><td>&#10103;</td>
</tr>
<tr>
<td><b>E</b></td><td>(SHIFT SET)</td><td>(&uarr;)</td><td>.</td><td>&gt;</td><td>N</td><td>^</td><td>n</td><td>~</td><td>&sigma;</td><td>&#8315;&sup1;</td><td>&#65390;</td><td>&#65406;</td><td>&#65422;</td><td>&#65438;</td><td>&#9651;</td><td>&#10104;</td>
</tr>
<tr>
<td><b>F</b></td><td>(CAPS U&rarr;L)</td><td>(&darr;)</td><td>/</td><td>?</td><td>O</td><td>_</td><td>o</td><td>(DEL)</td><td>&phi;</td><td>&divide;</td><td>&#65391;</td><td>&#65407;</td><td>&#65423;</td><td>&#65439;</td><td>\</td><td>&#10105;</td>
</tr>
</table>

## Character Ranges

| Range (Hex) | Range (Decimal) | Contents |
|-------------|-----------------|----------|
| 00-0F | 0-15 | Control codes (not displayed) |
| 10-1F | 16-31 | Control codes (cursor, insert, delete) |
| 20-2F | 32-47 | Punctuation and symbols (space through /) |
| 30-3F | 48-63 | Digits 0-9 and symbols : ; < = > ? |
| 40-5F | 64-95 | Uppercase letters A-Z and @ [ \ ] ^ _ |
| 60-7F | 96-127 | Lowercase letters a-z and ` { | } ~ DEL |
| 80-8F | 128-143 | Mathematical/scientific symbols |
| 90-9F | 144-159 | Superscript digits and special notation |
| A0-DF | 160-223 | Half-width katakana |
| E0-EF | 224-239 | Card suits, arrows, geometric shapes |
| F0-FB | 240-251 | Currency symbols, CJK characters, misc |
| FC-FF | 252-255 | Reserved (used internally) |

## Notes

- Control codes (columns 0 and 1) are shown in parentheses and are not displayed on screen. They perform cursor and display control functions.
- Characters that cannot be typed directly from the keyboard can be displayed using the [CHR$](commands/CHR_STRING.md) function. For example, to display the summation symbol: `PRINT CHR$(132)` or `PRINT CHR$(&H84)`.
- Character code 0x5C displays as the yen sign (&yen;) on the pocket computer screen, following the JIS X 0201 standard. This is the same position as the backslash (\) in ASCII.
- Characters at codes 0xFC through 0xFF (decimal 252-255) are used internally by the system and are not defined as displayable characters.
- The special characters in the upper range (0x80 and above) appear on the LCD display but may be substituted with different characters when printed to an external printer via [LLIST](commands/LLIST.md) or [LPRINT](commands/LPRINT.md). Consult the printer manual for the printer's character code table.

---

*back to [Table of Contents](index.md)*
