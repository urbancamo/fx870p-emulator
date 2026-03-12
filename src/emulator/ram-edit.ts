// src/emulator/ram-edit.ts
//
// RAM editing helpers for the FX-870P BASIC editor.
// Writes tokenized BASIC programs directly into emulator RAM
// and manages the file address table pointers.

import { readRamByte, writeRamByte } from './emulator.js';
import { RAM_BASE, FILE_TABLE } from './basic-tokens.js';
import { readWord } from './detokenize.js';
import { setCpuStop } from './def.js';
import { tokenizeLine } from './tokenize.js';

// ── System pointer addresses (physical) ──────────────────────────────────────

// Full pointer table: P0STT..P9STT + F0STT..F9STT + MEMEN
// That's 21 consecutive 16-bit LE pointers starting at 0x118A7
const P0STT = FILE_TABLE;        // 0x118A7
const NUM_PROGRAM_SLOTS = 10;    // P0-P9
const NUM_FILE_SLOTS = 10;       // F0-F9
const TOTAL_POINTERS = NUM_PROGRAM_SLOTS + NUM_FILE_SLOTS + 1; // +1 for MEMEN sentinel
const MEMEN_ADDR = P0STT + TOTAL_POINTERS * 2 - 2; // 0x118CF
const RAMTOP_ADDR = MEMEN_ADDR + 2; // 0x118D1 — top of data RAM (right after MEMEN)
const MODE3_ADDR = 0x116C6;      // BASIC run state

// ── Helpers ──────────────────────────────────────────────────────────────────

function writeWord(physAddr: number, value: number): void {
  writeRamByte(physAddr, value & 0xFF);
  writeRamByte(physAddr + 1, (value >> 8) & 0xFF);
}

/** Read all pointer table entries (logical RAM addresses). */
function readPointerTable(): number[] {
  const ptrs: number[] = [];
  for (let i = 0; i < TOTAL_POINTERS; i++) {
    ptrs.push(readWord(P0STT + i * 2));
  }
  return ptrs;
}

/** Write all pointer table entries back. */
function writePointerTable(ptrs: number[]): void {
  for (let i = 0; i < ptrs.length; i++) {
    writeWord(P0STT + i * 2, ptrs[i]);
  }
}

/** Check if BASIC is currently running. */
export function isBasicRunning(): boolean {
  return readRamByte(MODE3_ADDR) === 0x01;
}

/** Get available free RAM bytes. */
export function getFreeRam(): number {
  const memen = readWord(MEMEN_ADDR);
  const ramtop = readWord(RAMTOP_ADDR);
  return ramtop - memen;
}

// ── Core operations ──────────────────────────────────────────────────────────

/**
 * Write a complete program to a slot, shifting other slots as needed.
 * programBytes should be the output of tokenizeProgram() (includes end marker).
 */
export function writeProgram(slot: number, programBytes: Uint8Array): void {
  if (slot < 0 || slot >= NUM_PROGRAM_SLOTS) {
    throw new Error(`Invalid slot ${slot} (must be 0-9)`);
  }

  withCpuPaused(() => {
    const ptrs = readPointerTable();
    const oldStart = ptrs[slot];
    const oldEnd = ptrs[slot + 1];
    const oldSize = oldEnd - oldStart;
    const newSize = programBytes.length;
    const delta = newSize - oldSize;

    // Bounds check
    const memen = ptrs[TOTAL_POINTERS - 1]; // MEMEN is last pointer
    const ramtop = readWord(RAMTOP_ADDR);
    if (memen + delta > ramtop) {
      throw new Error(`Not enough RAM: need ${delta} more bytes, only ${ramtop - memen} free`);
    }

    // Shift everything after this slot
    if (delta !== 0) {
      shiftRam(RAM_BASE + oldEnd, RAM_BASE + memen, delta);
      // Update all pointers after this slot
      for (let i = slot + 1; i < TOTAL_POINTERS; i++) {
        ptrs[i] += delta;
      }
    }

    // Write new program bytes
    const physStart = RAM_BASE + ptrs[slot];
    for (let i = 0; i < programBytes.length; i++) {
      writeRamByte(physStart + i, programBytes[i]);
    }

    // Write updated pointer table
    writePointerTable(ptrs);
  });
}

/**
 * Insert or replace a single line in a program slot (by line number).
 * If a line with the same number exists, it's replaced; otherwise inserted.
 */
export function upsertLine(slot: number, lineNum: number, text: string): void {
  if (slot < 0 || slot >= NUM_PROGRAM_SLOTS) {
    throw new Error(`Invalid slot ${slot} (must be 0-9)`);
  }

  const newLine = tokenizeLine(lineNum, text);

  withCpuPaused(() => {
    const ptrs = readPointerTable();
    const progStart = RAM_BASE + ptrs[slot];
    const progEnd = RAM_BASE + ptrs[slot + 1];

    // Find the existing line (if any) and insertion point
    let addr = progStart;
    let insertAddr = -1;
    let existingStart = -1;
    let existingLen = 0;

    while (addr < progEnd) {
      const recLen = readRamByte(addr);
      if (recLen === 0x00 || recLen === 0xFF) break;
      if (recLen < 3) break;

      const ln = readRamByte(addr + 1) | (readRamByte(addr + 2) << 8);

      if (ln === lineNum) {
        existingStart = addr;
        existingLen = 1 + recLen;
      } else if (ln > lineNum && insertAddr < 0) {
        insertAddr = addr;
      }

      addr += 1 + recLen;
    }

    // If no insertion point found, insert before end marker
    if (insertAddr < 0 && existingStart < 0) {
      insertAddr = addr; // at end-of-program marker
    }

    if (existingStart >= 0) {
      // Replace existing line
      const oldLen = existingLen;
      const newLen = newLine.bytes.length;
      const delta = newLen - oldLen;
      const memen = ptrs[TOTAL_POINTERS - 1];
      const ramtop = readWord(RAMTOP_ADDR);

      if (delta > 0 && memen + delta > ramtop) {
        throw new Error(`Not enough RAM: need ${delta} more bytes, only ${ramtop - memen} free`);
      }

      // Shift bytes after the old line
      if (delta !== 0) {
        shiftRam(existingStart + oldLen, RAM_BASE + memen, delta);
        for (let i = slot + 1; i < TOTAL_POINTERS; i++) {
          ptrs[i] += delta;
        }
      }

      // Write new line bytes
      for (let i = 0; i < newLine.bytes.length; i++) {
        writeRamByte(existingStart + i, newLine.bytes[i]);
      }

      writePointerTable(ptrs);
    } else {
      // Insert new line
      const newLen = newLine.bytes.length;
      const memen = ptrs[TOTAL_POINTERS - 1];
      const ramtop = readWord(RAMTOP_ADDR);

      if (memen + newLen > ramtop) {
        throw new Error(`Not enough RAM: need ${newLen} bytes, only ${ramtop - memen} free`);
      }

      // Shift everything from insertion point onward
      shiftRam(insertAddr, RAM_BASE + memen, newLen);
      for (let i = slot + 1; i < TOTAL_POINTERS; i++) {
        ptrs[i] += newLen;
      }

      // Write new line bytes at insertion point
      for (let i = 0; i < newLine.bytes.length; i++) {
        writeRamByte(insertAddr + i, newLine.bytes[i]);
      }

      writePointerTable(ptrs);
    }
  });
}

/**
 * Delete a single line from a program slot.
 */
export function deleteLine(slot: number, lineNum: number): void {
  if (slot < 0 || slot >= NUM_PROGRAM_SLOTS) {
    throw new Error(`Invalid slot ${slot} (must be 0-9)`);
  }

  withCpuPaused(() => {
    const ptrs = readPointerTable();
    const progStart = RAM_BASE + ptrs[slot];
    const progEnd = RAM_BASE + ptrs[slot + 1];

    // Find the line
    let addr = progStart;
    while (addr < progEnd) {
      const recLen = readRamByte(addr);
      if (recLen === 0x00 || recLen === 0xFF) break;
      if (recLen < 3) break;

      const ln = readRamByte(addr + 1) | (readRamByte(addr + 2) << 8);

      if (ln === lineNum) {
        const lineSize = 1 + recLen;
        const memen = ptrs[TOTAL_POINTERS - 1];

        // Shift everything after this line backward
        shiftRam(addr + lineSize, RAM_BASE + memen, -lineSize);
        for (let i = slot + 1; i < TOTAL_POINTERS; i++) {
          ptrs[i] -= lineSize;
        }

        writePointerTable(ptrs);
        return;
      }

      addr += 1 + recLen;
    }

    // Line not found — no-op
  });
}

/**
 * Clear a program slot entirely.
 */
export function clearSlot(slot: number): void {
  writeProgram(slot, new Uint8Array([0x00])); // just the end marker
}

// ── RAM shift helper ─────────────────────────────────────────────────────────

/**
 * Shift a block of RAM by `delta` bytes.
 * Moves bytes from [srcStart, srcEnd) to [srcStart+delta, srcEnd+delta).
 */
function shiftRam(srcStart: number, srcEnd: number, delta: number): void {
  const len = srcEnd - srcStart;
  if (len <= 0 || delta === 0) return;

  if (delta > 0) {
    // Growing: copy from end backward to avoid overwriting
    for (let i = len - 1; i >= 0; i--) {
      writeRamByte(srcStart + delta + i, readRamByte(srcStart + i));
    }
  } else {
    // Shrinking: copy from start forward
    for (let i = 0; i < len; i++) {
      writeRamByte(srcStart + delta + i, readRamByte(srcStart + i));
    }
  }
}

// ── CPU synchronization ──────────────────────────────────────────────────────

function withCpuPaused(fn: () => void): void {
  setCpuStop(true);
  try {
    fn();
  } finally {
    setCpuStop(false);
  }
}
