// tools/compiler/loader.ts
// Generates a Casio FX-870P BASIC loader program that streams the compiled
// ML binary over COM0 serial and then executes it with MODE110.
//
// The streaming loader is size-independent: the loader program is ~10 lines
// regardless of binary size, and the binary doesn't have to coexist in memory
// with its own DATA-statement copy.

export interface LoaderInput {
  binary: Uint8Array;  // only used for totalSize; binary is sent over serial
  entryPoint: number;
  sourceFile: string;
  totalSize: number;
}

export function generateLoader(input: LoaderInput): string {
  const { entryPoint, sourceFile, totalSize } = input;

  const entryHex = '&H' + entryPoint.toString(16).toUpperCase().padStart(4, '0');
  // DEFSEG * 16 = effective PEEK/POKE base address.
  const segment = Math.floor(entryPoint / 16);
  const segHex = '&H' + segment.toString(16).toUpperCase().padStart(4, '0');

  const lines: string[] = [];
  lines.push(`10 ' Streaming loader for: ${sourceFile}`);
  lines.push(`15 ' Size: ${totalSize} bytes — send binary via COM0 after RUN`);
  lines.push(`20 DEFSEG=${segHex}`);
  lines.push('30 OPEN "COM0:6,N,8,1,N,N,N,N,N" FOR INPUT AS #1');
  lines.push(`40 FOR I=0 TO ${totalSize - 1}`);
  lines.push('50 A$=INPUT$(1,#1)');
  lines.push('60 POKE I,ASC(A$)');
  lines.push('70 NEXT I');
  lines.push('80 CLOSE');
  lines.push(`90 MODE110(${entryHex})`);
  lines.push('100 END');

  return lines.join('\n') + '\n';
}
