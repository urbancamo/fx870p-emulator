# BASIC Program Compressor

When we start reaching the limits of the capacity of memory for a VX-4 or FX-870P (as low as 8KB in some configurations,
up to a maximum of 64KB but typically with a 8KB + 32KB expansion = 24KB available) I start thinking about a utility that could be used to minimise the token count of a BASIC program to allow for maximum storage.

Your task is to create a utility that can take a standard BASIC program and minimise the token count. Plan how this 
would be maximised by researching how this has been done with other implementations of BASIC, and your knowledge of how BASIC tokens are stored in Casio BASIC in the calculator by reference to the available ROM listings.

Create a plan that details a set of strategies/algorithms than can be applied to a BASIC listing to minimise the token count. Initially write this as a CLI program that takes the current BASIC program and emits an optimized one. You should generate a detailed listing file that shows the relationship between the old code and new code, formatted so that it can be printed on a 132-column wide-carriage dot matrix printer (similar to how DEC VAX/VMS compilers/assemblers do this). The summary section at the end should provide statistics on the reduction.

Write this code in typescript as a CLI program, once we have agreed a plan.
