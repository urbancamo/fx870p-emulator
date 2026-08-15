// Task 2 acceptance test — proves the two shared BCD <-> int16 conversion
// subroutines are correct by running them on the real CPU, through the real
// assembler and the real emulator memory model, and comparing against
// bcd.ts's numberToBcd9() as an independent oracle.
//
// Nothing in this codebase converted between binary and BCD before this task:
// every previous compiler path handed 9-byte BCD values straight to the ROM's
// FP routines. Every instruction these routines use was read out of
// src/emulator/exec.ts first (the flag conventions here are unusual — Z_bit is
// set when a result is NON-zero, and the nibble-shift family shifts by 4 bits,
// not by a decimal digit), but this branch's history is that reading the
// emulator is necessary and not sufficient. So each routine is pinned three
// ways:
//
//   1. decode alone -- the exact 16-bit value it leaves in $0/$1, plus proof
//      that it did not disturb the caller's BCD accumulator ($10-$18 are
//      stored to a second variable afterwards and must come back unchanged;
//      the BCD fallback in Task 3 depends on exactly that).
//   2. encode alone -- fed a literal 16-bit value spliced in as `ldw $0,imm`,
//      so a compensating pair of decode/encode bugs cannot hide.
//   3. the full round trip -- byte-exact against numberToBcd9().
//
// Plus the rejection contract (`$9 = 1`), which is what stops a value that
// never fitted in 16 bits from being silently truncated into the fast path,
// and a register-preservation check covering the registers ROM_CALL_FP and the
// BCD operand staging rely on.

import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { numberToBcd9 } from '../../compiler/bcd.js';
import type { AsmLine } from '../../compiler/asm-types.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv, mr } from '../../../src/emulator/def.js';

const ORIGIN = 0x1CD0;

function hex(bytes: Uint8Array | number[]): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
}

interface RunResult {
  reason: string;
  /** VAR_B: whatever the 9-byte accumulator held when the program stored it. */
  varB: Uint8Array;
  /** The conversion result register pair, as an unsigned 16-bit value. */
  int16: number;
  /** BCD_TO_INT16's status register. */
  status: number;
  registers: Uint8Array;
  instructions: number;
}

/**
 * `10 B=A` compiles to "load VAR_A into the accumulator, store the accumulator
 * to VAR_B". Splicing instructions between those two halves is the smallest
 * harness that exercises a conversion exactly the way Task 3's fast path will:
 * real compiled code, real accumulator, real `cal` into the shared routine.
 *
 * (Task 3 is what adds the emitBcdToInt16()/emitInt16ToBcd() call sites to
 * codegen itself; until then the same two `cal`s are spliced in here.)
 */
function runSpliced(
  spliced: AsmLine[],
  seed: Uint8Array,
  beforeRun?: () => void,
): RunResult {
  const lines: AsmLine[] = generate(parse('10 B=A\n20 END\n')).lines;
  const loadEnd = lines.findIndex(
    l => l.mnemonic === 'ld' && l.operands === '$18,(ix+&H08)',
  );
  expect(loadEnd, 'accumulator load tail not found in the compiled program').toBeGreaterThan(0);
  lines.splice(loadEnd + 1, 0, ...spliced);

  const assembled = assemble(lines);
  const addressOf = (name: string): number => {
    const entry = assembled.symbols.find(s => s.name === name);
    if (!entry) throw new Error(`symbol ${name} not found`);
    return entry.address;
  };

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(ORIGIN, assembled.binary);
  sess.loadBinary(addressOf('VAR_A'), seed);

  // MODE110 on hardware sets UA=0x55 so the fetch segment is Bank 1 RAM.
  setUa(0x55);
  setDelayedUa(0x55);
  // Module-global emulator state: a previous session can leave ISERV latched,
  // which forces segment 0 on every fetch and runs ROM instead of this program.
  setIserv(0);
  sess.setEntry(ORIGIN);
  sess.addBreakpoint(addressOf('L20')); // stop at END, before the wait-for-key

  beforeRun?.();

  const result = sess.run({ maxCycles: 5_000_000 });
  const regs = sess.getRegisters();
  return {
    reason: result.reason,
    varB: sess.getMemory(addressOf('VAR_B'), 9),
    int16: regs.mr[0]! | (regs.mr[1]! << 8),
    status: regs.mr[9]!,
    registers: regs.mr,
    instructions: result.instructionsExecuted,
  };
}

const cal = (target: string): AsmLine => ({ mnemonic: 'cal', operands: target });

/** The nine values the plan requires, boundaries included. */
const CASES = [0, 1, -1, 541, -541, 32767, -32768, 9999, -9999];

describe('BCD -> int16 decode (real CPU)', () => {
  for (const n of CASES) {
    it(`decodes ${n} to the right 16-bit value and leaves the accumulator intact`, () => {
      const seed = numberToBcd9(n);
      const run = runSpliced([cal('BCD_TO_INT16')], seed);
      const want = n < 0 ? n + 0x10000 : n;

      expect(run.reason).toBe('breakpoint');
      expect(run.status, `status for ${n}`).toBe(0);
      expect(
        run.int16.toString(16),
        `decoded ${n} as 0x${run.int16.toString(16)}`,
      ).toBe(want.toString(16));
      // The BCD path fallback in Task 3 re-uses the operand still sitting in
      // $10-$18, so decoding must not consume it.
      expect(hex(run.varB), 'accumulator clobbered by BCD_TO_INT16').toBe(hex(seed));
    }, 60_000);
  }
});

describe('int16 -> BCD encode (real CPU, literal input)', () => {
  // Fed straight into $0/$1, so this test does not depend on decode at all.
  const encodeCases = [0, 1, -1, 9, 10, 99, 100, 541, -541, 1337, 10000, 12345, 32767, -32768];
  for (const n of encodeCases) {
    it(`encodes ${n}`, () => {
      const raw = (n < 0 ? n + 0x10000 : n) & 0xFFFF;
      const run = runSpliced(
        [
          { mnemonic: 'ldw', operands: `$0,&H${raw.toString(16).toUpperCase().padStart(4, '0')}` },
          cal('INT16_TO_BCD'),
        ],
        numberToBcd9(0),
      );
      expect(run.reason).toBe('breakpoint');
      expect(hex(run.varB), `INT16_TO_BCD(${n})`).toBe(hex(numberToBcd9(n)));
    }, 60_000);
  }
});

describe('BCD <-> int16 conversion round-trip (via the real ROM/CPU, not simulated)', () => {
  for (const n of CASES) {
    it(`round-trips ${n}`, () => {
      const run = runSpliced([cal('BCD_TO_INT16'), cal('INT16_TO_BCD')], numberToBcd9(n));
      expect(run.reason).toBe('breakpoint');
      expect(hex(run.varB), `round-trip of ${n}`).toBe(hex(numberToBcd9(n)));
    }, 60_000);
  }
});

describe('BCD -> int16 rejects everything that is not an exact int16', () => {
  // Task 1's classification says nothing about magnitude, so a variable can be
  // "integer-eligible" and still hold 1,000,000. Callers MUST test $9: the
  // post-arithmetic carry check cannot see an operand that never fitted.
  const rejects = [
    [32768, 'one past the positive limit'],
    [-32769, 'one past the negative limit'],
    [40000, 'five digits, above the limit'],
    [-40000, 'five digits, below the limit'],
    [100000, 'six integer digits'],
    [99999, 'five digits, overflows during accumulation'],
    [1.5, 'fractional digit past the units place'],
    [0.5, 'magnitude below 1'],
    [-0.25, 'negative magnitude below 1'],
    [1e12, 'far outside the range'],
  ] as const;

  for (const [n, why] of rejects) {
    it(`rejects ${n} (${why})`, () => {
      const run = runSpliced([cal('BCD_TO_INT16')], numberToBcd9(n));
      expect(run.reason).toBe('breakpoint');
      expect(run.status, `${n} should not be convertible`).toBe(1);
    }, 60_000);
  }
});

describe('conversion routines respect the register conventions on this branch', () => {
  it('preserves $19-$29 (BCD operand staging and the ROM_CALL_FP wrapper) and $30/$31', () => {
    // $19-$27 hold a binary expression's pushed-back left operand; $19/$20 and
    // $28/$29 are ROM_CALL_FP's own registers; $30/$31 are ROM globals
    // ($31 = 0, $30 = 1) that SX/SY name and every IX-displacement in this
    // compiler's output depends on.
    const sentinels = new Map<number, number>();
    const run = runSpliced(
      [cal('BCD_TO_INT16'), cal('INT16_TO_BCD')],
      numberToBcd9(-12345),
      () => {
        for (let r = 19; r <= 29; r++) {
          const v = 0xA0 + r;
          mr[r] = v;
          sentinels.set(r, v);
        }
        sentinels.set(30, mr[30]!);
        sentinels.set(31, mr[31]!);
      },
    );

    expect(run.reason).toBe('breakpoint');
    for (const [reg, value] of sentinels) {
      expect(run.registers[reg], `$${reg} was clobbered`).toBe(value);
    }
    // ...and the conversion itself still worked with those registers occupied.
    expect(hex(run.varB)).toBe(hex(numberToBcd9(-12345)));
  }, 60_000);
});
