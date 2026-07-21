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
        /* End the transfer. In this mode (text_mode=0, idle_timeout_s=0)
         * recv_stream has no way to end on its own: 0x1A is only special
         * in text_mode, so the engine just idles once the pipe drains --
         * exactly the "reader closed later by parent: engine sees EPIPE"
         * case flagged above. Deviation from the brief: its literal final
         * drain was an unbounded `while (read(p[0], ...) > 0) ;`, which
         * deadlocks here because nothing ever gives that blocking read an
         * EOF (the engine never closes its own write end). We bound the
         * drain with timed_read, then close our read end and push one
         * more byte so the engine's next serial read forces an output
         * write against the now-closed pipe -- EPIPE (or SIGPIPE) ends
         * the child. wait()'s ignored status covers either outcome. */
        {
            unsigned char drain[4096];
            while (timed_read(p[0], drain, sizeof drain, 200) > 0) ;
        }
        close(p[0]);
        b = 0x1A;
        CHECK(write(master, &b, 1) == 1);
        wait(&status);
        (void)status;
    }

    CHECK_DONE();
}
