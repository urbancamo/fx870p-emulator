// Exact stored-byte accounting via the emulator's own tokenizer.
import { tokenizeLine } from '../../src/emulator/tokenize.js';
import { CrunchLine, emitLine } from './scan.js';

// Full record bytes for one line (length byte + line number + body + terminator).
export function lineBytes(num: number, text: string): number {
  return tokenizeLine(num, text).bytes.length;
}

// Whole-program stored size incl. the trailing end-of-program marker.
export function programBytes(lines: CrunchLine[]): number {
  let total = 1;
  for (const l of lines) total += lineBytes(l.num, emitLine(l));
  return total;
}
