// tools/emu-debugger/trace.ts

export interface TraceEntry {
  pc: number;
  bytes: number[];
  mnemonic: string;
  cycles: number;
}

export const TRACE_CAP_DEFAULT = 100_000;

export class TraceBuffer {
  private entries: TraceEntry[] = [];
  private cap: number;

  constructor(cap: number = TRACE_CAP_DEFAULT) {
    this.cap = cap;
  }

  push(entry: TraceEntry): void {
    if (this.entries.length < this.cap) {
      this.entries.push(entry);
    }
  }

  getAll(): TraceEntry[] { return [...this.entries]; }
  size(): number { return this.entries.length; }
  clear(): void { this.entries = []; }
  atCap(): boolean { return this.entries.length >= this.cap; }
}
