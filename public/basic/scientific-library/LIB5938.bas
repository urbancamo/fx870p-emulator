5 GOTO 10010
10 DATA Absolute temperature,T[K]=t[ﬂC]+273.15,10,20,
20 DATA Heat capacity,Q=CT=mcT,10,30,
30 DATA Mechanical equivalent of heat,"W=JQ , J=4.19 [J/cal]",20,40,
40 DATA Boyle's law,PV=Constant  (T=constant),30,50,
50 DATA Volume & Temperature,V=V˚(1+T/273),40,60,
60 DATA Charle's law,V/V˚=T/T˚,50,70,
70 DATA Equation of state,"PV=nRT , R=8.31 [J/K]",60,80,
80 DATA Law of partial pressures,P=P¸+P˝+P˛+•••,70,90,1,2A2A3E0000
90 DATA Pressure,P=1/3•nm˛í,80,100,1,B08C828CB0
100 DATA Internal energy,U=1/2•m˛íN=3/2•nRT,90,110,1,B08C828CB0
110 DATA Specific heat,"Cv=ÓU/ÓT=3R/2 , Cp=ÓU/ÓT+R=5R/2",100,120,
120 DATA Half life,N=N˚(1/2)˛ù    (x=1/T),110,130,1,40F8480000
130 DATA Mass-energy relation ,E=mcí,120,130,
10010 MODE 8:DIM:x=10:y=130:r=x
10040 DEF CHR$(253)="2E2A3A0000"
10050 DEF CHR$(252)="123E020000"
10110 RESTORE(r)
10120 CLS:READ m$,n$,b,c,d:IF d=1 THEN READ d$:DEF CHR$(254)=d$
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 PRINT m$;TAB(l);l$;n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
