// tools/compiler/tests/assembler.test.ts
import { describe, it, expect } from 'vitest';
import {
  encodeInstruction,
  Imm7RangeError,
  UnresolvedTargetError,
  isImm7RangeError,
} from '../opcodes.js';
import { assemble } from '../assembler.js';
import type { AsmLine } from '../asm-types.js';

describe('opcode encoding', () => {

  // ── Pseudo-instructions ──

  it('encodes DB string', () => {
    const bytes = encodeInstruction('db', '"Hello"');
    expect(Array.from(bytes)).toEqual([0x48, 0x65, 0x6C, 0x6C, 0x6F]);
  });

  it('encodes DB hex bytes', () => {
    const bytes = encodeInstruction('db', '&H48,&H65');
    expect(Array.from(bytes)).toEqual([0x48, 0x65]);
  });

  it('encodes DW &H1234', () => {
    const bytes = encodeInstruction('dw', '&H1234');
    expect(Array.from(bytes)).toEqual([0x34, 0x12]);  // little-endian
  });

  it('encodes DS 9', () => {
    const bytes = encodeInstruction('ds', '9');
    expect(bytes.length).toBe(9);
    expect(bytes.every(b => b === 0)).toBe(true);
  });

  // ── Simple no-operand instructions ──

  it('encodes NOP', () => {
    // nop is at mnemTab index 0xF8 with Kind.NONE
    const bytes = encodeInstruction('nop', '');
    expect(Array.from(bytes)).toEqual([0xF8]);
  });

  it('encodes RTN (unconditional)', () => {
    // rtn unconditional is at index 0xF7 with Kind.NONE
    const bytes = encodeInstruction('rtn', '');
    expect(Array.from(bytes)).toEqual([0xF7]);
  });

  it('encodes BUP', () => {
    // bup is at index 0xD8 with Kind.NONE
    const bytes = encodeInstruction('bup', '');
    expect(Array.from(bytes)).toEqual([0xD8]);
  });

  it('encodes BDN', () => {
    const bytes = encodeInstruction('bdn', '');
    expect(Array.from(bytes)).toEqual([0xD9]);
  });

  // ── Conditional return ──

  it('encodes RTN Z', () => {
    // rtn z: index 0xF0 (0xF0 & 7 == 0 == z)
    const bytes = encodeInstruction('rtn', 'z');
    expect(Array.from(bytes)).toEqual([0xF0]);
  });

  it('encodes RTN NC', () => {
    // rtn nc: index 0xF1 (0xF1 & 7 == 1 == nc)
    const bytes = encodeInstruction('rtn', 'nc');
    expect(Array.from(bytes)).toEqual([0xF1]);
  });

  it('encodes RTN NZ', () => {
    const bytes = encodeInstruction('rtn', 'nz');
    expect(Array.from(bytes)).toEqual([0xF4]);
  });

  it('encodes RTN C', () => {
    const bytes = encodeInstruction('rtn', 'c');
    expect(Array.from(bytes)).toEqual([0xF5]);
  });

  // ── Register instructions (Kind.REG) ──

  it('encodes PHS $0 (push stack)', () => {
    // phs is at index 0x26 with Kind.REG
    const bytes = encodeInstruction('phs', '$0');
    expect(Array.from(bytes)).toEqual([0x26, 0x00]);
  });

  it('encodes PHS $1', () => {
    const bytes = encodeInstruction('phs', '$1');
    expect(Array.from(bytes)).toEqual([0x26, 0x01]);
  });

  it('encodes PPS $0 (pop stack)', () => {
    // pps is at index 0x2E with Kind.REG
    const bytes = encodeInstruction('pps', '$0');
    expect(Array.from(bytes)).toEqual([0x2E, 0x00]);
  });

  it('encodes PHSW $1 (push stack word)', () => {
    // phsw is at index 0xA6 with Kind.REG
    const bytes = encodeInstruction('phsw', '$1');
    expect(Array.from(bytes)).toEqual([0xA6, 0x01]);
  });

  it('encodes PPSW $0 (pop stack word)', () => {
    // ppsw is at index 0xAE with Kind.REG
    const bytes = encodeInstruction('ppsw', '$0');
    expect(Array.from(bytes)).toEqual([0xAE, 0x00]);
  });

  // ── Unconditional jump (Kind.JR) ──

  it('encodes JR (unconditional, positive offset)', () => {
    // jr unconditional is at index 0xB7 with Kind.JR
    // jr at PC=0, target=&H07 -> opcode at PC=0, imm7 at PC=1
    // In byte memory, the executor captures y = pc AFTER the opcode byte has
    // been fetched but BEFORE the offset byte. So y = instr_addr + 1 and
    // target = (instr_addr + 1) + offset, i.e. offset = target - (pc + 1)
    // offset = 7 - 1 = 6
    const bytes = encodeInstruction('jr', '&H0007', 0x0000);
    expect(bytes[0]).toBe(0xB7);
    expect(bytes[1]).toBe(6);  // positive offset
  });

  it('encodes JR (unconditional, negative offset)', () => {
    // jr at PC=0x100, target=0xFE -> offset = 0xFE - 0x101 = -3
    // HD61700 encoding: raw = 0x80 + abs(offset) = 0x83
    // Decoder: 0x80 - 0x83 = -3 ✓
    const bytes = encodeInstruction('jr', '&H00FE', 0x0100);
    expect(bytes[0]).toBe(0xB7);
    expect(bytes[1]).toBe(0x83);
  });

  // ── Conditional jump (Kind.JRCC) ──

  it('encodes JR Z,target', () => {
    // jr z is at index 0xB0 (0xB0 & 7 == 0 == z)
    const bytes = encodeInstruction('jr', 'z,&H0007', 0x0000);
    expect(bytes[0]).toBe(0xB0);
    expect(bytes[1]).toBe(6);  // target=7, pc+1=1, offset=6
  });

  // ── Absolute jump (Kind.JP / Kind.JPCC) ──

  it('encodes JP &H1234 (unconditional)', () => {
    // jp unconditional is at index 0x37 with Kind.JP
    const bytes = encodeInstruction('jp', '&H1234');
    expect(bytes[0]).toBe(0x37);
    expect(bytes[1]).toBe(0x34);  // low byte
    expect(bytes[2]).toBe(0x12);  // high byte
  });

  it('encodes JP $2 (register indirect via Kind.REG)', () => {
    // jp REG is at index 0xDE
    const bytes = encodeInstruction('jp', '$2');
    expect(bytes[0]).toBe(0xDE);
    expect(bytes[1]).toBe(0x02);
  });

  it('encodes JP ($2) (indirect via Kind.DIR)', () => {
    // jp DIR is at index 0xDF
    const bytes = encodeInstruction('jp', '($2)');
    expect(bytes[0]).toBe(0xDF);
    expect(bytes[1]).toBe(0x02);
  });

  it('encodes JP NZ,&H5000 (conditional)', () => {
    // jp nz: index 0x34 (0x34 & 7 == 4 == nz)
    const bytes = encodeInstruction('jp', 'nz,&H5000');
    expect(bytes[0]).toBe(0x34);
    expect(bytes[1]).toBe(0x00);  // low
    expect(bytes[2]).toBe(0x50);  // high
  });

  // ── CAL (Kind.JP / Kind.JPCC) ──

  it('encodes CAL &H1000 (unconditional)', () => {
    // cal unconditional is at index 0x77 with Kind.JP
    const bytes = encodeInstruction('cal', '&H1000');
    expect(bytes[0]).toBe(0x77);
    expect(bytes[1]).toBe(0x00);  // low byte
    expect(bytes[2]).toBe(0x10);  // high byte
  });

  it('encodes CAL Z,&H2000 (conditional)', () => {
    // cal z: index 0x70 (0x70 & 7 == 0 == z)
    const bytes = encodeInstruction('cal', 'z,&H2000');
    expect(bytes[0]).toBe(0x70);
    expect(bytes[1]).toBe(0x00);
    expect(bytes[2]).toBe(0x20);
  });

  // ── Register-register (Kind.REGREGJR) ──

  it('encodes LD $10,$0 (register to register, src via SIR)', () => {
    // ld REGREGJR is at index 0x02
    // $0 as source: reg 0 = $sx (SIR index 0), bits [6:5] = 0b00 = 0x00
    // Wait - $0 is register 0, but shortReg means SIR (sx/sy/sz) or general reg.
    // The source "$0" means register $0 as a general register, so we need bits [6:5]=0b11=0x60
    // and an extra byte with value 0.
    // But actually in the disassembler, shortRegArg checks if (x & 0x60) === 0x60
    // meaning bits [6:5] == 0b11. If so, next byte is a general register index.
    // Otherwise, sirArg is used: sirtab[(x >> 5) & 3] = sx/sy/sz/??

    // So "$0" as a general register: bits [6:5] = 0b11 (0x60), extra byte = 0
    // dest $10 in bits [4:0] = 10
    // operand byte = 10 | 0x60 = 0x6A
    const bytes = encodeInstruction('ld', '$10,$0');
    expect(bytes[0]).toBe(0x02);
    expect(bytes[1]).toBe(0x6A);  // dest=10, src=general reg (0x60)
    expect(bytes[2]).toBe(0x00);  // src register index = 0
    expect(bytes.length).toBe(3);
  });

  it('encodes LD $1,$sx (register to register, src is SIR)', () => {
    // ld REGREGJR at index 0x02
    // src is $sx: SIR index 0, bits [6:5] = 0b00
    // dest $1, bits [4:0] = 1
    // operand byte = 1 | 0x00 = 0x01
    const bytes = encodeInstruction('ld', '$1,$sx');
    expect(bytes[0]).toBe(0x02);
    expect(bytes[1]).toBe(0x01);  // dest=1, src=sx (bits[6:5]=0)
    expect(bytes.length).toBe(2);
  });

  it('encodes AD $10,$11 (register add)', () => {
    // ad REGREGJR is at index 0x08
    // src $11: general register, bits [6:5] = 0b11 = 0x60, extra byte = 11
    // dest $10 in bits [4:0] = 10
    const bytes = encodeInstruction('ad', '$10,$11');
    expect(bytes[0]).toBe(0x08);
    expect(bytes[1]).toBe(0x6A);  // dest=10, src=general (0x60)
    expect(bytes[2]).toBe(0x0B);  // src reg index = 11
  });

  it('encodes AN $5,$sy (logical AND)', () => {
    // an REGREGJR at index 0x0C
    // src $sy: SIR index 1, bits [6:5] = 0b01 = 0x20
    // dest $5, bits [4:0] = 5
    const bytes = encodeInstruction('an', '$5,$sy');
    expect(bytes[0]).toBe(0x0C);
    expect(bytes[1]).toBe(0x25);  // dest=5, src=sy (0x20)
    expect(bytes.length).toBe(2);
  });

  it('encodes SB $3,$sz (subtract)', () => {
    // sb REGREGJR at index 0x09
    // src $sz: SIR index 2, bits [6:5] = 0b10 = 0x40
    const bytes = encodeInstruction('sb', '$3,$sz');
    expect(bytes[0]).toBe(0x09);
    expect(bytes[1]).toBe(0x43);  // dest=3, src=sz (0x40)
    expect(bytes.length).toBe(2);
  });

  // ── Register-immediate (Kind.REGIM8JR) ──

  it('encodes LD $5,&H42 (immediate)', () => {
    // ld REGIM8JR at index 0x42
    const bytes = encodeInstruction('ld', '$5,&H42');
    expect(bytes[0]).toBe(0x42);
    expect(bytes[1]).toBe(0x05);  // dest=5
    expect(bytes[2]).toBe(0x42);  // immediate
    expect(bytes.length).toBe(3);
  });

  it('encodes AD $0,&HFF (immediate add)', () => {
    // ad REGIM8JR at index 0x48
    const bytes = encodeInstruction('ad', '$0,&HFF');
    expect(bytes[0]).toBe(0x48);
    expect(bytes[1]).toBe(0x00);
    expect(bytes[2]).toBe(0xFF);
  });

  // ── PST / GST (Kind.R8IM8 and Kind.R8REGJR) ──

  it('encodes PST UA,&H54 (immediate)', () => {
    // pst R8IM8: index 0x56 (even, row=0) or 0x57 (odd, row=1)
    // ua is r8tab[0][3] -> row=0, col=3 -> needs even index -> 0x56
    // operand byte = col<<5 = 3<<5 = 0x60, then &H54
    const bytes = encodeInstruction('pst', 'ua,&H54');
    expect(bytes[0]).toBe(0x56);
    expect(bytes[1]).toBe(0x60);  // col=3 << 5
    expect(bytes[2]).toBe(0x54);
    expect(bytes.length).toBe(3);
  });

  it('encodes PST PE,&H00 (immediate)', () => {
    // pe is r8tab[0][0] -> row=0, col=0 -> even index -> 0x56
    const bytes = encodeInstruction('pst', 'pe,&H00');
    expect(bytes[0]).toBe(0x56);
    expect(bytes[1]).toBe(0x00);  // col=0 << 5
    expect(bytes[2]).toBe(0x00);
  });

  it('encodes PST IA,&H10 (immediate)', () => {
    // ia is r8tab[1][0] -> row=1, col=0 -> odd index -> 0x57
    const bytes = encodeInstruction('pst', 'ia,&H10');
    expect(bytes[0]).toBe(0x57);
    expect(bytes[1]).toBe(0x00);  // col=0 << 5
    expect(bytes[2]).toBe(0x10);
  });

  it('encodes GST UA,$5 (register)', () => {
    // gst R8REGJR: index 0x1E (even, row=0) or 0x1F (odd, row=1)
    // ua is row=0, col=3 -> even index -> 0x1E
    const bytes = encodeInstruction('gst', 'ua,$5');
    expect(bytes[0]).toBe(0x1E);
    expect(bytes[1]).toBe(0x65);  // col=3<<5 | reg=5 = 0x60|5 = 0x65
    expect(bytes.length).toBe(2);
  });

  // ── LDW with 16-bit immediate (extension opcode) ──

  it('encodes LDW $2,&H2ADF (16-bit immediate)', () => {
    // ldw REGIM16 is in extTab at ex(21): base = 256+21*4 = 340, variant 0 -> index 340
    // The host opcode for ex(21) is at mnemTab index 0xD1
    // Encoding: host opcode, then (variant<<5 | reg), then imm16 LE
    const bytes = encodeInstruction('ldw', '$2,&H2ADF');
    expect(bytes[0]).toBe(0xD1);  // host opcode
    expect(bytes[1]).toBe(0x02);  // variant=0<<5 | reg=2
    expect(bytes[2]).toBe(0xDF);  // low byte
    expect(bytes[3]).toBe(0x2A);  // high byte
    expect(bytes.length).toBe(4);
  });

  it('encodes LDW $0,&H0000', () => {
    const bytes = encodeInstruction('ldw', '$0,&H0000');
    expect(bytes[0]).toBe(0xD1);
    expect(bytes[1]).toBe(0x00);
    expect(bytes[2]).toBe(0x00);
    expect(bytes[3]).toBe(0x00);
  });

  // ── LD with 8-bit immediate via extension (Kind.REGIM8) ──

  it('encodes LD $3,&HAB (extension REGIM8)', () => {
    // ld REGIM8 is in extTab at ex(20): base = 256+20*4 = 336, variant 0 -> index 336
    // Host opcode for ex(20) is at mnemTab index 0x51
    const bytes = encodeInstruction('ld', '$3,&HAB');
    // This could match REGIM8JR (0x42) or REGIM8 (ext at 0x51)
    // REGIM8JR should match first since it's in primary table
    // With REGIM8JR: opcode=0x42, reg byte=0x03, imm=0xAB
    expect(bytes[0]).toBe(0x42);
    expect(bytes[1]).toBe(0x03);
    expect(bytes[2]).toBe(0xAB);
  });

  // ── LDM (Kind.RRIM3JR) ──

  it('encodes LDM $1,$sx,3', () => {
    // ldm RRIM3JR at index 0xC2
    // dest $1, src $sx (SIR 0), count 3
    // operand byte 1: dest reg [4:0] = 1
    // operand byte 2: (count-1)<<5 | SIR bits
    // SIR sx = index 0, so bits = 0x00
    // (3-1)<<5 = 2<<5 = 0x40
    const bytes = encodeInstruction('ldm', '$1,$sx,3');
    expect(bytes[0]).toBe(0xC2);
    expect(bytes[1]).toBe(0x01);
    expect(bytes[2]).toBe(0x40);  // (2<<5) | 0x00
    expect(bytes.length).toBe(3);
  });

  // ── STM (Kind.REGIRRIM3) ──

  it('encodes STM $1,(ix+$sy),3', () => {
    // stm REGIRRIM3 at index 0xE0 (even = ix)
    // dest $1, ix+$sy, count 3
    // operand byte 1: reg[4:0]=1, sign=+→0, SIR sy=1→bits [6:5]=0b01=0x20
    // = 0x21
    // operand byte 2: (count-1)<<5 = 0x40
    const bytes = encodeInstruction('stm', '$1,(ix+$sy),3');
    expect(bytes[0]).toBe(0xE0);
    expect(bytes[1]).toBe(0x21);  // reg=1, sign=+, sir=sy(0x20)
    expect(bytes[2]).toBe(0x40);  // (2<<5)
    expect(bytes.length).toBe(3);
  });

  // ── PRE (Kind.R16IM16) ──

  it('encodes PRE IX,&H1000', () => {
    // pre R16IM16 at index 0xD6 (even, row=0) or 0xD7 (odd, row=1)
    // ix is r16tab[0][0] -> row=0, col=0 -> even index -> 0xD6
    const bytes = encodeInstruction('pre', 'ix,&H1000');
    expect(bytes[0]).toBe(0xD6);
    expect(bytes[1]).toBe(0x00);  // col=0<<5
    expect(bytes[2]).toBe(0x00);  // low byte
    expect(bytes[3]).toBe(0x10);  // high byte
    expect(bytes.length).toBe(4);
  });

  it('encodes PRE IZ,&HFFFF', () => {
    // iz is r16tab[0][2] -> row=0, col=2 -> even index -> 0xD6
    const bytes = encodeInstruction('pre', 'iz,&HFFFF');
    expect(bytes[0]).toBe(0xD6);
    expect(bytes[1]).toBe(0x40);  // col=2<<5
    expect(bytes[2]).toBe(0xFF);
    expect(bytes[3]).toBe(0xFF);
  });

  it('encodes PRE SS,&H2000', () => {
    // ss is r16tab[1][0] -> row=1, col=0 -> odd index -> 0xD7
    const bytes = encodeInstruction('pre', 'ss,&H2000');
    expect(bytes[0]).toBe(0xD7);
    expect(bytes[1]).toBe(0x00);  // col=0<<5
    expect(bytes[2]).toBe(0x00);
    expect(bytes[3]).toBe(0x20);
  });

  // ── ST/LD with indexed addressing (Kind.REGIRR) ──

  it('encodes ST $5,(ix+$sy)', () => {
    // st REGIRR: even index for ix. st REGIRR starts at 0x20 (ix) and 0x21 (iz)
    const bytes = encodeInstruction('st', '$5,(ix+$sy)');
    expect(bytes[0]).toBe(0x20);
    expect(bytes[1]).toBe(0x25);  // reg=5, sign=+, sir=sy(0x20)
    expect(bytes.length).toBe(2);
  });

  it('encodes LD $3,(iz-$0)', () => {
    // ld REGIRR with iz: odd index. ld REGIRR starts at 0x28(ix), 0x29(iz)
    // $0 as general register: bits [6:5]=0b11=0x60, extra byte=0
    // sign = - → 0x80
    const bytes = encodeInstruction('ld', '$3,(iz-$0)');
    expect(bytes[0]).toBe(0x29);
    expect(bytes[1]).toBe(0xE3);  // reg=3, sign=0x80, general=0x60
    expect(bytes[2]).toBe(0x00);  // src register index
    expect(bytes.length).toBe(3);
  });

  // ── Misc ──

  it('throws on unknown mnemonic', () => {
    expect(() => encodeInstruction('xyz', '')).toThrow('Unknown mnemonic');
  });

  it('throws on impossible encoding', () => {
    expect(() => encodeInstruction('nop', '$1')).toThrow();
  });
});

describe('assembler', () => {
  it('assembles a simple program', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'MAIN', mnemonic: 'nop' },
      { mnemonic: 'rtn' },
    ];
    const result = assemble(lines);
    expect(result.binary[0]).toBe(0xF8); // nop
    expect(result.binary[1]).toBe(0xF7); // rtn unconditional
    expect(result.codeSize).toBe(2);
  });

  it('resolves forward label references', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'jp', operands: 'SKIP' },
      { mnemonic: 'nop' },
      { label: 'SKIP', mnemonic: 'rtn' },
    ];
    const result = assemble(lines);
    expect(result.binary.length).toBeGreaterThan(0);
    expect(result.symbols.find(s => s.name === 'SKIP')).toBeDefined();
  });

  it('resolves EQU constants', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'CLS_ADDR', mnemonic: 'EQU', operands: '&H2ADF' },
      { mnemonic: 'ldw', operands: '$2,CLS_ADDR' },
    ];
    const result = assemble(lines);
    // ldw should encode with &H2ADF
    expect(result.binary.length).toBe(4); // opcode + reg + lo + hi
  });

  it('handles DS (reserve space)', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'nop' },
      { label: 'VAR_A', mnemonic: 'DS', operands: '9' },
      { label: 'VAR_B', mnemonic: 'DS', operands: '9' },
    ];
    const result = assemble(lines);
    const varA = result.symbols.find(s => s.name === 'VAR_A');
    const varB = result.symbols.find(s => s.name === 'VAR_B');
    expect(varA).toBeDefined();
    expect(varB).toBeDefined();
    // nop is 1 byte, so VAR_A at 1, VAR_B at 10
    expect(varA!.address).toBe(1);
    expect(varB!.address).toBe(10);
  });

  it('tracks code vs data vs variable sizes', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'nop' },
      { mnemonic: 'rtn' },
      { mnemonic: 'db', operands: '"Hello"' },
      { label: 'VAR', mnemonic: 'DS', operands: '9' },
    ];
    const result = assemble(lines);
    expect(result.codeSize).toBe(2); // nop + rtn
    expect(result.dataSize).toBe(5); // "Hello"
    expect(result.variableSize).toBe(9); // DS 9
  });

  it('handles label-only lines', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'START' },
      { mnemonic: 'nop' },
    ];
    const result = assemble(lines);
    expect(result.symbols.find(s => s.name === 'START')!.address).toBe(0);
  });

  it('handles comment-only and blank lines', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { comment: 'just a comment' },
      { mnemonic: 'nop' },
    ];
    const result = assemble(lines);
    expect(result.codeSize).toBe(1);
  });
});

// ─── Task 4b: branch relaxation (jr → jp when out of imm7 range) ─────────────
//
// `jr`/`jr cc` carry a single imm7 offset byte reaching only ±127. Anything
// further used to be silently wrapped into a valid-looking byte pointing at
// the wrong address. The assembler now relaxes those into the 3-byte absolute
// `jp`/`jp cc`, which uses the identical condition-code encoding (both
// families land in the same `testCC()`, reading `opcode[0] & 7`).

/** N filler bytes as a single `db` line (nothing when n <= 0). */
function fill(n: number): AsmLine[] {
  return n > 0 ? [{ mnemonic: 'db', operands: Array(n).fill('&H00').join(',') }] : [];
}

function branchSites(result: ReturnType<typeof assemble>) {
  return result.lineResults.filter(r => /^(jr|jp)$/i.test(r.mnemonic));
}

describe('imm7 range checking', () => {
  it('encodes the extreme in-range offsets', () => {
    // +127: jr at 0, base = 1, target = 128
    expect(Array.from(encodeInstruction('jr', '&H0080', 0))).toEqual([0xB7, 0x7F]);
    // -127: jr at 0x1000, base = 0x1001, target = 0x0F82
    expect(Array.from(encodeInstruction('jr', '&H0F82', 0x1000))).toEqual([0xB7, 0xFF]);
  });

  it('throws instead of wrapping one byte past the range', () => {
    // +128
    expect(() => encodeInstruction('jr', '&H0081', 0)).toThrow(Imm7RangeError);
    // -128
    expect(() => encodeInstruction('jr', '&H0F81', 0x1000)).toThrow(Imm7RangeError);
    // The reviewer's original site: jr nz,&H1D4C at 0x1E1B (offset -208) used
    // to emit 0x50 — a valid-looking *forward* jump of +80.
    expect(() => encodeInstruction('jr', 'nz,&H1D4C', 0x1E1B)).toThrow(/out of range/);
  });

  // An unresolved label reaches parseHex as a bare identifier and becomes NaN.
  // Every comparison against NaN is false, so `imm7InRange` says "not in
  // range" — which must NOT be conflated with a genuine long branch, or the
  // assembler's relaxation pass silently "fixes" a typo by jumping to &H0000.
  it('reports an unresolved target as its own error, not a range failure', () => {
    const grab = (fn: () => unknown): unknown => {
      try { fn(); } catch (e) { return e; }
      throw new Error('expected a throw');
    };

    for (const ops of ['nz,NOSUCHLABEL', 'NOSUCHLABEL']) {
      const err = grab(() => encodeInstruction('jr', ops, 0x1CD0));
      expect(err).toBeInstanceOf(UnresolvedTargetError);
      // The property the relaxation oracle depends on:
      expect(isImm7RangeError(err)).toBe(false);
      expect((err as Error).message).toMatch(/did not resolve/);
      // Must not masquerade as a distance problem.
      expect((err as Error).message).not.toMatch(/out of range/);
    }
  });
});

describe('assembler branch relaxation', () => {
  it('relaxes an over-long conditional backward branch into jp cc', () => {
    // LOOP: nop / 200 filler bytes / jr z,LOOP
    // The jr sits at 0x00C9; base 0x00CA, target 0x0000 → offset -202.
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'LOOP', mnemonic: 'nop' },
      ...fill(200),
      { mnemonic: 'jr', operands: 'z,LOOP' },
    ];
    const result = assemble(lines);

    const sites = branchSites(result);
    expect(sites).toHaveLength(1);
    const site = sites[0]!;

    expect(site.relaxed).toBe(true);
    expect(site.mnemonic).toBe('jp');
    expect(site.bytes).toHaveLength(3);
    // jp z = 0x30 (0x30 & 7 == 0 == z), i.e. within the 0x30-0x37 jp family,
    // and carrying the same cc bits the jr z (0xB0) had.
    expect(site.bytes[0]).toBe(0x30);
    expect(site.bytes[0]! & 7).toBe(0xB0 & 7);
    expect(site.bytes[1]).toBe(0x00); // target lo
    expect(site.bytes[2]).toBe(0x00); // target hi

    // …and the same bytes really are in the emitted binary at that address.
    expect(Array.from(result.binary.slice(site.address, site.address + 3)))
      .toEqual([0x30, 0x00, 0x00]);
    expect(result.relaxedBranches).toBe(1);
  });

  it('relaxes an over-long unconditional branch into jp', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'jr', operands: 'FAR' },
      ...fill(200),
      { label: 'FAR', mnemonic: 'nop' },
    ];
    const result = assemble(lines);
    const site = branchSites(result)[0]!;
    expect(site.relaxed).toBe(true);
    // jp unconditional = 0x37, the same cc==7 slot jr unconditional (0xB7) used
    expect(site.bytes[0]).toBe(0x37);
    expect(site.bytes[0]! & 7).toBe(0xB7 & 7);
    // FAR = 0x00CB (1 nop-free start + 3-byte jp + 200 filler), little-endian
    expect(site.bytes.slice(1)).toEqual([0xCB, 0x00]);
    expect(site.bytes[1]! | (site.bytes[2]! << 8))
      .toBe(result.symbols.find(s => s.name === 'FAR')!.address);
  });

  it('leaves in-range branches as compact 2-byte jr encodings', () => {
    // Every branch here is comfortably inside ±127, so nothing should change.
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'TOP', mnemonic: 'nop' },
      { mnemonic: 'jr', operands: 'z,FWD' },
      ...fill(20),
      { label: 'FWD', mnemonic: 'jr', operands: 'nz,TOP' },
      { mnemonic: 'jr', operands: 'TOP' },
      { mnemonic: 'rtn' },
    ];
    const result = assemble(lines);

    const sites = branchSites(result);
    expect(sites).toHaveLength(3);
    expect(sites.every(s => !s.relaxed)).toBe(true);
    expect(sites.every(s => s.bytes.length === 2)).toBe(true);
    expect(result.relaxedBranches).toBe(0);
    // Converged on the very first check — no wasted relayout.
    expect(result.relaxationIterations).toBe(1);

    // jr z,FWD at 0x0001: base 0x0002, FWD = 0x0017 → +21
    expect(sites[0]!.bytes).toEqual([0xB0, 21]);
    // jr nz,TOP at 0x0017: base 0x0018, TOP = 0 → -24 → 0x80 + 24 = 0x98
    expect(sites[1]!.bytes).toEqual([0xB4, 0x98]);
    // jr TOP at 0x0019: base 0x001A, TOP = 0 → -26 → 0x80 + 26 = 0x9A
    expect(sites[2]!.bytes).toEqual([0xB7, 0x9A]);
  });

  it('relaxes only the branches that need it, leaving neighbours compact', () => {
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'TOP', mnemonic: 'nop' },
      { mnemonic: 'jr', operands: 'z,NEAR' },   // in range
      { label: 'NEAR', mnemonic: 'nop' },
      ...fill(200),
      { mnemonic: 'jr', operands: 'nz,TOP' },   // out of range
    ];
    const result = assemble(lines);
    const sites = branchSites(result);
    expect(sites.map(s => s.bytes.length)).toEqual([2, 3]);
    expect(sites.map(s => !!s.relaxed)).toEqual([false, true]);
    expect(result.relaxedBranches).toBe(1);
  });

  it('iterates to a fixed point when one relaxation pushes others out of range', () => {
    // Three partially-overlapping forward branches, sized so that each round
    // of relaxation puts exactly one more over the edge:
    //   round 1: B3 is at +128            → relaxed
    //   round 2: B2 was at +127, now +128 → relaxed
    //   round 3: B1 was at +126, now +128 → relaxed
    // A single-shot "fix what pass 2 found" patch would stop after round 1
    // and ship two corrupted branches.
    const q1 = 97, q2 = 24, q3 = 0, q4 = 100, q5 = 27;
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'B1', mnemonic: 'jr', operands: 'z,E1' },
      ...fill(q1),
      { label: 'B2', mnemonic: 'jr', operands: 'z,E2' },
      ...fill(q2),
      { label: 'B3', mnemonic: 'jr', operands: 'z,E3' },
      ...fill(q3),
      { label: 'E1', mnemonic: 'nop' },
      ...fill(q4 - 1),
      { label: 'E2', mnemonic: 'nop' },
      ...fill(q5 - 1),
      { label: 'E3', mnemonic: 'nop' },
    ];
    const result = assemble(lines);

    expect(result.relaxedBranches).toBe(3);
    // 3 cascading rounds + 1 final clean check. Anything less would mean the
    // loop stopped before the cascade finished.
    expect(result.relaxationIterations).toBe(4);

    const sites = branchSites(result);
    expect(sites.every(s => s.relaxed && s.bytes.length === 3)).toBe(true);

    // Every relaxed branch must point at the *final* label address, not the
    // pre-relaxation one — the whole point of re-laying-out each round.
    const addrOf = (n: string) => result.symbols.find(s => s.name === n)!.address;
    for (const [site, label] of [[sites[0]!, 'E1'], [sites[1]!, 'E2'], [sites[2]!, 'E3']] as const) {
      expect(site.bytes[1]! | (site.bytes[2]! << 8)).toBe(addrOf(label));
    }
  });

  it('keeps every label address consistent with the relaxed layout', () => {
    // A label sitting after a relaxed branch must move by the extra byte.
    const withoutRelax = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'TOP', mnemonic: 'nop' },
      ...fill(20),
      { mnemonic: 'jr', operands: 'z,TOP' },
      { label: 'AFTER', mnemonic: 'nop' },
    ]);
    const withRelax = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'TOP', mnemonic: 'nop' },
      ...fill(200),
      { mnemonic: 'jr', operands: 'z,TOP' },
      { label: 'AFTER', mnemonic: 'nop' },
    ]);
    const after = (r: ReturnType<typeof assemble>) =>
      r.symbols.find(s => s.name === 'AFTER')!.address;

    expect(after(withoutRelax)).toBe(1 + 20 + 2);
    expect(after(withRelax)).toBe(1 + 200 + 3);   // 3, not 2 — jp is a byte longer
    // The emitted binary length must agree with where AFTER was placed.
    expect(withRelax.binary.length).toBe(after(withRelax) + 1);
  });

  it('fails loudly on an undefined branch label instead of relaxing it to &H0000', () => {
    // Regression: `resolveOperands` leaves an unknown symbol as a bare
    // identifier, `parseHex` makes it NaN, and every numeric comparison
    // against NaN is false — so an undefined label used to look identical to
    // "too far away". The relaxation pass then emitted `jp cc,&H0000` (a jump
    // into ROM0) and the listing claimed `[jr relaxed to jp]`, turning a
    // typo'd label into a silently mis-routed branch.
    for (const ops of ['nz,NOSUCHLABEL', 'NOSUCHLABEL']) {
      const lines: AsmLine[] = [
        { mnemonic: 'ORG', operands: '&H1CD0' },
        { mnemonic: 'nop' },
        { mnemonic: 'jr', operands: ops },
        { mnemonic: 'rtn' },
      ];
      // Names the PC and the offending operand, and says what's actually wrong.
      expect(() => assemble(lines)).toThrow(/did not resolve to an address/);
      expect(() => assemble(lines)).toThrow(/NOSUCHLABEL/);
      // Crucially, it does not pass itself off as a range/relaxation issue.
      expect(() => assemble(lines)).not.toThrow(/out of range/);
    }
  });

  it('still relaxes a real long branch that happens to sit beside a good label', () => {
    // Guards the fix from over-correcting: adding the NaN check must not make
    // genuinely-out-of-range branches stop relaxing.
    const result = assemble([
      { mnemonic: 'ORG', operands: '&H0000' },
      { label: 'LOOP', mnemonic: 'nop' },
      ...fill(200),
      { mnemonic: 'jr', operands: 'z,LOOP' },
    ]);
    expect(result.relaxedBranches).toBe(1);
    expect(branchSites(result)[0]!.bytes).toEqual([0x30, 0x00, 0x00]);
  });

  it('errors clearly on an out-of-range jr suffix, which cannot be relaxed', () => {
    // The `,jr LABEL` suffix form is welded into another instruction's
    // encoding and has no absolute equivalent. codegen never emits one, but if
    // it ever did, a loud failure beats a silently corrupted jump.
    const lines: AsmLine[] = [
      { mnemonic: 'ORG', operands: '&H0000' },
      { mnemonic: 'ld', operands: '$1,&H05,jr FAR' },
      ...fill(200),
      { label: 'FAR', mnemonic: 'nop' },
    ];
    expect(() => assemble(lines)).toThrow(/out of range/);
  });
});

import { formatListing } from '../listing.js';
import type { ListingLine, ListingInput } from '../listing.js';

describe('listing formatter', () => {
  const makeInput = (overrides: Partial<ListingInput> = {}): ListingInput => ({
    sourceFile: 'TEST.BAS',
    date: '2026-04-04',
    lines: [],
    symbols: [],
    codeSize: 0,
    dataSize: 0,
    variableSize: 0,
    ...overrides,
  });

  it('includes page header', () => {
    const listing = formatListing(makeInput());
    expect(listing).toContain('HD61700 Cross Assembler');
    expect(listing).toContain('TEST.BAS');
    expect(listing).toContain('Page 1');
  });

  it('formats instruction lines with correct columns', () => {
    const listing = formatListing(makeInput({
      lines: [{ address: 0, bytes: [0xCE], label: 'MAIN', mnemonic: 'nop', operands: '', comment: 'do nothing' }],
      codeSize: 1,
    }));
    expect(listing).toContain('0000');
    expect(listing).toContain('CE');
    expect(listing).toContain('MAIN');
    expect(listing).toContain('nop');
    expect(listing).toContain('do nothing');
  });

  it('includes BASIC source annotations', () => {
    const listing = formatListing(makeInput({
      lines: [
        { address: -1, bytes: [], label: '', mnemonic: '', operands: '', comment: '', basicLine: { num: 10, source: 'PRINT "HI"' } },
        { address: 0, bytes: [0xCE], label: '', mnemonic: 'nop', operands: '', comment: '' },
      ],
      codeSize: 1,
    }));
    expect(listing).toContain('=== BASIC Line 10: PRINT "HI" ===');
  });

  it('includes symbol table', () => {
    const listing = formatListing(makeInput({
      symbols: [
        { name: 'MAIN', address: 0, type: 'code' },
        { name: 'VAR_A', address: 0x50, type: 'variable' },
      ],
    }));
    expect(listing).toContain('Symbol Table:');
    expect(listing).toContain('MAIN');
    expect(listing).toContain('VAR_A');
    expect(listing).toContain('0050');
  });

  it('includes size summary', () => {
    const listing = formatListing(makeInput({ codeSize: 100, dataSize: 50, variableSize: 27 }));
    expect(listing).toContain('Code size: 100 bytes');
    expect(listing).toContain('Data size: 50 bytes');
    expect(listing).toContain('Variables: 27 bytes');
    expect(listing).toContain('Total: 177 bytes');
  });

  it('keeps lines to 132 columns max', () => {
    const listing = formatListing(makeInput({
      lines: [{ address: 0, bytes: [0xCE], label: 'MAIN', mnemonic: 'nop', operands: '', comment: 'a short comment' }],
      codeSize: 1,
    }));
    for (const line of listing.split('\n')) {
      expect(line.length).toBeLessThanOrEqual(132);
    }
  });

  it('formats multi-byte hex code', () => {
    const listing = formatListing(makeInput({
      lines: [{ address: 0, bytes: [0x08, 0x02, 0xDF, 0x2A], label: '', mnemonic: 'ldw', operands: '$2,&H2ADF', comment: 'CLS addr' }],
      codeSize: 4,
    }));
    expect(listing).toContain('08 02 DF 2A');
  });
});
