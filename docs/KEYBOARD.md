Only a pre-existing unused import in `emulator.ts` — nothing from our changes. The implementation is clean.

Here's a summary of what was implemented:

**PC keyboard → FX-870P key mapping** (sourced from Delphi `FormKeyDown` VK_ codes + `FormKeyPress` Letters string `FIRST=14, COUNT=66`):

| PC Key              | FX-870P Code        | Key                      |
|---------------------|---------------------|--------------------------|
| Escape              | 67                  | BRK/ON                   |
| Enter               | 81                  | EXE                      |
| Backspace / Delete  | 66                  | BS                       |
| Insert              | 12                  | INS                      |
| PageUp              | 13                  | red S (calculator Shift) |
| PageDown            | 3                   | CAPS                     |
| Arrow keys          | 8-11                | ↑↓←→                     |
| a-z / A-Z           | 14–22, 24–33, 35–41 | A–L, Q–P, Z–M            |
| `,`                 | 42                  | comma                    |
| `=`                 | 43                  | Z-row key 9              |
| Space               | 44                  | Space                    |
| `(` `)` `^`         | 59, 60, 61          | small key block row 3    |
| `7` `8` `9`         | 63, 64, 65          | numeric block            |
| `4` `5` `6` `*` `/` | 68–72               | numeric block            |
| `1` `2` `3` `+` `-` | 73–77               | numeric block            |
| `0` `.`             | 78, 79              | numeric block            |

**Also added:** `isInputFocused()` guard so keystrokes aren't intercepted when typing in UI input fields (e.g. the comm address field).