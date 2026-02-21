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
  setCpuStop, setCpuDelay, setCpuSteps, setOscFreq, setOption2,
  setAcycles, acycles,
  memdef, RAM0_IDX,
  tm, setTm,
  ky, ie, ia,
  setKy,
  VDD2_bit, CLK_bit,
  INT1_bit, INT2_bit, ONINT_bit, KEYPULSE_bit, MINTIMER_bit,
  delayed_ky, setDelayedKy,
  setIfl,
} from './def.js';
import { cpuReset, cpuRun } from './cpu.js';
import { ioInit } from './port.js';
import { lcdInit, lcdRender, onrate, lcdctrl } from './lcd.js';
import { SerialRate, onSerialTick } from './port.js';

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
      // Import pc lazily to avoid top-level circular concern
      const { pc } = await_pc();
      if (pc === BreakPoint) {
        setCpuStop(true);
        setAcycles(0);
        breakCallback?.();
        break;
      }
    }
  }

  // Render LCD once per frame
  lcdRender();
  renderCallback?.();
}

// Thin wrapper to access pc without circular import issues
import { pc } from './def.js';
function await_pc() { return { pc }; }

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
  setCpuStop(true);
  running = false;
}

export function emulatorReset(): void {
  cpuReset();
  ioInit();
  lcdInit();
  onCounter    = 0;
  pulseCounter = 0;
  serialCounter = 0;
  secondCycles = 0;
  setCpuStop(false);
}

// ─── ROM loading ──────────────────────────────────────────────────────────────

export async function loadRoms(baseUrl = '/roms'): Promise<void> {
  const loads = memdef
    .filter(m => m.filename && (m.required || m.filename === 'ram0.bin'))
    .map(async (m) => {
      try {
        const resp = await fetch(`${baseUrl}/${m.filename}`);
        if (!resp.ok) {
          if (m.required) throw new Error(`ROM ${m.filename} not found (${resp.status})`);
          return;
        }
        const buf = await resp.arrayBuffer();
        m.data = new Uint8Array(buf);
      } catch (e) {
        if (m.required) throw e;
        // Optional ROMs (ram0.bin) initialize to zeros
        m.data = new Uint8Array(m.last - m.first);
      }
    });
  await Promise.all(loads);
}

// ─── charset loading ──────────────────────────────────────────────────────────
import { initCharset } from './lcd.js';

export async function loadCharset(baseUrl = '/roms'): Promise<void> {
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

interface Config {
  oscFreq?: number;
  option2?: number;
}

export function loadConfig(): void {
  try {
    const raw = localStorage.getItem('fx870p-config');
    if (!raw) return;
    const cfg: Config = JSON.parse(raw);
    if (typeof cfg.oscFreq === 'number') setOscFreq(cfg.oscFreq);
    if (typeof cfg.option2 === 'number') setOption2(cfg.option2);
  } catch {
    // ignore malformed config
  }
}

export function saveConfig(): void {
  const cfg: Config = { oscFreq: OscFreq, option2: 0 };
  localStorage.setItem('fx870p-config', JSON.stringify(cfg));
}
