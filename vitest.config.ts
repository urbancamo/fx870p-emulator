import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 120_000,
  },
  resolve: {
    alias: {
      // Emulator modules import with .js extensions (ESM convention);
      // vitest/vite resolves them to the actual .ts source files.
    },
  },
});
