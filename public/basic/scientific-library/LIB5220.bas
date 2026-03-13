5 ON ERROR GOTO 1000
10 DEF CHR$(254)="060A12227E":MODE 8:DIM:PRINT CHR$(15);
30 f$="":c$=CHR$(5):a=0:b=0:h=1:ANGLE 1
90 CLS:PRINT "Define function  dy/dx";
100 LOCATE 0,1:PRINT c$;"?";f$;:LOCATE 0,0:LOCATE 1,1:INPUT @100;f$:LOCATE 0,0:z=VALF(f$)
110 IF LEN(f$)<17 THEN g$=f$ ELSE g$=LEFT$(f$,20)+"¥¥¥"
120 m$="dy/dx = "+g$:s$="x0":z=a:GOSUB 800:a=z
140 s$="y0":z=b:GOSUB 800:b=z
150 m$="Step-size  þh     (þh>0)":s$="þh":z=h:GOSUB 800:h=z:IF h=<0 THEN 150
250 m$="dy/dx = "+g$:n=50
270 ERASE a,b:DIM a(n),b(n):k=32:i=0:j=0:f=a:g=b:GOTO 355
300 IF k>31 THEN CLS:PRINT m$;TAB(0);"....."; ELSE PRINT c$;".....";
305 f=a(i-1):g=b(i-1):j=i
310 x=f:y=g:p=VALF(f$)*h
320 x=f+h/2:y=g+p/2:q=VALF(f$)*h
330 y=g+q/2:r=VALF(f$)*h
340 x=f+h:y=g+r:s=VALF(f$)*h
350 f=f+h:g=g+(p+2*q+2*r+s)/6
355 a(i)=f:b(i)=g
360 y$="="+STR$(g):IF SGN f<0 THEN z$="y("+STR$(f)+") " ELSE z$="y("+MID$(STR$(f),2)+") "
365 l=LEN(z$)+LEN(y$):IF l>31 THEN CLS:PRINT z$;TAB(0);y$; ELSE IF k>31 THEN CLS:PRINT m$;TAB(0);z$;y$; ELSE PRINT c$;z$;y$;
370 z=ASC(INPUT$(1,@)):k=l:IF z=29 OR z=28 THEN 90
375 IF z=31 AND i=n THEN 370
380 IF z=13 OR z=31 THEN IF i=n THEN 100 ELSE i=i+1:f=a(i):g=b(i):IF j>=i THEN 360 ELSE 300
390 IF z=30 AND i>0 THEN i=i-1:f=a(i):g=b(i):GOTO 360
400 GOTO 370
450 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RETURN
800 CLS:PRINT m$;
810 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
1000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
1010 IF ERL=100 THEN IF ERR=2 THEN RESUME 100 ELSE RESUME NEXT
1020 IF ERL=810 THEN RESUME 810
1030 GOSUB 450:RESUME 90
