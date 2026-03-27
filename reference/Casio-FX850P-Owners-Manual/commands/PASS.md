## PASS

### Purpose
Specifies or cancels a password.

### Format
```basic
PASS     "password"
          └──┬───┘
     String expression
```
### Example
```basic
PASS "TEXT"
```

### Parameters
1. Registering a single password makes it the password for all program areas
   (P0 ~ P9) and for DATA BANK function.
2. The password must be a string of 1 ~ 8 characters.
3. All characters after the first 8 are ignored when 9 or more characters are entered.

### Explanation
1. The password is used to protect programs and DATA BANK data.
2. The password can be registered in both the `CAL` mode and `BASIC` mode.
3. Executing this command registers a password when no password previously exists.
4. Executing the `PASS` statement using a previously registered password cancels
the password. Specifying a password that is different from that registered, 
results in a [PR](../part-12-2-error-messages.md#pr-error) error.
5. The following operations and commands cannot be executed when a password is registered:
- Program write
- `MEMO IN` mode specification
- `MEMO` search
- LIST, LLIST, LIST ALL, LLIST ALL, LIST#, NEW, NEW ALL, NEW#
- `EDIT`
- SAVE, SAVE# to RS-232C
- SAVE, SAVE# to cassette tape in ASCII format.
6. Executing [SAVE](SAVE_SAVE_ALL) and [SAVE ALL](SAVE_SAVE_ALL) to cassette
tape applies the password to the saved program.
7. Loading a program (using [LOAD](LOAD_LOAD_ALL.md) or [LOAD ALL](LOAD_LOAD_ALL.md))
which is protected by a password into the computer causes the password of the loaded
program to be registered as the computer password. A [PR](../part-12-2-error-messages.md#pr-error) error
is generated when the current password differs from the password of the loaded program.
