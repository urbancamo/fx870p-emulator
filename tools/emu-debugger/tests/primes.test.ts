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
    // Trial division to the 100th prime does a lot of work: the program
    // reaches PRINT well past 200M cycles (measured ~250M) and then blocks
    // on a key-wait loop for the rest of any budget, so this ceiling is
    // sized to comfortably clear the PRINT, not to let the program finish
    // "running" in any other sense.
    const result = sess.run({ maxCycles: 300_000_000 });

    console.log(`exit=${result.reason} instr=${result.instructionsExecuted}`);
    const row0 = sess.getLcd().rows[0]!;
    console.log('LCD row0:', JSON.stringify(row0));
    expect(row0).toContain('541');
  }, 120_000);
});
