1 CLEAR:CLS:PRINT "Modulo granulometrico"
2 SETF2:FOR A=1 TO 9:T=80/(2^A)
3 CLS:PRINT "Retenidos tamiz ";T;" ";:INPUT RE:RET=RET+RE:NEXT A
4 CLS:PRINT "Modulo granulometrico ";RET/100
