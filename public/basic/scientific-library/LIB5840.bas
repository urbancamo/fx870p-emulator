5 GOTO 10010
10 DATA 1/p,1,10,20
20 DATA 1/p�,t,10,30
30 DATA 1/p�,"t��/(n-1)!        (n=1,2,3,���)",20,40
40 DATA 1/(p�m),e���,30,50
50 DATA 1/(p(p+m)),1/m�(1-e���),40,60
60 DATA 1/(p�(p+m)),1/m��(e���+mt-1),50,70
70 DATA a/(p�+a�),sinat,60,80
80 DATA p/(p�+a�),cosat,70,90
90 DATA 1/(p�+a�),1/a�sinat,80,100
100 DATA a/(p�-a�),sinhat,90,110
110 DATA p/(p�-a�),coshat,100,120
120 DATA 1/(p�-a�),1/a�sinhat,110,130
130 DATA 1/(p(p�+a�)),1/a��(1-cosat),120,140
140 DATA 1/(p�(p�+a�)),1/a��(at-sinat),130,150
150 DATA 1/((p+m)(p+n)),1/(n-m)�(e���-e���),140,160
160 DATA p/((p+m)(p+n)),1/(m-n)�(me���-ne���),150,170
170 DATA 1/(p+m)�,te���,160,180
180 DATA 1/(p+m)�,"1/(n-1)!�t��e���  (n=1,2,3,���)",170,190
190 DATA p/(p+m)�,e���(1-mt),180,200
200 DATA 1/(p(p+m)�),1/m��(1-(1+mt)e���),190,210
210 DATA 1/(p�(p+m)�),t/m�-2/m�+2/m��e���+t/m��e���,200,220
220 DATA(p+n)/(p+m)�,((n-m)t+1)e���,210,230
230 DATA 1/(p�+a�)�,1/2a��(sinat-at�cosat),220,240
240 DATA p/(p�+a�)�,t/2a�sinat,230,250
250 DATA p�/(p�+a�)�,1/2a�(sinat+at�cosat),240,260
260 DATA(p�-a�)/(p�+a�)�,t�cosat,250,270
270 DATA 1/((p+m)�+n�),1/n�e���sinnt,260,280
280 DATA(p+m)/((p+m)�+n�),e���cosnt,270,290
290 DATA 1/(p�-a�),1/2a��(sinhat-sinat),280,300
300 DATA p/(p�-a�),1/2a��(coshat-cosat),290,310
310 DATA p�/(p�-a�),1/2a�(sinhat+sinat),300,320
320 DATA p�/(p�-a�),1/2�(coshat+cosat),310,330
330 DATA p/(p�+4a�),1/2a��sinat�sinhat,320,340
340 DATA 4a�/(p�+4a�),sinat�coshat-cosat�sinhat,330,350
350 DATA 1/p�((p-m)/(p+m)),-1+2e���,340,360
360 DATA 1/p��((p-m)/(p+m)),2/m-t-2/m�e���,350,360
10010 MODE 8:DIM:x=10:y=360:r=x
10020 DEF CHR$(255)="7840384038"
10030 DEF CHR$(254)="40F8480000"
10040 DEF CHR$(253)="90B8900000"
10050 DEF CHR$(252)="7850502000"
10110 RESTORE(r)
10120 READ m$,n$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT "F(p)=";m$;TAB(l);l$;n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
