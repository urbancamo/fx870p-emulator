# Binary Search

A binary search demonstration adapted from a Tandy 100/102/200 BASIC program by Alvin Banderas. Converted to Casio BASIC for the FX-870P / VX-4.

## How to Play

The program has 10 hardcoded numbers. On startup it sorts them using bubble sort and displays them in order. You then enter a number to search for — the program uses binary search to find it (or report it's not present).

### Display

```
15 23 37 44 51 68 72 89 94 101   Sorted numbers
SEARCH FOR? (0=END)               Prompt
? _                               Input field
FOUND AT ORIG POS 5               Result
```

### Controls

- **Enter a number** and press **EXE** to search
- **Enter 0** to quit
- Press **any key** after seeing the result to search again

### What It Demonstrates

- **Bubble sort** — the 10 values are sorted in ascending order at startup
- **Binary search** — O(log n) search by repeatedly halving the search range
- **Original position tracking** — a parallel array `B()` tracks where each value was before sorting, so the result shows the original DATA position (1–10)

## The Data

The 10 values in original order:

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|----------|---|---|---|---|---|---|---|---|---|---|
| Value | 44 | 15 | 68 | 37 | 101 | 23 | 89 | 51 | 72 | 94 |

After sorting: 15, 23, 37, 44, 51, 68, 72, 89, 94, 101

## Running It

1. Load the program into the emulator via **LOAD** or **LIB**
2. On the calculator type `LOAD "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
3. Switch to BASIC mode (`MODE` then select BASIC) and type `RUN`, press **EXE**

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-12     Initialisation: arrays, read DATA
Lines 20-25     Bubble sort with parallel index tracking
Lines 100-112   Display sorted data and get search input
Lines 120-134   Binary search algorithm
Lines 150-161   Display result (found / not found)
Lines 300-303   Swap subroutine for sort
Line 400        DATA values
```

## About

Originally written for the Tandy 100/102/200 by Alvin Banderas. This version adapts the program for the Casio VX-4's 32×4 character display, replacing `INPUT "prompt"` syntax with `LOCATE`/`PRINT` and using `INPUT$(1)` for "press any key" continuation.
