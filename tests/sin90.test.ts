import { describe, it, expect } from 'vitest';
import {
  boot, typeString, pressExe, runCycles,
  readLcdLine, installPcTracker, getTopPCs, pressKey,
} from './emu-harness.js';

describe('FX-870P BASIC', () => {
  it('SIN(90) should return 1', () => {
    boot();

    // Type SIN(90) and press EXE
    typeString('SIN(90)');
    pressExe();

    // Install PC tracker for hang diagnosis before the big run
    installPcTracker();

    // Generous budget: 50M cycles (~54 seconds at 921 kHz).
    // SIN should complete in well under 5M cycles.
    runCycles(50_000_000);

    const line0 = readLcdLine(0);
    const line1 = readLcdLine(1);

    console.log('LCD line 0:', JSON.stringify(line0));
    console.log('LCD line 1:', JSON.stringify(line1));

    // The result should be on one of the lines
    const combined = line0 + line1;

    if (!combined.includes('1')) {
      const topPCs = getTopPCs(15);
      console.log('Top PCs (possible hang loop):');
      for (const { hex, count } of topPCs) {
        console.log(`  ${hex}: ${count} hits`);
      }
    }

    // Check that the result contains '1' (SIN(90) = 1)
    expect(combined).toContain('1');
  });

  it('123 EXE should return 123', () => {
    boot();

    typeString('123');
    pressExe();
    runCycles(2_000_000);

    const line0 = readLcdLine(0);
    const line1 = readLcdLine(1);
    console.log('123 EXE -> line 0:', JSON.stringify(line0));
    console.log('123 EXE -> line 1:', JSON.stringify(line1));

    const combined = line0 + line1;
    expect(combined).toContain('123');
  });
});
