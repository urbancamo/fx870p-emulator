5 ON ERROR GOTO 900
10 MODE 8:DIM:ERASE a,a$:DIM a(2),a$(2):a$(0)="r:inside":a$(1)="R:outside":a$(2)="l:side"
20 ANGLE 0:n=0:c$=CHR$(5)
30 CLS:PRINT "Area (polygon)";TAB(0);"1:n,rÊA   2:n,RÊA   3:n,lÊA";
31 f=ASC(INPUT$(1,@))-48:IF f<1 OR f>3 THEN 31
32 m$="Polygon  "
35 s$="n:number":z=n:GOSUB 500:n=z:IF n<3 OR n>=1e7 OR FRAC n<>0 THEN 35
36 m$=m$+"(n="+MID$(STR$(n),2)+")  "
37 s$=a$(f-1):z=a(f-1):GOSUB 500:a(f-1)=z
40 ON f GOTO 41,42,43
41 s=n*a(0)^2*TAN(180/n):GOTO 50
42 s=n*a(1)^2*SIN(360/n)/2:GOTO 50
43 s=n*a(2)^2/TAN(180/n)/4
50 LOCATE 0,1:PRINT c$;"Area =";ABS s;:z$=INPUT$(1,@):GOTO 30
500 CLS:PRINT m$;s$;
510 LOCATE 0,1:PRINT c$;LEFT$(s$,1);"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z<0 THEN 510 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=510 THEN RESUME 510
920 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 30
