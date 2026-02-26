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
7802 INPUT "VERTICAL en CD";Vcd
7804 INPUT "CD(1) o CI(2) ";ppp
7806 IF  ppp=1 THEN ll=Vcd-Ee
7807 IF  ppp=2 THEN ll=400-(Vcd+Ee)
7808 PRINT "V de ";ll
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
7998 GOSUB 7802
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
