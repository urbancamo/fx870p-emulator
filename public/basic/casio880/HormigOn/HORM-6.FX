1 'ROZYPEN
10 CLS:PRINT " ***** CALCULO DE PERDIDAS ****";:LOCATE 0,1
15 PRINT " * ROZAMIENTO Y PENETR. CU#AS *"
20 CLEAR :CLS
30 INPUT "Numero de puntos";PU
40 DIM F(PU),X(PU),Aalfa(PU),alfa(PU),P(PU),P1(PU),AP(PU),DI(PU),Y(PU)
50 FOR I=1 TO PU
55 CLS:PRINT "Punto";I;:LOCATE 0,1
60 PRINT "Excentricidad (m)";:INPUT Y(I)
70 PRINT "Coordenada del punto";:INPUT DI(I)
80 NEXT I
81 FOR I=1 TO PU-1
82 F(I+1)=ABS(Y(I+1)-Y(I))
83 NEXT I
85 PRINT "Fuerza de tesado (T)";:INPUT P0
90 PRINT "Nu(rad^-1)";:INPUT nu
100 PRINT "k/nu (rad/m)";:INPUT k
110 FOR I=1 TO PU-1
120 Aalfa(I+1)=2*F(I+1)/(DI(I+1)-DI(I))
130 alfa(I+1)=Aalfa(I+1)+alfa(I)
140 P(I+1)=P0*(1-nu*(alfa(I+1)+DI(I+1)*k))
150 P1(I+1)=P0*nu*(alfa(I+1)+DI(I+1)*k)
160 NEXT I
165 CLS
170 FOR I=1 TO PU
175 CLS:PRINT "Seccion";I;:LOCATE 0,1
180 PRINT CHR$(238)"alfa=";ROUND(Aalfa(I),-4);"rad","alfa=";ROUND(alfa(I),-4);"rad"
185 PRINT "P=";ROUND(P(I),-2);"tn",CHR$(238);"P=";ROUND(P1(I),-2);"tn"
190 PRINT "%P=";ROUND(P1(I)*100/P0,-3)
195 NEXT I
200 CLS:PRINT "PENETRACION DE CU#AS";:LOCATE 0,1
210 PRINT "Deslizamiento a(cm)";:INPUT a
220 PRINT "Ep(K/cm^2)";:INPUT Ep
230 PRINT "Ap(cm^2)";:INPUT Ap
240 FOR I=1 TO PU-1
250 X(I+1)=DI(I+1)-DI(I)
260 NEXT I
270 M=SQR(a*Ep*Ap/(P0*1E3*(nu*alfa(2)/(X(2)*100)+nu*k/100))
272 PRINT "Z=";ROUND(M*1E-2,-3);"m"
275 IF M>X(2) THEN PRINT "Pasamos al 2 tramo" ELSE PRINT "Distancia afectada=";ROUND(M,-3)
280 I=2
290 AP(I+1)=(P1(I+1)-P1(I))/X(I+1)
300 Y1=AP(I+1) :PRINT "a*z'^2=";ROUND(Y1,-3) "z'^2"
310 FOR J=I TO 1 STEP-1
320 ST=ST+X(J)
325 NEXT J
330 Y2=2*AP(I+1)*ST:PRINT "b*z'=";Y2"z'"
340 FOR J=I TO 1 STEP-1
350 FOR H=I-1 TO 1 STEP-1
360 SR=SR+X(H):NEXT H
370 L=L+AP(J)*X(J)*(X(J)+2*SR)
375 NEXT J
380 Y3=L+(P1(2)*X(2))
390 Y4=Y3-(a*Ep*Ap)/1E5 :PRINT "c=";Y4:CLS
395 PRINT "La ecuacion es ";
396  PRINT ROUND(Y1,-3)"z'^2";"+";Y2"z";Y4 :CLS
400 disc=((Y2)^2)-(4*Y1*Y4)
410 Q=(-Y2+SQR(disc))/(2*Y1)
415 PRINT "El valor de z'=";ROUND(Q,-3);"m":CLS
420 FOR J=I TO 1 STEP-1
430 SS=SS+X(J):NEXT J
440 Z=Q+SS
450 IF Z<DI(I+1) THEN 500
460 I=I+1
470 PRINT "Pasamos al tramo "I"
475 Y1=0:Y2=0:Y3=0:Y4=0:Q=0:Z=0:L=0:SS=0:ST=0:SR=0:disc=0
480 GOTO 290
500 PRINT "Distancia afectada=";ROUND(Z,-3)"m"
510 APP2=2*(Y1*Q+P1(I))
520 PRINT CHR$(238)"P"CHR$(146)"=";ROUND(APP2,-4);"tn"
530 END
