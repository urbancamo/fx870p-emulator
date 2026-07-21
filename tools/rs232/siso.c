#include "siso.h"

#define SO 0x0E
#define SI 0x0F

void siso_init(siso_state *st) { st->shifted = 0; }

size_t siso_encode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out)
{
    size_t i, o = 0;
    for (i = 0; i < n; i++) {
        int high = (in[i] & 0x80) != 0;
        if (high && !st->shifted)      { out[o++] = SO; st->shifted = 1; }
        else if (!high && st->shifted) { out[o++] = SI; st->shifted = 0; }
        out[o++] = (unsigned char)(in[i] & 0x7F);
    }
    return o;
}

size_t siso_decode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out)
{
    size_t i, o = 0;
    for (i = 0; i < n; i++) {
        if (in[i] == SO)      st->shifted = 1;
        else if (in[i] == SI) st->shifted = 0;
        else out[o++] = (unsigned char)(st->shifted ? (in[i] | 0x80) : in[i]);
    }
    return o;
}
