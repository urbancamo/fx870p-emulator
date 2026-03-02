# Airline Manager

A port of the BBC Micro game *Airline Manager* by M. Wickens, adapted for the Casio FX-870P / VX-4's 32×4 character display. Run a Chicago-based airline: buy planes and property, trade cargo, fly courier contracts, and survive random inflight events.

## Objective

Grow your airline from a $20,000 stake (split between deposit and current accounts) into a thriving operation. Buy property, acquire an aircraft, trade stocks, and fly courier jobs to earn money — but watch out for repair bills after each flight!

## Getting Started

1. From the main menu, choose **1=SETUP** to initialise the company
2. Transfer money from deposit to current (Accounts → 1>CUR)
3. Buy property first (Property Market) — you need it before you can buy a plane
4. Buy a plane (Plane Market) — choose one that fits your property's space
5. Buy fuel (Fuel Market) — you start with only 10 gallons
6. Choose **2=RUN BUSINESS** to start flying

## Main Menu

```
1=SETUP  2=RUN BUSINESS
3=CO.VAR 4=COMP.VAR
5=HELP   6=EXIT
CHOICE(1-6)?
```

| Choice | Action |
|--------|--------|
| 1 | Set up company — loads all game data and starts fresh |
| 2 | Run business — enter the business loop |
| 3/4 | Not implemented |
| 5 | Help screens |
| 6 | Exit |

## Business Loop

Each turn runs in this order:

1. **OPTIONS** — buy/sell assets before the flight
2. **STATUS** — see your current position (two pages: assets, then accounts)
3. **ORDERS** — find a courier contract and fly it
4. **COMMUNICATIONS** — receive random inflight events and pay repair costs

## Options Menu

```
      OPTIONS
1=ACCOUNTS  2=STOCKS
3=PROPERTY  4=FUEL
5=PLANES    6=CONT.
```

Press **6** to continue to the flight phase.

### Accounts

Interest is applied to your deposit account each visit. Transfer funds between deposit (earns interest) and current (used for purchases).

```
     ACCOUNTS
DEP:$15000 AT 7%
CUR:$5000
1>CUR 2>DEP 3=SKIP
```

### Stock Exchange

Buy and sell three commodities. Buy low, sell high — prices are fixed each game but markets have limited supply.

| Stock | Buy | Sell |
|-------|-----|------|
| FOODSTUFFS | $20 | $15 |
| MEDICINE | $35 | $30 |
| MACHINERY | $50 | $40 |

### Property Market

You must own property before buying a plane. Each property type limits which planes you can hangar.

| Property | Cost | Spaces |
|----------|------|--------|
| SMALL | $1,000 | 2 |
| MEDIUM | $4,000 | 5 |
| LARGE | $9,000 | 10 |

Selling property deducts a $500 fee.

### Fuel Market

Prices are randomised each visit. You need fuel to fly — check your reserves before accepting orders.

### Plane Market

You can own only one plane at a time. The plane must fit in your property (check the space requirement).

| Plane | Price | Cargo | Range | Spaces |
|-------|-------|-------|-------|--------|
| SINGLE PROP | $10,000 | 5 | 50 | 1 |
| TWIN PROP | $30,000 | 8 | 50 | 2 |
| SINGLE JET | $60,000 | 15 | 90 | 4 |
| TWIN JET | $100,000 | 20 | 90 | 5 |
| FOUR JET | $200,000 | 35 | 150 | 8 |

Selling a plane loses value over time: sell price = purchase price − (turn × $250).

## Orders

Available courier contracts depend on your plane's range and your fuel reserves. Farther airports pay more. Accepting a contract consumes fuel and earns the delivery fee immediately.

```
BLOOMINGTON
WANTS 3 MEDICINES
AT $318 EACH
Y=ACCEPT  N=SKIP
```

### Airports (Chicago hub + 14 destinations)

| Airport | Distance |
|---------|----------|
| SCHAUMBURG | 10 |
| MIDWAY | 15 |
| DUPAGE | 17 |
| CLOW INTL | 20 |
| LEWIS UNIV | 27 |
| AURORA MUNI | 30 |
| LANSING MUNI | 33 |
| FRANKFORT | 35 |
| MORRIS MUNI | 40 |
| DWIGHT | 50 |
| GT KANKAKEE | 55 |
| GIBSON CITY | 93 |
| PAXTON | 96 |
| BLOOMINGTON | 106 |

Fuel consumed per flight = distance ÷ 10 + 1 gallons.

## Communications

After each flight, 1–3 random events are reported. Each event has a damage rating; total damage × $100 is deducted from your accounts. If total damage exceeds 10, the repair bill is a flat $10,000.

```
 COMMUNICATIONS
ROUGH LANDING   2 DMG
BIRD IN ENGINE  3 DMG
TOTAL:5  COST:$500
```

If you cannot afford the repairs — **GAME OVER**.

## Tips

- Always keep enough fuel for at least one flight
- Deposit account earns interest (6–8%) — keep money there when not spending
- Farther airports pay much more per unit: BLOOMINGTON (D=106) vs SCHAUMBURG (D=10)
- A FOUR JET needs LARGE property (10 spaces) — budget $209,000 total
- Stock trading provides a steady side income while building your fleet

## About

*Airline Manager* was written by M. Wickens for the BBC Micro and published in a games anthology. This port adapts the game for the Casio FX-870P / VX-4 32×4 display, reducing airports from 23 to 15 and events from 40 to 20. Two bugs in the original are corrected: the stock purchase cost calculation and the communications damage total. A delivery revenue mechanic has been added (the original accepted orders but never paid them out).