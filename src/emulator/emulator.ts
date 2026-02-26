// Main emulator loop and ROM loading
// Replaces Delphi's TMainForm.OnRunTimer / OnSecTimer / FormCreate
//
// Design:
//   requestAnimationFrame drives each ~16 ms frame.
//   Each frame we compute a cycle budget from elapsed time and run
//   CPU instructions until the budget is exhausted.
//   All periodic interrupts (serial, pulse, ON, one-minute timer) are
//   driven by accumulated cycle counts — no separate JS timers needed.

import {
  OscFreq,
  CpuStop, CpuDelay, CpuSteps, BreakPoint,
  CpuSleep, SW_bit,
  setCpuStop, setCpuDelay, setCpuSteps, setOscFreq,
  setAcycles, acycles,
  memdef, RAM0_IDX,
  tm, setTm,
  ky, ie, ia,
  setFlag, setKy,
  VDD2_bit, CLK_bit,
  INT1_bit, INT2_bit, ONINT_bit, KEYPULSE_bit, MINTIMER_bit,
  delayed_ky, setDelayedKy,
  setIfl,
  setRamWriteMonitor,
  setPcMonitor,
  sx, sy, sz, ix, iz, pc, ua, flag, mr,
  addr18, ib,
  Option2, setOption2,
} from './def.js';
import { cpuReset, cpuRun, cpuWakeUp } from './cpu.js';
import { ioInit, SerialRate, onSerialTick, pd, pe, pdi, getUartRegs } from './port.js';
import { lcdInit, lcdRender, onrate, lcdctrl } from './lcd.js';
import { commDecTimer } from './comm.js';
import { remoteLog, flushLog, enableRemoteLog } from './remote-log.js';
import { traceInit, traceClose } from './trace.js';

// ─── counters (cycle-based, like Delphi's timer variables) ──────────────────

let onCounter     = 0;  // ON-key pulse counter (counts down in cycles)
let pulseCounter  = 0;  // KEY/Pulse interrupt counter
let serialCounter = 0;  // serial tick counter
let secondCycles  = 0;  // cycles since last second tick (for TM register)

// ─── render callback (filled by LcdCanvas.vue) ───────────────────────────────
let renderCallback: (() => void) | null = null;
export function setRenderCallback(fn: () => void): void { renderCallback = fn; }

// ─── breakpoint / step callback (filled by DebugPanel.vue) ───────────────────
let breakCallback: (() => void) | null = null;
export function setBreakCallback(fn: () => void): void { breakCallback = fn; }

// ─── rAF loop ─────────────────────────────────────────────────────────────────
let running    = false;
let lastTime   = 0;
let rafHandle  = 0;

// ─── auto-wake: simulate the ON key press once after first APO sleep ──────────
// The ROM performs a cold-start APO sleep immediately. In the Delphi emulator
// the user clicks the ON button; here we wake automatically after the first frame.
let _autoWakeDone = false;

function frame(now: number): void {
  rafHandle = requestAnimationFrame(frame);
  if (!running) return;

  const elapsed = lastTime === 0 ? 16 : Math.min(now - lastTime, 50); // cap at 50 ms
  lastTime = now;

  // Cycle budget for this frame (OscFreq kHz × elapsed ms)
  const frameCycles = Math.round(OscFreq * elapsed);

  if (CpuDelay > 0) {
    setCpuDelay(CpuDelay - 1);
    setAcycles(0);
    renderCallback?.();
    return;
  }

  _resetCycles += frameCycles;
  setAcycles(acycles + frameCycles);

  while (acycles > 0) {
    if (CpuStop) {
      setAcycles(0);
      break;
    }

    const x = cpuRun();
    setAcycles(acycles - x);

    // INT1 — edge triggered on KY bit 11
    if (((ky ^ delayed_ky) & 0x0800) !== 0 &&
        ((ky & 0x0800) === 0) === ((ie & 0x02) === 0)) {
      setIfl(INT1_bit);
    }
    setDelayedKy(ky);

    // INT2 — level triggered on KY bit 10
    if (((ky & 0x0400) === 0) === ((ie & 0x01) === 0)) {
      setIfl(INT2_bit);
    }

    // ON pulse interrupt (LCD clock drives the on-rate counter)
    if ((lcdctrl & (VDD2_bit | CLK_bit)) === (VDD2_bit | CLK_bit)) {
      onCounter -= x;
      if (onCounter < 0) {
        onCounter += onrate;
        if (onCounter < 0) onCounter = onrate;
        setKy(ky ^ 0x0200);  // toggle ON bit
        if ((ky & 0x0200) === 0) setIfl(ONINT_bit);
      }
    }

    // KEY/Pulse interrupt (IA bit 6: 0=256 Hz, 1=1 Hz)
    const pulseHz = (ia & 0x40) === 0 ? 256 : 1;
    pulseCounter -= x * pulseHz;
    if (pulseCounter < 0) {
      pulseCounter += OscFreq * 1000; // add one second's worth of cycles
      if (pulseCounter < 0) pulseCounter = OscFreq * 1000;
      if ((ia & 0x80) === 0) setIfl(KEYPULSE_bit);
    }

    // Serial tick
    serialCounter -= x;
    if (serialCounter < 0) {
      serialCounter += SerialRate;
      if (serialCounter < 0) serialCounter = SerialRate;
      onSerialTick();
    }

    // Comm char-delay timer (mirrors Delphi: if CommDelayTimer > 0 then Dec(CommDelayTimer, x))
    commDecTimer(x);

    // One-second tick → TM register (BCD seconds; at 60 s → fire one-minute timer)
    secondCycles += x;
    if (secondCycles >= OscFreq * 1000) {
      secondCycles -= OscFreq * 1000;
      let newTm = (tm + 1) & 0xFF;
      setTm(newTm);
      if ((newTm & 0x3F) === 60) {
        setTm((newTm + 4) & 0xFF); // BCD rollover into next minute
        if (!CpuStop) setIfl(MINTIMER_bit);
      }
    }

    // CpuSteps countdown (single-step / step-N mode)
    if (CpuSteps > 0) {
      setCpuSteps(CpuSteps - 1);
      if (CpuSteps === 0) {
        setCpuStop(true);
        setAcycles(0);
        breakCallback?.();
        break;
      }
    }

    // Breakpoint
    if (BreakPoint >= 0) {
      if (pc === BreakPoint) {
        setCpuStop(true);
        setAcycles(0);
        breakCallback?.();
        break;
      }
    }
  }

  // Auto-wake: simulate pressing ON once after the ROM's initial APO sleep
  if (!_autoWakeDone && CpuSleep) {
    _autoWakeDone = true;
    cpuWakeUp(false);
  }

  // Render LCD once per frame
  lcdRender();
  renderCallback?.();
}

// (pc imported via main def.ts import block above)

// ─── public API ───────────────────────────────────────────────────────────────

export function emulatorStart(): void {
  if (!running) {
    running   = true;
    lastTime  = 0;
    if (rafHandle === 0) rafHandle = requestAnimationFrame(frame);
  }
  setCpuStop(false);
}

export function emulatorStop(): void {
  traceClose();
  setCpuStop(true);
  running = false;
}

// Accumulated cycles since last reset — used to time-stamp debug log entries.
let _resetCycles = 0;
export function getResetCycles(): number { return _resetCycles; }

export function emulatorReset(): void {
  _resetCycles = 0;
  cpuReset();
  ioInit();
  lcdInit();
  onCounter    = 0;
  pulseCounter = 0;
  serialCounter = 0;
  secondCycles = 0;
  _autoWakeDone = false;
  // Delphi FormShow: flag := SW_bit — power switch on signal for the ROM
  setFlag(SW_bit);
  setCpuStop(false);
  remoteLog('emulator', 'reset — PC=0x0000 SW_bit set');
  traceInit(); // start full instruction trace (auto-stops after 10 s of emulated time)
  // Phase 1: log first-write to every address in the first 2 s (capture full boot).
  // Phase 2: after 2 s, switch to a permanent watch on devtbl[0] (0x11100).
  // drvptr (0x1165C:0x1165D) is watched unconditionally in both phases.
  const MONITOR_CYCLES = OscFreq * 2000; // 2 s of emulated time (capture full boot)
  const _seen = new Set<number>();
  setRamWriteMonitor((addr, val) => {
    // drvptr always watched — catches writes in Phase 1 before logging may be enabled.
    // 0x2734 = stub, 0x1FB0 = real RS-232C driver, 0x66C2 = CAL mode driver.
    if (addr === 0x1165C || addr === 0x1165D) {
      remoteLog('drvptr', `RAM[0x${addr.toString(16)}]=0x${val.toString(16).padStart(2,'0')} pc=0x${pc.toString(16).padStart(4,'0')} @${_resetCycles}cy`);
    }

    if (_resetCycles <= MONITOR_CYCLES) {
      if (!_seen.has(addr)) {
        _seen.add(addr);
        remoteLog('RAM first-wr', `0x${addr.toString(16).padStart(5,'0')} = 0x${val.toString(16).padStart(2,'0')}`);
      }
    } else {
      // Phase 2: permanent watch on devtbl[0]
      if (_seen.size > 0) {
        remoteLog('RAM monitor', `phase1 done — ${_seen.size} unique addrs; watching 0x11100 & 0x1165C`);
        _seen.clear();
        void flushLog();
      }
      if (addr === 0x11100) {
        const uart = getUartRegs();
        remoteLog('devtbl[0]', `0x${val.toString(16).padStart(2,'0')} COM0=${val & 0x10 ? 'YES' : 'NO'} pc=0x${pc.toString(16).padStart(4,'0')} pe=0x${pe.toString(16).padStart(2,'0')} pd=0x${pd.toString(16).padStart(2,'0')} pdi=0x${pdi.toString(16).padStart(2,'0')} ga3=0x${(uart.rd[3]??0xFF).toString(16)} @${_resetCycles}cy`);
      }
    }
  });

  // PC execution trace: log the first time each key DriverInstallLoop address is hit.
  // NOT gated by isRemoteLogEnabled() — fires unconditionally so boot traces are never missed.
  // NOTE: do NOT call window.loadDebug() before Fresh Start — it replaces this monitor.
  // 0x1FC3 = DriverInstallLoop entry (GetDeviceEntry call)
  // 0x1FC6 = after GetDeviceEntry (cal nz,&H2D64 — taken if GetDeviceEntry returns nz)
  // 0x1FC9 = past the 0x2D64 branch (only if GetDeviceEntry returned z=1)
  // 0x1FCC = return from cal &H9272 (device slot setup)
  // 0x1FCF = return from cal &H001C (device-table read)
  // 0x1FD5 = std $1,(ix+$sx) — devtbl write
  // 0x1FD7 = pst ua,&H54 — entry to inner loop body (also reached on loop-back)
  // 0x1FDA = ldw r2,&H1FB0 — real driver address about to be loaded
  // 0x1FDE = cal StoreDriverPtr with r2=0x1FB0
  // 0x2D64 = escape path (GetDeviceEntry returned nz; jp &H2AE8 never returns)
  // 0x273A = jp &H1FC3 from InstallCOM0Stub (confirms stub installer ran)
  const _pcSeen = new Set<number>([0x1FC3, 0x1FC6, 0x1FC9, 0x1FCC, 0x1FCF, 0x1FD5, 0x1FD7, 0x1FDA, 0x1FDE, 0x2D64, 0x273A]);
  setPcMonitor((tracePC) => {
    if (!_pcSeen.has(tracePC)) return;
    _pcSeen.delete(tracePC); // log each address once only
    const fl = flag;
    const flStr = `fl=0x${fl.toString(16).padStart(2,'0')}(${fl & 0x80 ? 'Z' : 'z'}${fl & 0x40 ? 'C' : 'c'}${fl & 0x08 ? 'SW' : ''})`;
    remoteLog('PC-trace', `0x${tracePC.toString(16).padStart(4,'0')} sz=0x${sz.toString(16).padStart(2,'0')} ix=0x${ix.toString(16).padStart(4,'0')} ua=0x${ua.toString(16).padStart(2,'0')} mr1=0x${(mr[1]??0).toString(16).padStart(2,'0')} ${flStr} @${_resetCycles}cy`);
    if (_pcSeen.size === 0) setPcMonitor(null); // all seen, disable hook
  });
}

// ─── ROM loading ──────────────────────────────────────────────────────────────

export async function loadRoms(baseUrl = `${import.meta.env.BASE_URL}roms`): Promise<void> {
  const loads = memdef
    .filter(m => m.filename)
    .map(async (m) => {
      try {
        const resp = await fetch(`${baseUrl}/${m.filename}`);
        if (!resp.ok) {
          if (m.required) throw new Error(`ROM ${m.filename} not found (${resp.status})`);
          return; // optional (ram0.bin) — fall through to 0xFF init below
        }
        const buf = await resp.arrayBuffer();
        m.data = new Uint8Array(buf);
      } catch (e) {
        if (m.required) throw e;
      }
    });
  await Promise.all(loads);
  // Any writable region not loaded from server gets initialised to 0xFF.
  for (const m of memdef) {
    if (m.writable && !m.data) {
      m.data = new Uint8Array(m.last - m.first).fill(0xFF);
    }
  }
}

// ─── RAM byte reader (for diagnostics) ───────────────────────────────────────

export function readRamByte(physAddr: number): number {
  const ram0 = memdef[RAM0_IDX];
  if (!ram0?.data) return 0xFF;
  const idx = physAddr - ram0.first;
  if (idx < 0 || idx >= ram0.data.length) return 0xFF;
  return ram0.data[idx] ?? 0xFF;
}

// ─── Option2 (firmware mode) ─────────────────────────────────────────────────
export function getOption2(): number { return Option2; }

// ─── RAM state import (load a ram0.bin saved by the Delphi emulator) ──────────

export async function importRamState(data: Uint8Array): Promise<void> {
  const ram0 = memdef[RAM0_IDX];
  if (!ram0?.data) return;
  const len = Math.min(data.length, ram0.data.length);
  ram0.data.set(data.subarray(0, len));
  await saveState(); // persist to IndexedDB so it survives reloads
}

export function exportRamState(): Uint8Array {
  const ram0 = memdef[RAM0_IDX];
  if (!ram0?.data) return new Uint8Array(0);
  return new Uint8Array(ram0.data);
}

// ─── charset loading ──────────────────────────────────────────────────────────
import { initCharset } from './lcd.js';

export async function loadCharset(baseUrl = `${import.meta.env.BASE_URL}roms`): Promise<void> {
  const resp = await fetch(`${baseUrl}/charset.bin`);
  if (!resp.ok) throw new Error(`charset.bin not found`);
  const buf  = await resp.arrayBuffer();
  initCharset(new Uint8Array(buf));
}

// ─── RAM persistence (IndexedDB) ─────────────────────────────────────────────

const DB_NAME    = 'fx870p';
const DB_VERSION = 1;
const STORE_NAME = 'state';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

export async function saveState(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  // Save RAM
  const ram0 = memdef[RAM0_IDX];
  if (ram0?.data) store.put(ram0.data.slice(), 'ram0');
  // Save register snapshot (mr[0..31] + pc/ua/ss) via def exports
  const { mr, pc, ua, ss } = await import('./def.js');
  const regBuf = new Uint8Array(36);
  regBuf.set(mr.subarray(0, 32));
  // Store a few key 16-bit regs at offsets 32–35
  regBuf[32] = pc & 0xFF; regBuf[33] = (pc >> 8) & 0xFF;
  regBuf[34] = ua & 0xFF; regBuf[35] = ss & 0xFF;
  store.put(regBuf, 'registers');
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

export async function restoreState(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const [ram, regs] = await Promise.all([
    new Promise<Uint8Array | undefined>((res, rej) => {
      const r = store.get('ram0');
      r.onsuccess = () => res(r.result);
      r.onerror   = () => rej(r.error);
    }),
    new Promise<Uint8Array | undefined>((res, rej) => {
      const r = store.get('registers');
      r.onsuccess = () => res(r.result);
      r.onerror   = () => rej(r.error);
    }),
  ]);
  const ram0m = memdef[RAM0_IDX];
  if (ram && ram0m?.data) ram0m.data.set(ram.subarray(0, ram0m.data.length));
  if (regs) {
    const { mr, setPc, setUa, setSs } = await import('./def.js');
    mr.set(regs.subarray(0, 32));
    setPc((regs[32] ?? 0) | ((regs[33] ?? 0) << 8));
    setUa(regs[34] ?? 0);
    setSs(regs[35] ?? 0);
  }
}

// ─── config from localStorage ─────────────────────────────────────────────────

// Bumped to 3: stop persisting option2 (it is a compile-time constant in def.ts,
// not a user preference). Any stored option2 value caused pdi to be wrong at boot.
const CONFIG_VERSION = 4;

interface Config {
  version: number;
  oscFreq?: number;
  option2?: number;
}

export function loadConfig(): void {
  try {
    const raw = localStorage.getItem('fx870p-config');
    if (!raw) return;
    const cfg: Config = JSON.parse(raw);
    if (cfg.version < CONFIG_VERSION) {
      localStorage.removeItem('fx870p-config');
      return;
    }
    if (typeof cfg.oscFreq === 'number') setOscFreq(cfg.oscFreq);
    if (typeof cfg.option2 === 'number') setOption2(cfg.option2);
  } catch {
    // ignore malformed config
  }
}

export function saveConfig(): void {
  const cfg: Config = { version: CONFIG_VERSION, oscFreq: OscFreq, option2: Option2 };
  localStorage.setItem('fx870p-config', JSON.stringify(cfg));
}

export async function clearSavedState(): Promise<void> {
  localStorage.removeItem('fx870p-config');
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    await new Promise<void>((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror    = () => rej(tx.error);
    });
  } catch {
    // ignore if DB doesn't exist yet
  }
}

// Wipe saved state and perform a cold reset in-memory — no page reload.
// Preserves running emulator infrastructure (logging, RAF loop) so debug
// tooling stays active across the reset.
export async function freshReset(): Promise<void> {
  await clearSavedState();
  // Re-initialise RAM region to 0xFF (mirrors cold-start MemLoad)
  const ram0 = memdef[RAM0_IDX];
  if (ram0?.data) ram0.data.fill(0xFF);
  emulatorReset();
  emulatorStart();
  remoteLog('emulator', 'freshReset — RAM cleared to 0xFF, cold boot starting');
}

// ─── LIST command debug helper ────────────────────────────────────────────────
// Install/remove a persistent PC monitor that traces the LIST command.
// Usage: window.listDebug() to install, window.listDebug(false) to remove.
// Enable the Log button FIRST so output goes to emulator-debug.log.
//
// Routing for OUTDV=8 (LIST):
//   3DCB → 3DD6 → jp 2AF1 → 2B2D → cal 93E2  (LCD display, correct path)
//   NOT via 2B0C (that is OUTDV=4, file write)
//
// Key addresses monitored:
//   0x3D26 = LIST entry — logs OUTDV, r4/r5 (start line), ua
//   0x3D94 = after LNSCH returns — logs IZ, physical addr, byte at IZ, r6/r7
//   0x3D9D = loop top: adc (iz+$sx),$31 — logs sz/sy/sz values too
//   0x3D9F = rtn z — BASIC program empty / end of lines
//   0x3DA0 = sbcw (iz+$sy),$6 — logs IZ word at offset sy
//   0x3DA4 = rtn nc — current line number > end range (r6,r7)
//   0x3DA5 = phsw $7 — right after rtn nc (should fire before ENLST)
//   0x3DA6 = byte after phsw — fires if phsw is only 1 byte (bad)
//   0x3DA7 = cal ENLST — line found, about to format to ASCII
//   0x3DAA = gre iz,$17 — first instr after ENLST returns
//   0x3DAE = after ENLST, ix reset to 0x1000 — logs ASCII buffer preview
//   0x3DC0 = end of character loop for a line
//   0x3DC8 = pre iz,$17,jr 3D9D — next line loop-back
//   0x3DBA = about to display a character (once per char)
//   0x2B2D = OUTDV=8 LCD+printer path — character is about to reach LCD
//   0x93E2 = LCD char display routine — character is being written to display
export function installListDebug(enable = true): void {
  if (!enable) {
    setPcMonitor(null);
    remoteLog('list-dbg', 'monitor removed');
    void flushLog();
    enableRemoteLog(false);
    return;
  }
  // Auto-enable remote logging so the user doesn't need to click the Log button first
  enableRemoteLog(true);

  const ram = memdef[RAM0_IDX].data;
  const RAM0_BASE = 0x10000;

  // Read a byte at the given 18-bit physical address (RAM0 only)
  const readPhys = (phys: number): number => {
    if (ram && phys >= RAM0_BASE && phys < RAM0_BASE + 0x10000)
      return ram[phys - RAM0_BASE]!;
    return 0xFF;
  };

  // Compute physical address for IZ-based access using current UA
  const izPhys = (): number => addr18((ua >> 6) & 3, iz);
  // Compute physical address for IX-based access using current UA
  const ixPhys = (off: number): number => addr18((ua >> 4) & 3, off);

  // OUTDV byte (logical 0x1739, IX segment in current UA)
  const outdv = (): number => readPhys(ixPhys(0x1739));

  // NOWFL (logical 0x16C9) — index into file table at 0x18A7
  const nowfl = (): number => {
    const lo = readPhys(ixPhys(0x16C9));
    const hi = readPhys(ixPhys(0x16CA));
    return lo | (hi << 8);
  };

  let count = 0;
  const MAX = 400;
  const log = (tag: string, msg: string) => {
    if (count++ < MAX) remoteLog(tag, msg);
    else { setPcMonitor(null); remoteLog('list-dbg', `limit ${MAX} reached, monitor removed`); void flushLog(); }
  };

  setPcMonitor((tracePC) => {
    switch (tracePC) {

      case 0x3D26: {
        log('LIST', `entry: OUTDV=0x${outdv().toString(16)} r4=${mr[4]} r5=${mr[5]} ua=0x${ua.toString(16)} ib=0x${ib.toString(16)} NOWFL=${nowfl()}`);
        break;
      }

      case 0x3D94: {
        // Right after LNSCH returns — IZ should point to first matching line
        const phys = izPhys();
        const b0 = readPhys(phys);     // byte 0 = line length (0 = end marker)
        const b1 = readPhys(phys + 1); // byte 1,2 = line number (lo,hi)
        const b2 = readPhys(phys + 2);
        const lineNo = b1 | (b2 << 8);
        const r25_26 = mr[25] | (mr[26] << 8);
        log('LIST', `LNSCH→ iz=0x${iz.toString(16)} phys=0x${phys.toString(16)} [0]=0x${b0.toString(16)} lineNo=${lineNo} r6=${mr[6]} r7=${mr[7]} fileStart=0x${r25_26.toString(16)}`);
        break;
      }

      case 0x3D9D: {
        // Loop top: adc (iz+$sx),$31 — test length byte at [IZ+sx]
        const phys = izPhys();
        const b0 = readPhys(phys + sx); // byte at [IZ+sx]
        log('LIST', `loop-top: iz=0x${iz.toString(16)} phys=0x${phys.toString(16)} [IZ+sx=${sx}]=0x${b0.toString(16)} sx=${sx} sy=${sy} sz=${sz} r6=${mr[6]} r7=${mr[7]}`);
        break;
      }

      case 0x3D9F:
        log('LIST', `rtn z — [IZ+sx]=0 (end marker) iz=0x${iz.toString(16)} phys=0x${izPhys().toString(16)}`);
        break;

      case 0x3DA0: {
        // sbcw (iz+$sy),$6 — compare line# at [IZ+sy] with r6,r7
        const phys = izPhys();
        const lo = readPhys(phys + sy);
        const hi = readPhys(phys + sy + 1);
        const word = lo | (hi << 8);
        log('LIST', `sbcw: [IZ+sy=${sy}]=0x${word.toString(16)} (${word}) vs r6,r7=${mr[6]|(mr[7]<<8)}`);
        break;
      }

      case 0x3DA4: {
        const lineNo = readPhys(izPhys() + 1) | (readPhys(izPhys() + 2) << 8);
        log('LIST', `rtn nc — lineNo=${lineNo} endLine=${mr[6]|(mr[7]<<8)} fl=0x${flag.toString(16)} iz=0x${iz.toString(16)}`);
        break;
      }

      case 0x3DA5:
        log('LIST', `phsw $7 — r6=${mr[6]} r7=${mr[7]} (saving range for ENLST call)`);
        break;

      case 0x3DA6:
        log('LIST', `0x3DA6 fired — phsw is 1 byte! cal is at 3DA6 not 3DA7`);
        break;

      case 0x3DA7: {
        const phys = izPhys();
        const lineNo = readPhys(phys + 1) | (readPhys(phys + 2) << 8);
        log('LIST', `ENLST: lineNo=${lineNo} iz=0x${iz.toString(16)} phys=0x${phys.toString(16)}`);
        break;
      }

      case 0x3DAA:
        log('LIST', `after ENLST rtn: iz=0x${iz.toString(16)} (gre iz,$17 about to run)`);
        break;

      case 0x3DAE: {
        // After ENLST, ix is about to be reset to 0x1000 — read from buf
        const bufPhys = ixPhys(0x1000);
        const chars = Array.from({length: 20}, (_, i) => {
          const b = readPhys(bufPhys + i);
          return b === 0 ? '\\0' : (b >= 32 && b < 127 ? String.fromCharCode(b) : `[${b.toString(16)}]`);
        }).join('');
        log('LIST', `buf@0x1000 (phys=0x${bufPhys.toString(16)}): "${chars}"`);
        break;
      }

      case 0x3DC0:
        log('LIST', `end-of-line char loop: iz=0x${iz.toString(16)} r6=${mr[6]} r7=${mr[7]}`);
        break;

      case 0x3DC8:
        log('LIST', `next-line loop: pre iz,$17 → iz=0x${iz.toString(16)} (about to loop to 3D9D)`);
        break;

      case 0x3DBA: {
        const ch = mr[16];
        log('LIST', `disp char 0x${ch.toString(16)} '${ch >= 32 && ch < 127 ? String.fromCharCode(ch) : '?'}' OUTDV=0x${outdv().toString(16)}`);
        break;
      }

      case 0x2B2D:
        log('LIST', `OUTDV=8 LCD path: r16=0x${mr[16].toString(16)} '${mr[16] >= 32 && mr[16] < 127 ? String.fromCharCode(mr[16]) : '?'}'`);
        break;

      case 0x93E2:
        log('LIST', `LCD display r16=0x${mr[16].toString(16)} '${mr[16] >= 32 && mr[16] < 127 ? String.fromCharCode(mr[16]) : '?'}'`);
        break;
    }
  });

  const msg = `list-dbg: monitor installed — NOWFL=${nowfl()} OUTDV=0x${outdv().toString(16)}. Now type your program and LIST. Call listDebug(false) when done to flush.`;
  console.log(msg);
  remoteLog('list-dbg', msg);
}
// Expose on window for browser console access
(window as unknown as Record<string, unknown>).listDebug = installListDebug;

// ─── LOAD command debug helper ────────────────────────────────────────────────
// Traces the LOAD "COM0:..." receive/tokenize/store path.
// Usage: loadDebug() to install, loadDebug(false) to flush and remove.
//
// Key addresses:
//   0x4AC7 = LOAD loop top (after EOF check)
//   0x4AD8 = cal 4D28 — read one ASCII line from RS232C into INTOP buffer
//   0x4AEE = sbc (iz+$sx),0x20 — skip blank/control lines
//   0x4AF7 = cal 1D2C — tokenize the ASCII line
//   0x4AFC = after tokenize / before store
//   0x4E36 = EOF check — if EOF flag set, LOAD stops
//   0x8590 = receive one byte from UART (blocks waiting)
//   0x1D2C = tokenize entry point
export function installLoadDebug(enable = true): void {
  if (!enable) {
    setPcMonitor(null);
    remoteLog('load-dbg', 'monitor removed');
    void flushLog();
    enableRemoteLog(false);
    return;
  }
  enableRemoteLog(true);

  const ram = memdef[RAM0_IDX].data;
  const RAM0_BASE = 0x10000;
  const readPhys = (phys: number): number => {
    if (ram && phys >= RAM0_BASE && phys < RAM0_BASE + 0x10000)
      return ram[phys - RAM0_BASE]!;
    return 0xFF;
  };
  const ixPhys = (off: number): number => addr18((ua >> 4) & 3, off);
  const izPhys = (): number => addr18((ua >> 6) & 3, iz);

  // Read NOWFL (logical 0x16C9) — current file index
  const nowfl = (): number => {
    const lo = readPhys(ixPhys(0x16C9));
    const hi = readPhys(ixPhys(0x16CA));
    return lo | (hi << 8);
  };

  // Read up to n bytes from INTOP buffer (logical 0x19D5, IX segment)
  const intopStr = (): string => {
    const base = ixPhys(0x19D5);
    const chars: string[] = [];
    for (let i = 0; i < 48; i++) {
      const b = readPhys(base + i);
      if (b === 0) break;
      chars.push(b >= 32 && b < 127 ? String.fromCharCode(b) : `[${b.toString(16)}]`);
    }
    return chars.join('');
  };

  let count = 0;
  const MAX = 600;
  const log = (tag: string, msg: string) => {
    if (count++ < MAX) remoteLog(tag, msg);
    else { setPcMonitor(null); remoteLog('load-dbg', `limit ${MAX} reached`); void flushLog(); }
  };

  // Track byte counts for receive path
  let rxCount = 0;
  let lineCount = 0;

  setPcMonitor((tracePC) => {
    switch (tracePC) {

      case 0x4AC7:
        log('LOAD', `loop-top #${lineCount} — NOWFL=${nowfl()} iz=0x${iz.toString(16)} fl=0x${flag.toString(16)}`);
        break;

      case 0x4AEE: {
        // sbc (iz+$sx),0x20 — first char of received line; skip if < 0x20
        const ch = readPhys(izPhys());
        log('LOAD', `skip-check: [IZ+sx=${sx}]=0x${ch.toString(16)} '${ch >= 32 && ch < 127 ? String.fromCharCode(ch) : '?'}' INTOP="${intopStr()}"`);
        break;
      }

      case 0x4AD8:
        log('LOAD', `read-line #${lineCount}: calling 4D28 (read ASCII line from UART)`);
        lineCount++;
        break;

      case 0x4AF7:
        log('LOAD', `tokenize: INTOP="${intopStr()}" → calling 1D2C`);
        break;

      case 0x4AFC:
        log('LOAD', `after-tokenize: fl=0x${flag.toString(16)} iz=0x${iz.toString(16)}`);
        break;

      case 0x4E36:
        log('LOAD', `EOF-check: fl=0x${flag.toString(16)} (z=EOF reached)`);
        break;

      case 0x8590:
        // Receive byte from UART — log every 16th to avoid flooding
        rxCount++;
        if (rxCount <= 8 || rxCount % 16 === 0)
          log('LOAD', `uart-rx #${rxCount}: r16=0x${mr[16].toString(16)} '${mr[16] >= 32 && mr[16] < 127 ? String.fromCharCode(mr[16]) : '?'}'`);
        break;

      case 0x1D2C:
        log('LOAD', `tokenize-entry: INTOP="${intopStr()}" fl=0x${flag.toString(16)}`);
        break;
    }
  });

  const msg = `load-dbg: monitor installed — NOWFL=${nowfl()}. Start LOAD "COM0:..." then click Send.  Call loadDebug(false) when done.`;
  console.log(msg);
  remoteLog('load-dbg', msg);
}
(window as unknown as Record<string, unknown>).loadDebug = installLoadDebug;
