5 GOTO 10010
10 DATA x[cm],0.01x[m],X[m]=0.01*x[cm],10,20
20 DATA x[cm],0.393701x[in],X[in]=.393701*x[cm],10,30
30 DATA x[cm],0.0328084x[ft],X[ft]=.0328084*x[cm],20,40
40 DATA x[cm],0.0109361x[yd],X[yd]=.0109361*x[cm],30,50
50 DATA x[cm],0.00000621371x[mile],X[mile]=6.21371E-6*x[cm],40,60
60 DATA x[m],100x[cm],X[cm]=100*x[m],50,70
70 DATA x[m],39.3701x[in],X[in]=39.3701*x[m],60,80
80 DATA x[m],3.28084x[ft],X[ft]=3.28084*x[m],70,90
90 DATA x[m],1.09361x[yd],X[yd]=1.09361*x[m],80,100
100 DATA x[m],0.000621371x[mile],X[mile]=.000621371*x[m],90,110
110 DATA x[in],2.54x[cm],X[cm]=2.54*x[in],100,120
120 DATA x[in],0.0254x[m],X[m]=.0254*x[in],110,130
130 DATA x[in],0.0833333x[ft],X[ft]=.0833333*x[in],120,140
140 DATA x[in],0.0277778x[yd],X[yd]=.0277778*x[in],130,150
150 DATA x[in],0.0000157828x[mile],X[mile]=1.57828E-5*x[in],140,160
160 DATA x[ft],30.48x[cm],X[cm]=30.48*x[ft],150,170
170 DATA x[ft],0.3048x[m],X[m]=.3048*x[ft],160,180
180 DATA x[ft],12x[in],X[in]=12*x[ft],170,190
190 DATA x[ft],0.333333x[yd],X[yd]=.333333*x[ft],180,200
200 DATA x[ft],0.000189394x[mile],X[mile]=1.89394E-4*x[ft],190,210
210 DATA x[yd],91.44x[cm],X[cm]=91.44*x[yd],200,220
220 DATA x[yd],0.9144x[m],X[m]=.9144*x[yd],210,230
230 DATA x[yd],36x[in],X[in]=36*x[yd],220,240
240 DATA x[yd],3x[ft],X[ft]=3*x[yd],230,250
250 DATA x[yd],0.000568182x[mile],X[mile]=5.68182E-4*x[yd],240,260
260 DATA x[mile],160934.4x[cm],X[cm]=160934.4*x[mile],250,270
270 DATA x[mile],1609.344x[m],X[m]=1609.344*x[mile],260,280
280 DATA x[mile],63360x[in],X[in]=63360*x[mile],270,290
290 DATA x[mile],5280x[ft],X[ft]=5280*x[mile],280,300
300 DATA x[mile],1760x[yd],X[yd]=1760*x[mile],290,300
10010 MODE 8:DIM:x=10:y=300:r=x
10050 p$="Metric conversion (length)"
10110 RESTORE(r)
10120 READ m$,n$,s$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT p$;TAB(l);l$;m$;" -� ";n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF z=31 AND r<>c THEN r=c:GOTO 10110
10210 IF z=13 THEN CALC$=s$:CALCJMP
10280 GOTO 10150
