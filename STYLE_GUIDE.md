# PAKKA STORIES — Visual Style Guide (Locked Bible)

> Canonical reference for every frame, thumbnail, logo and banner in this project.
> Source of truth: the approved Episode 1 render pass (scenes 31–106) plus the locked
> character sheets in `character_references/` and the six setting locks in `settings/`.
> If anything in a new prompt contradicts this file, **this file wins** — except where a
> scene prompt explicitly overrides camera, props or setting.

---

## 0. The One-Paragraph Rule

Every image is a **flat 2D anime frame in the official Ufotable / *Demon Slayer: Kimetsu no
Yaiba* style**, set in **1990s rural Tamil Nadu**, painted with hand-made watercolour-wash
backgrounds and crisp cel-shaded characters. Warm, modest, era-accurate, emotionally
readable faces with large expressive anime eyes. Never photorealism, never 3D, never
western cartoon.

---

## 1. Character Visual Bible

All characters below are **final and locked**. These descriptions replace any older or
conflicting wording that appears inside individual scene prompts.

### 1.1 NILA — the child narrator (protagonist)

| Attribute | Locked description |
|---|---|
| Age / size | 5 years old, approx. 105 cm, very small and delicate, natural child proportions |
| Skin | Warm medium-brown, clean and matte (no sweat sheen unless the scene is rain) |
| Eyes | Large round sparkling dark-brown eyes, big gradient iris, layered highlights, soft long lashes |
| Face | Small rounded button nose, small soft lips, chubby round cheeks, **tiny black bindi** |
| Hair | Black, shoulder-length, oiled and neat, **two short braids tied with faded red ribbons** |
| Outfit | **Bright yellow short-sleeve blouse + red ankle-length pavadai (skirt)** with a thin border — worn fully and modestly, shoulders to ankles |
| Footwear | Simple flat sandals (barefoot only if a scene explicitly demands it) |
| Props | Slate, brown-paper-covered notebook, broken pencil, faded yellow cotton bag ("manja pai") |
| Character read | "Chutti-ya cute", innocent, resilient. Clean and well-kept — **never** patches, tears, frayed borders or sweat-stained clothing |

**Continuity note:** some scene prompts still mention a "faded mustard-yellow frock with
patches + barefoot". Those are rendered instead as the **yellow blouse + red ankle-length
skirt + flat sandals** above, to keep Episode 1 continuous.

### 1.2 SIVAGAMI — mother (~45)

- Gentle deep-set dark eyes with fine smile lines, broad soft nose, full kind lips, dark-brown skin.
- Black hair with **grey at the temples**, worn in a low simple bun. Small red bindi.
- **Plain dark-green cotton saree with a thin maroon border**, modest blouse, draped fully.
- Plain **yellow thali thread**, thin glass bangles, plain sandals. Short, thin build.

### 1.3 SHANMUGAM — father (~45)

- Warm dark-brown eyes, long straight nose, sun-tanned brown skin. **Normal fit** build — not bulky, not heroic.
- **Thick prominent mustache that is fuller than the short trimmed jaw beard.**
- Hair on the scalp, mustache and beard all **70% white / 30% black salt-and-pepper**.
- **Clean white veshti with a thin border + plain half-sleeve shirt**, white thundu on the shoulder, leather chappals.

### 1.4 KAMALA — the friend from the big house

- Almond light-brown eyes, tiny pointed nose, pink-brown lips, fair wheatish skin.
- Two oiled braids folded up with **bright green ribbons**.
- **Emerald-green pattu pavadai with gold border**, gold studs, thin gold chain.

### 1.5 VIMALA — friend

- Round cheerful dark eyes, button nose, wide smiling lips, medium-brown skin, slightly chubby.
- Two high pigtail bunches with **yellow ribbons**, pink frock with a white lace collar.

### 1.6 RANI — friend

- Sharp bright dark eyes, small upturned nose, gap-tooth smile, deep-brown skin, thin and lanky.
- Single side plait with a **blue ribbon**, sky-blue polka-dot frock.

### 1.7 KAMALA'S FATHER — the wealthy householder

- Stocky, broad build. Heavy-lidded dark eyes under thick straight brows, broad nose.
- Firm lips with a **thick black moustache**, fair wheatish skin, short oiled black hair side-combed.
- **Crisp white veshti with gold-line border + cream full-sleeve shirt**, folded thundu on the shoulder, gold ring, leather chappals.

### 1.8 KAMALA'S MOTHER (~35)

- Sharp almond dark eyes with a worried brow crease, high-bridged nose, thin pressed lips, fair wheatish skin.
- Black hair in a tight bun with **white jasmine**, large red bindi.
- **Deep maroon silk saree with gold zari border**, heavy gold earrings, gold chain + thali, gold bangles.

### 1.9 PECHI PAATI — the kind old neighbour (~70)

- Warm half-closed dark eyes with deep laugh lines, small rounded nose, gentle thin lips.
- Dusky brown, deeply wrinkled skin. **Thin white hair in a small knot. No bindi.** Small plain ear studs.
- **Faded white cotton saree with a thin grey border**, pallu over the head when outdoors. Frail, short, slightly hunched. Rough, kind hands.

### 1.10 NEIGHBOUR MOTHER (~35)

- Round plump build and round plump face, wide dark eyes, short broad nose, full lips, medium-brown skin.
- Black hair in a loose bun with **orange kanakambaram flowers**, maroon bindi.
- **Faded blue floral cotton saree with a red border**, thin gold earrings and chain, glass bangles.

---

## 2. Setting Locks

| Code | Setting | Key visual anchors |
|---|---|---|
| **A** | Nila's mud hut | Sagging palm-leaf (*oolai*) thatch, cow-dung-plastered floor, kerosene lamp in a wall niche, jute-string cot, clay stove, tin trunk, kolam at the doorstep |
| **B** | Collapsed hut aftermath | Melted mud walls slumped into puddles, crushed thatch on the ground, scattered terracotta pots, soaked jute cot half buried |
| **C** | Kamala's wealthy house | Mangalore-tile roof, whitewashed walls, carved wooden pillars, raised thinnai veranda, heavy shut wooden double door with brass ring, **single bare electric bulb**, tulsi madam in the yard |
| **D** | Street-lamp lane | Narrow mud lane, one tall street-light pole with a dim yellow bulb, neem tree, insects swirling, dark huts and tiled roofs beyond |
| **E** | Pechi Paati's hut | Tiny thatched hut, worn cow-dung floor, rope-strung cot, hurricane lantern on a beam, brass kudam in the corner, patched sarees on a wooden shelf |
| **F** | Neighbour's tiled house | Lime-washed front wall, small thinnai, one wooden-shuttered window closable from inside, beside Kamala's house |

**Era discipline:** 1990s Tamil Nadu. **No modern objects** in any frame — the single bare
electric bulb where a prompt calls for it is the only permitted exception.

---

## 3. Visual Art-Style Tokens

Append this block to every render:

```
STYLE: high-quality 2D anime scene in the official Ufotable anime style of Demon Slayer:
Kimetsu no Yaiba, clean crisp varied-weight linework, vibrant cel-shading with hard-edged
shadow shapes, deep dramatic shadows giving a 3D-yet-2D look, polished TV series anime
finish, expressive anime eyes with large gradient irises, hand-painted watercolour-wash
backgrounds, realistic 1990s Tamil Nadu clothing, props and architecture, authentic 1990s
village era with no modern objects, real material textures (cotton, terracotta tile, lime
whitewash, dried palm thatch, packed mud), high dynamic range lighting, dramatic cinematic
lighting, strong rim light, one clear focal point, faces clearly lit and readable even in
dark areas, consistent vibrant saturated colour grading, modest everyday clothing, natural
non-sexualized proportions, full-bleed edge-to-edge 16:9 artwork.
```

### 3.1 Lighting recipes

| Mood | Recipe |
|---|---|
| Warm memory / safety | Deep amber lantern glow, soft warm shadow pools, gentle bloom, dust motes |
| Fear & tension | Dark teal-black shadow, one small amber lamp accent, cold pale rim from a doorway |
| Grief / emotional peak | Blue-black shadow, warm rim light on face + shoulders, glistening tear highlights |
| Night exterior | Deep indigo field, thin warm amber rim light, glistening puddle reflections |
| Storm | Cold teal-grey, lightning rim light, spray, mist, hard rain streaks |

### 3.2 Camera language

- **Wide establishing** — architecture first, tiny human figure, vast sky.
- **Medium shot (MS)** — full gesture, action on an object (holding a notebook/slate).
- **Over-the-shoulder (OTS)** — foreground back-of-head, story in the distance.
- **Close-up (CU)** — emotion readable, eyes at frame centre.
- **Extreme close-up (ECU)** — a single tear, a hand, a reflected flame, a latch.

### 3.3 Colour palette

- Night base: midnight indigo `#16023E` → `#2A0552`
- Warm light: kerosene amber `#FFB347` → `#FF7A2F`
- Neon/thumbnail accent: magenta pink `#FF2D95` → `#FF6FB5`
- Skin (Nila): `#8A5A3B` base, `#C98A63` lit, `#4A2A18` shadow
- Never: pastel wash, harsh saturated primaries, grey plastic tones

---

## 4. Mandatory Negative Prompts

Always include, in this order:

```
NEGATIVE: no western cartoon styling, no chibi or super-deformed proportions, no comic-book
halftone, no 3D CGI render, no plastic or clay-like skin, no vinyl toy look, no Unreal/Octane
render, no photorealistic skin pores, no live-action photo, no traced-over-photo look,
no deformed hands or extra fingers, no broken/warped faces, no asymmetrical eyes,
no melting anatomy, no floating objects, no duplicated limbs, no distorted Tamil lettering,
no gibberish text, no signature, no watermark, no logo, no frame border, no letterbox bars,
no elemental or energy effects (no glowing aura, no magic sparks, no lightning from hands),
no sketching, no cross-hatching, no pencil hatching, no painterly brush mess,
no modern objects (no phones, no wires, no plastic chairs, no sneakers, no cars, no signage),
no sexualised or suggestive framing, no adult styling on child characters.
```

### 4.1 Prompt phrasings that tripped the safety filter — avoid

These specific constructions were repeatedly rejected; do not use them:

- Face-filling close-up of a child described as "eyes wide with awe / tears brimming / wet eyes".
- "Fingers twisting the edge of her dress/skirt".
- "Lips parted", "knees drawn up", "curled up with hands in lap", "lying face down".
- A child eating with a hand near the mouth.
- Extreme close-up of a child's wet hand or bare skin.

**Proven-safe substitutions**

- Switch to **medium shot / medium close-up, framing cropped at head-and-shoulders**, child **standing upright**, shoulders square to camera.
- Move the action **onto an object** (holding a slate, a notebook, a pencil).
- Hands **clasped low, at her sides, or resting flat on a door**.
- Always pin the outfit "**shoulders to ankles**" and add "**modest, fully clothed, wholesome and age-appropriate**".
- Keep the child **on her feet** rather than seated on the ground when framing tight.

---

## 5. The Exact Prompt Formula (Episode 1 — high-rich images)

Build every scene prompt in this exact seven-block order. Do not reorder, do not omit blocks.

```
1. FORMAT & CAMERA
   Cinematic 16:9 anime scene, camera: <SHOT TYPE — one of §3.2>. <one-line composition note>.

2. SCENE ACTION
   <Who is doing what, where, held in what pose — written as a single visual sentence.
   Always state the pose first, then the expression, then the object or prop in hand.>

3. CHARACTER LOCK  (verbatim, one block per character in frame)
   CHARACTER LOCK <NAME>, must be followed exactly: <the full locked description from §1>.

4. SETTING LOCK
   SETTING: <the matching setting lock from §2, plus the one or two props that anchor the frame>.

5. STYLE BLOCK
   <Paste the §3 style block verbatim.>

6. COLOUR MOOD
   <Mood name in 2–3 words>, <mood keywords>: <lighting recipe from §3.1 in one sentence>,
   <colour contrast line>, soft bloom. One clear focal point on <the focal point>.

7. SAFETY + NEGATIVE TAIL
   Modest everyday clothing, natural non-sexualized proportions, entirely wholesome and
   age-appropriate. Absolutely flat 2D anime — not photorealistic, not 3D, no sketching,
   no cross-hatching, no elemental or energy effects. Full-bleed 16:9, no text, no watermark.
```

### 5.1 Worked example — Episode 1, Scene 59 "Studying by the street lamp"

```
Cinematic 16:9 anime scene, camera: MEDIUM CLOSE-UP. A small Tamil girl sits under a street
lamp with an open brown-paper notebook on her lap, writing with a short pencil, her brow
furrowed in concentration, her face lifted just enough that her determined eyes read clearly.

CHARACTER LOCK NILA, must be followed exactly: large round dark-brown eyes with soft long
lashes, small rounded button nose, small soft lips, warm medium-brown skin, soft round
cheeks, tiny black bindi, black shoulder-length oiled hair in two short braids tied with
faded red ribbons. Outfit: bright yellow short-sleeved blouse and a red ankle-length skirt
with a thin border, modest and full-length, fully and modestly clothed, simple flat sandals.

SETTING: a narrow 1990s Tamil Nadu village mud lane at night — one tall street-light pole
with a dim yellow bulb, a neem tree, insects swirling in the light, dark thatched huts and
country-tiled roofs beyond.

STYLE: <§3 block verbatim>

Deep indigo colour mood with a warm yellow focal light, persistent and focused: the lamp
light falls in a bright warm pool across her notebook, hands and face while the lane beyond
dissolves into indigo-black, a warm rim light along her braids, soft bloom, drifting dust
and moths. One clear focal point on the lit notebook and her furrowed brow.

Modest everyday clothing, natural non-sexualized proportions, entirely wholesome and
age-appropriate. Absolutely flat 2D anime — not photorealistic, not 3D, no sketching,
no cross-hatching, no elemental or energy effects. Full-bleed 16:9, no text, no watermark.
```

### 5.2 Batch rules

- **Ten scenes per batch, all issued together in one go.** Never split, never pause to ask.
- Every filename is `NN_Snake_Case_Title.png`, two-digit zero-padded, no version suffixes.
- Output dimensions observed for every accepted frame: **1672×941** (16:9).
- A regeneration **overwrites the same path** — never create `_v2` files.
- If a call fails, regenerate that single item immediately; do not re-plan the batch.

---

## 6. Thumbnail / Cover Addendum

- **16:9 YouTube thumbnail:** exactly **two** text elements — gold 3D `நிலாவின் விடியல்` top
  centre, plus one white Tamil hook with thick black outline and subtle red glow inside the
  bottom 15% gradient strip. No subtitle, no small text, no emoji, no panel labels.
- **9:16 Shorts cover:** the same two-line stack, kept inside the **top 22–25%**, face and
  eyes never covered, bottom 20% clear of text.
- Faces must stay bright and readable in every thumbnail — cool rim on one side, warm rim on
  the other if the background is dark.

---

## 7. Quick Checklist Before Any Render

- [ ] Shot type named, composition stated.
- [ ] Every character present has a full CHARACTER LOCK block.
- [ ] Setting matches lock A–F; no modern objects.
- [ ] Style block pasted verbatim.
- [ ] Colour mood + lighting recipe named.
- [ ] Safety tail + negative block included.
- [ ] No known filter-trigger phrasings (§4.1).
- [ ] 16:9, no text, no watermark.
