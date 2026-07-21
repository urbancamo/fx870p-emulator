#ifndef CHECK_H
#define CHECK_H
#include <stdio.h>
#include <stdlib.h>
static int check_failures = 0;
#define CHECK(cond) do { \
    if (!(cond)) { \
        fprintf(stderr, "FAIL %s:%d: %s\n", __FILE__, __LINE__, #cond); \
        check_failures++; \
    } \
} while (0)
#define CHECK_DONE() do { \
    if (check_failures) { fprintf(stderr, "%d failure(s)\n", check_failures); exit(1); } \
    printf("OK %s\n", __FILE__); exit(0); \
} while (0)
#endif
