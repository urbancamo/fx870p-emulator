# Integrate Casio JIS Standard Basic Reference Manual

Now that we have a Casio JIS Standard Basic Reference manual
available in the codebase I'd like to integrate this into the 
emulator.

I'm not sure how this should be best achieved. As a minimum
the emulator should have a DOC button in the button bar
that opens a window to view the manual index.md. However, it would
be useful to have help available in the BASIC edit window that 
takes the user to that particular command.

## Investigation

I'd like you, as a UI expert, to investigate the options for 
integrating the manual to provide context sensitive help, and also
suggest any other possibilities that I haven't thought about that
would provide context-sensitive manual support during the development of programs using the emulator. This could even
extend to anywhere were a basic program is displayed, for example
if we were able to view the library programs as syntax highlighted
listings. We can probably create a reusable component that
standardizes the help across many areas.

Perform an investigation and feedback you suggestions and 
examine the implementation approach that would be required.
