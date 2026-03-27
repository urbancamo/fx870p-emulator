*back to [Command Reference](../index.md#command-reference-alphabetical)*

## CONT

**[All Models]**

### Purpose
Resume execution of a program stopped by the `STOP` statement or **BRK** key.

### Format
```basic
CONT
```

### Explanation
1. Resumes program execution from the point where it was interrupted by a
[STOP](STOP.md) statement or by pressing the **BRK** key.
2. This is a manual command only; it cannot be used within a program.
3. Variables retain their values from the point of interruption.
4. If the program has been edited after stopping, `CONT` may not function
correctly.

### See
- [STOP](STOP.md)
- [RUN](RUN.md)
- [END](END.md)
