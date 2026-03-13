5 GOTO 10010
10 DATA Ohm's law,"V=IR   (I=Q/t , R=ş¥l/S)",10,20,1,3E40484830
20 DATA Resistance,"R=Rü+Rı , 1/R=1/Rü+1/Rı",10,30,
30 DATA DC circuit,V=E-IR,20,40,
40 DATA DC power & Joule heat,"P=IV=I’R , W=IVt=Pt",30,50,
50 DATA Conductance,G=1/R=I/V,40,60,
60 DATA Kirchhoff's law,"„ùI=0 , „ùV=0",50,70,
70 DATA Wheatstone bridge,RûRü=RıRş,60,80,1,2A2A3E0000
80 DATA AC instantaneous value,"V=Vû¥sinÿt , I=Iû¥sinÿt",70,90,
90 DATA AC effective value,"I=Iû/‚2 , V=Vû/‚2",80,100,
100 DATA AC power,P=VI=VûIû/2,90,110,
110 DATA Power factor,P=VI¥cos,100,120,
120 DATA Transformer,"IüVü=IıVı , Nı/Nü=Vı/Vü",110,130,
130 DATA Reactance,"X=ÿL=2çfL , X=1/ÿC=1/2çfC",120,140,
140 DATA Impedance,"Z=‚(R’+(ÿL-1/ÿC)’) , Vû=ZIû",130,150,
150 DATA Natural frequency (circuit),fû=1/2ç‚(LC),140,160,
160 DATA Electric oscillation,1/2¥Q’/C+1/2¥LI’=Constant,150,160,
10010 MODE 8:DIM:x=10:y=160:r=x
10020 DEF CHR$(255)="3E020C223E"
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
