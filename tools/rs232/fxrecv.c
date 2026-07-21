#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <signal.h>
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

    signal(SIGPIPE, SIG_IGN);

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
