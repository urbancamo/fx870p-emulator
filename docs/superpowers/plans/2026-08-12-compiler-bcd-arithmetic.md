# BCD Arithmetic for the BASIC Compiler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the BASIC compiler produce correct BCD floating-point constants and arithmetic, so `PRIMES.BAS` (a new benchmark program) can be compiled and run to compare performance against the interpreted BASIC version.

**Architecture:** A new pure-TypeScript `numberToBcd9()` function encodes JS numbers into the ROM's 9-byte BCD format at compile time (no runtime ROM conversion call — see design spec for why). `codegen.ts` gets three fixes: constants now load real BCD bytes instead of a 2-byte integer stub, the arithmetic operand register convention is corrected to match what the ROM actually expects, and `MOD` gets wired to its ROM entry point. `PRIMES.BAS` exercises all of it end-to-end as the acceptance test.

**Tech Stack:** TypeScript, Vitest, the existing HD61700 compiler pipeline (`tools/compiler/`), the headless emulator debugger (`tools/emu-debugger/`) for integration tests.

## Global Constraints

- Full spec: `docs/superpowers/specs/2026-08-12-compiler-bcd-arithmetic-design.md` — read it before starting; this plan implements it task-by-task.
- `PRIMES.BAS` must use only `+`, `-`, `*`, `MOD`, comparisons, `FOR`/`WHILE`/`GOTO` — no `SQR`/`INT`/`\`/arrays (those remain out of scope, unwired).
- No runtime ROM call for constant conversion — `numberToBcd9()` is pure TypeScript, computed at compile time. Two ROM helpers (`CNVR` at `&H0A97`, "load constant 1" at `&H0669`) were tried during design research and misbehaved outside their normal calling context — do not use either.
- Every new/changed arithmetic behavior gets verified by round-tripping through the ROM's own `PRINT` and `CLS` calls (already proven working via `tools/emu-debugger/tests/hello-at-1cd0.test.ts`), not by trusting derived byte values on faith.
- `mode: 'snapshot'` `EmulatorSession` runs require `setUa(0x55); setDelayedUa(0x55);` before `run()` — the CPU fetches using `delayed_ua`, not `ua`; omitting this means your code never executes (a real bug hit during design research — instructions silently don't run and the session reports a false "returned" exit).
- The ROM_CALL wrapper convention (already used throughout `codegen.ts`) for any new hand-written test assembly:
  ```typescript
  { label: 'ROM_CALL', mnemonic: 'LDW', operands: '$0,&H5323' },
  { mnemonic: 'PHSW', operands: '$1' },
  { mnemonic: 'PST', operands: 'UA,&H54' },
  { mnemonic: 'JP', operands: '$2' },
  ```
  Call site: `LDW $2,<rom-addr-or-label>` then `CAL ROM_CALL`.

---

### Task 1: Discover the exact 9-byte BCD format and implement `numberToBcd9()`

**Files:**
- Create: `tools/compiler/bcd.ts`
- Test: `tools/compiler/tests/bcd.test.ts`

**Interfaces:**
- Produces: `numberToBcd9(value: number): Uint8Array` — always returns exactly 9 bytes. Used by Task 4.

This task has two parts: first empirically pin down the byte format (structural knowledge is already solid — see below — but the exact digit packing, exponent bias, and sign encoding need confirming against the real ROM, not guessing), then implement and test the function.

**What's already known with confidence** (from `reference/ROM Disassembly/fx870_r0/rom0.src`, routine `&H061D` "floating point normalisation" and the `FP_ADD`/`FP_MUL` bodies at `&H05DA`/`&H0607`): the accumulator is 9 registers, `$10-$18`. `$10-$16` (7 registers = 7 bytes) hold the mantissa, `$17` holds the exponent, `$18` holds the sign. Zero is confirmed empirically to encode as all-zero bytes.

**What's not yet confirmed:** mantissa digit order (which end holds the most significant digit), how many BCD digits pack per byte, the exponent's bias formula, and the exact sign byte value for a negative number.

- [ ] **Step 1: Write the discovery harness**

Create `tools/compiler/_discover-bcd.ts` (temporary, deleted at the end of this task — do not commit it):

```typescript
// tools/compiler/_discover-bcd.ts
// TEMPORARY discovery tool — delete after Step 3 of Task 1.
import { boot, typeString, pressExe, runCycles } from '../tests/emu-harness.js';
import { setPcMonitor, mr, pc } from '../src/emulator/def.js';

// Capture the accumulator ($10-$18 = mr[10..18]) at the moment the CPU
// reaches a specific PC, while the REAL interpreter naturally computes
// "PRINT <expr>". This avoids calling any ROM helper directly (which
// misbehaves outside its normal calling context — see Global Constraints).
function captureAtPc(expr: string, watchPc: number, maxCycles = 8_000_000): number[] | null {
  boot();
  let captured: number[] | null = null;
  setPcMonitor((curPc) => {
    if (curPc === watchPc && !captured) {
      captured = Array.from(mr.slice(10, 19));
    }
  });
  typeString(expr);
  pressExe();
  runCycles(maxCycles);
  setPcMonitor(null);
  return captured;
}

// First: find out what PC the interpreter actually reaches for numeric
// literal evaluation. Sweep a wide net of distinct PCs visited (not just
// one guessed address) so we don't miss the real entry point.
function distinctPcsVisited(expr: string, maxCycles = 8_000_000): number[] {
  boot();
  const visited = new Set<number>();
  setPcMonitor((p) => visited.add(p));
  typeString(expr);
  pressExe();
  runCycles(maxCycles);
  setPcMonitor(null);
  return [...visited].sort((a, b) => a - b);
}

console.log('=== distinct PCs for "PRINT 1" (ROM0 range 0x0000-0x0BFF) ===');
for (const p of distinctPcsVisited('PRINT 1')) {
  if (p <= 0x0BFF) console.log(`  0x${p.toString(16).padStart(4, '0')}`);
}

// Once you've identified a plausible PC for the FP_ADD entry (&H05DA) or
// the number-evaluation routine (around &H07AC, "evaluate a decimal or
// hex numeral pointed to by IZ" per the disassembly) actually being hit,
// capture the accumulator there for several known values:
for (const [expr, watchPc] of [
  ['PRINT 1', 0x05DA],
  ['PRINT 5', 0x05DA],
  ['PRINT 100', 0x05DA],
] as const) {
  const bytes = captureAtPc(expr, watchPc);
  console.log(`${expr.padEnd(12)} at pc=0x${watchPc.toString(16)}: ${bytes ? bytes.map(b => b.toString(16).padStart(2, '0')).join(' ') : '(not hit — try a different watchPc from the sweep above)'}`);
}
```

- [ ] **Step 2: Run the harness and interpret results**

Run: `npx tsx tools/compiler/_discover-bcd.ts`

The first block prints every distinct PC in the ROM0 range visited while the real interpreter processes `PRINT 1`. Cross-reference the addresses printed against `reference/ROM Disassembly/fx870_r0/rom0.src` (`grep -n "^0XXX:" reference/ROM\ Disassembly/fx870_r0/rom0.src`) to find where number-literal evaluation and FP conversion actually happen — the addresses in `codegen.ts`'s `ROM` table (`&H05DA` etc.) are for the *operator* entry points and may not be what direct-mode statement evaluation visits on the way to constructing the literal's BCD value; the sweep tells you what's real rather than assumed.

Once a good watch-PC is found (a point where the accumulator holds the freshly-converted literal), re-run with `captureAtPc` for at least three known values (e.g. 1, 5, 100) and derive the pattern by comparison: which bytes change with the leading digit, which change with magnitude (exponent), and where the digit `1` appears in the byte layout tells you the packing order directly.

If a single watch-PC doesn't land cleanly (e.g., the accumulator is mid-update), fall back to bracketing: capture the full `distinctPcsVisited` list for two different values (e.g. `PRINT 1` vs `PRINT 5`) and diff them — new addresses that appear only for one input, plus the register file diff at those points, narrow down the exact construction site.

- [ ] **Step 3: Delete the discovery harness**

```bash
rm tools/compiler/_discover-bcd.ts
```

- [ ] **Step 4: Write the failing unit tests**

Fill in the concrete expected byte arrays using what Step 2 discovered (replace the `bytesFor*` example values below with your actual findings — do not guess, use the captured ground truth):

```typescript
// tools/compiler/tests/bcd.test.ts
import { describe, it, expect } from 'vitest';
import { numberToBcd9 } from '../bcd.js';

describe('numberToBcd9', () => {
  it('encodes zero as all-zero bytes', () => {
    expect(numberToBcd9(0)).toEqual(new Uint8Array(9));
  });

  it('encodes 1', () => {
    expect(Array.from(numberToBcd9(1))).toEqual(/* from Step 2 findings */);
  });

  it('encodes 5', () => {
    expect(Array.from(numberToBcd9(5))).toEqual(/* from Step 2 findings */);
  });

  it('encodes 100', () => {
    expect(Array.from(numberToBcd9(100))).toEqual(/* from Step 2 findings */);
  });

  it('encodes a negative number with the sign byte set', () => {
    const pos = numberToBcd9(5);
    const neg = numberToBcd9(-5);
    expect(neg[8]).not.toBe(pos[8]);
    // mantissa/exponent bytes otherwise match the positive encoding
    expect(Array.from(neg).slice(0, 8)).toEqual(Array.from(pos).slice(0, 8));
  });

  it('always returns exactly 9 bytes', () => {
    expect(numberToBcd9(541).length).toBe(9);
    expect(numberToBcd9(-32767).length).toBe(9);
  });
});
```

- [ ] **Step 5: Run tests, confirm they fail**

Run: `npx vitest run tools/compiler/tests/bcd.test.ts`
Expected: FAIL — `numberToBcd9` is not defined (module doesn't exist yet).

- [ ] **Step 6: Implement `numberToBcd9()` using the discovered format**

```typescript
// tools/compiler/bcd.ts
//
// Converts a JS number into the FX-870P/VX-4 ROM's 9-byte BCD
// floating-point format, used by the accumulator registers $10-$18 (and
// $0-$8 for the second operand of a binary operation).
//
// Layout (confirmed against the real ROM — see
// docs/superpowers/specs/2026-08-12-compiler-bcd-arithmetic-design.md
// and reference/ROM Disassembly/fx870_r0/rom0.src &H061D):
//   bytes[0..6]  7-byte packed-BCD mantissa
//   bytes[7]     exponent (BCD, biased)
//   bytes[8]     sign

export function numberToBcd9(value: number): Uint8Array {
  const bytes = new Uint8Array(9);
  if (value === 0) return bytes;

  // TODO(Task 1 Step 6): fill in using the exact packing/bias/sign
  // encoding confirmed in Step 2. Replace this whole body — the shape
  // below is illustrative only, not the confirmed algorithm.
  throw new Error('not yet implemented — fill in from Step 2 findings');
}
```

Replace the `throw` with the real implementation once the format is confirmed. The function must handle: zero (already done above), positive and negative integers, and decimals, rounding/truncating to 14 significant digits if a literal has more precision than the mantissa holds (matching real hardware behavior, per the design spec's Error Handling section).

- [ ] **Step 7: Run tests, confirm they pass**

Run: `npx vitest run tools/compiler/tests/bcd.test.ts`
Expected: PASS, all cases green.

- [ ] **Step 8: Commit**

```bash
git add tools/compiler/bcd.ts tools/compiler/tests/bcd.test.ts
git commit -m "feat(compiler): implement numberToBcd9 for BCD constant encoding"
```

---

### Task 2: Fix the arithmetic operand register convention

**Files:**
- Modify: `tools/compiler/codegen.ts` (`emitBinaryExpr`, around lines 564-608)

**Interfaces:**
- Consumes: nothing new.
- Produces: `emitBinaryExpr` now stages the right-hand operand in `$0-$8` instead of `$19-$27`, matching the ROM's documented convention (`&H05DA: floating point addition, $10-$18 <- $10-$18 + $0-$8`, confirmed in `reference/ROM Disassembly/fx870_r0/rom0.src`).

- [ ] **Step 1: Read the current implementation**

Look at `emitBinaryExpr` in `tools/compiler/codegen.ts`. The relevant block currently reads:

```typescript
    const romAddr = this.arithmeticRomAddr(op);
    if (romAddr) {
      // ROM routines expect: left in $10-$18, right in $19-$27
      // Swap via stack: push right, move left to acc, pop right to temp
      this.code.push({ mnemonic: 'phsm', operands: '$10,8', comment: 'push right[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push right[8]' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'acc[0..7] = left' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'acc[8] = left[8]' });
      this.code.push({ mnemonic: 'pps',  operands: '$27',       comment: 'pop right[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8',     comment: 'pop right[0..7] → $19-$26' });

      this.emitRomCall(romAddr, `${op}`);
    } else if (this.isComparisonOp(op)) {
      // Comparison: swap so left is in acc, right in temp, then subtract
      this.code.push({ mnemonic: 'phsm', operands: '$10,8', comment: 'push right[0..7]' });
      this.code.push({ mnemonic: 'phs',  operands: '$18',   comment: 'push right[8]' });
      this.code.push({ mnemonic: 'ldm',  operands: '$10,$19,8', comment: 'acc[0..7] = left' });
      this.code.push({ mnemonic: 'ld',   operands: '$18,$27',   comment: 'acc[8] = left[8]' });
      this.code.push({ mnemonic: 'pps',  operands: '$27',       comment: 'pop right[8] → $27' });
      this.code.push({ mnemonic: 'ppsm', operands: '$19,8',     comment: 'pop right[0..7] → $19-$26' });
      this.emitRomCall(ROM.FP_SUB, `compare: ${op}`);
      // Result flags used by conditional jumps
    } else {
      this.code.push({ comment: `TODO: operator ${op}` });
    }
```

Both branches do the same swap: pop the right operand into `$19-$27` instead of `$0-$8`. Both need the fix.

- [ ] **Step 2: Write the fix**

Replace the block with:

```typescript
    const romAddr = this.arithmeticRomAddr(op);
    if (romAddr) {
      // ROM routines expect: left operand in $10-$18 (the accumulator,
      // already there from emitExpression(left)), right operand in $0-$8.
      // Swap via stack: right is currently in $10-$18 (from
      // emitExpression(right)); left is saved on the stack from the push
      // above. Pop left back into the accumulator, then move what's now
      // in the accumulator (right) down into $0-$8.
      this.code.push({ mnemonic: 'ldm',  operands: '$0,$10,8',  comment: 'save right[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',   operands: '$8,$18',    comment: 'save right[8] -> $8' });
      this.code.push({ mnemonic: 'pps',  operands: '$18',       comment: 'pop left[8] -> $18' });
      this.code.push({ mnemonic: 'ppsm', operands: '$10,8',     comment: 'pop left[0..7] -> $10-$17' });

      this.emitRomCall(romAddr, `${op}`);
    } else if (this.isComparisonOp(op)) {
      // Same operand convention as arithmetic — FP_SUB also expects
      // left in $10-$18, right in $0-$8.
      this.code.push({ mnemonic: 'ldm',  operands: '$0,$10,8',  comment: 'save right[0..7] -> $0-$7' });
      this.code.push({ mnemonic: 'ld',   operands: '$8,$18',    comment: 'save right[8] -> $8' });
      this.code.push({ mnemonic: 'pps',  operands: '$18',       comment: 'pop left[8] -> $18' });
      this.code.push({ mnemonic: 'ppsm', operands: '$10,8',     comment: 'pop left[0..7] -> $10-$17' });
      this.emitRomCall(ROM.FP_SUB, `compare: ${op}`);
      // Result flags used by conditional jumps
    } else {
      this.code.push({ comment: `TODO: operator ${op}` });
    }
```

Note the earlier part of `emitBinaryExpr` (steps 1-4, pushing left operand and evaluating right into the accumulator) is unchanged — only what happens after right is evaluated changes.

- [ ] **Step 3: Update existing codegen tests if they assert on the old register names**

Run: `grep -n '\$19\|\$27' tools/compiler/tests/codegen.test.ts`

If any test asserts on the literal `$19`/`$27` operand text for binary expressions, update the expected string to `$0`/`$8` to match. If no such assertions exist, skip this step.

- [ ] **Step 4: Run the compiler test suite**

Run: `npx vitest run tools/compiler/tests/`
Expected: PASS (existing tests updated in Step 3 if needed; nothing else should reference the old registers).

- [ ] **Step 5: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "fix(compiler): correct arithmetic operand register convention ($0-$8 not $19-$27)"
```

---

### Task 3: Wire up the `MOD` operator

**Files:**
- Modify: `tools/compiler/codegen.ts` (`ROM` table around line 21, `arithmeticRomAddr` around line 610)

**Interfaces:**
- Consumes: `emitRomCall`, `arithmeticRomAddr` (existing, from Task 2's file).
- Produces: `mod` now compiles instead of emitting a `TODO: operator mod` stub.

- [ ] **Step 1: Add the ROM address**

In `tools/compiler/codegen.ts`, in the `ROM` const object (near `FP_DIV: '&H16BD',`), add:

```typescript
  MOD:       '&H105F',
```

- [ ] **Step 2: Wire it into `arithmeticRomAddr`**

Change:

```typescript
  private arithmeticRomAddr(op: BinaryOp): string | undefined {
    switch (op) {
      case '+': return ROM.FP_ADD;
      case '-': return ROM.FP_SUB;
      case '*': return ROM.FP_MUL;
      case '/': return ROM.FP_DIV;
      default: return undefined;
    }
  }
```

to:

```typescript
  private arithmeticRomAddr(op: BinaryOp): string | undefined {
    switch (op) {
      case '+': return ROM.FP_ADD;
      case '-': return ROM.FP_SUB;
      case '*': return ROM.FP_MUL;
      case '/': return ROM.FP_DIV;
      case 'mod': return ROM.MOD;
      default: return undefined;
    }
  }
```

Because `arithmeticRomAddr` now returns a value for `'mod'`, it automatically takes the same operand-setup path as `+`/`-`/`*`/`/` in `emitBinaryExpr` (fixed in Task 2) — no further change needed there.

- [ ] **Step 3: Write a codegen test**

Add to `tools/compiler/tests/codegen.test.ts`:

```typescript
  it('emits a ROM call for MOD', () => {
    const ast = parse('10 A=7 MOD 3\n');
    const asm = generate(ast);
    const romCallLines = asm.lines.filter(l => l.mnemonic === 'ldw' && l.operands === '$2,&H105F');
    expect(romCallLines.length).toBeGreaterThan(0);
  });
```

(Match the existing import/setup style already in that file — `parse`/`generate` should already be imported there for other tests.)

- [ ] **Step 4: Run test, confirm it fails**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "MOD"`
Expected: FAIL (before Step 1/2 changes — run this before applying them if following strict TDD order; otherwise confirm it passes after Step 2 and treat this as the regression guard going forward).

- [ ] **Step 5: Run test, confirm it passes**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts -t "MOD"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): wire up MOD operator to ROM &H105F"
```

---

### Task 4: Use `numberToBcd9()` for constant loading and DATA values

**Files:**
- Modify: `tools/compiler/codegen.ts` (`emitNumberLiteral` around line 459, DATA table emission around line 164)

**Interfaces:**
- Consumes: `numberToBcd9` from `tools/compiler/bcd.ts` (Task 1).
- Produces: `emitNumberLiteral` now emits correct 9-byte BCD data instead of a 2-byte integer stub.

- [ ] **Step 1: Import `numberToBcd9`**

At the top of `tools/compiler/codegen.ts`, add:

```typescript
import { numberToBcd9 } from './bcd.js';
```

- [ ] **Step 2: Replace `emitNumberLiteral`**

Current code:

```typescript
  private emitNumberLiteral(value: number): void {
    // Simplified: load integer value into accumulator register pair
    // Real implementation needs full BCD conversion for the 9-byte FP format
    this.code.push({
      mnemonic: 'ldw',
      operands: `$10,${this.formatNumber(value)}`,
      comment: `load constant ${value} (TODO: BCD conversion)`,
    });
  }
```

Replace with (following the same `DB` data-block + `LDM` load pattern already used by `emitVarLoad9`, and the string-literal pattern at line ~184-190):

```typescript
  private emitNumberLiteral(value: number): void {
    const bytes = numberToBcd9(value);
    const label = `NUM_${this.numberLiteralIndex++}`;
    this.numberLiterals.push({ label, bytes });
    this.code.push({ comment: `load constant ${value}` });
    this.emitVarLoad9(label);
  }
```

This needs two new pieces of state on the code generator class (find where `this.strings: StringInfo[]` and similar fields are declared, near the top of the class, and add alongside them):

```typescript
  private numberLiteralIndex = 0;
  private numberLiterals: Array<{ label: string; bytes: Uint8Array }> = [];
```

- [ ] **Step 3: Emit the number-literal data blocks**

Find where string literals get emitted as `DB` directives (around line 182-190):

```typescript
    // 5. String literals (DB directives)
    if (this.strings.length > 0) {
      this.code.push({ comment: 'String literals' });
      for (const str of this.strings) {
        this.code.push({
          label: str.label,
          mnemonic: 'db',
          operands: this.encodeStringOperand(str.value),
        });
      }
    }
```

Add a parallel block right after it:

```typescript
    // 5b. Number literals (DB directives, 9-byte BCD)
    if (this.numberLiterals.length > 0) {
      this.code.push({ comment: 'Number literals (9-byte BCD)' });
      for (const num of this.numberLiterals) {
        this.code.push({
          label: num.label,
          mnemonic: 'db',
          operands: Array.from(num.bytes).map(b => '&H' + b.toString(16).toUpperCase().padStart(2, '0')).join(','),
        });
      }
    }
```

- [ ] **Step 4: Fix the DATA-table numeric encoding**

Find the DATA table block (around line 151-179):

```typescript
        } else {
          // Store as a 9-byte FP value placeholder (TODO: encode as BCD)
          this.code.push({
            mnemonic: 'dw',
            operands: this.formatNumber(val.value),
            comment: `DATA ${val.value} (TODO: BCD encode)`,
          });
        }
```

Replace with (DATA values need their own labels since `READ` will need to address each one — check `emitRead`/however `DATA_PTR` advancement works in this file to confirm it already advances by a fixed stride; if it assumes a fixed 9-byte stride per numeric entry, emitting 9 raw bytes with no label here, matching that stride, is correct; if it expects a label per entry, give each one a label the same way Step 3 does. Read the `emitRead`/`emitRestore` methods in this file before writing this step's final code — this decision depends on existing conventions this plan doesn't have visibility into from the excerpt alone):

```typescript
        } else {
          const bytes = numberToBcd9(val.value);
          this.code.push({
            mnemonic: 'db',
            operands: Array.from(bytes).map(b => '&H' + b.toString(16).toUpperCase().padStart(2, '0')).join(','),
            comment: `DATA ${val.value}`,
          });
        }
```

- [ ] **Step 5: Write codegen tests**

Add to `tools/compiler/tests/codegen.test.ts`:

```typescript
  it('emits 9-byte BCD data for a number literal', () => {
    const ast = parse('10 A=5\n');
    const asm = generate(ast);
    const dataLine = asm.lines.find(l => l.mnemonic === 'db' && l.label?.startsWith('NUM_'));
    expect(dataLine).toBeDefined();
    const byteCount = dataLine!.operands!.split(',').length;
    expect(byteCount).toBe(9);
  });
```

- [ ] **Step 6: Run tests, confirm they pass**

Run: `npx vitest run tools/compiler/tests/codegen.test.ts`
Expected: PASS.

- [ ] **Step 7: Run the full compiler test suite (regression check)**

Run: `npx vitest run tools/compiler/tests/`
Expected: PASS. If any existing test asserted on the old `ldw $10,<value>` constant-loading pattern, update it to expect the new `DB`/`LDM` pattern instead.

- [ ] **Step 8: Commit**

```bash
git add tools/compiler/codegen.ts tools/compiler/tests/codegen.test.ts
git commit -m "feat(compiler): emit real 9-byte BCD constants instead of 2-byte integer stub"
```

---

### Task 5: Integration test — verify arithmetic round-trips through real ROM calls

**Files:**
- Create: `tools/emu-debugger/tests/arithmetic-bcd.test.ts`

**Interfaces:**
- Consumes: `parse`/`generate`/`assemble` (compiler pipeline), `EmulatorSession` (`tools/emu-debugger/session.js`), `setUa`/`setDelayedUa` (`src/emulator/def.js`) — all existing, following the exact pattern in `tools/emu-debugger/tests/hello-at-1cd0.test.ts`.
- Produces: nothing consumed by later tasks — this is a verification checkpoint before writing `PRIMES.BAS`.

This is the task that actually proves Tasks 1-4 work together correctly, using real ROM arithmetic rather than trusting derived values.

- [ ] **Step 1: Write the failing test**

```typescript
// tools/emu-debugger/tests/arithmetic-bcd.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa } from '../../../src/emulator/def.js';

function runAndGetLcdRow0(basicSource: string): string {
  const ast = parse(basicSource);
  const asm = generate(ast);
  const assembled = assemble(asm.lines);

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(0x1CD0, assembled.binary);
  setUa(0x55);
  setDelayedUa(0x55);
  sess.setEntry(0x1CD0);
  sess.run({ maxCycles: 20_000_000 });
  return sess.getLcd().rows[0]!;
}

describe('compiled arithmetic round-trips through real ROM calls', () => {
  it('adds two constants and prints the correct result', () => {
    const row = runAndGetLcdRow0('10 PRINT 2+3\n20 END\n');
    expect(row).toContain('5');
  });

  it('subtracts', () => {
    const row = runAndGetLcdRow0('10 PRINT 10-4\n20 END\n');
    expect(row).toContain('6');
  });

  it('multiplies', () => {
    const row = runAndGetLcdRow0('10 PRINT 6*7\n20 END\n');
    expect(row).toContain('42');
  });

  it('divides', () => {
    const row = runAndGetLcdRow0('10 PRINT 20/4\n20 END\n');
    expect(row).toContain('5');
  });

  it('computes MOD', () => {
    const row = runAndGetLcdRow0('10 PRINT 17 MOD 5\n20 END\n');
    expect(row).toContain('2');
  });

  it('evaluates a comparison correctly (true branch)', () => {
    const row = runAndGetLcdRow0('10 IF 5>3 THEN PRINT 1\n20 END\n');
    expect(row).toContain('1');
  });

  it('evaluates a comparison correctly (false branch produces no output)', () => {
    const row = runAndGetLcdRow0('10 IF 3>5 THEN PRINT 1\n20 END\n');
    expect(row).not.toContain('1');
  });
}, 60_000);
```

Note: `expect(row).toContain('5')` uses the raw LCD row text, which (per `hello-at-1cd0.test.ts`'s established behavior) renders unrecognized glyphs as `?` — digits and common punctuation render correctly, which is all these assertions need. If a specific assertion is flaky because of how the result is formatted (e.g. trailing spaces, cursor blocks), inspect the actual `row` value with a `console.log` first and adjust the `toContain` substring to match — don't loosen the test to something that could pass on wrong output.

- [ ] **Step 2: Run tests, confirm they fail**

Run: `npx vitest run tools/emu-debugger/tests/arithmetic-bcd.test.ts`
Expected: FAIL or ERROR — before Tasks 1-4 are complete, constants/arithmetic don't work correctly.

(If you're executing this plan strictly in order, Tasks 1-4 are already done by the time you reach this step, so this test should already pass — in that case, treat Step 2 as confirming Step 1's test is well-formed by temporarily reverting `emitNumberLiteral` and observing failure, then restoring it. Don't skip verifying the test can actually fail.)

- [ ] **Step 3: Run tests, confirm they pass**

Run: `npx vitest run tools/emu-debugger/tests/arithmetic-bcd.test.ts`
Expected: PASS. If any individual case fails, that pinpoints exactly which operator/register-convention/encoding issue remains — go back to the relevant earlier task rather than patching around it here.

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/tests/arithmetic-bcd.test.ts
git commit -m "test(compiler): verify BCD arithmetic round-trips through real ROM calls"
```

---

### Task 6: Write `PRIMES.BAS`

**Files:**
- Create: `public/basic/emulator/PRIMES.BAS`
- Create: `public/basic/emulator/PRIMES.md`
- Modify: `public/basic/emulator/catalog.json`

**Interfaces:**
- Consumes: nothing (this is hand-written BASIC source, not compiler code).
- Produces: a BASIC program compilable by the pipeline fixed in Tasks 1-4, and runnable interactively for the interpreted-performance baseline.

- [ ] **Step 1: Write the program**

```basic
10 ' Find the 100th prime via trial division.
20 ' K+K>N stops the search once K exceeds N/2 (no factor above N/2 is
30 ' possible), which is always reached before an integer overflow risk.
40 C=0
50 N=1
100 N=N+1
110 FOR K=2 TO N-1
120   IF K+K>N THEN 200
130   IF N MOD K=0 THEN 100
140 NEXT K
200 C=C+1
210 IF C<100 THEN 100
220 PRINT N
230 END
```

Save this as `public/basic/emulator/PRIMES.BAS`.

- [ ] **Step 2: Verify the algorithm interpretively before worrying about compilation**

This checks the BASIC logic itself is correct, independent of the compiler — catching an algorithm bug here is much faster than debugging it through compiled machine code later.

Create a throwaway check (do not commit — run and delete):

```typescript
// tools/compiler/_check-primes.ts (temporary — delete after this step)
import { boot, typeString, pressExe, runCycles, readLcdRow } from '../tests/emu-harness.js';
import { readFileSync } from 'node:fs';

boot();
const source = readFileSync('public/basic/emulator/PRIMES.BAS', 'utf8');
// Type each line and press EXE to enter it into program memory, matching
// how a user would type a listing in directly.
for (const line of source.trim().split('\n')) {
  typeString(line);
  pressExe();
}
typeString('RUN');
pressExe();
// Trial division to the 100th prime interpreted is expected to take a
// while — give it a generous budget.
runCycles(200_000_000);
console.log('LCD row0:', JSON.stringify(readLcdRow(0)));
```

Run: `npx tsx tools/compiler/_check-primes.ts`
Expected: LCD row0 contains `541` (the 100th prime — verified independently: see the design spec, or recompute with `python3 -c "..."` a simple trial-division script). If it doesn't, fix `PRIMES.BAS`'s logic (not the compiler) and re-run.

Then: `rm tools/compiler/_check-primes.ts`

- [ ] **Step 3: Write the companion doc**

```markdown
# Primes Benchmark

Finds the 100th prime number (541) via trial division, then stops. Written to
benchmark interpreted vs. compiled BASIC performance — see `tools/compiler/README.md`
for how to compile it.

## Algorithm

For each candidate N starting at 2, tries every K from 2 up to N/2 (via the
`K+K>N` check — no factor greater than N/2 is possible) looking for a divisor.
If none divides N evenly, N is prime and the count increments. Stops after
finding the 100th prime.

Deliberately uses only `+`, `-`, `*`, `MOD`, comparisons, and `FOR`/`WHILE`/`GOTO`
— no arrays, no builtin functions (`SQR`/`INT`/etc. aren't wired into the
compiler).

## Running It

**Interpreted (for the performance baseline):**
1. Load into the emulator via **LOAD** or **LIB**
2. Type `RUN` and press **EXE**
3. Time how long it takes to print `541`

**Compiled (for comparison):**
See `tools/compiler/README.md` — compile with
`npx tsx tools/compiler/compile.ts public/basic/emulator/PRIMES.BAS`, then load
and send the resulting `.hex` via `MLLOADER.BAS` (after running `EXTCLR.BAS`
first — see `EXTCLR.md`).

## Expected Output

```
541
```
```

Save as `public/basic/emulator/PRIMES.md`.

- [ ] **Step 4: Register it in the library catalog**

In `public/basic/emulator/catalog.json`, add an entry (matching the existing format — check neighboring entries for exact style; place alphabetically or wherever fits the existing ordering convention in that file):

```json
  {
    "file": "PRIMES.BAS",
    "name": "Primes Benchmark",
    "description": "Finds the 100th prime (541) via trial division — for comparing interpreted vs. compiled BASIC performance"
  },
```

- [ ] **Step 5: Commit**

```bash
git add public/basic/emulator/PRIMES.BAS public/basic/emulator/PRIMES.md public/basic/emulator/catalog.json
git commit -m "feat(library): add PRIMES.BAS performance benchmark"
```

---

### Task 7: End-to-end acceptance test — compile and run `PRIMES.BAS`

**Files:**
- Create: `tools/emu-debugger/tests/primes.test.ts`

**Interfaces:**
- Consumes: the full compiler pipeline (Tasks 1-4) and `public/basic/emulator/PRIMES.BAS` (Task 6).
- Produces: nothing consumed elsewhere — this is the plan's final proof that everything works together.

- [ ] **Step 1: Write the failing test**

```typescript
// tools/emu-debugger/tests/primes.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa } from '../../../src/emulator/def.js';

describe('PRIMES.BAS compiles and runs correctly', () => {
  it('finds the 100th prime (541)', () => {
    const source = readFileSync('public/basic/emulator/PRIMES.BAS', 'utf8');
    const ast = parse(source);
    const asm = generate(ast);
    const assembled = assemble(asm.lines);

    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x1CD0, assembled.binary);
    setUa(0x55);
    setDelayedUa(0x55);
    sess.setEntry(0x1CD0);
    const result = sess.run({ maxCycles: 50_000_000 });

    console.log(`exit=${result.reason} instr=${result.instructionsExecuted}`);
    const row0 = sess.getLcd().rows[0]!;
    console.log('LCD row0:', JSON.stringify(row0));
    expect(row0).toContain('541');
  }, 120_000);
});
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npx vitest run tools/emu-debugger/tests/primes.test.ts`
Expected: FAIL if run before Tasks 1-4 are complete (constants/arithmetic wrong, so the wrong number gets found or the program errors out). If Tasks 1-4 are already done (following this plan in order), this should already pass — in that case this step is redundant with Step 3; note the result and move on rather than artificially breaking working code to watch it fail.

- [ ] **Step 3: Run test, confirm it passes**

Run: `npx vitest run tools/emu-debugger/tests/primes.test.ts`
Expected: PASS, LCD shows `541`.

If it fails with the wrong number: check whether `MOD` (Task 3) is producing correct remainders, and whether comparisons (Task 2's register fix) are evaluating correctly — a single wrong comparison flips the whole prime count.

If it times out or the CPU never reaches the expected instruction count: increase `maxCycles` — trial division to 541 does a meaningful amount of work, and this is compiled (not interpreted) so it should be far faster than the interpreted check in Task 6 Step 2, but confirm before assuming a bug.

- [ ] **Step 4: Commit**

```bash
git add tools/emu-debugger/tests/primes.test.ts
git commit -m "test(compiler): end-to-end acceptance test for PRIMES.BAS"
```

---

### Task 8: Update documentation

**Files:**
- Modify: `tools/compiler/README.md` (Known Limitations section)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing (documentation only).

- [ ] **Step 1: Remove the fixed limitation**

In `tools/compiler/README.md`, find the "Known Limitations" section:

```markdown
## Known Limitations

- **BCD constants**: Numeric constants use simplified integer loads, not full 9-byte BCD encoding. This means floating-point literals like `3.14` won't load correctly yet.
- **ROM addresses**: Many builtin function addresses (SIN, COS, TAN, etc.) are placeholders (`&H0000`). These need to be mapped from the ROM annotations in `reference/fx870p-rom-annotations.md`.
- **Addressing modes**: Some complex programs may hit remaining edge cases where the code generator emits instruction forms that the assembler can't encode.
- **No optimisation**: The compiler emits straightforward code with no peephole optimisation or register allocation beyond the fixed convention.
```

Replace with:

```markdown
## Known Limitations

- **ROM addresses**: Many builtin function addresses (SIN, COS, TAN, SQR, INT, etc.) are placeholders (`&H0000`), and integer division (`\`) beyond what `MOD` needs internally isn't wired up. These need to be mapped from the ROM annotations in `reference/fx870p-rom-annotations.md`.
- **Addressing modes**: Some complex programs may hit remaining edge cases where the code generator emits instruction forms that the assembler can't encode.
- **No optimisation**: The compiler emits straightforward code with no peephole optimisation or register allocation beyond the fixed convention.
```

(BCD constants and arithmetic — including `+`, `-`, `*`, `/`, `MOD`, and comparisons — are now fully implemented; see `bcd.ts` and the design spec at `docs/superpowers/specs/2026-08-12-compiler-bcd-arithmetic-design.md`.)

- [ ] **Step 2: Add a pointer to the new capability**

Near the top of the README (in "How It Works" or wherever numeric handling is described — check the current file structure first), add a short note pointing to `bcd.ts` and mentioning `MOD` is now supported, so future readers don't have to rediscover this from the git log.

- [ ] **Step 3: Commit**

```bash
git add tools/compiler/README.md
git commit -m "docs(compiler): update Known Limitations now that BCD arithmetic is implemented"
```

---

## Self-Review

**Spec coverage:**
- `numberToBcd9()` (integers + decimals) — Task 1. ✓
- Arithmetic register convention fix — Task 2. ✓
- `MOD` wiring — Task 3. ✓
- Constants/DATA use real BCD — Task 4. ✓
- `PRIMES.BAS` — Task 6. ✓
- Verification strategy (round-trip through proven `PRINT`/`CLS`, not fragile ROM helpers) — Task 5 implements exactly this. ✓
- End-to-end acceptance (541) — Task 7. ✓
- README update — Task 8. ✓

**Placeholder scan:** Task 1 Step 6 contains an intentional `throw new Error('not yet implemented...')` — this is not a plan placeholder, it's the correct TDD starting state for a function whose test (Step 4) must fail before Step 6 fills it in for real using Step 2's discovered values. Task 4 Step 4's DATA-table code includes an instruction to read `emitRead`/`emitRestore` before finalizing the exact form, since this plan doesn't have visibility into that method's existing stride/labeling convention — flagged explicitly rather than guessed at.

**Type consistency:** `numberToBcd9(value: number): Uint8Array` (Task 1) is the signature used identically in Task 4's import and usage. `ROM.MOD` (Task 3) matches the naming convention of `ROM.FP_ADD` etc. already in the file. `EmulatorSession`/`setUa`/`setDelayedUa` usage in Tasks 5 and 7 matches `hello-at-1cd0.test.ts` exactly.

---

Plan complete and saved to `docs/superpowers/plans/2026-08-12-compiler-bcd-arithmetic.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
