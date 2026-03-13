5 ON ERROR GOTO 500
10 MODE 8:DIM:a=0:c=0:c$=CHR$(5)
20 CLS:PRINT "Angle(�) �- y=ax+b,y=cx+d";
30 s$="a":z=a:GOSUB 100:a=z
40 s$="c":z=c:GOSUB 100:c=z:LOCATE 0,1
60 IF a=c THEN PRINT c$;"Parallel"; ELSE IF a*c=-1 THEN PRINT c$;"Right angle"; ELSE PRINT c$;"� =";ATN((c-a)/(1+c*a));
70 w$=INPUT$(1,@):GOTO 30
100 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:RETURN
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 IF ERL=100 THEN RESUME 100
520 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 20
