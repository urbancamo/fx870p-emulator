// tools/emu-debugger/cli.ts
import { readFileSync } from 'node:fs';
import { EmulatorSession } from './session.js';
import { formatExitResult } from './exit-reasons.js';
import type { SessionMode } from './session.js';
import type { WatchKind } from './exit-reasons.js';

interface ParsedArgs {
  command: string;
  binary: string;
  entry: number;
  loadAddr: number;
  maxCycles: number;
  maxInstructions: number;
  mode: SessionMode;
  breakpoints: number[];
  watchpoints: { addr: number; kind: WatchKind }[];
  dumpMem: { addr: number; len: number }[];
  dumpRegs: boolean;
  noLcd: boolean;
  quiet: boolean;
}

function parseHex(s: string): number {
  if (s.startsWith('0x') || s.startsWith('0X')) return parseInt(s.slice(2), 16);
  if (s.startsWith('&H') || s.startsWith('&h')) return parseInt(s.slice(2), 16);
  return parseInt(s, 10);
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    command: argv[0] ?? '',
    binary: argv[1] ?? '',
    entry: 0x0000,
    loadAddr: 0x0000,
    maxCycles: 10_000_000,
    maxInstructions: Infinity,
    mode: 'snapshot',
    breakpoints: [],
    watchpoints: [],
    dumpMem: [],
    dumpRegs: false,
    noLcd: false,
    quiet: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i]!;
    switch (arg) {
      case '--entry': args.entry = parseHex(argv[++i]!); break;
      case '--load-addr': args.loadAddr = parseHex(argv[++i]!); break;
      case '--max-cycles': args.maxCycles = parseInt(argv[++i]!, 10); break;
      case '--max-instructions': args.maxInstructions = parseInt(argv[++i]!, 10); break;
      case '--boot': args.mode = 'boot'; break;
      case '--raw': args.mode = 'raw'; break;
      case '--break': args.breakpoints.push(parseHex(argv[++i]!)); break;
      case '--watch': {
        const spec = argv[++i]!;
        const [addrStr, kindStr] = spec.split(':');
        const addr = parseHex(addrStr!);
        let kind: WatchKind = 'write';
        if (kindStr === 'r') kind = 'read';
        else if (kindStr === 'rw' || kindStr === 'wr') kind = 'access';
        else if (kindStr === 'w') kind = 'write';
        args.watchpoints.push({ addr, kind });
        break;
      }
      case '--dump-mem': {
        const [addrStr, lenStr] = argv[++i]!.split(':');
        args.dumpMem.push({ addr: parseHex(addrStr!), len: parseInt(lenStr!, 10) });
        break;
      }
      case '--dump-regs': args.dumpRegs = true; break;
      case '--no-lcd': args.noLcd = true; break;
      case '--quiet': args.quiet = true; break;
      default:
        console.error(`Unknown flag: ${arg}`);
        process.exit(1);
    }
  }
  return args;
}

function formatHex(n: number, width: number): string {
  return n.toString(16).toUpperCase().padStart(width, '0');
}

function dumpMemory(bytes: Uint8Array, baseAddr: number): void {
  for (let i = 0; i < bytes.length; i += 16) {
    const addr = formatHex(baseAddr + i, 4);
    const row = Array.from(bytes.slice(i, i + 16))
      .map(b => formatHex(b, 2))
      .join(' ');
    console.log(`${addr}  ${row}`);
  }
}

function dumpRegisters(regs: { pc: number; ua: number; ib: number; flag: number; ix: number; iy: number; iz: number; sx: number; sy: number; sz: number; ss: number; us: number; mr: Uint8Array }): void {
  console.log(`PC=${formatHex(regs.pc, 4)}  UA=${formatHex(regs.ua, 2)}  IB=${formatHex(regs.ib, 2)}  FLAG=${formatHex(regs.flag, 2)}`);
  console.log(`IX=${formatHex(regs.ix, 4)}  IY=${formatHex(regs.iy, 4)}  IZ=${formatHex(regs.iz, 4)}`);
  console.log(`SX=${formatHex(regs.sx, 2)}  SY=${formatHex(regs.sy, 2)}  SZ=${formatHex(regs.sz, 2)}  SS=${formatHex(regs.ss, 4)}  US=${formatHex(regs.us, 4)}`);
  const fmtRegs = (start: number, end: number) =>
    Array.from(regs.mr.slice(start, end + 1)).map(b => formatHex(b, 2)).join(' ');
  console.log(`$0-$9:   ${fmtRegs(0, 9)}`);
  console.log(`$10-$18: ${fmtRegs(10, 18)}`);
  console.log(`$19-$31: ${fmtRegs(19, 31)}`);
}

function runCommand(args: ParsedArgs): void {
  if (!args.binary) {
    console.error('Usage: debug run <binary> [options]');
    process.exit(1);
  }
  const bytes = new Uint8Array(readFileSync(args.binary));
  if (!args.quiet) {
    console.log(`emu-debugger: loaded ${args.binary} (${bytes.length} bytes) at 0x${formatHex(args.loadAddr, 4)}, entry 0x${formatHex(args.entry, 4)}`);
  }

  const sess = new EmulatorSession({ mode: args.mode });
  sess.loadBinary(args.loadAddr, bytes);
  sess.setEntry(args.entry);
  for (const bp of args.breakpoints) sess.addBreakpoint(bp);
  for (const wp of args.watchpoints) sess.addWatchpoint(wp.addr, wp.kind);

  const result = sess.run({ maxCycles: args.maxCycles, maxInstructions: args.maxInstructions });

  console.log('');
  console.log('── Exit ──────────────────────────────────────');
  console.log(formatExitResult(result));

  if (!args.noLcd) {
    const lcd = sess.getLcd();
    console.log('');
    console.log('── LCD ──────────────────────────────────────');
    for (const row of lcd.rows) {
      console.log(`│ ${row.padEnd(32)} │`);
    }
  }

  if (args.dumpRegs) {
    console.log('');
    console.log('── Registers ────────────────────────────────');
    dumpRegisters(sess.getRegisters());
  }

  for (const dm of args.dumpMem) {
    console.log('');
    console.log(`── Memory @ 0x${formatHex(dm.addr, 4)} (${dm.len} bytes) ──`);
    dumpMemory(sess.getMemory(dm.addr, dm.len), dm.addr);
  }

  process.exit(0);
}

function traceCommand(args: ParsedArgs): void {
  if (!args.binary) {
    console.error('Usage: debug trace <binary> [options]');
    process.exit(1);
  }
  const bytes = new Uint8Array(readFileSync(args.binary));
  if (!args.quiet) {
    console.log(`emu-debugger: tracing ${args.binary} (${bytes.length} bytes)`);
  }

  const sess = new EmulatorSession({ mode: args.mode });
  sess.loadBinary(args.loadAddr, bytes);
  sess.setEntry(args.entry);
  for (const bp of args.breakpoints) sess.addBreakpoint(bp);
  for (const wp of args.watchpoints) sess.addWatchpoint(wp.addr, wp.kind);

  const result = sess.run({
    maxCycles: args.maxCycles,
    maxInstructions: args.maxInstructions,
    trace: true,
  });

  console.log('');
  console.log('  PC    Bytes            Instruction           ');
  console.log('  ----  ---------------  ----------------------');
  for (const entry of sess.getTrace()) {
    const pc = formatHex(entry.pc, 4);
    const bytesStr = entry.bytes.map((b: number) => formatHex(b, 2)).join(' ').padEnd(15);
    console.log(`  ${pc}  ${bytesStr}  ${entry.mnemonic}`);
  }

  console.log('');
  console.log('── Exit ──────────────────────────────────────');
  console.log(formatExitResult(result));
  process.exit(0);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (!args.command) {
    console.error('Usage: npx tsx tools/emu-debugger/cli.ts <run|trace|step> <binary> [options]');
    process.exit(1);
  }
  switch (args.command) {
    case 'run': runCommand(args); break;
    case 'trace': traceCommand(args); break;
    case 'step':
      console.error('step command: implemented in Task 15');
      process.exit(1);
      break;
    default:
      console.error(`Unknown command: ${args.command}`);
      process.exit(1);
  }
}

main();
