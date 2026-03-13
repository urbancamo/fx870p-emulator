5 ON ERROR GOTO 500
10 MODE 8:DIM:ERASE a:DIM a(4):a$="a b r x1y1":c$=CHR$(5)
20 CLS:PRINT "(x-a)�+(y-b)�=r�,(x1,y1)";
30 FOR i=0 TO 4
40 LOCATE 0,1:PRINT c$;MID$(a$,1+2*i,(SGN(i-2.5)+1)/2+1);"=";a(i);"?";:INPUT @42;a(i):LOCATE 0,0
45 IF i=2 AND a(2)<0 THEN 40
50 NEXT:LOCATE 0,1:PRINT c$;
60 w=(a(3)-a(0))^2+(a(4)-a(1))^2-a(2)^2:IF w<0 THEN 100 ELSE PRINT c$;"l:length =";SQR(w);:w$=INPUT$(1,@):GOTO 30
100 LOCATE 0,1:PRINT c$;"not found";:w$=INPUT$(1,@):GOTO 20
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 IF ERL=40 THEN RESUME 40
520 RESUME 100
5 ON ERROR GOTO 500
10 MODE 8:DIM:ERASE a:DIM a(4):a$="a b r x1y1":c$=CHR$(5)
20 CLS:PRINT "(x-a)�+(y-b)�=r�,(x1,y1)";
30 FOR i=0 TO 4
40 LOCATE 0,1:PRINT c$;MID$(a$,1+2*i,(SGN(i-2.5)+1)/2+1);"=";a(i);"?";:INPUT @42;a(i):LOCATE 0,0
45 IF i=2 AND a(2)<0 THEN 40
50 NEXT:LOCATE 0,1:PRINT c$;
60 w=(a(3)-a(0))^2+(a(4)-a(1))^2-a(2)^2:IF w<0 THEN 100 ELSE PRINT c$;"l:length =";SQR(w);:w$=INPUT$(1,@):GOTO 30
100 LOCATE 0,1:PRINT c$;"not found";:w$=INPUT$(1,@):GOTO 20
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 IF ERL=40 THEN RESUME 40
520 RESUME 100
