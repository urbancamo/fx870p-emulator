// tools/compiler/tests/loader.test.ts
import { describe, it, expect } from 'vitest';
import { generateLoader, generateHexPayload } from '../loader.js';

describe('generateLoader (generic)', () => {
  it('generates valid streaming BASIC program', () => {
    const loader = generateLoader();
    expect(loader).toContain('MODE110');
    expect(loader).toContain('OPEN "COM0:');
    expect(loader).toContain('INPUT$(1,#1)');
    expect(loader).toContain('POKE');
    expect(loader).toContain('CLOSE');
  });

  it('is truly generic — no size/source baked in', () => {
    const loader = generateLoader();
    // Should read size from payload via GOSUB, not a fixed FOR limit
    expect(loader).toContain('GOSUB 200');
    expect(loader).toContain('N=P*256');  // size assembly from hex bytes
    // No hardcoded byte count in the main loop
    expect(loader).toContain('FOR I=0 TO N-1');
  });

  it('sets DEFSEG=&H01CD for entry point &H1CD0', () => {
    const loader = generateLoader();
    expect(loader).toContain('DEFSEG=&H01CD');
    expect(loader).toContain('MODE110(&H1CD0)');
  });

  it('includes checksum verification', () => {
    const loader = generateLoader();
    expect(loader).toContain('CHECKSUM ERROR');
    expect(loader).toContain('S=(S+P) MOD 256');
  });
});

describe('generateHexPayload', () => {
  it('encodes size prefix + bytes + checksum', () => {
    const payload = generateHexPayload(new Uint8Array([0x48, 0x65, 0x6C]));
    // Size=3 → 0003, bytes=48 65 6C, checksum = 0x119 & 0xFF = 0x19
    expect(payload).toBe('000348656C19');
  });

  it('empty binary produces size=0000 + checksum=00', () => {
    const payload = generateHexPayload(new Uint8Array([]));
    expect(payload).toBe('000000');
  });

  it('checksum wraps at 256', () => {
    const payload = generateHexPayload(new Uint8Array([0xFF, 0x01]));
    // Size=2 → 0002, bytes=FF 01, checksum = 0x100 & 0xFF = 0x00
    expect(payload).toBe('0002FF0100');
  });

  it('size prefix is big-endian', () => {
    const binary = new Uint8Array(258);  // 0x0102
    const payload = generateHexPayload(binary);
    expect(payload.substring(0, 4)).toBe('0102');
  });

  it('total length is 4 + 2*N + 2', () => {
    const payload = generateHexPayload(new Uint8Array(50));
    expect(payload.length).toBe(4 + 100 + 2);
  });

  it('rejects binaries over 65535 bytes', () => {
    expect(() => generateHexPayload(new Uint8Array(65536))).toThrow(/too large/);
  });
});
