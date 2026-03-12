# BASIC Program Editor

> Created: 2026-03-12
> Status: Implemented
> User Guide: `docs/basic-editor.md`

## Overview

Add in-place editing of BASIC programs to the BasicListPanel. Users can click a line to edit it, add new lines, delete lines, and have changes written directly to emulator RAM. This requires building a **tokenizer** (reverse of the existing detokenizer), a **RAM writer** with file-table management, and **UI changes** to the panel.

## Design Constraints

### Direct RAM Write Approach (chosen)

Write tokenized bytes directly into emulator RAM while the CPU is paused (`setCpuStop(true)`). The firmware re-reads the file address table on each BASIC operation (LIST, RUN, GOTO, etc.), so direct writes are safe as long as:

1. The CPU is stopped during the write
2. The file address table pointers are updated consistently
3. All program slots after the edited one are shifted if size changes

### Why Not Keystroke Injection?

Feeding keystrokes through `bufferKey()` would be firmware-safe but impractical: each key takes ~50ms (35ms hold + 15ms gap), so a 40-character line takes ~2 seconds. Multi-line edits would be painfully slow and fragile (timing-dependent, error recovery unclear).

### Persistence

RAM is already fully saved to IndexedDB (`memdef[RAM0_IDX].data`), so edited programs persist across reloads automatically.

## Architecture

### New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `codemirror` | Core editor framework | ~40-45 KB gzip total |
| `@codemirror/lang-javascript` | Not used directly — we use `@codemirror/language` StreamLanguage for a custom BASIC mode | (included in core) |

CodeMirror 6 packages needed:
- `codemirror` (meta-package: pulls in view, state, commands, search, autocomplete, lint)
- `@codemirror/language` (for `StreamLanguage` — the simple tokenizer path)
- `@codemirror/theme-one-dark` (dark theme matching the panel's `#111` background)

### New Files

| File | Purpose |
|------|---------|
| `src/emulator/tokenize.ts` | BASIC tokenizer — text to FX-870P token bytes |
| `src/emulator/ram-edit.ts` | RAM write helpers — write programs, shift slots, update file table |
| `src/editor/cm-basic-lang.ts` | CodeMirror StreamLanguage definition for FX-870P BASIC |
| `src/editor/cm-basic-theme.ts` | CodeMirror theme overrides to match the panel's dark UI |
| `src/editor/BasicEditor.vue` | Reusable Vue component wrapping a CodeMirror EditorView |

### Modified Files

| File | Change |
|------|--------|
| `src/emulator/emulator.ts` | Add `writeRamByte()` export |
| `src/emulator/detokenize.ts` | Export constants (`RAM_BASE`, `FILE_TABLE`, `NUM_SLOTS`) and `readWord()` for shared use |
| `src/components/BasicListPanel.vue` | Editor UI, edit/save/cancel/delete controls, uses `BasicEditor` |

## Component 1: Tokenizer (`tokenize.ts`)

### Input/Output

```typescript
interface TokenizedLine {
  lineNum: number;      // 1-65535
  bytes: Uint8Array;    // complete record: length + linenum(LE) + body + 0x00
}

function tokenizeLine(lineNum: number, text: string): TokenizedLine;
function tokenizeProgram(lines: { num: number; text: string }[]): Uint8Array;
```

### Tokenization Rules

Process the input text left-to-right, greedily matching the longest keyword at each position:

1. **Keyword matching** — At each position, try to match the longest keyword from all four prefix tables. Keywords are only matched at word boundaries (not inside variable names or strings). Match is case-insensitive; the calculator uppercases input anyway.

2. **String literals** — Inside `"..."`, emit raw Casio ASCII bytes. No keyword matching within strings.

3. **Colon `:` before ELSE** — When emitting ELSE (`0x07 0x48`), always prepend a hidden colon (`0x01`) unless one is already present. The firmware expects this.

4. **Line number references** — After GOTO, GOSUB, THEN, RESTORE, RESUME, and RUN, parse a decimal number and emit as `0x03` + 16-bit LE. If the token after these keywords is not a number, emit the text as-is (could be a variable or expression).

5. **REM / apostrophe** — After `REM` or `'`, emit the rest of the line as raw ASCII (no keyword matching).

6. **Unicode to Casio ASCII** — Reverse the `casioToUnicode()` mapping for any literal characters. Characters without a Casio mapping are an error.

7. **Record format** — Assemble: `[recLen] [lineNum_lo] [lineNum_hi] [body...] [0x00]` where recLen = 2 (linenum) + bodyLen + 1 (terminator).

### Keyword Lookup Table

Build a reverse map at module load from the existing `PREFIX4`–`PREFIX7` arrays in `detokenize.ts` (export them). Structure: `Map<string, [prefix_byte, code_byte]>`, sorted by keyword length descending for greedy matching.

Special cases:
- `HYP SIN`, `HYP COS`, etc. — match as two-word tokens, emit prefix `0x05` + codes `0x71`–`0x76`
- `INPUT` in prefix 6 (`0x06 0x9B`) vs no prefix 4 entry — context: `INPUT` as a statement uses the keyboard buffer, `INPUT` in prefix 6 is for `INPUT$()`. The tokenizer should emit prefix 6 only when followed by `$`, otherwise treat as a statement (no prefix — the original ROM stores `INPUT` as prefix `0x06 0x9B` in both cases; verify against hex dumps).

### Round-Trip Property

The tokenizer MUST satisfy: `detokenize(tokenize(text)) === normalize(text)` for all valid BASIC programs. "Normalize" means: uppercase, canonical spacing around keywords, line numbers as decimal. This is the primary correctness test.

## Component 2: RAM Editor (`ram-edit.ts`)

### Core Operations

```typescript
// Write a complete program to a slot, shifting other slots as needed
function writeProgram(slot: number, lines: TokenizedLine[]): void;

// Delete a single line from a slot
function deleteLine(slot: number, lineNum: number): void;

// Insert or replace a single line in a slot (by line number)
function upsertLine(slot: number, line: TokenizedLine): void;

// Clear a program slot entirely
function clearSlot(slot: number): void;
```

### File Table Management

The file address table at physical `0x118A7` contains 11 consecutive 16-bit LE pointers. P(n) occupies RAM from `pointer[n]` to `pointer[n+1]`.

When a program changes size by `delta` bytes:
1. Read all 11 pointers
2. Shift RAM contents: move bytes from `pointer[slot+1]` through `pointer[10]` by `delta`
3. Update pointers `[slot+1]` through `[10]` by adding `delta`
4. Write the new program bytes into the slot
5. Write all updated pointers back to the file table

**Critical**: The shift must be done in the correct direction to avoid overwriting:
- If `delta > 0` (program grew): shift from end backward (high addresses first)
- If `delta < 0` (program shrank): shift from start forward (low addresses first)

### RAM Layout (from Peter Rost manual, section 3-1)

Bank 1 RAM is organized as:

```
0x0000–0x0FFF   Unused (4 KB, suitable for ML programs)
0x1000–0x1CCF   System area (buffers, tables, stacks)
0x1CD0          USPTP — user stack top, start of user RAM
0x1CD0–0x7FFF   User RAM: programs (P0-P9), files (F0-F9), variables (32 KB base)
0x8000–0xFFFF   Optional RAM expansion (32 KB, present on FX-870P)
```

All addresses are Bank 1 logical; add `0x10000` for physical addresses in the emulator.

**Key system pointers** (2 bytes each, at Bank 1 addresses):

| Label | Address | Physical | Purpose |
|-------|---------|----------|---------|
| `SBOT` | `0x1899` | `0x11899` | Stack free area start (NOT used for program bounds) |
| `P0STT` | `0x18A7` | `0x118A7` | P0 first address (= file table start) |
| `P9STT` | `0x18B9` | `0x118B9` | P9 first address |
| `F0STT` | `0x18BB` | `0x118BB` | F0 start address |
| `F9STT` | `0x18CD` | `0x118CD` | F9 start address |
| `MEMEN` | `0x18CF` | `0x118CF` | File/free area boundary (end of all file storage) |
| `RAMTOP` | `0x18D1` | `0x118D1` | Top of data RAM — upper bound for program/file storage |

The memory grows upward: `P0 | P1 | ... | P9 | F0 | ... | F9 | free | variables ← | stack ←`

Programs and files pack contiguously from `P0STT` up to `MEMEN`. Variables and the stack grow downward from `DIREN`. The free space is between `MEMEN` and the variable/stack area.

### RAM Bounds Check

Before writing, verify that the new total size fits in available space:
```
MEMEN + delta <= RAMTOP  (i.e., don't exceed the data area)
```
Read `MEMEN` from physical `0x118CF` and `RAMTOP` from physical `0x118D1`. This matches the ROM's file-operation bounds check at `0x34B6` which loads both values as consecutive words from `0x18CF`. The file table pointers are updated automatically by shifting all entries after the edited slot.

Note: The file slots (F0-F9) sit immediately after P9 in the pointer table. If we only edit program slots (P0-P9), we must also shift F0-F9 data and update their pointers in `F0STT`–`F9STT` plus `MEMEN`.

### CPU Synchronization

```typescript
import { setCpuStop } from './def.js';

function withCpuPaused<T>(fn: () => T): T {
  setCpuStop(true);
  try {
    return fn();
  } finally {
    setCpuStop(false);
  }
}
```

All RAM writes go through this wrapper.

## Component 3: CodeMirror Editor (`src/editor/`)

### Why CodeMirror 6

We need syntax highlighting as-you-type during editing. Options considered:

| Option | Bundle (gzip) | Custom Grammar | Editing | Verdict |
|--------|--------------|----------------|---------|---------|
| **CodeMirror 6** | ~40-45 KB | StreamLanguage: `token(stream, state)` function | Full editor (cursor, undo, selection, keyboard) | **Chosen** |
| Monaco | 500 KB+ | Monarch (nice but...) | Full IDE | Way too heavy |
| Prism.js | ~2 KB | Regex object | None — needs contenteditable (painful) | Highlighter only |
| Shiki | ~34 KB | TextMate grammars (verbose) | None — same problem | Highlighter only |

CodeMirror 6's **StreamLanguage** is the simple path — no Lezer grammar build step, no TextMate JSON. You write a `token(stream, state)` function that consumes characters and returns token type strings. For FX-870P BASIC with ~50 keywords this is ~60-80 lines.

### `cm-basic-lang.ts` — StreamLanguage Definition

```typescript
import { StreamLanguage, StringStream } from '@codemirror/language';

interface BasicState {
  inString: boolean;
  inRem: boolean;
}

const basicLanguage = StreamLanguage.define<BasicState>({
  startState: () => ({ inString: false, inRem: false }),
  token(stream: StringStream, state: BasicState): string | null {
    // After REM or ', rest of line is comment
    if (state.inRem) { stream.skipToEnd(); return 'comment'; }
    // Inside "..." string literal
    if (state.inString) {
      if (stream.eat('"')) { state.inString = false; return 'string'; }
      stream.next();
      return 'string';
    }
    // Start of string
    if (stream.eat('"')) { state.inString = true; return 'string'; }
    // Line numbers at start of line
    if (stream.sol() && stream.match(/^\d+/)) return 'lineNumber';
    // Numeric literals
    if (stream.match(/^\d+(\.\d*)?([eE][+-]?\d+)?/)) return 'number';
    // Keywords (greedy longest match from keyword set)
    if (stream.match(KEYWORD_REGEX, false)) {
      const word = stream.match(KEYWORD_REGEX)!;
      const upper = word[0].toUpperCase();
      if (upper === 'REM') { state.inRem = true; return 'keyword'; }
      if (STATEMENT_KEYWORDS.has(upper)) return 'keyword';
      if (FUNCTION_KEYWORDS.has(upper)) return 'keyword.function';
      if (OPERATOR_KEYWORDS.has(upper)) return 'keyword.operator';
    }
    // Operators
    if (stream.match(/^[+\-*/^=<>(),:;]/)) return 'operator';
    // Variables and identifiers
    if (stream.match(/^[A-Za-z_]\w*\$?/)) return 'variableName';
    // Fallback
    stream.next();
    return null;
  },
  tokenTable: {
    'lineNumber': 'comment',  // maps to theme's comment color (muted)
  },
});
```

Token types map to CodeMirror's built-in highlight tags, which the theme then colors:

| Token | Highlight | Color intent |
|-------|-----------|-------------|
| `keyword` | statements (PRINT, GOTO, FOR...) | blue/cyan |
| `keyword.function` | functions (SIN, ABS, LEN...) | purple |
| `keyword.operator` | operators (AND, OR, NOT, MOD...) | orange |
| `string` | string literals `"..."` | green |
| `number` | numeric literals | orange/yellow |
| `comment` | REM, `'` comments | gray/dim |
| `variableName` | A, X$, N1... | default/white |
| `lineNumber` | line number at start | dim/gray |

### `cm-basic-theme.ts` — Dark Theme

Extend `oneDark` with overrides to match the panel's `#111` / `#0a0a0a` background:

```typescript
import { EditorView } from '@codemirror/view';

const basicEditorTheme = EditorView.theme({
  '&': { backgroundColor: '#0a0a0a', color: '#ccc', fontSize: '0.72rem' },
  '.cm-gutters': { backgroundColor: '#111', borderRight: '1px solid #222' },
  '.cm-activeLine': { backgroundColor: '#1a1a2a' },
  '.cm-cursor': { borderLeftColor: '#f0a030' },
  '.cm-selectionBackground': { backgroundColor: '#264f78 !important' },
}, { dark: true });
```

Line numbers in the gutter serve as the BASIC line numbers (not CodeMirror's internal line count). Use a custom gutter extension that renders the actual BASIC line number for each line.

### `BasicEditor.vue` — Reusable Component

```typescript
// Props
interface Props {
  initialCode: string;        // pre-filled BASIC text (detokenized)
  lineNumbers?: number[];     // BASIC line numbers for gutter display
  readonly?: boolean;
}

// Events
emit('submit', code: string);   // Enter (or Ctrl+Enter for multi-line)
emit('cancel');                  // Escape
emit('change', code: string);   // live changes (for error checking)
```

Vue integration pattern:
- `onMounted`: create `EditorView` with extensions, mount on template ref
- `onBeforeUnmount`: destroy view
- Watch `initialCode` prop to reset content via `view.dispatch()`
- Keymap extension binds Escape to `emit('cancel')` and Ctrl+Enter to `emit('submit')`

### Two Editor Modes

**Single-line edit** — When editing an existing line, the editor shows just that line's text (without line number). Enter submits. Used for click-to-edit on individual lines.

**Multi-line edit (import/full-edit)** — A full program editor where each line starts with its line number. Ctrl+Enter submits. Used for the IMPORT flow and a potential "edit all" mode. CodeMirror's multi-line support handles this naturally.

## Component 4: Panel UI Changes (`BasicListPanel.vue`)

### Interaction Model

**Line editing:**
- Click a line's text to enter edit mode for that line
- The line text is replaced by a `<BasicEditor>` instance (single-line mode) pre-filled with the detokenized text
- Syntax highlighting shows keywords in color as the user types
- Press Enter to tokenize and write back; press Escape to discard
- Line number is shown but not editable in-line (changing a line number = delete old + insert new)

**Adding lines:**
- A `<BasicEditor>` at the bottom of the listing (always visible in edit mode): type a line number followed by the BASIC text (e.g., `50 PRINT "HELLO"`)
- Press Enter to tokenize and insert at the correct position
- Editor clears after successful insert, ready for the next line

**Deleting lines:**
- A small "x" button appears on hover for each line
- Click to delete (no confirmation for single lines)

**Whole-program operations (header buttons):**
- **EDIT** toggle — enters/exits edit mode (disables live polling while editing)
- **IMPORT** — opens multi-line `<BasicEditor>`, paste or type a full listing, Ctrl+Enter to tokenize all lines and write to current slot
- **EXPORT** — copy the detokenized listing to clipboard

### State Management

When edit mode is active:
- `live` polling is automatically paused (no `setInterval` refresh)
- CPU is NOT paused globally — only paused during the actual RAM write operation
- A dirty indicator shows if there are unsaved changes (for import workflow)

### Error Display

Tokenization errors (unknown characters, line too long, out of RAM) are shown inline below the editor in red. The edit is not committed until errors are resolved.

### Visual Design

Edit mode uses the existing dark theme. The CodeMirror editor inherits the panel's monospace font and dark background. Editable lines get a subtle left border highlight. The add-line input has a `+` prefix. Keep it minimal — this is a developer tool, not a full IDE.

## Component 4: `writeRamByte` Export

Add to `emulator.ts`:

```typescript
export function writeRamByte(physAddr: number, value: number): void {
  const ram0 = memdef[RAM0_IDX];
  if (!ram0?.data) return;
  const idx = physAddr - ram0.first;
  if (idx < 0 || idx >= ram0.data.length) return;
  ram0.data[idx] = value;
}
```

This bypasses `dstWrite()` (which fires the RAM write monitor and goes through the full address decode loop). For bulk writes during editing, direct array access is faster and we don't need monitor callbacks. If the monitor is needed for debugging, it can be called explicitly.

## Implementation Sequence

### Phase 1: Tokenizer + Round-Trip Tests

1. Export shared constants and prefix tables from `detokenize.ts`
2. Build `tokenize.ts` with keyword reverse-map, greedy matcher, line-number reference handling
3. Write comprehensive vitest tests:
   - Round-trip: `detokenize(tokenize(x)) === normalize(x)` for a corpus of BASIC programs
   - Edge cases: strings containing keyword substrings, `HYP SIN`, hidden colon before ELSE, empty lines, max line length
   - Use the existing reference BASIC programs in `reference/` as test fixtures (detokenize them, re-tokenize, compare bytes)
4. Build `tokenizeProgram()` that assembles multiple lines into a complete program byte sequence

### Phase 2: RAM Writer + Integration Tests

5. Add `writeRamByte()` to `emulator.ts`
6. Build `ram-edit.ts` with `writeProgram()`, `upsertLine()`, `deleteLine()`, `clearSlot()`
7. Write tests using a mock RAM buffer:
   - Write a program, read it back with `readBasicPrograms()`, verify match
   - Insert a line in the middle, verify ordering
   - Delete a line, verify remaining lines
   - Edit a line that changes size, verify adjacent slots are intact
   - Fill RAM to capacity, verify error on overflow

### Phase 3: CodeMirror Editor Components

8. Install CodeMirror 6 packages: `codemirror`, `@codemirror/language`, `@codemirror/theme-one-dark`
9. Build `cm-basic-lang.ts` — StreamLanguage tokenizer with keyword/string/number/comment highlighting
10. Build `cm-basic-theme.ts` — dark theme overrides matching the panel's `#0a0a0a` background
11. Build `BasicEditor.vue` — reusable component wrapping EditorView with submit/cancel/change events

### Phase 4: Panel UI Integration

12. Add EDIT mode toggle to BasicListPanel header (pauses live polling)
13. Implement inline line editing — click a line to replace it with a `<BasicEditor>` instance
14. Implement add-line input — persistent `<BasicEditor>` at bottom of listing in edit mode
15. Implement line deletion — hover "x" button per line
16. Add error display for tokenization failures (inline below editor, red text)
17. Add EXPORT button (copy detokenized listing to clipboard)
18. Add IMPORT flow (multi-line `<BasicEditor>`, Ctrl+Enter to write to slot)

### Phase 5: End-to-End Testing + Polish

19. Test with real ROM — boot emulator, enter a program via keyboard, edit via panel, RUN, verify
20. Test persistence — edit, reload page, verify program survives
21. Test multi-slot — edit P0, verify P1-P9 are not corrupted
22. Handle edge case: editing while CPU is running a BASIC program (should warn or block)
23. Verify syntax highlighting covers all keyword categories correctly

## Open Questions

1. ~~**Maximum BASIC RAM address**~~ — **Resolved.** The upper bound is `RAMTOP` at `0x118D1` (the word immediately after MEMEN in the system area). This matches the ROM's file-operation free-space check at `0x34B6` which computes `word(0x18D1) - MEMEN`. Note: the earlier assumption that `SBOT` (`0x1899`) was the upper bound was **wrong** — SBOT is a stack-area pointer unrelated to program/file data space, and produced negative free-RAM values.

2. **File slot shifting** — Program slots P0-P9 and file slots F0-F9 are contiguous in RAM. Editing a program that changes size requires shifting not just subsequent programs but also all file slot data, and updating `F0STT`–`F9STT` pointers at `0x118BB`–`0x118CD` plus `MEMEN` at `0x118CF`. This is the full pointer table: 21 consecutive 16-bit pointers from `P0STT` (`0x118A7`) through `MEMEN` (`0x118CF`).

3. **DEFCHR interaction** — User-defined characters are stored at `CGRAM` (`0x1153C`, 24 bytes) in the system area, well below program storage. Should be safe.

4. ~~**Protected programs**~~ — **Resolved.** Allow editing regardless of password protection. The user has direct RAM access anyway.

5. ~~**Line number validation**~~ — **Resolved.** Valid range is 1-65535 (full 16-bit unsigned). Enforce this in the editor.

6. **Token ambiguity** — Some keywords overlap (e.g., `TO` inside `STOP`, `OR` inside `FOR`). The greedy longest-match approach should handle this, but needs thorough testing.

7. **MODE3 check** — `MODE3` at `0x116C6` indicates BASIC state: `0x01` = running, `0x02` = stopped, `0x00` = other. The editor should check this and warn/block if a program is actively running (`MODE3 == 0x01`).
