#!/usr/bin/env node
/**
 * Procedural SFX synthesiser (STYLE-PACK AUDIO-SYSTEM.md taxonomy).
 *
 * Renders every UI / foley cue used by episode.json to 44.1 kHz 16-bit mono WAV so the
 * Remotion project never depends on downloaded or copyrighted sound files.
 *
 * Usage: node scripts/generate-sfx-wavs.mjs public/audio/sfx
 */
import path from 'node:path';
import {SR, TAU, noiseGen, writeWavMono} from './lib/audio.mjs';

const outDir = process.argv[2] || 'public/audio/sfx';
const noise = noiseGen(20261104);

const env = (i, n, attack, decay) => {
  const t = i / SR;
  const a = attack <= 0 ? 1 : Math.min(1, t / attack);
  return a * Math.exp(-Math.max(0, t - attack) / decay);
};

const render = (seconds, fn) => {
  const n = Math.floor(seconds * SR);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = fn(i / SR, i, n);
  return out;
};

const cues = {
  /* ---- UI / infographic ---- */
  sfx_badge_pop: () =>
    render(0.16, (t) => {
      const f = 260 + 300 * Math.min(1, t / 0.055);
      return Math.sin(TAU * f * t) * Math.exp(-t * 26) * 0.62;
    }),
  sfx_counter_tick: () =>
    render(0.06, (t) => {
      const click = Math.sin(TAU * 1500 * t) * Math.exp(-t * 120);
      const body = Math.sin(TAU * 620 * t) * Math.exp(-t * 60) * 0.4;
      return (click + body) * 0.55;
    }),
  sfx_bubble_pop: () =>
    render(0.14, (t) => {
      const f = 430 + 500 * Math.min(1, t / 0.05);
      return (Math.sin(TAU * f * t) * Math.exp(-t * 30) + noise() * 0.05 * Math.exp(-t * 80)) * 0.6;
    }),
  sfx_marker: () =>
    render(0.16, (t) => {
      const thump = Math.sin(TAU * 210 * t) * Math.exp(-t * 34);
      const tick = Math.sin(TAU * 2100 * t) * Math.exp(-t * 160) * 0.5;
      return (thump + tick) * 0.55;
    }),
  sfx_sparkle: () => {
    const notes = [1568, 1976, 2349, 3136];
    return render(0.7, (t) => {
      let s = 0;
      notes.forEach((f, i) => {
        const start = i * 0.055;
        if (t >= start) {
          const dt = t - start;
          s += Math.sin(TAU * f * dt) * Math.exp(-dt * 7) * 0.25;
        }
      });
      return s;
    });
  },
  sfx_gear: () =>
    render(0.55, (t) => {
      const teeth = Math.pow(Math.max(0, Math.sin(TAU * 13 * t)), 6);
      const body = Math.sin(TAU * 130 * t) * 0.35;
      const rattle = noise() * teeth * 0.35;
      return (body + rattle) * Math.exp(-t * 3.2) * 0.7;
    }),
  sfx_thud: () =>
    render(0.3, (t) => {
      const f = 110 * Math.exp(-t * 6) + 48;
      return (Math.sin(TAU * f * t) * Math.exp(-t * 14) + noise() * 0.12 * Math.exp(-t * 40)) * 0.85;
    }),
  sfx_heart_thud: () =>
    render(0.55, (t) => {
      const hit = (start, amp) => {
        const dt = t - start;
        if (dt < 0) return 0;
        const f = 72 * Math.exp(-dt * 5) + 38;
        return Math.sin(TAU * f * dt) * Math.exp(-dt * 13) * amp;
      };
      return (hit(0, 0.9) + hit(0.2, 0.55)) * 0.9;
    }),
  sfx_magnify: () =>
    render(0.36, (t) => {
      const f = 900 - 460 * Math.min(1, t / 0.3);
      const tone = Math.sin(TAU * f * t) * 0.22;
      const air = noise() * 0.12 * Math.sin((Math.PI * t) / 0.36);
      return (tone + air) * Math.exp(-t * 2.2);
    }),
  sfx_whoosh: () =>
    render(0.6, (t) => {
      const p = t / 0.6;
      const swell = Math.sin(Math.PI * Math.min(1, p));
      // crude one-pole low-pass with opening cutoff
      return noise() * swell * 0.22 * (0.4 + 0.6 * Math.sin(Math.PI * p));
    }),
  sfx_riser: () =>
    render(0.95, (t) => {
      const p = Math.min(1, t / 0.95);
      const f = 180 * Math.pow(5, p);
      const tone = Math.sin(TAU * f * t) * 0.18 * p;
      const air = noise() * 0.1 * p * p;
      return (tone + air) * (1 - Math.exp(-t * 6));
    }),

  /* ---- foley ---- */
  sfx_page_turn: () =>
    render(0.4, (t) => {
      const p = t / 0.4;
      const crinkle = noise() * (Math.sin(Math.PI * p) ** 1.5) * 0.3;
      const flutter = Math.sin(TAU * 38 * t) * 0.03;
      return crinkle + flutter;
    }),
  sfx_chalk_write: () =>
    render(0.42, (t) => {
      const p = t / 0.42;
      const stroke = 0.55 + 0.45 * Math.sin(TAU * 5.5 * t);
      const hf = noise() - noise() * 0.5;
      const grit = hf * Math.sin(Math.PI * p) * stroke * 0.16;
      const body = Math.sin(TAU * 900 * t) * 0.015;
      return grit + body;
    }),
  sfx_phone_buzz: () =>
    render(0.42, (t) => {
      const buzz = Math.sin(TAU * 168 * t) * (0.55 + 0.45 * Math.sin(TAU * 26 * t));
      return buzz * Math.min(1, t / 0.02) * Math.exp(-t * 2.6) * 0.4;
    }),
  sfx_phone_ping: () =>
    render(0.55, (t) => {
      const a = Math.sin(TAU * 1046 * t) * Math.exp(-t * 7) * 0.24;
      const b = Math.sin(TAU * 1568 * t) * Math.exp(-t * 5) * 0.14;
      return a + b;
    }),
  sfx_wood_block_clack: () =>
    render(0.13, (t) => {
      const s = Math.sin(TAU * 680 * t) + 0.5 * Math.sin(TAU * 1120 * t);
      return s * Math.exp(-t * 45) * 0.5;
    }),
};

let count = 0;
for (const [name, fn] of Object.entries(cues)) {
  const samples = fn();
  // 4 ms fade in / out to guarantee click-free playback
  const fade = Math.floor(0.004 * SR);
  for (let i = 0; i < fade && i < samples.length; i++) {
    samples[i] *= i / fade;
    samples[samples.length - 1 - i] *= i / fade;
  }
  writeWavMono(path.join(outDir, `${name}.wav`), samples);
  count += 1;
  console.log(`  ${name}.wav  ${(samples.length / SR).toFixed(2)}s`);
}
console.log(`Synthesised ${count} SFX files in ${outDir}`);
