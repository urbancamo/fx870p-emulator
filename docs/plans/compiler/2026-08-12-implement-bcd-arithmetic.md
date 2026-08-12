There is a current limitation of the compiler listed in the README.md that BCD arithmetic is not implemented.
I'd like to now implement this so we can test the performance of compiled BASIC vs interpreted BASIC.

In order to do this create a test program PRIMES.BAS in the emulator library `./public/basic/emulator` that computes the
first 100 primes, and then outputs the largest prime found. I can run that manually to get a performance value
for the interpreted BASIC.

Then implement the necessary compiler functionality to allow this program to be compiled to machine code, resulting
in a HEX file that can be loaded into the emulator to check the performance of the compiled code.

This work will be done on branch `compiler-bcd-arithmetic`.
