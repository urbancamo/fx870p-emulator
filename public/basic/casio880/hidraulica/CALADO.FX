5 'calado.bas
10 PRINT "Calculo calado conjugado"
20 INPUT "Q=";Q
30 INPUT "y1=";Y1
40 INPUT "b=";B:G=9.810001
50 Y2=(Y1/2)*(((1+((8*Q*Q)/(B*B*Y1*Y1*G*Y1)))^.5)-1)
60 PRINT "EL CONJUGADO  ES y2=";Y2
