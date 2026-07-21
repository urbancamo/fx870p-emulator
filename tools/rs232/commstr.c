#include <stdio.h>
#include <string.h>
#include <strings.h>
#include <ctype.h>
#include "commstr.h"

void commstr_defaults(comm_params *p)
{
    /* Calculator power-on defaults: 2,E,8,1,N,N,N,B,N */
    p->baud = 300; p->parity = 'E'; p->databits = 8; p->stopbits = 1;
    p->cs = 0; p->ds = 0; p->cd = 0; p->busy = 1; p->siso = 0;
}

static int fail(char *err, size_t errlen, const char *msg)
{
    if (errlen > 0) { strncpy(err, msg, errlen - 1); err[errlen - 1] = '\0'; }
    return -1;
}

/* Letter-flag field: set-letter -> 1, 'N' -> 0, empty -> keep default. */
static int flagfield(const char *f, size_t n, char setletter, int *out,
                     char *err, size_t errlen)
{
    if (n == 0) return 0;
    if (n != 1) return fail(err, errlen, "flag field must be one letter");
    if (toupper((unsigned char)f[0]) == setletter) { *out = 1; return 0; }
    if (toupper((unsigned char)f[0]) == 'N')       { *out = 0; return 0; }
    return fail(err, errlen, "bad flag letter (expected set-letter or N)");
}

int commstr_parse(const char *s, comm_params *p, char *err, size_t errlen)
{
    static const int bauds[6] = { 150, 300, 600, 1200, 2400, 4800 };
    const char *field[9];
    size_t flen[9];
    int nfields = 0;
    const char *q;

    if (errlen > 0) err[0] = '\0';
    if (strncasecmp(s, "COM0:", 5) == 0) s += 5;

    /* Split on commas; empty fields allowed. */
    q = s;
    for (;;) {
        const char *comma = strchr(q, ',');
        if (nfields == 9) return fail(err, errlen, "too many fields (max 9)");
        field[nfields] = q;
        flen[nfields] = comma ? (size_t)(comma - q) : strlen(q);
        nfields++;
        if (!comma) break;
        q = comma + 1;
    }

    /* 1: speed digit 1-6 */
    if (flen[0] == 1 && field[0][0] >= '1' && field[0][0] <= '6')
        p->baud = bauds[field[0][0] - '1'];
    else if (flen[0] != 0)
        return fail(err, errlen, "speed must be a digit 1-6");

    /* 2: parity N/E/O */
    if (nfields > 1 && flen[1] > 0) {
        char c = (char)toupper((unsigned char)field[1][0]);
        if (flen[1] != 1 || (c != 'N' && c != 'E' && c != 'O'))
            return fail(err, errlen, "parity must be N, E or O");
        p->parity = c;
    }
    /* 3: data bits 7/8 */
    if (nfields > 2 && flen[2] > 0) {
        if (flen[2] != 1 || (field[2][0] != '7' && field[2][0] != '8'))
            return fail(err, errlen, "data bits must be 7 or 8");
        p->databits = field[2][0] - '0';
    }
    /* 4: stop bits 1/2 */
    if (nfields > 3 && flen[3] > 0) {
        if (flen[3] != 1 || (field[3][0] != '1' && field[3][0] != '2'))
            return fail(err, errlen, "stop bits must be 1 or 2");
        p->stopbits = field[3][0] - '0';
    }
    /* 5-9: CS, DS, CD, busy, code */
    if (nfields > 4 && flagfield(field[4], flen[4], 'C', &p->cs,   err, errlen)) return -1;
    if (nfields > 5 && flagfield(field[5], flen[5], 'D', &p->ds,   err, errlen)) return -1;
    if (nfields > 6 && flagfield(field[6], flen[6], 'C', &p->cd,   err, errlen)) return -1;
    if (nfields > 7 && flagfield(field[7], flen[7], 'B', &p->busy, err, errlen)) return -1;
    if (nfields > 8 && flagfield(field[8], flen[8], 'S', &p->siso, err, errlen)) return -1;

    if (p->siso && p->databits != 7)
        return fail(err, errlen, "code=S requires 7 data bits");
    return 0;
}
