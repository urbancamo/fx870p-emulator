10 INPUT "1.Metodo de minimos cuadrados.",K:IF K=1 THEN 510
20 INPUT "2.Paso coord.absolutas imagen.",K:IF K=2 THEN 1000
30 INPUT "3.Programa  de  fotogrametria.",K:IF K=3 THEN 10000
510 CLS :CLEAR :PRINT "  Minimos cuadrados."
520 PRINT "n";CHR$(223);"filas";:INPUT F:PRINT "n";CHR$(223);"columnas";:INPUT C
530 IF F<C THEN  P=F:Q=C ELSE P=C:Q=F
540 CLS :LOCATE O,1:IF P=F THEN PRINT "Sistema condicionado" ELSE PRINT "Sistema indirecto"
550 DIM M(F,C),A(P,P),B(P,P),P(P),F(C),K(F),R(F)
560 FOR I=1 TO F:FOR J=1 TO C
570 PRINT "A(";I;",";J;")=";:INPUT M(I,J):NEXT J:NEXT I
580 FOR I=1 TO F:PRINT "K(";I;")=";:INPUT K(I):NEXT I:STOP
590 INPUT "Ver datos (S/N)";PP$:IF PP$="S" THEN PP=1 ELSE PP=0
600 CLS:IF P=F THEN PRINT TAB(8);"A*AT" ELSE PRINT TAB(8);"AT*A"
610 FOR I=1 TO P:FOR J=1 TO P:FOR K=1 TO Q
620 IF  P=F THEN A(I,J)=A(I,J)+M(I,K)*M(J,K) ELSE A(I,J)=A(I,J)+M(K,I)*M(K,J)
630 NEXT K:IF PP=1 THEN PRINT "A(";I;";";J;")=";A(I,J):GOSUB 940
640 NEXT J:NEXT I
650 CLS :PRINT TAB(6);"Inversa"
660 N=P:FOR I=1 TO N:B(I,I)=1:NEXT I
670 FOR I=1 TO N:IF A(I,I)<>0 THEN 710 ELSE J=I
680 J=J+1:IF J<=N THEN 690 ELSE CLS :PRINT "Matriz singular":END
690 IF A(J,I)<>0 THEN 700 ELSE 680
700 FOR K=1 TO N:A(I,K)=A(I,K)+A(J,K):B(I,K)=B(I,K)+B(J,K):NEXT K
710 FOR J=1 TO N
720 IF I=J THEN 750
730 B=-A(J,I)/A(I,I)
740 FOR K=1 TO N:A(J,K)=A(J,K)+B*A(I,K):B(J,K)=B(J,K)+B*B(I,K):NEXT K
750 NEXT J
760 CO=A(I,I):FOR J=1 TO N:B(I,J)=B(I,J)/CO:A(I,J)=A(I,J)/CO:NEXT J
770 NEXT I
780 FOR I=1 TO P:FOR J=1 TO P:IF PP=1 THEN PRINT "B(";I;",";J;")=";B(I,J):GOSUB 940
790 NEXT J:NEXT I
800 CLS :IF P=F THEN PRINT TAB(6);"(A*AT)-1*K" ELSE PRINT TAB(8);"AT*K"
810 FOR I=1 TO P:FOR J=1 TO F
820 IF P=F THEN P(I)=P(I)+B(I,J)*K(J) ELSE P(I)=P(I)+M(J,I)*K(J)
830 NEXT J:IF PP=1 THEN PRINT "P(";I;")=";P(I):GOSUB 940
840 NEXT I
850 CLS :IF P=F THEN PRINT "Errores=AT*(A*AT)-1*K" ELSE PRINT "Incognitas=(AT*A)-1*AT*K"
860 FOR I=1 TO C:FOR J=1 TO P
870 IF  F=Q THEN F(I)=F(I)+B(I,J)*P(J) ELSE F(I)=F(I)+M(J,I)*P(J)
880 NEXT J:PRINT "F(";I;")=";F(I)
890 IF INKEY$="" THEN 890
900 NEXT I
910  IF F<C THEN 990
920 CLS: PRINT "residuos=A*X-K":GOSUB 990
930 FOR I=1 TO F:R(I)=-K(I)
940 FOR J=1 TO C:R(I)=R(I)+M(I,J)*F(J):NEXT J
950 PRINT "residuos";I;"=";R(I):GOSUB 990
960 NEXT I
970 CLS:END
990 IF  INKEY$="" THEN 940 ELSE RETURN
1000 INPUT "Giro omega=";w
1010 INPUT "Giro fi=";fi
1020 INPUT "Giro cappa=";x
1025 PRINT "Decir si(1) o no(2)        1,2"
1030 INPUT "Quieres ver la matriz inversa";k
1034 IF k=2 THEN 1130
1036 IF k=1 THEN 1040
1038 GOSUB 1030
1040 PRINT "m11=COS(fi)*COSx"
1050 PRINT "m12=COS(fi)*SINx"
1060 PRINT "m13=-SIN(fi)"
1070 PRINT "m21=SIN(fi)*SINw*COSx-COSw*SINx"
1080 PRINT "m22=SIN(fi)*SINw*SINx+COSw*COSx"
1090 PRINT "m23=SINw*COS(fi)"
1100 PRINT "m31=SIN(fi)*COSw*COSx+SINw*SINx"
1110 PRINT "m32=SIN(fi)*COSw*SINx-SINw*COSx"
1120 PRINT "m33=COSw*COS(fi)"
1130 m11=COS(fi)*COSx
1140 m12=COS(fi)*SINx
1150 m13=-SIN(fi)
1160 m21=SIN(fi)*SINw*COSx-COSw*SINx
1170 m22=SIN(fi)*SINw*SINx+COSw*COSx
1180 m23=SINw*COS(fi)
1190 m31=SIN(fi)*COSw*COSx+SINw*SINx
1200 m32=SIN(fi)*COSw*SINx-SINw*COSx
1210 m33=COSw*COS(fi)
1220 INPUT "Quieres ver los valores mii";jj
1224 IF jj=2 THEN 1320
1226 IF jj=1 THEN 1230
1227 GOSUB 1220
1230 PRINT "m11=";m11
1240 PRINT "m12=";m12
1250 PRINT "m13=";m13
1260 PRINT "m21=";m21
1270 PRINT "m22=";m22
1280 PRINT "m23=";m23
1290 PRINT "m31=";m31
1300 PRINT "m32=";m32
1310 PRINT "m33=";m33
1320 PRINT "Paso coord.absolutas a imagen "
1330 PRINT "  xt=f*n/d     yt=f*m/d"
1340 PRINT "n=m11(X-Xo)+m12(Y-Yo)+m13(Z-Zo)"
1350 PRINT "d=m31(X-Xo)+m32(Y-Yo)+m33(Z-Zo)"
1355 PRINT "m=m21(X-Xo)+m22(Y-Yo)+m23(Z-Zo)"
1360 INPUT "valor de la focal=";f
1364 INPUT "Coord.Xo absol.=";Xo
1366 INPUT "Coord.Yo absol.=";Yo
1368 INPUT "Coord.Zo absol.=";Zo
1370 INPUT "Coord.x absol.=";X
1380 INPUT "Coord.y absol.=";Y
1390 INPUT "Coord.z absol.=";Z
1400 xt= f * (  m11*(X-Xo)+m12*(Y-Yo)+m13*(Z-Zo)  )/(  m31*(X-Xo)+m32*(Y-Yo)+m33*(Z-Zo)  )
1410 yt= f * (  m21*(X-Xo)+m22*(Y-Yo)+m23*(Z-Zo)  )/(  m31*(X-Xo)+m32*(Y-Yo)+m33*(Z-Zo)  )
1420 PRINT "Valor de x=";xt
1430 PRINT "Valor de y=";yt
1440 GOSUB 1370
10000 CLEAR :PRINT "  Determinacion simultanea de     los parametros orientacion."
10020 CLS :PRINT "N";CHR$(223);" de puntos de apoyo";:INPUT N
10030 DIM X(N),Y(N),Z(N),XC(N),YC(N),FX(N),FY(N)
10040 FOR I=1 TO N
10050 PRINT "Coordenadas absolutas del       punto de  apoyo  numero";(I);"" :INPUT "Coordenada x";X(I),"Coordenada y";Y(I),"Coordenada z";Z(I):NEXT I:CLS
10060 INPUT "Sistema de coordenadas          imagen(1) o cliche(2)";L
10070 IF L=1 THEN 10200
10080 IF L=2 THEN 10100
10090 INPUT "Sistema de coordenadas          imagen(1) o cliche(2)";L :GOSUB 10070
10200 DIM S(N),H(N)
10210 FOR I=1 TO N
10220 PRINT "Coordenadas  imagen del         punto de apoyo numero";(I);"" :INPUT "Coordenada x";S(I),"Coordenada y";H(I):NEXT I:CLS
10230 PRINT "Valores aproximados de los      parametros de  orientacion"
10235 INPUT "Valor de la focal";P
10240 PRINT "Giro ";CHR$(133);" del stma imagen";:INPUT O
10250 PRINT "Giro ";CHR$(143);" del stma imagen";:INPUT F
10260 INPUT "Giro K del stma imagen";C
10270 PRINT "Coordenada absoluta x";CHR$(161);:INPUT Xo
10280 PRINT "Coordenada absoluta y";CHR$(161);:INPUT Yo
10290 PRINT "Coordenada absoluta z";CHR$(161);:INPUT Zo
10300 m11=COSF*COSC
10310 m12=COSF*SINC
10320 m13=-SINF
10330 m21=SINF*SINO*COSC-COSO*SINC
10340 m22=SINF*SINO*SINC+COSO*COSC
10350 m23=SINO*COSF
10360 m31=SINF*COSO*COSC+SINO*SINC
10370 m32=SINF*COSO*SINC-SINO*COSC
10380 m33=COSO*COSF
10390 PRINT
10400 FOR I=1 TO N
10410 XC(I)=P*(m11*(X(I)-Xo)+m12*(Y(I)-Yo)+m13*(Z(I)-Zo))/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))
10420 YC(I)=P*(m21*(X(I)-Xo)+m22*(Y(I)-Yo)+m23*(Z(I)-Zo))/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))
10440 PRINT "(x,y) calculadas del punto";I;"","X calculada =";XC(I),"Y calculada =";YC(I)
10450 NEXT I
10460 FOR I=1 TO N
10470 FX(I)=S(I)-XC(I)
10480 FY(I)=H(I)-YC(I)
10490 PRINT "Diferencia en el punto numero";I;"","Xobs -Xcalc =";FX(I),"Yobs -Ycalc =";FY(I)
10500 NEXT I
10510 DIM B11(N),B12(N),B13(N),B14(N),B15(N),B16(N)
10520 FOR I=1 TO N
10530 B11(I)=(1/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(P*m11-m31*S(I))
10540 B12(I)=(1/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(P*m12-m32*S(I))
10550 B13(I)=(1/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(P*m13-m33*S(I))
10560 B14(I)=(-S(I)/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(m21*(X(I)-Xo)+m22*(Y(I)-Yo)+m23*(Z(I)-Yo))
10570 B15(I)=-1*(P/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))*(m13*(((X(I)-Xo)*COSC)+((Y(I)-Yo)*SINC))-(COSF*(Z(I)-Zo)))+((S(I)/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(m33*((X(I)-Xo)*COSC)+((Y(I)-Yo)*SINC))-(SINF*COSO*(Z(I)-Zo))))
10580 B16(I)=(-P/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(m11*(Y(I)-Yo)-m12*(X(I)-Xo))+(S(I)/m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))*(m31*(Y(I)-Yo)-m32*(X(I)-Xo))
10590 PRINT "-B11( punto";I;")";B11(I)
10600 PRINT "-B12( punto";I;")";B12(I)
10610 PRINT "-B13( punto";I;")";B13(I)
10620 PRINT " B14( punto";I;")";B14(I)
10630 PRINT " B15( punto";I;")";B15(I)
10640 PRINT " B16( punto";I;")";B16(I)
10650 NEXT I
10660 DIM B21(N),B22(N),B23(N),B24(N),B25(N),B26(N)
10670 FOR I=1 TO N
10680 B21(I)=(1/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(P*m21-m31*H(I))
10690 B22(I)=(1/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(P*m22-m32*H(I))
10700 B13(I)=(1/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(P*m23-m33*H(I))
10710 B24(I)=(-P/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))-(H(I)/m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))*(m21*(X(I)-Xo)+m22*(Y(I)-Yo)+m23*(Z(I)-Zo))
10720 B25(I)=-1*(P/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))*(m23*(((X(I)-Xo)*COSC)+((Y(I)-Yo)*SINC))-(SINF*SINO*(Z(I)-Zo)))+((H(I)/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(m33*((X(I)-Xo)*COSC)+((Y(I)-Yo)*SINC))-(SINF*COSO*(Z(I)-Zo))))
10730 B26(I)=(-P/(m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo)))*(m21*(Y(I)-Yo)-m22*(X(I)-Xo))+(H(I)/m31*(X(I)-Xo)+m32*(Y(I)-Yo)+m33*(Z(I)-Zo))*(m31*(Y(I)-Yo)-m32*(X(I)-Xo))
10740 PRINT "-B21( punto";I;")";B21(I)
10750 PRINT "-B22( punto";I;")";B22(I)
10755 NEXT J:NEXT I
10760 PRINT "-B23( punto";I;")";B23(I)
10770 PRINT " B24( punto";I;")";B24(I)
10780 PRINT " B25( punto";I;")";B25(I)
10790 PRINT " B26( punto";I;")";B26(I)
10800 NEXT I
11660 DIM B(I,J)
11670 FOR I=1 TO 2*N:FOR J=1 TO 6
11675 FOR I=1 TO N:FOR J=1 TO 6
11680 B(I,J)=B1J(I)
11690 NEXT J:NEXT I
11740 FOR I=N+1 TO 2*N:FOR J=1 TO N
11750 D(I,J)=B21(J)
11755 NEXT J:NEXT I
11760 PRINT "b(";I;",";J;")=":NEXT J:NEXT I
