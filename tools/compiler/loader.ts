// tools/compiler/loader.ts
// Generates a Casio FX-870P BASIC loader program that POKEs compiled ML binary
// into memory via DATA statements and then executes it with MODE110.

export interface LoaderInput {
  binary: Uint8Array;
  entryPoint: number;
  sourceFile: string;
  totalSize: number;
}

const BYTES_PER_DATA_LINE = 24;

// Encode a chunk of bytes as an uppercase hex string
function toHexString(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) {
    s += b.toString(16).toUpperCase().padStart(2, '0');
  }
  return s;
}

export function generateLoader(input: LoaderInput): string {
  const { binary, entryPoint, sourceFile, totalSize } = input;

  // Hex chunks (legacy path — still used downstream) and decimal numeric DATA
  // (primary path — avoids VAL("&H...") which is unreliable on some models)
  const hexChunks: string[] = [];
  for (let offset = 0; offset < binary.length; offset += BYTES_PER_DATA_LINE) {
    hexChunks.push(toHexString(binary.slice(offset, offset + BYTES_PER_DATA_LINE)));
  }
  void hexChunks;

  // 12 decimal bytes per DATA line (keeps lines under 70 chars)
  const BYTES_PER_DEC_LINE = 12;
  const decLines: string[] = [];
  for (let offset = 0; offset < binary.length; offset += BYTES_PER_DEC_LINE) {
    const slice = Array.from(binary.slice(offset, offset + BYTES_PER_DEC_LINE));
    decLines.push(slice.join(','));
  }

  const lines: string[] = [];
  const entryHex = '&H' + entryPoint.toString(16).toUpperCase().padStart(4, '0');
  // DEFSEG * 16 = effective PEEK/POKE base address.
  const segment = Math.floor(entryPoint / 16);
  const segHex = '&H' + segment.toString(16).toUpperCase().padStart(4, '0');

  lines.push(`10 ' Compiled: ${sourceFile}`);
  lines.push(`15 ' Size: ${totalSize} bytes`);
  lines.push(`30 DEFSEG=${segHex}`);
  lines.push(`40 FOR I=0 TO ${totalSize - 1}`);
  lines.push('50 READ B');
  lines.push('60 POKE I,B');
  lines.push('70 NEXT I');
  lines.push(`80 MODE110(${entryHex})`);
  lines.push('90 END');

  // DATA statements of decimal bytes (avoid VAL/&H)
  decLines.forEach((csv, idx) => {
    lines.push(`${1000 + idx * 10} DATA ${csv}`);
  });

  return lines.join('\n') + '\n';
}
