10 ' Find the 100th prime via trial division.
20 ' K+K>N stops the search once K exceeds N/2 (no factor above N/2 is
30 ' possible), which is always reached before an integer overflow risk.
40 C=0
50 N=1
100 N=N+1
110 FOR K=2 TO N-1
120   IF K+K>N THEN 200
130   IF N MOD K=0 THEN 100
140 NEXT K
200 C=C+1
210 IF C<100 THEN 100
220 PRINT N
230 END
