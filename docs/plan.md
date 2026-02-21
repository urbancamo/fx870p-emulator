# FX-870P Web Emulator — Implementation Plan

## Context

The spec (`specs/fx870p-emulator.md`) asks for:
1. A re-implementation of the FX-870P emulator in **TypeScript + Vue** for the browser
2. As a **first step**: read the documentation, catalogue all facilities, identify reusable assets, flag web-specific problems, and produce a planning document

The project is a fresh Vite 7 + Vue 3 scaffold (`src/App.vue`, `src/main.ts`) with no emulator code yet. All reference material is in `reference/fx870_es/` (Delphi 5 source + binary assets).

---

## What the Emulator Does

### Hardware Being Emulated

- **CPU:** Hitachi HD61700 8-bit microprocessor, 921 kHz
- **Memory:** 18-bit address space (256 KB): ROM0 (6 KB, 16-bit words), ROM1 (128 KB × 2 banks), RAM (64 KB)
- **Display:** HD44352A01 LCD controller — 96×64 pixel display + 5 status indicators
- **Keyboard:** 83-key matrix (9 blocks, 16 KO columns)
- **Peripherals:** Serial UART, printer (to file), MD-120 floppy disk drive

### Emulator Facilities (from `FX-870P_emulator.html`)

- Full CPU emulation with configurable clock frequency (INI file)
- LCD display with character ROM and cursor support
- Mouse + keyboard input for calculator keys
- Serial port / cassette interface (file-based send/receive)
- MD-120 floppy disk emulation (maps to host directory)
- Printer (saves to file)
- Debug window (F3): disassembler, hex editor, register viewer, single-step, breakpoints
- Communication utility (F4): send/receive binary files
- F9 = Reset; Port P4 Japanese/export variant (INI setting)
- State persistence: `ram0.bin` + `register.bin` saved on exit

---

## Major Functional Components → Web Equivalents

| Component | Delphi Source | TypeScript Module | Web Approach |
|---|---|---|---|
| CPU core | `cpu.pas` | `src/emulator/cpu.ts` | Direct port; `cpuReset()`, `cpuRun()` |
| Instruction dispatch | `decoder.pas` | `src/emulator/decoder.ts` | 256-entry `InstrFn[]` function array |
| Instruction handlers | `exec.pas` (~2100 lines) | `src/emulator/exec.ts` | Mechanical port; largest file |
| State / memory map | `def.pas` | `src/emulator/def.ts` | `CpuState` interface + `Uint8Array` regions |
| LCD controller | `lcd.pas` | `src/emulator/lcd.ts` | Direct port; drives Canvas `ImageData` |
| Keyboard matrix | `keyboard.pas` | `src/emulator/keyboard.ts` | `keyTab[16][84]` constant; mouse+`keydown` events |
| I/O ports / UART | `port.pas` | `src/emulator/port.ts` | Direct port; UART state machine |
| Floppy disk | `fdd.pas` + `dos.pas` | `src/emulator/fdd.ts` + `dos.ts` | Origin Private File System (OPFS) |
| Serial comm | `comm.pas` | `src/emulator/comm.ts` | File upload/download queue |
| Main loop / timers | `main.pas` (OnRunTimer) | `src/emulator/emulator.ts` | `requestAnimationFrame` cycle loop |
| UI faceplate | `main.pas` (TMainForm) | `src/components/EmulatorView.vue` | `<img>` background + Canvas overlay |
| LCD rendering | `main.pas` (View proc) | `src/components/LcdCanvas.vue` | `putImageData` to `<canvas>` |
| Keyboard UI | `main.pas` (FormMouseDown) | `src/components/KeyboardOverlay.vue` | Positioned `<div>` hit regions |
| Debug window | `debug.pas` | `src/components/DebugPanel.vue` | Collapsible drawer, Phase 3 |
| Comm window | `comm.pas` (form) | `src/components/CommPanel.vue` | Panel section, Phase 3 |
| Disassembler | `dis.pas` | `src/emulator/disassembler.ts` | Phase 3 |
| Assembler | `asem.pas` | `src/emulator/assembler.ts` | Phase 3 |

---

## Binary / Image Assets

### Reusable Directly (copy to `public/roms/`)

| File | Size | Usage |
|---|---|---|
| `rom0.bin` | 6 KB | CPU internal ROM (16-bit word layout — each address × 2 bytes in file) |
| `rom1.bin` | 128 KB | External ROM; loaded into 0x00C00–0x10000 and 0x20000–0x30000 |
| `charset.bin` | 2 KB | LCD char ROM; nibble-expansion pass required on load |
| `ram0.bin` | 64 KB | Initial RAM (optional; zeros if absent) |
| `register.bin` | 36 B | Initial register file (optional) |

All fetched at runtime via `fetch('/roms/rom0.bin')` etc.

### Image Conversion Required

| File | Format | Issue | Solution |
|---|---|---|---|
| `face.bmp` | 709×280, 4-bit palette BMP | Browsers don't render BMP via `<img>` | Convert to `face.png` with `sips` or ImageMagick |
| `keys.bmp` | 202×54, 4-bit palette BMP | Same | Convert to `keys.png` |

Conversion command (macOS):
```
sips -s format png reference/fx870_es/face.bmp --out public/images/face.png
sips -s format png reference/fx870_es/keys.bmp --out public/images/keys.png
```

The white palette entry (`$00FFFFFF`) used as the transparent color in Delphi should become PNG transparency.

**Alternative for keys:** replace `keys.bmp` entirely with CSS-styled `<div>` elements using `keypad[]` coordinates. Cleaner, scalable, no asset dependency.

### Configuration

`fx870.ini` → `localStorage` key `fx870p-config`:
```json
{ "oscFreq": 921, "option2": 1, "fddPath": "disk0" }
```

---

## Web-Specific Problem Areas

### 1. Floppy Disk Drive (HIGH complexity)

- Delphi uses direct host filesystem (`AssignFile`, `BlockRead`/`BlockWrite`)
- **Solution:** [Origin Private File System (OPFS)](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) — available in all modern browsers, provides persistent sandboxed file storage
- FDD commands are synchronous from the CPU's perspective (polls `fdd_status`); file ops must be pre-staged asynchronously before each CPU batch
- Fallback: in-memory virtual disk loaded from ZIP upload; download to export

### 2. Serial Port (MEDIUM complexity)

- Delphi: COM port or file-based I/O
- **Solution A (MVP):** File-based — `<input type="file">` to send, `showSaveFilePicker()` to receive; byte queue between UI and port emulation
- **Solution B (optional):** [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) — Chrome/Edge only; connect to real calculator hardware; gated on `'serial' in navigator`

### 3. Timer Accuracy (MEDIUM complexity)

- Delphi: `TThreadedTimer` firing every ~1 ms in a dedicated OS thread
- Browser `setInterval` minimum: ~4 ms active tab, ~1000 ms background
- **Solution:** `requestAnimationFrame` + cycle-budget loop. Each frame (~16 ms at 60 fps) runs `OscFreq × elapsed` CPU cycles. This naturally handles tab throttling. All interrupt timers (ON pulse, KEY pulse, serial tick, 1-minute timer) are driven by accumulated cycle counts within the same loop — no separate JS timers needed.

### 4. BMP Image Loading

- Browsers cannot decode Windows BMP in `<img>` tags
- **Solution:** Pre-convert to PNG (one-time); or write a minimal BMP decoder in TS for the 4-bit palette format

### 5. ROM0 16-bit Word Layout

- `memorg=1` in Delphi means ROM0 addresses are stored as 16-bit words (each address maps to 2 bytes in the file)
- Must replicate with `Uint16Array` view or explicit `address * 2` indexing
- Byte-swap may be needed depending on endianness of original dump

### 6. charset.bin Nibble Expansion

- On load, Delphi does an in-place expansion: 128-char × 16-byte packed file → 256-char × 16-nibble working array (one nibble per byte)
- Must replicate this transformation in `lcdInit()` before emulator starts

### 7. Sound

- Not supported in the original emulator either — no action needed

### 8. Windows-Specific APIs Not Needed

- No COM port access (replaced by Web Serial / file)
- No direct memory access
- No window dragging / captionless form (browser handles windowing)
- No `afplay` / system sound calls (N/A in browser)

---

## Implementation Phases

### Phase 1: MVP — CPU + LCD + Keyboard *(target: calculator boots)*

1. Asset pipeline: convert BMPs to PNG, copy ROM files to `public/roms/`
2. `def.ts`: register state (`CpuState`), `Uint8Array` memory regions, memory access, BCD math
3. `lcd.ts`: `lcdTransfer()`, `lcdRender()`, `lcdInit()` with charset expansion
4. `exec.ts`: all ~70 instruction handlers (mechanical port from `exec.pas`)
5. `decoder.ts`: 256-entry dispatch table
6. `cpu.ts`: `cpuReset()`, `cpuRun()`, interrupt dispatch
7. `keyboard.ts`: `keyTab[16][84]` data, `readKy()`, `keypad[9]` geometry
8. `port.ts`: I/O port registers, UART state (no real serial I/O)
9. `emulator.ts`: rAF loop, interrupt scheduling, config from localStorage
10. `LcdCanvas.vue`: Canvas rendering of `lcdimage` nibble array
11. `KeyboardOverlay.vue`: mouse + keyboard event → keyCode1/keyCode2
12. `EmulatorView.vue`: load ROMs, mount emulator, handle F3/F4/F9

**Acceptance criterion:** Calculator displays `CASIO fx-870P` boot screen; numeric keys work; basic BASIC interpreter responds.

### Phase 2: Persistence + Floppy

- `useStorage.ts`: IndexedDB save/load for `ram0.bin` + `register.bin` on `beforeunload`
- `fdd.ts` + `dos.ts`: OPFS-backed floppy emulation; import/export ZIP UI

### Phase 3: Debug + Comm

- `DebugPanel.vue`: disassembly, register view, hex editor, step/breakpoint
- `disassembler.ts` port from `dis.pas`
- `CommPanel.vue`: file send/receive UI with progress and XON/XOFF flow

### Phase 4: Polish

- Responsive faceplate scaling to viewport
- Web Serial API (optional, Chrome/Edge)
- Service Worker for offline ROM caching

---

## Critical Source Files to Consult During Implementation

| Priority | File | Why |
|---|---|---|
| 1 | `reference/fx870_es/def.pas` | All register/memory definitions; every other module depends on it |
| 2 | `reference/fx870_es/exec.pas` | ~2100 lines of instruction handlers; the dominant porting effort |
| 3 | `reference/fx870_es/lcd.pas` | LCD state machine; correctness here is the visual validation gate |
| 4 | `reference/fx870_es/main.pas` | rAF loop design, LCD rendering pipeline, keyboard hit-testing, init |
| 5 | `reference/fx870_es/keyboard.pas` | `keyTab` and `keypad` data tables; port verbatim |
| 6 | `reference/fx870_es/fdd.pas` + `dos.pas` | FDD command protocol; most complex web adaptation |

---

## Verification Criteria

- `npm run dev` → browser shows emulator faceplate at `localhost:5173`
- Calculator boots to `CASIO fx-870P` screen (ROM execution correct)
- Clicking/pressing number keys enters digits (keyboard + KY register correct)
- `2 + 3 EXE` returns `5` (basic arithmetic, LCD rendering correct)
- F9 resets the calculator
- Page refresh → state restored (RAM + registers persisted)
