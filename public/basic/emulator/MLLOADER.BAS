10 ' Generic ML loader - send any compiled .hex via COM0
15 ' Protocol: CR-delimited lines. Line1=size(4hex), line2..=byte(2hex), last=checksum(2hex)
20 ' NOTE: PRINT after POKE corrupts 0x1CD0 unless extended CLEAR has
25 ' reserved the ML area (see CosmicV4 clr.b). So all user messages
30 ' are printed BEFORE the POKE loop; after load we just BEEP.
100 CLS:GOSUB 800:MODE110(EX):END
110 '
799 ' --- load .hex payload, set EX to entry address ---
800 DEFSEG=&H01CD:EX=&H1CD0:S=0
810 PRINT "ML loader - send .hex now"
815 PRINT "Beep x1 = done, x3 = err."
820 OPEN "COM0:6,E,8,1,N,N,N,B,N" FOR INPUT AS #1
835 LINE INPUT #1,A$:GOSUB 900:N=P*256:A$=MID$(A$,3):GOSUB 900:N=N+P
845 FOR I=0 TO N-1
850 INPUT #1,A$:GOSUB 900:POKE I,P:S=(S+P) MOD 256
860 NEXT I
865 INPUT #1,A$:GOSUB 900:C=P
870 CLOSE
874 IF C<>S THEN BEEP:BEEP:BEEP:END
876 BEEP
880 RETURN
899 ' --- parse 2 hex chars from A$ into P ---
900 A=ASC(A$):B=ASC(MID$(A$,2))
910 IF A>=65 THEN A=A-55 ELSE A=A-48
920 IF B>=65 THEN B=B-55 ELSE B=B-48
930 P=A*16+B:RETURN
