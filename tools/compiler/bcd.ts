// tools/compiler/bcd.ts
// Encodes a JS number into the FX-870P/VX-4 ROM's 9-byte BCD floating-point
// format — the layout the FP accumulator registers $10-$18 hold (and $0-$8 for
// the second operand of a binary operation).
//
// The layout below was confirmed empirically: the headless emulator ran known
// expressions through the real BASIC interpreter and the registers were dumped
// at the entry to FP_ADD (&H05DA). It matches the ROM disassembly at
// reference/ROM Disassembly/fx870_r0/rom0.src (&H061D normalisation, &H0669
// "$0-$8 <- floating point constant 1", &H060E "subtract the exponent bias").
//
//   bytes[0..6]  mantissa, LITTLE-endian by byte: bytes[6] is the most
//                significant. Read as a 14-nibble field starting at the high
//                nibble of bytes[6], a normalised number always has that first
//                nibble zero (the normaliser's guard digit), so the 13
//                significant digits are:
//                  d1  = bytes[6] low nibble
//                  d2  = bytes[5] high nibble,  d3  = bytes[5] low nibble
//                  ...
//                  d12 = bytes[0] high nibble,  d13 = bytes[0] low nibble
//   bytes[7]     low two digits of the biased exponent, packed BCD
//   bytes[8]     hundreds digit of the biased exponent, plus 5 when the
//                value is negative (the ROM flips the sign with
//                `adb $18,&H05` / `an $18,&H0F` at &H05CE)
//
//   value = d1.d2d3...d13 x 10^(biasedExponent - 100)
//
// Zero is the all-zero encoding (the ROM's own "floating point 0" at &H0636
// clears the mantissa and the exponent/sign word).
//
// Worked example — 541 is 5.41 x 10^2, so the biased exponent is 102:
//   00 00 00 00 00 41 05 02 01

/** Number of bytes in one BCD floating-point value. */
export const BCD9_LENGTH = 9;

/** Significant decimal digits the mantissa holds. */
export const BCD9_DIGITS = 13;

/** Added to the decimal exponent before it is stored. */
const EXPONENT_BIAS = 100;

/** Added to the exponent-high byte to mark a negative value. */
const SIGN_OFFSET = 5;

/** Largest/smallest decimal exponent the biased 3-digit field can hold. */
const MAX_EXPONENT = 99;
const MIN_EXPONENT = -99;

/**
 * Convert a number to its 9-byte BCD floating-point representation.
 *
 * Literals with more than 13 significant digits are truncated, not rounded —
 * that is what the calculator's own ASCII-to-float conversion does (entering
 * 12345678901234 yields 1.234567890123E+13).
 *
 * @throws RangeError if the value is not finite or its magnitude falls outside
 *         the calculator's 1E-99 .. 9.999999999999E+99 range.
 */
export function numberToBcd9(value: number): Uint8Array {
  const bytes = new Uint8Array(BCD9_LENGTH);

  if (!Number.isFinite(value)) {
    throw new RangeError(`Cannot encode non-finite number as BCD: ${value}`);
  }
  if (value === 0) return bytes; // also covers -0: the format has no signed zero

  const { digits, exponent } = decompose(Math.abs(value));
  if (exponent > MAX_EXPONENT || exponent < MIN_EXPONENT) {
    throw new RangeError(
      `Number ${value} is outside the FX-870P range (1E-99 to 9.999999999999E+99)`,
    );
  }

  // Nibble n of the mantissa field (n = 0 is the high nibble of bytes[6], the
  // guard digit) lives in bytes[6 - (n >> 1)], high nibble when n is even.
  for (let i = 0; i < BCD9_DIGITS; i++) {
    const nibble = i + 1;
    const digit = digits.charCodeAt(i) - 0x30;
    const index = 6 - (nibble >> 1);
    bytes[index] |= (nibble & 1) === 0 ? digit << 4 : digit;
  }

  const biased = exponent + EXPONENT_BIAS;
  bytes[7] = (Math.floor((biased % 100) / 10) << 4) | (biased % 10);
  bytes[8] = Math.floor(biased / 100) + (value < 0 ? SIGN_OFFSET : 0);

  return bytes;
}

/**
 * Split a positive number into exactly 13 mantissa digits (truncated, padded
 * with trailing zeros) and the decimal exponent of its leading digit.
 *
 * `toExponential()` with no argument gives the shortest digit string that
 * round-trips, which recovers the decimal literal the programmer wrote rather
 * than the binary double's full expansion — so 0.7 truncates to 7000000000000
 * rather than 6999999999999.
 */
function decompose(abs: number): { digits: string; exponent: number } {
  const [mantissa, exp] = abs.toExponential().split('e');
  const digits = mantissa.replace('.', '');
  return {
    digits: digits.length > BCD9_DIGITS
      ? digits.slice(0, BCD9_DIGITS)
      : digits.padEnd(BCD9_DIGITS, '0'),
    exponent: parseInt(exp, 10),
  };
}
