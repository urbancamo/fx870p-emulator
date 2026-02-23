// Remote logging for emulator debugging.
// Buffers log entries and POSTs them to the Vite dev server's /log endpoint
// which writes to emulator-debug.log on disk.

const MAX_BUF   = 4000;
const FLUSH_MS  = 400;
const ENDPOINT  = '/log';

export interface LogEntry {
  t:    number;   // ms since enableRemoteLog() was called
  tag:  string;
  msg:  string;
  data?: unknown;
}

let _enabled  = false;
let _t0       = 0;
let _buf: LogEntry[] = [];
let _timer: ReturnType<typeof setInterval> | null = null;

export function enableRemoteLog(on: boolean): void {
  if (on === _enabled) return;
  _enabled = on;
  if (on) {
    _t0    = Date.now();
    _buf   = [];
    _timer = setInterval(flushLog, FLUSH_MS);
    remoteLog('remote-log', `logging enabled`);
  } else {
    remoteLog('remote-log', `logging disabled`);
    if (_timer !== null) { clearInterval(_timer); _timer = null; }
    void flushLog(); // flush remaining
  }
}

export function isRemoteLogEnabled(): boolean { return _enabled; }

/** Add a log entry. No-op when disabled. */
export function remoteLog(tag: string, msg: string, data?: unknown): void {
  if (!_enabled) return;
  _buf.push({ t: Date.now() - _t0, tag, msg, data });
  if (_buf.length > MAX_BUF) _buf.shift(); // drop oldest on overflow
}

/** Flush buffer to server immediately. Returns a promise. */
export async function flushLog(): Promise<void> {
  if (_buf.length === 0) return;
  const entries = _buf.splice(0);
  try {
    await fetch(ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(entries),
    });
  } catch {
    // silently ignore — not in browser console, not to server
  }
}
