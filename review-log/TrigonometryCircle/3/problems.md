# Round 3 — visual review findings and fixes

Inspected the complete one-second contact sheet (frames 0–1410 at 30-frame intervals) and full-size samples.

Verified:
- Frame 0: title, circle, point and coordinate readout are visible.
- Frame 1050: Pythagorean square side lengths are proportional to cos(36°), sin(36°), and 1; displayed area values sum to 1.
- Frame 1230: all three special-angle cards are visible with exact sine/cosine/tangent values.

Remaining issues found:
1. The Diagram received the global frame, not the active Sequence-local frame. This made per-scene animation timing incorrect; frame 720 already showed 90° at the start of the tangent lesson.
2. The radians scene did not actually show the explicit θ = 36° = π/5 rad label or the 1-radian reference arc; the planned patch had not landed in the rendered version.
3. Special-angle cards showed exact tangent values but omitted their decimal approximations; fraction notation elsewhere used inline slashes instead of stacked SVG fractions.

Round 4 fixes these issues. Round-3 renders and typecheck passed, but the above visual/math timing defects mean the previous MP4 is not the final deliverable.
