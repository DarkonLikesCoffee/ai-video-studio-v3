# TrigonometryCircle production plan

- 2D SVG motion graphics, 1920×1080, 30 fps.
- Palette: ink #101A2B, paper #F6F2E9, cyan #48C7D4, coral #FF796C, gold #F2C66D.
- Teaching angle: θ = 36° = π/5 rad. Trig values are computed at runtime.
- Duration: 1,440 frames / 48 seconds, derived from SCENES.

## Timing table
Hook 5s; radians 4s; triangle 4s; sine 5s; cosine 5s; tangent 6s; quadrants 5s; Pythagorean identity 5s; special angles 5s; recap 4s.

## Architecture
One SCENES table owns scene ids, offsets, durations and Root composition duration. Lesson titles are Remotion Sequences. The circle, axes, radius and point persist in one SVG diagram across all scenes. SVG defs are unique and hoisted into the persistent SVGs. Motion uses spring/eased interpolation except continuous circular sweeps.

Audio remains untouched; leave clear pacing for future voiceover.

## Review process
Each round is a code-changing commit. Run npx tsc --noEmit before commits and in CI. Render frame 0, all scene boundaries/midpoints/ends and one-second samples; inspect the contact sheet and document the three most important remaining issues.
