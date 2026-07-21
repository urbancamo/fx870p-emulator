#define _XOPEN_SOURCE 600
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/time.h>
#include <sys/wait.h>
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
 * pty master ("calculator" side).
 *
 * Deviation from the brief: send_stream() writes one byte at a time and
 * calls tcdrain() after each. On Linux, tcdrain() on a pty slave returns
 * EINVAL immediately (tolerated by put_byte()); on this platform (macOS),
 * it instead blocks until the master side actually reads the byte, since
 * a pty has no physical wire -- "transmitted" can only mean "read by the
 * other end". Running send_stream() to completion before reading (as the
 * brief's helper did) therefore deadlocks here on the very first byte.
 * Forking so the parent reads concurrently -- exactly how a real
 * receiving calculator would behave, and the same pattern the brief
 * already uses below for the XOFF test -- fixes this without changing
 * send_stream()'s one-byte-write+tcdrain pacing, which is correct and
 * required for real hardware. */
static int run_send(int master, int serfd, const char *data,
                    const send_opts *o, unsigned char *cap, size_t caplen)
{
    int p[2];
    size_t got = 0;
    int status = 0;
    pid_t pid;
    CHECK(pipe(p) == 0);
    CHECK(write(p[1], data, strlen(data)) == (ssize_t)strlen(data));
    close(p[1]);
    pid = fork();
    CHECK(pid >= 0);
    if (pid == 0) {
        int rc = send_stream(serfd, p[0], o);
        _exit(rc == 0 ? 0 : 1);
    }
    close(p[0]);
    for (;;) {
        int n = timed_read(master, cap + got, caplen - got, 200);
        if (n <= 0) break;
        got += (size_t)n;
    }
    cap[got] = 0;
    CHECK(waitpid(pid, &status, 0) == pid);
    return status == 0 ? (int)got : -1;
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

    /* SISO text mode end-to-end: a high-bit byte shifts the link into SO
     * mode; the following low-bit byte unshifts it (SI) before that byte
     * goes out. CR injection encodes the raw 0x0D/0x0A same as any other
     * byte, so they arrive unshifted here. The trailing EOF marker (0x1A)
     * must also pass through siso_encode: previously it bypassed encoding
     * entirely, so a byte left shifted from prior data made the
     * calculator decode it as 0x9A and LOAD would hang. */
    memset(&o, 0, sizeof o);
    o.text_mode = 1; o.use_siso = 1; o.honor_xonxoff = 0;
    {
        static const unsigned char expect[] =
            { 'A', 0x0E, 0x41, 0x0F, 0x0D, 0x0A, 0x1A };
        n = run_send(master, serfd, "A\xc1\n", &o, cap, sizeof cap - 1);
        CHECK(n == (int)sizeof expect);
        CHECK(memcmp(cap, expect, sizeof expect) == 0);
    }

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
