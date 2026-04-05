import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('CLI smoke tests', () => {
  it('run command executes a minimal binary', () => {
    const dir = mkdtempSync(join(tmpdir(), 'emudbg-cli-'));
    const binPath = join(dir, 'tiny.bin');
    writeFileSync(binPath, new Uint8Array([0xCE, 0xF7]));
    try {
      const out = execFileSync('npx', [
        'tsx', 'tools/emu-debugger/cli.ts', 'run', binPath,
        '--max-instructions', '10', '--quiet',
      ], { encoding: 'utf8', timeout: 60_000 });
      expect(out).toContain('Exit');
      expect(out).toContain('Cycles:');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 120_000);

  it('fails cleanly when binary does not exist', () => {
    expect(() => {
      execFileSync('npx', [
        'tsx', 'tools/emu-debugger/cli.ts', 'run',
        '/nonexistent/file.bin', '--quiet',
      ], { encoding: 'utf8', timeout: 60_000 });
    }).toThrow();
  });
});
