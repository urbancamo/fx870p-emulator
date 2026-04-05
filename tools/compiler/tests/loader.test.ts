// tools/compiler/tests/loader.test.ts
import { describe, it, expect } from 'vitest';
import { generateLoader, generateHexPayload } from '../loader.js';

describe('loader generator', () => {
  it('generates valid streaming BASIC program', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE, 0xEE]),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 2,
    });
    expect(loader).toContain('MODE110');
    expect(loader).toContain('OPEN "COM0:');
    expect(loader).toContain('INPUT$(1,#1)');
    expect(loader).toContain('POKE');
    expect(loader).toContain('CLOSE');
  });

  it('includes header comments', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain('Streaming loader for: TEST.BAS');
    expect(loader).toContain('Size: 1 bytes');
  });

  it('sets DEFSEG to entryPoint / 16', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0x1CD0,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain('DEFSEG=&H01CD');
  });

  it('calls MODE110 with entry point', () => {
    const loader = generateLoader({
      binary: new Uint8Array([0xCE]),
      entryPoint: 0x0100,
      sourceFile: 'TEST.BAS',
      totalSize: 1,
    });
    expect(loader).toContain('MODE110(&H0100)');
  });

  it('generates FOR loop for totalSize bytes', () => {
    const loader = generateLoader({
      binary: new Uint8Array(71),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 71,
    });
    expect(loader).toContain('FOR I=0 TO 70');
  });

  it('includes checksum verification', () => {
    const loader = generateLoader({
      binary: new Uint8Array(10),
      entryPoint: 0,
      sourceFile: 'TEST.BAS',
      totalSize: 10,
    });
    expect(loader).toContain('CHECKSUM ERROR');
    expect(loader).toContain('S=(S+P) MOD 256');
  });

  it('loader size is constant regardless of binary size', () => {
    const small = generateLoader({ binary: new Uint8Array(10), entryPoint: 0, sourceFile: 'S.BAS', totalSize: 10 });
    const large = generateLoader({ binary: new Uint8Array(10000), entryPoint: 0, sourceFile: 'L.BAS', totalSize: 10000 });
    expect(small.split('\n').length).toBe(large.split('\n').length);
  });
});

describe('generateHexPayload', () => {
  it('encodes bytes as uppercase hex', () => {
    const payload = generateHexPayload(new Uint8Array([0x48, 0x65, 0x6C]));
    // 0x48 + 0x65 + 0x6C = 0x119 → checksum = 0x19
    expect(payload).toBe('48656C19');
  });

  it('empty binary produces just checksum (00)', () => {
    const payload = generateHexPayload(new Uint8Array([]));
    expect(payload).toBe('00');
  });

  it('checksum wraps at 256', () => {
    const payload = generateHexPayload(new Uint8Array([0xFF, 0x01]));
    // 0xFF + 0x01 = 0x100 → checksum = 0x00
    expect(payload).toBe('FF0100');
  });

  it('payload length is 2*N + 2', () => {
    const payload = generateHexPayload(new Uint8Array(50));
    expect(payload.length).toBe(102);  // 50 * 2 + 2 checksum
  });
});
