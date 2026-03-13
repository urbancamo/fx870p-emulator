5 ON ERROR GOTO 1000:RESTORE :MODE 8:DIM:ERASE a,a$:DIM a(14),a$(5):c$=CHR$(5):IF sq<0 OR sq>3 OR FRAC sq<>0 THEN sq=0
12 IF tz<0 OR tz>3 OR FRAC tz<>0 THEN tz=0
14 FOR i=0 TO 5:READ a$(i):NEXT:d$="             :y?"
15 DATA y=a+bx,y=a+blnx,y=ab^x,y=ax^b,Delete,Input
20 l=21+ABS(SGN(sq-1))*2:CLS:PRINT "Regression analysis";TAB(l);"[";a$(sq);"]";TAB(0);">In,Del,Clear,List,eoX,eoY,P ?";
30 IF INKEY$=""THEN a=ASC(INPUT$(1)):IF a>96 THEN a=a-32
40 IF a=186 THEN sq=(sq+1) MOD 4:GOTO 20
50 ON a-66 GOTO 300,100,,,,,100:IF(sq AND tz)=0 THEN ON a-75 GOTO 500,,,,800,,,,,,,,400,450
60 GOTO 30
100 CLS:PRINT a$(SGN(a-68)+4);" data (x,y)";TAB(21);"[EXE]:menu";:z=SGN(a-69)
110 LOCATE 0,1:PRINT c$;"x?";d$;
120 LOCATE 2,1:INPUT @12;z$:LOCATE 0,0:IF z$=d$ OR ASC(z$)=0 THEN 20 ELSE x=VALF(z$):j=0
125 IF x=<0 THEN IF(1 AND sq)=1 THEN 120 ELSE tz=tz OR 1 ELSE IF x>0 THEN j=LN x:g=ss+j*z:m=su+j*j*z
130 r=sa+z:s=sb+x*z:u=sd+x*x*z
140 LOCATE 18,1:INPUT @12;z$:LOCATE 0,0:IF z$=""THEN 20 ELSE y=VALF(z$)
145 IF y=<0 THEN IF sq>1 THEN 140 ELSE tz=tz OR 2 ELSE IF y>0 THEN k=LN y:h=st+k*z:n=sv+k*k*z:p=sx+x*k*z:q=sy+j*k*z
160 t=sc+y*z:v=se+y*y*z:w=sf+x*y*z:o=sw+j*y*z:sa=r:sb=s:sc=t:sd=u:se=v:sf=w:ss=g:st=h:su=m:sv=n:sw=o:sx=p:sy=q:GOTO 110
200 c=15:GOSUB 350:ON sq GOSUB 360,370,380
210 sg=a(1)/sa:sh=a(2)/sa
220 sm=a(3)-sg*a(1):IF sm<0 THEN sm=0
230 sn=a(4)-sh*a(2):IF sn<0 THEN sn=0
240 so=a(5)-a(1)*sh:sp=sh*a(3)-sg*a(5):si=SQR(sm/sa):sj=SQR(sn/sa)
260 sk=SQR(sm/(sa-1)):sl=SQR(sn/(sa-1))
270 p=sp/sm:q=so/sm:r=so/SQR(sm*sn):IF sq>1 THEN p=EXP p:IF sq=2 THEN q=EXP q
280 RETURN
300 PRINT c$;"clear data  (Y/N) ?";:a$=INPUT$(1,@)
310 IF a$="Y"OR a$="y"THEN sa=0:sb=0:sc=0:sd=0:se=0:sf=0:ss=0:st=0:su=0:sv=0:sw=0:sx=0:sy=0:tz=0
320 GOTO 20
350 a(1)=sb:a(2)=sc:a(3)=sd:a(4)=se:a(5)=sf:RETURN
360 a(1)=ss:a(3)=su:a(5)=sw:RETURN
370 a(2)=st:a(4)=sv:a(5)=sx:RETURN
380 a(1)=ss:a(2)=st:a(3)=su:a(4)=sv:a(5)=sy:RETURN
400 CLS:GOSUB 200:IF c<15 OR so=0 THEN 20
410 DEF CHR$(255)="12548C4A12":CLS:PRINT "Estimation of x [";a$(sq);"]";
420 LOCATE 0,1:PRINT c$;"y?";:INPUT @10;z$:LOCATE 0,0:IF z$="" THEN 20 ELSE s=VALF(z$)
430 ON sq+1 GOSUB 950,960,970,980:LOCATE 12,1:PRINT ":�=";STR$(a);:z$=INPUT$(1,@):GOTO 420
450 CLS:GOSUB 200:IF c<15 OR sm=0 THEN 20
460 DEF CHR$(255)="124A844810":CLS:PRINT "Estimation of y [";a$(sq);"]";
470 LOCATE 0,1:PRINT c$;"x?";:INPUT @10;z$:LOCATE 0,0:IF z$="" THEN 20 ELSE s=VALF(z$)
480 ON sq+1 GOSUB 900,910,920,930:LOCATE 12,1:PRINT ":�=";STR$(a);:z$=INPUT$(1,@):GOTO 470
500 CLS:GOSUB 200:GOSUB 580:i=1:GOSUB 600:i=2
510 GOSUB 600
520 z=ASC(INPUT$(1,@)):IF z=28 OR z=29 THEN 20
530 IF z<>13 AND z<>30 AND z<>31 THEN 520
540 IF(z=30 AND i=1) OR(z=31 AND i=c) THEN 520
550 IF z=30 THEN i=i-2
560 i=i+1:IF i=<c THEN 510 ELSE 20
580 DEF CHR$(254)="0808003E00":DEF CHR$(253)="FE003E203E"
590 a(0)=sa:a(6)=sg:a(7)=sh:a(8)=si:a(9)=sj:a(10)=sk:a(11)=sl:a(12)=p:a(13)=q:a(14)=r:RETURN
600 GOSUB 605:READ a$,a$,b$:PRINT TAB(0);a$;TAB(7);":";b$;TAB(13);"=";a(i-1);:RETURN
605 IF i=1 OR i=15 THEN j=0:GOTO 609
606 IF i=6 THEN j=sq:GOTO 609
607 IF i>12 THEN j=SGN(sq):GOTO 609
608 k=i MOD 2:IF(i<6 AND k=1) OR(i>6 AND k=0) THEN j=INT(sq/2) ELSE j=(sq MOD 2)
609 RESTORE(600+i*10+j):RETURN
610 DATA CNT,CNT,n
620 DATA SUMX,SUMX,�x
621 DATA SUMLNX,SUM�X,��x
630 DATA SUMY,SUMY,�y
631 DATA SUMLNY,SUM�Y,��y
640 DATA SUMX2,SUMX2,�x�
641 DATA SUMLNX2,SUM�X2,��x�
650 DATA SUMY2,SUMY2,�y�
651 DATA SUMLNY2,SUM�Y2,��y�
660 DATA SUMXY,SUMXY,�xy
661 DATA SUMLNXY,SUM�XY,��xy
662 DATA SUMXLNY,SUMX�Y,�x�y
663 DATA SUMLNXLNY,SUM�X�Y,��x�y
670 DATA MEANX,MEANX,�x/n
671 DATA MEANLNX,MEAN�X,��x/n
680 DATA MEANY,MEANY,�y/n
681 DATA MEANLNY,MEAN�Y,��y/n
690 DATA SDXN,SDXN,x�n
691 DATA SDLNXN,SD�XN,�x�n
700 DATA SDYN,SDYN,y�n
701 DATA SDLNYN,SD�YN,�y�n
710 DATA SDX,SDX,x�n�
711 DATA SDLNX,SD�X,�x�n�
720 DATA SDY,SDY,y�n�
721 DATA SDLNY,SD�Y,�y�n�
730 DATA LRA,LRA,a
731 DATA RA,RA,a
740 DATA LRB,LRB,b
741 DATA RB,RB,b
750 DATA COR,COR,r
800 LOCATE 0,1:PRINT c$;".....";:GOSUB 200:GOSUB 590
810 FOR i=1 TO c:GOSUB 605:READ a$:LPRINT a$;TAB(10);"=";a(i-1):NEXT:GOTO 20
900 a=p+q*s:RETURN
910 a=p+q*LN s:RETURN
920 a=p*q^s:RETURN
930 a=p*s^q:RETURN
950 a=(s-p)/q:RETURN
960 a=EXP((s-p)/q):RETURN
970 a=(LN s-LN p)/LN q:RETURN
980 a=EXP((LN s-LN p)/q):RETURN
1000 IF ERR=1 THEN CLS:ON ERROR GOTO 0
1010 IF ERL=120 THEN RESUME 120
1020 IF ERL=140 THEN RESUME 140
1030 IF ERL=420 THEN RESUME 420
1040 IF ERL=470 THEN RESUME 470
1050 IF ERL=210 THEN c=6:RESUME 280
1060 IF ERL=260 THEN c=10:RESUME 280
1070 IF ERL=270 THEN c=12:RESUME 280
1080 IF(ERL=130 OR ERL=150) AND ERR=13 THEN LOCATE 0,1:PRINT c$;"data over";:z$=INPUT$(1,@):RESUME 20
1090 LOCATE 0,1:PRINT c$;"not found";:a$=INPUT$(1,@):RESUME 20
