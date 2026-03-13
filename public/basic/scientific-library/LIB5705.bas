5 ON ERROR GOTO 900
20 MODE 8:DIM:a=0:b=0:h=0:c$=CHR$(5)
30 CLS:PRINT "�h(3a�+3b�+h�)/6     a:b:radius";
40 s$="a":z=a:GOSUB 500:a=z
41 s$="b":z=b:GOSUB 500:b=z
42 CLS:PRINT "�h(3a�+3b�+h�)/6     h:height";
43 s$="h":z=h:GOSUB 500:h=z
50 LOCATE 0,1:PRINT c$;"Volume =";PI*h*(3*a^2+3*b^2+h^2)/6;:z$=INPUT$(1,@):GOTO 30
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
