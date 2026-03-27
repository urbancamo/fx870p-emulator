## WRITE#

### Purpose
Rewrites and deletes DATA BANK data.

### Format
```basic
       ⎡  DATA BANK data       ⎡ DATA BANK data  ⎤  ⎤
WRITE# ⎢  └─────┬──────┘   ,   ⎣  └─────┬──────┘ ⎦  ⎥
       ⎣   Expression             Expression        ⎦
```

### Example
```basic
WRITE# "ABCDEF"
```

### Parameters
DATA BANK data: String or numeric expression

### Explanation
1. Sequentially writes DATA BANK data from the current DATA BANK area pointer (see [RESTORE#](RESTORE_HASH.md)).
2. New data are written regardless of whether or not data already exist at the pointer location.
3. The entire record (line) is cleared when this command is executed without any DATA BANK data expressions.
4. Multiple data items can be delimited using commands.
5. The DATA BANK area pointer stays at the next data item written after execution of this
command. Further data item writing begins from this point unless the pointer position 
is changed using [RESTORE#](RESTORE_HASH.md).
6. 255 characters per line can be written using this command, and an error is generated when this limited is exceeded.
7. Numeric expressions written using this command are written using the same format as [PRINT](PRINT.md) statement display.
Note, however, that the [SET](SET.md) statement has no effect here.
8. This command cannot be used to write character codes &H1F or lower.

### Sample Program
```basic
10  RESTORE#
20  RESTORE# "YOU", 0, 50
30  WRITE# "SHE"
40  GOT 20
50  PRINT "COMPLETE!"
60  END
```

Changes DATA BANK data beginning with "YOU" to "SHE".

