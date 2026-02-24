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
  const logFile   = path.resolve('emulator-debug.log');
  const traceFile = path.resolve('trace.jsonl');

  return {
    name: 'log-server',
    configureServer(server: { middlewares: Connect.Server }) {
      fs.writeFileSync(
        logFile,
        `=== emulator debug log started ${new Date().toISOString()} ===\n`,
      );
      // Truncate trace file so each dev-server session starts fresh
      fs.writeFileSync(traceFile, '');

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

      // /trace — accepts plain-text JSONL batches from trace.ts and appends to trace.jsonl
      server.middlewares.use('/trace', (req, res, next) => {
        if (req.method !== 'POST') { next(); return; }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          if (body.length > 0) fs.appendFileSync(traceFile, body);
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  base: '/fx870p-emulator/',
  plugins: [vue(), logServerPlugin()],
  server: {
    port: 3007,
    allowedHosts: ['m5tea.uk'],
  },
});
