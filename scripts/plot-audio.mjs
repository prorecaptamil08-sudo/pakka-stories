#!/usr/bin/env node
/**
 * Renders dist/audio-check.png: an objective visual check of the finished soundtrack.
 *   panel 1  narration stem waveform + every cue start marker
 *   panel 2  music bed waveform + the ducking envelope (mirrors src/audio/ducking.ts)
 *
 * Usage: node scripts/plot-audio.mjs
 */
import fs from 'node:fs';
import {readWav} from './lib/audio.mjs';
import {decodeToWav} from './lib/ffmpeg.mjs';
import {writePng, drawText} from './lib/png.mjs';

const W = 1600;
const H = 900;
const episode = JSON.parse(fs.readFileSync('episode/episode.json', 'utf8'));
const totalSeconds = episode.durationInFrames / episode.fps;

const rgb = Buffer.alloc(W * H * 3);
const fill = (x0, y0, x1, y1, [r, g, b]) => {
  for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
      const i = (y * W + x) * 3;
      rgb[i] = r;
      rgb[i + 1] = g;
      rgb[i + 2] = b;
    }
  }
};
fill(0, 0, W, H, [16, 18, 26]);

const padding = 40;
const plotW = W - padding * 2;
const toX = (s) => Math.round(padding + (s / totalSeconds) * plotW);

/** RMS envelope in N buckets. */
const envelope = (samples, buckets) => {
  const out = new Float32Array(buckets);
  const per = Math.floor(samples.length / buckets);
  for (let b = 0; b < buckets; b++) {
    let sum = 0;
    const start = b * per;
    for (let i = 0; i < per; i++) {
      const v = samples[start + i] ?? 0;
      sum += v * v;
    }
    out[b] = Math.sqrt(sum / Math.max(1, per));
  }
  return out;
};

const drawEnvelope = (samples, yTop, yBottom, colour, gainScale = 1) => {
  const buckets = plotW;
  const env = envelope(samples, buckets);
  let peak = 1e-6;
  for (const v of env) peak = Math.max(peak, v);
  const mid = (yTop + yBottom) / 2;
  const half = (yBottom - yTop) / 2 - 6;
  for (let x = 0; x < buckets; x++) {
    const h = Math.min(half, (env[x] / peak) * gainScale * half * 0.95);
    fill(padding + x, Math.round(mid - h), padding + x + 1, Math.round(mid + h), colour);
  }
  return {mid, half};
};

// panel 1: narration
drawText(rgb, W, H, padding, 14, 'NARRATION STEM (28 LINES PLACED AT EXACT CUE TIMESTAMPS)', [230, 240, 255], 2);
const p1Top = 50;
const p1Bottom = 400;
fill(padding, p1Top, padding + plotW, p1Bottom, [22, 25, 36]);
const nar = readWav('public/audio/narration.wav');
drawEnvelope(nar.channels[0], p1Top, p1Bottom, [120, 200, 255], 1.0);
for (const cue of episode.cues) {
  const x = toX(cue.start);
  fill(x, p1Top, x + 1, p1Bottom, [90, 100, 130]);
  fill(x, p1Top, x + 3, p1Top + 8, [255, 200, 80]);
}
drawText(rgb, W, H, padding, p1Bottom + 6, 'CUE STARTS MARKED; X-AXIS 0-127.4S', [150, 160, 180], 1);

// panel 2: music + ducking
drawText(rgb, W, H, padding, 440, 'MUSIC BED (5 MOVEMENTS) AND THE -9 DB DUCKING ENVELOPE', [230, 240, 255], 2);
const p2Top = 476;
const p2Bottom = 800;
fill(padding, p2Top, padding + plotW, p2Bottom, [22, 25, 36]);

const music = new Float32Array(Math.ceil(totalSeconds * 44100));
fs.mkdirSync('dist/tmp', {recursive: true});
for (const track of episode.audio.musicTracks) {
  const source = `public/${track.src}`;
  const file = source.endsWith('.mp3') ? `dist/tmp/${track.id}.wav` : source;
  if (source.endsWith('.mp3')) decodeToWav(source, file, {channels: 2, rate: 44100});
  const wav = readWav(file);
  const offset = Math.round((track.startFrame / episode.fps) * 44100);
  const len = Math.min(wav.channels[0].length, music.length - offset);
  for (let i = 0; i < len; i++) music[offset + i] += wav.channels[0][i];
}
drawEnvelope(music, p2Top, p2Bottom, [180, 150, 255], 1.0);

// duck envelope (mirror of src/audio/ducking.ts)
const duckDb = episode.audio.musicDuckDb ?? -9;
// mirrors narrationWindowsFromTiming()
const timing = JSON.parse(fs.readFileSync('episode/narration-timing.json', 'utf8'));
const windows = timing.lines.map((line) => ({
  startFrame: line.startFrame,
  endFrame: Math.min(episode.durationInFrames, line.endFrame + Math.round(0.12 * episode.fps)),
}));
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const gainAt = (frame) => {
  let amount = 0;
  for (const w of windows) {
    if (frame >= w.startFrame && frame <= w.endFrame) return Math.pow(10, duckDb / 20);
    if (frame >= w.startFrame - 8 && frame < w.startFrame) amount = Math.max(amount, smoothstep(w.startFrame - 8, w.startFrame, frame));
    else if (frame > w.endFrame && frame <= w.endFrame + 16) amount = Math.max(amount, 1 - smoothstep(w.endFrame, w.endFrame + 16, frame));
  }
  return Math.pow(10, (duckDb * amount) / 20);
};
const mid = (p2Top + p2Bottom) / 2;
const half = (p2Bottom - p2Top) / 2 - 6;
for (let x = 0; x < plotW; x++) {
  const frame = (x / plotW) * episode.durationInFrames;
  const g = gainAt(frame);
  const y = Math.round(p2Top + (1 - g) * (half * 2) * 0.85);
  fill(padding + x, y, padding + x + 1, y + 2, [255, 120, 120]);
}
drawText(rgb, W, H, padding, p2Bottom + 6, 'RED LINE = DUCK GAIN (1.0 = OPEN, 0.355 = -9 DB); MUSIC AUTOMATICALLY DIPS UNDER EVERY LINE', [150, 160, 180], 1);

// movement boundaries
for (const track of episode.audio.musicTracks) {
  const x = toX(track.startFrame / episode.fps);
  fill(x, p2Top, x + 1, p2Bottom, [90, 200, 160]);
}
drawText(rgb, W, H, padding, 850, `TOTAL ${totalSeconds.toFixed(2)}S  /  ${episode.durationInFrames} FRAMES  @  ${episode.fps} FPS`, [200, 210, 230], 2);

writePng('dist/audio-check.png', W, H, rgb);
console.log('wrote dist/audio-check.png');
