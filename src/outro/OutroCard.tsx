import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {EnvironmentStage} from '../backgrounds/EnvironmentStage';
import {C} from '../design/tokens';
import {FONT_DISPLAY, FONT_UI} from '../design/fonts';
import {clamp, prog} from '../motion/anim';

/**
 * Separate 3 second (90 frame) outro card, rendered after the 3733 frame episode body.
 * Uses the STYLE-PACK `corner_cafe_endscreen` rack-focus look: blurred cafe behind a
 * crisp sprouting-orb end card, with a fade to black over the final 14 frames.
 */
export const OutroCard: React.FC<{channel?: string}> = ({channel = 'PAKKA STORIES'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame: frame - 4, fps, config: {damping: 14, stiffness: 150, mass: 0.8}});
  const blur = interpolate(frame, [0, 26], [10, 16], clamp);
  const fadeToBlack = interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const ring = 1 + 0.04 * Math.sin(frame * 0.22);

  return (
    <AbsoluteFill style={{backgroundColor: '#0d1117'}}>
      <AbsoluteFill style={{filter: `blur(${blur}px) brightness(1.18)`, transform: 'scale(1.04)'}}>
        <EnvironmentStage preset="corner_cafe_endscreen" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(255,255,255,0.30)'}} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26}}>
        {/* Sprouting orb placeholder logo */}
        <div style={{transform: `scale(${Math.max(0.001, enter)})`}}>
          <svg width={260} height={260} viewBox="0 0 260 260">
            <defs>
              <radialGradient id="orbGrad" cx="38%" cy="32%" r="72%">
                <stop offset="0%" stopColor="#fff6df" />
                <stop offset="55%" stopColor={C.gold} />
                <stop offset="100%" stopColor="#b57f24" />
              </radialGradient>
            </defs>
            <circle cx={130} cy={138} r={72 * ring} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
            <circle cx={130} cy={138} r={64} fill="url(#orbGrad)" />
            <path d="M130 100 Q126 66 96 54 Q112 84 130 100Z" fill="#4f8a45" opacity={prog(frame, 12, 18)} />
            <path d="M130 100 Q136 64 168 52 Q152 84 130 100Z" fill="#6fb35f" opacity={prog(frame, 18, 18)} />
            <line x1={130} y1={100} x2={130} y2={132} stroke="#2f5e2a" strokeWidth={5} strokeLinecap="round" />
          </svg>
        </div>

        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 900,
            fontSize: 64,
            letterSpacing: '0.14em',
            color: '#1e1e24',
            opacity: prog(frame, 14, 14),
            transform: `translateY(${interpolate(prog(frame, 14, 14), [0, 1], [16, 0])}px)`,
          }}
        >
          {channel}
        </div>

        <div
          style={{
            fontFamily: FONT_UI,
            fontWeight: 600,
            fontSize: 30,
            color: 'rgba(30,30,36,0.78)',
            opacity: prog(frame, 24, 14),
          }}
        >
          Clarity over chemistry. See you in the comments.
        </div>

        <div
          style={{
            marginTop: 8,
            padding: '12px 34px',
            borderRadius: 999,
            border: `2.5px solid ${C.gold}`,
            backgroundColor: 'rgba(29,33,46,0.92)',
            fontFamily: FONT_UI,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '0.06em',
            color: '#ffffff',
            opacity: prog(frame, 34, 14),
          }}
        >
          FOLLOW FOR MORE
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: '#000000', opacity: fadeToBlack}} />
    </AbsoluteFill>
  );
};
