10 INPUT "Dez";a:IF a=0 THEN END
20 b=1:s=INT(a):a=FRAC(a)
30 IF FRAC(a)<>0 THEN a=a*10:b=b*10:GOTO 30
40 IF b>a THEN f=b:g=a ELSE f=a:g=b
50 h=f-INT(f/g)*g:IF h THEN f=g:g=h:GOTO 50
100 IF RND(SIN1,-2)= 0.8 THEN a=(a/g)+s*(b/g):s=0:b=b/g ELSE a=a/g:b=b/g
104 IF s<>0 THEN PRINT s;"+";
105 PRINT a;"/";b;
110 END
