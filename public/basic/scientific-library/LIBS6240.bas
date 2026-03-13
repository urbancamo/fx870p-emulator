5 ON ERROR GOTO 500
10 ANGLE 1:IF x=<0 THEN p=1:GOTO 80
20 IF m MOD 2=0 THEN z=m/(m+n*x):GOSUB 100:p=1-p:GOTO 80
30 IF n MOD 2=0 THEN z=n*x/(m+n*x):i=m:m=n:n=i:GOSUB 100:i=m:m=n:n=i:GOTO 80
40 y=ATN SQR(n*x/m)
50 GOSUB 200:p=p+a:IF p<0 THEN p=0
80 y=p:RETURN
100 a=1:FOR i=m-2 TO 2 STEP-2:a=1+(n+i-2)/i*z*a:NEXT
110 p=(1-z)^(n/2)*a:RETURN
200 z=(SIN y)^2:IF n=1 THEN a=0 ELSE a=1
210 FOR i=n-2 TO 3 STEP-2:a=1+(m+i-2)/i*z*a:NEXT
220 b=PI:FOR i=2 TO m-1 STEP 2:b=b*(i-1)/i:NEXT
230 p=2/b*SIN y*(COS y)^m*a
250 z=(COS y)^2:IF m=1 THEN a=0 ELSE a=1
260 FOR i=m-2 TO 3 STEP-2:a=1+(i-1)/i*z*a:NEXT
270 a=1-2*y/PI-2/PI*SIN y*COS y*a:RETURN
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 sr=1:RESUME 80
