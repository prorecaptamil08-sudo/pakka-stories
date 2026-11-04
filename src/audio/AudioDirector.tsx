import React, {useMemo} from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import type {Cue, EpisodeAudio, Scene} from '../types';
import {makeDuckGain, narrationWindows, narrationWindowsFromTiming, type NarrationTimingLine} from './ducking';

/**
 * Three-layer soundtrack (STYLE-PACK AUDIO-SYSTEM.md):
 *   1. narration  - a pre-mixed voice-over stem already aligned to the cue timestamps
 *   2. music      - five score movements, sidechain-ducked -9 dB under every spoken line
 *   3. sfx        - frame-synchronised UI / foley cues declared per scene
 */
export const AudioDirector: React.FC<{
  audio?: EpisodeAudio;
  cues?: Cue[];
  scenes?: Scene[];
  narrationTiming?: NarrationTimingLine[];
}> = ({audio, cues = [], scenes = [], narrationTiming}) => {
  const {fps, durationInFrames} = useVideoConfig();

  const duckGain = useMemo(() => {
    const windows =
      narrationTiming && narrationTiming.length > 0
        ? narrationWindowsFromTiming(narrationTiming, cues, fps, durationInFrames)
        : narrationWindows(cues, fps, durationInFrames);
    return makeDuckGain(windows, audio?.musicDuckDb ?? -9);
  }, [audio?.musicDuckDb, cues, durationInFrames, fps, narrationTiming]);

  if (!audio) return null;

  return (
    <>
      {/* 1. Narration stem */}
      {audio.narrationFile ? (
        <Audio src={staticFile(audio.narrationFile)} volume={audio.narrationGain ?? 1} />
      ) : null}

      {/* 2. Ducked score movements */}
      {(audio.musicTracks ?? []).map((track) => {
        const length = Math.max(1, track.endFrame - track.startFrame);
        return (
          <Sequence key={track.id} from={track.startFrame} durationInFrames={length} name={`music:${track.movement}`}>
            <Audio
              src={staticFile(track.src)}
              volume={(frame) => Math.max(0, Math.min(1, track.volume * duckGain(track.startFrame + frame)))}
            />
          </Sequence>
        );
      })}

      {/* 3. Frame-exact SFX */}
      {scenes.map((scene) =>
        (scene.sfxCues ?? []).map((sfx, i) => (
          <Sequence
            key={`${scene.id}-sfx-${i}-${sfx.cue}`}
            from={scene.startFrame + sfx.frameOffset}
            durationInFrames={45}
            name={`sfx:${sfx.cue}`}
          >
            <Audio src={staticFile(`audio/sfx/${sfx.cue}.wav`)} volume={0.26} />
          </Sequence>
        )),
      )}
    </>
  );
};
