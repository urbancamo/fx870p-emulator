10 INPUT "1.Coordenadas astronomicas.",K:IF K=1 THEN 405
20 INPUT "2.Moviminto diurno.",K:IF K=2 THEN 2405
30 INPUT "3.La medida del tiempo.",K:IF K=3 THEN 3905
40 INPUT "4.Astronomia de posicion.",K:IF K=4 THEN 6905
50 INPUT "5.Correc. alta precision.",K:IF K=5 THEN 10405
405 INPUT "11.Paso coord.horiz.a ecuat.",K:IF K=11 THEN 500
415 INPUT "12.Paso coord.ecuat.a horiz.",K:IF K=12 THEN 1000
425 INPUT "13.Paso coord.eclip.a absol.",K:IF K=13 THEN 1500
435 INPUT "14.Paso coord.absol.a eclip.",K:IF K=14 THEN 2000
500 INPUT "Latitud=";La
510 INPUT "Acimut=";A
520 INPUT "Altura=";h
521 INPUT "Ascension recta=";Ar
522 PRINT "SINh=mCOSM  COShCOSA=mSINM"
530 PRINT "TANM=COSA/TANh"
540 M=ATN(COSA/TANh)
550 PRINT "DMS$(M)=";DMS$(M)
560 PRINT "TANH=SINM*TANA/COS(La-M)"
570 X=La-M
580 PRINT "DMS$(X)=";DMS$(X)
590 H=ATN(TANA*SINM/COSX)
600 PRINT "DMS$(H)=";DMS$(H)
610 IF (H<0) THEN 612
611 IF (H>0) THEN 615
612 H1=360+H
613 GOSUB 618
615 H1=H
616 GOSUB 618
618 PRINT "DMS$(H1)=";DMS$(H1)
620 IF (H1<180) THEN 630
621 IF (180<H1) THEN 640
630 IF (A<180) THEN H2=H1
631 IF (180<A) THEN H2=180+H1
632 GOSUB 660
640 IF (180<A) THEN H2=H1
641 IF (A<180) THEN H2=H1-180
642 GOSUB 660
660 PRINT "DMS$(H2)=";DMS$(H2)
665 PRINT "TANDe=COSH*TAN(La-M)"
670 De=ATN(COSH2*TANX)
680 PRINT "DMS$(De)=";DMS$(De)
690 PRINT "Hs=Ar+(H2/15)"
700 Hs=Ar+(H2/15)
710 PRINT "DMS$(Hs)=";DMS$(Hs)
720 IF Hs>24 THEN 740
730 IF Hs<24 THEN 760
740 Hs1=Hs-24
750 GOSUB 770
760 Hs1=Hs
770 PRINT "DMS$(Hs1)=";DMS$(Hs1)
780 END
800 Hcg=Hr-DEG(2,05,01)
810 PRINT "T.U. corregido ";DMS$(Hcg)
820 Isg=Hcg*1.002737910
830 Hsv=Isg+Ts-Lr
840 PRINT "Hora  siderea  ";DMS$(Hsv)
850 ahs=Hsv-Ar
860 PRINT "Angulo horario ";DMS$(ahs)
870 H=360*ahs/24
880 GOSUB 1030
900 INPUT "cd (1) o ci (2)  ";J
910 IF J=1 THEN 920
915 IF J=2 THEN 940
920 LI=Az-Ec
930 GOSUB 950
940 LI=Az+Ec
950 PRINT "Lectura a la Polar";LI
955 TLI=LI*0.9
960 w=A4-TLI
970 PRINT "W=Az-L.P. de";DMS$(w)
980 GOSUB 20000
1000 INPUT "Latitud=";La
1010 INPUT "Angulo horario=";H
1020 INPUT "Declinacion=";De
1030 PRINT "SINDe=mSINM COSDeCOSH=mCOSM"
1040 PRINT "TANM=TANDe/COSH"
1050 M=ATN(TANDe/COSH)
1060 PRINT "M vale ";DMS$(M)
1070 X=La-M
1080 PRINT "x vale ";DMS$(X)
1090 PRINT "TANA=COSMTANH/SIN(La-M)"
1100 A=ATN(COSM*TANH/SINX)
1120 IF (A>0) THEN 1130
1121 IF (A<0) THEN 1132
1130 A1=A
1131 GOSUB 1140
1132 A1=360+A
1133 GOSUB 1140
1140 IF (A1<180) THEN 1160
1151 IF (A1>180) THEN 1170
1160 IF (H<180) THEN 1165
1161 IF (H>180) THEN 1168
1165 A4=A1
1166 GOSUB 1180
1168 A4=A1+180
1169 GOSUB 1180
1170 IF (H>180) THEN 1175
1171 IF (H<180) THEN 1178
1175 A4=A1
1176 GOSUB 1180
1178 A4=A1-180
1179 GOSUB 1180
1180 PRINT "Acimut topografico";DMS$(A4)
1185 GOSUB 900
1190 PRINT "TANh=COSA/TAN(La-M)"
1200 h=ATN(COSA2/TANX)
1300 PRINT "DMS$(h)=";DMS$(h)
1310 END
1500 INPUT "Long.eclip=";Lo
1510 INPUT "Latit.eclip=";La
1520 INPUT "Oblicu.eclip=";E
1530 PRINT "SIN(Beta)=MSINN "
1540 PRINT "COS(Beta)SIN(Lambda)=MCOSN"
1550 PRINT "TANN=TAN(Beta)/SIN(Lambda)"
1560 N=ATN(TANLa/SINLo)
1570 PRINT "DMS$(N)=";DMS$(N)
1572 X=N+E
1575 PRINT "DMS$(X)=";DMS$(X)
1578 PRINT "Ascen.recta se obtien.en grados"
1580 PRINT "TAN(Ascen.recta)=TAN(Lambda)COS(N+oblic)/COSN"
1590 Ar=ATN(TANLo*COSX/COSN)
1600 PRINT "DMS$(Ar)=";DMS$(Ar)
1610 IF (Ar>0) THEN 1620
1611 IF (Ar<0) THEN 1622
1620 Ar1=Ar
1621 GOSUB 1630
1622 Ar1=360+Ar
1623 GOSUB 1630
1630 PRINT "DMS$(Ar1)=";DMS$(Ar1)
1640 PRINT "y como COSDeCOSAr=COSLongCOSLat"
1650 IF COS(Lo)>0 THEN 1660
1655 IF COS(Lo)<0 THEN 1700
1660 IF COS(Ar1)>0 THEN 1670
1665 IF COS(Ar1)<0 THEN 1680
1670 Ar2=Ar1
1675 GOSUB 1725
1680 Ar2=Ar1+180
1685 GOSUB 1725
1700 IF COS(Ar1)>0 THEN 1680
1705 IF COS(Ar1)<0 THEN 1770
1725 PRINT "DMS$(Ar2)=";DMS$(Ar2)
1730 PRINT "TAN(Declin.)=SIN(Ascen.recta)TAN(N+Oblicu.)
1740 De=ATN(SIN(Ar2)*TANX)
1750 PRINT "DMS$(De)=";DMS$(De)
1760 END
2000 PRINT "Ascen.recta se introd.en grados"
2005 INPUT "Ascen.recta=";Ar
2010 INPUT "Declinacion=";De
2020 INPUT "Oblicu.eclip=";E
2030 PRINT "SIN(Declinacion)=MSINN"
2040 PRINT "COS(Declinacion)SIN(Ascen.recta)=MCOSN"
2050 PRINT "TANN=TAN(Declinacion)/SIN(Ascen.recta)
2060 N=ATN(TANDe/SINAr)
2070 PRINT "DMS$(N)=";DMS$(N)
2080 X=N-E
2090 PRINT "DMS$(X)=";DMS$(X)
2100 PRINT "TAN(Long.eclip.)=TAN(Ascen.recta)COS(N-Oblic.)/COSN
2110 Lo=ATN(TANAr*COSX/COSN)
2111 PRINT "DMS$(Lo)=";DMS$(Lo)
2112 IF Lo>0 THEN 2114
2113 IF Lo<0 THEN 2117
2114 Lo1=Lo
2115 GOSUB 2119
2117 Lo1=360+Lo
2118 GOSUB 2119
2119 PRINT "DMS$(Lo1)=";DMS$(Lo1)
2120 PRINT "y como COSDeCOSAr=COSLongCOSLat"
2124 IF COS(Ar)>0 THEN 2130
2125 IF COS(Ar)<0 THEN 2150
2130 IF COS(Lo1)>0 THEN 2135
2131 IF COS(Lo1)<0 THEN 2140
2135 Lo2=Lo1
2136 GOSUB 2200
2140 Lo2=Lo1+180
2145 GOSUB 2200
2150 IF COS(Lo1)>0 THEN 2140
2155 IF COS(Lo1)<0 THEN 2135
2200 PRINT "DMS$(Lo2)=";DMS$(Lo2)
2210 PRINT "TAN(Lat.eclip.)=SIN(Long.eclip.)TAN(N-Oblic)"
2220 La=ATN(SIN(Lo2)*TANX)
2230 PRINT "DMS$(La)=";DMS$(La)
2240 END
2405 INPUT "21.Max.digr.estrella.",K:IF K=21 THEN 2500
2415 INPUT "22.Posicion orto y ocaso.",K:IF K=22 THEN 3000
2425 INPUT "23.Primer vertical.",K:IF K=23 THEN 3500
2500 INPUT "Latitud=";La
2510 INPUT "Declinacion=";De
2511 PRINT "Ascen.recta se introd.en horas"
2515 INPUT "Ascen.recta=";Ar
2520 PRINT "COSH=TANLa/TANDe"
2530 H2=ACS(TANLa/TANDe)
2540 PRINT "DMS$(H2)=";DMS$(H2)
2541 H1=360-H2
2542 PRINT "DMS$(H1)=";DMS$(H1)
2543 Hs2=Ar+(H2)/15
2544 Hs1=Ar+(H1)/15
2545 PRINT "DMS$(Hs2)=";DMS$(Hs2)
2546 PRINT "DMS$(Hs1)=";DMS$(Hs1)
2550 PRINT "SINh=SINLa/SINDe"
2560 h=ASN(SINLa/SINDe)
2570 PRINT "DMS$(h)=";DMS$(h)
2580 PRINT "SINA=COSDe/COSLa"
2590 A=ASN(COSDe/COSLa)
2600 IF De>0 THEN 2610
2601 IF De<0 THEN 2650
2610 A2=180-A
2620 PRINT "DMS$(A2)=";DMS$(A2)
2630 A1=360-A2
2640 PRINT "DMS$(A1)=";DMS$(A1)
2641 END
2650 A2=A
2660 PRINT "DMS$(A2)=";DMS$(A2)
2670 A1=360-A2
2680 PRINT "DMS$(A1)=";DMS$(A1)
2681 END
3000 INPUT "Latitud=";La
3010 INPUT "Declinacion=";De
3011 PRINT "Ascen.recta se introd.en horas"
3015 INPUT "Ascen.recta=";Ar
3020 PRINT "COSH=-TANDe*TANLa"
3030 H2=ACS(-(TAN(De)*TAN(La)))
3041 PRINT "DMS$(H2)=";DMS$(H2)
3042 H1=360-H2
3043 PRINT "DMS$(H1)=";DMS$(H1)
3044 Hs2=Ar+(H2)/15
3045 Hs1=Ar+(H1)/15
3046 PRINT "DMS$(Hs2)=";DMS$(Hs2)
3047 PRINT "DMS$(Hs1)=";DMS$(Hs1)
3050 PRINT "COSA=-SINDe/COSLa"
3060 A2=ACS(-SINDe/COSLa)
3071 PRINT "DMS$(A2)=";DMS$(A2)
3072 A1=360-A2
3073 PRINT "DMS$(A1)=";DMS$(A1)
3080 END
3500 INPUT "Latitud=";La
3510 INPUT "Declinacion=";De
3520 PRINT "Ascen.recta se introd.en horas"
3525 INPUT "Ascen.recta=";Ar
3530 PRINT "COSH=TANDe/TANLa"
3540 H2=ACS(TANDe/TANLa)
3541 PRINT "DMS$(H2)=";DMS$(H2)
3542 H1=360-H2
3543 PRINT "DMS$(H1)=";DMS$(H1)
3544 Hs2=Ar+(H2)/15
3545 PRINT "DMS$(Hs2)=";DMS$(Hs2)
3546 Hs1=Ar+(H1)/15
3547 PRINT "DMS$(Hs1)=";DMS$(Hs1)
3550 PRINT "SINh=SINDe/SINLa"
3560 h=ASN(SINDe/SINLa)
3570 PRINT "DMS$(h)=";DMS$(h)
3580 END
3905 INPUT "31.Paso civil a sidereo.",K:IF K=31 THEN 4000
3915 INPUT "32.Paso sidereo a civil.",K:IF K=32 THEN 4500
3925 INPUT "33.Paso civil a verdadero.",K:IF K=33 THEN 5000
3935 INPUT "34.Paso verdadero a civil.",K:IF K=34 THEN 5500
3945 INPUT "35.Paso civil a legal.",K:IF K=35 THEN 6000
3955 INPUT "36.Duracion de estaciones.",K:IF K=36 THEN 6500
4000 PRINT "Si la long.es occiden.(W)   +"
4010 PRINT "Si la long.es oriental(E)   -"
4020 INPUT "Long.civil=";Lc
4030 INPUT "Long.siderea=";Ls
4040 INPUT "Hora civil=";Hc
4050 INPUT "A 0 horas TU,T.sid.=";Ts
4060 PRINT "Calcul.hor.civil en Greenwich"
4065 PRINT "   Hcg=Hc+Lc   "
4070 Hcg=Hc+Lc
4071 IF Hcg>0 THEN 4080
4072 IF Hcg<0 THEN 4200
4080 PRINT "DMS$(Hcg)=";DMS$(Hcg)
4090 PRINT "Paso Hcg a interv.sidereo"
4095 PRINT "   Isg=Hcg*1.002737910   "
4100 Isg=Hcg*1.002737910
4110 PRINT "DMS$(Isg)=";DMS$(Isg)
4120 PRINT "Calc.hora siderea en Greenwich"
4125 PRINT "   Hsg=Isg+Ts   "
4130 Hsg=Isg+Ts
4140 PRINT "DMS$(Hsg)=";DMS$(Hsg)
4150 PRINT "Calc.hora siderea pedida"
4155 PRINT "   Hs=Hsg-Ls   "
4160 Hs=Hsg-Ls
4170 PRINT "DMS$(Hs)=";DMS$(Hs)
4180 END
4200 PRINT "   Hcg1=24+Hcg   "
4205 Hcg1=24+Hcg
4210 PRINT "DMS$(Hcg1)=";DMS$(Hcg1)
4220 PRINT "Paso Hcg1 a interv.sidereo"
4225 PRINT "   Isg1=Hcg1*1.002737910   "
4230 Isg1=Hcg1*1.002737910
4240 PRINT "DMS$(Isg1)=";DMS$(Isg1)
4250 PRINT "Calc.hora siderea en Greenwich"
4255 PRINT "   Hsg1=Isg1+Ts-DEG(0,3,56.56)   "
4260 Hsg1=Isg1+Ts-DEG(0,3,56.56)
4270 PRINT "DMS$(Hsg1)=";DMS$(Hsg1)
4280 PRINT "Calc.hora siderea pedida"
4285 PRINT "   Hs1=Hsg1-Ls   "
4290 Hs1=Hsg1-Ls
4300 PRINT "DMS$(Hs1)=";DMS$(Hs1)
4310 END
4500 PRINT "Si la long.es occiden.(W)   +"
4510 PRINT "Si la long.es oriental(E)   -"
4520 INPUT "Long.siderea=";Ls
4530 INPUT "Long.civil=";Lc
4540 INPUT "Hora siderea=";Hs
4550 INPUT "Hor.sid.0h TU=";Hs0
4560 PRINT "Calc.hora siderea de Greenwich"
4570 PRINT "    Hsg=Hs+Ls"
4580 Hsg=Hs+Ls
4590 PRINT "DMS$(Hsg)=";DMS$(Hsg)
4600 PRINT "Calculo del increm.en sidereo"
4610 PRINT "    Isg=Hsg-Hs0"
4620 Isg=Hsg-Hs0
4625 IF Isg<0 THEN 4750
4626 IF Isg>0 THEN 4630
4630 PRINT "DMS$(Isg)=";DMS$(Isg)
4635 Isg1=Isg
4640 PRINT "Calculo hora civil Greenwich"
4650 PRINT "    Hcg=Isg1*0.997269571"
4660 Hcg=Isg1*0.997269571
4670 PRINT "DMS$(Hcg)=";DMS$(Hcg)
4680 PRINT "Paso hora civil pedida"
4690 PRINT "    Hc=Hcg-Lc"
4700 Hc=Hcg-Lc
4710 PRINT "DMS$(Hc)=";DMS$(Hc)
4720 END
4750 PRINT "Isg<0 y en Greenwich dia n-1"
4760 PRINT "Isg1=Hsg+24-Hs0+DEG(0,3,56.56)"
4770 Isg1=Hsg+24-Hs0+DEG(0,3,56.56)
4780 PRINT "DMS$(Isg1)=";DMS$(Isg1)
4790 GOSUB 4640
5000 PRINT "Si la long.es occiden.(W)   +"
5010 PRINT "Si la long.es oriental(E)   -"
5020 INPUT "Long.civil=";Lc
5030 INPUT "Long.verdadera=";Lv
5040 INPUT "Hora civil=";Hc
5050 INPUT "0h TU,ecuac.tiemp1=";Et1
5055 INPUT "0h TU,ecuac.tiemp2=";Et2
5060 PRINT "Calculo hora civil Greenwich"
5070 PRINT "    Hcg=Hc+Lc"
5080 Hcg=Hc+Lc
5081 PRINT "DMS$(Hcg)=";DMS$(Hcg)
5082 IF Hcg>24 THEN 5400
5083 IF Hcg<0  THEN 5450
5085 Hcg1=Hcg
5090 PRINT "DMS$(Hcg1)=";DMS$(Hcg1)
5091 PRINT "Si ocurre algo asi variar las Et"
5092 PRINT "Si Hcg>24 Greew dia n+1"
5093 PRINT "Si Hcg<0  Greew dia n-1"
5094 PRINT "              "
5095 GOSUB 5300
5100 PRINT "Calc.ecuac.tiemp.del instante"
5110 PRINT "    24-(Et2-Et1)    Hcg-x"
5120 PRINT "    x=Hcg*(Et2-Et1)/24"
5130 x=Hcg*((Et2)-(Et1))/24
5140 PRINT "DMS$(x)=";DMS$(x)
5150 PRINT "    Et=Et1+x"
5160 Et=Et1+x
5170 PRINT "DMS$(Et)=";DMS$(Et)
5180 PRINT "Calc.hora verdader.en Greenwich"
5190 PRINT "    Hvg=Hmg-Et"
5200 Hvg=Hmg-Et
5210 PRINT "DMS$(Hvg)=";DMS$(Hvg)
5220 PRINT "Calculo de la hora verda.pedida"
5230 PRINT "    Hv=Hvg-Lv"
5240 Hv=Hvg-Lv
5250 PRINT "DMS$(Hv)=";DMS$(Hv)
5260 END
5300 IF Hcg1<12 THEN 5320
5310 IF Hcg1>12 THEN 5350
5320 Hmg=Hcg1+12
5330 PRINT "DMS$(Hmg)=";DMS$(Hmg)
5340 GOSUB 5100
5350 Hmg=Hcg1-12
5360 GOSUB 5330
5400 Hcg1=Hcg-24
5410 GOSUB 5090
5450 Hcg1=24+Hcg
5460 GOSUB 5090
5500 PRINT "Si la long.es occiden.(W)   +"
5510 PRINT "Si la long.es oriental(E)   -"
5520 INPUT "Long.verdadera=";Lv
5530 INPUT "Long.civil=";Lc
5540 INPUT "Hora verdadera=";Hv
5550 INPUT "0h TU,ecuac.tiemp1=";Et1
5555 INPUT "0h TU,ecuac.tiemp2=";Et2
5560 PRINT "Calculo hora verd.en Greenwich"
5570 PRINT "    Hvg=Hv+Lv"
5580 Hvg=Hv+Lv
5581 PRINT "DMS$(Hvg)=";DMS$(Hvg)
5582 IF Hvg>24 THEN 5800
5583 IF Hvg<0  THEN 5850
5585 Hvg1=Hvg
5590 PRINT "DMS$(Hvg1)=";DMS$(Hvg1)
5593 PRINT "Si ocurre algo asi variar las Et"
5595 PRINT "Si Hv<12 y Hvg>12 Greew dia n+1"
5596 PRINT "Si Hv>12 y Hvg<12 Greew dia n-1"
5598 PRINT "              "
5600 PRINT "Calc.en primer.aproximac.del TU"
5610 PRINT "    TU=Hvg1+-12"
5615 IF Hvg1<12 THEN 5625
5616 IF Hvg1>12 THEN 5620
5620 TU=Hvg1-12
5621 GOSUB 5630
5625 TU=Hvg1+12
5630 PRINT "DMS$(TU)=";DMS$(TU)
5650 PRINT "Calc.ecuac.tiemp.del instante"
5660 PRINT "    24-(Et2-Et1)    TU-x"
5665 PRINT "    x=TU*(Et2-Et1)/24"
5670 x=TU*((Et2)-(Et1))/24
5680 PRINT "DMS$(x)=";DMS$(x)
5690 PRINT "    Et=Et1+x"
5700 Et=Et1+x
5710 PRINT "DMS$(Et)=";DMS$(Et)
5720 PRINT "Calc.hora civil en Greenwich"
5730 PRINT "    Hcg=TU+Et"
5740 Hcg=TU+Et
5750 PRINT "DMS$(Hcg)=";DMS$(Hcg)
5760 PRINT "Calculo de la hora civil pedida"
5770 PRINT "    Hc=Hcg-Lc"
5780 Hc=Hcg-Lc
5790 PRINT "DMS$(Hc)=";DMS$(Hc)
5795 END
5800 Hvg1=Hvg-24
5810 GOSUB 5590
5850 Hvg1=24+Hvg
5860 GOSUB 5590
6000 PRINT "Si la long.es occiden.(W)   +"
6010 PRINT "Si la long.es oriental(E)   -"
6020 INPUT "Long.civil=";Lc
6030 INPUT "Long.legal=";Ll
6040 INPUT "Hora civil=";Hc
6050 Uc=Lc+0.5
6060 PRINT "Partimos del huso numero=";INT Uc
6070 Ul=Ll+0.5
6080 PRINT "Termin.en el huso numero=";INT Ul
6090 PRINT "Calculo hora meridiano central"
6100 PRINT "    Ho=Hc+-increm."
6110 Ho=Hc+-increm.
6500 INPUT "Excentricidad=";e
6510 INPUT "Ang.perig-v=";v
6520 PRINT "Relacion anomalia verd. y media"
6530 PRINT " v-nt=2eSINnt+5/4e^2SIN2nt+..."
6540 PRINT "Calc. nt por aproxim.sucesivas"
6550 PRINT "   nt=v-(2eSINnt+5/4e^2SIN2nt)*180/PI"
6560 nt1=v
6570 PRINT "DMS$(nt1)=";DMS$(nt1)
6580 nt2=v-(2*e*SINv+(5/4)*(e^2)*SIN2*v)*180/PI
6590 PRINT "DMS$(nt2)=";DMS$(nt2)
6600 nt3=v-(2*e*SIN(nt2)+(5/4)*(e^2)*SIN(2*nt2))*180/PI
6610 PRINT "DMS$(nt3)=";DMS$(nt3)
6620 nt4=v-(2*e*SIN(nt3)+(5/4)*(e^2)*SIN(2*nt3))*180/PI
6630 PRINT "DMS$(nt4)=";DMS$(nt4)
6640 nt5=v-(2*e*SIN(nt4)+(5/4)*(e^2)*SIN(2*nt4))*180/PI
6650 PRINT "DMS$(nt5)=";DMS$(nt5)
6660 nt6=v-(2*e*SIN(nt5)+(5/4)*(e^2)*SIN(2*nt5))*180/PI
6670 PRINT "DMS$(nt6)=";DMS$(nt6)
6680 PRINT "Calculo fin de la estacion"
6690 PRINT "    Ahora v1=v+90"
6700 v1=v+90
6710 nt11=v1
6720 PRINT "DMS$(nt11)=";DMS$(nt11)
6730 nt22=v1-(2*e*SIN(nt11)+(5/4)*(e^2)*SIN(2*nt1))*180/PI
6740 PRINT "DMS$(nt22)=";DMS$(nt22)
6750 nt33=v1-(2*e*SIN(nt22)+(5/4)*(e^2)*SIN(2*nt22))*180/PI
6760 PRINT "DMS$(nt33)=";DMS$(nt33)
6770 nt44=v1-(2*e*SIN(nt33)+(5/4)*(e^2)*SIN(2*nt33))*180/PI
6780 PRINT "DMS$(nt44)=";DMS$(nt44)
6790 nt55=v1-(2*e*SIN(nt44)+(5/4)*(e^2)*SIN(2*nt44))*180/PI
6800 PRINT "DMS$(nt55)=";DMS$(nt55)
6810 nt66=v1-(2*e*SIN(nt55)+(5/4)*(e^2)*SIN(2*nt55))*180/PI
6820 PRINT "DMS$(nt66)=";DMS$(nt66)
6830 PRINT "Duracion de la estacion"
6840 PRINT "num.di.=(nt66-nt6)*365.2422/360"
6850 nd=(nt66-nt6)*365.2422/360
6860 PRINT "Numero dias=";nd
6870 PRINT "Fraccion dia=";DMS$(FRACnd*24)
6880 END
6905 INPUT "41.Refraccion atmosferica.",K:IF K=41 THEN 7000
6915 PRINT "Tres metodos de orientacion..."
6925 INPUT "42.Por observaciones al Sol.",K:IF K=42 THEN 7500
6930 INPUT "421.Por el  proceso inverso.",K:IF K=421 THEN 7760
6935 INPUT "43.Por observac. a la Polar.",K:IF K=43 THEN 8000
6940 INPUT "438.Por el proceso  inverso.",K:IF K=438 THEN 20500
6945 INPUT "44.Por observac.en max.digr.",K:IF K=44 THEN 10000
7000 PRINT "Formula a emplear..... 1,2 o 3"
7010 INPUT "Laplace,Bessel o Bradley";F1
7020 IF F1=1 THEN 7070
7030 IF F1=2 THEN 7140
7040 IF F1=3 THEN 7210
7050 PRINT "Error en la introducion"
7060 GOSUB 7010
7070 PRINT "";CHR$(138);"=60.29''TAN(Za)-0.07''TAN";CHR$(147);"(Za)"
7080 PRINT "Si Za<75";CHR$(223);" precis.de ";CHR$(138);" es 0.2''"
7090 PRINT "Si Za<30";CHR$(223);" la formula es exacta"
7100 INPUT "Za=";Za
7110 Ro=DEG(0,0,60.29)*TAN(Za)-DEG(0,0,0.07)*(TAN(Za))^3
7120 PRINT "";CHR$(138);"=";DMS$(Ro)
7130 END
7140 PRINT "lg";CHR$(138);"=lg(tg za)+lgb+lga'+lga''+.."
7150 PRINT " b presi.atmosf,a va tabulado"
7160 PRINT "Si Za=45";CHR$(223);"precision de ";CHR$(138);"";CHR$(225);"0.27''"
7170 PRINT "Si Za=81";CHR$(223);"precision de ";CHR$(138);"";CHR$(225);"1.00''"
7180 PRINT "Si Za=85";CHR$(223);"precision de ";CHR$(138);"";CHR$(225);"1.70''"
7190 PRINT "Si Za=89.5";CHR$(223);"precision de ";CHR$(138);"";CHR$(225);"20''"
7200 END
7210 PRINT "";CHR$(138);"=";CHR$(138);"m  T  b    donde...      EXE"
7220 PRINT "";CHR$(138);"m=57.8''tg(z-230''tg z)"
7230 PRINT "T=278(1-16E-4 t) / 753.5(268+t)"
7240 PRINT "b presion reducid.aire ambiente"
7250 PRINT "Calculo de ";CHR$(138);"m"
7260 INPUT "Za=";Za
7270 Rom=DEG(0,0,57.8)*TAN(Za-(DEG(0,0,230)*TANZa))
7280 PRINT "";CHR$(138);"m=";DMS$(Rom)
7290 PRINT "Calculo de T"
7300 INPUT "t=";t
7310 T=( 278*(1-0.00016*t) )/( 753.5*(268+t) )
7320 PRINT "T=";T
7330 PRINT "Calculo de ";CHR$(138);""
7340 INPUT "b=";b
7350 Ro=Rom*T*b
7360 PRINT "";CHR$(138);"=";DMS$(Ro)
7370 END
7498 PRINT "";CHR$(138);"=";DMS$(Ro)
7499 Ro=DEG(0,0,60.29)*TAN(Za)-DEG(0,0,0.07)*(TAN(Za))^3
7500 INPUT "Latitud lugar ";La
7510 PRINT "";CHR$(142);" (";CHR$(223);",',')  Sol";:INPUT De
7520 INPUT "Semidiametro  ";Cc
7530 INPUT "Colimacion (g)";Ec
7540 INPUT "Eclimetro  (g)";Ee
7550 INPUT "Angulo cenital";L
7560 IF L>200 THEN Lv=400-L-Ee
7570 IF L<200 THEN Lv=L+Ee
7580 PRINT "Vertical en CD";Lv
7585 Lvs=Lv*0.9
7590 Ro=DEG(0,0,60.29)*TAN(Lvs)-DEG(0,0,0.07)*(TAN(Lvs))^3
7593 PRINT " Refraccion   ";DMS$(Ro)
7595 hr=100-Lv
7597 PRINT "h  con refracc";hr
7599 h=(100-Lv)-(Ro/0.9)
7600 PRINT "h  sin refracc";h
7610 hc=h+(Cc/0.9)
7620 PRINT "ALTURA del Sol";hc
7630 INPUT "Ang horizontal";Hz
7650 IF L<200 THEN 7670
7660 IF L>200 THEN 7690
7670 AHz=Hz-Ec+((Cc/COS(h*0.9))/0.9)
7680 GOSUB 7700
7690 AHz=Hz+Ec+((Cc/COS(h*0.9))/0.9)
7700 PRINT "Hz (corregido)";AHz
7710 z=ACS((SINDe-(SIN(hc*0.9)*SINLa))/(COS(hc*0.9)*COSLa))
7715 zc=z/0.9
7720 PRINT "  Azimut  ";zc
7725 zt=400-zc
7728 PRINT "  TARDE   ";zt
7730 W=zt-AHz
7740 PRINT "Desorientacion";W
7750 GOSUB 7550
7760 INPUT "Latitud lugar ";La
7770 PRINT "";CHR$(142);" (";CHR$(223);",',')  Sol";:INPUT De
7780 INPUT "Semidiametro  ";Cc
7790 INPUT "Colimacion (g)";Ec
7800 INPUT "Eclimetro  (g)";Ee
7810 INPUT "Angulo cenital";L
7820 IF L>200 THEN Lv=400-L-Ee
7830 IF L<200 THEN Lv=L+Ee
7840 PRINT "Vertical en CD";Lv
7850 Lvs=Lv*0.9
7860 Ro=DEG(0,0,60.29)*TAN(Lvs)-DEG(0,0,0.07)*(TAN(Lvs))^3
7870 h=(100-Lv)-(Ro/0.9)
7880 PRINT "ALTURA h=100-v";h
7890 hc=h+(Cc/0.9)
7900 PRINT "  ALTURA  de  ";hc
7910 z=ACS((SINDe-(SIN(hc*0.9)*SINLa))/(COS(hc*0.9)*COSLa))
7915 zc=z/0.9
7920 PRINT "  Azimut  de  ";zc
7925 zci=400-zc
7927 PRINT "TARDE luego z=";zci
7930 INPUT "Desorientacion";Wl
7940 AHz=zci-Wl
7960 IF L>200 THEN 7970
7962 IF L<200 THEN 7965
7965 Hzgt=AHz+Ec-((Cc/COS(h*0.9))/0.9)
7968 GOSUB 7975
7970 Hzgt=AHz-Ec-((Cc/COS(h*0.9))/0.9)
7975 PRINT "Hz de ";Hzgt
7976 INPUT "Ang horizontal";Hzm
7980 IF L>200 THEN hccs=Hzm+Ec+((Cc/COS(h*0.9))/0.9)
7982 IF L<200 THEN hccs=Hzm-Ec+((Cc/COS(h*0.9))/0.9)
7985 PRINT "HORIZONTAL de ";hccs
7990 ww=zci-hccs
7995 PRINT "Desorientacion de ";ww
7998 GOSUB 7810
8000 INPUT "431.Metodo de las casillas.",K:IF K=431 THEN 8020
8010 INPUT "432.Hora observ menos paso.",K:IF K=432 THEN 8420
8015 INPUT "433.Con ayuda del  anuario.",K:IF K=433 THEN 8500
8020 PRINT "";CHR$(136);"(h,m,s) Polar";:INPUT Ar
8025 PRINT "";CHR$(142);"(";CHR$(223);",',') Polar";:INPUT De
8030 PRINT "";CHR$(140);"";CHR$(161);"(h,m,s) a 0h";:INPUT Ts
8032 INPUT "Longitud  lugar";Lr
8034 INPUT "Latitud   lugar";La
8035 INPUT "Error colimacion";Ec
8037 INPUT "Error  eclimetro";Ee
8040 INPUT "Hora del reloj";Hr
8042 INPUT "Lec horizontal";Az
8043 INPUT "Angulo cenital";L
8045 GOSUB 800
8050 Hcg=Hr-DEG(1,04,25)
8060 PRINT "TU corregido reloj=";DMS$(Hcg)
8070 Isg=Hcg*1.002737910
8080 PRINT "Is=TU *1.002737910=";DMS$(Isg)
8090 Hsg=Isg+Ts
8100 PRINT "Hora sid.Greenwich=";DMS$(Hsg)
8110 Hsv=Isg+Ts-Lr
8120 PRINT "Hora siderea lugar=";DMS$(Hsv)
8130 ahs=Hsv-Ar
8140 PRINT "Angulo horario sid=";DMS$(ahs)
8150 Hce=400*ahs/24
8160 PRINT "Angulo horario=";Hce
8170 H=360*ahs/24
8175 GOSUB 1030
8180 M=ATN(TANDe/COSH)
8190 PRINT "tgM=tg";CHR$(142);"/cosH=";DMS$(M)
8194 X=La-M
8196 PRINT "X=39";CHR$(223);"28'49''5-M=";DMS$(X)
8200 A=ATN(COSM*TANH/SIN(X))
8210 PRINT "tgA=cosMtgH/senX=";DMS$(A)
8220 IF (A>0) THEN 8230
8221 IF (A<0) THEN 8232
8230 A1=A
8231 GOSUB 8240
8232 A1=360+A
8233 GOSUB 8240
8240 GOSUB 8250
8250 IF (A1<180) THEN 8260
8251 IF (A1>180) THEN 8270
8260 IF (H<180) THEN 8265
8261 IF (H>180) THEN 8268
8265 A2=A1
8266 GOSUB 8280
8268 A2=A1+180
8269 GOSUB 8280
8270 IF (H>180) THEN 8275
8271 IF (H<180) THEN 8278
8275 A2=A1
8276 GOSUB 8280
8278 A2=A1-180
8279 GOSUB 8280
8280 A3=A2+180
8282 PRINT "Valor del acimut";DMS$(A3)
8285 INPUT "Valor del acimut";A4
8290 PRINT "tgh=cosA/tg(La-M)"
8292 h=ATN(COSA4/TANX)
8294 PRINT "latitud";CHR$(226);"";DMS$(h)
8300 PRINT "Que circulo se lee..... 1,2
8310 INPUT "Circulo directo o inverso";F2
8314 IF F2=2 THEN 8360
8316 IF F2=1 THEN 8320
8318 PRINT "Vuelve a intentarlo"
8319 GOSUB 8310
8320 INPUT "Lectura cd=";lp
8326 LD=(lp-Ec)*0.9
8330 PRINT "Lectura corregida";DMS$(LD)
8340 w=A4-LD
8350 PRINT "W=Az-Lectura=";DMS$(w)
8355 GOSUB 8400
8360 INPUT "Lectura ci=";lp
8365 LI=(lp+Ec)*0.9
8370 PRINT "Lectura corregida";DMS$(LI)
8380 w=A4-LI
8390 PRINT "W=Az-Lectura=";DMS$(w)
8400 INPUT "431(1) o 432(2)";p
8410 IF p=1 THEN 8040
8415 IF p=2 THEN 8440
8417 PRINT "vuelve a intentarlo"
8418 GOSUB 8400
8420 INPUT "Longitud  lugar";Lr
8425 INPUT "Latitud   lugar";La
8430 INPUT "cd - ci(g,c,cc)";Ec
8435 PRINT "";CHR$(142);"(";CHR$(223);",',') Polar";:INPUT De
8438 PRINT "Paso sup(h,m,s)";:INPUT Hp
8440 INPUT "Hora del  reloj";Hr
8450 Hco=Hr-DEG(1,04,25)-Lr
8460 PRINT "Paso a tiempo civil";DMS$(Hco)
8470 H=Hco-Hp
8472 IF H>0 THEN 8480
8474 IF H<0 THEN 8476
8476 PRINT "Hp dia anterior! y Ang=Hc+24-Hp"
8478 H=Hco+(24-Hp)
8480 PRINT "Ang. horario civil=";DMS$(H)
8490 ahs=H*1.002737910
8495 GOSUB 8140
8500 INPUT "Observ-paso(1) o casillas(2)";OC
8510 IF OC=1 THEN 8820
8515 IF OC=2 THEN 8520
8520 PRINT "";CHR$(136);"(h,m,s) Polar";:INPUT Ar
8525 PRINT "";CHR$(142);"(";CHR$(223);",',') Polar";:INPUT De
8530 PRINT "";CHR$(140);"";CHR$(161);"(h,m,s) a 0h";:INPUT Ts
8532 INPUT "Longitud  lugar";Lr
8533 INPUT "Latitud   lugar";La
8535 INPUT "cd-ci (g,c,cc)";Ec
8540 INPUT "Hora del reloj";Hr
8550 Hcg=Hr-DEG(1,04,25)
8560 PRINT "TU corregido reloj=";DMS$(Hcg)
8570 Isg=Hcg*1.002737910
8580 PRINT "Is=TU *1.002737910=";DMS$(Isg)
8590 Hsg=Isg+Ts
8600 PRINT "Hora sid.Greenwich=";DMS$(Hsg)
8610 Hsv=Isg+Ts-Lr
8620 PRINT "Hora siderea lugar=";DMS$(Hsv)
8630 ahs=(Hsv-Ar)/1.002737910
8635 PRINT "Ang horario civil";DMS$(ahs)
8640 IF ahs>12 THEN 8650
8645 IF ahs<12 THEN 8660
8650 Ha=24-ahs
8655 GOSUB 8920
8660 Ha=ahs
8670 PRINT "Tabla I...H=";INT(Ha);"";CHR$(223);"";((FRAC(Ha))*60);"'"
8680 PRINT "A";CHR$(145);"";CHR$(145);"";:INPUT J11
8682 PRINT "A";CHR$(145);"";CHR$(146);"";:INPUT J12
8684 PRINT "A";CHR$(146);"";CHR$(145);"";:INPUT J21
8686 PRINT "A";CHR$(146);"";CHR$(146);"";:INPUT J22
8690 PRINT "  Primera interpolacion"
8700 I1=(J21-J11)*((FRAC(Ha))*60)/10
8705 Z1=J11+I1
8710 PRINT "Z (primera interpo)";Z1
8720 I2=(J22-J12)*((FRAC(Ha))*60)/10
8725 Z2=J12+I2
8730 PRINT "Z (segunda interpo)";Z2
8740 Z=Z1+( (Z2-Z1)*FRAC(La) )
8750 PRINT "Luego Z=";Z
8760 PRINT "Tabla II..Correciones por ";CHR$(142);""
8770 PRINT "B";CHR$(145);"";CHR$(145);"";:INPUT G11
8772 PRINT "B";CHR$(145);"";CHR$(146);"";:INPUT G12
8774 PRINT "B";CHR$(146);"";CHR$(145);"";:INPUT G21
8776 PRINT "B";CHR$(146);"";CHR$(146);"";:INPUT G22
8780 PRINT "  Primera interpolacion"
8782 O1=(G21-G11)*((FRAC(Ha))*60)/10
8820 INPUT "Longitud  lugar";Lr
8825 PRINT "";CHR$(142);"(";CHR$(223);",',') Polar";:INPUT De
8830 INPUT "Latitud   lugar";La
8838 PRINT "Paso sup(h,m,s)";:INPUT Pp
8840 INPUT "Hora del  reloj";Hr
8850 Hc1=Hr-DEG(1,04,25)-Lr
8860 PRINT "Hora civil observ";DMS$(Hc1)
8870 an=Hc1-Pp
8872 IF an>0 THEN 8880
8874 IF an<0 THEN 8876
8876 PRINT "Hp dia anterior! y Ang=Hc+24-Hp"
8878 an=Hc1+(24-Pp)
8880 PRINT "Ang horario civil";DMS$(an)
8890 IF an>12 THEN 8900
8895 IF an<12 THEN 8910
8900 Ha=24-an
8905 GOSUB 8920
8910 Ha=an
8920 GOSUB 8670
10000 PRINT "";CHR$(178);"(";CHR$(223);",',')";:INPUT La
10010 PRINT "";CHR$(136);"(h,m,s)";:INPUT Ar
10020 PRINT "";CHR$(142);"(";CHR$(223);",',')";:INPUT De
10023 INPUT "Lect. horizontal";Hz
10025 INPUT "Error colimacion";Ec
10030 PRINT "  cosH=tg(la)/tg(de)"
10040 H2=ACS(TANLa/TANDe)
10042 IF  H2<0 THEN H22=360+H2
10044 IF  H2>0 THEN H22=H2
10050 PRINT "H occidental de";DMS$(H22)
10060 H1=360-H22
10070 PRINT "H'' oriental de";DMS$(H1)
10080 Hs2=Ar+(H22)/15
10090 Hs1=Ar+(H1)/15
10100 PRINT "";CHR$(140);"occident de";DMS$(Hs2)
10110 PRINT "";CHR$(140);"oriental de";DMS$(Hs1)
10120 h=ASN(SINLa/SINDe)
10130 PRINT "  senh=sen(la)/sen(de)"
10132 PRINT "Luego h vale";DMS$(h)
10135 PRINT "  sen(A)=cos(De)/cos(La)"
10140 A=ASN(COSDe/COSLa)
10150 IF De>0 THEN 10180
10170 IF De<0 THEN 10230
10180 A2=180-A
10190 PRINT "Acimut occidental";DMS$(A2)
10200 A1=360-A2
10210 PRINT "Acimut  oriental ";DMS$(A1)
10220 GOSUB 10280
10230 A2=A
10240 PRINT "Acimut occidental";DMS$(A2)
10260 A1=360-A2
10270 PRINT "Acimut  oriental ";DMS$(A1)
10280 END
10405 INPUT "51.Correc. por precesion.",K:IF K=5 THEN 10500
10500 PRINT "";CHR$(136);"(h,m,s)";:INPUT Ar
10510 PRINT "";CHR$(142);"(";CHR$(223);",',')";:INPUT De
10520 PRINT "";CHR$(136);" (p.d.)";:INPUT m1
10525 PRINT "";CHR$(142);" (p.d.)";:INPUT m2
10528 PRINT "10";CHR$(223);" o 5";CHR$(223);"";:INPUT It
10530 PRINT "A";CHR$(145);"";CHR$(145);" (";CHR$(136);"  p.d.)";:INPUT J11
10540 PRINT "A";CHR$(145);"";CHR$(146);"";:INPUT J12
10550 PRINT "A";CHR$(146);"";CHR$(145);"";:INPUT J21
10560 PRINT "A";CHR$(146);"";CHR$(146);"";:INPUT J22
10570 PRINT "  Primera interpolacion"
10575 PRINT " x=(A21-A11)(increm)/20"
10580 I1=(J21-J11)*(Ar-m1)/DEG(0,20,00)
10585 PRINT " x=";I1
10586 PRINT "  P.A.=(A11) '+' (x)"
10587 INPUT "=(1)  o -(2)";pr
10590 Z1=J11+(pr*I1)
10600 PRINT "Primera aprox";Z1
10603 PRINT "  Segunda interpolacion"
10608 PRINT "x'=(A22-A12)(increm)/20"
10610 I2=(J22-J12)*(Ar-m1)/DEG(0,20,00)
10611 PRINT "x'=";I2
10620 Z2=J12+(pr*I2)
10630 PRINT "Segunda aprox";Z2
10632 IF Z2>Z1 THEN Z4=Z2
10634 IF Z2>Z1 THEN Z3=Z1
10636 IF Z2<Z1 THEN Z4=Z1
10637 IF Z2<Z1 THEN Z3=Z2
10638 PRINT "Correc. =Prim.aprox. + interp."
10639 INPUT "=(1)  o -(2)";Sd
10640 Z=Z1+(Sd*(Z4-Z3)*(De-m2)/It)
10650 PRINT "Correc.anual en";CHR$(136);"";Z
10660 INPUT "Tiempo transcurrido";N
10665 Rgt=(Z*N)
10670 Ac=Ar+DEG(0,00,Rgt)
10680 PRINT "";CHR$(136);" corregida de ";DMS$(Ac)
10690 PRINT "B";CHR$(145);"";CHR$(145);" (";CHR$(136);" p.d.)";:INPUT G11
10700 PRINT "B";CHR$(146);"";CHR$(145);"";:INPUT G21
10710 PRINT "";CHR$(136);" (p.d.)";:INPUT n1
10720 L1=(G21-G11)*(Ar-n1)/DEG(0,10,00)
10721 PRINT "  L1=(B21-B11)(increm)/10m"
10722 PRINT "  L1=";L1
10723 PRINT " FD=(B11) '+' (LI)"
10724 INPUT "=(1)  o  -(2)";Jh
10725 FD=G11+(Jh*LI)
10726 PRINT "Correc.anual";CHR$(142);"";FD
10727 INPUT "Tiempo transcurrido";NN
10729 Sax=FD*NN
10730 INPUT "Correcion +/- (1/2)";CC
10734 IF CC=1 THEN 10740
10736 IF CC=2 THEN 10760
10738 GOSUB 10730
10740 Dc=De+DEG(0,00,Sax)
10750 PRINT "";CHR$(142);"corregida=";DMS$(Dc)
10755 END
10760 Dc=De-DEG(0,00,Sax)
10770 PRINT "";CHR$(142);"corregida=";DMS$(Dc)
10780 END
20000 IF L>200 THEN Lv=400-L-Ee
20010 IF L<200 THEN Lv=L+Ee
20020 PRINT "Vertical en CD";Lv
20030 Lvs=Lv*0.9
20040 Ro=DEG(0,0,60.29)*TAN(Lvs)-DEG(0,0,0.07)*(TAN(Lvs))^3
20055 PRINT " Refraccion   ";DMS$(Ro)
20060 Vc=Lv+(Ro/0.9)
20070 PRINT "Vertical corregido";Vc
20080 PRINT "Hora  siderea  ";DMS$(Hsv)
20090 PRINT "Angulo horario ";DMS$(ahs)
20100 n=ATN(TANDe/COSH)
20105 PRINT "tgn=tgDe/cosH"
20108 h=90-(Vc*0.9)
20110 m=ACS(SINh*SINn/SINDe)
20115 PRINT "cos(La-n)=senh*senn/senDe"
20120 La=m+n
20130 PRINT "Latitud  ";DMS$(La)
20140 GOSUB 8040
20500 PRINT "";CHR$(136);"(h,m,s) Polar";:INPUT Ar
20510 PRINT "";CHR$(142);"(";CHR$(223);",',') Polar";:INPUT De
20530 PRINT "";CHR$(140);"";CHR$(161);"(h,m,s) a 0h";:INPUT Ts
20540 INPUT "Longitud  lugar";Lr
20545 INPUT "Latitud   lugar";Latt
20550 INPUT "Error colimacion";Ec
20560 INPUT "Error  eclimetro";Ee
20570 INPUT "Hora del reloj";Hr
20580 Hcg=Hr-DEG(2,05,01)
20590 PRINT "T.U. corregido ";DMS$(Hcg)
20600 Isg=Hcg*1.002737910
20610 Hsv=Isg+Ts-Lr
20620 PRINT "Hora  siderea  ";DMS$(Hsv)
20630 ahs=Hsv-Ar
20640 PRINT "Angulo horario ";DMS$(ahs)
20650 H=360*ahs/24
20660 M=ATN(TANDe/COSH)
20670 X=Latt-M
20680 A=ATN(COSM*TANH/SINX)
20690 IF (A>0) THEN 20710
20700 IF (A<0) THEN 20720
20710 A1=A
20715 GOSUB 20730
20720 A1=360+A
20730 IF (A1<180) THEN 20750
20740 IF (A1>180) THEN 20810
20750 IF (H<180) THEN 20770
20760 IF (H>180) THEN 20790
20770 A4=A1
20780 GOSUB 20820
20790 A4=A1+180
20800 GOSUB 20820
20810 IF (H>180) THEN 20815
20811 IF (H<180) THEN 20818
20815 A4=A1
20816 GOSUB 20820
20818 A4=A1-180
20820 PRINT "Acimut topografico";DMS$(A4)
20840 INPUT "W aproximadamente";W
20850 TLI=A4-W
20860 LI=TLI/0.9
20880 INPUT "cd (1) o ci (2)  ";J
20890 IF J=1 THEN 20900
20895 IF J=2 THEN 20920
20900 Az=LI+Ec
20910 GOSUB 20930
20920 Az=LI-Ec
20930 PRINT "Lec horizontal";Az
20935 GOSUB 21200
20940 INPUT "Latitud + o -";La
20950 n=ATN(TANDe/COSH)
20960 m=La-n
20970 h=ASN(COSm*SINDe/SINn)
20980 Vc=(90-h)/0.9
21000 Vcs=Vc*0.9
21010 Ro=DEG(0,0,60.29)*TAN(Vcs)-DEG(0,0,0.07)*(TAN(Vcs))^3
21020 Lv=Vc-(Ro/0.9)
21040 IF J=2 THEN L=400-Lv+Ee
21050 IF J=1 THEN L=Lv-Ee
21060 PRINT "Lect vertical";L
21065 INPUT "Lect vertical";L1
21070 IF L1>200 THEN Lv1=400-L1-Ee
21080 IF L1<200 THEN Lv1=L1+Ee
21090 Lvs1=Lv1*0.9
21100 Ro1=DEG(0,0,60.29)*TAN(Lvs1)-DEG(0,0,0.07)*(TAN(Lvs1))^3
21110 Vc1=Lv1+(Ro1/0.9)
21120 PRINT "Vertical corregido";Vc1
21130 n1=ATN(TANDe/COSH)
21140 h1=90-(Vc1*0.9)
21150 m1=ACS(SINh1*SINn1/SINDe)
21160 Laa=m1+n1
21170 PRINT "Latitud  ";DMS$(Laa)
21190 GOSUB 20570
21200 INPUT "Lec horizontal";Acm
21210 IF J=1 THEN 21230
21220 IF J=2 THEN 21240
21230 LI1=Acm-Ec
21235 GOSUB 21250
21240 LI1=Acm+Ec
21250 PRINT "Lectura a la Polar";LI1
21260 TLI1=LI1*0.9
21270 w1=A4-TLI1
21280 PRINT "W=Az-L.P. de";DMS$(w1)
21290 GOSUB 20940
