#!/usr/bin/env node
/**
 * Builds a labelled contact sheet from rendered stills so a whole act can be reviewed in
 * one image.
 *
 * Usage: node scripts/contact-sheet.mjs <out.png> <cols> <tileWidth> <frame1> <frame2> ...
 */
import fs from 'node:fs';
import {readPng} from './lib/png-read.mjs';
import {writePng, drawText} from './lib/png.mjs';

const [outPath, colsArg, tileWArg, ...frameArgs] = process.argv.slice(2);
const cols = Number(colsArg) || 3;
const tileW = Number(tileWArg) || 640;

const frames = frameArgs.map((f) => (f.endsWith('.png') ? f : `out/frames/f${f}.png`));
const images = frames.map((f) => ({file: f, ...readPng(f)}));
const tileH = Math.round((images[0].height / images[0].width) * tileW);
const rows = Math.ceil(images.length / cols);
const W = cols * tileW;
const H = rows * tileH;

const rgb = Buffer.alloc(W * H * 3);
images.forEach((img, i) => {
  const cx = (i % cols) * tileW;
  const cy = Math.floor(i / cols) * tileH;
  const sx = img.width / tileW;
  const sy = img.height / tileH;
  for (let y = 0; y < tileH; y++) {
    for (let x = 0; x < tileW; x++) {
      // box-filter downsample so thin chalk lines stay visible
      let r = 0;
      let g = 0;
      let b = 0;
      let n = 0;
      for (let dy = 0; dy < Math.max(1, Math.floor(sy)); dy++) {
        for (let dx = 0; dx < Math.max(1, Math.floor(sx)); dx++) {
          const px = Math.min(img.width - 1, Math.floor(x * sx) + dx);
          const py = Math.min(img.height - 1, Math.floor(y * sy) + dy);
          const o = (py * img.width + px) * 4;
          r += img.rgba[o];
          g += img.rgba[o + 1];
          b += img.rgba[o + 2];
          n++;
        }
      }
      const o = ((cy + y) * W + cx + x) * 3;
      rgb[o] = r / n;
      rgb[o + 1] = g / n;
      rgb[o + 2] = b / n;
    }
  }
  const label = (img.file.match(/f(\d+)\.png$/) || [, img.file])[1];
  drawText(rgb, W, H, cx + 8, cy + 8, `${label}`, [255, 255, 0], 2);
});

writePng(outPath, W, H, rgb);
console.log(`wrote ${outPath} (${W}x${H}, ${images.length} frames)`);
