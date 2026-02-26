10 CLEAR:CLS:PRINT "COORDENADAS FOTO Y DERIVADAS"
20 INPUT "Distancia focal ...";f
30 INPUT "Coord. X del CDP ...";X0
40 INPUT "Coord. Y del CDP ...";Y0
50 INPUT "Coord. Z del CDP ...";Z0
60 INPUT "Giro W ...";W0:W0=W0/(50/ATN(1))
70 INPUT "Giro PHI ...";Fi0:Fi0=Fi0/(50/ATN(1))
80 INPUT "Giro KAPPA ...";K0:K0=K0/(50/ATN(1))
90 REM 'CALCULO'
100 INPUT "Coord. X del punto ...";X1
110 INPUT "Coord. Y del punto ...";Y1
120 INPUT "Coord. Z del punto ...";Z1
130 W=W0:Fi=Fi0:K=K0:GOSUB 1000
140 Xt0=Xt:Yt0=Yt:Zt0=Zt
150 Xf=-f*Xt/Zt
160 Yf=-f*Yt/Zt
170 PRINT "Coord. X en la foto ...";Xf
180 PRINT "Coord. Y en la foto ...";Yf
190 X0=X0-1:GOSUB 1000
200 PRINT "Derivada de X(foto) respecto X0=";Xf-(-f*Xt/Zt)
210 PRINT "Derivada de Y(foto) respecto X0=";Yf-(-f*Yt/Zt)
220 X0=X0+1:Y0=Y0-1:GOSUB 1000
230 PRINT "Derivada de X(foto) respecto Y0=";Xf-(-f*Xt/Zt)
240 PRINT "Derivada de Y(foto) respecto Y0=";Yf-(-f*Yt/Zt)
250 Y0=Y0+1:Z0=Z0-1:GOSUB 1000
260 PRINT "Derivada de X(foto) respecto Z0=";Xf-(-f*Xt/Zt)
270 PRINT "Derivada de Y(foto) respecto Z0=";Yf-(-f*Yt/Zt)
280 Z0=Z0+1:W=W0-(1/(50/ATN(1))):GOSUB 1000
290 PRINT "Derivada de X(foto) respecto W=";Xf-(-f*Xt/Zt)
300 PRINT "Derivada de Y(foto) respecto W=";Yf-(-f*Yt/Zt)
310 W=W0:Fi=Fi0-(1/(50/ATN(1))):GOSUB 1000
320 PRINT "Derivada de X(foto) respecto Fi=";Xf-(-f*Xt/Zt)
330 PRINT "Derivada de Y(foto) respecto Fi=";Yf-(-f*Yt/Zt)
340 Fi=Fi0:K=K0-(1/(50/ATN(1))):GOSUB 1000
350 PRINT "Derivada de X(foto) respecto K=";Xf-(-f*Xt/Zt)
360 PRINT "Derivada de Y(foto) respecto K=";Yf-(-f*Yt/Zt)
370 INPUT "Calculo de un nuevo punto (S/N)";A$
380 IF A$="S" THEN 90 ELSE IF A$<>"N" THEN 370
390 CLS:END
1000 REM 'SUBRUTINA'
1010 Xt = COS(K)*COS(Fi)*(X1-X0) + (-SIN(K)*COS(W)+COS(K)*SIN(Fi)*SIN(W))*(Y1-Y0) + (SIN(W)*SIN(K)+COS(W)*SIN(Fi)*COS(K))*(Z1-Z0)
1020 Yt = SIN(K)*COS(Fi)*(X1-X0) + (COS(K)*COS(W)+SIN(K)*SIN(Fi)*SIN(W))*(Y1-Y0) + (-SIN(W)*COS(K)+COS(W)*SIN(Fi)*SIN(K))*(Z1-Z0)
1030 Zt = -SIN(Fi)*(X1-X0) + (SIN(W)*COS(Fi))*(Y1-Y0) + (COS(W)*COS(Fi))*(Z1-Z0)
1040 RETURN
