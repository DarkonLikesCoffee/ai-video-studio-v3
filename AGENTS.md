# Video production rules

## Plan and composition
1. Before coding, write a per-scene plan naming the technique and why; plan story, palette, motion, sound, timing, and transitions.
2. Generated images are optional. Without them, every scenic shot must use Three.js via `src/shared/three-scene.tsx` plus code overlays. SVG is only for text, UI, and small overlays; never use SVG for scenery, characters, or vehicles.
3. Create a new Remotion composition under `src/compositions/<slug>/`, with substantial scene files in `scenes/`. Keep scene files focused. Preserve existing compositions when adding alternatives for comparison.
4. Every scene needs real camera or subject motion, multiple depth layers moving at different speeds, an animated code overlay, and a distinct composition. Use real transitions; avoid hard cuts caused by `Math.floor(frame / N)`.
5. Keep the main subject large and readable. For trains or vehicles, show visible motion through most of the video, at least about a quarter of frame width, and avoid edge-cropping beyond brief moments.
6. Title/caption cards may last at most 2 seconds and must not overlap high-contrast scenery lines. Prefer short captions fading in/out over moving scenery.

## Review loop
7. Run `npm run check`. Render scene start, middle, end, and additional one-second samples for motion review. Open and inspect actual rendered PNGs/contact sheet before making visual claims.
8. Each round writes `out/review/<CompositionId>/<round>/problems.md` with the three worst aesthetic problems ranked by impact; list technical issues separately. Commit small PNG stills and that round's `problems.md` to `review-log/<CompositionId>/<round>/`. Do not create extra review docs such as `implementation.md`.
9. Compare at least two available reference frames. References are stylized low-poly 3D, not photographs. State concrete gaps such as depth, lighting, scale, or camera; never cite missing “photographic texture.”
10. If problem #1 is the technique itself (flat, vector-like, illustrative, or lacking depth), the next round must change technique, not polish details. Each round must change code to address problem #1 or #2 and then re-render and inspect the same coverage.
11. Motion check every round in `problems.md`: state the direction the subject faces and the direction it travels across the sampled frames; they must match (vehicles move nose-first). If 3 or more consecutive one-second samples are nearly identical, list insufficient motion as an aesthetic problem. Never hold a static frame for more than about 2 seconds.
12. Complete at least two review/fix rounds. Never say output looks good unless you viewed its rendered frames.

## Rendering and delivery
13. For review renders, push to a `review/**` branch with commit metadata in the message: `composition=<id> frames=<comma-separated-frames> round=<n> final=<true|false>`. The review workflow renders stills/contact sheet and, when final=true, MP4 plus measured elapsed time.
14. Use `npm run still -- <id> <frames>`, `npm run sheet -- <id>`, and finally `npm run render -- <id>`. CI uses `--gl=swangle`.
15. Keep Three.js geometry low-poly and render-efficient. Report the measured final MP4 render time, not an estimate.

## Branch workflow
16. Work happens on `review/<slug>` branches created from `main`; merge to `main` by PR when approved.
