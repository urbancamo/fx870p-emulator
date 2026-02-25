// HD61700 CPU: reset, interrupt dispatch, run loop
// Ported from cpu.pas

import {
  pc, ua, ib, iserv, ss, speed,
  setPc, setUa, setIe, setIa, setIb, setIserv, setSs,
  setKy, setSpeed, setAcycles, setCpuSleep,
  setDelayedUa, setDelayedKy,
  cycles, setCycles, setOpindex,
  procptr, procindex, setProcindex,
  INTVECTORS, intmask, intvec,
  addr18, dstWrite,
  CpuSleep,
  cpuWakeUp, setIfl,
  firePcMonitor,
} from './def.js';
import { execInstr } from './exec.js';
import { traceInstr, traceAddCycles, isTraceEnabled } from './trace.js';

export { cpuWakeUp, setIfl };

export function cpuReset(): void {
  // Matches Delphi's CpuReset exactly — it only resets pc, ua, ky, ie, ia, ib,
  // iserv, speed, acycles, and CpuSleep.  It does NOT touch mr[], ss, us, ix,
  // iy, iz, sx, sy, sz, flag, or tm.
  //
  // On first ever load, def.ts initialises mr[] to 0xFF and ss/us to 0xFFFF,
  // matching Delphi's MemLoad behaviour when no register.bin exists.
  //
  // Note: sz/sx/sy start at 0 on first load because JS module variables are
  // zero-initialised, exactly as Pascal zero-initialises its global variables.
  // Delphi's CpuReset also leaves sz unchanged, relying on the same guarantee.
  setPc(0x0000);
  setUa(0);
  setDelayedUa(0);
  // KY initial value: bit 10 = ON key not pressed, bit 11 = cassette carrier absent
  const initKy = 0x0C00;
  setDelayedKy(initKy);
  setKy(initKy);
  setIe(0);
  setIa(0);
  setIb(0);
  setIserv(0);
  setSpeed(0);
  setAcycles(0);
  setCpuSleep(false);
}

// Execute one instruction-fetch-execute cycle.
// Returns the number of clock cycles consumed.
export function cpuRun(): number {
  setCycles(0);

  if (CpuSleep) {
    setCycles(6);
  } else {
    // Check for pending interrupt of higher priority than currently serviced
    if ((ib & 0x1F & ~iserv) > iserv) {
      // Push return address (PC) onto SS stack (big-endian: hi byte first)
      const newSs1 = (ss - 1) & 0xFFFF;
      setSs(newSs1);
      dstWrite(addr18(ua >> 2, newSs1), (pc >> 8) & 0xFF);
      const newSs2 = (newSs1 - 1) & 0xFFFF;
      setSs(newSs2);
      dstWrite(addr18(ua >> 2, newSs2), pc & 0xFF);

      // Find highest-priority pending interrupt
      for (let i = 0; i < INTVECTORS; i++) {
        const mask = intmask[i] ?? 0;
        if ((ib & mask) !== 0) {
          setIserv(iserv | mask);
          setPc(intvec[i] ?? 0);
          setOpindex(0); // prevents subsequent PC alignment
          break;
        }
      }
      setCycles(11);
      if ((ua & 3) !== 0) setCycles(cycles + 1);
    } else {
      // Execute an instruction
      firePcMonitor(pc);
      if (isTraceEnabled()) traceInstr(pc);
      setProcindex(0);
      execInstr();
      // Complete any deferred I/O device writes
      let i = 0;
      while (i < procindex) {
        const fn = procptr[i];
        if (fn) fn();
        i++;
      }
    }
  }

  // Apply speed divisor when not in interrupt service
  if (iserv === 0) setCycles(cycles << speed);

  traceAddCycles(cycles); // keep TraceCycles synchronised
  return cycles;
}
