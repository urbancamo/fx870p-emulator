// tools/compiler/tests/loader.test.ts
import { describe, it, expect } from 'vitest';
import { generateLoader } from '../loader.js';

describe('loader generator', () => {
  it('generates valid BASIC program', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE, 0xEE]),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 2,
    });
    expect(loader).toContain('MODE110');
    expect(loader).toContain('DATA');
    expect(loader).toContain('POKE');
  });

  it('includes header comments', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain('Compiled: TEST.BAS');
    expect(loader).toContain('Size: 1 bytes');
  });

  it('encodes binary as hex DATA statements', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0x48, 0x65, 0x6C]),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 3,
    });
    expect(loader).toContain('48656C');
  });

  it('calls MODE110 with entry point', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0x0100,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain('MODE110(256)');
  });

  it('splits long binaries into 24-byte DATA lines', () => {
    const binary = new Uint8Array(50);
    binary.fill(0xAA);
    const loader = generateLoader({ binary, entryPoint: 0, sourceFile: 'TEST.BAS', totalSize: 50 });
    const dataLines = loader.split('\n').filter(l => l.includes('DATA'));
    expect(dataLines.length).toBe(3); // 24 + 24 + 2
  });
});
