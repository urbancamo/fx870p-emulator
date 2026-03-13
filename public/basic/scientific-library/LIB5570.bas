5 ON ERROR GOTO 500
10 MODE 8:DIM:ERASE a,b,c$:DIM a(4),b(7),c$(7):a$="a b r x1y1":c$=CHR$(5)
20 CLS:PRINT "(x-a)’+(y-b)’=r’,(x1,y1)";
30 FOR i=0 TO 4
40 LOCATE 0,1:PRINT c$;MID$(a$,i*2+1,(SGN(i-2.5)+1)/2+1);"=";a(i);"?";:INPUT @42;a(i):LOCATE 0,0
50 IF i=2 AND a(2)=<0 THEN 40
60 IF i>2 THEN IF ABS(a(i-3)-a(i))/ABS(a(2))>1e5 THEN 30
70 NEXT:a=a(0):b=a(1):r=a(2):x=a(3):y=a(4):LOCATE 0,1:PRINT c$;".....";
75 IF(x-a)^2+(y-b)^2<r^2 THEN GOTO 300
80 IF x=a THEN 100 ELSE c=(y-b)/(a-x):d=r^2/(a-x):e=c^2+1:f=c*(c*b+d)+b:g=(c*b+d)^2+b^2-r^2:l=f^2-e*g
90 IF l<0 THEN 100 ELSE i=(f+SQR l)/e:k=(f-SQR l)/e:h=c*(i-b)-d+a:j=c*(k-b)-d+a:GOTO 200
100 IF y=b THEN 300 ELSE c=(x-a)/(b-y):d=r^2/(b-y):e=c^2+1:f=c*(c*a+d)+a:g=(c*a+d)^2+a^2-r^2:l=f^2-e*g
110 IF l<0 THEN 300 ELSE h=(f+SQR l)/e:j=(f-SQR l)/e:i=c*(h-a)-d+b:k=c*(j-a)-d+b
200 IF ABS(h-j)+ABS(i-k)<>0 THEN 210
201 p$="(x1,y1)=(x2,y2)=(x3,y3),":n=0:c$(0)="d"
202 IF b=y THEN p$=p$+"x=d":b(0)=x:GOTO 400
203 IF x=a THEN p$=p$+"y=d":b(0)=y:GOTO 400
204 n=1:c$(0)="c":c$(1)="d":p$=p$+"y=cx+d":b(0)=(x-a)/(b-y):b(1)=y-(x-a)/(b-y)*x:GOTO 400
210 p$="(x2,y2),":n=2:c$(0)="x2":c$(1)="y2":c$(2)="d"
220 b(0)=h:b(1)=i
230 IF x=h THEN p$=p$+"x=d   ":b(2)=x:GOTO 250
232 IF y=i THEN p$=p$+"y=d   ":b(2)=y:GOTO 250
234 n=3:p$=p$+"y=cx+d":c$(2)="c":c$(3)="d":b(2)=(i-y)/(h-x):b(3)=(y-i)/(h-x)*x+y
250 p$=p$+" : (x3,y3),"
260 n=n+1:c$(n)="x3":b(n)=j
270 n=n+1:c$(n)="y3":b(n)=k
275 n=n+1:c$(n)="f"
280 IF x=j THEN p$=p$+"x=f":b(n)=x:GOTO 400
282 IF y=k THEN p$=p$+"y=f":b(n)=y:GOTO 400
284 p$=p$+"y=ex+f":c$(n)="e":b(n)=(k-y)/(j-x):n=n+1:c$(n)="f":b(n)=(y-k)/(j-x)*x+y:GOTO 400
300 LOCATE 0,1:PRINT c$;"not found";:w$=INPUT$(1,@):GOTO 20
400 CLS:PRINT p$;:PRINT:FOR z=0 TO n
410 PRINT c$;c$(z);" =";b(z);
420 w=ASC(INPUT$(1,@)):IF w=13 THEN 480
430 IF w=30 AND z>0 THEN z=z-2:GOTO 480
440 IF w=31 AND z<n THEN 480
470 GOTO 420
480 NEXT:GOTO 20
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 IF ERL=40 THEN RESUME 40
550 RESUME 300
