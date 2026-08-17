// Task 3 acceptance test — proves the loop-shadow entry sequence emitted by
// emitFor actually works on the real CPU, not merely that the right mnemonics
// appeared in the AsmLine[].
//
// This matters more than usual here. The task brief's draft code reached the
// shadow slots with `stw $0,SHADOW_K_CNT` / `st $3,SHADOW_K_ACT`, i.e. a
// direct-absolute memory operand. This CPU has no such addressing mode — the
// mnemonics that look absolute (st_10/stw_90, Kind.REGDIRJR in
// tools/compiler/opcodes.ts) take the address out of a REGISTER PAIR — so the
// slots are reached the same IX-indexed way emitVarLoad9/emitVarStore9 reach a
// BASIC variable. A codegen-shape test cannot tell a working store from a
// plausible-looking one; running it can.
//
// The second thing under test is register discipline. `ldw $r,imm16` is
// ldw_D1 in src/emulator/exec.ts:
//
//     mr[regArg(x)]     = fetchByte();
//     mr[regArg(x + 1)] = fetchByte();
//
// so every shadow-slot address load writes $2 AND $3. The plan's draft parked
// the SHADOW_ACTIVE value in $3 and then loaded the slot address into $2,
// which would have destroyed the value on its way to memory. The flag is
// computed into $9 instead, and the "shadowing is on" case below is what pins
// that: a clobbered flag byte would show up as a wrong SHADOW_*_ACT value.

import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv } from '../../../src/emulator/def.js';

const ORIGIN = 0x1CD0;

interface ShadowState {
  reason: string;
  counter: number;
  limit: number;
  step: number;
  active: number;
}

/**
 * Compile `basic`, run it up to the FOR loop's top label — i.e. with the whole
 * entry-time decode done and not one iteration of the body executed yet — and
 * read the four shadow slots straight out of emulator RAM.
 */
function runToLoopTop(basic: string): ShadowState {
  const asm = generate(parse(basic));
  const assembled = assemble(asm.lines);

  const addressOf = (name: string): number => {
    const entry = assembled.symbols.find(s => s.name === name);
    if (!entry) throw new Error(`symbol ${name} not found`);
    return entry.address;
  };
  // uniqueLabel() suffixes the loop-top label with a counter, so match it by
  // shape rather than by an exact name this test would have to keep in step.
  const loopTop = assembled.symbols.find(s => /^FOR_K_\d+$/.test(s.name));
  if (!loopTop) throw new Error('FOR loop top label not found');
  const int16At = (name: string): number => {
    const bytes = sess.getMemory(addressOf(name), 2);
    const raw = bytes[0]! | (bytes[1]! << 8);
    return raw >= 0x8000 ? raw - 0x10000 : raw;
  };

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(ORIGIN, assembled.binary);

  // MODE110 on hardware sets UA=0x55, which is what puts the fetch segment in
  // Bank 1 RAM and makes `ua >> 4` (the IX data segment every shadow access
  // uses) point at RAM too.
  setUa(0x55);
  setDelayedUa(0x55);
  // Module-global emulator state: a previous session can leave ISERV latched,
  // which forces segment 0 on every fetch and runs ROM instead of this program.
  setIserv(0);
  sess.setEntry(ORIGIN);
  // Stop the instant the loop top is reached: the decode has run exactly once
  // and the body has not run at all.
  sess.addBreakpoint(loopTop.address);

  const result = sess.run({ maxCycles: 5_000_000 });
  return {
    reason: result.reason,
    counter: int16At('SHADOW_K_CNT'),
    limit: int16At('SHADOW_K_LIM'),
    step: int16At('SHADOW_K_STP'),
    active: sess.getMemory(addressOf('SHADOW_K_ACT'), 1)[0]!,
  };
}

describe('FOR loop shadow-slot entry decode (real CPU)', () => {
  it('decodes counter, limit and step into RAM and turns shadowing on', () => {
    const s = runToLoopTop('10 FOR K=1 TO 10\n20 S=S+K\n30 NEXT K\n40 END\n');
    expect(s.reason).toBe('breakpoint');
    expect(s.counter).toBe(1);
    expect(s.limit).toBe(10);
    expect(s.step).toBe(1);
    // Survived three `ldw $2,LABEL` address loads on its way to memory.
    expect(s.active).toBe(1);
  });

  it('carries an explicit STEP through to the shadow step slot', () => {
    const s = runToLoopTop('10 FOR K=0 TO 10 STEP 2\n20 S=S+K\n30 NEXT K\n40 END\n');
    expect(s.reason).toBe('breakpoint');
    expect(s.counter).toBe(0);
    expect(s.limit).toBe(10);
    expect(s.step).toBe(2);
    expect(s.active).toBe(1);
  });

  it('handles a loop whose bounds sit at the int16 edges', () => {
    const s = runToLoopTop('10 FOR K=32000 TO 32767\n20 S=S+K\n30 NEXT K\n40 END\n');
    expect(s.reason).toBe('breakpoint');
    expect(s.counter).toBe(32000);
    expect(s.limit).toBe(32767);
    expect(s.active).toBe(1);
  });

  it('leaves shadowing OFF when a bound does not fit in an int16 at runtime', () => {
    // 40000 is an integer literal, so the loop is statically shadow-eligible —
    // Task 1's classification says nothing about magnitude. Only BCD_TO_INT16's
    // $9 status catches it, and only at run time. Getting this wrong would let
    // Tasks 4/5 run the loop off a truncated limit.
    const s = runToLoopTop('10 FOR K=1 TO 40000\n20 S=S+K\n30 NEXT K\n40 END\n');
    expect(s.reason).toBe('breakpoint');
    expect(s.counter).toBe(1); // the counter decoded fine before the limit failed
    expect(s.active).toBe(0);
  });
});
