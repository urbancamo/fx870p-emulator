unit Keyboard;

interface

type

  keyblock = record
    L: integer;		{ left }
    T: integer;		{ top }
    W: integer;		{ width of the key }
    H: integer;		{ height of the key }
    SX: integer;	{ horizontal spacing }
    SY: integer;	{ vertical spacing }
    col: integer;	{ number of columns }
    cnt: integer;	{ number of keys in a block }
    OX: integer;	{ left in the Keys.bmp or 512 if absent }
    OY: integer;	{ top in the Keys.bmp or 512 if absent }
  end;


const

  KEYPADS = 8;		{index of the last item in the 'keypad' array}
  LASTKEYCODE = 83;

  keypad: array[0..KEYPADS] of keyblock = (
{ All Reset, code: 1 }
    (	L:35;	T:219;	W:5;	H:5;	SX:40;	SY:33;	col:1;	cnt:1;	OX:512;	OY:512	),
{ OFF and CAPS, code: 2..3 }
    (	L:20;	T:145;	W:33;	H:21;	SX:40;	SY:99;	col:1;	cnt:2;	OX:76;	OY:27	),
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
    (	L:60;	T:145;	W:33;	H:21;	SX:40;	SY:66;	col:10;	cnt:20;	OX:76;	OY:27	),
{ second row of middle size keys: Q to ENG, code: 24..34 }
    (	L:31;	T:178;	W:33;	H:21;	SX:40;	SY:33;	col:11;	cnt:11;	OX:76;	OY:27	),
{ fourth row of middle size keys: Z to Space, code: 35..44 }
    (	L:71;	T:244;	W:33;	H:21;	SX:40;	SY:33;	col:10;	cnt:10;	OX:76;	OY:27	),
{ three rows of small keys, code: 45..62 }
    (	L:484;	T:17;	W:30;	H:19;	SX:36;	SY:33;	col:6;	cnt:18;	OX:142;	OY:27	),
{ four rows of large keys, code: 63..80 }
    (	L:481;	T:118;	W:38;	H:27;	SX:44;	SY:40;	col:5;	cnt:18;	OX:0;	OY:27	),
{ EXE key, code: 81 }
    (	L:613;	T:238;	W:82;	H:27;	SX:88;	SY:40;	col:1;	cnt:1;	OX:0;	OY:0	),
{ application minimize and close, codes: 82..83 }
    (	L:5;	T:5;	W:17;	H:17;	SX:18;	SY:33;	col:2;	cnt:2;	OX:164;	OY:0	)
  );


var
  KeyCode1: integer;		{ from the mouse }
  KeyCode2: integer;		{ from the keyboard }


  function ReadKy (Ko: byte) : word;


implementation

const

{ tables converting KeyCode1 and KeyCode2 to the KY state for given KO }

  KeyTab: array[0..15, 0..LASTKEYCODE] of word = (

( { KO code 0, none selected }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO1 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0080,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO2 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0080, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000, $0004,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0002, $0001, $8000, $0000, $4000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO3 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0080, $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $8000, $0000, $4000,
  $0002, $0001, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0004, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO4 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0080, $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000, $0004,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0001, $8000, $4000, $0000,
  $0002, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO5 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0080, $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $4000,
  $0000, $0002, $0001, $8000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0004, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO6 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0080,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000, $0004,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $8000, $4000,
{ four rows of large keys, code: 63..80 }
  $0000, $0002, $0001, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO7 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0080, $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $8000, $0000,
  $0000, $0002, $0001, $0000, $4000,
  $0004, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO8 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0080,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000, $0004,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $8000, $0000,
  $0000, $0002, $0001, $0000, $4000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO9 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0080, $0000, $0040, $0000, $0020, $0000, $0010, $0000, $0008, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $8000, $0000,
  $0004, $0002, $0001,
{ EXE key, code: 81 }
  $4000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO10 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO11 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO12 }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO code 13, all columns selected }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0080,
{ OFF and CAPS, code: 2..3 }
  $0080, $0080,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0080, $0040, $0040, $0020, $0020, $0010, $0010, $0008, $0008, $0004,
  $0080, $0040, $0040, $0020, $0020, $0010, $0010, $0008, $0008, $0004,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0080, $0080, $0040, $0040, $0020, $0020, $0010, $0010, $0008, $0008, $0004,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0080, $0040, $0040, $0020, $0020, $0010, $0010, $0008, $0008, $0004,
{ three rows of small keys, code: 45..62 }
  $0002, $0001, $8000, $8000, $4000, $4000,
  $0002, $0001, $0001, $8000, $4000, $4000,
  $0002, $0002, $0001, $8000, $8000, $4000,
{ four rows of large keys, code: 63..80 }
  $0004, $0002, $0001, $8000, $0080,
  $0004, $0002, $0001, $8000, $4000,
  $0004, $0002, $0001, $8000, $4000,
  $0004, $0002, $0001,
{ EXE key, code: 81 }
  $4000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO code 14, undefined }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
),

( { KO code 15, undefined }
{ no key pressed }
  $0000,
{ All Reset, code: 1 }
  $0000,
{ OFF and CAPS, code: 2..3 }
  $0000, $0000,
{ first and third row of middle size keys: MEMO to red S, A to ANS, code: 4..23 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ second row of middle size keys: Q to ENG, code: 24..34 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ fourth row of middle size keys: Z to Space, code: 35..44 }
  $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000, $0000,
{ three rows of small keys, code: 45..62 }
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000, $0000,
{ four rows of large keys, code: 63..80 }
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000, $0000, $0000,
  $0000, $0000, $0000,
{ EXE key, code: 81 }
  $0000,
{ application minimize and close, codes: 82..83 }
  $0000, $0000
)

);


function ReadKy (Ko: byte) : word;
begin
  ReadKy := KeyTab[Ko,KeyCode1] or KeyTab[Ko,KeyCode2];
end {ReadKy};


end.
