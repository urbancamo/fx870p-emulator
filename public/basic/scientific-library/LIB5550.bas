5 ON ERROR GOTO 500
10 MODE 8:DIM:ERASE a:DIM a(8):l$="abr":m$="x1y1x2y2x3y3":c$=CHR$(5)
20 CLS:PRINT "Circle  (x1,y1),(x2,y2),(x3,y3)";
30 FOR k=0 TO 5
40 LOCATE 0,1:PRINT c$;MID$(m$,1+2*k,2);"=";a(k);"?";:INPUT @42;a(k):LOCATE 0,0
50 NEXT:LOCATE 0,1:PRINT c$;
60 a=a(0)-a(2):b=a(0)+a(2):c=a(1)-a(3):d=a(1)+a(3):e=(a*b+c*d)/2
70 f=a(2)-a(4):g=a(2)+a(4):h=a(3)-a(5):i=a(3)+a(5):j=(f*g+h*i)/2
80 IF a*h-c*f<>0 THEN a(7)=(a*j-e*f)/(a*h-c*f) ELSE 160
90 IF a<>0 THEN a(6)=(e-a(7)*c)/a ELSE IF f<>0 THEN a(6)=(j-a(7)*h)/f ELSE 160
100 a(8)=SQR((a(0)-a(6))^2+(a(1)-a(7))^2)
110 CLS:PRINT "Circle  (x-a)’+(y-b)’=r’";:PRINT
120 FOR k=1 TO 3:PRINT c$;MID$(l$,k,1);" =";a(k+5);
125 w=ASC(INPUT$(1,@)):IF w=13 THEN 140
130 IF w=30 AND k>1 THEN k=k-2:GOTO 140
132 IF w=31 AND k<3 THEN 140
138 GOTO 125
140 NEXT:GOTO 20
160 LOCATE 0,1:PRINT c$;"not found";:w$=INPUT$(1,@):GOTO 20
500 IF ERR=1 THEN CLS:ON ERROR GOTO 0
510 IF ERL=40 THEN RESUME 40
520 RESUME 160
