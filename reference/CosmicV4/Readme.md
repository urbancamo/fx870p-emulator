# Cosmic Fly 

![Cosmic Fly](../images/cosmic-fly.png)

 - a public domain game for the Casio PB-1000
 - written by Gernot Fink <gernot.fink@munich.netsurf.de>
 - published by Andreas Wichmann on 2000-03-03 on [http://www.itkp.uni-bonn.de/~wichmann/pb1000.html](http://www.itkp.uni-bonn.de/~wichmann/pb1000.html)

---------------------------------------------------------------
 
 - rewritten by BLUE <qze12045@nifty.com> on 2003-12-04 for the Casio FX-870P/VX-4/VX-3 systems.
 - [http://hd61700.yukimizake.net/](http://hd61700.yukimizake.net/)

---------------------------------------------------------------

 - quick loader rewritten by 123 for readability, usability and portability
 - [http://luckleo.cocolog-nifty.com/pockecom/VX-4/HTML/vx-4_jp.html](http://luckleo.cocolog-nifty.com/pockecom/VX-4/HTML/vx-4_jp.html)
 - see this cached [English translation]
---------------------------------------------------------------

The contents of the compressed file are as follows:

| Online Viewable File        | Casio ASCII File             | Purpose                                    |
|:----------------------------|:-----------------------------|:-------------------------------------------|
| [Readme.txt](Readme.md)     | [Readme.txt](Readme.txt)     | This file, document in English.            |
| [ReadmeJ.txt](ReadmeJ.txt)  | [ReadmeJ.txt](ReadmeJ.txt)   | Document in Japanese.                      |
| [Cosmic2.s](Cosmic2.md)     | [Cosmic2.s](Cosmic2.s)       | Assembler source code of Cosmic Fly.       |
| [clr.b](clr.md)             | [clr.b](clr.b)               | Expanded clear command for Vx-4/Fx-870p.   |
| [CosmicV4.bas](CosmicV4.md) | [CosmicV4.bas](CosmicV4.bas) | Stand-alone distribution for Vx-4/Fx-870p. |

### Key Function in game:

| Key   | Purpose              |
|-------|----------------------|
| `EXE` | Game start           |
 | `BRK` | End of game. (break) |
 | `0`   | shoot                |
 | `4`   | move left            |  
| `6`   | move right           |

### Preface

The orignal disribution of Cosmic Fly for FX-870P,VX-4 and VX-3 was done in the PBF format.

It is preferable in the view point of the efficiency of user's memory of your pocket computers.

However, you must either use an add-in software such as VX-menu or receiver machine-code data via
RS-232C after running the loader program. I felt that these somewhat burdensome operations may make barriers to run
and play games for beginner users like me, 123. So I built up the stand-alone distribution even though the efficiency of
the user's memory was deteriorated. Moreover, the quick-loader, which was too mysterious to understand for beginners,
is rewritten for readability, usability and portability. 

### How to play
1. Using PB-1000 Data Communicator, which you can get in "http://www.lsigame.com/",
   you transmit two files of `clr.b` and `CosmicV4.bas` to your FX-870P/Vx-4
   from your MS Windows machine.

2. By executing `clr.b`, extended `CLEAR` machine-codes to make machine code area is
   to be installed. 
   
   After the message `MODE110(&H18F5)` is displayed, execute `MODE110(&H18F5),1520` **EXE**
   to allocate 1520 bytes for machine code area.

3. By executing `CosmicV4.bas`, you can play Cosmic Fly.

   The new quick-loader works as follows:
   
   - Checking the allocated size of the machine code area, the program is terminated
          with a warning message if the size is not enough to install.

   - Checking the first 24-byte data in machine code area, the program stops to install
     the machine and executes the machine codes of Cosmic Fly if the data are identical
     with those of the loader program.
   
   - When you want to play again, you may execute Cosmic.bas.
     If you erase `CosmicV4.bas` to enlarge user's memory, execute `MODE110(7376)` **EXE**
     to call machine codes of Cosmic Fly.

### Remark

1. After executing an C program in C-language mode, the data of the machine codes
   of Cosmic Fly is destroyed because C-langugae system uses the work area in the different
   way. 

   Therefore, you need to execute CosmicV4.bas again.
            