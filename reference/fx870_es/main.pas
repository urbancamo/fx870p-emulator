{ To reduce flicker on older computers, the application draws on the screen
 outside of OnPaint events, which is against the rules but somehow used to
 work. However, it's not more the case with newer versions of compilers. As
 a workaround, all instances of MainForm.Canvas.Draw outside the FormPaint
 procedure can be replaced with MainForm.Invalidate as marked in the script. }

unit Main;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms,
  Dialogs, ExtCtrls, StdCtrls, IniFiles, ThdTimer;

type
  TMainForm = class(TForm)
    RunTimer: TThreadedTimer;
    RefreshTimer: TTimer;
    SecTimer: TTimer;
    procedure OnRunTimer(Sender: TObject);
    procedure OnRefreshTimer(Sender: TObject);
    procedure OnSecTimer(Sender: TObject);
    procedure FormMouseDown(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Integer);
    procedure FormMouseUp(Sender: TObject; Button: TMouseButton;
      Shift: TShiftState; X, Y: Integer);
    procedure FormMouseMove(Sender: TObject; Shift: TShiftState; X,
      Y: Integer);
    procedure FormShow(Sender: TObject);
    procedure FormCreate(Sender: TObject);
    procedure FormClose(Sender: TObject; var CloseAction: TCloseAction);
    procedure FormKeyPress(Sender: TObject; var Key: Char);
    procedure FormKeyDown(Sender: TObject; var Key: Word;
      Shift: TShiftState);
    procedure FormKeyUp(Sender: TObject; var Key: Word;
      Shift: TShiftState);
    procedure FormPaint(Sender: TObject);
    procedure FormDeactivate(Sender: TObject);
    procedure ApplicationDeactivate(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
    MainForm: TMainForm;

implementation

{$R *.dfm}

uses
    Def, Cpu, Debug, Keyboard, Lcd, Port, Comm, Fdd;

const
    FaceName: string = 'face.bmp';
    KeysName: string = 'keys.bmp';
    ChrName: string = 'charset.bin';
    IniName: string = 'fx870.ini';
    RegName: string = 'register.bin';
    LoadMsg: string = 'Failed to load the file ';
    SaveMsg: string = 'Failed to save the file ';

var
    BitMap, Face, LcdBmp, KeyBmp: TBitMap;
    RedrawReq: boolean;		{ true if the LcdBmp image has changed and
				  needs to be redrawn }
    MyPath: string;		{ path to the application directory }

{ LCD }
    BkColor: TColor = clWhite;
    ScrMem: array[0..LCDSIZE-1] of nibble; { shadow LCD data memory }
    ScrCtrl: byte;			{ shadow LCD control register }

{ CPU }
    CpuSpeed: integer;		{ how many instructions executes the emulated
				  CPU at each RunTimer event call }
    OnCounter: integer = 0;
    PulseCounter: integer = 0;
    RunTimerFrequency: integer;

{ Serial Port }
    SerialCounter: integer = 0;


procedure ResetAll;
begin
  lcdctrl := 0;
  LcdInit;
  if Option2 = 0 then pdi := $EF else pdi := $FF;
  pe := $00;
  IoInit;
  CpuReset;
end {ResetAll};


{ draws the image of a key from the KeyBmp }
procedure DrawKey (index, x, y: integer; pressed: boolean);
var
  offset: word;
begin
  with keypad[index] do
  begin
    BitMap.Width := W;
    BitMap.Height := H;
    if (pressed) then offset := 0 else offset := W;
    BitMap.Canvas.Draw (-OX - offset, -OY, KeyBmp);
  end {with};
  BitMap.TransparentColor := $00FFFFFF;
  BitMap.Transparent := True;
  Face.Canvas.Draw (x, y, BitMap);
  BitMap.Transparent := False;
  BitMap.Canvas.Draw (-x, -y, Face);
  MainForm.Invalidate;
end {DrawKey};


{ draw the LCD contents }
procedure View;
const
  signind: array[0..4] of integer = ( $03BE, $047E, $053E, $053F, $05FF );
  signmsk: array[0..4] of nibble = ( 4, 8, 8, 1, 2 );
var
  Bank, Row, Col, Hc, Pixel, Index, X, Y: Integer;
  Data, Mask: nibble;
begin
  with LcdBmp.Canvas do
  begin
    Brush.Style := bsSolid;

{ handle the LCD control register }
    if ScrCtrl <> lcdctrl then
    begin
      RedrawReq := True;
      ScrCtrl := lcdctrl;
      if (ScrCtrl and VDD2_bit) <> 0 then
      begin	{turn the display on}
{ it is assummed that the lcdimage is cleared when the LCD is turned off }
        FillChar (ScrMem, LCDSIZE, 0);
        Brush.Color := BkColor;
      end
      else
      begin	{turn the display off}
        Brush.Color := clLtGray;
      end {if};
      FillRect (Rect(0, 0, 394, 64));
    end {if};

    if (ScrCtrl and VDD2_bit) = 0 then Exit;	{display turned off}

{ draw the pixels }
    Index := 0;
    X := 12;
    Y := 0;
    for Bank := 0 to 1 do
    begin
      for Row := 0 to 3 do
      begin
        for Col := 0 to 95-Bank do
        begin
          for Hc := 0 to 1 do
          begin
            Data := lcdimage[Index];
            if ScrMem[Index] <> Data then
            begin
              RedrawReq := True;
              ScrMem[Index] := Data;
              for Pixel := 0 to 3 do
              begin
                if (Data and $8) <> 0 then Brush.Color := clBlack
                                      else Brush.Color := BkColor;
                Data := Data shl 1;
                FillRect (Rect(X, Y, X+2, Y+2));
                Inc (Y, 2);
              end {for Pixel};
            end
            else
            begin
              Inc (Y, 8);
            end {if};
            Inc (Index);
          end {for Hc};
          Dec (Y, 16);
          Inc (X, 2);
        end {for Col};
        Dec (X, 192-2*Bank);
        Inc (Y, 16);
        Inc (Index, 2*Bank);
      end {for Row};
      Inc (X, 192-2*Bank);
      Dec (Y, 64);
    end {for Bank};

{ draw the signs }
    for Row := 0 to 4 do
    begin
      Index := signind[Row];
      Mask := signmsk[Row];
      Data := lcdimage[Index];
      if (ScrMem[Index] and Mask) <> (Data and Mask) then
      begin
        RedrawReq := True;
        ScrMem[Index] := Data;
        if (Data and Mask) <> 0 then Brush.Color := clBlack
                                else Brush.Color := BkColor;
        Y := Row * 15;
        FillRect (Rect(0, Y, 7, Y+4));
      end {if};
    end {for Row};

  end {with};
end; {proc View}


procedure TMainForm.OnRefreshTimer(Sender: TObject);
begin
  LcdRender;
  View;
  if RedrawReq = True then
	Invalidate;
  RedrawReq := False;
end;


procedure KeyInterrupt;
const
{ table of interrupt capable KY bits for specified IA bits 5,4 }
  ktab: array [0..3] of word = ( $0000, $0080, $00C0, $F0FF );
begin
  if ((ia and $80) <> 0) and	{ key interrupt specified? }
     ((ReadKy (ia and $0F) and ktab[(ia shr 4) and 3]) <> 0) then
	SetIfl (KEYPULSE_bit);
end {KeyInterrupt};


{ release a pressed key if it's placed outside the coordinates X,Y }
procedure ReleaseKey1 (X, Y: Integer);
var
  i, r, c, k: integer;
begin
{ draw a released key if mouse was moved from a pressed key }
  if KeyCode1 = 0 then Exit;

{ locate the "keyblock" the key "KeyCode1" belongs to }
  i := 0;	{ "keyblock" index }
  k := 1;	{ first key code in the "keyblock" }
  while (KeyCode1 >= k + keypad[i].cnt) and (i < KEYPADS) do
  begin
    Inc (k, keypad[i].cnt);
    Inc (i);
  end {while};

  with keypad[i] do
  begin
    k := KeyCode1 - k;		{ offset of the key in the "keyblock" }
    c := L + SX*(k mod col);	{ X coordinate of the key image }
    r := T + SY*(k div col);	{ Y coordinate of the key image }
    if ((X < c) or (X >= c + W) or (Y < r) or (Y >= r + H)) and (OX < 512) then
    begin
{ shift the key label upwards to get an impression of a released key }
      BitMap.Width := W-8;
      BitMap.Height := H-8;
      BitMap.Transparent := False;
      BitMap.Canvas.Draw (-c-5, -r-5, Face);
      Face.Canvas.Draw (c+4, r+4, BitMap);
      DrawKey (i, c, r, False);
      KeyCode1 := 0;
    end {if};
  end {with};
end {ReleaseKey1};


{ called when mouse button pressed }
procedure TMainForm.FormMouseDown(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
var
  i, r, c, k: Integer;
begin
{ proceed only when left mouse button pressed }
  if Button <> mbLeft then Exit;

  ReleaseKey1 (-1, -1);
  KeyCode1 := 1;
  for i := 0 to KEYPADS do
  begin
    with keypad[i] do
    begin
      if (X >= L) and (X < L+SX*col) and (((X-L) mod SX) < W) and
	(Y >= T) and (((Y-T) mod SY) < H) then
      begin
        c := (X-L) div SX;
        r := (Y-T) div SY;
        k := col*r + c;
        if k < cnt then
        begin
          Inc (KeyCode1, k);
          if OX < 512 then
          begin
            c := L+c*SX;
            r := T+r*SY;
{ shift the key label down-right to get an impression of a pressed key }
            BitMap.Width := W-8;
            BitMap.Height := H-8;
            BitMap.Transparent := False;
            BitMap.Canvas.Draw (-c-4, -r-4, Face);
            Face.Canvas.Draw (c+5, r+5, BitMap);
            DrawKey (i, c, r, True);
          end {if};
          break;
        end {if};
      end {if};
      Inc (KeyCode1, cnt);
    end {with};
  end {for};

  if KeyCode1 > LASTKEYCODE then	{ no valid key pressed }
  begin
    KeyCode1 := 0;
{ dragging a captionless form by clicking anywhere on the client area outside
  the controls }
    if BorderStyle = bsNone then
    begin
      ReleaseCapture;
      SendMessage (Handle, WM_NCLBUTTONDOWN, HTCAPTION, 0);
    end {if};
  end {if};

  if (KeyCode1 > 0) and (KeyCode1 <= LASTKEYCODE-2) then KeyInterrupt;
end {proc};


{ called when mouse button released }
procedure TMainForm.FormMouseUp(Sender: TObject; Button: TMouseButton;
  Shift: TShiftState; X, Y: Integer);
var
  K: integer;
begin
{ proceed only when left mouse button was pressed }
  if Button <> mbLeft then Exit;

  K := KeyCode1;
{ what to do if the mouse button was released over a pressed ... }
  case K of
    67: begin				{ ...ON/BRK key }
          ReleaseKey1 (-1, -1);
          CpuWakeUp (False);
        end;
    82: begin				{ ...Application Minimize key }
          ReleaseKey1 (-1, -1);
          Application.Minimize;
        end;
    83: begin				{ ...Application Close key }
          ReleaseKey1 (-1, -1);
          Close;
        end;
    else ReleaseKey1 (-1, -1);
  end {case};
end;


{ called when moving the mouse while the button pressed }
procedure TMainForm.FormMouseMove(Sender: TObject; Shift: TShiftState; X,
  Y: Integer);
begin
{ release a pressed key if mouse was moved from it }
  ReleaseKey1 (X, Y);
end;


procedure TMainForm.FormShow(Sender: TObject);
begin
  KeyCode1 := 0;
  KeyCode2 := 0;
  CpuStop := False;
  CpuSleep := False;
  CpuDelay := 0;
  CpuSteps := -1;
  BreakPoint := -1;
{ load the Keys.bmp image }
  if FileExists (KeysName) then
    KeyBmp.LoadFromFile (KeysName)
  else
    MessageDlg (LoadMsg + KeysName, mtWarning, [mbOk], 0);
  KeyBmp.Transparent := False;
{ draw the background image on the Face.Canvas }
  if FileExists (FaceName) then
  begin
    BitMap.LoadFromFile (FaceName);
    BitMap.Transparent := False;
    Face.Canvas.Draw (0, 0, BitMap);
    MainForm.Invalidate;
  end
  else
    MessageDlg (LoadMsg + FaceName, mtWarning, [mbOk], 0);
  Face.Transparent := False;
{ clear the LCD area }
  with LcdBmp.Canvas do
  begin
    Brush.Style := bsSolid;
    Brush.Color := clLtGray;
    FillRect (Rect(0, 0, 394, 64));
  end {with};
  CpuSpeed := OscFreq * integer(RunTimer.Interval);
  ResetAll;
  FddInit;		{ FDD is a separate device, so it is not in ResetAll }
  flag := SW_bit;		{ power switch on }
  ScrCtrl := not lcdctrl;	{ invalidate the shadow LCD control register }
  RunTimer.Enabled := True;
  RefreshTimer.Enabled := True;
  SecTimer.Enabled := True;
  RedrawReq := True;
end;


{ load a binary file, returns true if OK }
function MemLoad (fname: string; memory: PAnsiChar; fsize: integer; foffset: integer) : boolean;
var
  f: file;
  numread: integer;
begin
  numread := 0;
  FillChar (memory^, fsize, $FF);
  if FileExists (fname) then
  begin
    AssignFile (f, fname);
    Reset (f, 1);
    Seek (f, foffset);
    BlockRead(f, memory^, fsize, numread);
    CloseFile (f);
  end;
  MemLoad := numread = fsize;
end {MemLoad};


{ save a binary file, returns True if OK }
function MemSave (fname: string; memory: PAnsiChar; fsize: integer; foffset: integer) : boolean;
var
  f: file;
begin
  {$I-}
{ the communication utility can change the default path to the application directory }
  AssignFile (f, MyPath + fname);
  Rewrite (f, 1);
  Seek (f, foffset);
  BlockWrite(f, memory^, fsize);
  CloseFile (f);
  {$I+}
  MemSave := IOResult = 0;
end {MemSave};


procedure IniLoad;
var
  Ini1: TIniFile;
begin
  Ini1 := TIniFile.Create (ExpandFileName(IniName));
  with Ini1 do
  begin
    OscFreq := ReadInteger ('Settings', 'OscFreq', XTAL);
    Option2 := ReadInteger ('Settings', 'Option2', 0);
    dos_path := ExpandFileName (ReadString ('Fdd', 'Path', 'disk0'));
  end {with};
  Ini1.Free;
end {IniLoad};


{ initialise the application }
procedure TMainForm.FormCreate(Sender: TObject);
var
  i, size: integer;
begin
  Brush.Style := bsClear;	{ transparent form }
  BitMap := TBitMap.Create;
  Face := TBitMap.Create;
  Face.Width := 709;
  Face.Height := 280;
  LcdBmp := TBitMap.Create;
  LcdBmp.Width := 394;
  LcdBmp.Height := 64;
  KeyBmp := TBitMap.Create;
  KeyBmp.Width := 202;
  KeyBmp.Height := 54;
  MyPath := ExtractFilePath(ParamStr(0));
  if not MemLoad (ChrName, PAnsiChar(@lcdchr[0]), CHRSIZE div 2, 0) then
  begin
    MessageDlg (LoadMsg + ChrName, mtWarning, [mbOk], 0);
  end {if};
{ convert the LCD character ROM image to 4-bit }
  for size := 127 downto 0 do
  begin
    for i := 15 downto 0 do
    begin
      lcdchr[2*size + i div 8, 2*(i mod 8)] := lcdchr[size,i] shr 4;
      lcdchr[2*size + i div 8, 2*(i mod 8) + 1] := lcdchr[size,i] and $F;
    end {for};
  end {for};
{ load the register file image }
  MemLoad (RegName, PAnsiChar(@mr[0]), 36, 0);
  ss := ptrw(@mr[32])^;
  us := ptrw(@mr[34])^;
{ load the memory images }
  for i:=0 to MEMORIES-1 do
  begin
    with memdef[i] do
    begin
      size := (last-first) shl memorg;
      GetMem (storage, size);
      if filename <> '' then
      begin
        if not MemLoad (filename, storage, size, offset) then
        begin
          if required then
          begin
            MessageDlg (LoadMsg + filename, mtWarning, [mbOk], 0);
          end {if};
        end {if};
      end {if};
    end {with};
  end {for};
  IniLoad;
  RunTimerFrequency := 1000 div RunTimer.Interval;
end;


{ terminate the application }
procedure TMainForm.FormClose(Sender: TObject; var CloseAction: TCloseAction);
var
  i, size: integer;
begin
{ As the memory appears to be deallocated before destroying the timers, it is
  necessary to prevent the emulated CPU to access the memory after it has been
  freed. }
  CpuStop := True;
  RunTimer.Enabled := False;
  RefreshTimer.Enabled := False;
  SecTimer.Enabled := False;
  IoClose;
  FddClose;
{ save the register file image }
  ptrw(@mr[32])^ := ss;
  ptrw(@mr[34])^ := us;
  if not MemSave (RegName, PAnsiChar(@mr[0]), 36, 0) then
  begin
    MessageDlg (SaveMsg + RegName, mtWarning, [mbOk], 0);
  end {if};
{ save the memory images }
  for i:=0 to MEMORIES-1 do
  begin
    with memdef[i] do
    begin
      size := (last-first) shl memorg;
      if writable and (filename <> '') then
      begin
        if not MemSave (filename, storage, size, offset) then
        begin
          MessageDlg (SaveMsg + filename, mtWarning, [mbOk], 0);
        end {if};
      end {if};
      FreeMem (storage, size);
    end {with};
  end {for};
  BitMap.Free;
  Face.Free;
  LcdBmp.Free;
  KeyBmp.Free;
end;


procedure TMainForm.FormKeyPress(Sender: TObject; var Key: Char);
const
{ key codes FIRST to FIRST+COUNT-1 }
  FIRST = 14;
  COUNT = 66;
  Letters: string[COUNT] =
	'ASDFGHJKLaQWERTYUIOPaZXCVBNM,= aaaaaaaaaaaaaa()^a789aa456*/123+-0.';
var
  i: integer;
begin
  i := 1;
  Key := UpCase(Key);
  while (i <= COUNT) and (Key <> Char(Letters[i])) do Inc (i);
  if i <= COUNT then
  begin
    KeyCode2 := i+(FIRST-1);
    KeyInterrupt;
  end {if};
end;


procedure TMainForm.FormKeyDown(Sender: TObject; var Key: Word;
  Shift: TShiftState);
var
  save: integer;
begin
  save := KeyCode2;
  case Key of
    VK_NEXT:	KeyCode2 := 3;	{ CAPS }
    VK_PRIOR:	KeyCode2 := 13;	{ red S }
    VK_ESCAPE:	KeyCode2 := 67;	{ BRK }
    VK_BACK:	KeyCode2 := 66;	{ BS }
    VK_INSERT:	KeyCode2 := 12;	{ INS }
    VK_RETURN:  KeyCode2 := 81;	{ EXE }
    VK_LEFT:	KeyCode2 := 10;	{ <- }
    VK_RIGHT:	KeyCode2 := 11;	{ -> }
    VK_UP:	KeyCode2 := 8;	{ up }
    VK_DOWN:	KeyCode2 := 9;	{ down }
    VK_F3:	DebugForm.Show;
    VK_F4:	CommForm.Show;
    VK_F9:	ResetAll;
  end {case};
  if (save <> KeyCode2) then KeyInterrupt;
end;


procedure TMainForm.FormKeyUp(Sender: TObject; var Key: Word;
  Shift: TShiftState);
begin
  KeyCode2 := 0;
end;


procedure TMainForm.FormPaint(Sender: TObject);
begin
  Face.Canvas.Draw (48, 36, LcdBmp);
  Canvas.Draw (0, 0, Face);
  RedrawReq := False;
end;


procedure TMainForm.OnRunTimer(Sender: TObject);
var
  x, y: integer;
begin
  if CpuDelay > 0 then
  begin
    Dec (CpuDelay);
    acycles := 0;
    Exit;
  end {if};
  Inc (acycles, CpuSpeed);
  while acycles > 0 do
  begin
    if CpuStop then
    begin
      acycles := 0;
      break;
    end {if};

    x := CpuRun;
    Dec (acycles, x);

{ INT1 interrupt, edge triggered }
    if ((ky and $0800) <> (delayed_ky and $0800))	{ edge test }
        and
      ((ky and $0800) = 0) = ((ie and $02) = 0)		{ level test }
        then
      SetIfl (INT1_bit);
    delayed_ky := ky;

{ INT2 interrupt, level triggered }
    if ((ky and $0400) = 0) = ((ie and $01) = 0) then SetIfl (INT2_bit);

{ ON interrupt }
    if (lcdctrl and (VDD2_bit or CLK_bit)) = (VDD2_bit or CLK_bit) then
    begin
      Dec (OnCounter, x);
      if OnCounter < 0 then
      begin
        Inc (OnCounter, onrate);
        if OnCounter < 0 then OnCounter := onrate;
        ky := ky xor $0200;
        if (ky and $0200) = 0 then SetIfl (ONINT_bit);
      end {if};
    end {if};

{ Pulse interrupt }
    if (ia and $40) = 0 then y := 256{Hz} else y := 1{Hz};
    Dec (PulseCounter, x * y);
    if PulseCounter < 0 then
    begin
      Inc (PulseCounter, CpuSpeed * RunTimerFrequency);
      if ((ia and $80) = 0) then SetIfl (KEYPULSE_bit);
    end {if};

{ Serial Port bit shift pulse }
    Dec (SerialCounter, x);
    if SerialCounter < 0 then
    begin
      Inc (SerialCounter, SerialRate);
      if SerialCounter < 0 then SerialCounter := SerialRate;
      OnSerialTick;
    end {if};

    if CommDelayTimer > 0 then Dec (CommDelayTimer, x);

    if CpuSteps > 0 then
    begin
      Dec (CpuSteps);
      if CpuSteps = 0 then
      begin
        CpuStop := True;
        acycles := 0;
        DebugForm.Show;
        break;
      end {if};
    end {if};

    if (BreakPoint >= 0) and (BreakPoint = pc) then
    begin
      CpuStop := True;
      acycles := 0;
      DebugForm.Show;
      break;
    end {if};

  end {while};
end;


procedure TMainForm.OnSecTimer(Sender: TObject);
begin
  Inc (tm);
  if (tm and $3F) = 60 then
  begin
    Inc (tm, 4);
{ periodical interrupts asynchronous with the main clock are disabled in
  the debug mode }
    if not CpuStop then SetIfl (MINTIMER_bit);
  end {if};
end;


procedure TMainForm.FormDeactivate(Sender: TObject);
begin
  ReleaseKey1 (-1, -1);
  KeyCode2 := 0;
end;


procedure TMainForm.ApplicationDeactivate(Sender: TObject);
begin
  ReleaseKey1 (-1, -1);
  KeyCode2 := 0;
end;


end.
