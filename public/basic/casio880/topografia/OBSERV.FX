10 CLS:PRINT "RELACIONES DE OBSERVACION:","(1) Para Distancias","(2) Para Direcciones","(3) Para Desniveles";
20 GOSUB "K$":J$=K$
30 IF J$<>"1" AND J$<>"2" AND J$<>"3" THEN 20
35 IF J$="3" THEN CLS:LOCATE 3,1:PRINT "Nada, nada: a pelo...":GOSUB "K$":GOTO 10
40 CLS:INPUT " X PUNTO ÷ ",XA,"Y  PUNTO ÷ ",YA
50 INPUT " X fin    ÷ ",XB,"Y  fin    ÷ ",YB
60 IF J$="1" THEN INPUT "Distancia OBSERVADA";DO:GOTO 70
61 IF J$="2" THEN INPUT "Azimut OBSERVADO";AO:GOTO 100
70 X=XA-XB:Y=YA-YB:DC=SQR(X^2+Y^2):dc=1/DC:a=dc*X:b=dc*Y:F=DC-DO
80 CLS:PRINT "v1="ROUND(a,-5)"dx",ROUND(b,-5)"dy+"ROUND(F,-5)
90 GOTO 50
100 X=YA-YB:Y=XA-XB:AC=ATN(Y/X)+100*(1-SGN(-X)):AC=AC-400*INT(AC/400):DC=SQR(X^2+Y^2):dc=1/((DC^2)*SIN.0001):a=dc*X:b=dc*Y:F=AC-AO
110 CLS:PRINT "v1="ROUND(a,-5)"dx-"ROUND(b,-5)"dy+"ROUND(F,-5)
120 GOTO 50
