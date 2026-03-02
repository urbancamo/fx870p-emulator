' airmanx.bas
' 2013-09-01 23:32:15
' Automatic conversion of airmanx.bas to X11-Basic
' by bas2x11basic V.1.11 
' Copyright (C) 2002-2004 Markus Hoffmann
' 702 lines.
' 73 labels.
' 0 procs.
' ----- Start of program -----
RANDOMIZE
@CONSTS
@DIMS
'The order of these data setup calls needs to match the order they are defined
@AIRCRAFT
@STOCKS
@PROPERTIES
@AIRPORTS 
@COMMSET 
'Present title then main menu
@TITLE
@MAINMENU
STOP
'
'--------------------------------------------------
' The main application menu
PROCEDURE MAINMENU
 LOCAL A%
 REPEAT
  @HEADING("MAIN MENU")
  @OPTION(1,"Start new company")
  @OPTION(2,"Take a turn")
  @OPTION(3,"Status")
  @OPTION(4,"Help")
  @OPTION(5,"Exit program")
  '@OPTION(n,"Set company variables")
  '@OPTION(n,"Set computer variables")
  '@OPTION(n,"Load saved game")
  '@OPTION(n,"Save game")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=4
   ON A% GOSUB SETUPCPY,TAKETURN,STATUS,HELPSYS
  ENDIF
 UNTIL A%=5
RETURN
'
'--------------------------------------------------
' Setup company parameters before starting business
PROCEDURE SETUPCPY
 LOCAL A$
 @HEADING("START NEW COMPANY")
 @TEXTAT(6,"New company will be established.")
 @TEXTAT(7,"Any current company will be lost.")
 LET A$=@GETSTR("Are you sure (Y=YES)?")
 IF A$="Y" OR A$="y"
  @VARSET
  @TEXTAT(20,"Spend your money wisely!")
 ELSE
  @TEXTAT(20,"Make sure you enter Y if you want to setup a company")
 ENDIF
 @ANYKEY
RETURN
'
'----------------------------------------------------------------------
' Allow player to perform business actions in this round
PROCEDURE TAKETURN
 LOCAL A%
 REPEAT
  @PRETURN
  @HEADING("OPTIONS")
  @TEXTAT(4,"Turn: "+STR$(TurnCurr%))
  @OPTION(1,"Accounts")
  @OPTION(2,"Property Market")
  @OPTION(3,"Plane Market")
  @OPTION(4,"Stock Exchange")
  @OPTION(5,"Fuel Market")
  @OPTION(6,"Continue to Work Schedule")
  @OPTION(7,"Status")
  @OPTION(8,"Back to Main Menu")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=7
    ON A% GOSUB BANKING,PROPERTY,PLANEMARKET,EXCHANGE,FUEL,WORK,STATUS
  ENDIF
 	UNTIL A%=8
RETURN 
'
'----------------------------------------------------------------------
' Display current status of essential company parameters
PROCEDURE STATUS 
 @HEADING("COMPANY STATUS")
 @TEXTAT(6, "PROPERTY      : "+PropName$(CpyPropType%))
 @TEXTAT(8, "AIRCRAFT      : "+AirName$(CpyAirType%))
 @TEXTAT(10,"FUEL          : "+STR$(CpyFuelLvl%)+" klbs")
 @TEXTAT(11,"FOOD          : "+STR$(CpyStockLvl(FOODSTUFFS_TYPE%)))
 @TEXTAT(12,"MEDICAL       : "+STR$(CpyStockLvl(NEDICINE_TYPE%)))
 @TEXTAT(13,"MACHINERY     : "+STR$(CpyStockLvl(MACHINERY_TYPE%)))
 @TEXTAT(15,"MONEY-DEPOSIT : $"+STR$(MonDepAcc%))
 @TEXTAT(16,"MONEY-CURRENT : $"+STR$(MonCurAcc%))
 @ANYKEY
RETURN 
'
'--------------------------------------------------
' Setup variables for a turn
PROCEDURE PRETURN
 IF TurnPrev%<>TurnCurr%
  @SETORDERS
  @CALCINTEREST 
  @UPDATEFUEL
  ' Make turn counter the same
  LET TurnPrev%=TurnCurr%
  ' New order required
  LET CpyOrderType%=0
  ' Reset damage costs
  LET ComDamCost%=0
 ENDIF
RETURN
'
'--------------------------------------------------
' Calculate the deposit account interest rate for this turn
PROCEDURE CALCINTEREST
 LOCAL rate%,change%
 LET rate%=MonIntRate%
 IF (RND(1)>0.5)
  LET change%=INT(RND(1/5)*rate)
  IF (RND(1)>0.5)
   rate%=rate%+change%
  ELSE 
   rate%=rate%-change%
  END
  LET MonIntRate%=rate%
 ENDIF
RETURN
'
'--------------------------------------------------
' Setup this turns orders
PROCEDURE SETORDERS
 LOCAL L%,A%
 LET A%=INT(RND(1)*100)+1
 OrdTotal%=0
 FOR L%=0 TO 22
  IF AptOrderProb(L%)<=A%
    ' Stock type requested (index)
    LET OrdStockType(L%)=INT(RND(1)*3)
   ' Price per unit
    LET OrdUnitPrice(L%)=INT((RND(1)*(20*AptDist(L%))+2))+ExchStockBuy(OrdStockType(L%))
    ' Stock requested
    LET OrdStockReqd(L%)=INT(RND(1)*AptOrderProb(L%))+1
    OrdTotal%=OrdTotal%+1
   ELSE
    OrdStockReqd(L%)=0
   ENDIF
 NEXT L%
RETURN
'
'--------------------------------------------------
' Perform work
PROCEDURE WORK
 @CHOOSEORDER
 IF CpyOrderType%>0
  @COMM
  @PROFITS
 ENDIF
 @DOTURN
RETURN
'
'--------------------------------------------------
' Calculate profits and losses
PROCEDURE PROFITS
 LOCAL sales%,profit%,fuel%,interest%
 'Calculate profit made
 LET sales%=OrdStockReqd(CpyOrderType%)*OrdUnitPrice(CpyOrderType%)
 LET fuel%=AptDist(CpyOrderType%)*ExchFuelBuy%
 LET profit%=sales%+interest%-ComDamCost%-fuel%
 
 ' Calculate interest on the deposit account
 LET interest%=MonDepAcc%*(MonIntRate%/100)
 ' Update current bank balance
 LET MonCurAcc%=MonCurAcc%+sales%+interest%
 
 'Update company fuel reserves
 LET CpyFuelLvl%=CpyFuelLvl%-AptDist(CpyOrderType%)
 
 'Update company stock level for delivered goods
 LET CpyStockLvl(OrdStockType(CpyOrderType%))=CpyStockLvl(OrdStockType(CpyOrderType%))-OrdStockReqd(CpyOrderType%)
 
 @HEADING("PROFIT/LOSS")
 @TEXTAT(4,"Profit from sales this trip : $"+STR$(sales%))
 @TEXTAT(5,"Maintenance costs           : $"+STR$(ComDamCost%))
 @TEXTAT(6,"Fuel costs (current price)  : $"+STR$(fuel%))
 @TEXTAT(7,"Interest on deposit account : $"+STR$(interest%))
 IF profit%>=0
  @TEXTAT(8,"Total profit                : $"+STR$(profit%))
 ELSE
  @TEXTAT(8,"Total loss                  : $"+STR$(profit%))
 ENDIF
 @ANYKEY	
RETURN
'
'--------------------------------------------------
' Turn - process a players turn
PROCEDURE DOTURN
 'Bump turn counter
 LET TurnCurr%=TurnCurr%+1
RETURN
'
'--------------------------------------------------
' Update fuel costs
PROCEDURE UPDATEFUEL
 ' Buy rate
 LET ExchFuelBuy%=INT(RND(1)*15)+10
 ' Sell rate
 LET ExchFuelSell%=ExchFuelBuy%*0.8
 ' Fuel reserves
 LET ExchFuelLvl%=ExchFuelLvl%+INT(RND(1)*200)	
RETURN
'
'--------------------------------------------------
' The help system - main menu
PROCEDURE HELPSYS
 LOCAL A%
 REPEAT
  @HEADING("HELP")
  @TEXTAT(4,"This command allows you to find out")
  @TEXTAT(5,"what a certain command means.")
  @TEXTAT(8,"Options")
  @OPTION(1,"Set up company")
  @OPTION(2,"Start trading")
  @OPTION(3,"Set company varibles")
  @OPTION(4,"Set computer variables")
  @OPTION(5,"Load saved game")
  @OPTION(6,"Save game")
  @OPTION(7,"EXIT command")
  @OPTION(8,"Quit help system")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=7
   ON A% GOSUB HELPSETUP,HELPSTART,HELPCPY,HELPCMP,HELPLOAD,HELPSAVE,HELPEXIT
  ENDIF
 UNTIL A%=8
RETURN
'
'--------------------------------------------------
'Perform banking
PROCEDURE BANKING
 LOCAL A%
 REPEAT
  @HEADING("ACCOUNTS")
  @DISPACCOUNTS
  @OPTION(1, "Transfer money from deposit to current")
  @OPTION(2, "Transfer money from current to deposit")
  @OPTION(3, "Back")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=2
   ON A% GOSUB DEPTOCUR, CURTODEP
  ENDIF
 UNTIL A%=3
RETURN
'
'--------------------------------------------------
'Transfer money from deposit to current account
PROCEDURE DEPTOCUR
 LOCAL A%
 @HEADING("ACCOUNTS - TRANSFER FROM DEPOSIT TO CURRENT")
 @DISPACCOUNTS
 LET A%=@GETINT("Amount to transfer")
 IF A%<=MonDepAcc% AND A%>=0 
  LET MonCurAcc%=MonCurAcc%+A%
  LET MonDepAcc%=MonDepAcc%-A%
 ENDIF
RETURN
'
'--------------------------------------------------
'Transfer money from current to deposit account
PROCEDURE CURTODEP
 LOCAL A%
 @HEADING("ACCOUNTS - TRANSFER FROM CURRENT TO DEPOSIT)
 @DISPACCOUNTS
 LET A%=@GETINT("Amount to transfer")
 IF A%<=MonCurAcc% AND A%>=0
  LET MonDepAcc%=MonDepAcc%+A%
  LET MonCurAcc%=MonCurAcc%-A%
 ENDIF
RETURN 
'
'--------------------------------------------------
' Display money value in accounts
PROCEDURE DISPACCOUNTS
  @TEXTAT(4,"DEPOSIT ACCOUNT: $"+STR$(MonDepAcc%)+" AT "+STR$(MonIntRate%)+"%")
  @TEXTAT(5,"CURRENT ACCOUNT: $"+STR$(MonCurAcc%))
RETURN
'
'--------------------------------------------------
'Trade on the stock market for commodities
PROCEDURE EXCHANGE 
 LOCAL A%
 REPEAT
  @HEADING("STOCK EXCHANGE")
  @LISTSTOCKS(0)
  @TEXTAT(18,"Options:-")
  @TEXTAT(19,"1. Buy stocks")
  @TEXTAT(20,"2. Sell stocks")
  @TEXTAT(21,"3. Back")
  LET A%=@GETOPT()
  IF A%>=1 OR A%<=2
   ON A% GOSUB BUYSTOCK,SELLSTOCK
  ENDIF
 UNTIL A%=3
RETURN 
'
'--------------------------------------------------
' Display stock quantity and buy/sell price
' If parameter N%>0 lines are numbered
PROCEDURE LISTSTOCKS(N%)
 LOCAL L%
 FOR L%=0 TO 2
  IF N%>0
   @TEXTAT(L%+6,""+STR$(L%+1)+". "+ExchStockName$(L%)+" BUY $"+STR$(ExchStockBuy(L%))+", SELL $"+STR$(ExchStockSell(L%))+", AVAIL: "+STR$(ExchStockLvl(L%)))
  ELSE
   @TEXTAT(L%+6,ExchStockName$(L%)+" BUY $"+STR$(ExchStockBuy(L%))+", SELL $"+STR$(ExchStockSell(L%))+", AVAIL: "+STR$(ExchStockLvl(L%)))
  ENDIF
 NEXT L%
RETURN
'
'--------------------------------------------------
' Purchase stock from stock exchange
PROCEDURE BUYSTOCK
 LOCAL A%,Q%
 REPEAT
  @HEADING("BUY STOCKS")
  @LISTSTOCKS(1)
  @TEXTAT(9,"4. Exit")
  LET A%=@GETINT("What would you like to buy")-1
  IF A%>=0 AND A%<=2 
   LET Q%=@GETINT("How many")
   IF Q%<=ExchStockLvl(A%) 
    IF MonCurAcc%>=INT(Q%*ExchStockBuy(A%)) 
     LET MonCurAcc%=MonCurAcc%-INT(Q%*ExchStockBuy(A%))
     LET ExchStockLvl(A%)=ExchStockLvl(A%)-Q%
     LET CpyStockLvl(A%)=CpyStockLvl(A%)+Q%
     @TEXTAT(19,"YOU HAVE BOUGHT "+STR$(Q%)+" STOCKS AT $"+STR$(ExchStockBuy(A%)))
     @TEXTAT(20,"YOU NOW HAVE "+STR$(CpyStockLvl(A%))+" STOCKS OF "+ExchStockName$(A%))
    ELSE
     @TEXTAT(20, "You need $"+STR$(Q%*ExchStockBuy(A%)!"+ to buy "+STR$(Q%)+" "+ExchStockName$(A%))
    ENDIF
    @ANYKEY
   ENDIF
  ENDIF
 UNTIL A%=3
RETURN
'
'--------------------------------------------------
' Sell stock to stock exchange
PROCEDURE SELLSTOCK
 LOCAL A%,Q%
 REPEAT 
  @HEADING("SELL STOCKS")
  @LISTSTOCKS(1)
  @TEXTAT(9,"4. Exit")
  @TEXTAT(14, "Choice ")
  LET A%=@GETINT("What would you like to sell")-1
  IF A%>=0 AND A%<=2 
   LET Q%=@GETINT("How many")
   'If too many specified sell all
   IF Q%>CpyStockLvl(A%)
    Q%=CpyStockLvl(A%)
   ENDIF
   IF (Q%>0)
    ' Remove stock from company accounts
    LET CpyStockLvl(A%)=CpyStockLvl(A%)-Q%
    ' Credit company with sale price
    LET MonCurAcc%=MonCurAcc%+INT(ExchStockSell(A%)*A%)
    ' Add stock to the exchange
    LET ExchStockLvl(A%)=ExchStockLvl(A%)+A%
    @TEXTAT(19,"YOU HAVE SOLD "+STR$(Q%)+" STOCKS AT $"+STR$(ExchStockSell(A%)))
    @TEXTAT(20,"YOU NOW HAVE "+STR$(CpyStockLvl(A%))+" STOCKS OF "+ExchStockName$(A%))
    @ANYKEY
   ENDIF
  ENDIF
 UNTIL A%=3
RETURN 
'
'--------------------------------------------------
' Property market
PROCEDURE PROPERTY
 LOCAL A%
 REPEAT
  @HEADING("PROPERTY MARKET")
  @TEXTAT(4,"Options :-")
  @OPTION(1,"Buy property")
  @OPTION(2,"Sell property")
  @OPTION(3,"Back")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=2
   ON A% GOSUB BUYPROPERTY,SELLPROPERTY
  ENDIF
 UNTIL A%=3
RETURN
'
'--------------------------------------------------
' Buy property
PROCEDURE BUYPROPERTY
 LOCAL A%,L%
 REPEAT
  @HEADING("BUY PROPERTY")
  @TEXTAT(4,"Your options of property are :-")
  FOR L%=1 TO 3
   @OPTION(L%,PropName$(L%)+" hangar, worth $"+STR$(PropCost(L%))+" and "+STR$(PropSize(L%))+" spaces big")
  NEXT L%
  @OPTION(4,"Back")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=2
   IF CpyPropType>0
    @TEXTAT(19, "Sell your current property first!")
   ELSE
    IF MonCurAcc%>=PropCost(A%) 
     LET MonCurAcc%=MonCurAcc%-PropCost(A%)
     LET CpyPropType%=A%
     @TEXTAT(19, "You bought a "+PropName$(CpyPropType%)+" hangar!")
    ELSE
     @TEXTAT(19, "Sorry, not enough funds available")
     @TEXTAT(20, "in your current account")
    ENDIF
   ENDIF
   @ANYKEY
  ENDIF
 UNTIL A%>=0 AND A%<=2
RETURN
'
'--------------------------------------------------
' Sell a property
PROCEDURE SELLPROPERTY
 LOCAL A%
 REPEAT
  @HEADING("SELL PROPERTY")
  @TEXTAT(4,"Options :-")
  @OPTION(1, "Sell your property")
  @OPTION(2, "Skip this screen")
  LET A%=@GETOPT()
  IF A%=1 AND CpyPropType%>=0
   LET CpyPropCost%=PropCost(CpyPropType%)
   LET CpyPropSale%=CpyPropCost%-PropSaleFee%
   @TEXTAT(19, "You sold your "+PropName$(CpyPropType%)+" hangar for $"+STR$(CpyPropSale%)+"!")
   @TEXTAT(20, " - this includes a $"+STR$(PropSaleFee%)+" transaction fee")
   LET MonCurAcc%=MonCurAcc%+CpyPropSale%
   LET CpyPropType%=0
   @ANYKEY
  ELSE
   @TEXTAT(19, "You don't have a property to sell!")
  ENDIF
 UNTIL A%=2
RETURN 
'
'--------------------------------------------------
' Fuel Market
PROCEDURE FUEL 
 LOCAL L%
 REPEAT
  @HEADING("FUEL MARKET")
  @TEXTAT(4,"Your fuel reserves : "+STR$(CpyFuelLvl%)+" klbs")
  @TEXTAT(5,"Fuel available    : "+STR$(ExchFuelLvl%)+" klbs")
  @OPTION(1,"Buy fuel")
  @OPTION(2,"Sell fuel")
  @OPTION(3,"Back")
  @TEXTAT(15,"BUYING RATE  : $"+STR$(ExchFuelBuy%))
  @TEXTAT(16,"SELLING RATE : $"+STR$(ExchFuelSell%))
  LET L%=@GETOPT()
  IF L%>=1 AND L%<=2
   ON L% GOSUB BUYFUEL,SELLFUEL
  ENDIF
 UNTIL L%=3
RETURN
'
'--------------------------------------------------
' Buy Fuel
PROCEDURE BUYFUEL
 LOCAL Q%
 LET Q%=@GETINT("How much fuel do you want to buy?")
 IF Q%<ExchFuelLvl% AND MonCurAcc%>=(A*ExchFuelBuy%) 
  LET CpyFuelLvl%=CpyFuelLvl%+Q%
  LET MonCurAcc%=MonCurAcc%-(Q%*ExchFuelBuy%)
  LET ExchFuelLvl%=ExchFuelLvl%-Q%
  @TEXTAT(20,"YOU HAVE BOUGHT "+STR$(Q%)+" klbs AT $"+STR$(ExchFuelBuy%))
  @ANYKEY
 ENDIF
RETURN
'
'--------------------------------------------------
' Sell Fuel
PROCEDURE SELLFUEL
 LOCAL Q%
 LET Q%=@GETINT("How much fuel do you want to sell?")
 IF Q%<=CpyFuelLvl% 
  LET CpyFuelLvl%=CpyFuelLvl%-Q%
  LET MonCurAcc%=MonCurAcc%+(Q%*ExchFuelSell%)
  LET ExchFuelLvl%=ExchFuelLvl%+Q%
  @TEXTAT(20,"YOU HAVE SOLD "+STR$(Q%)+" klbs AT $"+STR$(ExchFuelSell%))
 ENDIF
RETURN
'
'--------------------------------------------------
' Plane Market
PROCEDURE PLANEMARKET 
 LOCAL L%
 REPEAT
  @HEADING("PLANE MARKET")
  @OPTION(1,"Buy plane")
  @OPTION(2, "Sell plane")
  @OPTION(3, "Back")
  LET L%=@GETINT("Option?")
  IF L%>=1 AND L%<=3
   ON L% GOSUB BUYPLANE,SELLPLANE
  ENDIF
 UNTIL L%=3
RETURN
'
'--------------------------------------------------
' Buy Plane
PROCEDURE BUYPLANE 
 LOCAL A%,L%
 REPEAT
  @HEADING("BUY PLANE")
  FOR L%=1 TO AIR_TYPE_CNT%-1
   @TEXTAT((L%*2)+4,""+STR$(L%)+". "+AirName$(L%)+" Cost: $"+STR$(AirCost(L%))+", Space Required: "+STR$(AirSpace(L%)))
   @TEXTAT((L%*2)+5,"   Cargo: "+STR$(AirCargo(L%))+", Range: "+STR$(AirRange(L%))+", Burn Rate: "+STR$(AirFuel(L%)))
  NEXT L%
  @TEXTAT((6*2)+4,STR$(AIR_TYPE_CNT%)+". Back")
  LET A%=@GETOPT()
  IF A%>=1 AND A%<=AIR_TYPE_CNT%
   IF CpyAirType%>0
    @TEXTAT(20, "You must sell your current plane first!")
   ELSE
    ' Enough money in current account?
    IF MonCurAcc%>=AirCost(A%) 
     ' Big enough hanger?
     IF PropSize(CpyPropType%)>=AirSpace(A%)
      'Update bank balance
      LET MonCurAcc%=MonCurAcc%-AirCost(A%)
      'Own new plane
      LET CpyAirType%=A%
      @TEXTAT(20,"You have bought a "+AirName$(CpyAirType%))
      'Back to menu
      LET A%=AIR_TYPE_CNT%
     ELSE
      @TEXTAT(20,"Your hanger isn't big enough!")
     ENDIF
    ELSE
     @TEXTAT(20,"Not enough funds in your current account")
    ENDIF
   ENDIF
   @ANYKEY
  ENDIF
 UNTIL A%=AIR_TYPE_CNT%
RETURN
'
'--------------------------------------------------
' Sell Plane
PROCEDURE SELLPLANE
 LOCAL A%,SalePrice%
 REPEAT
  @HEADING("SELL PLANE")
  @OPTION(1,"Sell plane")
  @OPTION(2,"Back")
  LET A%=@GETINT("Choice?")
  IF A%=1 AND CpyAirType%>0
    LET SalePrice%=(AirCost(CpyAirType%)-(T*250))
    LET MonCurAcc%=MonCurAcc%+SalePrice%
    LET CpyAirType%=0
    @TEXTAT(20, "You have sold your plane for: $"+STR$(SalePrice%))
    ' back to menu
    LET A%=2
    @ANYKEY
   ENDIF
  ENDIF
 UNTIL A%=2
RETURN 
'
'--------------------------------------------------
' Select an order to fulfill
PROCEDURE CHOOSEORDER
 LOCAL L%,burnRate%,range%,holdSize%,fuelReqd%,stockName$
 LET L%=0
 LET CpyOrderType%=0
 LET burnRate%=AirFuel(CpyAirType%)
 LET range%=AirRange(CpyAirType%)
 LET holdSize%=AirCargo(CpyAirType%)
 REPEAT
  LET L%=L%+1
  LET fuelReqd%=AptDist(L%)*burnRate%
  LET stockName$=ExchStockName$(OrdStockType(L%))
  @HEADING("ORDER REQUEST "+STR$(L%)+" OF "+STR$(OrdTotal%))
  @TEXTAT(4,AptName$(L%)+" REQUESTS "+STR$(OrdStockReqd(L%)))
  @TEXTAT(5," "+stockName$+" AT $"+STR$(OrdUnitPrice(L%))+" EACH")
  @TEXTAT(7,"Distance      : "+STR$(AptDist(L%))+", Aircraft Range: "+STR$(AirRange(CpyAirType%)))
  @TEXTAT(8,"Fuel Required : "+STR$(fuelReqd%)+", Fuel Reserves: "+STR$(CpyFuelLvl%))
  @TEXTAT(10,"Stocks Available: ")
  @TEXTAT(11,"FOOD          : "+STR$(CpyStockLvl(FOODSTUFFS_TYPE%)))
  @TEXTAT(12,"MEDICAL       : "+STR$(CpyStockLvl(NEDICINE_TYPE%)))
  @TEXTAT(13,"MACHINERY     : "+STR$(CpyStockLvl(MACHINERY_TYPE%)))
  
  LET A$=@GETSTR("Take order (Y=YES)?")
  IF A$="Y" OR A$="y"
   ' Does the company have enough of the required stock type available?
   IF OrdStockReqd(L%)<=CpyStockLvl(OrdStockType(L%))
    ' Has the company plane got enough space to carry the required cargo?
    IF OrdStockReqd(L%)<=AirCargo(CpyAirType%)
     ' Does the company plane have the range to reach the airport?
     IF AptDist(L%)<=AirRange(CpyAirType%)
      'Does the company have enough fuel to reach the airport
      IF AptDist(L%)*burnRate%<CpyFuelLvl% 
       'Chosen order
       LET CpyOrderType%=L%
       @TEXTAT(20, "Order can be fulfilled and has been accepted!")
      ELSE
       @TEXTAT(20,"Not enough fuel available, "+STR$(fuelReqd%)+" klbs Required")
      ENDIF
     ELSE
      @TEXTAT(20,"	Aircraft doesn't have the range, order must be within "+STR$(range%)+" miles")
     ENDIF
    ELSE
     @TEXTAT(20,"Cargo capacity of aircraft exceeded by "+STR$(OrdStockReqd(L%)-holdSize%)+" units")
    ENDIF
   ELSE
    @TEXTAT(20,"You cannot fulfill this order, not enough "+stockName$+" in stock")
   ENDIF
   @ANYKEY
  ENDIF
 ' Finish when order selected or out of orders to choose from
 UNTIL L%=APT_CNT%-1 OR CpyOrderType%>0
RETURN 
'
'--------------------------------------------------
' Show communications from the aircraft
PROCEDURE COMM 
 LOCAL A%,L%,D%
 LET ComFromAir(0)=0
 LET ComFromAir(1)=0
 LET ComFromAir(2)=0
 @HEADING("COMMUNICATION")
 @TEXTAT(4,"Some recent messages from the aircraft:")
 ' Number of messages received
 LET L%=INT(RND(1)*2)
 ' ComFromAir(A) contains the index of received messages
 ' You may receive the same message more than once (currently)
 FOR A%=0 TO L%
  LET ComFromAir(A%)=INT(RND(1)*40)
 NEXT A%
 ' Damage (in points)
 LET D%=0
 LET ComDamCost%=0
 FOR A%=0 TO L%
  @TEXTAT(A%+6,STR$(A%+1)+". "+ComMsg$(ComFromAir(A%))+", "+STR$(ComCost(ComFromAir(A%)))+" DAMAGE")
  LET D%=D%+ComCost(ComFromAir(A%))
 NEXT A%
 IF D%>0
  'Calculate cost
  LET ComDamCost%=D%*ComDamMult%
  @TEXTAT(22,"Repairs cost you $"+STR$(ComDamCost%))
  IF ComDamCost%>MonDepAcc%+MonCurAcc%
   'Clear out the accounts
   LET MonDepAcc%=0
   LET MonCurAcc%=0
   @TEXTAT(22,"You cannot afford damages, you are bankrupt!)
  ELSE
   IF MonCurAcc%>=ComDamCost% 
    LET MonCurAcc%=MonCurAcc%-ComDamCost%
    IF MonDepAcc%>=ComDamCost% 
     LET MonDepAcc%=MonDepAcc%-(D%*100)
    ENDIF
    @TEXTAT(20,"You pay $"+STR$(ComDamCost%)+" costs")
   ENDIF
  ENDIF
 ELSE
  @TEXTAT(20,"Thanks to skilled pilots no damage this trip")
 ENDIF
 @ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Setup company help
PROCEDURE HELPSETUP
 @HEADING("SET UP COMPANY")
 @TEXTAT(6,"This command allows you to set up the")
 @TEXTAT(7,"company before playing the actual game.")
 @TEXTAT(8,"Use this command or the set company")
 @TEXTAT(9,"variables command before playing game.")
@ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Start business
PROCEDURE HELPSTART
 @HEADING("START TRADING")
 @TEXTAT(6,"This command runs the game part of the")
 @TEXTAT(7,"program.You have to use set up company")
 @TEXTAT(8,"or set company variables before ")
 @TEXTAT(9,"choosing this command.")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Set company variables
PROCEDURE HELPCPY
 @HEADING("SET COMPANY VARIABLES")
 @TEXTAT(6,"This command allows you to set up a ")
 @TEXTAT(7,"situation from which you can start ")
 @TEXTAT(8,"playing. Use this instead of set up ")
 @TEXTAT(9,"company command.")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Set computer variables
PROCEDURE HELPCMP
 @HEADING("SET COMPUTER VARIABLES")
 @TEXTAT(6,"This command allows you to set up ")
 @TEXTAT(7,"certain computer variables.Select this")
 @TEXTAT(8,"command to see what variables!")
 @TEXTAT(9,"(This command does not alter the ")
 @TEXTAT(10,"company variables)")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Load Saved Game
PROCEDURE HELPLOAD
 @HEADING("LOAD SAVED GAME")
 @TEXTAT(6,"This command allows you to load a ")
 @TEXTAT(7,"previously saved game,and play it from")
 @TEXTAT(8,"where you left off.")
 @TEXTAT(9,"Use save game command to save game.")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Save Game
PROCEDURE HELPSAVE
 @HEADING("SAVE GAME")
 @TEXTAT(6,"This command allows you to save a game")
 @TEXTAT(7,"so that you may load and play it later.")
 @TEXTAT(8,"Use the save game command to save the")
 @TEXTAT(9,"game. Have a disk in the drive to save")
 @TEXTAT(10,"the game on,or a cassette")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' The help system - Start business
PROCEDURE HELPEXIT
 @HEADING("EXIT PROGRAM")
 @TEXTAT(6,"This command allows you to exit the ")
 @TEXTAT(7,"system. Don't do it just for a laugh!!")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' Retrieve a menu option choice from the user
FUNCTION GETOPT()
 LOCAL A%,Q$
 @TEXTAT(23,"                                    ")
 LET Q$=@PROMPT("SELECT CHOICE NOW")
 @TEXTAT(22, Q$)
 INPUT A%
RETURN A%
'
'--------------------------------------------------
' Retrieve an integer option
FUNCTION GETINT(P$)
 LOCAL A%,Q$
 ' Clear the prompt line
 @TEXTAT(23,"                                    ")
 LET Q$=@PROMPT(P$)
 @TEXTAT(22, Q$)
 INPUT A%
RETURN A%
'
'--------------------------------------------------
' Retrieve an string option
FUNCTION GETSTR(P$)
 LOCAL A$,L%,I%,Q$
 ' Clear the prompt line
 @TEXTAT(23,"                                    ")
 LET Q$=@PROMPT(P$)
 @TEXTAT(22, Q$)
 INPUT A$
RETURN A$
'
'--------------------------------------------------
' Ensure prompt is long enough to clear old text
FUNCTION PROMPT(P$)
 LOCAL L%,I%,Q$
 LET Q$=P$
 LET L%=60-LEN(P$)
 FOR I%=1 TO L%
  LET Q$=Q$+" "
 NEXT I%
RETURN Q$
'
'--------------------------------------------------
' Print the program title
PROCEDURE TITLE
 @HEADING("AIRLINE MANAGER")
 @TEXTAT(9,"by M.Wickens.")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' Accept any keyboard input to proceed
PROCEDURE ANYKEY
 LOCAL Q$,A$
 ' Clear the prompt line
 @TEXTAT(23,"                                    ")
 LET Q$=@PROMPT("Press any key")
 @TEXTAT(22, Q$)
 INPUT A$
RETURN
'
'--------------------------------------------------
' Not applicable - option doesn't currently work
PROCEDURE NA
 @HEADING("Sorry this option isn't currently implemented")
 @ANYKEY
RETURN
'
'--------------------------------------------------
' Print a menu heading
' Params:
'   T$ - Title string
PROCEDURE HEADING(T$)	
 LOCAL N%,I%,B$
 CLS
 PRINT AT(1,20);CHR$(27);"[0;34m";T$;CHR$(27);"[m"
 LET N%=LEN(T$)
 FOR I%=1 TO N%
   LET B$=B$+"="
 NEXT I%
 PRINT AT(2,20);CHR$(27);"[0;31m";B$;CHR$(27);"[m"
RETURN
'
'--------------------------------------------------
' Print a menu option
' Params:
'   N - Option number
'   O$ - Option text
PROCEDURE OPTION(N,O$)	
 @TEXTAT(N+6	,""+STR$(N)+". "+O$)
RETURN
'
'--------------------------------------------------
' Print a string on the given line
' Params:
'   L - line starting at column 1
'   T$ - text
PROCEDURE TEXTAT(L,T$)	
 PRINT AT(L,3);CHR$(27);"[0;30m";T$;CHR$(27);"[m"
RETURN
'
'----------------------------------------------------------------------
' Definition of data size constants
PROCEDURE CONSTS
 ' Foodstuffs type
 LET FOODSTUFFS_TYPE%=0
 ' Medicine type
 LET MEDICINE_TYPE%=1
 ' Machinery type
 LET MACHINERY_TYPE%=2
 ' Number of airports
 LET APT_CNT%=23
 ' Number of stock types
 LET STOCK_TYPE_CNT%=3
 ' Number of aircraft
 LET AIR_TYPE_CNT%=6
 ' Number of property types
 LET PROP_TYPE_CNT%=4
 ' Number of communication types
 LET COM_TYPE_CNT%=40
 ' Fuel cost multiplier
 LET FUEL_BUY_MULT%=10
RETURN
'
'----------------------------------------------------------------------
' Dimensioning as required for global arrays
PROCEDURE DIMS
 ' Aircraft
 DIM AirName$(AIR_TYPE_CNT%),AirCost(AIR_TYPE_CNT%),AirCargo(AIR_TYPE_CNT%),AirRange(AIR_TYPE_CNT%)
 DIM AirSpace(AIR_TYPE_CNT%),AirFuel(AIR_TYPE_CNT%),O(AIR_TYPE_CNT%)
 ' Company stock levels
 DIM CpyStockLvl(STOCK_TYPE_CNT%)
 ' Airport orders
 DIM OrdStockReqd(APT_CNT%),OrdStockType(APT_CNT%),OrdUnitPrice(APT_CNT%)
 ' Exchange stock names, levels and buy/sell prices
 DIM ExchStockName$(STOCK_TYPE_CNT%),ExchStockLvl(STOCK_TYPE_CNT%)
 DIM ExchStockBuy(STOCK_TYPE_CNT%),ExchStockSell(STOCK_TYPE_CNT%)
 ' Airport and airport order parameters
 DIM AptName$(APT_CNT%),AptDist(APT_CNT%),AptOrderProb(APT_CNT%),D3(APT_CNT%),
 DIM PropName$(PROP_TYPE_CNT%),PropCost(PROP_TYPE_CNT%),PropSize(PROP_TYPE_CNT%),
 DIM ComMsg$(COM_TYPE_CNT%),ComCost(COM_TYPE_CNT%),ComFromAir(COM_TYPE_CNT%)
 DIM S1(STOCK_TYPE_CNT%),S2(STOCK_TYPE_CNT%)
RETURN
'
'----------------------------------------------------------------------
' Sets up global variables
PROCEDURE VARSET
 ' Current account value/$
 LET MonCurAcc%=5000
 ' Deposit account value/$
 LET MonDepAcc%=15000	
 ' Deposit account interest rate
 LET MonIntRate%=INT(RND(1)*3)+6
 ' Stock levels of foodstuffs at the exchange
 LET ExchStockLvl(0)=INT(RND(1)*100)+50
 ' Stock levels of medicine at the exchange
 LET ExchStockLvl(1)=INT(RND(1)*100)+50
 ' Stock levels of machinery at the exchange
 LET ExchStockLvl(2)=INT(RND(1)*100)+50
 ' The property (hangar) owned by the company
 LET CpyPropType%=0
 ' The aircraft type owned by the company
 LET CpyAirType%=0
 ' Number of foodstuffs held
 LET CpyStockLvl(0)=10
 ' Number of medicine held
 LET CpyStockLvl(1)=5
 ' Number of machinery held
 LET CpyStockLvl(2)=2
 ' Fuel reserves
 LET CpyFuelLvl%=10
 ' Gallons of fuel available
 LET ExchFuelLvl%=INT(RND(1)*100)+50
 'Communications from the aircraft
 LET ComFromAir(0)=0
 LET ComFromAir(1)=0
 LET ComFromAir(2)=0
 ' Property selling transaction fee
 LET PropSaleFee%=500
 ' Turn numbers in the simulation
 ' Previous turn
 LET TurnPrev%=0
 ' Current turn
 LET TurnCurr%=1
 ' Cost multiplier for damage
 LET ComDamMult%=100
RETURN
'
'--------------------------------------------------
' Setup data on aircraft
PROCEDURE AIRCRAFT
 LOCAL L%
 FOR L%=0 TO AIR_TYPE_CNT%-1
  'Name, cost, cargo, range, hangar space, fuel consumption
  READ AirName$(L%),AirCost(L%),AirCargo(L%),AirRange(L%),AirSpace(L%),AirFuel(L%)
 NEXT L%
 'Name, Cost, Cargo, Range, Space & Fuel Consumption
 DATA "None",0,0,0,0,0
 DATA "Cessna Caravan",10000,5,50,1,1
 DATA "Twin Prop",30000,8,50,2,2
 DATA "Single Jet",60000,15,90,4,5
 DATA "Boeing 737",100000,20,90,5,8
 DATA "Jumbo",200000,35,100,8,13
RETURN
'
'----------------------------------------------------------------------
' Define available stocks
PROCEDURE STOCKS 
 LOCAL L%
 FOR L%=0 TO STOCK_TYPE_CNT%-1
  'Stock name, stock buy, stock sell, stock cost, ???
  READ ExchStockName$(L%),ExchStockBuy(L%),ExchStockSell(L%),S1(L%),S2(L%)
 NEXT L%
 DATA "FOODSTUFFS",20,15,5,60
 DATA "MEDICINE",35,30,10,30
 DATA "MACHINERY",50,40,20,10
RETURN 
'
'--------------------------------------------------
' Set up property data
PROCEDURE PROPERTIES
 LOCAL L%
 FOR L%=0 TO PROP_TYPE_CNT%-1
  'Property name, cost, hangar size
  READ PropName$(L%),PropCost(L%),PropSize(L%)
 NEXT L%
 DATA "None",0,0
 DATA "Small",1000,2
 DATA "Medium",4000,5
 DATA "Large",9000,10
RETURN
'
'--------------------------------------------------
' Define airports and parameters
PROCEDURE AIRPORTS 
 LOCAL L%
 FOR L%=0 TO APT_CNT%-1
  ' Airport name, I think these are some kind of probabilities
  READ AptName$(L%),AptDist(L%),AptOrderProb(L%),D3(L%)
 NEXT L%
 DATA "CHICAGO",0,0,0
 DATA "SCHAUMBURG AIR PARK",10,25,5
 DATA "MERRILL.C.MEIGS",17,15,8
 DATA "MIDWAY",15,10,7
 DATA "DUPAGE",17,8,6
 DATA "CLOW INTL",20,5,5
 DATA "HOWEL",25,10,10
 DATA "LEWIS UNIVERSITY",27,10,10
 DATA "AURORA MUNI",30,15,15
 DATA "LANSING MUNI",33,13,10
 DATA "JOLIET PARK DISTRICT",27,10,10
 DATA "NEW LENOX-HOWELL",33,18,10
 DATA "FRANKFORT",35,20,15
 DATA "SANGER",38,10,20
 DATA "MORRIS MUNI",40,10,20
 DATA "DWIGHT",50,10,20
 DATA "GREATER KANKAKEE",55,30,30
 DATA "GIBSON CITY MUNI",93,20,50
 DATA "PAXTON",96,15,55
 DATA "BLOOMINGTON-NORMAL",106,10,70
 DATA "VERMILLION CO",115,25,80
 DATA "FRASCA FIELD",125,10,85
 DATA "UNI OF ILLINIOS-WILLARD",135,8,100
RETURN
'
'----------------------------------------------------------------------
' Define list of possible communications and any associated damage
PROCEDURE COMMSET 
 LOCAL L%
 FOR L%=0 TO COM_TYPE_CNT%-1
  'Communication, Associated cost
  READ ComMsg$(L%),ComCost(L%)
 NEXT L%
 DATA "LANDED WITHOUT ANY PROBLEMS",0
 DATA "LANDED WITH SLIGHT BOUNCING",1
 DATA "SLIGHTLY ROUGH PASSAGE",1
 DATA "HIT A SMALL AIR POCKET",1
 DATA "SOME CARGO DISTURBANCE",1
 DATA "LOST RADIO CONTACT",1
 DATA "HIT LARGE AIR POCKET",2
 DATA "ROUGH PASSAGE",2
 DATA "HARD WIND BUFFETING",2
 DATA "CARGO DISTURBANCE",2
 DATA "ROUGH LANDING",2
 DATA "LANDED SMOOTHLY AND SAFELY",0
 DATA "PERFECT LANDING",0
 DATA "RUDDER JAMMED",2
 DATA "HARD LANDING",3
 DATA "VERY STRONG WINDS",3
 DATA "UNDERCARRIAGE NOT LOCKED",3
 DATA "NO GIRO COMPASS",3
 DATA "BIRD IN ENGINE",3
 DATA "TAILPLANE SEVERED",3
 DATA "CONTROL SURFACES FROZEN",4
 DATA "NORMAL LANDING",0
 DATA "GREAT FLIGHT",0
 DATA "HARMLESS JOURNEY",0
 DATA "LIKE A SWAN",0
 DATA "HEAVY STORM",4
 DATA "LEADING EDGES FROZEN",4
 DATA "WINDSCREEN SMASHED",5
 DATA "BAD FOOD",5
 DATA "NO UNDERCARRIAGE",7
 DATA "FOG-BAD LANDING",7
 DATA "PILOTS KNOCKED OUT BY BUFFETING",10
 DATA "MID-AIR COLLISION",10
 DATA "CRASHED ",10
 DATA "FLAPS JAMMED",1
 DATA "THROTTLES NOT CORRECT",2
 DATA "PERFECT LANDING",0
 DATA "PILOTS DREAM",0
 DATA "TOUCH-DOWN",0
 DATA "ROGER AND OUT!",0
RETURN 
' ----- End of program -----
' :indentSize=1:
