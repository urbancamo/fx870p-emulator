5 DIM coef(50), r(50), p(50), a$(1):SET n
10 CLS: PRINT "DIVISION SINTETICA"
15 LOCATE 0,1:PRINT "Orden de la ecuacion (2-7):";:oden$=INPUT$(1)
17 IF oden$<"2" or oden$>"7" THEN 15
20 oden=VAL(oden$):j=0:CLS
25 FOR i=oden TO 1 STEP (-1)
26 j=j+1
27 PRINT CHR$(64+j);"x";CHR$(144+i);"+";
28 NEXT i
29 PRINT CHR$(65+j);
40 FOR j=1 TO oden+1
50 LOCATE 0,1:PRINT CHR$(5);CHR$(30);
60 LOCATE 0,1:PRINT CHR$(64+j);"=";:INPUT coef
70 coef(j)=coef
80 NEXT j
90 r(1)=coef(1)
100 q=ABS(coef(oden+1))
105 i=0
110 CLS:PRINT "...pensando...";
111 i=i+1
115 IF i>2*q then 260
120 d=(-1)^(i+1)*ROUND(i/2,-1)
130 FOR j=2 to oden+1
140 p(j)=r(j-1)*d
150 r(j)=coef(j)+p(j)
160 NEXT j
170 IF r(j-1)=0 THEN 270
180 GOTO 111
260 CLS:PRINT "No factorable por este metodo";:PRINT:PRINT "Repetir (S/N)";:rep$=INPUT$(1)
265 IF rep$="S" OR rep$="s" THEN 5
267 GOTO 340
270 CLS
271 FOR j=1 TO oden
272 PRINT coef(j);CHR$(8);"x";CHR$(145+oden-j);
274 NEXT j
276 PRINT coef(j);
285 PRINT:PRINT "Divisor:";d
290 FOR j=1 TO oden+1
300 PRINT "Coeficiente ";j;":";r(j)
310 NEXT j
320 PRINT "Ver otros divisores (S/N)";:a$=INPUT$(1):PRINT
330 IF a$<>"N" THEN 110
340 CLS:END
