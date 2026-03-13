5 ON ERROR GOTO 1000
10 MODE 8:DIM:ERASE a,a$:DIM a(5),a$(1):a$(1)="Input":a$(0)="Delete":c$=CHR$(5):sf=0
20 CLS:PRINT "Input data (";s$;")";TAB(0);">Input,Delete,Clear,List,End ?";
30 a=ASC(INPUT$(1)):IF a>96 THEN a=a-32
40 ON a-66 GOTO 300,100,200,,,,100,,,500
50 GOTO 30
100 CLS:PRINT a$(SGN(a-68));" data (";s$;")";TAB(21);"[EXE]:menu";:z=SGN(a-69)
110 LOCATE 0,1:PRINT c$;s$;"?";
120 LOCATE LEN(s$)+1,1:INPUT @12;z$:LOCATE 0,0:IF z$="" THEN 20 ELSE y=VALF(z$)
150 r=sz+z:s=sc+y*z:u=se+y*y*z
160 sz=r:sc=s:se=u:GOTO 110
200 c=6
210 sh=sc/sz
220 sn=se-sh*sc:IF sn<0 THEN sn=0
250 sj=SQR(sn/sz)
260 sl=SQR(sn/(sz-1))
280 RETURN
300 PRINT c$;"clear data  (Y/N) ?";
310 a$=INPUT$(1,@):IF a$<>"Y" AND a$<>"y" THEN 20
320 sz=0:sc=0:se=0:GOTO 20
500 CLS:GOSUB 200:GOSUB 580:i=1:GOSUB 600:i=2
510 GOSUB 600
520 z=ASC(INPUT$(1,@)):IF z=28 OR z=29 THEN 20
530 IF z<>13 AND z<>30 AND z<>31 THEN 520
540 IF(z=30 AND i=1) OR(z=31 AND i=c) THEN 520
550 IF z=30 THEN i=i-2
560 i=i+1:IF i=<c THEN 510 ELSE 20
580 DEF CHR$(255)="0808003E00"
590 a(0)=sz:a(1)=sc:a(2)=se:a(3)=sh:a(4)=sj:a(5)=sl:RETURN
600 RESTORE(600+i*10):READ a$,b$:PRINT TAB(0);a$;TAB(7);":";b$;TAB(13);"=";a(i-1);:RETURN
610 DATA CNT,n
620 DATA SUMX,�x
630 DATA SUMX2,�x�
640 DATA MEANX,�x/n
650 DATA SDXN,x�n
660 DATA SDX,x�n�
1000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
1010 IF ERL=120 THEN RESUME 120
1050 IF ERL=210 THEN c=3:RESUME 280
1060 IF ERL=260 THEN c=5:RESUME 280
1080 IF ERL=150 THEN LOCATE 0,1:PRINT c$;"data over";:z$=INPUT$(1,@):RESUME 20
1090 LOCATE 0,1:PRINT c$;"not found";:a$=INPUT$(1,@):RESUME 20
