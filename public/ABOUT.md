# Casio FX-870P / VX-4 Emulator

A browser-based emulator for the **Casio FX-870P** pocket computer (also sold as the **VX-4**), written in TypeScript and Vue 3.

The FX-870P was a 1986 programmable calculator running a **Hitachi HD61700** CPU at 921 kHz with a 96x64 pixel LCD, 83-key keyboard, serial port, and optional MD-120 floppy drive. It was programmable in Casio BASIC and could communicate with other devices via its RS-232C serial port.

This emulator faithfully reproduces the original hardware including the CPU, LCD controller, keyboard matrix, UART, and floppy disk interface.

---

## Credits

The original emulator was written in Delphi and is available on the [PISI website](https://www.pisi.com.pl/piotr433/index.htm#fx870). Full credit is given to the original author of the amazing suite of Casio pocket computer emulators available on that site. This web implementation is designed to make the emulator available to a wider audience directly in the browser, without requiring any software installation.

This version of the emulator was implemented by [Mark Wickens](https://urbancamo.github.com) and the source code is available on [GitHub](https://github.com/urbancamo/fx870p-emulator/).

---

## Instructions

### Getting Started

When the emulator loads, you will see the calculator faceplate with its LCD display. The calculator boots into **calculator mode** (CAL) by default. You can interact with it by clicking the on-screen keys with the mouse, or by using your PC keyboard.

Press **F9** at any time to perform a hardware reset (equivalent to pressing the reset button on the back of the real calculator).

### Keyboard Mapping

Most keys on your PC keyboard map directly to the corresponding calculator keys:

| PC Key                      | Calculator Key                                |
|-----------------------------|-----------------------------------------------|
| **A**–**Z**                 | Letter keys (auto-adjusts CAPS to match case) |
| **0**–**9**                 | Number keys                                   |
| **Enter**                   | EXE                                           |
| **Escape**                  | BRK / ON                                      |
| **Backspace** or **Delete** | BS (backspace)                                |
| **Insert**                  | INS                                           |
| **Arrow keys**              | Cursor movement                               |
| **Page Down**               | CAPS                                          |
| **Page Up**                 | Red S (Shift / 2nd function)                  |
| **Space**                   | Space                                         |
| **+ - * /**                 | Arithmetic operators                          |
| **( ) ^ . , =**             | Punctuation keys                              |

#### Shifted Symbols

Many symbols are entered using the calculator's red **S** (Shift) key. When you type these characters on your PC keyboard, the emulator automatically sends the correct Shift + key combination:

| PC Key  | Calculator Entry |
|---------|------------------|
| **!**   | S + Q            |
| **"**   | S + W            |
| **#**   | S + E            |
| **$**   | S + R            |
| **%**   | S + T            |
| **&**   | S + Y            |
| **'**   | S + U            |
| **@**   | S + A            |
| **~**   | S + S            |
| **?**   | S + D            |
| **{ }** | S + F / S + G    |
| **[ ]** | S + H / S + J    |
| **< >** | S + K / S + L    |
| **; :** | S + , / S + =    |
| **_**   | S + Space        |

#### Function Keys

Named functions such as SIN, COS, TAN, LOG, and LN can be typed directly on the PC keyboard by spelling out the function name (e.g. type `S`, `I`, `N` for SIN). The calculator accepts both the typed name and the dedicated function key on the faceplate. You can also click the function keys on the calculator image with the mouse.

### Calculator Modes

The FX-870P has several operating modes accessible via the **MODE** key:

- **CAL** — Calculator mode (default). Enter expressions and press EXE to evaluate.
- **BASIC** — BASIC programming mode. Write and run Casio BASIC programs.
- **CASL** — Assembly language mode and communications setup (F.COM).

For a comprehensive guide to all calculator features and the BASIC programming language, refer to the [FX-850P/FX-880P Owner's Manual](https://urbancamo.github.io/casio-basic/doc/casio-fx850-owners-manual.html). The FX-870P is compatible with the FX-850P instruction set.

---

## Toolbar

The toolbar below the calculator provides the following controls:

| Button        | Function                                                                                               |
|---------------|--------------------------------------------------------------------------------------------------------|
| **LOAD**      | Select a BASIC program file (.bas, .fx) to send to the calculator via the emulated RS-232C serial port |
| **STOP**      | Abort the current file transfer                                                                        |
| **RAM ↑**     | Import a raw RAM image (e.g. from the Delphi emulator) to restore calculator state                     |
| **RAM ↓**     | Download the current RAM contents as a binary file                                                     |
| **COMMS ▾/▴** | Show or hide the communications diagnostics panel                                                      |
| **DEBUG ▾/▴** | Show or hide the CPU debugger panel                                                                    |
| **ABOUT**     | Display this information popup                                                                         |
| **Arrow**     | Cycle the panel layout: bottom, right, or left of the calculator                                       |

The progress bar between LOAD and STOP shows transfer progress, turning green when actively sending and amber when paused by flow control. During a SAVE operation (receiving data from the calculator), the bar shows an animated striped pattern with a byte count.

### Loading a Program via Serial

To load a BASIC program file into the calculator:

1. Click **LOAD** and select a `.bas` or `.fx` file
2. On the calculator, type: `LOAD "COM0:6,N,8,1,N,N,N,N,N"` or use the F-COM panel (Shift - CASL then select 'L' for LOAD, use arrow keys to choose program location) and press **EXE**
3. The file will transfer automatically with XON/XOFF flow control
4. When complete, type `LIST` and press **EXE** to verify the program loaded

### Saving a Program via Serial

To save a BASIC program from the calculator to a file:

1. On the calculator, type: `SAVE "COM0:6,N,8,1,N,N,N,N,N"` and press **EXE**
2. The progress bar will show an animated pattern as data is received
3. When the transfer completes (EOF received), a dialog will prompt you for a filename
4. Click **Save** to download the file, or **Cancel** to discard

If the transfer is interrupted (e.g. by pressing BRK on the calculator), the partial data is automatically discarded after a 2-second timeout.

---

## Comms Panel

Click **COMMS** to reveal the communications diagnostics panel. This shows the real-time state of the emulated RS-232C serial port and UART hardware.

### Diagnostics

- **Port D** — The I/O port register values: `pdi` (port D input), `pe` (port enable), `pd` (port data). These control the serial interface at the hardware level.
- **UART regs** — The 8 read registers of the UART chip and the two write registers. These contain the baud rate, mode, status flags, and data buffer.
- **UART state** — Decoded summary: communication mode (RS-232C or MT), baud rate, status flags (TxRdy, RxFull, errors), XON/XOFF suspend state, and total bytes sent.
- **DevTable** — The device table at RAM address 0x11100. Bit 4 of the first byte indicates whether the COM0 serial driver is installed (YES/NO). This must show YES for serial communication to work.

### Serial Stream

The stream display at the bottom shows all bytes exchanged between the emulator and the calculator in real time:

- **Green text** — bytes sent *to* the calculator (TX)
- **Orange text** — bytes received *from* the calculator (RX)

Control characters are displayed with labels: `[XON]` (resume transmission), `[XOFF]` (pause transmission), `[EOF]` (end of file), `\r` (carriage return), `\n` (line feed). Printable ASCII characters are shown as-is.

The **SAVE** button downloads the raw received bytes as a binary file. **CLEAR** resets the stream display.

---

## Debugger Panel

Click **DEBUG** to reveal the CPU debugger. This shows the live internal state of the HD61700 processor:

- **PC** — Program counter (current instruction address)
- **SP** — Stack pointer
- **Flags** — CPU status flags (Zero, Carry, etc.)
- **Registers** — The main register file (r0–r31) and index registers (IX, IZ, UA, etc.)
- **Disassembly** — A live disassembly of instructions around the current PC

This panel is primarily useful for developers debugging the emulator itself or for understanding the low-level behaviour of the calculator's ROM.

---

## Panel Layout

Use the arrow button in the toolbar to cycle the panel position:

- **→** moves panels to the right of the calculator
- **←** moves panels to the left
- **↓** moves panels below the calculator (default)

In left or right layout, a draggable divider between the calculator and the panels lets you adjust how much screen space each side receives. Your layout preference and split position are saved automatically.

---

## Reference

- [FX-850P/FX-880P Owner's Manual](https://urbancamo.github.io/casio-basic/doc/casio-fx850-owners-manual.html) — comprehensive guide to Casio BASIC and all calculator functions
- [Source code on GitHub](https://github.com/urbancamo/fx870p-emulator/) — TypeScript source, build instructions, and development documentation
- [Original Delphi emulator (PISI)](https://www.pisi.com.pl/piotr433/index.htm#fx870) — the reference implementation this emulator is based on
