#include <string.h>
#include "../siso.h"
#include "check.h"

int main(void)
{
    siso_state st;
    unsigned char out[64];
    size_t n;

    /* Pure 7-bit data passes through untouched (starts in SI state) */
    siso_init(&st);
    n = siso_encode(&st, (const unsigned char *)"ABC", 3, out);
    CHECK(n == 3 && memcmp(out, "ABC", 3) == 0);

    /* High byte: SO (0x0E) prefix, top bit stripped; return to low: SI (0x0F) */
    siso_init(&st);
    {
        unsigned char in[3]; in[0] = 'A'; in[1] = 0xC1; in[2] = 'B';
        n = siso_encode(&st, in, 3, out);
        CHECK(n == 5);
        CHECK(out[0] == 'A' && out[1] == 0x0E && out[2] == 0x41);
        CHECK(out[3] == 0x0F && out[4] == 'B');
    }

    /* Consecutive high bytes share one SO */
    siso_init(&st);
    {
        unsigned char in[2]; in[0] = 0x80; in[1] = 0xFF;
        n = siso_encode(&st, in, 2, out);
        CHECK(n == 3 && out[0] == 0x0E && out[1] == 0x00 && out[2] == 0x7F);
    }

    /* Decode inverts encode, state carried across calls */
    siso_init(&st);
    {
        unsigned char enc[5];
        unsigned char dec[8];
        siso_state d;
        enc[0] = 'A'; enc[1] = 0x0E; enc[2] = 0x41; enc[3] = 0x0F; enc[4] = 'B';
        siso_init(&d);
        n = siso_decode(&d, enc, 2, dec);          /* 'A', SO */
        CHECK(n == 1 && dec[0] == 'A');
        n = siso_decode(&d, enc + 2, 3, dec);      /* 0x41 (shifted), SI, 'B' */
        CHECK(n == 2 && dec[0] == 0xC1 && dec[1] == 'B');
    }

    CHECK_DONE();
}
