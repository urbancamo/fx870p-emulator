#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <signal.h>
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

    signal(SIGPIPE, SIG_IGN);

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
