// tools/emu-debugger/harness-core.ts
// Re-exports from emu-harness plus direct memory helpers.

export { boot, stepOnce, runCycles, loadRomsFromDisk } from '../../tests/emu-harness.js';

import { memdef } from '../../src/emulator/def.js';

/** Write bytes into RAM at the given bank1 address (0x10000 physical). */
export function writeBinaryToRam(loadAddr: number, bytes: Uint8Array): void {
  const ramRegion = memdef.find(m => m.writable && m.first === 0x10000);
  if (!ramRegion || !ramRegion.data) {
    throw new Error('Bank1 RAM region not found in memdef');
  }
  const offset = loadAddr & 0xFFFF;
  for (let i = 0; i < bytes.length; i++) {
    ramRegion.data[offset + i] = bytes[i]!;
  }
}

/** Read bytes from RAM at the given bank1 address. */
export function readFromRam(address: number, length: number): Uint8Array {
  const ramRegion = memdef.find(m => m.writable && m.first === 0x10000);
  if (!ramRegion || !ramRegion.data) {
    throw new Error('Bank1 RAM region not found in memdef');
  }
  const offset = address & 0xFFFF;
  return new Uint8Array(ramRegion.data.slice(offset, offset + length));
}
