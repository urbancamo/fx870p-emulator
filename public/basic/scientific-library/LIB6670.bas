10 MODE 8:DIM:GOSUB 900:c$=CHR$(5):f=95:r=0:s=0
45 CLS:PRINT "B(1,p) a<p<b";
50 z=r:s$="n":GOSUB 500:r=z
60 z=s:s$="�x":GOSUB 500:s=z
90 CLS:PRINT "Confidence level (1-�)[%]";
95 z=f:s$="1-�":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT "B(1,p)   ";f;"%";TAB(0);".....";
100 p=(1-f/100)/2:sr=0:GOSUB "LIB0:S6410":GOSUB 900:IF sr THEN*
110 e=s/r:z=e-x*SQR(((1-e)*e)/r):GOSUB 400:a=z
120 z=e+x*SQR(((1-e)*e)/r):GOSUB 400:b=z
130 PRINT c$;a;"< p <";b;:a$=INPUT$(1,@):GOTO 45
140 GOTO 50
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 45
