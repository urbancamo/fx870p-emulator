5 ON ERROR GOTO 900
20 MODE 8:DIM:a=0:b=0:c=0:h=0:c$=CHR$(5)
30 CLS:PRINT "Area (parallelogram)";TAB(0);"1:ah       2:ab�sin�";
40 w=ASC(INPUT$(1,@))-48:IF w<1 OR w>2 THEN 40
50 ON w GOTO 100,200
100 CLS:PRINT "ah       a:base  h:height";
110 s$="a":z=a:GOSUB 500:a=z
120 s$="h":z=h:GOSUB 500:h=z
130 z=a*h:GOTO 400
200 CLS:PRINT "ab�sin�        a:b:side";
210 s$="a":z=a:GOSUB 500:a=z
220 s$="b":z=b:GOSUB 500:b=z
230 s$="�":z=c:GOSUB 500:c=z:IF SIN c<0 THEN 230
240 z=a*b*SIN c
400 LOCATE 0,1:PRINT c$;"Area =";z;:z$=INPUT$(1,@):GOTO 30
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=500 THEN RESUME 500
920 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
