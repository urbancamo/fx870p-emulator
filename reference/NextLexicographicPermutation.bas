10 CLS:CLEAR
11 INPUT "Enter a number (as string): ", N$
20 DIM D$(LEN(N$))
30 FOR I = 1 TO LEN(N$)
40 D$(I) = MID$(N$, I, 1)
50 NEXT I
60 FOR I = LEN(N$) - 1 TO 1 STEP -1
70 IF D$(I) < D$(I + 1) THEN GOTO 100
80 NEXT I
90 PRINT "No greater permutation found"
91 END
100 FOR J = LEN(N$) TO I + 1 STEP -1
110 IF D$(J) > D$(I) THEN GOTO 130
120 NEXT J
130 T$ = D$(I) : D$(I) = D$(J) : D$(J) = T$
140 FOR K = I + 1 TO LEN(N$) - 1
150 FOR L = K + 1 TO LEN(N$)
160 IF D$(K) > D$(L) THEN T$ = D$(K) : D$(K) = D$(L) : D$(L) = T$
170 NEXT L
180 NEXT K
190 FOR M = 1 TO LEN(N$)
200 PRINT D$(M);
210 NEXT M
220 PRINT
230 END
