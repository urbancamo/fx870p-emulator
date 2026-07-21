// Exact stored-byte accounting via the emulator's own tokenizer.
import { tokenizeLine } from '../../src/emulator/tokenize.js';
import { CrunchLine, emitBodyForFile } from './scan.js';

// Full record bytes for one line (length byte + line number + body + terminator).
export function lineBytes(num: number, text: string): number {
  return tokenizeLine(num, text).bytes.length;
}

// Whole-program stored size incl. the trailing end-of-program marker. Uses
// emitBodyForFile (not emitLine) so an empty-body line is counted as the
// ':' placeholder that emitProgram actually writes to disk -- otherwise
// reported bytes would be lower than the real .min.BAS.
export function programBytes(lines: CrunchLine[]): number {
  let total = 1;
  for (const l of lines) total += lineBytes(l.num, emitBodyForFile(l));
  return total;
}
