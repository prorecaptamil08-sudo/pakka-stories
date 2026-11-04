#!/usr/bin/env node
/**
 * Restores a usable Chromium for Remotion on a machine where `npx remotion browser
 * ensure` cannot reach the download host (no network, or a locked-down sandbox).
 *
 *   npm install --no-save @sparticuz/chromium@153.0.0
 *   node scripts/setup-browser.mjs
 *
 * Produces:
 *   /tmp/chromium        the browser binary
 *   /tmp/al/lib          its shared libraries   -> LD_LIBRARY_PATH
 *   /tmp/al/fonts        a fontconfig tree       -> FONTCONFIG_PATH
 *   /tmp/al/swiftshader  software GL (optional --gl=swiftshader renders)
 *
 * Nothing here touches the project; everything lands in /tmp.
 */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const binDir = path.join(path.dirname(require.resolve('@sparticuz/chromium')), '..', 'bin');
const tmp = '/tmp';

const unpack = (name, target) => {
  const archive = path.join(tmp, `${name}.tar`);
  const source = path.join(binDir, `${name}.tar.br`);
  if (!fs.existsSync(source)) throw new Error(`missing ${source} - is @sparticuz/chromium installed?`);
  fs.writeFileSync(archive, zlib.brotliDecompressSync(fs.readFileSync(source)));
  fs.mkdirSync(target, {recursive: true});
  execFileSync('tar', ['-xf', archive, '-C', target]);
  fs.rmSync(archive);
  console.log(`  ${name}.tar.br -> ${target}`);
};

console.log('extracting chromium');
const binary = path.join(tmp, 'chromium');
fs.writeFileSync(binary, zlib.brotliDecompressSync(fs.readFileSync(path.join(binDir, 'chromium.br'))));
fs.chmodSync(binary, 0o755);
console.log(`  chromium.br -> ${binary} (${(fs.statSync(binary).size / 1024 / 1024).toFixed(1)} MB)`);

unpack('al2023', path.join(tmp, 'al'));
unpack('fonts', path.join(tmp, 'al', 'fonts'));
unpack('swiftshader', path.join(tmp, 'al', 'swiftshader'));

console.log(`
ready:
  export LD_LIBRARY_PATH=${tmp}/al/lib
  export FONTCONFIG_PATH=${tmp}/al/fonts
  npx remotion render src/index.ts AwakenEpisode out/render.mp4 \\
    --browser-executable=${binary} --chrome-mode=chrome-for-testing`);
