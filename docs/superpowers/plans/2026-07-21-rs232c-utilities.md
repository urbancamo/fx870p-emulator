# RS-232C Read/Write Utilities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two POSIX C command-line utilities, `fxsend` and `fxrecv`, that reliably transfer BASIC programs to/from a Casio FX-870P / VX-4 over an FTDI USB–RS-232 adapter.

**Architecture:** Two thin front-ends over a shared core (`commstr` parser → `serial` termios layer → `sendloop`/`recvloop` engines). The engines implement the flow-control behaviour reverse-engineered in `docs/serial-comms-deep-dive.html`: honour XOFF from the calculator within its 64-byte post-XOFF headroom (per-byte write + `tcdrain`), emit XON/XOFF when receiving, and pace with per-character and per-line delays to survive line-end tokenization stalls. Tests run against `posix_openpt` pseudo-terminals with a scripted fake calculator.

**Tech Stack:** C (C89-compatible subset), POSIX.1-2001 only (`termios`, `select`, `posix_openpt`), no third-party dependencies. BSD/GNU-make-compatible Makefile. roff man pages.

## Global Constraints

- Language: C, C89-compatible style (`/* */` comments, declarations at top of block, no VLAs) so old compilers (Tru64 `cc`) can build it.
- POSIX.1-2001 APIs only in the utilities; `TIOCMBIS` (assert DTR/RTS) and `posix_openpt` test harness guarded appropriately.
- `-f` flag for filename on both tools; **absent `-f` means stdin (`fxsend`) / stdout (`fxrecv`)** for pipelining.
- Comm string syntax **identical to the calculator's**: `[COM0:]speed,parity,data,stop,CS,DS,CD,busy,code`; empty/omitted trailing fields keep defaults.
- Defaults = the calculator's power-on defaults: `2,E,8,1,N,N,N,B,N` (300 baud, even parity, 8 data, 1 stop, no hardware handshake, XON/XOFF **on**, SI/SO off). Source: FX-850P manual part 9 via the deep-dive report.
- Speed digits map exactly as the ROM parser accepts them: `1`=150, `2`=300, `3`=600, `4`=1200, `5`=2400, `6`=4800 baud.
- Default pacing: 5 ms per character, 100 ms per line (after LF); both user-overridable, may be set to 0 when relying on XON/XOFF.
- Reliability target: send/receive multi-kilobyte programs (SORCERER.BAS, STREK.BAS) without overrun.
- Layout: everything under `tools/rs232/`; man pages `fxsend.1`/`fxrecv.1`; `tools/rs232/README.md` linked from the repository `README.md`.
- Commit after every green test cycle, on `main`, conventional-commit style.

## Design decisions (fleshing out the brief)

1. **Two utilities, not one.** `fxsend` and `fxrecv` differ in data direction, options (`-C`/`-L` pacing vs `-t` idle timeout) and failure modes. Two names keep each tool's contract one sentence long — the Unix-philosophy test the brief asked us to apply. They share >80% of their code via common objects, so no duplication.
2. **PC-side interpretation of the comm string.** The string describes the *calculator's* port settings; the PC must complement them:
   - speed/parity/data/stop → identical termios settings.
   - `CS=C` (calc waits for its CTS) → we assert **RTS** (wired to calc CTS in a null-modem cable). We assert RTS+DTR at open unconditionally where `TIOCMBIS` exists — harmless when unwired, required when handshake is enabled.
   - `DS=D` (calc waits for DSR / NR error) → we assert **DTR** (wired to calc DSR). Same static assertion.
   - `CD=C` → document that DCD must be wired (typically strapped to PC DTR); nothing dynamic to do.
   - We never enable `CRTSCTS`-style hardware flow control on the PC side: the deep dive proved the calculator's RTS/DTR are static, so waiting on them would deadlock.
   - `busy=B` → the send engine pauses on received XOFF (0x13) and resumes on XON (0x11); the receive engine emits XOFF/XON around a high/low-water ring buffer. `busy=N` disables both, leaving only pacing delays.
   - `code=S` → SI/SO shift encoding/decoding (only meaningful with 7 data bits, matching the ROM: SO 0x0E before bytes ≥ 0x80, SI 0x0F to return).
3. **Overrun safety on send.** The calculator guarantees only 64 bytes of headroom after it emits XOFF. OS serial drivers buffer kilobytes, so a naive `write()` of the whole file could keep transmitting long after XOFF. Therefore the send engine writes **one byte at a time followed by `tcdrain()`**, polling for XOFF between bytes. At ≤4800 baud the syscall overhead is irrelevant (≤480 cps) and this gives a worst-case XOFF response of one character — 64× better than required.
4. **Text vs binary.** Default is text mode: on send, lone LF → CR LF (the calculator's line terminator) and a terminating 0x1A (EOF) is appended if missing; on receive, CR is dropped and 0x1A terminates the transfer. `-b` gives a raw 8-bit path (no conversion, no EOF handling) — note the deep dive's warning that with `busy=B` the link is not 8-bit clean (0x11/0x13 are consumed by the calculator's ISR).
5. **Testing strategy.** A `posix_openpt` harness plays the calculator on the pty master: it can count received bytes, inject XOFF/XON at scripted points, and replay canned SAVE output. Engines are tested against it with generous timing margins. `make check` runs everything; real-hardware smoke tests with the FTDI adapter are a documented manual procedure (final task).

## File Structure

```
tools/rs232/
├── Makefile          # all / check / install / clean; POSIX-friendly
├── README.md         # comprehensive usage, wiring, troubleshooting
├── commstr.h/.c      # comm-string parsing (pure, no I/O)
├── siso.h/.c         # SI/SO shift codec (pure)
├── serial.h/.c       # open/configure port: termios + DTR/RTS
├── sendloop.h/.c     # paced, XOFF-honouring transmit engine
├── recvloop.h/.c     # buffered, XOFF-emitting receive engine
├── fxsend.c          # CLI front-end (send)
├── fxrecv.c          # CLI front-end (receive)
├── fxsend.1          # man page
├── fxrecv.1          # man page
└── tests/
    ├── check.h       # tiny assert framework
    ├── ptyharness.h/.c  # posix_openpt fake calculator
    ├── test_commstr.c
    ├── test_siso.c
    ├── test_sendloop.c
    └── test_recvloop.c
```

---

### Task 1: Scaffold + comm-string parser

**Files:**
- Create: `tools/rs232/commstr.h`, `tools/rs232/commstr.c`
- Create: `tools/rs232/tests/check.h`, `tools/rs232/tests/test_commstr.c`
- Create: `tools/rs232/Makefile`

**Interfaces:**
- Produces: `comm_params` struct, `void commstr_defaults(comm_params *p)`, `int commstr_parse(const char *s, comm_params *p, char *err, size_t errlen)` (0 = ok, -1 = error with message in `err`). All later tasks consume `comm_params`.

- [ ] **Step 1: Write the test framework and failing parser tests**

`tools/rs232/tests/check.h`:
```c
#ifndef CHECK_H
#define CHECK_H
#include <stdio.h>
#include <stdlib.h>
static int check_failures = 0;
#define CHECK(cond) do { \
    if (!(cond)) { \
        fprintf(stderr, "FAIL %s:%d: %s\n", __FILE__, __LINE__, #cond); \
        check_failures++; \
    } \
} while (0)
#define CHECK_DONE() do { \
    if (check_failures) { fprintf(stderr, "%d failure(s)\n", check_failures); exit(1); } \
    printf("OK %s\n", __FILE__); exit(0); \
} while (0)
#endif
```

`tools/rs232/tests/test_commstr.c`:
```c
#include <string.h>
#include "../commstr.h"
#include "check.h"

int main(void)
{
    comm_params p;
    char err[128];

    /* Defaults are the calculator's power-on defaults: 2,E,8,1,N,N,N,B,N */
    commstr_defaults(&p);
    CHECK(p.baud == 300);
    CHECK(p.parity == 'E');
    CHECK(p.databits == 8);
    CHECK(p.stopbits == 1);
    CHECK(p.cs == 0 && p.ds == 0 && p.cd == 0);
    CHECK(p.busy == 1);
    CHECK(p.siso == 0);

    /* Full string, with and without COM0: prefix, case-insensitive letters */
    commstr_defaults(&p);
    CHECK(commstr_parse("COM0:6,N,8,1,C,D,C,N,N", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'N');
    CHECK(p.cs == 1 && p.ds == 1 && p.cd == 1);
    CHECK(p.busy == 0 && p.siso == 0);

    commstr_defaults(&p);
    CHECK(commstr_parse("6,e,7,2,n,n,n,b,s", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'E' && p.databits == 7);
    CHECK(p.stopbits == 2 && p.busy == 1 && p.siso == 1);

    /* All six speed digits */
    {
        static const int want[6] = { 150, 300, 600, 1200, 2400, 4800 };
        char s[2];
        int i;
        for (i = 0; i < 6; i++) {
            s[0] = (char)('1' + i); s[1] = '\0';
            commstr_defaults(&p);
            CHECK(commstr_parse(s, &p, err, sizeof err) == 0);
            CHECK(p.baud == want[i]);
        }
    }

    /* Omitted trailing fields keep defaults; empty fields keep defaults */
    commstr_defaults(&p);
    CHECK(commstr_parse("6", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'E' && p.busy == 1);
    commstr_defaults(&p);
    CHECK(commstr_parse("6,,7", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'E' && p.databits == 7);

    /* Rejections: bad speed, bad letters, too many fields, junk */
    commstr_defaults(&p);
    CHECK(commstr_parse("7", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("0", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,X", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,9", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,8,3", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,8,1,Q", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,8,1,N,N,N,B,N,N", &p, err, sizeof err) == -1);
    CHECK(err[0] != '\0');

    /* SI/SO only valid with 7 data bits (matches the manual) */
    commstr_defaults(&p);
    CHECK(commstr_parse("2,E,8,1,N,N,N,B,S", &p, err, sizeof err) == -1);

    CHECK_DONE();
}
```

`tools/rs232/Makefile`:
```make
# RS-232C utilities for the Casio FX-870P / VX-4.
# POSIX make + c89-friendly. Override CC/CFLAGS for odd platforms:
#   Tru64:  make CC=cc CFLAGS="-O"
CC      ?= cc
CFLAGS  ?= -O2 -Wall -Wextra
PREFIX  ?= /usr/local

CORE_OBJS = commstr.o siso.o serial.o sendloop.o recvloop.o

all: fxsend fxrecv

fxsend: fxsend.o $(CORE_OBJS)
	$(CC) $(CFLAGS) -o $@ fxsend.o $(CORE_OBJS)

fxrecv: fxrecv.o $(CORE_OBJS)
	$(CC) $(CFLAGS) -o $@ fxrecv.o $(CORE_OBJS)

.c.o:
	$(CC) $(CFLAGS) -c -o $@ $<

# ---- tests -------------------------------------------------------------
TESTS = tests/test_commstr tests/test_siso tests/test_sendloop tests/test_recvloop

tests/test_commstr: tests/test_commstr.c commstr.o
	$(CC) $(CFLAGS) -o $@ tests/test_commstr.c commstr.o
tests/test_siso: tests/test_siso.c siso.o
	$(CC) $(CFLAGS) -o $@ tests/test_siso.c siso.o
tests/test_sendloop: tests/test_sendloop.c tests/ptyharness.c sendloop.o serial.o commstr.o siso.o
	$(CC) $(CFLAGS) -o $@ tests/test_sendloop.c tests/ptyharness.c sendloop.o serial.o commstr.o siso.o
tests/test_recvloop: tests/test_recvloop.c tests/ptyharness.c recvloop.o serial.o commstr.o siso.o
	$(CC) $(CFLAGS) -o $@ tests/test_recvloop.c tests/ptyharness.c recvloop.o serial.o commstr.o siso.o

check: $(TESTS)
	@for t in $(TESTS); do ./$$t || exit 1; done

install: all
	mkdir -p $(DESTDIR)$(PREFIX)/bin $(DESTDIR)$(PREFIX)/share/man/man1
	cp fxsend fxrecv $(DESTDIR)$(PREFIX)/bin/
	cp fxsend.1 fxrecv.1 $(DESTDIR)$(PREFIX)/share/man/man1/

clean:
	rm -f *.o fxsend fxrecv $(TESTS)

.PHONY: all check install clean
```
(Note: until later tasks exist, `make check` builds only `tests/test_commstr`; run it directly.)

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd tools/rs232 && make tests/test_commstr && ./tests/test_commstr`
Expected: compile failure — `commstr.h: No such file or directory`.

- [ ] **Step 3: Implement the parser**

`tools/rs232/commstr.h`:
```c
#ifndef COMMSTR_H
#define COMMSTR_H
#include <stddef.h>

/* Parsed calculator comm string: [COM0:]speed,parity,data,stop,CS,DS,CD,busy,code
 * Semantics documented in docs/serial-comms-deep-dive.html §3. */
typedef struct {
    int  baud;      /* 150,300,600,1200,2400,4800 */
    char parity;    /* 'N','E','O' */
    int  databits;  /* 7 or 8 */
    int  stopbits;  /* 1 or 2 */
    int  cs;        /* 1 = calc waits for CTS -> we assert RTS */
    int  ds;        /* 1 = calc waits for DSR -> we assert DTR */
    int  cd;        /* 1 = calc requires DCD (wiring concern only) */
    int  busy;      /* 1 = XON/XOFF flow control */
    int  siso;      /* 1 = SI/SO shift codes (7-bit data only) */
} comm_params;

void commstr_defaults(comm_params *p);
int  commstr_parse(const char *s, comm_params *p, char *err, size_t errlen);

#endif
```

`tools/rs232/commstr.c`:
```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include "commstr.h"

void commstr_defaults(comm_params *p)
{
    /* Calculator power-on defaults: 2,E,8,1,N,N,N,B,N */
    p->baud = 300; p->parity = 'E'; p->databits = 8; p->stopbits = 1;
    p->cs = 0; p->ds = 0; p->cd = 0; p->busy = 1; p->siso = 0;
}

static int fail(char *err, size_t errlen, const char *msg)
{
    if (errlen > 0) { strncpy(err, msg, errlen - 1); err[errlen - 1] = '\0'; }
    return -1;
}

/* Letter-flag field: set-letter -> 1, 'N' -> 0, empty -> keep default. */
static int flagfield(const char *f, size_t n, char setletter, int *out,
                     char *err, size_t errlen)
{
    if (n == 0) return 0;
    if (n != 1) return fail(err, errlen, "flag field must be one letter");
    if (toupper((unsigned char)f[0]) == setletter) { *out = 1; return 0; }
    if (toupper((unsigned char)f[0]) == 'N')       { *out = 0; return 0; }
    return fail(err, errlen, "bad flag letter (expected set-letter or N)");
}

int commstr_parse(const char *s, comm_params *p, char *err, size_t errlen)
{
    static const int bauds[6] = { 150, 300, 600, 1200, 2400, 4800 };
    const char *field[9];
    size_t flen[9];
    int nfields = 0;
    const char *q;

    if (errlen > 0) err[0] = '\0';
    if (strncasecmp(s, "COM0:", 5) == 0) s += 5;

    /* Split on commas; empty fields allowed. */
    q = s;
    for (;;) {
        const char *comma = strchr(q, ',');
        if (nfields == 9) return fail(err, errlen, "too many fields (max 9)");
        field[nfields] = q;
        flen[nfields] = comma ? (size_t)(comma - q) : strlen(q);
        nfields++;
        if (!comma) break;
        q = comma + 1;
    }

    /* 1: speed digit 1-6 */
    if (flen[0] == 1 && field[0][0] >= '1' && field[0][0] <= '6')
        p->baud = bauds[field[0][0] - '1'];
    else if (flen[0] != 0)
        return fail(err, errlen, "speed must be a digit 1-6");

    /* 2: parity N/E/O */
    if (nfields > 1 && flen[1] > 0) {
        char c = (char)toupper((unsigned char)field[1][0]);
        if (flen[1] != 1 || (c != 'N' && c != 'E' && c != 'O'))
            return fail(err, errlen, "parity must be N, E or O");
        p->parity = c;
    }
    /* 3: data bits 7/8 */
    if (nfields > 2 && flen[2] > 0) {
        if (flen[2] != 1 || (field[2][0] != '7' && field[2][0] != '8'))
            return fail(err, errlen, "data bits must be 7 or 8");
        p->databits = field[2][0] - '0';
    }
    /* 4: stop bits 1/2 */
    if (nfields > 3 && flen[3] > 0) {
        if (flen[3] != 1 || (field[3][0] != '1' && field[3][0] != '2'))
            return fail(err, errlen, "stop bits must be 1 or 2");
        p->stopbits = field[3][0] - '0';
    }
    /* 5-9: CS, DS, CD, busy, code */
    if (nfields > 4 && flagfield(field[4], flen[4], 'C', &p->cs,   err, errlen)) return -1;
    if (nfields > 5 && flagfield(field[5], flen[5], 'D', &p->ds,   err, errlen)) return -1;
    if (nfields > 6 && flagfield(field[6], flen[6], 'C', &p->cd,   err, errlen)) return -1;
    if (nfields > 7 && flagfield(field[7], flen[7], 'B', &p->busy, err, errlen)) return -1;
    if (nfields > 8 && flagfield(field[8], flen[8], 'S', &p->siso, err, errlen)) return -1;

    if (p->siso && p->databits != 8 - 1)
        ; /* fallthrough check below */
    if (p->siso && p->databits != 7)
        return fail(err, errlen, "code=S requires 7 data bits");
    return 0;
}
```
(`strncasecmp` is POSIX via `<strings.h>` — add `#include <strings.h>`.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd tools/rs232 && make tests/test_commstr && ./tests/test_commstr`
Expected: `OK tests/test_commstr.c`

- [ ] **Step 5: Clean up the redundant double-check in `commstr_parse`** (the dead `if (p->siso && p->databits != 8 - 1)` line) and re-run the test. Expected: still `OK`.

- [ ] **Step 6: Commit**

```bash
git add tools/rs232/Makefile tools/rs232/commstr.h tools/rs232/commstr.c tools/rs232/tests/check.h tools/rs232/tests/test_commstr.c
git commit -m "feat(rs232): comm-string parser with calculator defaults"
```

---

### Task 2: SI/SO shift codec

**Files:**
- Create: `tools/rs232/siso.h`, `tools/rs232/siso.c`
- Create: `tools/rs232/tests/test_siso.c`

**Interfaces:**
- Produces: `siso_state` struct; `void siso_init(siso_state *st)`; `size_t siso_encode(siso_state *st, const unsigned char *in, size_t n, unsigned char *out)` (out must hold 2n bytes); `size_t siso_decode(siso_state *st, const unsigned char *in, size_t n, unsigned char *out)` (out must hold n bytes). Consumed by Tasks 4 and 5.

- [ ] **Step 1: Write failing tests**

`tools/rs232/tests/test_siso.c`:
```c
#include <string.h>
#include "../siso.h"
#include "check.h"

int main(void)
{
    siso_state st;
    unsigned char out[64];
    size_t n;

    /* Pure 7-bit data passes through untouched (starts in SI state) */
    siso_init(&st);
    n = siso_encode(&st, (const unsigned char *)"ABC", 3, out);
    CHECK(n == 3 && memcmp(out, "ABC", 3) == 0);

    /* High byte: SO (0x0E) prefix, top bit stripped; return to low: SI (0x0F) */
    siso_init(&st);
    {
        unsigned char in[3]; in[0] = 'A'; in[1] = 0xC1; in[2] = 'B';
        n = siso_encode(&st, in, 3, out);
        CHECK(n == 5);
        CHECK(out[0] == 'A' && out[1] == 0x0E && out[2] == 0x41);
        CHECK(out[3] == 0x0F && out[4] == 'B');
    }

    /* Consecutive high bytes share one SO */
    siso_init(&st);
    {
        unsigned char in[2]; in[0] = 0x80; in[1] = 0xFF;
        n = siso_encode(&st, in, 2, out);
        CHECK(n == 3 && out[0] == 0x0E && out[1] == 0x00 && out[2] == 0x7F);
    }

    /* Decode inverts encode, state carried across calls */
    siso_init(&st);
    {
        unsigned char enc[5];
        unsigned char dec[8];
        siso_state d;
        enc[0] = 'A'; enc[1] = 0x0E; enc[2] = 0x41; enc[3] = 0x0F; enc[4] = 'B';
        siso_init(&d);
        n = siso_decode(&d, enc, 2, dec);          /* 'A', SO */
        CHECK(n == 1 && dec[0] == 'A');
        n = siso_decode(&d, enc + 2, 3, dec);      /* 0x41 (shifted), SI, 'B' */
        CHECK(n == 2 && dec[0] == 0xC1 && dec[1] == 'B');
    }

    CHECK_DONE();
}
```

- [ ] **Step 2: Run to verify failure**

Run: `cd tools/rs232 && make tests/test_siso && ./tests/test_siso`
Expected: compile failure — `siso.h` missing.

- [ ] **Step 3: Implement**

`tools/rs232/siso.h`:
```c
#ifndef SISO_H
#define SISO_H
#include <stddef.h>

/* SI/SO 8-bit-over-7-bit shift coding (COM0 code=S, 7 data bits).
 * SO (0x0E) enters shifted mode: following bytes have bit7 implied set.
 * SI (0x0F) returns to unshifted. Matches ROM behaviour, deep-dive §4/§5. */
typedef struct { int shifted; } siso_state;

void   siso_init(siso_state *st);
size_t siso_encode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out);   /* out: at least 2n bytes */
size_t siso_decode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out);   /* out: at least n bytes */

#endif
```

`tools/rs232/siso.c`:
```c
#include "siso.h"

#define SO 0x0E
#define SI 0x0F

void siso_init(siso_state *st) { st->shifted = 0; }

size_t siso_encode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out)
{
    size_t i, o = 0;
    for (i = 0; i < n; i++) {
        int high = (in[i] & 0x80) != 0;
        if (high && !st->shifted)      { out[o++] = SO; st->shifted = 1; }
        else if (!high && st->shifted) { out[o++] = SI; st->shifted = 0; }
        out[o++] = (unsigned char)(in[i] & 0x7F);
    }
    return o;
}

size_t siso_decode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out)
{
    size_t i, o = 0;
    for (i = 0; i < n; i++) {
        if (in[i] == SO)      st->shifted = 1;
        else if (in[i] == SI) st->shifted = 0;
        else out[o++] = (unsigned char)(st->shifted ? (in[i] | 0x80) : in[i]);
    }
    return o;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd tools/rs232 && make tests/test_siso && ./tests/test_siso`
Expected: `OK tests/test_siso.c`

- [ ] **Step 5: Commit**

```bash
git add tools/rs232/siso.h tools/rs232/siso.c tools/rs232/tests/test_siso.c
git commit -m "feat(rs232): SI/SO shift codec for code=S mode"
```

---

### Task 3: Serial port layer

**Files:**
- Create: `tools/rs232/serial.h`, `tools/rs232/serial.c`
- Create: `tools/rs232/tests/ptyharness.h`, `tools/rs232/tests/ptyharness.c`

**Interfaces:**
- Consumes: `comm_params` (Task 1).
- Produces: `int serial_open(const char *dev, const comm_params *p, char *err, size_t errlen)` returning an fd (or -1); `void msleep(int ms)`. Test-side: `int pty_open(char slavepath[], size_t pathlen)` returning the master fd and writing the slave device path. Consumed by Tasks 4–7.

- [ ] **Step 1: Write the pty harness and a failing round-trip test** (temporarily appended to `test_commstr`? No — make it a real file now so Tasks 4/5 reuse it; the smoke assertions live in `test_sendloop.c` later, so here we only compile-check the harness with a tiny self-test main guarded by `PTYHARNESS_MAIN`).

`tools/rs232/tests/ptyharness.h`:
```c
#ifndef PTYHARNESS_H
#define PTYHARNESS_H
#include <stddef.h>

/* Open a pseudo-terminal pair. Returns master fd, or -1.
 * Writes the slave device path into slavepath (the "calculator" cable end:
 * pass it to serial_open). POSIX.1-2001: posix_openpt/grantpt/unlockpt. */
int pty_open(char *slavepath, size_t pathlen);

/* Read up to n bytes from fd with a timeout (ms). Returns bytes read,
 * 0 on timeout, -1 on error. */
int timed_read(int fd, unsigned char *buf, size_t n, int timeout_ms);

#endif
```

`tools/rs232/tests/ptyharness.c`:
```c
#define _XOPEN_SOURCE 600
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/select.h>
#include <sys/time.h>
#include "ptyharness.h"

int pty_open(char *slavepath, size_t pathlen)
{
    const char *name;
    int m = posix_openpt(O_RDWR | O_NOCTTY);
    if (m < 0) return -1;
    if (grantpt(m) < 0 || unlockpt(m) < 0) { close(m); return -1; }
    name = ptsname(m);
    if (!name || strlen(name) >= pathlen) { close(m); return -1; }
    strcpy(slavepath, name);
    return m;
}

int timed_read(int fd, unsigned char *buf, size_t n, int timeout_ms)
{
    fd_set rfds;
    struct timeval tv;
    int r;
    FD_ZERO(&rfds);
    FD_SET(fd, &rfds);
    tv.tv_sec = timeout_ms / 1000;
    tv.tv_usec = (timeout_ms % 1000) * 1000;
    r = select(fd + 1, &rfds, NULL, NULL, &tv);
    if (r <= 0) return r;
    return (int)read(fd, buf, n);
}
```

- [ ] **Step 2: Implement the serial layer**

`tools/rs232/serial.h`:
```c
#ifndef SERIAL_H
#define SERIAL_H
#include <stddef.h>
#include "commstr.h"

/* Open and configure the serial device per the calculator comm string.
 * Raw mode, VMIN=0/VTIME=0 (callers use select), DTR+RTS asserted where
 * the platform allows. Returns fd, or -1 with a message in err. */
int serial_open(const char *dev, const comm_params *p, char *err, size_t errlen);

void msleep(int ms);

#endif
```

`tools/rs232/serial.c`:
```c
#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <termios.h>
#include <time.h>
#include <sys/ioctl.h>
#include "serial.h"

static speed_t baud_const(int baud)
{
    switch (baud) {
    case 150:  return B150;
    case 300:  return B300;
    case 600:  return B600;
    case 1200: return B1200;
    case 2400: return B2400;
    case 4800: return B4800;
    default:   return B0;
    }
}

int serial_open(const char *dev, const comm_params *p, char *err, size_t errlen)
{
    struct termios t;
    speed_t sp = baud_const(p->baud);
    int fd;

    if (sp == B0) { snprintf(err, errlen, "unsupported baud %d", p->baud); return -1; }

    fd = open(dev, O_RDWR | O_NOCTTY);
    if (fd < 0) { snprintf(err, errlen, "%s: %s", dev, strerror(errno)); return -1; }

    if (tcgetattr(fd, &t) < 0) {
        snprintf(err, errlen, "tcgetattr: %s", strerror(errno));
        close(fd); return -1;
    }

    /* Raw 8-bit-transparent mode, no kernel flow control: XON/XOFF is
     * handled explicitly by the engines so it can be logged and paced. */
    t.c_iflag = IGNPAR;               /* also disables IXON/IXOFF/ICRNL */
    t.c_oflag = 0;
    t.c_lflag = 0;
    t.c_cflag = CLOCAL | CREAD;
    t.c_cflag |= (p->databits == 7) ? CS7 : CS8;
    if (p->parity != 'N') {
        t.c_cflag |= PARENB;
        if (p->parity == 'O') t.c_cflag |= PARODD;
    }
    if (p->stopbits == 2) t.c_cflag |= CSTOPB;
    t.c_cc[VMIN]  = 0;
    t.c_cc[VTIME] = 0;
    cfsetispeed(&t, sp);
    cfsetospeed(&t, sp);

    if (tcsetattr(fd, TCSANOW, &t) < 0) {
        snprintf(err, errlen, "tcsetattr: %s", strerror(errno));
        close(fd); return -1;
    }

#ifdef TIOCMBIS
    /* Assert DTR (-> calc DSR) and RTS (-> calc CTS) so DS=D / CS=C opens
     * on the calculator see a ready peer. Static, per deep-dive §4: the
     * calculator never toggles its own outputs either. Harmless if unwired
     * or unsupported (ptys): errors ignored. */
    {
        int bits = TIOCM_DTR | TIOCM_RTS;
        ioctl(fd, TIOCMBIS, &bits);
    }
#endif
    tcflush(fd, TCIOFLUSH);
    return fd;
}

void msleep(int ms)
{
    struct timespec ts;
    ts.tv_sec = ms / 1000;
    ts.tv_nsec = (long)(ms % 1000) * 1000000L;
    nanosleep(&ts, NULL);
}
```

- [ ] **Step 3: Compile-check both files**

Run: `cd tools/rs232 && make serial.o && $(CC:-cc) -O2 -Wall -c tests/ptyharness.c -o /tmp/ptyharness.o` (or simply `cc -Wall -c tests/ptyharness.c -o /dev/null`)
Expected: clean compile, no warnings.

- [ ] **Step 4: Commit**

```bash
git add tools/rs232/serial.h tools/rs232/serial.c tools/rs232/tests/ptyharness.h tools/rs232/tests/ptyharness.c
git commit -m "feat(rs232): serial port layer and pty test harness"
```

---

### Task 4: Send engine — pacing + XOFF honouring

**Files:**
- Create: `tools/rs232/sendloop.h`, `tools/rs232/sendloop.c`
- Create: `tools/rs232/tests/test_sendloop.c`

**Interfaces:**
- Consumes: `comm_params`, `serial_open`, `msleep`, `siso_*`, `pty_open`, `timed_read`.
- Produces: `send_opts` struct and `int send_stream(int serfd, int infd, const send_opts *o)` (0 ok, -1 error). Consumed by Task 6 (`fxsend.c`).

- [ ] **Step 1: Write failing tests**

`tools/rs232/tests/test_sendloop.c`:
```c
#define _XOPEN_SOURCE 600
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/time.h>
#include "../sendloop.h"
#include "../serial.h"
#include "../commstr.h"
#include "ptyharness.h"
#include "check.h"

static long now_ms(void)
{
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000L + tv.tv_usec / 1000;
}

/* Feed `data` through send_stream via a pipe; capture what arrives at the
 * pty master ("calculator" side). */
static int run_send(int master, int serfd, const char *data,
                    const send_opts *o, unsigned char *cap, size_t caplen)
{
    int p[2];
    size_t got = 0;
    int rc;
    CHECK(pipe(p) == 0);
    CHECK(write(p[1], data, strlen(data)) == (ssize_t)strlen(data));
    close(p[1]);
    rc = send_stream(serfd, p[0], o);
    close(p[0]);
    for (;;) {
        int n = timed_read(master, cap + got, caplen - got, 200);
        if (n <= 0) break;
        got += (size_t)n;
    }
    cap[got] = 0;
    return rc == 0 ? (int)got : -1;
}

int main(void)
{
    char slave[128];
    unsigned char cap[4096];
    comm_params cp;
    send_opts o;
    int master, serfd, n;

    master = pty_open(slave, sizeof slave);
    CHECK(master >= 0);
    commstr_defaults(&cp);
    {
        char err[128];
        serfd = serial_open(slave, &cp, err, sizeof err);
        CHECK(serfd >= 0);
    }

    /* Text mode: LF -> CRLF, EOF 0x1A appended */
    memset(&o, 0, sizeof o);
    o.text_mode = 1; o.honor_xonxoff = 1;
    n = run_send(master, serfd, "10 A\n20 B\n", &o, cap, sizeof cap - 1);
    CHECK(n == (int)strlen("10 A\r\n20 B\r\n") + 1);
    CHECK(memcmp(cap, "10 A\r\n20 B\r\n\x1a", (size_t)n) == 0);

    /* Existing CRLF not doubled; existing trailing 0x1A not doubled */
    n = run_send(master, serfd, "10 A\r\n\x1a", &o, cap, sizeof cap - 1);
    CHECK(n == 7 && memcmp(cap, "10 A\r\n\x1a", 7) == 0);

    /* Binary mode: no conversion, no EOF append */
    memset(&o, 0, sizeof o);
    n = run_send(master, serfd, "A\nB", &o, cap, sizeof cap - 1);
    CHECK(n == 3 && memcmp(cap, "A\nB", 3) == 0);

    /* Per-line delay: 2 lines with 80ms line delay takes >= 160ms */
    memset(&o, 0, sizeof o);
    o.text_mode = 1; o.line_delay_ms = 80;
    {
        long t0 = now_ms();
        n = run_send(master, serfd, "A\nB\n", &o, cap, sizeof cap - 1);
        CHECK(n > 0);
        CHECK(now_ms() - t0 >= 160);
    }

    /* XOFF honoured: inject XOFF, verify pause, XON resumes.
     * Send 30 bytes; after reading 5 on the master, send XOFF, wait 300ms,
     * confirm few further bytes arrived (allow <=2 in flight), send XON,
     * confirm the rest arrives. */
    memset(&o, 0, sizeof o);
    o.honor_xonxoff = 1;
    {
        int p[2];
        size_t got = 0;
        int i, r;
        unsigned char xoff = 0x13, xon = 0x11;
        char data[31];
        pid_t unused = 0; (void)unused;
        for (i = 0; i < 30; i++) data[i] = (char)('a' + (i % 26));
        data[30] = 0;
        CHECK(pipe(p) == 0);
        CHECK(write(p[1], data, 30) == 30);
        close(p[1]);
        /* run send_stream in a child so we can script the master side */
        r = fork();
        CHECK(r >= 0);
        if (r == 0) {
            int rc = send_stream(serfd, p[0], &o);
            _exit(rc == 0 ? 0 : 1);
        }
        close(p[0]);
        while (got < 5) {
            int k = timed_read(master, cap + got, 5 - got, 2000);
            CHECK(k > 0);
            got += (size_t)k;
        }
        CHECK(write(master, &xoff, 1) == 1);
        msleep(300);
        {
            size_t during = 0;
            int k;
            while ((k = timed_read(master, cap + got + during, 64, 50)) > 0)
                during += (size_t)k;
            CHECK(during <= 2);      /* at most a byte or two in flight */
            got += during;
        }
        CHECK(write(master, &xon, 1) == 1);
        while (got < 30) {
            int k = timed_read(master, cap + got, 30 - got, 2000);
            CHECK(k > 0);
            got += (size_t)k;
        }
        CHECK(memcmp(cap, data, 30) == 0);
        {
            int status = 0;
            wait(&status);
            CHECK(status == 0);
        }
    }

    CHECK_DONE();
}
```
(Add `#include <sys/wait.h>` at the top.)

- [ ] **Step 2: Run to verify failure**

Run: `cd tools/rs232 && make tests/test_sendloop && ./tests/test_sendloop`
Expected: compile failure — `sendloop.h` missing.

- [ ] **Step 3: Implement the engine**

`tools/rs232/sendloop.h`:
```c
#ifndef SENDLOOP_H
#define SENDLOOP_H

typedef struct {
    int char_delay_ms;   /* pause after every byte (0 = none) */
    int line_delay_ms;   /* extra pause after each LF (0 = none) */
    int text_mode;       /* 1 = LF->CRLF and append 0x1A if missing */
    int honor_xonxoff;   /* 1 = pause on received 0x13, resume on 0x11 */
    int use_siso;        /* 1 = SI/SO-encode (7-bit links) */
    int verbose;         /* 1 = progress on stderr */
} send_opts;

/* Stream infd -> serfd with pacing and flow control. Writes one byte at a
 * time followed by tcdrain() so a received XOFF halts output within one
 * character time (the calculator guarantees only 64 bytes of headroom
 * after XOFF -- deep-dive report section 5). Returns 0, or -1 (errno). */
int send_stream(int serfd, int infd, const send_opts *o);

#endif
```

`tools/rs232/sendloop.c`:
```c
#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <termios.h>
#include <sys/select.h>
#include "sendloop.h"
#include "serial.h"
#include "siso.h"

/* Drain any bytes the calculator sent us; track XON/XOFF. Returns 0,
 * or -1 on read error. *paused is updated. */
static int poll_incoming(int serfd, int honor, int *paused, int verbose)
{
    unsigned char b;
    for (;;) {
        ssize_t n = read(serfd, &b, 1);
        if (n == 0) return 0;
        if (n < 0) return (errno == EAGAIN || errno == EWOULDBLOCK) ? 0 : -1;
        if (honor && b == 0x13) {
            *paused = 1;
            if (verbose) fprintf(stderr, "fxsend: XOFF received, pausing\n");
        } else if (honor && b == 0x11) {
            *paused = 0;
            if (verbose) fprintf(stderr, "fxsend: XON received, resuming\n");
        } else if (verbose) {
            fprintf(stderr, "fxsend: unexpected byte 0x%02X from calculator\n", b);
        }
    }
}

/* Block until not paused, servicing incoming bytes. */
static int wait_unpaused(int serfd, int honor, int *paused, int verbose)
{
    while (*paused) {
        fd_set rfds;
        struct timeval tv;
        FD_ZERO(&rfds);
        FD_SET(serfd, &rfds);
        tv.tv_sec = 0; tv.tv_usec = 200000;
        if (select(serfd + 1, &rfds, NULL, NULL, &tv) < 0 && errno != EINTR)
            return -1;
        if (poll_incoming(serfd, honor, paused, verbose) < 0) return -1;
    }
    return 0;
}

static int put_byte(int serfd, unsigned char b, const send_opts *o, int *paused)
{
    if (poll_incoming(serfd, o->honor_xonxoff, paused, o->verbose) < 0) return -1;
    if (wait_unpaused(serfd, o->honor_xonxoff, paused, o->verbose) < 0) return -1;
    if (write(serfd, &b, 1) != 1) return -1;
    if (tcdrain(serfd) < 0 && errno != EINVAL) return -1; /* EINVAL: ptys on some OSes */
    if (o->char_delay_ms > 0) msleep(o->char_delay_ms);
    if (b == 0x0A && o->line_delay_ms > 0) msleep(o->line_delay_ms);
    return 0;
}

int send_stream(int serfd, int infd, const send_opts *o)
{
    unsigned char inbuf[512];
    unsigned char enc[2];
    siso_state ss;
    int paused = 0;
    int prev = -1;        /* previous *input* byte (for CRLF logic) */
    int last_sent = -1;
    long total = 0;
    ssize_t n;

    siso_init(&ss);

    /* Serial fd must be non-blocking for poll_incoming. */
    fcntl(serfd, F_SETFL, fcntl(serfd, F_GETFL, 0) | O_NONBLOCK);

    while ((n = read(infd, inbuf, sizeof inbuf)) > 0) {
        ssize_t i;
        for (i = 0; i < n; i++) {
            unsigned char b = inbuf[i];
            /* Text mode: bare LF becomes CR LF */
            if (o->text_mode && b == 0x0A && prev != 0x0D) {
                unsigned char cr = 0x0D;
                size_t k, m = o->use_siso ? siso_encode(&ss, &cr, 1, enc)
                                          : (enc[0] = cr, (size_t)1);
                for (k = 0; k < m; k++)
                    if (put_byte(serfd, enc[k], o, &paused) < 0) return -1;
                last_sent = 0x0D;
            }
            {
                size_t k, m = o->use_siso ? siso_encode(&ss, &b, 1, enc)
                                          : (enc[0] = b, (size_t)1);
                for (k = 0; k < m; k++)
                    if (put_byte(serfd, enc[k], o, &paused) < 0) return -1;
            }
            last_sent = b;
            prev = b;
            total++;
            if (o->verbose && (total % 256) == 0)
                fprintf(stderr, "fxsend: %ld bytes sent\n", total);
        }
    }
    if (n < 0) return -1;

    if (o->text_mode && last_sent != 0x1A) {
        if (put_byte(serfd, 0x1A, o, &paused) < 0) return -1;
        total++;
    }
    if (o->verbose) fprintf(stderr, "fxsend: done, %ld bytes\n", total);
    return 0;
}
```
(Add `#include <fcntl.h>`.)

- [ ] **Step 4: Run tests to verify pass**

Run: `cd tools/rs232 && make tests/test_sendloop && ./tests/test_sendloop`
Expected: `OK tests/test_sendloop.c` (takes ~1 s due to timing tests).

- [ ] **Step 5: Commit**

```bash
git add tools/rs232/sendloop.h tools/rs232/sendloop.c tools/rs232/tests/test_sendloop.c
git commit -m "feat(rs232): paced send engine honouring XOFF within one char"
```

---

### Task 5: Receive engine — buffering + XON/XOFF emission

**Files:**
- Create: `tools/rs232/recvloop.h`, `tools/rs232/recvloop.c`
- Create: `tools/rs232/tests/test_recvloop.c`

**Interfaces:**
- Consumes: `serial_open`, `msleep`, `siso_*`, `pty_open`, `timed_read`.
- Produces: `recv_opts` struct and `int recv_stream(int serfd, int outfd, const recv_opts *o)` (0 = clean end [0x1A or idle timeout], -1 = error). Consumed by Task 7 (`fxrecv.c`).

- [ ] **Step 1: Write failing tests**

`tools/rs232/tests/test_recvloop.c`:
```c
#define _XOPEN_SOURCE 600
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/wait.h>
#include "../recvloop.h"
#include "../serial.h"
#include "../commstr.h"
#include "ptyharness.h"
#include "check.h"

int main(void)
{
    char slave[128];
    comm_params cp;
    recv_opts o;
    int master, serfd;

    master = pty_open(slave, sizeof slave);
    CHECK(master >= 0);
    commstr_defaults(&cp);
    {
        char err[128];
        serfd = serial_open(slave, &cp, err, sizeof err);
        CHECK(serfd >= 0);
    }

    /* Text mode: CRLF -> LF, 0x1A terminates, 0x1A not written out */
    memset(&o, 0, sizeof o);
    o.text_mode = 1; o.emit_xonxoff = 1;
    {
        int p[2];
        unsigned char buf[64];
        ssize_t n;
        int r, status;
        CHECK(pipe(p) == 0);
        r = fork();
        CHECK(r >= 0);
        if (r == 0) {
            int rc;
            close(p[0]);
            rc = recv_stream(serfd, p[1], &o);
            _exit(rc == 0 ? 0 : 1);
        }
        close(p[1]);
        CHECK(write(master, "10 A\r\n20 B\r\n\x1a", 13) == 13);
        n = 0;
        for (;;) {
            ssize_t k = read(p[0], buf + n, sizeof buf - (size_t)n);
            if (k <= 0) break;
            n += k;
        }
        CHECK(n == (ssize_t)strlen("10 A\n20 B\n"));
        CHECK(memcmp(buf, "10 A\n20 B\n", (size_t)n) == 0);
        close(p[0]);
        wait(&status);
        CHECK(status == 0);
    }

    /* Idle timeout ends a transfer with no 0x1A (PRINT#1 output) */
    memset(&o, 0, sizeof o);
    o.text_mode = 0; o.idle_timeout_s = 1;
    {
        int p[2];
        unsigned char buf[16];
        ssize_t n;
        int r, status;
        CHECK(pipe(p) == 0);
        r = fork();
        CHECK(r >= 0);
        if (r == 0) {
            int rc;
            close(p[0]);
            rc = recv_stream(serfd, p[1], &o);
            _exit(rc == 0 ? 0 : 1);
        }
        close(p[1]);
        CHECK(write(master, "HELLO", 5) == 5);
        n = 0;
        for (;;) {
            ssize_t k = read(p[0], buf + n, sizeof buf - (size_t)n);
            if (k <= 0) break;
            n += k;
        }
        CHECK(n == 5 && memcmp(buf, "HELLO", 5) == 0);
        close(p[0]);
        wait(&status);
        CHECK(status == 0);        /* timeout is a clean end */
    }

    /* XOFF emitted when the output stalls: child receives into a pipe that
     * nobody drains; after the pipe+ring fill past the high-water mark the
     * engine must send XOFF on the serial fd. We use a tiny ring high-water
     * (via recv_opts.test_highwater) to trigger it quickly. */
    memset(&o, 0, sizeof o);
    o.emit_xonxoff = 1; o.test_highwater = 64; o.test_lowwater = 8;
    {
        int p[2];
        unsigned char b;
        int r, i, sawxoff = 0, status;
        CHECK(pipe(p) == 0);
        r = fork();
        CHECK(r >= 0);
        if (r == 0) {
            int rc;
            close(p[0]);          /* reader closed later by parent: engine sees EPIPE -> error exit ok */
            rc = recv_stream(serfd, p[1], &o);
            _exit(rc == 0 ? 0 : 1);
        }
        /* parent: don't read from p[0] yet -> child's writes fill the pipe */
        close(p[1]);
        for (i = 0; i < 100000 && !sawxoff; i++) {
            unsigned char junk[64];
            memset(junk, 'x', sizeof junk);
            if (write(master, junk, sizeof junk) < 0) break;
            while (timed_read(master, &b, 1, 10) == 1)
                if (b == 0x13) { sawxoff = 1; break; }
        }
        CHECK(sawxoff);
        /* drain the pipe -> engine should emit XON */
        {
            unsigned char drain[4096];
            int sawxon = 0, k;
            while (read(p[0], drain, sizeof drain) > 0) {
                while (timed_read(master, &b, 1, 20) == 1)
                    if (b == 0x11) { sawxon = 1; break; }
                if (sawxon) break;
            }
            CHECK(sawxon);
        }
        /* end the transfer */
        b = 0x1A;
        CHECK(write(master, &b, 1) == 1);
        {
            unsigned char drain[4096];
            while (read(p[0], drain, sizeof drain) > 0) ;
        }
        close(p[0]);
        wait(&status);
        (void)status;
    }

    CHECK_DONE();
}
```

- [ ] **Step 2: Run to verify failure**

Run: `cd tools/rs232 && make tests/test_recvloop && ./tests/test_recvloop`
Expected: compile failure — `recvloop.h` missing.

- [ ] **Step 3: Implement the engine**

`tools/rs232/recvloop.h`:
```c
#ifndef RECVLOOP_H
#define RECVLOOP_H

typedef struct {
    int text_mode;       /* 1 = drop CR, stop at 0x1A (not written out) */
    int emit_xonxoff;    /* 1 = send XOFF/XON around ring high/low water */
    int use_siso;        /* 1 = SI/SO-decode */
    int idle_timeout_s;  /* end transfer after N idle seconds (0 = never) */
    int verbose;
    int test_highwater;  /* tests only: override ring thresholds (0 = default) */
    int test_lowwater;
} recv_opts;

/* Stream serfd -> outfd. A ring buffer decouples serial reads from output
 * writes; when it passes the high-water mark, XOFF is sent to the
 * calculator (mirroring the ROM's own 192/32 thresholds on its 256-byte
 * buffer -- deep-dive report section 5), XON when drained below low water.
 * Returns 0 on clean end (0x1A in text mode, or idle timeout), -1 error. */
int recv_stream(int serfd, int outfd, const recv_opts *o);

#endif
```

`tools/rs232/recvloop.c`:
```c
#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/select.h>
#include "recvloop.h"
#include "siso.h"

#define RING_SIZE  8192
#define HIGH_WATER 6144
#define LOW_WATER  1024

typedef struct {
    unsigned char buf[RING_SIZE];
    size_t head, tail, count;
} ring;

static void ring_put(ring *r, unsigned char b)
{
    r->buf[r->head] = b;
    r->head = (r->head + 1) % RING_SIZE;
    r->count++;
}

int recv_stream(int serfd, int outfd, const recv_opts *o)
{
    ring r;
    siso_state ss;
    int throttled = 0, done = 0;
    long total = 0;
    int idle_ms = 0;
    int high = o->test_highwater ? o->test_highwater : HIGH_WATER;
    int low  = o->test_lowwater  ? o->test_lowwater  : LOW_WATER;

    memset(&r, 0, sizeof r);
    siso_init(&ss);
    fcntl(serfd, F_SETFL, fcntl(serfd, F_GETFL, 0) | O_NONBLOCK);
    fcntl(outfd, F_SETFL, fcntl(outfd, F_GETFL, 0) | O_NONBLOCK);

    while (!done || r.count > 0) {
        fd_set rfds, wfds;
        struct timeval tv;
        int maxfd = serfd;

        FD_ZERO(&rfds); FD_ZERO(&wfds);
        if (!done && r.count < RING_SIZE - 8) FD_SET(serfd, &rfds);
        if (r.count > 0) {
            FD_SET(outfd, &wfds);
            if (outfd > maxfd) maxfd = outfd;
        }
        tv.tv_sec = 0; tv.tv_usec = 100000;   /* 100 ms tick for idle timer */
        if (select(maxfd + 1, &rfds, &wfds, NULL, &tv) < 0) {
            if (errno == EINTR) continue;
            return -1;
        }

        if (FD_ISSET(serfd, &rfds)) {
            unsigned char in[256], dec[256];
            ssize_t n = read(serfd, in, sizeof in);
            if (n < 0 && errno != EAGAIN) return -1;
            if (n > 0) {
                size_t m, i;
                idle_ms = 0;
                m = o->use_siso ? siso_decode(&ss, in, (size_t)n, dec)
                                : (memcpy(dec, in, (size_t)n), (size_t)n);
                for (i = 0; i < m; i++) {
                    unsigned char b = dec[i];
                    if (o->text_mode && b == 0x0D) continue;
                    if (o->text_mode && b == 0x1A) { done = 1; break; }
                    ring_put(&r, b);
                    total++;
                }
            }
        } else if (!done) {
            idle_ms += 100;
            if (o->idle_timeout_s > 0 && idle_ms >= o->idle_timeout_s * 1000) {
                if (o->verbose)
                    fprintf(stderr, "fxrecv: idle timeout, ending transfer\n");
                done = 1;
            }
        }

        if (FD_ISSET(outfd, &wfds) && r.count > 0) {
            size_t chunk = r.count;
            ssize_t n;
            if (r.tail + chunk > RING_SIZE) chunk = RING_SIZE - r.tail;
            n = write(outfd, r.buf + r.tail, chunk);
            if (n < 0 && errno != EAGAIN) return -1;
            if (n > 0) {
                r.tail = (r.tail + (size_t)n) % RING_SIZE;
                r.count -= (size_t)n;
            }
        }

        if (o->emit_xonxoff) {
            if (!throttled && r.count >= (size_t)high) {
                unsigned char xoff = 0x13;
                if (write(serfd, &xoff, 1) == 1) {
                    throttled = 1;
                    if (o->verbose) fprintf(stderr, "fxrecv: XOFF sent\n");
                }
            } else if (throttled && r.count <= (size_t)low) {
                unsigned char xon = 0x11;
                if (write(serfd, &xon, 1) == 1) {
                    throttled = 0;
                    if (o->verbose) fprintf(stderr, "fxrecv: XON sent\n");
                }
            }
        }
    }
    if (o->verbose) fprintf(stderr, "fxrecv: done, %ld bytes\n", total);
    return 0;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd tools/rs232 && make tests/test_recvloop && ./tests/test_recvloop`
Expected: `OK tests/test_recvloop.c`

- [ ] **Step 5: Run the whole suite**

Run: `cd tools/rs232 && make check`
Expected: four `OK` lines, exit 0. (test_sendloop and test_recvloop require pty support; both macOS and Linux have it.)

- [ ] **Step 6: Commit**

```bash
git add tools/rs232/recvloop.h tools/rs232/recvloop.c tools/rs232/tests/test_recvloop.c
git commit -m "feat(rs232): receive engine with ring buffer and XON/XOFF emission"
```

---

### Task 6: CLI front-ends

**Files:**
- Create: `tools/rs232/fxsend.c`, `tools/rs232/fxrecv.c`

**Interfaces:**
- Consumes: everything above.
- Produces: the `fxsend` and `fxrecv` binaries.
  - `fxsend [-f file] [-d device] [-c commstring] [-C ms] [-L ms] [-b] [-v]`
  - `fxrecv [-f file] [-d device] [-c commstring] [-t seconds] [-b] [-v]`
  - Device resolution: `-d`, else `$FXPORT`, else error with a helpful message.
  - Exit codes: 0 success, 1 usage error, 2 I/O error.

- [ ] **Step 1: Implement `fxsend.c`**

```c
#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include "commstr.h"
#include "serial.h"
#include "sendloop.h"

static void usage(void)
{
    fprintf(stderr,
"usage: fxsend [-f file] [-d device] [-c commstring] [-C char_ms] [-L line_ms] [-b] [-v]\n"
"  -f file        file to send (default: standard input)\n"
"  -d device      serial device (default: $FXPORT)\n"
"  -c commstring  calculator comm string, e.g. 6,N,8,1,N,N,N,B,N\n"
"                 (default 2,E,8,1,N,N,N,B,N -- the calculator's default)\n"
"  -C ms          per-character delay, default 5\n"
"  -L ms          per-line delay after each line, default 100\n"
"  -b             binary mode: no LF->CRLF, no EOF byte appended\n"
"  -v             verbose progress on stderr\n"
"Receive on the calculator with e.g.:  LOAD \"COM0:6,N,8,1,N,N,N,B,N\"\n");
    exit(1);
}

int main(int argc, char **argv)
{
    const char *file = NULL, *device = getenv("FXPORT"), *cstr = NULL;
    comm_params cp;
    send_opts o;
    char err[256];
    int c, infd = 0, serfd, rc;

    memset(&o, 0, sizeof o);
    o.text_mode = 1;
    o.char_delay_ms = 5;
    o.line_delay_ms = 100;
    commstr_defaults(&cp);

    while ((c = getopt(argc, argv, "f:d:c:C:L:bvh")) != -1) {
        switch (c) {
        case 'f': file = optarg; break;
        case 'd': device = optarg; break;
        case 'c': cstr = optarg; break;
        case 'C': o.char_delay_ms = atoi(optarg); break;
        case 'L': o.line_delay_ms = atoi(optarg); break;
        case 'b': o.text_mode = 0; break;
        case 'v': o.verbose = 1; break;
        default: usage();
        }
    }
    if (optind != argc) usage();
    if (cstr && commstr_parse(cstr, &cp, err, sizeof err) < 0) {
        fprintf(stderr, "fxsend: bad comm string: %s\n", err);
        return 1;
    }
    if (!device) {
        fprintf(stderr, "fxsend: no device: use -d or set FXPORT "
                        "(e.g. /dev/cu.usbserial-XXXX)\n");
        return 1;
    }
    o.honor_xonxoff = cp.busy;
    o.use_siso = cp.siso;

    if (file) {
        infd = open(file, O_RDONLY);
        if (infd < 0) { perror(file); return 2; }
    }
    serfd = serial_open(device, &cp, err, sizeof err);
    if (serfd < 0) { fprintf(stderr, "fxsend: %s\n", err); return 2; }

    rc = send_stream(serfd, infd, &o);
    if (rc < 0) { perror("fxsend"); }
    close(serfd);
    if (file) close(infd);
    return rc < 0 ? 2 : 0;
}
```

- [ ] **Step 2: Implement `fxrecv.c`**

```c
#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include "commstr.h"
#include "serial.h"
#include "recvloop.h"

static void usage(void)
{
    fprintf(stderr,
"usage: fxrecv [-f file] [-d device] [-c commstring] [-t seconds] [-b] [-v]\n"
"  -f file        file to write (default: standard output)\n"
"  -d device      serial device (default: $FXPORT)\n"
"  -c commstring  calculator comm string, e.g. 6,N,8,1,N,N,N,B,N\n"
"                 (default 2,E,8,1,N,N,N,B,N -- the calculator's default)\n"
"  -t seconds     end after this many idle seconds (default 0 = wait for EOF)\n"
"  -b             binary mode: keep CR bytes, don't stop at 0x1A\n"
"  -v             verbose progress on stderr\n"
"Send from the calculator with e.g.:  SAVE \"COM0:6,N,8,1,N,N,N,B,N\"\n");
    exit(1);
}

int main(int argc, char **argv)
{
    const char *file = NULL, *device = getenv("FXPORT"), *cstr = NULL;
    comm_params cp;
    recv_opts o;
    char err[256];
    int c, outfd = 1, serfd, rc;

    memset(&o, 0, sizeof o);
    o.text_mode = 1;
    commstr_defaults(&cp);

    while ((c = getopt(argc, argv, "f:d:c:t:bvh")) != -1) {
        switch (c) {
        case 'f': file = optarg; break;
        case 'd': device = optarg; break;
        case 'c': cstr = optarg; break;
        case 't': o.idle_timeout_s = atoi(optarg); break;
        case 'b': o.text_mode = 0; break;
        case 'v': o.verbose = 1; break;
        default: usage();
        }
    }
    if (optind != argc) usage();
    if (cstr && commstr_parse(cstr, &cp, err, sizeof err) < 0) {
        fprintf(stderr, "fxrecv: bad comm string: %s\n", err);
        return 1;
    }
    if (!device) {
        fprintf(stderr, "fxrecv: no device: use -d or set FXPORT "
                        "(e.g. /dev/cu.usbserial-XXXX)\n");
        return 1;
    }
    o.emit_xonxoff = cp.busy;
    o.use_siso = cp.siso;
    if (!o.text_mode && o.idle_timeout_s == 0)
        o.idle_timeout_s = 5;   /* binary mode has no EOF marker */

    if (file) {
        outfd = open(file, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        if (outfd < 0) { perror(file); return 2; }
    }
    serfd = serial_open(device, &cp, err, sizeof err);
    if (serfd < 0) { fprintf(stderr, "fxrecv: %s\n", err); return 2; }

    rc = recv_stream(serfd, outfd, &o);
    if (rc < 0) perror("fxrecv");
    close(serfd);
    if (file) close(outfd);
    return rc < 0 ? 2 : 0;
}
```

- [ ] **Step 3: Build and smoke-test against a pty**

Run:
```bash
cd tools/rs232 && make
# usage errors work:
./fxsend -x 2>/dev/null; echo "exit=$?"          # expect exit=1
./fxsend </dev/null 2>&1 | head -1               # expect "no device" message
./fxsend -c 9 -d /dev/null 2>&1 | head -1        # expect "bad comm string"
```
Expected: exit 1 and the two error messages.

- [ ] **Step 4: End-to-end loopback test through two ptys**

Run (uses `socat` if installed, else skip — the pty unit tests already cover the engines):
```bash
socat -d -d pty,raw,echo=0 pty,raw,echo=0 &   # note the two /dev/ttys printed
sleep 1
printf '10 PRINT "HI"\n20 GOTO 10\n' | ./fxsend -d <ptyA> -C 0 -L 0 &
./fxrecv -d <ptyB> -t 2
```
Expected: fxrecv prints the two lines and exits 0.

- [ ] **Step 5: Commit**

```bash
git add tools/rs232/fxsend.c tools/rs232/fxrecv.c
git commit -m "feat(rs232): fxsend/fxrecv command-line front-ends"
```

---

### Task 7: Man pages, README, repo integration

**Files:**
- Create: `tools/rs232/fxsend.1`, `tools/rs232/fxrecv.1`
- Create: `tools/rs232/README.md`
- Modify: `README.md` (repository root — add a link in the tools/docs section)

- [ ] **Step 1: Write `fxsend.1`**

```roff
.TH FXSEND 1 "July 2026" "fx870p-emulator" "User Commands"
.SH NAME
fxsend \- send a program to a Casio FX-870P / VX-4 over RS-232C
.SH SYNOPSIS
.B fxsend
.RB [ \-f
.IR file ]
.RB [ \-d
.IR device ]
.RB [ \-c
.IR commstring ]
.RB [ \-C
.IR char_ms ]
.RB [ \-L
.IR line_ms ]
.RB [ \-b ]
.RB [ \-v ]
.SH DESCRIPTION
.B fxsend
streams a BASIC program (or arbitrary text) to a Casio FX-870P or VX-4
pocket computer over a serial line. The calculator should be running
.B LOAD \(dqCOM0:...\(dq
with a matching communication string.
.PP
With no
.B \-f
option the program is read from standard input, so it can be used in
pipelines. In the default text mode, bare line feeds are converted to
CR/LF pairs and a terminating EOF byte (0x1A) is appended if missing.
.PP
Flow control follows the calculator's ROM behaviour: when the
calculator transmits XOFF (its 256-byte receive buffer is 75% full),
.B fxsend
pauses within one character time and resumes on XON. Each byte is
drained to the wire before the next is queued, so an XOFF is never
answered with more than one in-flight character (the calculator
guarantees 64 bytes of headroom).
.SH OPTIONS
.TP
.BI \-f " file"
Read from
.I file
instead of standard input.
.TP
.BI \-d " device"
Serial device (e.g. /dev/cu.usbserial-XXXX on macOS,
/dev/ttyUSB0 on Linux). Defaults to the
.B FXPORT
environment variable.
.TP
.BI \-c " commstring"
Communication parameters in the calculator's own syntax:
.IR speed,parity,data,stop,CS,DS,CD,busy,code ,
optionally prefixed with
.BR COM0: .
Speed 1=150 up to 6=4800 baud. Empty or omitted trailing fields keep
their defaults. The default is the calculator's power-on default,
.BR 2,E,8,1,N,N,N,B,N .
.TP
.BI \-C " ms"
Delay after every character (default 5). May be 0 when XON/XOFF
(busy=B) is enabled.
.TP
.BI \-L " ms"
Additional delay after each line (default 100). Covers the
calculator's per-line BASIC tokenization stall during LOAD.
.TP
.B \-b
Binary mode: no newline conversion and no EOF byte. Note that with
busy=B the calculator consumes bytes 0x11/0x13 as flow control, so
binary data must avoid them (hex-encode instead).
.TP
.B \-v
Report progress and flow-control events on standard error.
.SH EXIT STATUS
0 on success, 1 on usage errors, 2 on I/O errors.
.SH EXAMPLES
Send a program at 4800 baud, no parity:
.PP
.nf
fxsend \-d /dev/cu.usbserial\-A50285BI \-c 6,N,8,1,N,N,N,B,N \-f SORCERER.BAS
.fi
.PP
On the calculator first enter:
.B LOAD \(dqCOM0:6,N,8,1,N,N,N,B,N\(dq
.SH SEE ALSO
.BR fxrecv (1)
.SH HISTORY
The flow-control behaviour implemented here was reverse-engineered
from the FX-870P ROM; see docs/serial-comms-deep-dive.html in the
fx870p-emulator repository.
```

- [ ] **Step 2: Write `fxrecv.1`** (same structure; differences only):

```roff
.TH FXRECV 1 "July 2026" "fx870p-emulator" "User Commands"
.SH NAME
fxrecv \- receive a program from a Casio FX-870P / VX-4 over RS-232C
.SH SYNOPSIS
.B fxrecv
.RB [ \-f
.IR file ]
.RB [ \-d
.IR device ]
.RB [ \-c
.IR commstring ]
.RB [ \-t
.IR seconds ]
.RB [ \-b ]
.RB [ \-v ]
.SH DESCRIPTION
.B fxrecv
captures a program saved from a Casio FX-870P or VX-4 with
.B SAVE \(dqCOM0:...\(dq
(or output printed with
.BR "PRINT #" ).
With no
.B \-f
option the data is written to standard output. In the default text
mode CR bytes are dropped (CR/LF becomes LF) and the transfer ends at
the calculator's EOF byte (0x1A), which is not written.
.PP
If the internal buffer fills faster than the output can drain,
.B fxrecv
transmits XOFF to the calculator and XON when space is available,
mirroring the ROM's own flow control.
.SH OPTIONS
.TP
.BI \-f " file"
Write to
.IR file .
.TP
.BI \-d " device"
Serial device; defaults to
.BR FXPORT .
.TP
.BI \-c " commstring"
Calculator communication string, as in
.BR fxsend (1).
Default
.BR 2,E,8,1,N,N,N,B,N .
.TP
.BI \-t " seconds"
End the transfer after this many seconds of line silence. Default 0
(wait for EOF) in text mode; 5 in binary mode, which has no EOF
marker.
.TP
.B \-b
Binary mode: keep CR bytes and do not stop at 0x1A.
.TP
.B \-v
Report progress and flow-control events on standard error.
.SH EXIT STATUS
0 on success (EOF or idle timeout), 1 on usage errors, 2 on I/O errors.
.SH EXAMPLES
.nf
fxrecv \-d /dev/cu.usbserial\-A50285BI \-c 6,N,8,1,N,N,N,B,N \-f SAVED.BAS
.fi
.PP
On the calculator:
.B SAVE \(dqCOM0:6,N,8,1,N,N,N,B,N\(dq
.SH SEE ALSO
.BR fxsend (1)
```

- [ ] **Step 3: Write `tools/rs232/README.md`** covering (full prose, no placeholders — content distilled from the man pages plus): what the tools are; building (`make`, `make check`, `make install`, Tru64 note `make CC=cc CFLAGS=-O`); FTDI cable wiring table (DB-25 pins 2/3/7 minimum; RTS→CTS and DTR→DSR when using CS/DS; DCD strapping note); the comm-string reference table (copy the 9-field table from the deep dive §3); flow-control behaviour summary with the 256/192/32-byte ROM numbers; worked examples for LOAD, SAVE, and pipelines (`./fxrecv -d ... | grep GOSUB`); troubleshooting (BV error → enable busy=B or raise -L; garbage → parity mismatch; nothing received → cu vs tty on macOS, crossed TX/RX); and a link back to `../../docs/serial-comms-deep-dive.html`.

- [ ] **Step 4: Link from the repository root `README.md`** — add under the existing tools/documentation section:

```markdown
- [RS-232C transfer utilities](tools/rs232/README.md) — `fxsend`/`fxrecv` for real FX-870P/VX-4 hardware
```

- [ ] **Step 5: Verify man pages render**

Run: `man ./tools/rs232/fxsend.1 | head -20` and `man ./tools/rs232/fxrecv.1 | head -20`
Expected: formatted output, no roff warnings.

- [ ] **Step 6: Full build + test from clean**

Run: `cd tools/rs232 && make clean && make && make check`
Expected: both binaries build, all four tests print `OK`.

- [ ] **Step 7: Commit**

```bash
git add tools/rs232/fxsend.1 tools/rs232/fxrecv.1 tools/rs232/README.md README.md
git commit -m "docs(rs232): man pages, README, and repo integration"
```

---

### Task 8: Real-hardware verification procedure (manual)

**Files:**
- Modify: `tools/rs232/README.md` (append a "Hardware smoke test" section with this checklist)

No code. This is the acceptance test on the MacBook + FTDI adapter; it cannot be automated here but must be documented and executed once:

- [ ] **Step 1:** `ls /dev/cu.usbserial*` with the FTDI adapter plugged in; `export FXPORT=/dev/cu.usbserial-XXXX`.
- [ ] **Step 2:** Loopback: jumper the adapter's TX to RX; `printf 'HELLO\n' | ./fxsend -C 0 -L 0 -b` in one terminal while `./fxrecv -b -t 3` runs in another. Expect `HELLO` back.
- [ ] **Step 3:** Calculator LOAD: on the FX-870P enter `LOAD "COM0:6,N,8,1,N,N,N,B,N"`; run `./fxsend -c 6,N,8,1,N,N,N,B,N -f ../../public/basic/emulator/STREK.BAS -v`. Expect the program listable afterwards; watch stderr for XOFF/XON events during long lines.
- [ ] **Step 4:** Calculator SAVE: `./fxrecv -c 6,N,8,1,N,N,N,B,N -f /tmp/back.bas`, then on the calculator `SAVE "COM0:6,N,8,1,N,N,N,B,N"`. Diff `/tmp/back.bas` against the original (expect identical module CR/LF and EOF normalisation).
- [ ] **Step 5:** Stress: repeat step 3 with `SORCERER.BAS` (the largest program) at `-C 0 -L 0` relying purely on XON/XOFF, and once at 300 baud defaults. Both must load without BV/OM errors.
- [ ] **Step 6:** Record results (baud, delays, pass/fail) in the README's hardware-test section and commit:

```bash
git add tools/rs232/README.md
git commit -m "docs(rs232): record hardware smoke-test results"
```

---

## Self-Review

- **Spec coverage:** two C utilities ✔ (Tasks 6); `-f` with stdin/stdout default ✔; calculator comm-string syntax with calculator defaults ✔ (Task 1); all RS-232C parameters honoured incl. CS/DS/CD static-line policy and SI/SO ✔ (Tasks 1–3); per-character and per-line delays ✔ (Task 4); XON/XOFF emitted when receiving ✔ (Task 5) and honoured when sending ✔ (Task 4); reliability for large programs ✔ (Tasks 4 §tcdrain rationale, 8 §stress); man pages ✔; Makefile Linux/macOS + Tru64 notes ✔; README + root-README link ✔; one-vs-two-utilities decision argued ✔ (Design decisions §1); plan-before-implementation ✔ (this document).
- **Placeholder scan:** all code complete; Task 7 Step 3 defines README content by enumerated required sections with the data sources named — acceptable prose deliverable; no TBDs.
- **Type consistency:** `comm_params`, `send_opts`, `recv_opts`, `send_stream(int,int,const send_opts*)`, `recv_stream(int,int,const recv_opts*)`, `serial_open(const char*,const comm_params*,char*,size_t)` used identically across Tasks 1–7. `msleep` defined in Task 3, used in Tasks 4–5 tests.
