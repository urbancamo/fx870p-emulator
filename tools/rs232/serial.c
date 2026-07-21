#define _XOPEN_SOURCE 600
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>
#include <termios.h>
#include <time.h>
#include <sys/ioctl.h>
#include "serial.h"

static speed_t baud_const(int baud)
{
    switch (baud) {
    case 150:  return B150;
    case 300:  return B300;
    case 600:  return B600;
    case 1200: return B1200;
    case 2400: return B2400;
    case 4800: return B4800;
    default:   return B0;
    }
}

int serial_open(const char *dev, const comm_params *p, char *err, size_t errlen)
{
    struct termios t;
    speed_t sp = baud_const(p->baud);
    int fd;

    if (sp == B0) { snprintf(err, errlen, "unsupported baud %d", p->baud); return -1; }

    fd = open(dev, O_RDWR | O_NOCTTY);
    if (fd < 0) { snprintf(err, errlen, "%s: %s", dev, strerror(errno)); return -1; }

    if (tcgetattr(fd, &t) < 0) {
        snprintf(err, errlen, "tcgetattr: %s", strerror(errno));
        close(fd); return -1;
    }

    /* Raw 8-bit-transparent mode, no kernel flow control: XON/XOFF is
     * handled explicitly by the engines so it can be logged and paced. */
    t.c_iflag = IGNPAR;               /* also disables IXON/IXOFF/ICRNL */
    t.c_oflag = 0;
    t.c_lflag = 0;
    t.c_cflag = CLOCAL | CREAD;
    t.c_cflag |= (p->databits == 7) ? CS7 : CS8;
    if (p->parity != 'N') {
        t.c_cflag |= PARENB;
        if (p->parity == 'O') t.c_cflag |= PARODD;
    }
    if (p->stopbits == 2) t.c_cflag |= CSTOPB;
    t.c_cc[VMIN]  = 0;
    t.c_cc[VTIME] = 0;
    cfsetispeed(&t, sp);
    cfsetospeed(&t, sp);

    if (tcsetattr(fd, TCSANOW, &t) < 0) {
        snprintf(err, errlen, "tcsetattr: %s", strerror(errno));
        close(fd); return -1;
    }

#ifdef TIOCMBIS
    /* Assert DTR (-> calc DSR) and RTS (-> calc CTS) so DS=D / CS=C opens
     * on the calculator see a ready peer. Static, per deep-dive §4: the
     * calculator never toggles its own outputs either. Harmless if unwired
     * or unsupported (ptys): errors ignored. */
    {
        int bits = TIOCM_DTR | TIOCM_RTS;
        ioctl(fd, TIOCMBIS, &bits);
    }
#endif
    tcflush(fd, TCIOFLUSH);
    return fd;
}

void msleep(int ms)
{
    struct timespec ts;
    ts.tv_sec = ms / 1000;
    ts.tv_nsec = (long)(ms % 1000) * 1000000L;
    nanosleep(&ts, NULL);
}
