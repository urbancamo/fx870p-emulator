5 GOTO 10010
10 DATA Wave,"v=�/T=f� , y=a�sin2�(t/T-x/�)",10,20,
20 DATA Wave of string,v=�(F/�),10,30,1,3E40484830
30 DATA Interference,"l�-l�=(2n+1)�/2 , l�-l�=n�",20,40,
40 DATA Stationary wave,"l=n�/2 , l=(2n-1)�/4   (n�0)",30,50,
50 DATA Refraction,n=sin�/sin�=v�/v�=��/��,40,60,
60 DATA Natural frequency (wave),f=(1/2l)��(T/�),50,70,1,3E40484830
70 DATA Velocity of sound,v=331.5+0.61T,60,80,
80 DATA Doppler effect,f=f��(v-v�)/(v-v�),70,90,
90 DATA Beat,f=f�-f�    (f�>f�),80,100,
100 DATA Reflectivity,R�=((n�-n�)/(n�+n�))�,90,110,
110 DATA Critical angle,sin�=n�/n�,100,120,
120 DATA de Broglie wave,�=h/mv,110,130,
130 DATA Quantum condition,2�r=nh/mv=n�,120,140,
140 DATA Photoelectron,1/2�mv�=h�-W,130,150,1,3E02040830
150 DATA Frequency condition,h�=Em-En    (m>n),140,160,
160 DATA Light wave,"�=c/� , c=2.998*10� [m/s]",150,160,1,3E02040830
10010 MODE 8:DIM:x=10:y=160:r=x
10020 DEF CHR$(255)="424C300806"
10030 DEF CHR$(253)="2E2A3A0000"
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
