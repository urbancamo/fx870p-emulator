#define _XOPEN_SOURCE 600
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/select.h>
#include <sys/time.h>
#include "ptyharness.h"

int pty_open(char *slavepath, size_t pathlen)
{
    const char *name;
    int m = posix_openpt(O_RDWR | O_NOCTTY);
    if (m < 0) return -1;
    if (grantpt(m) < 0 || unlockpt(m) < 0) { close(m); return -1; }
    name = ptsname(m);
    if (!name || strlen(name) >= pathlen) { close(m); return -1; }
    strcpy(slavepath, name);
    return m;
}

int timed_read(int fd, unsigned char *buf, size_t n, int timeout_ms)
{
    fd_set rfds;
    struct timeval tv;
    int r;
    FD_ZERO(&rfds);
    FD_SET(fd, &rfds);
    tv.tv_sec = timeout_ms / 1000;
    tv.tv_usec = (timeout_ms % 1000) * 1000;
    r = select(fd + 1, &rfds, NULL, NULL, &tv);
    if (r <= 0) return r;
    return (int)read(fd, buf, n);
}
