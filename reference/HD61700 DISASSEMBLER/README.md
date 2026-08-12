# HD61700 Disassembler

![Image](https://github.com/user-attachments/assets/392cfa56-a603-48dc-aa73-eee1324cb5b4)

This project is a disassembler for the HD61700 which is used in the Casio PB-1000.  I needed to create this disassembler to discover how some of the subroutines in ROM worked with the hardware.

I searched for an exisitng disassembler and found some source posted (links below).  However, it was compiled quite awhile ago and did not run on Windows 10.  I used this source as the basis for this disassembler.

Disassembler modified from source posted here:
http://www.emmanuel.hp41.eu/ti/ti-74/pc/pgm2b74/programs.htm

which referenced the source hosted here:
http://www.pisi.com.pl/piotr433/pb1000ee.htm

Usage: HD61700.exe -i infile.bin [-a address] [-w] -o outfile.txt

The optional switch -a starting address can be specified as a hexadecimal number without any prefixes. If omitted, a default value 0000 is assumed.
The optional switch -w selects the 16-bit (word-size) memory access (applicaple for the microprocessor internal 16-bit ROM). If omitted, a default 8-bit (byte-size) memory access is assumed.

Example: HD61700.exe -i infile.bin -a 0x8000 -o outfile.txt 

In Visual Studio you can set the Debug Options in the Project Properties to:

-i ..\..\resources\pb1000_rom.bin -o ..\..\resources\output.txt -a 0x8000

This will disassemble the included ROM image and output the result in the Bin folder with a base address of 0x8000.

Note that I have found an additional version of the ROM and added this to the project as well, pb1000_rom2.bin and its corresponding output_example2.txt.

I can be contacted at jbertier@arrl.net
