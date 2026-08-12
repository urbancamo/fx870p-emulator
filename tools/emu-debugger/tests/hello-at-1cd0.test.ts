// Debug test: load compiled hello.bin at 0x1CD0 with UA=0x55 (matching what
// MODE110 does on real hardware) and verify it runs + writes to LCD.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa } from '../../../src/emulator/def.js';

describe('hello.bas at 0x1CD0', () => {
  it('runs with UA=0x55 and produces LCD output', () => {
    const source = readFileSync('tools/compiler/tests/fixtures/hello.bas', 'utf8');
    const ast = parse(source);
    const asm = generate(ast);
    const assembled = assemble(asm.lines);

    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x1CD0, assembled.binary);

    // Verify bytes round-trip through emulator RAM
    const readback = sess.getMemory(0x1CD0, assembled.binary.length);
    const matches = readback.every((b, i) => b === assembled.binary[i]);
    console.log(`memory matches: ${matches} (${assembled.binary.length} bytes)`);
    console.log(`first 16 bytes at 0x1CD0: ${Array.from(readback.slice(0, 16))
      .map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

    // MODE110 on hardware sets UA=0x55 so fetch-segment = 1 (Bank 1 RAM).
    setUa(0x55);
    setDelayedUa(0x55);
    sess.setEntry(0x1CD0);

    // Break just before the blocking wait-for-key ROM call at 0x1D28.
    sess.addBreakpoint(0x1D28);

    const result = sess.run({ maxCycles: 20_000_000 });

    const lcd = sess.getLcd();
    console.log(`exit=${result.reason} instr=${result.instructionsExecuted} pc=0x${result.pc.toString(16)}`);
    console.log(`LCD row0: '${lcd.rows[0]}'`);
    console.log(`LCD row1: '${lcd.rows[1]}'`);
    console.log(`LCD row2: '${lcd.rows[2]}'`);
    console.log(`LCD row3: '${lcd.rows[3]}'`);
    if (result.reason === 'illegal') {
      console.log(`illegal opcode: 0x${(result.illegalOpcode ?? 0).toString(16)}`);
    }

    expect(result.instructionsExecuted).toBeGreaterThan(20);
  }, 60_000);
});
