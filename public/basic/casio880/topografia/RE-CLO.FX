1 PRINT "*REPLANTEO CIRCULO O CLOTOIDE*"
5 CLS:ANGLE 2
10 IF TAN(50)<>1 THEN PRINT "Calculo no centesimal":STOP
15 INPUT "Radio del circulo";R
16 INPUT "Orientacion de la alineacion de entrada ";ARIE
17 INPUT "Curva a la derecha D o a la izquierda D/I ";B$
18 A=1:IF B$="D" THEN A=-1
19 INPUT "Circulo o Clotoide (CR/CL) ";A$
20 IF A$="CR" THEN INPUT "Angulo entre tangentes";ANG
21 INPUT "Coordenada X del primer punto  ";X0
22 INPUT "Coordenada Y del primer punto  ";Y0
23 IF A$="CL" THEN INPUT "Longitud de la transicion espirica ";L
24 INPUT "Longitud del intervalo de calculo ";LINT
25 IF A$="CL" THEN 31
26 L=ANG*R/(200/PI):PRINT "Longitud de la transicion ";L
27 PRINT "Longitud de la cuerda  "2*R*SIN(ANG/2)
28 PRINT "Distancia hasta la interseccion de alineaciones  "R*TAN(ANG/2)
29 PRINT "Distancia desde la interseccion hasta el circulo "R*(1/COS(ANG/2)-1)
30 PRINT "Distancia desde el circulo a la cuerda "R*(1-COS(ANG/2))
31 FOR I=1 TO L/LINT
32 LONG=LINT*I
33 GOSUB 41:NEXT I
34 LONG=L
35 GOSUB 41
36 INPUT "Longitud para el calculo de un punto nuevo, ENTER para terminar ";LONG:IF  LONG=0 THEN END
37 GOSUB 41:GOTO 36
38 '
39 REM *SUBRUTINA DE SALIDA DE RESULTADOS*
40 '
41 IF A$="CR" THEN GOSUB 63 ELSE GOSUB 73
42 DIST = SQR(X^2+Y^2):AZIM=ATN(Y/X)
43 PRINT "ARCO "LONG
44 PRINT "   X replanteo "X
45 PRINT "   Y replanyeo "Y
46 PRINT "   Ang replant "AZIM
47 PRINT "   Dist replant "DIST
48 PRINT "Coordenada X= "X0+DIST*SIN(ARIE-AZIM*A)
49 PRINT "Coordenada Y= "Y0+DIST*COS(ARIE-AZIM*A)
50 RETURN
60 '
61 ' *COORDENADAS DEL CIRCULO*
62 '
63 X=R*SIN((200/PI)*LONG/R )
64 Y=R*(1-COS((200/PI)*LONG/R))
65 RETURN
70 '
71 ' *COORDENADAS DE LA CLOTOIDE*
72 '
73 J=1:X=0:Y=0:A2=SQR(R*L):AX=1:AY=1
74 IF ABS(AX)+ABS(AY) <.001 THEN 83
75 AX=A2*(-1)^(J+1):FOR J1=1 TO 2*J-2: AX=AX/(J1*2): NEXT J1
76 AX=AX*(LONG/A2)^(4*J-3)/(4*J-3)
77 X=X+AX
78 AY =A2*(-1)^(J+1):FOR J1=1 TO 2*J-1: AY=AY/(J1*2): NEXT J1
79 AY=AY*(LONG/A2)^(4*J-1)/(4*J-1)
80 Y=Y+AY
81 J=J +1
82 GOTO 74
83 RETURN
