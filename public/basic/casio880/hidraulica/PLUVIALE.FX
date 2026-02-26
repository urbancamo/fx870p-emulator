1 'DISENO DE REDES PLUVIALES POR EL METODO DEL EMBALSE por Alfredo Argiles.
2 '
5 ERASE I,DE,TLL,QS:DIM I(26),DE(26),TLL(26),QS(26)
10 CLS:PRINT " **** Diseno RED PLUVIALES ****       (Metodo del Embalse)"
20 PRINT "Sup. Cuenca [m";CHR$(146);"]";:INPUT S
30 INPUT "Sup. Jardines [%]";J:INPUT "Sup. Tejados [%]";T:INPUT "Sup. Calles Paviment. [%]";C:INPUT "Sup. Aceras [%]";A
40 V=S*(J*.02+T*.001+C*.03+A*.002)/100:PRINT "* VOLUMEN de ENCHARCAMIENTO:      Vench.=";V;"[m";CHR$(147);"]"
50 PRINT "** Para Periodo de Retorno T=10       y Zona Mediterranea:"
60 I=100/24/60*11^((28^.1-0.4^.1)/(28^.1-1)):PRINT "* INT. CHUBASCO MAS DESFAVORABLE24min: I=";I;"[mm/min]"
70 Q=I/60000*S:PRINT "* CAUDAL MAXIMO:                  Qmax=";Q;"[m";CHR$(147);"/s]"
80 PRINT "Dada Pendiente [%.] y Qmax [l/s]-";CHR$(230);"ABACO-";CHR$(230);"Diametro: ";CHR$(143);"[mm]";:INPUT DT
90 PRINT "Qmax [m";CHR$(147);"/s] (";CHR$(143);DT;CHR$(230);"ABACO)";:INPUT Q:Q=Q*60
95 INPUT "Longitud Colector [m]";L:PRINT "Vol.Col.Anteriores [m";CHR$(147);"/s]";:INPUT VA
100 VM=VA+L*PI*(DT/1000)^2/4:PRINT "* Vmax (";CHR$(143);DT;")=";VM;"m";CHR$(147)
105 PRINT "********** T A B L A **********";
110 FOR D=2TO26STEP2:PRINT "***** PARA D=";D;"min"
120 I(D)=100/24/60*11^((28^0.1-(D/60)^0.1)/(28^0.1-1)):PRINT "I=";I(D);"mm/min"
130 DE(D)=D-V/I(D)/S*1000:PRINT "D'=";DE(D);"min"
140 ON ERROR GOTO 500
150 TLL(D)=VM/Q*LN(I(D)*S/1000/(I(D)*S/1000-Q)):PRINT "Tllenado=";TLL(D);"min"
160 QS(D)=I(D)*S/60000*(1-EXP(-Q/VM*DE(D))):PRINT "Qevacuable=";QS(D);"m";CHR$(147);"/s"
170 IF TLL(D)<DE(D) THEN BEEP:PRINT "Tll<D': NO SIRVE: Probar con    Diametro MAYOR de";DT;"mm":GOTO 200
180 NEXT D
190 BEEP:PRINT "* Probar Diametro MENOR";DT;"mm. ";
200 PRINT "Nuevo Diametro ";CHR$(143);"[mm]=";:INPUT DT
210 PRINT "Qmax [m";CHR$(147);"/s] (";CHR$(143);DT;CHR$(230);"ABACO)";:INPUT Q:Q=Q*60
220 GOTO 100
500 TLL(D)= 1E10:PRINT "Tllenado= -":RESUME 160



