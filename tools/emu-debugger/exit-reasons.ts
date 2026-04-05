// tools/emu-debugger/exit-reasons.ts

export type ExitReason =
  | 'breakpoint'
  | 'watchpoint'
  | 'max-cycles'
  | 'max-instructions'
  | 'halted'
  | 'returned'
  | 'illegal'
  | 'manual';

export type WatchKind = 'read' | 'write' | 'access';

export interface WatchpointHit {
  address: number;
  kind: WatchKind;
  value: number;
  pc: number;
}

export interface ExitResult {
  reason: ExitReason;
  cyclesExecuted: number;
  instructionsExecuted: number;
  pc: number;
  breakpointHit?: number;
  watchpointHit?: WatchpointHit;
  illegalOpcode?: number;
}

/** Format an ExitResult as a human-readable string. */
export function formatExitResult(r: ExitResult): string {
  const lines: string[] = [];
  let detail: string = r.reason;
  if (r.reason === 'breakpoint' && r.breakpointHit !== undefined) {
    detail = `breakpoint at 0x${r.breakpointHit.toString(16).toUpperCase().padStart(4, '0')}`;
  } else if (r.reason === 'watchpoint' && r.watchpointHit) {
    const w = r.watchpointHit;
    const hex = (n: number) => '0x' + n.toString(16).toUpperCase().padStart(4, '0');
    detail = `watchpoint ${w.kind} at ${hex(w.address)} value=0x${w.value.toString(16).padStart(2, '0')} from PC=${hex(w.pc)}`;
  } else if (r.reason === 'illegal' && r.illegalOpcode !== undefined) {
    detail = `illegal opcode 0x${r.illegalOpcode.toString(16).padStart(2, '0')}`;
  }
  lines.push(`Reason:         ${detail}`);
  lines.push(`Cycles:         ${r.cyclesExecuted.toLocaleString()}`);
  lines.push(`Instructions:   ${r.instructionsExecuted.toLocaleString()}`);
  lines.push(`PC at exit:     0x${r.pc.toString(16).toUpperCase().padStart(4, '0')}`);
  return lines.join('\n');
}
