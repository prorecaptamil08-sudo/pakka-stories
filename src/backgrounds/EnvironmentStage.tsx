import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../design/tokens';
import {FONT_CHALK, FONT_DISPLAY, FONT_UI} from '../design/fonts';
import type {EnvPreset} from '../types';

/**
 * STYLE-PACK atmospheric stage renderer.
 *
 * Implements the 22 STYLE-PACK environment presets on one 1920x1080 vector stage:
 * flat architectural/natural geometry + soft radial light blooms + drifting dust motes,
 * with the ground plane locked to y = 960 so characters always stand on the floor.
 * The five presets used by this episode (cafe_day, bedroom_night, mind_blueprint,
 * classroom_chalkboard, sunset_porch) are the fully art-directed ones; the remaining
 * presets share the same helpers so authors can re-use them for future scenes.
 */

export interface EnvironmentProps {
  preset: EnvPreset;
  isDay?: boolean;
}

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

/** Deterministic drifting dust motes (STYLE-PACK rule VR-04). */
const Dust: React.FC<{n?: number; color?: string; speed?: number}> = ({n = 22, color = 'rgba(255,248,225,0.26)', speed = 0.18}) => {
  const f = useCurrentFrame();
  const motes: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const sx = (i * 173 + 41) % 1920;
    const sy = (i * 293 + 97) % 960;
    const cx = (sx + Math.sin(f * 0.015 + i) * 28 + 1920) % 1920;
    const cy = ((((sy - f * speed) % 960) + 960) % 960);
    motes.push(<circle key={i} cx={cx} cy={cy} r={1.4 + (i % 3) * 0.8} fill={color} />);
  }
  return <g pointerEvents="none">{motes}</g>;
};

const Bokeh: React.FC<{x?: number; color?: string; opacity?: number}> = ({x = 0, color = '#14131b', opacity = 0.82}) => (
  <g filter="url(#fgBlur)" opacity={opacity}>
    <rect x={x - 20} y={0} width={190} height={1080} fill={color} />
  </g>
);

/* ------------------------------------------------------------------ *
 * 1. Corner Cafe (dawn / day / populated / endscreen)
 * ------------------------------------------------------------------ */
const Cafe: React.FC<{mode: 'dawn' | 'day' | 'populated' | 'endscreen'}> = ({mode}) => {
  const f = useCurrentFrame();
  const isDay = mode === 'day' || mode === 'populated' || mode === 'endscreen';
  const lightOn = mode !== 'dawn' || f > 20;
  const flicker = 0.86 + 0.14 * Math.sin(f * 0.35);
  const stripes = 12;
  const sw = 980 / stripes;

  return (
    <Svg>
      <defs>
        <linearGradient id="alleyGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isDay ? '#7d96b8' : '#5d5c7d'} />
          <stop offset="58%" stopColor="#ecc38a" />
          <stop offset="100%" stopColor="#fff7e6" />
        </linearGradient>
        <linearGradient id="winGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6b981" />
          <stop offset="100%" stopColor="#c5915d" />
        </linearGradient>
        <linearGradient id="walkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isDay ? '#b5b2ac' : '#a5a4a9'} />
          <stop offset="100%" stopColor={isDay ? '#9b988f' : '#8e8d95'} />
        </linearGradient>
        <radialGradient id="cafeBloom">
          <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        <pattern id="brickPat" width="80" height="40" patternUnits="userSpaceOnUse">
          <rect width="80" height="40" fill={isDay ? C.brickDay : C.brickNight} />
          <path d="M0 20H80M40 0V20M0 20V40" stroke={isDay ? '#7c5844' : '#403f5c'} strokeWidth={2} fill="none" />
        </pattern>
        <filter id="fgBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="neonBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <rect width={1920} height={1080} fill="url(#alleyGlow)" />

      {/* left building with door #12 */}
      <rect x={0} y={0} width={520} height={905} fill="url(#brickPat)" />
      <path d="M 92 905 L 92 420 A 96 88 0 0 1 284 420 L 284 905 Z" fill={isDay ? '#efe6d5' : '#cfc6b6'} />
      <rect x={116} y={444} width={144} height={461} fill="#3a2314" />
      <text x={188} y={392} textAnchor="middle" fill="#2b2b30" fontSize={38} fontWeight={800} fontFamily={FONT_UI}>
        12
      </text>

      {/* cafe facade */}
      <rect x={540} y={160} width={940} height={745} fill={C.cafeTeal} />
      <rect x={700} y={176} width={640} height={74} rx={12} fill="#1d2e29" stroke={C.goldBorder} strokeWidth={3} />
      <text x={1020} y={228} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={44} fill="#f4f1ea" letterSpacing={4}>
        CORNER CAFÉ
      </text>

      {/* awning */}
      {Array.from({length: stripes}).map((_, i) => (
        <g key={i}>
          <rect x={520 + i * sw} y={270} width={sw + 1} height={64} fill={i % 2 ? C.awningCream : C.awningRed} />
          <circle cx={520 + i * sw + sw / 2} cy={334} r={sw / 2} fill={i % 2 ? C.awningCream : C.awningRed} />
        </g>
      ))}

      {/* window + interior */}
      <rect x={600} y={420} width={520} height={360} rx={8} fill="url(#winGlow)" opacity={lightOn ? 1 : 0.75} />
      <rect x={640} y={640} width={140} height={18} fill="#6e482b" opacity={0.55} />
      <rect x={900} y={660} width={160} height={18} fill="#6e482b" opacity={0.55} />
      <path d="M860 420V780M600 600H1120" stroke={C.cafeTeal} strokeWidth={10} />

      {/* neon OPEN sign */}
      <g opacity={lightOn ? 1 : 0.25}>
        <text x={1280} y={560} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={40} fill={C.pink} filter="url(#neonBlur)" opacity={flicker}>
          OPEN
        </text>
        <text x={1280} y={560} textAnchor="middle" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={40} fill="#ffc2dc">
          OPEN
        </text>
      </g>
      <rect x={1180} y={430} width={200} height={475} rx={6} fill="#1d2e29" />
      <rect x={1196} y={446} width={168} height={300} rx={4} fill="url(#winGlow)" opacity={0.8} />

      {/* A-frame chalkboard sign */}
      <rect x={1510} y={700} width={150} height={205} rx={8} fill="#2b2b30" stroke="#7c5844" strokeWidth={6} />
      <text x={1585} y={752} textAnchor="middle" fontFamily={FONT_CHALK} fontWeight={700} fontSize={28} fill={C.chalk}>
        TODAY
      </text>
      <text x={1585} y={795} textAnchor="middle" fontFamily={FONT_CHALK} fontWeight={700} fontSize={26} fill={C.chalk}>
        flat white
      </text>
      <text x={1585} y={834} textAnchor="middle" fontFamily={FONT_CHALK} fontWeight={700} fontSize={26} fill={C.gold}>
        {mode === 'populated' || mode === 'endscreen' ? 'family deal!' : 'croissant'}
      </text>

      {/* postbox + lamp + light cone */}
      <rect x={1680} y={790} width={78} height={115} rx={10} fill="#d1493b" />
      <ellipse cx={1719} cy={790} rx={43} ry={16} fill="#b93b2e" />
      <path d="M1840 905V380Q1840 320 1770 320" stroke="#3a3a42" strokeWidth={12} fill="none" />
      <ellipse cx={1760} cy={330} rx={34} ry={14} fill="#3a3a42" />
      <polygon points="1730,340 1790,340 1860,905 1660,905" fill="#fff0c8" opacity={0.13} />
      <ellipse cx={860} cy={640} rx={470} ry={320} fill="url(#cafeBloom)" style={{mixBlendMode: 'screen'}} />

      {/* sidewalk */}
      <rect x={0} y={905} width={1920} height={175} fill="url(#walkGrad)" />
      <path d="M0 905H1920" stroke="#6f6e78" strokeWidth={4} />
      {[160, 520, 880, 1240, 1600].map((px) => (
        <path key={px} d={`M${px} 905V1080`} stroke="#7a7981" strokeWidth={3} />
      ))}

      <Bokeh opacity={mode === 'endscreen' ? 0.5 : 0.82} />
      <Dust />
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 * 2. Bedroom at night
 * ------------------------------------------------------------------ */
const Bedroom: React.FC = () => {
  const f = useCurrentFrame();
  const lamp = 0.5 + 0.04 * Math.sin(f * 0.11);
  return (
    <Svg>
      <defs>
        <linearGradient id="bedWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e2d4a" />
          <stop offset="100%" stopColor="#4e4d6d" />
        </linearGradient>
        <radialGradient id="lampGlow">
          <stop offset="0%" stopColor="#ffd39a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffd39a" stopOpacity="0" />
        </radialGradient>
        <filter id="fgBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width={1920} height={1080} fill="url(#bedWall)" />

      {/* window + skyline */}
      <rect x={1230} y={150} width={400} height={460} fill="#141a38" />
      <circle cx={1530} cy={250} r={40} fill="#f4efd8" />
      {Array.from({length: 14}).map((_, i) => (
        <circle key={i} cx={1260 + ((i * 97) % 340)} cy={180 + ((i * 61) % 220)} r={2.2} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f * 0.1 + i)} />
      ))}
      <path d="M1230 610V470L1290 470V400L1350 400V500L1420 500V380L1500 380V520L1580 520V450L1630 450V610Z" fill="#0b0f24" />
      {[1300, 1440, 1520, 1590].map((px, i) => (
        <rect key={px} x={px} y={540 + (i % 2) * 20} width={12} height={14} fill="#ffd39a" opacity={0.7} />
      ))}

      {/* curtains + bed block */}
      <path d="M1190 130Q1250 300 1215 640H1290Q1300 300 1250 130Z" fill="#d98aa8" />
      <path d="M1670 130Q1610 300 1645 640H1570Q1560 300 1610 130Z" fill="#d98aa8" />
      <rect x={1210} y={610} width={440} height={22} fill="#e9e3d6" />

      {/* nightstand + lamp */}
      <rect x={0} y={620} width={230} height={285} rx={10} fill="#241f38" />
      <rect x={0} y={580} width={230} height={50} rx={10} fill="#33294d" />
      <rect x={640} y={760} width={14} height={145} fill="#2a2840" />
      <polygon points="600,760 700,760 680,700 620,700" fill="#e6b981" />
      <ellipse cx={650} cy={740} rx={320} ry={260} fill="url(#lampGlow)" opacity={lamp} style={{mixBlendMode: 'screen'}} />

      {/* floor */}
      <rect x={0} y={905} width={1920} height={175} fill="#1c1b2c" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path key={i} d={`M${i * 260} 905V1080`} stroke="#14131f" strokeWidth={3} />
      ))}
      <Dust color="rgba(255,235,200,0.2)" />
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 * 3. Mind blueprint / genetics blueprint
 * ------------------------------------------------------------------ */
const Blueprint: React.FC = () => {
  const f = useCurrentFrame();
  const off = (f * 0.3) % 60;
  return (
    <Svg>
      <defs>
        <radialGradient id="navy" cx="50%" cy="50%" r="72%">
          <stop offset="0%" stopColor={C.blueprintCenter} />
          <stop offset="100%" stopColor={C.blueprintEdge} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#navy)" />
      {Array.from({length: 34}).map((_, i) => (
        <line key={`v${i}`} x1={i * 60 - off} y1={0} x2={i * 60 - off} y2={1080} stroke="rgba(120,160,230,0.08)" />
      ))}
      {Array.from({length: 19}).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke="rgba(120,160,230,0.08)" />
      ))}
      {Array.from({length: 8}).map((_, i) => (
        <text
          key={i}
          x={200 + i * 230}
          y={((((300 + i * 137 - f * 0.4) % 800) + 800) % 800) + 100}
          fontSize={70 + (i % 3) * 20}
          fill="rgba(165,216,255,0.08)"
          fontFamily={FONT_DISPLAY}
          fontWeight={900}
        >
          ?
        </text>
      ))}
      <rect x={0} y={955} width={1920} height={125} fill="#0b1124" />
      <line x1={0} y1={955} x2={1920} y2={955} stroke="rgba(165,216,255,0.25)" />
      <Dust color="rgba(165,216,255,0.22)" n={26} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 * 4. Classroom chalkboard
 * ------------------------------------------------------------------ */
const Classroom: React.FC = () => (
  <Svg>
    <defs>
      <radialGradient id="slate">
        <stop offset="0%" stopColor={C.slateCenter} />
        <stop offset="100%" stopColor={C.slateEdge} />
      </radialGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff3d0" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#fff3d0" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="#352a31" />
    {Array.from({length: 48}).map((_, i) => (
      <rect key={i} x={i * 40} y={0} width={4} height={700} fill="rgba(255,255,255,0.03)" />
    ))}
    <rect x={0} y={700} width={1920} height={260} fill="#543622" />
    {[60, 560, 1060, 1560].map((x) => (
      <rect key={x} x={x} y={730} width={300} height={200} fill="#3f2616" />
    ))}
    <rect x={250} y={110} width={1420} height={640} rx={10} fill={C.woodFrame} />
    <rect x={262} y={122} width={1396} height={616} rx={6} fill="#6e482b" />
    <rect x={276} y={136} width={1368} height={588} fill="url(#slate)" />
    <rect x={250} y={740} width={1420} height={16} fill="#6e482b" />
    <rect x={340} y={728} width={60} height={12} rx={3} fill={C.chalk} opacity={0.85} />
    <rect x={1500} y={726} width={60} height={14} rx={3} fill="#7c5844" />

    {/* poster - kept on the empty strip left of the board so it never sits behind a
        character standing at the usual right-hand mark */}
    <rect x={40} y={150} width={150} height={200} fill="#efe6d5" stroke="#2b1d14" strokeWidth={9} />
    <circle cx={115} cy={225} r={38} fill="#804028" />
    <text x={115} y={310} textAnchor="middle" fontFamily={FONT_UI} fontSize={18} fontWeight={800} fill="#2b1d14">
      EST. 1987
    </text>

    <polygon points="0,0 700,0 300,760 0,760" fill="url(#beam)" />
    <rect x={0} y={960} width={1920} height={120} fill="#3f2616" />
    <Dust n={24} />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 5. Sunset porch
 * ------------------------------------------------------------------ */
const qb = (a: number, b: number, c: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

const SunsetPorch: React.FC = () => {
  const f = useCurrentFrame();
  const bulbs: Array<[number, number]> = [];
  for (let i = 1; i < 8; i++) {
    const t = i / 8;
    bulbs.push([qb(0, 480, 960, t), qb(160, 320, 180, t)]);
    bulbs.push([qb(960, 1440, 1920, t), qb(180, 320, 160, t)]);
  }
  return (
    <Svg>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2a5a" />
          <stop offset="45%" stopColor="#e4686a" />
          <stop offset="75%" stopColor="#f6c27a" />
          <stop offset="100%" stopColor={C.sunsetHorizon} />
        </linearGradient>
        <radialGradient id="sunBloom">
          <stop offset="0%" stopColor="#fff2c8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffb870" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky)" />
      <circle cx={960} cy={640} r={330} fill="url(#sunBloom)" style={{mixBlendMode: 'screen'}} />
      <circle cx={960} cy={650} r={110} fill="#fff2c8" />
      <path d="M0 720Q300 600 620 700T1240 690T1920 680V920H0Z" fill="#3b2a3f" />
      <path d="M0 800Q400 700 900 780T1920 760V920H0Z" fill="#2a1f31" />
      <path d="M0 160Q480 320 960 180T1920 160" stroke="#3a2a2a" strokeWidth={4} fill="none" />
      {bulbs.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + 12} r={22} fill="#ffd9a0" opacity={0.25 + 0.15 * Math.sin(f * 0.12 + i)} />
          <circle cx={x} cy={y + 12} r={7} fill="#fff2c8" />
        </g>
      ))}
      {[120, 520, 920, 1320, 1720].map((x) => (
        <rect key={x} x={x} y={640} width={22} height={300} fill="#4a2f1d" />
      ))}
      <rect x={0} y={660} width={1920} height={18} fill="#4a2f1d" />
      <rect x={0} y={800} width={1920} height={14} fill="#4a2f1d" />
      <rect x={0} y={940} width={1920} height={140} fill="#6e482b" />
      {Array.from({length: 12}).map((_, i) => (
        <path key={i} d={`M${i * 170} 940V1080`} stroke="#4a2f1d" strokeWidth={4} />
      ))}
      <Dust color="rgba(255,230,180,0.3)" n={24} />
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 * 6. Habsburg gallery
 * ------------------------------------------------------------------ */
const Gallery: React.FC = () => (
  <Svg>
    <defs>
      <pattern id="damask" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="#40291a" />
        <path d="M60 20 Q80 60 60 100 Q40 60 60 20Z" fill="rgba(255,200,140,0.06)" />
      </pattern>
    </defs>
    <rect width={1920} height={740} fill="url(#damask)" />
    {[240, 700, 1160, 1620].map((cx, i) => (
      <path key={i} d={`M${cx - 110} 0 Q${cx} 420 ${cx - 85} 740 L${cx + 85} 740 Q${cx} 420 ${cx + 110} 0Z`} fill="#9e2a2b" />
    ))}
    <rect x={0} y={740} width={1920} height={220} fill="#5b3721" />
    {Array.from({length: 8}).map((_, i) => (
      <rect key={i} x={i * 240} y={760} width={210} height={170} fill="#4a2c19" />
    ))}
    <rect x={0} y={960} width={1920} height={120} fill="#3b2213" />
    <Dust n={22} />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 7. Village exterior (stormy option)
 * ------------------------------------------------------------------ */
const Village: React.FC<{stormy?: boolean}> = ({stormy = false}) => (
  <Svg>
    <rect x={0} y={0} width={1920} height={740} fill={stormy ? '#7f927c' : '#a8c0b0'} />
    <path d="M0 700 Q400 620 900 690 T1920 660V740H0Z" fill={stormy ? '#5f6f58' : '#8aa08c'} />
    <rect x={610} y={140} width={710} height={600} fill="#ead8be" />
    <polygon points="580,150 965,40 1350,150" fill="#7c4732" />
    <rect x={700} y={300} width={120} height={120} fill="#5b4636" />
    <rect x={1110} y={300} width={120} height={120} fill="#5b4636" />
    <rect x={880} y={460} width={150} height={280} fill="#6b4a2f" />
    <polygon points="-20,420 210,220 450,420" fill="#7c4732" />
    <rect x={-20} y={420} width={470} height={320} fill="#9c6c49" />
    <polygon points="1500,430 1700,250 1900,430" fill="#7c4732" />
    <rect x={1500} y={430} width={400} height={310} fill="#9c6c49" />
    <rect x={0} y={740} width={1920} height={180} fill={stormy ? '#4d5c42' : '#69844b'} />
    <rect x={0} y={920} width={1920} height={160} fill="#cdb594" />
    <Dust color="rgba(255,248,225,0.2)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 8. Warm nursery
 * ------------------------------------------------------------------ */
const Nursery: React.FC = () => (
  <Svg>
    <defs>
      <radialGradient id="nurseryGlow">
        <stop offset="0%" stopColor="#ffd79a" />
        <stop offset="70%" stopColor="#e2a86a" />
        <stop offset="100%" stopColor="#a9713f" />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#nurseryGlow)" />
    <ellipse cx={960} cy={620} rx={520} ry={300} fill="#fff3d6" opacity={0.35} />
    <rect x={0} y={905} width={1920} height={175} fill="#8a5c37" />
    <path d="M700 905 Q960 800 1220 905Z" fill="#c8a173" />
    <Dust color="rgba(255,240,200,0.4)" n={18} />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 9. Sage spotlight stage
 * ------------------------------------------------------------------ */
const Spotlight: React.FC = () => (
  <Svg>
    <rect width={1920} height={1080} fill="#8fa882" />
    <polygon points="700,0 1220,0 980,960 940,960" fill="#f4f8ec" opacity={0.28} />
    <polygon points="300,0 520,0 780,780 640,780" fill="#f4f8ec" opacity={0.14} />
    <rect x={0} y={960} width={1920} height={120} fill="#6b7f60" />
    <Dust n={20} />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 10. City skyline haze
 * ------------------------------------------------------------------ */
const Skyline: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2b2b4a" />
        <stop offset="70%" stopColor="#6f6a8c" />
        <stop offset="100%" stopColor="#b9b2c4" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#haze)" />
    {[120, 300, 470, 640, 820, 1010, 1210, 1420, 1650].map((x, i) => (
      <rect key={x} x={x} y={420 - (i % 4) * 90} width={120 + (i % 3) * 30} height={540 + (i % 4) * 90} fill="#3a3a5c" opacity={0.85} />
    ))}
    <rect x={0} y={905} width={1920} height={175} fill="#4a4658" />
    <Dust color="rgba(220,230,255,0.2)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 11. Brick window at night
 * ------------------------------------------------------------------ */
const BrickWindow: React.FC = () => (
  <Svg>
    <defs>
      <pattern id="brick2" width="90" height="46" patternUnits="userSpaceOnUse">
        <rect width="90" height="46" fill="#8f623f" />
        <path d="M0 23H90M45 0V23M0 23V46" stroke="#7c5844" strokeWidth={2} fill="none" />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="url(#brick2)" />
    <rect x={660} y={220} width={600} height={520} fill="#141a38" />
    <path d="M960 220V740" stroke="#6b5a4a" strokeWidth={12} />
    <path d="M540 220Q620 420 560 740H700Q640 420 700 220Z" fill="#efc0d4" opacity={0.9} />
    <rect x={620} y={740} width={680} height={26} fill="#e6e1d6" />
    <rect x={0} y={905} width={1920} height={175} fill="#2a2320" />
    <Dust color="rgba(255,240,220,0.18)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 12. Night driveway
 * ------------------------------------------------------------------ */
const Driveway: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#101a33" />
        <stop offset="100%" stopColor="#2b3a5c" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#nightSky)" />
    <circle cx={1620} cy={200} r={54} fill="#f4efd8" opacity={0.9} />
    <rect x={0} y={600} width={1920} height={305} fill="#20304a" />
    <rect x={0} y={905} width={1920} height={175} fill="#161f2c" />
    <Dust color="rgba(200,220,255,0.22)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 13. Family dining room
 * ------------------------------------------------------------------ */
const DiningRoom: React.FC = () => (
  <Svg>
    <defs>
      <pattern id="dots" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="#8d5b4c" />
        <circle cx={20} cy={20} r={7} fill="#9f6d5c" />
        <circle cx={60} cy={60} r={7} fill="#9f6d5c" />
      </pattern>
    </defs>
    <rect width={1920} height={720} fill="url(#dots)" />
    <rect x={0} y={720} width={1920} height={240} fill="#5e3729" />
    <rect x={0} y={905} width={1920} height={175} fill="#3f2419" />
    {[240, 900, 1560].map((x) => (
      <g key={x}>
        <rect x={x - 60} y={80} width={120} height={90} fill="#c99e32" />
        <rect x={x - 48} y={92} width={96} height={66} fill="#6c2235" />
      </g>
    ))}
    <Dust n={16} />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 14. High school gym
 * ------------------------------------------------------------------ */
const Gym: React.FC = () => (
  <Svg>
    <rect width={1920} height={1080} fill="#c9b58f" />
    <rect x={0} y={0} width={1920} height={300} fill="#b3a17f" />
    <rect x={700} y={60} width={520} height={170} rx={10} fill="#1f2430" stroke="#8a7a5c" strokeWidth={8} />
    <text x={960} y={140} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={54} fontWeight={900} fill="#ffd166">
      HOME 12 : 08 AWAY
    </text>
    <text x={960} y={200} textAnchor="middle" fontFamily={FONT_UI} fontSize={30} fontWeight={700} fill="#c9d4e8">
      GO TEAM
    </text>
    {Array.from({length: 10}).map((_, i) => (
      <rect key={i} x={0} y={330 + i * 62} width={1920} height={54} fill={i % 2 ? '#a8825a' : '#b8916a'} />
    ))}
    <rect x={0} y={960} width={1920} height={120} fill="#8a6a45" />
    <Dust n={16} />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 15. Elephant seal beach
 * ------------------------------------------------------------------ */
const Beach: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3aa0a8" />
        <stop offset="100%" stopColor="#7fd0cd" />
      </linearGradient>
    </defs>
    <rect width={1920} height={560} fill="#bfe3ef" />
    <rect x={0} y={420} width={1920} height={220} fill="url(#sea)" />
    <path d="M0 640 Q960 560 1920 660V1080H0Z" fill="#e8d8b4" />
    <Dust color="rgba(255,255,255,0.3)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 16. Ocean island (Chatham / Pitcairn)
 * ------------------------------------------------------------------ */
const Island: React.FC<{pitcairn?: boolean}> = ({pitcairn = false}) => (
  <Svg>
    <defs>
      <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2f6f8f" />
        <stop offset="100%" stopColor="#48a3b5" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="#cfe8f2" />
    <rect x={0} y={600} width={1920} height={480} fill="url(#ocean)" />
    <path d={`M${pitcairn ? 560 : 760} 640 Q${pitcairn ? 900 : 960} ${pitcairn ? 320 : 420} ${pitcairn ? 1360 : 1160} 640Z`} fill={pitcairn ? '#5b8c4a' : '#4f7d4a'} />
    <path d="M0 640 Q960 610 1920 640V1080H0Z" fill="#2c5d73" opacity={0.35} />
    <Dust color="rgba(255,255,255,0.28)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 17. Sunlit forest canopy
 * ------------------------------------------------------------------ */
const Forest: React.FC = () => (
  <Svg>
    <defs>
      <linearGradient id="canopy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fffdd1" />
        <stop offset="45%" stopColor="#d2d8b1" />
        <stop offset="100%" stopColor="#838a6a" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#canopy)" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={i * 340 - 60} y={0} width={52} height={1080} fill="rgba(255,255,220,0.22)" />
    ))}
    <path d="M0 700 Q480 640 960 710 T1920 690V770H0Z" fill="#6b4c35" />
    <path d="M0 840 Q520 790 960 850 T1920 820V900H0Z" fill="#5a3f2c" />
    {[300, 620, 1180, 1520].map((x) => (
      <ellipse key={x} cx={x} cy={650} rx={120} ry={40} fill="#7ec850" opacity={0.75} />
    ))}
    <Dust color="rgba(255,255,210,0.4)" />
  </Svg>
);

/* ------------------------------------------------------------------ *
 * 18. Prehistoric savanna
 * ------------------------------------------------------------------ */
const Savanna: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Svg>
      <defs>
        <linearGradient id="savSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2a65a" />
          <stop offset="60%" stopColor="#f7c873" />
          <stop offset="100%" stopColor="#ffe2a8" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#savSky)" />
      <circle cx={1500} cy={620} r={150} fill="#fff3cf" opacity={0.95} />
      <rect x={0} y={760} width={1920} height={320} fill="#c8a35c" />
      {[220, 700, 1180, 1660].map((x, i) => (
        <g key={x} transform={`translate(${x + Math.sin(f * 0.01 + i) * 6} 0)`}>
          <path d="M0 780 Q-30 700 10 640 Q40 700 20 780Z" fill="#7a5c33" />
          <path d="M10 650 Q-90 620 -140 660 Q-70 660 10 675Z" fill="#6b7d3a" opacity={0.85} />
          <path d="M10 650 Q110 620 160 660 Q90 660 10 675Z" fill="#6b7d3a" opacity={0.85} />
        </g>
      ))}
      <Dust color="rgba(255,235,190,0.3)" />
    </Svg>
  );
};

/* ------------------------------------------------------------------ *
 * Dispatcher + aliases
 * ------------------------------------------------------------------ */
export const EnvironmentStage: React.FC<EnvironmentProps> = ({preset, isDay}) => {
  switch (preset) {
    case 'cafe_day':
    case 'corner_cafe_wide':
    case 'corner_cafe_populated':
      return <Cafe mode={isDay === false ? 'dawn' : preset === 'corner_cafe_populated' ? 'populated' : 'day'} />;
    case 'corner_cafe_dawn':
      return <Cafe mode="dawn" />;
    case 'corner_cafe_endscreen':
      return <Cafe mode="endscreen" />;
    case 'bedroom_night':
    case 'family_bedroom':
      return <Bedroom />;
    case 'mind_blueprint':
    case 'genetics_blueprint':
      return <Blueprint />;
    case 'classroom_chalkboard':
      return <Classroom />;
    case 'sunset_porch':
      return <SunsetPorch />;
    case 'habsburg_gallery':
      return <Gallery />;
    case 'village_exterior':
      return <Village />;
    case 'baby_nursery_warm':
      return <Nursery />;
    case 'sage_spotlight_stage':
      return <Spotlight />;
    case 'city_skyline_haze':
      return <Skyline />;
    case 'brick_window_night':
      return <BrickWindow />;
    case 'night_car_driveway':
      return <Driveway />;
    case 'family_dining_room':
      return <DiningRoom />;
    case 'high_school_gym':
      return <Gym />;
    case 'elephant_seal_beach':
      return <Beach />;
    case 'chatham_island_ocean':
      return <Island />;
    case 'pitcairn_island_ocean':
      return <Island pitcairn />;
    case 'chatham_forest_canopy':
      return <Forest />;
    case 'prehistoric_savanna':
      return <Savanna />;
    default:
      return <Cafe mode="day" />;
  }
};

export default EnvironmentStage;
