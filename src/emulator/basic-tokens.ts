// src/emulator/basic-tokens.ts
//
// BASIC keyword token tables for the FX-870P / VX-4.
// Shared between the detokenizer and tokenizer.
// This module has NO emulator dependencies and can be imported in tests.
//
// Extracted from ROM1 dispatch tables at 0x0FA9, 0x10AB, 0x11AD, 0x12AF.
// Source: reference/ROM Disassembly/fx870_r1/rom1c.src lines 371–509.

// Indexed by (code - 0x47). Empty string = unmapped token → rendered as "???".

export const CODE_BASE = 0x47;

export const PREFIX4: string[] = [ // codes 0x47–0xC7
  '','','GOTO','GOSUB',                          // 47-4A
  'RETURN','RESUME','RESTORE','WRITE#',          // 4B-4E
  '','CONT','','SYSTEM',                         // 4F-52
  'PASS','','DELETE','',                          // 53-56
  'LIST','LLIST','LOAD','MERGE',                 // 57-5A
  '','RENUM','TRON','',                          // 5B-5E
  'TROFF','VERIFY','','',                        // 5F-62
  'POKE','','','',                               // 63-66
  '','','CHAIN','CLEAR',                         // 67-6A
  'NEW','SAVE','RUN','ANGLE',                    // 6B-6E
  'EDIT','BEEP','CLS','CLOSE',                   // 6F-72
  '','','','DEF',                                // 73-76
  '','DEFSEG','','',                             // 77-7A
  '','DIM','','',                                // 7B-7E
  '','DATA','FOR','NEXT',                        // 7F-82
  '','','ERASE','ERROR',                         // 83-86
  'END','','','',                                // 87-8A
  'FORMAT','','IF','KILL',                       // 8B-8E
  'LET','LINE','LOCATE','',                      // 8F-92
  '','','','NAME',                               // 93-96
  'OPEN','','OUT','ON',                          // 97-9A
  '','','','',                                   // 9B-9E
  'CALCJMP','','','',                            // 9F-A2
  'PRINT','LPRINT','PUT','',                     // A3-A6
  '','READ','REM','',                            // A7-AA
  '','SET','STAT','STOP',                        // AB-AE
  '','MODE','','VAR',                            // AF-B2
  '','','FILES','',                              // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

export const PREFIX5: string[] = [
  '','','','',                                   // 47-4A
  '','','','',                                   // 4B-4E
  'ERL','ERR','CNT','SUMX',                      // 4F-52
  'SUMY','SUMX2','SUMY2','SUMXY',                // 53-56
  'MEANX','MEANY','SDX','SDY',                   // 57-5A
  'SDXN','SDYN','LRA','LRB',                     // 5B-5E
  'COR','PI','DSKF','',                          // 5F-62
  'CUR','','','',                                // 63-66
  'FACT','','EOX','EOY',                         // 67-6A
  'SIN','COS','TAN','ASN',                       // 6B-6E
  'ACS','ATN','','',                             // 6F-72
  '','','','',                                   // 73-76
  'LN','LOG','EXP','SQR',                        // 77-7A
  'ABS','SGN','INT','FIX',                       // 7B-7E
  'FRAC','','DEGR','DMS',                        // 7F-82
  '','','','PEEK',                               // 83-86
  '','','','EOF',                                // 87-8A
  '','','FRE','',                                // 8B-8E
  '','ROUND','','VALF',                          // 8F-92
  'RAN#','ASC','LEN','VAL',                      // 93-96
  '','','','',                                   // 97-9A
  'HYP','DEG','','',                             // 9B-9E
  '','','','',                                   // 9F-A2
  '','','','',                                   // A3-A6
  'REC','POL','','NPR',                          // A7-AA
  'NCR','HYP','','',                             // AB-AE
  '','','','',                                   // AF-B2
  '','','','',                                   // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

export const PREFIX6: string[] = [
  '','','','',                                   // 47-4A
  '','','','',                                   // 4B-4E
  '','','','',                                   // 4F-52
  '','','','',                                   // 53-56
  '','','','',                                   // 57-5A
  '','','','',                                   // 5B-5E
  '','','','',                                   // 5F-62
  '','','','',                                   // 63-66
  '','','','',                                   // 67-6A
  '','','','',                                   // 6B-6E
  '','','','',                                   // 6F-72
  '','','','',                                   // 73-76
  '','','','',                                   // 77-7A
  '','','','',                                   // 7B-7E
  '','','','',                                   // 7F-82
  '','','','',                                   // 83-86
  '','','','',                                   // 87-8A
  '','','','',                                   // 8B-8E
  '','','','',                                   // 8F-92
  '','','','',                                   // 93-96
  'DMS$','','','',                               // 97-9A
  'INPUT','MID$','RIGHT$','LEFT$',               // 9B-9E
  '','CHR$','STR$','',                           // 9F-A2
  'HEX$','','','',                               // A3-A6
  '','INKEY$','','',                             // A7-AA
  '','','CALC$','',                              // AB-AE
  '','','','',                                   // AF-B2
  '','','','',                                   // B3-B6
  '','','','',                                   // B7-BA
  '','','','',                                   // BB-BE
  '','','','',                                   // BF-C2
  '','','','',                                   // C3-C6
  '',                                            // C7
];

export const PREFIX7: string[] = [
  'THEN','ELSE','','',                           // 47-4A
  '','','','',                                   // 4B-4E
  '','','','',                                   // 4F-52
  '','','','',                                   // 53-56
  '','','','',                                   // 57-5A
  '','','','',                                   // 5B-5E
  '','','','',                                   // 5F-62
  '','','','',                                   // 63-66
  '','','','',                                   // 67-6A
  '','','','',                                   // 6B-6E
  '','','','',                                   // 6F-72
  '','','','',                                   // 73-76
  '','','','',                                   // 77-7A
  '','','','',                                   // 7B-7E
  '','','','',                                   // 7F-82
  '','','','',                                   // 83-86
  '','','','',                                   // 87-8A
  '','','','',                                   // 8B-8E
  '','','','',                                   // 8F-92
  '','','','',                                   // 93-96
  '','','','',                                   // 97-9A
  '','','','',                                   // 9B-9E
  '','','','',                                   // 9F-A2
  '','','','',                                   // A3-A6
  '','','','',                                   // A7-AA
  '','','','',                                   // AB-AE
  '','','','',                                   // AF-B2
  '','','','TAB',                                // B3-B6
  '','','','',                                   // B7-BA
  'ALL','AS','APPEND','',                        // BB-BE
  '','STEP','TO','USING',                        // BF-C2
  'NOT','AND','OR','XOR',                        // C3-C6
  'MOD',                                         // C7
];

export const PREFIXES: string[][] = [PREFIX4, PREFIX5, PREFIX6, PREFIX7];

// Hyperbolic function codes (prefix 5, codes 0x71-0x76) map to trig keywords
export const HYPER_MAP: Record<number, string> = {
  0x71: 'SIN', 0x72: 'COS', 0x73: 'TAN',
  0x74: 'ASN', 0x75: 'ACS', 0x76: 'ATN',
};

// ── Memory layout constants ──────────────────────────────────────────────────

export const RAM_BASE = 0x10000;   // physical address offset for RAM0
export const FILE_TABLE = 0x118A7; // physical address of file pointer table (P0STT)
export const NUM_SLOTS = 10;       // P0–P9
