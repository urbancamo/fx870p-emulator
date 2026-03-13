5 GOTO 10010
10 DATA C,0,10,20
20 DATA xú,nxúû,10,30
30 DATA x,1,20,40
40 DATA 1/x,-1/xí,30,50
50 DATAÇˇ,1/(2Çˇ),40,60
60 DATA aù,aùloga,50,70
70 DATA eù,eù,60,80
80 DATA eúù,neúù,70,90
90 DATA logx,1/x,80,100
100 DATA xù,xù(logx+1),90,110
110 DATA sinx,cosx,100,120
120 DATA cosx,-sinx,110,130
130 DATA tanx,secíx,120,140
140 DATA cotx,-cosecíx,130,150
150 DATA secx,secx•tanx,140,160
160 DATA cosecx,-cosecx•cotx,150,170
170 DATA sinax,a•cosax,160,180
180 DATA cosax,-a•sinax,170,190
190 DATA tanax,a•secíax,180,200
200 DATA cotax,-a•cosecíax,190,210
210 DATA sinûx,1/Ç(1-xí)          (˛y˛<Á/2),200,220
220 DATA cosûx,-1/Ç(1-xí)           (0<y<Á),210,230
230 DATA tanûx,1/(1+xí)           (˛y˛<Á/2),220,240
240 DATA cotûx,-1/(1+xí)          (˛y˛<Á/2),230,250
250 DATA secûx,"1/(xÇ(xí-1))    (0<y<Á,xí>1)",240,260
260 DATA cosecûx,"1/(xÇ(xí-1))  (˛y˛<Á/2,xí>1)",250,270
270 DATA sinhx,coshx,260,280
280 DATA coshx,sinhx,270,290
290 DATA tanhx,sechíx,280,300
300 DATA cothx,-cosechíx,290,310
310 DATA sechx,-sechx•tanhx,300,320
320 DATA cosechx,-cosechx•cothx,310,330
330 DATA sinhûx,1/Ç(1+xí),320,340
340 DATA coshûx,"1/Ç(xí-1)         (y>0,xí>1)",330,350
350 DATA tanhûx,1/(1-xí)              (xí<1),340,360
360 DATA cothûx,1/(1-xí)              (xí>1),350,370
370 DATA sechûx,-1/(xÇ(1-xí))        (0<x<1),360,380
380 DATA cosechûx,-1/(xÇ(xí+1)),370,380
10010 MODE 8:DIM:x=10:y=380:r=x
10020 DEF CHR$(255)="A2A49C92A2"
10030 DEF CHR$(254)="0000FE0000"
10110 RESTORE(r)
10120 READ m$,n$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT "y =";m$;TAB(l);l$;"y";CHR$(131);"=";n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
