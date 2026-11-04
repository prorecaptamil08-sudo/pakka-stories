#!/usr/bin/env node
/**
 * Narration builder.
 *
 * The voice-over is synthesised in three contiguous takes (so the delivery stays natural
 * and consistently paced). This script then:
 *   1. decodes each take to 44.1 kHz mono PCM,
 *   2. splits it back into the 28 individual lines using silence-boundary detection,
 *   3. time-compresses any line that would overrun its cue window (max 1.22x),
 *   4. re-lays every line at its EXACT cue timestamp from episode/script.txt,
 *   5. writes public/audio/narration.wav plus per-line stems and a timing report.
 *
 * Run: node scripts/build-narration.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {SR, readWav, writeWavMono, writeWavStereo} from './lib/audio.mjs';
import {atempo, decodeToWav, ffmpegPath} from './lib/ffmpeg.mjs';

const root = process.cwd();
const episode = JSON.parse(fs.readFileSync(path.join(root, 'episode/episode.json'), 'utf8'));
const cues = episode.cues;
const FPS = episode.fps;

const SRC_DIR = path.join(root, 'public/audio/narration/source');
const OUT_DIR = path.join(root, 'public/audio/narration');
const TMP = path.join(root, 'public/audio/narration/.work');
fs.mkdirSync(TMP, {recursive: true});

// Which cue indices live in which generated take.
const GROUPS = [
  {file: 'chunk_0.mp3', from: 0, to: 10},
  {file: 'chunk_1.mp3', from: 10, to: 19},
  {file: 'chunk_2.mp3', from: 19, to: 28},
];

const FRAME = Math.round(0.01 * SR); // 10 ms analysis frames
const SILENCE_DB = -42;

const dbToAmp = (db) => Math.pow(10, db / 20);

const frameRms = (samples, frameLen = FRAME) => {
  const frames = Math.floor(samples.length / frameLen);
  const rms = new Float32Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    const start = f * frameLen;
    for (let i = 0; i < frameLen; i++) {
      const v = samples[start + i];
      sum += v * v;
    }
    rms[f] = Math.sqrt(sum / frameLen);
  }
  return rms;
};

/**
 * Splits one take into the expected number of lines.
 *
 * The take contains no explicit line markers, so the split is a sequence-alignment problem:
 * every detected pause (>= 80 ms of near-silence) is a candidate cut point, and a dynamic
 * program picks the N-1 cuts whose resulting line durations best match the scripted cue
 * windows (relative-error cost). Cuts therefore always land in real silence, and the
 * script timings decide which silence is used.
 */
const splitSegments = (samples, expectedWindows, wordWeights) => {
  const rms = frameRms(samples);
  const quiet = dbToAmp(-38);

  let first = 0;
  let last = rms.length - 1;
  while (first < rms.length && rms[first] < quiet) first++;
  while (last > first && rms[last] < quiet) last--;

  // candidate cut points: silence-run midpoints
  const candidates = [{frame: first, gapMs: 0}];
  let runStart = -1;
  for (let f = first; f <= last; f++) {
    const isQuiet = rms[f] < quiet;
    if (isQuiet && runStart < 0) runStart = f;
    if ((!isQuiet || f === last) && runStart >= 0) {
      const len = f - runStart;
      if (len >= 8 && runStart > first + 5) {
        candidates.push({frame: runStart + Math.floor(len / 2), gapMs: len * 10});
      }
      runStart = -1;
    }
  }
  candidates.push({frame: last, gapMs: 0});
  candidates.sort((a, b) => a.frame - b.frame);

  const nLines = expectedWindows.length;
  const scriptedSpan = expectedWindows.reduce((a, b) => a + b, 0);
  const audioSpan = last - first;

  // Expected duration per line: mostly proportional to how many words the line has (the
  // synthesiser speaks at a roughly constant rate), nudged by the scripted pause lengths.
  const wordTotal = wordWeights.reduce((a, b) => a + b, 0) || 1;
  const targets = expectedWindows.map((w, i) => {
    const wordShare = wordWeights[i] / wordTotal;
    const scriptShare = w / scriptedSpan;
    return (0.75 * wordShare + 0.25 * scriptShare) * audioSpan;
  });
  const minFrames = Math.round(0.35 * SR / FRAME);

  const cost = (durFrames, target) => {
    const rel = (durFrames - target) / Math.max(1, target);
    return rel * rel;
  };
  const gapPenalty = (gapMs) => (gapMs >= 110 ? 0 : gapMs >= 90 ? 0.02 : 0.08);

  const M = candidates.length;
  const INF = Number.POSITIVE_INFINITY;
  // dp[j][k] = best cost placing boundary j at candidate k (j = 1..nLines-1)
  const dp = Array.from({length: nLines}, () => new Float64Array(M).fill(INF));
  const back = Array.from({length: nLines}, () => new Int32Array(M).fill(-1));

  // j = 0 -> start candidate (index 0)
  const startIdx = 0;
  const endIdx = M - 1;
  dp[0][startIdx] = 0;

  for (let j = 1; j < nLines; j++) {
    for (let k = 1; k < M - 1; k++) {
      const dur = candidates[k].frame - candidates[k - 1].frame;
      for (let prev = j - 1; prev < k; prev++) {
        const prevCost = dp[j - 1][prev];
        if (prevCost === INF) continue;
        const durFrames = candidates[k].frame - candidates[prev].frame;
        if (durFrames < minFrames) continue;
        if (candidates[prev].frame === candidates[k].frame) continue;
        const c = prevCost + cost(durFrames, (targets[j - 1] * (durFrames > 0 ? 1 : 1)));
        if (c < dp[j][k]) {
          dp[j][k] = c;
          back[j][k] = prev;
        }
      }
      if (dp[j][k] !== INF) dp[j][k] += gapPenalty(candidates[k].gapMs);
    }
  }

  // close with the final candidate
  let bestCost = INF;
  let bestPrev = -1;
  for (let prev = nLines - 1; prev < endIdx; prev++) {
    const prevCost = dp[nLines - 1][prev];
    if (prevCost === INF) continue;
    const durFrames = candidates[endIdx].frame - candidates[prev].frame;
    if (durFrames < minFrames) continue;
    const c = prevCost + cost(durFrames, targets[nLines - 1]);
    if (c < bestCost) {
      bestCost = c;
      bestPrev = prev;
    }
  }

  let boundaries;
  if (bestPrev < 0) {
    // Degenerate take (almost no silence): fall back to proportional cuts.
    console.warn('    ! no usable pause structure - falling back to proportional cuts');
    boundaries = [first];
    let acc = 0;
    for (let i = 0; i < nLines - 1; i++) {
      acc += expectedWindows[i];
      boundaries.push(first + Math.round((acc / scriptedSpan) * audioSpan));
    }
    boundaries.push(last);
  } else {
    boundaries = new Array(nLines + 1);
    boundaries[nLines] = last;
    let k = bestPrev;
    for (let j = nLines - 1; j >= 1; j--) {
      boundaries[j] = candidates[k].frame;
      k = back[j][k];
      if (k < 0) {
        boundaries[j] = boundaries[j] ?? last;
        break;
      }
    }
    boundaries[0] = first;
  }

  const segments = [];
  for (let i = 0; i < nLines; i++) segments.push({start: boundaries[i] * FRAME, end: boundaries[i + 1] * FRAME});
  return segments;
};

const trimSegment = (samples, start, end, thresholdDb = -40) => {
  const thresh = dbToAmp(thresholdDb);
  let s = start;
  let e = end;
  while (s < e) {
    let peak = 0;
    for (let i = s; i < Math.min(s + 64, e); i++) peak = Math.max(peak, Math.abs(samples[i]));
    if (peak > thresh) break;
    s += 64;
  }
  while (e > s) {
    let peak = 0;
    for (let i = Math.max(s, e - 64); i < e; i++) peak = Math.max(peak, Math.abs(samples[i]));
    if (peak > thresh) break;
    e -= 64;
  }
  // small padding so consonants are not clipped
  const pad = Math.floor(0.02 * SR);
  return {start: Math.max(start, s - pad), end: Math.min(end, e + pad)};
};

const rawLines = new Array(cues.length).fill(null);
const report = [];

for (const group of GROUPS) {
  const src = path.join(SRC_DIR, group.file);
  if (!fs.existsSync(src)) throw new Error(`Missing narration take: ${src}`);
  const wavPath = path.join(TMP, `${path.basename(group.file, '.mp3')}.wav`);
  decodeToWav(src, wavPath, {channels: 1, rate: SR});
  const {channels, sampleRate} = readWav(wavPath);
  if (sampleRate !== SR) throw new Error(`Unexpected sample rate ${sampleRate}`);
  const samples = channels[0];
  const expected = group.to - group.from;
  const windows = [];
  const words = [];
  for (let i = group.from; i < group.to; i++) {
    const nextStart = i === cues.length - 1 ? cues[i].end : cues[i + 1].start;
    windows.push(nextStart - cues[i].start);
    words.push((cues[i].text.match(/[A-Za-z0-9']+/g) || []).length);
  }
  const segments = splitSegments(samples, windows, words);
  console.log(`  ${group.file}: ${(samples.length / SR).toFixed(2)}s take -> ${expected} lines (scripted ${windows.reduce((a, b) => a + b, 0).toFixed(2)}s)`);

  for (let i = 0; i < expected; i++) {
    const cueIndex = group.from + i;
    const seg = segments[i];
    const trimmed = trimSegment(samples, seg.start, seg.end);
    const piece = samples.subarray(trimmed.start, trimmed.end);
    const lineWav = path.join(OUT_DIR, `line_${String(cueIndex).padStart(2, '0')}.wav`);
    writeWavMono(lineWav, piece);
    rawLines[cueIndex] = {file: lineWav, seconds: piece.length / SR};
  }
}

// Fit each line into its cue window (compress only when it would noticeably overrun).
const fitted = [];
for (const cue of cues) {
  const line = rawLines[cue.index];
  if (!line) throw new Error(`No audio for cue ${cue.index}`);
  const windowStart = cue.start;
  const nextStart = cue.index === cues.length - 1 ? cue.end : cues[cue.index + 1].start;
  const window = nextStart - windowStart;
  let file = line.file;
  let seconds = line.seconds;
  let factor = 1;
  // Only time-fit when the take would actually collide with the next line, and never by
  // more than 1.30x (beyond that the delivery starts to sound rushed).
  const needed = seconds / Math.max(0.5, window - 0.04);
  if (needed > 1.02) {
    factor = Math.min(1.3, needed);
    const compressed = path.join(TMP, `line_${String(cue.index).padStart(2, '0')}_fit.wav`);
    atempo(file, compressed, factor);
    file = compressed;
    seconds = readWav(compressed).frames / SR;
  }
  fitted.push({cueIndex: cue.index, file, seconds, factor, window, nextStart});
  report.push({cue: cue.index, start: cue.start, window: +window.toFixed(2), spoken: +seconds.toFixed(2), tempo: +factor.toFixed(3), overlap: +Math.max(0, seconds - window).toFixed(2), fits: seconds <= window + 0.12});
}

// Lay everything out on one timeline at the exact cue timestamps.
const totalSeconds = episode.durationInFrames / FPS;
const total = Math.ceil(totalSeconds * SR);
const mix = new Float32Array(total);
const timing = [];

for (const item of fitted) {
  const {channels} = readWav(item.file);
  const data = channels[0];
  const offset = Math.round(item.nextStart * 0 + item.cueIndex * 0); // placeholder for clarity
  const cue = cues[item.cueIndex];
  const startSample = Math.round(cue.start * FPS) * Math.floor(SR / FPS) + Math.round(((cue.start * FPS) % 1) * (SR / FPS));
  const begin = Math.max(0, Math.round(cue.start * SR));
  const fadeN = Math.floor(0.008 * SR);
  for (let i = 0; i < data.length; i++) {
    const idx = begin + i;
    if (idx >= total) break;
    let env = 1;
    if (i < fadeN) env = i / fadeN;
    if (i > data.length - fadeN) env = Math.max(0, (data.length - i) / fadeN);
    mix[idx] += data[i] * env;
  }
  timing.push({
    cueIndex: item.cueIndex,
    startFrame: Math.round(cue.start * FPS),
    endFrame: Math.round((cue.start + data.length / SR) * FPS),
    startSeconds: +(begin / SR).toFixed(3),
    durationSeconds: +(data.length / SR).toFixed(3),
    tempoApplied: +item.factor.toFixed(3),
    overrunsCue: data.length / SR > item.window + 0.05,
    unusedOffset: offset + startSample * 0,
  });
}

// Peak-normalise to -1 dBFS and write the final stem.
let peak = 0;
for (let i = 0; i < mix.length; i++) peak = Math.max(peak, Math.abs(mix[i]));
const gain = peak > 0 ? 0.891 / peak : 1;
const left = new Float32Array(total);
const right = new Float32Array(total);
for (let i = 0; i < total; i++) {
  left[i] = mix[i] * gain;
  right[i] = mix[i] * gain;
}
writeWavStereo(path.join(root, 'public/audio/narration.wav'), left, right);

const timingJson =
  JSON.stringify({generatedBy: 'scripts/build-narration.mjs', sampleRate: SR, peakGainDb: +(20 * Math.log10(gain)).toFixed(2), lines: timing}, null, 2) + '\n';
fs.writeFileSync(path.join(OUT_DIR, 'narration-timing.json'), timingJson);
// The composition imports this copy so the ducking envelope follows real speech,
// not just the scripted cue windows.
fs.writeFileSync(path.join(root, 'episode/narration-timing.json'), timingJson);

fs.rmSync(TMP, {recursive: true, force: true});

console.log('\ncue  start   window  spoken  tempo  overlap');
for (const r of report) {
  console.log(`${String(r.cue).padStart(3)}  ${r.start.toFixed(2).padStart(6)}  ${r.window.toFixed(2).padStart(6)}  ${r.spoken.toFixed(2).padStart(6)}  ${r.tempo.toFixed(3)}  ${r.overlap.toFixed(2)}`);
}
const overruns = report.filter((r) => !r.fits).length;
console.log(`\nlines: ${report.length}   overruns: ${overruns}   total stem: ${totalSeconds.toFixed(2)}s   peak gain: ${(20 * Math.log10(gain)).toFixed(1)} dB`);
console.log('wrote public/audio/narration.wav');
