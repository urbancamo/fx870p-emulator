1 CLEAR:w=-1:PRINT "POLINOMIO DE UNA MATRIZ"
2 CLS:INPUT "Dimension de Rü  [nó4]";N:IF N<1 THEN 2
5 DIM a(6,6),z(6,6),B(4),A$(4):FOR I=0 TO N-1:FOR J=0 TO N-1:PRINT "A(";MID$(STR$(I+1),2);",";MID$(STR$(J+1),2);")";:INPUT a(4-N+I,4-N+J):NEXT:NEXT
10 a=a(0,0):b=a(0,1):c=a(0,2):d=a(0,3):e=a(1,0):f=a(1,1):g=a(1,2):h=a(1,3):i=a(2,0):j=a(2,1):k=a(2,2):l=a(2,3):m=a(3,0):n=a(3,1):o=a(3,2):p=a(3,3)
20 r=1:s=-a-f-k-p:t=a*(f+k+p)-h*n-o*l-j*g+f*k+f*p+k*p-b*e-i*c-m*d
25 u=a*(h*n+o*l+i*g-f*k-f*p-k*p)+n*k*h+o*l*f+j*g*p-f*k*p-g*l*n-j*o*h+c*(i*p+i*f-e*j-l*m)+b*(p*e+e*k-m*h-i*g)+d*(m*k+m*f-n*e-i*o)
30 v=a*(f*k*p+g*l*n+j*o*h-n*k*h-o*l*f-i*g*p)+b*(m*h*k+o*l*e+i*g*p-e*p*k-g*l*m-i*o*h)+c*(e*j*p+l*m*f+i*n*h-m*j*h-n*e*l-i*f*p)+d*(m*j*g+n*e*k+i*o*f-e*o*j-m*k*f-i*n*g):PRINT "Det= ";
35 x=(-1)^N:B(0)=r*x:B(1)=s*x:B(2)=t*x:B(3)=u*x:B(4)=v*x:FOR I=N TO 2 STEP -1:A$(N-I)=CHR$(252)+CHR$(144+I):NEXT:A$(N-1)=CHR$(252):FOR I=0 TO N:IF B(I)=0 THEN B$="":GOTO 45 ELSE IF I<>N AND (B(I)=1 OR B(I)=-1) THEN C$="" ELSE C$=MID$(STR$(B(I)),2)
40 B$=C$+A$(I):IF B(I)<0 THEN B$="-"+B$ ELSE IF I<>0 THEN B$="+"+B$
45 PRINT B$;:NEXT
