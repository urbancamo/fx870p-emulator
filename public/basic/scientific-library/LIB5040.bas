5 ON ERROR GOTO 2000:DEFSEG=0
10 MODE 8:DIM:ERASE a:c$=CHR$(5):n=2:m$="ax1+bx2+cx3+dx4+ex5+fx6+gx7"
30 CLS:PRINT "ax1+bx2+cx3+���=y     (2�n�7)";
40 LOCATE 0,1:PRINT c$;"n=";n;"?";:INPUT @2;n:LOCATE 0,0:IF n<2 OR n>7 THEN 40
60 m=n-1:DIM a(m,n):p$=LEFT$(m$,4*m+3)+"=y":CLS:PRINT p$;
100 FOR i=0 TO m:FOR j=0 TO n
110 s$=MID$(STR$(i+1),2)+":"+MID$(p$,j*4+1,1):z=a(i,j)
120 GOSUB 1950:IF w=0 THEN a(i,j)=z:GOTO 140
130 IF j=0 THEN IF i=0 THEN 30 ELSE i=i-1:j=n-1 ELSE j=j-2
140 NEXT:NEXT
160 LOCATE 0,1:PRINT c$;"x1 = .....";:GOTO 830
310 FOR i=0 TO m:z=b(i):IF z<>0 AND ABS z>=1e-90 THEN z=ROUND(z,LOG(ABS z)-7)
315 IF z<>0 AND ABS z<1e-90 THEN z=z*1e10:z=ROUND(z,LOG(ABS z)-7):z=z/1e10
320 PRINT c$;"x";MID$(STR$(i+1),2);" =";z;
330 w=ASC(INPUT$(1,@)):IF w=29 OR w=28 THEN 30
360 IF w<>13 AND w<>31 AND w<>30 THEN 330
370 IF(w=31 AND i=m) OR(w=30 AND i=0) THEN 330
390 IF w=30 THEN i=i-2
400 NEXT:GOTO 30
830 ERASE b,c,e:y=2*n-1:x=m:DIM c(x,y),e(x),b(x)
840 FOR i=0 TO m:FOR j=0 TO m:c(i,j)=a(i,j):NEXT:NEXT
850 FOR i=0 TO m:FOR j=n TO y:IF i=j-n THEN c(i,j)=1
860 NEXT:NEXT
870 FOR i=0 TO x:e(i)=i:NEXT
880 FOR k=0 TO x:w=ABS(c(k,k)):a=k:b=k
890 FOR i=k TO x:FOR j=k TO x:IF w<ABS(c(i,j)) THEN w=ABS(c(i,j)):a=i:b=j
900 NEXT:NEXT
920 IF w<1E-10 THEN GOSUB 1800:GOTO 30
940 IF k<>a THEN FOR j=k TO y:w=c(k,j):c(k,j)=c(a,j):c(a,j)=w:NEXT
950 IF k<>b THEN FOR i=0 TO x:w=c(i,k):c(i,k)=c(i,b):c(i,b)=w:NEXT:w=e(k):e(k)=e(b):e(b)=w
960 w=c(k,k):c=k+1:FOR j=c TO y:c(k,j)=c(k,j)/w:NEXT
970 FOR i=0 TO x:IF i<>k THEN w=c(i,k):FOR j=c TO y:c(i,j)=c(i,j)-w*c(k,j):NEXT
980 NEXT:NEXT
1040 FOR j=n TO y:FOR i=0 TO x:w=e(i):c(w,x)=c(i,j):NEXT
1050 FOR i=0 TO x:c(i,j)=c(i,x):NEXT:NEXT
1270 FOR i=0 TO m:w=0:FOR k=0 TO m:w=w+c(i,k+n)*a(k,n):NEXT:b(i)=w:NEXT:GOTO 310
1800 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RETURN
1950 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @43;z:LOCATE 0,0:w=PEEK(&H65B)-13:RETURN
2000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
2020 IF ERL=40 THEN RESUME 40
2030 IF ERL=1950 THEN RESUME 1950
2040 IF ERL=60 THEN ERASE a:RESUME 60
2080 GOSUB 1800:RESUME 30
