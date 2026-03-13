5 ON ERROR GOTO 500
10 GOSUB 100:s=f:q=k+1:y=n+1
30 FOR i=1 TO x:f=f*(q-i)*(y-i)/i/(z+i):s=s+f:NEXT
80 s=1-s+f:RETURN
100 q=m-k:y=m-n:z=m-k-n:f=1
110 IF q<17 AND k<17 THEN FOR i=0 TO n-1:f=f*(q-i)/(m-i):NEXT:RETURN
120 f=(q+.5)*LN q+(y+.5)*LN y-(m+.5)*LN m-(z+.5)*LN z+(1/q+1/y-1/m-1/z)/12:f=EXP f:RETURN
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 sr=1:RESUME 80
