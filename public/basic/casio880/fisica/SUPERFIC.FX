500 PRINT "SUPERFICIE POR COORDENADAS"
501 PRINT "Los puntos no se meteran aleatoriamente "
502 PRINT "Habra que seguir un sentido para introducirlos"
505 S=0
510 INPUT "N.PUNTOS=";N,"X 1";A,"Y 1";B
520 C=A:D=B
530 FOR I=2 TO N
540 PRINT "X";I;:INPUT X:PRINT "Y";I;:INPUT Y
550 S=S+(X-A)*(Y+B):A=X:B=Y
560 NEXT I
570 S=S+(C-X)*(D+Y)
580 PRINT "SUPERFICIE=";ABS S/2
590 GOTO 505
600 END
