5 GOTO 10010
10 DATA x[g],0.001x[Kg],X[Kg]=.001*x[g],10,20
20 DATA x[g],0.0352740x[oz],X[oz]=.035274*x[g],10,30
30 DATA x[g],0.00220462x[lb],X[lb]=.00220462*x[g],20,40
40 DATA x[Kg],1000x[g],X[g]=1E3*x[Kg],30,50
50 DATA x[Kg],35.2740x[oz],X[oz]=35.274*x[Kg],40,60
60 DATA x[Kg],2.20462x[lb],X[lb]=2.20462*x[Kg],50,70
70 DATA x[oz],28.3495x[g],X[g]=28.3495*x[oz],60,80
80 DATA x[oz],0.0283495x[Kg],X[Kg]=.0283495*x[oz],70,90
90 DATA x[oz],0.0625x[lb],X[lb]=.0625*x[oz],80,100
100 DATA x[lb],453.59237x[g],X[g]=453.59237*x[lb],90,110
110 DATA x[lb],0.45359237x[Kg],X[Kg]=.45359237*x[lb],100,120
120 DATA x[lb],16x[oz],X[oz]=16*x[lb],110,120
10010 MODE 8:DIM:x=10:y=120:r=x
10050 p$="Metric conversion (weight)"
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
