5 ON ERROR GOTO 1000
10 DEF CHR$(255)="0000FE0000":MODE 8:DIM:PRINT CHR$(15);
30 f$="":c$=CHR$(5):s=0:h=1e-5:e=1e-7:m=20:ANGLE 1
50 CLS:PRINT "Newton's method  f(x)=0";TAB(0);"1:f(x),x0       2:h,�,loop";
60 k=ASC(INPUT$(1,@)):IF k=13 OR k=49 THEN 90 ELSE IF k=50 THEN 150
80 GOTO 60
90 CLS:PRINT "Define function";
100 LOCATE 0,1:PRINT c$;"f(x) ?";f$;:LOCATE 0,0:LOCATE 6,1:INPUT @100;f$:LOCATE 0,0:z=VALF(f$)
110 IF LEN(f$)<25 THEN g$=f$ ELSE g$=LEFT$(f$,21)+"���"
120 m$="f(x) = "+g$:s$="x0":z=s:GOSUB 800:s=z:GOTO 250
150 m$="f�(x)=(f(x+h)-f(x))/h  (h>0)":s$="h":z=h:GOSUB 800:h=z:IF h=<0 THEN 150
170 m$="Err  �Xn+1-Xn�<�  (�>0)":s$="�":z=e:GOSUB 800:e=z:IF e<1e-90 THEN 170
200 m$="Max loop  (n>0)":s$="n":z=m:GOSUB 800:m=z:IF m=<0 OR FRAC m<>0 THEN 200 ELSE 50
250 CLS:PRINT m$;TAB(0);"x = .....";:t=s
310 FOR i=1 TO m
320 x=t:g=VALF(f$):x=t+h:f=VALF(f$):x=t-g*h/(f-g)
350 IF ABS(t-x)=<e THEN 500
360 t=x:NEXT:GOSUB 450
390 PRINT c$;"loop =";m;TAB(11);":Xn =";STR$(x);:LOCATE 0,0:LOCATE 1,1:z$=INPUT$(1,@):GOTO 50
450 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RETURN
500 x=ROUND(x,INT LOG(ABS e)-1):PRINT c$;"x =";x;:z$=INPUT$(1,@):GOTO 50
800 CLS:PRINT m$;
810 LOCATE 0,1:PRINT c$;s$ "=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
1000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
1010 IF ERL=100 THEN IF ERR=2 THEN RESUME 100 ELSE RESUME NEXT
1015 IF ERL=810 THEN RESUME 810
1020 GOSUB 450:RESUME 50
