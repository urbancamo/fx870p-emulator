# RPN Calculator

An HP-style Reverse Polish Notation calculator with a classic 4-level stack (T, Z, Y, X). Enter numbers first, then apply operators — no parentheses needed.

## How to Use

RPN works differently from algebraic calculators. Instead of `3 + 4 =`, you type `3 ENTER 4 +`. The operands go on the stack first, then the operator consumes them.

### Display

```
T: 0                          Stack level 4
Z: 0                          Stack level 3
Y: 3                          Stack level 2
X: 4                          Stack level 1 (working register)
```

When entering a number, line 4 changes to an input prompt:

```
T: 0
Z: 0
Y: 3
>4.25_                        Number being entered
```

### Controls

| Key                                                                                                                                                                                                                        | Action |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| ![0](/fx870p-emulator/images/keys/standard/0.png) – ![9](/fx870p-emulator/images/keys/standard/9.png), ![.](/fx870p-emulator/images/keys/standard/dot.png)                                                                 | Enter digits |
| ![EXE](/fx870p-emulator/images/keys/standard/exe.png)                                                                                                                                                                      | Push number onto stack (ENTER) |
| ![+](/fx870p-emulator/images/keys/standard/plus.png) ![-](/fx870p-emulator/images/keys/standard/minus.png) ![*](/fx870p-emulator/images/keys/standard/multiply.png) ![/](/fx870p-emulator/images/keys/standard/divide.png) | Arithmetic — pops X and Y, pushes result |
| ![C](/fx870p-emulator/images/keys/standard/c.png)                                                                                                                                                                          | Clear X register and any partial entry |
| ![S](/fx870p-emulator/images/keys/standard/s.png)                                                                                                                                                                          | Swap X and Y registers |
| ![N](/fx870p-emulator/images/keys/standard/n.png)                                                                                                                                                                          | Negate — changes sign of X or current entry |
| ![BS](/fx870p-emulator/images/keys/standard/bs.png)                                                                                                                                                                        | Delete last digit of current entry |

### Examples

**Simple addition: 3 + 4 = 7**

1. Type ![3](/fx870p-emulator/images/keys/standard/3.png), press ![EXE](/fx870p-emulator/images/keys/standard/exe.png) — stack: Y=0, X=3
2. Type ![4](/fx870p-emulator/images/keys/standard/4.png), press ![+](/fx870p-emulator/images/keys/standard/plus.png) — stack: X=7

**Expression: (5 + 3) * 2 = 16**

1. Type ![5](/fx870p-emulator/images/keys/standard/5.png), press ![EXE](/fx870p-emulator/images/keys/standard/exe.png)
2. Type ![3](/fx870p-emulator/images/keys/standard/3.png), press ![+](/fx870p-emulator/images/keys/standard/plus.png) — X=8
3. Type ![2](/fx870p-emulator/images/keys/standard/2.png), press ![*](/fx870p-emulator/images/keys/standard/multiply.png) — X=16

**Complex: (10 - 3) / (2 + 5) = 1**

1. Type ![1](/fx870p-emulator/images/keys/standard/1.png) ![0](/fx870p-emulator/images/keys/standard/0.png), press ![EXE](/fx870p-emulator/images/keys/standard/exe.png)
2. Type ![3](/fx870p-emulator/images/keys/standard/3.png), press ![-](/fx870p-emulator/images/keys/standard/minus.png) — X=7
3. Type ![2](/fx870p-emulator/images/keys/standard/2.png), press ![EXE](/fx870p-emulator/images/keys/standard/exe.png)
4. Type ![5](/fx870p-emulator/images/keys/standard/5.png), press ![+](/fx870p-emulator/images/keys/standard/plus.png) — X=7, Y=7
5. Press ![/](/fx870p-emulator/images/keys/standard/divide.png) — X=1

**Duplicate with ENTER: 5^2 = 25**

1. Type ![5](/fx870p-emulator/images/keys/standard/5.png), press ![EXE](/fx870p-emulator/images/keys/standard/exe.png)
2. Press ![EXE](/fx870p-emulator/images/keys/standard/exe.png) again (duplicates X into Y) — Y=5, X=5
3. Press ![*](/fx870p-emulator/images/keys/standard/multiply.png) — X=25

## Stack Behaviour

The 4-level stack follows classic HP conventions:

- **ENTER** pushes the stack up (T is lost) and either accepts the current entry as X or duplicates X into Y
- **Operators** consume X and Y, push the result into X, and drop the stack (Z→Y, T→Z, T becomes 0)
- **Typing digits** after ENTER or an operator starts a new entry that will auto-push when the next operator is pressed

Division by zero is silently ignored — the stack is unchanged.

## Running It

Load from the emulator's library or type:

```
LOAD "RPNCALC.BAS"
RUN
```

## Program Structure

```
Lines 1-3       Title and comments
Lines 10-15     Splash screen with key guide
Line 20         Initialise stack and entry state
Lines 100-150   Display — stack registers and input line
Lines 200-330   Key dispatch loop
Lines 400-430   ENTER — push stack, accept entry
Lines 450-490   Finish partial entry + drop stack (used by operators)
Lines 500-515   Negate (sign change)
Lines 520-550   Backspace during entry
Lines 560-590   Divide with zero-guard
```
