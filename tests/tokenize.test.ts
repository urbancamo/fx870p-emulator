import { describe, it, expect } from 'vitest';
import { tokenizeBody, tokenizeLine, tokenizeProgram, parseListingText } from '../src/emulator/tokenize.js';

describe('tokenizeBody', () => {
  it('tokenizes a simple PRINT statement', () => {
    const bytes = tokenizeBody('PRINT "HELLO"');
    // PRINT = 0x04 0xA3, space=0x20, "=0x22, HELLO=ASCII, "=0x22
    expect(bytes[0]).toBe(0x04); // prefix
    expect(bytes[1]).toBe(0xA3); // PRINT
    expect(bytes[2]).toBe(0x20); // space
    expect(bytes[3]).toBe(0x22); // "
    expect(bytes[4]).toBe(0x48); // H
    expect(bytes[5]).toBe(0x45); // E
    expect(bytes[6]).toBe(0x4C); // L
    expect(bytes[7]).toBe(0x4C); // L
    expect(bytes[8]).toBe(0x4F); // O
    expect(bytes[9]).toBe(0x22); // "
    expect(bytes.length).toBe(10);
  });

  it('tokenizes GOTO with line number reference', () => {
    const bytes = tokenizeBody('GOTO 100');
    // GOTO = 0x04 0x49, space, line ref = 0x03 0x64 0x00
    expect(bytes[0]).toBe(0x04); // prefix
    expect(bytes[1]).toBe(0x49); // GOTO
    expect(bytes[2]).toBe(0x20); // space
    expect(bytes[3]).toBe(0x03); // line ref marker
    expect(bytes[4]).toBe(100);  // low byte
    expect(bytes[5]).toBe(0);    // high byte
  });

  it('tokenizes GOSUB with line number reference', () => {
    const bytes = tokenizeBody('GOSUB 1000');
    expect(bytes[0]).toBe(0x04);
    expect(bytes[1]).toBe(0x4A); // GOSUB
    expect(bytes[2]).toBe(0x20);
    expect(bytes[3]).toBe(0x03);
    expect(bytes[4]).toBe(0xE8); // 1000 & 0xFF
    expect(bytes[5]).toBe(0x03); // 1000 >> 8
  });

  it('tokenizes REM with raw text after', () => {
    const bytes = tokenizeBody('REM BINARY SEARCH');
    expect(bytes[0]).toBe(0x04); // prefix
    expect(bytes[1]).toBe(0xA9); // REM
    // After REM, everything is raw ASCII
    expect(bytes[2]).toBe(0x20); // space
    expect(bytes[3]).toBe(0x42); // B
    expect(bytes[4]).toBe(0x49); // I - not matched as IF keyword
  });

  it('tokenizes apostrophe as REM shorthand', () => {
    const bytes = tokenizeBody("'COMMENT");
    expect(bytes[0]).toBe(0x02); // apostrophe token
    expect(bytes[1]).toBe(0x43); // C (raw)
  });

  it('tokenizes colon as statement separator', () => {
    const bytes = tokenizeBody('CLS:PRINT "A"');
    expect(bytes[0]).toBe(0x04); // CLS prefix
    expect(bytes[1]).toBe(0x71); // CLS
    expect(bytes[2]).toBe(0x01); // colon
    expect(bytes[3]).toBe(0x04); // PRINT prefix
    expect(bytes[4]).toBe(0xA3); // PRINT
  });

  it('adds hidden colon before ELSE', () => {
    const bytes = tokenizeBody('IF A=1 THEN PRINT "Y" ELSE PRINT "N"');
    // Find ELSE token (0x07 0x48) in the output
    let elseIdx = -1;
    for (let i = 0; i < bytes.length - 1; i++) {
      if (bytes[i] === 0x07 && bytes[i + 1] === 0x48) {
        elseIdx = i;
        break;
      }
    }
    expect(elseIdx).toBeGreaterThan(0);
    // Hidden colon should be right before ELSE
    expect(bytes[elseIdx - 1]).toBe(0x01);
  });

  it('does not duplicate colon before ELSE if already present', () => {
    const bytes = tokenizeBody('IF A=1 THEN PRINT "Y":ELSE PRINT "N"');
    // Find the ELSE
    let colonCount = 0;
    for (let i = 0; i < bytes.length - 2; i++) {
      if (bytes[i] === 0x01 && bytes[i + 1] === 0x07 && bytes[i + 2] === 0x48) {
        colonCount++;
      }
    }
    expect(colonCount).toBe(1); // exactly one colon before ELSE
  });

  it('tokenizes HYP SIN as compound keyword', () => {
    const bytes = tokenizeBody('HYP SIN(X)');
    expect(bytes[0]).toBe(0x05); // prefix 5
    expect(bytes[1]).toBe(0x71); // HYP SIN code
    expect(bytes[2]).toBe(0x28); // (
  });

  it('tokenizes FOR/TO/STEP correctly', () => {
    const bytes = tokenizeBody('FOR I=1 TO 10 STEP 2');
    expect(bytes[0]).toBe(0x04); // FOR prefix
    expect(bytes[1]).toBe(0x81); // FOR
  });

  it('does not match keywords inside variable names', () => {
    // FOREST should not match FOR + EST
    const bytes = tokenizeBody('FOREST=1');
    // Should be raw ASCII 'F','O','R','E','S','T','=','1'
    expect(bytes[0]).toBe(0x46); // F
    expect(bytes[1]).toBe(0x4F); // O
  });

  it('does not match TO inside STOP', () => {
    const bytes = tokenizeBody('STOP');
    expect(bytes[0]).toBe(0x04); // prefix
    expect(bytes[1]).toBe(0xAE); // STOP
    expect(bytes.length).toBe(2);
  });

  it('handles string containing keyword text', () => {
    const bytes = tokenizeBody('PRINT "GOTO 100"');
    // GOTO inside string should be raw ASCII, not tokenized
    let foundLineRef = false;
    for (const b of bytes) {
      if (b === 0x03) foundLineRef = true;
    }
    expect(foundLineRef).toBe(false);
  });

  it('tokenizes numeric literals as raw ASCII', () => {
    const bytes = tokenizeBody('A=3.14');
    // A=3.14 should have: A(0x41), =(0x3D), 3(0x33), .(0x2E), 1(0x31), 4(0x34)
    expect(bytes[0]).toBe(0x41); // A
    expect(bytes[1]).toBe(0x3D); // =
    expect(bytes[2]).toBe(0x33); // 3
    expect(bytes[3]).toBe(0x2E); // .
    expect(bytes[4]).toBe(0x31); // 1
    expect(bytes[5]).toBe(0x34); // 4
  });

  it('tokenizes THEN followed by line number', () => {
    const bytes = tokenizeBody('IF A=1 THEN 200');
    // Find THEN token
    let thenIdx = -1;
    for (let i = 0; i < bytes.length - 1; i++) {
      if (bytes[i] === 0x07 && bytes[i + 1] === 0x47) {
        thenIdx = i;
        break;
      }
    }
    expect(thenIdx).toBeGreaterThan(0);
    // After THEN + space, should have line ref
    expect(bytes[thenIdx + 3]).toBe(0x03); // line ref marker
    expect(bytes[thenIdx + 4]).toBe(200);  // 200 low byte
    expect(bytes[thenIdx + 5]).toBe(0);    // 200 high byte
  });

  it('handles case insensitivity', () => {
    const lower = tokenizeBody('print "hello"');
    const upper = tokenizeBody('PRINT "HELLO"');
    // keywords should be same tokens, but string content differs
    expect(lower[0]).toBe(upper[0]); // both PRINT prefix
    expect(lower[1]).toBe(upper[1]); // both PRINT code
  });

  it('tokenizes operators from prefix 7', () => {
    const bytes = tokenizeBody('A AND B');
    expect(bytes[0]).toBe(0x41); // A
    expect(bytes[1]).toBe(0x20); // space
    expect(bytes[2]).toBe(0x07); // prefix 7
    expect(bytes[3]).toBe(0xC4); // AND
  });

  it('tokenizes string functions with $', () => {
    const bytes = tokenizeBody('MID$(A$,1,2)');
    expect(bytes[0]).toBe(0x06); // prefix 6
    expect(bytes[1]).toBe(0x9C); // MID$
  });
});

describe('tokenizeLine', () => {
  it('creates correct record format', () => {
    const line = tokenizeLine(10, 'CLS');
    // recLen = 2(linenum) + 2(CLS tokens) + 1(terminator) = 5
    expect(line.bytes[0]).toBe(5);       // recLen
    expect(line.bytes[1]).toBe(10);      // lineNum low
    expect(line.bytes[2]).toBe(0);       // lineNum high
    expect(line.bytes[3]).toBe(0x04);    // CLS prefix
    expect(line.bytes[4]).toBe(0x71);    // CLS code
    expect(line.bytes[5]).toBe(0x00);    // terminator
    expect(line.bytes.length).toBe(6);   // 1(recLen) + 5(data)
  });

  it('handles high line numbers', () => {
    const line = tokenizeLine(1000, 'END');
    expect(line.bytes[1]).toBe(0xE8); // 1000 & 0xFF
    expect(line.bytes[2]).toBe(0x03); // 1000 >> 8
  });

  it('rejects line number 0', () => {
    expect(() => tokenizeLine(0, 'CLS')).toThrow('out of range');
  });

  it('rejects line number > 65535', () => {
    expect(() => tokenizeLine(65536, 'CLS')).toThrow('out of range');
  });
});

describe('tokenizeProgram', () => {
  it('creates program with end marker', () => {
    const prog = tokenizeProgram([
      { num: 10, text: 'CLS' },
      { num: 20, text: 'END' },
    ]);
    // Should end with 0x00 marker
    expect(prog[prog.length - 1]).toBe(0x00);
  });

  it('sorts lines by number', () => {
    const prog = tokenizeProgram([
      { num: 20, text: 'END' },
      { num: 10, text: 'CLS' },
    ]);
    // First line should be line 10
    expect(prog[1]).toBe(10); // lineNum low of first record
    expect(prog[2]).toBe(0);
  });
});

describe('parseListingText', () => {
  it('parses a basic listing', () => {
    const lines = parseListingText('10 CLS\n20 PRINT "HELLO"\n30 END');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toEqual({ num: 10, text: 'CLS' });
    expect(lines[1]).toEqual({ num: 20, text: 'PRINT "HELLO"' });
    expect(lines[2]).toEqual({ num: 30, text: 'END' });
  });

  it('skips empty lines', () => {
    const lines = parseListingText('10 CLS\n\n20 END\n');
    expect(lines).toHaveLength(2);
  });

  it('rejects lines without numbers', () => {
    expect(() => parseListingText('PRINT "HELLO"')).toThrow('must start with a line number');
  });
});
