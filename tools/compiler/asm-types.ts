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
}

export interface SymbolEntry {
  name: string;
  address: number;
  type: 'code' | 'data' | 'variable';
}

export interface AssemblerOutput {
  binary: Uint8Array;
  symbols: SymbolEntry[];
  listing: string;
  codeSize: number;
  dataSize: number;
  variableSize: number;
}
