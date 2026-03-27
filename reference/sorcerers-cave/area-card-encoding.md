# Area Card Encoding Reference

Encoding: `N=1, E=2, S=4, W=8, C=16, U=32, D=64, Special=(type*128)`

Special types: 0=none, 1=Gateway, 2=Deep Pool, 3=Viper Pit, 4=Tomb of Kings, 5=Great Hall

| Idx | Card String | Special          | Encoded |
|-----|-------------|------------------|---------|
|   0 | `NSEWUD`    |                  |     111 |
|   1 | `NESC`      |                  |      23 |
|   2 | `NSWD`      |                  |      77 |
|   3 | `NESC`      |                  |      23 |
|   4 | `NSEWD`     |                  |      79 |
|   5 | `NSEWC`     | TOMB OF KINGS    |     543 |
|   6 | `NSEWC`     | THE GREAT HALL   |     671 |
|   7 | `NSEWC`     | DEEP POOL        |     287 |
|   8 | `NSEWC`     |                  |      31 |
|   9 | `NSEW`      |                  |      15 |
|  10 | `NSWC`      |                  |      29 |
|  11 | `NESC`      |                  |      23 |
|  12 | `NW`        |                  |       9 |
|  13 | `NES`       |                  |       7 |
|  14 | `NEW`       |                  |      11 |
|  15 | `NSEWC`     | VIPER PIT        |     415 |
|  16 | `NW`        |                  |       9 |
|  17 | `NEWU`      |                  |      43 |
|  18 | `NEWD`      |                  |      75 |
|  19 | `NW`        |                  |       9 |
|  20 | `NW`        |                  |       9 |
|  21 | `NSEWU`     | THE GATEWAY      |     175 |
|  22 | `NESU`      |                  |      39 |
|  23 | `NESD`      |                  |      71 |
|  24 | `ESW`       |                  |      14 |
|  25 | `NSEWC`     |                  |      31 |
|  26 | `NEWC`      |                  |      27 |
|  27 | `NSWC`      |                  |      29 |
|  28 | `NED`       |                  |      67 |
|  29 | `ESWC`      |                  |      30 |
|  30 | `ESW`       |                  |      14 |
|  31 | `NS`        |                  |       5 |
|  32 | `NSD`       |                  |      69 |
|  33 | `NSEWC`     |                  |      31 |
|  34 | `NESC`      |                  |      23 |
|  35 | `NSWC`      |                  |      29 |
|  36 | `ESWC`      |                  |      30 |
|  37 | `NSEWU`     |                  |      47 |
|  38 | `ESWU`      |                  |      46 |
|  39 | `NEW`       |                  |      11 |
|  40 | `NE`        |                  |       3 |
|  41 | `EWD`       |                  |      74 |
|  42 | `NSEWC`     |                  |      31 |
|  43 | `NE`        |                  |       3 |
|  44 | `ESWD`      |                  |      78 |
|  45 | `NEWC`      |                  |      27 |
|  46 | `EW`        |                  |      10 |
|  47 | `SWD`       |                  |      76 |
|  48 | `NESW`      |                  |      15 |
|  49 | `NES`       |                  |       7 |
|  50 | `NEWC`      |                  |      27 |
|  51 | `NSWU`      |                  |      45 |
|  52 | `NESC`      |                  |      23 |
|  53 | `NSW`       |                  |      13 |
|  54 | `NSW`       |                  |      13 |
|  55 | `SW`        |                  |      12 |
|  56 | `ESWD`      |                  |      78 |
|  57 | `EW`        |                  |      10 |
|  58 | `NS`        |                  |       5 |
|  59 | `SW`        |                  |      12 |
|  60 | `NSWC`      |                  |      29 |

Total: 61 cards

## BASIC DATA Statements (correct values)

```basic
8040 DATA 111,23,77,23,79
8050 DATA 543,671,287,31,15
8060 DATA 29,23,9,7,11
8070 DATA 415,9,43,75,9
8080 DATA 9,175,39,71,14
8090 DATA 31,27,29,67,30
8100 DATA 14,5,69,31,23
8110 DATA 29,30,47,46,11
8120 DATA 3,74,31,3,78
8130 DATA 27,10,76,15,7
8140 DATA 27,45,23,13,13
8150 DATA 12,78,10,5,12
8160 DATA 29
```
