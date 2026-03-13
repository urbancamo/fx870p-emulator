Here's the full analysis and implementation plan:

---

## Airline Manager — Casio FX-870P Port Plan

### Display Constraints: 32×4 characters

The Casio VX-4/FX-870P has **32 columns × 4 rows**. Every screen design must fit on those 4 lines. Positioning uses `LOCATE col,row`.

---

### BBC BASIC → Casio BASIC Conversion Rules

| BBC construct | Casio equivalent | Notes |
|---|---|---|
| `CHR$(141)` | *(remove)* | BBC double-height — doesn't exist |
| `GET$` / `LET A$=GET$` | `K$=INPUT$(1)` | Single keypress wait |
| `DEFPROC xxx` / `ENDPROC` | `GOSUB` / `RETURN` | All procedures become subroutines |
| `ON A GOTO ...` | Chain of `IF A=n THEN GOTO` | |
| `RND(1)` | `RAN#` | |
| `FOR L=1 TO 2000:NEXT L` | *(remove or replace with key wait)* | No need for delay loops |
| `PRINT:PRINT:PRINT` | *(remove)* | 4 rows — no blank line padding |
| `ON ERROR GOTO` | *(omit)* | Not supported |
| `RESTORE` / `READ` / `DATA` | Same | Casio BASIC supports these |
| `INPUT "prompt";A` | `LOCATE 0,3:PRINT "prompt":INPUT A` | Print on row 3, input on same row |
| Long menu items with spacing | Compact 2-column layout | See per-screen designs |

---

### Data Reduction Strategy

The original 23 airports with full names exceeds practical Casio string memory. **Reduce to 15 airports** (Chicago hub + 14 destinations) and cut event messages from 40 to 20. All 5 plane types stay.

---

### Screen-by-Screen Layout

#### 1. Title Screen (lines 20–160)
```
    AIRLINE MANAGER
    ===============
       by M.Wickens
    PRESS ANY KEY...
```
Remove all `CHR$(141)` double-print pairs. One clean 4-row display, then `K$=INPUT$(1)`.

---

#### 2. Main Menu (lines 160–400)
The BBC version has 8 items with blank lines — 20+ rows. Casio fits 6 functional items in a 2-column 3-row layout with a prompt on row 3:
```
1=SETUP  2=RUN BUSINESS
3=CO.VAR 4=COMP.VAR
5=HELP   6=EXIT
CHOICE(1-6)?
```
Items 3 (Set Company Variables) and 4 (Set Computer Variables) are shown but just show "NOT IMPLEMENTED" and return. Load/Save removed (no filesystem). Input via `INPUT A` on row 3, `IF A<1 OR A>6 THEN GOSUB <menu>`.

---

#### 3. Help System (lines 500–1540)
BBC help is a long scrolling text dump. **Convert to paginated screens**: one topic per screen, press any key to see next.

**Help index screen:**
```
          HELP
1=SETUP 2=RUN BIZ
3=COVAR 4=COMVAR
5=EXIT CMD  CHOICE?
```

**Each help topic:** 4 lines of brief text, row 3 = `PRESS ANY KEY`.
Example — Setup Company help:
```
SET UP COMPANY
Set up company before
playing. Spend your
money. [ANY KEY]
```
Abbreviated to fit. All 7 help topics become their own 4-row screens.

---

#### 4. Set Up Company (lines 1600–1760)
BBC runs through 5 data-init procedures then goes to VARSET (line 22000). For Casio:
- `PROCdata` → `GOSUB 10010` (loads plane data via READ/DATA)
- `PROCairports` → `GOSUB 10200` (loads 15 airport records)
- `PROCstocks` → `GOSUB 21000` (inline assignments)
- `PROCpropdata` → `GOSUB 13600` (inline assignments)
- `PROCcommset` → `GOSUB 19000` (loads 20 event strings via READ/DATA)
- GOTO 22000 (VARSET) → sets starting money/inventory then `GOSUB <status>`

**Intro screen:**
```
     SET UP COMPANY
Spend your starting
money how you wish.
PRESS ANY KEY...
```

---

#### 5. Status Screen — `PROCstatus` → `GOSUB 16000` (2 pages)

**Page 1 — Assets:**
```
PROP:MEDIUM  AC:TWIN JET
FUEL:100G  FOOD:10
MED:5  MACH:2
PRESS ANY KEY...
```
*(Row 0 max ~24 chars for two values — abbreviate property/plane names)*

**Page 2 — Money:**
```
       ACCOUNTS
DEPOSIT : $  15000
CURRENT : $   5000
PRESS ANY KEY...
```

---

#### 6. Options Menu — `PROCoptions` → `GOSUB 17000`
```
      OPTIONS
1=ACCOUNTS  2=STOCKS
3=PROPERTY  4=FUEL
5=PLANES    6=CONT.
```
Single-key input via `K$=INPUT$(1)`, dispatch with `IF` chain.

---

#### 7. Accounts — `PROCbank` → `GOSUB 10600`
Interest applied first, then:
```
     ACCOUNTS
DEP:$15000 AT 7%
CUR:$ 5000
1>CUR 2>DEP 3=SKIP
```
Input `K$=INPUT$(1)`. If K$="1" transfer from deposit→current, etc. After each transfer loop back to same screen.

Amount entry sub-screen (rows 3-only INPUT):
```
DEP:$15000 AT 7%
CUR:$ 5000
1>CUR 2>DEP 3=SKIP
AMOUNT? 
```
Use `INPUT A` on row 3 after `LOCATE 0,3:PRINT "AMOUNT? "`.

---

#### 8. Stock Exchange — `PROCbuy` → `GOSUB 11000`

**Overview screen:**
```
  STOCK EXCHANGE
FOODSTUFFS  B:$20 S:$15
MEDICINE    B:$35 S:$30
1=BUY 2=SELL 3=SKIP
```
*(Row 1-2 show all 3 stocks but third needs to fit — "MACHINERY  B:$50 S:$40" is 26 chars, fits.)*

Actually row 1–3 for 3 stocks:
```
  STOCK EXCHANGE
FOOD  BUY:$20  SELL:$15
MED   BUY:$35  SELL:$30
MACH  BUY:$50  SELL:$40
```
Then next screen for action:
```
1=BUY STOCKS
2=SELL STOCKS
3=SKIP TO NEXT SCREEN
CHOICE?
```

**Buy sub-screen:**
```
   BUY STOCKS
1=FOODSTUFFS (you:5)
2=MEDICINE   (you:3)
3=MACHINERY  CHOICE?
```
After choosing stock L: show `S$(L) PRICE:$xx AVAIL:nn` on row 0–1, `HOW MANY?` on row 3 via `INPUT A`.

**Sell sub-screen:** same structure, shows owned quantity.

---

#### 9. Property Market — `PROCproperty` → `GOSUB 13000`

**Main screen:**
```
   PROPERTY MARKET
1=BUY  2=SELL
3=SKIP TO NEXT SCREEN
CHOICE?
```

**Buy sub-screen:**
```
1=SMALL  $1000  2 SPACES
2=MEDIUM $4000  5 SPACES
3=LARGE  $9000 10 SPACES
CHOICE?
```
*(Each row ~26 chars — fits. Note: player can only own one property at a time — check `Y$(1)<>""` before allowing purchase.)*

**Sell sub-screen:**
```
   SELL PROPERTY
You own: MEDIUM ($4000)
1=SELL (-$500 fee)
2=SKIP  CHOICE?
```

---

#### 10. Fuel Market — `PROCfuel` → `GOSUB 14000`
Prices randomised each call:
```
    FUEL MARKET
YOUR RESERVES: 100 GAL
AVAIL:150G  BUY:$25/G
1=BUY 2=SELL 3=SKIP
```
After choice, amount entry on row 3: `INPUT A`. Validation and update, loop back.

---

#### 11. Plane Market — `PROCplanebuy` → `GOSUB 15000`

**Main screen:**
```
   PLANE MARKET
1=BUY  2=SELL
3=SKIP TO NEXT SCREEN
CHOICE?
```

**Buy — page 1 (planes 1-3):**
```
1=SINGLE PROP  $10,000
2=TWIN PROP    $30,000
3=SINGLE JET   $60,000
4=MORE... 5=CANCEL
```

**Buy — page 2 (planes 4-5):**
```
4=TWIN JET    $100,000
5=FOUR JET    $200,000
(NOTE: ONE PLANE ONLY)
CHOICE (4-5)?
```
*(Check `YP$(1)<>""` before buying — one plane limit. Check current account balance.)*

**Sell screen:**
```
   SELL PLANE
You own: SINGLE JET
Sell for $29750?
Y/N?
```
`K$=INPUT$(1)`, if `K$="Y"` then process sale.

---

#### 12. Orders — `PROCorders` → `GOSUB 18000`
Each airport that has a request is shown one at a time, player presses Y/N:
```
BLOOMINGTON-NORMAL
WANTS 5 FOODSTUFFS
AT $93 EACH
Y=ACCEPT  N=SKIP
```
Distance/range check and fuel check happen before showing. If all requirements met and player accepts, store order in `O$()` / `O()` arrays and break loop.

**No valid orders screen:**
```
      ORDERS
No suitable contracts
available this turn.
PRESS ANY KEY...
```

---

#### 13. Communications — `PROCcomm` → `GOSUB 23000`
Rolls 1-3 random events, shows them with damage values:
```
 COMMUNICATIONS
ROUGH LANDING      2 DMG
BIRD IN ENGINE     3 DMG
TOTAL:5  COST:$500
```
If total >10: special "crash cost $10,000" screen. If player can't afford it: game-over screen.

**Game Over screen:**
```
  GAME OVER
Insufficient funds for
repairs. GOODBYE!
PRESS ANY KEY...
```

---

#### 14. Start Business loop (lines 1800–1875)
`PROCoptions` → `PROCstatus` → `PROCorders` → `PROCcomm` → loop back to status.
On Casio this becomes:
```
GOSUB 17000  'options
GOSUB 16000  'status  
GOSUB 18000  'orders
GOSUB 23000  'communications
GOTO <loop start>
```
T counter increments each loop to age the game.

---

### Program Structure (Casio line numbers)

| Line range | Section |
|---|---|
| 1–9 | DIM array declarations |
| 10–19 | Title screen |
| 20–99 | Main menu |
| 100–199 | Help index + dispatcher |
| 200–299 | Help topic pages (one per 10 lines) |
| 400–499 | Start business loop |
| 1000–1099 | Set up company entry |
| 2000–2099 | VARSET (initialise game state) |
| 5000–5099 | Status screen (2-page) |
| 5100–5199 | Options menu |
| 5200–5399 | Accounts |
| 5400–5599 | Stock exchange |
| 5600–5799 | Property market |
| 5800–5999 | Fuel market |
| 6000–6199 | Plane market |
| 6200–6399 | Orders |
| 6400–6499 | Communications / damage |
| 9000–9099 | Data init: planes (READ/DATA) |
| 9100–9199 | Data init: airports (15 entries) |
| 9200–9299 | Data init: events (20 entries) |
| 9300–9399 | Data init: property/stocks |

---

### Key Implementation Concerns

1. **Airport name truncation**: Several BBC names exceed 32 chars when combined with order data. "UNIVERSITY OF ILLINOIS-WILLARD" must be shortened to fit row 0 alone. Plan for 16-char max airport name display.

2. **Array memory**: The BBC uses `Y5(23)`–`Y10(23)` (7 arrays × 23 = 161 elements) for order tracking. These can be reduced to 1D arrays indexed by the *accepted order* slot (only 1 active order at a time), so most become scalar variables.

3. **`ON A GOTO` removal**: The BBC uses `ON A GOTO 1600,1800,0,0,0,0,500,0` — replace every instance with an explicit `IF A=1 THEN GOTO ... : IF A=2 THEN GOTO ...` chain.

4. **Bug in original** (`PROCcomm` line 23170): `LET L=H(1)+H(2)+H(3)` — H() was set as random 0-39 *indices* into C1(), not the damage values themselves. The BBC code seems to intend `C1(H(1))+C1(H(2))+C1(H(3))`. Fix this when porting.

5. **Bug in original** (`PROCbuy` line 11490): `LET M(3)=M(3)-INT(S3(L)*M1(L))` — should multiply by `A` (quantity chosen), not `S3(L)`. Fix on port.

6. **Save/Load**: Omit entirely — no COM0 serial in a game context without a real host program. Menu entries 5/6 can display "NOT AVAILABLE ON CASIO".

# Post Implementation Report

Done. Here's what was delivered:

**`AIRMAN.BAS`** — 270 lines of Casio BASIC covering:
- Title screen → main menu → help system (4 topics)
- **Set Up Company**: loads all data via READ/DATA, then VARSET initialises $20K stake, stocks, fuel, turn counter
- **Business loop**: Options → Status (2 pages) → Orders → Communications → repeat
- **Options**: Accounts (with interest), Stock Exchange (buy/sell 3 commodities), Property Market, Fuel Market, Plane Market
- **Orders**: iterates 14 destinations by range/fuel, generates courier contracts, pays out immediately, consumes fuel
- **Communications**: 1–3 random inflight events from 20 messages, damage costs $100/point; crash > 10 damage = $10,000; game over if broke
- Game-over flag (`GV`) returns cleanly from subroutines to main menu

**Bugs fixed vs BBC original:**
1. Stock purchase used `S3(L)*M1(L)` (available qty × price) instead of `A*M1(L)` (purchased qty × price) — fixed
2. Communications summed event *indices* as damage, not *values* — fixed
3. Delivery income was never paid out — added
4. Sell plane used hardcoded "plane 2 price" — fixed to use actual purchase price

**`AIRMAN.md`** — full documentation with airport table, plane stats, and tips.