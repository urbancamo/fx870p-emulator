10 GOSUB 400:ANGLE 1:IF p>1 OR p=<0 THEN*
15 IF p=1 THEN x=0:GOTO 80
20 IF m=1 THEN m=p:p=.5-p/2:GOSUB "LIB0:S6430":GOSUB 400:p=m:m=1:x=1/y^2:GOTO 80
30 IF n=1 THEN n=m:p=p/2:GOSUB "LIB0:S6430":GOSUB 400:n=1:p=p*2:x=y^2:GOTO 80
40 IF m=2 THEN p=1-p:m=n:n=2:GOSUB 100:p=1-p:n=m:m=2:x=1/x:GOTO 80
50 IF n>m THEN p=1-p:d=n:n=m:m=d:GOSUB 200:x=1/x:d=m:m=n:n=d:p=1-p:GOTO 80
60 GOSUB 200
80 y=x:RETURN
100 GOSUB "LIB0:S6420":GOSUB 400:x=y:a=n-2
110 x=x/n*(1+((x-a)/2+(((4*x-11*a)*x+a*(7*n-10))/24+(((2*x-10*a)*x+a*(17*n-26))*x-a*a*(9*n-6))/48/m)/m)/m):RETURN
200 GOSUB 100
210 d=x:c=p:GOSUB "LIB0:S6240":GOSUB 400:p=c
220 z=n+m:z=EXP((z*LN(z/(n*x+m))+(n-2)*LN x+LN(n*m/z)-LN(4*PI)-(1/n+1/m-1/z)/6)/2):x=x+(y-p)/z
230 IF ABS(d-x)>3E-4 THEN 210 ELSE RETURN
400 ON ERROR GOTO 500:RETURN
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 sr=1:RESUME 80
