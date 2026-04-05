// tools/emu-debugger/breakpoints.ts
import type { WatchKind } from './exit-reasons.js';

export class BreakpointSet {
  private pcs = new Set<number>();

  add(pc: number): void { this.pcs.add(pc & 0xFFFF); }
  remove(pc: number): void { this.pcs.delete(pc & 0xFFFF); }
  clear(): void { this.pcs.clear(); }
  has(pc: number): boolean { return this.pcs.has(pc & 0xFFFF); }
  size(): number { return this.pcs.size; }
}

export class WatchpointSet {
  private map = new Map<number, Set<WatchKind>>();

  add(address: number, kind: WatchKind): void {
    const addr = address & 0xFFFF;
    if (!this.map.has(addr)) this.map.set(addr, new Set());
    this.map.get(addr)!.add(kind);
  }

  remove(address: number, kind: WatchKind): void {
    const addr = address & 0xFFFF;
    const kinds = this.map.get(addr);
    if (!kinds) return;
    kinds.delete(kind);
    if (kinds.size === 0) this.map.delete(addr);
  }

  clear(): void { this.map.clear(); }

  /** Returns the triggered kind if a read/write at `address` matches a watch. */
  check(address: number, accessKind: 'read' | 'write'): WatchKind | null {
    const addr = address & 0xFFFF;
    const kinds = this.map.get(addr);
    if (!kinds) return null;
    if (kinds.has('access')) return 'access';
    if (kinds.has(accessKind)) return accessKind;
    return null;
  }

  size(): number {
    let n = 0;
    for (const kinds of this.map.values()) n += kinds.size;
    return n;
  }
}
