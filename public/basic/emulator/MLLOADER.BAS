10 ' Generic ML loader - send any compiled .hex via COM0
15 ' Protocol: 4-char size hex, payload, 2-char checksum
20 DEFSEG=&H01CD
25 S=0
27 CLS:PRINT "Ready, send .hex now"
30 OPEN "COM0:6,E,8,1,N,N,N,N,N" FOR INPUT AS #1
33 LOCATE 0,1:PRINT "Reading size...";
35 GOSUB 200:N=P*256:GOSUB 200:N=N+P
37 LOCATE 0,1:PRINT "Size=";N;"       "
40 FOR I=0 TO N-1
50 GOSUB 200:POKE I,P:S=(S+P) MOD 256
60 IF I MOD 16=0 THEN LOCATE 0,2:PRINT "Byte ";I;"/";N;"    ";
90 NEXT I
95 GOSUB 200:C=P
107 CLOSE
108 LOCATE 0,2:PRINT "Done.             "
110 IF C<>S THEN LOCATE 0,3:PRINT "CHECKSUM ERR ";C;"!=";S:END
113 LOCATE 0,3:PRINT "OK. EXE to run...";
115 K$=INPUT$(1)
117 EX=&H1CD0
120 MODE110(EX)
130 END
199 ' --- read one byte (2 hex chars) into P ---
200 A=ASC(INPUT$(1,#1)):B=ASC(INPUT$(1,#1))
210 IF A>=65 THEN A=A-55 ELSE A=A-48
220 IF B>=65 THEN B=B-55 ELSE B=B-48
230 P=A*16+B:RETURN
