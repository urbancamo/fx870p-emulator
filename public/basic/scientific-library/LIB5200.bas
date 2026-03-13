5 ON ERROR GOTO 1000
10 DEF CHR$(255)="0000FE0000":MODE 8:DIM:PRINT CHR$(15);
30 f$="":c$=CHR$(5):a=0:b=0:e=1e-7:m=8:ANGLE 1:ERASE a:DIM a(m)
50 CLS:PRINT "Romberg's method  Åf(x)dx [a,b] 1:f(x),[a,b]      2:ã,loop";
60 k=ASC(INPUT$(1,@)):IF k=13 OR k=49 THEN 90 ELSE IF k=50 THEN 170
80 GOTO 60
90 CLS:PRINT "Define function";
100 LOCATE 0,1:PRINT c$;"f(x) ?";f$;:LOCATE 0,0:LOCATE 6,1:INPUT @100;f$:LOCATE 0,0:z=VALF(f$)
110 IF LEN(f$)<21 THEN g$=f$ ELSE g$=LEFT$(f$,17)+"•••"
120 m$="Å "+g$+" dx [a,b]":s$="a":z=a:GOSUB 800:a=z
130 s$="b":z=b:GOSUB 800:b=z:GOTO 250
170 m$="Err  ˇAn+1-Anˇ<ã  (ã>0)":s$="ã":z=e:GOSUB 800:e=z:IF e<1e-90 THEN 170
200 m$="Max loop  2ú     (n>0)":s$="n":z=m:GOSUB 800:m=z:IF m=<0 OR FRAC m<>0 THEN 200 ELSE ERASE a:DIM a(m):GOTO 50
250 CLS:PRINT m$;TAB(0);"Åf(x)dx = .....";
260 h=b-a:x=a:g=VALF(f$):x=b:f=VALF(f$):a(0)=(g+f)*h/2
300 FOR i=1 TO m:h=h/2
310 s=0:FOR j=1 TO 2^i-1 STEP 2:x=a+j*h:s=s+VALF(f$):NEXT
320 a(i)=a(i-1)/2+h*s
330 n=1:FOR k=i-1 TO 0 STEP-1
340 a(k)=a(k+1)+(a(k+1)-a(k))/(4^n-1)
350 IF ABS(a(k+1)-a(k)) <e AND(i>3 OR i=m) THEN x=a(k):GOTO 500
360 n=n+1:NEXT:NEXT:GOSUB 450
390 PRINT c$;"n =";m;TAB(11);":An =";STR$(a(m-1));:LOCATE 0,0:LOCATE 1,1:z$=INPUT$(1,@):GOTO 50
450 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RETURN
500 x=ROUND(x,INT LOG(ABS e)-1):PRINT c$;"Åf(x)dx =";x;:z$=INPUT$(1,@):GOTO 50
800 CLS:PRINT m$;
810 LOCATE 0,1:PRINT c$;s$ "=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
1000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
1010 IF ERL=100 THEN IF ERR=2 THEN RESUME 100 ELSE RESUME NEXT
1015 IF ERL=810 THEN RESUME 810
1020 GOSUB 450:RESUME 50
