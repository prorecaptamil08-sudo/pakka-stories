import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;
export const TOTAL = 1830; // 61.0s exact master duration

export const C = {
  duskSky: "#0B111E",
  treeBark: "#26170E",
  treeBarkLight: "#452A18",
  leavesGreen: "#14532D",
  leavesDark: "#064E3B",
  purpleFlower: "#A855F7",
  purpleFlowerGlow: "rgba(168, 85, 247, 0.8)",
  leatherBrown: "#78350F",
  parchment: "#FEF3C7",
  gold: "#F59E0B",
  goldLight: "#FDE047",
  white: "#FFFFFF",
  slate: "#94A3B8",
  redClay: "#991B1B",
  lotusPink: "#F472B6",
  waterBlue: "#0284C7",
};

export const F = {
  tamil: "'Noto Sans Tamil', 'Latha', 'Tamil Sangam MN', sans-serif",
  display: "'Montserrat', 'Cinzel', 'Poppins', sans-serif",
};

// 15 Fast-Paced Dynamic Visual Beats (Every 3-5s change matching Voiceover)
export const SCENE_BOUNDARIES = [
  0,     // S1: 0 - 114    (0.0s - 3.8s)  Crematorium dusk silhouette & embers
  114,   // S2: 114 - 240  (3.8s - 8.0s)  Older Kathir waiting under banyan tree
  240,   // S3: 240 - 336  (8.0s - 11.2s) Close-up: Anjali giving diary promise
  336,   // S4: 336 - 444  (11.2s - 14.8s) 20-Year time-lapse under banyan tree
  444,   // S5: 444 - 540  (14.8s - 18.0s) Macro: Unopened last page & bookmark
  540,   // S6: 540 - 648  (18.0s - 21.6s) Vintage car arrives behind Kathir
  648,   // S7: 648 - 744  (21.6s - 24.8s) Petrichor mist & rain on wild purple flowers
  744,   // S8: 744 - 855  (24.8s - 28.5s) Upward pan on sacred banyan tree & roots
  855,   // S9: 855 - 1014 (28.5s - 33.8s) Macro: Weathered hands caressing dried flower
  1014,  // S10: 1014 - 1185 (33.8s - 39.5s) Emotional close-up: Kathir's tearful hesitation
  1185,  // S11: 1185 - 1374 (39.5s - 45.8s) Golden village flashback landscape
  1374,  // S12: 1374 - 1545 (45.8s - 51.5s) Young rugged Kathir twirling mustache
  1545,  // S13: 1545 - 1665 (51.5s - 55.5s) Young Kathir smiling shyly with flower behind back
  1665,  // S14: 1665 - 1755 (55.5s - 58.5s) Anjali in half-saree walking by lotus pond
  1755,  // S15: 1755 - 1830 (58.5s - 61.0s) Radiant close-up: Anjali with purple flower smiling
  1830   // TOTAL
];

export const useSpr = (
  delay = 0,
  cfg: { damping?: number; stiffness?: number; mass?: number } = {}
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9, ...cfg },
  });
};
