## DEG

### Purpose
Converts a sexagesimal value to a decimal value.

### Format
```basic
DEG    ( degrees   [ , minutes   [ , seconds ] ] )
          └─┬──┘        └─┬──┘        └─┬──┘ 
         Numeric       Numeric       Numeric
        Expression    Expression    Expression    
```

### Example
```basic
DEG(1, 30, 10)
```

### Parameters
Degrees, minutes, seconds: | DEG(degrees, minutes, seconds) | < 10¹⁰⁰

### Explanation
Converts the degrees, minutes, and seconds of sexagesimal values to
decimal values as follows:

DEG (degrees, minutes, seconds) = degrees + minutes ÷ 60 + seconds ÷ 3600

### Sample Program
```basic
10  INPUT "DEGREES="; A
20  INPUT "MINUTES="; B
30  INPUT "SECONDS="; C
40  D = DEG(A,B,C)
50  PRINT D
60  END
```
Converts values entered for degrees, minutes, and seconds into a decimal value.
