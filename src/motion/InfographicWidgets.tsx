import React, {useId} from 'react';
import {Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../design/tokens';
import {FONT_CHALK, FONT_DISPLAY, FONT_UI} from '../design/fonts';
import {clamp, popSpring, prog} from './anim';
import {Bubble, Face, Heart, PersonIcon, Star, StarshipProp, Txt, WoodenBlock} from '../props/StoryProps';
import type {WidgetConfig} from '../types';

/**
 * Diegetic infographic widgets.
 * Every animation is a pure function of the frame (STYLE-PACK ANIMATION-SYSTEM.md).
 */

const panel = {fill: C.panel, stroke: C.goldBorder, strokeWidth: 3} as const;

/* --------------------------- S01 chat bubbles --------------------------- */
const ChatBubbles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <Bubble x={820} y={300} text="Tell me everything." delay={10} />
      <Bubble x={1080} y={420} text="You're so interesting." fill={C.gold} delay={38} side="right" />
      <Bubble x={860} y={540} text="I could talk to you all night." delay={66} />
      {[0, 1, 2, 3, 4].map((i) => {
        const t = (f * 1.2 + i * 24) % 120;
        return <Heart key={i} x={620 + i * 170} y={760 - t * 3.2} s={0.6 + (i % 2) * 0.3} opacity={Math.sin((Math.PI * t) / 120)} />;
      })}
    </g>
  );
};

/* --------------------------- S02 seen / no reply ------------------------ */
const PhoneSeen: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = popSpring(f, fps, 0);
  const dots = f > 40 && f < 62;
  return (
    <g transform={`translate(960 450) scale(${Math.max(0.001, s)})`}>
      <rect x={-150} y={-280} width={300} height={560} rx={38} fill="#0d0f16" stroke="#3a3f55" strokeWidth={6} />
      <rect x={-136} y={-250} width={272} height={500} rx={26} fill="#171b2b" />
      <Txt x={0} y={-215} size={20} fill="#9aa3bd" weight={600}>
        2 days ago
      </Txt>
      <g transform="translate(0 -120)">
        <Bubble x={0} y={0} text="Free this weekend?" fill="#4dabf7" color="#ffffff" size={22} delay={8} side="right" />
      </g>
      <Txt x={90} y={-60} size={18} fill="#9aa3bd" weight={600} opacity={prog(f, 25, 8)}>
        Seen 9:41 PM
      </Txt>
      {dots ? (
        <g>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-30 + i * 30} cy={20} r={8} fill="#9aa3bd" opacity={0.4 + 0.6 * Math.max(0, Math.sin(f * 0.4 - i))} />
          ))}
        </g>
      ) : null}
      <Txt x={0} y={200} size={28} fill={C.danger} weight={800} opacity={prog(f, 50, 10) * (0.7 + 0.3 * Math.sin(f * 0.4))}>
        no reply
      </Txt>
    </g>
  );
};

/* --------------------------- S03 certainty meter ----------------------- */
const CertaintyMeter: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p1 = prog(f, 10, 110, Easing.inOut(Easing.cubic));
  const cert = 0.85 - 0.65 * p1;
  const th = 0.15 + 0.8 * p1;
  const bar = (x: number, v: number, col: string, label: string, delay: number) => {
    const s = popSpring(f, fps, delay);
    return (
      <g opacity={Math.min(1, Math.max(0, s))}>
        <rect x={x - 60} y={220} width={120} height={460} rx={26} fill="#10142a" stroke="#3a4a7a" strokeWidth={3} />
        <rect x={x - 52} y={228 + 444 * (1 - v)} width={104} height={444 * v} rx={20} fill={col} />
        <Txt x={x} y={730} size={26} fill="#d0d4dc">
          {label}
        </Txt>
      </g>
    );
  };
  return (
    <g>
      {bar(700, cert, interpolateColors(p1, [0, 1], ['#5cd669', '#e5484d']), 'CERTAINTY', 0)}
      {bar(1220, th, interpolateColors(p1, [0, 1], ['#f59f00', '#ff7eb6']), 'THINKING', 6)}
      <g transform={`translate(960 450) scale(${1 + 0.06 * Math.sin(f * 0.2)})`}>
        <Txt x={0} y={60} size={190} fill={C.gold} weight={900} font={FONT_DISPLAY} opacity={0.9}>
          ?
        </Txt>
      </g>
    </g>
  );
};

/* --------------------------- S04 message vs chat ----------------------- */
const MsgVsChat: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = prog(f, 55, 60, Easing.inOut(Easing.cubic));
  const sL = popSpring(f, fps, 0) * (1 - 0.14 * d);
  const oL = Math.min(1, Math.max(0, 1 - 0.62 * d));
  const sR = popSpring(f, fps, 12) * (1 + 0.14 * d + 0.012 * d * Math.sin(f * 0.25));
  const glow = 0.25 + 0.25 * Math.sin(f * 0.2);
  const mini: Array<[string, boolean]> = [
    ['Haha, exactly!', false],
    ['Same here.', true],
    ['Tell me more', false],
    ['Ha, no way', true],
    ['Best day ever', false],
  ];
  return (
    <g>
      <g transform={`translate(700 440) scale(${Math.max(0.001, sL)})`} opacity={oL}>
        <rect x={-190} y={-170} width={380} height={340} rx={24} {...panel} stroke={C.info} />
        <Txt x={0} y={-132} size={22} fill={C.info}>
          GREAT CONVERSATION
        </Txt>
        {mini.map(([t, r], i) => {
          const w = t.length * 13 + 30;
          const show = prog(f, 10 + i * 6, 8);
          return (
            <g key={t} opacity={show}>
              <rect x={r ? 170 - w : -170} y={-100 + i * 52} width={w} height={38} rx={19} fill={r ? '#4dabf7' : '#f4f4f6'} />
              <text
                x={(r ? 170 - w : -170) + w / 2}
                y={-75 + i * 52}
                textAnchor="middle"
                fontFamily={FONT_UI}
                fontWeight={600}
                fontSize={20}
                fill={r ? '#fff' : '#1e1e24'}
              >
                {t}
              </text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(1220 440) scale(${Math.max(0.001, sR)})`}>
        <circle r={215} fill="none" stroke={C.danger} strokeWidth={5} opacity={glow * d} />
        <rect x={-190} y={-170} width={380} height={340} rx={24} {...panel} stroke={C.danger} />
        <Txt x={0} y={-132} size={22} fill={C.danger}>
          UNANSWERED MESSAGE
        </Txt>
        <Bubble x={0} y={-30} text="Hey, you free?" fill="#4dabf7" color="#ffffff" size={26} delay={20} side="right" />
        <Txt x={100} y={20} size={20} fill="#9aa3bd" weight={600}>
          Delivered
        </Txt>
        <circle cx={0} cy={100} r={30} fill="none" stroke="#d0d4dc" strokeWidth={4} />
        <line x1={0} y1={100} x2={Math.sin(f * 0.12) * 18} y2={100 - Math.cos(f * 0.12) * 18} stroke="#d0d4dc" strokeWidth={4} strokeLinecap="round" />
        <line x1={0} y1={100} x2={Math.sin(f * 0.01) * 12} y2={100 - Math.cos(f * 0.01) * 12} stroke="#d0d4dc" strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

/* --------------------------- S05 chemistry equation ------------------- */
const ChemistryEq: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const clip = useId().replace(/:/g, '');
  const grow = prog(f, 120, 50);
  const total = 800 * grow;
  const pulse = 1 + 0.04 * Math.sin(f * 0.25) * prog(f, 170, 10);
  return (
    <g>
      <g transform={`translate(960 250) scale(${Math.max(0.001, popSpring(f, fps, 0))})`}>
        <Txt x={0} y={0} size={72} font={FONT_DISPLAY} weight={900}>
          INTENSE ATTRACTION
        </Txt>
      </g>
      <g opacity={prog(f, 30, 12)}>
        <Txt x={760} y={350} size={54} fill="#d0d4dc" weight={700}>
          = chemistry
        </Txt>
        <Txt x={940} y={350} size={54} fill={C.gold} weight={800} font={FONT_DISPLAY}>
          ?
        </Txt>
      </g>
      <Txt x={960} y={450} size={32} fill="#9aa3bd" weight={600} opacity={prog(f, 100, 14)}>
        may be partly fueled by
      </Txt>
      <rect x={560} y={500} width={800} height={92} rx={18} fill="#10142a" stroke="#3a4a7a" strokeWidth={3} />
      <clipPath id={`barclip-${clip}`}>
        <rect x={560} y={500} width={Math.max(1, total)} height={92} rx={18} />
      </clipPath>
      <g clipPath={`url(#barclip-${clip})`}>
        <rect x={560} y={500} width={440} height={92} fill="#f59f00" />
        <g transform={`translate(1000 546) scale(${pulse} 1) translate(-1000 -546)`}>
          <rect x={1000} y={500} width={360} height={92} fill="#7e57c2" />
        </g>
        <Txt x={780} y={560} size={34} fill="#1e1e24" weight={800}>
          spark
        </Txt>
        <Txt x={1180} y={560} size={34} fill="#ffffff" weight={800}>
          uncertainty
        </Txt>
      </g>
    </g>
  );
};

/* --------------------------- S06 clue search -------------------------- */
const ClueSearch: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const labels = ['the compliment', 'the delay', 'that emoji', 'their tone', 'last seen', 'who they liked'];
  const pos: Array<[number, number]> = [
    [640, 330],
    [960, 330],
    [1280, 330],
    [640, 500],
    [960, 500],
    [1280, 500],
  ];
  const keys = [0, 22, 44, 66, 88, 110, 150];
  const order = [0, 1, 2, 5, 4, 3, 3];
  const mx = interpolate(f, keys, order.map((i) => pos[i][0]), clamp);
  const my = interpolate(f, keys, order.map((i) => pos[i][1]), clamp);
  return (
    <g>
      {labels.map((t, i) => {
        const s = popSpring(f, fps, i * 6);
        const hot = Math.hypot(mx - pos[i][0], my - pos[i][1]) < 70;
        return (
          <g key={t} transform={`translate(${pos[i][0]} ${pos[i][1]}) scale(${Math.max(0.001, s) * (hot ? 1.08 : 1)})`}>
            <rect x={-120} y={-52} width={240} height={104} rx={16} fill={C.panel} stroke={hot ? C.gold : '#3a4a7a'} strokeWidth={hot ? 4 : 3} />
            <Txt x={0} y={9} size={26} fill={hot ? C.gold : '#d0d4dc'}>
              {t}
            </Txt>
          </g>
        );
      })}
      <g transform={`translate(${mx + 116} ${my + 74})`}>
        <circle r={38} fill="rgba(255,255,255,0.08)" stroke={C.gold} strokeWidth={7} />
        <line x1={28} y1={28} x2={66} y2={66} stroke={C.gold} strokeWidth={11} strokeLinecap="round" />
      </g>
    </g>
  );
};

/* --------------------------- S07 replay list -------------------------- */
const ReplayList: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows = [
    {verb: 'REPLAY', rest: ' the compliment', at: 0, y: 250},
    {verb: 'ANALYZE', rest: ' the delay', at: 66, y: 400},
    {verb: 'WONDER', rest: ' what that emoji meant', at: 132, y: 550},
  ];
  return (
    <g>
      {rows.map((r, i) => {
        const s = popSpring(f, fps, r.at);
        return (
          <g key={r.verb} transform={`translate(960 ${r.y}) scale(${Math.max(0.001, s)})`} opacity={Math.min(1, Math.max(0, s))}>
            <rect x={-420} y={-60} width={840} height={120} rx={20} {...panel} />
            <text x={-306} y={13} textAnchor="start" fontFamily={FONT_UI} fontSize={34} fill="#ffffff" fontWeight={600}>
              <tspan fill={C.gold} fontWeight={800}>
                {r.verb}
              </tspan>
              <tspan>{r.rest}</tspan>
            </text>
            <g transform="translate(-360 0)">
              {i === 0 ? (
                <g transform={`rotate(${-f * 6})`}>
                  <path d="M-22 0 A22 22 0 1 1 0 22" stroke={C.gold} strokeWidth={6} fill="none" strokeLinecap="round" />
                  <polygon points="-34,-4 -10,-4 -22,14" fill={C.gold} />
                </g>
              ) : null}
              {i === 1 ? (
                <g>
                  <circle r={30} fill="none" stroke="#fff" strokeWidth={5} />
                  <line x1={0} y1={0} x2={Math.sin(f * 0.3) * 22} y2={-Math.cos(f * 0.3) * 22} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
                  <line x1={0} y1={0} x2={Math.sin(f * 0.03) * 14} y2={-Math.cos(f * 0.03) * 14} stroke="#fff" strokeWidth={5} strokeLinecap="round" />
                </g>
              ) : null}
              {i === 2 ? <Face x={0} y={0} r={34} wobble={Math.sin(f * 0.2) * 10} /> : null}
            </g>
          </g>
        );
      })}
    </g>
  );
};

/* --------------------------- S08 detail orbit ------------------------- */
const DetailOrbit: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = ['emoji', 'reply time', 'wording', 'likes', 'tone', 'last seen', 'punctuation', 'plans?'];
  const asked = f >= 138;
  const speed = asked ? 0.02 : 0.012;
  const baseAng = asked ? 138 * 0.012 + (f - 138) * speed : f * speed;
  return (
    <g>
      {items.map((t, i) => {
        const a = baseAng + (i * Math.PI * 2) / items.length;
        const x = 960 + Math.cos(a) * 440;
        const y = 440 + Math.sin(a) * 190;
        const s = popSpring(f, fps, 8 + i * 5);
        const w = t.length * 15 + 44;
        return (
          <g key={t} transform={`translate(${x} ${y}) scale(${Math.max(0.001, s)})`}>
            <rect x={-w / 2} y={-26} width={w} height={52} rx={26} fill={C.panel} stroke={C.info} strokeWidth={3} />
            <Txt x={0} y={9} size={24} fill="#d0d4dc" weight={600}>
              {t}
            </Txt>
          </g>
        );
      })}
      {!asked ? (
        <g transform={`translate(960 440) scale(${(0.6 + 0.4 * prog(f, 0, 100)) * (1 + 0.04 * Math.sin(f * 0.2))})`}>
          <Txt x={0} y={60} size={190} fill={C.gold} weight={900} font={FONT_DISPLAY}>
            1?
          </Txt>
        </g>
      ) : (
        <g transform={`translate(960 440) scale(${Math.max(0.001, popSpring(f, fps, 138))})`}>
          <rect x={-250} y={-60} width={500} height={120} rx={60} fill={C.panel} stroke={C.gold} strokeWidth={4} />
          <Txt x={0} y={16} size={50} font={FONT_DISPLAY} weight={800}>
            Do they like me?
          </Txt>
        </g>
      )}
    </g>
  );
};

/* --------------------------- S09 silence then message ----------------- */
const SilenceMessage: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = prog(f, 190, 60, Easing.out(Easing.quad));
  return (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const s = popSpring(f, fps, i * 36);
        return (
          <g key={i} transform={`translate(${650 + i * 200} 280) scale(${Math.max(0.001, s)})`}>
            <rect x={-80} y={-90} width={160} height={180} rx={16} fill={C.panel} stroke="#3a4a7a" strokeWidth={3} />
            <Txt x={0} y={-52} size={22} fill="#9aa3bd">{`DAY ${i + 1}`}</Txt>
            <rect x={-48} y={-24} width={96} height={52} rx={18} fill="none" stroke="#5b6585" strokeWidth={3} strokeDasharray="8 8" />
            <Txt x={0} y={70} size={20} fill="#5b6585" weight={600}>
              silence
            </Txt>
          </g>
        );
      })}
      {/* the ripple only exists while it is expanding - a static ring on frame 1 reads as
          a stray outline floating in the room */}
      <g opacity={Math.min(1, ring * 8) * Math.max(0, 0.9 - ring)}>
        <circle cx={960} cy={600} r={60 + ring * 300} fill="none" stroke={C.good} strokeWidth={6} />
      </g>
      <g transform={`translate(0 ${Math.sin(f * 0.1) * 3})`}>
        <Bubble x={960} y={600} text="Hey, sorry. Crazy week! Miss you" fill="#4dabf7" color="#ffffff" size={30} delay={140} side="right" />
      </g>
      <Txt x={960} y={720} size={46} fill={C.gold} weight={800} font={FONT_DISPLAY} opacity={prog(f, 200, 14)}>
        relief
      </Txt>
    </g>
  );
};

/* --------------------------- S10 relief burst ------------------------- */
const ReliefBurst: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const len = prog(f, 0, 30) * 380;
  return (
    <g>
      {Array.from({length: 16}).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 + f * 0.01;
        return (
          <line
            key={i}
            x1={960 + Math.cos(a) * 140}
            y1={430 + Math.sin(a) * 140}
            x2={960 + Math.cos(a) * (140 + len)}
            y2={430 + Math.sin(a) * (140 + len)}
            stroke={i % 2 ? C.gold : C.pink}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={0.7 - prog(f, 40, 36) * 0.4}
          />
        );
      })}
      {Array.from({length: 14}).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const t = f * 0.9;
        return (
          <circle
            key={i}
            cx={960 + Math.cos(a) * t * 7}
            cy={430 + Math.sin(a) * t * 7 + t * t * 0.03}
            r={8}
            fill={[C.gold, C.pink, C.teal][i % 3]}
            opacity={Math.max(0, 1 - f / 70)}
          />
        );
      })}
      <g transform={`translate(960 430) scale(${Math.max(0.001, popSpring(f, fps, 2))}) rotate(${Math.sin(f * 0.3) * 3})`}>
        <Txt x={0} y={30} size={104} font={FONT_DISPLAY} weight={900} fill="#ffffff">
          RELIEF!
        </Txt>
      </g>
      <Txt x={960} y={540} size={40} fill={C.gold} weight={700} opacity={prog(f, 20, 10)}>
        exciting again
      </Txt>
    </g>
  );
};

/* --------------------------- S11 swing wave --------------------------- */
const SwingWave: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 110, Easing.inOut(Easing.sin));
  const endX = 520 + 880 * p;
  const yAt = (x: number) => 430 - Math.sin(((x - 520) / 880) * Math.PI * 4.5) * 120;
  const pts: string[] = [];
  for (let x = 520; x <= endX; x += 8) pts.push(`${x},${yAt(x)}`);
  pts.push(`${endX},${yAt(endX)}`);
  const peaks = [618, 1009, 1400];
  const troughs = [813, 1204];
  return (
    <g>
      <line x1={500} y1={430} x2={1420} y2={430} stroke="#3a4a7a" strokeWidth={2} strokeDasharray="10 10" />
      <polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={endX} cy={yAt(endX)} r={14} fill="#fff" />
      {peaks.map((x) => (
        <Txt key={x} x={x} y={270} size={26} fill={C.good} weight={800} opacity={endX > x ? 1 : 0}>
          RELIEF
        </Txt>
      ))}
      {troughs.map((x) => (
        <Txt key={x} x={x} y={640} size={26} fill={C.bad} weight={800} opacity={endX > x ? 1 : 0}>
          UNCERTAINTY
        </Txt>
      ))}
    </g>
  );
};

/* --------------------------- chalk text (S12, S16, S17) --------------- */
type ChalkMark = {type: 'check' | 'cross'; x: number; y: number; at: number};
export type ChalkLine = {text: string; at: number; x: number; y: number; size: number; color: string; mark?: ChalkMark};

const ChalkText: React.FC<{lines?: ChalkLine[]}> = ({lines = []}) => {
  const f = useCurrentFrame();
  const uid = useId().replace(/:/g, '');
  return (
    <g>
      {lines.map((l, i) => {
        const estW = l.text.length * l.size * 0.55;
        const p = prog(f, l.at, 30, Easing.inOut(Easing.quad));
        const m = l.mark;
        const mp = m ? prog(f, m.at, 14) : 0;
        return (
          <g key={`${l.text}-${i}`}>
            <clipPath id={`ck-${uid}-${i}`}>
              <rect x={l.x - estW / 2 - 10} y={l.y - l.size * 1.1} width={Math.max(1, p * (estW + 20))} height={l.size * 1.6} />
            </clipPath>
            <text
              x={l.x}
              y={l.y}
              textAnchor="middle"
              fontFamily={FONT_CHALK}
              fontWeight={700}
              fontSize={l.size}
              fill={l.color}
              opacity={0.94}
              clipPath={`url(#ck-${uid}-${i})`}
            >
              {l.text}
            </text>
            {m && m.type === 'check' ? (
              <path
                d={`M${m.x} ${m.y} L${m.x + 24} ${m.y + 28} L${m.x + 70} ${m.y - 38}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - Math.min(1, mp)}
                stroke={C.good}
                strokeWidth={10}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}
            {m && m.type === 'cross' ? (
              <g stroke={C.bad} strokeWidth={10} strokeLinecap="round" fill="none">
                <path d={`M${m.x} ${m.y} L${m.x + 60} ${m.y + 60}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, mp * 2)} />
                <path d={`M${m.x + 60} ${m.y} L${m.x} ${m.y + 60}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, mp * 2 - 1)} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/* --------------------------- chips (S13, S21) ------------------------- */
const Chips: React.FC<{items?: Array<{text: string; color: string}>; arrows?: boolean; y?: number}> = ({items = [], arrows = false, y = 430}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ws = items.map((it) => Math.max(...it.text.split('|').map((t) => t.length)) * 21 + 64);
  const gap = 90;
  const total = ws.reduce((a, b) => a + b, 0) + gap * Math.max(0, items.length - 1);
  let x0 = 960 - total / 2;
  return (
    <g>
      {items.map((it, i) => {
        const cx = x0 + ws[i] / 2;
        x0 += ws[i] + gap;
        const delay = 6 + i * 34;
        const s = popSpring(f, fps, delay);
        const [a, b] = it.text.split('|');
        const bob = Math.sin(f * 0.08 + i) * 5;
        return (
          <g key={`${it.text}-${i}`}>
            <g transform={`translate(${cx} ${y + bob}) scale(${Math.max(0.001, s)})`}>
              <rect x={-ws[i] / 2} y={-75} width={ws[i]} height={150} rx={26} fill={C.panel} stroke={it.color} strokeWidth={4} />
              <Txt x={0} y={b ? -8 : 12} size={36} font={FONT_DISPLAY} weight={800}>
                {a}
              </Txt>
              {b ? (
                <Txt x={0} y={36} size={28} fill={it.color} weight={700}>
                  {b}
                </Txt>
              ) : null}
            </g>
            {arrows && i < items.length - 1 ? (
              <g opacity={prog(f, delay + 22, 10)} transform={`translate(${cx + ws[i] / 2 + gap / 2} ${y})`}>
                <path d="M-26 0H18" stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
                <polygon points="8,-18 32,0 8,18" fill={C.gold} />
              </g>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/* --------------------------- S14 imagination -------------------------- */
const Imagination: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = popSpring(f, fps, 6);
  return (
    <g>
      <Txt x={960} y={230} size={40} fill={C.gold} weight={800} font={FONT_DISPLAY} opacity={prog(f, 10, 12)}>
        ROOM FOR IMAGINATION
      </Txt>
      <g transform={`translate(960 540) scale(${1.8 * Math.max(0.001, s)})`}>
        <PersonIcon color={C.gold} dashed fillOpacity={0.12 + 0.06 * Math.sin(f * 0.2)} opacity={0.7 + 0.2 * Math.sin(f * 0.15)} />
      </g>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = f * 0.03 + i * 1.25;
        return <Star key={i} x={960 + Math.cos(a) * 190} y={520 + Math.sin(a) * 150} s={16 + (i % 2) * 8} rot={f * 2} opacity={0.5 + 0.5 * Math.sin(f * 0.2 + i)} />;
      })}
      <Txt x={960} y={790} size={36} fill="#d0d4dc" weight={700} opacity={prog(f, 40, 14)}>
        who they could become
      </Txt>
    </g>
  );
};

/* --------------------------- S15 split compare ------------------------ */
const SplitCompare: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const d = prog(f, 90, 40, Easing.inOut(Easing.cubic));
  return (
    <g>
      <g transform={`translate(700 450) scale(${Math.max(0.001, popSpring(f, fps, 0)) * (1.06 - 0.16 * d)})`} opacity={1 - 0.55 * d}>
        <rect x={-210} y={-260} width={420} height={520} rx={26} {...panel} stroke={C.gold} />
        <g transform="translate(0 20) scale(1.5)">
          <PersonIcon color={C.gold} dashed />
        </g>
        <Txt x={0} y={-205} size={24} fill={C.gold} weight={800}>
          WHO THEY COULD BECOME
        </Txt>
      </g>
      <g transform={`translate(1220 450) scale(${Math.max(0.001, popSpring(f, fps, 14)) * (0.94 + 0.16 * d)})`}>
        <rect x={-210} y={-260} width={420} height={520} rx={26} {...panel} stroke={C.info} strokeWidth={3 + 2 * d} />
        <g transform="translate(0 20) scale(1.5)">
          <PersonIcon color="#ffffff" fillOpacity={0.35} />
        </g>
        <Txt x={0} y={-205} size={24} fill={C.info} weight={800}>
          HOW THEY TREAT YOU NOW
        </Txt>
      </g>
    </g>
  );
};

/* --------------------------- S18 not-equal sign ----------------------- */
const NeqSign: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sh = f > 40 && f < 50 ? Math.sin(f * 2.5) * 6 : 0;
  const chip = (cx: number, a: string, b: string, col: string, delay: number) => (
    <g transform={`translate(${cx} 440) scale(${Math.max(0.001, popSpring(f, fps, delay))})`}>
      <rect x={-210} y={-90} width={420} height={180} rx={26} fill={C.panel} stroke={col} strokeWidth={4} />
      <Txt x={0} y={-6} size={34} font={FONT_DISPLAY} weight={800}>
        {a}
      </Txt>
      <Txt x={0} y={40} size={30} fill={col} weight={700}>
        {b}
      </Txt>
    </g>
  );
  return (
    <g>
      {chip(600, 'THINKING ABOUT', 'THEM CONSTANTLY', C.info, 0)}
      {chip(1320, "PROOF THEY'RE", 'RIGHT FOR YOU', C.gold, 20)}
      <g
        transform={`translate(${960 + sh} 440) scale(${Math.max(0.001, popSpring(f, fps, 34))})`}
        stroke={C.bad}
        strokeWidth={14}
        strokeLinecap="round"
      >
        <line x1={-50} y1={-22} x2={50} y2={-22} />
        <line x1={-50} y1={22} x2={50} y2={22} />
        <line x1={-26} y1={62} x2={26} y2={-62} />
      </g>
    </g>
  );
};

/* --------------------------- S19 gears -------------------------------- */
const gearPts = (r: number, teeth: number) => {
  const n = teeth * 4;
  return Array.from({length: n})
    .map((_, i) => {
      const a = (i / n) * Math.PI * 2;
      const rr = i % 4 < 2 ? r : r * 0.8;
      return `${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`;
    })
    .join(' ');
};

const Gears: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const heat = interpolateColors(prog(f, 0, 150), [0, 1], ['#5c7cfa', '#ff6b4a']);
  const spin = f * (1 + f / 80) * 1.2;
  const g = (x: number, y: number, r: number, t: number, ang: number) => (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <polygon points={gearPts(r, t)} fill={heat} stroke="#ffffff" strokeOpacity={0.4} strokeWidth={3} />
      <circle r={r * 0.28} fill="#0d162d" />
    </g>
  );
  return (
    <g>
      {g(860, 430, 120, 12, spin)}
      {g(1060, 500, 85, 9, -spin * (120 / 85))}
      {g(1000, 345, 65, 7, spin * (120 / 65))}
      <Txt x={960} y={215} size={44} fill={C.bad} weight={800} font={FONT_DISPLAY} opacity={prog(f, 8, 8) * (0.65 + 0.35 * Math.sin(f * 0.4))}>
        MIND ON OVERTIME
      </Txt>
      <g transform={`translate(960 700) scale(${Math.max(0.001, popSpring(f, fps, 80))})`}>
        <rect x={-210} y={-40} width={420} height={80} rx={40} fill={C.panel} stroke={C.gold} strokeWidth={4} />
        <Txt x={0} y={13} size={36} fill={C.gold} weight={800}>
          it needs CLARITY
        </Txt>
      </g>
    </g>
  );
};

/* --------------------------- S22 spark to clarity --------------------- */
const SparkToClarity: React.FC = () => {
  const f = useCurrentFrame();
  const a = 1 - prog(f, 60, 14);
  const b = prog(f, 60, 14);
  const starPts = Array.from({length: 24})
    .map((_, i) => {
      const ang = (i / 24) * Math.PI * 2;
      const r = i % 2 ? 55 : 110;
      return `${Math.cos(ang) * r},${Math.sin(ang) * r}`;
    })
    .join(' ');
  const sway = Math.sin(f * 0.06) * 10;
  return (
    <g>
      <g opacity={a} transform={`translate(960 430) scale(${1 + 0.08 * Math.sin(f * 0.3)}) rotate(${f * 1.5})`}>
        <polygon points={starPts} fill={C.pink} stroke={C.gold} strokeWidth={5} />
      </g>
      <Txt x={960} y={650} size={40} fill={C.pink} weight={800} font={FONT_DISPLAY} opacity={a}>
        ATTRACTION
      </Txt>
      <g opacity={b}>
        <g transform={`rotate(${sway} 960 365)`}>
          <polygon points="960,365 1560,290 1560,440" fill="rgba(255,240,170,0.2)" />
          <polygon points="960,365 360,290 360,440" fill="rgba(255,240,170,0.2)" />
        </g>
        <ellipse cx={960} cy={720} rx={140} ry={34} fill="#2a2f45" />
        <polygon points="930,700 990,700 978,390 942,390" fill="#f4f4f6" />
        <polygon points="937,590 983,590 986,640 934,640" fill="#d9383a" />
        <polygon points="941,470 979,470 981,510 939,510" fill="#d9383a" />
        <rect x={938} y={350} width={44} height={40} rx={6} fill={C.gold} opacity={0.7 + 0.3 * Math.sin(f * 0.3)} />
        <polygon points="934,350 986,350 960,318" fill="#d9383a" />
        <Txt x={960} y={790} size={40} fill={C.gold} weight={800} font={FONT_DISPLAY}>
          CLARITY
        </Txt>
      </g>
    </g>
  );
};

/* --------------------------- S23 comment card ------------------------- */
const CommentCard: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = popSpring(f, fps, 10);
  return (
    <g>
      <g opacity={prog(f, 0, 12)}>
        <rect x={250} y={196} width={1420} height={92} rx={22} fill="rgba(8,10,16,0.93)" stroke="rgba(230,201,58,0.55)" strokeWidth={2} />
        <Txt x={960} y={250} size={40} font={FONT_DISPLAY} weight={800}>
          What&apos;s one sign of a healthy connection you value?
        </Txt>
      </g>
      <g transform={`translate(960 450) scale(${Math.max(0.001, s)})`}>
        <rect x={-400} y={-90} width={800} height={190} rx={22} fill="#f4f4f6" />
        <Txt x={-370} y={-52} size={22} fill="#5b6070" weight={700} anchor="start">
          Comments
        </Txt>
        <circle cx={-340} cy={20} r={32} fill={C.charcoal} />
        <circle cx={-330} cy={14} r={5} fill="#fff" />
        <circle cx={-310} cy={14} r={5} fill="#fff" />
        <Txt x={-285} y={30} size={30} fill="#8a8f9e" weight={500} anchor="start">
          Add a comment
        </Txt>
        {Math.floor(f / 15) % 2 === 0 ? <rect x={-60} y={2} width={3} height={36} fill="#1e1e24" /> : null}
        <line x1={-285} y1={52} x2={360} y2={52} stroke="#c8ccd6" strokeWidth={2} />
      </g>
      {[0, 1, 2].map((i) => {
        const t = (f * 1.1 + i * 40) % 120;
        return <Heart key={i} x={1130 + i * 60} y={620 - t * 2.2} s={0.7} opacity={Math.sin((Math.PI * t) / 120)} />;
      })}
    </g>
  );
};

/* ================================================================== *
 * STYLE-PACK widgets restored for future episodes
 * ================================================================== */

/** Falling wooden-block title drop (STYLE-PACK `wooden_block_title`). */
const WoodenBlockTitle: React.FC<{blocksWord?: string; topBanner?: string; bottomWord?: string; handwrittenNote?: string}> = ({
  blocksWord = 'REPOPULATE',
  topBanner = 'COULD 2 PEOPLE ACTUALLY',
  bottomWord = 'EARTH?',
  handwrittenNote = '...seriously?',
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const letters = blocksWord.split('');
  const totalW = letters.length * 118;
  const startX = 960 - totalW / 2 + 59;
  const banner = popSpring(f, fps, 0);
  const colors = ['#ef5350', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#26a69a', '#ec407a', '#5c6bc0', '#ffca28', '#8d6e63'];
  return (
    <g>
      <g transform={`translate(960 425) scale(${Math.max(0.001, banner)})`}>
        <rect x={-450} y={-45} width={900} height={82} rx={12} fill="#f8f9fa" />
        <text x={0} y={12} textAnchor="middle" fill="#2b2b30" fontSize={40} fontWeight={800} letterSpacing={4} fontFamily={FONT_DISPLAY}>
          {topBanner}
        </text>
      </g>
      {letters.map((char, i) => (
        <WoodenBlock key={`${char}-${i}`} letter={char} color={colors[i % colors.length]} x={startX + i * 118} y={860} delayFrames={8 + i * 3} />
      ))}
      {f > 42 ? (
        <g>
          <text x={960} y={1010} textAnchor="middle" fill="#f8f9fa" fontSize={56} fontWeight={800} letterSpacing={5} fontFamily={FONT_DISPLAY}>
            {bottomWord}
          </text>
          <text x={1350} y={1010} fill={C.gold} fontSize={38} fontFamily={FONT_CHALK} transform="rotate(-8, 1350, 1010)">
            {handwrittenNote}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** Chalkboard exponential tree (STYLE-PACK `chalk_exponential_tree`). */
const ChalkExponentialTree: React.FC<{headerLeft?: string; headerRight?: string; rows?: number}> = ({
  headerLeft = '8 kids per couple',
  headerRight = '× 4 every generation',
  rows = 4,
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <text x={450} y={230} fill={C.chalk} fontSize={40} fontFamily={FONT_CHALK}>
        {headerLeft}
      </text>
      {f > 30 ? (
        <text x={1050} y={230} fill={C.chalkGold} fontSize={40} fontFamily={FONT_CHALK}>
          {headerRight}
        </text>
      ) : null}
      {Array.from({length: rows}).map((_, rIdx) => {
        const appearFrame = 45 + rIdx * 30;
        if (f < appearFrame) return null;
        const displayDots = Math.min(Math.pow(4, rIdx + 1), 32);
        const yPos = 300 + rIdx * 95;
        const spanW = 220 + rIdx * 240;
        return (
          <g key={rIdx}>
            {Array.from({length: displayDots}).map((__, nIdx) => {
              const nx = 960 - spanW / 2 + (nIdx / Math.max(1, displayDots - 1)) * spanW;
              return (
                <g key={nIdx} transform={`translate(${nx}, ${yPos})`}>
                  <circle cx={0} cy={-16} r={8} stroke={C.chalk} strokeWidth={2.5} fill="none" />
                  <line x1={0} y1={-8} x2={0} y2={16} stroke={C.chalk} strokeWidth={2.5} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

/** Maternal / paternal gene columns (STYLE-PACK `gene_pair_columns`). */
const GenePairColumns: React.FC<{leftLabel?: string; rightLabel?: string; brokenIndex?: number; noteText?: string}> = ({
  leftLabel = 'FROM MOM',
  rightLabel = 'FROM DAD',
  brokenIndex = 2,
  noteText = 'covers for it',
}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <g transform="translate(825 235)">
        <text x={0} y={-28} textAnchor="middle" fill={C.purple} fontSize={22} fontWeight={700} fontFamily={FONT_UI}>
          {leftLabel}
        </text>
        <rect x={-44} y={0} width={88} height={520} rx={44} fill="rgba(126,87,194,0.25)" stroke={C.purple} strokeWidth={2} />
        {Array.from({length: 6}).map((_, i) => {
          const broken = i === brokenIndex && f > 45;
          return (
            <g key={i} transform={`translate(0, ${52 + i * 82})`}>
              <circle cx={0} cy={0} r={26} fill={broken ? '#2a2f45' : '#d2c8f5'} stroke={broken ? '#ffffff' : 'none'} strokeWidth={2} />
              {broken ? <path d="M-6 -18 L4 -4 L-4 6 L6 18" stroke="#ffffff" strokeWidth={2.5} fill="none" /> : null}
            </g>
          );
        })}
      </g>
      <g transform="translate(1085 235)">
        <text x={0} y={-28} textAnchor="middle" fill={C.teal} fontSize={22} fontWeight={700} fontFamily={FONT_UI}>
          {rightLabel}
        </text>
        <rect x={-44} y={0} width={88} height={520} rx={44} fill="rgba(38,166,154,0.25)" stroke={C.teal} strokeWidth={2} />
        {Array.from({length: 6}).map((_, i) => (
          <circle key={i} cx={0} cy={52 + i * 82} r={26} fill="#c8fcf9" />
        ))}
      </g>
      {f > 65 ? (
        <g transform={`translate(1155, ${235 + 52 + brokenIndex * 82})`}>
          <line x1={85} y1={0} x2={5} y2={0} stroke="#f59f00" strokeWidth={3} />
          <polygon points="0,0 12,-6 12,6" fill="#f59f00" />
          <text x={100} y={8} fill="#f59f00" fontSize={32} fontFamily={FONT_CHALK}>
            {noteText}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** Red diversity toolbox (STYLE-PACK `red_toolbox_diversity`). */
const RedToolbox: React.FC<{equationText?: string}> = ({equationText = '2 people × 2 copies each'}) => {
  const f = useCurrentFrame();
  return (
    <g>
      <g transform={`translate(960 610)`}>
        {[
          {x: -200, d: 10, body: <g><rect x={-12} y={-80} width={24} height={160} rx={6} fill="#adb5bd" /><circle cx={0} cy={-90} r={32} fill="#adb5bd" /></g>},
          {
            x: -65,
            d: 16,
            body: (
              <g>
                <rect x={-10} y={-70} width={20} height={150} fill="#d4a36a" />
                <rect x={-48} y={-95} width={96} height={36} rx={6} fill="#868e96" />
              </g>
            ),
          },
          {
            x: 65,
            d: 22,
            body: (
              <g>
                <rect x={-5} y={-110} width={10} height={90} fill="#ced4da" />
                <rect x={-18} y={-30} width={36} height={95} rx={10} fill="#fcc419" />
              </g>
            ),
          },
          {
            x: 195,
            d: 28,
            body: <path d="M -22 65 L -4 -30 M 22 65 L 4 -30" stroke="#339af0" strokeWidth={16} strokeLinecap="round" />,
          },
        ].map((tool, i) => (
          <g key={i} transform={`translate(${tool.x}, ${interpolate(f, [tool.d, tool.d + 18], [80, -140], clamp)})`}>
            {tool.body}
          </g>
        ))}
        <polygon points="-320,-60 -275,-125 275,-125 320,-60" fill="#9e2a2b" />
        <rect x={-320} y={-60} width={640} height={155} rx={12} fill="#d9483b" />
      </g>
      {f > 48 ? (
        <text x={960} y={405} textAnchor="middle" fill="#2b2b30" fontSize={40} fontFamily={FONT_CHALK}>
          {equationText}
        </text>
      ) : null}
    </g>
  );
};

/** Minimal outro-safe starship + crew counter card. */
const CrewShip: React.FC<{label?: string}> = ({label = 'MINIMUM STARTING CREW: 98'}) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 90, Easing.inOut(Easing.quad));
  return (
    <g>
      <StarshipProp x={420 + p * 1080} y={250 - Math.sin(p * Math.PI) * 60} rotation={p * 8} scale={1.1} />
      <Txt x={960} y={150} size={34} fill={C.gold} weight={800} font={FONT_DISPLAY} opacity={prog(f, 20, 16)}>
        {label}
      </Txt>
    </g>
  );
};

const REGISTRY: Record<string, React.FC<any>> = {
  chat_bubbles: ChatBubbles,
  phone_seen: PhoneSeen,
  certainty_meter: CertaintyMeter,
  msg_vs_chat: MsgVsChat,
  chemistry_eq: ChemistryEq,
  clue_search: ClueSearch,
  replay_list: ReplayList,
  detail_orbit: DetailOrbit,
  silence_message: SilenceMessage,
  relief_burst: ReliefBurst,
  swing_wave: SwingWave,
  chalk_text: ChalkText,
  chips: Chips,
  imagination: Imagination,
  split_compare: SplitCompare,
  neq_sign: NeqSign,
  gears: Gears,
  spark_to_clarity: SparkToClarity,
  comment_card: CommentCard,
  // STYLE-PACK widgets
  wooden_block_title: WoodenBlockTitle,
  chalk_exponential_tree: ChalkExponentialTree,
  gene_pair_columns: GenePairColumns,
  red_toolbox_diversity: RedToolbox,
  crew_ship: CrewShip,
};

export const widgetRegistry = Object.keys(REGISTRY);

export const InfographicWidgets: React.FC<{widget?: WidgetConfig}> = ({widget}) => {
  if (!widget || widget.type === 'none') return null;
  const W = REGISTRY[widget.type];
  if (!W) return null;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      <W {...(widget.props ?? {})} />
    </svg>
  );
};
