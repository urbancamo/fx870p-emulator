# RS-232C Read Write Utilities

Using the following research: [serial-comms-deep-dive.html](./serial-comms-deep-dive.html)
and any other information as appropriate in this repository.

Write two utilities in the style of Unix-command line 'do one thing well' philosophy to send and receive programs
to/from a FX-870P or VX4. These should be written in the C-language, targeted on either MacOS or Linux. Use a '-f' flag
to specify the send/receive filename - if not specified this should be standard input/output to allow pipelining.

I want the communication control to be specified using the same comms string that the calculator uses. This should 
allow the user to set all relevant RS-232C control parameters as can be specified to the calculator. Default settings
should be the default settings the calculator sets.

We should also use sensible delays both per-character, and per-line so that when sending programs we don't overrun the
calculator. Sending of XON and XOFF when receiving should be implemented, as well as delaying sending when received
from the calculator.

What we are looking for here - above all else - is a reliable communication link capable of sending and receiving
large BASIC programs, such as Sorcerer's Cave or Super Star Trek.

Write a plan to fully flesh out these requirements before implementing. Initial testing will be done on this Macbook
using an FTDI based USB to RS-232 converter.

As well as the utilities create a manual page for each and a suitable Makefile supporting both Linux/MacOS. If quality
or utility won't be compromised make the code as generic / POSIX compliant as possible so that it can be built on older
unix implementations like tru64. 

You could create one utility to do both send/receive if that is makes more sense, checking the against the unix 
philosophy. Include all details defined in the manual pages in a comprehensive README - and link this README from 
the main repository README.
