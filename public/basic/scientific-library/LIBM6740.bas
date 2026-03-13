5 IF sq<>60 AND sq<>62 THEN sq=226
10 MODE 8:DIM:GOSUB 900:ERASE b$:DIM b$(1):b$(0)="Reject":b$(1)="Accept":t$="Test     Hû:Žü’=Žý’  Hü:Žü’"+CHR$(sq)+"Žý’":c$=CHR$(5):DEF CHR$(252)="123E020000":DEF CHR$(253)="2E2A3A0000"
20 CLS:PRINT t$;TAB(0);"input new data xü (Y/N) ?";:a$=INPUT$(1)
22 IF a$<>"Y" AND a$<>"y" THEN 30
25 s$="xü":GOSUB "LIB0:S6020":GOSUB 900
30 CLS:PRINT t$;TAB(0);"input new data xý (Y/N) ?";:a$=INPUT$(1)
32 IF a$<>"Y" AND a$<>"y" THEN 36
35 s$="xý":GOSUB "LIB0:S6030":GOSUB 900
36 s=sa:IF s>1 THEN r=sk^2 ELSE r=0
37 f=5:u=sz:IF u>1 THEN t=sl^2 ELSE t=0
45 CLS:PRINT t$;
50 z=s:s$="nü":GOSUB 500:s=z
60 z=r:s$="Vü":GOSUB 500:r=z
70 z=u:s$="ný":GOSUB 500:u=z
80 z=t:s$="Vý":GOSUB 500:t=z
90 CLS:PRINT "Significance level ˆ[%]";
95 z=f:s$="ˆ":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT t$;TAB(0);".....";
100 n=s-1:m=u-1:p=f/100:IF sq=226 AND r<t THEN n=u-1:m=s-1
102 IF sq=226 THEN p=p/2 ELSE IF sq=60 THEN p=1-p
105 sr=0:GOSUB "LIB0:S6440":GOSUB 900:IF sr THEN*
107 IF sq=226 AND r<t THEN z=t/r ELSE z=r/t
110 b=1:GOSUB 400:a=z:z=x:GOSUB 400:x=z
120 IF(sq=226 OR sq=62) AND a>x THEN b=0
122 IF sq=60 AND a<x THEN b=0
130 z=SGN(sq-60):PRINT c$;a;CHR$(60+z*2+b*(164-z));x;": ";b$(b);:a$=INPUT$(1,@):GOTO 45
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 20
