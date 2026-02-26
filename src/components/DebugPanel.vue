<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  pc, ss, us, ix, iy, iz, ua, ia, ie, ib, sx, sy, sz, tm, flag, mr, memdef,
  Z_bit, C_bit, LZ_bit, UZ_bit,
  setFlag,
  CpuStop,
  setCpuStop, setCpuSteps, setBreakPoint,
} from '../emulator/def.js';
import { setBreakCallback } from '../emulator/emulator.js';
import { disLines } from '../emulator/disassemble.js';

// ─── safe memory reader (no I/O side-effects) ────────────────────────────────
function readMemByte(addr: number): number {
  addr = addr & 0xFFFF;
  for (const m of memdef) {
    if (!m.data || addr < m.first || addr >= m.last) continue;
    const idx = (m.offset + (addr - m.first)) << m.memorg;
    return m.data[idx] ?? 0xFF;
  }
  return 0xFF;
}

// ─── reactive state (refreshed by poll + breakCallback) ──────────────────────
const cpuPc   = ref(0);
const cpuSs   = ref(0);
const cpuUs   = ref(0);
const cpuIx   = ref(0);
const cpuIy   = ref(0);
const cpuIz   = ref(0);
const cpuUa   = ref(0);
const cpuIa   = ref(0);
const cpuIe   = ref(0);
const cpuIb   = ref(0);
const cpuSx   = ref(0);
const cpuSy   = ref(0);
const cpuSz   = ref(0);
const cpuTm   = ref(0);
const cpuFlag = ref(0);
const cpuMr   = ref<number[]>(Array(36).fill(0));

const isStopped = ref(true);

// Disassembly
interface DisRow { addr: number; mnem: string; args: string; bytes: string; isPC: boolean }
const disRows = ref<DisRow[]>([]);
const DIS_COUNT = 22;

// Hex editor
const hexAddr  = ref(0x10000); // default: start of RAM
const hexInput = ref('10000');
const HEX_ROWS = 8;
const HEX_COLS = 8;
const hexRows  = ref<{ addr: number; bytes: number[]; }[]>([]);

// Trace / breakpoint inputs
const traceN    = ref(100);
const bpInput   = ref('');
const bpActive  = ref(false);
const bpAddr    = ref(-1);  // reactive mirror of BreakPoint for template

function refresh(): void {
  cpuPc.value   = pc;
  cpuSs.value   = ss;
  cpuUs.value   = us;
  cpuIx.value   = ix;
  cpuIy.value   = iy;
  cpuIz.value   = iz;
  cpuUa.value   = ua;
  cpuIa.value   = ia;
  cpuIe.value   = ie;
  cpuIb.value   = ib;
  cpuSx.value   = sx;
  cpuSy.value   = sy;
  cpuSz.value   = sz;
  cpuTm.value   = tm;
  cpuFlag.value = flag;
  cpuMr.value   = Array.from(mr.subarray(0, 36));
  isStopped.value = CpuStop;
  refreshDis();
  refreshHex();
}

function refreshDis(): void {
  const rows: DisRow[] = [];
  // Walk forward from (pc - DIS_COUNT/2 instructions) to gather DIS_COUNT lines
  // Simple approach: start a few bytes before pc, collect DIS_COUNT lines
  const start = findDisStart(pc, Math.floor(DIS_COUNT / 2));
  const lines = disLines(start, DIS_COUNT + 4);
  let found = false;
  for (const l of lines) {
    if (rows.length >= DIS_COUNT) break;
    rows.push({ addr: l.addr, mnem: l.mnem, args: l.args, bytes: l.bytes, isPC: l.addr === pc });
    if (l.addr === pc) found = true;
  }
  // If pc not in window, reset to pc
  if (!found) {
    const lines2 = disLines(pc, DIS_COUNT);
    rows.splice(0);
    for (const l of lines2) {
      rows.push({ addr: l.addr, mnem: l.mnem, args: l.args, bytes: l.bytes, isPC: l.addr === pc });
    }
  }
  disRows.value = rows;
}

/** Find a start address that arrives at `target` after roughly `n` instructions. */
function findDisStart(target: number, n: number): number {
  const scan = (target - n * 4 + 0x10000) & 0xFFFF;
  const lines = disLines(scan, n * 2 + 8);
  // Find latest line whose addr < target
  let best = target;
  let count = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i]!.addr < target) { best = lines[i]!.addr; count++; if (count >= n) break; }
  }
  // Walk back n lines
  let idx = lines.findIndex(l => l.addr === best);
  if (idx < 0) return target;
  idx = Math.max(0, idx - n + 1);
  return lines[idx]!.addr;
}

function refreshHex(): void {
  const base = hexAddr.value & ~(HEX_COLS - 1); // align to HEX_COLS
  const rows: { addr: number; bytes: number[] }[] = [];
  for (let r = 0; r < HEX_ROWS; r++) {
    const rowAddr = (base + r * HEX_COLS) & 0xFFFF;
    const bytes: number[] = [];
    for (let c = 0; c < HEX_COLS; c++) {
      bytes.push(readMemByte((rowAddr + c) & 0xFFFF));
    }
    rows.push({ addr: rowAddr, bytes });
  }
  hexRows.value = rows;
}

// ─── formatting helpers ───────────────────────────────────────────────────────
function h2(n: number): string  { return (n & 0xFF).toString(16).toUpperCase().padStart(2, '0'); }
function h4(n: number): string  { return (n & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'); }
function h5(n: number): string  { return (n & 0xFFFFF).toString(16).toUpperCase().padStart(5, '0'); }

// ─── flags ────────────────────────────────────────────────────────────────────
const flagZ  = computed(() => (cpuFlag.value & Z_bit)  !== 0);
const flagC  = computed(() => (cpuFlag.value & C_bit)  !== 0);
const flagLZ = computed(() => (cpuFlag.value & LZ_bit) !== 0);
const flagUZ = computed(() => (cpuFlag.value & UZ_bit) !== 0);

function toggleFlag(bit: number): void {
  setFlag(flag ^ bit);
  refresh();
}

// ─── step / trace / run / pause ───────────────────────────────────────────────
function step(): void {
  setCpuSteps(1);
  setCpuStop(false);
  isStopped.value = false;
}

function trace(): void {
  const n = Math.max(1, traceN.value | 0);
  setCpuSteps(n);
  setCpuStop(false);
  isStopped.value = false;
}

function runCpu(): void {
  setCpuSteps(-1);
  // BreakPoint stays as-is (already set by setBreakPoint if active)
  setCpuStop(false);
  isStopped.value = false;
}

function pauseCpu(): void {
  setCpuStop(true);
  setCpuSteps(0);
  isStopped.value = true;
  refresh();
}

function setBP(): void {
  const v = parseInt(bpInput.value.replace(/^0x/i, ''), 16);
  if (isNaN(v)) return;
  setBreakPoint(v & 0xFFFF);
  bpAddr.value = v & 0xFFFF;
  bpActive.value = true;
}

function clearBP(): void {
  setBreakPoint(-1);
  bpAddr.value = -1;
  bpActive.value = false;
  bpInput.value = '';
}

// Click on a disassembly row: set breakpoint there
function clickDisRow(addr: number): void {
  bpInput.value = h4(addr);
  setBreakPoint(addr);
  bpAddr.value = addr;
  bpActive.value = true;
}

// ─── hex editor navigation ────────────────────────────────────────────────────
function setHexAddr(): void {
  const v = parseInt(hexInput.value.replace(/^0x/i, ''), 16);
  if (!isNaN(v)) {
    hexAddr.value = v & 0xFFFF;
    refreshHex();
  }
}

function hexScrollUp(): void {
  hexAddr.value = (hexAddr.value - HEX_COLS * 4 + 0x10000) & 0xFFFF;
  hexInput.value = h5(hexAddr.value);
  refreshHex();
}

function hexScrollDown(): void {
  hexAddr.value = (hexAddr.value + HEX_COLS * 4) & 0xFFFF;
  hexInput.value = h5(hexAddr.value);
  refreshHex();
}

// ─── poll loop ────────────────────────────────────────────────────────────────
let pollId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  // Refresh when CPU stops (step / trace / breakpoint hit)
  setBreakCallback(() => {
    isStopped.value = true;
    refresh();
  });
  // Slow poll to keep registers live when running
  pollId = setInterval(() => { if (!CpuStop) refresh(); else isStopped.value = true; }, 500);
  refresh();
});

onUnmounted(() => {
  if (pollId !== null) clearInterval(pollId);
  setBreakCallback(() => {});
});
</script>

<template>
  <div class="dbg-panel">

    <!-- ── toolbar ── -->
    <div class="dbg-toolbar">
      <button class="dbg-btn" :disabled="!isStopped" @click="step" title="Execute one instruction">Step</button>

      <button class="dbg-btn" :disabled="!isStopped" @click="trace" title="Execute N instructions">Trace</button>
      <input class="dbg-num" type="number" v-model.number="traceN" min="1" max="100000" />

      <button class="dbg-btn" :class="{ active: !isStopped }" @click="isStopped ? runCpu() : pauseCpu()">
        {{ isStopped ? 'Run' : '❙❙ Pause' }}
      </button>

      <span class="dbg-sep" />

      <span class="dbg-label">BP:</span>
      <input
        class="dbg-addr"
        placeholder="addr"
        v-model="bpInput"
        @keydown.enter="setBP"
        :class="{ 'bp-active': bpActive }"
      />
      <button class="dbg-btn" @click="setBP" :disabled="!bpInput">Set BP</button>
      <button class="dbg-btn" @click="clearBP" :disabled="!bpActive">Clear BP</button>

      <span class="dbg-spacer" />
      <span class="dbg-status" :class="isStopped ? 'stopped' : 'running'">
        {{ isStopped ? 'STOP' : 'RUN' }}
      </span>
    </div>

    <!-- ── main area ── -->
    <div class="dbg-main">

      <!-- Left: disassembly -->
      <div class="dbg-dis">
        <div class="dbg-section-title">Disassembly</div>
        <div class="dis-list">
          <div
            v-for="row in disRows"
            :key="row.addr"
            class="dis-row"
            :class="{ 'dis-pc': row.isPC, 'dis-bp': bpAddr === row.addr }"
            @click="clickDisRow(row.addr)"
          >
            <span class="dis-addr">{{ h4(row.addr) }}</span>
            <span class="dis-bytes">{{ row.bytes.padEnd(11, ' ') }}</span>
            <span class="dis-mnem">{{ row.mnem.padEnd(7, ' ') }}</span>
            <span class="dis-args">{{ row.args }}</span>
          </div>
        </div>
      </div>

      <!-- Right: registers + memory -->
      <div class="dbg-right">

        <!-- CPU registers -->
        <div class="dbg-section-title">CPU Registers</div>
        <div class="reg-grid">
          <div class="reg-cell"><span class="reg-name">PC</span><span class="reg-val">{{ h4(cpuPc) }}</span></div>
          <div class="reg-cell"><span class="reg-name">SS</span><span class="reg-val">{{ h4(cpuSs) }}</span></div>
          <div class="reg-cell"><span class="reg-name">US</span><span class="reg-val">{{ h4(cpuUs) }}</span></div>
          <div class="reg-cell"><span class="reg-name">IX</span><span class="reg-val">{{ h4(cpuIx) }}</span></div>
          <div class="reg-cell"><span class="reg-name">IY</span><span class="reg-val">{{ h4(cpuIy) }}</span></div>
          <div class="reg-cell"><span class="reg-name">IZ</span><span class="reg-val">{{ h4(cpuIz) }}</span></div>
          <div class="reg-cell"><span class="reg-name">UA</span><span class="reg-val">{{ h2(cpuUa) }}</span></div>
          <div class="reg-cell"><span class="reg-name">IA</span><span class="reg-val">{{ h2(cpuIa) }}</span></div>
          <div class="reg-cell"><span class="reg-name">IE</span><span class="reg-val">{{ h2(cpuIe) }}</span></div>
          <div class="reg-cell"><span class="reg-name">IB</span><span class="reg-val">{{ h2(cpuIb) }}</span></div>
          <div class="reg-cell"><span class="reg-name">SX</span><span class="reg-val">{{ h2(cpuSx) }}</span></div>
          <div class="reg-cell"><span class="reg-name">SY</span><span class="reg-val">{{ h2(cpuSy) }}</span></div>
          <div class="reg-cell"><span class="reg-name">SZ</span><span class="reg-val">{{ h2(cpuSz) }}</span></div>
          <div class="reg-cell"><span class="reg-name">TM</span><span class="reg-val">{{ h2(cpuTm) }}</span></div>
          <div class="reg-cell"><span class="reg-name">FL</span><span class="reg-val">{{ h2(cpuFlag) }}</span></div>
        </div>

        <!-- Flags -->
        <div class="flag-row">
          <button class="flag-btn" :class="{ set: flagZ  }" @click="toggleFlag(Z_bit)"  title="Toggle Z flag (bit7)">{{ flagZ  ? 'Z'  : 'NZ'  }}</button>
          <button class="flag-btn" :class="{ set: flagC  }" @click="toggleFlag(C_bit)"  title="Toggle C flag (bit6)">{{ flagC  ? 'C'  : 'NC'  }}</button>
          <button class="flag-btn" :class="{ set: flagLZ }" @click="toggleFlag(LZ_bit)" title="Toggle LZ flag (bit5)">{{ flagLZ ? 'LZ' : 'NLZ' }}</button>
          <button class="flag-btn" :class="{ set: flagUZ }" @click="toggleFlag(UZ_bit)" title="Toggle UZ flag (bit4)">{{ flagUZ ? 'UZ' : 'NUZ' }}</button>
        </div>

        <!-- Main registers mr[0..31] -->
        <div class="dbg-section-title" style="margin-top:6px">Main Regs (mr[0..31])</div>
        <div class="mr-row">
          <span v-for="i in 16" :key="i - 1" class="mr-byte">{{ h2(cpuMr[i - 1] ?? 0) }}</span>
        </div>
        <div class="mr-row">
          <span v-for="i in 16" :key="i + 15" class="mr-byte">{{ h2(cpuMr[i + 15] ?? 0) }}</span>
        </div>

        <!-- Hex memory editor -->
        <div class="dbg-section-title" style="margin-top:6px">Memory</div>
        <div class="hex-nav">
          <input
            class="dbg-addr hex-addr-input"
            v-model="hexInput"
            @keydown.enter="setHexAddr"
            placeholder="addr"
          />
          <button class="dbg-btn btn-xs" @click="setHexAddr">Go</button>
          <button class="dbg-btn btn-xs" @click="hexScrollUp">▲</button>
          <button class="dbg-btn btn-xs" @click="hexScrollDown">▼</button>
        </div>
        <div class="hex-editor">
          <div v-for="row in hexRows" :key="row.addr" class="hex-row">
            <span class="hex-row-addr">{{ h5(row.addr) }}</span>
            <span v-for="(b, ci) in row.bytes" :key="ci" class="hex-byte">{{ h2(b) }}</span>
            <span class="hex-ascii">
              <span v-for="(b, ci) in row.bytes" :key="ci">{{ b >= 0x20 && b < 0x7F ? String.fromCharCode(b) : '.' }}</span>
            </span>
          </div>
        </div>

      </div><!-- .dbg-right -->

    </div><!-- .dbg-main -->

  </div><!-- .dbg-panel -->
</template>

<style scoped>
.dbg-panel {
  width: 709px;
  background: #0d0d0d;
  border-top: 1px solid #333;
  font-family: monospace;
  font-size: 0.72rem;
  color: #bbb;
  box-sizing: border-box;
  padding-bottom: 24px;
}

/* ── toolbar ── */
.dbg-toolbar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-bottom: 1px solid #222;
  flex-wrap: wrap;
}

.dbg-btn {
  padding: 2px 7px;
  font-family: monospace;
  font-size: 0.72rem;
  background: #1e1e1e;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}
.dbg-btn:hover:not(:disabled) { background: #2e2e2e; color: #fff; }
.dbg-btn:disabled { opacity: 0.35; cursor: default; }
.dbg-btn.active { background: #1a3a1a; color: #7fc97f; border-color: #2a5a2a; }
.btn-xs { padding: 1px 5px; }

.dbg-num {
  width: 52px;
  padding: 1px 4px;
  font-family: monospace;
  font-size: 0.72rem;
  background: #111;
  color: #bbb;
  border: 1px solid #333;
  border-radius: 3px;
}

.dbg-addr {
  width: 58px;
  padding: 1px 4px;
  font-family: monospace;
  font-size: 0.72rem;
  background: #111;
  color: #bbb;
  border: 1px solid #333;
  border-radius: 3px;
}
.dbg-addr.bp-active { border-color: #c04040; color: #f99; }

.dbg-label { color: #555; font-size: 0.7rem; }
.dbg-sep   { width: 1px; height: 14px; background: #333; margin: 0 2px; }
.dbg-spacer { flex: 1; }

.dbg-status {
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 0.05em;
  padding: 1px 4px;
  border-radius: 2px;
}
.dbg-status.stopped { color: #f0a030; background: #2a1800; }
.dbg-status.running { color: #7fc97f; background: #0a1a0a; }

/* ── main layout ── */
.dbg-main {
  display: flex;
  gap: 0;
  height: 280px;
}

/* ── disassembly ── */
.dbg-dis {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #222;
  overflow: hidden;
}

.dbg-section-title {
  color: #555;
  font-size: 0.68rem;
  padding: 2px 6px 1px;
  border-bottom: 1px solid #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.dis-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.dis-row {
  display: flex;
  gap: 4px;
  padding: 0 6px;
  line-height: 1.5;
  cursor: pointer;
  white-space: nowrap;
}
.dis-row:hover { background: #1a1a1a; }
.dis-pc  { background: #1a2a0a !important; color: #a0e070; }
.dis-bp  { background: #2a0a0a !important; color: #f07070; }
.dis-pc.dis-bp { background: #2a2a0a !important; color: #e0c050; }

.dis-addr { color: #777; width: 28px; flex-shrink: 0; }
.dis-bytes { color: #4a6a4a; width: 80px; flex-shrink: 0; overflow: hidden; }
.dis-mnem  { color: #9ecbff; width: 50px; flex-shrink: 0; }
.dis-args  { color: #ccc; overflow: hidden; }

/* ── right panel ── */
.dbg-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 4px;
}

/* ── registers ── */
.reg-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px 4px;
  padding: 3px 6px;
}
.reg-cell {
  display: flex;
  gap: 3px;
  align-items: baseline;
}
.reg-name { color: #556; font-size: 0.68rem; }
.reg-val  { color: #9ecbff; }

/* ── flags ── */
.flag-row {
  display: flex;
  gap: 4px;
  padding: 2px 6px 3px;
}
.flag-btn {
  padding: 1px 6px;
  font-family: monospace;
  font-size: 0.68rem;
  background: #111;
  color: #666;
  border: 1px solid #333;
  border-radius: 2px;
  cursor: pointer;
  min-width: 30px;
}
.flag-btn.set   { color: #f0a030; border-color: #555; background: #1c1600; }
.flag-btn:hover { background: #1e1e1e; }

/* ── main registers ── */
.mr-row {
  display: flex;
  gap: 0;
  padding: 1px 6px;
}
.mr-byte {
  width: 20px;
  text-align: center;
  color: #88a0cc;
  font-size: 0.7rem;
}

/* ── hex editor ── */
.hex-nav {
  display: flex;
  gap: 3px;
  padding: 2px 6px;
  align-items: center;
}
.hex-addr-input { width: 58px; }

.hex-editor {
  flex: 1;
  overflow-y: auto;
  padding: 0 6px 2px;
}
.hex-row {
  display: flex;
  gap: 0;
  line-height: 1.5;
  white-space: nowrap;
}
.hex-row-addr {
  color: #556;
  width: 44px;
  flex-shrink: 0;
  margin-right: 4px;
}
.hex-byte {
  width: 22px;
  text-align: center;
  color: #88a0cc;
}
.hex-ascii {
  margin-left: 4px;
  color: #5a7a5a;
  letter-spacing: 0.02em;
}
</style>
