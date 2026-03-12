# BASIC Editor — User Guide

The BASIC panel provides a live listing of BASIC programs in emulator RAM,
with full editing capabilities and syntax-highlighted export.

## Opening the Panel

Click the **BASIC** button in the communications toolbar. The panel appears
below the emulator display showing all non-empty program slots (P0–P9).

## Viewing Programs

### Tabs

If multiple program slots contain code, a tab bar appears with buttons
**P0**, **P1**, etc. Click a tab to switch between programs.

### Live Refresh

By default the listing updates every second (**LIVE** mode). Click
**LIVE** to freeze the display; click **FROZEN** to resume polling.
Click **REFRESH** for a one-shot update.

### Syntax Highlighting

The listing is syntax-highlighted:

| Element | Color |
|---------|-------|
| Keywords (PRINT, GOTO, FOR…) | Blue |
| Functions (SIN, ABS, LEN…) | Purple |
| Operator keywords (AND, OR, NOT, MOD…) | Orange |
| String literals `"…"` | Green |
| Numeric literals | Yellow |
| Comments (REM, `'`) | Gray italic |
| Variables | Light gray |

### HEX Dump

Click **HEX** to toggle a raw hex dump of the file address table and
first bytes of each program slot. Useful for debugging tokenization.

## Exporting Programs

Click **EXPORT** (visible whenever a program is loaded) to copy the
current program to the clipboard in two formats simultaneously:

- **Plain text** — numbered listing (e.g. `10 PRINT "HELLO"`) for
  pasting into text editors
- **Rich HTML** — syntax-highlighted listing with dark background,
  suitable for pasting into Google Docs, Notion, Word, or any
  rich-text editor

The rich-text export preserves all syntax highlighting colors and uses
a monospace font for proper alignment.

## Editing Programs

### Entering Edit Mode

Click **EDIT** to enter edit mode. This:

- Freezes live polling (prevents external changes during editing)
- Makes each line clickable for in-place editing
- Shows an add-line input at the bottom
- Shows delete buttons on hover
- Enables the **IMPORT** button

Click **EDIT** again to exit edit mode and resume live polling.

### Editing a Line

Click any line's text to open an inline editor pre-filled with
that line's code. The editor provides syntax highlighting as you type.

- **Enter** — save changes (tokenizes and writes to RAM)
- **Escape** — cancel editing
- **Empty submission** — deletes the line

The line number cannot be changed in-place. To move a line to a
different number, delete it and add a new one.

### Adding Lines

The input at the bottom of the listing (marked with **+**) accepts
new lines in the format:

```
LINE_NUMBER BASIC_TEXT
```

For example: `50 PRINT "HELLO"`

- **Enter** — tokenize and insert at the correct sorted position
- Line numbers must be 1–65535
- If a line with that number already exists, it is replaced

The input clears after each successful insertion, ready for the
next line.

### Deleting Lines

Hover over any line to reveal an **×** button on the right. Click
it to delete that line immediately.

### Importing Programs

Click **IMPORT** to open a multi-line editor. Paste a full BASIC
listing (every line must start with a line number):

```
10 CLS
20 PRINT "HELLO WORLD"
30 END
```

- **Ctrl+Enter** — tokenize all lines and write the entire program
  to the current slot, replacing its previous contents
- **Escape** — cancel the import

### Error Handling

Errors appear in a red bar below the toolbar:

- **Tokenization errors** — unknown characters, invalid keywords
- **RAM overflow** — not enough free memory for the edit
- **Running program** — editing is blocked while BASIC is executing

## Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| Enter | Single-line editor | Submit edit |
| Escape | Any editor | Cancel edit |
| Ctrl+Enter | Import editor | Submit import |

## Limitations

### Token Round-Trip

The editor tokenizes BASIC text into the FX-870P's internal format
and writes it to RAM. The detokenizer then reads it back for display.
This round-trip is generally lossless, but:

- **Case** — all keywords are stored uppercase. `print` becomes `PRINT`.
- **Spacing** — the tokenizer strips spaces around keywords; the
  detokenizer does not re-insert them. `FOR I = 1 TO 10` may display
  as `FORI=1TO10` depending on how the original was entered.
  Programs entered via the calculator's keyboard include a leading
  space before the first keyword; programs entered via the editor
  do not. Both are functionally identical.
- **Line number references** — after GOTO, GOSUB, THEN, RESTORE,
  RESUME, and RUN, numeric arguments are stored as binary 16-bit
  references, not ASCII digits.

### Memory

- Edited programs share RAM with the emulator. The free RAM check
  uses the same boundary the ROM firmware uses (MEMEN vs RAMTOP at
  system address `0x18D1`).
- If a program grows beyond available RAM, the edit is rejected
  with an error message showing bytes needed vs. bytes free.
- All program slots (P0–P9) and file slots (F0–F9) are stored
  contiguously. Editing one slot shifts all subsequent slots in RAM.

### Concurrent Access

- Editing is blocked while BASIC is running (`MODE3 = 0x01`).
  Stop the program first.
- The CPU is only paused during the actual RAM write (a few
  microseconds), not for the entire edit session.
- RAM changes persist to IndexedDB automatically — edited programs
  survive page reloads.

### Unsupported

- **File slots (F0–F9)** — only program slots P0–P9 are listed
  and editable.
- **Password-protected programs** — passwords are ignored; all
  programs can be edited freely since you have direct RAM access.
- **Undo** — there is no undo for RAM writes. Use EXPORT before
  making destructive changes.

## Architecture

The editor is built from these modules:

| Module | Purpose |
|--------|---------|
| `src/emulator/basic-tokens.ts` | Shared keyword tables (PREFIX4–7), constants |
| `src/emulator/detokenize.ts` | Token bytes → BASIC text |
| `src/emulator/tokenize.ts` | BASIC text → token bytes |
| `src/emulator/ram-edit.ts` | RAM write operations, file table management |
| `src/editor/basic-highlight.ts` | Syntax highlighting (CSS classes + inline styles) |
| `src/editor/cm-basic-lang.ts` | CodeMirror language definition |
| `src/editor/cm-basic-theme.ts` | CodeMirror dark theme |
| `src/editor/BasicEditor.vue` | Reusable CodeMirror editor component |
| `src/components/BasicListPanel.vue` | Panel UI |

See `docs/basic-detokenizer.md` for the tokenization format reference
and `docs/plans/2026-03-12-basic-editor.md` for the original design plan.
