# RS-232C utilities for the Casio FX-870P / VX-4.
# POSIX make + c89-friendly. Macros use plain '=', not the GNU-only '?=',
# so this also builds under native/strict make (e.g. Tru64) -- command-line
# overrides like `make CC=cc` still win over these '=' assignments.
# Override CC/CFLAGS for odd platforms:
#   Tru64:  make CC=cc CFLAGS="-O"
CC      = cc
CFLAGS  = -O2 -Wall -Wextra
PREFIX  = /usr/local

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
