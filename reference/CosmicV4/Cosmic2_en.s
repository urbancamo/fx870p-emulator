;---------------------------------------------------------------
; Cosmic Fly
; a public domain game for the Casio PB-1000
; written by Gernot Fink <gernot.fink@munich.netsurf.de>
; published by Andreas Wichmann on 2000-03-03 on
; http://www.itkp.uni-bonn.de/~wichmann/pb1000.html
;---------------------------------------------------------------
; rewritten by BLUE on 2003-02-16 for the Casio FX-870P/VX-4
; rewritten by BLUE on 2003-11-30 for the Casio VX-3
;---------------------------------------------------------------
; This is a port of Cosmic Fly, a PDS (public domain software)
; game created by Gernot Fink and published on Andreas Wichmann's
; homepage, to the FX-870P/VX-4/VX-3.
; The original version used BASIC + machine language and could
; only run from a fixed address (&h7000~), but this version is
; written entirely in machine language and can be reassembled
; to any address.
; Please allocate at least 1520 bytes of machine language area.
; Some modifications were made during porting, but the GAME
; itself is nearly identical to the original.
;
; Changed JP ($2) to JP $2 in RCS: so it assembles correctly
; on the HD61R041.
;---------------------------------------------------------------
FX870P:	EQU	1		;FX-870P
VX4:	EQU	2		;VX-4
VX3:	EQU	3		;VX-3
;---------------------------------------------------------------
; Model selection
;---------------------------------------------------------------
MODEL:	EQU	VX3		;Select VX3

#if (MODEL=FX870P)|(MODEL=VX4)
LEDTP:	EQU	&H123C		;LCD start address
IOBUF:	EQU	&H19D5		;SAVE/LOAD I/O buffer
;
DOTDS:	EQU	&H930F		;LCD refresh
BEEP:	EQU	&H33B3		;Generate BEEP sound
CLS:	EQU	&H2ADF		;Clear screen (equivalent to PRINT CHR$(12))
CROFF:	EQU	&H032E		;Cursor OFF (disable cursor display during KYIN)
KYIN:	EQU	&H03A4		;Standard key input routine (keycode returned in $0)
INKEY:	EQU	&H191D		;INKEY
BIOS2:	EQU	&H5323		;Stack value for calling BIOS (BANK0) and returning to BANK1
#if MODEL=FX870P
BASE:	EQU	0		;Program storage address (FX-870P)
#else
BASE:	EQU	&H1CD0		;Program storage address (FX-870P/VX-4)
#endif
#endif
#if MODEL=VX3
LEDTP:	EQU	&H6343		;LCD dot display buffer
IOBUF:	EQU	&H69CE		;SAVE/LOAD I/O buffer
;
KYIN:	EQU	&H03D1	;Standard key input routine (keycode returned in $0)
CROFF:	EQU	&H1FAE	;Cursor ON (disable cursor display during KYIN)
DOTDS:	EQU	&H1FD5		;LCD screen display
CLS:	EQU	&H31CF		;Clear screen (equivalent to PRINT CHR$(12))
INKEY:	EQU	&H194E		;INKEY$ processing
BEEP:	EQU	&H3A8B		;BEEP0
BIOS2:	EQU	&H5CA9		;Stack value for calling BIOS (BANK0) and returning to BANK1
BASE:	EQU	&H6CD0		;Program storage address
#endif

	ORG	BASE			;Relocate to match your environment
	START	MAIN
;-----------------------------------------------------
; MAIN routine
; Input: none
; Output: none
;-----------------------------------------------------
MAIN:
	PRE	IX,LEDTP+192*4		;Save work area (192 bytes)
	PRE	IY,LEDTP+192*5-1	;
	PRE	IZ,IOBUF		;Save destination = IOBUF
	BUP				;

	LDW	$0,SCORE		;Clear SCORE
	STW	0,($0)			;

TOP:
	LDW	$0,SHIPNUM		;Initialize remaining SHIPs
	ST	3,($0)			;(3 ships)
	CAL	SSH			;Initialize FLY data

	CAL	DISPTITLE		;Display TITLE
LOOP:
	CAL	INIT			;Initialize
	CAL	GAME			;GAME processing
	JR	Z,BASIC			;Return to BASIC on BRK input

	CAL	@BEEP			;SHIP destroyed sound (BEEP)
	CAL	@BEEP			;

	PRE	IZ,SHIPNUM		;Update remaining SHIPs
	SB	(IZ+$31),$30		;-1
	JR	NZ,LOOP			;

	PRE	IZ,SCORE		;Retrieve SCORE/HISCORE
	LDIW	$0,(IZ+$31)		;(SCORE)
	LDW	$2,(IZ+$31)		;(HISCORE)
	SBCW	$2,$0			;HISCORE < SCORE ?
	JR	NC,MAIN0		;
	STW	$0,(IZ+$31)		;Update HISCORE
MAIN0:
	CAL	RELOAD			;Restore work area data
	CAL	STATUS			;Display HI, SC, SHIP
	CAL	OVER			;GAME OVER processing
	JR	Z,TOP			;SPC input to replay

BASIC:
	CAL	RELOAD			;Restore work area data
	PST	UA,&H54			;Return to BASIC
	RTN				;(BANK0)

;-----------------------------------------------------
; Restore work area data
;-----------------------------------------------------
RELOAD:
	PRE	IZ,LEDTP+192*4		;Restore work area (192 bytes)
	PRE	IX,IOBUF		;Saved data location = IOBUF
	PRE	IY,IOBUF+191		;
	BUP				;
	RTN				;

;-----------------------------------------------------
; Screen and work area initialization
;-----------------------------------------------------
INIT:
	CAL	@CLS			;CLS

	PRE	IX,BOMBWK		;Clear BOMB WORK
	XRW	$0,$0			;
	LD	$2,8			;
WKCLR:	STIW	$0,(IX+$31)		;
	SB	$2,$30			;
	JR	NZ,WKCLR		;
	CAL	STATUS			;Display HI, SC, SHIP
	RTN

;-----------------------------------------------------
; SCORE/HI-SCORE/remaining ships display
;-----------------------------------------------------
STATUS:	PRE	IZ,LEDTP+192+126	;Display HI-SC
	LDW	$0,HI			;
	OR	$3,$30			;
	CAL	PRINT			;
	LDW	$0,HISCORE		;Display HISCORE
	LDW	$0,($0)			;
	PRE	IZ,LEDTP+&H161		;
	CAL	NUM			;

	PRE	IZ,LEDTP+(192*2)+126	;Display SC
	LDW	$0,SC			;
	CAL	PRINT			;
	LDW	$0,SCORE		;Display SCORE
	LDW	$0,($0)			;
	PRE	IZ,LEDTP+&H221		;
	CAL	NUM			;

	PRE	IZ,LEDTP+(192*3)+126	;Display SHIP
	LDW	$0,SH			;
	CAL	PRINT			;

	LDW	$0,SHIPNUM		;Get remaining ship count
	LD	$20,($0)		;
	AN	$20,$20			;If zero ships, display blank
	JR	Z,STR0			;
	PRE	IX,SHIPCHR		;Set SHIP display data
STR:
	LDM	$0,(IX+$31),6		;Display SHIP
	STIM	$0,(IZ+$31),6		;
	SB	$20,$30			;
	JR	NZ,STR			;
	RTN
STR0:
	XRM	$0,$0,6			;Clear display pattern
	STIM	$0,(IZ+$31),6		;Display blank
	RTN

;-----------------------------------------------------
; TITLE screen
;-----------------------------------------------------
DISPTITLE:
	CAL	@CLS			;CLS

	PRE	IZ,LEDTP		;Display TITLE1
	LDW	$0,TITLE1		;
	OR	$3,$30			;
	CAL	PRINT			;
	PRE	IZ,LEDTP+192		;Display TITLE2
	LDW	$0,TITLE2		;
	CAL	PRINT			;
	PRE	IZ,LEDTP+(192*2)	;Display TITLE3
	LDW	$0,TITLE3		;
	CAL	PRINT			;
	PRE	IZ,LEDTP+(192*3)	;Display TITLE4
	LDW	$0,TITLE4		;
	CAL	PRINT			;

	CAL	STATUS			;Display HI, SC, SHIP

	CAL	@BEEP			;BEEP

	CAL	@DOTDS			;DISPLAY LCD

	LDW	$0,SCORE		;Clear SCORE
	STW	0,($0)			;

;-----------------------------------------------------
; Wait for [EXE] key input
;-----------------------------------------------------
KEYWAIT:
#if 0
	LDW	$2,INKEY		;Execute INKEY$
	CAL	RCS			;
	SBC	$17,$31			;
	JR	Z,KEYWAIT		;

	LDW	$0,($15)		;Wait until [EXE] is pressed
#else
	LDW	$2,CROFF		;Cursor display OFF
	CAL	RCS			;

	LDW	$2,KYIN			;Execute KYIN
	CAL	RCS			;
#endif
	SBC	$0,&H0D			;
	JR	NZ,KEYWAIT		;
	RTN

;-----------------------------------------------------
; GAME OVER processing
;-----------------------------------------------------
OVER:
	PRE	IZ,LEDTP+200		;Display GAME OVER
	LDW	$0,GAMEOVER		;
	OR	$3,$30			;
	CAL	PRINT			;
	PRE	IZ,LEDTP+(192*2)+24	;Display KEY TITLE
	LDW	$0,KEYTITLE		;
	CAL	PRINT			;

	CAL	@DOTDS			;DISPLAY LCD

	CAL	KEYWAIT			;Wait until [EXE] is pressed
	RTN

;-----------------------------------------------------
; Game main processing
;-----------------------------------------------------
GAME:
;	XRW	$19,$19			;Initialize work area
	LD	$22,$31			;Initialize SCORE display request flag

	GPO	$0			;Read BEEP port data
	AN	$0,127			;
	OR	$0,64			;
	PST	PD,$0			;Set medium volume

	LDW	$27,&H2C00		;Set SHIP position initial value
	XRW	$24,$24			;
;	PST	IA,&H3D			;Set KEY scan code (for random number)
L1:	CAL	SHT			;Sound output processing
	SB	$29,$30			;
	JR	NZ,L1			;
	LD	$29,90			;Interval (MIN 70)

	CAL	KEY			;KEY input
	RTN	Z			;Exit on BRK

	AD	$17,$30			;FLY processing runs every 2nd scan
	ANC	$17,$30			;
	JR	Z,LO2			;
	CAL	FLY			;FLY movement
LO2:	CAL	SHIP			;SHIP movement

	ANC	$17,$30			;Screen update requested?
	JR	Z,LO1			;NO --> LO1

	CAL	@DOTDS			;DISPLAY LCD

	AN	$22,$22			;SCORE display requested?
	JR	Z,LO1			;NO --> LO1

	LDW	$0,SCORE		;Retrieve SCORE
	LDW	$0,($0)			;
	PRE	IZ,LEDTP+&H221		;Set SCORE display address
	CAL	NUM			;Display SCORE
	LD	$22,$31			;

LO1:	SBC	$28,255			;SHIP destroyed
	JR	NZ,L1			;NO --> LO1
	OR	$0,$30			;
	RTN

;-----------------------------------------------------
; KEY input processing
;-----------------------------------------------------
KEY:	PST	IA,5			;Set KEY scan code
	CAL	SCAN			;
	SBC	$0,&H04			;Left [4]
	JR	NZ,K1			;
	SBC	$28,$31			;End processing if coordinate is 0
	JR	Z,K1			;
	SB	$28,2			;

K1:	PST	IA,7			;Set KEY scan code
	CAL	SCAN			;
	SBC	$0,&H1			;Right [6]
	JR	NZ,K2			;
	SBC	$28,100			;
	JR	Z,K2			;
	AD	$28,2			;

K2:	PST	IA,9			;Set KEY scan code
	CAL	SCAN			;
	SBC	$0,&H04			;SHOT [0]
	JR	NZ,K3			;
	ANC	$25,255			;
	JR	NZ,K3			;
	LD	$27,$30			;

K3:	PST	IA,1			;Set KEY scan code
	CAL	SCAN			;
	SBC	$0,&H80			;Return non-zero if not BRK
	RTN	NZ			;
	XR	$0,$0			;Set zero flag if BRK pressed
	RTN

;-----------------------------------------------------
; Key scan processing
;-----------------------------------------------------
SCAN:	GRE	KY,$0			;Key input (1st read)
	GRE	KY,$1			;Key input (2nd read)
	SBC	$0,$1			;If (1)==(2), trust the input data
	JR	NZ,SCAN			;
	RTN

;-----------------------------------------------------
; SHIP movement / missile control
;-----------------------------------------------------
SHIP:	SBC	$28,255			;If SHIP is destroyed, end processing
	RTN	Z
	PRE	IX,LEDTP+&H23E		;Set LCD display address
	LDI	$0,(IX+$28)
	ANC	$27,7
	JR	Z,SH2
	XRC	$23,255
	JR	Z,SH2
	GRE	IX,$24
SH2:	PRE	IZ,SHIPG		;Set SHIP drawing data address
	LD	$0,13
SH1:	LD	$1,(IZ+$0)
	LD	$9,(IX+$0)
	AN	$9,248
	OR	$1,$9
	ST	$1,(IX+$0)
	SB	$0,$30
	JR	NZ,SH1
	LDW	$0,LEDTP-2
	SBCW	$24,$0
	JR	C,SH5
	LD	$0,255
	PRE	IX,$24
	LD	$2,(IX+7)
	SBC	$2,7
	JR	Z,SH8
	ANC	$2,255
SH8:	ST	$0,(IX+7)
	JR	NZ,TR
	SBC	$2,7
	LDW	$0,192
	ST	$1,(IX+199)
	SBW	$24,$0,JR SH4
SH5:	ANC	$25,255
	JR	Z,SH6
	PRE	IX,$24
	LD	$0,$31
	ST	$0,(IX+199)
SH6:	LD	$25,$31
SH4:	RTN

;-----------------------------------------------------
; FLY destruction processing
;-----------------------------------------------------
TR:	LD	$23,255			;Set FLY destroyed flag
	LDW	$16,$30
	LD	$22,$30			;Set SCORE update request

	LDW	$2,SCORE		;Retrieve SCORE
	LDW	$0,($2)			;
	ADBW	$0,$16			;Increment SCORE (+1)
	STW	$0,($2)			;Update SCORE

	LD	$25,$31			;
	ST	$25,(IX+199)		;
	LD	$27,5			;
	GRE	IX,$19			;Save FLY screen address
	PRE	IZ,CRASHG		;Set explosion data
CLEX:	LD	$0,12
T1:	LDI	$1,(IZ+$31)		;Display FLY explosion pattern
	STI	$1,(IX+$31)		;
	LD	$1,(IZ+11)		;
	ST	$1,(IX+191)		;
	SB	$0,$30
	JR	NZ,T1
	RTN

;-----------------------------------------------------
; Sound output
;-----------------------------------------------------
SHT:	GPO	$2			;Read current port state
	LDW	$0,4
	ANC	$27,255			;Normal sound output
	JR	Z,W2
	SBW	$26,$0
	SBC	$23,255			;FLY explosion sound?
	JR	Z,W4
	ANC	$26,$23
	JR	Z,W1
W4:	XR	$2,192			;Toggle port (produce sound)
	PST	PD,$2
W1:	RTN

W2:	LD	$23,&H21
	ANC	$20,255
	JR	Z,NC1
	PRE	IZ,SHIPWK		;Draw zero pattern (&H739E)
	PRE	IX,$19			;Set FLY screen address
	CAL	CLEX
	LD	$20,$31
NC1:	RTN

;-----------------------------------------------------
; FLY movement / BOMB control
;-----------------------------------------------------
FLY:	LD	$13,8			;Load FLY count (MAX 8)
	LDW	$14,FLYDAT		;Set FLY data area pointer
	LD	$12,$31			;
Y1:	LDW	$2,($14)
	CAL	SHAPE			;Erase FLY
	ADW	$14,$30			;Update FLY work address
	ADW	$14,$30
	SB	$13,$30			;Repeat until all FLYs processed
	JR	NZ,Y1

;	CAL	BOMB
	CAL	BOMB			;BOMB processing

	LD	$13,8			;Load FLY count
	LDW	$14,FLYDAT		;Set FLY data area pointer &HC0
	LD	$10,$31

Y2:	PRE	IX,$14			;IX = FLY data area pointer

	GRE	KY,$0			;Use KEY register as random seed
	LD	$0,$31			;

	LD	$11,(IX+$31)		;$11 = FLY coordinate
	SBC	$28,$11			;
	JR	C,NORE			;

	LD	$0,2			;$0 = 2

NORE:	GST	TM,$11			;$11 = (TM xor FLY counter) and 5
	XR	$11,$13			;
	AN	$11,5			;
	JR	Z,ZIEL			;
	LD	$0,$1			;$0 = $1 (key code)

ZIEL:	AN	$0,2			;Extract BIT<1> (0 or 2)
	LD	$1,(IX+$31)		;$1 = FLY coordinate
	XRC	$1,255			;FLY destroyed?
	JR	Z,Y3			;Go to next FLY

	LD	$10,$30			;$10 = 1
	SBC	$1,100			;FLY coordinate < 100?
	JR	NC,Y4			;
	AD	(IX+$31),$0		;Update FLY coordinate +2 (or 0)

Y4:	LD	$0,$30			;$0 = 1
	ANC	$1,255			;FLY at screen edge ($1 = 255)?
	JR	Z,Y5			;YES --> Y5
	SB	(IX+$31),$0		;Update FLY coordinate -2 (or 0)

Y5:	LD	$1,(IX+$30)		;$1 = FLY status
	ANC	$1,255			;FLY destroyed
	JR	Z,B3			;
	SB	(IX+$30),$0		;

B3:	GST	TM,$0			;$0 = TM register
	XR	$0,$8			;
	AN	$0,$30			;
	BIU	$0			;
	LD	$1,(IX+$30)		;$1 = FLY status
	SBC	$1,15			;$1 > 15
	JR	NC,B2			;
	AD	(IX+$30),$0		;
B2:	LDW	$2,($14)		;
	LD	$12,255			;
	CAL	SHAPE			;

Y3:	ADW	$14,$30			;Update FLY work address
	ADW	$14,$30			;

	SB	$13,$30			;FLY count -1
	JR	NZ,Y2

	ANC	$10,$30			;No FLYs remaining
	JR	Z,SSH			;Initialize FLY work data
	RTN

;-----------------------------------------------------
; FLY coordinate initialization
;-----------------------------------------------------
SSH:	PRE	IX,FLYDAT		;Set FLY work start pointer
	LD	$10,16			;Work bytes = 16

SSH1:	LD	$0,(IX+16)		;Transfer 1 byte
	STI	$0,(IX+$31)		;

	SB	$10,$30			;Transfer complete
	JR	NZ,SSH1
	RTN

;-----------------------------------------------------
; FLY display processing
;-----------------------------------------------------
SHAPE:	LD	$9,$31			;$9 = 0

	XRC	$2,255			;Processing requested
	JR	Z,NOSH			;

	LD	$0,$3			;$0 = FLY status (Y coordinate)
	AN	$0,7			;Mask (07h)

	AN	$2,127			;FLY X coordinate mask (7Fh)
	LD	$1,$3			;$1 = FLY status
	PRE	IX,LEDTP-1		;Set LCD screen start address (&H6200)

S1:	ANC	$1,&H18			;Status BIT<4>=0 and BIT<0>=0?
	JR	Z,S2			;

	LDI	$4,(IX+191)		;Update screen address (IX=IX+192)
	SB	$1,8,JR S1		;Update status (-8)

S2:	LDI	$4,(IX+$2)		;Display FLY
	PRE	IZ,FLYG			;
	LD	$4,5
S3:	LD	$6,(IZ+$4)
	LD	$5,$31
	LD	$8,$0

	XRC	$12,$31
	JR	Z,S5

S4:	ANC	$8,7
	JR	Z,S5
	BIDW	$6
	SB	$8,$30,JR S4

S5:	LD	$8,(IX+$31)		;
	XR	$8,$6			;
	AN	$8,$12			;
	ST	$8,(IX+$31)		;
	LD	$8,(IX+192)		;

	SBC	$8,&HAA
	JR	NZ,SHA1

	LD	$12,15			;Set FLY destroyed
	LD	$9,255			;
	ST	$9,($14)		;

SHA1:	XR	$8,$5
	AN	$8,$12

	ST	$8,(IX+192)
	LDI	$8,(IX+$31)

	SB	$4,$30
	JR	NZ,S3
NOSH:	RTN

;-----------------------------------------------------
; BOMB processing
;-----------------------------------------------------
BOMB:	LDW	$0,BOMBWK		;FLYDATA+&H20;&H73E0
	AD	$21,$30			;Update FLY counter
	LD	$2,8			;BOMB count (MAX 15)

B1:	LDW	$6,($0)			;Read BOMB coordinates
	ANC	$6,255			;If not at screen edge, go to draw (B9)
	JR	NZ,B9			;

	LDW	$3,FLYDAT		;Load FLY coordinates (&H73C0)
	LD	$5,$21			;Assign FLY counter value
	AD	$21,$30			;+1 (update counter)
	AN	$5,7			;$5 = $5 MOD 7
	BIU	$5			;*2
	OR	$3,$5			;&H73C0+(0,2,4,..,14)
	LDW	$3,($3)			;Read FLY coordinates

	SBC	$3,255			;If FLY destroyed, go to next BOMB
	JR	Z,B8			;

	OR	$3,$30			;$3 = $3 or 1
	STW	$3,($0)			;Update work area contents
	LDW	$6,$3			;Provide updated coordinates

B9:	LD	$3,$7			;BOMB display processing
	PRE	IX,LEDTP-1		;&H6200
	LDI	$8,(IX+$6)		;Read BOMB coordinate data
	LD	$6,128			;

B4:	AN	$3,7			;
	JR	Z,B12			;
	BID	$6			;
	SB	$3,$30,JR B4		;

B12:	SBC	$7,30			;
	JR	NZ,B6			;

	LD	$6,7			;BOMB launch sound
	CAL	SB			;

B6:	AN	$7,&H18			;
	JR	Z,B7			;

	LDI	$3,(IX+191)
	SB	$7,8,JR B6

B7:	ST	$6,(IX+2)
	AN	$6,127
	JR	NZ,B10
	ST	$6,(IX-190)
B10:	LDW	$6,($0)
	AD	$7,$30
	STW	$6,($0)
	SBC	$7,32
	JR	C,B8
	LD	$3,$31
	ST	$3,(IX+2)

	SB	$6,$28			;SHIP destroyed?
	SB	$6,9			;
	JR	NC,B11			;NO-->B11
	LD	$28,255			;Set SHIP destroyed

B11:	XRW	$6,$6			;Clear BOMB work
	STW	$6,($0)			;

B8:	ADW	$0,$30			;Update work address
	ADW	$0,$30			;

	SB	$2,$30			;BOMB count -1
	JP	NC,B1
	RTN

;-----------------------------------------------------
; BOMB sound output processing
;-----------------------------------------------------
SB:	LD	$12,3			;Sound output processing
SB1:	GPO	$13			;
	XR	$13,192			;Toggle sound state
	PST	PD,$13			;
	SB	$12,$30			;Repeat for the set number of times
	JR	NZ,SB1			;
	RTN

;-----------------------------------------------------
; SCORE display
; Uses FONT data at the start of BANK2 to display the score
; Input: IZ = LCD display start address
;-----------------------------------------------------
NUM:
	GST	UA,$2			;Save BANK
	PST	UA,&H65			;Set BANK 2 (IX)
	LD	$3,4			;Set display digits (5 digits)
LL:
	PRE	IX,&H10*6		;Set numeric FONT base address
	LD	$4,$1			;Extract most significant digit
	AN	$4,&HF0			;

	BID	$4			;Calculate font address
	LD	$5,$4			;
	BID	$5			;
	BID	$5			;
	SB	$4,$5			;

	LDM	$5,(IX+$4),6		;Display font
	STIM	$5,(IZ+$31),6		;

	DIUW	$0			;Shift down one digit
	SB	$3,$30			;
	JR	NC,LL			;

	PST	UA,$2			;Restore BANK
	RTN

;-----------------------------------------------------
; PRINT routine
; Displays a string specified by ($0) on the LCD screen
; starting from IZ.
; Input: $0,$1 = string pointer
;        $3 = character inversion (non-zero: NORMAL, 0: inverted)
;        IZ = LCD display pointer
; Destroyed registers: IZ, IX, $0-$8
;-----------------------------------------------------
PRINT:
PRL:
	LD	$4,($0)			;Get one character
	AN	$4,$4			;End if NULL
	JR	Z,PREND			;

	SB	$4,&H20			;Adjust character code

	LD	$5,$31			;Calculate font address
	BIUW	$4			;*2 (double)
	LDW	$6,$4			;
	BIUW	$6			;*2 (quadruple)
	ADW	$4,$6			;(create 6x multiplier)
	PRE	IX,$4			;Set FONT address

	GST	UA,$2			;Save BANK
	PST	UA,&H65			;Set BANK 2 (IX)
	LDM	$4,(IX+$31),6		;Read FONT data
	PST	UA,$2			;Restore BANK

	STIM	$4,(IZ+$31),6		;Display FONT

	ADW	$0,$30			;Update string pointer
	JR	PRL			;
PREND:
	RTN

;-----------------------------------------------------
; CLS
;-----------------------------------------------------
@CLS:
	LDW	$2,CLS			;CLS
	JR	RCS			;

;-----------------------------------------------------
; Generate BEEP
;-----------------------------------------------------
@BEEP:
	LDW	$2,BEEP			;BEEP
	JR	RCS			;

;-----------------------------------------------------
; LCD refresh
;-----------------------------------------------------
@DOTDS:
	LDW	$2,DOTDS		;DISPLAY LCD

;-----------------------------------------------------
; BIOS routine call processing
;-----------------------------------------------------
RCS:	LDW	$0,BIOS2
	PHSW	$1
	PST	UA,&H54
	JP	$2

;-----------------------------------------------------
; Work area / variables
;-----------------------------------------------------
SHIPNUM:DB	0			;Remaining ship count work
SCORE:	DW	0			;SCORE data
HISCORE:DW	0			;HI-SCORE data

;-----------------------------------------------------
; Display strings
;-----------------------------------------------------
TITLE1:	DB	"## Cosmic Fly ##",0
TITLE2:	DB	"Key Function",0
TITLE3:	DB	"Left[4] Right[6]",0
TITLE4:	DB	"Shot[0] Start[EXE]",0
GAMEOVER:DB	"** GAME OVER **",0
KEYTITLE:DB	"PUSH [EXE]",0
HI:	DB	"HI-SC:",0
SC:	DB	"SCORE:",0
SH:	DB	"SHIP :",0
SHIPCHR:DB	&H04,&H0C,&H1C,&H0C,&H04,&H00	;SHIP character

;-----------------------------------------------------
; FLY & BOMB display data / work area
;-----------------------------------------------------
;Data must be stored on a 16-byte aligned boundary
GDATA:	ORG	(GDATA+16)#&HFFF0
SHIPG:	DB	0,0,0,&H01,&H03,&H03,&H03,&H07,&H03,&H03,&H03,&H01,&H00
FLYG:	DB	0,&HC0,&HD0,&H20,&HD0,&HC0,&H00,&H00,&H00
CRASHG:	DB	&H51,&H0A,&HA5,&H8F,&H46,&HAA,&H49,&HAA,&H8F,&HA5,&H0A,&H51
	DB	&H8A,&H50,&HA5,&HF2,&H4E,&HAA,&H4B,&HAA,&HF2,&HA5,&H50,&H8A
SHIPWK:	DB	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
	DS	10
FLYDAT:	DB	&H00,&H01,&H18,&H03,&H38,&H07,&H58,&H03
	DB	&H00,&H11,&H18,&H12,&H38,&H13,&H58,&H14
	DB	&H00,&H01,&H18,&H03,&H38,&H07,&H58,&H03
	DB	&H00,&H10,&H18,&H10,&H38,&H10,&H58,&H10
BOMBWK:	DB	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
	DB	0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0