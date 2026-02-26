# FX-870P Emulator

A browser-based emulator for the **Casio FX-870P** (also sold as the VX-4) pocket computer, written in TypeScript and Vue 3.

The FX-870P was a 1986 programmable calculator running a **Hitachi HD61700** CPU at 921 kHz with a 96×64 pixel LCD, 
83-key keyboard, serial port, and optional MD-120 floppy drive. This emulator is a full port of the 
original Delphi reference implementation to the web platform.

![screenshot.png](docs/screenshot.png)

## Credits

The original emulator is available on the [PISI](https://www.pisi.com.pl/piotr433/index.htm#fx870) and credit 
is given to the original author of the amazing suite of emulators available on this site. This implementation is 
designed to purely make the code behind that emulator available to a wider audience on the internet.

This version of the emulator implemented by [Mark Wickens](https://urbancamo.github.com), the source code is hosted 
on GitHub [here](https://github.com/urbancamo/fx870p-emulator/) and it is
[hosted if here you want to try it](https://m5tea.uk/fx870p-emulator/).

## Hardware Emulated

| Component | Details                                                                               |
|-----------|---------------------------------------------------------------------------------------|
| CPU       | Hitachi HD61700, 921 kHz                                                              |
| Memory    | 18-bit address space: ROM0 (6 KB, 16-bit words), ROM1 (128 KB × 2 banks), RAM (64 KB) |
| Display   | HD44352A01 LCD controller — 96×64 pixels + 5 status indicators                        |
| Keyboard  | 83-key matrix (9 blocks, 16 KO columns)                                               |
| Serial    | UART with XON/XOFF flow control                                                       |
| Storage   | MD-120 floppy disk via Origin Private File System (OPFS)                              |

## Features

- **Responsive calculator face** — scales to fit any screen size with multiple resolution faceplate images
- **Full keyboard mapping** — type directly on your PC keyboard with automatic CAPS and shifted-symbol handling
- **RS-232C serial** — LOAD and SAVE BASIC programs via emulated COM0 with XON/XOFF flow control
- **Floppy disk** — MD-120 disk emulation via Origin Private File System (OPFS)
- **Character set table** — interactive 16x16 hex grid showing all 256 character bitmaps from the ROM font
- **DEFCHR$ pixel editor** — click any character to open a drag-to-paint 5x8 pixel editor that generates the BASIC `DEFCHR$` command with a one-click copy button
- **Turbo mode** — run the CPU at ~50x speed for compute-heavy BASIC programs
- **Fullscreen mode** — hide toolbar and panels to use the calculator full-screen (useful on mobile)
- **Firmware toggle** — switch between FX-870P (Japanese) and VX-4 (English) ROM modes
- **CPU debugger** — live registers, flags, and disassembly view
- **Communications panel** — UART register state, serial byte stream, and diagnostics

## Running

### Prerequisites

- Node.js 22 LTS
- ROM files placed in `public/roms/` (not included)

### Development server

```bash
npm install
./start.sh        # starts on http://localhost:3007/fx870p-emulator/
./stop.sh         # stops the server
```

Or use npm directly:

```bash
npm run dev       # foreground, Ctrl-C to stop
```

### Production build

```bash
npm run build     # output in dist/
npm run preview   # preview the built app
```

The app is served under the `/fx870p-emulator/` base path in both dev and production.

## Project Structure

```
src/
  emulator/
    cpu.ts            HD61700 CPU core — reset, fetch/decode/execute loop
    exec.ts           Instruction handlers (~2100 lines)
    decoder.ts        256-entry instruction dispatch table
    def.ts            CPU state, memory map, srcRead/dstWrite
    disassemble.ts    Runtime disassembler (used by DebugPanel)
    lcd.ts            HD44352A01 LCD controller → Canvas ImageData
    keyboard.ts       83-key matrix — keydown + mouse events
    port.ts           I/O ports and UART state machine
    comm.ts           RS-232C TX/RX queue, XON/XOFF, SAVE receive
    emulator.ts       Main rAF loop, ROM loading, state persistence
    remote-log.ts     Debug logging (dev only)
    trace.ts          Per-instruction JSONL trace recorder
  components/
    EmulatorView.vue    Top-level orchestrator + panel layout
    LcdCanvas.vue       Canvas LCD renderer
    KeyboardOverlay.vue Clickable key hit regions over face images
    CommPanel.vue       Serial comms panel + toolbar buttons
    DebugPanel.vue      CPU debugger (registers, flags, disassembly)
    CharsetPopup.vue    Character set table + DEFCHR$ pixel editor
    AboutPopup.vue      About dialog (renders ABOUT.md)
public/
  ABOUT.md            User-facing documentation (rendered in About popup)
  basic/              Sample BASIC programs (.bas, .fx)
  images/
    face.png          Calculator faceplate (standard)
    face-large.png    Calculator faceplate (large)
    face-huge.png     Calculator faceplate (huge)
    keys.png          Key overlay reference
    casio-logo.svg    Casio logo (used as About popup watermark)
  roms/               ROM and charset binaries (not in repo)
tests/
  emu-harness.ts      Headless emulator boot + keystroke helpers
  sin90.test.ts       SIN(90) regression test
tools/
  dis.ts              Standalone disassembler (npm run dis)
  compare-traces.mjs  Delphi vs TypeScript trace comparison
  charset-dump.ts     Generate character set markdown (docs/charset.md)
  charset-table.ts    Generate character set HTML table (docs/charset-table.html)
reference/            Documentation and Delphi source
docs/                 Implementation notes
```

## Reference Documents

| Document                                                                    | Description                                        |
|-----------------------------------------------------------------------------|----------------------------------------------------|
| [`reference/fx870p-rom-annotations.md`](reference/fx870p-rom-annotations.md) | Annotated ROM address labels and call-flow notes   |
| [`reference/fx870p-roms.md`](reference/fx870p-roms.md)                      | Full ROM disassembly                               |
| [`reference/FX-870P_VX-4 Manual.html`](docs/FX-870P_VX-4 Manual.html)                | Original user manual (HTML)                        |
| [`docs/CasioVX-4-Manual-Peter-Rost.pdf`](docs/CasioVX-4-Manual-Peter-Rost.pdf) | VX-4 manual by Peter Rost (PDF)                    |
| [`docs/FX-870P emulator.pdf`](docs/FX-870P%20emulator.pdf)                  | Delphi emulator documentation (PDF)                |
| [`docs/plan.md`](docs/plan.md)                                              | Web port implementation plan and component mapping |
| [`reference/fx870_es/`](reference/fx870_es/)                                | Original Delphi 5 source (reference only)          |

## Testing

The emulator has a headless test suite powered by [vitest](https://vitest.dev/) that boots the emulator in Node.js, 
injects keystrokes, runs the CPU, and verifies LCD output.

### Run all tests

```bash
npm test
```

### Run a single test file

```bash
npx vitest run tests/sin90.test.ts
```

### Run tests matching a name pattern

```bash
npx vitest run -t "SIN"
```

### Watch mode (re-runs on file changes)

```bash
npx vitest
```

Tests require ROM files in `public/roms/` (same as the dev server).


## Debug Logging

The dev server exposes a `/fx870p-emulator/log` endpoint that writes to `emulator-debug.log`. Enable logging from the browser console:

```js
window.ioDebug(true)   // enable
window.ioDebug(false)  // disable
```

## Tech Stack

- [Vue 3](https://vuejs.org/) + [`<script setup>`](https://vuejs.org/api/sfc-script-setup.html)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/)