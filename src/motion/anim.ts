import {Easing, interpolate, spring} from 'remotion';

export type Ease = (t: number) => number;

/** Clamped 0..1 progress helper. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing: Ease = Easing.out(Easing.cubic),
): number =>
  interpolate(frame, [start, start + Math.max(1, duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Overshooting HUD spring (STYLE-PACK: damping 14 / stiffness 180-200 / mass ~0.75). */
export const popSpring = (frame: number, fps: number, delay = 0): number =>
  frame <= delay
    ? 0
    : spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 180, mass: 0.8}});

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
