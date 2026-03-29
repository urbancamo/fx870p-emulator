# Requirement

Withing the Sorcerers Cave game main turn display subroutine line 7510 I want to display a Casio ASCII visualization of the current area card the player is on.

We can use the columns 22-31 and rows 1-4 to display
the ascii representation.

In order to display the area you must unpack the current area variable into its' consituent parts, if not already available.

## Requirements for area/tile/card display

There are a number of features that we need to include in the tile CASIO visualization. You can use any of the characters available in the CASIO ascii character set.

### Chamber Card
 - display available exits (or lack of them must be visible) 
 - display stairs where present (up/down)
 - display if the chamber contains creatures
 - display if the chamber contains artifacts
 - display if the chamber contains treasure
 - display if the chamber is 'special'

### Tunnel Card
 - display in ascii the tunnel connections between exits.
 - there are right angles, straight across, straight down, or three exits

