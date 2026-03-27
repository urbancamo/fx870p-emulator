## LOAD, LOAD ALL

### Purpose
Reads from a file into memory.

### Format
```basic
LOAD [ALL]   "file descriptor"  [, A]
              └──────┬──────┘
             String expression
```

### Example
```basic
LOAD "DEMO1"
```

### Parameters
1. `ALL`: Inputs programs to program areas P0 to P9. Can only be specified for input from cassette tape.
2. file descriptor: String expression
3. `, A`: Specifies ASCII format for cassette tape. Binary format is the default
   option when `, A` is omitted. ASCII format is the default option for the communications
   circuit, whether specified or not.

### Explanation
1. Reads from the file specified by the file descriptor to the currently specified
   program area. The format of the file can be either internal ASCII format.
2. `CAS0:` is the default option when the device name is omitted from the file descriptor.
3. Files already in existence before execution of this command are deleted, and the specified files are loaded in their place.
4. This command closes all open files and the computer waits for command input once load is complete.
5. Passwords and program loading.

| Computer    | Loaded program | Result                                          |
|-------------|----------------|-------------------------------------------------|
| Password    | Password       | LOAD possible when passwords are identical only |
| Password    | No password    | LOAD possible                                   |
| No password | No password    | LOAD possible                                   |
| No password | Password       | LOAD possible (under program password           |

6. Specifying `ALL` reads ALL files (file with attribute A, created using [SAVE ALL](SAVE_SAVE_ALL.md))
   from cassette tape into areas P0 through P9.
7. This command cannot be executed in the CAL mode.
8. This command cannot be executed while program execution is halted.
9. The first file on the cassette tape with an attribute which matches the one specified the default option when the entire file descriptor is omitted.
   `LOAD`: first file saved in internal format (attribute B)
   `LOAD ALL`: first file saved in ALL format (attribute A)
   `LOAD , A:` first file saved in ASCII format (attribute S)

### See
 - [SAVE](SAVE_SAVE_ALL.md)

### Sample Execution
```basic
LOAD "CAS0:TEST
```
Reads program under filename `TEST` from cassette tape.