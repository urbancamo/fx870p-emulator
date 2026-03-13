5 ON ERROR GOTO 900
20 MODE 8:DIM:a=0:b=0:c=0:h=0:d=0:c$=CHR$(5)
30 CLS:PRINT "Area (triangle)";TAB(0);"1:ah/2  2:ab�sin�/2  3:f(a,b,c)";:LOCATE 0,0:LOCATE 0,1
40 w=ASC(INPUT$(1,@))-48:IF w<1 OR w>3 THEN 40
50 ON w GOTO 100,200,300
100 CLS:PRINT "ah/2        a:base  h:height";
110 s$="a":z=a:GOSUB 500:a=z
120 s$="h":z=h:GOSUB 500:h=z
130 z=a*h/2:GOTO 400
200 CLS:PRINT "ab�sin�/2       a:b:side";
210 s$="a":z=a:GOSUB 500:a=z
220 s$="b":z=b:GOSUB 500:b=z
230 s$="�":z=d:GOSUB 500:d=z:IF SIN d<0 THEN 230
240 z=a*b*SIN d/2:GOTO 400
300 CLS:PRINT "�(s(s-a)(s-b)(s-c)),s=(a+b+c)/2";
320 s$="a":z=a:GOSUB 500:a=z
330 s$="b":z=b:GOSUB 500:b=z
340 s$="c":z=c:GOSUB 500:c=z
350 s=(a+b+c)/2:z=SQR(s*(s-a)*(s-b)*(s-c))
400 IF z<0 THEN 450
410 LOCATE 0,1:PRINT c$;"Area =";z;:z$=INPUT$(1,@):GOTO 30
450 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):GOTO 30
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=500 THEN RESUME 500
920 RESUME 450
