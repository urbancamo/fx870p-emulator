// 132-column, form-feed paginated listing in the style of VMS compiler output.
import { CrunchLine, emitLine } from './scan.js';
import { PassResult, CrunchOptions } from './passes.js';

const PAGE_ROWS = 60;

interface Row { left: string; right: string }

function fit(s: string, w: number): string[] {
  if (s.length <= w) return [s];
  const out: string[] = [];
  for (let i = 0; i < s.length; i += w) out.push(s.slice(i, i + w));
  return out;
}

export function buildListing(args: {
  sourceName: string; original: CrunchLine[]; result: CrunchLine[];
  snapshots: PassResult[]; warnings: string[]; renames: Map<string, string>;
  opts: CrunchOptions; width?: number; now?: Date;
}): string {
  const width = args.width ?? 132;
  const col = Math.floor((width - 4) / 2) - 8;     // text width per side
  const now = args.now ?? new Date();
  const stamp = now.toISOString().slice(0, 16).replace('T', ' ');
  const passNames = args.snapshots.slice(1).map(s => s.name).join(', ');

  // index: original line number -> surviving line (as first origin) or merged host
  const survivors = new Map<number, CrunchLine>();
  const mergedInto = new Map<number, number>();
  for (const l of args.result) {
    survivors.set(l.origins[0], l);
    for (const o of l.origins.slice(1)) mergedInto.set(o, l.num);
  }

  const rows: Row[] = [];
  for (const ol of args.original) {
    const leftBase = `${String(ol.num).padStart(5)}  `;
    const leftText = fit(emitLine(ol), col);
    let rightText: string[];
    let rightBase: string;
    const host = survivors.get(ol.num);
    if (host) {
      rightBase = `${String(host.num).padStart(5)}  `;
      const note = host.notes.length ? `  <- ${host.notes.join('; ')}` : '';
      rightText = fit(emitLine(host) + note, col);
    } else if (mergedInto.has(ol.num)) {
      rightBase = '   ..  ';
      rightText = [`^ merged into ${mergedInto.get(ol.num)}`];
    } else {
      rightBase = '   --  ';
      rightText = ['[deleted]'];
    }
    const n = Math.max(leftText.length, rightText.length);
    for (let i = 0; i < n; i++) {
      rows.push({
        left: (i === 0 ? leftBase : '       ') + (leftText[i] ?? ''),
        right: (i === 0 ? rightBase : '       ') + (rightText[i] ?? ''),
      });
    }
  }

  // trailer sections
  const trailer: string[] = [''];
  if (args.renames.size) {
    trailer.push('Variable map', '------------');
    for (const [oldN, newN] of args.renames) trailer.push(`  ${oldN.padEnd(20)} -> ${newN}`);
    trailer.push('');
  }
  if (args.warnings.length) {
    trailer.push('Warnings', '--------');
    for (const w of args.warnings) trailer.push(`  ${w}`);
    trailer.push('');
  }
  trailer.push('Summary', '-------');
  trailer.push(`  ${'Pass'.padEnd(28)}${'Lines'.padStart(8)}${'Bytes'.padStart(10)}${'Saved'.padStart(9)}`);
  for (let i = 0; i < args.snapshots.length; i++) {
    const s = args.snapshots[i];
    const saved = i === 0 ? '' : String(args.snapshots[i - 1].bytes - s.bytes);
    trailer.push(`  ${s.name.padEnd(28)}${String(s.lines.length).padStart(8)}${String(s.bytes).padStart(10)}${saved.padStart(9)}`);
  }
  const before = args.snapshots[0].bytes;
  const after = args.snapshots[args.snapshots.length - 1].bytes;
  const pct = ((before - after) / before * 100).toFixed(1);
  trailer.push('');
  trailer.push(`  Reduction: ${before - after} bytes (${pct}%)  ${before} -> ${after} tokenized bytes`);

  // paginate
  const out: string[] = [];
  let page = 0;
  let rowOnPage = PAGE_ROWS; // force header on first row
  const emitHeader = () => {
    page++;
    if (page > 1) out.push('\f');
    out.push(
      `Casio BASIC Cruncher V1.0  ${args.sourceName.padEnd(40)} ${stamp}   Page ${String(page).padStart(3)}`);
    out.push(`Source -> Optimized   Level ${args.opts.level}  (${passNames})`);
    out.push('');
    rowOnPage = 3;
  };
  const push = (s: string) => {
    if (rowOnPage >= PAGE_ROWS) emitHeader();
    out.push(s.length > width ? s.slice(0, width) : s);
    rowOnPage++;
  };
  push(`  OLD  SOURCE${' '.repeat(col - 6)} |   NEW  OPTIMIZED`);
  for (const r of rows) push(`${r.left.padEnd(col + 8).slice(0, col + 8)}| ${r.right}`);
  for (const t of trailer) push(t);
  return out.join('\n') + '\n';
}
