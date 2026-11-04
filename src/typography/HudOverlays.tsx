import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../design/tokens';
import {FONT_UI} from '../design/fonts';
import {Z} from '../design/tokens';
import type {HudConfig} from '../types';

/** Top-right calendar badge (red header + cream body). */
export const CalendarBadge: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 190}});
  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        right: 48,
        minWidth: 195,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 22px rgba(0,0,0,0.38)',
        transform: `scale(${pop})`,
        transformOrigin: 'top right',
        zIndex: Z.hud,
      }}
    >
      <div
        style={{
          height: 22,
          backgroundColor: '#c14e43',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 36px',
        }}
      >
        <div style={{width: 8, height: 12, borderRadius: 3, backgroundColor: '#3a3a42'}} />
        <div style={{width: 8, height: 12, borderRadius: 3, backgroundColor: '#3a3a42'}} />
      </div>
      <div
        style={{
          backgroundColor: '#efe6d5',
          padding: '10px 26px',
          textAlign: 'center',
          fontFamily: FONT_UI,
          fontWeight: 800,
          fontSize: 28,
          color: '#1e1e24',
          letterSpacing: '0.04em',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Gold-bordered counter with tabular numerals (STYLE-PACK rule VR-02). */
export const CounterBadge: React.FC<
  NonNullable<HudConfig['counterBadge']> & {hasCalendarSibling?: boolean; appearAtFrameOffset?: number}
> = ({label, startValue, endValue, prefix = '', suffix = '', mode = 'linear', hasCalendarSibling = false, appearAtFrameOffset = 8}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  if (frame < appearAtFrameOffset) return null;
  const pop = spring({frame: frame - appearAtFrameOffset, fps, config: {damping: 14, stiffness: 190, mass: 0.75}});
  const p = interpolate(frame, [10, Math.max(25, durationInFrames - 20)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const value =
    mode === 'exponential' && startValue > 0 && endValue > startValue
      ? Math.round(Math.pow(10, Math.log10(startValue) + p * (Math.log10(endValue) - Math.log10(startValue))))
      : Math.round(startValue + p * (endValue - startValue));

  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        right: hasCalendarSibling ? 280 : 48,
        minWidth: 240,
        backgroundColor: 'rgba(24,29,44,0.95)',
        border: `2.5px solid ${C.goldBorder}`,
        borderRadius: 14,
        padding: '10px 24px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        transform: `scale(${pop})`,
        transformOrigin: 'top right',
        zIndex: Z.hud,
      }}
    >
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 13,
          fontWeight: 700,
          color: C.gold,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 42,
          fontWeight: 800,
          color: '#ffffff',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {prefix}
        {value.toLocaleString('en-US')}
        {suffix}
      </div>
    </div>
  );
};

/** Bottom-centre takeaway pill. */
export const SummaryPill: React.FC<{text: string; variant?: 'gold' | 'danger' | 'info'; appearAtFrameOffset?: number}> = ({
  text,
  variant = 'gold',
  appearAtFrameOffset = 15,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < appearAtFrameOffset) return null;
  const pop = spring({frame: frame - appearAtFrameOffset, fps, config: {damping: 14, stiffness: 200, mass: 0.7}});
  const border = variant === 'danger' ? C.danger : variant === 'info' ? C.info : C.gold;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 62,
        left: '50%',
        transform: `translateX(-50%) scale(${pop})`,
        backgroundColor: 'rgba(29,33,46,0.94)',
        border: `2.5px solid ${border}`,
        borderRadius: 16,
        padding: '12px 36px',
        fontFamily: FONT_UI,
        fontWeight: 700,
        fontSize: 26,
        color: '#ffffff',
        whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: Z.hud,
      }}
    >
      {text}
    </div>
  );
};

/** Bottom-left citation badge. */
export const CitationBadge: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 20,
      left: 24,
      backgroundColor: 'rgba(18,20,28,0.74)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 8,
      padding: '6px 16px',
      fontFamily: FONT_UI,
      fontSize: 15,
      fontWeight: 500,
      color: '#d0d4dc',
      zIndex: Z.hud,
    }}
  >
    {text}
  </div>
);

/** Screen-space HUD layer (rendered outside <CameraRig> so zooms never distort it). */
export const HudOverlays: React.FC<{hud?: HudConfig}> = ({hud}) => {
  if (!hud) return null;
  return (
    <>
      {hud.calendarBadge ? <CalendarBadge text={hud.calendarBadge} /> : null}
      {hud.counterBadge ? <CounterBadge {...hud.counterBadge} hasCalendarSibling={Boolean(hud.calendarBadge)} /> : null}
      {hud.summaryPill ? <SummaryPill {...hud.summaryPill} /> : null}
      {hud.citation ? <CitationBadge text={hud.citation} /> : null}
    </>
  );
};
