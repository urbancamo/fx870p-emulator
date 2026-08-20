// tools/compiler/asm-types.ts

export interface AsmLine {
  label?: string;
  mnemonic?: string;
  operands?: string;
  comment?: string;
  basicLine?: { num: number; source: string };
}

export interface AsmProgram {
  lines: AsmLine[];
  origin: number;
  /** Variable names (no `VAR_` prefix) the type-inference pass judged integer-eligible. */
  integerEligible: Set<string>;
  /** FOR loops that actually got shadow slots allocated, in emission order. */
  shadowedLoops: { varName: string; line: number }[];
}

export interface SymbolEntry {
  name: string;
  address: number;
  type: 'code' | 'data' | 'variable';
}

/** What the assembler actually emitted for one AsmLine. */
export interface AsmLineResult {
  /** Index into the AsmLine[] this came from. */
  index: number;
  address: number;
  bytes: number[];
  /** Mnemonic as emitted — `jp` where an over-long `jr` was relaxed. */
  mnemonic: string;
  /** Operands with labels/EQUs substituted for their &Hxxxx values. */
  operands: string;
  /** True when this line was a `jr` relaxed into an absolute `jp`. */
  relaxed?: boolean;
}

export interface AssemblerOutput {
  binary: Uint8Array;
  symbols: SymbolEntry[];
  listing: string;
  codeSize: number;
  dataSize: number;
  variableSize: number;
  /** Per-source-line addresses and bytes, so consumers need not re-assemble. */
  lineResults: AsmLineResult[];
  /** How many `jr`s had to be relaxed to 3-byte `jp`s. */
  relaxedBranches: number;
  /** Layout/range-check iterations needed to reach a fixed point. */
  relaxationIterations: number;
}
