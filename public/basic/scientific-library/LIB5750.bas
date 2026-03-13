5 ON ERROR GOTO 900
10 MODE 8:DIM:ERASE a,a$:DIM a(2),a$(2):a$(0)="r:inside":a$(1)="R:outside":a$(2)="l:side"
20 s=0:n=3:ANGLE 0:c$=CHR$(5):m$="Polygon (r,R,l)   "
40 s$="A:area":z=s:GOSUB 500:s=z
41 s$="n:number":z=n:GOSUB 500:n=z:IF n<3 OR FRAC n<>0 THEN 41
45 CLS:PRINT m$;:PRINT
50 a(0)=SQR(s/n/TAN(180/n))
51 a(1)=SQR(2*s/n/SIN(360/n))
52 a(2)=SQR(ABS(4*s/n*TAN(180/n)))
100 FOR i=0 TO 2:PRINT c$;a$(i) " =";a(i);
110 w=ASC(INPUT$(1,@)):IF w=13 THEN 170
120 IF w=30 AND i>0 THEN i=i-2:GOTO 170
130 IF w=31 AND i<2 THEN 170
160 GOTO 110
170 NEXT:GOTO 40
500 CLS:PRINT m$;s$;
510 LOCATE 0,1:PRINT c$;LEFT$(s$,1);"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 510 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=510 THEN RESUME 510
920 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 40
