# BASIC Program - FLE Logger

This program implements a logging program for amateur radio contacts.
The format of input should be similar to the Fast Log Entry format.
See the project in ../sfle for a web-based implementation.

## Initial screen

When run initially the program should check if there is any data
stored from a previous entry. The data will be stored in the memo facility.
See https://urbancamo.github.io/casio-basic/doc/part-5-data-bank-function.html for details 
of the BASIC commands that are used to access the memo facility.

If data is found, a prompt should ask if the user wants to resume the previous log
or start a new one.

## Input format

Sample Fast Log Entry format files can be found in the directory ./reference/sfle/data
This is the format in which data should be stored for a log in the memo facility.

### Log configuration

A series of questions should be asked when starting a new log:

 - callsign
 - operator
 - activity

Activity can be one of: POTA, SOTA or WWFF. If an activity is specified a prompt should be
made for the activity reference.

For example:
```
   Activity: (N) None, (P) POTA, (S) SOTA, (W) WWFF?
```

If an activity is specified, then prompt for the reference, in this case they answered `W`:
```
    WWFF Reference: 
```

Once the log pre-amble is collected we then enter a loop to enable the user to enter details
of an activation.

This will consist of single lines of text being entered.

The display should look like this, with a status line at the top:

```
<callsign> <activity> <band> <freq>
10m ssb
1204 m5tue/p 28.350 59 59 g/ld-050 #io84ni
05 g8cpz/p g/ld-038 54 34 #io83pq
<new entry>
```

Not sure how you will implement text entry, possibly by requesting a full line of text, rather than handling each
keypress with inkey$.

The status line should show the entered pre-amble, and also update with the latest band and frequency.

Entries in the FLE format are designed to require the minimum amount of information to be entered.
As such each subsequent entry builds on any retained information from a previous entry, for example, 
times can be specified with reference to a previously entered hour, so the first entry above `1204` specifies 
an hour of 12, the subsequent entry `05` will be logged at 1205. 

Each line entered should be stored in the memo facility, building up a copy of the entered data one line at time.
Note that you do not need to parse any of the entry data, you can simple accept a record and store it. They will be 
of different lengths and contain different data, but the pre-amble will always be the same and should be stored as 
soon as it is all captured.

When the user enters 'q' on the single line then the log file is complete.

One of the main menu options should be 'Download'. This should open the COM0: port at 4,800 baud and then write each
of the records stored in the memo facility out to the COM0: port, then close the port when finished.
