// tools/build-command-index.ts
//
// Scans public/docs/casio-jis-basic/commands/*.md and generates
// a JSON index mapping BASIC keywords to their doc files.
//
// Run: npx tsx tools/build-command-index.ts

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const COMMANDS_DIR = join(ROOT, 'public', 'docs', 'casio-jis-basic', 'commands');
const OUTPUT_FILE = join(ROOT, 'public', 'docs', 'casio-jis-basic', 'command-index.json');

interface CommandEntry {
  file: string;
  purpose: string;
  badge: string;
}

const keywords: Record<string, CommandEntry> = {};

const files = readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.md')).sort();

for (const file of files) {
  const content = readFileSync(join(COMMANDS_DIR, file), 'utf-8');
  const lines = content.split('\n');

  // Extract heading — the ## line gives us the command name(s)
  const headingLine = lines.find(l => /^##\s+/.test(l));
  if (!headingLine) continue;
  const heading = headingLine.replace(/^##\s+/, '').trim();

  // Extract badge — look for **[...]** on a line by itself
  const badgeLine = lines.find(l => /^\*\*\[.*\]\*\*/.test(l.trim()));
  const badge = badgeLine
    ? (badgeLine.match(/\*\*\[(.*?)\]\*\*/)?.[1] ?? 'All Models')
    : 'All Models';

  // Extract purpose — text after ### Purpose
  let purpose = '';
  const purposeIdx = lines.findIndex(l => /^###\s+Purpose/i.test(l));
  if (purposeIdx >= 0) {
    for (let i = purposeIdx + 1; i < lines.length; i++) {
      const ln = lines[i].trim();
      if (ln.startsWith('#') || ln.startsWith('```')) break;
      if (ln) {
        purpose = ln;
        break;
      }
    }
  }

  const relFile = `commands/${file}`;
  const entry: CommandEntry = { file: relFile, purpose, badge };

  // Parse command names from heading.
  //
  // Heading patterns:
  //   "INPUT"                              → single keyword
  //   "LOAD, LOAD ALL"                     → comma-separated
  //   "EOX / EOY"                          → slash-separated (variants)
  //   "IF ~ THEN ~ ELSE / IF ~ GOTO ~ ELSE" → slash-separated compound forms
  //   "HYP SIN, HYP COS, HYP TAN"         → comma-separated multi-word
  //   "ASN ACS ATN"                        → space-separated (no comma, no tilde)
  //   "SIN COS TAN"                        → space-separated
  //   "FOR ~ NEXT"                         → tilde joins compound command parts
  //   "LIST [ALL]"                         → optional modifier in brackets
  //   "Logical Operators"                  → special title (extract NOT, AND, OR, XOR)

  // First split on / to get variant forms
  const variants = heading.split('/').map(s => s.trim());

  for (const variant of variants) {
    // Split on comma to get individual command names within a variant
    const commaParts = variant.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (commaParts.length > 1) {
      // Comma-separated: each part is a distinct keyword
      for (const part of commaParts) {
        addKeywords(part, entry);
      }
    } else {
      // Single part (no commas) — could be space-separated or tilde-joined
      addKeywords(variant, entry);
    }
  }
}

// Add keyword(s) from a single command expression
function addKeywords(expr: string, entry: CommandEntry) {
  // Strip optional brackets like [ALL] and register the base + full form
  const bracketMatch = expr.match(/^(.+?)\s+\[(.+?)\]$/);
  if (bracketMatch) {
    const base = bracketMatch[1].trim();
    const full = `${base} ${bracketMatch[2].trim()}`;
    keywords[base.toUpperCase()] = entry;
    keywords[full.toUpperCase()] = entry;
    return;
  }

  // Handle tilde-joined compound commands like "FOR ~ NEXT" or "IF ~ THEN ~ ELSE"
  // Register each individual word as a keyword pointing to this file,
  // but don't overwrite if the word already has a dedicated entry
  if (expr.includes('~')) {
    const parts = expr.split('~').map(s => s.trim()).filter(s => s.length > 0);
    for (const part of parts) {
      const key = part.toUpperCase();
      if (!keywords[key]) {
        keywords[key] = entry;
      }
    }
    return;
  }

  // Handle multi-word commands that should stay together
  // HYP SIN, ON ERROR GOTO, LINE INPUT, PRINT USING, LOAD ALL, SAVE ALL,
  // STAT CLEAR, Logical Operators, etc.
  const upper = expr.toUpperCase();
  const multiWordPrefixes = ['HYP ', 'ON ', 'LINE ', 'PRINT ', 'LOAD ', 'SAVE ', 'STAT '];
  const isMultiWord = multiWordPrefixes.some(p => upper.startsWith(p));

  if (isMultiWord) {
    // Keep as a single keyword entry
    keywords[upper] = entry;
    // Also register the individual words so they can be found
    for (const word of upper.split(/\s+/)) {
      if (word.length > 1) {
        // Don't overwrite if the word already has its own dedicated entry
        if (!keywords[word]) {
          keywords[word] = entry;
        }
      }
    }
    return;
  }

  // Special case: "Logical Operators" — register NOT, AND, OR, XOR
  if (upper === 'LOGICAL OPERATORS') {
    keywords['NOT'] = entry;
    keywords['AND'] = entry;
    keywords['OR'] = entry;
    keywords['XOR'] = entry;
    return;
  }

  // Check if this looks like space-separated individual commands
  // e.g. "ASN ACS ATN", "SIN COS TAN"
  // These are all-uppercase, no special characters, multiple words
  const words = expr.trim().split(/\s+/);
  if (words.length > 1 && words.every(w => /^[A-Z][A-Z0-9$#@]*$/.test(w))) {
    // Space-separated individual keywords
    for (const word of words) {
      keywords[word] = entry;
    }
    return;
  }

  // Special characters in name: $, #, @, (, ), &
  // e.g. "REM ( ' )" — register REM and '
  if (upper === "REM ( ' )") {
    keywords['REM'] = entry;
    keywords["'"] = entry;
    return;
  }

  // Default: register as-is
  keywords[upper] = entry;
}

const sorted: Record<string, CommandEntry> = {};
for (const key of Object.keys(keywords).sort()) {
  sorted[key] = keywords[key];
}

const output = JSON.stringify({ keywords: sorted }, null, 2);
writeFileSync(OUTPUT_FILE, output + '\n', 'utf-8');

console.log(`Generated ${Object.keys(sorted).length} keyword entries → ${OUTPUT_FILE}`);
