10 CLS: PRINT "Utilitarios para vectores"
15 SET F3
20 CLS:PRINT "ç=x1i+y1j+z1k   v=x2i+y2j+z2k";
25 FOR i=1 TO 6
30 IF i=1 THEN LOCATE 0,1:PRINT "x1(";x1;")=";:INPUT x1
35 IF i>1 THEN LOCATE 0,1:PRINT CHR$(5);CHR$(30);
37 LOCATE 0,1
40 IF i=2 THEN PRINT "y1(";y1;")=";:INPUT y1 
50 IF i=3 THEN PRINT "z1(";z1;")=";:INPUT z1 
60 IF i=4 THEN PRINT "x2(";x2;")=";:INPUT x2 
70 IF i=5 THEN PRINT "y2(";y2;")=";:INPUT y2 
80 IF i=6 THEN PRINT "z2(";z2;")=";:INPUT z2 
85 NEXT i
90 norma1=SQR(x1^2+y1^2+z1^2)
95 norma2=SQR(x2^2+y2^2+z2^2):prodesc=x1*x2+y1*y2+z1*z2
130 i=(y1*z2-z1*y2):j=-(x1*z2-z1*x2):k=(x2*y2-y1*x2)
140 CLS:PRINT "Norma1=";norma1
150 PRINT "Norma2=";norma2
160 PRINT "Producto escalar:";prodesc
170 PRINT "Producto vectorial:             ";i;"i";" ";j;"j";" ";k;"k"
175 ANGLE 0:angulo=ACS (prodesc/(norma1*norma2))
180 PRINT "Angulo entre vectores ç y v: ";ROUND (angulo,-4);CHR$(223);"=";
185 PRINT ROUND ((angulo*PI/2)/90,-4);"radianes"
190 PRINT "Cosenos directores - vector 1";
200 PRINT TAB(0);"A(Ang.con eje x)=";ROUND(ACS(x1/norma1),-6);CHR$(223)
210 PRINT "B(Ang.con eje y)=";ROUND(ACS(y1/norma1),-6);CHR$(223)
220 PRINT "C(Ang.con eje z)=";ROUND(ACS(z1/norma1),-6);CHR$(223)
230 PRINT "Cosenos directores - vector 2";
240 PRINT TAB(0);"A(Ang.con eje x)=";ROUND(ACS(x2/norma2),-6);CHR$(223)
250 PRINT "B(Ang.con eje y)=";ROUND(ACS(y2/norma2),-6);CHR$(223)
260 PRINT "C(Ang.con eje z)=";ROUND(ACS(z2/norma2),-6);CHR$(223)
265 const=(prodesc/norma2^2)
267 const2=(prodesc/norma1^2)
270 PRINT "Proyeccion de ç sobre v";TAB(0);:PRINT ROUND (const*x2,-4);"i ";ROUND(const*y2,-4);"j ";ROUND(const*z2,-4);"k"
280 PRINT "Proyeccion de v sobre ç ";TAB(0);:PRINT ROUND (const2*x1,-4);"i ";ROUND(const2*y1,-4);"j ";ROUND(const2*z1,-4);"k"
290 PRINT "Desea repetir (S/N)";:decision$=INPUT$(1)
300 IF decision$="s" OR decision$="S" THEN 10
