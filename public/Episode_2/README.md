# Episode 2 — Thenkarai village story

Episode 1 stays where it is (`public/images/` + `src/scenes/…`). **Nothing here touches it.**

## What lives here
- `sceneNN.jpg` — composited Episode 2 scene renders (1672×941, 16:9, quality-88 JPEG)
- `audio/` — episode 2 narration / music beds (create when needed)
- `ART_DIRECTION.md` — memorised master style, negative prompts, full cast + location canon

## Where the building blocks are
- Character reference sheets → `public/Characters/`
- Location backgrounds → `public/Locations/`

## Asset status
| Done | Count |
|---|---|
| Character sheets (6 kids + 6 adults) | 12 |
| Location plates (A–F, empty, character-free) | 6 |
| Episode 2 scene composites | 0 — next step |

## Paths to use in Episode 2 TSX
```tsx
staticFile("Characters/char_nila.png")
staticFile("Locations/bg_setting_a_nila_hut_dusk.png")
staticFile("Episode_2/scene01.jpg")
```

## Reusable layout pattern (from Episode 1)
`src/StoryComponents.tsx` holds the shared layout helpers. Episode 2 scenes should follow the same
pattern — background plate + character PNG layered on top + Remotion text/ken-burns motion — but read
from the new folders.
