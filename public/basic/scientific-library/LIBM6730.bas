5 IF sq<>60 AND sq<>62 THEN sq=226
10 MODE 8:DIM:GOSUB 900:ERASE b$:DIM b$(1):b$(0)="Reject":b$(1)="Accept":t$="Test     H�:��=���  H�:��"+CHR$(sq)+"���":c$=CHR$(5):DEF CHR$(252)="123E020000"
20 CLS:PRINT t$;TAB(0);"input new data (Y/N) ?";:a$=INPUT$(1)
25 IF a$<>"Y" AND a$<>"y" THEN 40
30 s$="x":GOSUB "LIB0:S6020":GOSUB 900
40 r=0:f=5:s=sa:IF s>1 THEN t=sm ELSE t=0
45 CLS:PRINT t$;
50 z=r:s$="���":GOSUB 500:r=z
60 z=s:s$="n":GOSUB 500:s=z
70 z=t:s$="S":GOSUB 500:t=z
90 CLS:PRINT "Significance level �[%]";
95 z=f:s$="�":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT t$;TAB(0);".....";
100 n=s-1:p=f/100:IF sq=226 THEN p=p/2 ELSE IF sq=60 THEN p=1-p
102 g=0:sr=0:GOSUB "LIB0:S6420":GOSUB 900:IF sr THEN*
104 IF sq=226 THEN g=x:p=1-p:GOSUB "LIB0:S6420":GOSUB 900:IF sr THEN* ELSE b=x:x=g:g=b
110 b=1:z=t/r:GOSUB 400:a=z:z=x:GOSUB 400:x=z:z=g:GOSUB 400:g=z
120 IF(sq=226 OR sq=62) AND a>x THEN b=0
122 IF sq=60 AND a<x THEN b=0
123 IF sq=226 AND a<g THEN c=0 ELSE c=1
130 z=SGN(sq-60):PRINT c$;a;CHR$(60+z*2+b*(164-z));x;:IF sq<63 THEN PRINT ": ";b$(b);:GOTO 150
140 PRINT TAB(0);a;CHR$(60+c*164);g;": ";b$(b AND c);
150 a$=INPUT$(1,@):GOTO 45
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 20
