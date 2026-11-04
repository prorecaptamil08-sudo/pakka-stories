#!/usr/bin/env node
/**
 * Episode validator - every claim made in REPORT.md is produced here.
 *
 *   node scripts/validate-episode.mjs
 *
 * Exits 1 if any check fails. Prints one PASS/FAIL line per assertion so the report can
 * quote the exact output.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {ffprobePath} from './lib/ffmpeg.mjs';
import {readWav} from './lib/audio.mjs';

const root = process.cwd();
const results = [];
const check = (name, condition, detail = '') => {
  results.push({name, ok: Boolean(condition), detail});
  return Boolean(condition);
};
const fmt = (n, d = 2) => Number(n).toFixed(d);

/* ------------------------------------------------------------------ *
 * 1. episode.json contract
 * ------------------------------------------------------------------ */
const episode = JSON.parse(fs.readFileSync(path.join(root, 'episode/episode.json'), 'utf8'));
const {fps} = episode;

const BODY_FRAMES = 3733;
const OUTRO_FRAMES = 90;
const TOTAL_FRAMES = 3823;

check('fps is 30', episode.fps === 30, `fps=${episode.fps}`);
check('resolution is 1920x1080', episode.width === 1920 && episode.height === 1080, `${episode.width}x${episode.height}`);
check('subtitles disabled', episode.subtitles === false, `subtitles=${episode.subtitles}`);
check('body duration is 3733 frames', episode.bodyDurationInFrames === BODY_FRAMES, `${episode.bodyDurationInFrames}`);
check('outro duration is 90 frames (3.0 s)', episode.outroDurationInFrames === OUTRO_FRAMES, `${episode.outroDurationInFrames}`);
check(
  'total duration is 3823 frames',
  episode.durationInFrames === TOTAL_FRAMES,
  `${episode.durationInFrames} (${fmt(episode.durationInFrames / fps)} s)`,
);

/* ------------------------------------------------------------------ *
 * 2. the 28 scripted cues are unchanged
 * ------------------------------------------------------------------ */
const scriptLines = fs
  .readFileSync(path.join(root, 'episode/script.txt'), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => /^\[\s*[\d.]+-\s*[\d.]+\]/.test(line))
  .map((line) => {
    const m = line.match(/^\[\s*([\d.]+)-\s*([\d.]+)\]\s*(.*)$/);
    return {start: Number(m[1]), end: Number(m[2]), text: m[3]};
  });

check('script.txt holds 28 timestamped lines', scriptLines.length === 28, `${scriptLines.length}`);
check('episode.json holds 28 cues', episode.cues.length === 28, `${episode.cues.length}`);

const cueMismatch = episode.cues.filter((cue, i) => {
  const s = scriptLines[i];
  return !s || Math.abs(s.start - cue.start) > 0.005 || Math.abs(s.end - cue.end) > 0.005 || s.text !== cue.text;
});
check(
  'cue timestamps + text match script.txt verbatim',
  cueMismatch.length === 0,
  cueMismatch.length ? `${cueMismatch.length} mismatched (first cue ${cueMismatch[0].index})` : '28/28 identical',
);

const monotonic = episode.cues.every((cue, i) => i === 0 || cue.start >= episode.cues[i - 1].end - 1e-6);
check('cues are contiguous and monotonic', monotonic);

/* ------------------------------------------------------------------ *
 * 3. scene coverage
 * ------------------------------------------------------------------ */
const bodyScenes = episode.scenes.filter((s) => s.kind !== 'outro');
const outroScenes = episode.scenes.filter((s) => s.kind === 'outro');
check('24 scenes = 23 body + 1 outro', bodyScenes.length === 23 && outroScenes.length === 1, `${bodyScenes.length}+${outroScenes.length}`);
check('exactly one separate outro segment', outroScenes.length === 1 && outroScenes[0].durationInFrames === OUTRO_FRAMES, outroScenes[0]?.id ?? 'none');

let cursor = 0;
let gaps = 0;
for (const scene of episode.scenes) {
  if (scene.startFrame !== cursor) gaps++;
  cursor = scene.startFrame + scene.durationInFrames;
}
check('scenes tile the timeline with no gap or overlap', gaps === 0 && cursor === TOTAL_FRAMES, `ends at ${cursor}`);
check('outro starts at frame 3733', outroScenes[0]?.startFrame === BODY_FRAMES, `${outroScenes[0]?.startFrame}`);

const coveredCues = new Set(episode.scenes.flatMap((s) => s.narrationCues ?? []));
check('every cue is claimed by a scene', coveredCues.size === 28, `${coveredCues.size}/28`);

/* ------------------------------------------------------------------ *
 * 4. assets on disk
 * ------------------------------------------------------------------ */
const sfxNames = new Set(episode.scenes.flatMap((s) => (s.sfxCues ?? []).map((c) => c.cue)));
const sfxCueCount = episode.scenes.reduce((n, s) => n + (s.sfxCues ?? []).length, 0);
const missingSfx = [...sfxNames].filter((name) => !fs.existsSync(path.join(root, 'public/audio/sfx', `${name}.wav`)));
check('all referenced SFX files exist', missingSfx.length === 0, `${sfxNames.size} distinct cues / ${sfxCueCount} placements${missingSfx.length ? ` missing: ${missingSfx.join(', ')}` : ''}`);

const badSfxOffsets = episode.scenes.flatMap((s) => (s.sfxCues ?? []).filter((c) => c.frameOffset < 0 || c.frameOffset >= s.durationInFrames).map(() => s.id));
check('SFX offsets stay inside their scene', badSfxOffsets.length === 0, badSfxOffsets.length ? badSfxOffsets.join(', ') : `${sfxCueCount} placements in range`);

const missingMusic = episode.audio.musicTracks.filter((t) => !fs.existsSync(path.join(root, 'public', t.src)));
check('all music movements exist', missingMusic.length === 0, missingMusic.map((t) => t.src).join(', ') || `${episode.audio.musicTracks.length} files`);

const musicOrder = episode.audio.musicTracks.every(
  (t, i, all) => t.startFrame === (i === 0 ? 0 : all[i - 1].endFrame),
) && episode.audio.musicTracks.at(-1).endFrame === TOTAL_FRAMES;
check('music movements tile 0 -> 3823 with no gap', musicOrder, episode.audio.musicTracks.map((t) => `${t.startFrame}-${t.endFrame}`).join(' '));

check('narration stem exists', fs.existsSync(path.join(root, 'public', episode.audio.narrationFile)), episode.audio.narrationFile);
check('music ducking is -9 dB', episode.audio.musicDuckDb === -9, `${episode.audio.musicDuckDb} dB`);

const fontDir = path.join(root, 'public/fonts');
const fonts = fs.existsSync(fontDir) ? fs.readdirSync(fontDir).filter((f) => f.endsWith('.woff2')) : [];
check('local woff2 fonts present', fonts.length >= 8, `${fonts.length} files`);

/* ------------------------------------------------------------------ *
 * 5. measured audio
 * ------------------------------------------------------------------ */
const narration = readWav(path.join(root, 'public', episode.audio.narrationFile));
const narSeconds = narration.frames / narration.sampleRate;
let narPeak = 0;
for (const channel of narration.channels) for (const v of channel) narPeak = Math.max(narPeak, Math.abs(v));
check(
  'narration stem length matches 3823 frames',
  Math.abs(narSeconds - TOTAL_FRAMES / fps) < 0.02,
  `${fmt(narSeconds)} s vs ${fmt(TOTAL_FRAMES / fps)} s`,
);
check(
  'narration peak below -0.2 dBFS (no clipping)',
  20 * Math.log10(narPeak) < -0.2,
  `${fmt(20 * Math.log10(narPeak), 2)} dBFS peak`,
);

const timing = JSON.parse(fs.readFileSync(path.join(root, 'episode/narration-timing.json'), 'utf8'));
check('narration timing has 28 measured lines', timing.lines.length === 28, `${timing.lines.length}`);

const drift = timing.lines.filter((line, i) => Math.abs(line.startFrame - Math.round(episode.cues[i].start * fps)) > 1);
check('every line starts on its cue frame', drift.length === 0, drift.length ? drift.map((l) => l.cueIndex).join(', ') : 'max drift <= 1 frame');

const overlaps = timing.lines.map((line, i) => {
  const next = i === timing.lines.length - 1 ? TOTAL_FRAMES : Math.round(episode.cues[i + 1].start * fps);
  return {cue: i, overlap: line.endFrame - next};
});
const worst = overlaps.reduce((a, b) => (b.overlap > a.overlap ? b : a));
check('no line runs more than 0.35 s into the next cue', worst.overlap <= Math.round(0.35 * fps), `worst cue ${worst.cue}: ${worst.overlap} frames`);

const rates = episode.cues.map((cue, i) => {
  const words = cue.text.split(/\s+/).filter(Boolean).length;
  return {cue: i, wps: words / timing.lines[i].durationSeconds};
});
const offPace = rates.filter((r) => r.wps < 1.4 || r.wps > 4.8);
check(
  'delivery rate is plausible on every line (1.4-4.8 words/s)',
  offPace.length === 0,
  offPace.length ? offPace.map((r) => `cue ${r.cue} ${fmt(r.wps)} w/s`).join(', ') : `${fmt(Math.min(...rates.map((r) => r.wps)))}-${fmt(Math.max(...rates.map((r) => r.wps)))} w/s`,
);

const ducked = timing.lines.map((line) => ({start: line.startFrame, end: line.endFrame + Math.round(0.12 * fps)}));
const duckedFrames = ducked.reduce((sum, w) => sum + (w.end - w.start), 0);
check('music is ducked only under speech', duckedFrames < TOTAL_FRAMES, `${fmt(((duckedFrames / TOTAL_FRAMES) * 100), 1)}% of the runtime`);

const probe = (file) => {
  try {
    return Number(
      execFileSync(ffprobePath, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {
        encoding: 'utf8',
      }).trim(),
    );
  } catch {
    return NaN;
  }
};
const musicDurations = episode.audio.musicTracks.map((t) => ({id: t.id, duration: probe(path.join(root, 'public', t.src)), window: (t.endFrame - t.startFrame) / fps}));
const shortMusic = musicDurations.filter((m) => !(m.duration >= m.window - 0.02));
check(
  'each music movement is at least as long as its frame window',
  shortMusic.length === 0,
  shortMusic.length ? shortMusic.map((m) => `${m.id} ${fmt(m.duration)}s<${fmt(m.window)}s`).join(', ') : musicDurations.map((m) => `${m.id} ${fmt(m.duration, 1)}s`).join(' '),
);

/* ------------------------------------------------------------------ *
 * 6. summary
 * ------------------------------------------------------------------ */
const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  [${r.detail}]` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log('\nFAILED:\n' + failed.map((f) => ` - ${f.name}`).join('\n'));
  process.exit(1);
}
