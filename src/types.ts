/**
 * Shared types for the episode. Environment / camera / transition names accept both the
 * episode vocabulary (cafe_day, mind_blueprint, ...) and the STYLE-PACK vocabulary
 * (corner_cafe_wide, genetics_blueprint, ...) so JSON authored against either works.
 */

export type EnvPreset =
  // --- episode presets -------------------------------------------------
  | 'cafe_day'
  | 'bedroom_night'
  | 'mind_blueprint'
  | 'classroom_chalkboard'
  | 'sunset_porch'
  // --- STYLE-PACK presets (22) ----------------------------------------
  | 'corner_cafe_dawn'
  | 'corner_cafe_wide'
  | 'corner_cafe_populated'
  | 'corner_cafe_endscreen'
  | 'city_skyline_haze'
  | 'brick_window_night'
  | 'family_bedroom'
  | 'night_car_driveway'
  | 'family_dining_room'
  | 'genetics_blueprint'
  | 'habsburg_gallery'
  | 'village_exterior'
  | 'baby_nursery_warm'
  | 'sage_spotlight_stage'
  | 'chatham_island_ocean'
  | 'chatham_forest_canopy'
  | 'elephant_seal_beach'
  | 'pitcairn_island_ocean'
  | 'prehistoric_savanna'
  | 'high_school_gym';

export type CameraPreset =
  // episode vocabulary
  | 'static_wide'
  | 'slow_creep_in'
  | 'slow_push_in'
  | 'drift_left'
  | 'pull_back_reveal'
  // STYLE-PACK vocabulary
  | 'pull_back_street_reveal'
  | 'chalkboard_fullscreen_dive'
  | 'dining_table_awkward_push'
  | 'lateral_gallery_walk'
  | 'population_zoom_out';

export type TransitionType =
  | 'hard_cut'
  | 'white_flash'
  | 'warm_sunset_dissolve'
  | 'amber_circle_iris'
  | 'red_circle_iris'
  | 'rack_focus_blur';

export type PoseName =
  | 'idle_stand'
  | 'walk_cycle'
  | 'hold_phone'
  | 'chin_think'
  | 'talk'
  | 'celebrate'
  | 'slump'
  | 'seated'
  | 'seated_talk'
  | 'chalk_write'
  | 'brush_teeth'
  | 'pointer_lean';

export type ExprName =
  | 'neutral'
  | 'happy'
  | 'worried'
  | 'curious'
  | 'shocked'
  | 'skeptical'
  | 'talking'
  | 'exhausted'
  | 'sleeping';

export type CharacterId =
  | 'protagonist_a'
  | 'protagonist_b'
  | 'sibling_teal'
  | 'sibling_purple_dress'
  | 'sibling_red_hoodie'
  | 'sibling_amber_cap'
  | 'sibling_forest_stripe'
  | 'prehistoric_human'
  | 'baby';

export interface CharacterProps {
  characterId: CharacterId;
  x: number;
  y?: number;
  targetX?: number;
  moveStart?: number;
  moveEnd?: number;
  scale?: number;
  facing?: 'left' | 'right' | 'front';
  pose?: PoseName;
  poseAfter?: PoseName;
  switchFrame?: number;
  expression?: ExprName;
  exprAfter?: ExprName;
  rimLightSide?: 'left' | 'right' | 'top' | 'none';
  rimColor?: string;
  elderly?: boolean;
  padlockNumber?: number;
}

export interface HudConfig {
  calendarBadge?: string;
  counterBadge?: {
    label: string;
    startValue: number;
    endValue: number;
    prefix?: string;
    suffix?: string;
    mode?: 'linear' | 'exponential';
  };
  summaryPill?: {text: string; variant?: 'gold' | 'danger' | 'info'; appearAtFrameOffset?: number};
  citation?: string;
}

export interface WidgetConfig {
  type: string;
  props?: Record<string, unknown>;
}

export interface SfxCue {
  frameOffset: number;
  cue: string;
}

export interface Scene {
  id: string;
  startFrame: number;
  durationInFrames: number;
  act?: number;
  kind?: 'narration' | 'outro';
  environment: EnvPreset;
  cameraPreset: CameraPreset;
  narrationCues: number[];
  hud?: HudConfig;
  characters?: CharacterProps[];
  widget?: WidgetConfig;
  transitionOut?: TransitionType;
  sfxCues?: SfxCue[];
}

export interface Cue {
  index: number;
  start: number;
  end: number;
  text: string;
}

export interface MusicTrack {
  id: string;
  movement: string;
  src: string;
  startFrame: number;
  endFrame: number;
  volume: number;
}

export interface NarrationLine {
  cueIndex: number;
  file: string;
  startFrame: number;
  cueEndFrame: number;
  windowFrames: number;
}

export interface EpisodeAudio {
  narrationFile: string;
  narrationGain: number;
  narrationDirectory: string;
  musicDuckDb: number;
  musicTracks: MusicTrack[];
  narrationLines: NarrationLine[];
}

export interface Episode {
  episodeId: string;
  title: string;
  channel: string;
  fps: number;
  width: number;
  height: number;
  aspectRatio: string;
  subtitles: boolean;
  bodyDurationInFrames: number;
  outroDurationInFrames: number;
  durationInFrames: number;
  audio: EpisodeAudio;
  cues: Cue[];
  scenes: Scene[];
}
