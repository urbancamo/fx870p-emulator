# RS-232C utilities for the Casio FX-870P / VX-4.
# POSIX make + c89-friendly. Macros use plain '=', not the GNU/BSD '?=',
# so this also builds under native/strict make (e.g. Tru64) -- command-line
# overrides like `make CC=cc` still win over these '=' assignments.
# Override CC/CFLAGS for odd platforms:
#   Tru64:  make CC=cc CFLAGS="-O"
# All build output lands under build/ (git-ignored):
#   build/obj/    object files
#   build/bin/    fxsend, fxrecv
#   build/tests/  test executables
CC      = cc
CFLAGS  = -O2 -Wall -Wextra
PREFIX  = /usr/local

B       = build
OBJDIR  = $(B)/obj
BINDIR  = $(B)/bin
TSTDIR  = $(B)/tests

CORE_OBJS = $(OBJDIR)/commstr.o $(OBJDIR)/siso.o $(OBJDIR)/serial.o \
            $(OBJDIR)/sendloop.o $(OBJDIR)/recvloop.o

all: $(BINDIR)/fxsend $(BINDIR)/fxrecv

$(BINDIR)/fxsend: $(OBJDIR)/fxsend.o $(CORE_OBJS)
	mkdir -p $(BINDIR)
	$(CC) $(CFLAGS) -o $@ $(OBJDIR)/fxsend.o $(CORE_OBJS)

$(BINDIR)/fxrecv: $(OBJDIR)/fxrecv.o $(CORE_OBJS)
	mkdir -p $(BINDIR)
	$(CC) $(CFLAGS) -o $@ $(OBJDIR)/fxrecv.o $(CORE_OBJS)

$(OBJDIR)/commstr.o: commstr.c commstr.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ commstr.c

$(OBJDIR)/siso.o: siso.c siso.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ siso.c

$(OBJDIR)/serial.o: serial.c serial.h commstr.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ serial.c

$(OBJDIR)/sendloop.o: sendloop.c sendloop.h serial.h siso.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ sendloop.c

$(OBJDIR)/recvloop.o: recvloop.c recvloop.h siso.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ recvloop.c

$(OBJDIR)/fxsend.o: fxsend.c commstr.h serial.h sendloop.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ fxsend.c

$(OBJDIR)/fxrecv.o: fxrecv.c commstr.h serial.h recvloop.h
	mkdir -p $(OBJDIR)
	$(CC) $(CFLAGS) -c -o $@ fxrecv.c

# ---- tests -------------------------------------------------------------
TESTS = $(TSTDIR)/test_commstr $(TSTDIR)/test_siso \
        $(TSTDIR)/test_sendloop $(TSTDIR)/test_recvloop

$(TSTDIR)/test_commstr: tests/test_commstr.c tests/check.h $(OBJDIR)/commstr.o
	mkdir -p $(TSTDIR)
	$(CC) $(CFLAGS) -o $@ tests/test_commstr.c $(OBJDIR)/commstr.o

$(TSTDIR)/test_siso: tests/test_siso.c tests/check.h $(OBJDIR)/siso.o
	mkdir -p $(TSTDIR)
	$(CC) $(CFLAGS) -o $@ tests/test_siso.c $(OBJDIR)/siso.o

$(TSTDIR)/test_sendloop: tests/test_sendloop.c tests/check.h tests/ptyharness.c tests/ptyharness.h $(OBJDIR)/sendloop.o $(OBJDIR)/serial.o $(OBJDIR)/commstr.o $(OBJDIR)/siso.o
	mkdir -p $(TSTDIR)
	$(CC) $(CFLAGS) -o $@ tests/test_sendloop.c tests/ptyharness.c $(OBJDIR)/sendloop.o $(OBJDIR)/serial.o $(OBJDIR)/commstr.o $(OBJDIR)/siso.o

$(TSTDIR)/test_recvloop: tests/test_recvloop.c tests/check.h tests/ptyharness.c tests/ptyharness.h $(OBJDIR)/recvloop.o $(OBJDIR)/serial.o $(OBJDIR)/commstr.o $(OBJDIR)/siso.o
	mkdir -p $(TSTDIR)
	$(CC) $(CFLAGS) -o $@ tests/test_recvloop.c tests/ptyharness.c $(OBJDIR)/recvloop.o $(OBJDIR)/serial.o $(OBJDIR)/commstr.o $(OBJDIR)/siso.o

check: $(TESTS)
	@for t in $(TESTS); do ./$$t || exit 1; done

install: all
	mkdir -p $(DESTDIR)$(PREFIX)/bin $(DESTDIR)$(PREFIX)/share/man/man1
	cp $(BINDIR)/fxsend $(BINDIR)/fxrecv $(DESTDIR)$(PREFIX)/bin/
	cp fxsend.1 fxrecv.1 $(DESTDIR)$(PREFIX)/share/man/man1/

clean:
	rm -rf $(B)

.PHONY: all check install clean
