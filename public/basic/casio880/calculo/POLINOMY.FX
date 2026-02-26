5 VAC:PM=3.5:I$=CHR$(8):H$="SOL.=":Z$=" POLINOMIOS ":DEFCHR$(252)="E8A8E80000":PRINT"OPERACIONES CON";Z$;CHR$(9)
6 PRINT" 1.[+] 2.[-] 3.[ð] 4.[Ÿ]?";:INPUT@2;K:CLS:K=K*10:IFK<10ORK>40ANDK<>90THEN6ELSEGOTOK
10 PRINT"SUMA DE";Z$;"[f(x)+g(x)]":GOSUB50:DIMc(n+n)
11 FORx=0TOn:IFm-x>-1THEN13
12 c(n-x)=a(n-x):GOTO14
13 c(n-x)=a(n-x)+b(m-x)
14 NEXT:Z=n:IFq=1THEN45ELSEGOSUB60:GOTO70
20 PRINT"RESTA DE";Z$;"[f(x)-g(x)]":GOSUB50:DIMc(n+n)
21 FORa=0TOm:b(a)=-b(a):NEXT:GOTO11
30 PRINT"PRODUCTO: [f(x)¥g(x)]":GOSUB50:DIMc(n+n)
31 FORx=0TOn:FORy=0TOx:c(x)=a(y)*b(x-y)+c(x):NEXT:NEXT:FORa=1TOn:FORx=a TOn:c(a+n)=a(x)*b(n+a-x)+c(a+n):NEXT:NEXT:Z=n+m:IFq=1THEN43ELSEGOSUB60:GOTO70
35 ERASEa:PRINT"PRODUCTO DE: (x+a)(x+b)(x+c)...":INPUT"Nü de monomios [ná6]";n:DIMa(n+n),b(6),c(n+n),d$(6):d$(1)="x":FORh=2TO6:d$(h)="x"+CHR$(144+h):NEXT:FORi=0TOn-1:INPUT"x+"+CHR$(97+i);a(i):NEXT:FORj=0TOn-1:b(1)=a(j)+b(1):NEXT
36 b(0)=1:FORa=0TOn-1:FORb=a TOn-2:b(2)=a(a)*a(b+1)+b(2):NEXT:NEXT:FORa=0TOn-1:FORb=a TOn-2:FORc=b TOn-3:b(3)=a(a)*a(b+1)*a(c+2)+b(3):NEXT:NEXT:NEXT
37 FORa=0TOn-1:FORb=a TOn-2:FORc=b TOn-3:FORd=c TOn-4:b(4)=a(a)*a(b+1)*a(c+2)*a(d+3)+b(4):NEXT:NEXT:NEXT:NEXT:r=n-1
38 FORa=0TOr:FORb=a TOn-2:FORc=b TOn-3:FORd=c TOn-4:FORe=d TOn-5:b(5)=a(a)*a(b+1)*a(c+2)*a(d+3)*a(e+4)+b(5):NEXT:NEXT:NEXT:NEXT:NEXT:t=1:FORe=0TOr:t=a(e)*t:NEXT:W=1:PRINT"MULTIPLICA POR ‰=";W;:INPUTW:IFn-6<0THENb(6)=0ELSEb(6)=t
39 CLS:FORi=0TOn:c(n-i)=b(n-i):NEXT:FORj=0TOn:c(n-j)=W*c(n-j):NEXT:Z=n:GOSUB60:GOTO70
40 PRINT"DIVISION: [f(x)/g(x)]":GOSUB50
41 DIMc(n+n):c(0)=a(0)/b(0):FORr=1TOn-m:FORs=0TOr-1:c(r)=c(s)*b(r-s)+c(r):NEXT:c(r)=(a(r)-c(r))/b(0):NEXT:Z=n-m:GOSUB60
42 PRINT" RESTO = .....";:T=Z:q=1:DIMe(n),D(n+n):FORb=0TOn:e(b)=a(b):NEXT:FORl=0TOn+n:a(l)=c(l):D(l)=c(l):NEXT:GOTO31
43 FORc=0TOn:b(c)=-c(n-c):a(c)=e(n-c):NEXT:f=m-1:m=n:GOTO11
45 FORI=0TO4:PRINTCHR$(8);:NEXT:FORv=0TOf:a=f-v:b=a:IFc(f-v)<>0THENGOSUB55
46 NEXTv:Z=f:s=0:FORD=0TOf:s=c(D)+s:NEXT:IFs=0THENPRINT"0";
47 FORa=0TOn+n:c(a)=D(a):NEXT:ERASEe,D:Z=T:GOTO70
50 PRINT"GRADO DE f(x)=";n;:INPUTn:PRINT"GRADO DE g(x)=";m;:INPUTm:IFn=>m THEN53
52 h=m:g=n:n=h:m=g:IFH=1THEN72
53 DIMd$(n+n):DIMa(n+n):i=0:FORI=n TO1STEP-1:FORh=0TO1:s=n+I-i:n$=STR$(s):u=LEN(n$):FORj=2TOu:d$(s)=d$(s)+CHR$(ASC(MID$(n$,j,1))+96):NEXTj:i=n:NEXT:i=0:d$(1)="":PRINT"ax";d$(I);"=";a(n-I);:INPUTa(n-I):d$(I)="x"+d$(I):d$(n-i+I)="x"+d$(n-i+I):NEXTI
54 PRINT"a=";a(n);:INPUTa(n):DIMb(n+n):FORj=0TOm-1:PRINT"b";d$(m-j);"=";b(j);:INPUTb(j):NEXT:PRINT"b=";b(m);:INPUTb(m):d$(0)="":RETURN
55 A1=ABS(c(v))+A1:g$="+":IFc(a)<0THENg$="-"
56 IFA1=c(v)ANDc(v)>0THENg$=" "
57 a$=STR$(c(a))+d$(b):IFd$(b)<>""AND ABSc(v)=1THENa$=" "+d$(b)
58 w=LEN(a$):a$=MID$(a$,2,w-1):PRINTg$;a$;:RETURN
60 CLS:PRINTH$;:A1=0:FORv=0TOZ:a=v:b=Z-v:IFc(v)=0THEN61ELSEGOSUB55
61 NEXTv:IFA1=0THENPRINT"0";ELSERETURN
70 LOCATE0,0:STOP:q=0:H=1:ERASEa:DIMa(Z+Z):FORI=0TOZ:a(I)=c(I):NEXT:ERASEc,b,d$:m=0:n=Z:GOTO6
72 DIMb(n+n):FORi=0TOZ:b(i)=a(i):NEXT:ERASEa:GOTO53
