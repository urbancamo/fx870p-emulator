// Exact stored-byte accounting via the emulator's own tokenizer.
import { tokenizeLine, tokenizeProgram, parseListingText } from '../../src/emulator/tokenize.js';
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

// True on-disk source size: tokenizes the RAW (unparsed) file text, exactly
// as a LIST/SAVE of the untouched original would produce it, after stripping
// a trailing Ctrl-Z (0x1A) EOF marker if present (see comm.ts's AppendEof --
// serial-transferred .BAS files end with one). This deliberately differs
// from programBytes(parseSource(text)): the crunch model already normalizes
// comments to a single-byte quote marker and trims statement-edge spaces and
// empty ':' bodies, so measuring the PARSED model under-reports the true
// original size and hides the byte savings that --keep-comments' REM -> '
// conversion provides. Use this as the "before" baseline everywhere reported
// (CLI summary, listing summary, reduction %), not programBytes(original).
export function trueSourceBytes(rawText: string): number {
  const eof = rawText.indexOf('\x1a');
  const clean = eof === -1 ? rawText : rawText.slice(0, eof);
  return tokenizeProgram(parseListingText(clean)).length;
}
