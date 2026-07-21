#include <string.h>
#include "../commstr.h"
#include "check.h"

int main(void)
{
    comm_params p;
    char err[128];

    /* Defaults are the calculator's power-on defaults: 2,E,8,1,N,N,N,B,N */
    commstr_defaults(&p);
    CHECK(p.baud == 300);
    CHECK(p.parity == 'E');
    CHECK(p.databits == 8);
    CHECK(p.stopbits == 1);
    CHECK(p.cs == 0 && p.ds == 0 && p.cd == 0);
    CHECK(p.busy == 1);
    CHECK(p.siso == 0);

    /* Full string, with and without COM0: prefix, case-insensitive letters */
    commstr_defaults(&p);
    CHECK(commstr_parse("COM0:6,N,8,1,C,D,C,N,N", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'N');
    CHECK(p.cs == 1 && p.ds == 1 && p.cd == 1);
    CHECK(p.busy == 0 && p.siso == 0);

    commstr_defaults(&p);
    CHECK(commstr_parse("6,e,7,2,n,n,n,b,s", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'E' && p.databits == 7);
    CHECK(p.stopbits == 2 && p.busy == 1 && p.siso == 1);

    /* All six speed digits */
    {
        static const int want[6] = { 150, 300, 600, 1200, 2400, 4800 };
        char s[2];
        int i;
        for (i = 0; i < 6; i++) {
            s[0] = (char)('1' + i); s[1] = '\0';
            commstr_defaults(&p);
            CHECK(commstr_parse(s, &p, err, sizeof err) == 0);
            CHECK(p.baud == want[i]);
        }
    }

    /* Omitted trailing fields keep defaults; empty fields keep defaults */
    commstr_defaults(&p);
    CHECK(commstr_parse("6", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'E' && p.busy == 1);
    commstr_defaults(&p);
    CHECK(commstr_parse("6,,7", &p, err, sizeof err) == 0);
    CHECK(p.baud == 4800 && p.parity == 'E' && p.databits == 7);

    /* Rejections: bad speed, bad letters, too many fields, junk */
    commstr_defaults(&p);
    CHECK(commstr_parse("7", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("0", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,X", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,9", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,8,3", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,8,1,Q", &p, err, sizeof err) == -1);
    CHECK(commstr_parse("2,E,8,1,N,N,N,B,N,N", &p, err, sizeof err) == -1);
    CHECK(err[0] != '\0');

    /* SI/SO only valid with 7 data bits (matches the manual) */
    commstr_defaults(&p);
    CHECK(commstr_parse("2,E,8,1,N,N,N,B,S", &p, err, sizeof err) == -1);

    CHECK_DONE();
}
