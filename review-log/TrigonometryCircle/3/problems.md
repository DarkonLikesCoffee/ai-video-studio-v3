# Round 3 — contact-sheet review and final polish

Inspected the round-2 one-second contact sheet (frames 0 through 1410 at 30-frame intervals) plus boundary/midpoint samples. Confirmed remaining problems:
1. Frame 0 had the title hidden because SceneTitle opacity started at zero; the circle/point were visible but the title was not.
2. Sine/cosine graphs were compressed into a shallow band because the graph used a -1..1 vertical range while only 0..36° was plotted.
3. The Pythagorean area tiles were the same size despite different leg lengths; special-angle scene displayed only one angle's values at a time.

Round-3 fixes:
- Title is fully visible at frame 0; point starts at (1,0), opener still lands at 36°.
- Sine/cosine traces now use a zero-to-one graph scale with explicit 0, 1 and 36° labels, and their point starts continuously at the prior 36° position, eases to 0°, then sweeps back to 36°.
- Quadrant sweep begins at 90° after tangent, Pythagorean scene eases back to 36°, special-angle scene shows all three exact/decimal tables and eases between 30°, 45° and 60°.
- Pythagorean squares now use the same linear scale with side lengths proportional to cos(36°), sin(36°), and 1; the displayed areas are calculated from Math.cos/sin.
- Radian scene explicitly labels θ = 36° = π/5 rad and draws the 1-radian reference arc; its unrolled arc length is computed from rθ.
- Camera spring now runs on the global frame, preventing per-scene scale resets.
- Review workflow concurrency group is isolated from the repository CI workflow to prevent cross-workflow cancellation.

Verification pending: round-3 typecheck, selected still renders, contact sheet inspection and final MP4 render.
