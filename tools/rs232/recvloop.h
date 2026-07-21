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
