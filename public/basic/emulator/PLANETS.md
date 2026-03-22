# Planetary Positions

An astronomical calculator that computes the positions of all major solar system bodies (Sun, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune) for any date and time, as seen from a given observer location on Earth.

## How It Works

Enter a date and time in Universal Time (UT), and the program calculates each body's position using the Meeus low-precision method — Keplerian orbital elements with an equation-of-center approximation. Results are displayed as equatorial coordinates (Right Ascension and Declination) and horizontal coordinates (Altitude and Azimuth) relative to the observer.

## Display

Each planet is shown on a single screen:

```
MERCURY              23h14m
Dec +21°30'
Alt+32°14' Az215°08'
←Prev →Next  Q=End
```

| Field | Meaning |
|-------|---------|
| RA (top right) | Right Ascension in hours and minutes (0h–23h59m) |
| Dec | Declination in degrees and arcminutes (±90°) |
| Alt | Altitude above horizon in degrees (negative = below) |
| Az | Azimuth in degrees clockwise from North (0°–360°) |

The degree symbol uses CHR$(223), the katakana semi-voiced mark (゜) which displays as a small circle.

## Controls

| Key | Action |
|-----|--------|
| ![→](../../../images/keys/standard/right.png) | Next planet |
| ![←](../../../images/keys/standard/left.png) | Previous planet |
| ![Q](../../../images/keys/standard/q.png) | Quit |
| ![R](../../../images/keys/standard/r.png) | Re-enter date |

## Input

The program prompts for four values:

| Prompt | Value |
|--------|-------|
| Y= | Year (e.g. 2024) |
| M(1-12)= | Month number |
| D(1-31)= | Day of month |
| Hr(UT)= | Hour in Universal Time (0–23) |

## Observer Location

The observer's latitude and longitude are stored in DATA statements at the end of the program (lines 960–963). The default is Greenwich Observatory, London:

```basic
962 DATA 51.4772,-0.0005
```

To change the location, edit this line with your coordinates:
- Latitude: positive = North, negative = South
- Longitude: positive = East, negative = West

## Accuracy

| Body | Typical error |
|------|--------------|
| Sun | < 0.5° |
| Mercury, Venus, Mars | < 1° |
| Uranus, Neptune | < 2° |
| Jupiter, Saturn | < 3° (no perturbation corrections) |

The algorithm uses Keplerian orbital elements from Meeus Table 31.A (J2000.0 epoch) with a truncated equation-of-center series. The main source of error for Jupiter and Saturn is the omission of the great inequality perturbation terms.

## Running It

1. Load via **LIB** or **LOAD**
2. On the calculator: `LOAD "COM0:6,N,8,1,N,N,N,N,N"` then **EXE**
3. Switch to BASIC mode and type `RUN`, press **EXE**
4. Enter the date and time when prompted

## About

Based on algorithms from Jean Meeus, *Astronomical Algorithms* (2nd edition). Uses J2000.0 orbital elements for all eight planets with equation-of-center approximation for the true anomaly. Coordinate conversions follow standard spherical astronomy: heliocentric ecliptic → geocentric ecliptic → equatorial (RA/Dec) → horizontal (Alt/Az).
