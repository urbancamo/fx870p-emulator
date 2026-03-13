5 GOTO 10010
10 DATA a�-b�,(a+b)(a-b),10,20
20 DATA a��b�,(a�b)(a��ab+b�),10,30
30 DATA a�-b�,(a-b)(a+b)(a�+b�),20,40
40 DATA a�+b�,(a�+��ab+b�)(a�-��ab+b�),30,50
50 DATA a��2ab+b�,(a�b)�,40,60
60 DATA a��3a�b+3ab��b�,(a�b)�,50,70
70 DATA(a�b)��4ab,(a�b)�,60,80
80 DATA a�+b�+c�+2bc+2ca+2ab,(a+b+c)�,70,90
90 DATA a�+a�b�+b�,(a�+ab+b�)(a�-ab+b�),80,100
100 DATA a�+b�+c�-3abc,(a+b+c)(a�+b�+c�-bc-ca-ab),90,110
110 DATA(ac-bd)�+(ad+bc)�,(a�+b�)(c�+d�),100,120
120 DATA(ac+bd)�+(ad-bc)�,(a�+b�)(c�+d�),110,130
130 DATA(ac+bd)�-(ad+bc)�,(a�-b�)(c�-d�),120,140
140 DATA(ac-bd)�-(ad-bc)�,(a�-b�)(c�-d�),130,150
150 DATA a�(b-c)+b�(c-a)+c�(a-b),-(b-c)(c-a)(a-b),140,160
160 DATA(b-c)�+(c-a)�+(a-b)�,3(b-c)(c-a)(a-b),150,170
170 DATA a�+b�+c�-2b�c�-2c�a�-2a�b�,(a+b+c)(b-c-a)(c-a-b)(a-b-c),160,180
180 DATA x�+(a+b)x+ab,(x+a)(x+b),170,190
190 DATA x�+(a+b+c)x�+(bc+ca+ab)x+abc,(x+a)(x+b)(x+c),180,200
200 DATA a�-b�-c�-2bc,(a+b+c)(a-b-c),190,210
210 DATA(a+b+c)(bc+ca+ab)-abc,(b+c)(c+a)(a+b),200,220
220 DATA(a+b+c)�-(a�+b�+c�),3(b+c)(c+a)(a+b),210,230
230 DATA a�(b-c)+b�(c-a)+c�(a-b),-(b-c)(c-a)(a-b)(a+b+c),220,230
10010 MODE 8:DIM:x=10:y=230:r=x
10020 DEF CHR$(255)="A6AAAA9280"
10110 RESTORE(r)
10120 READ m$,n$,b,c
10130 l$="["+MID$(STR$(r/10),2)+"]":l=32-LEN(l$)
10140 CLS:PRINT m$;;TAB(l);l$;"=";n$;
10150 z=ASC(INPUT$(1,@))
10170 IF z=29 AND r<>x THEN r=x:GOTO 10110
10180 IF z=28 AND r<>y THEN r=y:GOTO 10110
10190 IF z=30 AND r<>b THEN r=b:GOTO 10110
10200 IF(z=31 OR z=13) AND r<>c THEN r=c:GOTO 10110
10280 GOTO 10150
