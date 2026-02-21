{ file system handling,
 this version operates on the files in the path to a selected PC directory
 or to a PC floppy disk drive,
 the procedures may provide inaccurate information about the causes of errors

=== fddbuf memory map ===
offset		bytes		description

== always ==
0		1		single byte results

== directory reading ==
1		FNAMESIZE	file name
HEADERBEGIN	HEADERSIZE	file header
DIRBEGIN			directory entries

== renaming, deleting ==
1		2 * FNAMESIZE	old+new name

== data transfer ==
1		4		block size (2 or 4 bytes)
5		RECORDSIZE	data bytes
}

unit Dos;

interface

  const
    FNAMESIZE = 8+3;
    MAXFILE = 15;	{ max. file #number }
    HEADERSIZE = 16;
    RECORDSIZE = 256;
    FDDBUFSIZE = 3072;	{ at least 4+RECORDSIZE, but no more than 255*DIRENTRYSIZE+DIRBEGIN }

  var
    fddbuf: array[0..FDDBUFSIZE-1] of byte;
    fddindex: integer;		{ index to fddbuf }
    fddbytes: integer;		{ number of bytes in fddbuf }
    error_code: byte;		{ variable $DE03 }

  procedure DosInit;
  procedure DosClose;
  function DosGetFreeSpace : integer;
  function DosGetNumberOfFiles : integer;
  procedure DosGetNextDirEntry;
  procedure DosGetPrevDirEntry;
  procedure DosRenameFile;
  procedure DosDeleteFile;
  function DosOpenFile (number: integer; access: char) : integer;
  procedure DosBlockWrite (number: integer; count: integer);
  procedure DosBlockRead (number: integer; count: integer);
  procedure DosCloseFile (number: integer);

implementation

uses
  Sysutils, Def;

const
  DIRENTRYSIZE = 20;
  HEADERBEGIN = 1 + FNAMESIZE;
  DIRBEGIN = HEADERBEGIN + HEADERSIZE;

var
  dir_index: integer;
  dir_end: integer;
  files: array[0..MAXFILE] of file;	{ #0 added for save/load transfers }


procedure DosInit;
begin
end {DosInit};


procedure DosClose;
begin
end {DosClose};


function DosGetFreeSpace : integer;
begin
  DosGetFreeSpace := $7FFF;
end {DosGetFreeSpace};


{ conversion of a kind: 'HELLO   TXT' -> 'HELLO.TXT' }
function DosCompactFileName (src: ptrb) : string;
var
  basename, extension: string;
  j: integer;
begin
  basename := '';
  for j := 0 to 7 do
  begin
    basename := basename + Char(src^);
    Inc(src);
  end {for};
  basename := TrimRight(basename);
  extension := '';
  for j := 8 to FNAMESIZE-1 do
  begin
    extension := extension + Char(src^);
    Inc(src);
  end {for};
  extension := TrimRight(extension);
  if extension <> '' then extension := '.' + extension;
  DosCompactFileName := basename + extension;
end {DosCompactFileName};


{ conversion of a kind: 'HELLO.TXT' -> 'HELLO   TXT'
 argument 'i' is the destination index in fddbuf }
function DosExpandFileName (name: string; i: integer) : boolean;
var
  j, len: integer;
begin
  name := UpperCase(name);
  len := Length(name);
  for j := 0 to FNAMESIZE-1 do fddbuf[i+j] := Byte(' ');
{ base name }
  j := 1;
  Dec(i);
  while (j <= 8) and (len > 0) do
  begin
    if name[j] = '.' then Break;
    fddbuf[i+j] := Byte(name[j]);
    Dec(len);
    Inc(j);
  end {while};
{ extension }
  name := ExtractFileExt(name);
  len := Length(name);
  j := 2;
  Inc(i,7);
  while (j <= 5) and (len > 1) do
  begin
    fddbuf[i+j] := Byte(name[j]);
    Dec(len);
    Inc(j);
  end {while};
{ $1307: compare the file name with the template in fddbuf[1] }
  Dec(i,6);
  DosExpandFileName := False;
  for j := 0 to FNAMESIZE-1 do
  begin
    if (fddbuf[j+1] <> Byte('?')) and (fddbuf[j+1] <> fddbuf[i+j]) then Exit;
  end {for};
  DosExpandFileName := True;
end {DosExpandFileName};


{ reads all directory entries into fddbuf[DIRBEGIN] without determining the
 file type, this task is moved to DosGetDirEntry }
function DosGetNumberOfFiles : integer;
var
  f: TSearchRec;
  i: integer;
begin
  for i := 1 to FNAMESIZE do fddbuf[i] := Byte(UpCase(Char(fddbuf[i])));
  i := DIRBEGIN;
  if FindFirst(dos_path + '\*.*', $20, f) = 0 then
  repeat
    if DosExpandFileName(f.Name, i) then
    begin
      IntToBytes(0, @fddbuf[i+11], 4);
      IntToBytes(f.Size, @fddbuf[i+15], 4);
      Inc(i,DIRENTRYSIZE);
    end {if};
  until (i > FDDBUFSIZE-DIRENTRYSIZE) or (FindNext(f) <> 0);
  FindClose(f);
  dir_index := DIRBEGIN;
  dir_end := i;
  DosGetNumberOfFiles := (i-DIRBEGIN) div DIRENTRYSIZE;
end {DosGetNumberOfFiles};


procedure DosGetCurrentDirEntry;
var
  s: string;
  f: file of byte;
  numread: integer;
begin
  fddbuf[dir_index+19] := 0;	{ no file type specified }
{ read the file header in order to determine the file type }
  s := dos_path + '\' + DosCompactFileName(@fddbuf[dir_index]);
  if (BytesToInt(@fddbuf[dir_index+15],4) >= HEADERSIZE) and FileExists(s) then
  begin
    AssignFile (f, s);
    Reset (f);
    BlockRead (f, fddbuf[HEADERBEGIN], HEADERSIZE, numread);
    CloseFile (f);
{ $1389:
 if the file starts with $FF,$FE then the next byte represents the file type }
    if (numread = HEADERSIZE) and (fddbuf[HEADERBEGIN] = $FF) and
	(fddbuf[HEADERBEGIN+1] = $FE) then
	fddbuf[dir_index+19] := fddbuf[HEADERBEGIN+2];	{ file type }
  end {if};
  fddindex := dir_index;
  fddbytes := DIRENTRYSIZE;
end {DosGetCurrentDirEntry};


procedure DosGetNextDirEntry;
begin
  DosGetCurrentDirEntry;
  if dir_index+DIRENTRYSIZE <= dir_end then Inc(dir_index,DIRENTRYSIZE);
end {DosGetNextDirEntry};


procedure DosGetPrevDirEntry;
begin
  DosGetCurrentDirEntry;
  if dir_index >= DIRBEGIN+DIRENTRYSIZE then Dec(dir_index,DIRENTRYSIZE);
end {DosGetPrevDirEntry};


procedure DosRenameFile;
begin
  if not RenameFile (dos_path + '\' + DosCompactFileName(@fddbuf[1]),
	dos_path + '\' + DosCompactFileName(@fddbuf[1+FNAMESIZE])) then
	error_code := $0D;	{ no more detailed information available }
end {DosRenameFile};


procedure DosDeleteFile;
begin
  if not DeleteFile (dos_path + '\' + DosCompactFileName(@fddbuf[1])) then
	error_code := $0B;	{ no more detailed information available }
end {DosDeleteFile};


{ returns the file size }
function DosOpenFile (number: integer; access: char) : integer;
var
  s: string;
begin
  DosOpenFile := 0;
  s := dos_path + '\' + DosCompactFileName(@fddbuf[1]);
  if (number < 0) or (number > MAXFILE) then error_code := $08 else
  begin
    AssignFile(files[number], s);
    {$I-}
    case access of
      'R': begin
             if not FileExists(s) then error_code := $0B else
             begin
               Reset(files[number], 1);
               if IOResult <> 0 then error_code := $0B;
             end {if};
           end {R};
      'W': begin
             Rewrite(files[number], 1);
             if IOResult <> 0 then error_code := $07;
				{ no more detailed information available }
           end {W};
      'A': begin
             if FileExists(s) then Reset(files[number], 1) else Rewrite(files[number], 1);
             Seek(files[number], FileSize(files[number]));
             if IOResult <> 0 then error_code := $07;
				{ no more detailed information available }
           end {A};
    else error_code := $03;
    end {case};
    {$I+}
  end {if};
  if error_code = 0 then DosOpenFile := FileSize(files[number]);
end {DosOpenFile};


{ write 'count' bytes from memory starting at fddbuf[5], to the file: #number }
procedure DosBlockWrite (number: integer; count: integer);
var
  transferred: integer;
begin
  if count > RECORDSIZE then error_code := $03 else
  if (number < 0) or (number > MAXFILE) then error_code := $08 else
  begin
    BlockWrite(files[number], fddbuf[5], count, transferred);
    if count <> transferred then error_code := $07;
				{ no more detailed information available }
  end {if};
end {DosBlockWrite};


{ read 'count' bytes to memory starting at fddbuf[5], from the file: #number }
procedure DosBlockRead (number: integer; count: integer);
var
  transferred: integer;
begin
  if count > RECORDSIZE then error_code := $03 else
  if (number < 0) or (number > MAXFILE) then error_code := $08 else
  begin
    BlockRead(files[number], fddbuf[5], count, transferred);
    if count <> transferred then error_code := $03;
				{ no more detailed information available }
  end {if};
end {DosBlockRead};


procedure DosCloseFile (number: integer);
begin
  {$I-}
  CloseFile(files[number]);
  {$I+}
  if IOResult <> 0 then error_code := $03;
				{ no more detailed information available }
end {DosCloseFile};


end.

