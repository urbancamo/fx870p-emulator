// tools/compiler/loader.ts
// Generates a GENERIC Casio FX-870P BASIC loader program (loader.bas) that
// streams any compiled ML binary over COM0 serial as ASCII hex, decodes it,
// and executes via MODE110.
//
// Protocol: the .hex payload has three parts, all uppercase ASCII hex:
//   1. 4 chars: 16-bit size (big-endian) — number of binary bytes to follow
//   2. size × 2 chars: the binary payload, 2 hex chars per byte
//   3. 2 chars: 8-bit additive checksum over the payload bytes
//
// The loader knows nothing program-specific: size comes from the payload,
// entry point is hardcoded to &H1CD0 (standard FX-870P/VX-4 ML area).
//
// Why hex encoding (not raw binary):
//   RS-232 serial has byte-interpretation hazards (XON=0x11, XOFF=0x13,
//   Ctrl-Z=0x1A EOF, CR/LF translation). ASCII hex (0-9, A-F) is
//   passthrough-safe for any serial link. 2× size overhead is acceptable.

const ENTRY_ADDR = 0x1CD0;

/**
 * Generate the GENERIC loader.bas — works for any compiled program because
 * size comes from the .hex payload itself. User loads this once and then
 * sends different .hex files to run different programs.
 */
export function generateLoader(): string {
  const entryHex = '&H' + ENTRY_ADDR.toString(16).toUpperCase().padStart(4, '0');
  const segment = Math.floor(ENTRY_ADDR / 16);
  const segHex = '&H' + segment.toString(16).toUpperCase().padStart(4, '0');

  const lines: string[] = [];
  lines.push("10 ' Generic ML loader - send any compiled .hex via COM0");
  lines.push("15 ' Protocol: 4-char size hex, payload, 2-char checksum");
  lines.push(`20 DEFSEG=${segHex}`);
  lines.push('25 S=0');
  lines.push('30 OPEN "COM0:6,N,8,1,N,N,N,N,N" FOR INPUT AS #1');
  lines.push('35 GOSUB 200:N=P*256:GOSUB 200:N=N+P');
  lines.push('40 FOR I=0 TO N-1');
  lines.push('50 GOSUB 200:POKE I,P:S=(S+P) MOD 256');
  lines.push('90 NEXT I');
  lines.push('95 GOSUB 200:C=P');
  lines.push('107 CLOSE');
  lines.push('110 IF C<>S THEN PRINT "CHECKSUM ERROR":END');
  lines.push(`120 MODE110(${entryHex})`);
  lines.push('130 END');
  lines.push("199 ' --- read one byte (2 hex chars) into P ---");
  lines.push('200 A=ASC(INPUT$(1,#1)):B=ASC(INPUT$(1,#1))');
  lines.push('210 IF A>=65 THEN A=A-55 ELSE A=A-48');
  lines.push('220 IF B>=65 THEN B=B-55 ELSE B=B-48');
  lines.push('230 P=A*16+B:RETURN');

  return lines.join('\n') + '\n';
}

/**
 * Generate the hex-encoded payload text file. Format:
 *   [4 hex chars: 16-bit size big-endian]
 *   [size × 2 hex chars: binary payload]
 *   [2 hex chars: 8-bit additive checksum over payload]
 *
 * All uppercase ASCII hex, no separators. Consumed by the generic
 * loader.bas's streaming decoder.
 */
export function generateHexPayload(binary: Uint8Array): string {
  const size = binary.length;
  if (size > 0xFFFF) {
    throw new Error(`Binary too large (${size} bytes, max 65535)`);
  }
  let out = '';
  // Size prefix: 16-bit big-endian = high byte, low byte
  out += ((size >> 8) & 0xFF).toString(16).toUpperCase().padStart(2, '0');
  out += (size & 0xFF).toString(16).toUpperCase().padStart(2, '0');
  // Payload bytes + checksum
  let checksum = 0;
  for (let i = 0; i < size; i++) {
    out += binary[i]!.toString(16).toUpperCase().padStart(2, '0');
    checksum = (checksum + binary[i]!) & 0xFF;
  }
  out += checksum.toString(16).toUpperCase().padStart(2, '0');
  return out;
}
