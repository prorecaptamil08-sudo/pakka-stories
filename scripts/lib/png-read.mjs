import zlib from 'node:zlib';
import fs from 'node:fs';

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

/**
 * Minimal PNG reader for 8-bit non-interlaced RGB/RGBA images (what Remotion stills and
 * ffmpeg's image2 demuxer produce). Returns RGBA, row-major.
 */
export const readPng = (file) => {
  const buf = fs.readFileSync(file);
  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (data[12] !== 0) throw new Error(`${file}: interlaced PNG not supported`);
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(data));
    } else if (type === 'IEND') break;
    pos += 12 + len;
  }
  if (bitDepth !== 8) throw new Error(`${file}: only 8-bit PNG supported (got ${bitDepth})`);
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : 0;
  if (!channels) throw new Error(`${file}: unsupported colour type ${colorType}`);

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(stride * height);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const row = raw.subarray(rp, rp + stride);
    rp += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= channels ? prev[x - channels] : 0;
      let v = row[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      cur[x] = v & 0xff;
    }
  }

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, o = 0; i < width * height; i++, o += 4) {
    if (channels === 4) {
      rgba[o] = out[i * 4];
      rgba[o + 1] = out[i * 4 + 1];
      rgba[o + 2] = out[i * 4 + 2];
      rgba[o + 3] = out[i * 4 + 3];
    } else if (channels === 3) {
      rgba[o] = out[i * 3];
      rgba[o + 1] = out[i * 3 + 1];
      rgba[o + 2] = out[i * 3 + 2];
      rgba[o + 3] = 255;
    } else {
      const v = out[i];
      rgba[o] = v;
      rgba[o + 1] = v;
      rgba[o + 2] = v;
      rgba[o + 3] = 255;
    }
  }
  return {width, height, rgba};
};
