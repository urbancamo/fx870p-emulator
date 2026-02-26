10 'CARSMEC
20 CLEAR
30 CLS : LOCATE 0,1
40 PRINT "HORMIGON: CARACTERISTICAS                 MECANICAS DE SECCION"
50 CLS:INPUT "N. de subsecciones ";N
60 DIM A(N),D(N),AD(N),AD2(N),I(N),IX(N)
70 FOR I=1 TO N
80 CLS:PRINT "Subseccion ";I;":";
85 LOCATE 0,1
90 PRINT "A";I;"(cm";CHR$(146);") "; : INPUT A(I)
100 PRINT "d";I;"(cm) ";:INPUT D(I)
110 AD(I)=A(I)*D(I) : AD2(I)=A(I)*D(I)^2
120 PRINT "I";I;"(cm";CHR$(148);") ";: INPUT I(I)
130 IX(I)=I(I)+AD2(I)
140 NEXT
150 PRINT "Caracteristicas de seccion :"
160 S1=0 : S2=0 : S3=0
170 FOR I=1 TO N
180 S1=S1+A(I)
190 PRINT "A*d";I;"(cm";CHR$(147);") =";AD(I)
200 S2=S2+AD(I)
210 PRINT "A*d";CHR$(146);I;"(cm";CHR$(148);") =";AD2(I)
220 PRINT "Ix";I;"(cm";CHR$(148);") =";IX(I)
230 S3=S3+IX(I)
240 NEXT
250 PRINT "A(cm";CHR$(146);") =";S1,"Me(cm";CHR$(147);") =";S2,"Ix(cm";CHR$(148);") =";S3
260 PRINT "Respecto al c.d.g.:"
270 V1H=S2/S1 : IH=S3-S1*V1H^2
280 PRINT "V1g(cm) =";V1H,"Ig(cm";CHR$(148);") =";IH
290 END
