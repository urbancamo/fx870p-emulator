# Sorcerers Cave

We will be implementing a traditional board game call Sorcerers Cave in Casio JIS Standard Basic.
The rules for the board game are here: reference/sorcerers-cave/sorcerers-cave-rules.md

We will tackle this in stages as it is a complicated project with many facets and issues.

## Requirements

1. Analyse the Sorcerers Cave board game rules and determine any gaps, ambiguities or inconsistencies in the rules that we need to fix before we can tackle the implementation.
2. Plan the high-level architecture of the implementation in stages, based on the main stages of the game. The plan should define the overall game structure including flowcharts and other diagrams to confirm that the game is fully understood and implemented.
3. Decide on suitable data structures for the static data in the game.
4. Decide on suitable data structures to store the state of the game.
5. Plan each phase of the game.
6. Plan each interaction that the user will have with the game to make best use of the limited screen size.
7. Start implementing the game.

## Restrictions

1. The game should fit into the 32KB of available memory on the Casio VX-4.
2. Interaction should always be optimized for the 4 row by 32 column display.
3. Make use of GOSUB based sub-routines to provide a clean architecture and allow re-use of subroutines.
4. Use line number increments of 10 to allow for BASIC lines to be inserted if required without renumbering.

