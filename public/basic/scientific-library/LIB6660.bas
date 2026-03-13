10 MODE 8:DIM:GOSUB 900:c$=CHR$(5):DEF CHR$(252)="123E020000":DEF CHR$(253)="2E2A3A0000":DEF CHR$(254)="A2A49C92A2":t$="N(ü,Ž’),N(ý,Ž’) a<ü-ý<b"
20 CLS:PRINT t$;TAB(0);"input new data xü (Y/N) ?";:a$=INPUT$(1,@)
22 IF a$<>"Y" AND a$<>"y" THEN 30
25 s$="xü":GOSUB "LIB0:S6020":GOSUB 900
30 CLS:PRINT t$;TAB(0);"input new data xý (Y/N) ?";:a$=INPUT$(1,@)
32 IF a$<>"Y" AND a$<>"y" THEN 36
35 s$="xý":GOSUB "LIB0:S6030":GOSUB 900
36 r=sa:IF r>1 THEN s=sg:t=sm ELSE s=0:t=0
37 f=95:u=sz:IF u>1 THEN v=sh:w=sn ELSE v=0:w=0
45 CLS:PRINT t$;
50 z=r:s$="nü":GOSUB 500:r=z
55 z=s:s$="þü":GOSUB 500:s=z
60 z=t:s$="Sü":GOSUB 500:t=z
70 z=u:s$="ný":GOSUB 500:u=z
75 z=v:s$="þý":GOSUB 500:v=z
80 z=w:s$="Sý":GOSUB 500:w=z
90 CLS:PRINT "Confidence level (1-ˆ)[%]";
95 z=f:s$="1-ˆ":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT "N(ü,Ž’),N(ý,Ž’)   ";f;"%";TAB(0);".....";
100 n=r+u-2:p=(1-f/100)/2:sr=0:GOSUB "LIB0:S6430":GOSUB 900:IF sr THEN*
110 z=s-v-x*SQR((1/r+1/u)*((t+w)/n)):GOSUB 400:a=z
120 z=s-v+x*SQR((1/r+1/u)*((t+w)/n)):GOSUB 400:b=z
130 PRINT c$;a;"< ü-ý <";b;:a$=INPUT$(1,@):GOTO 45
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 20
