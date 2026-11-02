# Pakka Stories — Episode 2 Art Direction (memorised)

Single source of truth for Episode 2 visuals. **Every new asset must follow these rules.**
Episode 1 assets are *not* touched — they live in `public/images/` (see bottom).

---

## 1. Folder rules

| Folder | What goes in it | Path |
|---|---|---|
| `public/Characters/` | Character reference sheets, `char_<name>.png` | `/Characters/char_nila.png` |
| `public/Locations/` | Location backgrounds, `bg_<setting>_<name>.png` | `/Locations/bg_setting_a_nila_hut_dusk.png` |
| `public/Episode_2/` | Episode 2 scene renders (`sceneNN.jpg`), timing/audio, episode notes | `/Episode_2/scene01.jpg` |
| `public/images/` | **Episode 1 only** — do not add Episode 2 files here | existing paths, referenced by `src/StoryComponents.tsx` |

`src/StoryComponents.tsx` still points at `images/…` for Episode 1. Episode 2 TSX must use the new paths.

---

## 2. Global look — LOCKED TO THE REFERENCE PLATES (do not drift)

**The scene renders must look like they were painted by the same hand as the reference plates in
`public/Characters/` and `public/Locations/`.** Those plates are the style bible. This is the
corrected style; earlier cartoony scene attempts were wrong and were deleted.

**The look:** detailed semi-realistic 2D anime painting. Soft, natural, closely observed rendering
with restrained saturation, realistic skin with real texture (pores, sun weathering, fine wrinkles),
muted earthy palette (terracotta, ochre, indigo, olive, brass), soft realistic light falloff, gentle
grain, and a subtle painterly finish over clean fine line work. It reads as an animated feature
background/character painting, not a children's cartoon.

**Hard bans on style words** — never write these into a scene prompt:
`cartoon`, `Ghibli`, `gouache`, `chibi`, `cel-shaded`, `thick outlines`, `flat shading`,
`bright saturated colours`, `glossy plastic`.

**Instead always specify:** "render in exactly the same style and rendering quality as the attached
reference image — semi-realistic 2D anime painting, realistic skin texture, soft natural lighting,
muted earthy colour palette, fine clean line work, subtle painterly grain, cinematic depth".
- Character style must match `Characters/char_*.png` rendering.
- Backgrounds/interiors must match `Locations/bg_setting_*.png` rendering.
- Always attach the relevant character/location plate as an **image reference** on every scene call;
  text alone drifts badly.
- All frames **16:9 widescreen**, delivered 1672×941, stored as PNG8 (characters/locations) or quality-88 JPEG (scenes/contact sheets) to keep the repo light.
- Characters sit on a **neutral warm-grey studio ground** with a decorative nameplate on the left panel.
- Two-panel character sheets: **full-body standing pose left, close-up bust right**.
- Locations are **empty plates** — no people — so characters can be composited in Remotion.

## 3. Universal negative prompt — characters

> 3D CGI render, Disney Pixar cartoon, western cartoon style, flat 2D flash animation, chibi, western facial features, pale white skin, plastic shiny skin, extra limbs, deformed hands, blurry face, distorted eyes, modern western clothing, bright neon colors, background scene, outdoor landscape, buildings, furniture.

*(for the village-children batch also add: modern western branded clothing, sneakers)*

## 4. Universal negative prompt — locations

> people, characters, human figures, 3D CGI render, Disney Pixar cartoon, western modern architecture, modern cars, electric poles with transformers, concrete modern buildings, plastic furniture, flat 2D flash animation, oversaturated neon colors, blurry details, distorted perspective.

---

## 5. Cast — canon details (memorised)

Children of Thenkarai village. Ages are fixed; keep skin tone, hair and costume identical across every episode.

| Character | Age | Look | Signature costume | File |
|---|---|---|---|---|
| **Nila** | 5 | Warm dusky-brown, bright brown eyes, radiant toothy smile, small black pottu | Marigold-yellow puff-sleeve cotton blouse + crimson-red pleated pavadai, thin gold hem; twin braids with faded red ribbons; brown two-strap sandals | `Characters/char_nila.png` |
| **Maha** | 5 | Warm dusky-brown, sweet round face, kind brown eyes; Pechi Paati's granddaughter, Nila's true friend | Faded **sky-blue** cotton blouse + **coral-pink** pleated cotton pavadai, narrow cream geometric border; loose braids with sky-blue ribbons; silver studs, black glass bangles, **barefoot** (poor, humble) | `Characters/char_maha.png` |
| **Saran** | 7 | Sun-kissed dusky-tan, mischievous grin, vibuthi mark; Maha's brother | Faded beige half-sleeve collared shirt (top button open) + navy knee-length half-pants; tousled jet-black fringe; **barefoot** | `Characters/char_saran.png` |
| **Kamala** | 6 | Warm dusky dark, confident playful smile; wealthy family | Deep-red silk blouse with gold zari + **emerald-green** silk pavadai with broad gold border; braids with orange kanakambaram + red ribbons; gold thodu studs, brown sandals | `Characters/char_kamala.png` |
| **Vimala** | 6 | Warm dusky-tan, cheeky twinkle; prosperous family | **Marigold-yellow** silk blouse + **royal-purple** zari pavadai; tight braids with colourful ribbons; thin gold bangles + chain + ear studs, brown sandals | `Characters/char_vimala.png` |
| **Rani** | 6 | Warm dusky, gentle innocent eyes, modest smile, red pottu; affluent family | **Royal-blue** silk blouse + **magenta-pink** zari pavadai; single thick braid garlanded with jasmine (malli poo); gold jimikki bell earrings, glass bangles, rustic sandals | `Characters/char_rani.png` |

Adults:

| Character | Age | Look | Signature costume |
|---|---|---|---|
| **Sivagami** (mother) | ~38 | Dusky-tan, laugh lines, serene smile, maroon bindi | Bottle-green handloom cotton saree, dark maroon border, gold thali chain, red glass bangles; low side-bun with faint grey streaks |
| **Shanmugam** (father, farmer) | ~44 | Weathered dusky-brown, forehead furrows, salt-and-pepper hair + thick mustache + goatee | Off-white half-sleeve cotton shirt with chest pocket, white veshti with thin maroon border; brown leather chappals |
| **Pechi Paati** (grandmother) | ~72 | Deeply wrinkled sun-weathered dusky skin, toothless gentle smile, wispy silver bun | Unbleached off-white coarse cotton saree, faded grey border, worn without blouse; tiny gold thodu; **barefoot** |
| **Kamala's mother** (matron) | ~35 | Fair light-tan, piercing eyes, haughty pursed lips, big maroon bindi | Deep maroon/burgundy Kanchipuram silk saree with gold zari pallu; jasmine-ringed ornate bun; heavy gold jhumkas, temple-pendant chain, stacked bangles |
| **Kamala's father** (landlord) | ~45 | Broad build, medium dusky-tan, commanding, thick black mustache | Cream/ivory fine cotton shirt, white silk-cotton veshti with gold zari, white-and-gold angavastram on left shoulder, gold signet ring, crossed-strap sandals |
| **Neighbour mother** | ~32 | Rounded pleasant face, sparkling eyes, warm bindi | Indigo/teal block-print floral cotton saree with magenta-pink geometric border, teal blouse; kanakambaram flowers in the bun |

*(Note: the first batch of adult sheets let the model invent nameplates — Sivagami, Shanmugam and neighbour-mother sheets carry wrong/generic plates. Names are correct in the files themselves; re-render the plates if they will appear on screen.)*

## 6. Locations — canon settings

| Setting | Mood / time | Key elements | File |
|---|---|---|---|
| **A. Nila's mud hut** | Twilight / dusk | Terracotta mud walls with white kolam borders, palm-thatch roof, lantern in arched niche, clay stove + pots, kattil, trunk, terracotta mutti, brass kudam, rice-flour kolam on damp earth, indigo-violet-orange sky | `Locations/bg_setting_a_nila_hut_dusk.png` |
| **B. Collapsed mud hut** | Monsoon storm, night | Hut caved into wet mud and splintered bamboo, soaked thatch, tilted door, broken kattil, shattered pots, dented brass pot in muddy puddle, rain sheets, moonbreak | `Locations/bg_setting_b_collapsed_hut_storm.png` |
| **C. Kamala's Periya Veedu** | Sunny morning | Chettinad mansion, Mangalore tiled roof, lime-washed white walls + red-oxide base, carved teak pillars, brass-riveted double doors, Thulasi Maadam, brass kudam, black roadster bicycle, azure sky | `Locations/bg_setting_c_wealthy_house_courtyard.png` |
| **D. Street-lamp lane** | Deep night | Conical lamp on wooden pole, golden cone with moths, wet puddles mirroring light, mud/stone compound walls, red-tiled homes, leaning bicycle + clay urn, overarching banyan/neem, starry indigo sky | `Locations/bg_setting_d_street_lamp_night.png` |
| **E. Pechi Paati's hut interior** | Night, lantern | Bamboo rafters, palm thatch, red-oxide lower walls, cow-dung floor, hanging brass hurricane lantern over rope cot, stone aattukal, saree shelf, brass andaa, palm baskets, moonlight through thatch gap | `Locations/bg_setting_e_paati_hut_interior.png` |
| **F. Neighbour's tiled house** | Post-rain morning | Faded seafoam-green house, white window borders, dark shutters, wet terracotta tiles, mirror-like puddles, kolam mandala on damp stone, stone thinnai with pillars, clouds parting to golden sun | `Locations/bg_setting_f_neighbour_house_postrain.png` |

## 6b. Scene prompt template (use verbatim)

> Render in exactly the same style, finish and rendering quality as the attached reference image(s):
> **semi-realistic 2D anime painting**, realistic skin and fabric texture, soft natural lighting, muted
> earthy colour palette, fine clean line work, subtle painterly grain, cinematic depth of field.
> Do not make it cartoonish, do not simplify shapes, do not brighten the palette.
> [SHOT TYPE + CHARACTERS pasted from section 5 + SETTING + PROPS + MOOD]
> 1990s Tamil Nadu, no modern objects, no text, no watermark, full-bleed edge-to-edge 16:9,
> not photoreal, not 3D.

Rules:
- Scene renders are **JPEG, `Episode_2/sceneNN.jpg`**, 16:9.
- Always attach: the character sheet(s) for anyone in frame + the matching location plate.
- Character continuity outranks composition: if a face/outfit would not match the sheet, restage the shot.

## 7. Contact sheets

- `Characters/character_sheets_contact_sheet.jpg` — the 7 adult/village sheets
- `Characters/character_girls_contact_sheet.jpg` — Nila, Kamala, Vimala, Rani
- `Characters/character_siblings_contact_sheet.jpg` — Maha, Saran
- `Locations/bg_settings_contact_sheet.jpg` — settings A–F

## 8. Story logic reminders

- Maha (humble, barefoot, cotton) is visually the opposite of Kamala/Vimala/Rani (silk, gold, sandals) — keep that contrast in every frame.
- Pechi Paati's hut is Setting E; Nila's hut is Setting A; the storm destroys A → Setting B.
- Kamala's family owns Setting C; the village lane is Setting D; the neighbour's house is Setting F.
