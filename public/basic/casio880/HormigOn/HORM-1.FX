10 'ASSHA
20 CLEAR :CLS:LOCATE 0,1
30 PRINT "     HORMIGON   ARMADO           ANALISIS SECCIONES EN SEVICIO"
40 CLS:LOCATE 1,0
50 PRINT "Caracteristicas del hormigon    ";
60 INPUT "fck(kg/cm2)";fck
70 Ec=19000*SQRfck
71 CLS:LOCATE 1,0
72 PRINT "Caracteristicas del acero       ";
73 INPUT "Es(kg/cm2)";Es
80 CLS:LOCATE 1,0
90 PRINT "Caracteristicas seccion neta   ";
100 INPUT "An(cm2)";An,"Sn(cm3)";Sn,"In(cm4)";In
110 DENO=Ec*(An*In-Sn^2)
120 CLS:LOCATE 1,0
130 PRINT "Esfuerzos en la seccion        ";
140 INPUT "M(m*t)";M,"N(t)";N
150 M=M*100000:N=N*1000
160 REM Calculo de defo y x
170 Do=(In*N-Sn*M)/DENO
180 X=(-Sn*N+An*M)/DENO
190 CLS:LOCATE 1,0
200 PRINT "Defor orig Do=";Do
210 PRINT "Curvatura X=";X
220 D$="Do+X*z"
230 T$="E*(Do+X*z)"
260 CLS:LOCATE 1,0
270 PRINT "Calculo de deform. y tensiones ";
280 INPUT "Acero u Hormigon(A/H)";A$
290 IF A$="A" THEN E=Es ELSE IF A$="H" THEN E=Ec ELSE 280
295 ERASE A$
300 INPUT "z(cm)";z
310 PRINT "deform(cm)=";VALF(D$)
320 PRINT "tension(kg/cm2)=";VALF(T$)
330 INPUT "Otro punto de la seccion(S/N)";B$
340 IF B$="S" THEN ERASE B$:GOTO 280 ELSE IF B$<>"N" THEN 330
345 ERASE B$
350 INPUT "Otros esfuerzos(S/N)";C$
360 IF C$="S" THEN ERASE M,N,C$:GOTO 140 ELSE IF C$<>"N" THEN 350
370 END
