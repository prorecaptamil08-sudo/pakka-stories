import React from 'react';
import {useCurrentFrame} from 'remotion';

/** Chatham Island black robin (STYLE-PACK AnimalCharacter). */
export const BlackRobin: React.FC<{
  x: number;
  y: number;
  scale?: number;
  facing?: 'left' | 'right';
  legBand?: 'blue' | 'yellow' | 'both' | 'none';
  elderlyTuft?: boolean;
  singing?: boolean;
  dimmed?: boolean;
}> = ({x, y, scale = 1, facing = 'right', legBand = 'none', elderlyTuft = false, singing = false, dimmed = false}) => {
  const frame = useCurrentFrame();
  const dir = facing === 'left' ? -1 : 1;
  const bob = Math.sin(frame * 0.12 + x) * 1.5;
  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${dir * scale}, ${scale})`} opacity={dimmed ? 0.28 : 1}>
      <line x1={-6} y1={-22} x2={-6} y2={0} stroke="#1a1a1d" strokeWidth={3.5} />
      <line x1={6} y1={-22} x2={6} y2={0} stroke="#1a1a1d" strokeWidth={3.5} />
      {(legBand === 'blue' || legBand === 'both') && <rect x={-9} y={-12} width={6} height={5} rx={1} fill="#29b6f6" />}
      {(legBand === 'yellow' || legBand === 'both') && <rect x={3} y={-12} width={6} height={5} rx={1} fill="#ffee58" />}
      <path d="M -25 -32 L -62 -22 L -56 -38 Z" fill="#1f1b18" />
      <ellipse cx={0} cy={-38} rx={34} ry={24} fill="#2b2623" />
      <ellipse cx={-6} cy={-36} rx={22} ry={14} fill="#3d3530" transform="rotate(-10, -6, -36)" />
      <circle cx={20} cy={-54} r={18} fill="#24201d" />
      {elderlyTuft && <path d="M 10 -70 Q 18 -78 26 -70" stroke="#d7ccc8" strokeWidth={4} fill="none" strokeLinecap="round" />}
      <circle cx={26} cy={-56} r={5} fill="#ffffff" />
      <circle cx={27.5} cy={-56} r={2.5} fill="#111111" />
      <polygon points="36,-56 48,-52 36,-48" fill="#141414" />
      {singing && (
        <g transform={`translate(52, ${-68 - (frame % 30) * 0.8})`} opacity={1 - (frame % 30) / 30}>
          <text fill="#5c6bc0" fontSize={22} fontWeight={700}>
            ♪
          </text>
        </g>
      )}
    </g>
  );
};

/** Northern elephant seal. */
export const ElephantSeal: React.FC<{x: number; y: number; scale?: number; facing?: 'left' | 'right'}> = ({x, y, scale = 1, facing = 'left'}) => {
  const dir = facing === 'right' ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${dir * scale}, ${scale})`}>
      <ellipse cx={0} cy={4} rx={72} ry={10} fill="rgba(0,0,0,0.18)" />
      <path d="M -65 0 Q -72 -28 -45 -34 Q -10 -32 35 -18 Q 68 -10 75 0 Z" fill="#8c7f75" />
      <circle cx={-52} cy={-22} r={4} fill="#ffffff" />
      <circle cx={-53} cy={-22} r={2} fill="#1a1a1a" />
    </g>
  );
};
