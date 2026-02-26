2 PRINT "CALCULO DE AREA"
3 PRINT"  Dar coord.ptos hasta cerrar el area a calcular"
5 CLEAR
10 INPUT "X=",A,"Y=",B:R=A:P=B
15 INPUT "X=",X,"Y=",Y
20 S=0.5*((X-A)*(Y+B))+S:A=X:B=Y
30 IF X=R THEN IF Y=P THEN PRINT "S=";ABSS:END
35 GOTO 15
