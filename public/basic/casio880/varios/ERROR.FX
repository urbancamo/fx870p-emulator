1 CLS
2 IF ERR=10 THEN PRINT "No existe Programa..."
3 IF ERR=14 THEN PRINT "Error matem tico"
4 IF ERR=0 THEN END
5 IF ERR=1 THEN PRINT "Memoria insuficiente"
6 IF ERR=2 THEN PRINT "Error sint ctico"
7 IF ERR=13 THEN PRINT "Numero muy grande"
8 IF ERR=16 THEN PRINT "Par metro fuera de margen"
9 IF ERR=15 THEN PRINT "Matriz re-dimensionada"
10 IF ERR=17 THEN PRINT "Funcion erronea","Comando ilegal"
11 IF ERR=18 THEN PRINT "Linea inexistente"
12 IF ERR=19 THEN PRINT "No concuerdan las variables($)","No concuerda READ con los DATA"
13 IF ERR=22 THEN PRINT "No hay datos en el DATA"
14 IF ERR=23 THEN PRINT "No hay FOR para un NEXT "
15 IF ERR=24 THEN PRINT "No hay NEXT para un FOR "
16 IF ERR=25 THEN PRINT "No hay un GOSUB o un RETURN "
17 PRINT "Linea"ERLREV" <Pulsa una tecla> "NORM
18  RETURN
