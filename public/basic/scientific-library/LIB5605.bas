5 ON ERROR GOTO 900
20 MODE 8:DIM:a=0:b=0:h=0:c$=CHR$(5)
30 CLS:PRINT "(a+b)h/2     a:b:base  h:height";
40 s$="a":z=a:GOSUB 100:a=z
50 s$="b":z=b:GOSUB 100:b=z
60 s$="h":z=h:GOSUB 100:h=z
70 LOCATE 0,1:PRINT c$;"Area =";(a+b)*h/2;:z$=INPUT$(1,@):GOTO 40
100 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 100 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=100 THEN RESUME 100
920 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
