# BlackHole — review round 5

Inspected the actual six rendered stills and the 20-second contact sheet from workflow run 45671045061, comparing the blue/white result with reference-03 and the warm close-up with reference-04.

## Three biggest aesthetic problems
1. The oblique shot at frames 480 and 611 still presents the disk as a huge, near-face-on orange pancake filling most of the frame. Reference-04 instead has a thick diagonal accretion stream crossing a compact, readable black-hole shadow.
2. The lensing arc is now correctly above the shadow, but it is a thin, perfect white semicircle. It needs a softer luminous halo and a lower counter-arc to better match the layered lensing in references 01 and 03.
3. The plasma surface is too smooth and synthetic. The disk needs more irregular vertical turbulence and brighter, warmer filament detail; the current thin dark streaks read like scratches rather than hot gas.

## Motion check
The original video had severe non-deterministic spin because all scene rotations used Three.js wall-clock elapsed time. Round 5 replaces those with Remotion frame-time rotations: disk 0.10 rad/s, filaments 0.12 rad/s, dust 0.14 rad/s, with star parallax slower still. The rendered samples now keep the ring plane stable instead of rapidly tumbling. Wide/hero motion remains subtle.

## Technical status
- npm run check: passed on the updated branch (workflow run 45671040198).
- npm ci and six selected PNG renders: passed.
- Contact sheet: rendered and inspected.
- Final MP4 intentionally not rendered for this review round.
