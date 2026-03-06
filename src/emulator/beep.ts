// BEEP command emulation via Web Audio API
//
// The ROM produces tones by bit-banging PD port bit 6 in a tight loop.
// We intercept the two entry points and play a Web Audio oscillator instead,
// then skip the ROM loop so emulated CPU time isn't wasted on silent toggling.
//
// ROM entry points:
//   0x33B3 — low tone (BEEP 0 / BEEP with no argument)
//   0x33BA — high tone (BEEP 1 / control code 0x07)
// ROM routine returns via rtn at 0x33E7.

import { setPc, ss, setSs, ua, addr18, srcRead, setOpindex } from './def.js';

const BEEP_LOW_ADDR  = 0x33B3;
const BEEP_HIGH_ADDR = 0x33BA;

const LOW_FREQ  = 1000;   // Hz  (BEEP 1)
const HIGH_FREQ = 4500;  // Hz  (BEEP 0 / BEEP with no argument)
const LOW_DURATION  = 0.1; // seconds
const HIGH_DURATION = 0.1; // seconds

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx;
  try {
    audioCtx = new AudioContext();
  } catch {
    // Web Audio not available (e.g. headless test environment)
  }
  return audioCtx;
}

function playTone(freq: number, duration: number): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Resume if suspended (browsers require user gesture before audio)
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square'; // closest to the 1-bit PD toggle
  osc.frequency.value = freq;
  gain.gain.value = 0.15; // keep it gentle
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  // Ramp down slightly to avoid click at end
  gain.gain.setValueAtTime(0.15, ctx.currentTime + duration - 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);
}

// Called from the CPU loop before each instruction.
// Returns true if PC matched a beep entry point (caller should skip execInstr).
export function checkBeep(currentPc: number): boolean {
  if (currentPc === BEEP_LOW_ADDR) {
    playTone(HIGH_FREQ, HIGH_DURATION);
    skipToRtn();
    return true;
  }
  if (currentPc === BEEP_HIGH_ADDR) {
    playTone(LOW_FREQ, LOW_DURATION);
    skipToRtn();
    return true;
  }
  return false;
}

// Skip the ROM beep loop by simulating rtn:
// pop the 2-byte return address from the SS stack and set PC.
// Mirrors rtn_Fx in exec.ts: lo = pop, hi = pop, pc = (lo | hi<<8) + 1.
function skipToRtn(): void {
  const seg = ua >> 2;
  const sp0 = ss;
  const lo = srcRead(addr18(seg, sp0));
  const sp1 = (sp0 + 1) & 0xFFFF;
  const hi = srcRead(addr18(seg, sp1));
  setSs((sp1 + 1) & 0xFFFF);
  setPc(((lo | (hi << 8)) + 1) & 0xFFFF);
  setOpindex(0);
}
