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

  // Split binary into 24-byte chunks for DATA statements
  const chunks: string[] = [];
  for (let offset = 0; offset < binary.length; offset += BYTES_PER_DATA_LINE) {
    chunks.push(toHexString(binary.slice(offset, offset + BYTES_PER_DATA_LINE)));
  }

  const chunkCount = chunks.length;

  // Line number counter — preamble uses lines 10–110, DATA starts at 1000
  const lines: string[] = [];

  lines.push(`10 ' Compiled: ${sourceFile}`);
  lines.push(`20 ' Size: ${totalSize} bytes`);
  lines.push('30 CLEAR');
  lines.push(`40 MODE110(&H18F5),${totalSize}`);
  lines.push(`50 FOR I=0 TO ${chunkCount - 1}`);
  lines.push('60 READ A$');
  lines.push('70 FOR J=1 TO LEN(A$) STEP 2');
  lines.push('80 POKE I*24+(J-1)/2,VAL("&H"+MID$(A$,J,2))');
  lines.push('90 NEXT J');
  lines.push('100 NEXT I');
  lines.push(`110 MODE110(${entryPoint})`);
  lines.push('120 END');

  // DATA statements starting at line 1000, incrementing by 10
  chunks.forEach((hex, idx) => {
    lines.push(`${1000 + idx * 10} DATA "${hex}"`);
  });

  return lines.join('\n') + '\n';
}
