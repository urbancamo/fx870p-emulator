# Requirement 1: Rules Analysis — Gaps, Ambiguities, and Inconsistencies

This document analyses the Sorcerer's Cave rules to identify issues that must be resolved before implementation as a solitaire computer game on the Casio VX-4.

## Scope Decision

The rules describe a 2-4 player competitive game with solitaire as a variant. For the VX-4 implementation, we will implement **solitaire play** as the primary mode. The rules state: "In solitaire play there is only one exploring party, and all rules governing turns and player interaction are ignored." This significantly simplifies the implementation by removing:

- Player interaction rules (trading, unions, fights between parties)
- Turn order management
- Multiple tokens on the map

We retain all exploration, combat with strangers, treasure, hazards, and scoring mechanics.

---

## 1. Gaps (Missing Information)

### 1.1 DRAGON and SPECTRE Point Values Missing

The creature table for Cave Creatures lists point values for most creatures, but **DRAGON**, **SPECTRE**, and **THE SORCERER** have blank point value fields.

- DRAGON: The rules say "Dragon-slayers have double value" — double of what? Presumably the dragon itself has a point value that is doubled when the slayer leaves the cave. The creature table shows fighting strength of 6, suggesting a point value of perhaps 6 or 10.
- SPECTRE: No point value listed. Spectres can only be fought with magical power (or magic sword), so having a point value seems appropriate.
- THE SORCERER: The rules say killing him gives a 30-point bonus. But does the Sorcerer card itself have a point value? Likely 0 (the bonus is the reward).

**Decision needed:** Assign point values to DRAGON and SPECTRE. Suggest: DRAGON = 10 (doubled to 20 for the slayer), SPECTRE = 5.

**CONFIRMATION:**
the point value is assigned at the end of the game, when either the character is part of the party
or it is an artifact or treasure carried out of the cave. Neither of these characters can be a member of the 
party, so no point value can be assigned. If it makes sense to clarify this in the rules please update them
so there is no longer any ambiguity. No point values assigned to any character. 

### 1.2 Medusa — Missing from All Tables

MEDUSA is referenced in the Hazard Cards section and the rules mention her multiple times (she turns creatures to stone, can be put to sleep with lotus dust, wizard with magic staff is immune). However:

- She is not listed in the Hazard Cards table — there's no card count
- She has no fighting strength or magical power listed
- The rules say she "attacks parties actually entering the chamber" but don't specify the attack mechanism

**Decision needed:** Define Medusa's mechanics. Based on the rules text:
- She is a hazard, not a creature (cannot be befriended)
- She turns creatures to stone (not killed — they can be revived by wizard with magic staff)
- She affects each creature individually on entry
- Suggestion: roll a die per creature, on 1-3 the creature is turned to stone. Wizard with magic staff is immune. Lotus dust puts her to sleep.
- Number in pack: 1

**CONFIRMATION:**
Medusa is effectively a Hazard card yes. I had missed the card description in the rules, which I've added now, so
hopefully that will fill in the gaps.

### 1.3 Vipers in the Viper Pit — Mechanics Unclear

The Viper Pit card is described as a special area with a narrow ledge, but the actual viper mechanics are vague:

- Do you roll to cross each segment of the ledge? If so, what happens on failure?
- The rules mention "treasure carried by a creature who falls off the ledge" — so creatures can fall. What triggers a fall?
- The charmed flute "lulls vipers to sleep" — does this make crossing safe?

**Decision needed:** Define viper pit crossing mechanics. Suggestion: roll a die per creature per segment. On a 1, the creature falls and is killed. Charmed flute makes crossing automatic (no roll needed). Treasure from fallen creatures stays in the pit.

**CONFIRMATION:**
You roll a die for each member of the party for each segment of the pit, for example if you want to cross after entering via the North entrance to the South entrance, you need to roll once for each party on the segment
North Exit to East Exit, then East Exit to South Exit.

If a creature falls they are lost in the pit and removed from the party. If the creature falls into the pit 
and treasure it is carrying remains in the pit, EXCEPT if any party has a charmed flute. This allows a party to retrieve treasure remaining in the pit.

### 1.4 Deep Pool — Swimming/Crossing Mechanics

The Deep Pool says "on the following turn you may cross the water and proceed through any doorway." But:

- Can all creatures swim? The rules don't say anyone drowns.
- Giants need extra turns for multiple loads — but what about non-giants carrying heavy treasure?
- Can creatures without heavy treasure cross freely?

**Decision needed:** Assume all creatures can cross the water. Only giants carrying heavy treasure need extra turns (1 extra turn per additional load beyond the first). Non-giants must drop heavy treasure at the doorway before crossing.

**Confirmation: ** yes this is my understanding of the rules.

### 1.5 Treasure Redistribution Timing

The rules say "A player may redistribute treasure among the creatures of his party at the beginning or end of a turn, provided the party is not involved in a fight at the time." But in solitaire, what counts as "beginning" or "end" of a turn when there's only one player?

**Decision needed:** Allow redistribution at the start of each turn (before movement) and after all events in a chamber are resolved. Not during fights.

**Confirmation**: yes that sounds right.

### 1.6 What Happens to Treasure When All Creatures Die?

If a creature carrying treasure is killed, the treasure is dropped in the current area. But what if a creature carrying the Eye of God is killed? The rules say a curse results if the Eye is left behind. Does the curse apply to a dead party?

**Decision needed:** In solitaire, if all creatures die, the game is over. No need to track curses post-death.

** Confirmation**: correct for solitaire. For multi-player games the treasure remains in the chamber in which  it is dropped.

### 1.7 WOMAN Creature Appears in Both Starting and Cave Tables

The WOMAN appears in both the Starting Creatures table (selection value 2, fighting strength 2, carries 25kg, "Befriends UNICORN") and... wait, there is also a WOMAN in the starting creatures with selection value 5, fighting strength 4, carries 50kg, "Has capabilities of WOMAN and HERO". That second entry appears to be mislabeled — it should be the **WOMAN-HERO** (or **HEROINE**) based on its capabilities matching the Cave Creature table entry for WOMAN HERO.

**Decision needed:** The second WOMAN entry in the Starting Creatures table (selection value 5, str 4, 50kg) is actually the WOMAN-HERO/HEROINE. Label it as such.

**Confirmation:** I've fixed the starting creatures table with label WOMAN-HERO.

---

## 2. Ambiguities

### 2.1 "Total Strength" vs "Fighting Strength" vs "Magical Power"

The rules define:
- **Total Strength** = Fighting Strength + Magical Power (shown in upper-right corner of card)
- **Fighting Strength** = physical combat ability
- **Magical Power** = magical combat ability

But the interaction is unclear in some cases:
- When a priest/wizard fights "hand-to-hand, using their total strength" — does this mean they use fighting strength + magical power combined?
- When they "remain in the background, adding their magical power" — is it just the magical power number that's added?

**Resolution:** Yes — hand-to-hand uses total strength (fighting + magical). Background uses magical power only. This is consistent with the example in the rules.

**Confirmation**: resolution is correct.

### 2.2 Who Fights the Spectre When No Magical Power Available?

The rules say: "In any round of a fight in which a party does not have any magical power to pit against a spectre, the strongest creature in the party must be matched against the spectre, and is automatically slain."

But what if the party has the Magic Sword? The rules also say: "Spectres cannot be fought hand-to-hand, except by a man, woman, or hero bearing the magic sword."

**Resolution:** If a party has a human creature with the Magic Sword, they can fight the Spectre using the sword (their fighting strength). If no Magic Sword and no magical power, the strongest creature is automatically slain.

**Confirmation**: resolution is correct.

### 2.3 Multiple Creatures vs Single Enemy — Who Dies?

When two creatures fight a single enemy and lose, the rules say "one of his creatures is slain. The player states which he prefers to remove from play; he then rolls a die and if the score is 4, 5, or 6 he gets his preference."

This means on a roll of 1-3, the OTHER creature dies. This is clear but worth confirming in the implementation.

### 2.4 Stairway Landing Position

"When a party descends a stairway... it goes to the approximate centre of an area directly underneath, and one level down."

But what if the area below is already placed and the landing position conflicts? The rules say plain markers show the relationship between levels. In a computer implementation, we need to define exactly how level connections work.

**Resolution:** Each stairway creates a connection between two specific areas on adjacent levels. The area below is drawn from the deck when first explored, and placed conceptually "below" the area above. The map for each level is independent — areas are connected by stairways, not by spatial position.

### 2.5 "Selection Value of 6" — Can You Underspend?

The rules say "a player may select available creatures with a total selection value of 6." Can you select fewer than 6 points' worth?

**Resolution:** Yes — the rules say "e.g. a priest and a woman, or a troll and two dwarves" (4+2=6, 4+1+1=6). You can underspend, but there's no strategic reason to do so. Allow any combination totaling up to 6.

### 2.6 Indifferent Strangers — "Three Rolls" in Solitaire

The solitaire rules say: "Strangers which remain indifferent after three rolls of the die stay indifferent for the rest of the game."

This is specific to solitaire and overrides the normal rules where you can keep testing. After 3 failed approach attempts, strangers become permanently indifferent (can't be befriended or made hostile).

### 2.7 Can You Attack Indifferent Strangers?

The normal rules say after strangers test indifferent: "in its next turn the party may test them again, or attack them, or leave." So yes, you can attack indifferent strangers. This should be an option in the implementation.

---

## 3. Inconsistencies

### 3.1 WOMAN Entry Duplication (Starting Creatures Table)

As noted in 1.7 above, there are two WOMAN entries in the Starting Creatures table. The second (selection value 5, str 4, carries 50kg, "Has capabilities of WOMAN and HERO") is clearly the WOMAN-HERO.

**Fix:** Rename the second entry to WOMAN-HERO.

### 3.2 TROLL Carrying Capacity Differs Between Tables

- Starting Creatures table: TROLL carries **15 kg**
- Cave Creatures table: TROLL carries **75 kg**

This is a significant difference. Starting trolls are weaker carriers than cave trolls?

**Decision needed:** This appears to be an error. The cave troll value of 75 kg seems more reasonable for a creature with fighting strength 4. Suggest using 75 kg for all trolls unless the designer intended starting trolls to be weaker.

**Confirmation**: 75KG is correct and has been fixed in the rules

### 3.3 Errata Note About Wizard Magical Power

The errata says "The magical power on one of the Wizard cards is given as 2, which should be 5." The Cave Creatures table shows WIZARD with magical power 5. This errata has been applied. However, the Wizard's total strength in the rules would then be 2 (fighting) + 5 (magical) = 7, which seems very powerful. Confirm this is intentional.

**Resolution:** The errata is already applied in the table. Total strength = 7 for wizards is intentional.

### 3.4 Number of DRAGON Cards

The Cave Creatures table lists DRAGON with "Number in Pack: 3" but the rules treat dragons as rare and significant encounters. Three dragons seems like a lot. However, this matches the original game design.

**Resolution:** Keep 3 dragons as per the table.

### 3.5 THE SORCERER — Hostile Table Shows 1-6

The reaction table for THE SORCERER shows "Hostile: 1-6" — meaning he is always hostile. The rules confirm: "it may not approach the Sorcerer or his companions to test them, as they will always be hostile." This is consistent but worth noting that the reaction test is unnecessary — encountering the Sorcerer always means fight or withdraw.

---

## 4. Solitaire-Specific Considerations

### 4.1 No Player Interaction

All rules about trading, unions, fights between parties, division of a party, and coordinating turns are irrelevant in solitaire. Remove from implementation scope.

### 4.2 Simplified Turn Structure

In solitaire, a turn is simply:
1. (Optional) Redistribute treasure
2. Choose a doorway/stairway to explore or move through
3. Draw area card if exploring
4. If chamber: draw small cards, resolve hazards, encounter strangers or take treasure
5. End of turn

### 4.3 Zombies Option

The zombie variant says "he forfeits one turn" — in solitaire this is meaningless (just skip a turn). Zombies could add interesting replayability. **Mark as optional/future feature.**

### 4.4 Victory Condition

Solitaire rules say: "The player may set his own conditions for victory, or simply try to better previous scores."

For the implementation, use the standard scoring system and track a high score. The game ends when:
- The party leaves the cave (score = points carried out, minus 30 per curse, plus sorcerer bonus)
- All creatures in the party die (score = 0)
- The player chooses to end the game

---

## 5. Summary of Decisions Required

| # | Issue | Suggested Resolution |
|---|-------|---------------------|
| 1 | DRAGON point value | 10 points (doubled to 20 for slayer) |
| 2 | SPECTRE point value | 5 points |
| 3 | THE SORCERER point value | 0 (30-point bonus for killing is separate) |
| 4 | Medusa mechanics | Hazard; die roll per creature, 1-3 = turned to stone; 1 in pack |
| 5 | Viper Pit crossing | Die roll per creature per segment, 1 = fall & die; flute = safe |
| 6 | Deep Pool crossing | All can cross; giants need extra turns for multiple heavy loads |
| 7 | Second WOMAN in starting table | Rename to WOMAN-HERO |
| 8 | TROLL carrying capacity | Use 75 kg for all trolls |
| 9 | Indifferent after 3 rolls (solitaire) | Permanently indifferent |
| 10 | Zombies | Optional/future feature, not in initial implementation |

---

## 6. Cards Inventory Summary

For implementation, the complete card counts are:

### Area Cards (Large Pack): 60 cards
(As listed in the table — 60 area cards including 1 GATEWAY, 1 DEEP POOL, 1 VIPER PIT, 1 TOMB OF KINGS, 1 GREAT HALL)

### Small Pack (Starting + Cave Creatures + Treasure + Hazards):

**Starting Creatures** (removed before play, used for party selection):
- 1 HERO, 1 WOMAN-HERO, 3 OGRE, 3 TROLL, 3 PRIEST, 6 MAN, 3 WOMAN, 3 DWARF = **23 cards**

**Cave Creatures:**
- 3 WIZARD, 3 SPECTRE, 3 DRAGON, 1 SORCERER, 3 OGRE, 2 TROLL, 1 UNICORN, 2 GIANT, 1 WOMAN-HERO = **19 cards**

**Heavy Treasure:**
- 6 SILVER, 6 GOLD, 3 GEMS = **15 cards**

**Artifacts:**
- 1 each of: MAGIC SWORD, MAGIC CARPET, LOTUS DUST, HEALING BALM, TALISMAN, STRENGTH POTION, MAGIC STAFF, THE RING, LOST RUBY, CHARMED FLUTE, EYE OF GOD, TREASURE CHEST = **12 cards**

**Hazards:**
- 1 MUTINY, 2 TRAP, 1 EARTHQUAKE, 1 MEDUSA, 1 GHOULS = **6 cards** (note: GHOULS count not specified in table, assumed 1)

**Total small pack (cave):** 19 + 15 + 12 + 6 = **52 cards**
**Starting creatures (set aside):** 23 cards
