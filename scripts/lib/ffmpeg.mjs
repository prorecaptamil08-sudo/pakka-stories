import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolves the ffmpeg/ffprobe binaries bundled with Remotion so the project does not
 * need a system ffmpeg install (and works in air-gapped sandboxes).
 */
const require = createRequire(import.meta.url);

const candidates = [
  '@remotion/compositor-linux-x64-gnu',
  '@remotion/compositor-darwin-arm64',
  '@remotion/compositor-darwin-x64',
  '@remotion/compositor-win32-x64-msvc',
];

const findDir = () => {
  for (const name of candidates) {
    try {
      const pkg = require.resolve(`${name}/package.json`);
      const dir = path.dirname(pkg);
      if (fs.existsSync(path.join(dir, 'ffmpeg')) || fs.existsSync(path.join(dir, 'ffmpeg.exe'))) return dir;
    } catch {
      /* not installed for this platform */
    }
  }
  return null;
};

const dir = findDir();
const exe = (name) => {
  if (!dir) return name; // fall back to a system install on PATH
  const win = process.platform === 'win32';
  const file = path.join(dir, win ? `${name}.exe` : name);
  return fs.existsSync(file) ? file : name;
};

export const ffmpegPath = exe('ffmpeg');
export const ffprobePath = exe('ffprobe');

const env = () => {
  if (!dir) return process.env;
  const sep = process.platform === 'win32' ? ';' : ':';
  const current = process.env.LD_LIBRARY_PATH || '';
  return {...process.env, LD_LIBRARY_PATH: current ? `${dir}${sep}${current}` : dir, DYLD_LIBRARY_PATH: dir};
};

export const run = (bin, args) => execFileSync(bin, args, {env: env(), stdio: ['ignore', 'pipe', 'pipe']});

export const decodeToWav = (input, output, {channels = 1, rate = 44100} = {}) => {
  run(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', '-i', input, '-ac', String(channels), '-ar', String(rate), '-c:a', 'pcm_s16le', output]);
  return output;
};

export const atempo = (input, output, factor) => {
  run(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', '-i', input, '-filter:a', `atempo=${factor.toFixed(4)}`, '-c:a', 'pcm_s16le', output]);
  return output;
};

export const probeDuration = (file) => {
  const out = run(ffprobePath, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim();
  return Number(out);
};
