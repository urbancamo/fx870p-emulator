5 GOTO 10010
10 DATA Coulomb's law (electric f.),"F=kû¥QüQı/r’ , kû=9*10™[N¥m’/C’]",10,20,
20 DATA Electric field,"E=V/d , F=QE , W=QV",10,30,
30 DATA Capacitance,"Q=CV , C=‹û¥S/d",20,40,
40 DATA Capacitance,"C=Cü+Cı , 1/C=1/Cü+1/Cı",30,50,
50 DATA Dielectric constant,"D=‹ûE , C=‹Cû",40,60,
60 DATA Electrostatic energy,U=1/2¥QV=1/2¥CV’,50,70,
70 DATA Electrons in electric field,"a=QE/m , 1/2¥mv’=eV",60,80,
80 DATA Coulomb's law (magnetic f.),"F=kû¥mümı/r’ , kû=10—/(4ç)’",70,90,
90 DATA Magnetic field,"H=I/2çr , H=I/2r , H=nI",80,100,
100 DATA Magnetic field,F=ûIHl=IBl,90,110,
110 DATA Magnetic flux density,B=m/4çr’=ûH,100,120,
120 DATA Lorentz force,"F=QvB , r=mv/QB",110,130,
130 DATA Electrons in magnetic field,"1/2¥mv’=Q’B’r’/2m , ş=v/r=QB/m",120,140,
140 DATA Faraday's law of induction,V=-n¥î/ît,130,150,
150 DATA Electromagnetic induction,"V=El=vBl , I=vBl/R",140,160,
160 DATA Mutual induction,Vı=-M¥îIü/ît,150,170,
170 DATA Self-induction,Vƒ=-L¥îI/ît,160,170,
10010 MODE 8:DIM:x=10:y=170:r=x
10020 DEF CHR$(254)="3E020C223E"
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
