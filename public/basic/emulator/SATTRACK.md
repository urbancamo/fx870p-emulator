# Satellite Tracker

## Overview

Single-satellite tracker ported from Alvin Banderas' BBC BASIC program for the Amstrad NC100/NC200. Simulates a 24-hour pass window using numerical integration of the satellite orbit. For each 15-minute interval the program checks whether the satellite is above the observer's geometric horizon and, if so, displays the pass details on the FX-870P's 32x4 LCD.

## How It Works

Euler-type (2nd-order Runge-Kutta) numerical integration propagates the orbit in 15-minute steps. Each 15-minute interval is itself divided into five 3-minute sub-steps to keep truncation error small. Gravitational acceleration is recomputed at the midpoint and endpoint of each sub-step, and the average is used to advance position and velocity.

For each step, the program checks whether the dot product of the satellite position vector and the observer position vector exceeds the squared Earth-surface distance — a fast geometric test for above-horizon visibility. Visible passes during twilight and night are displayed with compass bearing, elevation angle, altitude, velocity, and acceleration. Daytime passes (06:06–17:54 local) are silently skipped.

A local coordinate frame is built at the observer: Up (radial from Earth centre), North (Up cross East), and East (tangent to latitude circle). The satellite line-of-sight is projected onto this frame to derive azimuth and elevation.

## Input Parameters

| Prompt | Description | Units / Range |
|---|---|---|
| `Satellite` | Name label for display | Text |
| `Year` | Epoch year | e.g. 2026 |
| `Month(1-12)` | Epoch month | 1–12 |
| `Day(1-31)` | Epoch day | 1–31 |
| `Hour(0-23)` | Epoch hour (UTC) | 0–23 |
| `Min(0-59)` | Epoch minute (UTC) | 0–59 |
| `Long(-W)` | Observer longitude, negative = West | Degrees |
| `Lat` | Observer latitude, positive = North | Degrees |
| `X` | Satellite position X (ECI) | km |
| `Y` | Satellite position Y (ECI) | km |
| `Z` | Satellite position Z (ECI) | km |
| `Vx` | Satellite velocity X (ECI) | km/s |
| `Vy` | Satellite velocity Y (ECI) | km/s |
| `Vz` | Satellite velocity Z (ECI) | km/s |

Position and velocity are in the Earth-Centred Inertial (ECI) frame at the given epoch. For geostationary satellites the Z component is zero (or very small) and the position magnitude is ~42,164 km.

## Display

Each detected pass shows two screens in sequence. Press any key to advance.

**Screen 1 — Identity and Status**

```
#1 ASTRA 1M
20:30 13/3/2026
Altitude: 35793 km
Visibility: GOOD
```

**Screen 2 — Observation Data**

```
Azimuth:   177.8°
Elevation:  28.8°
Velocity:  3075 m/s
Accel: 0.000 m/s
```

`Visibility` shows `GOOD` during dawn (03:54–06:06) and dusk (17:54–20:06) twilight windows when the satellite may be sunlit against a dark sky. `POOR` means the pass is in full darkness (harder to see with the naked eye but fine for dishes). Daytime passes are not shown at all.

## Example: ASTRA 1M over Manchester

Observer: longitude -2.2, latitude 53.5 (Manchester, UK).
Epoch: any clear night, start of day.

| Parameter | Value |
|---|---|
| X | 42164 km |
| Y | 0 km |
| Z | 0 km |
| Vx | 0 km/s |
| Vy | 3.0747 km/s |
| Vz | 0 km/s |

Expected output (geostationary, so the same pass repeats every step):

| Field | Expected |
|---|---|
| Azimuth | ~177° (almost due South) |
| Elevation | ~28° |
| Altitude | ~35,793 km |
| Velocity | ~3,075 m/s |
| Acceleration | ~0.000 m/s² |

The source data for this test case is from the original Amstrad NC100/NC200 listing in `reference/sat-track/SAT_TRACK_AMSTRAD_NC100_200.TXT`.

## UK TV Satellites — Manchester Look Angles

| Satellite | Orbital Slot | Azimuth from Manchester | Elevation from Manchester |
|---|---|---|---|
| Astra 1 (SES) | 19.2° E | ~155° | ~26° |
| Astra 2 (Sky UK) | 28.2° E | ~163° | ~24° |
| Eutelsat Hot Bird | 13.0° E | ~150° | ~27° |

These are approximate geostationary look angles. Enter the published orbital longitude as the satellite's ECI X position scaled to 42,164 km and rotated by the longitude angle (X = 42164 * cos(lon), Y = 42164 * sin(lon), Z = 0, Vx = -3.0747 * sin(lon), Vy = 3.0747 * cos(lon), Vz = 0).

## Visibility

The FX-870P twilight filter mirrors what Alvin Banderas used in the original:

| Time window | `Vis` label | Meaning |
|---|---|---|
| 06:06–17:54 | (skipped) | Daytime — satellite not visible |
| 17:54–20:06 | `GOOD` | Dusk twilight — satellite in sunlight, sky darkening |
| 20:06–03:54 | `POOR` | Full night — satellite in shadow, naked-eye visibility poor |
| 03:54–06:06 | `GOOD` | Dawn twilight — satellite re-enters sunlight |

For dish-fed receivers visibility is irrelevant — only azimuth and elevation matter.

## Performance

The full 24-hour scan (96 quarter-hour steps, each with 5 integration sub-steps across 3 dimensions) takes approximately 3–5 minutes on the FX-870P running at its native clock speed. The screen shows `Scanning 24h...` during the run. A `BEEP` sounds for each visible pass found.

## Running It

Load from the emulator's Programs tab or type:

```
LOAD "SATTRACK.BAS"
RUN
```

Or from within BASIC:

![LOAD key](images/keys/standard/l.png) `"SATTRACK.BAS"` ![EXE key](images/keys/standard/exe.png)

## About

Original program by **Alvin Banderas**, written in BBC BASIC for the **Amstrad NC100/NC200** pocket computer (also compatible with the Sharp PC-1600 series). Ported to Casio FX-870P BASIC with the following adaptations:

- `ANGLE 1` selects radian mode (FX-870P default is degrees)
- `LOCATE col,row` replaces `CURSOR x,y`
- `INPUT$(1)` replaces `INKEY$` polling for keypress-to-continue
- Two-screen display layout fits the 32x4 character LCD
- Undefined variables `D2`/`M2`/`Y2` from the original replaced with `D`/`M`/`Y` (the already-entered epoch values)
- Array indices run 0–2 rather than 1–3 to match FX-870P `DIM` conventions
