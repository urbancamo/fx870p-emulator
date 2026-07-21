#ifndef SISO_H
#define SISO_H
#include <stddef.h>

/* SI/SO 8-bit-over-7-bit shift coding (COM0 code=S, 7 data bits).
 * SO (0x0E) enters shifted mode: following bytes have bit7 implied set.
 * SI (0x0F) returns to unshifted. Matches ROM behaviour, deep-dive §4.
 *
 * Protocol limitation (inherent, matches real hardware): the calculator's
 * ROM unconditionally consumes 0x0E/0x0F as shift controls, so data bytes
 * whose low 7 bits equal 0x0E or 0x0F (0x0E, 0x0F, 0x8E, 0x8F) cannot be
 * represented on a code=S link and are lost on round-trip. Escaping them
 * here would break interoperability with the calculator. BASIC program
 * text never contains these values; binary payloads must use code=N. */
typedef struct { int shifted; } siso_state;

void   siso_init(siso_state *st);
size_t siso_encode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out);   /* out: at least 2n bytes */
size_t siso_decode(siso_state *st, const unsigned char *in, size_t n,
                   unsigned char *out);   /* out: at least n bytes */

#endif
