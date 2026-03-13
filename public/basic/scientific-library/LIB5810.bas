5 GOTO 10010
10 DATA sin��+cos��,1,10,20
20 DATA 1+tan��,sec��,10,30
30 DATA 1+cot��,cosec��,20,40
40 DATA sin(���),sin��cos��cos��sin�,30,50
50 DATA cos(���),cos��cos��sin��sin�,40,60
60 DATA tan(���),(tan��tan�)/(1�tan��tan�),50,70
70 DATA cot(���),(cot��cot��1)/(cot��cot�),60,80
80 DATA sin2�,2sin��cos�,70,90
90 DATA cos2�,cos��-sin��,80,100
100 DATA cos2�,1-2sin��,90,110
110 DATA cos2�,2cos��-1,100,120
120 DATA tan2�,2tan�/(1-tan��),110,130
130 DATA sin(�/2),��((1-cos�)/2),120,140
140 DATA cos(�/2),��((1+cos�)/2),130,150
150 DATA tan(�/2),��((1-cos�)/(1+cos�)),140,160
160 DATA tan(�/2),(1-cos�)/sin�,150,170
170 DATA tan(�/2),sin�/(1+cos�),160,180
180 DATA tan(�/2),cosec�-cot�,170,190
190 DATA cot(�/2),��((1+cos�)/(1-cos�)),180,200
200 DATA cot(�/2),sin�/(1-cos�),190,210
210 DATA cot(�/2),(1+cos�)/sin�,200,220
220 DATA cot(�/2),cosec�+cot�,210,230
230 DATA sin3�,3sin�-4sin��,220,240
240 DATA cos3�,4cos��-3cos�,230,250
250 DATA tan3�,(3tan�-tan��)/(1-3tan��),240,260
260 DATA 2sin��cos�,sin(�+�)+sin(�-�),250,270
270 DATA 2cos��sin�,sin(�+�)-sin(�-�),260,280
280 DATA 2cos��cos�,cos(�+�)+cos(�-�),270,290
290 DATA 2sin��sin�,-(cos(�+�)-cos(�-�)),280,300
300 DATA sin�+sin�,2sin((�+�)/2)�cos((�-�)/2),290,310
310 DATA sin�-sin�,2cos((�+�)/2)�sin((�-�)/2),300,320
320 DATA cos�+cos�,2cos((�+�)/2)�cos((�-�)/2),310,330
330 DATA cos�-cos�,-2sin((�+�)/2)�sin((�-�)/2),320,340
340 DATA tan(45��(�/2)),sec��tan�,330,350
350 DATA tan(45��(�/2)),(1�sin�)/cos�,340,360
360 DATA tan(45��(�/2)),cot(45��(�/2)),350,370
370 DATA tan(45�+�),(1+tan�)/(1-tan�),360,380
380 DATA cot(45�-�),(1+cot�)/(1-cot�),370,380
10010 MODE 8:DIM:x=10:y=380:r=x
10110 RESTORE(r)
10120 READ m$,n$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT m$;TAB(l);l$;"=";n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
