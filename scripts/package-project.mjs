#!/usr/bin/env node
/**
 * Builds dist/pakka-stories-uncertainty-episode.zip - the deliverable project archive.
 * Excludes node_modules, build output, the render scratch folders and the archived
 * earlier project (archive/village-story, not part of this episode).
 *
 *   node scripts/package-project.mjs
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'dist');
const zipPath = path.join(outDir, 'pakka-stories-uncertainty-episode.zip');
fs.mkdirSync(outDir, {recursive: true});
if (fs.existsSync(zipPath)) fs.rmSync(zipPath);

const exclude = ['node_modules/*', '.git/*', 'out/*', 'dist/*', 'archive/*', '.remotion/*', '.cache/*', '*.mp4', '*.pack'];

execFileSync('zip', ['-r', '-q', '-9', zipPath, '.', '-x', ...exclude], {cwd: root});

const bytes = fs.statSync(zipPath).size;
console.log(`wrote ${path.relative(root, zipPath)} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
