10 MODE 8:DIM:GOSUB 900:c$=CHR$(5):DEF CHR$(252)="123E020000":DEF CHR$(253)="2E2A3A0000":t$="N(ü,Žü’),N(ý,Žý’) a<Žý’/Žü’<b"
20 CLS:PRINT t$;TAB(0);"input new data xü (Y/N) ?";:a$=INPUT$(1,@)
22 IF a$<>"Y" AND a$<>"y" THEN 30
25 s$="xü":GOSUB "LIB0:S6020":GOSUB 900
30 CLS:PRINT t$;TAB(0);"input new data xý (Y/N) ?";:a$=INPUT$(1,@)
32 IF a$<>"Y" AND a$<>"y" THEN 36
35 s$="xý":GOSUB "LIB0:S6030":GOSUB 900
36 s=sa:IF s>1 THEN r=sk^2 ELSE r=0
37 f=95:u=sz:IF u>1 THEN t=sl^2 ELSE t=0
45 CLS:PRINT t$;
50 z=s:s$="nü":GOSUB 500:s=z
60 z=r:s$="Vü":GOSUB 500:r=z
70 z=u:s$="ný":GOSUB 500:u=z
80 z=t:s$="Vý":GOSUB 500:t=z
90 CLS:PRINT "Confidence level (1-ˆ)[%]";
95 z=f:s$="1-ˆ":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT "N(ü,Žü’),N(ý,Žý’)   ";f;"%";TAB(0);".....";
100 n=s-1:m=u-1:p=(1-f/100)/2:sr=0:GOSUB "LIB0:S6440":GOSUB 900:IF sr THEN*
105 g=x:n=m:m=s-1:GOSUB "LIB0:S6440":GOSUB 900:IF sr THEN*
110 z=t/r/x:GOSUB 400:a=z
120 z=t/r*g:GOSUB 400:b=z
130 PRINT c$;a;"< Žý’/Žü’ <";b;:a$=INPUT$(1,@):GOTO 45
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 20
