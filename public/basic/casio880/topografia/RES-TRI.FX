1 'RESTRI
2 CLEAR :PRINT "****RESOLUCION DE TRIANGULOS****";
3 INPUT "Sexag o cent(S/C)";A$
4 IF A$="C" THEN C=1 ELSE IF A$="S" THEN C=0 ELSE 2
5 ANGLE 0:INPUT "Salida sexag o cent(S/C)";A$
6 IF A$="C" THEN B=1 ELSE IF A$="S" THEN B=0 ELSE 4
7 DIM N$(2),N(2),A$(2),B$(2)
8 CLS:PRINT "Angulo mayusculas,lado minuscul","deben tener = nom lad y angul op"
10 A$(0)=" Primer":A$(1)=" Segundo":A$(2)=" Tercer":CLS
11 FOR I=0 TO 2:PRINT "nombre del";A$(I);:PRINT  "  dato";
12 INPUT N$(I):INPUT "valor asignado=";N
13 IF N$(I)>="a" THEN 15
14 N=N*C*.9+(1-C)*(N-FRACN+(100*FRACN-FRAC(100*FRACN))/60+FRAC(100*FRACN)/36)
15 N(I)=N:NEXT I
16 FOR I=0 TO 1
17 IF N$(I)=N$(I+1) THEN CLS:PRINT "VOLVER A EMPEZAR"
18 IF N$(I+1)>N$(I) THEN 21
19 A$=N$(I+1):N$(I+1)=N$(I):N$(I)=A$:A=N(I+1):N(I+1)=N(I):N(I)=A
20 IF I>0 THEN I=-1
21 NEXT I
22 FOR I=0 TO 2
23 IF N$(I)>"a" THEN B$(I)=CHR$(ASC(N$(I))-32) ELSE B$(I)=N$(I)
24 NEXT I
25 IF N$(2)<"a" THEN CLS:PRINT "NO HAY LADOS:VOLVER A EMPEZAR"
26 IF  N$(0)>="a" THEN 32
27 IF N$(1)<"a" THEN 30
28 IF B$(2)=B$(0) THEN 37
29 IF B$(1)=B$(0) THEN 37 ELSE 47
30 IF ASC(B$(2))=ASC(B$(0)) THEN 59
31 IF ASC(B$(2))<>ASC(B$(1)) THEN 53 ELSE 59
32 CLS:PRINT "         CASO A                ";
33 I=N(0):D=N(1):V=N(2):II$=N$(0):DD$=N$(1):VV$=N$(2)
34 K=ACS((D*D+V*V-I*I)/(2*D*V)):L=ACS((V*V+I*I-D*D)/(2*I*V))
35 M=ACS((D*D+I*I-V*V)/(2*D*I))
36 GOSUB 70:GOTO 11
37 CLS :PRINT "             CASO B           ";:J=0
38 IF B$(2)=B$(0) THEN J=2 ELSE J=1
39 K=N(0):II$=N$(0)
40 I=N(J):V=N(3-J):VV$=N$(3-J):DD$="desconocido"
41 M=ASN(SIN(K)*V/I)
42 L=180-K-M
43 D=SINL*I/SINK
44 GOSUB 70
45 IF M>90 THEN GOTO 11
46 M=180-M:GOTO 42
47 CLS:PRINT "             CASO C            ";
48 L=N(0):V=N(1):I=N(2):DD$=N$(0):VV$=N$(1):II$=N$(2)
49 D=SQR(V*V+I*I-2*V*I*COS(L))
50 M=ASN(SIN(L)*V/D)
51 K=ASN(SIN(L)*I/D)
52 GOSUB 70:GOTO 11
53 CLS:PRINT "             CASO D            ";
54 L=N(0):K=N(1):V=N(2):DD$=N$(0):II$=N$(1):VV$=N$(2)
55 M=180-L-K
56 I=V*SINK/SINM
57 D=V*SINL/SINM
58 GOSUB 70:GOTO 11
59 CLS:PRINT "              CASO E           ";
60 IF B$(0)=B$(2) THEN J=0 ELSE J=1
61 D=N(2):L=N(J):K=N(1-J):DD$=N$(2):II$=N$(1-J):VV$="desconocido"
62 M=180-L-K
63 I=D*SINK/SINL
64 V=D*SINM/SINL
65 GOSUB 70:GOTO 11
70 IF DD$<"a" THEN DD$=CHR$(ASC(DD$)+32)
72 IF II$<"a" THEN II$=CHR$(ASC(II$)+32)
73 IF VV$<"a" THEN VV$=CHR$(ASC(VV$)+32)
74 N=L:GOSUB 82:CLS:PRINT "          NOMBRE   ";DD$  ,"ANGULO=";N,"LADO="D
75 N=K:GOSUB 82:CLS:PRINT "          NOMBRE  ";II$,"ANGULO=";N,"LADO=";I
76 N=M:GOSUB 82:CLS:PRINT "          NOMBRE  ";VV$,"ANGULO=";N,"LADO=";V
77 PRINT "AREA=";D*I*SIN(M)/2
78 RETURN
82 N=B*N/.9+(1-B)*(INTN+INT(60*FRACN)/100+.006*FRAC(60*FRACN)):RETURN
