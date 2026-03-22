
This chapter will cover several BASIC commands or instructions that are not documented in the user manual.
It's a shame they weren't included in the manual, as they are very useful.

•	Instruction: INPUT@n;Variable
@ -> Wildcard character
n -> number belonging to the range (1<= n <=250)
Variable -> belonging to the range
a~z; A~Z;a$~z$;A$~Z$
Utility: Enter a maximum number n of characters.
The question mark does not appear when requesting the variable.

Example.- 		10 PRINT “Age?”;:INPUT@3;age

With this instruction, there's no need to check that more than three characters are entered. 
The instruction handles this automatically, saving us from additional programming.


•		Instruction: INPUT$( n, @)
n -> number belonging to the range (1<= n <=250)
@ -> Wildcard character.		
Use: For selecting options in programs. Eliminates a screen refresh cycle. For using program access keys, 
as it allows you to enter a maximum number of characters (n) without them being displayed.

Example.- 		5 PRINT”(1) Enter data”TAB(0”(2)Calculate”;
10 op=VAL(INPUT$(1,@)):ONop GOTO100,200:
GOTO 10
100 REM Enter data
200 REM Calculate

The instruction can also be used to cause a pause in the program:			
10 PRINT “Press any key to continue”;
20 $=INPUT$(1,@)
30 REM continue the program


•		Instruction: CALC$
Utility: To store a formula in a string variable, which saves its contents in the formula storage 
area (Function Memory), from a BASIC program.

Example.- 		10 CALC$=”AREA=BASE*HEIGHT”

Pressing OUT (Function Memory key) will display the formula.
This variable will normally be accompanied by the CALCJMP function


•		Instruction: CALCJMP
Utility: Performs the function of the CALC (Function Memory) key by assigning values to the variables in the formula.

Example.- 		10 CALC$=”AREA=BASE*HEIGHT”
20 CALCJMP

Note: This function should only be used from MODE 0 (CALC Mode). Using it from MODE 1 (BASIC Mode) will 
generate an invalid function call error (FC error).


•		Instruction: DEFCHR$(n)
n -> number, range 252 <=n<=255
Utility: Variable that defines the last 4 characters of the calculator's ASCII code.
For further clarification, see the chapter "Changing ASCII Characters".

Example.- 		10 DEFCHR$(252)=”FFFFFFFFFF”
20 PRINT CHR$(252);


