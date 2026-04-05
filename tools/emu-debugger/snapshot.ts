// tools/emu-debugger/snapshot.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';

import {
  pc, ua, ib, flag, ix, iy, iz, sx, sy, sz, ss, us, mr, tm, ia, ie, ky,
  setPc, setUa, setIb, setFlag, setIx, setIy, setIz, setSx, setSy, setSz,
  setSs, setUs, setTm, setIa, setIe, setKy,
  acycles, setAcycles,
  memdef,
} from '../../src/emulator/def.js';
import { pe, pd, setPe, setPd } from '../../src/emulator/port.js';
import { lcdmem, lcdchr, lcdctrl, setLcdctrl } from '../../src/emulator/lcd.js';

export interface Snapshot {
  version: number;
  romHash: string;
  cpu: {
    pc: number; ua: number; ib: number; flag: number;
    ix: number; iy: number; iz: number;
    sx: number; sy: number; sz: number;
    ss: number; us: number;
    tm: number; ia: number; ie: number; ky: number;
    pe: number; pd: number;
    acycles: number;
  };
  mr: string;
  memory: Record<string, string>;
  lcd: {
    ctrl: number;
    mem: string;
    chr: string;
  };
}

const SNAPSHOT_VERSION = 1;

function b64encode(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('base64');
}

function b64decode(s: string): Uint8Array {
  return new Uint8Array(Buffer.from(s, 'base64'));
}

function memRegionKey(m: { first: number; filename?: string }): string {
  return m.filename ?? `region_${m.first.toString(16)}`;
}

export function computeRomHash(): string {
  const h = createHash('sha256');
  for (const m of memdef) {
    if (!m.writable && m.data) {
      h.update(m.data);
    }
  }
  return 'sha256:' + h.digest('hex');
}

export function captureSnapshot(): Snapshot {
  const memory: Record<string, string> = {};
  for (const m of memdef) {
    if (m.writable && m.data) {
      memory[memRegionKey(m)] = b64encode(m.data);
    }
  }
  return {
    version: SNAPSHOT_VERSION,
    romHash: computeRomHash(),
    cpu: {
      pc, ua, ib, flag, ix, iy, iz, sx, sy, sz, ss, us,
      tm, ia, ie, ky, pe, pd, acycles,
    },
    mr: b64encode(new Uint8Array(mr)),
    memory,
    lcd: {
      ctrl: lcdctrl,
      mem: b64encode(new Uint8Array(lcdmem)),
      chr: b64encode(new Uint8Array(lcdchr)),
    },
  };
}

export function restoreSnapshot(snap: Snapshot): void {
  if (snap.version !== SNAPSHOT_VERSION) {
    throw new Error(`Snapshot version ${snap.version} unsupported (expected ${SNAPSHOT_VERSION})`);
  }
  const expectedHash = computeRomHash();
  if (snap.romHash !== expectedHash) {
    throw new Error(`ROM hash mismatch: snapshot=${snap.romHash} current=${expectedHash}. Regenerate snapshot with --boot.`);
  }

  setPc(snap.cpu.pc); setUa(snap.cpu.ua); setIb(snap.cpu.ib); setFlag(snap.cpu.flag);
  setIx(snap.cpu.ix); setIy(snap.cpu.iy); setIz(snap.cpu.iz);
  setSx(snap.cpu.sx); setSy(snap.cpu.sy); setSz(snap.cpu.sz);
  setSs(snap.cpu.ss); setUs(snap.cpu.us);
  setTm(snap.cpu.tm); setIa(snap.cpu.ia); setIe(snap.cpu.ie);
  setKy(snap.cpu.ky); setPe(snap.cpu.pe); setPd(snap.cpu.pd);
  setAcycles(snap.cpu.acycles);

  const mrBytes = b64decode(snap.mr);
  for (let i = 0; i < mrBytes.length && i < mr.length; i++) mr[i] = mrBytes[i]!;

  for (const m of memdef) {
    if (!m.writable || !m.data) continue;
    const b64 = snap.memory[memRegionKey(m)];
    if (!b64) continue;
    const bytes = b64decode(b64);
    for (let i = 0; i < bytes.length && i < m.data.length; i++) m.data[i] = bytes[i]!;
  }

  setLcdctrl(snap.lcd.ctrl);
  const lmem = b64decode(snap.lcd.mem);
  for (let i = 0; i < lmem.length && i < lcdmem.length; i++) lcdmem[i] = lmem[i]!;
  const lchr = b64decode(snap.lcd.chr);
  for (let i = 0; i < lchr.length && i < lcdchr.length; i++) lcdchr[i] = lchr[i]!;
}

export function saveSnapshotToFile(path: string, snap: Snapshot): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(snap, null, 2) + '\n', 'utf8');
}

export function loadSnapshotFromFile(path: string): Snapshot {
  const text = readFileSync(path, 'utf8');
  return JSON.parse(text) as Snapshot;
}

export function snapshotExists(path: string): boolean {
  return existsSync(path);
}
