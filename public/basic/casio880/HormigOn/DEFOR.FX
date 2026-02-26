1 'DEFHORMI
5 PRINT "  CALCULO DE DEFORMACIONES DEL            HORMIGON"
10 CLEAR :CLS
20 INPUT "N.de escalones de carga";EC
25 INPUT "A cuantos dias se carga la probeta ";t0
30 DIM DIAS(EC),CARGAS(EC),L(EC),IC(EC)
40 FOR I=1 TO EC
50 PRINT "Que dia empieza el ";I;"escalon de carga ";:INPUT DIAS(I)
60 PRINT "Que carga actua en esos dias";:INPUT CARGAS(I)
70 NEXT I
80 PRINT "CALCULO DE LA DEFORMACION POR RETRACCION"
90 INPUT "Tiempo (t=dias) para el que quieres conocer la deformacion";t
95 PRINT "Introduce Er1 segun humedad relativa EH88 p.68 T26.8.1";:INPUT Er1
100 PRINT "El coef alfa(segun % humedad)";:INPUT ALFA
110 INPUT "Area de la seccion(cm)";AREA
120 INPUT "Perimetro de la seccion(cm)";u
130 e=ALFA*2*AREA*10/u
140 PRINT "El espesor ficticio es e=";ROUND(e,-1);"mm"
150 PRINT "Segun e introduce Er2(EH-88 p.68 F26.8.1)";:INPUT Er2
160 PRINT "Segun e introduce Br("t")(EH-88 p.68 F26.8.2)";:INPUT Brt
170 PRINT "Segun e introduce Br("t0")(EH-88 p.68 F26.8.2)";:INPUT Brt0
180 Er=Er1*Er2*(Brt-Brt0)
190 INPUT "Es hormigon armado(S/N)";A$
200 IF A$="S" THEN GOSUB 800 ELSE PRINT "La deformacion por retraccion es Er(t,to)=";ROUND(Er,-6)
210 PRINT "Calculo de la deformacion elastica instantanea Eei"
220 So=CARGAS(EC)*1000/AREA
230 INPUT "fck28 (kp/cm^2)";f
240 Ec=19000*SQRf
250 Eei=-So/Ec
260 PRINT "La deformacion elastica instantanea es Eei=";ROUND(Eei,-6)
270 PRINT "Calculo de la deformacion de fluencia(Ef) y la plastica instantanea(Epi)"
280 FOR I=1 TO EC
290 PRINT "Termino de la def.plastica inst.Bpi(to)"
300 PRINT "Introduce f("DIAS(I)")/f("t") (EH-88 p.70 F26.9.1)";:INPUT F
310 Bpito=.8*(1-F)
320 PRINT "termino de la def.elastica diferida LedBed(t-to)"
330 Led=.4:REM COEF.DE ELASTICIDAD DIFERIDA
340 PRINT "Introduce Bed("t-DIAS(I)") (EH-88 p.71 F26.9.4)";:INPUT Bed
350 PRINT "termino de la def.plast.diferida Lpd[Bpdt-Bpdto]"
360 PRINT "Introduce Lpd1 segun % humedad (EH-88 p.72 T26.9.1)";:INPUT Lpd1
370 PRINT "Introduce Lpd2 (EH-88 p.70 F26.9.2)";:INPUT Lpd2
380 Lpd=Lpd1*Lpd2
390 PRINT "introduce segun e Bpd("t")(EH-88 p.71 F26.9.3)";:INPUT Bpdt
400 PRINT "Introduce segun e Bpd("t0")(EH-88 p.71 F26.9.3)";:INPUT Bpdto
405 L(I)=Bpito+Led*Bed+Lpd*(Bpdt-Bpdto)
410 PRINT "L(t,to)=Bpito+Led*Bed+Lpd*(Bpdt-Bpdto)
420 CLS:PRINT "L("t","DIAS(I)")="Bpito"+"Led"*"Bed"+"Lpd"*("Bpdt"-"Bpdto")"
430  Bpito=0:Led=0:Bed=0:Lpd=0:Bpdt=0:Bpdto=0
440 NEXT I
450 FOR I=1 TO EC
460 IC(I)=CARGAS(I)-CARGAS(I-1)
470 K=K+IC(I)*L(I)*1000/(Ec*AREA)
480 NEXT I
490 PRINT "Ef+Epi=";ROUND(-K,-6)
500 PRINT "Cual es incremento de temperatura"CHR$(238)"t";:INPUT At
510 Et=1E-5*At
520 Etotal=-K+Et+Er+Eei
530 PRINT "Introduce la longitud de la probeta en cm=";:INPUT h
540 Along=Etotal*h*10
550 PRINT "El incremento de longitud es "CHR$(238)"long=";ROUND(Along,-4);"mm"
560 END
800 PRINT "El mod.elast.del acero es Es=";:INPUT Es
810 PRINT "El area del acero es As=";:INPUT ts
820 n=Es/Ec:p=ts/AREA
830 Ers=Er/(1+n*p)
840 PRINT "La deformacion por retraccion es Ers(t,to)=";Ers
850 Er=Ers
860 RETURN
