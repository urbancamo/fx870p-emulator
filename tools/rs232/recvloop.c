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
    int rc = 0;
    long total = 0;
    int idle_ms = 0;
    int high = o->test_highwater ? o->test_highwater : HIGH_WATER;
    int low  = o->test_lowwater  ? o->test_lowwater  : LOW_WATER;
    int saved_ofl;

    memset(&r, 0, sizeof r);
    siso_init(&ss);
    fcntl(serfd, F_SETFL, fcntl(serfd, F_GETFL, 0) | O_NONBLOCK);
    /* outfd may be a terminal (e.g. stdout) whose O_NONBLOCK flag is
     * shared via the open file description with the invoking shell;
     * save it here and restore it on every exit path below so we never
     * leave the user's tty in non-blocking mode. */
    saved_ofl = fcntl(outfd, F_GETFL, 0);
    fcntl(outfd, F_SETFL, saved_ofl | O_NONBLOCK);

    while (!done || r.count > 0) {
        fd_set rfds, wfds;
        struct timeval tv;
        int maxfd = serfd;
        int polled = 0;

        FD_ZERO(&rfds); FD_ZERO(&wfds);
        if (!done && r.count < RING_SIZE) { FD_SET(serfd, &rfds); polled = 1; }
        if (r.count > 0) {
            FD_SET(outfd, &wfds);
            if (outfd > maxfd) maxfd = outfd;
        }
        tv.tv_sec = 0; tv.tv_usec = 100000;   /* 100 ms tick for idle timer */
        if (select(maxfd + 1, &rfds, &wfds, NULL, &tv) < 0) {
            if (errno == EINTR) continue;
            rc = -1;
            break;
        }

        if (FD_ISSET(serfd, &rfds)) {
            unsigned char in[256], dec[256];
            ssize_t n;
            size_t room = RING_SIZE - r.count;
            size_t want = room < sizeof in ? room : sizeof in;
            /* Retry on EINTR (consistent with sendloop's EINTR policy)
             * rather than treating a signal interruption as a read error.
             * Cap the read at the ring's free space so ring_put() (which
             * has no bounds check of its own) can never overrun. */
            for (;;) {
                n = read(serfd, in, want);
                if (n < 0 && errno == EINTR) continue;
                break;
            }
            if (n < 0 && errno != EAGAIN) { rc = -1; break; }
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
                    if (o->verbose && (total % 256) == 0)
                        fprintf(stderr, "fxrecv: %ld bytes received\n", total);
                }
            }
        } else if (!done && polled) {
            /* Only count idle time when serfd was actually polled and
             * produced nothing; a full ring skips polling serfd, and
             * that backpressure must not be mistaken for idleness. */
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
            /* Retry on EINTR, same rationale as the read() above. */
            for (;;) {
                n = write(outfd, r.buf + r.tail, chunk);
                if (n < 0 && errno == EINTR) continue;
                break;
            }
            if (n < 0 && errno != EAGAIN) { rc = -1; break; }
            if (n > 0) {
                r.tail = (r.tail + (size_t)n) % RING_SIZE;
                r.count -= (size_t)n;
            }
        }

        if (o->emit_xonxoff) {
            if (!throttled && r.count >= (size_t)high) {
                unsigned char xoff = 0x13;
                ssize_t w;
                for (;;) {
                    w = write(serfd, &xoff, 1);
                    if (w < 0 && errno == EINTR) continue;
                    break;
                }
                if (w == 1) {
                    throttled = 1;
                    if (o->verbose) fprintf(stderr, "fxrecv: XOFF sent\n");
                }
            } else if (throttled && r.count <= (size_t)low) {
                unsigned char xon = 0x11;
                ssize_t w;
                for (;;) {
                    w = write(serfd, &xon, 1);
                    if (w < 0 && errno == EINTR) continue;
                    break;
                }
                if (w == 1) {
                    throttled = 0;
                    if (o->verbose) fprintf(stderr, "fxrecv: XON sent\n");
                }
            }
        }
    }
    fcntl(outfd, F_SETFL, saved_ofl);
    if (rc == 0 && o->verbose)
        fprintf(stderr, "fxrecv: done, %ld bytes\n", total);
    return rc;
}
