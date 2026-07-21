# Serial Comms Deep Dive

I want to create a reliable serial comms interface to the Casio FX-870P and derivatives.
I want to research what communication port lines the Casio uses within the ROM code whilst sending
and receiving via the comms port. This will require disassembling the ROM source code associated
with these routines. 

There are a number of comms options that the software/hardware may support:
 - no hardware flow control
 - uses the CTS line
 - uses the RTS line
 - uses any other RS232C lines
 - honours the RS232C protocol or uses it's own timing
 - delays in sending receiving
 - delays processing sent BASIC tokens at line end

We also need to determine whether XON/XOFF is honoured, and whether this is during send, receive or both.

I both the answers to the questions and an annotation of the ROM listing that backs up the answers.
Create an HTML document that answers these questions and provides information on the ROM routines.
Including diagrams ala mermaid as required to fully specify what is happening in the Casio ROM code, including
timing diagrams if possible.
