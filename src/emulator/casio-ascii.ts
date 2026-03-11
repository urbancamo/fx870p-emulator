// src/emulator/casio-ascii.ts
//
// Casio ASCII ↔ Unicode conversion for the FX-870P.
//
// The FX-870P uses a custom 8-bit character encoding that matches standard
// ASCII for most of 0x20–0x7F but diverges at a few points (e.g. 0x5C = ¥)
// and has a full upper-half (0x80–0xFF) with math symbols, Greek letters,
// half-width katakana, card suits, and CJK characters.
//
// Mapping sourced from reference/scala_converter/Converter.scala.

// Lookup table indexed by Casio byte value (0–255).
// Control characters (0x00–0x1F) that have no printable representation
// are mapped to Unicode control-picture symbols (U+2400 range).
const CASIO_TO_UNICODE: string[] = [
  // 0x00–0x0F  (control characters)
  '\u2400', '\u2401', '\u2402', '\u2403', '\u2404', '\u2405', '\u2406', '\u2407',
  '\u2408', '\t',     '\n',     '\u240B', '\u240C', '\r',     '\u240E', '\u240F',
  // 0x10–0x1F
  '\u2410', '\u2411', '\u2412', '\u2413', '\u2414', '\u2415', '\u2416', '\u2417',
  '\u2418', '\u2419', '\u241A', '\u241B', '\u21E8', '\u21E6', '\u21E7', '\u21E9',
  // 0x20–0x2F  (standard ASCII)
  ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
  // 0x30–0x3F
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
  // 0x40–0x4F
  '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  // 0x50–0x5F  (note: 0x5C = ¥, not backslash)
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\u00A5', ']', '^', '_',
  // 0x60–0x6F
  '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  // 0x70–0x7F  (note: 0x7C = ¦ broken bar, 0x7F = ␡)
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '\u00A6', '}', '~', '\u2421',
  // 0x80–0x8F  (math/science symbols, Greek letters)
  '\u00C5',   // 80 Å
  '\u222B',   // 81 ∫
  '\u221A',   // 82 √
  '\u2018',   // 83 '
  '\u2211',   // 84 ∑
  '\u03A9',   // 85 Ω
  '\u2592',   // 86 ▒
  '\u2588',   // 87 █
  '\uD835\uDEFC', // 88 𝛼
  '\uD835\uDEFD', // 89 𝛽
  '\uD835\uDEFE', // 8A 𝛾
  '\uD835\uDF00', // 8B 𝜀
  '\uD835\uDF03', // 8C 𝜃
  '\uD835\uDF07', // 8D 𝜇
  '\uD835\uDF0E', // 8E 𝜎
  '\uD835\uDF19', // 8F 𝜙
  // 0x90–0x9F  (superscript digits and operators)
  '\u2070',   // 90 ⁰
  '\u00B9',   // 91 ¹
  '\u00B2',   // 92 ²
  '\u00B3',   // 93 ³
  '\u2074',   // 94 ⁴
  '\u2075',   // 95 ⁵
  '\u2076',   // 96 ⁶
  '\u2077',   // 97 ⁷
  '\u2078',   // 98 ⁸
  '\u2079',   // 99 ⁹
  '\u207A',   // 9A ⁺
  '\u207B',   // 9B ⁻
  '\u207F',   // 9C ⁿ
  '\uFE6A',   // 9D ﹪
  '\u207B\u00B9', // 9E ⁻¹ (mathematical monospace digit one, used as inverse marker)
  '\u00F7',   // 9F ÷
  // 0xA0–0xAF  (half-width katakana punctuation and small kana)
  '\u2423',   // A0 ␣ (visible space)
  '\u3002',   // A1 。
  '\u300C',   // A2 「
  '\u300D',   // A3 」
  '\u3001',   // A4 、
  '\u30FB',   // A5 ・
  '\uFF66',   // A6 ｦ
  '\uFF67',   // A7 ｧ
  '\uFF68',   // A8 ｨ
  '\uFF69',   // A9 ｩ
  '\uFF6A',   // AA ｪ
  '\uFF6B',   // AB ｫ
  '\uFF6C',   // AC ｬ
  '\uFF6D',   // AD ｭ
  '\uFF6E',   // AE ｮ
  '\uFF6F',   // AF ｯ
  // 0xB0–0xBF  (half-width katakana)
  '\u30FC',   // B0 ー
  '\uFF71',   // B1 ｱ
  '\uFF72',   // B2 ｲ
  '\uFF73',   // B3 ｳ
  '\uFF74',   // B4 ｴ
  '\uFF75',   // B5 ｵ
  '\uFF76',   // B6 ｶ
  '\uFF77',   // B7 ｷ
  '\uFF78',   // B8 ｸ
  '\uFF79',   // B9 ｹ
  '\uFF7A',   // BA ｺ
  '\uFF7B',   // BB ｻ
  '\uFF7C',   // BC ｼ
  '\uFF7D',   // BD ｽ
  '\uFF7E',   // BE ｾ
  '\uFF7F',   // BF ｿ
  // 0xC0–0xCF  (half-width katakana continued)
  '\uFF80',   // C0 ﾀ
  '\uFF81',   // C1 ﾁ
  '\uFF82',   // C2 ﾂ
  '\uFF83',   // C3 ﾃ
  '\uFF84',   // C4 ﾄ
  '\uFF85',   // C5 ﾅ
  '\uFF86',   // C6 ﾆ
  '\uFF87',   // C7 ﾇ
  '\uFF88',   // C8 ﾈ
  '\uFF89',   // C9 ﾉ
  '\uFF8A',   // CA ﾊ
  '\uFF8B',   // CB ﾋ
  '\uFF8C',   // CC ﾌ
  '\uFF8D',   // CD ﾍ
  '\uFF8E',   // CE ﾎ
  '\uFF8F',   // CF ﾏ
  // 0xD0–0xDF  (half-width katakana continued + dakuten/handakuten)
  '\uFF90',   // D0 ﾐ
  '\uFF91',   // D1 ﾑ
  '\uFF92',   // D2 ﾒ
  '\uFF93',   // D3 ﾓ
  '\uFF94',   // D4 ﾔ
  '\uFF95',   // D5 ﾕ
  '\uFF96',   // D6 ﾖ
  '\uFF97',   // D7 ﾗ
  '\uFF98',   // D8 ﾘ
  '\uFF99',   // D9 ﾙ
  '\uFF9A',   // DA ﾚ
  '\uFF9B',   // DB ﾛ
  '\uFF9C',   // DC ﾜ
  '\uFF9D',   // DD ﾝ
  '\u309B',   // DE ゛ (dakuten)
  '\u309C',   // DF ゜ (handakuten)
  // 0xE0–0xEF  (math/comparison, arrows, card suits, shapes)
  '\u2265',   // E0 ≥
  '\u2264',   // E1 ≤
  '\u2260',   // E2 ≠
  '\u2191',   // E3 ↑
  '\u2190',   // E4 ←
  '\u2193',   // E5 ↓
  '\u2192',   // E6 →
  '\u03C0',   // E7 π
  '\u2660',   // E8 ♠
  '\u2665',   // E9 ♥
  '\u2663',   // EA ♣
  '\u2666',   // EB ♦
  '\u25FB',   // EC ◻
  '\u25A2',   // ED ▢
  '\u25B3',   // EE △
  '\\',       // EF \ (actual backslash at 0xEF, not 0x5C)
  // 0xF0–0xFF  (misc: multiply, currency, CJK, user-defined)
  '\u00D7',   // F0 ×
  '\u5186',   // F1 円
  '\u2F1C',   // F2 ⽜
  '\u2F49',   // F3 ⽉
  '\u65E5',   // F4 日
  '\u5343',   // F5 千
  '\u4E07',   // F6 万
  '\u00A3',   // F7 £
  '\u00A2',   // F8 ¢
  '\u00B1',   // F9 ±
  '\u2213',   // FA ∓
  '\u2080',   // FB ₀
  '\u2780',   // FC ➀ (user-defined #1)
  '\u2781',   // FD ➁ (user-defined #2)
  '\u2782',   // FE ➂ (user-defined #3)
  '\u2783',   // FF ➃ (user-defined #4)
];

/**
 * Convert a Casio ASCII byte value (0–255) to its Unicode string equivalent.
 * Returns the mapped character, or a hex escape like "[XX]" if the byte
 * is out of range.
 */
export function casioToUnicode(byte: number): string {
  if (byte >= 0 && byte < CASIO_TO_UNICODE.length) {
    return CASIO_TO_UNICODE[byte];
  }
  return `[${byte.toString(16).padStart(2, '0').toUpperCase()}]`;
}

/**
 * Convert a Uint8Array of Casio ASCII bytes to a Unicode string.
 * The special 0x9E byte (mathematical monospace digit one, used as ⁻¹)
 * is replaced with the more readable "⁻¹" pair, matching the Scala converter.
 */
export function casioBufferToUnicode(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += CASIO_TO_UNICODE[bytes[i]] ?? `[${bytes[i].toString(16).padStart(2, '0').toUpperCase()}]`;
  }
  // Patch up the ⁻¹ character (U+1D7F7) to the readable superscript pair
  return result.replace('\uD835\uDFF7', '\u207B\u00B9');
}
