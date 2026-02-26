5 CLS
10 PRINT "TABLA DE DISTRIBUCION BINOMIAL"
30 CLS:LOCATE 0,0:PRINT "(x,n,p)";
70 LOCATE 0,1:INPUT "x="; x
80 LOCATE 8,1:INPUT "n="; n
90 LOCATE 16,1:INPUT "p="; p
105 CLS:PRINT "wait...";
125 b2=0
140 FOR k=0 TO x
150 b=NCR (n,k)*p^k*(1-p)^(n-k)
160 b2=b2 + b
170 NEXT k
180 BEEP 1
200 CLS
210 PRINT "B(";x;",";n;",";p;")=";ROUND(b2,-5)
300 b=NCR(n,k)*p^k*(1-p)^(n-k)
310 PRINT "b(";x;",";n;",";p;")=";ROUND(b,-5)
320 GOTO 30

