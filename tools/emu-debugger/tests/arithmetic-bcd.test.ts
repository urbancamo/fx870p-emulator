// tools/emu-debugger/tests/arithmetic-bcd.test.ts
import { describe, it, expect } from 'vitest';
import { parse } from '../../compiler/parser.js';
import { generate } from '../../compiler/codegen.js';
import { assemble } from '../../compiler/assembler.js';
import { EmulatorSession } from '../session.js';
import { setUa, setDelayedUa, setIserv } from '../../../src/emulator/def.js';

function runAndGetLcdRow0(basicSource: string): string {
  const ast = parse(basicSource);
  const asm = generate(ast);
  const assembled = assemble(asm.lines);

  const sess = new EmulatorSession({ mode: 'snapshot' });
  sess.loadBinary(0x1CD0, assembled.binary);
  setUa(0x55);
  setDelayedUa(0x55);
  setIserv(0);
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
