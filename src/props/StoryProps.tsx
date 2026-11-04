import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../design/tokens';
import {FONT_UI, FONT_DISPLAY} from '../design/fonts';
import {popSpring} from '../motion/anim';

/* ---------------------------------------------------------------- *
 * Primitive SVG helpers
 * ---------------------------------------------------------------- */
export const Txt: React.FC<{
  x: number;
  y: number;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  font?: string;
  opacity?: number;
  children: React.ReactNode;
}> = ({x, y, size = 30, fill = '#ffffff', weight = 700, anchor = 'middle', font = FONT_UI, opacity = 1, children}) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor} fontFamily={font} opacity={opacity}>
    {children}
  </text>
);

export const Bubble: React.FC<{
  x: number;
  y: number;
  text: string;
  fill?: string;
  color?: string;
  delay?: number;
  side?: 'left' | 'right';
  size?: number;
}> = ({x, y, text, fill = '#f4f4f6', color = '#1e1e24', delay = 0, side = 'left', size = 30}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = popSpring(f, fps, delay);
  if (s <= 0.001) return null;
  const w = text.length * size * 0.56 + 48;
  const h = size + 36;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={Math.min(1, s)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} />
      <path
        d={side === 'left' ? `M${-w / 2 + 26} ${h / 2 - 4} l-10 16 l26 -10z` : `M${w / 2 - 26} ${h / 2 - 4} l10 16 l-26 -10z`}
        fill={fill}
      />
      <text x={0} y={size * 0.35} textAnchor="middle" fontFamily={FONT_UI} fontWeight={700} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

export const Heart: React.FC<{x: number; y: number; s?: number; opacity?: number; fill?: string}> = ({
  x,
  y,
  s = 1,
  opacity = 1,
  fill = C.pink,
}) => (
  <path d="M0 6 C-14 -6 -12 -18 0 -10 C12 -18 14 -6 0 6Z" transform={`translate(${x} ${y}) scale(${s * 2.2})`} fill={fill} opacity={opacity} />
);

export const Star: React.FC<{x: number; y: number; s?: number; rot?: number; fill?: string; opacity?: number}> = ({
  x,
  y,
  s = 20,
  rot = 0,
  fill = C.gold,
  opacity = 1,
}) => (
  <path
    d={`M0 ${-s} L${s * 0.25} ${-s * 0.25} L${s} 0 L${s * 0.25} ${s * 0.25} L0 ${s} L${-s * 0.25} ${s * 0.25} L${-s} 0 L${-s * 0.25} ${-s * 0.25}Z`}
    transform={`translate(${x} ${y}) rotate(${rot})`}
    fill={fill}
    opacity={opacity}
  />
);

export const Face: React.FC<{x: number; y: number; r?: number; wobble?: number}> = ({x, y, r = 40, wobble = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${wobble})`}>
    <circle r={r} fill="#ffd54f" stroke="#c9a227" strokeWidth={3} />
    <circle cx={-r * 0.34} cy={-r * 0.2} r={r * 0.1} fill="#3b2f10" />
    <circle cx={r * 0.34} cy={-r * 0.2} r={r * 0.1} fill="#3b2f10" />
    <path
      d={`M${-r * 0.4} ${r * 0.38} Q${-r * 0.1} ${r * 0.2} ${r * 0.1} ${r * 0.4} T${r * 0.42} ${r * 0.3}`}
      stroke="#3b2f10"
      strokeWidth={4}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

export const PersonIcon: React.FC<{color: string; dashed?: boolean; fillOpacity?: number; opacity?: number}> = ({
  color,
  dashed = false,
  fillOpacity = 0.15,
  opacity = 1,
}) => (
  <g opacity={opacity} fill={color} fillOpacity={fillOpacity} stroke={color} strokeWidth={5} strokeDasharray={dashed ? '12 10' : undefined}>
    <circle cx={0} cy={-62} r={36} />
    <path d="M-56 110 Q-56 -8 0 -8 Q56 -8 56 110 Z" />
  </g>
);

/* ---------------------------------------------------------------- *
 * STYLE-PACK diegetic props
 * ---------------------------------------------------------------- */
export const TrafficLightProp: React.FC<{x?: number; y?: number}> = ({x = 650, y = 120}) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-45} y={480} width={90} height={480} fill="#3a3f4d" />
    <rect x={-130} y={0} width={260} height={540} rx={52} fill="#2b303c" stroke="#4a5264" strokeWidth={8} />
    <circle cx={0} cy={115} r={68} fill="#3b1d1d" />
    <circle cx={0} cy={270} r={68} fill="#3d351b" />
    <circle cx={0} cy={425} r={68} fill="#4cd964" />
  </g>
);

export const AmbulanceProp: React.FC<{x?: number; y?: number}> = ({x = 960, y = 620}) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-560} y={-280} width={920} height={420} rx={28} fill="#ffffff" />
    <path d="M 360 -180 L 520 -120 L 560 140 L 360 140 Z" fill="#ffffff" />
    <rect x={-560} y={-40} width={1120} height={42} fill="#ef5350" />
    <rect x={-260} y={-200} width={36} height={120} fill="#ef5350" />
    <rect x={-302} y={-158} width={120} height={36} fill="#ef5350" />
    <text x={80} y={80} textAnchor="middle" fill="#ef5350" fontSize={46} fontWeight={800} letterSpacing={4} fontFamily={FONT_UI}>
      AMBULANCE
    </text>
    <circle cx={-360} cy={145} r={84} fill="#212529" />
    <circle cx={-360} cy={145} r={44} fill="#adb5bd" />
    <circle cx={380} cy={145} r={84} fill="#212529" />
    <circle cx={380} cy={145} r={44} fill="#adb5bd" />
  </g>
);

export const PowerDrillProp: React.FC<{x?: number; y?: number}> = ({x = 920, y = 695}) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-140} y={-55} width={215} height={72} rx={18} fill="#f59f00" />
    <rect x={75} y={-35} width={56} height={34} rx={4} fill="#343a40" />
    <rect x={131} y={-23} width={145} height={10} rx={3} fill="#ced4da" />
  </g>
);

export interface WoodenBlockProps {
  letter: string;
  color: string;
  x: number;
  y: number;
  delayFrames?: number;
}

/** Falling wooden alphabet block with gravity + bounce (STYLE-PACK `fallingBlocks`). */
export const WoodenBlock: React.FC<WoodenBlockProps> = ({letter, color, x, y, delayFrames = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < delayFrames) return null;
  const drop = spring({frame: frame - delayFrames, fps, config: {damping: 11, stiffness: 160, mass: 0.9}});
  const currentY = -200 + drop * (y + 200);
  const wobble = interpolate(drop, [0, 1], [letter.length % 2 === 0 ? 8 : -8, 0]);
  return (
    <g transform={`translate(${x}, ${currentY}) rotate(${wobble})`}>
      <rect x={-56} y={-112} width={112} height={112} rx={10} fill="#d4a36a" />
      <rect x={-46} y={-102} width={92} height={92} rx={6} fill="#ebd1ae" />
      <text x={0} y={-34} textAnchor="middle" fill={color} fontSize={64} fontWeight={900} fontFamily={FONT_DISPLAY}>
        {letter}
      </text>
    </g>
  );
};

/** Multi-ring starship for the closing "minimum starting crew" beat. */
export const StarshipProp: React.FC<{x: number; y: number; rotation?: number; scale?: number}> = ({x, y, rotation = 0, scale = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={92} ry={30} fill="#c8d4e8" stroke="#8fa2bd" strokeWidth={3} />
    <ellipse cx={0} cy={0} rx={58} ry={18} fill="#e6edf8" stroke="#8fa2bd" strokeWidth={2} />
    <ellipse cx={0} cy={0} rx={26} ry={9} fill="#f59f00" />
    <path d="M-92 0 Q-150 6 -196 0" stroke="#a5d8ff" strokeWidth={4} fill="none" opacity={0.55} />
  </g>
);
