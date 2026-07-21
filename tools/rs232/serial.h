#ifndef SERIAL_H
#define SERIAL_H
#include <stddef.h>
#include "commstr.h"

/* Open and configure the serial device per the calculator comm string.
 * Raw mode, VMIN=0/VTIME=0 (callers use select), DTR+RTS asserted where
 * the platform allows. Returns fd, or -1 with a message in err. */
int serial_open(const char *dev, const comm_params *p, char *err, size_t errlen);

void msleep(int ms);

#endif
