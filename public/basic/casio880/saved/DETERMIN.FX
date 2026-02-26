1 VAC:DEFCHR$(252)="123E020000":DEFCHR$(253)="2E2A3A0000":DEFCHR$(254)="2A2A3E0000":DEFCHR$(255)="0000FF0000":PRINT"DETERMINANTES";CHR$(15):x=1:INPUT"Tipo de determinante: 1.Normal  2.Vectores 3.p(x) 4.p(x,y,z) ";x:k=10*x
2 DIMU$(8):FORU=0TO8:U$(U)="A"+CHR$(252+S)+CHR$(252+T):T=T+1:IFT>2THENT=0:S=S+1
3 NEXT:GOTOk
10 CLS:DIMA(8):PRINT"DET=ÿAüü Aüý Aüþÿ":CLS:FORu=0TO8:PRINTU$(u);:INPUTA(u):NEXT
15 D=A(0)*(A(4)*A(8)-A(7)*A(5))-A(1)*(A(3)*A(8)-A(6)*A(5))+A(2)*(A(3)*A(7)-A(6)*A(4)):PRINT"Det=";D:GOTO1
20 DIMA(5),B(2),S$(2),T$(2):PRINT"DET=ÿi  j  kÿ":CLS:INPUT"Aýü=";A(0),"Aýý=";A(1),"Aýþ=";A(2),"Aþü=";A(3),"Aþý=";A(4),"Aþþ=";A(5):B(0)=A(1)*A(5)-A(2)*A(4):B(1)=-A(0)*A(5)+A(2)*A(3):B(2)=A(0)*A(4)-A(1)*A(3)
21 T$(0)="i":T$(1)="j":T$(2)="k":PRINT"Det= ";:FORI=0TO2:IFB(I)<0THENG$="-"ELSEG$="+"
22 S$(I)=G$+MID$(STR$(B(I)),2,9)+T$(I):PRINTS$(I);:NEXT:STOP:GOTO1
30 CLS:PRINT"DET= ÿax+b cx+d ex+fÿ":q=3:GOSUB300
31 DIMa(19):o=3:GOTO351
32 DIMt$(19):h=3:t$(0)="x“":t$(1)="x’":t$(2)="x":GOTO358
40 CLS:PRINT" DET= ÿ ax+by+cz+d  ex+fy+gz+h  ix+jy+kz+l ÿ"
300 DIMA$(8),B$(8),C$(8):CLS:FORu=0TO8:PRINTU$(u);:INPUTA$(u):NEXT:CLS:PRINT"DET= .....";
310 FORO=0TO8:X=LEN(A$(O)):FORJ=1TOX:Z$=MID$(A$(O),J,1):IFZ$="x"THEN320ELSENEXT
320 B$(O)=MID$(A$(O),1,J-1):C$(O)=MID$(A$(O),J+1,X):IFJ>X THENC$(O)=B$(O):B$(O)="0"
322 IF(B$(O)=""ORB$(O)="-"ORB$(O)="+")AND(J<>X ORC$="")THENB$(O)=B$(O)+"1"
323 DIMA(8),B(8):IFq=3THEN324ELSE330
324 A(O)=VAL(B$(O)):B(O)=VAL(C$(O)):GOSUB350:RETURN
330 DIMD$(8),E$(8),a(19),C(8):Y=LEN(C$(O)):FORK=1TOY:V$=MID$(C$(O),K,1):IFV$="y"THEN331ELSENEXT
331 D$(O)=MID$(C$(O),1,K-1):E$(O)=MID$(C$(O),K+1,Y)
333 IFK>Y THENE$(O)=D$(O):D$(O)="0"
334 IF(D$(O)=""ORD$(O)="-"ORD$(O)="+")AND(K<>Y ORE$="")THEND$(O)=D$(O)+"1"
335 DIMF$(8),G$(8),D(8):Z=LEN(E$(O)):FORL=1TOZ:X$=MID$(E$(O),L,1):IFX$="z"THEN336ELSENEXT
336 F$(O)=MID$(E$(O),1,L-1):G$(O)=MID$(E$(O),L+1,Z)
337 IFL>Z THENG$(O)=F$(O):F$(O)="0"
338 IF(F$(O)=""ORF$(O)="-"ORF$(O)="+")AND(L<>Z ORG$="")THENF$(O)=F$(O)+"1"
340 A(O)=VAL(B$(O)):B(O)=VAL(D$(O)):C(O)=VAL(F$(O)):D(O)=VAL(G$(O)
350 NEXT:IFq=3THENRETURN
351 w=1:T=-3:FORQ=0TO5:T=T+3:IFT>8THENT=T-9
352 S=T+4:IFS>8THENS=S-9
353 R=S+4:IFR>8THENR=R-9
354 IFQ>2THENS=S+1:R=R-1:w=-1
355 IFo=3THENa=w*A(T):b=w*B(T):c=A(S):d=B(S):e=A(R):f=B(R):GOSUB400:GOTO357
356 GOSUB550
357 NEXT:IFo=3THENGOTO32ELSEDIMt$(19):t$(0)="x“":t$(1)="y“":t$(2)="z“":t$(3)="x’y":t$(4)="x’z":t$(5)="y’x":t$(6)="y’z":t$(7)="z’x":t$(8)="z’y":t$(9)="x’":t$(10)="y’":t$(11)="z’":t$(12)="xyz":t$(13)="xy":t$(14)="xz":t$(15)="yz":t$(16)="x":GOSUB660
358 CLS:PRINT"DET= ";:BEEP:FORi=0TO19:g$="+":IFa(i)<0THENg$="-"
359 r=r+ABS(a(i)):IF a(i)=0 THEN364
360 IF g$="+" AND a(i)=r THEN g$=""
361 a$=MID$(STR$(a(i)),2,9):IF a$="1" AND i<>3 AND h=3 THEN a$=""
362 IF a$="1" AND h<>3  AND i<>19 THEN a$=""
363 PRINTg$;a$;t$(i);
364 NEXT:IFr=0THENPRINT"0";
365 STOP:GOTO1
400 a(0)=a(0)+a*c*e:a(1)=a(1)+a*c*f+a*d*e+b*c*e:a(2)=a(2)+a*d*f+b*c*f+b*d*e:a(3)=a(3)+b*d*f:RETURN
550 a(0)=a(0)+w*A(T)*A(S)*A(R):a(1)=a(1)+w*B(T)*B(S)*B(R):a(2)=a(2)+w*C(T)*C(S)*C(R):A0=A(T):A1=A(S):A2=A(R):B0=B(T):B1=B(S):B2=B(R):GOSUB600:a(3)=a(3)+w*t:B0=C(T):B1=C(S):B2=C(R):GOSUB600:a(4)=a(4)+w*t:B0=D(T):B1=D(S):B2=D(R):GOSUB600:a(9)=a(9)+w*t
551 A0=B(T):A1=B(S):A2=B(R):B0=A(T):B1=A(S):B2=A(R):GOSUB600:a(5)=a(5)+w*t:B0=C(T):B1=C(S):B2=C(R):GOSUB600:a(6)=a(6)+w*t:B0=D(T):B1=D(S):B2=D(R):GOSUB600:a(10)=a(10)+w*t:A0=C(T):A1=C(S):A2=C(R):B0=A(T):B1=A(S):B2=A(R):GOSUB600:a(7)=a(7)+w*t
552 B0=B(T):B1=B(S):B2=B(R):GOSUB600:a(8)=a(8)+w*t:B0=D(T):B1=D(S):B2=D(R):GOSUB600:a(11)=a(11)+w*t:A0=D(T):A1=D(S):A2=D(R):B0=A(T):B1=A(S):B2=A(R):GOSUB600:a(16)=a(16)+w*t:B0=B(T):B1=B(S):B2=B(R):GOSUB600:a(17)=a(17)+w*t:B0=C(T):B1=C(S):B2=C(R):GOSUB600
553 a(18)=a(18)+w*t:a(19)=a(19)+w*D(T)*D(S)*D(R):A1=A(T):A2=A(S):A3=A(R):B1=B(T):B2=B(S):B3=B(R):C1=C(T):C2=C(S):C3=C(R):GOSUB650:a(12)=a(12)+w*t:C1=D(T):C2=D(S):C3=D(R):GOSUB650:a(13)=a(13)+w*t:B1=C(T):B2=C(S):B3=C(R):GOSUB650:a(14)=a(14)+w*t:A1=B(T)
554 A2=B(S):A3=B(R):GOSUB650:a(15)=a(15)+w*t:RETURN
600 t=A0*A1*B2+A0*A2*B1+A1*A2*B0:RETURN
650 t=A1*B2*C3+B1*A2*C3+A1*C2*B3+C1*A2*B3+B1*C2*A3+C1*B2*A3:RETURN
660 t$(17)="y":t$(18)="z":RETURN
