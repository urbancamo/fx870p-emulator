# Conway's Game of Life

A Casio BASIC implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) for the FX-870P / VX-4, written by Claude (Anthropic).

## The Grid

The FX-870P LCD has a 32-column by 4-row text display. The program uses a **31x4 toroidal grid** — the edges wrap around so the top connects to the bottom and the left connects to the right. Each cell is displayed as a filled block (`CHR$(135)`) when alive or a space when dead.

Two arrays are used: `G(30,3)` holds the current generation and `H(30,3)` holds the next generation being computed. After all cells are evaluated, `H` is copied back to `G` and the display is redrawn.

## Preset Patterns

The program offers four starting configurations via a menu:

| Key | Pattern         | Description                                                                                                          |
|-----|-----------------|----------------------------------------------------------------------------------------------------------------------|
| 1   | **Glider**      | The classic 5-cell spaceship that travels diagonally across the grid, wrapping around the toroidal edges             |
| 2   | **Blinkers**    | Three period-2 oscillators spaced across the grid, each alternating between a horizontal and vertical bar of 3 cells |
| 3   | **R-pentomino** | A 5-cell methuselah pattern placed at the centre of the grid — chaotic growth before eventually stabilising          |
| 4   | **Random**      | Each cell has a 25% chance of starting alive, using `RAN#`                                                           |

## How It Works

Each generation follows the standard Game of Life rules:

1. A **live cell** with fewer than 2 or more than 3 neighbours dies
2. A **live cell** with 2 or 3 neighbours survives
3. A **dead cell** with exactly 3 neighbours becomes alive

Neighbour counting uses modular arithmetic (`MOD 31` for X, `MOD 4` for Y) to wrap at the edges, giving the toroidal topology.

## Running It

1. Load the program into the emulator via **LOAD** or type it in manually
2. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**
3. Select a pattern (1-4) from the menu
4. Watch the simulation run — press **any key** to stop

The simulation runs at the native CPU clock speed (921 kHz), which is quite slow for the nested loops involved. Click **TURBO** in the toolbar to run at ~50x speed for a much smoother experience.

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-40     Initialisation, menu, and pattern selection
Lines 100-104   Display the grid
Lines 110-112   Poll for keypress to exit
Lines 120-135   Count neighbours and apply rules
Lines 140-142   Copy next generation to current
Line 150        Loop back to display
Lines 500-654   Pattern subroutines (Glider, Blinkers, R-pentomino, Random)
```
