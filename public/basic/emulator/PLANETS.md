# Planetary Positions & Moon Phase

An astronomical calculator that computes the positions of all major solar system bodies (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune) for any date and time, as seen from a given observer location on Earth. The Moon display includes phase name and illumination percentage.

## How It Works

Enter a date and time in Universal Time (UT), and the program calculates each body's position. Planets use the Meeus low-precision method (Keplerian orbital elements with equation-of-center approximation). The Moon uses a simplified lunar theory (Meeus Chapter 47) with six longitude and four latitude correction terms. Results are displayed as equatorial coordinates (Right Ascension and Declination) and horizontal coordinates (Altitude and Azimuth) relative to the observer.

## Display

Each body is shown on a single screen with a 2x2 coordinate grid:

```
JUPITER *visible*
RA  07h05m      Dec +22°57'
Alt +45°47'     Az  246°52'
←Prev →Next  Q=End
```

The Moon screen shows phase information instead of the *visible* flag:

```
Moon Wax Cres 19%
RA  03h20m      Dec +23°35'
Alt +12°15'     Az  292°40'
←Prev →Next  Q=End
```

| Field | Meaning |
|-------|---------|
| RA | Right Ascension in hours and minutes (0h–23h59m) |
| Dec | Declination in degrees and arcminutes (±90°) |
| Alt | Altitude above horizon in degrees (negative = below) |
| Az | Azimuth in degrees clockwise from North (0°–360°) |
| *visible* | Shown for non-Moon bodies when altitude is 5° or more above the horizon |

The degree symbol uses CHR$(223), the katakana semi-voiced mark which displays as a small circle.

### Moon Phase Names

| Phase | Illumination | Elongation |
|-------|-------------|------------|
| New | 0–1% | near 0° |
| Wax Cres | 2–47% waxing | 0°–90° |
| 1st Qtr | 48–51% waxing | near 90° |
| Wax Gibb | 52–98% waxing | 90°–180° |
| Full | 99–100% | near 180° |
| Wan Gibb | 52–98% waning | 180°–270° |
| 3rd Qtr | 48–51% waning | near 270° |
| Wan Cres | 2–47% waning | 270°–360° |

## Controls

| Key | Action |
|-----|--------|
| ![→](images/keys/standard/right.png) | Next body |
| ![←](images/keys/standard/left.png) | Previous body |
| ![Q](images/keys/standard/q.png) | Quit |
| ![R](images/keys/standard/r.png) | Re-enter date |

## Navigation Order

Sun → Moon → Mercury → Venus → Mars → Jupiter → Saturn → Uranus → Neptune

## Input

The program prompts for four values with validation:

| Prompt | Value | Valid range |
|--------|-------|-------------|
| Year | Year (Gregorian) | 1583+ |
| Month | Month number | 1–12 |
| Day | Day of month | 1–31 |
| Hour | Hour in Universal Time | 0–23 |

Invalid entries display an error message and re-prompt.

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
| Moon | ~1° (simplified Meeus Ch.47) |
| Mercury, Venus, Mars | < 1° |
| Uranus, Neptune | < 2° |
| Jupiter, Saturn | < 3° (no perturbation corrections) |

Planet positions use Keplerian orbital elements from Meeus Table 31.A (J2000.0 epoch) with a truncated equation-of-center series. The Moon uses six ecliptic longitude correction terms and four latitude terms. The main source of error for Jupiter and Saturn is the omission of the great inequality perturbation terms.

## Running It

1. Load via **LIB** or **LOAD**
2. On the calculator: `LOAD "COM0:6,N,8,1,N,N,N,N,N"` then **EXE**
3. Switch to BASIC mode and type `RUN`, press **EXE**
4. Enter the date and time when prompted
5. Use arrow keys to browse through all 9 bodies

## About

Based on algorithms from Jean Meeus, *Astronomical Algorithms* (2nd edition). Planet positions use J2000.0 orbital elements with equation-of-center approximation. The Moon uses a simplified version of the lunar theory from Chapter 47. Coordinate conversions follow standard spherical astronomy: ecliptic → equatorial (RA/Dec) → horizontal (Alt/Az). Moon phase is computed from the geocentric elongation angle between Moon and Sun.
