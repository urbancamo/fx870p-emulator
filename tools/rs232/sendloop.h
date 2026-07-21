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
