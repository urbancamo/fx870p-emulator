5 ON ERROR GOTO 900
20 MODE 8:DIM:r=0:s=0:h=0:c$=CHR$(5)
30 CLS:PRINT "çh(r’+rR+R’)/3      r:R:radius";
40 s$="r":z=r:GOSUB 500:r=z
41 s$="R":z=s:GOSUB 500:s=z
42 CLS:PRINT "çh(r’+rR+R’)/3      h:height";
43 s$="h":z=h:GOSUB 500:h=z
50 LOCATE 0,1:PRINT c$;"Volume =";PI*h*(s^2+s*r+r^2)/3;:z$=INPUT$(1,@):GOTO 30
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
