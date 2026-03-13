5 ON ERROR GOTO 900
20 MODE 8:DIM:a=0:b=0:r=0:h=0:c$=CHR$(5)
30 CLS:PRINT "2�rh+�(a�+b�)    h:height";
50 s$="h":z=h:GOSUB 500:h=z
51 CLS:PRINT "2�rh+�(a�+b�)    a:b:r:radius";
52 s$="a":z=a:GOSUB 500:a=z
53 s$="b":z=b:GOSUB 500:b=z
54 s$="r":z=r:GOSUB 500:r=z
60 LOCATE 0,1:PRINT c$;"Surface =";PI*(2*r*h+a^2+b^2);:z$=INPUT$(1,@):GOTO 30
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=500 THEN RESUME 500
920 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
