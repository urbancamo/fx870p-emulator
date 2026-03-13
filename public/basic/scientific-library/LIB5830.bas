5 GOTO 10010
10 DATA,x+C,10,20
20 DATA x�,x���/(n+1)+C           (n+1�0),10,30
30 DATA 1/x,log�x�+C,20,40
40 DATA 1/(x�a),log�x�a�+C,30,50
50 DATA e�,e�+C,40,60
60 DATA e��,e��/n+C,50,70
70 DATA a�,"a�/loga+C            (a>0,a�1)",60,80
80 DATA a��,"a��/(n�loga)+C       (a>0,a�1)",70,90
90 DATA logx,x(logx-1)+C,80,100
100 DATA xe��,e��/n��(nx-1)+C,90,110
110 DATA sinx,-cosx+C,100,120
120 DATA sinax,-1/a�cosax+C,110,130
130 DATA cosx,sinx+C,120,140
140 DATA cosax,1/a�sinax+C,130,150
150 DATA tanx,-log�cosx�+C,140,160
160 DATA cotx,log�sinx�+C,150,170
170 DATA sin�x,x/2-sin2x/4+C,160,180
180 DATA cos�x,x/2+sin2x/4+C,170,190
190 DATA sec�ax,1/a�tanax+C,180,200
200 DATA cosec�ax,-1/a�cotax+C,190,210
210 DATA 1/sinx,log(tan(x/2))+C,200,220
220 DATA 1/cosx,log(tan((�/4)+(x/2)))+C,210,230
230 DATA e��sinbx,e��(n�sinbx-b�cosbx)/(n�+b�)+C,220,240
240 DATA e��cosbx,e��(n�cosbx+b�sinbx)/(n�+b�)+C,230,250
250 DATA sin�x,xsin�x+�(1-x�)+C,240,260
260 DATA cos�x,xcos�x-�(1-x�)+C,250,270
270 DATA sinhx,coshx+C,260,280
280 DATA coshx,sinhx+C,270,290
290 DATA tanhx,log(coshx)+C,280,300
300 DATA 1/�(a�-x�),sin�(x/a)+C            (�x�<a),290,310
310 DATA 1/(a�+x�),1/a�tan�(x/a)+C,300,320
320 DATA 1/�(x��a�),log(x+�(x��a�))+C,310,330
330 DATA�(a�-x�),1/2�(x�(a�-x�)+a�sin�(x/a))+C,320,340
340 DATA 1/(x�-a�),1/2a�log((x-a)/(x+a))+C  (x>a),330,340
10010 MODE 8:DIM:x=10:y=340:r=x
10020 DEF CHR$(255)="0000FF0000"
10110 RESTORE(r)
10120 READ m$,n$,b,c:IF m$="" THEN m$=CHR$(8)
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT CHR$(129);" ";m$;" dx";TAB(l);l$;"=";n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
