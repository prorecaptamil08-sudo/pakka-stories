import type {EnvPreset} from '../types';

/**
 * Design tokens from STYLE-PACK/design-system/colors.json + typography.json.
 */

export const GROUND_Y = 960;
export const CANVAS = {width: 1920, height: 1080} as const;

export const C = {
  // character
  charcoal: '#1e1e22',
  charcoalShade: '#141417',
  rimWarm: '#f7d69c',
  rimCool: '#a5d8ff',
  eyeWhite: '#ffffff',
  pupil: '#18181b',
  elderlyHair: '#f0f0f5',
  elderlyHairOutline: '#c8c8d4',
  // wardrobe
  shirtA: '#f4f4f6',
  shirtAShade: '#d4d4dc',
  cardigan: '#d69c3a',
  cardiganShade: '#b57f24',
  jeans: '#3b4d71',
  shoesB: '#7c4d36',
  glasses: '#e2e4ea',
  // palette
  gold: '#e6c93a',
  goldBorder: '#c8a858',
  danger: '#ef5350',
  info: '#6495ed',
  good: '#5cd669',
  bad: '#e5484d',
  chalk: '#e8ebe6',
  chalkGold: '#e6c93a',
  panel: '#1d212e',
  pink: '#ff7eb6',
  purple: '#b39ddb',
  teal: '#64d8cb',
  // environments
  brickDay: '#8f623f',
  brickNight: '#4e4d6d',
  cafeTeal: '#2c423b',
  awningRed: '#d84339',
  awningCream: '#f4f1ea',
  interiorGlow: '#e6b981',
  slateCenter: '#2c4434',
  slateEdge: '#1b2a20',
  woodFrame: '#8e613e',
  blueprintCenter: '#1e2f5a',
  blueprintEdge: '#0d162d',
  sunsetTop: '#3a2a5a',
  sunsetMid: '#e4686a',
  sunsetHorizon: '#ffd9a0',
} as const;

/** Per-environment rim-light colour (warm sunsets vs cool blueprint). */
export const ENV_RIM: Record<EnvPreset, string> = {
  cafe_day: C.rimWarm,
  bedroom_night: C.rimWarm,
  mind_blueprint: C.rimCool,
  classroom_chalkboard: '#ffffff',
  sunset_porch: C.rimWarm,
  corner_cafe_dawn: C.rimWarm,
  corner_cafe_wide: C.rimWarm,
  corner_cafe_populated: C.rimWarm,
  corner_cafe_endscreen: C.rimWarm,
  city_skyline_haze: C.rimCool,
  brick_window_night: C.rimWarm,
  family_bedroom: C.rimWarm,
  night_car_driveway: C.rimCool,
  family_dining_room: C.rimWarm,
  genetics_blueprint: C.rimCool,
  habsburg_gallery: C.rimWarm,
  village_exterior: C.rimWarm,
  baby_nursery_warm: C.rimWarm,
  sage_spotlight_stage: '#ffffff',
  chatham_island_ocean: C.rimWarm,
  chatham_forest_canopy: '#fffdd1',
  elephant_seal_beach: C.rimWarm,
  pitcairn_island_ocean: C.rimWarm,
  prehistoric_savanna: C.rimWarm,
  high_school_gym: '#ffffff',
};

/** Z-layers from STYLE-PACK/design-system/composition.json */
export const Z = {
  sky: 10,
  midground: 20,
  stage: 25,
  characters: 30,
  foreground: 35,
  vignette: 40,
  hud: 50,
  transition: 60,
} as const;

/** Spring presets from STYLE-PACK/presets/animation-presets.json */
export const SPRING = {
  hud: {damping: 14, stiffness: 190, mass: 0.75},
  block: {damping: 11, stiffness: 160, mass: 0.9},
  stamp: {damping: 12, stiffness: 280, mass: 0.6},
  character: {damping: 13, stiffness: 120, mass: 1},
} as const;
