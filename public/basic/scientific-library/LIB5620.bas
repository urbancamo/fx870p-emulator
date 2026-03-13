5 ON ERROR GOTO 900
20 MODE 8:DIM:l=0:r=0:a=0:c$=CHR$(5):ANGLE 0
30 CLS:PRINT "Area (sector)";TAB(0);"1:lr/2     2:çr’Œ/360";
40 w=ASC(INPUT$(1,@))-48:IF w<1 OR w>2 THEN 40
50 ON w GOTO 100,200
100 CLS:PRINT "lr/2  l:circular arc   r:radius";
110 s$="l":z=l:GOSUB 500:l=z
120 s$="r":z=r:GOSUB 500:r=z
130 z=l*r/2:GOTO 400
200 CLS:PRINT "çr’Œ/360     r:radius  Œ:DEG";
220 s$="r":z=r:GOSUB 500:r=z
230 s$="Œ":z=a:GOSUB 500:a=z:IF a>360 THEN 230
240 z=PI*a*r^2/360
400 LOCATE 0,1:PRINT c$;"Area =";z;:z$=INPUT$(1,@):GOTO 30
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=500 THEN RESUME 500
920 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
