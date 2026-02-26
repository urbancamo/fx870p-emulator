5 CLEAR:CLS
10 PRINT "  *** Aprovechamiento tipo ***   (Suelo Urbanizable Programado)"
20 CLS:PRINT "***********************> DATOS: ";
30 INPUT "Numero de ZONAS";Z
40 DIM S(Z+1),E(Z),P(Z),MT(Z),C(Z),MTC(Z),DPC(Z),DP(Z),EDC(Z),ED(Z)
50 FOR I=1TO Z
60 PRINT "SUPERFICIE Z(";I;") [m";CHR$(146);"]";:INPUT S(I)
70 PRINT "EDIFICABILIDAD Z(";I;")";:INPUT E(I)
80 PRINT "PLUSVALIAS Z(";I;")";:INPUT P(I)
90 NEXT:INPUT "Sup. Sist. GENERALES";S(Z+1)
95 PRINT "******************> RESULTADOS: ";
100 S=0:FOR I=1TO Z
103 S=S+S(I)
105 MT(I)=S(I)*E(I)
110 PRINT "m";CHR$(146);"t construible Z(";I;")=";MT(I):NEXT
115 S=S+S(Z+1)
120 INPUT "Zona predominante";J
130 MTC=0:FOR I=1TO Z
140 C(I)=P(I)/P(J)
150 MTC(I)=MT(I)*C(I)
160 MTC=MTC+MTC(I):NEXT
170 AT=MTC/S:DP=0.85*AT:FOR I=1TO Z
180 DPC(I)=S(I)*DP
190 DP(I)=DPC(I)/C(I)
200 EDC(I)=MTC(I)-DPC(I)
210 ED(I)=MT(I)-DP(I)
220 NEXT
230 FOR I=1 TO Z:PRINT "Coef. Pond. Z(";I;")=";C(I):NEXT
240 FOR I=1 TO Z:PRINT "Aprov.[m";CHR$(146);"t*] Z(";I;")=";MTC(I):NEXT
245 PRINT "APROV. TIPO=";AT;"[m";CHR$(146);"t* / m";CHR$(146);"s]":PRINT "DER. PROP.=";DP;"[m";CHR$(146);"t* / m";CHR$(146);"s]"
250 FOR I=1 TO Z:PRINT "Der.Prop.[m";CHR$(146);"t*] Z(";I;")=";DPC(I):NEXT
260 PRINT "Der.Prop.[m";CHR$(146);"t*] Z( SG )=";S(Z+1)*DP
270 PRINT "Der.AYTO.[m";CHR$(146);"t*] =";0.15*MTC
280 FOR I=1 TO Z:PRINT "Der.Prop.[m";CHR$(146);"t ] Z(";I;")=";DP(I):NEXT
290 FOR I=1 TO Z:PRINT "Exc.y Def.[m";CHR$(146);"t*] Z(";I;")=";EDC(I):NEXT
300 PRINT "Exc.y Def.[m";CHR$(146);"t*] Z( SG )=";-S(Z+1)*DP
305 PRINT "Exc.y Def.[m";CHR$(146);"t*] AYTO.=";-0.15*MTC
310 FOR I=1 TO Z:PRINT "Exc.y Def.[m";CHR$(146);"t ] Z(";I;")=";ED(I):NEXT
320 PRINT "PLUSVALIA PROP.=";P(J)*DP;"[pts/m";CHR$(146);"s]"
