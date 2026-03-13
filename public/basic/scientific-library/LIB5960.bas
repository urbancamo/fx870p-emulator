5 GOTO 10010
10 DATA x[m’],0.01x[a],X[a]=0.01*x[m’],10,20
20 DATA x[m’],0.000247105x[acre],X[acre]=2.47105E-4*x[m’],10,30
30 DATA x[m’],0.000000386102x[mile’],X[mile’]=3.86102E-7*x[m’],20,40
40 DATA x[a],100x[m’],X[m’]=100*x[a],30,50
50 DATA x[a],0.0247105x[acre],X[acre]=0.0247105*x[a],40,60
60 DATA x[a],0.0000386102x[mile’],X[mile’]=3.86102E-5*x[a],50,70
70 DATA x[acre],4046.86x[m’],X[m’]=4046.86*x[acre],60,80
80 DATA x[acre],40.4686x[a],X[a]=40.4686*x[acre],70,90
90 DATA x[acre],0.0015625x[mile’],X[mile’]=.0015625*x[acre],80,100
100 DATA x[mile’],2589990x[m’],X[m’]=2589990*x[mile’],90,110
110 DATA x[mile’],25899.9x[a],X[a]=25899.9*x[mile’],100,120
120 DATA x[mile’],640x[acre],X[acre]=640*x[mile’],110,120
10010 MODE 8:DIM:x=10:y=120:r=x
10050 p$="Metric conversion (area)"
10110 RESTORE(r)
10120 READ m$,n$,s$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT p$;TAB(l);l$;m$;" -æ ";n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF z=31 AND r<>c THEN r=c:GOTO 10110
10210 IF z=13 THEN CALC$=s$:CALCJMP
10280 GOTO 10150
