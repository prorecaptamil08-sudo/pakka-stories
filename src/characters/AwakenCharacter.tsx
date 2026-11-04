import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, GROUND_Y} from '../design/tokens';
import {clamp} from '../motion/anim';
import type {CharacterId, CharacterProps, ExprName, PoseName} from '../types';

/**
 * Minimalist silhouette-head vector puppet (STYLE-PACK CHARACTER-SYSTEM.md).
 * Everything is a pure function of the current frame - no CSS animations, no timers.
 */

type Wardrobe = {
  top: string;
  shade: string;
  legs: string;
  shoes: string;
  sleeve: string;
  longSleeve: boolean;
  glasses: boolean;
  hairTuft?: boolean;
  dress?: boolean;
};

const WARD: Record<CharacterId, Wardrobe> = {
  protagonist_a: {top: C.shirtA, shade: C.shirtAShade, legs: C.charcoal, shoes: '#151518', sleeve: C.shirtA, longSleeve: false, glasses: false},
  protagonist_b: {top: C.cardigan, shade: C.cardiganShade, legs: C.jeans, shoes: C.shoesB, sleeve: C.cardigan, longSleeve: true, glasses: true, hairTuft: true},
  sibling_teal: {top: '#2ca58d', shade: '#1e7065', legs: C.charcoal, shoes: '#151518', sleeve: '#2ca58d', longSleeve: false, glasses: false},
  sibling_purple_dress: {top: '#7e57c2', shade: '#5e35b1', legs: C.charcoal, shoes: '#151518', sleeve: '#7e57c2', longSleeve: false, glasses: false, dress: true},
  sibling_red_hoodie: {top: '#d9534f', shade: '#a93835', legs: '#22242a', shoes: '#151518', sleeve: '#d9534f', longSleeve: true, glasses: false},
  sibling_amber_cap: {top: '#e68a2e', shade: '#b8681b', legs: '#283040', shoes: '#151518', sleeve: '#e68a2e', longSleeve: false, glasses: false},
  sibling_forest_stripe: {top: '#2e6f5e', shade: '#22554a', legs: C.charcoal, shoes: '#151518', sleeve: '#2e6f5e', longSleeve: true, glasses: false},
  prehistoric_human: {top: '#9c6d47', shade: '#754f31', legs: C.charcoal, shoes: C.charcoal, sleeve: '#9c6d47', longSleeve: false, glasses: false},
  baby: {top: '#8ecae6', shade: '#6fb3d0', legs: C.charcoal, shoes: C.charcoal, sleeve: '#8ecae6', longSleeve: false, glasses: false},
};

type Rig = {
  at: number; // left thigh
  as: number; // left shin
  bt: number;
  bs: number;
  au: number; // left shoulder
  af: number; // left forearm
  bu: number;
  bf: number;
  drop: number;
  tilt: number;
  bob: number;
  phone: boolean;
  stool: boolean;
};

const BASE: Rig = {at: 0, as: 0, bt: 0, bs: 0, au: 3, af: 6, bu: 3, bf: 6, drop: 0, tilt: 0, bob: 0, phone: false, stool: false};

const getPose = (pose: PoseName, f: number, amp: number): Rig => {
  const s = Math.sin(f * 0.09);
  switch (pose) {
    case 'walk_cycle': {
      const ph = (f * Math.PI) / 12;
      const sw = Math.sin(ph) * 24 * amp;
      const kA = Math.max(0, Math.cos(ph)) * 18 * amp;
      const kB = Math.max(0, -Math.cos(ph)) * 18 * amp;
      return {
        ...BASE,
        at: sw,
        as: sw - kA,
        bt: -sw,
        bs: -sw - kB,
        au: -Math.sin(ph) * 18 * amp,
        af: 8,
        bu: Math.sin(ph) * 18 * amp,
        bf: 8,
        bob: -Math.abs(Math.sin(ph)) * 4.5 * amp,
      };
    }
    case 'hold_phone':
      return {...BASE, au: 24, af: 96, bu: 30, bf: 90, tilt: 9, phone: true};
    case 'chin_think':
      return {...BASE, au: 12, af: 80, bu: 24, bf: 138, tilt: -3 + s * 2};
    case 'talk':
      return {...BASE, au: 6, af: 10, bu: 34 + Math.sin(f * 0.18) * 16, bf: 42 + Math.sin(f * 0.18 + 1) * 24};
    case 'celebrate': {
      const j = Math.abs(Math.sin(f * 0.3));
      return {...BASE, au: 150 + s * 8, af: -12, bu: 150 - s * 8, bf: -12, bob: -j * 14};
    }
    case 'slump':
      return {...BASE, au: 4, af: 4, bu: 4, bf: 4, tilt: 15};
    case 'seated':
      return {...BASE, at: 86, as: 4, bt: 86, bs: 4, au: 20, af: 55, bu: 24, bf: 62, drop: 73, stool: true};
    case 'seated_talk':
      return {
        ...BASE,
        at: 86,
        as: 4,
        bt: 86,
        bs: 4,
        au: 14,
        af: 50,
        bu: 36 + Math.sin(f * 0.18) * 16,
        bf: 50 + Math.sin(f * 0.18 + 1) * 24,
        drop: 73,
        stool: true,
      };
    case 'chalk_write':
      return {...BASE, au: -6, af: 120 + Math.sin(f * 0.45) * 14, bu: 12, bf: 40 + Math.sin(f * 0.28) * 10};
    case 'brush_teeth':
      return {...BASE, au: 6, af: 10, bu: 118 + Math.sin(f * 0.85) * 6, bf: 96, tilt: 2};
    case 'pointer_lean':
      return {...BASE, au: 10, af: 20, bu: 96, bf: -4, tilt: 14};
    case 'idle_stand':
    default:
      return {...BASE, au: 3 + s * 2, bu: 3 - s * 2};
  }
};

const EXPR: Record<ExprName, {bl: number; br: number; raise: number; mouth: 'flat' | 'smile' | 'frown' | 'o' | 'talk' | 'smirk'; lid: number}> = {
  neutral: {bl: 0, br: 0, raise: 0, mouth: 'flat', lid: 1},
  happy: {bl: -6, br: -6, raise: -2, mouth: 'smile', lid: 1},
  worried: {bl: -14, br: 14, raise: -3, mouth: 'frown', lid: 0.95},
  curious: {bl: 0, br: -8, raise: -4, mouth: 'smirk', lid: 1.05},
  shocked: {bl: -4, br: -4, raise: -9, mouth: 'o', lid: 1.2},
  skeptical: {bl: 6, br: -14, raise: -2, mouth: 'smirk', lid: 0.62},
  talking: {bl: -3, br: -3, raise: -1, mouth: 'talk', lid: 1},
  exhausted: {bl: 4, br: 4, raise: 2, mouth: 'flat', lid: 0.45},
  sleeping: {bl: 0, br: 0, raise: 3, mouth: 'flat', lid: 0.06},
};

const seg = (x: number, y: number, len: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [x + len * Math.sin(a), y + len * Math.cos(a)];
};

export const AwakenCharacter: React.FC<CharacterProps> = (p) => {
  const f = useCurrentFrame();
  const {
    characterId,
    x,
    targetX,
    y = GROUND_Y,
    scale = 1.15,
    facing = 'right',
    rimLightSide = 'right',
    rimColor = C.rimWarm,
    elderly = false,
    padlockNumber,
  } = p;

  const moveStart = p.moveStart ?? 0;
  const moveEnd = Math.max(moveStart + 30, p.moveEnd ?? moveStart + 60);
  const switchFrame = p.switchFrame ?? moveEnd;
  const pose: PoseName = p.poseAfter && f >= switchFrame ? p.poseAfter : p.pose ?? 'idle_stand';
  const exprName: ExprName = p.exprAfter && f >= switchFrame ? p.exprAfter : p.expression ?? 'neutral';

  const cx =
    targetX !== undefined
      ? interpolate(f, [moveStart, moveEnd], [x, targetX], {...clamp, easing: Easing.inOut(Easing.quad)})
      : x;

  const amp =
    pose === 'walk_cycle' && targetX !== undefined
      ? interpolate(f, [moveStart, moveStart + 6, moveEnd - 8, moveEnd], [0, 1, 1, 0], clamp)
      : 1;

  const W = WARD[characterId] ?? WARD.protagonist_a;
  const P = getPose(pose, f, amp);
  const sx = facing === 'left' ? -1 : 1;
  const rimSign = rimLightSide === 'none' ? 0 : sx * (rimLightSide === 'right' ? 1 : -1);
  const hipY = -155;

  // Limbs hang from their own side of the body so the two legs (and the two arms) never
  // collapse into one silhouette when the pose is symmetric.
  const leg = (t: number, sh: number, offX: number) => {
    const k = seg(offX, hipY, 80, t);
    const ft = seg(k[0], k[1], 75, sh);
    return {k, ft, offX};
  };
  const arm = (u: number, fb: number, offX: number) => {
    const e = seg(offX, -285, 80, u);
    const h = seg(e[0], e[1], 70, u + fb);
    return {e, h, ang: u + fb, offX};
  };

  const legA = leg(P.at, P.as, -15);
  const legB = leg(P.bt, P.bs, 15);
  const armA = arm(P.au, P.af, -27);
  const armB = arm(P.bu, P.bf, 27);

  const drawLeg = (l: ReturnType<typeof leg>) => (
    <g>
      <polyline
        points={`${l.offX},${hipY} ${l.k[0]},${l.k[1]} ${l.ft[0]},${l.ft[1]}`}
        stroke={W.legs}
        strokeWidth={26}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <ellipse cx={l.ft[0] + 12} cy={l.ft[1] + 4} rx={26} ry={11} fill={W.shoes} />
    </g>
  );

  const drawArm = (a: ReturnType<typeof arm>, phone: boolean) => (
    <g>
      <polyline points={`${a.offX},-285 ${a.e[0]},${a.e[1]}`} stroke={W.sleeve} strokeWidth={26} strokeLinecap="round" fill="none" />
      <polyline
        points={`${a.e[0]},${a.e[1]} ${a.h[0]},${a.h[1]}`}
        stroke={W.longSleeve ? W.sleeve : C.charcoal}
        strokeWidth={20}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={a.h[0]} cy={a.h[1]} r={12} fill={C.charcoal} />
      {phone ? (
        <g transform={`translate(${a.h[0]} ${a.h[1]}) rotate(${-a.ang})`}>
          <rect x={-13} y={-14} width={26} height={46} rx={5} fill="#0d0f16" stroke="#3a3f55" strokeWidth={2} />
          <rect x={-10} y={-10} width={20} height={38} rx={3} fill="#9ecbff" opacity={0.85} />
        </g>
      ) : null}
    </g>
  );

  const ex = EXPR[exprName];
  const blink = f % 140 < 4 ? 0.12 : 1;
  const mouthY = -330;
  const R = 47.25;
  const a = (65 * Math.PI) / 180;
  const rimW = 2.5 / scale;

  return (
    <g transform={`translate(${cx} ${y}) scale(${sx * scale} ${scale})`}>
      <ellipse cx={0} cy={2} rx={72} ry={12} fill="rgba(0,0,0,0.28)" />
      {P.stool ? (
        <g fill="#6e482b">
          <rect x={-56} y={-74} width={112} height={14} rx={4} />
          <rect x={-46} y={-60} width={8} height={60} />
          <rect x={38} y={-60} width={8} height={60} />
        </g>
      ) : null}

      <g transform={`translate(0 ${P.drop + P.bob})`}>
        {drawLeg(legA)}
        {drawLeg(legB)}
        {drawArm(armA, false)}

        {/* neck - tucked behind the collar so the head reads as attached */}
        <rect x={-13} y={-330} width={26} height={44} rx={9} fill={C.charcoal} />

        {/* torso */}
        {W.dress ? (
          <path d="M-37 -300 L37 -300 L54 -135 Q0 -124 -54 -135 Z" fill={W.top} />
        ) : (
          <rect x={-37} y={-304} width={74} height={169} rx={25} fill={W.top} />
        )}
        <rect x={-37} y={-304} width={19} height={169} rx={9} fill={W.shade} opacity={0.75} />
        {characterId === 'protagonist_b' ? <rect x={-9} y={-302} width={18} height={152} fill={C.shirtA} /> : null}
        {rimSign !== 0 ? (
          <line x1={rimSign * 37} y1={-284} x2={rimSign * 37} y2={-152} stroke={rimColor} strokeWidth={rimW} strokeLinecap="round" />
        ) : null}

        {drawArm(armB, P.phone)}

        {/* head */}
        <g transform={`rotate(${P.tilt} 0 -310)`}>
          <circle cx={0} cy={-352} r={46} fill={C.charcoal} />
          <circle cx={-8} cy={-344} r={38} fill={C.charcoalShade} opacity={0.5} />

          {W.hairTuft ? <path d="M-30 -392 Q-6 -412 26 -396" stroke="#2a2a2e" strokeWidth={10} fill="none" strokeLinecap="round" /> : null}

          {elderly ? (
            <g fill={C.elderlyHair} stroke={C.elderlyHairOutline} strokeWidth={1.2}>
              <circle cx={-30} cy={-376} r={9} />
              <circle cx={-14} cy={-390} r={10} />
              <circle cx={14} cy={-390} r={10} />
              <circle cx={30} cy={-376} r={9} />
            </g>
          ) : null}

          {rimSign !== 0 ? (
            <path
              d={`M${rimSign * R * Math.cos(a)} ${-352 - R * Math.sin(a)} A${R} ${R} 0 0 ${rimSign > 0 ? 1 : 0} ${rimSign * R * Math.cos(a)} ${-352 + R * Math.sin(a)}`}
              stroke={rimColor}
              strokeWidth={rimW}
              fill="none"
              strokeLinecap="round"
            />
          ) : null}

          {[12, 31].map((eyeX) => (
            <g key={eyeX}>
              <ellipse cx={eyeX} cy={-358} rx={7.5} ry={9 * blink * ex.lid} fill="#ffffff" />
              <circle cx={eyeX + 2.5} cy={-358} r={3.6 * blink * Math.min(1, ex.lid)} fill={C.pupil} />
            </g>
          ))}
          <line
            x1={5}
            y1={-374 + ex.raise}
            x2={19}
            y2={-374 + ex.raise}
            stroke="#ffffff"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${ex.bl} 12 ${-374 + ex.raise})`}
          />
          <line
            x1={24}
            y1={-374 + ex.raise}
            x2={38}
            y2={-374 + ex.raise}
            stroke="#ffffff"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${ex.br} 31 ${-374 + ex.raise})`}
          />

          {W.glasses ? (
            <g stroke={C.glasses} strokeWidth={1.8} fill="none">
              <circle cx={12} cy={-358} r={12} />
              <circle cx={31} cy={-358} r={12} />
              <line x1={24} y1={-358} x2={19} y2={-358} />
            </g>
          ) : null}

          {ex.mouth === 'flat' ? <path d={`M12 ${mouthY} L32 ${mouthY}`} stroke="#f4f4f6" strokeWidth={3} strokeLinecap="round" /> : null}
          {ex.mouth === 'smile' ? (
            <path d={`M12 ${mouthY - 2} Q22 ${mouthY + 12} 33 ${mouthY - 4}`} stroke="#f4f4f6" strokeWidth={3} fill="none" strokeLinecap="round" />
          ) : null}
          {ex.mouth === 'frown' ? (
            <path d={`M12 ${mouthY + 4} Q22 ${mouthY - 6} 33 ${mouthY + 4}`} stroke="#f4f4f6" strokeWidth={3} fill="none" strokeLinecap="round" />
          ) : null}
          {ex.mouth === 'smirk' ? (
            <path d={`M12 ${mouthY} Q24 ${mouthY + 2} 34 ${mouthY - 8}`} stroke="#f4f4f6" strokeWidth={3} fill="none" strokeLinecap="round" />
          ) : null}
          {ex.mouth === 'o' ? <ellipse cx={22} cy={mouthY + 2} rx={6} ry={8} fill="#0d0d10" stroke="#f4f4f6" strokeWidth={2} /> : null}
          {ex.mouth === 'talk' ? (
            <ellipse
              cx={22}
              cy={mouthY + 2}
              rx={8}
              ry={3 + Math.abs(Math.sin(f * 0.5)) * 7}
              fill="#0d0d10"
              stroke="#f4f4f6"
              strokeWidth={2}
            />
          ) : null}
        </g>

        {typeof padlockNumber === 'number' ? (
          <g transform="translate(0 -424)">
            <path d="M-11 -12 A11 11 0 0 1 11 -12 L11 0 L-11 0 Z" stroke="#3a3a42" strokeWidth={3.5} fill="none" />
            <rect x={-20} y={-2} width={40} height={30} rx={5} fill="#d9383a" />
            <text x={0} y={19} textAnchor="middle" fill="#ffffff" fontSize={18} fontWeight={800} fontFamily="Inter, sans-serif">
              {padlockNumber}
            </text>
          </g>
        ) : null}
      </g>
    </g>
  );
};
