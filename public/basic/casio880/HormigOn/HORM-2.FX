10 'HUSOPASO
20 CLEAR
30 CLS:LOCATE 1,0
40 PRINT "   HORMIGON  PRETENSADO               HUSO DE PASO"
50 CLS:LOCATE 1,0
60 PRINT "Caracteristicas del hormigon    ";
70 INPUT "fck(kg/cm2)";fck
75 CLS:LOCATE 1,0
80 INPUT "Dimens CLASE I-II (1/2)";CLASE
90 IF CLASE=1 THEN Tmin=0 ELSE IF CLASE=2 THEN Tmin=-.45*CUR(fck^2)/1000 ELSE 210
92 Tmax=fck/(1.6*1000)
100 CLS:LOCATE 1,0
110 PRINT "Pretensado";:LOCATE 0,1
120 INPUT "Po(t)";Po,"cpi";cpi,"cpt";cpt
150 CLS:LOCATE 1,0
160 PRINT "Caracteristicas de la seccion   ";
180 INPUT "A(cm2)";A,"I(cm4)";I,"h(cm)";h,"v1(cm)";v1
190 v2=v1-h: W1=I/v1: W2=I/v2
220 CLS:LOCATE 1,0
230 PRINT "Acciones seccion";:LOCATE 0,1
240 INPUT "Mmax(cmt)";Mmax,"Mmin(cmt)";Mmin,"N(t)";N
250 eomax1=-W2/A+(W2*(Tmin-N/A)-Mmax)/(Po*cpt*.9)
251 eomax2=-W2/A+(W2*(Tmin-N/A)-Mmax)/(Po*cpi*1.1)
252 IF eomax1<eomax2 THEN eomax=eomax1 ELSE eomax=eomax2
253 IF eomax1<emax2 THEN 1000 ELSE GOTO 1010
260 eomin1=-W1/A+(W1*(Tmin-N/A)-Mmin)/(Po*cpi*1.1)
261 eomin2=-W1/A+(W1*(Tmin-N/A)-Mmin)/(Po*cpt*0.9)
262 IF eomin1>eomin2 THEN eomin=eomin1 ELSE eomin=eomin2
263 IF eomin1>eomin2 THEN 1020 ELSE 1030
270 Eomin1=-W2/A+(W2*(Tmax-N/A)-Mmin)/(Po*cpi*1.1)
271 Eomin2=-W2/A+(W2*(Tmax-N/A)-Mmin)/(Po*cpt*0.9)
272 IF Eomin1>Eomin2 THEN Eomin=Eomin1 ELSE Eomin=Eomin2
273 IF Eomin1>Eomin2 THEN 1040 ELSE 1050
280 Eomax1=-W1/A+(W1*(Tmax-N/A)-Mmax)/(Po*cpt*.9)
281 Eomax2=-W1/A+(W1*(Tmax-N/A)-Mmax)/(Po*cpi*1.1)
282 IF Eomax1<Eomax2 THEN Eomax=Eomax1 ELSE Eomax=Eomax2
283 IF Eomax1<Eomax2 THEN 1060 ELSE 1070
290 CLS:LOCATE 1,0
300 PRINT "  HUSO DE PASO"
310 PRINT " limitacion  por  tracciones    ";
320 PRINT ROUND(eomin,-4);CHR$(225);"eo(cm)";CHR$(225);ROUND(eomax,-4)
330 PRINT " Limitacion por compresiones    ";
340 PRINT ROUND(Eomin,-4);CHR$(225);"eo(cm)";CHR$(225);ROUND(Eomax,-4)
350 INPUT "Otra seccion(S/N)";A$
360 IF A$="S" THEN ERASE Mmin,Mmax,N:GOTO 220 ELSE IF A$<>"N" THEN 350
370 END
1000 PRINT "eo";CHR$(225);ROUND(-W2/A,-4);"+[";ROUND(W2,-2);"*(";Tmin;"-";ROUND(N/A,-4);")-";Mmax;")/(";Po;"*";cpt;"*0.9)":GOTO 260
1010 PRINT "eo";CHR$(225);ROUND(-W2/A,-4);"+[";ROUND(W2,-2);"*(";Tmin;"-";ROUND(N/A,-4);")-";Mmax;")/(";Po;"*";cpi;"*1.1)":GOTO 260
1020 PRINT "eo";CHR$(224);ROUND(-W1/A,-4);"+(";ROUND(W1,-2);"*(";Tmin;"-";ROUND(N/A,-4);")-";Mmin;")/(";Po;"*";cpi;"*1.1)":GOTO 270
1030 PRINT "eo";CHR$(224);ROUND(-W1/A,-4);"+(";ROUND(W1,-2);"*(";Tmin;"-";ROUND(N/A,-4);")-";Mmin;")/(";Po;"*";cpt;"*0.9)":GOTO 270
1040 PRINT "eo";CHR$(224);ROUND(-W2/A,-4);"+(";ROUND(W2,-2);"*(";Tmax;"-";ROUND(N/A,-4);")-";Mmin;")/(";Po;"*";cpi;"*1.1)":GOTO 280
1050 PRINT "eo";CHR$(224);ROUND(-W2/A,-4);"+(";ROUND(W2,-2);"*(";Tmax;"-";ROUND(N/A,-4);")-";Mmin;")/(";Po;"*";cpt;"*0.9)":GOTO 280
1060 PRINT "eo";CHR$(225);ROUND(-W1/A,-4);"+(";ROUND(W1,-2);"*(";Tmax;"-";ROUND(N/A,-4);")-";Mmax;")/(";Po;"*";cpt;"*0.9)":GOTO 290
1070 PRINT "eo";CHR$(225);ROUND(-W1/A,-4);"+(";ROUND(W1,-2);"*(";Tmax;"-";ROUND(N/A,-4);")-";Mmax;")/(";Po;"*";cpi;"*1.1)":GOTO 290
