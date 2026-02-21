object MainForm: TMainForm
  Left = 356
  Top = 66
  HorzScrollBar.Visible = False
  VertScrollBar.Visible = False
  BorderStyle = bsNone
  Caption = 'FX-870P'
  ClientHeight = 280
  ClientWidth = 709
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  KeyPreview = True
  OldCreateOrder = False
  Position = poScreenCenter
  OnClose = FormClose
  OnCreate = FormCreate
  OnDeactivate = FormDeactivate
  OnKeyDown = FormKeyDown
  OnKeyPress = FormKeyPress
  OnKeyUp = FormKeyUp
  OnMouseDown = FormMouseDown
  OnMouseMove = FormMouseMove
  OnMouseUp = FormMouseUp
  OnPaint = FormPaint
  OnShow = FormShow
  PixelsPerInch = 96
  TextHeight = 13
  object RunTimer: TThreadedTimer
    Interval = 10
    OnTimer = OnRunTimer
    Left = 16
    Top = 8
  end
  object RefreshTimer: TTimer
    Enabled = False
    Interval = 50
    OnTimer = OnRefreshTimer
    Left = 48
    Top = 8
  end
  object SecTimer: TTimer
    Enabled = False
    OnTimer = OnSecTimer
    Left = 80
    Top = 8
  end
end
