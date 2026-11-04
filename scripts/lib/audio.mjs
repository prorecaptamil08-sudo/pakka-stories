import fs from 'node:fs';
import path from 'node:path';

export const SR = 44100;

export const clampSample = (x) => (x > 1 ? 1 : x < -1 ? -1 : x);

/** 16-bit PCM mono WAV. */
export function writeWavMono(filePath, samples, sampleRate = SR) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(clampSample(samples[i]) * 32767), 44 + i * 2);
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, buf);
  return filePath;
}

/** 16-bit PCM stereo WAV. */
export function writeWavStereo(filePath, left, right, sampleRate = SR) {
  const n = left.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(clampSample(left[i]) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(clampSample(right[i]) * 32767), 44 + i * 4 + 2);
  }
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, buf);
  return filePath;
}

/** Reads a 16-bit PCM WAV (mono or stereo, any common rate) into per-channel Float32 arrays. */
export function readWav(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.toString('ascii', 0, 4) !== 'RIFF') throw new Error(`${filePath}: not a RIFF file`);
  const channels = buf.readUInt16LE(22);
  const sampleRate = buf.readUInt32LE(24);
  const bits = buf.readUInt16LE(34);
  if (bits !== 16) throw new Error(`${filePath}: expected 16-bit PCM, got ${bits}`);
  // locate data chunk
  let offset = 12;
  let dataOffset = 44;
  let dataLen = buf.length - 44;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === 'data') {
      dataOffset = offset + 8;
      dataLen = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  const frames = Math.floor(dataLen / (2 * channels));
  const chans = Array.from({length: channels}, () => new Float32Array(frames));
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      chans[c][i] = buf.readInt16LE(dataOffset + (i * channels + c) * 2) / 32768;
    }
  }
  return {channels: chans, sampleRate, frames};
}

export const noteHz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

/** Deterministic PRNG so generated audio is reproducible byte-for-byte. */
export function lcg(seed = 12345) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export const noiseGen = (seed = 99) => {
  const rnd = lcg(seed);
  return () => rnd() * 2 - 1;
};

export const TAU = Math.PI * 2;
