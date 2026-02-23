# FX-870P / VX-4 ROM Annotations

Reference companion to `fx870p-roms.txt` (see also raw file, line numbers match).
ROM0 = word memory (0x0000–0x0BFF, each PC address = 1 × 16-bit word in file).
ROM1 = byte memory (0x0C00–0xFFFF, each PC address = 1 byte).

---

## Label Dictionary

| Address | Label                | ROM  | Notes                                                              |
|---------|----------------------|------|--------------------------------------------------------------------|
| 0x0000  | RST_Entry            | ROM0 | Reset dispatch: jr ROM0-A or ROM0-B variant                        |
| 0x001C  | ReadDevTable         | ROM0 | Returns devtbl[0] in r1                                            |
| 0x023D  | DevTableUpdate       | ROM0 | Toggles bit4 of devtbl[0]; detects RS-232C                         |
| 0x024E  | _WriteDevTable       | ROM0 | XORs bit4 then writes devtbl[0]; called by DevTableUpdate          |
| 0x0255  | _ClearCOM0Indirect   | ROM0 | jp &H0D95 → jp &H273D (clear COM0 if stub still installed)         |
| 0x0257  | RegisterCOM0         | ROM0 | COM0 found: saves registers, registers driver                      |
| 0x0D6E  | ColdBoot_Trampoline  | ROM0 | jp &H1F50                                                          |
| 0x0D95  | ClearCOM0_Trampoline | ROM0 | jp &H273D                                                          |
| 0x0403  | HardwareCheck        | ROM0 | Checks hardware config; returns r16=0 if OK for cold init          |
| 0x1F50  | ColdBootInit         | ROM1 | Entry from reset; sets up size regs, calls DevPreInit              |
| 0x1FB0  | COM0_Driver          | ROM1 | Real RS-232C driver entry point (stored as driver ptr when ready)  |
| 0x1FC3  | DriverInstallLoop    | ROM1 | Main driver registration loop; eventually writes ptr 0x1FB0        |
| 0x24FC  | DeviceInit           | ROM1 | Sets up device type table at RAM[0x111E], calls ROM0 device scan   |
| 0x2724  | InstallCOM0Stub      | ROM1 | Writes stub ptr 0x2734 to DriverPtrTable[SX]; jp DriverInstallLoop |
| 0x2734  | COM0_Stub            | ROM1 | Placeholder driver (cal &H2ADF = RS-232C RX stub)                  |
| 0x273D  | CheckClearCOM0       | ROM1 | If DriverPtrTable[SX] == 0x2734 or 0x2AA4: clear devtbl bit4       |
| 0x27A7  | DevPreInit           | ROM1 | Sets pd=0xCC, pe=0xCE; writes 0x06 to devtbl[0]; calls DeviceInit  |
| 0x2972  | GetDeviceEntry       | ROM1 | z=1 if no slot: reads RAM[0x16C4]; `anc r1,sz`; if sz=0 → always z |
| 0x297A  | StoreDriverPtr       | ROM1 | Writes r2 (16-bit addr) to DriverPtrTable[ix+sx] at RAM[0x165C]    |
| 0x294F  | ReadSlotTable        | ROM1 | r1 = RAM[0x16C4] (ix=0x16C4; ldd r1,(ix+sx))                       |
| 0x2D64  | EscapeDriverLoop     | ROM1 | Called nz from DriverInstallLoop; ends with `jp &H2AE8` NEVER RET  |

### Key RAM addresses (all in segment 1 = physical base 0x10000)

| Physical | Logical | Symbol           | Notes                                                            |
|----------|---------|------------------|------------------------------------------------------------------|
| 0x11100  | 0x1100  | devtbl[0]        | Device table byte 0; bit4=COM0 present (0x16=YES, 0x06=NO)       |
| 0x11101  | 0x1101  | devtbl[1]        |                                                                  |
| 0x1165C  | 0x165C  | DriverPtrTable   | 16-bit pointer to current COM0 driver (0x2734=stub, 0x1FB0=real) |
| 0x116F0  | 0x16F0  | (zeroed on init) |                                                                  |
| 0x111E   | 0x111E  | DeviceTypeTable  | Set up by DeviceInit                                             |
| 0x1121   | 0x1121  | (device info)    | Read during DeviceInit                                           |

---

## Annotated Code Sections

### RST_Entry / ReadDevTable (ROM0, word memory)

```
; ─── RST_Entry ──────────────────────────────────────────────────────────────
; Two variant entry points — hardware-detected on power-on
0000:  B7 02        jr      &H0002        ; ROM0 variant A: branch to 0x0002
0001:  B7 0F        jr      &H0010        ; ROM0 variant B: branch to 0x0010
0002:  1C 40        gfl     $0
0003:  44 00 02 00  anc     $0,&H02
0005:  34 00 00 80  jp      nz,&H8000
0007:  9F 61        gre     ky,$1
0008:  4C 01 08 00  an      $1,&H08
000A:  34 CF 00 0B  jp      nz,&H0BCF
000C:  56 40 00 00  pst     ib,&H00
000E:  37 6E 00 0D  jp      &H0D6E        ; → ColdBoot_Trampoline

; ROM0 variant B:
0010:  1C 40        gfl     $0
...
001A:  37 71 00 0D  jp      &H0D71

; ─── ReadDevTable ─────────────────────────────────────────────────────────
; out: r1 = devtbl[0]   (byte at physical RAM 0x11100)
001C:  D6 00 00 11  pre     ix,&H1100     ; ix = 0x1100 (devtbl base, segment 1)
001E:  2C 01        ldd     $1,(ix+$sx)   ; r1 = devtbl[0]
001F:  F7 00        rtn

; ─── ColdBoot_Trampoline ───────────────────────────────────────────────────
0D6E:  37 50 1F     jp      &H1F50        ; → ColdBootInit
; ─── ClearCOM0_Trampoline ──────────────────────────────────────────────────
0D95:  37 3D 27     jp      &H273D        ; → CheckClearCOM0
```

---

### DevTableUpdate / RegisterCOM0 (ROM0, word memory)

Called periodically (~2 Hz) to probe RS-232C hardware.
`ix` is the devtbl pointer (set by caller or inherited from hardware probe context).

```
; ─── DevTableUpdate (0x023D) ─────────────────────────────────────────────
; Reads devtbl[0], tests RS-232C-detected bits, XORs bit4, writes back.
; If bit4 ends up SET → COM0 hardware found → jp RegisterCOM0.
; If bit4 ends up CLEAR → dispatches to CheckClearCOM0 via ROM1.
023D:  77 1C 00 00  cal     &H001C        ; ReadDevTable → r1 = devtbl[0]
023F:  4C 81 EF 09  an      $1,&HEF,jr &H0249  ; r1 &= ~bit4; if was 0 → jr 0x0249
0241:  77 1C 00 00  cal     &H001C
0243:  44 01 10 00  anc     $1,&H10
0245:  F0 00        rtn     z
0246:  B7 03        jr      &H0249
0247:  77 1C 00 00  cal     &H001C
0249:  44 01 02 00  anc     $1,&H02
024B:  F0 00        rtn     z
024C:  4F 01 10 00  xr      $1,&H10       ; toggle bit4 of devtbl[0]
024E:  24 01        std     $1,(ix+$sx)   ; write devtbl[0] = toggled value
024F:  2C 0A        ldd     $10,(ix+$sx)  ; load devtbl[next byte]
0250:  77 E0 00 01  cal     &H01E0
0252:  44 0A 10 00  anc     $10,&H10
0254:  B0 0E        jr      z,&H0262
0255:  37 95 00 0D  jp      &H0D95        ; → ClearCOM0_Trampoline → CheckClearCOM0

; RegisterCOM0 (0x0257): COM0 hardware detected, register driver
0257:  E6 10 A0 00  phsm    $16,6         ; save 6 regs from r16
0259:  77 86 00 02  cal     &H0286
...
0262:  D6 00 01 11  pre     ix,&H1101     ; ix = devtbl[1]
0264:  A8 04        ldw     $4,(ix+$sx)
...
```

---

### ColdBootInit (ROM1, byte memory)

Entry from reset (RST_Entry → ColdBoot_Trampoline → here).

```
; ─── ColdBootInit (0x1F50) ──────────────────────────────────────────────
; Sets up CPU size registers, memory segments, stack, then:
;   1. Calls HardwareCheck (ROM0 0x0403) — r16=0 if full cold start
;   2. Calls DevPreInit (0x27A7) — sets ports, clears devtbl, runs DeviceInit
;   3. jp DriverInstallLoop (0x1FC3)
1F50:  42 10 00     ld      $16,&H00      ; r16 = 0 (cold-start flag)
1F53:  55 1F        psr     sx,31         ; sx = r31 = 1 (byte step)
1F55:  55 3E        psr     sy,30         ; sy = r30 (word step = 1 initially)
1F57:  55 40        psr     sz,0          ; sz = r0 = 0
1F59:  D1 1E 01 00  ldw     $30,&H0001    ; r30=0x00, r31=0x01 → sx=1, sy=1
1F5D:  56 60 D4     pst     ua,&HD4       ; segment register = 0xD4 (RAM seg)
1F60:  D7 00 D7 1B  pre     ss,&H1BD7     ; system stack
1F64:  D6 60 D0 1C  pre     us,&H1CD0     ; user stack
1F68:  77 03 04     cal     &H0403        ; HardwareCheck → r16 = result
1F6B:  01 10        sbc     $16,$sx       ; r16 -= 1
1F6D:  B4 0D        jr      nz,&H1F7B     ; if r16 != 0: skip cold-init writes
1F6F:  D6 00 0F 11  pre     ix,&H110F     ; ix = RAM[0x110F]
1F73:  42 00 07     ld      $0,&H07
1F76:  20 20        st      $0,(ix+$sy)   ; RAM[0x110F+sy] = 0x07
1F78:  77 EA 92     cal     &H92EA        ; ROM0: extra cold-init
1F7B:  77 A7 27     cal     &H27A7        ; DevPreInit
1F7E:  56 60 54     pst     ua,&H54       ; segment = 0x54 (RAM seg 1)
1F81:  37 C3 1F     jp      &H1FC3        ; → DriverInstallLoop
1F84:  F7           rtn
```

---

### COM0_Driver / DriverInstallLoop (ROM1)

`0x1FB0` is the REAL RS-232C driver.  It is also stored as the driver
pointer when COM0 initialisation is complete — after that, `CheckClearCOM0`
sees it is not the stub and leaves devtbl bit4 alone.

```
; ─── COM0_Driver (0x1FB0) ──────────────────────────────────────────────
; The real RS-232C driver.  Address 0x1FB0 is written to DriverPtrTable
; by DriverInstallLoop once COM0 init completes.
1FB0:  77 91 29     cal     &H2991
1FB3:  77 B4 29     cal     &H29B4
1FB6:  77 E8 2A     cal     &H2AE8
1FB9:  D7 00 D7 1B  pre     ss,&H1BD7
1FBD:  77 91 28     cal     &H2891
1FC0:  77 88 28     cal     &H2888

; ─── DriverInstallLoop (0x1FC3) ───────────────────────────────────────
; Main registration loop.  Called from ColdBootInit and from
; InstallCOM0Stub (0x273A: jp &H1FC3).
;
; The CRITICAL write is at 0x1FDE: once DriverPtrTable[SX] = 0x1FB0
; (rather than the stub 0x2734), CheckClearCOM0 will no longer clear
; devtbl bit4 → COM0 stays registered.
;
; KEY FINDING (from log + static analysis):
;   StoreDriverPtr (0x297A) is only ever called with 0x2734 and 0x2AA4 —
;   NEVER with 0x1FB0.  This means 0x1FDE is never reached.
;
; HYPOTHESIS A: GetDeviceEntry returns nz → cal nz,&H2D64 fires.
;   0x2D64 ends with jp &H2AE8 (NEVER RETURNS) → 0x1FC9 never reached.
;   GetDeviceEntry: r1 = RAM[0x16C4]; anc r1,sz.
;   If sz=0 (set at ColdBootInit 0x1F57 from r0=0), result is always z=1.
;   If sz≠0 AND RAM[0x16C4] has matching bits → nz → escape.
;
; PC trace (added to emulator) will confirm which path is taken.
1FC3:  77 72 29     cal     &H2972        ; GetDeviceEntry: z=1 if not found
1FC6:  74 64 2D     cal     nz,&H2D64     ; *** ESCAPE if nz: jp &H2AE8 NEVER RETURNS ***
1FC9:  77 72 92     cal     &H9272        ; (only if z=1) device slot setup
1FCC:  77 1C 00     cal     &H001C        ; ReadDevTable → r1 = devtbl[0]
1FCF:  4C 01 20     an      $1,&H20       ; r1 &= 0x20
1FD2:  4E 01 06     or      $1,&H06       ; r1 |= 0x06
1FD5:  24 01        std     $1,(ix+$sx)   ; devtbl[ix] = r1 (clears extra bits)
1FD7:  56 60 54     pst     ua,&H54       ; ensure segment = 1 (RAM)
1FDA:  D1 02 B0 1F  ldw     $2,&H1FB0     ; *** load COM0_Driver address (0x1FB0) ***
1FDE:  77 7A 29     cal     &H297A        ; StoreDriverPtr: DriverPtrTable[SX] = 0x1FB0
1FE1:  77 BB 29     cal     &H29BB
1FE4:  77 02 20     cal     &H2002
1FE7:  77 A1 29     cal     &H29A1
1FEA:  B4 06        jr      nz,&H1FF1     ; error path
1FEC:  77 10 26     cal     &H2610
1FEF:  B7 99        jr      &H1F89        ; loop or complete

; error path:
1FF1:  24 1F        std     $31,(ix+$sx)
1FF3:  77 E8 2A     cal     &H2AE8
1FF6:  B7 A0        jr      &H1F97
```

---

### DevPreInit (ROM1)

Sets hardware ports, clears devtbl, calls DeviceInit to scan attached devices.
`27D7–27DB`: the write of 0x06 to devtbl[0] (clears COM0 bit during probe).

```
; ─── DevPreInit (0x27A7) ─────────────────────────────────────────────
27A7:  D1 00 07 41  ldw     $0,&H4107     ; r0=0x41, r1=0x07
27AB:  D1 02 80 00  ldw     $2,&H0080     ; r2=0x00, r3=0x80
27AF:  D6 00 15 11  pre     ix,&H1115     ; ix = RAM[0x1115]
27B3:  E0 00 60     stm     $0,(ix+$sx),4 ; store 4 bytes at 0x1115
27B6:  77 91 29     cal     &H2991        ; set device slot index in RAM[0x1739]
27B9:  D6 00 70 17  pre     ix,&H1770
27BD:  02 00        ld      $0,$sx
27BF:  A0 1F        stw     $31,(ix+$sx)  ; zero RAM[0x1770]
27C1:  54 00 C0     ppo     &HC0          ; port output
27C4:  57 00 40     pst     ia,&H40       ; interrupt address
27C7:  56 20 CC     pst     pd,&HCC       ; Port D = 0xCC
27CA:  56 00 CE     pst     pe,&HCE       ; Port E direction = 0xCE
27CD:  D6 00 95 18  pre     ix,&H1895
27D1:  AA 00        ldiw    $0,(ix+$sx)
27D3:  A2 00        stiw    $0,(ix+$sx)
27D5:  A0 00        stw     $0,(ix+$sx)
27D7:  D1 00 00 11  ldw     $0,&H1100     ; load devtbl base address → r0:r1
27DB:  50 40 06     st      &H06,($sz)    ; *** devtbl[0] = 0x06 (clears COM0 bit) ***
27DE:  77 74 97     cal     &H9774        ; ROM0: hardware type detect
27E1:  D6 00 13 11  pre     ix,&H1113
27E5:  A8 00        ldw     $0,(ix+$sx)
27E7:  4C 00 60     an      $0,&H60
27EA:  4C 01 02     an      $1,&H02
27ED:  A0 00        stw     $0,(ix+$sx)
27EF:  77 FC 24     cal     &H24FC        ; DeviceInit → eventually jp ROM0 device scan
```

---

### InstallCOM0Stub / CheckClearCOM0 (ROM1)

The oscillation root cause lives here.  `InstallCOM0Stub` stores the stub
address, `CheckClearCOM0` clears devtbl bit4 whenever the stub is still
installed.

```
; ─── InstallCOM0Stub (0x2724) ─────────────────────────────────────────
; Stores stub ptr 0x2734 → DriverPtrTable[SX].
; Called during hardware detection; zeroes devtbl collision counter.
; Falls through to COM0_Stub (0x2734) and then jp DriverInstallLoop.
2724:  D1 02 34 27  ldw     $2,&H2734     ; r2 = 0x2734 (COM0_Stub address)
2728:  77 7A 29     cal     &H297A        ; StoreDriverPtr: DriverPtrTable[SX] = 0x2734
272B:  D6 00 F0 16  pre     ix,&H16F0
272F:  24 1F        std     $31,(ix+$sx)  ; zero RAM[0x16F0] (collision counter)
2731:  77 A4 03     cal     &H03A4        ; ROM0 call (returns to 0x2734)
; ─── COM0_Stub (0x2734) ─────────────────────────────────────────────
2734:  77 DF 2A     cal     &H2ADF        ; RS-232C receive stub
2737:  77 D8 01     cal     &H01D8        ; ROM0
273A:  37 C3 1F     jp      &H1FC3        ; → DriverInstallLoop

; ─── CheckClearCOM0 (0x273D) ──────────────────────────────────────────
; Reached when devtbl bit4 was SET.
; If DriverPtrTable[SX] == stub (0x2734 or 0x2AA4): clear bit4 → COM0 absent.
; If DriverPtrTable[SX] == real driver (e.g. 0x1FB0): jp 0x0257 → COM0 present.
273D:  D1 00 34 27  ldw     $0,&H2734     ; r0:r1 = stub address 0x2734
2741:  D6 00 5C 16  pre     ix,&H165C     ; ix = DriverPtrTable base
2745:  BA 00        sbcw    (ix+$sx),$0   ; compare DriverPtrTable[SX] with r0:r1
2747:  B0 0A        jr      z,&H2752      ; if == stub → clear bit4
2749:  D1 00 A4 2A  ldw     $0,&H2AA4     ; r0:r1 = MT stub address
274D:  BA 00        sbcw    (ix+$sx),$0   ; compare with MT stub
274F:  34 57 02     jp      nz,&H0257     ; if != either stub → COM0 present!
; clears bit4:
2752:  4F 0A 10     xr      $10,&H10      ; toggle bit4 of r10 (= old devtbl value)
2755:  D6 00 00 11  pre     ix,&H1100     ; ix = devtbl base
2759:  24 0A        std     $10,(ix+$sx)  ; devtbl[0] = cleared (0x06)
```

---

### GetDeviceEntry / StoreDriverPtr (ROM1)

```
; ─── GetDeviceEntry (0x2972) ─────────────────────────────────────────
; Loads sy into r0, calls 0x294F, ANDs r1 with sz.
2972:  02 20        ld      $0,$sy        ; r0 = sy (size step = 1)
2974:  77 4F 29     cal     &H294F
2977:  04 41        anc     $1,$sz
2979:  F7           rtn

; ─── StoreDriverPtr (0x297A) ─────────────────────────────────────────
; in:  r2:r3 = 16-bit driver address to store
; action: DriverPtrTable[SX] = r2 (at physical RAM 0x1165C)
; KEY: once r2 = 0x1FB0 (COM0_Driver), CheckClearCOM0 stops clearing devtbl.
297A:  D6 00 5C 16  pre     ix,&H165C     ; ix = DriverPtrTable base
297E:  A0 02        stw     $2,(ix+$sx)   ; DriverPtrTable[SX] = r2:r3
2980:  F7           rtn
```

---

## The COM0 Oscillation Bug

### Normal (Delphi) stable flow

```
Reset
  → ColdBootInit (1F50)
    → DevPreInit (27A7): devtbl[0] = 0x06 (COM0 bit cleared for probe)
      → DeviceInit (24FC) → ROM0 device scan
        → InstallCOM0Stub (2724): DriverPtrTable[SX] = 0x2734 (stub)
        → DriverInstallLoop (1FC3)
          → ... device registration work ...
          → ldw $2,&H1FB0          ; load real driver address
          → StoreDriverPtr (297A): DriverPtrTable[SX] = 0x1FB0  ✓ STABLE
            (Now CheckClearCOM0 sees 0x1FB0 ≠ 0x2734,0x2AA4 → bit4 stays set)
Periodic poll
  → DevTableUpdate (023D): XOR bit4 → devtbl = 0x16 (COM0=YES)
  → CheckClearCOM0 (273D): 0x1FB0 ≠ stub → jp 0x0257 (COM0 present)
  → devtbl[0] = 0x16 stable ✓
```

### Our emulator (broken) flow

```
Reset
  → ColdBootInit → DevPreInit → InstallCOM0Stub (2724)
    DriverPtrTable[SX] = 0x2734  ← set to stub
  → DriverInstallLoop (1FC3) ... ???
    [Does execution reach 0x1FDE to write 0x1FB0?]
Periodic poll (~2 Hz)
  → DevTableUpdate: XOR → 0x16
  → CheckClearCOM0: sees 0x2734 == stub → clears bit4 → 0x06
  → oscillates
```

### Likely causes

1. **Execution never reaches 0x1FDE**: Something in DriverInstallLoop
   returns early or loops without reaching `ldw $2,&H1FB0`.
2. **Wrong segment when StoreDriverPtr writes**: If `ua` ≠ 0x54 at
   0x1FD7, the write lands at the wrong physical address.
3. **InstallCOM0Stub re-runs after DriverInstallLoop**: A later call
   re-stores 0x2734, undoing the 0x1FB0 write.

### Next debugging step

Add a write monitor to physical RAM address `0x1165C` (= logical 0x165C,
segment 1) with NO time limit, logging every write with a call stack hint.
This will show whether 0x1FDE ever fires and whether something later
overwrites 0x1FB0 back to 0x2734.

See `src/emulator/def.ts` `setRamWriteMonitor` — extend the 500ms window or
add a permanent monitor for just this address.
