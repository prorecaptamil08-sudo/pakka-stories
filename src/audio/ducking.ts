import type {Cue} from '../types';
import {smoothstep} from '../motion/anim';

export interface DuckWindow {
  startFrame: number;
  endFrame: number;
}

/**
 * Narration windows, in absolute composition frames.
 * Each cue's window is [cue start, next cue start) so the music stays ducked through the
 * natural tail of a line instead of popping back up between sentences.
 */
export const narrationWindows = (cues: Cue[], fps: number, totalFrames: number): DuckWindow[] =>
  cues.map((cue, i) => ({
    startFrame: Math.round(cue.start * fps),
    endFrame: i === cues.length - 1 ? Math.min(totalFrames, Math.round(cue.end * fps)) : Math.round(cues[i + 1].start * fps),
  }));

/** One line as measured by scripts/build-narration.mjs (episode/narration-timing.json). */
export interface NarrationTimingLine {
  cueIndex: number;
  startFrame: number;
  endFrame: number;
  durationSeconds: number;
}

/**
 * Narration windows derived from the measured speech instead of the cue grid, so the bed
 * only dips while a voice is actually sounding and breathes back up in the pauses
 * between sentences. Falls back to `narrationWindows` when a cue has no measurement.
 */
export const narrationWindowsFromTiming = (
  lines: NarrationTimingLine[],
  cues: Cue[],
  fps: number,
  totalFrames: number,
): DuckWindow[] => {
  const byCue = new Map(lines.map((line) => [line.cueIndex, line]));
  return cues.map((cue, i) => {
    const measured = byCue.get(i);
    const nextStart = i === cues.length - 1 ? Math.min(totalFrames, Math.round(cue.end * fps)) : Math.round(cues[i + 1].start * fps);
    if (!measured) {
      return {startFrame: Math.round(cue.start * fps), endFrame: nextStart};
    }
    // Keep a short tail so a plosive or the last consonant is not left unducked.
    const tail = Math.round(0.12 * fps);
    return {
      startFrame: Math.max(0, measured.startFrame),
      endFrame: Math.min(totalFrames, Math.max(measured.startFrame + 2, measured.endFrame + tail)),
    };
  });
};

/**
 * Sidechain-style gain envelope for the music bed.
 * duckDb = -9 => music sits 9 dB below its programmed level under narration, then eases
 * back up during the gaps (STYLE-PACK AUDIO-SYSTEM.md: "-9 dB sidechain ducking").
 */
export const makeDuckGain = (windows: DuckWindow[], duckDb: number, attack = 8, release = 16) => {
  const ducked = Math.pow(10, duckDb / 20);
  return (frame: number): number => {
    let amount = 0;
    for (const w of windows) {
      if (frame >= w.startFrame && frame <= w.endFrame) {
        amount = 1;
        break;
      }
      if (frame >= w.startFrame - attack && frame < w.startFrame) {
        amount = Math.max(amount, smoothstep(w.startFrame - attack, w.startFrame, frame));
      } else if (frame > w.endFrame && frame <= w.endFrame + release) {
        amount = Math.max(amount, 1 - smoothstep(w.endFrame, w.endFrame + release, frame));
      }
    }
    // linear interpolation in dB domain between 0 dB (open) and duckDb (ducked)
    return Math.pow(10, (duckDb * amount) / 20) * (ducked > 0 ? 1 : 1);
  };
};

/** Fraction of the timeline that is ducked - useful for the quality report. */
export const duckCoverage = (windows: DuckWindow[], totalFrames: number): number => {
  const covered = windows.reduce((sum, w) => sum + Math.max(0, w.endFrame - w.startFrame), 0);
  return Math.min(1, covered / totalFrames);
};
