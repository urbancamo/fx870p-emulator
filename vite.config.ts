import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import type { Connect } from 'vite';

interface LogEntry {
  t: number;
  tag: string;
  msg: string;
  data?: unknown;
}

function logServerPlugin() {
  const logFile = path.resolve('emulator-debug.log');

  return {
    name: 'log-server',
    configureServer(server: { middlewares: Connect.Server }) {
      fs.writeFileSync(
        logFile,
        `=== emulator debug log started ${new Date().toISOString()} ===\n`,
      );

      server.middlewares.use('/log', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const entries: LogEntry[] = JSON.parse(body);
            const lines = entries.map(e => {
              const ds = e.data !== undefined ? ' ' + JSON.stringify(e.data) : '';
              return `[${String(e.t).padStart(8)}ms] [${e.tag.padEnd(14)}] ${e.msg}${ds}`;
            }).join('\n');
            fs.appendFileSync(logFile, lines + '\n');
            process.stdout.write(lines + '\n');
          } catch {
            // ignore malformed body
          }
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), logServerPlugin()],
});
