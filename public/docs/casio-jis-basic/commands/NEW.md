*back to [Command Reference](../index.md#command-reference-alphabetical)*

## NEW [ALL]

**[All Models]**

### Purpose
Deletes a program.

### Format
```basic
NEW [ALL]
```

### Example
```basic
NEW
```

### Explanation
1. Deletes the program in the currently specified program area when `ALL` is omitted.
Variables are not cleared.
2. **READY Pn** is displayed on the screen after the program is deleted, and the
computer stands by for command input.
3. All files that are currently opened are closed.
4. This command cannot be executed for program files that are protected by a password.
5. Attempting to use this command in the `CAL` mode results in an FC error.
6. Specifying `NEW ALL` clears the programs in all program areas and all variables.
7. This command cannot be included within a program.
