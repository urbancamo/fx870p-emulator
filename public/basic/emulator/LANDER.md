# Lunar Lander

A real-time lunar landing simulation adapted from Mark Wickens' Z88/BBC BASIC version (Summer 2010 Retrochallenge), converted for the Casio FX-870P / VX-4's 32x4 character display.

## Mission

You command the Lunar Excursion Module. Starting at 10,000m altitude in fast lunar orbit (500 m/s horizontal), you must:

1. **Brake** — tilt the lander and fire the engine to slow your horizontal speed
2. **Descend** — manage your vertical descent rate as you approach the surface
3. **Land** — touch down within 500m of the landing site with HSP and VSI below 6 m/s, then cut the engine

## Display

### Cruise Mode (altitude > 75m)

All 9 instrument values shown across the full display:

```
ALT: 10000 VSI: 0    FUL:25000
RNG:-30000 HSP: 500  THR: 0
TLT: 60   VTH: 0    HTH: 0
FUEL ASC RADAR   ENG RANGE
```

| Label | Meaning |
|-------|---------|
| ALT | Altitude (metres) |
| VSI | Vertical speed (negative = descending) |
| FUL | Fuel remaining |
| RNG | Range — distance from landing site |
| HSP | Horizontal speed |
| THR | Thrust / burn rate (0-100%) |
| TLT | Tilt / lander angle (-60 to +60 degrees) |
| VTH | Vertical thrust component |
| HTH | Horizontal thrust component |

### Radar Mode (altitude ≤ 75m)

Instruments compress to 2 rows. Row 3 shows horizontal tape gauges:

```
ALT: 45   VSI:-3   FUL: 3200
RNG: 120  HSP: 2   BR:40 LA:0
A:--->---------- V:---->-----
CONTACT          RANGE
```

The `>` marker on each tape slides to show your position:
- **A:** (ALT) — 0m at left, 75m at right
- **V:** (VSI) — 0 m/s at left, -10 m/s at right

## Controls

All controls are single keypress — no EXE needed:

### Thrust

| Key                                           | Action          |
|-----------------------------------------------|-----------------|
| ![0](../../../images/keys/standard/0.png)     | Engine cut (0%) |
| ![1](../../../images/keys/standard/1.png)     | Thrust 20%      |
| ![2](../../../images/keys/standard/2.png)     | Thrust 40%      |
| ![3](../../../images/keys/standard/3.png)     | Thrust 60%      |
| ![.](../../../images/keys/standard/dot.png)   | Thrust 100%     |
| ![+](../../../images/keys/standard/plus.png)  | Thrust +10%     |
| ![-](../../../images/keys/standard/minus.png) | Thrust -10%     |

### Attitude (Tilt)

| Key                                                                                 | Action                |
|-------------------------------------------------------------------------------------|-----------------------|
| ![4](../../../images/keys/standard/4.png)                                           | Tilt left 10°         |
| ![6](../../../images/keys/standard/6.png)                                           | Tilt right 10°        |
| ![7](../../../images/keys/standard/7.png)                                           | Fine tilt left 5°     |
| ![9](../../../images/keys/standard/9.png)                                           | Fine tilt right 5°    |
| ![5](../../../images/keys/standard/5.png) ![8](../../../images/keys/standard/8.png) | Vertical (angle = 0°) |

### Other

| Key | Action |
|-----|--------|
| ![*](../../../images/keys/standard/multiply.png) | Show key reference |
| ![R](../../../images/keys/standard/r.png) | Reset simulation |
| ![Q](../../../images/keys/standard/q.png) | Quit |

## Status Indicators (Row 4)

| Indicator | Meaning |
|-----------|---------|
| `FUEL` | Flashes when fuel below 3000 |
| `ASC` | Lander is ascending (VSI > 0) |
| `RADAR` | Radar altimeter active (below 1000m) |
| `CONTACT` | Within 3m of surface |
| `ENG` | Engine off and no fuel remaining |
| `CUT!` | On surface — cut engine to complete landing |
| `RANGE` | Within 500m of landing site |

## Scoring

Landing is scored by smoothness: `100 / (HSP × VSI)`. Only awarded for successful landings within 500m of the site.

| Score | Rating |
|-------|--------|
| ~10 | Good |
| ~100 | Very good |
| 100+ | NASA material |

## Tips

1. At 60° angle and 100% burn, vertical descent rate stays constant
2. At 0° (vertical) and ~33% thrust, altitude holds steady
3. During braking, focus on slowing HSP to ~50 m/s first, then worry about position
4. Watch your fuel — there is no resupply
5. Use the TURBO button for real-time play speed

## Running It

1. Load via **LIB** or **LOAD**
2. On the calculator: `LOAD "COM0:6,N,8,1,N,N,N,N,N"` then **EXE**
3. Switch to BASIC mode and type `RUN`, press **EXE**
4. Press ![I](../../../images/keys/standard/i.png) for instructions or ![S](../../../images/keys/standard/s.png) to start

## About

Original Z88/BBC BASIC version by Mark Wickens, developed for the Summer 2010 Retrochallenge. See http://hecnet.eu/rc2010sc for more information. Adapted for the Casio VX-4's 32x4 display with horizontal tape gauges, number-pad controls, and real-time INKEY$ input.
