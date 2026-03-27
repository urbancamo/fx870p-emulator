*back to [Table of Contents](index.md)*

# Supported Computer Models

The following Casio pocket computers run Casio JIS Standard BASIC. All share the HD61700 CPU and the same core BASIC language, but differ in memory capacity, display size, peripheral support, and available programming languages.

## Model Comparison

| Model | Base RAM | Max RAM | Display | Graphics | BASIC Lines | Lib | Languages | Katakana | RP Slots |
|-------|----------|---------|---------|----------|-------------|-----|-----------|----------|----------|
| FX-840P | 3,536 | 36,304 | 2-line | No | 2 | Fx? | | | 0 |
| FX-841P | 3,536 | 36,304 | 2-line | No | 2 | Lib? | STAT | | 0 |
| **FX-850P** | 3,536 | 36,304 | 2-line | No | 2 | Lib 116 | | Katakana | 1 |
| FX-860P | 21,456 | 54,224 | 2-line | No | 2 | Lib 116 | | | 0 |
| FX-860Pvc | 21,312 | 54,080 | 2-line | No | 2 | Lib 116 | CASL | | 1 |
| **FX-880P** | 21,456 | 54,224 | 2-line | No | 2 | Lib 116 | | Katakana | 1 |
| **FX-890P** | 51,180 | 83,948 | 4-line | Yes | 4 | Fx 3 | C, ASM, CASL | Katakana | 1 |
| **Z-1** | 18,412 | 51,180 | 4-line | Yes | 4 | Fx 3 | C, ASM, CASL | Katakana | 1 |
| Z-1GR | 18,412 | 51,180 | 4-line | Yes | 4 | Fx 3 | C, ASM, CASL | Katakana | 1 (RP-33) |
| VX-1 | | | 2-line | No | 2 | | | | 0 |
| VX-2 | 3,392 | 36,160 | 2-line | No | 2 | Fx 14 | CASL | Katakana | 1 |
| VX-3 | 3,355 | 36,123 | 4-line | No | 4 | Fx 3 | C, CASL | Katakana | 1 |
| **FX-870P** | 17,179 | 49,947 | 4-line | No | 4 | Fx 3 | C, CASL | Katakana | 1 |
| **VX-4** | 4,891 | 37,659 | 4-line | No | 4 | Fx 3 | C, CASL | Katakana | 1 (RP-33) |
| PB-1000 | | | 4-line | No | 4 | | ASM, CASL | | |

**Notes:**
- "Base RAM" is the free memory available for programs and data after system overhead
- "Max RAM" is the total usable memory with maximum RAM expansion installed
- "Lines" refers to the number of physical LCD display lines (the virtual screen is always 8 lines)
- "RP Slots" indicates the number of RAM expansion card slots

## Model Groupings

For the purposes of this manual, models are grouped by their BASIC command compatibility:

### FX-850P / FX-880P Group
The FX-850P (32KB) and FX-880P (64KB) are essentially the same machine with different memory capacities. They feature:
- 2-line LCD display (32 columns x 2 lines physical, 32 x 8 virtual)
- Cassette tape interface via FA-6
- PBLOAD/PBGET commands for PB-100 series tape compatibility
- VERIFY command for cassette tape verification
- SAVE#/LOAD# for data bank cassette operations

### FX-870P / VX-4 Group
The FX-870P and VX-4 are the same hardware with different branding. Key differences from the FX-850P/880P:
- 4-line LCD display (32 columns x 4 lines physical, 32 x 8 virtual)
- C language and CASL assembler support
- Additional BASIC commands: CHAIN, FILES, KILL, NAME, FORMAT, LINE INPUT#, PRINT USING
- Statistical functions: STAT, CNT, SUMX, SUMY, MEANX, MEANY, SDX, SDY, LRA, LRB, COR, EOX, EOY
- Hidden MODE110 instruction for machine language execution
- MODE200/201 for direct floppy disk sector I/O
- No cassette tape interface (RS-232C and floppy disk only)
- VERIFY, SAVE#, LOAD#, MERGE#, NEW# commands removed

### FX-890P / Z-1 Group
The FX-890P, Z-1, and Z-1GR add graphics capabilities not present in the other models:
- Graphics commands: LINE, DRAW, CALL, SWAP, WAIT, REV, NORM
- Port I/O: INP, INPORT, OUT, OUTPORT, POINT, TIMER
- No cassette tape interface
- LB error removed

## Peripheral Interfaces

| Interface | Models | Notes |
|-----------|--------|-------|
| FA-6 cassette interface | FX-850P, FX-880P, FX-860P, and earlier | 1200 bps, PB-700 compatible format |
| FA-7 cassette interface | PB-1000 | Up to 2400 bps, DIP switch selectable |
| RS-232C | All models | Serial communication; file transfer and printer output |
| Floppy disk | FX-870P/VX-4, FX-890P, Z-1 | Via external floppy drive unit |
| RAM expansion (RP-8/RP-33) | Models with RP slots | 8KB (RP-8) or 32KB (RP-33) additional RAM |

## Character Set Differences

The PB-1000 shares the PB-700 character set, which includes special graphics characters. The FX, VX, and Z series use a different extended character set with mathematical and scientific symbols instead. Both character sets share the standard ASCII range (0x20-0x7E).

## Internal Encoding

All models use ASCII for internal text encoding. BASIC keywords are stored as single-byte tokens, and line numbers are encoded differently from the earlier PB-700 series. Line numbers can range from 1 to 65,535 (earlier models were limited to 9,999). Programs saved in tokenized format on one model may not load directly on a different model group, though ASCII-format saves (using the `, A` option) are interchangeable.
