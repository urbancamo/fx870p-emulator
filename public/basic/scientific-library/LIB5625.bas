5 ON ERROR GOTO 900
10 ANGLE 1:MODE 8:DIM:l=0:r=0:c$=CHR$(5):n$="(lr-r�sin(l/r))/2"
50 m$=n$+"     l:arc":s$="l":z=l:GOSUB 500:l=z
80 m$=n$+"     r:radius":s$="r":z=r:GOSUB 500:IF z<l/2/PI THEN 80 ELSE r=z
100 LOCATE 0,1:PRINT c$;"Area =";(l*r-r^2*SIN(l/r))/2;:z$=INPUT$(1,@):GOTO 50
300 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):GOTO 50
500 CLS:PRINT m$;
510 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @42;z:LOCATE 0,0:IF z=<0 THEN 500 ELSE RETURN
900 IF ERR=1 THEN CLS:ON ERROR GOTO 0
910 IF ERL=510 THEN RESUME 510
920 RESUME 300
