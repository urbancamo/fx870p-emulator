# Area ASCII Map Mockups

Display grid: 9 columns (22-30) × 4 rows (0-3) on the FX-870P LCD.

## Character Legend

| Char | Code | Definition                     | Use                          |
|------|------|--------------------------------|------------------------------|
| █    | 135  | ROM                            | Wall segment                 |
| ▒    | 134  | ROM                            | Wall accent (chamber)        |
| ↑    | 227  | ROM                            | North exit                   |
| ↓    | 229  | ROM                            | South exit                   |
| ←    | 228  | ROM                            | West exit                    |
| →    | 230  | ROM                            | East exit                    |
| ⇓    | 252  | DEFCHR$(252)="4050545040"      | Stairs down (user-defined 0) |
| ⇑    | 253  | DEFCHR$(253)="0414541404"      | Stairs up (user-defined 1)   |
| nC   |  —   | ROM                            | Creatures present (n=count)  |
| $    |  36  | ROM                            | Treasure present             |
| A    |  65  | ROM                            | Artifact present             |
| G    |  71  | ROM                            | Special: Gateway             |
| D    |  68  | ROM                            | Special: Deep Pool           |
| V    |  86  | ROM                            | Special: Viper Pit           |
| T    |  84  | ROM                            | Special: Tomb                |
| H    |  72  | ROM                            | Special: Great Hall          |

## Design Approach

- Chambers use alternating ▒█ walls — feels more open
- Tunnels use double ██ walls — narrower corridor feel
- Open exits shown as arrow in a gap in the wall
- Closed sides shown as solid wall segments
- Room contents (creatures, treasure, etc.) shown inside
- Stairs shown as ⇑ (CHR$(253)) or ⇓ (CHR$(252)) on row 2, distinct from exit arrows on walls

## Chamber Mockups

### Chamber: all 4 exits, stairs up, creatures + treasure

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  ▒        ↑     ▒  █
  1:  ←    2C     $     →
  2:           ⇑
  3:  █  ▒        ↓     ▒  █
```

Screen preview:

```
Lvl 2 Cha# 5 #12   █▒  ↑  ▒█
Ex:NESW ↑Up         ←2C $  →
Warrior Thief          ⇑
NESW Mv I A *       █▒  ↓  ▒█
```

### Chamber: N+E exits only, special (Gateway)

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  ▒        ↑     ▒  █
  1:  █        G        →
  2:  █                    █
  3:  █  ▒  █  ▒  █  ▒  █
```

Screen preview:

```
Lvl 1 GATEWAY #1    █▒  ↑  ▒█
Ex:NE               █  G   →
Warrior              █      █
NE Mv I A *         █▒█▒█▒█
```

### Chamber: dead end (no exits), treasure

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  ▒  █  ▒  █  ▒  █
  1:  █        $        █
  2:  █                    █
  3:  █  ▒  █  ▒  █  ▒  █
```

Screen preview:

```
Lvl 3 Cha#22 #8     █▒█▒█▒█
Ex:                  █  $   █
Dwarf                █      █
 Mv I A *           █▒█▒█▒█
```

### Chamber: S+W exits, stairs down, creatures

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  ▒  █  ▒  █  ▒  █
  1:  ←    3C              █
  2:           ⇓
  3:  █  ▒        ↓     ▒  █
```

Screen preview:

```
Lvl 2 Cha#14 #6     █▒█▒█▒█
Ex:SW ↓Dn           ←3C    █
Warrior Thief          ⇓
SW Mv I A *         █▒  ↓  ▒█
```

### Chamber: N+S exits, stairs up+down, treasure + artifact

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  ▒        ↑     ▒  █
  1:  █     $     A     █
  2:        ⇑  ⇓
  3:  █  ▒        ↓     ▒  █
```

Screen preview:

```
Lvl 1 Cha#31 #15    █▒  ↑  ▒█
Ex:NS ↑Up ↓Dn      █  $ A  █
Warrior Elf           ⇑⇓
NS Mv I A *         █▒  ↓  ▒█
```

## Tunnel Mockups

Tunnels use only 3 rows (0-2) — simpler than chambers.

### Tunnel: N-S straight through

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █        ↑     █  █
  1:  █  █              █  █
  2:  █  █        ↓     █  █
```

Screen preview:

```
Lvl 2 Tnl# 3 #4    ██  ↑  ██
Ex:NS               ██     ██
Warrior             ██  ↓  ██
NS Mv I A *
```

### Tunnel: E-W straight across

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █  █  █  █  █  █
  1:  ←                    →
  2:  █  █  █  █  █  █  █
```

Screen preview:

```
Lvl 1 Tnl#10 #7    █████████
Ex:EW               ←       →
Warrior Thief       █████████
EW Mv I A *
```

### Tunnel: N-E right angle

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █        ↑     █  █
  1:  █  █              →  →
  2:  █  █  █  █  █  █  █
```

Screen preview:

```
Lvl 2 Tnl#18 #9    ██  ↑  ██
Ex:NE               ██     →→
Warrior             █████████
NE Mv I A *
```

### Tunnel: N-W right angle

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █        ↑     █  █
  1:  ←  ←              █  █
  2:  █  █  █  █  █  █  █
```

Screen preview:

```
Lvl 3 Tnl#25 #11   ██  ↑  ██
Ex:NW               ←←     ██
Thief               █████████
NW Mv I A *
```

### Tunnel: S-E right angle

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █  █  █  █  █  █
  1:  █  █              →  →
  2:  █  █        ↓     █  █
```

Screen preview:

```
Lvl 1 Tnl# 7 #3    █████████
Ex:SE               ██     →→
Warrior             ██  ↓  ██
SE Mv I A *
```

### Tunnel: S-W right angle

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █  █  █  █  █  █
  1:  ←  ←              █  █
  2:  █  █        ↓     █  █
```

Screen preview:

```
Lvl 2 Tnl#33 #5    █████████
Ex:SW               ←←     ██
Dwarf               ██  ↓  ██
SW Mv I A *
```

### Tunnel: N-E-S three-way

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █        ↑     █  █
  1:  █  █              →
  2:  █  █        ↓     █  █
```

Screen preview:

```
Lvl 3 Tnl#40 #14   ██  ↑  ██
Ex:NES              ██      →
Warrior Elf         ██  ↓  ██
NES Mv I A *
```

### Tunnel: N-W-S three-way

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █        ↑     █  █
  1:  ←              █  █
  2:  █  █        ↓     █  █
```

Screen preview:

```
Lvl 1 Tnl#45 #10   ██  ↑  ██
Ex:NSW              ←      ██
Warrior             ██  ↓  ██
NSW Mv I A *
```

### Tunnel: N-E-W three-way

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █        ↑     █  █
  1:  ←                    →
  2:  █  █  █  █  █  █  █
```

Screen preview:

```
Lvl 2 Tnl#50 #6    ██  ↑  ██
Ex:NEW              ←       →
Thief               █████████
NEW Mv I A *
```

### Tunnel: S-E-W three-way

```
col: 22 23 24 25 26 27 28 29 30
  0:  █  █  █  █  █  █  █
  1:  ←                    →
  2:  █  █        ↓     █  █
```

Screen preview:

```
Lvl 3 Tnl#55 #2    █████████
Ex:SEW              ←       →
Warrior             ██  ↓  ██
SEW Mv I A *
```
