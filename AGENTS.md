# Video production rules

## Plan and composition
1. Before coding, write a per-scene plan stating the style (2D, 3D, or mixed) and whether the user chose it; name the technique and why, and plan story, palette, motion, sound, timing, and transitions.
2. Style follows the request. If the user asks for a flat/2D video, build it with SVG motion graphics. If they ask for 3D, use Three.js via `src/shared/three-scene.tsx`. If they ask for both, combine them (for example SVG graphics or titles over a 3D scene, or a 3D scene inside a flat layout). If they don’t specify, choose by content, and state the choice and why in the plan. Never switch to a different technique than the one requested; if you think the requested style is a poor fit, say so in the plan, then build what was asked. Generated images are optional.
3. Create a new Remotion composition under `src/compositions/<slug>/`, with substantial scene files in `scenes/`. Keep scene files focused. Preserve existing compositions when adding alternatives for comparison.
4. Every scene needs real camera or subject motion, multiple depth layers moving at different speeds, an animated code overlay, and a distinct composition. Use real transitions; avoid hard cuts caused by `Math.floor(frame / N)`.
5. Keep the main subject large and readable. For trains or vehicles, show visible motion through most of the video, at least about a quarter of frame width, and avoid edge-cropping beyond brief moments. Three.js geometry constraints apply only to 3D scenes.
6. Title/caption cards may last at most 2 seconds and must not overlap high-contrast scenery lines. Prefer short captions fading in/out over moving scenery.
7. For 2D/SVG scenes, define a palette of at most 6 colors once; use at least 3 layers moving at different speeds, soft gradients, shading and subtle grain instead of only flat fills, easing/spring and staggered timing on motion, and camera-like pans/zooms on a single “world” group. No static hold longer than about 2 seconds.
8. User references. If the user provides reference images or videos, or names a set in `reference/<name>/`, the plan lists for each reference what to BORROW (palette, composition, lighting, typography, camera movement, pacing, transitions) and what to IGNORE. Take the look, never copy characters, logos, branding, or footage.
9. A reference set lives in `reference/<name>/` with at most 6 frames (JPG or PNG, 1280 px wide max, ideally under 800 KB each) plus a `notes.md` (source, what to take, what to ignore, motion/pacing notes, and one line per frame describing what is actually visible). The existing frames directly in `reference/` are the default 3D set; leave them where they are.

## Review loop
10. Run `npm run check`. Render scene start, middle, end, and additional one-second samples for motion review. Open and inspect actual rendered PNGs/contact sheet before making visual claims.
11. Each round writes `out/review/<CompositionId>/<round>/problems.md` with the three worst aesthetic problems ranked by impact; list technical issues separately. Commit small PNG stills and that round's `problems.md` to `review-log/<CompositionId>/<round>/`. Do not create extra review docs such as `implementation.md`.
12. When a user reference set exists for the video, compare at least two of its frames instead of the default ones, and name concrete gaps against them in `problems.md`, stating which reference files were compared. Otherwise keep the current behavior (3D: default frames in `reference/`; 2D: the style target in the plan; mixed: both).
13. If problem #1 is the technique itself (flat, vector-like, illustrative, or lacking depth) and the user did not specify a style, the next round must change technique. If the user specified a style, fix problem #1 within that style. Each round must change code to address problem #1 or #2, then re-render and inspect the same coverage.
14. Motion check every round in `problems.md`: state the direction the subject faces and the direction it travels across the sampled frames; they must match (vehicles move nose-first). If 3 or more consecutive one-second samples are nearly identical, list insufficient motion as an aesthetic problem. Never hold a static frame for more than about 2 seconds.
15. Complete at least two review/fix rounds. Never say output looks good unless you viewed its rendered frames.

## Rendering and delivery
16. For review renders, push to a `review/**` branch with commit metadata in the message: `composition=<id> frames=<comma-separated-frames> round=<n> final=<true|false>`. The review workflow renders stills/contact sheet and, when final=true, MP4 plus measured elapsed time.
17. Use `npm run still -- <id> <frames>`, `npm run sheet -- <id>`, and finally `npm run render -- <id>`. CI uses `--gl=swangle`.
18. Keep Three.js geometry low-poly and render-efficient in 3D scenes only. Report the measured final MP4 render time, not an estimate.
19. Never commit video files. For videos, extract evenly spaced frames and commit only those. After committing any reference image, read each file back from the repo and confirm its size and that it opens as an image; if it doesn't, re-upload it and don't claim success.

## Branch workflow
20. Work happens on `review/<slug>` branches created from `main`; merge to `main` by PR when approved.
