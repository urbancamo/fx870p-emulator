#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <fcntl.h>
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
        if (n < 0) {
            if (errno == EINTR) continue;
            return (errno == EAGAIN || errno == EWOULDBLOCK) ? 0 : -1;
        }
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
    ssize_t w;

    if (poll_incoming(serfd, o->honor_xonxoff, paused, o->verbose) < 0) return -1;
    if (wait_unpaused(serfd, o->honor_xonxoff, paused, o->verbose) < 0) return -1;
    /* A 1-byte write cannot be partial on success; retry on EINTR only.
     * A 0 return from a 1-byte tty write is off-contract: fail fast
     * rather than risk an unbounded spin. */
    for (;;) {
        w = write(serfd, &b, 1);
        if (w == 1) break;
        if (w < 0 && errno == EINTR) continue;
        return -1;
    }
    /* EINVAL: ptys on some OSes */
    for (;;) {
        if (tcdrain(serfd) == 0) break;
        if (errno == EINTR) continue;
        if (errno == EINVAL) break;
        return -1;
    }
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

    for (;;) {
        ssize_t i;
        n = read(infd, inbuf, sizeof inbuf);
        if (n < 0 && errno == EINTR) continue;
        if (n <= 0) break;
        for (i = 0; i < n; i++) {
            unsigned char b = inbuf[i];
            /* Text mode: bare LF becomes CR LF */
            if (o->text_mode && b == 0x0A && prev != 0x0D) {
                unsigned char cr = 0x0D;
                size_t k, m = o->use_siso ? siso_encode(&ss, &cr, 1, enc)
                                          : (enc[0] = cr, (size_t)1);
                for (k = 0; k < m; k++)
                    if (put_byte(serfd, enc[k], o, &paused) < 0) return -1;
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
        unsigned char eof = 0x1A;
        size_t k, m = o->use_siso ? siso_encode(&ss, &eof, 1, enc)
                                  : (enc[0] = eof, (size_t)1);
        for (k = 0; k < m; k++)
            if (put_byte(serfd, enc[k], o, &paused) < 0) return -1;
        total++;
    }
    if (o->verbose) fprintf(stderr, "fxsend: done, %ld bytes\n", total);
    return 0;
}
