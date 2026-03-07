# HFG Bracing Calcs

## Purpose

This program calculates fabrication dimensions for tubular steel braces and
stubs used in offshore oil and gas jacket structures (fixed steel platforms).
"HFG" likely stands for **Heerema Fabrication Group** or a similar heavy
fabrication yard.

In offshore jacket construction, large-diameter tubular steel members (chords,
legs) are connected by smaller-diameter bracing tubes welded at various angles.
Fabricating these connections requires precise calculations of brace length,
weld joint positions, and material quantities. This program automates those
calculations for the pipe fitter or fabrication engineer working on site.

## What It Calculates

### Inputs

- **Brace or Stub**: A brace connects two chord members (two ends), while a
  stub is a short connection piece with only one profiled end (the other is a
  straight 90-degree cut).
- **Brace diameter (BD)**: Outside diameter of the brace tube.
- **Wall thickness (WT)**: Pipe wall thickness; used to derive the bore radius
  (BRI = BD/2 - WT).
- **Can diameter C(N)**: The diameter of the chord (the larger tube the brace
  welds onto) at each end. Enter 0 or press EXE for a straight cut.
- **Weld prep (Y/N)**: Whether the end has a weld bevel preparation. This
  affects whether dimensions are taken to the bore (inside) or outside of the
  brace wall.
- **Included angle I(N)**: The angle between the brace and chord axes at each
  end (0-90 degrees).
- **Offset O(N)**: Lateral offset of the brace centreline from the chord
  centreline (for eccentric connections).
- **Intersection centres (CTRS)**: The work-point-to-work-point distance
  (centre-to-centre of the chords).

### Outputs

- **BRACE LENGTH (LGTH)**: The overall cut length of the brace tube.
- **BRACE WEIGHT (WGHT)**: Estimated weight in kilograms, calculated from the
  mean circumference, length, wall thickness, and steel density (7.85 g/cm3).
- **SURFACE AREA (SA)**: External surface area in square metres (for coating
  and painting estimates).
- **O/ST POINTS (JESCO)**: Outer set-off points distance - the distance between
  the joint extremity set-off (JESCO) marks.
- **INI LENGTH (HGG)**: The plain (unintersected) length of brace between the
  joint profiles at each end - the "Hot Gap Gauge" length.
- **SOP TO JES**: Set-off point to joint extremity set-off distance for each
  end. This is the distance from the work point to where the profile cut begins.
- **JES TO HGG**: Joint extremity set-off to the start of the plain brace
  section. With reverse prep noted where applicable.
- **TRAVEL**: For 90-degree stubs, the saddle profile travel distance.
- **REV PREP**: Flags when a reverse weld preparation is needed (at shallow
  angles <= 37.5 degrees the standard weld prep geometry inverts).

## Geometric Model

The program models the intersection of two cylinders (brace and chord) in 3D,
projected along the brace axis. Key geometric relationships:

- **LA**: Half-chord radius divided by sin(angle) - the slant distance from
  the brace centreline to the chord surface along the brace axis.
- **LB**: Bore radius divided by tan(angle) - the axial projection of the
  weld prep bevel.
- **LC**: Wall thickness divided by tan(angle) - the axial length of the weld
  prep region.
- **O1**: Chord surface offset correction for eccentric connections, derived
  from the chord radius and offset using Pythagoras.

The subroutine at line 3400 iterates around the brace circumference in degree
steps (first coarse at 5-degree increments, then refined at 1-degree) to find
the maximum additional length (PLUS) required at each end due to the
intersection profile. This is the point on the saddle cut where the brace
extends furthest beyond the nominal intersection.

## Symmetry Optimisation

If the user enters a negative can diameter for end 2, the program assumes both
ends are identical (SYM=1) and copies all parameters from end 1, avoiding
redundant input and calculation.

## Historical Context

Programs like this were essential tools for pipe fitters and fabrication
engineers at offshore construction yards in the 1980s and 1990s. The Casio
FX-850P/870P pocket computers were popular on fabrication shop floors because
they were portable, programmable, and robust. This program would have been used
daily to calculate dimensions for marking up and cutting brace tubes before
welding them into jacket nodes.

---

## How To Use

### Overview

Run the program and follow the prompts. The program operates in three phases:
input, calculation, and output. Invalid entries produce a BEEP and re-prompt.

### Step-by-Step Instructions

#### 1. Select Brace or Stub

The program displays:

```
Brace or Stub
```

Press **B** for a brace (two profiled ends) or **S** for a stub (one profiled
end, one straight cut at 90 degrees).

- **Brace**: The tube connects two chord members. You will be prompted for
  details at both ends (End 1 and End 2).
- **Stub**: The tube has a profile cut at one end only. End 2 is automatically
  set to a 90-degree included angle.

#### 2. Enter Brace Diameter

```
BRACE DIA
```

Enter the **outside diameter** of the brace tube in millimetres. Must be
greater than zero.

#### 3. Enter Wall Thickness

```
WALL THICKNESS
```

Enter the pipe wall thickness in millimetres. Must be greater than zero and
less than half the brace diameter. The program calculates the bore radius
(inside radius) as:

```
BRI = (BD / 2) - WT
```

#### 4. Enter End Details (repeated for each end)

For each end (1 and 2 for a brace, just 1 for a stub), the program prompts
for the following:

##### 4a. Can Diameter

```
END 1 CAN DIA
EXE=STR CUT
```

Enter the **outside diameter** of the chord tube that this end welds onto.

- Enter a positive value for a profiled (saddle) cut onto a chord.
- Press **EXE** (entering 0) for a straight cut with no chord intersection.
- For End 2 only: enter a **negative value** to make both ends identical
  (symmetric brace). The program copies all End 1 parameters to End 2 and
  skips the remaining End 2 prompts.

##### 4b. Weld Preparation

```
END 1 WELD PREP Y or N
```

Press **Y** if the end will have a weld bevel preparation, or **N** if not.

- **Y (with prep)**: Dimensions are calculated to the bore (inside surface)
  of the brace, as the weld prep removes material from the outside edge.
- **N (no prep)**: Dimensions are calculated to the outside surface of the
  brace.

##### 4c. Included Angle

```
END 1 INCLUDED ANGLE
```

Enter the angle in degrees between the brace axis and the chord axis at this
end. Must be between 0 (exclusive) and 90 (inclusive).

- 90 degrees = brace perpendicular to chord (a stub connection).
- Shallow angles (below 37.5 degrees) with weld prep trigger a **REV PREP**
  (reverse preparation) warning, because the standard bevel geometry inverts
  at acute angles.

##### 4d. Offset (only if can diameter > 0)

```
END 1 OFFSET
```

Enter the lateral offset of the brace centreline from the chord centreline in
millimetres. Enter 0 for a concentric connection (brace centreline passes
through chord centreline). The program validates that the offset does not push
the brace bore outside the chord radius.

#### 5. Enter Intersection Centres

```
INTERS
```

Enter the **work-point-to-work-point** distance (CTRS) in millimetres. This is
the overall centre-to-centre dimension between the two chords, as taken from
the structural drawing. The program validates that this distance is long enough
to accommodate the joint profiles at both ends.

### Output Screens

The program displays results across multiple screens. Press any key or wait for
the display to advance.

#### Screen 1: Brace Dimensions

```
BRACE LENGTH = xxxx
BRACE WEIGHT = xxxx kg
```

- **BRACE LENGTH**: Overall fabrication length of the tube to be cut, in mm,
  rounded to the nearest mm.
- **BRACE WEIGHT**: Estimated weight in kg, based on:
  ```
  WGHT = average_length * PI * (BD - WT) * WT * 7.85 * 0.000001
  ```
  where 7.85 g/cm3 is the density of steel. The average length is the mean
  of the HGG and LGTH dimensions.

#### Screen 2: Surface Area

```
SURF. AREA= x.xxx
```

External surface area in square metres, for paint and coating quantity
estimates:

```
SA = average_length * PI * BD * 0.000001
```

#### Screen 3: Joint Set-Off Dimensions

```
O/ST POINTS (JESCO)= xxxx
INI LENGTH (HGG)= xxxx
```

- **JESCO** (Joint Extremity Set-Off to Chord): The distance between the
  outermost profile points on each end. Used for setting off reference marks
  on the brace.
- **HGG** (Hot Gap Gauge): The length of plain (unprofiled) brace between the
  two joint profiles. This is the section where the brace is a simple cylinder
  with no saddle cuts.

#### Screen 4: End 1 Marking Dimensions

```
SOP TO JES 1= xxxx
JES TO HGG 1= xxxx REV PREP
```

- **SOP TO JES**: Distance from the Set-Off Point (work point) to the Joint
  Extremity Set-off mark for End 1. This is measured along the brace axis
  from the nominal intersection point.
- **JES TO HGG**: Distance from the joint extremity set-off to the start of
  the HGG (plain section) for End 1. If a reverse weld prep is needed, "REV
  PREP" is appended.
- **TRAVEL** (displayed instead of JES TO HGG for 90-degree ends): The saddle
  profile travel distance for perpendicular stubs.

#### Screen 5: End 2 Marking Dimensions (braces only)

Same format as End 1, only displayed when the brace has two profiled ends
(EDS=2).

### Calculation Details

#### Core Geometry

For each end, the program computes intermediate values based on the
cylinder-to-cylinder intersection:

| Variable | Formula | Meaning |
|----------|---------|---------|
| BRI | (BD/2) - WT | Bore (inside) radius of the brace |
| O1(N) | (C/2) - sqrt((C/2)^2 - O^2) | Chord surface rise due to offset |
| LA(N) | (C/2) / sin(I) | Slant length from brace axis to chord surface |
| LB(N) | BRI / tan(I) | Axial projection of the bore at the included angle |
| LC(N) | WT / tan(I) | Axial length of the weld prep zone |

Where C is the chord diameter, I is the included angle, and O is the offset.

#### Set-Off Point Calculations

```
SJ(N) = LA(N) - LB(N) - O1(N) / sin(I(N))
JH(N) = LB(N) * 2 + O1(N) / sin(I(N))
```

If the included angle is <= 37.5 degrees with weld prep, the wall thickness
projection LC is added to JH.

#### Overall Dimensions

```
JESCO = CTRS - SJ(1) - SJ(2)
HGG   = JESCO - JH(1) - JH(2)
LGTH  = CTRS - LA(1) - LA(2) + LB(1) + LB(2) + PLUS(1) + PLUS(2)
```

#### Profile Iteration (PLUS Calculation)

The subroutine at line 3400 finds the maximum additional length needed at each
end due to the saddle profile. It sweeps around the brace circumference in
angular steps:

1. **Coarse search** (5-degree steps): Starting at 1 degree, it calculates the
   profile extension at each angle around the brace:
   - Project the brace bore point onto the chord surface using the offset and
     chord radius.
   - Compute the axial extension due to the intersection geometry.
   - Track the maximum value found (PLUS).
2. **Fine search** (1-degree steps): Once the coarse maximum is found, it
   backs up 4 degrees and refines with 1-degree increments to find the true
   peak.

At each angle ROT around the brace circumference:

```
A1 = BRI(N) * sin(ROT) + O(N)        (lateral position on chord)
B1 = sqrt(C(N)^2 - A1^2)             (chord surface depth via Pythagoras)
C1 = C(N) - B1                        (chord surface rise)
D1 = (BRI(N) - BRI(N)*cos(ROT)) / tan(I(N))  (brace curvature projection)
E1 = C1 / sin(I(N))                   (axial projection of chord rise)
F1 = E1 - D1                          (net additional length at this angle)
```

The maximum F1 across all angles gives PLUS(N) for that end.

### Worked Example

A typical brace connection:

1. Select **B** for Brace
2. Brace diameter: **324** (mm)
3. Wall thickness: **16** (mm)
4. End 1 can diameter: **1200** (mm)
5. End 1 weld prep: **Y**
6. End 1 included angle: **45** (degrees)
7. End 1 offset: **0** (concentric)
8. End 2 can diameter: **-1** (symmetric, copy End 1)
9. Intersection centres: **5000** (mm)

The program will calculate and display the brace length, weight, surface area,
and all marking dimensions needed for fabrication.
