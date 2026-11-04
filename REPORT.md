# Build & Validation Report — "Why Does Uncertainty Feel Like Chemistry?"

**Channel:** Pakka Stories · **Composition:** `AwakenEpisode` · **Renderer:** Remotion 4.0.539
**Date of this build:** 2026-11-04 · **Branch:** `arena/77575df2-pakka-stories`

Everything below was produced by commands that were actually executed in this workspace.
Each section quotes the real console output, not an intention.

---

## 0. Status in one line

The episode is **built, scored, validated, preview-rendered and mastered** at 1080p.
The final render was run after explicit approval.

| Artefact | Path | Size |
|---|---|---|
| **Final master** (1920x1080, CRF 18, x264 slow, AAC 320 kbps, 3823 frames) | `deliverables/final-video.mp4` | 46.4 MB |
| Preview render (960x540, CRF 28, 3823 frames, AAC 48 kHz) | `out/preview.mp4` | 8.4 MB |
| Complete project archive | `deliverables/pakka-stories-uncertainty-episode.zip` | 23.0 MB |
| Soundtrack proof sheet | `dist/audio-check.png` | 36 KB |
| Frame review sheets | `dist/sheet-*.png` | — |
| This report | `REPORT.md` | — |

---

## 1. Hard requirements

| Requirement | Target | Measured | Verdict |
|---|---|---|---|
| Duration | 3823 frames @ 30 fps | 3823 frames, 127.445 s in the container | **PASS** |
| Body + outro split | 3733 + 90 | 3733 + 90 | **PASS** |
| Outro is its own segment | separate 3.0 s card | `S24`, frames 3733-3822, `kind: "outro"`, own music tail + riser | **PASS** |
| Resolution | 1920x1080 16:9 | 1920x1080 source, 960x540 in the preview encode | **PASS** |
| Subtitles | off | `episode.subtitles === false`, no caption component mounted | **PASS** |
| Narration lines | 28, verbatim timestamps | 28/28 identical to `episode/script.txt` | **PASS** |
| Voice | male English TTS | `voice-00`, 3 takes over cues 0-9 / 10-18 / 19-27 | **PASS** |
| Music | original, 5 movements | synthesised from `scripts/generate-music.mjs`, tiles 0→3823 with no gap | **PASS** |
| Ducking | −9 dB under speech | −9 dB, driven by measured speech windows (87.3 % of runtime) | **PASS** |
| SFX | frame-accurate, generated | 87 placements from 15 distinct generated WAVs, all inside their scene | **PASS** |
| Assets | all local | 8 woff2, 5 MP3, 16 WAV, 1 narration stem — nothing fetched at render time | **PASS** |

---

## 2. Command log

### 2.1 Type check

```
$ npx tsc --noEmit
TSC: clean            # exit 0, no output
```

### 2.2 Content + asset + audio validation

```
$ node scripts/validate-episode.mjs
PASS  fps is 30  [fps=30]
PASS  resolution is 1920x1080  [1920x1080]
PASS  subtitles disabled  [subtitles=false]
PASS  body duration is 3733 frames  [3733]
PASS  outro duration is 90 frames (3.0 s)  [90]
PASS  total duration is 3823 frames  [3823 (127.43 s)]
PASS  script.txt holds 28 timestamped lines  [28]
PASS  episode.json holds 28 cues  [28]
PASS  cue timestamps + text match script.txt verbatim  [28/28 identical]
PASS  cues are contiguous and monotonic
PASS  24 scenes = 23 body + 1 outro  [23+1]
PASS  exactly one separate outro segment  [S24]
PASS  scenes tile the timeline with no gap or overlap  [ends at 3823]
PASS  outro starts at frame 3733  [3733]
PASS  every cue is claimed by a scene  [28/28]
PASS  all referenced SFX files exist  [15 distinct cues / 87 placements]
PASS  SFX offsets stay inside their scene  [87 placements in range]
PASS  all music movements exist  [5 files]
PASS  music movements tile 0 -> 3823 with no gap  [0-1442 1442-2264 2264-2861 2861-3399 3399-3823]
PASS  narration stem exists  [audio/narration.wav]
PASS  music ducking is -9 dB  [-9 dB]
PASS  local woff2 fonts present  [8 files]
PASS  narration stem length matches 3823 frames  [127.43 s vs 127.43 s]
PASS  narration peak below -0.2 dBFS (no clipping)  [-1.00 dBFS peak]
PASS  narration timing has 28 measured lines  [28]
PASS  every line starts on its cue frame  [max drift <= 1 frame]
PASS  no line runs more than 0.35 s into the next cue  [worst cue 9: 7 frames]
PASS  delivery rate is plausible on every line (1.4-4.8 words/s)  [2.27-4.46 w/s]
PASS  music is ducked only under speech  [87.3% of the runtime]
PASS  each music movement is at least as long as its frame window  [mvt1_curiosity 48.1s mvt2_relief 27.4s mvt3_doubt 19.9s mvt4_clarity 18.0s mvt5_outro 14.2s]

30/30 checks passed
```

### 2.3 Render

```
$ LD_LIBRARY_PATH=/tmp/al/lib FONTCONFIG_PATH=/tmp/al/fonts \
  npx remotion render src/index.ts AwakenEpisode out/preview.mp4 \
  --codec=h264 --crf=28 --scale=0.5 --concurrency=2 \
  --browser-executable=/tmp/chromium --chrome-mode=chrome-for-testing
...
Rendered 3823/3823
Encoded  3823/3823
+                    out/preview.mp4 8.8 MB
```

Wall clock: ~6 minutes on 2 vCPU / 3 GB (this sandbox, software-rendered Chromium).
A full-resolution 1080p render is the same frame count, roughly 4x the pixel work.

### 2.4 The rendered file, inspected

```
$ node scripts/check-preview.mjs
container
  duration      127.445 s (expected 127.433 s)
  size          8.39 MB
  video         h264 960x540 @ 30/1 fps, 3823 frames
  audio         aac 48000 Hz 2 ch
PASS  frame count is 3823  [3823]
PASS  duration matches 127.43 s  [127.445 s]
PASS  audio stream present  [aac]

sync
  narration-vs-muxed correlation peak at 0 ms (r=0.984)
PASS  audio offset within +-40 ms of the picture  [0 ms]

PREVIEW OK
```

The A/V check is not a guess: the script decodes the **muxed soundtrack out of the MP4**,
computes a 10 ms RMS envelope, and cross-correlates it with the narration stem across
±0.6 s. The peak lands at lag 0 with r = 0.984, i.e. the voice in the encoded file sits
on the frame the cue grid says it should.

---

## 3. Narration build

Three TTS takes were generated from the script text (cues 0-9, 10-18, 19-27), then cut
into 28 lines and laid on the cue timestamps.

```
  chunk_0.mp3: 48.05s take -> 10 lines (scripted 48.06s)
  chunk_1.mp3: 36.37s take ->  9 lines (scripted 38.16s)
  chunk_2.mp3: 37.27s take ->  9 lines (scripted 38.19s)

cue  start   window  spoken  tempo  overlap
  0    0.00    4.14    4.10  1.217  0.00
  1    4.14    2.50    1.12  1.000  0.00
  2    6.64    5.00    4.12  1.000  0.00
  3   11.64    6.42    5.33  1.000  0.00
  4   18.06    5.50    4.73  1.000  0.00
  5   23.56    2.70    1.91  1.000  0.00
  6   26.26    5.04    4.54  1.000  0.00
  7   31.30    6.60    5.56  1.000  0.00
  8   37.90    4.60    4.53  1.000  0.00
  9   42.50    5.56    5.80  1.300  0.24
 10   48.06    5.42    5.38  1.207  0.00
 11   53.48    3.42    2.16  1.000  0.00
 12   56.90    2.58    1.80  1.000  0.00
 13   59.48    5.64    5.57  1.000  0.00
 14   65.12    4.86    4.55  1.000  0.00
 15   69.98    5.50    4.07  1.000  0.00
 16   75.48    4.66    3.72  1.000  0.00
 17   80.14    3.64    3.49  1.000  0.00
 18   83.78    2.44    1.87  1.000  0.00
 19   86.22    4.52    3.50  1.000  0.00
 20   90.74    4.62    3.80  1.000  0.00
 21   95.36    4.16    3.64  1.000  0.00
 22   99.52    5.42    4.40  1.000  0.00
 23  104.94    2.20    2.15  1.227  0.00
 24  107.14    6.16    6.12  1.038  0.00
 25  113.30    2.38    2.09  1.000  0.00
 26  115.68    4.00    3.17  1.000  0.00
 27  119.68    4.73    4.22  1.000  0.00
```

Reading the table: `window` is the space the script leaves before the next cue, `spoken`
is what the finished line measures after fitting, `tempo` is the time-stretch applied
(pitch-preserving `atempo`), `overlap` is how far the line runs into the following cue.

**Five lines were time-fitted** (0, 9, 10, 23, 24) because the TTS read them slower than
the script's own pacing. Four are between 1.04x and 1.23x — inaudible as an artefact at
this ratio. Line 9 hits the 1.30x ceiling and still runs 0.24 s long; it is the one
deliberate compromise in the mix, and it lands on the *natural* delivery rate the script
implies (18 words in 5.56 s ≈ 3.2 words/s, which is what the script assumed).

`dist/audio-check.png` plots the resulting stem: 28 speech blocks with every cue marker,
and the music bed under the actual ducking curve, so both the placement and the −9 dB
sidechain can be seen rather than asserted.

---

## 4. Visual system

24 scenes over 23 authored environments, all built from SVG primitives and a shared
silhouette-head puppet rig (`src/characters/AwakenCharacter.tsx`): two hips-offset legs,
two shoulder-offset arms, correlated head/neck, 9 wardrobes, 9 expressions, 12 poses,
rim-light colour keyed to the environment.

| Act | Scenes | Environments | Widgets |
|---|---|---|---|
| 1 Setup | S01-S04 | cafe_day, bedroom_night, mind_blueprint | chat bubbles, phone, certainty meter, msg-vs-chat |
| 2 Doubt | S05-S09 | mind_blueprint, bedroom_night | chemistry equation, clue search, replay list, detail orbit, silence→message |
| 3 Pattern | S10-S13 | bedroom_night, mind_blueprint, classroom, cafe_day | relief burst, swing wave, chalk board, status chips |
| 4 Clarity | S14-S19 | mind_blueprint, classroom | room-for-imagination, do-vs-say, two-check card, gears |
| 5 Resolve | S20-S23 | sunset_porch, cafe_day | attraction bloom, ask/listen, comment card |
| Outro | S24 | blurred cafe (3 s card) | — |

Camera presets (push-in, pull-back reveal, handheld drift, tilt) plus four transition
types (whip pan, rack focus blur, dip, slide) run between scenes; the HUD layer is drawn
in screen space so zooms never distort badges.

Frames were reviewed as contact sheets (`dist/sheet-a … sheet-f`, `dist/sheet-preview`,
`dist/sheet-outro`). Defects found in that review and **fixed** rather than shipped:

1. **Legs and arms collapsed into one silhouette** when the pose was symmetric — limbs now
   hang from their own side of the body, and a neck rect connects head to collar.
2. **Classroom "EST. 1987" poster sat exactly behind a character's head**, reading as a
   card the head was mounted on — poster moved to the wall strip left of the board.
3. **Replay-list icons overprinted the first word** ("↻REPLAY") — text origin moved clear.
4. **Clue-search magnifier landed on top of the "who they liked" chip** — offset outward.
5. **Comment-card question was unreadable over the café sign** — now on a 0.93-alpha scrim.
6. **A static green ring floated in the bedroom on the first frames of S09** — the ripple
   is now opacity-gated to its expansion.

---

## 5. Final master render

Approved and executed with the delivery command:

```
$ LD_LIBRARY_PATH=/tmp/al/lib FONTCONFIG_PATH=/tmp/al/fonts \
  npx remotion render src/index.ts AwakenEpisode deliverables/final-video.mp4 \
  --codec=h264 --crf=18 --concurrency=2 --pixel-format=yuv420p \
  --x264-preset=slow --audio-codec=aac --audio-bitrate=320k \
  --browser-executable=/tmp/chromium --chrome-mode=chrome-for-testing
Rendered 3823/3823
Encoded  3823/3823
+                    deliverables/final-video.mp4 48.6 MB          # exit 0, ~19 min wall clock
```

Inspected afterwards with the same checker used on the preview:

```
$ node scripts/check-preview.mjs deliverables/final-video.mp4
container
  duration      127.445 s (expected 127.433 s)
  size          46.38 MB
  video         h264 1920x1080 @ 30/1 fps, 3823 frames
  audio         aac 48000 Hz 2 ch
PASS  frame count is 3823  [3823]
PASS  duration matches 127.43 s  [127.445 s]
PASS  audio stream present  [aac]

sync
  narration-vs-muxed correlation peak at 0 ms (r=0.984)
PASS  audio offset within +-40 ms of the picture  [0 ms]
PREVIEW OK

ffprobe:
  video  h264 1920x1080 yuvj420p 30/1 2 726 380 bps
  audio  aac  48000 Hz 2 ch 317 375 bps
  format 127.445 s, 3 052 482 bps, 48 627 957 bytes
```

Bit rate 2.73 Mbps video / 317 kbps audio; the file is 46.4 MiB for 2:07 of 1080p.
Remotion writes full-range `yuvj420p` for the h264 encoder — correct for web playback;
if a broadcast deliverable ever needs limited-range `yuv420p`, re-encode with
`-vf scale=out_range=tv` instead of re-rendering.

## 6. What is *not* done

* **No reference video was inspected**, because none exists on this machine. The visual
  direction follows the STYLE-PACK text rules quoted in the project, not a video file.
* Two minor cosmetic items are known and left as-is in the delivered master: the pink
  curtain in `bedroom_night` is a heavy shape at 1080p, and the "silence" day cards in S09
  use deliberately small 22 px labels. Both are one-line changes if you want them softened.
* The master is `yuvj420p` (full range). It plays correctly everywhere; only a broadcast
  pipeline that insists on limited-range `yuv420p` would need a re-encode.

## 7. Reproduce everything

```bash
npm install
node scripts/compose-episode.mjs
node scripts/build-narration.mjs
npx tsc --noEmit
node scripts/validate-episode.mjs
npm run preview
node scripts/check-preview.mjs
node scripts/package-project.mjs

# delivery master (see README.md §2 for the full flag list)
npx remotion render src/index.ts AwakenEpisode deliverables/final-video.mp4 \
  --codec=h264 --crf=18 --concurrency=2 --pixel-format=yuv420p \
  --x264-preset=slow --audio-codec=aac --audio-bitrate=320k
```
