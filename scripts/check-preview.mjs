#!/usr/bin/env node
/**
 * Verifies the rendered preview itself (not just the source data):
 *   - container / stream facts
 *   - frame count and duration
 *   - measured A/V offset between the narration stem and the muxed soundtrack
 *   - grabs sample frames so the encode can be eyeballed
 *
 *   node scripts/check-preview.mjs [out/preview.mp4]
 */
import fs from 'node:fs';
import path from 'node:path';
import {ffmpegPath, ffprobePath, run, decodeToWav} from './lib/ffmpeg.mjs';
import {readWav} from './lib/audio.mjs';

const file = process.argv[2] ?? 'out/preview.mp4';
const episode = JSON.parse(fs.readFileSync('episode/episode.json', 'utf8'));
const expectedFrames = episode.durationInFrames;
const expectedSeconds = expectedFrames / episode.fps;

const facts = JSON.parse(
  run(ffprobePath, [
    '-v', 'error',
    '-show_entries', 'format=duration,size,bit_rate',
    '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,sample_rate,channels',
    '-of', 'json',
    file,
  ]).toString(),
);
const video = facts.streams.find((s) => s.codec_type === 'video') ?? {};
const audio = facts.streams.find((s) => s.codec_type === 'audio') ?? {};
const duration = Number(facts.format.duration);
const sizeBytes = Number(facts.format.size ?? 0);

console.log('container');
console.log(`  duration      ${duration.toFixed(3)} s (expected ${expectedSeconds.toFixed(3)} s)`);
console.log(`  size          ${(sizeBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`  video         ${video.codec_name} ${video.width}x${video.height} @ ${video.r_frame_rate} fps, ${video.nb_frames} frames`);
console.log(`  audio         ${audio.codec_name} ${audio.sample_rate} Hz ${audio.channels} ch`);

let ok = true;
const assert = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}  [${detail}]`);
  if (!cond) ok = false;
};
assert('frame count is 3823', Number(video.nb_frames) === expectedFrames, `${video.nb_frames}`);
assert('duration matches 127.43 s', Math.abs(duration - expectedSeconds) < 0.12, `${duration.toFixed(3)} s`);
assert('audio stream present', Boolean(audio.codec_name), `${audio.codec_name ?? 'none'}`);

/* A/V offset: cross-correlate 10 ms RMS envelopes of the muxed audio and the narration stem. */
const SR = 44100;
const tmp = path.join('dist', 'tmp');
fs.mkdirSync(tmp, {recursive: true});
const decoded = decodeToWav(file, path.join(tmp, 'preview-audio.wav'), {channels: 1, rate: SR});
const muxed = readWav(decoded).channels[0];
const stem = readWav('public/audio/narration.wav').channels[0];

const hop = Math.round(SR * 0.01);
const env = (samples) => {
  const n = Math.floor(samples.length / hop);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < hop; j++) {
      const v = samples[i * hop + j] ?? 0;
      sum += v * v;
    }
    out[i] = Math.sqrt(sum / hop);
  }
  return out;
};
const a = env(muxed);
const b = env(stem);
const maxLag = 60; // +-0.6 s
let best = {lag: 0, score: -Infinity};
for (let lag = -maxLag; lag <= maxLag; lag++) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = Math.max(0, -lag); i < Math.min(b.length, a.length - lag); i++) {
    const av = a[i + lag];
    const bv = b[i];
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  const score = dot / Math.sqrt(na * nb || 1);
  if (score > best.score) best = {lag, score};
}
const offsetMs = best.lag * 10;
console.log(`\nsync`);
console.log(`  narration-vs-muxed correlation peak at ${offsetMs} ms (r=${best.score.toFixed(3)})`);
assert('audio offset within +-40 ms of the picture', Math.abs(offsetMs) <= 40, `${offsetMs} ms`);

/* Sample frames straight out of the encode. */
const outDir = path.join('dist', 'preview-frames');
fs.mkdirSync(outDir, {recursive: true});
for (const t of [2, 34, 70, 101, 124]) {
  run(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', String(t), '-i', file, '-frames:v', '1', path.join(outDir, `t${String(t).padStart(3, '0')}.png`)]);
}
console.log(`\nsampled frames -> ${outDir} (t = 2, 34, 70, 101, 124 s)`);
console.log(ok ? '\nPREVIEW OK' : '\nPREVIEW FAILED');
process.exit(ok ? 0 : 1);
