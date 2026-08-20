// tools/compiler/listing.ts
// 132-column assembler listing formatter for the HD61700 cross assembler

export interface ListingLine {
  address: number;       // -1 for comment-only/annotation lines
  bytes: number[];       // machine code bytes
  label: string;
  mnemonic: string;
  operands: string;
  comment: string;
  basicLine?: { num: number; source: string };
}

export interface ListingInput {
  sourceFile: string;
  date: string;
  lines: ListingLine[];
  symbols: { name: string; address: number; type: string }[];
  codeSize: number;
  dataSize: number;
  variableSize: number;
  /** Variable names (no `VAR_` prefix) judged integer-eligible. Optional so existing callers need not supply it. */
  integerEligible?: Set<string>;
  /** FOR loops that actually got shadow slots allocated. Optional so existing callers need not supply it. */
  shadowedLoops?: { varName: string; line: number }[];
}

// Column positions (1-based widths, converted to 0-based start indices):
// Col 1-5   (width 5):  address
// Col 7-22  (width 16): hex code bytes
// Col 24-35 (width 12): label
// Col 37-68 (width 32): assembly (mnemonic + operands)
// Col 70-132 (width 63): comment

const COL_ADDR_START  = 0;
const COL_ADDR_WIDTH  = 5;
const COL_HEX_START   = 6;
const COL_HEX_WIDTH   = 16;
const COL_LABEL_START = 23;
const COL_LABEL_WIDTH = 12;
const COL_ASM_START   = 36;
const COL_ASM_WIDTH   = 32;
const COL_CMT_START   = 69;
const COL_CMT_WIDTH   = 63;
const LINE_WIDTH      = 132;

function padRight(s: string, width: number): string {
  if (s.length >= width) return s.slice(0, width);
  return s + ' '.repeat(width - s.length);
}

function hexByte(b: number): string {
  return b.toString(16).toUpperCase().padStart(2, '0');
}

function hexAddr(addr: number): string {
  return addr.toString(16).toUpperCase().padStart(4, '0');
}

function formatHexBytes(bytes: number[]): string {
  return bytes.map(hexByte).join(' ');
}

function buildLine(
  addr: string,
  hex: string,
  label: string,
  asm: string,
  comment: string,
): string {
  const row = new Array(LINE_WIDTH).fill(' ');

  // Place address (cols 1-5, 0-based 0-4)
  const addrStr = addr.slice(0, COL_ADDR_WIDTH);
  for (let i = 0; i < addrStr.length; i++) row[COL_ADDR_START + i] = addrStr[i];

  // Place hex bytes (cols 7-22, 0-based 6-21)
  const hexStr = hex.slice(0, COL_HEX_WIDTH);
  for (let i = 0; i < hexStr.length; i++) row[COL_HEX_START + i] = hexStr[i];

  // Place label (cols 24-35, 0-based 23-34)
  const labelStr = label.slice(0, COL_LABEL_WIDTH);
  for (let i = 0; i < labelStr.length; i++) row[COL_LABEL_START + i] = labelStr[i];

  // Place assembly (cols 37-68, 0-based 36-67)
  const asmStr = asm.slice(0, COL_ASM_WIDTH);
  for (let i = 0; i < asmStr.length; i++) row[COL_ASM_START + i] = asmStr[i];

  // Place comment (cols 70-132, 0-based 69-131)
  const cmtStr = comment.slice(0, COL_CMT_WIDTH);
  for (let i = 0; i < cmtStr.length; i++) row[COL_CMT_START + i] = cmtStr[i];

  // Trim trailing spaces but never exceed LINE_WIDTH
  let result = row.join('');
  result = result.trimEnd();
  return result;
}

export function formatListing(input: ListingInput): string {
  const lines: string[] = [];
  const total = input.codeSize + input.dataSize + input.variableSize;
  const available = 4096;
  const free = available - total;

  // ── Header ──────────────────────────────────────────────────────────────────
  const title = 'HD61700 Cross Assembler - FX-870P BASIC Compiler';
  const page = 'Page 1';
  const headerRight = page;
  // Pad title to fill line, place page at right
  const headerLine = padRight(title, LINE_WIDTH - headerRight.length) + headerRight;
  lines.push(headerLine.slice(0, LINE_WIDTH));

  lines.push(`Source: ${input.sourceFile}  Date: ${input.date}  Size: ${total} bytes`);
  lines.push('');

  // ── Column header ────────────────────────────────────────────────────────────
  const colHeader = buildLine('Addr', 'Hex Code', 'Label', 'Assembly', 'Comment');
  lines.push(colHeader);

  const separator = buildLine(
    '-----',
    '----------------',
    '------------',
    '--------------------------------',
    '-----------------------------------------------' + '----------------',
  );
  lines.push(separator);

  // ── Code lines ───────────────────────────────────────────────────────────────
  for (const l of input.lines) {
    // BASIC source annotation line
    if (l.basicLine !== undefined) {
      const annotation = `; === BASIC Line ${l.basicLine.num}: ${l.basicLine.source} ===`;
      const annotLine = buildLine('', '', '', '', annotation);
      lines.push(annotLine);
      continue;
    }

    // Comment-only / separator line (no address, no mnemonic)
    if (l.address === -1 && !l.mnemonic && l.comment) {
      const cmtLine = buildLine('', '', '', '', l.comment);
      lines.push(cmtLine);
      continue;
    }

    // Normal instruction / data line
    const addrStr = l.address >= 0 ? hexAddr(l.address) : '';
    const hexStr  = formatHexBytes(l.bytes);
    const asmStr  = l.mnemonic
      ? (l.operands ? `${l.mnemonic} ${l.operands}` : l.mnemonic)
      : '';
    const cmtStr  = l.comment ? `; ${l.comment}` : '';

    lines.push(buildLine(addrStr, hexStr, l.label ?? '', asmStr, cmtStr));
  }

  // ── Symbol table ─────────────────────────────────────────────────────────────
  lines.push('');
  lines.push('Symbol Table:');

  const sorted = [...input.symbols].sort((a, b) => a.name.localeCompare(b.name));
  const COLS = 4;
  const ENTRY_WIDTH = 20; // "NAME        = ADDR" padded to 20 chars

  for (let i = 0; i < sorted.length; i += COLS) {
    const chunk = sorted.slice(i, i + COLS);
    const parts = chunk.map(sym => {
      const entry = `${sym.name.padEnd(12)}= ${hexAddr(sym.address)}`;
      return entry.padEnd(ENTRY_WIDTH);
    });
    lines.push('  ' + parts.join('  ').trimEnd());
  }

  // ── Integer-eligibility / shadowed-loop classification ─────────────────────
  //
  // Reuses the Symbol Table section's grid layout immediately above (4
  // columns, entries padded to ENTRY_WIDTH) rather than a single unwrapped
  // line, so this stays within the listing's 132-column convention for
  // programs with many variables or many shadowed loops.
  const pushGrid = (entries: string[]): void => {
    if (entries.length === 0) {
      lines.push('  (none)');
      return;
    }
    for (let i = 0; i < entries.length; i += COLS) {
      const chunk = entries.slice(i, i + COLS);
      const parts = chunk.map(e => e.padEnd(ENTRY_WIDTH));
      lines.push('  ' + parts.join('  ').trimEnd());
    }
  };

  lines.push('');
  lines.push('Integer-Eligible Variables:');
  const integerEligible = input.integerEligible ?? new Set<string>();
  // Only real BASIC-visible variable symbols participate in this
  // classification: scalars (`VAR_<name>`, from allocVariable) and arrays
  // (`ARR_<name>`, from allocArray). `type === 'variable'` alone is not
  // enough to isolate them: the assembler tags *any* DS-labeled symbol as
  // `'variable'`, which also covers compiler-internal storage that happens
  // to be DS-labeled too -- loop-shadow slots (`SHADOW_<v>_CNT/LIM/STP/ACT`,
  // allocShadowSlots) and the error-handler save slot (`ERR_HANDLER`) as of
  // this writing. Deliberately an ALLOW-list of known BASIC-visible
  // prefixes rather than a deny-list of known-internal ones: this session
  // alone added two more internal DS-labeled prefixes (SHADOW_, then this
  // task's own discovery of ERR_HANDLER), and a deny-list would need a new
  // entry every time that happens again -- exactly the bug class that
  // produced the SHADOW_ misclassification this fix is repairing. An
  // allow-list only needs extending when a genuinely new category of
  // BASIC-visible variable appears, which is rare. Arrays never appear in
  // `integerEligible` (type-inference.ts permanently excludes array
  // elements -- see its `expr.ref.indices` check), so an ARR_ symbol always
  // and correctly falls into bcdOnlySymbols below, same as before this
  // section existed.
  const varSymbols = [...input.symbols]
    .filter(s => s.type === 'variable' && (s.name.startsWith('VAR_') || s.name.startsWith('ARR_')))
    .sort((a, b) => a.name.localeCompare(b.name));
  const eligibleSymbols = varSymbols.filter(s => integerEligible.has(s.name.replace(/^VAR_/, '')));
  const bcdOnlySymbols  = varSymbols.filter(s => !integerEligible.has(s.name.replace(/^VAR_/, '')));
  const symbolEntry = (sym: { name: string; address: number }): string =>
    `${sym.name.padEnd(12)}= ${hexAddr(sym.address)}`;
  pushGrid(eligibleSymbols.map(symbolEntry));

  lines.push('');
  lines.push('BCD-Only Variables:');
  pushGrid(bcdOnlySymbols.map(symbolEntry));

  lines.push('');
  lines.push('Shadowed FOR Loops:');
  const shadowedLoops = input.shadowedLoops ?? [];
  pushGrid(shadowedLoops.map(loop => `${loop.varName} (line ${loop.line})`));

  // ── Size summary ─────────────────────────────────────────────────────────────
  lines.push('');
  lines.push(
    `Code size: ${input.codeSize} bytes   ` +
    `Data size: ${input.dataSize} bytes   ` +
    `Variables: ${input.variableSize} bytes   ` +
    `Total: ${total} bytes`
  );
  lines.push(
    `Free space: ${free} bytes (of ${available} available)`
  );

  return lines.join('\n') + '\n';
}
