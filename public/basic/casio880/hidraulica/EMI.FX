5 PRINT "BERNOUILLI ENTRE 2 PUNTOS DEL EMISARIO"
10 CLS
20 INPUT "B1";B1
30 INPUT "z3";z3
40 INPUT "v3";v3
50 INPUT "Kbp";Kbp
55 INPUT "D(diametro del e.)=";D
56 INPUT "L=";L
60 INPUT "v1";v1
70 INPUT "f";f
80 H=Kbp*((v1*v1)/(2*9.8))+((L*f)/D)*((v3*v3)/(2*9.8))
85 PRINT "H=";H
90 P=B1-z3-((v3*v3)/(2*9.8))-H
100 B3=z3+P+((v3*v3)/(2*9.8))
110 PRINT "P/ppe=";P
120 PRINT "B3=";B3
