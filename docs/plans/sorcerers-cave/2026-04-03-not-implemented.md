# Implementation Plan: Unimplemented Rules

Each entry below analyses a rule from the "Unimplemented / Partial" table in `public/docs/sorcerors-cave/game-logic.md`, describes how it could be implemented in SORCERER.BAS, and rates difficulty.

**Difficulty scale:** Easy (< 10 lines), Medium (10–30 lines), Hard (30+ lines or architectural change)

---

## 1. Earthquake destroying previous area

**Status:** Cosmetic message only; map not modified

**Rule:** The last area the party was in collapses and is impassable. If two earthquakes drawn together, the last two areas are destroyed.

**Implementation:**
- At line 2380 (earthquake handler), after the message, seal `PP` (previous area) by zeroing all exit bits: `MP(PP) = MP(PP) AND 896` (keep type bits, clear exits N/E/S/W/U/D).
- Also remove the exit from the current area that leads back to `PP` by clearing the corresponding directional bit in `MP(PA)` (same approach as the dead-end handler at 1710–1760).
- The area map renderer already reads `MP()` so the sealed area will show as inaccessible.
- Double earthquake: track earthquake count in the hazard loop (2050). If two earthquakes, also seal the area before `PP` — but this requires tracking the area before `PP`, which isn't stored. Could use a new variable or simply ignore double-earthquake (extremely rare in a 52-card deck with only 1 earthquake card — actually impossible in the current deck).

**Difficulty:** Easy — ~5 lines. Single earthquake is trivial. Double earthquake is impossible with current deck composition (only 1 earthquake card).

---

## 2. Healing Balm resurrection

**Status:** Searches for item but always says "No dead to heal"

**Rule:** In the hands of a Woman, Priest, or Wizard, restores life to any creature just killed. One use only.

**Implementation:**
- At line 4780 (heal handler), the current code searches for the balm but bails out.
- Need to: scan party for members with `PS=3` (dead, not yet cleaned up). This is the issue — dead members are cleaned up by GOSUB 2850 almost immediately after dying.
- **Key change:** after combat (line 3730 slain event), instead of immediately setting `PS=3`, or before calling cleanup at 3780, check if any party member carries Healing Balm ('G') AND is a Woman (CI=6), Priest (CI=4), or Wizard (CI=8). If so, prompt the player to revive the just-slain member.
- Remove the balm from the healer's inventory after use.
- This requires inserting logic mid-combat-loop, which is fiddly.
- Alternative: the rules say "at the beginning of a turn" — so the [A]rtifacts menu (line 4650) is the right place. Would need to track "last creature killed" (store index before cleanup removes it). On heal, restore `PS` from 3 to their previous status and re-insert into party.

**Difficulty:** Medium — ~15–20 lines. Main challenge is timing: need to either defer cleanup of dead members or track last-killed for later resurrection. The artifact menu approach is cleaner but needs a "recently dead" record.

---

## 3. Spectre from Treasure Chest

**Status:** Message only; no actual combat

**Rule:** Roll 2 on chest = Spectre attacks with magical power 5. Turn ends after one round. If not defeated, Spectre remains hostile in area.

**Implementation:**
- At the chest handler (line 4860–5020), the roll=2 branch currently just prints a message.
- Need to set up a one-round combat: create a temporary enemy (Spectre, CI=9, strength 5) and run one round of the match loop.
- Can reuse the combat subroutine (3490) but need to set up `DC()`, `ND`, `SL=9`, `NE=1`, `SU=0` (no surprise).
- If Spectre survives, store it in `RC$(PA)` so it persists as a hostile stranger.
- Spectres can only be fought with magical power or Magic Sword — this special rule isn't implemented in the main combat either, so it would fight normally for now.

**Difficulty:** Medium — ~15 lines. Setting up `DC()`/`ND`/`SL` for a one-enemy combat is mechanical but requires careful state management to avoid corrupting an in-progress encounter.

---

## 4. Lotus Dust (sleep effect)

**Status:** Sleep not implemented; reduces Sorcerer's strength by 2

**Rule:** Puts 1 creature to sleep for 2 turns. Works on Medusa but not Spectres, Ghouls, or Zombies. Sleeping creatures protected by a curse. One use only.

**Implementation:**
- Add a [L]otus option to the encounter menu (line 3030) and/or the combat continue/retreat menu (line 3840).
- When used: player selects a target enemy. That enemy is removed from combat for 2 rounds (mark with a flag, skip in matching loop).
- Track "sleep turns remaining" — could use a parallel array or pack into existing `DC()` encoding (e.g. add 1000 to sleeping creature's entry).
- After 2 rounds, creature wakes. If fight ends while asleep, creature stays in area (add to `RC$`).
- Consume the Lotus Dust from the user's inventory.
- Must validate: target not Spectre (CI=9), not from Ghouls hazard (CI=4 context).
- Medusa: could use before entering Medusa area, which would skip the Medusa roll entirely.

**Difficulty:** Hard — ~30+ lines. Sleep state tracking across rounds, UI for target selection, timing rules (before approach/before round), restrictions on valid targets, and Medusa interaction make this complex.

---

## 5. Magic Carpet (teleport)

**Status:** Not implemented

**Rule:** Commanded by Priest or Wizard, transports party to adjacent area (at right angles). Cannot retreat. One use. Won't exit cave.

**Implementation:**
- Add a [C]arpet option to the artifacts menu or the main turn input (line 110).
- Check party has Priest (CI=4) or Wizard (CI=8).
- Player selects direction (N/E/S/W/U/D). Calculate target coordinates. Check target isn't the cave exit.
- Place party at target area — either find existing area at those coords or draw a new area card.
- If new area has strangers, party cannot withdraw (remove [W] option for that encounter).
- Consume the carpet from inventory.
- "At right angles" in the board game means you can go in any direction perpendicular to your current facing — in the digital version, just allow any of the 6 directions.

**Difficulty:** Hard — ~25–30 lines. The movement/area-placement logic is complex (reusing parts of 1080–1600), and the "cannot withdraw" constraint requires a flag that modifies the encounter menu.

---

## 6. Strength Potion (combat bonus)

**Status:** Not implemented

**Rule:** Adds 2 to strength of Man, Woman, or Hero for duration of a fight. One use only.

**Implementation:**
- At combat setup (line 3490) or at the fight/retreat prompt (line 3840), add an option to use the potion.
- Before the first round (or any round), scan party inventories for 'I' (Strength Potion). If found and bearer is Man (5), Woman (6), or Hero (0), add 2 to their `YS` for all remaining rounds.
- Track "potion active" flag and "which party member" to apply the bonus in the YS calculation at line 3620.
- Consume from inventory after use.

**Difficulty:** Easy-Medium — ~10–12 lines. Straightforward bonus application. Main concern is adding the UI option mid-combat and tracking the bonus across rounds.

---

## 7. Talisman (ward off undead)

**Status:** Not implemented

**Rule:** Wards off Zombies and Ghouls. On level 4+, also wards off Spectres.

**Implementation:**
- In the ghoul handler (line 2520), before combat: scan all party inventories for 'H' (Talisman). If found, skip the ghoul fight entirely ("Talisman wards off the ghouls!").
- In the stranger encounter (line 2930), if strangers include Spectre (CI=9) and party has Talisman and level >= 4: remove Spectre from encounter.
- Zombies aren't implemented, so that part is moot.

**Difficulty:** Easy — ~5–8 lines. Simple inventory check before existing handlers.

---

## 8. Ring invincibility (level 4+)

**Status:** Not implemented

**Rule:** Bearer is invincible on level 4+. Die rolls indicating death are ignored. Also adds 1 to all party die rolls.

**Implementation:**
- The +1 die roll bonus: at line 3670 (party roll), check if any party member carries 'K' (Ring). If so, `YR = YR + 1`. Also apply to the stranger test at line 3200.
- Invincibility: at line 3740 (party member slain), if `PL >= 4` and the slain member carries 'K', skip the death (`PS` stays as-is, print "Ring protects!").
- The rules say the bonus applies to ALL die rolls in a round, even if bearer is slain — so check Ring presence at round start, not per-match.

**Difficulty:** Medium — ~12–15 lines. Two separate mechanics (die bonus + invincibility) each need their own check point.

---

## 9. Magic Staff (reanimation + Priest/Wizard bonus)

**Status:** Not implemented

**Rule:** +1 magical power for Priest, +2 for Wizard. In Wizard's hands, reanimates creatures turned to stone.

**Implementation:**
- **Strength bonus:** At line 3620 (party member strength calculation), after the Magic Sword check: if member carries 'J' (Magic Staff), add 1 if Priest (CI=4) or 2 if Wizard (CI=8) to `YS`. Only adds to CM (magical power) portion logically, but since `YS = CF + CM`, just add to `YS`.
- **Reanimation:** In the artifacts menu, add [S]taff option. Check a Wizard has the staff. Scan party for `PS=2` (stone). Restore their `PS` to 0 or 1.

**Difficulty:** Easy-Medium — ~10–15 lines. Strength bonus is trivial. Reanimation is a simple status flip but needs UI.

---

## 10. Lost Ruby (statue fight)

**Status:** Not implemented

**Rule:** Set in forehead of statue. Statue attacks strength 8. Must defeat it to win the jewel. If party retreats, statue attacks any future party entering.

**Implementation:**
- When the Lost Ruby treasure card (CI=11, CY=2) is drawn during treasure pickup, instead of normal pickup, trigger a special combat: statue with strength 8.
- Single match: one party member vs statue(8). If party wins, ruby goes to inventory. If loses, member is slain and ruby stays (mark area with a "statue aroused" flag).
- Need an area flag for "aroused statue" — could pack into `MR()` or use a separate variable.
- On re-entry to area with aroused statue, statue attacks immediately.

**Difficulty:** Medium-Hard — ~20–25 lines. Needs a special one-on-one combat, area state tracking for aroused statue, and re-entry trigger.

---

## 11. Dragon-slayer strength bonus

**Status:** PK flag tracked but bonus not applied in combat

**Rule:** Anyone who slays a Dragon single-handedly adds 1 to fighting strength. Can accumulate.

**Implementation:**
- At line 3730 (enemy slain), if `EC = 10` (Dragon) and it was a 1-on-1 match, increment `PK(MN)`.
- At line 3620 (party member strength), add `PK(MN)` to `YS`.
- The `PK()` array already exists and is tracked. Just need the two additions.

**Difficulty:** Easy — ~3 lines. The infrastructure is already there; just needs the bonus applied.

---

## 12. Leader priority order

**Status:** Uses first creature in draw order, not board game priority

**Rule:** Leader determined by priority: Spectre > Dragon > Wizard > Hero/W-Hero > Priest > Man/Woman > Giant > Ogre > Troll > Dwarf.

**Implementation:**
- At line 2940–3000 (leader selection), currently `SL` is set to the first creature found. Instead, assign a priority value to each creature type and pick the highest-priority.
- Priority table (CI → priority): Spectre(9)=10, Dragon(10)=9, Wizard(8)=8, Hero(0)=7, W-Hero(1)=7, Priest(4)=6, Man(5)=5, Woman(6)=5, Giant(12)=4, Ogre(2)=3, Troll(3)=2, Dwarf(7)=1, Sorcerer(11)=11, Unicorn(13)=0.
- Store in a DATA statement or inline IF chain. Compare as creatures are iterated.

**Difficulty:** Easy-Medium — ~10 lines. Need a priority lookup (DATA or conditionals) and a max-tracking loop replacing the current first-found logic.

---

## 13. Dwarf guides past traps

**Status:** Not implemented

**Rule:** Party with a dwarf may ignore a trap (but not two traps in same chamber).

**Implementation:**
- At line 2230 (trap handler), before falling: scan party for Dwarf (CI=7, any PS=0 or 1). If found and this is the first trap in this chamber, print "Dwarf guides past trap!" and skip the fall.
- Track "traps encountered this chamber" — add a counter variable `TP` reset to 0 on chamber entry (line 1770). Increment on each trap. If `TP > 1` even with dwarf, fall.
- Also per rules: if dwarf is killed in a fight in a chamber with a trap, party falls when leaving. This is more complex — would need to check on exit if trap was bypassed and dwarf is now dead.

**Difficulty:** Easy-Medium — ~8–12 lines for basic implementation. The "dwarf dies mid-fight then falls on exit" edge case adds complexity.

---

## 14. Mutineers joining strangers

**Status:** Removed from party but not added to room's stranger pool

**Rule:** Mutineers join any strangers in the chamber and can be retested.

**Implementation:**
- At line 2150 (mutiny handler), after setting `PS=3` for allies: for each mutineer, add their creature index to `RC$(PA)` as `CHR$(CI+65)`.
- This makes them persist as strangers in the room for re-encounter.
- If there are no existing strangers, the mutineers become the new stranger group.

**Difficulty:** Easy — ~5 lines. The `RC$` encoding already supports this; just need to append mutineer creature IDs.

---

## 15. Secret doors

**Status:** Not implemented

**Rule:** When a stairway leads to an area with no corresponding stairway pictured, one end is a secret door. Only discoverable by exploring from the visible end, being shown by another party, or using the Charmed Flute.

**Implementation:**
- This is a fundamental architectural feature. Currently stairs are bidirectional (`MS(a)=b, MS(b)=a`). Secret doors would make one direction discoverable only under conditions.
- Would need a "secret door knowledge" array — tracking which party knows about which hidden stairways.
- In solitaire play (which this is), this simplifies: once discovered from one end, you know both ends.
- Charmed Flute should reveal secret doors: scan all placed areas for stairs that connect to current level.
- The multi-party tracking aspect is irrelevant for solitaire.

**Difficulty:** Hard — ~30+ lines. Requires a new data structure for door visibility, modification of the vertical movement logic (1310–1350), and Charmed Flute integration.

---

## 16. Heavy treasure drop before combat

**Status:** Not implemented

**Rule:** Party members fighting hand-to-hand must drop heavy treasure (Silver/Gold/Gems). Treasure left on area card until fight resolved. If retreat, treasure left behind.

**Implementation:**
- At combat setup (line 3490), before the first round: for each party member, move heavy items (CI < 3, chars 'A','B','C') from `IV$()` to `RT$(PA)`.
- On victory (line 3890), offer to pick up dropped treasure (call GOSUB 2615).
- On retreat (line 3950), treasure stays in `RT$(PA)` — already the case since it says "Treasure left behind."
- Chest (CI=14, 'O') weighing 100kg should also be dropped.

**Difficulty:** Easy-Medium — ~10 lines. Move items from inventory strings to room treasure string, then offer pickup on victory.

---

## 17. Creature pairing in combat

**Status:** Always fights strongest enemy; no two-on-one mechanic

**Rule:** Player pairs creatures against enemies. If outnumbered, send one against two. If more party members, send two against one. Priests/Wizards can fight from background (magic only).

**Implementation:**
- This is the most complex unimplemented feature. Currently combat is fully automatic: each party member fights the strongest remaining enemy one-on-one.
- Full implementation would need:
  - UI for player to assign pairings (which party member vs which enemy)
  - Two-on-one mechanic: combine strengths
  - One-on-two: fight against combined strength
  - Background magic: Priest/Wizard contribute CM only to a front-line fighter
- On the FX-870P's 4-line display, a pairing UI would be very constrained.
- Simplified version: auto-pair by strength ranking (strongest vs strongest), allow 2-on-1 when outnumbering.

**Difficulty:** Hard — ~40+ lines. Complete combat UI redesign. Even a simplified auto-pairing version needs significant refactoring of the match loop (3610–3770). The priest/wizard background mechanic further complicates it.

---

## 18. Creature pairing in combat — Priest/Wizard background

Covered in #17 above. Included as part of the combat pairing system.

---

## Summary by difficulty

| Difficulty | Items |
|------------|-------|
| **Easy** (< 10 lines) | Earthquake (#1), Talisman (#7), Dragon-slayer bonus (#11), Mutineers joining strangers (#14) |
| **Easy-Medium** (10–15 lines) | Strength Potion (#6), Magic Staff (#9), Leader priority (#12), Dwarf past traps (#13), Heavy treasure drop (#16) |
| **Medium** (15–25 lines) | Healing Balm (#2), Spectre from Chest (#3), Ring invincibility (#8), Lost Ruby (#10) |
| **Hard** (30+ lines) | Lotus Dust sleep (#4), Magic Carpet (#5), Secret doors (#15), Creature pairing (#17) |

## Suggested implementation order

Start with easy wins that most improve gameplay:

1. **Dragon-slayer bonus** (#11) — 3 lines, infrastructure already exists
2. **Talisman** (#7) — 5 lines, meaningful defensive mechanic
3. **Mutineers joining strangers** (#14) — 5 lines, fixes incomplete mechanic
4. **Earthquake** (#1) — 5 lines, makes hazard meaningful
5. **Leader priority** (#12) — 10 lines, fixes incorrect rule
6. **Strength Potion** (#6) — 12 lines, useful combat option
7. **Heavy treasure drop** (#16) — 10 lines, adds tactical depth
8. **Magic Staff** (#9) — 15 lines, two useful abilities
9. **Ring invincibility** (#8) — 15 lines, powerful late-game mechanic
10. **Dwarf past traps** (#13) — 12 lines, gives Dwarf value
11. **Healing Balm** (#2) — 20 lines, complex timing
12. **Spectre from Chest** (#3) — 15 lines, completes chest mechanic
13. **Lost Ruby** (#10) — 25 lines, unique mini-encounter
14. **Lotus Dust sleep** (#4) — 30+ lines, complex state tracking
15. **Magic Carpet** (#5) — 30 lines, complex movement
16. **Secret doors** (#15) — 30+ lines, new data structure
17. **Creature pairing** (#17) — 40+ lines, combat system redesign
