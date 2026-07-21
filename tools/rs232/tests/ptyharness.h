#ifndef PTYHARNESS_H
#define PTYHARNESS_H
#include <stddef.h>

/* Open a pseudo-terminal pair. Returns master fd, or -1.
 * Writes the slave device path into slavepath (the "calculator" cable end:
 * pass it to serial_open). POSIX.1-2001: posix_openpt/grantpt/unlockpt. */
int pty_open(char *slavepath, size_t pathlen);

/* Read up to n bytes from fd with a timeout (ms). Returns bytes read,
 * 0 on timeout, -1 on error. */
int timed_read(int fd, unsigned char *buf, size_t n, int timeout_ms);

#endif
