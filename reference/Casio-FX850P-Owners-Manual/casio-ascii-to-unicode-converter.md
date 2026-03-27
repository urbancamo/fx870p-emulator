*back to [CONTENTS...](casio-fx850-owners-manual.md)*

# Casio ASCII ⇋ Unicode

The following table shows the conversion used between Casio ASCII and Unicode in the converter.

The table shows the following information:

Casio Dec/Hex 
: The position of the character as defined in the CASIO ASCII map.

Casio Description
: if there is description noted for the Casio Character in the Reference Manual it is noted here.

Unicode Equivalent
: This is a Unicode character that has been picked as a reasonable representation
of the associated Casio Character. Note that as some entries have codepoints above
0xFFFF in UTF-8 encoding there could be more than one character making up the symbol.

Unicode CodePoint
: the unicode codepoint associated with the unicode equivalent.

Unicode Description
: this is the description of the unicode character as per the unicode specification

### NOTES

 - It is unlikely that Casio BASIC files will contain characters with position 0 to 9,
   and 14 to 27 as these are control characters. 

 - Characters 252 - 255 are reserved for user-defined characters. As such, the symbols
   representing them in the Unicode file won't match how they will be displayed once defined.

 - Character with Casio Position 158 is a single character representing -1. There is no
   single codepoint unicode equivalent. I therefore use a different digit one in the Unicode space
   then patch up the unicode output to be ⁻1. When Unicode is read I remove the leading minus sign
   before checking the input. 

| Casio Dec | Casio Hex | Casio Description | Unicode Equivalent | Unicode CodePoint | Unicode Description                      |
|----------:|----------:|-------------------|--------------------|------------------:|------------------------------------------|
|         0 |        00 |                   | ␀                  |            \u2400 | SYMBOL FOR NULL                          |
|         1 |        01 |                   | ␁                  |            \u2401 | SYMBOL FOR START OF HEADING              |
|         2 |        02 | Line top          | ␂                  |            \u2402 | SYMBOL FOR START OF TEXT                 |
|         3 |        03 |                   | ␃                  |            \u2403 | SYMBOL FOR END OF TEXT                   |
|         4 |        04 | Shift Release     | ␄                  |            \u2404 | SYMBOL FOR END OF TRANSMISSION           |
|         5 |        05 | Line Cancel       | ␅                  |            \u2405 | SYMBOL FOR ENQUIRY                       |
|         6 |        06 | Line End          | ␆                  |            \u2406 | SYMBOL FOR ACKNOWLEDGE                   |
|         7 |        07 | BEL               | ␇                  |            \u2407 | SYMBOL FOR BELL                          |
|         8 |        08 | BS                | ␈                  |            \u2408 | SYMBOL FOR BACKSPACE                     |
|         9 |        09 | CAPS L->U         | <tab>              |               \u9 | CHARACTER TABULATION                     |
|        10 |        0a | LF                | <nl>               |               \ua | LINE FEED (LF)                           |
|        11 |        0b | HOME              | ␋                  |            \u240b | SYMBOL FOR VERTICAL TABULATION           |
|        12 |        0c | CLS               | ␌                  |            \u240c | SYMBOL FOR FORM FEED                     |
|        13 |        0d | CR                | <cr>               |               \ud | CARRIAGE RETURN (CR)                     |
|        14 |        0e | SHIFT SET         | ␎                  |            \u240e | SYMBOL FOR SHIFT OUT                     |
|        15 |        0f | CAPS U->L         | ␏                  |            \u240f | SYMBOL FOR SHIFT IN                      |
|        16 |        10 |                   | ␐                  |            \u2410 | SYMBOL FOR DATA LINK ESCAPE              |
|        17 |        11 | DEL               | ␑                  |            \u2411 | SYMBOL FOR DEVICE CONTROL ONE            |
|        18 |        12 | INS               | ␒                  |            \u2412 | SYMBOL FOR DEVICE CONTROL TWO            |
|        19 |        13 |                   | ␓                  |            \u2413 | SYMBOL FOR DEVICE CONTROL THREE          |
|        20 |        14 |                   | ␔                  |            \u2414 | SYMBOL FOR DEVICE CONTROL FOUR           |
|        21 |        15 |                   | ␕                  |            \u2415 | SYMBOL FOR NEGATIVE ACKNOWLEDGE          |
|        22 |        16 |                   | ␖                  |            \u2416 | SYMBOL FOR SYNCHRONOUS IDLE              |
|        23 |        17 |                   | ␗                  |            \u2417 | SYMBOL FOR END OF TRANSMISSION BLOCK     |
|        24 |        18 |                   | ␘                  |            \u2418 | SYMBOL FOR CANCEL                        |
|        25 |        19 |                   | ␙                  |            \u2419 | SYMBOL FOR END OF MEDIUM                 |
|        26 |        1a |                   | ␚                  |            \u241a | SYMBOL FOR SUBSTITUTE                    |
|        27 |        1b |                   | ␛                  |            \u241b | SYMBOL FOR ESCAPE                        |
|        28 |        1c | RIGHT ARROW       | ⇨                  |            \u21e8 | RIGHTWARDS WHITE ARROW                   |
|        29 |        1d | LEFT ARROW        | ⇦                  |            \u21e6 | LEFTWARDS WHITE ARROW                    |
|        30 |        1e | UP ARROW          | ⇧                  |            \u21e7 | UPWARDS WHITE ARROW                      |
|        31 |        1f | DOWN ARROW        | ⇩                  |            \u21e9 | DOWNWARDS WHITE ARROW                    |
|        32 |        20 | SPC               |                    |            \u0020 | SPACE                                    |
|        33 |        21 |                   | !                  |            \u0021 | EXCLAMATION MARK                         |
|        34 |        22 |                   | "                  |            \u0022 | QUOTATION MARK                           |
|        35 |        23 |                   | #                  |            \u0023 | NUMBER SIGN                              |
|        36 |        24 |                   | $                  |            \u0024 | DOLLAR SIGN                              |
|        37 |        25 |                   | %                  |            \u0025 | PERCENT SIGN                             |
|        38 |        26 |                   | &amp;              |            \u0026 | AMPERSAND                                |
|        39 |        27 |                   | '                  |            \u0027 | APOSTROPHE                               |
|        40 |        28 |                   | (                  |            \u0028 | LEFT PARENTHESIS                         |
|        41 |        29 |                   | )                  |            \u0029 | RIGHT PARENTHESIS                        |
|        42 |        2a |                   | *                  |            \u002a | ASTERISK                                 |
|        43 |        2b |                   | +                  |            \u002b | PLUS SIGN                                |
|        44 |        2c |                   | ,                  |            \u002c | COMMA                                    |
|        45 |        2d |                   | -                  |            \u002d | HYPHEN-MINUS                             |
|        46 |        2e |                   | .                  |            \u002e | FULL STOP                                |
|        47 |        2f |                   | /                  |            \u002f | SOLIDUS                                  |
|        48 |        30 |                   | 0                  |            \u0030 | DIGIT ZERO                               |
|        49 |        31 |                   | 1                  |            \u0031 | DIGIT ONE                                |
|        50 |        32 |                   | 2                  |            \u0032 | DIGIT TWO                                |
|        51 |        33 |                   | 3                  |            \u0033 | DIGIT THREE                              |
|        52 |        34 |                   | 4                  |            \u0034 | DIGIT FOUR                               |
|        53 |        35 |                   | 5                  |            \u0035 | DIGIT FIVE                               |
|        54 |        36 |                   | 6                  |            \u0036 | DIGIT SIX                                |
|        55 |        37 |                   | 7                  |            \u0037 | DIGIT SEVEN                              |
|        56 |        38 |                   | 8                  |            \u0038 | DIGIT EIGHT                              |
|        57 |        39 |                   | 9                  |            \u0039 | DIGIT NINE                               |
|        58 |        3a |                   | :                  |            \u003a | COLON                                    |
|        59 |        3b |                   | ;                  |            \u003b | SEMICOLON                                |
|        60 |        3c |                   | <                  |            \u003c | LESS-THAN SIGN                           |
|        61 |        3d |                   | =                  |            \u003d | EQUALS SIGN                              |
|        62 |        3e |                   | &gt;               |            \u003e | GREATER-THAN SIGN                        |
|        63 |        3f |                   | ?                  |            \u003f | QUESTION MARK                            |
|        64 |        40 |                   | @                  |            \u0040 | COMMERCIAL AT                            |
|        65 |        41 |                   | A                  |            \u0041 | LATIN CAPITAL LETTER A                   |
|        66 |        42 |                   | B                  |            \u0042 | LATIN CAPITAL LETTER B                   |
|        67 |        43 |                   | C                  |            \u0043 | LATIN CAPITAL LETTER C                   |
|        68 |        44 |                   | D                  |            \u0044 | LATIN CAPITAL LETTER D                   |
|        69 |        45 |                   | E                  |            \u0045 | LATIN CAPITAL LETTER E                   |
|        70 |        46 |                   | F                  |            \u0046 | LATIN CAPITAL LETTER F                   |
|        71 |        47 |                   | G                  |            \u0047 | LATIN CAPITAL LETTER G                   |
|        72 |        48 |                   | H                  |            \u0048 | LATIN CAPITAL LETTER H                   |
|        73 |        49 |                   | I                  |            \u0049 | LATIN CAPITAL LETTER I                   |
|        74 |        4a |                   | J                  |            \u004a | LATIN CAPITAL LETTER J                   |
|        75 |        4b |                   | K                  |            \u004b | LATIN CAPITAL LETTER K                   |
|        76 |        4c |                   | L                  |            \u004c | LATIN CAPITAL LETTER L                   |
|        77 |        4d |                   | M                  |            \u004d | LATIN CAPITAL LETTER M                   |
|        78 |        4e |                   | N                  |            \u004e | LATIN CAPITAL LETTER N                   |
|        79 |        4f |                   | O                  |            \u004f | LATIN CAPITAL LETTER O                   |
|        80 |        50 |                   | P                  |            \u0050 | LATIN CAPITAL LETTER P                   |
|        81 |        51 |                   | Q                  |            \u0051 | LATIN CAPITAL LETTER Q                   |
|        82 |        52 |                   | R                  |            \u0052 | LATIN CAPITAL LETTER R                   |
|        83 |        53 |                   | S                  |            \u0053 | LATIN CAPITAL LETTER S                   |
|        84 |        54 |                   | T                  |            \u0054 | LATIN CAPITAL LETTER T                   |
|        85 |        55 |                   | U                  |            \u0055 | LATIN CAPITAL LETTER U                   |
|        86 |        56 |                   | V                  |            \u0056 | LATIN CAPITAL LETTER V                   |
|        87 |        57 |                   | W                  |            \u0057 | LATIN CAPITAL LETTER W                   |
|        88 |        58 |                   | X                  |            \u0058 | LATIN CAPITAL LETTER X                   |
|        89 |        59 |                   | Y                  |            \u0059 | LATIN CAPITAL LETTER Y                   |
|        90 |        5a |                   | Z                  |            \u005a | LATIN CAPITAL LETTER Z                   |
|        91 |        5b |                   | [                  |            \u005b | LEFT SQUARE BRACKET                      |
|        92 |        5c |                   | ¥                  |            \u00a5 | YEN SIGN                                 |
|        93 |        5d |                   | ]                  |            \u005d | RIGHT SQUARE BRACKET                     |
|        94 |        5e |                   | ^                  |            \u005e | CIRCUMFLEX ACCENT                        |
|        95 |        5f |                   | _                  |            \u005f | LOW LINE                                 |
|        96 |        60 |                   | &#96;              |            \u0060 | GRAVE ACCENT                             |
|        97 |        61 |                   | a                  |            \u0061 | LATIN SMALL LETTER A                     |
|        98 |        62 |                   | b                  |            \u0062 | LATIN SMALL LETTER B                     |
|        99 |        63 |                   | c                  |            \u0063 | LATIN SMALL LETTER C                     |
|       100 |        64 |                   | d                  |            \u0064 | LATIN SMALL LETTER D                     |
|       101 |        65 |                   | e                  |            \u0065 | LATIN SMALL LETTER E                     |
|       102 |        66 |                   | f                  |            \u0066 | LATIN SMALL LETTER F                     |
|       103 |        67 |                   | g                  |            \u0067 | LATIN SMALL LETTER G                     |
|       104 |        68 |                   | h                  |            \u0068 | LATIN SMALL LETTER H                     |
|       105 |        69 |                   | i                  |            \u0069 | LATIN SMALL LETTER I                     |
|       106 |        6a |                   | j                  |            \u006a | LATIN SMALL LETTER J                     |
|       107 |        6b |                   | k                  |            \u006b | LATIN SMALL LETTER K                     |
|       108 |        6c |                   | l                  |            \u006c | LATIN SMALL LETTER L                     |
|       109 |        6d |                   | m                  |            \u006d | LATIN SMALL LETTER M                     |
|       110 |        6e |                   | n                  |            \u006e | LATIN SMALL LETTER N                     |
|       111 |        6f |                   | o                  |            \u006f | LATIN SMALL LETTER O                     |
|       112 |        70 |                   | p                  |            \u0070 | LATIN SMALL LETTER P                     |
|       113 |        71 |                   | q                  |            \u0071 | LATIN SMALL LETTER Q                     |
|       114 |        72 |                   | r                  |            \u0072 | LATIN SMALL LETTER R                     |
|       115 |        73 |                   | s                  |            \u0073 | LATIN SMALL LETTER S                     |
|       116 |        74 |                   | t                  |            \u0074 | LATIN SMALL LETTER T                     |
|       117 |        75 |                   | u                  |            \u0075 | LATIN SMALL LETTER U                     |
|       118 |        76 |                   | v                  |            \u0076 | LATIN SMALL LETTER V                     |
|       119 |        77 |                   | w                  |            \u0077 | LATIN SMALL LETTER W                     |
|       120 |        78 |                   | x                  |            \u0078 | LATIN SMALL LETTER X                     |
|       121 |        79 |                   | y                  |            \u0079 | LATIN SMALL LETTER Y                     |
|       122 |        7a |                   | z                  |            \u007a | LATIN SMALL LETTER Z                     |
|       123 |        7b |                   | {                  |            \u007b | LEFT CURLY BRACKET                       |
|       124 |        7c |                   | ¦                  |            \u00a6 | BROKEN BAR                               |
|       125 |        7d |                   | }                  |            \u007d | RIGHT CURLY BRACKET                      |
|       126 |        7e |                   | ~                  |            \u007e | TILDE                                    |
|       127 |        7f | DEL               | ␡                  |            \u2421 | SYMBOL FOR DELETE                        |
|       128 |        80 |                   | Å                  |            \u00c5 | LATIN CAPITAL LETTER A WITH RING ABOVE   |
|       129 |        81 |                   | ∫                  |            \u222b | INTEGRAL                                 |
|       130 |        82 |                   | √                  |            \u221a | SQUARE ROOT                              |
|       131 |        83 |                   | '                  |            \u0027 | APOSTROPHE                               |
|       132 |        84 |                   | ∑                  |            \u2211 | N-ARY SUMMATION                          |
|       133 |        85 |                   | Ω                  |             \u3a9 | GREEK CAPITAL LETTER OMEGA               |
|       134 |        86 |                   | ▒                  |            \u2592 | MEDIUM SHADE                             |
|       135 |        87 |                   | █                  |            \u2588 | FULL BLOCK                               |
|       136 |        88 |                   | 𝛼                 |        \u0001d6fc | MATHEMATICAL ITALIC SMALL ALPHA          |
|       137 |        89 |                   | 𝛽                 |        \u0001d6fd | MATHEMATICAL ITALIC SMALL BETA           |
|       138 |        8a |                   | 𝛾                 |        \u0001d6fe | MATHEMATICAL ITALIC SMALL GAMMA          |
|       139 |        8b |                   | 𝜀                 |        \u0001d700 | MATHEMATICAL ITALIC SMALL EPSILON        |
|       140 |        8c |                   | 𝜃                 |        \u0001d703 | MATHEMATICAL ITALIC SMALL THETA          |
|       141 |        8d |                   | 𝜇                 |        \u0001d707 | MATHEMATICAL ITALIC SMALL MU             |
|       142 |        8e |                   | 𝜎                 |        \u0001d70e | MATHEMATICAL ITALIC SMALL SIGMA          |
|       143 |        8f |                   | 𝜙                 |        \u0001d719 | MATHEMATICAL ITALIC PHI SYMBOL           |
|       144 |        90 |                   | ⁰                  |            \u2070 | SUPERSCRIPT ZERO                         |
|       145 |        91 |                   | ¹                  |            \u00b9 | SUPERSCRIPT ONE                          |
|       146 |        92 |                   | ²                  |            \u00b2 | SUPERSCRIPT TWO                          |
|       147 |        93 |                   | ³                  |            \u00b3 | SUPERSCRIPT THREE                        |
|       148 |        94 |                   | ⁴                  |            \u2074 | SUPERSCRIPT FOUR                         |
|       149 |        95 |                   | ⁵                  |            \u2075 | SUPERSCRIPT FIVE                         |
|       150 |        96 |                   | ⁶                  |            \u2076 | SUPERSCRIPT SIX                          |
|       151 |        97 |                   | ⁷                  |            \u2077 | SUPERSCRIPT SEVEN                        |
|       152 |        98 |                   | ⁸                  |            \u2078 | SUPERSCRIPT EIGHT                        |
|       153 |        99 |                   | ⁹                  |            \u2079 | SUPERSCRIPT NINE                         |
|       154 |        9a |                   | ⁺                  |            \u207a | SUPERSCRIPT PLUS SIGN                    |
|       155 |        9b |                   | ⁻                  |            \u207b | SUPERSCRIPT MINUS                        |
|       156 |        9c |                   | ⁿ                  |            \u207f | SUPERSCRIPT LATIN SMALL LETTER N         |
|       157 |        9d |                   | ﹪                  |            \ufe6a | SMALL PERCENT SIGN                       |
|       158 |        9e |                   | ⁻¹                 |        \u0001d7f7 | MATHEMATICAL MONOSPACE DIGIT ONE         |
|       159 |        9f |                   | ÷                  |            \u00f7 | DIVISION SIGN                            |
|       160 |        a0 | SPC               | ␣                  |            \u2423 | OPEN BOX                                 |
|       161 |        a1 |                   | 。                  |            \u3002 | IDEOGRAPHIC FULL STOP                    |
|       162 |        a2 |                   | 「                  |            \u300c | LEFT CORNER BRACKET                      |
|       163 |        a3 |                   | 」                  |            \u300d | RIGHT CORNER BRACKET                     |
|       164 |        a4 |                   | 、                  |            \u3001 | IDEOGRAPHIC COMMA                        |
|       165 |        a5 |                   | ・                  |            \u30fb | KATAKANA MIDDLE DOT                      |
|       166 |        a6 |                   | ｦ                  |            \uff66 | HALFWIDTH KATAKANA LETTER WO             |
|       167 |        a7 |                   | ｧ                  |            \uff67 | HALFWIDTH KATAKANA LETTER SMALL A        |
|       168 |        a8 |                   | ｨ                  |            \uff68 | HALFWIDTH KATAKANA LETTER SMALL I        |
|       169 |        a9 |                   | ｩ                  |            \uff69 | HALFWIDTH KATAKANA LETTER SMALL U        |
|       170 |        aa |                   | ｪ                  |            \uff6a | HALFWIDTH KATAKANA LETTER SMALL E        |
|       171 |        ab |                   | ｫ                  |            \uff6b | HALFWIDTH KATAKANA LETTER SMALL O        |
|       172 |        ac |                   | ｬ                  |            \uff6c | HALFWIDTH KATAKANA LETTER SMALL YA       |
|       173 |        ad |                   | ｭ                  |            \uff6d | HALFWIDTH KATAKANA LETTER SMALL YU       |
|       174 |        ae |                   | ｮ                  |            \uff6e | HALFWIDTH KATAKANA LETTER SMALL YO       |
|       175 |        af |                   | ｯ                  |            \uff6f | HALFWIDTH KATAKANA LETTER SMALL TU       |
|       176 |        b0 |                   | ー                  |            \u30fc | KATAKANA-HIRAGANA PROLONGED SOUND MARK   |
|       177 |        b1 |                   | ｱ                  |            \uff71 | HALFWIDTH KATAKANA LETTER A              |
|       178 |        b2 |                   | ｲ                  |            \uff72 | HALFWIDTH KATAKANA LETTER I              |
|       179 |        b3 |                   | ｳ                  |            \uff73 | HALFWIDTH KATAKANA LETTER U              |
|       180 |        b4 |                   | ｴ                  |            \uff74 | HALFWIDTH KATAKANA LETTER E              |
|       181 |        b5 |                   | ｵ                  |            \uff75 | HALFWIDTH KATAKANA LETTER O              |
|       182 |        b6 |                   | ｶ                  |            \uff76 | HALFWIDTH KATAKANA LETTER KA             |
|       183 |        b7 |                   | ｷ                  |            \uff77 | HALFWIDTH KATAKANA LETTER KI             |
|       184 |        b8 |                   | ｸ                  |            \uff78 | HALFWIDTH KATAKANA LETTER KU             |
|       185 |        b9 |                   | ｹ                  |            \uff79 | HALFWIDTH KATAKANA LETTER KE             |
|       186 |        ba |                   | ｺ                  |            \uff7a | HALFWIDTH KATAKANA LETTER KO             |
|       187 |        bb |                   | ｻ                  |            \uff7b | HALFWIDTH KATAKANA LETTER SA             |
|       188 |        bc |                   | ｼ                  |            \uff7c | HALFWIDTH KATAKANA LETTER SI             |
|       189 |        bd |                   | ｽ                  |            \uff7d | HALFWIDTH KATAKANA LETTER SU             |
|       190 |        be |                   | ｾ                  |            \uff7e | HALFWIDTH KATAKANA LETTER SE             |
|       191 |        bf |                   | ｿ                  |            \uff7f | HALFWIDTH KATAKANA LETTER SO             |
|       192 |        c0 |                   | ﾀ                  |            \uff80 | HALFWIDTH KATAKANA LETTER TA             |
|       193 |        c1 |                   | ﾁ                  |            \uff81 | HALFWIDTH KATAKANA LETTER TI             |
|       194 |        c2 |                   | ﾂ                  |            \uff82 | HALFWIDTH KATAKANA LETTER TU             |
|       195 |        c3 |                   | ﾃ                  |            \uff83 | HALFWIDTH KATAKANA LETTER TE             |
|       196 |        c4 |                   | ﾄ                  |            \uff84 | HALFWIDTH KATAKANA LETTER TO             |
|       197 |        c5 |                   | ﾅ                  |            \uff85 | HALFWIDTH KATAKANA LETTER NA             |
|       198 |        c6 |                   | ﾆ                  |            \uff86 | HALFWIDTH KATAKANA LETTER NI             |
|       199 |        c7 |                   | ﾇ                  |            \uff87 | HALFWIDTH KATAKANA LETTER NU             |
|       200 |        c8 |                   | ﾈ                  |            \uff88 | HALFWIDTH KATAKANA LETTER NE             |
|       201 |        c9 |                   | ﾉ                  |            \uff89 | HALFWIDTH KATAKANA LETTER NO             |
|       202 |        ca |                   | ﾊ                  |            \uff8a | HALFWIDTH KATAKANA LETTER HA             |
|       203 |        cb |                   | ﾋ                  |            \uff8b | HALFWIDTH KATAKANA LETTER HI             |
|       204 |        cc |                   | ﾌ                  |            \uff8c | HALFWIDTH KATAKANA LETTER HU             |
|       205 |        cd |                   | ﾍ                  |            \uff8d | HALFWIDTH KATAKANA LETTER HE             |
|       206 |        ce |                   | ﾎ                  |            \uff8e | HALFWIDTH KATAKANA LETTER HO             |
|       207 |        cf |                   | ﾏ                  |            \uff8f | HALFWIDTH KATAKANA LETTER MA             |
|       208 |        d0 |                   | ﾐ                  |            \uff90 | HALFWIDTH KATAKANA LETTER MI             |
|       209 |        d1 |                   | ﾑ                  |            \uff91 | HALFWIDTH KATAKANA LETTER MU             |
|       210 |        d2 |                   | ﾒ                  |            \uff92 | HALFWIDTH KATAKANA LETTER ME             |
|       211 |        d3 |                   | ﾓ                  |            \uff93 | HALFWIDTH KATAKANA LETTER MO             |
|       212 |        d4 |                   | ﾔ                  |            \uff94 | HALFWIDTH KATAKANA LETTER YA             |
|       213 |        d5 |                   | ﾕ                  |            \uff95 | HALFWIDTH KATAKANA LETTER YU             |
|       214 |        d6 |                   | ﾖ                  |            \uff96 | HALFWIDTH KATAKANA LETTER YO             |
|       215 |        d7 |                   | ﾗ                  |            \uff97 | HALFWIDTH KATAKANA LETTER RA             |
|       216 |        d8 |                   | ﾘ                  |            \uff98 | HALFWIDTH KATAKANA LETTER RI             |
|       217 |        d9 |                   | ﾙ                  |            \uff99 | HALFWIDTH KATAKANA LETTER RU             |
|       218 |        da |                   | ﾚ                  |            \uff9a | HALFWIDTH KATAKANA LETTER RE             |
|       219 |        db |                   | ﾛ                  |            \uff9b | HALFWIDTH KATAKANA LETTER RO             |
|       220 |        dc |                   | ﾜ                  |            \uff9c | HALFWIDTH KATAKANA LETTER WA             |
|       221 |        dd |                   | ﾝ                  |            \uff9d | HALFWIDTH KATAKANA LETTER N              |
|       222 |        de |                   | ゛                  |            \u309b | KATAKANA-HIRAGANA VOICED SOUND MARK      |
|       223 |        df |                   | ゜                  |            \u309c | KATAKANA-HIRAGANA SEMI-VOICED SOUND MARK |
|       224 |        e0 |                   | ≥                  |            \u2265 | GREATER-THAN OR EQUAL TO                 |
|       225 |        e1 |                   | ≤                  |            \u2264 | LESS-THAN OR EQUAL TO                    |
|       226 |        e2 |                   | ≠                  |            \u2260 | NOT EQUAL TO                             |
|       227 |        e3 |                   | ↑                  |            \u2191 | UPWARDS ARROW                            |
|       228 |        e4 |                   | ←                  |            \u2190 | LEFTWARDS ARROW                          |
|       229 |        e5 |                   | ↓                  |            \u2193 | DOWNWARDS ARROW                          |
|       230 |        e6 |                   | →                  |            \u2192 | RIGHTWARDS ARROW                         |
|       231 |        e7 |                   | π                  |             \u3c0 | GREEK SMALL LETTER PI                    |
|       232 |        e8 |                   | ♠                  |            \u2660 | BLACK SPADE SUIT                         |
|       233 |        e9 |                   | ♥                  |            \u2665 | BLACK HEART SUIT                         |
|       234 |        ea |                   | ♣                  |            \u2663 | BLACK CLUB SUIT                          |
|       235 |        eb |                   | ♦                  |            \u2666 | BLACK DIAMOND SUIT                       |
|       236 |        ec |                   | ◻                  |            \u25fb | WHITE MEDIUM SQUARE                      |
|       237 |        ed |                   | ▢                  |            \u25a2 | WHITE SQUARE WITH ROUNDED CORNERS        |
|       238 |        ee |                   | △                  |            \u25b3 | WHITE UP-POINTING TRIANGLE               |
|       239 |        ef |                   | \                  |            \u005c | REVERSE SOLIDUS                          |
|       240 |        f0 |                   | ×                  |            \u00d7 | MULTIPLICATION SIGN                      |
|       241 |        f1 |                   | 円                  |            \u5186 | CJK UNIFIED IDEOGRAPHS 5186              |
|       242 |        f2 |                   | ⽜                  |            \u2f5c | KANGXI RADICAL COW                       |
|       243 |        f3 |                   | ⽉                  |            \u2f49 | KANGXI RADICAL MOON                      |
|       244 |        f4 |                   | 日                  |            \u65e5 | CJK UNIFIED IDEOGRAPHS 65E5              |
|       245 |        f5 |                   | 千                  |            \u5343 | CJK UNIFIED IDEOGRAPHS 5343              |
|       246 |        f6 |                   | 万                  |            \u4e07 | CJK UNIFIED IDEOGRAPHS 4E07              |
|       247 |        f7 |                   | £                  |            \u00a3 | POUND SIGN                               |
|       248 |        f8 |                   | ¢                  |            \u00a2 | CENT SIGN                                |
|       249 |        f9 |                   | ±                  |            \u00b1 | PLUS-MINUS SIGN                          |
|       250 |        fa |                   | ∓                  |            \u2213 | MINUS-OR-PLUS SIGN                       |
|       251 |        fb |                   | ₀                  |            \u2080 | SUBSCRIPT ZERO                           |
|       252 |        fc | User Defined #1   | ➀                  |            \u2780 | DINGBAT CIRCLED SANS-SERIF DIGIT ONE     |
|       253 |        fd | User Defined #2   | ➁                  |            \u2781 | DINGBAT CIRCLED SANS-SERIF DIGIT TWO     |
|       254 |        fe | User Defined #3   | ➂                  |            \u2782 | DINGBAT CIRCLED SANS-SERIF DIGIT THREE   |
|       255 |        ff | User Defined #4   | ➃                  |            \u2783 | DINGBAT CIRCLED SANS-SERIF DIGIT FOUR    |
