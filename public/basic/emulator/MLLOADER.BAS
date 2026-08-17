10 ' Generic ML loader - send any compiled .hex via COM0
15 ' Protocol: CR-delimited lines. Line1=size(4hex), line2..=byte(2hex), last=checksum(2hex)
20 ' NOTE: PRINT after POKE corrupts 0x1CD0 unless extended CLEAR has
25 ' reserved the ML area. Run EXTCLR.BAS once first (RUN, then
30 ' MODE110(&H18F5),1520) - this loader checks for that and bails
35 ' out cleanly if it's missing, rather than silently corrupting.
40 ' NOTE: the ROM resets US to &H1CD0 on every string op (see
45 ' rom1a.src &H1F64/&H66BA), so a persisted A$ during the receive
50 ' loop clobbers the load target. Bytes are read char-by-char via
55 ' INPUT$(1,#1) straight into numeric vars - no string variable.
100 CLS:GOSUB 800:MODE110(EX):END
110 '
799 ' --- load .hex payload, set EX to entry address ---
800 EX=&H1CD0:S=0
805 IOBF=PEEK(&H1895)+PEEK(&H1896)*256
810 PRINT "ML loader - send .hex now"
815 PRINT "Beep x1 = done, x3 = err."
820 OPEN "COM0:6,E,8,1,N,N,N,B,N" FOR INPUT AS #1
830 GOSUB 900:N=P*256:GOSUB 900:N=N+P:GOSUB 950
832 IF EX+N<IOBF THEN 845
835 CLOSE:PRINT "No ML area!":PRINT "Run EXTCLR first.":END
845 DEFSEG=&H01CD:FOR I=0 TO N-1
850 GOSUB 900:GOSUB 950:POKE I,P:S=(S+P) MOD 256
860 NEXT I
865 GOSUB 900:GOSUB 950:C=P
870 CLOSE
874 IF C<>S THEN BEEP:BEEP:BEEP:END
876 BEEP
880 RETURN
899 ' --- read one byte (2 hex chars) into P ---
900 A=ASC(INPUT$(1,#1)):B=ASC(INPUT$(1,#1))
910 IF A>=65 THEN A=A-55 ELSE A=A-48
920 IF B>=65 THEN B=B-55 ELSE B=B-48
930 P=A*16+B:RETURN
940 ' --- consume the CR line terminator ---
950 D=ASC(INPUT$(1,#1)):RETURN
