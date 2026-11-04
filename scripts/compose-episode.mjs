#!/usr/bin/env node
/**
 * Episode authoring step.
 *
 * Reads episode/script.txt (the authoritative 28 timestamped narration lines) and
 * writes episode/episode.json: cues are parsed from the script so narration text and
 * timestamps can never drift, and frame-synchronised SFX cues are derived from the
 * per-scene widgets / HUD / transitions.
 *
 * Run: node scripts/compose-episode.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const FPS = 30;
const BODY_FRAMES = 3733;   // 124.4333 s of narration body
const OUTRO_FRAMES = 90;    // 3.0 s separate outro card
const TOTAL_FRAMES = BODY_FRAMES + OUTRO_FRAMES; // 3823

const root = process.cwd();
const scriptPath = path.join(root, 'episode/script.txt');
const raw = fs.readFileSync(scriptPath, 'utf8').split('\n').filter((l) => l.trim().length > 0);

const cues = raw.map((line, i) => {
  const m = line.match(/^\[\s*([\d.]+)-\s*([\d.]+)\]\s*(.*)$/);
  if (!m) throw new Error(`Cannot parse script line ${i + 1}: ${line}`);
  return {index: i, start: Number(m[1]), end: Number(m[2]), text: m[3].trim()};
});
if (cues.length !== 28) throw new Error(`Expected 28 narration lines, found ${cues.length}`);

/* ------------------------------------------------------------------ *
 * Scenes (S01-S23 = narration body, S24 = separate 3 s outro card)
 * ------------------------------------------------------------------ */
const scenes = [
  {id: 'S01', startFrame: 0, durationInFrames: 124, act: 1, environment: 'cafe_day', cameraPreset: 'pull_back_reveal', narrationCues: [0],
    hud: {calendarBadge: 'DAY 1'},
    characters: [
      {characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'idle_stand', expression: 'happy', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1500, facing: 'left', pose: 'talk', expression: 'talking', rimLightSide: 'right'}],
    widget: {type: 'chat_bubbles'}, transitionOut: 'white_flash'},

  {id: 'S02', startFrame: 124, durationInFrames: 75, act: 1, environment: 'bedroom_night', cameraPreset: 'slow_push_in', narrationCues: [1],
    hud: {calendarBadge: 'DAY 4'},
    characters: [{characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'hold_phone', expression: 'worried', rimLightSide: 'left'}],
    widget: {type: 'phone_seen'}, transitionOut: 'hard_cut'},

  {id: 'S03', startFrame: 199, durationInFrames: 150, act: 1, environment: 'mind_blueprint', cameraPreset: 'slow_creep_in', narrationCues: [2],
    hud: {counterBadge: {label: 'CERTAINTY', startValue: 85, endValue: 20, suffix: '%', mode: 'linear'},
          summaryPill: {text: 'less certain, more thinking', variant: 'info', appearAtFrameOffset: 80}},
    characters: [{characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'chin_think', expression: 'curious', rimLightSide: 'right'}],
    widget: {type: 'certainty_meter'}, transitionOut: 'hard_cut'},

  {id: 'S04', startFrame: 349, durationInFrames: 193, act: 1, environment: 'bedroom_night', cameraPreset: 'drift_left', narrationCues: [3],
    hud: {summaryPill: {text: 'an open loop stays on your mind', variant: 'gold', appearAtFrameOffset: 80}},
    characters: [{characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'hold_phone', expression: 'worried', rimLightSide: 'left'}],
    widget: {type: 'msg_vs_chat'}, transitionOut: 'hard_cut'},

  {id: 'S05', startFrame: 542, durationInFrames: 246, act: 1, environment: 'mind_blueprint', cameraPreset: 'slow_creep_in', narrationCues: [4, 5],
    hud: {summaryPill: {text: 'intensity can be fueled by uncertainty', variant: 'gold', appearAtFrameOffset: 170}},
    characters: [{characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'chin_think', expression: 'skeptical', rimLightSide: 'right'}],
    widget: {type: 'chemistry_eq'}, transitionOut: 'hard_cut'},

  {id: 'S06', startFrame: 788, durationInFrames: 151, act: 1, environment: 'mind_blueprint', cameraPreset: 'drift_left', narrationCues: [6],
    hud: {summaryPill: {text: 'no answer, so the mind searches', variant: 'info', appearAtFrameOffset: 60}},
    characters: [{characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'chin_think', expression: 'curious', rimLightSide: 'right'}],
    widget: {type: 'clue_search'}, transitionOut: 'hard_cut'},

  {id: 'S07', startFrame: 939, durationInFrames: 198, act: 2, environment: 'bedroom_night', cameraPreset: 'slow_push_in', narrationCues: [7],
    hud: {},
    characters: [{characterId: 'protagonist_a', x: 330, facing: 'right', pose: 'slump', expression: 'worried', rimLightSide: 'left'}],
    widget: {type: 'replay_list'}, transitionOut: 'hard_cut'},

  {id: 'S08', startFrame: 1137, durationInFrames: 305, act: 2, environment: 'mind_blueprint', cameraPreset: 'slow_creep_in', narrationCues: [8, 9],
    hud: {},
    characters: [{characterId: 'protagonist_a', x: 300, facing: 'right', pose: 'chin_think', expression: 'worried', rimLightSide: 'right'}],
    widget: {type: 'detail_orbit'}, transitionOut: 'hard_cut'},

  {id: 'S09', startFrame: 1442, durationInFrames: 265, act: 2, environment: 'bedroom_night', cameraPreset: 'slow_push_in', narrationCues: [10, 11],
    hud: {calendarBadge: 'DAY 5'},
    characters: [{characterId: 'protagonist_a', x: 330, facing: 'right', pose: 'slump', expression: 'worried', rimLightSide: 'left',
                  poseAfter: 'hold_phone', exprAfter: 'happy', switchFrame: 150}],
    widget: {type: 'silence_message'}, transitionOut: 'hard_cut'},

  {id: 'S10', startFrame: 1707, durationInFrames: 77, act: 2, environment: 'bedroom_night', cameraPreset: 'pull_back_reveal', narrationCues: [12],
    hud: {},
    characters: [{characterId: 'protagonist_a', x: 330, facing: 'right', pose: 'celebrate', expression: 'happy', rimLightSide: 'left'}],
    widget: {type: 'relief_burst'}, transitionOut: 'hard_cut'},

  {id: 'S11', startFrame: 1784, durationInFrames: 170, act: 2, environment: 'mind_blueprint', cameraPreset: 'drift_left', narrationCues: [13],
    hud: {calendarBadge: 'THE PATTERN', summaryPill: {text: 'uncertainty and relief, back and forth', variant: 'info', appearAtFrameOffset: 100}},
    characters: [{characterId: 'protagonist_a', x: 300, facing: 'right', pose: 'chin_think', expression: 'curious', rimLightSide: 'right'}],
    widget: {type: 'swing_wave'}, transitionOut: 'hard_cut'},

  {id: 'S12', startFrame: 1954, durationInFrames: 145, act: 2, environment: 'classroom_chalkboard', cameraPreset: 'slow_creep_in', narrationCues: [14],
    hud: {},
    characters: [
      {characterId: 'protagonist_a', x: 190, facing: 'right', pose: 'chin_think', expression: 'skeptical', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1730, facing: 'left', pose: 'talk', expression: 'talking', rimLightSide: 'right'}],
    widget: {type: 'chalk_text', props: {lines: [
      {text: 'the swing', at: 6, x: 960, y: 340, size: 84, color: '#e8ebe6'},
      {text: "doesn't automatically mean", at: 40, x: 960, y: 460, size: 72, color: '#e8ebe6'},
      {text: 'manipulation', at: 80, x: 960, y: 590, size: 92, color: '#e6c93a', mark: {type: 'cross', x: 1310, y: 545, at: 110}}]}},
    transitionOut: 'amber_circle_iris'},

  {id: 'S13', startFrame: 2099, durationInFrames: 165, act: 3, environment: 'cafe_day', cameraPreset: 'static_wide', narrationCues: [15],
    hud: {},
    characters: [
      {characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'idle_stand', expression: 'curious', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1800, targetX: 1500, moveStart: 0, moveEnd: 50, facing: 'left', pose: 'walk_cycle', poseAfter: 'talk', expression: 'neutral', rimLightSide: 'right'}],
    widget: {type: 'chips', props: {y: 430, arrows: false, items: [
      {text: 'BUSY', color: '#6495ed'}, {text: 'UNSURE', color: '#b39ddb'}, {text: 'WANTS SOMETHING|different', color: '#64d8cb'}]}},
    transitionOut: 'hard_cut'},

  {id: 'S14', startFrame: 2264, durationInFrames: 140, act: 3, environment: 'mind_blueprint', cameraPreset: 'slow_push_in', narrationCues: [16],
    hud: {},
    characters: [{characterId: 'protagonist_a', x: 300, facing: 'right', pose: 'chin_think', expression: 'curious', rimLightSide: 'right'}],
    widget: {type: 'imagination'}, transitionOut: 'hard_cut'},

  {id: 'S15', startFrame: 2404, durationInFrames: 183, act: 3, environment: 'mind_blueprint', cameraPreset: 'slow_creep_in', narrationCues: [17, 18],
    hud: {summaryPill: {text: 'focus on how they treat you right now', variant: 'gold', appearAtFrameOffset: 100}},
    characters: [{characterId: 'protagonist_a', x: 230, facing: 'right', pose: 'chin_think', expression: 'skeptical', rimLightSide: 'right'}],
    widget: {type: 'split_compare'}, transitionOut: 'hard_cut'},

  {id: 'S16', startFrame: 2587, durationInFrames: 135, act: 4, environment: 'classroom_chalkboard', cameraPreset: 'drift_left', narrationCues: [19],
    hud: {},
    characters: [
      {characterId: 'protagonist_a', x: 190, facing: 'right', pose: 'talk', expression: 'talking', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1730, facing: 'left', pose: 'chin_think', expression: 'curious', rimLightSide: 'right'}],
    widget: {type: 'chalk_text', props: {lines: [
      {text: 'what they DO', at: 6, x: 660, y: 350, size: 64, color: '#e8ebe6'},
      {text: '=?', at: 36, x: 960, y: 400, size: 130, color: '#e6c93a'},
      {text: 'what they SAY', at: 66, x: 1260, y: 350, size: 64, color: '#e8ebe6'},
      {text: 'do they match?', at: 96, x: 960, y: 600, size: 80, color: '#e6c93a'}]}},
    transitionOut: 'hard_cut'},

  {id: 'S17', startFrame: 2722, durationInFrames: 139, act: 4, environment: 'classroom_chalkboard', cameraPreset: 'slow_push_in', narrationCues: [20],
    hud: {},
    characters: [
      {characterId: 'protagonist_a', x: 190, facing: 'right', pose: 'idle_stand', expression: 'happy', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1730, facing: 'left', pose: 'talk', expression: 'talking', rimLightSide: 'right'}],
    widget: {type: 'chalk_text', props: {lines: [
      {text: '1. Can I talk honestly about what I want?', at: 6, x: 960, y: 360, size: 48, color: '#e8ebe6', mark: {type: 'check', x: 1535, y: 345, at: 50}},
      {text: '2. Do I feel respected?', at: 66, x: 960, y: 520, size: 48, color: '#e8ebe6', mark: {type: 'check', x: 1330, y: 505, at: 105}}]}},
    transitionOut: 'hard_cut'},

  {id: 'S18', startFrame: 2861, durationInFrames: 125, act: 4, environment: 'mind_blueprint', cameraPreset: 'slow_creep_in', narrationCues: [21],
    hud: {},
    characters: [{characterId: 'protagonist_a', x: 300, facing: 'right', pose: 'chin_think', expression: 'worried', rimLightSide: 'right'}],
    widget: {type: 'neq_sign'}, transitionOut: 'hard_cut'},

  {id: 'S19', startFrame: 2986, durationInFrames: 162, act: 4, environment: 'mind_blueprint', cameraPreset: 'slow_push_in', narrationCues: [22],
    hud: {},
    characters: [{characterId: 'protagonist_a', x: 300, facing: 'right', pose: 'slump', expression: 'worried', rimLightSide: 'right'}],
    widget: {type: 'gears'}, transitionOut: 'hard_cut'},

  {id: 'S20', startFrame: 3148, durationInFrames: 66, act: 5, environment: 'sunset_porch', cameraPreset: 'slow_push_in', narrationCues: [23],
    hud: {summaryPill: {text: "you don't have to decode every signal alone", variant: 'gold', appearAtFrameOffset: 14}},
    characters: [
      {characterId: 'protagonist_a', x: 780, facing: 'right', pose: 'seated', expression: 'worried', rimLightSide: 'right', exprAfter: 'happy', switchFrame: 36},
      {characterId: 'protagonist_b', x: 1750, targetX: 1100, moveStart: 0, moveEnd: 50, facing: 'left', pose: 'walk_cycle', poseAfter: 'seated_talk', expression: 'happy', rimLightSide: 'left'}],
    widget: {type: 'none'}, transitionOut: 'warm_sunset_dissolve'},

  {id: 'S21', startFrame: 3214, durationInFrames: 185, act: 5, environment: 'cafe_day', cameraPreset: 'slow_creep_in', narrationCues: [24],
    hud: {},
    characters: [
      {characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'talk', expression: 'talking', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1500, facing: 'left', pose: 'idle_stand', expression: 'curious', rimLightSide: 'right'}],
    widget: {type: 'chips', props: {y: 430, arrows: true, items: [
      {text: 'ASK|a clear question', color: '#e6c93a'}, {text: 'LISTEN|to the answer', color: '#64d8cb'}, {text: 'NOTICE|what happens next', color: '#ff7eb6'}]}},
    transitionOut: 'hard_cut'},

  {id: 'S22', startFrame: 3399, durationInFrames: 191, act: 5, environment: 'sunset_porch', cameraPreset: 'slow_push_in', narrationCues: [25, 26],
    hud: {summaryPill: {text: "clarity helps you decide what's good for you", variant: 'gold', appearAtFrameOffset: 100}},
    characters: [
      {characterId: 'protagonist_a', x: 640, facing: 'right', pose: 'seated_talk', expression: 'happy', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1280, facing: 'left', pose: 'seated', expression: 'curious', rimLightSide: 'left'}],
    widget: {type: 'spark_to_clarity'}, transitionOut: 'rack_focus_blur'},

  {id: 'S23', startFrame: 3590, durationInFrames: 143, act: 5, environment: 'cafe_day', cameraPreset: 'pull_back_reveal', narrationCues: [27],
    hud: {summaryPill: {text: 'Share it in the comments', variant: 'gold', appearAtFrameOffset: 20}},
    characters: [
      {characterId: 'protagonist_a', x: 420, facing: 'right', pose: 'talk', expression: 'happy', rimLightSide: 'right'},
      {characterId: 'protagonist_b', x: 1500, facing: 'left', pose: 'talk', expression: 'happy', rimLightSide: 'right'}],
    widget: {type: 'comment_card'}, transitionOut: 'rack_focus_blur'},

  {id: 'S24', startFrame: BODY_FRAMES, durationInFrames: OUTRO_FRAMES, act: 6, kind: 'outro',
    environment: 'cafe_day', cameraPreset: 'static_wide', narrationCues: [],
    hud: {}, characters: [], widget: {type: 'none'}, transitionOut: 'hard_cut'}
];

/* ------------------------------------------------------------------ *
 * Derived frame-synchronised SFX cues
 * ------------------------------------------------------------------ */
const widgetSfx = {
  chat_bubbles: [[10, 'sfx_bubble_pop'], [38, 'sfx_bubble_pop'], [66, 'sfx_bubble_pop']],
  phone_seen: [[0, 'sfx_phone_buzz'], [50, 'sfx_badge_pop']],
  certainty_meter: [[12, 'sfx_counter_tick'], [46, 'sfx_counter_tick'], [80, 'sfx_badge_pop']],
  msg_vs_chat: [[0, 'sfx_badge_pop'], [55, 'sfx_heart_thud']],
  chemistry_eq: [[30, 'sfx_counter_tick'], [100, 'sfx_badge_pop'], [120, 'sfx_riser']],
  clue_search: [[0, 'sfx_magnify'], [22, 'sfx_badge_pop'], [66, 'sfx_badge_pop'], [110, 'sfx_badge_pop']],
  replay_list: [[0, 'sfx_page_turn'], [66, 'sfx_page_turn'], [132, 'sfx_page_turn']],
  detail_orbit: [[8, 'sfx_badge_pop'], [60, 'sfx_badge_pop'], [138, 'sfx_badge_pop']],
  silence_message: [[0, 'sfx_page_turn'], [140, 'sfx_phone_ping'], [200, 'sfx_sparkle']],
  relief_burst: [[0, 'sfx_sparkle'], [8, 'sfx_whoosh']],
  swing_wave: [[0, 'sfx_marker'], [60, 'sfx_marker']],
  chalk_text: [[6, 'sfx_chalk_write'], [40, 'sfx_chalk_write'], [66, 'sfx_chalk_write'], [80, 'sfx_chalk_write'], [96, 'sfx_chalk_write'], [110, 'sfx_chalk_write']],
  chips: [[6, 'sfx_badge_pop'], [40, 'sfx_badge_pop'], [74, 'sfx_badge_pop']],
  imagination: [[6, 'sfx_sparkle'], [40, 'sfx_badge_pop']],
  split_compare: [[0, 'sfx_badge_pop'], [14, 'sfx_badge_pop'], [90, 'sfx_marker']],
  neq_sign: [[0, 'sfx_badge_pop'], [20, 'sfx_badge_pop'], [34, 'sfx_thud']],
  gears: [[0, 'sfx_gear'], [80, 'sfx_badge_pop']],
  spark_to_clarity: [[0, 'sfx_sparkle'], [60, 'sfx_sparkle'], [70, 'sfx_riser']],
  comment_card: [[10, 'sfx_badge_pop'], [30, 'sfx_heart_thud']]
};

const transitionSfx = {
  white_flash: 'sfx_whoosh',
  warm_sunset_dissolve: 'sfx_whoosh',
  amber_circle_iris: 'sfx_whoosh',
  rack_focus_blur: 'sfx_riser',
  hard_cut: null
};

const withSfx = scenes.map((scene) => {
  const cuesOut = [];
  if (scene.hud?.calendarBadge) cuesOut.push({frameOffset: 0, cue: 'sfx_badge_pop'});
  if (scene.hud?.summaryPill) cuesOut.push({frameOffset: scene.hud.summaryPill.appearAtFrameOffset ?? 15, cue: 'sfx_badge_pop'});
  if (scene.hud?.counterBadge) cuesOut.push({frameOffset: 12, cue: 'sfx_counter_tick'}, {frameOffset: 60, cue: 'sfx_counter_tick'});
  const w = scene.widget ? widgetSfx[scene.widget.type] : undefined;
  if (w) for (const [frame, cue] of w) cuesOut.push({frameOffset: frame, cue});
  const t = transitionSfx[scene.transitionOut];
  if (t) cuesOut.push({frameOffset: Math.max(0, scene.durationInFrames - 14), cue: t});

  // de-duplicate identical (frameOffset, cue) pairs and keep inside the scene
  const seen = new Set();
  const sfxCues = cuesOut
    .filter((c) => c.frameOffset >= 0 && c.frameOffset < scene.durationInFrames)
    .filter((c) => {
      const key = `${c.frameOffset}:${c.cue}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.frameOffset - b.frameOffset);

  return {...scene, sfxCues};
});

/* ------------------------------------------------------------------ *
 * Music: five movement score written to match the narration timeline
 * ------------------------------------------------------------------ */
const sec = (s) => Math.round(s * FPS);
const musicTracks = [
  {id: 'mvt1_curiosity', movement: 'Mvt 1 - Quirky Curiosity', src: 'audio/music/mvt1_curiosity.mp3', startFrame: 0, endFrame: sec(48.07), volume: 0.30},
  {id: 'mvt2_relief', movement: 'Mvt 2 - Tension and Relief', src: 'audio/music/mvt2_relief.mp3', startFrame: sec(48.07), endFrame: sec(75.48), volume: 0.30},
  {id: 'mvt3_doubt', movement: 'Mvt 3 - Doubt and Distance', src: 'audio/music/mvt3_doubt.mp3', startFrame: sec(75.48), endFrame: sec(95.36), volume: 0.30},
  {id: 'mvt4_clarity', movement: 'Mvt 4 - Clarity', src: 'audio/music/mvt4_clarity.mp3', startFrame: sec(95.36), endFrame: sec(113.30), volume: 0.30},
  {id: 'mvt5_outro', movement: 'Mvt 5 - Resolution and Outro', src: 'audio/music/mvt5_outro.mp3', startFrame: sec(113.30), endFrame: TOTAL_FRAMES, volume: 0.32}
];

const narrationLines = cues.map((c) => {
  const startFrame = Math.round(c.start * FPS);
  const cueEndFrame = Math.round(c.end * FPS);
  return {
    cueIndex: c.index,
    file: `audio/narration/line_${String(c.index).padStart(2, '0')}.wav`,
    startFrame,
    cueEndFrame,
    windowFrames: cueEndFrame - startFrame
  };
});

const episode = {
  $schema: '../STYLE-PACK/schemas/episode.schema.json',
  episodeId: 'ep_uncertainty_001',
  title: 'Why Does Uncertainty Feel Like Chemistry?',
  channel: 'Pakka Stories',
  fps: FPS,
  width: 1920,
  height: 1080,
  aspectRatio: '16:9',
  subtitles: false,
  bodyDurationInFrames: BODY_FRAMES,
  outroDurationInFrames: OUTRO_FRAMES,
  durationInFrames: TOTAL_FRAMES,
  audio: {
    narrationFile: 'audio/narration.wav',
    narrationGain: 1.0,
    narrationDirectory: 'audio/narration/',
    musicDuckDb: -9,
    musicTracks,
    narrationLines
  },
  cues: cues.map(({index, start, end, text}) => ({index, start, end, text})),
  scenes: withSfx
};

fs.writeFileSync(path.join(root, 'episode/episode.json'), JSON.stringify(episode, null, 2) + '\n');

const last = withSfx[withSfx.length - 1];
console.log(`cues: ${cues.length}`);
console.log(`scenes: ${withSfx.length} (body ${withSfx.length - 1} + outro)`);
console.log(`scene end frame: ${last.startFrame + last.durationInFrames} / total ${TOTAL_FRAMES}`);
console.log(`sfx cues: ${withSfx.reduce((n, s) => n + s.sfxCues.length, 0)}`);
console.log('wrote episode/episode.json');
