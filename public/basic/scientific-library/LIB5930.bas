5 GOTO 10010
10 DATA Uniformly accelerated motion,"v=v�+at , a=�v/�t , s=v�t+at�/2",10,20,
20 DATA Newton's equation of motion,F=ma,10,30,
30 DATA Circular motion,T=2�r/v=2�/�=1/f,20,40,
40 DATA Circular motion,"�=2�/T=2�f=v/r , F=mr��=mv�/r",30,50,
50 DATA Simple harmonic oscillation,"x=r�sin�t , v=r��cos�t , a=-��x",40,60,
60 DATA Hooke's law,F=-kx,50,70,
70 DATA Spring,"a=F/m=-k/m�x , T=2�(m/k)",60,80,
80 DATA Simple pendulum,"a=F/m=-g/l�x , T=2�(l/g)",70,90,
90 DATA Potential energy,Ep=mgh,80,100,
100 DATA Elastic energy   (spring),Ee=1/2�kx�,90,110,
110 DATA Kinetic energy,Ek=1/2�mv�,100,120,
120 DATA Coefficient of friction,F=�N,110,130,
130 DATA Work,W=Fs,120,140,
140 DATA Kepler's law (3'rd),T�/r�=Constant,130,150,
150 DATA Universal gravitation,"F=G�Mm/r� , G=6.7*10��[N�m�/kg�]",140,160,
160 DATA Potential energy   (planet),Up=-G�Mm/r ,150,170,
170 DATA Kinetic energy   (planet),Ek=1/2�mr���,160,180,
180 DATA Moment of inertia,"I=mr� , E=1/2�I��",170,190,
190 DATA Angular momentum,J=I�,180,200,
200 DATA Conservation of momentum,mv�+MV�=mv�+MV�,190,200,
10010 MODE 8:DIM:x=10:y=200:r=x
10020 DEF CHR$(255)="202048F808"
10030 DEF CHR$(254)="3E020C223E"
10040 DEF CHR$(253)="2E2A3A0000"
10050 DEF CHR$(252)="123E020000"
10110 RESTORE(r)
10120 CLS:READ m$,n$,b,c,d
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 PRINT m$;TAB(l);l$;n$;:LOCATE 0,0:LOCATE 1,1
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
