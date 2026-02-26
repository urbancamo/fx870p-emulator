<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  loadFileBytes, stopTransfer, clearOutput,
  isSending, isSuspended, isReceiving, getBytesSent, getBytesReceived, getOutput,
  getStream, clearStream, setOnReceiveComplete,
} from '../emulator/comm.js';
import { getUartRegs, pd, pe, pdi } from '../emulator/port.js';
import { importRamState, exportRamState, emulatorReset, emulatorStart, readRamByte } from '../emulator/emulator.js';
import AboutPopup from './AboutPopup.vue';

const showAbout = ref(false);

const props = defineProps<{
  showDebug: boolean;
  panelLayout: string;
}>();

const emit = defineEmits<{
  (e: 'update:showDebug', v: boolean): void;
  (e: 'cycleLayout'): void;
}>();

// ─── state ────────────────────────────────────────────────────────────────────
const status       = ref('Idle');
const fileName     = ref('');
const totalBytes   = ref(0);
const bytesSentRef = ref(0);
const sending      = ref(false);
const suspended    = ref(false);
const receiving    = ref(false);
const bytesRecvRef = ref(0);
const outputLines  = ref<string[]>([]);

// Bidirectional stream display
interface StreamSpan { dir: 'tx' | 'rx'; text: string; }
const streamSpans = ref<StreamSpan[]>([]);
let _lastStreamLen = 0;

// UART diagnostics (polled)
const uartRd   = ref<number[]>(Array(8).fill(0xFF));
const uartWr2  = ref(0);
const uartWr3  = ref(0);
const portPdi  = ref(0);
const portPe   = ref(0);
const portPd   = ref(0);

const showDiag  = ref(false);

// Device table diagnostic (first byte at 0x11100: bit4=COM0 present)
const devTable  = ref<number[]>([]);

// ─── computed ─────────────────────────────────────────────────────────────────
const progress = computed(() =>
  totalBytes.value > 0 ? Math.round((bytesSentRef.value / totalBytes.value) * 100) : 0,
);

const statusClass = computed(() => {
  if (sending.value) return suspended.value ? 'suspended' : 'sending';
  if (receiving.value) return 'receiving';
  return 'idle';
});

// Decode UART mode from ga_rd[5] bit2: 0=RS-232C, 1=MT
const uartMode = computed(() =>
  (uartRd.value[5] & 0x04) ? 'MT' : 'RS-232C',
);

// Decode baud from ga_rd[4] bits[2:0] (or MT table)
const baudTable = [9600, 4800, 2400, 1200, 600, 300, 150, 75];
const uartBaud = computed(() => baudTable[uartRd.value[4] & 7] ?? '?');

// ga_rd[3] status bits
const uartStatus = computed(() => {
  const s = uartRd.value[3];
  const parts: string[] = [];
  if (s & 0x01) parts.push('TxRdy');
  if (s & 0x02) parts.push('RxFull');
  if (s & 0x04) parts.push('FrameErr');
  if (s & 0x08) parts.push('ParityErr');
  if (s & 0x10) parts.push('Overrun');
  return parts.length ? parts.join(' | ') : 'OK';
});

// ─── file input ───────────────────────────────────────────────────────────────
const fileInput = ref<HTMLInputElement | null>(null);

function openSendPicker(): void {
  fileInput.value?.click();
}

async function onFileSelected(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  input.value = '';

  const raw = new Uint8Array(await file.arrayBuffer());
  totalBytes.value   = raw.length;
  bytesSentRef.value = 0;
  fileName.value     = file.name;
  status.value       = `Sending: ${file.name}`;
  clearOutput();
  outputLines.value  = [];
  loadFileBytes(raw);
}

function onStop(): void {
  stopTransfer();
  status.value = 'Idle';
  fileName.value = '';
}

// ─── output buffer rendering ──────────────────────────────────────────────────
let _lastOutputLen = 0;
const outputEl = ref<HTMLElement | null>(null);

function formatByte(b: number): string {
  if (b === 0x0D) return '\\r';
  if (b === 0x0A) return '\\n';
  if (b === 0x1A) return '[EOF]';
  if (b === 0x11) return '[XON]';
  if (b === 0x13) return '[XOFF]';
  if (b >= 0x20 && b < 0x7F) return String.fromCharCode(b);
  return `[${b.toString(16).padStart(2, '0').toUpperCase()}]`;
}

function flushOutput(): void {
  // Legacy line-based output (kept for getOutput/save)
  const buf = getOutput();
  if (buf.length !== _lastOutputLen) {
    const newBytes = buf.slice(_lastOutputLen);
    _lastOutputLen = buf.length;
    let chunk = '';
    for (const b of newBytes) {
      if (b === 0x0D) {
        if (chunk) outputLines.value.push(chunk);
        chunk = '';
      } else if (b === 0x0A) {
        // ignore
      } else if (b >= 0x20 && b < 0x7F) {
        chunk += String.fromCharCode(b);
      } else {
        chunk += `[${b.toString(16).padStart(2, '0').toUpperCase()}]`;
      }
    }
    if (chunk) outputLines.value.push(chunk);
    if (outputLines.value.length > 200) outputLines.value.splice(0, outputLines.value.length - 200);
  }

  // Bidirectional stream
  const stream = getStream();
  if (stream.length !== _lastStreamLen) {
    const newEntries = stream.slice(_lastStreamLen);
    _lastStreamLen = stream.length;
    for (const entry of newEntries) {
      const text = formatByte(entry.byte);
      const last = streamSpans.value.length > 0 ? streamSpans.value[streamSpans.value.length - 1] : null;
      if (last && last.dir === entry.dir) {
        last.text += text;
      } else {
        streamSpans.value.push({ dir: entry.dir, text });
      }
    }
    // Trim old spans if too many
    if (streamSpans.value.length > 500) streamSpans.value.splice(0, streamSpans.value.length - 500);
    if (outputEl.value) outputEl.value.scrollTop = outputEl.value.scrollHeight;
  }
}

// ─── poll loop ────────────────────────────────────────────────────────────────
let pollId: ReturnType<typeof setInterval> | null = null;

function poll(): void {
  const s = isSending();
  sending.value    = s;
  suspended.value  = isSuspended();
  bytesSentRef.value = getBytesSent();

  const r = isReceiving();
  receiving.value   = r;
  bytesRecvRef.value = getBytesReceived();

  if (r) {
    status.value = `Receiving: ${bytesRecvRef.value} bytes`;
  } else if (!s && status.value.startsWith('Sending')) {
    status.value = 'Idle';
    fileName.value = '';
  } else if (!s && status.value.startsWith('Receiving')) {
    status.value = 'Idle';
  }

  // UART regs
  const snap = getUartRegs();
  uartRd.value  = snap.rd;
  uartWr2.value = snap.wr2;
  uartWr3.value = snap.wr3;

  // Port D
  // (import the live values directly)
  portPdi.value = pdi;
  portPe.value  = pe;
  portPd.value  = pd;

  // Device table — read 8 bytes starting at 0x11100
  devTable.value = Array.from({ length: 8 }, (_, i) => readRamByte(0x11100 + i));

  flushOutput();
}

// ─── receive-complete (SAVE from calculator) ─────────────────────────────────
const showSaveDialog = ref(false);
const saveFileName   = ref('program.bas');
let   pendingSaveData: Uint8Array | null = null;

function onReceiveComplete(data: Uint8Array): void {
  pendingSaveData = data;
  showSaveDialog.value = true;
}

function confirmSave(): void {
  if (!pendingSaveData) return;
  const blob = new Blob([pendingSaveData.buffer as ArrayBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = saveFileName.value || 'program.bas';
  a.click();
  URL.revokeObjectURL(url);
  showSaveDialog.value = false;
  pendingSaveData = null;
}

function cancelSave(): void {
  showSaveDialog.value = false;
  pendingSaveData = null;
}

onMounted(() => {
  pollId = setInterval(poll, 250);
  setOnReceiveComplete(onReceiveComplete);
});
onUnmounted(() => {
  if (pollId !== null) clearInterval(pollId);
  setOnReceiveComplete(null);
});

// ─── RAM state import ─────────────────────────────────────────────────────────
const ramInput = ref<HTMLInputElement | null>(null);

function openRamPicker(): void {
  ramInput.value?.click();
}

async function onRamSelected(e: Event): Promise<void> {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  input.value = '';
  const data = new Uint8Array(await file.arrayBuffer());
  await importRamState(data);
  // Reset CPU so the ROM warm-starts with the imported device table
  emulatorReset();
  emulatorStart();
}

function downloadRam(): void {
  const data = exportRamState();
  const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ram0.bin';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── output save / clear ──────────────────────────────────────────────────────
function clearLog(): void {
  clearOutput();
  clearStream();
  outputLines.value  = [];
  streamSpans.value  = [];
  _lastOutputLen     = 0;
  _lastStreamLen     = 0;
}

function saveOutput(): void {
  const bytes = new Uint8Array(getOutput());
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'calc-output.bin';
  a.click();
  URL.revokeObjectURL(url);
}

function h(n: number): string { return n.toString(16).padStart(2, '0').toUpperCase(); }
</script>

<template>
  <div class="comm-panel">
    <!-- ── toolbar ── -->
    <div class="toolbar">
      <button class="btn" :disabled="sending" @click="openSendPicker">LOAD</button>
      <button class="btn" :disabled="!sending" @click="onStop">STOP</button>

      <div class="progress-wrap">
        <div
          class="progress-bar"
          :class="{ active: sending, suspended: suspended, receiving: receiving }"
          :style="{ width: receiving ? '100%' : progress + '%' }"
        />
      </div>

      <span class="comm-status" :class="statusClass">{{ status }}</span>

      <span class="ram-group">
        <span class="ram-label">RAM</span>
        <button class="btn btn-ram" @click="openRamPicker" title="Import RAM snapshot">&#x2191;</button>
        <button class="btn btn-ram" @click="downloadRam" title="Download RAM snapshot">&#x2193;</button>
      </span>
      <button class="btn btn-diag" @click="showDiag = !showDiag">
        COMMS {{ showDiag ? '\u25B4' : '\u25BE' }}
      </button>
      <button class="btn" @click="emit('update:showDebug', !props.showDebug)">
        DEBUG {{ props.showDebug ? '\u25B4' : '\u25BE' }}
      </button>
      <button class="btn" @click="showAbout = true">ABOUT</button>
      <button class="btn" @click="emit('cycleLayout')" title="Cycle panel layout">{{ props.panelLayout === 'bottom' ? '\u2192' : props.panelLayout === 'right' ? '\u2190' : '\u2193' }}</button>
    </div>

    <!-- ── hint ── -->
    <div class="hint-row">
      then on calc: <code>LOAD "COM0:6,N,8,1,N,N,N,N,N"</code>
    </div>

    <!-- ── diagnostics ── -->
    <div v-if="showDiag" class="diag">
      <div class="diag-row">
        <span class="diag-label">Port D</span>
        <span class="diag-val">
          pdi=<code>{{ h(portPdi) }}</code>
          pe=<code>{{ h(portPe) }}</code>
          pd=<code>{{ h(portPd) }}</code>
        </span>
      </div>
      <div class="diag-row">
        <span class="diag-label">UART regs</span>
        <span class="diag-val">
          rd=[<code>{{ uartRd.map(h).join(' ') }}</code>]
          wr2=<code>{{ h(uartWr2) }}</code>
          wr3=<code>{{ h(uartWr3) }}</code>
        </span>
      </div>
      <div class="diag-row">
        <span class="diag-label">UART state</span>
        <span class="diag-val">
          mode=<code>{{ uartMode }}</code>
          baud=<code>{{ uartBaud }}</code>
          status=<code>{{ uartStatus }}</code>
          suspend=<code>{{ suspended }}</code>
          sent=<code>{{ bytesSentRef }}</code>
        </span>
      </div>

      <div class="diag-row">
        <span class="diag-label">DevTable</span>
        <span class="diag-val">
          0x11100: [<code>{{ devTable.map(h).join(' ') }}</code>]
          <span v-if="devTable[0] !== undefined">
            COM0={{ (devTable[0] & 0x10) ? 'YES' : 'NO' }}
          </span>
        </span>
      </div>

      <!-- bidirectional serial stream -->
      <div class="output-header">
        <span>serial stream ({{ getStream().length }} bytes)</span>
        <span class="stream-legend"><span class="legend-tx">■</span> sent <span class="legend-rx">■</span> received</span>
        <button class="btn btn-sm" @click="saveOutput">SAVE</button>
        <button class="btn btn-sm" @click="clearLog">CLEAR</button>
      </div>
      <div ref="outputEl" class="output-log">
        <span
          v-for="(span, i) in streamSpans"
          :key="i"
          :class="span.dir === 'tx' ? 'stream-tx' : 'stream-rx'"
        >{{ span.text }}</span>
        <span v-if="streamSpans.length === 0" class="output-empty">(no data yet)</span>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".bas,.fx,.txt,.prg"
      style="display: none"
      @change="onFileSelected"
    />
    <input
      ref="ramInput"
      type="file"
      accept=".bin"
      style="display: none"
      @change="onRamSelected"
    />
    <Teleport to="body">
      <AboutPopup v-if="showAbout" @close="showAbout = false" />

      <!-- Save dialog (triggered when calculator finishes a SAVE) -->
      <div v-if="showSaveDialog" class="save-backdrop" @click.self="cancelSave">
        <div class="save-dialog">
          <div class="save-title">Save received program</div>
          <div class="save-body">
            <label class="save-label">
              Filename:
              <input
                v-model="saveFileName"
                class="save-input"
                type="text"
                @keydown.enter="confirmSave"
                @keydown.escape="cancelSave"
              />
            </label>
          </div>
          <div class="save-footer">
            <button class="save-btn" @click="confirmSave">Save</button>
            <button class="save-btn save-btn-cancel" @click="cancelSave">Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.comm-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #111;
  border-top: 1px solid #333;
  width: 709px;
  box-sizing: border-box;
  font-family: monospace;
  font-size: 0.75rem;
}

/* ── toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
}

.btn {
  padding: 2px 8px;
  font-family: monospace;
  font-size: 0.75rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
}
.btn:hover:not(:disabled) { background: #3a3a3a; color: #fff; }
.btn:disabled { opacity: 0.4; cursor: default; }
.ram-group { display: flex; align-items: center; gap: 3px; margin-left: auto; }
.ram-label { color: #555; font-size: 0.7rem; }
.btn-ram  { color: #7eb8f7; border-color: #204050; padding: 2px 6px; }
.btn-ram:hover  { background: #102030; color: #aad4ff; }
.btn-sm { padding: 1px 5px; font-size: 0.7rem; }

.progress-wrap {
  flex: 1;
  height: 8px;
  background: #222;
  border: 1px solid #333;
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  width: 0;
  background: #555;
  transition: width 0.25s;
}
.progress-bar.active    { background: #8bc34a; }
.progress-bar.suspended { background: #f0a030; }
.progress-bar.receiving {
  background: repeating-linear-gradient(
    -45deg,
    #f0a030 0px, #f0a030 6px,
    #c07820 6px, #c07820 12px
  );
  background-size: 17px 100%;
  animation: barber-pole 0.6s linear infinite;
}
@keyframes barber-pole {
  from { background-position: 0 0; }
  to   { background-position: 17px 0; }
}

.comm-status {
  font-size: 0.72rem;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
}
.comm-status.sending   { color: #8bc34a; }
.comm-status.suspended { color: #f0a030; }
.comm-status.receiving { color: #f0a030; }
.comm-status.idle      { color: #555; }

/* ── hint ── */
.hint-row {
  padding: 2px 10px 4px;
  color: #444;
  font-size: 0.7rem;
}
.hint-row code { color: #666; }

/* ── diagnostics ── */
.diag {
  border-top: 1px solid #222;
  padding: 4px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.diag-row {
  display: flex;
  gap: 8px;
  align-items: baseline;
}

.diag-label {
  color: #555;
  min-width: 70px;
  flex-shrink: 0;
}

.diag-val code {
  color: #9ecbff;
}

.output-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  color: #555;
}

.output-log {
  height: 80px;
  overflow-y: auto;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 2px;
  padding: 3px 6px;
  margin-top: 2px;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.4;
}

.stream-tx {
  color: #8bc34a;
}

.stream-rx {
  color: #f0a030;
}

.stream-legend {
  margin-left: auto;
  font-size: 0.65rem;
  color: #444;
}

.legend-tx { color: #8bc34a; }
.legend-rx { color: #f0a030; }

.output-empty {
  color: #333;
  font-style: italic;
}

/* ── save dialog ── */
.save-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.save-dialog {
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 16px 24px;
  min-width: 320px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #ccc;
}

.save-title {
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 12px;
}

.save-body {
  margin-bottom: 16px;
}

.save-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
}

.save-input {
  flex: 1;
  padding: 4px 8px;
  font-family: monospace;
  font-size: 0.85rem;
  background: #0d0d0d;
  color: #eee;
  border: 1px solid #444;
  border-radius: 3px;
  outline: none;
}
.save-input:focus {
  border-color: #7eb8f7;
}

.save-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.save-btn {
  padding: 4px 16px;
  font-family: monospace;
  font-size: 0.8rem;
  background: #2a2a2a;
  color: #ccc;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
}
.save-btn:hover { background: #3a3a3a; color: #fff; }
.save-btn-cancel { color: #888; }
</style>
