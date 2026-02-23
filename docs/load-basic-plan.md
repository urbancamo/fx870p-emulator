# Load BASIC Program from File

## Context

The FX-870P loads programs via its CMT (Cassette Magnetic Tape) interface using the MT serial
protocol. `port.ts` already has the MT decoding state machine (`mtRead()`) and a stub
`commReadFn` hook (returns -1 / no data). We need to wire a file-picker UI to that hook so that
when the user selects a `.bas` file and initiates `LOAD` on the calculator, the bytes flow in
correctly.

The file on disk is plain Casio ASCII text (e.g. `10 PRINT "HELLO"\n20 END`). It must be
MT-encoded before being fed to `commReadFn`, because `mtRead()` consumes byte pairs in the
0x30–0x6F range and decodes them back to the original bytes.

---

## MT Encoding

`mtRead()` in `port.ts` decodes a pair (x1, x2) as:
```
data = ((x1 - 0x30) >> 1) | ((x2 & 0x07) << 5)
parity check: parity(data) === (x2 & 0x08)
```

The inverse (encoding raw byte `b`):
```
x1 = ((b & 0x1F) << 1) + 0x30          // bits 4–0 of b, start-bit = 0
x2 = ((b >> 5) & 0x07) | (parity(b) << 3) | 0x30
```

Both x1 and x2 land in 0x30–0x6E ✓.

A "carrier / leader" pair is x1=0x6F, x2=0x6F — `mtRead()` detects this, sets
`ga_rd[6] |= 0x01` (carrier detected), and returns 0x100 (ignored by the tick loop).
The ROM waits for carrier before decoding data, so we prepend ~256 leader pairs.

---

## Files to Create / Modify

### 1. `src/emulator/comm.ts` (NEW)

- Maintain a `number[]` RX queue of MT-encoded bytes.
- `loadFileBytes(raw: Uint8Array): void` — MT-encodes `raw` (256 leader pairs, then each
  byte as an (x1, x2) pair, then a 0x1A EOF byte encoded the same way) and replaces the queue.
- `rxBytesRemaining(): number` — current queue length, for the UI status display.
- `commReadFn(): number` — shifts from the front of the queue; returns -1 if empty.
- `commWriteFn`: no-op (save is future work).
- Self-registers on module load: `registerComm(commWriteFn, commReadFn)`.
- Export `commInit(): void` as a no-op so `emulator.ts` can import it to trigger registration.

The `parity(x)` helper is already in `port.ts`; export it from there so `comm.ts` can import
it without duplication.

### 2. `src/components/CommPanel.vue` (NEW)

A minimal control strip below the calculator face:

- "Load BASIC…" button — triggers a hidden `<input type="file" accept=".bas,.txt,.prg">`.
- On file selection: reads as `ArrayBuffer`, wraps in `Uint8Array`, calls `loadFileBytes()`.
- Reactive status: "Ready" when queue empty; "Queued — N bytes remaining" while non-empty
  (poll `rxBytesRemaining()` every 250 ms via `setInterval`).
- Dark styling consistent with `EmulatorView`'s `#1a1a1a` background.

### 3. `src/components/EmulatorView.vue` (MODIFY)

- Import and render `<CommPanel />` below `.face-container`.
- Import `commInit` from `../emulator/comm.js` and call it in `init()`.

### 4. `src/emulator/port.ts` (MODIFY — minor)

- Export the existing `parity()` helper so `comm.ts` can import it.

---

## User Workflow

1. User clicks **Load BASIC…** and picks a `.bas` file.
2. Status shows "Queued — N bytes remaining".
3. On the calculator, user initiates the CMT load command.
4. ROM sets MT receiver mode (`ga_rd[5]` bit 2 = 1). `onSerialTick` calls `mtRead()`, which
   calls `commReadFn()`. Leader pairs set the carrier flag; data pairs decode to the original
   BASIC bytes. INT1 fires per received byte.
5. Queue drains; status returns to "Ready".

---

## Verification

1. `npm run build` — clean compile, no errors.
2. Create a test file `hello.bas` containing `10 PRINT "HELLO"\n20 END\n`.
3. Click **Load BASIC…**, select `hello.bas`. Status shows byte count.
4. On the calculator, run the CMT load command.
5. Calculator receives the program; `LIST` displays the program lines.
6. Status returns to "Ready" once the queue is empty.


### What was Implemented

What was implemented

src/emulator/port.ts — minor: exported parity() so comm.ts can use it without duplication.

src/emulator/comm.ts (new) — the CMT RX layer:
- loadFileBytes(raw) — MT-encodes the raw bytes into the queue: 256 leader pairs (0x6F 0x6F), then each byte as (x1, x2) pairs, then a 0x1A EOF.
- rxBytesRemaining() — queue length, polled by the UI.
- commReadFn() — shifts from the queue; returns -1 when empty.
- Self-registers with port.ts on module load; exports a no-op commInit() to force the import.

src/components/CommPanel.vue (new) — control strip below the calculator:
- Load BASIC… button opens a hidden file picker (.bas, .txt, .prg).
- On selection reads as ArrayBuffer → Uint8Array → calls loadFileBytes().
- Status label polls rxBytesRemaining() every 250 ms: "Ready" or "Queued — N bytes remaining".

src/components/EmulatorView.vue — two additions:
- Imports commInit and calls it at the start of init() (guarantees registration before the emulator starts ticking).
- Renders <CommPanel /> below .face-container; added flex-direction: column to .emulator-root.

To test

1. Create hello.bas with 10 PRINT "HELLO"\n20 END\n
2. Click Load BASIC…, select the file — status shows the byte count
3. On the calculator run the CMT load command; the program should arrive and be listable with LIST

## Loading a File

The command is CLOAD

On the FX-870P, the CMT load command is CLOAD (Casio Load), typed as a direct BASIC command.

Steps

1. Ensure BASIC mode — the calculator should boot directly into it. If not, look for a COMP or BASIC key on the right-side keypad cluster and click it.
2. Click each letter on the face (all letter keys require mouse clicks — no PC keyboard mapping for alphanumeric):

2. Based on the face.png pixel layout from keyboard.ts:
   | Letter | Approx face coords           |
   |--------|------------------------------|
   | C      | ~(151, 244) — Z-row, 3rd key |
   | L      | ~(380, 211) — A-row, 9th key |
   | O      | ~(351, 178) — Q-row, 9th key |
   | A      | ~(60, 211) — A-row, 1st key  |
   | D      | ~(140, 211) — A-row, 3rd key |

3. Press Enter on your PC keyboard → maps to EXE (key 81)
4. The calculator enters CMT receive mode and starts consuming the queue you loaded with Load BASIC…

Important timing

Load the .bas file (click Load BASIC…) before pressing EXE for CLOAD, because the ROM immediately begins polling for the carrier signal once the command executes. The 256 leader pairs in the
queue buy a small window, but the file should already be queued.

If it doesn't respond

- The calculator might be in a non-BASIC mode — look at the small right-side keys (codes 45–62) for a COMP/BASIC mode key
- F9 resets the emulator if things go sideways

