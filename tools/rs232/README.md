# RS-232C Transfer Utilities

`fxsend` and `fxrecv` are two small POSIX C command-line utilities for moving BASIC programs (or arbitrary
binary data) to and from a real Casio FX-870P or VX-4 pocket computer over its RS-232C serial port. Each
does one job — Unix filter style — reading from/writing to standard input/output by default so they drop
straight into a pipeline, or a named file with `-f`.

They exist because the FX-870P's ROM implements a specific, non-generic serial protocol (flow control
thresholds, per-line tokenization stalls, an 8-bit-unclean SI/SO code and an 8-bit-unclean XON/XOFF mode).
Both tools were built directly from a full ROM disassembly of the driver — see
[`../../docs/serial-comms-deep-dive.html`](../../docs/serial-comms-deep-dive.html) for the reverse-engineering
that backs every behaviour described below.

## What they do

| Tool     | Direction                          | Calculator side                          |
|----------|-------------------------------------|-------------------------------------------|
| `fxsend` | PC → calculator                     | `LOAD "COM0:..."`                          |
| `fxrecv` | calculator → PC                     | `SAVE "COM0:..."` (or `PRINT #`)           |

Full option references are in the man pages: [`fxsend.1`](fxsend.1), [`fxrecv.1`](fxrecv.1) (render with
`man ./fxsend.1` / `man ./fxrecv.1` from this directory, or after `make install`, plain `man fxsend`).

## Building

```bash
make          # builds fxsend and fxrecv
make check    # builds and runs the test suite (4 suites: commstr, siso, sendloop, recvloop)
make install  # installs to $(PREFIX)/bin and $(PREFIX)/share/man/man1 (PREFIX defaults to /usr/local)
make clean    # removes the build/ tree (objects, binaries, test executables)
```

`CC` and `CFLAGS` are overridable for unusual toolchains. The source is deliberately C89/POSIX.1-2001,
so it should build on older Unix systems. On Tru64, for example:

```bash
make CC=cc CFLAGS=-O
```

## Wiring — FTDI USB–RS-232 adapter to the calculator's DB-25 port

The calculator's serial port behaves as a DTE (it expects to talk to a modem), so a **null-modem** cable
is required between it and a PC/adapter, which is also a DTE. Signal names below are the calculator's
DB-25 pin numbers; cross them to the corresponding pins on the PC/adapter side.

| DB-25 pin (calculator) | Signal                | Required for       | Wiring                                                |
|-------------------------|------------------------|---------------------|--------------------------------------------------------|
| 2                        | TXD (calc transmit)   | Always              | → PC/adapter RXD                                       |
| 3                        | RXD (calc receive)    | Always              | ← PC/adapter TXD                                       |
| 7                        | Signal ground         | Always              | ↔ PC/adapter GND                                       |
| 5                        | CTS (calc input)      | `CS=C` only         | ← PC/adapter RTS                                       |
| 6                        | DSR (calc input)      | `DS=D` only         | ← PC/adapter DTR                                       |
| 8                        | DCD (calc input)      | `CD=C` only         | strap — the calculator's own RTS/DTR (pins 4/20) are static outputs, not driven per-transfer, so tie DCD high (e.g. to the calculator's own DTR pin 20, or the adapter's DTR) rather than expecting the PC to toggle it |
| 4, 20                    | RTS, DTR (calc outputs) | —                 | not read dynamically by the ROM (see deep dive §4); safe to leave unconnected |

**Minimum working cable is just pins 2, 3, and 7** (TXD/RXD crossed, ground straight through) — this is
enough for the default comm string, which has `CS=N,DS=N,CD=N` and relies purely on XON/XOFF (`Busy=B`)
for flow control. Only add the CTS/DSR/DCD wiring if you intend to open with hardware handshaking enabled.

## Comm-string reference

Both tools accept the calculator's own `COM0:` syntax via `-c`, optionally prefixed with `COM0:`:

```
speed,parity,data,stop,CS,DS,CD,busy,code
```

| # | Field      | Values                                                          | Default | Meaning                                                        |
|---|------------|------------------------------------------------------------------|---------|------------------------------------------------------------------|
| 1 | Speed      | 1=150 · 2=300 · 3=600 · 4=1200 · 5=2400 · 6=4800 baud             | 2 (300) | Line speed                                                      |
| 2 | Parity     | N / E / O                                                         | E       | None / even / odd                                                |
| 3 | Data bits  | 7 / 8                                                             | 8       | —                                                                 |
| 4 | Stop bits  | 1 / 2                                                             | 1       | —                                                                 |
| 5 | CS (CTS)   | C = wait for CTS before sending · N = ignore                      | N       | Hardware handshake, transmit side                                 |
| 6 | DS (DSR)   | D = wait on send, NR error on receive if off · N                  | N       | Hardware handshake, both directions                               |
| 7 | CD (DCD)   | C = NR error on receive if carrier off · N                        | N       | Hardware handshake, receive side                                  |
| 8 | Busy       | **B = XON/XOFF flow control** · N = none                          | **B**   | Software flow control                                            |
| 9 | Code       | S = SI/SO shift codes (7-bit data only) · N                       | N       | 8-bit-over-7-bit encoding                                         |

Empty or omitted trailing fields keep their defaults, so `-c 6,N,8,1` is the same as
`-c 6,N,8,1,N,N,N,B,N` with the speed and parity changed. The calculator's own power-on default —
`2,E,8,1,N,N,N,B,N` — is what both tools use if `-c` is omitted.

(Table content distilled from the ROM's `COM0:` parser at address `0x4EBD`; full detail in
[the deep dive, §3](../../docs/serial-comms-deep-dive.html#open).)

## Flow control

With the default `Busy=B`, the calculator's ROM runs symmetric XON/XOFF flow control around its
**256-byte receive ring buffer**: it sends XOFF once the buffer reaches **192 bytes** (75% full) and XON
once a consumer has drained it back below **32 bytes**, giving 64 bytes of headroom to absorb whatever is
already in flight when XOFF is sent. Both tools honour this on receive from the calculator and generate
it correctly on send:

- **`fxsend`** watches for an incoming XOFF from the calculator and pauses within one character time,
  resuming on XON. It never has more than one character in flight when an XOFF arrives, so it never
  overruns the 64-byte headroom.
- **`fxrecv`** applies the same logic to its own internal buffer: it sends XOFF to the calculator if
  its buffer fills faster than the destination file/pipe can drain, and XON once there's room again.

Two ROM-level facts follow directly from this design and are worth knowing when the link misbehaves:

- **Not 8-bit clean when `Busy=B`.** The ROM's receive ISR consumes bytes `0x11` (XON) and `0x13` (XOFF)
  unconditionally as flow-control signals — they are never passed through to the buffer. Binary payloads
  containing those byte values must either be hex-encoded before transfer, or sent with `Busy=N` and
  sender-side pacing (`-C`/`-L`) instead of relying on flow control.
- **`Code=S` is also not 8-bit clean, independently of `Busy`.** With SI/SO shift coding (7-bit data,
  8th bit carried by shift-in/shift-out control bytes `0x0E`/`0x0F`), the ROM unconditionally consumes
  `0x0E`/`0x0F` as shift controls. This means the four byte values `0x0E`, `0x0F`, `0x8E`, `0x8F` cannot
  be represented on a `Code=S` link at all — not a limitation of these tools, but an inherent property of
  the protocol that matches real hardware exactly. Plain BASIC program text never contains these bytes,
  so `Code=S` is safe for ordinary LOAD/SAVE; binary payloads must use `Code=N`.

## SIGPIPE policy

Both `fxsend` and `fxrecv` install `SIG_IGN` for `SIGPIPE` at startup. This means that when either tool is
used in a pipeline whose downstream reader exits early — `fxrecv -d ... | head`, for example — the write
that hits the closed pipe fails with `EPIPE`, is reported as a normal "Broken pipe" error, and the tool
exits with status 2. Without this, the default `SIGPIPE` disposition would kill the process silently and
without a diagnosable exit status, which is unhelpful in scripted pipelines.

## Worked examples

Load a program onto the calculator at 4800 baud, no parity:

```bash
export FXPORT=/dev/cu.usbserial-A50285BI      # macOS; /dev/ttyUSB0 on Linux
./build/bin/fxsend -c 6,N,8,1,N,N,N,B,N -f SORCERER.BAS
```

On the calculator, first enter: `LOAD "COM0:6,N,8,1,N,N,N,B,N"`

Save a program from the calculator to a file:

```bash
./build/bin/fxrecv -c 6,N,8,1,N,N,N,B,N -f SAVED.BAS
```

On the calculator: `SAVE "COM0:6,N,8,1,N,N,N,B,N"`

Both tools work as filters, so they pipe naturally. Grep a saved listing for a keyword as it streams in,
without ever writing an intermediate file:

```bash
./build/bin/fxrecv -d /dev/cu.usbserial-A50285BI -c 6,N,8,1,N,N,N,B,N | grep GOSUB
```

Or verify a loopback cable end-to-end (jumper an adapter's TX to its RX):

```bash
printf 'HELLO\n' | ./build/bin/fxsend -C 0 -L 0 -b &
./build/bin/fxrecv -b -t 3
```

## Troubleshooting

| Symptom                                            | Likely cause                                                                 | Fix                                                                                  |
|------------------------------------------------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Calculator shows `BV` error during `LOAD`             | Receive buffer overflowed — tokenization couldn't keep up and flow control never engaged | Make sure the comm string has `Busy=B` (the default), or, if deliberately running with `Busy=N`, raise `fxsend`'s `-L` (per-line delay) to give the calculator more time between lines |
| Received text is garbled or has wrong characters      | Parity mismatch between the two ends                                          | Confirm `-c` matches exactly what the calculator's `LOAD`/`SAVE` string specifies, field for field, especially the parity (`E`/`O`/`N`) and data-bit count |
| Nothing is received at all                            | Wrong device node, or TX/RX not crossed                                       | On macOS use the `/dev/cu.usbserial-*` node, not `/dev/tty.usbserial-*` (the `tty` variant blocks open waiting for carrier detect); double-check TXD/RXD are crossed between the calculator and the adapter, not wired straight through |

## See also

- [`../../docs/serial-comms-deep-dive.html`](../../docs/serial-comms-deep-dive.html) — full ROM
  disassembly and reverse-engineering behind the protocol details summarized here (control lines,
  XON/XOFF state machine, timing diagrams, buffer thresholds).
- [`fxsend.1`](fxsend.1), [`fxrecv.1`](fxrecv.1) — man pages with the complete option reference.
