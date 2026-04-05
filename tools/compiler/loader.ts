// tools/compiler/loader.ts
// Generates a Casio FX-870P BASIC loader program that streams the compiled
// ML binary over COM0 serial as ASCII hex, decodes it, and executes via
// MODE110.
//
// Why hex encoding (not raw binary):
//   RS-232 serial has byte-interpretation hazards (XON=0x11, XOFF=0x13,
//   Ctrl-Z=0x1A EOF, CR/LF translation). Sending raw binary works on this
//   emulator with its binary-mode flag, but not reliably on real hardware
//   or other serial infrastructure. ASCII hex (0-9, A-F) is passthrough-safe
//   for any serial link. 2× size overhead is acceptable for ML payloads.
//
// Streaming loader pattern:
//   For each byte: read 2 hex chars, convert each (0-9 → 0-9, A-F → 10-15),
//   combine (hi*16 + lo), POKE to the target address. Accumulate an 8-bit
//   additive checksum. After the payload, read 2 more hex chars for the
//   expected checksum and verify — aborts with CHECKSUM ERROR on mismatch.

export interface LoaderInput {
  binary: Uint8Array;
  entryPoint: number;
  sourceFile: string;
  totalSize: number;
}

export function generateLoader(input: LoaderInput): string {
  const { entryPoint, sourceFile, totalSize } = input;

  const entryHex = '&H' + entryPoint.toString(16).toUpperCase().padStart(4, '0');
  const segment = Math.floor(entryPoint / 16);
  const segHex = '&H' + segment.toString(16).toUpperCase().padStart(4, '0');

  const lines: string[] = [];
  lines.push(`10 ' Streaming loader for: ${sourceFile}`);
  lines.push(`15 ' Size: ${totalSize} bytes — send .hex via COM0 after RUN`);
  lines.push(`20 DEFSEG=${segHex}`);
  lines.push('25 S=0');
  lines.push('30 OPEN "COM0:6,N,8,1,N,N,N,N,N" FOR INPUT AS #1');
  lines.push(`40 FOR I=0 TO ${totalSize - 1}`);
  lines.push('50 A=ASC(INPUT$(1,#1)):B=ASC(INPUT$(1,#1))');
  lines.push('60 IF A>=65 THEN A=A-55 ELSE A=A-48');
  lines.push('70 IF B>=65 THEN B=B-55 ELSE B=B-48');
  lines.push('80 P=A*16+B:POKE I,P:S=(S+P) MOD 256');
  lines.push('90 NEXT I');
  lines.push('95 A=ASC(INPUT$(1,#1)):B=ASC(INPUT$(1,#1))');
  lines.push('100 IF A>=65 THEN A=A-55 ELSE A=A-48');
  lines.push('105 IF B>=65 THEN B=B-55 ELSE B=B-48');
  lines.push('107 CLOSE');
  lines.push('110 IF A*16+B<>S THEN PRINT "CHECKSUM ERROR":END');
  lines.push(`120 MODE110(${entryHex})`);
  lines.push('130 END');

  return lines.join('\n') + '\n';
}

/**
 * Generate the hex-encoded payload text file. Each binary byte becomes
 * two uppercase hex characters with no separators, followed by an 8-bit
 * additive checksum as 2 hex chars. Consumed by the BASIC loader's
 * streaming decoder.
 */
export function generateHexPayload(binary: Uint8Array): string {
  let out = '';
  let checksum = 0;
  for (let i = 0; i < binary.length; i++) {
    out += binary[i]!.toString(16).toUpperCase().padStart(2, '0');
    checksum = (checksum + binary[i]!) & 0xFF;
  }
  out += checksum.toString(16).toUpperCase().padStart(2, '0');
  return out;
}
