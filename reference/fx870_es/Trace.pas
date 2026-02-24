{ Execution trace unit.
  Writes one JSONL record per instruction to trace.jsonl.
  Recording starts when TraceInit is called and stops automatically after
  TRACE_DURATION_MS milliseconds (wall clock) or TRACE_MAX_LINES records,
  whichever comes first.  TraceClose can also be called explicitly.

  Hook in cpu.pas:
    - call TraceInstr    immediately before ExecInstr
    - call TraceAddCycles(cycles) after the speed-scaling line in CpuRun

  Hook in main.pas:
    - call TraceInit  after ResetAll in FormShow
    - call TraceClose before IoClose in FormClose
}

unit Trace;

interface

  procedure TraceInit;
  procedure TraceClose;
  procedure TraceInstr;
  procedure TraceAddCycles (n: integer);

implementation

uses
  SysUtils, Windows, Def;

const
  TRACE_DURATION_MS = 10000;   { wall-clock limit in milliseconds }
  TRACE_MAX_LINES   = 5000000; { hard line-count safety cap }
  TRACE_FILE        = 'trace.jsonl';

var
  TraceFile     : TextFile;
  TraceOpen     : boolean = False;
  TraceStartTick: DWORD;
  TraceCycles   : int64;
  TraceLines    : integer;


{ Serialise mr[0..35] as a compact JSON integer array, e.g. [0,1,255,...] }
function MrJson: string;
var
  i: integer;
  s: string;
begin
  s := '[';
  for i := 0 to 35 do
  begin
    if i > 0 then s := s + ',';
    s := s + IntToStr(mr[i]);
  end {for};
  Result := s + ']';
end {MrJson};


{ Open (or re-open) the trace file and begin recording. }
procedure TraceInit;
begin
  if TraceOpen then CloseFile(TraceFile);
  AssignFile(TraceFile, TRACE_FILE);
  Rewrite(TraceFile);
  TraceOpen     := True;
  TraceStartTick := GetTickCount;
  TraceCycles   := 0;
  TraceLines    := 0;
end {TraceInit};


{ Flush and close the trace file. }
procedure TraceClose;
begin
  if not TraceOpen then Exit;
  CloseFile(TraceFile);
  TraceOpen := False;
end {TraceClose};


{ Called BEFORE ExecInstr in CpuRun.
  At this point pc holds the address of the instruction about to execute.
  TraceCycles is the cumulative cycle count up to (but not including) this
  instruction - it is updated afterwards via TraceAddCycles. }
procedure TraceInstr;
var
  line: string;
begin
  if not TraceOpen then Exit;

  { check wall-clock timeout }
  if (GetTickCount - TraceStartTick) >= TRACE_DURATION_MS then
  begin
    TraceClose;
    Exit;
  end {if};

  { check line-count cap }
  if TraceLines >= TRACE_MAX_LINES then
  begin
    TraceClose;
    Exit;
  end {if};

  line := Format(
    '{"pc":%d,"cy":%d,"mr":%s,' +
    '"sx":%d,"sy":%d,"sz":%d,' +
    '"ix":%d,"iy":%d,"iz":%d,' +
    '"us":%d,"ss":%d,' +
    '"ua":%d,"dua":%d,' +
    '"ia":%d,"ie":%d,"ib":%d,' +
    '"tm":%d,"fl":%d,"iserv":%d,"ky":%d}',
    [pc,   TraceCycles, MrJson,
     sx,   sy,          sz,
     ix,   iy,          iz,
     us,   ss,
     ua,   delayed_ua,
     ia,   ie,           ib,
     tm,   flag,         iserv,  ky]);

  WriteLn(TraceFile, line);
  Inc(TraceLines);
end {TraceInstr};


{ Accumulate the cycle count returned by CpuRun so that TraceCycles stays
  synchronised with the emulated clock. }
procedure TraceAddCycles (n: integer);
begin
  if TraceOpen then Inc(TraceCycles, n);
end {TraceAddCycles};


end.
