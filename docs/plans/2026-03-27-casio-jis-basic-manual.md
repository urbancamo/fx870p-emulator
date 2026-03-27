# Casio JIS Standard Basic Manual

There currently doesn't exist a manual that describes the Casio
JIS Standard Basic programming language in a generic fashion across the
Casio Pocket computer models that support it.

The manual should be in fully hyperlinked Markdown format and stored in this directory: `public/docs/casio-jis-basic`

## Requirements

Implement a standalone Casio JIS Standard Basic manual in Markdown that draws on the
existing documentation:

- [Casio FX850P Owners manual](../../reference/Casio-FX850P-Owners-Manual/casio-fx850-owners-manual.md) - I will refer to this as the **Wickens manual**
- [Casio FX850P Undocumened Basic Commands](../../reference/guiafx85/Casio-FX850P-undocumented-BASIC-commands.md)
- [Casio FX870P_VX4_Manual](../../docs/CasioVX-4-Manual-Peter-Rost.pdf) - I will refer to this as the **Rost Manual**

The manual should cover the following models:

 - Casio FX-850P and FX-880P (essentially the same model, the FX-850P has 32KB of memory, the FX-880P has 64KB)
 - Casio FX-870P and VX-4 (these are essentially two names for the same model)
- the Casio VX-4 manual lists all the supported models: The FX-850P, FX-870P, FX-880P, FX-890P, VX-1 to 4, Z-1 and PB-1000 Series

The manual should cover all Casio JIS Basic functionality, highlighting where the functionality is specific to a particular model.

It should contain the following sections:

- Introduction to Casio JIS Basic
- Casio Computers models that run CASIO JIS Basic
- How to Enter BASIC mode (from Rost manual)
- Grammar Overview (from Rost manual)
- Basic Programming Users Guide (from Part 6 of the Wickens manual)
- Basic Reserved Word/Command Function table (merged from both manuals highlighting differences)
- Hyperlinked individual command description (merged from both manuals, see reference/Casio-FX850P-Owners-Manual/commands directory from the Wickens manual to see how to implement this)
- Character code table (see reference/Casio-FX850P-Owners-Manual/part-12-1-character-code-table.md)

We are going to integrate the manual into this emulator, but I also want to make it available as a standalone Markdown documentation set.

## General Requirements

Use the format of the **Wickens** manual as a guideline on how 
to split up the manual

Write the new manual to public/docs/casio-jis-basic

Use a flag to indicate the model specific parts, for example 
where BASIC commands are only available for the VX-4 or FX-850P

Incorporate the undocumented commands
