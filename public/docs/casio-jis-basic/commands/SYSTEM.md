*back to [Command Reference](../index.md#command-reference-alphabetical)*

## SYSTEM

**[All Models]**

### Purpose
Display BASIC system settings and status information.

### Format
```basic
SYSTEM [*]
```

### Explanation
1. Without an argument, `SYSTEM` displays the following information:
   - Printer mode setting
   - Trace mode setting
   - CLEAR settings (variable area size)
   - Free memory capacity
   - Variable area usage
   - Character free capacity
2. `SYSTEM *` enters test mode (self-test mode) for hardware diagnostics.
3. This is a manual command only; it cannot be used within a program.

### See
- [CLEAR](CLEAR.md)
- [FRE](FRE.md)
- [TRON](TRON.md)
- [TROFF](TROFF.md)
