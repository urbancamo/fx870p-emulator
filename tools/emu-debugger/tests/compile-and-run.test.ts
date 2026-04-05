// tools/emu-debugger/tests/compile-and-run.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';

describe('compile-and-run integration', () => {
  it('compiles and executes hello.bas', () => {
    const source = readFileSync('tools/compiler/tests/fixtures/hello.bas', 'utf8');
    const ast = parse(source);
    const asm = generate(ast);
    const assembled = assemble(asm.lines);

    const sess = new EmulatorSession({ mode: 'snapshot' });
    sess.loadBinary(0x0000, assembled.binary);
    sess.setEntry(0x0000);
    const result = sess.run({ maxCycles: 1_000_000 });

    console.log(`hello.bas exit: ${result.reason} after ${result.instructionsExecuted} instructions, PC=0x${result.pc.toString(16)}`);
    console.log('LCD rows:', sess.getLcd().rows);

    // The test initially just verifies that we GET an exit reason — crashes
    // produce 'illegal' or 'halted' which is the signal we need to debug.
    expect(result.instructionsExecuted).toBeGreaterThan(0);
    expect(typeof result.reason).toBe('string');
  }, 60_000);
});
