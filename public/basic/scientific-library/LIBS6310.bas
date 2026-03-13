5 ON ERROR GOTO 500
10 IF p=1 THEN IF n=x THEN s=1:f=1:GOTO 80 ELSE s=0:f=0:GOTO 80
20 q=1-p:f=q^n:s=f:z=p/q:y=n+1
30 FOR i=1 TO x:f=f*z*(y-i)/i:s=s+f:NEXT
80 s=1-s+f:RETURN
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 sr=1:RESUME 80
