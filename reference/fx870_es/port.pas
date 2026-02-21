{ 8-bit port and external peripheral devices }

unit Port;

interface

  var
    pd, pe, pdi: byte;
    PrinterData: byte;
    SerialRate: integer = 10000;	{ value not important, but not 0 }

  function ReadPd : byte;
  procedure WritePd;
  procedure IoInit;
  procedure IoClose;
  function IoWrPtr (index: integer) : pointer;
  function IoRdPtr (index: integer) : pointer;
  procedure OnSerialTick;

implementation

  uses Def, Cpu, Comm;

var
  ga_rd: array[0..7] of byte;	{read-only and read/write registers}
  ga_wr2, ga_wr3, ga_wr6: byte;	{write-only registers}
  latched5: byte;		{follows the ga_rd[5] state when TX is idle,
				 otherwise holds the state at the instant of
				 writing to the TX data register}
  SerialLength: integer = 0;
  TxCounter: integer = 0;
  RxCounter: integer = 0;
  RxData: integer;
  OldPort: byte;
  LineCounter: integer = 0;	{counter of transmitted pairs of characters}

function GetPort: byte;
begin
  GetPort := (pd and pe) or (pdi and not pe);
end {GetPort};


function ReadPd : byte;
begin
  ReadPd := GetPort;
end {ReadPd};


procedure WritePd;
var
  x: byte;
begin
  x := GetPort;
  if ((x and $08) <> 0) and ((OldPort and $08) = 0) then
{ Printer Strobe has changed from 0 to 1 }
  begin
    CommWrite (PrinterData);
  end {if};
  OldPort := x;
end {WritePd};


procedure IoInit;
begin
  pdi := pdi and $DF;		{Printer always Ready}
  OldPort := GetPort;
  ga_rd[0] := $FF;
  ga_rd[1] := $FF;
  ga_rd[2] := 0;
  ga_rd[3] := $05;
  ga_rd[4] := 0;
  ga_rd[5] := $FF;
  latched5 := ga_rd[5];
  ga_rd[6] := 0;
  ga_rd[7] := $FF;
  ga_wr3 := 0;
  ga_wr6 := 0;
end {IoInit};


procedure IoClose;
begin
end {IoClose};


procedure OnWriteDataReg;
begin
  if (ga_rd[4] and $80) <> 0 then	{transmitter enabled}
  begin
    ga_rd[3] := ga_rd[3] and $FE;	{TX buffer full}
    latched5 := ga_rd[5];
    TxCounter := SerialLength;
  end {if};
end {OnWriteDataReg};


procedure OnReadDataReg;
begin
  ga_rd[3] := ga_rd[3] and $C5;	{clear the errors and the RX buffer full flag}
  ky := ky or $0800;		{release INT1}
end {OnReadDataReg};


procedure BaudRateSetting;
const
  baud_div: array[0..7] of integer = (
	(1000 * XTAL ) div 9600,
	(1000 * XTAL ) div 4800,
	(1000 * XTAL ) div 2400,
	(1000 * XTAL ) div 1200,
	(1000 * XTAL ) div 600,
	(1000 * XTAL ) div 300,
	(1000 * XTAL ) div 150,
	(1000 * XTAL ) div 75 );
begin
  if ((ga_rd[5] and $04) <> 0)		{MT}
  and ((ga_rd[4] and $40) <> 0)		{receiver enabled}
  then SerialRate := baud_div[3 + ((ga_rd[4] shr 4) and $02)]
  else SerialRate := baud_div[ga_rd[4] and 7];
  if (ga_rd[3] and $01) <> 0		{transmitter ready}
  then latched5 := ga_rd[5];
  LineCounter := 0;
end {BaudRateSetting};


procedure LengthSetting;
begin
  if (ga_wr3 and $40) <> 0 then
  begin
    SerialLength := 9;	{ 1 start bit + 7 data bits + 1 stop bit }
    if (ga_wr3 and $04) <> 0 then Inc(SerialLength);	{ 8 data bits }
    if (ga_wr3 and $10) <> 0 then Inc(SerialLength);	{ 1 parity bit }
    if (ga_wr3 and $80) <> 0 then Inc(SerialLength);	{ 2 stop bits }
    LineCounter := 0;
  end {if};
end {LengthSetting};


function IoWrPtr (index: integer) : pointer;
begin
  index := index and 7;
  case index of
    2: begin
         IoWrPtr := @ga_wr2;
         procptr[procindex] := @OnWriteDataReg;
         Inc(procindex);
       end;
    3: begin
         IoWrPtr := @ga_wr3;
         procptr[procindex] := @LengthSetting;
         Inc(procindex);
       end;
    4, 5: begin
         IoWrPtr := @ga_rd[index];
         procptr[procindex] := @BaudRateSetting;
         Inc(procindex);
       end;
    7: IoWrPtr := @ga_rd[7];
  else
    IoWrPtr := @dummydst;
  end {case};
end {IoWrPtr};


function IoRdPtr (index: integer) : pointer;
begin
  IoRdPtr := @ga_rd[index and 7];
  if index = 2 then
  begin
    procptr[procindex] := @OnReadDataReg;
    Inc(procindex);
  end {if};
end {IoRdPtr};


{ computes the parity of the byte x }
function Parity (x: byte) : byte;
begin
  x := x xor (x shr 4);
  x := x xor (x shl 2);
  x := x xor (x shl 1);
  Parity := x and $08;			{bit 3 = parity}
end {Parity};


procedure MtWrite;
var
  x: byte;
begin
  if LineCounter = 0 then
  begin
    CommWrite ($0D);
    CommWrite ($0A);
  end {if};
  if (ga_rd[3] and $01) = 0 then	{TX buffer full}
  begin					{data transmission}
    x := ga_wr2;
{ conversion of data byte x to character pair,
  first character: 43210* + $30, second character: ##P765 + 0x30
  where: * is the start bit, # is the stop bit, P is the parity bit }
    CommWrite (((x and $1F) shl 1) + $30);
    CommWrite (((x and $E0) shr 5) + Parity (x) + $60);
    ga_rd[3] := ga_rd[3] or $01;
    latched5 := ga_rd[5];
  end
  else					{TX buffer empty}
  begin					{leader transmission}
    CommWrite ($6F);
    CommWrite ($6F);
  end {if};
  Inc(LineCounter);
  if LineCounter > 32 then LineCounter := 0;
end {MtWrite};


function MtRead: integer;
var
  x1, x2: integer;
begin
  MtRead := -1;				{no data}
  ga_rd[6] := ga_rd[6] and $FE;		{no valid carrier}
  repeat
    repeat
      x1 := CommRead;
      if x1 < 0 then Exit;
    until (x1 >= $30) and (x1 <= $6F);
    x2 := CommRead;
    if x2 < 0 then Exit;
  until (x2 >= $30) and (x2 <= $6F);
{valid character pair received}
  if (x1 and $01) = 0 then		{start bit present}
  begin
    x1 := ((x1 - $30) shr 1) or ((x2 and $07) shl 5);
    MtRead := x1;			{valid data byte}
    if Parity (byte(x1)) <> byte(x2 and $08)
    then ga_rd[3] := ga_rd[3] or $08;	{parity error}
  end
  else
  begin
    MtRead := $100;
    if (x1 = $6F) and (x2 = $6F)	{leader tone}
    then ga_rd[6] := ga_rd[6] or $01;	{valid carrier}
  end {if};
end {MtRead};


{ called at the serial bit rate }
procedure OnSerialTick;
begin
  if (TxCounter = 0)
  and ((ga_rd[4] and $80) <> 0)		{transmitter enabled}
  and ((ga_rd[5] and $04) <> 0)		{MT}
  then TxCounter := SerialLength;	{continous transmission}

  if TxCounter > 0 then
  begin
    Dec(TxCounter);
    if TxCounter = 0 then
    begin
      if (latched5 and $04) = 0	then	{RS232}
      begin
        CommWrite (ga_wr2);
        ga_rd[3] := ga_rd[3] or $01;	{transmitter ready}
        latched5 := ga_rd[5];
      end
      else MtWrite;
    end {if};
  end {if};

  if (ga_rd[4] and $50) = $40 then	{receiver enabled, no MT}
  begin
    if RxCounter = 0 then
    begin
      if (ga_rd[5] and $04) = 0		{RS232}
      then RxData := CommRead
      else RxData := MtRead;
      if RxData >= 0 then RxCounter := SerialLength;
    end {if};
    if RxCounter > 0 then
    begin
      Dec(RxCounter);
      if (RxCounter = 0) and (RxData <= $FF {not MT leader}) then
      begin
        ga_rd[2] := byte(RxData);
        ky := ky and not $0800;		{trigger INT1}
        if (ga_rd[3] and $02) = 0 then
          ga_rd[3] := ga_rd[3] or $02	{RX buffer full}
        else
          ga_rd[3] := ga_rd[3] or $10;	{overrun error}
      end {if};
    end {if};
  end {if};
end {OnSerialTick};

end.

