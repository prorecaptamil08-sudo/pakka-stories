# Pakka Stories — Character Image Batch

All 7 character reference sheets live in `public/images/` and are served by Remotion via
`staticFile("images/<file>")`. Each sheet is a two-panel turnaround (full-body left,
bust/portrait right) at **1376 × 768 (16:9)**.

| # | Character | File | Role |
|---|-----------|------|------|
| 01 | Nila (5) | `char_nila_ref.png` | Child protagonist |
| 02 | Sivagami (38) | `char_sivagami_ref.png` | Mother — loving, hardworking |
| 03 | Shanmugam (44) | `char_shanmugam_ref.png` | Father — resilient farmer |
| 04 | Kamala's Mother (35) | `char_kamala_mother_ref.png` | Wealthy, proud village matron |
| 05 | Kamala's Father (45) | `char_kamala_father_ref.png` | Wealthy village landlord / elite |
| 06 | Pechi Paati (72) | `char_pechi_paati_ref.png` | Elderly village grandmother |
| 07 | Neighbour Mother (32) | `char_neighbour_mother_ref.png` | Friendly, cheerful village woman |

Contact sheet preview: `public/images/character_reference_sheet_contact.jpg`

## Shared style contract

Art-direction base applied to every sheet: fine clean line art, dimensional cel-shading,
realistic South Indian cotton/silk cloth physics, soft studio lighting, neutral warm-grey
backdrop, 16:9 cinematic framing.

**Universal negative prompt**

> 3D CGI render, Disney Pixar cartoon, western cartoon style, flat 2D flash animation, chibi,
> western facial features, pale white skin, plastic shiny skin, extra limbs, deformed hands,
> blurry face, distorted eyes, modern western clothing, bright neon colors.

## Usage notes

- These are **reference sheets** (labelled panels, three-quarter/neutral poses) — they are the
  character bible for consistency, not drop-in scene sprites.
- Existing scene sprites (`char_young_kathir_*.png`, `char_anjali_*.png`,
  `char_older_kathir.png`) are transparent-background flat-vector cut-outs used directly by
  `src/StoryComponents.tsx`. To animate any of the new characters in a scene, generate a
  matching isolated-costume cut-out keyed off the corresponding reference sheet.
- Palette anchors for downstream consistency checks:
  - Nila — marigold yellow `#F2A81D`, crimson skirt `#B6242C`, gold hem `#D9B45B`
  - Sivagami — bottle green `#2F5D3A`, maroon border `#5E2A2A`
  - Shanmugam — off-white `#F3EEE1`, maroon veshti line `#7A3232`
  - Kamala's Mother — burgundy `#5C1226`, zari gold `#C9A227`
  - Kamala's Father — ivory `#F6F0E2`, zari gold `#C9A227`
  - Pechi Paati — unbleached cotton `#EDE6D6`, faded grey border `#8D8D88`
  - Neighbour Mother — teal indigo `#1F6E77`, magenta border `#B23A7A`
