5 ON ERROR GOTO 1000
10 MODE 8:DIM:DEF CHR$(255)="0000FE0000":e=0:f=0:c=0:d=0:g=0:h=0:l$=CHR$(5):GOSUB 580
20 a=e:b=f
30 x=a:GOSUB 530:a=x:x=b:GOSUB 530:b=x
50 IF b<0 THEN a$=" -" ELSE a$=" +"
60 LOCATE 0,0:c$=STR$(a):IF a THEN d$=STR$(ABS b) ELSE d$=STR$(b)
70 IF ABS b=1 THEN d$=MID$(d$,1,1)
80 PRINT l$;:IF b=0 THEN PRINT c$;ELSE IF a=0 THEN PRINT d$;"i"; ELSE PRINT c$;a$;d$;"i";
90 LOCATE 26,1:z=ASC(INPUT$(1)):IF z>96 THEN z=z-32
100 ON z-41 GOTO 260,260,,260,600,260,,,,,,,,,,,,,,,,,,220,,380,,,,420,,480,,,400,360,,,,,,500,,,,,,,,,,,450
110 GOTO 90
220 CLS:PRINT "Complex number  A(a+bi)";
230 e$="a":x=a:GOSUB 520:a=x:e$="b":x=b:GOSUB 520:b=x:GOSUB 580:GOTO 50
260 CLS:PRINT "Complex number  B(c+di)";
270 e$="c":x=c:GOSUB 520:c=x:e$="d":x=d:GOSUB 520:d=x
290 GOSUB 580:ON z-41 GOTO 310,320,,330,,340
310 e=a*c-b*d:f=b*c+a*d:GOTO 20
320 e=a+c:f=b+d:GOTO 20
330 e=a-c:f=b-d:GOTO 20
340 e=(a*c+b*d)/(c*c+d*d):f=(b*c-a*d)/(c*c+d*d):GOTO 20
360 g=a:h=b:GOTO 30
380 e=a:f=b:a=c:b=d:c=e:d=f:GOTO 30
400 a=g:b=h:GOTO 30
420 e=SQR(a*a+b*b):f=ACS(a/e):IF b THEN f=f*SGN(b)
430 CLS:PRINT "r =";e;TAB(0);"Œ =";f;:a$=INPUT$(1,@):GOSUB 580:GOTO 50
450 e=a*a-b*b:f=2*a*b:GOTO 20
480 e=a/(a*a+b*b):f=-b/(a*a+b*b):GOTO 20
500 IF b=0 THEN IF a<0 THEN f=SQR(-a):e=0:GOTO 20 ELSE e=SQR a:f=0:GOTO 20
510 IF b<>0 THEN x=SQR(a*a+b*b):e=SQR((a+x)/2):f=b/(2*e):GOTO 20
520 LOCATE 0,1:PRINT l$;e$;"=";x;"?";:INPUT @14;x:LOCATE 0,0
530 IF x<>0 AND ABS x>=1e-90 THEN x=ROUND(x,LOG(ABS x)-8)
540 IF x<>0 AND ABS x<1e-90 THEN x=x*1e10:x=ROUND(x,LOG(ABS x)-8):x=x/1e10
550 RETURN
580 CLS:LOCATE 0,1:PRINT ">A,G,I,S,^,+,-,*,/,M,L,C ?";:RETURN
600 CLS:GOSUB 710:i=2
610 PRINT:ON i GOSUB 710,715,720,730,740,750,760,770,780,800,810,820
620 z=ASC(INPUT$(1,@)):IF z=28 OR z=29 THEN 690
630 IF z<>13 AND z<>30 AND z<>31 THEN 620
640 IF(z=30 AND i=1) OR(z=31 AND i=12) THEN 620
650 IF z=30 THEN i=i-2
680 i=i+1:IF i<13 THEN 610
690 GOSUB 580:GOTO 50
710 PRINT " A : input A";:RETURN
715 PRINT " G : Gauss  r=ÿAÿ:Œ=argument(A)";:RETURN
720 PRINT " I : inverse         1/A æ A";:RETURN
730 PRINT " S : square root     ‚A æ A";:RETURN
740 PRINT " ^ : square          A’ æ A";:RETURN
750 PRINT " + : addition        A+B æ A";:RETURN
760 PRINT " - : subtraction     A-B æ A";:RETURN
770 PRINT " * : multiplication  A*B æ A";:RETURN
780 PRINT " / : division        A/B æ A";:RETURN
800 PRINT " M : memory          A æ M";:RETURN
810 PRINT " L : load            A ä M";:RETURN
820 PRINT " C : change          A äæ B";:RETURN
1000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
1010 IF ERL=520 THEN RESUME 520
1030 LOCATE 0,0:PRINT l$;"not found";:a$=INPUT$(1,@):RESUME 690
