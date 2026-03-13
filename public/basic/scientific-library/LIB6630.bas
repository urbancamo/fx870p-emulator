10 MODE 8:DIM:GOSUB 900:c$=CHR$(5):t$="N(ç,éí) a<éí<b"
20 CLS:PRINT t$;TAB(0);"input new data (Y/N) ?";:a$=INPUT$(1,@)
25 IF a$<>"Y" AND a$<>"y" THEN 40
30 s$="x":GOSUB "LIB0:S6020":GOSUB 900
40 f=95:s=sa:IF s THEN r=sm ELSE r=0
45 CLS:PRINT t$;
50 z=s:s$="n":GOSUB 500:s=z
60 z=r:s$="S":GOSUB 500:r=z
90 CLS:PRINT "Confidence level (1-à)[%]";
95 z=f:s$="1-à":GOSUB 500:f=z:IF f<0 OR f>100 THEN 95
97 CLS:PRINT "N(ç,éí)   ";f;"%";TAB(0);".....";
100 n=s-1:p=(1-f/100)/2:sr=0:GOSUB "LIB0:S6420":GOSUB 900:IF sr THEN*
105 g=x:p=1-p:GOSUB "LIB0:S6420":GOSUB 900:IF sr THEN*
110 z=r/g:GOSUB 400:a=z
120 z=r/x:GOSUB 400:b=z
130 PRINT c$;a;"< éí <";b;:a$=INPUT$(1,@):GOTO 45
400 IF z THEN z=ROUND(z,LOG(ABS z)-5)
410 RETURN
500 LOCATE 0,1:PRINT c$;s$;"=";z;"?";:INPUT @10;z:LOCATE 0,0:RETURN
900 ON ERROR GOTO 910:RETURN
910 IF ERR=1 THEN CLS:ON ERROR GOTO 0
920 IF ERL=500 THEN RESUME 500
930 LOCATE 0,1:PRINT c$;"not found";:z$=INPUT$(1,@):RESUME 20
