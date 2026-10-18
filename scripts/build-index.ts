#!/usr/bin/env node
/**
 * Validate every avatar, pack each one REPRODUCIBLY, and write dist/index.json.
 *
 *   node scripts/build-index.ts [--main <path-to-claude-pet-checkout>]
 *
 * Reproducible means: the same content always gives the same .claudepet bytes, so the
 * sha256 published in index.json identifies content, not a build. `zip` stores each file's
 * mtime, so every packed file is first touched to a fixed instant (UTC), and files go in
 * sorted order, manifest first — mirrors the main repo's `avatar.ts pack` otherwise.
 * CI packs twice and compares the hashes to keep this honest.
 */

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MAIN = resolve(process.argv.includes('--main')
  ? process.argv[process.argv.indexOf('--main') + 1]
  : join(ROOT, '..', 'claude-pet'));
const EPOCH = '202601010000'; // touch -t CCYYMMDDhhmm, UTC

// The main repository's validator is the single source of the format rules.
const { validateDir } = await import(join(MAIN, 'packages', 'collector', 'src', 'avatar-format.ts'));

const dist = join(ROOT, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const entries = [];
let failed = false;
for (const id of readdirSync(join(ROOT, 'avatars')).sort()) {
  const dir = join(ROOT, 'avatars', id);
  if (!statSync(dir).isDirectory()) continue;
  const report = validateDir(dir);
  for (const w of report.warnings) process.stderr.write(`warning: ${id}: ${w}\n`);
  for (const e of report.errors) process.stderr.write(`error: ${id}: ${e}\n`);
  const m = report.manifest;
  if (!m || report.errors.length > 0) {
    failed = true;
    continue;
  }
  if (m.id !== id) {
    process.stderr.write(`error: ${id}: manifest id is "${m.id}", not the folder name\n`);
    failed = true;
    continue;
  }
  if (!m.license) {
    process.stderr.write(`error: ${id}: the library requires a "license" (SPDX identifier)\n`);
    failed = true;
    continue;
  }
  const files = ['manifest.json', ...report.files.sort()];
  const out = join(dist, `${id}.claudepet`);
  execFileSync('touch', ['-t', EPOCH, ...files.map((f) => join(dir, f))], { env: { ...process.env, TZ: 'UTC' } });
  execFileSync('zip', ['-j', '-X', '-q', out, ...files.map((f) => join(dir, f))], { env: { ...process.env, TZ: 'UTC' } });
  const bytes = readFileSync(out);
  entries.push({
    id,
    name: m.name,
    names: m.names ?? {},
    version: m.version ?? '0',
    kind: m.kind,
    license: m.license,
    author: m.author ?? null,
    file: `${id}.claudepet`,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
  });
  process.stdout.write(`packed ${id} ${m.version ?? ''} (${bytes.length} bytes)\n`);
}
if (failed) process.exit(1);
if (entries.length === 0) {
  process.stderr.write('error: no avatars packed\n');
  process.exit(1);
}

writeFileSync(join(dist, 'index.json'), `${JSON.stringify({ format: 1, generated: new Date().toISOString(), avatars: entries }, null, 2)}\n`);
process.stdout.write(`index.json: ${entries.length} avatars\n`);
