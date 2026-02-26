10 'PREDIYII
20 CLEAR
30 CLS:LOCATE 1,0
40 PRINT "  HORMIGON:DIAGRAMAS DE MAGNEL":CLS:LOCATE 0,1
50 PRINT "    Caract del hormigon         ";:INPUT "fck(kg/cm2)";fck
100 CLS:LOCATE 1,0
110 PRINT "Datos del predim de la seccion: ";
130 INPUT "Area: A(cm2)";A
140 INPUT "Inercia: I(cm4)";I
145 INPUT "Canto h(cm)";h
150 INPUT "v1(cm)";v1
160 v2=v1-h:W1=I/v1:W2=I/v2
162 CLS:LOCATE 1,0
165 PRINT "ACCIONES":CLS:LOCATE 0,2
170 INPUT "Mmax(con signo)(cmt)";Mmax,"Mmin(con signo)(cmt)";Mmin,"Axil N(t)";N
180 PRINT "Dimensionamiento de Po y eo     ";
210 INPUT "CLASE I o II (1/2):";CLASE
220 IF CLASE=1 THEN Tmin=0 ELSE IF CLASE=2 THEN Tmin=-.45*CUR(fck^2) ELSE 210
225 Tmax=fck/1.6
227 Tmin=Tmin/1000:Tmax=Tmax/1000
229 CLS:LOCATE 1,0
230 PRINT "  Diagrama de Magnel"
240 PD1=W2*(Tmin-N/A)-Mmax
250 PD2=W1*(Tmin-N/A)-Mmin
260 PD3=W2*(Tmax-N/A)-Mmin
270 PD4=W1*(Tmax-N/A)-Mmax
280 PRINT "    recta 1: Tmin fibra inf     "
285 PRINT "eo";CHR$(225);ROUND(-W2/A,-4);"+ 1/P*[";ROUND(W2,-2);"*(";Tmin;"-";N/A")-";Mmax"]"
290 PRINT "eo";CHR$(225);ROUND(-W2/A,-4);"+ 1/P*";ROUND(PD1,-4)
300 PRINT "   recta 2:Tmin fibra superior  "
305 PRINT "eo";CHR$(224);ROUND(-W1/A,-4);"+1/P*[";ROUND(W1,-2);"*(";Tmin;"-";N/A")-";Mmin"]"
310 PRINT "eo";CHR$(224);ROUND(-W1/A,-4);"+ 1/P*";ROUND(PD2,-4)
320 PRINT "   recta 3:Tmax fibra inferior  "
325 PRINT "eo";CHR$(224);ROUND(-W2/A,-4);"+1/P*[";ROUND(W2,-2);"*(";Tmax;"-";N/A;")-";Mmin;"]"
330 PRINT "eo";CHR$(224);ROUND(-W2/A,-4);"+ 1/P*";ROUND(PD3,-4)
340 PRINT "   recta 4:Tmax fibra superior  "
345 PRINT "eo"CHR$(225);ROUND(-W1/A,-4);"+1/P*[";ROUND(W1,-2);"*(";Tmax;"-";N/A;")-";Mmax;"]"
350 PRINT "eo";CHR$(225);ROUND(-W1/A,-4);"+ 1/P*";ROUND(PD4,-4)
360 PRINT "Limitaciones geometricas"
370 INPUT "r1(cm)";r1,"r2(cm)";r2
390 PRINT "eo";CHR$(224);v2+r2,"eo";CHR$(225);v1-r1
410 PRINT "Elegir para un eo dado    Pc/cpt*.9";CHR$(225);"Po";CHR$(224);"Pd/cpi*1.1"
500 END
