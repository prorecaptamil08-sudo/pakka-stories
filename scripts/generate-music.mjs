#!/usr/bin/env node
/**
 * Original procedural score (5 movements) for the episode.
 *
 * Everything is synthesised from scratch here - no sampled or licensed music:
 *   Mvt 1  0:00-0:48   Quirky curiosity   108 BPM  marimba arpeggios, pluck bass, shaker
 *   Mvt 2  0:48-1:15   Tension and relief  96 BPM  warm pad, rhodes, soft kick
 *   Mvt 3  1:15-1:35   Doubt and distance  84 BPM  minor piano ostinato, sub pulse
 *   Mvt 4  1:35-1:53   Clarity            100 BPM  marimba + cello pad + rising piano
 *   Mvt 5  1:53-2:07   Resolution / outro  88 BPM  rhodes, brushed shaker, resolved cadence
 *
 * Usage: node scripts/generate-music.mjs public/audio/music
 */
import path from 'node:path';
import {SR, TAU, lcg, noteHz, writeWavStereo} from './lib/audio.mjs';

const outDir = process.argv[2] || 'public/audio/music';
const FPS = 30;
const BODY_FRAMES = 3733;

/* ------------------------------- voices ------------------------------- */
const addPluck = (L, R, start, seconds, midi, gain = 0.26, pan = -0.25) => {
  const f = noteHz(midi);
  const n = Math.floor(seconds * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = Math.exp(-t * 5.2) * Math.min(1, t / 0.004);
    const v = (Math.sin(TAU * f * t) + 0.38 * Math.sin(TAU * 2 * f * t) + 0.16 * Math.sin(TAU * 3.01 * f * t)) * e * gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v * (1 - Math.max(0, pan));
      R[idx] += v * (1 + Math.min(0, pan));
    }
  }
};

const addPiano = (L, R, start, seconds, midi, gain = 0.22, pan = 0) => {
  const f = noteHz(midi);
  const n = Math.floor(seconds * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = Math.exp(-t * 2.1) * Math.min(1, t / 0.012);
    const v =
      (Math.sin(TAU * f * t) * 0.6 +
        0.26 * Math.sin(TAU * 2 * f * t) * Math.exp(-t * 0.8) +
        0.12 * Math.sin(TAU * 3.02 * f * t) * Math.exp(-t * 1.6) +
        0.06 * Math.sin(TAU * 4.06 * f * t) * Math.exp(-t * 2.4)) *
      e *
      gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v * (1 - Math.max(0, pan));
      R[idx] += v * (1 + Math.min(0, pan));
    }
  }
};

const addRhodes = (L, R, start, seconds, midi, gain = 0.2, pan = 0.2) => {
  const f = noteHz(midi);
  const n = Math.floor(seconds * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const trem = 1 + 0.08 * Math.sin(TAU * 4.5 * t);
    const e = Math.exp(-t * 1.25) * Math.min(1, t / 0.03);
    const v = (Math.sin(TAU * f * t) + 0.3 * Math.sin(TAU * 2 * f * t)) * e * trem * gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v * (1 - Math.max(0, pan));
      R[idx] += v * (1 + Math.min(0, pan));
    }
  }
};

const addPad = (L, R, start, seconds, midis, gain = 0.1) => {
  const n = Math.floor(seconds * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const attack = Math.min(1, t / 1.1);
    const release = Math.min(1, (seconds - t) / 1.2);
    const e = attack * Math.max(0, release);
    let v = 0;
    for (const m of midis) {
      const f = noteHz(m);
      v += Math.sin(TAU * f * t) * 0.5 + Math.sin(TAU * (f * 1.002) * t) * 0.3 + Math.sin(TAU * (f * 0.998) * t) * 0.3;
    }
    v = (v / Math.max(1, midis.length)) * e * gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v * 0.5;
      R[idx] += v * 0.5;
    }
  }
};

const addBass = (L, R, start, seconds, midi, gain = 0.32) => {
  const f = noteHz(midi);
  const n = Math.floor(seconds * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = Math.exp(-t * 1.6) * Math.min(1, t / 0.02);
    const v = (Math.sin(TAU * f * t) + 0.12 * Math.sin(TAU * 2 * f * t)) * e * gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v;
      R[idx] += v;
    }
  }
};

const addShaker = (L, R, start, gain = 0.1, pan = 0.45) => {
  const n = Math.floor(0.07 * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const e = Math.exp(-t * 55);
    const v = (Math.random() * 2 - 1) * e * gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v * (1 - Math.max(0, pan));
      R[idx] += v * (1 + Math.min(0, pan));
    }
  }
};

const addKick = (L, R, start, gain = 0.3) => {
  const n = Math.floor(0.3 * SR);
  const s0 = Math.floor(start * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 52 + 90 * Math.exp(-t * 22);
    const v = Math.sin(TAU * f * t) * Math.exp(-t * 9) * gain;
    const idx = s0 + i;
    if (idx < L.length) {
      L[idx] += v;
      R[idx] += v;
    }
  }
};

/* ------------------------------- reverb ------------------------------- */
const reverb = (input, wet = 0.2) => {
  const combs = [1116, 1188, 1277, 1356];
  const out = new Float32Array(input.length);
  const combBufs = combs.map(() => new Float32Array(16000));
  for (let i = 0; i < input.length; i++) {
    let acc = 0;
    for (let c = 0; c < combs.length; c++) {
      const buf = combBufs[c];
      const idx = i % buf.length;
      const delayed = buf[idx];
      acc += delayed;
      buf[idx] = input[i] + delayed * 0.76;
    }
    out[i] = acc / combs.length;
  }
  // simple allpass diffusion
  for (const d of [225, 556]) {
    const buf = new Float32Array(d);
    let idx = 0;
    for (let i = 0; i < out.length; i++) {
      const delayed = buf[idx];
      const x = out[i];
      buf[idx] = x + delayed * 0.5;
      out[i] = delayed - x * 0.5;
      idx = (idx + 1) % d;
    }
  }
  const mixed = new Float32Array(input.length);
  for (let i = 0; i < input.length; i++) mixed[i] = input[i] * (1 - wet) + out[i] * wet;
  return mixed;
};

/* ------------------------------- score -------------------------------- */
// Chords as MIDI note arrays (A minor / C major family, F Lydian tinge on movement 4).
const M1 = [
  [57, 60, 64, 67], // Am7
  [53, 57, 60, 64], // Fmaj7
  [48, 52, 55, 59], // Cmaj7
  [55, 59, 62, 65], // G7
];
const M2 = [
  [53, 57, 60, 64], // Fmaj7
  [48, 52, 55, 59], // Cmaj7
  [57, 60, 64, 67], // Am7
  [55, 59, 62, 65], // G7
];
const M3 = [
  [45, 48, 52, 55], // Am
  [41, 45, 48, 52], // F
  [50, 53, 57, 60], // Dm
  [40, 44, 47, 50], // E7
];
const M4 = [
  [48, 52, 55, 59], // Cmaj7
  [55, 59, 62, 66], // G
  [57, 60, 64, 67], // Am7
  [53, 57, 60, 64], // Fmaj7
];
const M5 = [
  [53, 57, 60, 64], // Fmaj7
  [48, 52, 55, 59], // Cmaj7
  [55, 59, 62, 65], // G7
  [48, 52, 55, 60], // C
];

const scale = [60, 62, 64, 67, 69, 72, 74, 76]; // C major pentatonic-ish

const build = ({seconds, bpm, chords, style, seed}) => {
  const n = Math.ceil(seconds * SR);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const rnd = lcg(seed);
  const beat = 60 / bpm;
  const bar = beat * 4;
  const bars = Math.ceil(seconds / bar);

  for (let b = 0; b < bars; b++) {
    const t0 = b * bar;
    if (t0 >= seconds) break;
    const chord = chords[b % chords.length];

    if (style === 'curiosity' || style === 'clarity') {
      addPad(L, R, t0, Math.min(bar * 1.02, seconds - t0), chord.map((m) => m + 12), 0.075);
      addBass(L, R, t0, beat * 1.6, chord[0] - 24, 0.26);
      addBass(L, R, t0 + beat * 2, beat * 1.4, chord[0] - 24 + (style === 'clarity' ? 7 : 0), 0.2);
      // marimba 8th-note arpeggio
      const steps = 8;
      for (let s = 0; s < steps; s++) {
        const note = chord[s % chord.length] + (s >= 4 ? 12 : 0);
        addPluck(L, R, t0 + (s * bar) / steps, 0.55, note, 0.17 + (s % 2 ? 0 : 0.04), -0.3);
      }
      if (style === 'clarity') {
        for (let s = 0; s < 4; s++) addPiano(L, R, t0 + (s * bar) / 4, 1.4, chord[s % chord.length] + 12, 0.09, 0.2);
      }
      // percussion
      addKick(L, R, t0, 0.2);
      if (style === 'curiosity') {
        addShaker(L, R, t0 + beat * 1.5, 0.07);
        addShaker(L, R, t0 + beat * 3.5, 0.06);
      }
      // sparse melody
      if (rnd() > 0.45) {
        const mi = Math.floor(rnd() * scale.length);
        addPiano(L, R, t0 + beat * (rnd() > 0.5 ? 1 : 2.5), 1.1, scale[mi] + 12, 0.075, 0.1);
      }
    } else if (style === 'relief') {
      addPad(L, R, t0, Math.min(bar * 1.05, seconds - t0), chord.map((m) => m + 12), 0.085);
      addBass(L, R, t0, beat * 2, chord[0] - 24, 0.2);
      for (let s = 0; s < 4; s++) {
        addRhodes(L, R, t0 + (s * bar) / 4, 1.6, chord[s % chord.length] + 12, 0.135, 0.25);
      }
      addKick(L, R, t0 + beat * 2, 0.14);
      if (rnd() > 0.5) addPluck(L, R, t0 + beat * 3, 0.7, chord[1] + 24, 0.08, -0.2);
    } else if (style === 'doubt') {
      addPad(L, R, t0, Math.min(bar * 1.02, seconds - t0), chord.map((m) => m - 12), 0.1);
      // pulsing sub
      for (let s = 0; s < 4; s++) addBass(L, R, t0 + s * beat, beat * 0.7, chord[0] - 24, 0.24);
      // minor piano ostinato 16ths (low, sparse)
      const pattern = [0, 2, 1, 3, 2, 0, 3, 1];
      for (let s = 0; s < 8; s++) {
        addPiano(L, R, t0 + (s * bar) / 8, 0.9, chord[pattern[s]] - 12, 0.085, -0.15);
      }
      if (rnd() > 0.6) addPluck(L, R, t0 + beat * 2.5, 0.9, chord[2] + 24, 0.07, 0.35);
    } else if (style === 'outro') {
      addPad(L, R, t0, Math.min(bar * 1.1, seconds - t0), chord.map((m) => m + 12), 0.08);
      addRhodes(L, R, t0, bar * 0.95, chord[0] + 12, 0.13, 0.2);
      addRhodes(L, R, t0 + beat * 2, bar * 0.5, chord[2] + 12, 0.1, -0.15);
      addBass(L, R, t0, beat * 2.2, chord[0] - 24, 0.22);
      addShaker(L, R, t0 + beat * 1.5, 0.05);
      addShaker(L, R, t0 + beat * 3.5, 0.045);
      if (rnd() > 0.5) addPluck(L, R, t0 + beat * 2.5, 0.8, chord[3] + 12, 0.075, -0.2);
    }
  }

  const dryL = L;
  const dryR = R;
  const wetL = reverb(L, 0.22);
  const wetR = reverb(R, 0.22);
  const len = Math.floor(seconds * SR);

  // mix + normalise
  let peak = 1e-6;
  for (let i = 0; i < len; i++) {
    dryL[i] = dryL[i] * 0.82 + wetL[i] * 0.18;
    dryR[i] = dryR[i] * 0.82 + wetR[i] * 0.18;
    peak = Math.max(peak, Math.abs(dryL[i]), Math.abs(dryR[i]));
  }
  const target = 0.85;
  const g = target / peak;
  const fade = Math.floor(0.35 * SR);
  const tail = Math.floor(Math.min(1.2, seconds * 0.15) * SR);
  const outL = new Float32Array(len);
  const outR = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    let envv = 1;
    if (i < fade) envv = i / fade;
    if (i > len - tail) envv = Math.min(envv, (len - i) / tail);
    outL[i] = dryL[i] * g * envv;
    outR[i] = dryR[i] * g * envv;
  }
  return {L: outL, R: outR, peak: peak * g, seconds};
};

const movements = [
  {id: 'mvt1_curiosity', seconds: 1442 / FPS, bpm: 108, chords: M1, style: 'curiosity', seed: 11},
  {id: 'mvt2_relief', seconds: (2264 - 1442) / FPS, bpm: 96, chords: M2, style: 'relief', seed: 23},
  {id: 'mvt3_doubt', seconds: (2861 - 2264) / FPS, bpm: 84, chords: M3, style: 'doubt', seed: 37},
  {id: 'mvt4_clarity', seconds: (3399 - 2861) / FPS, bpm: 100, chords: M4, style: 'clarity', seed: 41},
  {id: 'mvt5_outro', seconds: (3823 - 3399) / FPS, bpm: 88, chords: M5, style: 'outro', seed: 59},
];

for (const mv of movements) {
  const {L, R} = build(mv);
  const file = path.join(outDir, `${mv.id}.wav`);
  writeWavStereo(file, L, R);
  console.log(`${mv.id}.wav  ${mv.seconds.toFixed(2)}s  ${mv.bpm} BPM  (${mv.style})`);
}
console.log(`Body duration check: ${(BODY_FRAMES / FPS).toFixed(2)}s body + outro to ${(3823 / FPS).toFixed(2)}s`);
