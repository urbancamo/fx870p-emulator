5 GOTO 10010
10 DATA x[cm�],0.000001x[m�],X[m�]=1e-6*x[cm�],10,20
20 DATA x[cm�],0.0610237x[in�],X[in�]=.0610237*x[cm�],10,30
30 DATA x[cm�],0.0000353147x[ft�],X[ft�]=3.53147E-5*x[cm�],20,40
40 DATA x[cm�],0.001x[l],X[l]=.001*x[cm�],30,50
50 DATA x[cm�],0.000264172x[gal(US)],X[gal(US)]=2.64172E-4*x[cm�],40,60
60 DATA x[cm�],0.000219968x[gal(UK)],X[gal(UK)]=2.19968E-4*x[cm�],50,70
70 DATA x[m�],1000000x[cm�],X[cm�]=1E6*x[m�],60,80
80 DATA x[m�],61023.7x[in�],X[in�]=61023.7*x[m�],70,90
90 DATA x[m�],35.3147x[ft�],X[ft�]=35.3147*x[m�],80,100
100 DATA x[m�],1000x[l],x[l]=1E3*x[m�],90,110
110 DATA x[m�],264.172x[gal(US)],X[gal(US)]=264.172*x[m�],100,120
120 DATA x[m�],219.968x[gal(UK)],X[gal(UK)]=219.968*x[m�],110,130
130 DATA x[in�],16.3871x[cm�],X[cm�]=16.3871*x[in�],120,140
140 DATA x[in�],0.0000163871x[m�],X[m�]=1.63871E-5*x[in�],130,150
150 DATA x[in�],0.000578704x[ft�],X[ft�]=.000578704*x[in�],140,160
160 DATA x[in�],0.0163871x[l],X[l]=.0163871*x[in�],150,170
170 DATA x[in�],0.00432900x[gal(US)],X[gal(US)]=.004329*x[in�],160,180
180 DATA x[in�],0.00360464x[gal(UK)],X[gal(UK)]=.00360464*x[in�],170,190
190 DATA x[ft�],28316.8x[cm�],X[cm�]=28316.8*x[ft�],180,200
200 DATA x[ft�],0.0283168x[m�],X[m�]=.0283168*x[ft�],190,210
210 DATA x[ft�],1728x[in�],X[in�]=1728*x[ft�],200,220
220 DATA x[ft�],28.3168x[l],X[l]=28.3168*x[ft�],210,230
230 DATA x[ft�],7.48052x[gal(US)],X[gal(US)]=7.48052*x[ft�],220,240
240 DATA x[ft�],6.22882x[gal(UK)],X[gal(UK)]=6.22882*x[ft�],230,250
250 DATA x[l],1000x[cm�],X[cm�]=1E3*x[l],240,260
260 DATA x[l],0.001x[m�],X[m�]=.001*x[l],250,270
270 DATA x[l],61.0237x[in�],X[in�]=61.0237*x[l],260,280
280 DATA x[l],0.0353147x[ft�],X[ft�]=.0353147*x[l],270,290
290 DATA x[l],0.264172x[gal(US)],X[gal(US)]=.264172*x[l],280,300
300 DATA x[l],0.219968x[gal(UK)],X[gal(UK)]=.219968*x[l],290,300
310 DATA x[gal(US)],3785.41x[cm�],X[cm�]=3785.41*x[gal(US)],300,320
320 DATA x[gal(US)],0.00378541x[m�],X[m�]=.00378541*x[gal(US)],310,330
330 DATA x[gal(US)],231x[in�],X[in�]=231*x[gal(US)],320,340
340 DATA x[gal(US)],0.133681x[ft�],X[ft�]=.133681*x[gal(US)],330,350
350 DATA x[gal(US)],3.78541x[l],X[l]=3.78541*x[gal(US)],340,360
360 DATA x[gal(US)],0.832672x[gal(UK)],X[gal(UK)]=0.832672*x[gal(US)],350,370
370 DATA x[gal(UK)],4546.09x[cm�],X[cm�]=4546.09*x[gal(UK)],360,380
380 DATA x[gal(UK)],0.00454609x[m�],X[m�]=.00454609*x[gal(UK)],370,390
390 DATA x[gal(UK)],277.42x[in�],X[in�]=277.42*x[gal(UK)],380,400
400 DATA x[gal(UK)],0.160544x[ft�],X[ft�]=.160544*x[gal(UK)],390,410
410 DATA x[gal(UK)],4.54609x[l],X[l]=4.54609*x[gal(UK)],400,420
420 DATA x[gal(UK)],1.20095x[gal(US)],X[gal(US)]=1.20095*x[gal(UK)],410,420
10010 MODE 8:DIM:x=10:y=300:r=x
10050 p$="Metric conversion (volume)"
10110 RESTORE(r)
10120 READ m$,n$,s$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT p$;TAB(l);l$;m$;" -� ";n$;:LOCATE 0,0:LOCATE 0,1
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF z=31 AND r<>c THEN r=c:GOTO 10110
10210 IF z=13 THEN CALC$=s$:CALCJMP
10280 GOTO 10150
