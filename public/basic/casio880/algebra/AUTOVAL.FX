10 REM AUTOMAX
15 CLS
20 CLEAR
25 PRINT "Autovalores por aproximaciones sucesivas.";
30 INPUT "Orden matriz";N,"Num.max.iteraciones";NMI,"Cota de error:";CERR
40 DIM A(N,N),X(N),C(N)
50 REM Introduccion de A
55 FOR I=1 TO N
60 FOR J=1 TO N
70 PRINT "A(";I;",";J;")";
80 INPUT A(I,J)
90 NEXT J
100 NEXT I
110 PRINT"Valor inicial del vector propio"
120 FOR I=1 TO N
130 PRINT "X(";I;")";
140 INPUT X(I)
150 NEXT I
155 INPUT"Ver calculos intermedios S/N";V$
160 REM Modulo de iteracion
170 ITER=0
180 ITER=ITER+1
185 IF V$="" THEN PRINT "Iteracion:";ITER
190 FOR I=1 TO N
200 FOR J=1 TO N
210 C(I)=C(I)+A(I,J)*X(J)
220 NEXT J
230 NEXT I
240 T=MAXI
250 MAXI=0
260 FOR I=1 TO N
270 IF ABS C(I)>ABSMAXI THEN MAXI=C(I)
280 NEXT I
285 IF V$="S" THEN PRINT"Vector Normalizado";
290 FOR I=1 TO N
300 X(I)=C(I)/MAXI
303 IF INKEY$="" THEN 303
305 IF V$="S"THEN PRINT "X(";I;")=";X(I)
310 C(I)=0
320 NEXTI
330 REM Prueba del eror y num de iteraciones
340 IF ABS(T-MAXI)<=CERR THEN 400
350 IF ITER=NMI THEN PRINT"Num.de Iteraciones insuficiente":END
360 GOTO 180
400 REM Resultados
410 BEEP0:BEEP1:PRINT"Num.iteraciones =";ITER,"Autovalor max.=";MAXI,"Vector caracteristico"
415 IF INKEY$="" THEN 415
420 FOR I=1 TO N
430 PRINT "X(";I;")=";X(I)
435 IF INKEY$="" THEN 435
440 NEXTI
450 END
