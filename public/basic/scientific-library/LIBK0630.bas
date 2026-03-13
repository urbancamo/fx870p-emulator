10 CLS:GOTO 10000
1000 DATA "Memory calculations             [MC],[MR],[M-],[M+]",,1000,5010
5010 DATA "Prime factors                   Base = a * b * c * •••",,1000,5020
5020 DATA "G.C.M. & L.C.M.",,5010,5040
5040 DATA "ax1+bx2+cx3+•••=y",,5020,5050
5050 DATA "axí+bx+c=0",,5040,5060
5060 DATA "axì+bxí+cx+d=0",,5050,5080
5080 DATA "Numerical solution  f(x)=0      Newton's method",,5060,5090
5090 DATA "Numerical solution  f(x)=0      Method of bisection",,5080,5100
5100 DATA "Matrix operations",,5090,5200
5200 DATA "Åf(x)dx  [a,b]                  Romberg's method",,5100,5220
5220 DATA "dy/dx=f(x,y(x))                 Runge-Kutta method",,5200,5230
5230 DATA "Lagrange's interpolation",,5220,5250
5250 DATA "Gamma function  ˇ(x)",82FE8280C0,5230,5260
5260 DATA "Bessel function  Jn(x)",,5250,5270
5270 DATA "Bessel function  Yn(x)",,5260,5280
5280 DATA "Modified Bessel function        In(x)",,5270,5290
5290 DATA "Modified Bessel function        Kn(x)",,5280,5300
5300 DATA "Complex number  a+bi",,5290,5350
5350 DATA "Binary-Decimal-Hexadecimal",,5300,5510
5510 DATA "y=ax+b ‰- (x1,y1),(x2,y2)",,5350,5520
5520 DATA "Angle(å) ‰- y=ax+b,y=cx+d",,5510,5530
5530 DATA "Distance ‰- y=ax+b,(x1,y1)",,5520,5540
5540 DATA "(X,Y) ‰- (x,y),angle(å)",,5530,5550
5550 DATA "Circle (x-a)í+(y-b)í=rí         ‰- (x1,y1),(x2,y2),(x3,y3)",,5540,5560
5560 DATA "Length(y=cx+d)                  ‰ (x-a)í+(y-b)í=rí,(x1,y1)",,5550,5570
5570 DATA "y=cx+d,y=ex+f                   ‰ (x-a)í+(y-b)í=rí,(x1,y1)",,5560,5600
5600 DATA "Area (triangle)",,5570,5605
5605 DATA "Area (trapezoid)",,5600,5610
5610 DATA "Area (parallelogram)",,5605,5615
5615 DATA "Area (circle)",,5610,5620
5620 DATA "Area (sector)",,5615,5625
5625 DATA "Area (segment)",,5620,5630
5630 DATA "Area (ellipse)",,5625,5635
5635 DATA "Area (polygon)",,5630,5650
5650 DATA "Surface (sphere)",,5635,5655
5655 DATA "Surface (zone of sphere)",,5650,5660
5660 DATA "Surface (spherical sector)",,5655,5665
5665 DATA "Surface (circular cylinder)",,5660,5670
5670 DATA "Surface (circular cone)",,5665,5675
5675 DATA "Surface                         (frustum of circular cone)",,5670,5700
5700 DATA "Volume (sphere)",,5675,5705
5705 DATA "Volume (zone of sphere)",,5700,5710
5710 DATA "Volume (spherical sector)",,5705,5715
5715 DATA "Volume (circular cylinder)",,5710,5720
5720 DATA "Volume (circular cone)",,5715,5725
5725 DATA "Volume                          (frustum of circular cone)",,5720,5730
5730 DATA "Volume (wedge)",,5725,5735
5735 DATA "Volume (pyramid)",,5730,5740
5740 DATA "Volume                          (frustum of pyramid)",,5735,5745
5745 DATA "Volume (ellipsoid)",,5740,5750
5750 DATA "Polygon  A,n -Ê r,R,l",,5745,5760
5760 DATA "Polyhedron (a,r,R,S,V)",,5750,5800
5800 DATA "Factorization                   aí+2ab+bí=(a+b)í",,5760,5810
5810 DATA "Trigonometric function          siníå+cosíå=1",,5800,5820
5820 DATA "Differential                    y=axí+bx+c Ê yÉ=2ax+b",,5810,5830
5830 DATA "Integration                     Å x dx = 1/2•xí+C",,5820,5840
5840 DATA "Laplace transformation          F(p)=1/p Ê f(t)=1",,5830,5900
5900 DATA "Periodic table                  H Hydrogen 1(1-1a) 1.00794",,5840,5910
5910 DATA "Scientific constant             g=9.80665 [m•sõí]",,5900,5920
5920 DATA "Electrolytic dissociation       HCOOH ‰Ê HCOOõ + Hö",,5910,5930
5930 DATA "Motion                          Ek=1/2•mví",,5920,5932
5932 DATA "Waves                           f=f˚•(v-v¸)/(v-v˝)",,5930,5934
5934 DATA "AC & DC circuits                R=R¸+R˝ , 1/R=1/R¸+1/R˝",,5932,5936
5936 DATA "Electric & Magnetic fields      Q=CV , C=ã˚•S/d",,5934,5938
5938 DATA "Thermodynamics and others       W=JQ , J=4.19 [J/cal]",,5936,5950
5950 DATA "Metric conversion (length)      1[cm] -Ê 0.01[m]",,5938,5960
5960 DATA "Metric conversion (area)        1[cmí] -Ê 0.0001[mí]",,5950,5970
5970 DATA "Metric conversion (volume)      1[cmì] -Ê 0.000001[mì]",,5960,5980
5980 DATA "Metric conversion (weight)      1[g] -Ê 0.001[kg]",,5970,6210
6210 DATA "Upper probability integrals     N(0,1í)",,5980,6220
6220 DATA "Upper probability integrals     Xí(xí,˛)",,6210,6230
6230 DATA "Upper probability integrals     t(x,˛)",,6220,6240
6240 DATA "Upper probability integrals     F(x,˛¸,˛˝)",,6230,6310
6310 DATA "Upper cumulative                frequencies     B(x,n,P)",,6240,6320
6320 DATA "Upper cumulative                frequencies     P(x,ˇ)",424C300806,6310,6330
6330 DATA "Upper cumulative                frequencies     H(x,n,M,N)",,6320,6410
6410 DATA "Percentage points               N(0,1í)",,6330,6420
6420 DATA "Percentage points               Xí(xí,˛)",,6410,6430
6430 DATA "Percentage points               t(x,˛)",,6420,6440
6440 DATA "Percentage points               F(x,˛¸,˛˝)",,6430,6450
6450 DATA "Normal random numbers",,6440,6460
6460 DATA "Exponential random numbers",,6450,6500
6500 DATA "Statistics [x]",,6460,6510
6510 DATA "Regression analysis             [y=a+bx]",,6500,6520
6520 DATA "Regression analysis             [y=a+blnx]",,6510,6530
6530 DATA "Regression analysis             [y=ab^x]",,6520,6540
6540 DATA "Regression analysis             [y=ax^b]",,6530,6610
6610 DATA "Estimation  a<ç<b               N(ç,éí) éí:known",,6540,6620
6620 DATA "Estimation  a<ç<b               N(ç,éí)",,6610,6630
6630 DATA "Estimation  a<éí<b              N(ç,éí)",,6620,6640
6640 DATA "Estimation  a<é<b               N(ç,éí)",,6630,6650
6650 DATA "Estimation  a<é˝í/é¸í<b         N(ç¸,é¸í),N(ç˝,é˝í)",,6640,6660
6660 DATA "Estimation  a<ç¸-ç˝<b           N(ç¸,éí),N(ç˝,éí)",,6650,6670
6670 DATA "Estimation  a<p<b               B(1,p)",,6660,6680
6680 DATA "Estimation  a<p¸-p˝<b           B(1,p¸),B(1,p˝)",,6670,6710
6710 DATA "Test N(ç,éí) éí:known                H˚:ç=ç˚    H¸:ç‚ç˚",,6680,6711
6711 DATA "Test N(ç,éí) éí:known                H˚:ç=ç˚    H¸:ç>ç˚",,6710,6712
6712 DATA "Test N(ç,éí) éí:known                H˚:ç=ç˚    H¸:ç<ç˚",,6711,6720
6720 DATA "Test N(ç,éí)                         H˚:ç=ç˚    H¸:ç‚ç˚",,6712,6721
6721 DATA "Test N(ç,éí)                         H˚:ç=ç˚    H¸:ç>ç˚",,6720,6722
6722 DATA "Test N(ç,éí)                         H˚:ç=ç˚    H¸:ç<ç˚",,6721,6730
6730 DATA "Test N(ç,éí)                         H˚:éí=é˚í  H¸:éí‚é˚í",,6722,6731
6731 DATA "Test N(ç,éí)                         H˚:éí=é˚í  H¸:éí>é˚í",,6730,6732
6732 DATA "Test N(ç,éí)                         H˚:éí=é˚í  H¸:éí<é˚í",,6731,6740
6740 DATA "Test N(ç¸,é¸í),N(ç˝,é˝í)             H˚:é¸í=é˝í H¸:é¸í‚é˝í",,6732,6741
6741 DATA "Test N(ç¸,é¸í),N(ç˝,é˝í)             H˚:é¸í=é˝í H¸:é¸í>é˝í",,6740,6742
6742 DATA "Test N(ç¸,é¸í),N(ç˝,é˝í)             H˚:é¸í=é˝í H¸:é¸í<é˝í",,6741,6750
6750 DATA "Test N(ç¸,éí),N(ç˝,éí)               H˚:ç¸=ç˝   H¸:ç¸‚ç˝",,6742,6751
6751 DATA "Test N(ç¸,éí),N(ç˝,éí)               H˚:ç¸=ç˝   H¸:ç¸>ç˝",,6750,6752
6752 DATA "Test N(ç¸,éí),N(ç˝,éí)               H˚:ç¸=ç˝   H¸:ç¸<ç˝",,6751,6760
6760 DATA "Test B(1,p)                          H˚:p=p˚    H¸:p‚p˚",,6752,6761
6761 DATA "Test B(1,p)                          H˚:p=p˚    H¸:p>p˚",,6760,6762
6762 DATA "Test B(1,p)                          H˚:p=p˚    H¸:p<p˚",,6761,6770
6770 DATA "Test B(1,p¸),B(1,p˝)                 H˚:p¸=p˝   H¸:p¸‚p˝",,6762,6771
6771 DATA "Test B(1,p¸),B(1,p˝)                 H˚:p¸=p˝   H¸:p¸>p˝",,6770,6772
6772 DATA "Test B(1,p¸),B(1,p˝)                 H˚:p¸=p˝   H¸:p¸<p˝",,6771,6772
10000 ON ERROR GOTO 10400
10010 MODE 8:DIM:x=1000:y=6772
10020 DEFSEG=0:a=PEEK(&H743)*256+PEEK(&H742):r$=HEX$(PEEK(&H744))+"000":b=VAL("&H"+r$)
10030 DEFSEG=b:r$="":FOR i=a TO a+3:r$=r$+CHR$(PEEK(i+7)):NEXT:r=VAL(r$)
10060 DEF CHR$(254)="3E02040830"
10070 DEF CHR$(253)="2E2A3A0000"
10080 DEF CHR$(252)="123E020000"
10110 RESTORE(r)
10120 READ m$,n$,b,c
10130 IF n$<>"" THEN DEF CHR$(255)=n$
10140 CLS:PRINT MID$(STR$(r),2);":";m$;
10150 z=ASC(INPUT$(1,@))
10160 IF z=29 AND r<>x THEN a=&HF7EA:r=x:GOTO 10110
10170 IF z=28 AND r<>y THEN a=&HFEA7:r=y:GOTO 10110
10180 IF z=30 AND r<>b THEN a=a-15:r=b:GOTO 10110
10190 IF(z=31 OR z=218) AND r<>c THEN a=a+15:r=c:GOTO 10110
10200 IF z=13 OR z=252 THEN 10300
10210 GOTO 10150
10300 CLS:DEFSEG=0:a$=HEX$(a):b=VAL("&H"+LEFT$(a$,2)):c=VAL("&H"+RIGHT$(a$,2)):POKE &H742,c:POKE &H743,b:r$="LIB0:"+MID$(STR$(r),2):GOTO r$
10400 IF ERR=1 THEN ON ERROR GOTO 0
10410 r=x:RESUME 10110
