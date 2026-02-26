10 PRINT "Tabla"
20 INPUT "Entrada de datos>1:Calcular>2";Z:IF Z=2 THEN GOTO 200
100 CLEAR :CLS:PRINT "Entrada de datos"
110 INPUT "Numero de filas";F,"Numero de columnas de datos";C:DIM B(F,C)
120 FOR  J=1 TO C:PRINT "Datos de la columna";J
130 FOR I=1 TO F
140 GOSUB 900:GOSUB 1000
150 NEXT I:NEXT J
160 INPUT "Desea revisar o corregir  1/0";P
170 IF P=1 THEN  GOSUB 600
200 INPUT "Producto>1:combinaciones>2:terminar>3";P
210 ON P GOTO 300,400,500
300 INPUT "Columna 1*columna";K,"y por columna";L
310 ERASE P:DIM P(F):S=0
320 FOR I=1 TO F
330 P(I)=B(I,1)*B(I,K)*B(I,L):S=S+P(I):PRINT "P(";I;")=";P(I)
340 NEXT I
345 PRINT "Suma=";S
350 GOTO 200
400 PRINT "Combinaciones de columna"
410 INPUT "Num.de colum.que intervienen";N
