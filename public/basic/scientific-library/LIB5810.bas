5 GOTO 10010
10 DATA sin’Œ+cos’Œ,1,10,20
20 DATA 1+tan’Œ,sec’Œ,10,30
30 DATA 1+cot’Œ,cosec’Œ,20,40
40 DATA sin(ˆù‰),sinˆ¥cos‰ùcosˆ¥sin‰,30,50
50 DATA cos(ˆù‰),cosˆ¥cos‰úsinˆ¥sin‰,40,60
60 DATA tan(ˆù‰),(tanˆùtan‰)/(1útanˆ¥tan‰),50,70
70 DATA cot(ˆù‰),(cotˆ¥cot‰ú1)/(cot‰ùcotˆ),60,80
80 DATA sin2Œ,2sinŒ¥cosŒ,70,90
90 DATA cos2Œ,cos’Œ-sin’Œ,80,100
100 DATA cos2Œ,1-2sin’Œ,90,110
110 DATA cos2Œ,2cos’Œ-1,100,120
120 DATA tan2Œ,2tanŒ/(1-tan’Œ),110,130
130 DATA sin(Œ/2),ù‚((1-cosŒ)/2),120,140
140 DATA cos(Œ/2),ù‚((1+cosŒ)/2),130,150
150 DATA tan(Œ/2),ù‚((1-cosŒ)/(1+cosŒ)),140,160
160 DATA tan(Œ/2),(1-cosŒ)/sinŒ,150,170
170 DATA tan(Œ/2),sinŒ/(1+cosŒ),160,180
180 DATA tan(Œ/2),cosecŒ-cotŒ,170,190
190 DATA cot(Œ/2),ù‚((1+cosŒ)/(1-cosŒ)),180,200
200 DATA cot(Œ/2),sinŒ/(1-cosŒ),190,210
210 DATA cot(Œ/2),(1+cosŒ)/sinŒ,200,220
220 DATA cot(Œ/2),cosecŒ+cotŒ,210,230
230 DATA sin3Œ,3sinŒ-4sin“Œ,220,240
240 DATA cos3Œ,4cos“Œ-3cosŒ,230,250
250 DATA tan3Œ,(3tanŒ-tan“Œ)/(1-3tan’Œ),240,260
260 DATA 2sinˆ¥cos‰,sin(ˆ+‰)+sin(ˆ-‰),250,270
270 DATA 2cosˆ¥sin‰,sin(ˆ+‰)-sin(ˆ-‰),260,280
280 DATA 2cosˆ¥cos‰,cos(ˆ+‰)+cos(ˆ-‰),270,290
290 DATA 2sinˆ¥sin‰,-(cos(ˆ+‰)-cos(ˆ-‰)),280,300
300 DATA sinˆ+sin‰,2sin((ˆ+‰)/2)¥cos((ˆ-‰)/2),290,310
310 DATA sinˆ-sin‰,2cos((ˆ+‰)/2)¥sin((ˆ-‰)/2),300,320
320 DATA cosˆ+cos‰,2cos((ˆ+‰)/2)¥cos((ˆ-‰)/2),310,330
330 DATA cosˆ-cos‰,-2sin((ˆ+‰)/2)¥sin((ˆ-‰)/2),320,340
340 DATA tan(45ßù(Œ/2)),secŒùtanŒ,330,350
350 DATA tan(45ßù(Œ/2)),(1ùsinŒ)/cosŒ,340,360
360 DATA tan(45ßù(Œ/2)),cot(45ßú(Œ/2)),350,370
370 DATA tan(45ß+Œ),(1+tanŒ)/(1-tanŒ),360,380
380 DATA cot(45ß-Œ),(1+cotŒ)/(1-cotŒ),370,380
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
