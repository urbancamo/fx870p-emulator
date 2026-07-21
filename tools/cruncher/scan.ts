// Statement-level model of a Casio JIS BASIC program.
// String/comment aware but deliberately NOT a full parser: passes operate on
// statement text, and src/emulator/tokenize.ts is the byte-level authority.
import { parseListingText } from '../../src/emulator/tokenize.js';

export interface Comment { marker: 'REM' | "'"; text: string }

export interface CrunchLine {
  num: number;
  stmts: string[];          // statement texts; ':' separators implied
  comment: Comment | null;  // trailing comment (rest of line)
  origins: number[];        // original line numbers folded into this line
  notes: string[];          // listing annotations
}

export function headKeyword(stmt: string): string {
  const m = /^\s*([A-Za-z]+)/.exec(stmt);
  return m ? m[1].toUpperCase() : '';
}

export function splitBody(body: string): { stmts: string[]; comment: Comment | null } {
  const stmts: string[] = [];
  let cur = '';
  let inStr = false;
  let comment: Comment | null = null;
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    if (inStr) {
      cur += c;
      if (c === '"') inStr = false;
      i++;
      continue;
    }
    if (c === '"') { inStr = true; cur += c; i++; continue; }
    if (c === "'") { comment = { marker: "'", text: body.slice(i + 1) }; break; }
    if (c === ':') { stmts.push(cur.trim()); cur = ''; i++; continue; }
    if (cur.trim() === '' && /^[Rr][Ee][Mm]([^A-Za-z0-9]|$)/.test(body.slice(i))) {
      comment = { marker: 'REM', text: body.slice(i + 3) };
      break;
    }
    cur += c;
    i++;
  }
  if (cur.trim() !== '') stmts.push(cur.trim());
  return { stmts: stmts.filter(s => s !== ''), comment };
}

// Split a statement into alternating code / string-literal segments.
export function codeSegments(s: string): { code: boolean; text: string }[] {
  const out: { code: boolean; text: string }[] = [];
  let cur = '';
  let inStr = false;
  for (const c of s) {
    if (!inStr && c === '"') {
      if (cur !== '') out.push({ code: true, text: cur });
      cur = c;
      inStr = true;
    } else if (inStr && c === '"') {
      cur += c;
      out.push({ code: false, text: cur });
      cur = '';
      inStr = false;
    } else {
      cur += c;
    }
  }
  if (cur !== '') out.push({ code: !inStr, text: cur });
  return out;
}

export function parseSource(src: string): CrunchLine[] {
  return parseListingText(src).map(({ num, text }) => {
    const { stmts, comment } = splitBody(text);
    return { num, stmts, comment, origins: [num], notes: [] };
  });
}

export function emitLine(l: CrunchLine): string {
  let s = l.stmts.join(':');
  // "'" (1 byte) is legal trailing any statement, unlike REM which needs ':'.
  if (l.comment) s += "'" + l.comment.text;
  return s;
}

export function emitProgram(lines: CrunchLine[]): string {
  return lines.map(l => (`${l.num} ` + emitLine(l)).trimEnd()).join('\n') + '\n';
}
