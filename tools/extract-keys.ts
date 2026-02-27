/**
 * Extract individual key images from a face image.
 * Uses the keypad geometry from keyboard.ts (defined in face.png coordinates).
 * Auto-detects scale from image width (709=1x, 2836=4x).
 *
 * Usage: npx tsx tools/extract-keys.ts [source-image] [output-dir]
 * Defaults: face-huge.png → public/images/keys/huge/
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PADDING = 0; // no extra pixels around each key (in face.png coords)
const BASE_WIDTH = 709; // face.png reference width

const FACE_IMG = process.argv[2] || path.resolve(__dirname, '../public/images/face-huge.png');
const OUT_DIR = process.argv[3] || path.resolve(__dirname, '../public/images/keys/huge');

// Keypad geometry (from keyboard.ts, in face.png coordinates)
interface KeyBlock {
  L: number; T: number; W: number; H: number;
  SX: number; SY: number; col: number; cnt: number;
}

const keypad: KeyBlock[] = [
  /* 0 */ { L:35,  T:219, W:5,  H:5,  SX:40, SY:33, col:1,  cnt:1  }, // All Reset
  /* 1 */ { L:20,  T:145, W:33, H:21, SX:40, SY:99, col:1,  cnt:2  }, // OFF, CAPS
  /* 2 */ { L:60,  T:145, W:33, H:21, SX:40, SY:66, col:10, cnt:20 }, // MEMO..S rows
  /* 3 */ { L:31,  T:178, W:33, H:21, SX:40, SY:33, col:11, cnt:11 }, // Q..ENG
  /* 4 */ { L:71,  T:244, W:33, H:21, SX:40, SY:33, col:10, cnt:10 }, // Z..SPC
  /* 5 */ { L:484, T:17,  W:30, H:19, SX:36, SY:33, col:6,  cnt:18 }, // small keys
  /* 6 */ { L:481, T:118, W:38, H:27, SX:44, SY:40, col:5,  cnt:18 }, // large keys
  /* 7 */ { L:613, T:238, W:82, H:27, SX:88, SY:40, col:1,  cnt:1  }, // EXE
  /* 8 */ { L:5,   T:5,   W:17, H:17, SX:18, SY:33, col:2,  cnt:2  }, // app min/close
];

// Key names for each code (1-based, matching keyboard.ts order)
const keyNames: string[] = [
  // Block 0: All Reset (code 1)
  'all-reset',
  // Block 1: OFF, CAPS (codes 2-3)
  'off', 'caps',
  // Block 2 row 1: MEMO, IN, OUT, CALC, up, down, left, right, INS, S (codes 4-13)
  'memo', 'in', 'out', 'calc', 'up', 'down', 'left', 'right', 'ins', 's-shift',
  // Block 2 row 2: A, S, D, F, G, H, J, K, L, ANS (codes 14-23)
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ans',
  // Block 3: Q, W, E, R, T, Y, U, I, O, P, ENG (codes 24-34)
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'eng',
  // Block 4: Z, X, C, V, B, N, M, comma, equals, spc (codes 35-44)
  'z', 'x', 'c', 'v', 'b', 'n', 'm', 'comma', 'equals', 'spc',
  // Block 5 row 1: CASL, Fx, DEGR, sqrt, x2, MODE (codes 45-50)
  'casl', 'fx', 'degr', 'sqrt', 'x2', 'mode',
  // Block 5 row 2: log, ln, hyp, sin, cos, tan (codes 51-56)
  'log', 'ln', 'hyp', 'sin', 'cos', 'tan',
  // Block 5 row 3: mr, m-plus, hex, open-paren, close-paren, power (codes 57-62)
  'mr', 'm-plus', 'hex', 'open-paren', 'close-paren', 'power',
  // Block 6 row 1: 7, 8, 9, bs, brk (codes 63-67)
  '7', '8', '9', 'bs', 'brk',
  // Block 6 row 2: 4, 5, 6, multiply, divide (codes 68-72)
  '4', '5', '6', 'multiply', 'divide',
  // Block 6 row 3: 1, 2, 3, plus, minus (codes 73-77)
  '1', '2', '3', 'plus', 'minus',
  // Block 6 row 4 (partial): 0, dot, exp (codes 78-80)
  '0', 'dot', 'exp',
  // Block 7: EXE (code 81)
  'exe',
  // Block 8: app minimize, app close (codes 82-83)
  'app-minimize', 'app-close',
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const image = sharp(FACE_IMG);
  const metadata = await image.metadata();
  const imgW = metadata.width!;
  const imgH = metadata.height!;
  const SCALE = Math.round(imgW / BASE_WIDTH);
  console.log(`Source: ${metadata.width}x${metadata.height} (${SCALE}x scale)`);
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Keys to extract: ${keyNames.length}`);

  let code = 0;
  for (let blockIdx = 0; blockIdx < keypad.length; blockIdx++) {
    const b = keypad[blockIdx];
    for (let k = 0; k < b.cnt; k++) {
      const col = k % b.col;
      const row = Math.floor(k / b.col);

      // Position in face.png coordinates
      const fx = b.L + col * b.SX;
      const fy = b.T + row * b.SY;

      // Add padding and scale to face-huge coordinates
      const pad = blockIdx === 0 ? 4 : PADDING; // more padding for tiny All Reset
      const left = Math.max(0, (fx - pad) * SCALE);
      const top = Math.max(0, (fy - pad) * SCALE);
      // Block 5 (small keys) has a stray pixel column on the right — trim 1px
      const trimR = blockIdx === 5 ? 1 : 0;
      const width = Math.min((b.W + pad * 2 - trimR) * SCALE, imgW - left);
      const height = Math.min((b.H + pad * 2) * SCALE, imgH - top);

      const name = keyNames[code] || `key-${code + 1}`;
      const outFile = path.join(OUT_DIR, `${name}.png`);

      await sharp(FACE_IMG)
        .extract({ left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height) })
        .toFile(outFile);

      console.log(`  ${name}.png  (${Math.round(width)}x${Math.round(height)})`);
      code++;
    }
  }

  console.log(`\nDone! Extracted ${code} key images.`);
}

main().catch(err => { console.error(err); process.exit(1); });
