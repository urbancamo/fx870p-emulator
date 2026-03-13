5 IF sq<>60 AND sq<>62 THEN sq=226
10 MODE 8:DIM:GOSUB 900:ERASE b$:DIM b$(1):b$(0)="Reject":b$(1)="Accept":t$="Test     H�:p=p�  H�:p"+CHR$(sq)+"p�":f=5:c$=CHR$(5):r=0:s=0:t=0:DEF CHR$(252)="123E020000"
45 CLS:PRINT t$;
50 z=r:s$="p�":GOSUB 500:r=z:IF r>=1 OR r=<0 THEN 50
60 z=s:s$="n":GOSUB 500:s=z
70 z=t:s$="�x":GOSUB 500:t=z
90 CLS:PRINT "Significance level �[%]";
95 z=f:s$="�":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT t$;TAB(0);".....";
100 p=f/100:IF sq=226 THEN p=p/2
105 sr=0:GOSUB "LIB0:S6410":GOSUB 900:IF sr THEN*
107 z=t-s*r:IF sq=226 THEN z=ABS z
110 b=1:z=z/SQR(s*r*(1-r)):GOSUB 400:a=z:z=x:GOSUB 400:x=z
120 IF(sq=226 OR sq=62) AND a>x THEN b=0
122 IF sq=60 THEN x=-x:IF a<x THEN b=0
130 z=SGN(sq-60):PRINT c$;a;CHR$(60+z*2+b*(164-z));x;": ";b$(b);:a$=INPUT$(1,@):GOTO 45
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 45
