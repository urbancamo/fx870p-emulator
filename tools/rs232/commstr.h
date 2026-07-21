#ifndef COMMSTR_H
#define COMMSTR_H
#include <stddef.h>

/* Parsed calculator comm string: [COM0:]speed,parity,data,stop,CS,DS,CD,busy,code
 * Semantics documented in docs/serial-comms-deep-dive.html §3. */
typedef struct {
    int  baud;      /* 150,300,600,1200,2400,4800 */
    char parity;    /* 'N','E','O' */
    int  databits;  /* 7 or 8 */
    int  stopbits;  /* 1 or 2 */
    int  cs;        /* 1 = calc waits for CTS -> we assert RTS */
    int  ds;        /* 1 = calc waits for DSR -> we assert DTR */
    int  cd;        /* 1 = calc requires DCD (wiring concern only) */
    int  busy;      /* 1 = XON/XOFF flow control */
    int  siso;      /* 1 = SI/SO shift codes (7-bit data only) */
} comm_params;

void commstr_defaults(comm_params *p);
int  commstr_parse(const char *s, comm_params *p, char *err, size_t errlen);

#endif
