# Problem - BASIC Compiler for the Casio FX-870P/VX-4

BASIC programs, when run using the interpreter in the Casio FX-870P/VX-4 are very slow.
If we were able to compile the BASIC program into machine language, with a suitable loader, we could load that version
into the emulator or real hardware and programs would run much faster. 
There is likely to be an order of magnitude improvement.

# Requirements

Before we attempt to implement a COMPILER we need to thoroughly understand how MACHINE CODE programs can be
run on the VX-4. There are a number of resources available that should provide all the information required.

We then need to determine the location of the machine language subroutines that support the interpreted BASIC
in performing things like input, output, screen writing, keyboard input etc.

# Steps

The first step is to create an implementation plan, research the best approach, and satisfy ourselves
that we have enough information to be able to complete a compiler implementation.

Use plan mode and research using the supplied resources, including online resources as required. Formulate a plan
on how we might implement a compiler. As the emulator is written in typescript this would be the language of choice,
ideally. It may be that we need to port an assembler to Typescript, but this should be consider in light of 
pros and cons. Use superpowers as required.

# Resources

Obviously the emulator code itself!

 - [CasioVX-4-Manual-Peter-Rost.pdf](../../../docs/CasioVX-4-Manual-Peter-Rost.pdf)
 - [HD61700 CROSS ASSEMBLER](../../../reference/HD61700%20CROSS%20ASSEMBLER)
 - [HD61700 DISASSEMBLER](../../../reference/HD61700%20DISASSEMBLER)
 - [ROM Disassembly](../../../reference/ROM%20Disassembly)
 - [CosmicV4](../../../reference/CosmicV4) - a machine language game for the VX-4
 - [fx870p-rom-annotations](../../../reference/fx870p-rom-annotations.md)
 - [fx870p-roms](../../../reference/fx870p-roms.md)
 - [Casio JIS Basic Manual](../../../public/docs/casio-jis-basic)
 - [Emulator BASIC Library](../../../public/basic/emulator)