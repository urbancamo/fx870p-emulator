5 CLEAR:R=6372.2:CLS:ANGLE0:PRINT"FOTOGRAMETRIA"
10 PRINT"1-Mov. de la Imagen","2-CORRECCIONES","3-Foto TERRESTRE","4-Foto AEREA","5-PLAN VUELO","6-Paralaje";:INPUTq:ONq GOSUB100,200,300,400,500,600:GOTO10
100 PRINT"D=f/Hv*v*t","D=v*t*Ef <0.04":RETURN
200 q=0:CLS:PRINT"1-RED.FOTOCOORD AL PP","2-POR DEF.MATERIAL DE MEDICION","3-DISTOR.RADIAL OBJETIVO","4-ESFERICIDAD","5-REFRACCION";:INPUTq:ONq GOSUB215,220,225,205,210:GOTO200
205 PRINTCHR$(238)"r=(Hr"CHR$(147)")/(2Rf"CHR$(146)") CORR +","Pa calcula r utilizar coord.corregidas por 1y2":INPUT"H media sobre terreno (Km)";H,"r dist. w a pto (mm)";r,"f (mm)";f,"R Tierra (6372.2)";R,"Coord a corregir x3=";x3,"y3=";y3
206 SETf4:vre=H*r^3/2/R/f^2:PRINTCHR$(238)"r="vre"mm":x4=(r+vre)/r*x3:y4=(r+vre)/r*y3:PRINT"x4'=(r+ce)/r*x'''="x4" y="y4:SETn:RETURN
210 PRINTCHR$(238)"r=((r"CHR$(146)"+f"CHR$(146)")/f)*"CHR$(238)CHR$(136)" CORR -",CHR$(238)CHR$(136)"=-a/2*H(1+4b/3a*H)Tg"CHR$(136):INPUT"H media sobre terreno (Km)";H,"r dist. w a pto (mm)";r,"f (mm)";f,"Coord a corregir x4=";x4,"y4=";y4
211 SETf6:a=-2560E-8:b=75E-8:z=-a/2*H*(1+(4*b*H)/3/a)*r/f:vrr=(r^2+f^2)/f*z:PRINT"a=-2560E-8  b=75E-8",CHR$(238)CHR$(136)"="z;"  "CHR$(238)"r="vrr"mm","x5=(r-vrr)/r*x4="(r-vrr)/r*x4,"y5="(r-vrr)/r*y4:SETn:RETURN
215 PRINT"Coord. calibradas P.P.":INPUT"Xc";Xc,"Yc";Yc:PRINT"Coord Pto resp. centro fiducial":INPUT"x";x,"y";y
216 x1=x-Xc:y1=y-Yc:PRINT"COORD CORREGIDAS","X'=x-Xc="x1" Y'=y-Yc="y1:RETURN
220 PRINT"Dist. entre marcas fidu.calib.":INPUT"Dxc";Dxc,"Dyc";Dyc:PRINT"Dist. entre marcas fidu.medidas":INPUT"Dx";Dx,"Dy";Dy:PRINT"Coord pto corr.por 1":INPUT"x'";x1,"y'";y1
221 SETF6:x2=Dxc/Dx*x1:y2=Dyc/Dy*y1:PRINT"x''=Dxc/Dx*x'="x2,"y''=Dyc/Dy*y'="y2:SETN:RETURN
225 PRINTCHR$(238)"r";:INPUT"";vr:PRINT"Coord pto corr.por 1y2":INPUT"x''";x2,"y''";y2
226 r=SQR(x2^2+y2^2):x3=(r-vr)/r*x2:y3=(r-vr)/r*y2:SETf6:PRINT"x'''=x''*(r-vr)/r="x3,"y'''=y''*(r-vr)/r="y3:RETURN
300 CLS:INPUT"f (mm)";f,"b base (m)";b,"Zi Cota PV izq";ZI,"Zd";ZD,"iI ang foto izq resp.a base";iI,"iD";iD,"X foto I";XI,"Y";YI,"X foto D";XD,"Y";YD
302 PRINTCHR$(136)"=arctg(x/f) "CHR$(137)"=arctg(y/"CHR$(130)"(x"CHR$(146)"+f"CHR$(146)")"
305 aI=ATN(XI/f):aD=ATN(XD/f):bI=ATN(YI/SQR(XI^2+f^2)):bD=ATN(YD/SQR(XD^2+f^2)):C1=iI-aI:C2=iD+aD:C3=180-C1-C2
306 LAI$="b*SIN(C2)/SIN(C3)":LAD$="b*SIN(C1)/SIN(C3)":xI$="LAI*COS(C1)":yI$="LAI*SIN(C1)":xD$="b-LAD*COS(C2)":yD$="LAD*SIN(C2)":zI$="ZI+LAI*TANbI":zD$="ZD+LAD*TANbD":LAI=VALF(LAI$):LAD=VALF(LAD$):xI=VALF(xI$):yI=VALF(yI$)
307 xD=VALF(xD$):yD=VALF(yD$):zI=VALF(zI$):zD=VALF(zD$):PRINTCHR$(136)"I="DMS$(aI)CHR$(136)"D="DMS$(aD),CHR$(137)"I="DMS$(bI)CHR$(137)"D="DMS$(bD),"C1  C2  C3",DMS$(C1);DMS$(C2);DMS$(C3)
309 SETF4:PRINT"LAI="LAI$;LAI,"LAD="LAD$;LAD,"XI="xI$;xI,"XD="xD$;xD,"YI="yI$;yI,"YD="yD$;yD,"ZI="zI$;zI,"ZD="zD$;zD:SETN:RETURN
400 CLS:PRINT"1-Coord FOTO>>Coord TERRENO","2-Desp.debido al relieve";:INPUTq:ONq GOSUB410,415:GOTO400
410 PRINT"Coord. FOTO";:INPUT"x(mm)";x,"y(mm)";y,"hpto(m)";h,"focal(mm)";f,"Hvuelo(m)";H,"Iclinacion fotogr";i
411 X$="(H-h)*x/(f/COSi-y*SINi)":Y$="(H-h)*y/(f/COSi-y*SINi)":PRINTX$"=Xt="VALF(X$),Y$"=Yt="VALF(Y$):RETURN
415 PRINTCHR$(238)"r=rh/Hv":INPUT"H sobre terreno (m)";H,"r dist. w a pto (mm)";r,"desplzamiento relativo(mm)";vr
416 h=vr*H/r:PRINT"h="h:RETURN
500 PRINT"p%=(L-B)/L*100","q%=(L-s)/L*100","B=L*(1-p/100)","s=L*(1-q/100)","Sf=L^2=(l*mf)^3","Sm=(L-B)*L","Sn=s*B=L^2*(1-p/100)(1-q/100)","N fotos pasada=Log faja estere/B","N pasadas=1+(ancho terreno-L)/s"
505 RETURN
600 CLS:PRINT"1-Cte.Barra","2-","3-";:INPUTq:ONq GOSUB610,620,630,640:GOTO600
610 INPUT"Base Izq.[bi]";bi,"Base Dcha.[bd]";bd,"Lect.paralaje P.P.foto izq[wi]";wi,"Foto dcha[wd]";wd:ci=bi-wi:cd=bd-wd:CTE=(ci+cd)/2:PRINT"Cte=b-Lect =>","Ci="ci" Cd="cd,"CTE=(ci+cd)/2="CTE:RETURN
