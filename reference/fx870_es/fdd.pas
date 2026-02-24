{ FDD port }

unit Fdd;

interface

  procedure FddInit;
  procedure FddClose;
  function FddWrPtr (index: integer) : pointer;
  function FddRdPtr (index: integer) : pointer;

implementation

  uses Def, SysUtils, Dos;

  type
    Proc1 = procedure;

    TFileControlBlock = record
      isopened: boolean;
      access: AnsiChar;	{ access mode: 'R', 'W', 'A' or 'D' }
      position: integer;
      size: integer;
    end {TFileControlBlock};

  var
    fdd_status: byte;		{ variable $DE24 }
    fdd_control: byte;
    fdd_command: byte;
    counter: integer;		{ variable $DE0C }
    temp: integer;
    oldcontrol: byte = 0;	{ previous value of fdd_control }
    fdd_proc: pointer = nil;	{ procedure to be executed after the calculator
				  reads or writes the last data byte }
    fcb: array[1..MAXFILE] of TFileControlBlock;	{ table $D202 }				  


{ returns the smaller value of the two }
function MyMin (x, y: integer) : integer;
begin
  if x < y then MyMin := x else MyMin := y;
end {MyMin};


procedure FddReset;
var
  i: integer;
begin
  error_code := 0;
  fdd_status := $FF;
  fddindex := 0;
  fddbytes := 0;
  for i := 1 to MAXFILE do fcb[i].isopened := False;
  fdd_proc := nil;
end {FddReset};


procedure FddInit;
begin
  FddReset;
  DosInit;
end {FddInit};


procedure FddClose;
var
  i: integer;
begin
  DosClose;
  for i := 0 to MAXFILE do DosCloseFile (i);
end {FddClose};


procedure FddCommandCompleted;
begin
  fdd_proc := nil;
{ $02B8: set the 'error flag' if an error occurred }
  if error_code <> 0 then fdd_status := fdd_status and $EF;
{ $02CE: set the 'operation completed' flag }
  fdd_status := fdd_status or $08;
end {FddCommandCompleted};


{ command code: $01 }
procedure FddIdentification;
begin
  fddbuf[0] := $01;
  fddindex := 0;
  fddbytes := 1;
  fdd_proc := @FddCommandCompleted;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {FddIdentification};


{ command code: $02 }
procedure FddGetErrorCode;
begin
  if error_code = 0 then error_code := $0B;
  fddbuf[0] := error_code;
  fddindex := 0;
  fddbytes := 1;
  error_code := 0;
  fdd_proc := @FddCommandCompleted;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {FddGetErrorCode};


{ command code: $03 }
procedure FddGetNextDirEntry;
begin
  DosGetNextDirEntry;
  fdd_proc := @FddCommandCompleted;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {FddGetNextDirEntry};


{ command code: $04 }
procedure FddGetPrevDirEntry;
begin
  DosGetPrevDirEntry;
  fdd_proc := @FddCommandCompleted;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {FddGetPrevDirEntry};


{ command code: $10 }
procedure FddGetFreeSpace;
begin
  IntToBytes(DosGetFreeSpace, @fddbuf[0], 2);
  fddbuf[2] := 0;	{ bogus disk type, variable $DE21 }
  fddbuf[3] := 1;	{ fixed value }
  fddindex := 0;
  fddbytes := 4;
  fdd_proc := @FddCommandCompleted;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {FddGetFreeSpace};


procedure ExecGetNumberOfFiles;
begin
  fddbuf[0] := Byte(DosGetNumberOfFiles);
  fddindex := 0;
  fddbytes := 1;
  fdd_proc := @FddCommandCompleted;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {ExecGetNumberOfFiles};


{ command code: $12 }
procedure FddGetNumberOfFiles;
begin
  fddindex := 1;
  fddbytes := FNAMESIZE;
  fdd_proc := @ExecGetNumberOfFiles;
end {FddGetNumberOfFiles};


procedure DecrementCounter;
begin
{ $1653: }
  fddbytes := MyMin (counter, RECORDSIZE);
  Dec (counter, fddbytes);
  fddindex := 5;
end {DecrementCounter};


procedure ExecLoadChunk;
begin
  if counter > 0 then
  begin
    DecrementCounter;
    if error_code = 0 then DosBlockRead (0, fddbytes);
    fdd_proc := @ExecLoadChunk;
    fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
  end
  else
  begin
    if error_code = 0 then DosCloseFile (0);
    FddCommandCompleted;
  end {if};
end {ExecLoadChunk};


{ follow the calculator's response }
procedure ExecLoadFile3;
begin
  if fddbuf[0] <> 0 then FddCommandCompleted { calculator rejected the file }
  else
  begin				{ resend the initial bytes of the file }
    fddbytes := temp;
    Dec (counter, fddbytes);
    fddindex := 5;
    fdd_proc := @ExecLoadChunk;
    fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
  end {if};
end {ExecLoadFile3};


{ read a byte from the calculator }
procedure ExecLoadFile2;
begin
  fddindex := 0;
  fddbytes := 1;
  fdd_proc := @ExecLoadFile3;
end {ExecLoadFile2};


{ sends the file size (4 bytes) and the file header to the calculator }
procedure ExecLoadFile1;
begin
  counter := MyMin (DosOpenFile (0, 'R'), $FFFF);
  temp := MyMin (counter, HEADERSIZE);
  if error_code = 0 then DosBlockRead (0, temp);
  IntToBytes (counter, @fddbuf[1], 4);
  fddindex := 1;
  fddbytes := 4 + HEADERSIZE;
  fdd_proc := @ExecLoadFile2;
  fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
end {ExecLoadFile1};


{ command code: $13 }
procedure FddLoadFile;
begin
  fddindex := 1;
  fddbytes := FNAMESIZE;
  fdd_proc := @ExecLoadFile1;
end {FddLoadFile};


procedure ExecSaveChunk;
begin
  if error_code = 0 then DosBlockWrite (0, temp);
  if counter > 0 then
  begin
    DecrementCounter;
    temp := fddbytes;
    fdd_proc := @ExecSaveChunk;
  end
  else
  begin
    if error_code = 0 then DosCloseFile (0);
    FddCommandCompleted;
  end {if};
end {ExecSaveChunk};


procedure ExecSaveFile;
begin
  counter := BytesToInt (@fddbuf[16], 4);
  if counter = 0 then FddCommandCompleted else
  begin
    DosOpenFile (0, 'W');
    DecrementCounter;
    temp := fddbytes;
    fdd_proc := @ExecSaveChunk;
  end {if};
end {ExecSaveFile};


{ command code: $14 }
procedure FddSaveFile;
begin
  fddindex := 1;
  fddbytes := 19;
  fdd_proc := @ExecSaveFile;
end {FddSaveFile};


procedure ExecRenameFile;
begin
  DosRenameFile;
  FddCommandCompleted;
end {ExecRenameFile};


{ command code: $15 }
procedure FddRenameFile;
begin
  fddindex := 1;
  fddbytes := 2 * FNAMESIZE;
  fdd_proc := @ExecRenameFile;
end {FddRenameFile};


procedure ExecDeleteFile;
begin
  DosDeleteFile;
  FddCommandCompleted;
end {ExecDeleteFile};


{ command code: $16 }
procedure FddDeleteFile;
begin
  fddindex := 1;
  fddbytes := FNAMESIZE;
  fdd_proc := @ExecDeleteFile;
end {FddDeleteFile};


procedure ExecOpenFile;
var
  i: integer;
begin
  i := integer(fddbuf[12]);		{ file number }
  if (i > 0) and (i <= MAXFILE) then with fcb[i] do
  begin
    if isopened then DosCloseFile (i);
    access := AnsiChar(fddbuf[13]);
    size := DosOpenFile (i, access);
    position := 0;
    if access = 'A' then
    begin
      access := 'W';
      position := size;
    end {if};
    isopened := error_code = 0;
  end
  else error_code := $08;		{ invalid file number }
  FddCommandCompleted;
end {ExecOpenFile};


{ command code: $19 }
procedure FddOpenFile;
begin
  fddindex := 1;
  fddbytes := 17;
  fdd_proc := @ExecOpenFile;
end {FddOpenFile};


procedure ExecCloseFile;
var
  i, e: integer;
begin
  i := integer(fddbuf[1]);		{ file number }
  if i = 0 then				{ close all files }
  begin
    e := 0;				{ saved error code }
    for i := 1 to MAXFILE do with fcb[i] do
    begin
      error_code := 0;
      if isopened then DosCloseFile (i);
      isopened := False;
      if error_code <> 0 then e := error_code;
    end {for};
    error_code := e;
  end
  else if i <= MAXFILE then with fcb[i] do { close single file }
  begin
    if isopened then DosCloseFile (i);
    isopened := False;
  end
  else error_code := $08;		{ invalid file number }
  FddCommandCompleted;
end {ExecCloseFile};


{ command code: $1A }
procedure FddCloseFile;
begin
  fddindex := 1;
  fddbytes := 1;
  fdd_proc := @ExecCloseFile;
end {FddCloseFile};


{ write the record to the file, temp = number of bytes }
procedure ExecWriteFile2;
var
  i: integer;
begin
  if (temp > 0) and (fddbuf[4+temp] = $1A) then Dec(temp);
					{ trim an EOF character }
  if temp > 0 then
  begin
    i := integer(fddbuf[1]);		{ file number }
    DosBlockWrite (i, temp);
    if error_code = 0 then with fcb[i] do
    begin
      Inc (position, temp);
      Inc (size, temp);
    end {if};
  end {if};
  FddCommandCompleted;
end {ExecWriteFile2};


{ receive the record from the calculator }
procedure ExecWriteFile1;
begin
  fddindex := 5;
  fddbytes := BytesToInt (@fddbuf[3], 2);
  temp := fddbytes;
  fdd_proc := @ExecWriteFile2;
end {ExecWriteFile1};


procedure ExecReadWriteFile;
var
  i, x: integer;
begin
  i := integer(fddbuf[1]);		{ file number }
  if (i < 1) or (i > MAXFILE) then
  begin
    error_code := $08;			{ invalid file number }
    FddCommandCompleted;
  end
  else if not fcb[i].isopened or (fcb[i].access <> AnsiChar(fddbuf[2])) then
  begin
    error_code := $03;		{ file not opened or wrong access mode }
    FddCommandCompleted;
  end
  else if AnsiChar(fddbuf[2]) = 'R' then with fcb[i] do	{ file reading }
  begin
    x := MyMin (size - position, RECORDSIZE);
    if x > 0 then
    begin
      DosBlockRead (i, x);
      if fddbuf[4+x] = $1A then Dec(x);	{ trim an EOF character }
    end {if};
    Inc (position, x);
  { send the record preceded by its size to the calculator }
    IntToBytes (x, @fddbuf[3], 2);
    fddindex := 3;
    fddbytes := 2 + x;
    fdd_proc := @FddCommandCompleted;
    fdd_status := fdd_status and $FE;	{ data byte ready for the calculator }
  end
  else if AnsiChar(fddbuf[2]) = 'W' then	{ file writing }
  begin			{ receive the record size from the calculator }
    fddindex := 3;
    fddbytes := 2;
    fdd_proc := @ExecWriteFile1;
  end
  else
  begin
    error_code := $03;			{ wrong access mode }
    FddCommandCompleted;
  end {if};
end {ExecReadWriteFile};


{ command code: $1B }
procedure FddReadWriteFile;
begin
  fddindex := 1;
  fddbytes := 2;
  fdd_proc := @ExecReadWriteFile;
end {FddReadWriteFile};


procedure FddInvalidCommand;
begin
  error_code := $03;
  FddCommandCompleted;
end {FddInvalidCommand};


procedure OnWriteFddControl;
begin
  if (fdd_control and not oldcontrol and $40) <> 0 then FddReset;
  oldcontrol := fdd_control;
end {OnWriteFddControl};


procedure OnWriteFddData;
begin
  fdd_status := fdd_status and $FD;	{ data byte ready for the FDD }
  if fddbytes > 0 then
  begin
    Inc(fddindex);
    Dec(fddbytes);
    fdd_status := fdd_status or $02;	{ data byte was read by the FDD }
  end {if};
  if fddbytes = 0 then	{ the required number of input bytes was transferred }
  begin
    if fdd_proc <> nil then
    begin
      procptr[procindex] := fdd_proc;
      Inc(procindex);
      fdd_proc := nil;
    end {if};
  end {if};
end {OnWriteFddData};


procedure OnWriteFddCommand;
const
{ $123B: }
  fdd_cmd_tab: array [0..$1D] of pointer = (
	@FddInvalidCommand,	{ code $00 }
	@FddIdentification,	{ code $01 }
	@FddGetErrorCode,	{ code $02 }
	@FddGetNextDirEntry,	{ code $03 }
	@FddGetPrevDirEntry,	{ code $04 }
	@FddInvalidCommand,	{ code $05 }
	@FddInvalidCommand,	{ code $06 }
	@FddInvalidCommand,	{ code $07 }
	@FddInvalidCommand,	{ code $08 }
	@FddInvalidCommand,	{ code $09 }
	@FddInvalidCommand,	{ code $0A }
	@FddInvalidCommand,	{ code $0B }
	@FddInvalidCommand,	{ code $0C }
	@FddInvalidCommand,	{ code $0D }
	@FddInvalidCommand,	{ code $0E }
	@FddInvalidCommand,	{ code $0F }
	@FddGetFreeSpace,	{ code $10 }
	@FddInvalidCommand,	{ code $11 }
	@FddGetNumberOfFiles,	{ code $12 }
	@FddLoadFile,		{ code $13 }
	@FddSaveFile,		{ code $14 }
	@FddRenameFile,		{ code $15 }
	@FddDeleteFile,		{ code $16 }
	@FddInvalidCommand,	{ code $17 }
	@FddInvalidCommand,	{ code $18 }
	@FddOpenFile,		{ code $19 }
	@FddCloseFile,		{ code $1A }
	@FddReadWriteFile,	{ code $1B }
	@FddInvalidCommand,	{ code $1C }
	@FddInvalidCommand );	{ code $1D }
begin
  fdd_proc := nil;
{ $11D0: }
  fdd_status := $17;
  if fdd_command > $1D then fdd_command := 0;
  Proc1(fdd_cmd_tab[fdd_command]);
end {OnWriteFddCommand};


procedure OnReadFddData;
begin
  if fddbytes > 0 then
  begin
    Inc(fddindex);
    Dec(fddbytes);
  end {if};
  if fddbytes = 0 then	{ the required number of input bytes was received }
  begin
    fdd_status := fdd_status or $01;	{ no more data for the calculator }
    if fdd_proc <> nil then
    begin
      procptr[procindex] := fdd_proc;
      Inc(procindex);
      fdd_proc := nil;
    end {if};
  end {if};
end {OnReadFddData};


procedure OnReadFddStatus;
begin
end {OnReadFddStatus};


function FddWrPtr (index: integer) : pointer;
begin
  FddWrPtr := @dummydst;
  case index of
    0: begin					{ control register }
         FddWrPtr := @fdd_control;
         procptr[procindex] := @OnWriteFddControl;
         Inc(procindex);
       end {0};
    2: begin					{ data register }
         FddWrPtr := @fddbuf[fddindex];
         procptr[procindex] := @OnWriteFddData;
         Inc(procindex);
       end {2};
    3: begin					{ command register }
         FddWrPtr := @fdd_command;
         procptr[procindex] := @OnWriteFddCommand;
         Inc(procindex);
       end {3};
  end {case};
end {FddWrPtr};


function FddRdPtr (index: integer) : pointer;
begin
  if index = 0 then				{ data register }
  begin
    FddRdPtr := @fddbuf[fddindex];
    procptr[procindex] := @OnReadFddData;
  end
  else						{ status register }
  begin
    FddRdPtr := @fdd_status;
    procptr[procindex] := @OnReadFddStatus;
  end {if};
  Inc(procindex);
end {FddRdPtr};

end.

