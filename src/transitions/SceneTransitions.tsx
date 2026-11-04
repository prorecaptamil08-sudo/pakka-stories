import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TransitionType} from '../types';
import {Z} from '../design/tokens';

/**
 * STYLE-PACK transition catalogue.
 *  hard_cut              0 f
 *  white_flash          12 f
 *  warm_sunset_dissolve 18 f
 *  amber/red_circle_iris 16 f
 *  rack_focus_blur      24 f
 */
export const SceneTransitions: React.FC<{type?: TransitionType; shakeFrame?: number}> = ({type = 'hard_cut'}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  if (type === 'hard_cut') return null;

  const duration = type === 'white_flash' ? 12 : type === 'warm_sunset_dissolve' ? 18 : type === 'rack_focus_blur' ? 24 : 16;
  const start = Math.max(0, durationInFrames - duration);
  if (frame < start) return null;

  const p = interpolate(frame, [start, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  if (type === 'white_flash' || type === 'warm_sunset_dissolve') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: type === 'white_flash' ? '#ffffff' : '#ffe4b5',
          opacity: p * 0.94,
          pointerEvents: 'none',
          zIndex: Z.transition,
        }}
      />
    );
  }

  if (type === 'amber_circle_iris' || type === 'red_circle_iris') {
    return (
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: Z.transition}}>
        <circle cx={960} cy={540} r={p * 1250} fill={type === 'red_circle_iris' ? '#c94a4a' : '#f4b860'} />
      </svg>
    );
  }

  // rack_focus_blur
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: `blur(${p * 16}px) brightness(${1 + p * 0.15})`,
        WebkitBackdropFilter: `blur(${p * 16}px)`,
        background: `rgba(255,255,255,${p * 0.3})`,
        pointerEvents: 'none',
        zIndex: Z.transition,
      }}
    />
  );
};
