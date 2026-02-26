1CLS:INPUT"Tamiz exceso :",DE
2INPUT"% Tamiz exceso :",PE
3INPUT"Tamiz defecto :",DD
4INPUT"% Tamiz defecto :",PD
5PRINT "Tmaximo=";EXP((90-PD)/(PE-PD)*LN(DE/DD)+LN(DE))
