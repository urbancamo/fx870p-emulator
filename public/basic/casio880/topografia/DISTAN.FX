10 CLS
20 CLEAR
25 DIM A(2),B(2),C(2),D(2),T(2),S(2),O(2),P(2),N(2)
30 PRINT "Coordenadas y Acimutes"
40 INPUT "Sexagesimal/Centesimal (S/C)";A$:IF A$="" THEN 40
50 IF A$="S" THEN ANGLE 0
60 IF A$="C" THEN ANGLE 2
70 IF A$="S" THEN K=180
80 IF A$="C" THEN K=200
100 PRINT "Menu Principal"
110 PRINT "-Acimut y dist. entre 2 ptos."
120 PRINT "-Coo.a partir de acimut y dist."
130 PRINT "-Dist. de un pto. a una recta"
140 PRINT "-Interseccion entre 2 rectas"
145 PRINT "-Pto. perpedic. a una recta"
150 PRINT "-Fin del trabajo"
160 INPUT "      (A/C/D/I/P/F)";M$:IF M$="" THEN 160
170 IF M$="A" THEN GOSUB 260
180 IF M$="C" THEN GOSUB 510
190 IF M$="I" THEN GOSUB 600
200 IF M$="D" THEN GOSUB 800
210 IF M$="F" THEN END
215 IF M$="P" THEN GOSUB 360
220 GOTO 100
250 I=2
255 GOTO 270
260 I=1
270 INPUT "X primer pto. recta :";A(I)
280 INPUT "Y primer pto. recta :";B(I)
290 INPUT "X segundo pto. recta :";C(I)
300 INPUT "Y segundo pto. recta :";D(I)
310 T(I)=ATN((C(I)-A(I))/(D(I)-B(I)))
315 GOSUB 950
320 S(I)=SQR((C(I)-A(I))^2+(D(I)-B(I))^2)
330 PRINT "Acimut entre los ptos. :";T(I)
340 PRINT "Distancia entre los ptos. :";S(I)
350 RETURN
360 PRINT "Recta definida por :"
365 INPUT "1 pto. y acimut/2 ptos. (1/2)";P$ : IF P$="" THEN 365
370 IF P$="2" THEN GOSUB 260
375 IF P$="1" THEN GOSUB 510
377 I=2
380 INPUT "X pto. de perpendic.";A(2)
385 INPUT "Y pto. de perpendic.";B(2)
390 INPUT "Distancia del pto.";S(2)
395 C(2)=A(2)+S(2)*COS(T(1))
397 D(2)=B(2)-S(2)*SIN(T(1))
400 GOSUB 580
410 X=A(2)-S(2)*COS(T(1))
415 Y=B(2)+S(2)*SIN(T(1))
420 PRINT "Otra coo X :";X
425 PRINT "Otra coo Y :";Y
430 GOTO 100
500 I=2
505 GOTO 520
510 I=1
520 INPUT "X del pto. recta :";A(I)
530 INPUT "Y del pto. recta :";B(I)
540 INPUT "Acimut de la recta :";T(I)
550 INPUT "Dist. entre los ptos. :";S(I)
560 C(I)=A(I)+S(I)*SIN(T(I))
570 D(I)=B(I)+S(I)*COS(T(I))
580 PRINT "X del pto. :";C(I)
590 PRINT "Y del pto. :";D(I)
594 RETURN
600 PRINT "1a Recta definida por :"
610 INPUT "1 pto. y acimut/2 ptos. (1/2)";P$:IF P$="" THEN 610
620 IF P$="2" THEN GOSUB 260
625 IF P$="1" THEN GOSUB 510
630 PRINT "2a Recta definida por :"
635 INPUT "1 pto. y acimut/2 ptos. (1/2)";Q$ :IF Q$="" THEN 635
640 IF Q$="2" THEN GOSUB 250
645 IF Q$="1" THEN GOSUB 500
647 GOSUB 650 : GOTO 100
650 FOR I=1 TO 2
660 N(I)=1/(C(I)-A(I))
670 O(I)=-1/(D(I)-B(I))
680 P(I)=-A(I)/(C(I)-A(I))+B(I)/(D(I)-B(I))
685 NEXT I
690 X=(P(1)*O(2)-P(2)*O(1))/(N(2)*O(1)-N(1)*O(2))
700 Y=(N(2)*P(1)-P(2)*N(1))/(N(1)*O(2)-N(2)*O(1))
710 PRINT "X del pto. de interseccion :";X
720 PRINT "Y del pto. interseccion :";Y
730 RETURN
800 PRINT "Recta definida por :"
810 INPUT "1 pto. y acimut/2 ptos. (1/2)";P$:IF P$="" THEN 810
820 IF P$="2" THEN GOSUB 260
830 IF P$="1" THEN GOSUB 510
840 INPUT "X del pto. a medir :";A(2)
860 INPUT "Y del pto. a medir :";B(2)
890 C(2)=A(2)+100*COS(T(1))
900 D(2)=B(2)-100*SIN(T(1))
910 GOSUB 650
920 G=SQR((A(2)-X)^2+(B(2)-Y)^2)
930 PRINT "Dist. del pto. a la recta :";G
940 GOTO 100
950 IF A(I)<C(I) THEN GOTO 980
955 T(I)=T(I)+K
960 IF D(I)>B(I) THEN T(I)=2*K+T(I)
970 RETURN
980 IF B(I)>D(I) THEN T(I)=K+T(I)
990 RETURN
