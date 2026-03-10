# BASIC Program Listing Panel — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a toggleable panel that reads BASIC programs from emulated RAM, detokenizes them, and displays a live listing.

**Architecture:** A new `detokenize.ts` module reads the file address table and walks BASIC line headers in RAM, expanding tokenized keywords using a lookup table derived from the ROM. A new `BasicListPanel.vue` component polls the detokenizer on a 1-second interval (togglable) and renders the listing. Integration into the existing panel system follows the CommPanel/DebugPanel pattern.

**Tech Stack:** TypeScript, Vue 3 Composition API, existing `readRamByte()` from emulator.ts.

---

## Task 1: Create the detokenizer module

**Files:**
- Create: `src/emulator/detokenize.ts`

### Step 1: Create `src/emulator/detokenize.ts` with token tables and reader

The module needs:
1. A keyword lookup table (4 prefix groups, codes 0x47-0xC7)
2. A function to read 16-bit LE words from RAM
3. A function to read the file address table
4. A function to walk BASIC lines and detokenize them

```typescript
// src/emulator/detokenize.ts
//
// BASIC program detokenizer for the FX-870P / VX-4.
//
// The calculator stores up to 10 BASIC programs (P0–P9) in RAM.
// Each program is a sequence of tokenized lines terminated by a zero byte.
//
// ── Memory layout ──────────────────────────────────────────────────────────
//
// File Address Table at RAM 0x18A7 (physical 0x118A7):
//   11 consecutive 16-bit LE pointers (one per file boundary).
//   P(n) occupies RAM from pointer[n] to pointer[n+1].
//   Each pointer is a 16-bit logical RAM address (add 0x10000 for physical).
//
// ── BASIC line format ──────────────────────────────────────────────────────
//
// Each line in a program file:
//   Byte 0-1 : line number (16-bit LE). 0x00 at byte 0 = end-of-file.
//   Byte 2   : length of the tokenized body (N bytes following)
//   Byte 3.. : tokenized body (N bytes)
//
// The tokenized body uses these encodings:
//   0x00        end of line (implicit from length)
//   0x01        colon ':'  (statement separator)
//                — but if followed by 0x07 0x48, suppress the colon (hidden ELSE)
//   0x02        apostrophe "'" (REM shorthand)
//   0x03        binary line-number reference (next 2 bytes = 16-bit LE line number)
//   0x04–0x07   keyword prefix — next byte is keyword code (0x47–0xC7)
//   0x20–0x7F   literal ASCII character
//   other       emitted as [XX] hex escape
//
// ── Keyword token tables ───────────────────────────────────────────────────
//
// Extracted from ROM1 dispatch tables at 0x0FA9, 0x10AB, 0x11AD, 0x12AF.
// Each table maps code bytes 0x47–0xC7 to keyword strings.
// Source: reference/ROM Disassembly/fx870_r1/rom1c.src lines 371–509.
//
// Special case: prefix 0x05, codes 0x71–0x76 = hyperbolic functions.
// These are rendered as HYP + the corresponding trig keyword:
//   0x71=HYPSIN, 0x72=HYPCOS, 0x73=HYPTAN,
//   0x74=HYPASN, 0x75=HYPACS, 0x76=HYPATN
//
// (Discovered from ENLST routine at ROM1 0x5108–0x5121.)

import { readRamByte } from './emulator.js';

// ── Token tables ───────────────────────────────────────────────────────────
// Indexed by (code - 0x47). Empty string = unmapped token → rendered as "???".

const PREFIX4: string[] = [ // codes 0x47–0xC7
  '','','GOTO','GOSUB',                          // 47-4A
  'RETURN','RESUME','RESTORE','WRITE#',          // 4B-4E
  '','CONT','','SYSTEM',                         // 4F-52
  'PASS','','DELETE','',                          // 53-56
  'LIST','LLIST','LOAD','MERGE',                 // 57-5A
  '','RENUM','TRON','',                          // 5B-5E
  'TROFF','VERIFY','','',                        // 5F-62
  'POKE','','','',                               // 63-66
  '','','CHAIN','CLEAR',                         // 67-6A
  'NEW','SAVE','RUN','ANGLE',                    // 6B-6E
  'EDIT','BEEP','CLS','CLOSE',                   // 6F-72
  '','','','DEF',                                // 73-76
  '','DEFSEG','','',                             // 77-7A
  '','DIM','','',                                // 7B-7E
  '','DATA','FOR','NEXT',                        // 7F-82
  '','','ERASE','ERROR',                         // 83-86
  'END','','','',                                // 87-8A
  'FORMAT','','IF','KILL',                       // 8B-8E
  'LET','LINE','LOCATE','',                      // 8F-92
  '','','','NAME',                               // 93-96
  'OPEN','','OUT','ON',                          // 97-9A
  '','','','',                                   // 9B-9E
  'CALCJMP','','','',                            // 9F-A2
  'PRINT','LPRINT','PUT','',                     // A3-A6
  '','READ','REM','',                            // A7-AA
  '','SET','STAT','STOP',                        // AB-AE
  '','MODE','','VAR',                            // AF-B2
  '','','FILES','',                              // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

const PREFIX5: string[] = [
  '','','','',                                   // 47-4A
  '','','','',                                   // 4B-4E
  'ERL','ERR','CNT','SUMX',                      // 4F-52
  'SUMY','SUMX2','SUMY2','SUMXY',                // 53-56
  'MEANX','MEANY','SDX','SDY',                   // 57-5A
  'SDXN','SDYN','LRA','LRB',                     // 5B-5E
  'COR','PI','DSKF','',                          // 5F-62
  'CUR','','','',                                // 63-66
  'FACT','','EOX','EOY',                         // 67-6A
  'SIN','COS','TAN','ASN',                       // 6B-6E
  'ACS','ATN','','',                             // 6F-72
  '','','','',                                   // 73-76
  'LN','LOG','EXP','SQR',                        // 77-7A
  'ABS','SGN','INT','FIX',                       // 7B-7E
  'FRAC','','DEGR','DMS',                        // 7F-82
  '','','','PEEK',                               // 83-86
  '','','','EOF',                                // 87-8A
  '','','FRE','',                                // 8B-8E
  '','ROUND','','VALF',                          // 8F-92
  'RAN#','ASC','LEN','VAL',                      // 93-96
  '','','','',                                   // 97-9A
  'HYP','DEG','','',                             // 9B-9E
  '','','','',                                   // 9F-A2
  '','','','',                                   // A3-A6
  'REC','POL','','NPR',                          // A7-AA
  'NCR','HYP','','',                             // AB-AE
  '','','','',                                   // AF-B2
  '','','','',                                   // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

const PREFIX6: string[] = [
  '','','','',                                   // 47-4A
  '','','','',                                   // 4B-4E
  '','','','',                                   // 4F-52
  '','','','',                                   // 53-56
  '','','','',                                   // 57-5A
  '','','','',                                   // 5B-5E
  '','','','',                                   // 5F-62
  '','','','',                                   // 63-66
  '','','','',                                   // 67-6A
  '','','','',                                   // 6B-6E
  '','','','',                                   // 6F-72
  '','','','',                                   // 73-76
  '','','','',                                   // 77-7A
  '','','','',                                   // 7B-7E
  '','','','',                                   // 7F-82
  '','','','',                                   // 83-86
  '','','','',                                   // 87-8A
  '','','','',                                   // 8B-8E
  '','','','',                                   // 8F-92
  '','','','',                                   // 93-96
  'DMS$','','','',                               // 97-9A
  'INPUT','MID$','RIGHT$','LEFT$',               // 9B-9E
  '','CHR$','STR$','',                           // 9F-A2
  'HEX$','','','',                               // A3-A6
  '','INKEY$','','',                             // A7-AA
  '','','CALC$','',                              // AB-AE
  '','','','',                                   // AF-B2
  '','','','',                                   // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

const PREFIX7: string[] = [
  'THEN','ELSE','','',                           // 47-4A
  '','','','',                                   // 4B-4E
  '','','','',                                   // 4F-52
  '','','','',                                   // 53-56
  '','','','',                                   // 57-5A
  '','','','',                                   // 5B-5E
  '','','','',                                   // 5F-62
  '','','','',                                   // 63-66
  '','','','',                                   // 67-6A
  '','','','',                                   // 6B-6E
  '','','','',                                   // 6F-72
  '','','','',                                   // 73-76
  '','','','',                                   // 77-7A
  '','','','',                                   // 7B-7E
  '','','','',                                   // 7F-82
  '','','','',                                   // 83-86
  '','','','',                                   // 87-8A
  '','','','',                                   // 8B-8E
  '','','','',                                   // 8F-92
  '','','','',                                   // 93-96
  '','','','',                                   // 97-9A
  '','','','',                                   // 9B-9E
  '','','','',                                   // 9F-A2
  '','','','',                                   // A3-A6
  '','','','',                                   // A7-AA
  '','','','',                                   // AB-AE
  '','','','',                                   // AF-B2
  '','','','TAB',                                // B3-B6
  '','','','',                                   // B7-BA
  'ALL','AS','APPEND','',                        // BB-BE
  '','STEP','TO','USING',                        // BF-C2
  'NOT','AND','OR','XOR',                        // C3-C6
  'MOD',                                         // C7
];

const PREFIXES: string[][] = [PREFIX4, PREFIX5, PREFIX6, PREFIX7];

// Hyperbolic function codes (prefix 5, codes 0x71-0x76) map to trig keywords
const HYPER_MAP: Record<number, string> = {
  0x71: 'SIN', 0x72: 'COS', 0x73: 'TAN',
  0x74: 'ASN', 0x75: 'ACS', 0x76: 'ATN',
};

// ── RAM helpers ────────────────────────────────────────────────────────────

const RAM_BASE = 0x10000; // physical address offset for RAM0
const FILE_TABLE = 0x118A7; // physical address of file pointer table
const NUM_SLOTS = 10; // P0–P9

function readWord(physAddr: number): number {
  return readRamByte(physAddr) | (readRamByte(physAddr + 1) << 8);
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface BasicLine {
  num: number;   // line number (1–65535)
  text: string;  // detokenized source text
}

export interface BasicProgram {
  slot: number;       // 0–9 for P0–P9
  lines: BasicLine[];
}

/** Read all non-empty BASIC program slots from RAM. */
export function readBasicPrograms(): BasicProgram[] {
  const programs: BasicProgram[] = [];
  for (let slot = 0; slot < NUM_SLOTS; slot++) {
    const start = readWord(FILE_TABLE + slot * 2);
    const end   = readWord(FILE_TABLE + (slot + 1) * 2);
    if (start === 0 || end === 0 || end <= start) continue;
    const physStart = RAM_BASE + start;
    const physEnd   = RAM_BASE + end;
    const lines = readProgramLines(physStart, physEnd);
    if (lines.length > 0) {
      programs.push({ slot, lines });
    }
  }
  return programs;
}

// ── Line reader ────────────────────────────────────────────────────────────

function readProgramLines(physStart: number, physEnd: number): BasicLine[] {
  const lines: BasicLine[] = [];
  let addr = physStart;
  const limit = 2000; // safety limit on lines per program
  while (addr < physEnd && lines.length < limit) {
    const b0 = readRamByte(addr);
    if (b0 === 0x00 || b0 === 0x1A) break; // end of program
    // Line number: 16-bit LE at addr
    const lineNum = readRamByte(addr) | (readRamByte(addr + 1) << 8);
    // Body length at addr+2
    const bodyLen = readRamByte(addr + 2);
    if (bodyLen === 0) { addr += 3; continue; }
    // Detokenize the body bytes
    const text = detokenizeBody(addr + 3, bodyLen);
    lines.push({ num: lineNum, text });
    addr += 3 + bodyLen;
  }
  return lines;
}

// ── Detokenizer ────────────────────────────────────────────────────────────

function detokenizeBody(physAddr: number, length: number): string {
  let out = '';
  let i = 0;
  while (i < length) {
    const b = readRamByte(physAddr + i);
    i++;
    if (b === 0x00) {
      break; // end of line
    } else if (b === 0x01) {
      // Colon (statement separator), but suppress if followed by ELSE
      if (i + 1 < length) {
        const peek0 = readRamByte(physAddr + i);
        const peek1 = readRamByte(physAddr + i + 1);
        if (peek0 === 0x07 && peek1 === 0x48) {
          // Hidden colon before ELSE — skip it
          continue;
        }
      }
      out += ':';
    } else if (b === 0x02) {
      out += "'"; // REM shorthand
    } else if (b === 0x03) {
      // Binary line number reference (e.g., GOTO target)
      if (i + 1 < length) {
        const ref = readRamByte(physAddr + i) | (readRamByte(physAddr + i + 1) << 8);
        i += 2;
        out += ref.toString();
      }
    } else if (b >= 0x04 && b <= 0x07) {
      // Keyword prefix
      if (i < length) {
        const code = readRamByte(physAddr + i);
        i++;
        out += lookupKeyword(b, code);
      }
    } else if (b >= 0x20 && b <= 0x7F) {
      out += String.fromCharCode(b);
    } else {
      // Unknown byte — show as hex escape
      out += `[${b.toString(16).padStart(2, '0').toUpperCase()}]`;
    }
  }
  return out;
}

function lookupKeyword(prefix: number, code: number): string {
  // Special case: hyperbolic functions (prefix 5, codes 0x71-0x76)
  if (prefix === 0x05 && code >= 0x71 && code <= 0x76) {
    return 'HYP ' + (HYPER_MAP[code] ?? '???');
  }
  const table = PREFIXES[prefix - 0x04];
  if (!table) return '???';
  const idx = code - 0x47;
  if (idx < 0 || idx >= table.length) return '???';
  return table[idx] || '???';
}
```

### Step 2: Verify build compiles

Run: `npx vue-tsc --noEmit 2>&1 | head -20`
Expected: No errors in detokenize.ts

### Step 3: Commit

```bash
git add src/emulator/detokenize.ts
git commit -m "Add BASIC detokenizer module with complete ROM token tables"
```

---

## Task 2: Create BasicListPanel.vue

**Files:**
- Create: `src/components/BasicListPanel.vue`

### Step 1: Create the panel component

Follow the DebugPanel pattern: poll on interval, render to a scrollable pre-formatted area. Include a toggle button for live/frozen mode.

```vue
<!-- src/components/BasicListPanel.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { readBasicPrograms, type BasicProgram } from '../emulator/detokenize.js';

const programs = ref<BasicProgram[]>([]);
const live = ref(true);
let pollId: ReturnType<typeof setInterval> | null = null;

function refresh(): void {
  programs.value = readBasicPrograms();
}

function toggleLive(): void {
  live.value = !live.value;
  if (live.value) {
    refresh();
    pollId = setInterval(refresh, 1000);
  } else if (pollId !== null) {
    clearInterval(pollId);
    pollId = null;
  }
}

onMounted(() => {
  refresh();
  pollId = setInterval(refresh, 1000);
});

onUnmounted(() => {
  if (pollId !== null) clearInterval(pollId);
});
</script>

<template>
  <div class="basic-panel">
    <div class="basic-header">
      <span class="basic-title">BASIC</span>
      <button class="btn" :class="{ active: live }" @click="toggleLive">
        {{ live ? 'LIVE' : 'FROZEN' }}
      </button>
      <button class="btn" @click="refresh">REFRESH</button>
    </div>
    <div class="basic-listing">
      <template v-if="programs.length === 0">
        <span class="empty">(no programs in memory)</span>
      </template>
      <template v-for="prog in programs" :key="prog.slot">
        <div class="slot-header">P{{ prog.slot }}</div>
        <div v-for="line in prog.lines" :key="line.num" class="basic-line">
          <span class="line-num">{{ line.num }}</span>
          <span class="line-text"> {{ line.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.basic-panel {
  display: flex;
  flex-direction: column;
  background: #111;
  border-top: 1px solid #333;
  font-family: monospace;
  font-size: 0.72rem;
}

.basic-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-bottom: 1px solid #222;
}

.basic-title {
  color: #9ecbff;
  font-weight: bold;
  margin-right: auto;
}

.btn {
  padding: 1px 6px;
  font-family: monospace;
  font-size: 0.7rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}
.btn:hover { background: #3a3a3a; color: #fff; }
.btn.active { color: #8bc34a; border-color: #3a5a20; background: #1a2a10; }

.basic-listing {
  max-height: 350px;
  overflow-y: auto;
  padding: 4px 10px;
  background: #0a0a0a;
  line-height: 1.4;
}

.slot-header {
  color: #f0a030;
  font-weight: bold;
  margin-top: 4px;
  margin-bottom: 2px;
}
.slot-header:first-child { margin-top: 0; }

.basic-line {
  white-space: pre;
  color: #ccc;
}

.line-num {
  color: #777;
}

.line-text {
  color: #ccc;
}

.empty {
  color: #444;
  font-style: italic;
}
</style>
```

### Step 2: Verify build compiles

Run: `npx vue-tsc --noEmit 2>&1 | head -20`

### Step 3: Commit

```bash
git add src/components/BasicListPanel.vue
git commit -m "Add BasicListPanel component with live/frozen toggle"
```

---

## Task 3: Integrate panel into EmulatorView and CommPanel

**Files:**
- Modify: `src/components/EmulatorView.vue`
- Modify: `src/components/CommPanel.vue`

### Step 1: Add BASIC toggle to CommPanel

In CommPanel.vue, add `showBasic` prop and emit, plus a BASIC button in the toolbar:

- Add to props: `showBasic: boolean`
- Add to emits: `(e: 'update:showBasic', v: boolean): void`
- Add button after the DEBUG button:
  ```html
  <button class="btn" @click="emit('update:showBasic', !props.showBasic)">
    BASIC {{ props.showBasic ? '\u25B4' : '\u25BE' }}
  </button>
  ```

### Step 2: Add BasicListPanel to EmulatorView

In EmulatorView.vue:

- Import BasicListPanel
- Add `const showBasic = ref(false);`
- Pass `v-model:showBasic="showBasic"` to all CommPanel instances
- Add `<BasicListPanel v-if="showBasic" />` after each DebugPanel:
  - In the bottom layout (after line 252)
  - In the left side-panels (after line 201)
  - In the right side-panels (after line 268)
- Add `.side-panels :deep(.basic-panel) { width: auto; }` to scoped styles

### Step 3: Verify build compiles

Run: `npx vue-tsc --noEmit 2>&1 | head -20`

### Step 4: Test in browser

Run: `npm run dev`
- Open browser, click BASIC button — panel should appear
- Load a BASIC program and verify listing appears
- Toggle LIVE/FROZEN
- Test all three layouts (bottom, right, left)

### Step 5: Commit

```bash
git add src/components/EmulatorView.vue src/components/CommPanel.vue
git commit -m "Integrate BASIC listing panel into emulator UI"
```

---

## Task 4: Verify with a real program and tune the detokenizer

### Step 1: Test with a known program

Load one of the existing .FX programs (e.g., FLIPFLOP.FX via LIB) and compare the panel listing against the .FX source file. Check:
- Line numbers are correct
- Keywords are properly expanded
- String literals are preserved
- Colons separate multi-statement lines
- GOTO/GOSUB targets show as decimal line numbers
- REM lines are correct
- No garbage at end of listing

### Step 2: Adjust line format if needed

The line header format (2-byte line number + 1-byte length) is derived from ROM analysis but needs empirical verification. If the listing shows garbage:
- Use the DEBUG panel hex editor to examine RAM at the file table address (0x18A7 → read words, follow pointers)
- Adjust the header byte offsets in `readProgramLines()`
- The file table entry size (2 bytes per pointer vs 4 bytes) may need adjustment

### Step 3: Test edge cases

- Empty program slots (should be hidden)
- Multiple programs in different slots
- Programs with long lines
- Programs using all keyword types (prefix 4-7)
- REM with apostrophe shorthand

### Step 4: Commit fixes

```bash
git add src/emulator/detokenize.ts
git commit -m "Tune detokenizer based on empirical RAM testing"
```

---

## Task 5: Write reference documentation

**Files:**
- Create: `docs/basic-detokenizer.md`

### Step 1: Create comprehensive reference doc

Document everything needed to maintain the detokenizer:

- FX-870P BASIC memory layout (file table, line format)
- Complete token table (all 4 prefixes, all codes)
- Special cases (hyperbolic functions, hidden colon before ELSE, binary line refs)
- How to add new keywords if discovered
- ROM source references for verification

### Step 2: Commit

```bash
git add docs/basic-detokenizer.md
git commit -m "Add BASIC detokenizer reference documentation"
```

---

## Task 6: Final verification and cleanup

### Step 1: Run full test suite

Run: `npm test`
Expected: All existing tests pass (detokenizer has no test dependencies yet)

### Step 2: Run type check

Run: `npm run build`
Expected: Clean build with no type errors

### Step 3: Final commit

```bash
git add -A
git commit -m "BASIC listing panel: final cleanup"
```
