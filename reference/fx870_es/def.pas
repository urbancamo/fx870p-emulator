{ common stuff, CPU registers, memory }

unit Def;

interface

  type
    ptrb = ^byte;		{ unsigned 8-bit }
    ptrw = ^word;		{ unsigned 16-bit }
    nibble = byte;		{ it should be ensured that any returned or
				  stored data of this type have upper four
				  bits cleared }

    mem_properties = record
      storage: PChar;
      first: integer;
      last: integer;
      offset: integer;
      memorg: integer; { 0 if 8-bit memory access, 1 if 16-bit memory access }
      writable: boolean;
      required: boolean;
      filename: string[12];	{ name of associated file }
    end;

  const

{ status bits of the Flag Register F }
    Z_bit	= $80;
    C_bit	= $40;
    LZ_bit	= $20;
    UZ_bit	= $10;
    SW_bit	= $08;
    APO_bit	= $04;

    MEMORIES = 4;	{ number of entries in the memdef table }

{ indexes to the memdef table }
    ROM0 = 0;
    RAM0 = 2;

    INTVECTORS = 5;

    INT1_bit = $10;
    KEYPULSE_bit = $08;
    INT2_bit = $04;
    MINTIMER_bit = $02;
    ONINT_bit = $01;

    intmask: array[0..INTVECTORS-1] of byte = (
      INT1_bit, KEYPULSE_bit, INT2_bit, MINTIMER_bit, ONINT_bit );

{ iterrupt vectors corresponding to the bits 7..3 of the ie/ifl register }
    intvec: array[0..INTVECTORS-1] of word = (
	$0072,		{ INT1 }
	$0062,		{ KEY/Pulse }
	$0052,		{ INT2 }
	$0042,		{ One-minute timer }
	$0032) ;	{ ON }

{ bits of the LCD control port }
    VDD2_bit	= $80;
    CLK_bit	= $40;
    CE2_bit	= $04;
    CE1_bit	= $02;
    OP_bit	= $01;
    LCDCE	= (CE1_bit or CE2_bit);

    XTAL	= 921;	{ nominal CPU clock frequency in kHz }

{ free adress space, number of bytes determined by the function FetchOpcode }
    dummysrc: array[0..3] of byte = ( $FF, $FF, $FF, $FF );

    memdef: array[0..MEMORIES-1] of mem_properties = (
      (	storage:	nil;
	first:		$00000;
	last:		$00C00;
	offset:		$00000;
	memorg:		1;
	writable:	False;
        required:	True;
	filename:	'rom0.bin' ),
      (	storage:	nil;
	first:		$00C00;
	last:		$10000;
	offset:		$00C00;
	memorg:		0;
	writable:	False;
	required:	True;
	filename:	'rom1.bin' ),
      (	storage:	nil;
	first:		$10000;
	last:		$20000;
	offset:		$00000;
	memorg:		0;
	writable:	True;
	required:	False;
	filename:	'ram0.bin' ),
      (	storage:	nil;
	first:		$20000;
	last:		$30000;
	offset:		$10000;
	memorg:		0;
	writable:	False;
	required:	True;
	filename:	'rom1.bin' )
    );

  var
{ 5-bit registers }
    sx, sy, sz: byte;

{ 8-bit registers, PD and PE are in the Port unit }
    mr: array[0..35] of byte;	{ main register file + saved/loaded SSP, USP }
    ib: byte;
    ua: byte;
    ia: byte;
    ie: byte;
    tm: byte;
    flag: byte;

{ 16-bit registers }
    ix, iy, iz: word;
    us: word;
    ss: word;
    pc: word;
    ky: word;			{ IRQ1/IRQ2 interrupts can be triggered by
				  changing the bits 11/10 of the KY register }

    iserv: byte;		{ interrupt service flags }
    delayed_ua: byte;		{ copy of the UA register, delayed by one
				  instruction cycle }
    delayed_ky: word;		{ copy of the KY register, delayed by one
				  instruction cycle }

    dummydst: byte;		{ free address space }
    opforg: integer;		{ opcode fetch memory access mode }
    opcode: array[0..3] of byte;
    opindex: integer;		{ index to the opcode table }
    cycles: integer;		{ counter of the clock pulses }
    acycles: integer;		{ clock pulse counter accumulator }
    speed: integer;		{ 0 for fast mode, 4 for slow mode }
    procptr: array[0..7] of pointer;
				{ list of pointers to procedures that should be
				  executed after a machine code instruction,
				  usually to complete an I/O register write
				  cycle }
    procindex: integer;		{ index to the procptr array }
    OscFreq: integer;		{ CPU clock frequency in kHz }
    CpuStop: boolean;		{ True stops the CPU, used in the debug mode }
    CpuDelay: integer;		{ delay after hiding the Debug Window,
				  prevents the program from crashing when the
				  Debug Window was made visible too early }
    CpuSleep : boolean;		{ True if the CPU in the power-off state, can
				  be waken up by an interrupt }
    CpuSteps: integer;		{ ignored when < 0 }
    BreakPoint: integer;	{ ignored when < 0 }
    Option2: integer;		{ state of the PAD3/PAD4 jumpers }
    dos_path: string;		{ path to the contents of the simulated floppy
				  disk }


  function Addr18 (segment: byte; offset: word) : integer;
  function SrcPtr (address: integer) : ptrb;
  function DstPtr (address: integer) : ptrb;
  function FetchByte: byte;
  function FetchOpcode: byte;
  function FindMem (address: integer) : integer;
  function FirstAddr (mem_area: integer) : integer;
  function LastAddr (mem_area: integer) : integer;
  procedure IntToBytes (x: integer; dst: ptrb; bytes: integer);
  function BytesToInt (src: ptrb; bytes: integer) : integer;


implementation

uses Port, Fdd;


{ converts the bank + 16-bit address to the 18-bit address }
function Addr18 (segment: byte; offset: word) : integer;
begin
  if offset < ((ib shl 8) and $C000) then
    segment := 0;		{ UA invalid, bank 0 selected }
  Addr18 := integer(cardinal(offset) + (cardinal(segment and 3) shl 16));
end {Addr18};


var srcorg: integer;

{ returns pointer to a read-type resource at specified 18-bit address,
  returns memory access mode for this address in the srcorg variable }
function SrcPtr (address: integer) : ptrb;
var
  i: integer;
begin
  if (address and $FFFF0) = $30000 then
    SrcPtr := IoRdPtr (address and 7)
  else if (address and $FFFFE) = $3FFFE then
    SrcPtr := FddRdPtr (address and 1)
  else
  begin
    for i:=0 to MEMORIES-1 do
    begin
      with memdef[i] do
      begin
        if (address >= first) and (address < last) then
        begin
          SrcPtr := ptrb(storage + ((address - first) shl memorg));
          srcorg := memorg;
          exit;
        end {if};
      end {with};
    end {for};
    SrcPtr := ptrb(@dummysrc);
  end {if};
  srcorg := 0;
end {SrcPtr};


{ returns pointer to a write-type resource at specified 18-bit address }
function DstPtr (address: integer) : ptrb;
var
  i: integer;
begin
  if (address and $FFFF0) = $30000 then
    DstPtr := IoWrPtr (address and 7)
  else if (address and $FFFFC) = $3FFFC then
    DstPtr := FddWrPtr (address and 3)
  else if (address and $38000) = $38000 then
    DstPtr := @PrinterData
  else
  begin
    for i:=0 to MEMORIES-1 do
    begin
      with memdef[i] do
      begin
        if writable and (address >= first) and (address < last) then
        begin
          DstPtr := ptrb(storage + ((address - first) shl memorg));
          exit;
        end {if};
      end {with};
    end {for};
    DstPtr := ptrb(@dummydst);
  end {if};
end {DstPtr};


function FetchByte: byte;
begin
  FetchByte := opcode[opindex];
  if (opforg = 0) then
  begin
    Inc (pc);
    Inc (cycles, 3);
  end
  else if Odd(opindex) then Inc (pc)
  else Inc (cycles, 4);
  Inc (opindex);
end {FetchByte};


function FetchOpcode: byte;
var
  ua1: word;
begin
  if iserv = 0 then ua1 := delayed_ua else ua1 := 0;
  delayed_ua := ua;
  opcode[0] := SrcPtr(Addr18 (ua1, pc))^;
  opforg := srcorg;
  if srcorg = 0 then
  begin
    opcode[1] := SrcPtr(Addr18 (ua1, pc+1))^;
    opcode[2] := SrcPtr(Addr18 (ua1, pc+2))^;
    opcode[3] := SrcPtr(Addr18 (ua1, pc+3))^;
  end
  else
  begin
    ptrw(@opcode[0])^ := ptrw(SrcPtr(Addr18 (ua1, pc)))^;
    ptrw(@opcode[2])^ := ptrw(SrcPtr(Addr18 (ua1, pc+1)))^;
  end {if};
  opindex := 0;
  FetchOpcode := FetchByte;
end {FetchOpcode};


{ Functions used by the debugger }

{ locates the memory area in the memdef table matching the specified 18-bit
 address, or -1 if not found }
function FindMem (address: integer) : integer;
begin
  for result:=0 to MEMORIES-1 do
  begin
    with memdef[result] do
    begin
      if (address >= first) and (address < last) then Exit;
    end {with};
  end {for};
{ not found }
  result := -1;
end {FindMem};


{ lowest address in a memory area }
function FirstAddr (mem_area: integer) : integer;
begin
  FirstAddr := memdef[mem_area].first;
end {FirstAddr};


{ highest address in a memory area }
function LastAddr (mem_area: integer) : integer;
begin
  LastAddr := memdef[mem_area].last;
end {LastAddr};


{ conversion of an integer number to an array of bytes, little endian order }
procedure IntToBytes (x: integer; dst: ptrb; bytes: integer);
begin
  while bytes > 0 do
  begin
    dst^ := Byte(x);
    x := x shr 8;
    Inc(dst);
    Dec(bytes);
  end {while};
end {IntToBytes};


{ conversion of an array of bytes to an integer number, little endian order }
function BytesToInt (src: ptrb; bytes: integer) : integer;
begin
  Result := 0;
  Inc(src, bytes);
  while bytes > 0 do
  begin
    Dec(src);
    Dec(bytes);
    Result := Result shl 8;
    Result := Result + Integer(Cardinal(src^));
  end {while};
end {BytesToInt};

end.
