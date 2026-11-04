import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {EnvironmentStage} from './backgrounds/EnvironmentStage';
import {CameraRig} from './camera/CameraRig';
import {AwakenCharacter} from './characters/AwakenCharacter';
import {InfographicWidgets} from './motion/InfographicWidgets';
import {SceneTransitions} from './transitions/SceneTransitions';
import {HudOverlays} from './typography/HudOverlays';
import {AudioDirector} from './audio/AudioDirector';
import {OutroCard} from './outro/OutroCard';
import {ENV_RIM} from './design/tokens';
import type {Episode, Scene} from './types';
import narrationTiming from '../episode/narration-timing.json';

const SceneView: React.FC<{scene: Scene}> = ({scene}) => (
  <AbsoluteFill>
    <CameraRig preset={scene.cameraPreset}>
      <AbsoluteFill>
        <EnvironmentStage preset={scene.environment} />
        <InfographicWidgets widget={scene.widget} />
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
        >
          {(scene.characters ?? []).map((character, i) => (
            <AwakenCharacter key={`${scene.id}-char-${i}`} rimColor={ENV_RIM[scene.environment]} {...character} />
          ))}
        </svg>
      </AbsoluteFill>
    </CameraRig>

    {/* Screen-space HUD - outside the camera transform so zooms never distort it */}
    <HudOverlays hud={scene.hud} />
    <SceneTransitions type={scene.transitionOut} />
  </AbsoluteFill>
);

export const EpisodeMaster: React.FC<{episode: Episode}> = ({episode}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#0d1117'}}>
      <AudioDirector
        audio={episode.audio}
        cues={episode.cues}
        scenes={episode.scenes}
        narrationTiming={narrationTiming.lines}
      />

      {episode.scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={`${scene.id}: ${scene.environment}`}
        >
          {scene.kind === 'outro' ? <OutroCard channel={episode.channel} /> : <SceneView scene={scene} />}
        </Sequence>
      ))}

      {/*
        Burned-in subtitles are intentionally disabled (episode.subtitles === false).
        Narration is carried by the TTS voice-over only; on-screen text is diegetic
        (chalk) or HUD badges, per STYLE-PACK conventions.
      */}
    </AbsoluteFill>
  );
};
