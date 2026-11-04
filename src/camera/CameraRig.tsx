import React, {createContext, useContext} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CameraPreset} from '../types';
import {Z} from '../design/tokens';
import {clamp} from '../motion/anim';

/**
 * STYLE-PACK camera rig: 2.5D CSS transform over a 1920x1080 stage.
 * Depth planes are exposed through CameraDepthContext so props/environments can apply
 * parallax multipliers (0.15x sky, 0.65x architecture, 1.0x stage, 1.45x foreground).
 */
export const CameraDepthContext = createContext<number>(1);
export const useParallax = () => useContext(CameraDepthContext);

export interface CameraRigProps {
  preset?: CameraPreset;
  shakeFrame?: number;
  children: React.ReactNode;
}

interface CameraState {
  scale: number;
  x: number;
  y: number;
}

const cameraState = (preset: CameraPreset, frame: number, durationInFrames: number): CameraState => {
  const d = Math.max(2, durationInFrames);
  switch (preset) {
    case 'slow_creep_in':
      return {
        scale: interpolate(frame, [0, d], [1.0, 1.08], clamp),
        x: 0,
        y: interpolate(frame, [0, d], [0, -16], clamp),
      };
    case 'slow_push_in':
      return {
        scale: interpolate(frame, [0, d], [1.0, 1.14], {...clamp, easing: Easing.inOut(Easing.quad)}),
        x: 0,
        y: interpolate(frame, [0, d], [0, -30], clamp),
      };
    case 'drift_left':
      return {
        scale: 1.06,
        x: interpolate(frame, [0, d], [20, -50], {...clamp, easing: Easing.inOut(Easing.sin)}),
        y: 0,
      };
    case 'pull_back_reveal':
    case 'pull_back_street_reveal': {
      const settle = Math.min(45, Math.max(2, d - 1));
      const end = preset === 'pull_back_street_reveal' ? 1.0 : 1.03;
      return {
        scale: interpolate(frame, [0, settle, d], [preset === 'pull_back_street_reveal' ? 1.62 : 1.5, 1.0, end], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        }),
        x: interpolate(frame, [0, settle], [preset === 'pull_back_street_reveal' ? 340 : 300, 0], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        }),
        y: preset === 'pull_back_street_reveal' ? interpolate(frame, [0, settle], [-60, 0], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0,
      };
    }
    case 'chalkboard_fullscreen_dive':
      return {
        scale: interpolate(frame, [0, 60, 150, Math.max(180, d - 45), d], [1.0, 1.35, 2.35, 2.35, 1.0], clamp),
        x: 0,
        y: interpolate(frame, [0, 60, 150, Math.max(180, d - 45), d], [0, 65, 130, 130, 0], clamp),
      };
    case 'dining_table_awkward_push':
      return {
        scale: interpolate(frame, [20, d], [1.0, 1.38], {...clamp, easing: Easing.inOut(Easing.quad)}),
        x: 0,
        y: interpolate(frame, [20, d], [0, -30], clamp),
      };
    case 'lateral_gallery_walk':
      return {
        scale: 1.0,
        x: interpolate(frame, [0, d * 0.72], [0, -680], {...clamp, easing: Easing.inOut(Easing.sin)}),
        y: 0,
      };
    case 'population_zoom_out':
      return {
        scale: interpolate(frame, [0, 90], [1.42, 1.0], {...clamp, easing: Easing.out(Easing.cubic)}),
        x: 0,
        y: interpolate(frame, [0, 90], [-40, 0], clamp),
      };
    case 'static_wide':
    default:
      return {
        scale: interpolate(frame, [0, d], [1.0, 1.015], clamp),
        x: 0,
        y: 0,
      };
  }
};

export const CameraRig: React.FC<CameraRigProps> = ({preset = 'static_wide', shakeFrame, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {scale, x, y} = cameraState(preset, frame, durationInFrames);

  let tx = x;
  let ty = y;
  if (typeof shakeFrame === 'number' && frame >= shakeFrame && frame <= shakeFrame + 6) {
    tx += Math.sin(frame * 3.2) * 5;
    ty += Math.cos(frame * 4.1) * 5;
  }

  return (
    <div style={{width: '100%', height: '100%', position: 'relative', overflow: 'hidden'}}>
      <CameraDepthContext.Provider value={scale}>
        <div
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: '50% 50%',
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
            willChange: 'transform',
          }}
        >
          {children}
        </div>
      </CameraDepthContext.Provider>
      {/* Universal soft edge vignette (STYLE-PACK rule VR-04) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, transparent 56%, rgba(0,0,0,0.38) 100%)',
          zIndex: Z.vignette,
        }}
      />
    </div>
  );
};
