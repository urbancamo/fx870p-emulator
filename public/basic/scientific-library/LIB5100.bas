5 ON ERROR GOTO 2000:DEFSEG=0
10 CLS:MODE 8:DIM:ERASE a,b,d:DIM a(1,1),b(1,1),d(1,1):m=1:n=1:o=1:p=1:q=1:r=1:c$=CHR$(5):e=1
40 GOSUB 460:GOSUB 470:GOSUB 420
50 LOCATE 0,0:PRINT c$;"Matrix  A";m$;":B";n$;
60 LOCATE 28,1:z=ASC(INPUT$(1)):IF z>96 THEN z=z-32
100 ON z-41 GOTO 1250,1300,,1350,1500,,,,,,,,,,,,,,,,,,,120,130,700,800,,,,,800,,1400,1100,1150,,,300,,,,1200
110 GOTO 60
120 x=m:GOTO 500
130 x=o:GOTO 600
300 LOCATE 0,0:FOR i=0 TO m:FOR j=0 TO n:z=a(i,j):IF z<>0 AND ABS z>=1e-90 THEN z=ROUND(z,LOG(ABS z)-7)
310 IF z<>0 AND ABS z<1e-90 THEN z=z*1e10:z=ROUND(z,LOG(ABS z)-7):z=z/1e10
320 PRINT c$;"a(";MID$(STR$(i+1),2);",";MID$(STR$(j+1),2);") =";z;
330 z=ASC(INPUT$(1,@)):IF z=28 OR z=29 THEN 50
340 IF z>96 THEN z=z-32
350 ON z-41 GOTO 1250,1300,,1350,1500,,,,,,,,,,,,,,,,,,,120,130,700,800,,,,,800,,1400,1100,1150,,,300,,,,1200
360 IF z<>13 AND z<>31 AND z<>30 THEN 330
370 IF(z=31 AND i+j=n+m) OR(z=30 AND i+j=0) THEN 330
390 IF z=30 THEN IF j=0 THEN i=i-1:j=n-1 ELSE j=j-2
400 NEXT:NEXT:GOTO 50
420 CLS:PRINT:PRINT ">A,B,D,I,T,K,+,-,*,M,L,C,P ?";:RETURN
440 FOR i=0 TO m:FOR j=0 TO n:a(i,j)=c(i,j):NEXT:NEXT:RETURN
460 n$="("+MID$(STR$(o+1),2)+","+MID$(STR$(p+1),2)+")":RETURN
470 m$="("+MID$(STR$(m+1),2)+","+MID$(STR$(n+1),2)+")":RETURN
480 m$="("+MID$(STR$(i+1),2)+","+MID$(STR$(j+1),2)+")":RETURN
500 i=x:j=n:GOSUB 480:p$="A(m,n) = A"+m$:s$="m":z=x+1:GOSUB 1900:IF w THEN 40 ELSE x=z-1
510 i=x:j=n:GOSUB 480:p$="A(m,n) = A"+m$:s$="n":z=n+1:GOSUB 1900:IF w THEN 500
520 m=x:n=z-1
530 DIM a(m,n)
540 FOR i=0 TO m:FOR j=0 TO n
550 p$="a("+MID$(STR$(i+1),2)+","+MID$(STR$(j+1),2)+")"
560 z=a(i,j):GOSUB 1850:IF w=13 THEN a(i,j)=z:GOTO 580
570 IF j=0 THEN IF i=0 THEN 510 ELSE i=i-1:j=n-1 ELSE j=j-2
580 NEXT:NEXT:GOTO 40
600 i=x:j=p:GOSUB 480:p$="B(m,n) = B"+m$:s$="m":z=x+1:GOSUB 1900:IF w THEN 40 ELSE x=z-1
610 i=x:j=p:GOSUB 480:p$="B(m,n) = B"+m$:s$="n":z=p+1:GOSUB 1900:IF w THEN 600
620 o=x:p=z-1
630 DIM b(o,p)
640 FOR i=0 TO o:FOR j=0 TO p
650 p$="b("+MID$(STR$(i+1),2)+","+MID$(STR$(j+1),2)+")"
660 z=b(i,j):GOSUB 1850:IF w=13 THEN b(i,j)=z:GOTO 680
670 IF j=0 THEN IF i=0 THEN 610 ELSE i=i-1:j=n-1 ELSE j=j-2
680 NEXT:NEXT:GOTO 40
700 LOCATE 0,0:PRINT c$;"Change  A";m$;" дж B";n$;:IF m=o AND n=p THEN 750
710 ERASE c:DIM c(m,n):FOR i=0 TO m:FOR j=0 TO n:c(i,j)=a(i,j):NEXT:NEXT
720 ERASE a:DIM a(o,p):FOR i=0 TO o:FOR j=0 TO p:a(i,j)=b(i,j):NEXT:NEXT
730 ERASE b:DIM b(m,n):FOR i=0 TO m:FOR j=0 TO n:b(i,j)=c(i,j):NEXT:NEXT
740 x=m:y=n:m=o:n=p:o=x:p=y:z$=m$:m$=n$:n$=z$:GOTO 50
750 FOR i=0 TO m:FOR j=0 TO n:w=a(i,j):a(i,j)=b(i,j):b(i,j)=w:NEXT:NEXT:GOTO 50
800 LOCATE 0,0:IF m<>n THEN GOSUB 1830:GOTO 50
810 IF z=68 THEN PRINT c$;"Determinant A = ....."; ELSE PRINT c$;"Inverse A ж A";
820 t=1E-10:d=1
830 ERASE c,e:y=2*(m+1)-1:x=m:DIM c(x,y),e(x)
840 FOR i=0 TO m:FOR j=0 TO n:c(i,j)=a(i,j):NEXT:NEXT
850 FOR i=0 TO m:FOR j=n+1 TO y:IF i=j-n-1 THEN c(i,j)=1
860 NEXT:NEXT
870 FOR i=0 TO x:e(i)=i:NEXT
880 FOR k=0 TO x:w=ABS(c(k,k)):a=k:b=k
890 FOR i=k TO x:FOR j=k TO x:IF w<ABS(c(i,j)) THEN w=ABS(c(i,j)):a=i:b=j
900 NEXT:NEXT
920 IF w<t THEN IF z=68 THEN d=0:GOTO 1000 ELSE GOSUB 1830:GOTO 50
940 IF k<>a THEN d=-d:FOR j=k TO y:w=c(k,j):c(k,j)=c(a,j):c(a,j)=w:NEXT
950 IF k<>b THEN d=-d:FOR i=0 TO x:w=c(i,k):c(i,k)=c(i,b):c(i,b)=w:NEXT:w=e(k):e(k)=e(b):e(b)=w
960 w=c(k,k):d=d*w:c=k+1:FOR j=c TO y:c(k,j)=c(k,j)/w:NEXT
970 FOR i=0 TO x:IF i<>k THEN w=c(i,k):FOR j=c TO y:c(i,j)=c(i,j)-w*c(k,j):NEXT
980 NEXT:NEXT
1000 IF z=68 THEN PRINT c$;"Determinant A =";STR$(d);:z$=INPUT$(1,@):GOTO 50
1040 w=x+1:FOR j=w TO y:FOR i=0 TO x:w=e(i):c(w,x)=c(i,j):NEXT
1050 FOR i=0 TO x:c(i,j)=c(i,x):NEXT:NEXT
1070 FOR i=0 TO x:FOR j=0 TO x:a(i,j)=c(i,j+x+1):NEXT:NEXT:GOTO 300
1100 m=q:n=r:GOSUB 470:LOCATE 0,0:PRINT c$;"Load  A д M";m$;
1110 ERASE a:DIM a(m,n):FOR i=0 TO m:FOR j=0 TO n:a(i,j)=d(i,j):NEXT:NEXT:GOTO 50
1150 q=m:r=n:GOSUB 470:LOCATE 0,0:PRINT c$;"Memory  A ж M";m$;
1160 ERASE d:DIM d(q,r):FOR i=0 TO m:FOR j=0 TO n:d(i,j)=a(i,j):NEXT:NEXT:GOTO 50
1200 w=m:m=n:n=w:GOSUB 470:LOCATE 0,0:PRINT c$;"Transpose  A ж A";m$;
1210 ERASE c:DIM c(m,n):FOR i=0 TO n:FOR j=0 TO m:c(j,i)=a(i,j):NEXT:NEXT
1220 ERASE a:DIM a(m,n):GOSUB 440:GOTO 300
1250 LOCATE 0,0:IF n<>o THEN GOSUB 1830:GOTO 50
1260 i=m:j=p:GOSUB 480:PRINT c$;"A*B ж A";m$;
1270 ERASE c:DIM c(m,p):FOR i=0 TO m:FOR j=0 TO p:w=0:FOR k=0 TO n:w=w+a(i,k)*b(k,j):NEXT:c(i,j)=w:NEXT:NEXT:IF m<>o OR n<>p THEN n=p:ERASE a:DIM a(m,n)
1280 GOSUB 440:GOTO 300
1300 LOCATE 0,0:IF m<>o OR n<>p THEN GOSUB 1830:GOTO 50
1310 PRINT c$;"A+B ж A";m$;
1320 ERASE c:DIM c(m,n):FOR i=0 TO m:FOR j=0 TO n:c(i,j)=a(i,j)+b(i,j):NEXT:NEXT:GOSUB 440:GOTO 300
1350 LOCATE 0,0:IF m<>o OR n<>p THEN GOSUB 1830:GOTO 50
1360 PRINT c$;"A-B ж A";m$;
1370 ERASE c:DIM c(m,n):FOR i=0 TO m:FOR j=0 TO n:c(i,j)=a(i,j)-b(i,j):NEXT:NEXT:GOSUB 440:GOTO 300
1400 p$="k*A"+m$+" ж A":z=e:GOSUB 1950:GOSUB 420:IF w THEN 50 ELSE e=z
1410 LOCATE 0,0:PRINT p$;
1420 ERASE c:DIM c(m,n):FOR i=0 TO m:FOR j=0 TO n:c(i,j)=e*a(i,j):NEXT:NEXT:GOSUB 440:GOTO 300
1500 DEF CHR$(254)="0080F08000":CLS:GOSUB 1600:i=2
1510 PRINT:ON i GOSUB 1600,1610,1620,1630,1640,1650,1660,1670,1680,1690,1700,1710,1720
1520 z=ASC(INPUT$(1,@)):IF z=28 OR z=29 THEN 1580
1530 IF z<>13 AND z<>31 AND z<>30 THEN 1520
1540 IF(z=31 AND i=13) OR(z=30 AND i=1) THEN 1520
1550 IF z=30 THEN i=i-2
1570 i=i+1:IF i<14 THEN 1510
1580 GOSUB 420:GOTO 50
1600 PRINT " A : input A(m,n)";:RETURN
1610 PRINT " B : input B(m,n)";:RETURN
1620 PRINT " D : determinant A";:RETURN
1630 PRINT " I : inverse         Aћ ж A";:RETURN
1640 PRINT " T : transposition   Aю ж A";:RETURN
1650 PRINT " K : scalar-cal      k*A ж A";:RETURN
1660 PRINT " + : addition        A+B ж A";:RETURN
1670 PRINT " - : subtraction     A-B ж A";:RETURN
1680 PRINT " * : multiplication  A*B ж A";:RETURN
1690 PRINT " M : memory          A ж M";:RETURN
1700 PRINT " L : load            A д M";:RETURN
1710 PRINT " C : change          A дж B";:RETURN
1720 PRINT " P : print A(m,n)";:RETURN
1830 LOCATE 0,0:PRINT c$;"not found";:z$=INPUT$(1,@):RETURN
1850 CLS:PRINT p$;" =";z;
1860 LOCATE 0,1:PRINT c$;"?";:INPUT @16;z:LOCATE 0,0:w=PEEK(&H65B):RETURN
1900 CLS:PRINT p$;
1910 LOCATE 0,1:PRINT c$;s$;" ?";:INPUT @3;z:LOCATE 0,0:w=PEEK(&H65B)-13:IF w THEN RETURN
1920 IF z<1 OR z>10 OR FRAC(z)<>0 THEN 1910 ELSE RETURN
1950 CLS:PRINT p$;
1960 LOCATE 0,1:PRINT c$;"k=";z;"?";:INPUT @12;z:LOCATE 0,0:w=PEEK(&H65B)-13:RETURN
2000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
2010 IF ERL=1860 THEN RESUME 1860
2020 IF ERL=1910 THEN RESUME 1910
2030 IF ERL=1960 THEN RESUME 1960
2040 IF ERL=530 THEN ERASE a:RESUME 530
2050 IF ERL=630 THEN ERASE b:RESUME 630
2080 GOSUB 1830:RESUME 40
